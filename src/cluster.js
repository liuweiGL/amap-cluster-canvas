import Canvas from './canvas'
import ClusterItem from './clusterItem'
import AmapCoordinate from './amap.coordinate'
import MercatorCoordinate from './mercator.coordinate'
import Event from './event'
import {getOffset} from './utils'

// 开发环境输出日志
const debug = process.env.NODE_ENV === 'development'

// 聚合策略
export const Coordinate = {
  MERCATOR: 'MERCATOR', // 使用 墨卡托 坐标系
  AMAP: 'AMAP', // 使用高德地图容器的相对坐标
}

// 默认的点样式
const defaultStyle = {
  width: 60,
  height: 69,
}
// 聚合默认设置
const defaultOptions = {
  data: null, // 数据集
  coordinate: Coordinate.AMAP, // 聚合策略
  maxZoom: 18, // 最大的聚合级别，大于该级别就不进行相应的聚合
  gridSize: 60, // 聚合计算时，网格的像素大小
  minClusterSize: 2, // 聚合的最小数量，小于该数量个点则不能成为一个聚合
  averageCenter: true, // 是否取所有点的平均值作为聚合点中心
  zoomOnClick: true, // 点击聚合点时，是否展开聚合
  zIndex: 120, // canvas图层的zindex
  visible: true, // 是否显示
  offset: null, // 绘制图形相对于定位点的偏移度
  getPosition(item) {
    // 获取经纬度信息
    const {location} = item
    const {longitude, latitude} = location || {}
    return longitude && latitude ? [longitude, latitude] : null
  },
  render: null, // 绘制函数
  hoverRender: null, // hover状态下的绘制函数
  // 以下参数主要用于事件系统
  clickHandler: null, // click事件
  mouseoutHandler: null, // mouseout事件
  mouseoverHandler: null, // mouseover事件
  mousemoveHandler: null, // mousemove事件
  normalPointStyle: defaultStyle, // 实体点的样式
  clusterPointStyle: defaultStyle, // 聚合点的样式
  hoverNormalPointStyle: defaultStyle, // hover状态下实体点的样式
  hoverClusterPointStyle: defaultStyle, // hover状态下聚合点的样式
}

