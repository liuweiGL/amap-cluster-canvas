export default class Event {
  constructor( cluster ) {
    this.hoverPoint = null
    this.cluster = cluster
    this.map = cluster.options.map
    this.click = cluster.options.clickHandler
    this.mouseout = cluster.options.mouseoutHandler
    this.mouseover = cluster.options.mouseoverHandler
    this.mousemove = cluster.options.mousemoveHandler
    this.zoomOnClick = cluster.options.zoomOnClick
    this.initEvent()
  }
  initEvent() {
    this.map.on( 'click', this.clickHandler.bind( this ) )
    this.map.on( 'mousemove', this.mousemoveHandler.bind( this ) )
    this.map.on( 'zoomstart', this.zoomstartHandler.bind( this ) )
  }
  clickHandler( event ) {
    const { pixel } = event
    const point = this.findPoint( pixel )
    if ( point ) {
      const params = this.cluster.getParams( point )
      // 触发 `mouseout`
      this.mouseoutHandler( point )
      // 点击聚合点展开聚合
      this.zoomOnClick && params.isCluster && this.zoomOnClickHandler( point )
      this.cluster.isFunction( this.click ) && this.click( params )
    }
  }
  // 由`mousemove`衍生出 `mouseout` & `mouseover`
  mousemoveHandler( event ) {
    const { pixel } = event
    const hoverPoint = this.hoverPoint
    const point = this.findPoint( pixel )
    // 先触发 mouseout 事件
    if ( hoverPoint && !this.constains( hoverPoint, pixel ) ) {
      this.mouseoutHandler()
    }
    // 后触发 mouseover 事件
    if ( point && hoverPoint !== point ) {
      this.mouseoverHandler( point )
    }
    this.cluster.isFunction( this.mousemove ) && this.mousemove( event, point )
  }
  mouseoverHandler( point ) {
    this.hoverPoint = point
    const params = this.cluster.getParams( point )
    this.cluster.renderHoverPoint( params )
    this.cluster.isFunction( this.mouseover ) && this.mouseover( params )
  }
  mouseoutHandler() {
    this.hoverPoint = null
    this.cluster.clearHoverPoint()
    this.cluster.isFunction( this.mouseout ) &&
      this.mouseout( this.cluster.getParams( this.hoverPoint ) )
  }
  zoomstartHandler() {
    this.mouseoutHandler()
  }
  zoomOnClickHandler( point ) {
    const {
      renderPixel: { x, y }
    } = point
    const pixel = new AMap.Pixel( x, y )
    const lnglat = this.map.containerToLngLat( pixel )
    this.map.setCenter( lnglat )
    this.map.zoomIn()
  }
  // 查找鼠标下面的点，因为聚合点跟实体点的大小可能不一致，所以要分开查找
  findPoint( eventPixel ) {
    const data = this.cluster.getPoints()
    const { length } = data
    for ( let i = 0; i < length; i++ ) {
      const point = data[i]
      if ( this.constains( point, eventPixel ) ) {
        return point
      }
    }
    return null
  }
  // pixel 坐标是否在 point 范围内
  constains( point, pixel ) {
    const params = this.cluster.getParams( point )
    const {
      offset: [offsetX, offsetY],
      style: { width, height }
    } = params
    const {
      renderPixel: { x: x1, y: y1 }
    } = point
    const { x: x2, y: y2 } = pixel
    return (
      x2 >= x1 + offsetX &&
      x2 <= x1 + width + offsetX &&
      y2 >= y1 + offsetY &&
      y2 <= y1 + height + offsetY
    )
  }
}
