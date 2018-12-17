import Canvas from './canvas'
import ClusterItem from './clusterItem'
import { lonLat2Mercator, mercator2LonLat } from './utils'

// 开发环境输出日志
const debug = process.env.NODE_ENV === 'development'

// 聚合策略
export const ClusterTypes = {
  ZOOM: 'zoom', // 根据缩放层级聚合
  PIXEL: 'pixel' // 根据相对于地图容器的坐标聚合
}

// 默认的点样式
const defaultStyle = {
  width: 60,
  height: 69
}
// 聚合默认设置
const defaultOptions = {
  type: ClusterTypes.PIXEL, // 聚合策略
  maxZoom: 18, // 最大的聚合级别，大于该级别就不进行相应的聚合
  gridSize: 60, // 聚合计算时，网格的像素大小
  minClusterSize: 2, // 聚合的最小数量，小于该数量个点则不能成为一个聚合
  averageCenter: true, // 是否取所有点的平均值作为聚合点中心
  zoomOnClick: true, // 点击聚合点时，是否展开聚合
  zIndex: 120, // canvas图层的zindex
  visible: true, // 是否显示
  getPosition(item) {
    // 获取经纬度信息
    const { location } = item
    return location ? [location.longitude, location.latitude] : null
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
  hoverClusterPointStyle: defaultStyle // hover状态下聚合点的样式
}

class Cluster {
  constructor(options) {
    const { map, data } = options
    this.options = Object.assign({}, defaultOptions, options)
    this.points = [] // 聚合点+实体点 = 渲染点
    this.buildFn = null // 聚合构建器
    this.pixelFn = null // 还原点坐标到相对地图容器的坐标
    this.lastPixel = {} // 触发事件的坐标
    this.oldHoverPoint = null // 触发事件的对象
    this.renderTimer = null
    this.clusterItems = null
    this.renderEngine = new Canvas({
      map,
      zIndex: this.options.zIndex,
      visible: this.options.visible
    })
    this._init(data)
    this._customEngine()
    this._bindEvent()
  }
  renderLater(delay) {
    if (!this.renderTimer) {
      this.renderTimer = setTimeout(this.render.bind(this), delay || 50)
    }
  }
  render() {
    const {
      points,
      options: { render, normalPointStyle, clusterPointStyle },
      renderEngine: { pixelRatio, clusterCanvasCxt }
    } = this
    if (this.renderTimer) {
      clearTimeout(this.renderTimer)
      this.renderTimer = null
    }
    if (debug) {
      console.time('绘制时间：')
    }
    // 清理画布
    this.renderEngine.clearCluster()
    // 绘制
    points.forEach((point, index) => {
      const pixel = this.pixelFn(point.coordinate)
      const { x, y } = pixel
      const isCluster = this._isCluster(point)
      const style = isCluster ? clusterPointStyle : normalPointStyle
      const { width, height } = style
      // 定位到中心位置
      render(
        clusterCanvasCxt,
        (x - width / 2) * pixelRatio,
        (y - height / 2) * pixelRatio,
        width,
        height,
        {
          index,
          isCluster,
          data: point
        },
        points
      )
    })
    if (debug) {
      console.timeEnd('绘制时间：')
    }
  }
  setData(data) {
    this.data = data || []
    this._buildCluster()
  }
  _init(data) {
    // 根据聚合策略使用不同的聚合构建器
    this._createBuildFn()
    // 把聚合坐标还原为相对于地图容器的坐标
    this._createPixelFn()
    this.setData(data)
  }
  _createBuildFn() {
    const {
      options: { map, type, gridSize, averageCenter, getPosition }
    } = this
    if (type === ClusterTypes.PIXEL) {
      this.buildFn = () => {
        const bounds = map.getBounds()
        const options = {
          gridSize,
          averageCenter
        }
        this.data.forEach((item) => {
          const location = getPosition(item)
          if (location && bounds.contains(location)) {
            // 经纬度转换为相对于地图容器的坐标
            item.coordinate = map.lngLatToContainer(location)
            this._buildClusterItem(item, options)
          }
        })
      }
    } else {
      this.buildFn = () => {
        const zoom = map.getZoom()
        const bounds = this._getExtendedBounds()
        const options = {
          averageCenter,
          gridSize: gridSize * Math.pow(2, 18 - zoom)
        }
        this.data.forEach((item) => {
          const location = getPosition(item)
          // 反转经纬度的时候使用
          if (location) {
            // 经纬度转换为墨卡托坐标
            if (!item.coordinate) {
              item.coordinate = lonLat2Mercator(location)
            }
            if (this._pointInScreen(bounds, item.coordinate)) {
              this._buildClusterItem(item, options)
            }
          }
        })
      }
    }
  }
  _createPixelFn() {
    const {
      options: { type, map }
    } = this
    if (type === ClusterTypes.PIXEL) {
      this.pixelFn = (coordinate) => coordinate
    } else {
      this.pixelFn = (coordinate) => {
        // 墨卡托坐标=>经纬度
        const lnglat = mercator2LonLat(coordinate)
        // 经纬度=>相对地图容器的坐标
        return map.lngLatToContainer(lnglat)
      }
    }
  }
  _buildCluster() {
    if (debug) {
      console.time('聚合构建时间：')
    }
    this.clusterItems = []
    this.buildFn()
    this._updatePoints()
    this.render()
    if (debug) {
      console.timeEnd('聚合构建时间：')
      console.log('%c构建聚合模块数量：' + this.points.length, 'color: red')
    }
  }
  _buildClusterItem(point, options) {
    let parent = null
    let distance = -1 // 当前点与聚合中心的距离
    const {
      coordinate: { x: pointX, y: pointY }
    } = point
    this.clusterItems.forEach((clusterItem) => {
      if (clusterItem.contains(point)) {
        const {
          coordinate: { x: centerX, y: centerY }
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
  }
  _updatePoints() {
    const {
      clusterItems,
      options: { map, minClusterSize, maxZoom }
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
      clusterItems.forEach((clusterItem) => {
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
  _customEngine() {
    // 重要：当图层发生变动时，自动调用render函数
    this.renderEngine.layer.render = this._buildCluster.bind(this)
  }
  _bindEvent() {
    const {
      options: { map }
    } = this
    // 实现canvas事件
    map.on('click', this._clickHandler.bind(this)) // => point click 事件
    map.on('mousemove', this._mousemoveHandler.bind(this)) // => point hover 事件
  }
  _clickHandler(event) {
    const { pixel } = event
    const point = this._findEventPoint(pixel)
    if (point) {
      const {
        options: { zoomOnClick, clickHandler }
      } = this
      const params = {
        data: point,
        isCluster: this._isCluster(point)
      }
      // 触发 `mouseout`
      this.mouseoutHandler()
      // 点击聚合点展开聚合
      zoomOnClick && this._zoomOnClickHandler(params)
      this._isFunction(clickHandler) && clickHandler(params)
    }
  }
  // 由`mousemove`衍生出 `mouseout` & `mouseover`
  _mousemoveHandler(event) {
    const { pixel } = event
    const { lastPixel, oldHoverPoint } = this
    if (lastPixel.x === pixel.x && lastPixel.y === pixel.y) {
      return
    }
    const point = this._findEventPoint(pixel)
    if (point === oldHoverPoint) {
      return
    }
    this.mouseoutHandler(point)
    this.mouseoverHandler(point)
    this.lastPixel = pixel
  }
  mouseoutHandler(point) {
    const {
      oldHoverPoint,
      options: { mouseoutHandler }
    } = this
    if (oldHoverPoint) {
      this._clearHoverPoint()
      this._isFunction(mouseoutHandler) &&
        mouseoutHandler({
          data: oldHoverPoint,
          isCluster: this._isCluster(oldHoverPoint)
        })
    }
    this.oldHoverPoint = point
  }
  mouseoverHandler(point) {
    if (!point) {
      return
    }
    const {
      options: { mouseoverHandler }
    } = this
    const params = {
      data: point,
      isCluster: this._isCluster(point)
    }
    this._drawHoverPoint(params)
    this._isFunction(mouseoverHandler) && mouseoverHandler(params)
  }
  _zoomOnClickHandler(data) {
    const {
      isCluster,
      data: { coordinate }
    } = data
    if (isCluster) {
      const {
        options: { map },
        pixelFn
      } = this
      const pixel = pixelFn(coordinate)
      const lnglat = map.containerToLngLat(pixel)
      map.setCenter(lnglat)
      map.zoomIn()
    }
  }
  _drawHoverPoint(params) {
    const {
      options: { hoverRender, normalPointStyle, clusterPointStyle },
      renderEngine,
      renderEngine: { hoverCanvas, hoverCanvasCtx }
    } = this
    if (this._isFunction(hoverRender)) {
      const margin = 20
      const {
        isCluster,
        data: {
          coordinate: { x, y }
        }
      } = params
      const style = isCluster ? clusterPointStyle : normalPointStyle
      const { width, height } = style
      const canvasWidth = width + margin
      const canvasHeight = height + margin
      const canvasLeft = x - canvasWidth / 2
      const canvasTop = y - canvasHeight / 2
      const pixelRatio = renderEngine.getPixelRatio()
      hoverCanvas.style.left = canvasLeft + 'px'
      hoverCanvas.style.top = canvasTop + 'px'
      hoverCanvas.style.cursor = 'pointer'
      renderEngine.setCanvasSize(hoverCanvas, canvasWidth, canvasHeight)
      hoverCanvasCtx.save()
      hoverCanvasCtx.translate(
        -canvasLeft * pixelRatio,
        -canvasTop * pixelRatio
      )
      hoverRender(
        hoverCanvasCtx,
        canvasLeft + margin / 2,
        canvasTop + margin / 2,
        width,
        height,
        params
      )
      hoverCanvasCtx.restore()
    }
  }
  _clearHoverPoint() {
    const {
      renderEngine,
      renderEngine: { hoverCanvas }
    } = this
    renderEngine.setCanvasSize(hoverCanvas, 0, 0)
  }
  _findEventPoint(mousePoint) {
    // 查找鼠标下面的点，因为聚合点跟实体点的大小可能不一致，所以要分开查找
    const {
      points,
      _constains,
      options: { normalPointStyle, clusterPointStyle }
    } = this
    const _clusterPoints = []
    const _normalPoints = []
    points.forEach((item) => {
      if (this._isCluster(item)) {
        _clusterPoints.push(item)
      } else {
        _normalPoints.push(item)
      }
    })
    for (let i = 0, len1 = _clusterPoints.length; i < len1; i++) {
      const item = _clusterPoints[i]
      if (_constains(item.coordinate, mousePoint, clusterPointStyle)) {
        return item
      }
    }
    for (let k = 0, len2 = _normalPoints.length; k < len2; k++) {
      const item = _normalPoints[k]
      if (_constains(item.coordinate, mousePoint, normalPointStyle)) {
        return item
      }
    }
    return null
  }
  _constains(p1, p2, style) {
    // 绘画的时候是以 `p1` 作为中心点
    const { width, height } = style
    const { x: x1, y: y1 } = p1
    const { x: x2, y: y2 } = p2
    return (
      x2 >= x1 - width / 2 &&
      x2 <= x1 + width / 2 &&
      y2 >= y1 - height / 2 &&
      y2 <= y1 + height / 2
    )
  }
  _getExtendedBounds() {
    const {
      options: { map, gridSize }
    } = this
    const zoom = map.getZoom()
    const bounds = map.getBounds()
    const southWest = bounds.getSouthWest()
    const northEast = bounds.getNorthEast()
    // 上右
    const tr = lonLat2Mercator([southWest.lng, southWest.lat])
    // 下左
    const bl = lonLat2Mercator([northEast.lng, northEast.lat])
    const _gridSize = gridSize * Math.pow(2, 18 - zoom)
    tr.x -= _gridSize
    tr.y -= _gridSize
    bl.x += _gridSize
    bl.y += _gridSize
    return [tr, bl]
  }
  _pointInScreen(bounds, coordinate) {
    const [tr, bl] = bounds
    const { x, y } = coordinate
    return bl.x <= 0 || (x >= tr.x && x <= bl.x && y >= tr.y && y <= bl.y)
  }
  _isFunction(fn) {
    return typeof fn === 'function'
  }
  _isCluster(point) {
    return point instanceof ClusterItem
  }
}

export default Cluster
