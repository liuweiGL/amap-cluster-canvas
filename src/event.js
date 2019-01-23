import { getOffset } from './utils'
export default class Event {
  constructor( cluster ) {
    this.hoverPoint = null
    this.zooming = false
    this.cluster = cluster
    this.map = cluster.options.map
    this.click = cluster.options.clickHandler
    this.mouseout = cluster.options.mouseoutHandler
    this.mouseover = cluster.options.mouseoverHandler
    this.mousemove = cluster.options.mousemoveHandler
    this.zoomOnClick = cluster.options.zoomOnClick
    this.normalOffset = getOffset(
      cluster.options.normalPointStyle,
      cluster.options.offset
    )
    this.clusterOffset = getOffset(
      cluster.options.clusterPointStyle,
      cluster.options.offset
    )
    this.initEvent()
  }
  initEvent() {
    this.map.on( 'click', this.clickHandler.bind( this ) )
    this.map.on( 'mousemove', this.mousemoveHandler.bind( this ) )
    this.map.on( 'zoomstart', this.zoomstartHandler.bind( this ) )
    this.map.on( 'zoomend', this.zoomendHandler.bind( this ) )
  }
  clickHandler( event ) {
    const { pixel } = event
    const point = this.findPoint( pixel )
    if ( point ) {
      const isCluster = this.cluster.isCluster( point )
      const params = {
        isCluster,
        data: point
      }
      // 触发 `mouseout`
      this.mouseoutHandler( point )
      // 点击聚合点展开聚合
      this.zoomOnClick && isCluster && this.zoomOnClickHandler( point )
      this.cluster.isFunction( this.click ) && this.click( params )
    }
  }
  // 由`mousemove`衍生出 `mouseout` & `mouseover`
  mousemoveHandler( event ) {
    const { pixel } = event
    let point = this.hoverPoint

    if ( !( !this.zooming && point && this.constains( point, pixel ) ) ) {
      point = this.findPoint( pixel )
      this.mouseoutHandler( point )
      this.mouseoverHandler( point )
    }
    this.cluster.isFunction( this.mousemove ) && this.mousemove( event, point )
  }
  mouseoutHandler( point ) {
    if ( this.hoverPoint ) {
      this.cluster.clearHoverPoint()
      this.cluster.isFunction( this.mouseout ) &&
        this.mouseout( this.cluster.getParams( this.hoverPoint ) )
    }
    this.hoverPoint = point
  }
  mouseoverHandler( point ) {
    if ( point ) {
      const params = this.cluster.getParams( point )
      this.cluster.renderHoverPoint( params )
      this.cluster.isFunction( this.mouseover ) && this.mouseover( params )
    }
  }
  zoomstartHandler() {
    this.zooming = true
    this.cluster.clearHoverPoint()
  }
  zoomendHandler() {
    this.zooming = false
    this.hoverPoint = null
    this.cluster.clearHoverPoint()
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
    const offset = this.cluster.isCluster( point )
      ? this.clusterOffset
      : this.normalOffset
    const { width, height } = offset
    const {
      renderPixel: { x: x1, y: y1 }
    } = point
    const { x: x2, y: y2 } = pixel
    return (
      x2 >= x1 + width[0] &&
      x2 <= x1 + width[1] &&
      y2 >= y1 + height[0] &&
      y2 <= y1 + height[1]
    )
  }
}
