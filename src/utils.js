//经纬度转墨卡托
export function lonLat2Mercator(lonLat) {
  const [longitude, latitude] = lonLat
  let x = (longitude * 20037508.34) / 180
  let y =
    Math.log(Math.tan(((90 + latitude) * Math.PI) / 360)) / (Math.PI / 180)
  y = (y * 20037508.34) / 180
  return {
    x,
    y
  }
}
//墨卡托转经纬度
export function mercator2LonLat(pixel) {
  const { x, y } = pixel
  let longitude = (x / 20037508.34) * 180
  let latitude = (y / 20037508.34) * 180
  latitude =
    (180 / Math.PI) *
    (2 * Math.atan(Math.exp((latitude * Math.PI) / 180)) - Math.PI / 2)

  return [longitude, latitude]
}
