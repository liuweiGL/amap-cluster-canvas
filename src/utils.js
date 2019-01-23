// 经纬度转墨卡托
export function lonLat2Mercator( lonLat ) {
  const [longitude, latitude] = lonLat
  let x = ( longitude * 20037508.34 ) / 180
  let y =
    Math.log( Math.tan( ( ( 90 + latitude ) * Math.PI ) / 360 ) ) / ( Math.PI / 180 )
  y = ( y * 20037508.34 ) / 180
  return {
    x,
    y
  }
}
// 墨卡托转经纬度
export function mercator2LonLat( pixel ) {
  const { x, y } = pixel
  let longitude = ( x / 20037508.34 ) * 180
  let latitude = ( y / 20037508.34 ) * 180
  latitude =
    ( 180 / Math.PI ) *
    ( 2 * Math.atan( Math.exp( ( latitude * Math.PI ) / 180 ) ) - Math.PI / 2 )

  return [longitude, latitude]
}
/**
 * 获取 offset 的值
 * @param {number} value
 * @param {any} offset
 * 1. offset 纯数字
 * 2. offset 百分比
 * 3. 默认返回 Number.parseFloat 的值
 */
function getOffsetValue( value, offset ) {
  const type = typeof offset
  switch ( type ) {
    case 'number':
      return offset
    case 'string':
      const _offset = offset.trim()
      if ( _offset.substr( -1 ) === '%' ) {
        return value * ( Number.parseFloat( offset ) / 100 )
      }
      return Number.parseFloat( offset )
    default:
      return Number.parseFloat( offset )
  }
}
export function getOffset( style, offset ) {
  if ( !Array.isArray( offset ) ) {
    return style
  }
  const { width, height } = style
  const widthOffset = getOffsetValue( width, offset[0] )
  const heightOffset = getOffsetValue( height, offset[1] )
  return {
    width: [widthOffset, width + widthOffset],
    height: [heightOffset, height + heightOffset]
  }
}