export default class Cluster {
  constructor(options) {
    this.data = null
    this.points = []
    this.renderData = null
    this.clusterItems = null
    this.options = Object.assign({}, defaultOptions, options)
    // 解除 data 引用
    this.options.data = null
    this.normalOffset = getOffset(this.options.normalPointStyle, options.offset)
    this.clusterOffset = getOffset(
      this.options.clusterPointStyle,
      options.offset
    )
    this.eventEngine = new Event(this)
    this.renderEngine = new Canvas({
      map: this.options.map,
      zIndex: this.options.zIndex,
      visible: this.options.visible,
      render: this.build.bind(this),
    })
    this.coordinateEngine =
      this.options.coordinate === Coordinate.AMAP
        ? new AmapCoordinate(this.options)
        : new MercatorCoordinate(this.options)
    this.setData(options.data, false)
  }
  setData(data, rebuild = true) {
    const {
      options: {getPosition},
    } = this
    this.data = []
    if (data) {
      data.forEach(item => {
        const position = getPosition(item)
        if (position) {
          item.position = position
          this.data.push(item)
        }
      })
    }
    if (rebuild) {
      this.build()
    }
  }
  build() {
    if (debug) {
      console.time('聚合构建时间：')
    }
    this.buildCusterItem()
    this.updatePoints()
    this.render()
    if (debug) {
      console.timeEnd('聚合构建时间：')
      console.log('%c构建聚合模块数量：' + this.points.length, 'color: red')
    }
  }
  buildCusterItem() {
    const options = {
      coordinateEngine: this.coordinateEngine,
      averageCenter: this.options.averageCenter,
    }
    this.clusterItems = []
    this.renderData = this.coordinateEngine.getRenderData(this.data)
    this.renderData.forEach(point => {
      let parent = null
      let distance = -1 // 当前点与聚合中心的距离
      const {
        coordinate: {x: pointX, y: pointY},
      } = point
      this.clusterItems.forEach(clusterItem => {
        if (clusterItem.contains(point)) {
          const {
            coordinate: {x: centerX, y: centerY},
          } = clusterItem
          const currDistance =
            Math.pow(pointX - centerX, 2) + Math.pow(pointY - centerY, 2)
          if (distance < 0 || distance > currDistance) {
            // 取距离最近的一个聚合
            parent = clusterItem
            distance = currDistance
          }
        }
      })
      if (parent) {
        // 该点找到聚合对象
        parent.addPoint(point)
      } else {
        // 以该点为中心创建一个聚合对象
        const clusterItem = new ClusterItem(point, options)
        this.clusterItems.push(clusterItem)
      }
    })
  }
  updatePoints() {
    const {
      clusterItems,
      options: {map, minClusterSize, maxZoom},
    } = this
    if (map.getZoom() >= maxZoom) {
      // 地图放大最大层级，就不存在聚合点了
      this.points = clusterItems.reduce(
        (pre, curr) => pre.concat(curr.points),
        []
      )
    } else {
      // 返回的点数据应该是聚合点+实体点
      let points = []
      clusterItems.forEach(clusterItem => {
        if (clusterItem.getCount() >= minClusterSize) {
          // 聚合点
          points.push(clusterItem)
        } else {
          // 实体点
          points = points.concat(clusterItem.points)
        }
      })
      this.points = points
    }
  }
  renderLater(delay) {
    if (!this.renderTimer) {
      this.renderTimer = setTimeout(this.render.bind(this), delay || 50)
    }
  }
  render() {
    const {
      points,
      options: {render},
      renderEngine: {pixelRatio, clusterCanvasCxt},
    } = this
    if (!this.isFunction(render)) {
      return
    }
    if (this.renderTimer) {
      clearTimeout(this.renderTimer)
      this.renderTimer = null
    }
    if (debug) {
      console.time('绘制时间：')
    }
    // 清理画布
    this.clearCluster()
    // 绘制
    points.forEach((point, index) => {
      const params = this.getParams(point)
      params.index = index
      // 定位到中心位置
      render(
        clusterCanvasCxt,
        point.renderPixel.x * pixelRatio,
        point.renderPixel.y * pixelRatio,
        params.style.width,
        params.style.height,
        params,
        points
      )
    })
    if (debug) {
      console.timeEnd('绘制时间：')
    }
  }
  renderHoverPoint(params) {
    if (this.isFunction(this.options.hoverRender)) {
      const {
        isCluster,
        data: {
          renderPixel: {x, y},
        },
      } = params
      const {
        renderEngine,
        renderEngine: {hoverCanvasCtx},
        options: {hoverRender, hoverNormalPointStyle, hoverClusterPointStyle},
      } = this
      const style = isCluster ? hoverClusterPointStyle : hoverNormalPointStyle
      const {width, height} = style
      const pixelRatio = renderEngine.getPixelRatio()
      const canvasLeft = x * pixelRatio
      const canvasTop = y * pixelRatio
      hoverRender(hoverCanvasCtx, canvasLeft, canvasTop, width, height, params)
    }
  }
  // 清除聚合
  clearCluster() {
    const {
      renderEngine,
      renderEngine: {clusterCanvas},
      options: {map},
    } = this
    const {width, height} = map.getSize()
    renderEngine.setCanvasSize(clusterCanvas, width, height)
  }
  // 清除 hover 点
  clearHoverPoint() {
    const {
      renderEngine,
      renderEngine: {hoverCanvas},
      options: {map},
    } = this
    const {width, height} = map.getSize()
    renderEngine.setCanvasSize(hoverCanvas, width, height)
  }
  getPoints() {
    return this.points
  }
  getParams(point) {
    let offset = this.normalOffset
    let style = this.options.normalPointStyle
    const isCluster = this.isCluster(point)

    if (isCluster) {
      offset = this.clusterOffset
      style = this.options.clusterPointStyle
    }
    return {
      isCluster,
      offset,
      style,
      data: point,
    }
  }
  isCluster(point) {
    return point instanceof ClusterItem
  }
  isFunction(fn) {
    return typeof fn === 'function'
  }
  destroy() {
    clearTimeout(this.renderTimer)
    this.eventEngine.off()
    this.renderEngine.layer.hide()
    this.data = null
    this.points = null
    this.renderData = null
    this.clusterItems = null
  }
}
