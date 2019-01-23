export default class AmapCoordinate {
  constructor( options ) {
    this.map = options.map
    this.gridSize = options.gridSize
  }
  getGridSize() {
    return this.gridSize
  }
  getRenderData( data ) {
    const renderData = []
    const bounds = this.map.getBounds()
    data.forEach( item => {
      if ( bounds.contains( item.position ) ) {
        // 经纬度转换为相对于地图容器的坐标
        const coordinate = this.map.lngLatToContainer( item.position )
        renderData.push( {
          ...item,
          coordinate,
          renderPixel: coordinate
        } )
      }
    } )
    return renderData
  }
  coordinateToPixel( point ) {
    return point.coordinate
  }
}
