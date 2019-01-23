import { lonLat2Mercator, mercator2LonLat } from './utils'

export default class MercatorCoordinate {
  constructor( options ) {
    this.map = options.map
    this.gridSize = options.gridSize
  }
  getGridSize() {
    return this.gridSize * Math.pow( 2, 18 - this.map.getZoom() )
  }
  getRenderData( data ) {
    const renderData = []
    const bounds = this.getExtendedBounds()
    data.forEach( item => {
      let { coordinate, renderPixel } = item
      if ( !coordinate ) {
        coordinate = lonLat2Mercator( item.position )
        renderPixel = this.coordinateToPixel( item )
      }
      if ( this.contains( bounds, coordinate ) ) {
        renderData.push( {
          ...item,
          coordinate,
          renderPixel
        } )
      }
    } )
    return renderData
  }
  getExtendedBounds() {
    const gridSize = this.getGridSize()
    const bounds = this.map.getBounds()
    const southWest = bounds.getSouthWest()
    const northEast = bounds.getNorthEast()
    // 上右
    const tr = lonLat2Mercator( [southWest.lng, southWest.lat] )
    // 下左
    const bl = lonLat2Mercator( [northEast.lng, northEast.lat] )
    tr.x -= gridSize
    tr.y -= gridSize
    bl.x += gridSize
    bl.y += gridSize
    return [tr, bl]
  }
  coordinateToPixel( point ) {
    return this.map.lngLatToContainer(
      point.position || mercator2LonLat( point.coordinate )
    )
  }
  contains( bounds, coordinate ) {
    const [tr, bl] = bounds
    const { x, y } = coordinate
    // 小于等于0 ：地图缩放到最小，世界地图都在视图内
    return bl.x <= 0 || ( x >= tr.x && x <= bl.x && y >= tr.y && y <= bl.y )
  }
}
