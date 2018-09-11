/**
 * 为点聚合提供画布
 * @param options
 * {
 *   map: 地图,
 *   zIndex: 图层zIndex,
 *   visible: 是否可见
 * }
 */
class Canvas {
  constructor(options) {
    this.layer = null
    this.hoverCanvas = null
    this.hoverCanvasCtx = null
    this.clusterCanvas = null
    this.clusterCanvasCxt = null
    this.options = options
    this.pixelRatio = this.getPixelRatio()
    this._init()
  }
  _init() {
    const {
      options: { map, visible, zIndex }
    } = this
    const container = document.createElement('div')
    // 绘制聚合点
    const clusterCanvas = document.createElement('canvas')
    clusterCanvas.style.position = 'absolute'
    // hover状态下的点绘制
    const hoverCanvas = document.createElement('canvas')
    hoverCanvas.style.position = 'absolute'
    container.appendChild(clusterCanvas)
    container.appendChild(hoverCanvas)
    this.clusterCanvas = clusterCanvas
    this.hoverCanvas = hoverCanvas
    this.clusterCanvasCxt = clusterCanvas.getContext('2d')
    this.hoverCanvasCtx = hoverCanvas.getContext('2d')

    this.layer = new AMap.CustomLayer(container, {
      map,
      zIndex,
      visible,
      zooms: [1, 20]
    })
  }
  // 设备像素比
  getPixelRatio() {
    return Math.min(2, Math.round(window.devicePixelRatio || 1))
  }
  // 设置canvas的width&height属性可以清理画布
  setCanvasSize(canvas, w, h) {
    const { pixelRatio } = this
    canvas.width = w * pixelRatio
    canvas.height = h * pixelRatio
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
  }
  // 清除聚合
  clearCluster() {
    const { width, height } = this.options.map.getSize()
    this.setCanvasSize(this.clusterCanvas, width, height)
  }
}

export default Canvas
