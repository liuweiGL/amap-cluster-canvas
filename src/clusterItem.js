class ClusterItem {
  constructor( point, options ) {
    this.renderPixel = null
    this.points = [point]
    this.coordinate = point.coordinate
    this.averageCenter = options.averageCenter
    this.coordinateEngine = options.coordinateEngine
  }
  getCount() {
    return this.points.length
  }
  // 更新聚合点的中心点
  updateCenter() {
    const {
      averageCenter,
      points,
      points: { length },
      coordinate: { x: centerX, y: centerY }
    } = this
    if ( averageCenter ) {
      const newAddPoint = points[length - 1]
      const {
        coordinate: { x: pointX, y: pointY }
      } = newAddPoint
      const totalX = centerX * ( length - 1 )
      const totalY = centerY * ( length - 1 )
      const newCenterX = ( totalX + pointX ) / length
      const newCenterY = ( totalY + pointY ) / length
      this.coordinate = {
        x: newCenterX,
        y: newCenterY
      }
      this.renderPixel = this.coordinateEngine.coordinateToPixel( this )
    } else {
      const centerPoint = this.points[0]
      this.coordinate = centerPoint.coordinate
      this.renderPixel = centerPoint.renderPixel
    }
  }
  // 往聚合中添加点
  addPoint( point ) {
    this.points.push( point )
    this.updateCenter()
  }
  // 判断一个点是否在改聚合范围内
  contains( point ) {
    const {
      coordinate: { x: pointX, y: pointY }
    } = point
    const {
      coordinate: { x: centerX, y: centerY }
    } = this
    const gridSize = this.coordinateEngine.getGridSize()
    return (
      pointX >= centerX - gridSize &&
      pointX <= centerX + gridSize &&
      pointY >= centerY - gridSize &&
      pointY <= centerY + gridSize
    )
  }
}

export default ClusterItem
