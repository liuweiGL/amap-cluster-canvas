import Cluster from './lib/cluster'

function drawCircle(ctx, x, y, r, color = 'red') {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
}

function drawText(ctx, x, y, text, color = 'white') {
  ctx.font = '18px SimHei'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = color
  ctx.fillText(text, x, y)
}

function drawRect(ctx, x, y, width, height, color = 'green') {
  ctx.fillStyle = color
  ctx.fillRect(x, y, width, height)
}

function random(basic, offset) {
  let change = Math.random() * offset
  change = Math.random() > 0.5 ? change : -change
  return basic + change
}

const data = []
const Longitude = 117.000923
const latitude = 36.675807
for (let i = 0; i < 100000; i++) {
  data.push([random(Longitude, 30), random(latitude, 10)])
}
const map = new AMap.Map('container', {
  zoom: 11,
  center: [Longitude, latitude]
})
// `cluster` 依赖 `AMap.CustomLayer`
AMap.plugin('AMap.CustomLayer', function() {
  const cluster = new Cluster({
    map,
    data,
    getPosition: (item) => item,
    render(ctx, x, y, width, height, point) {
      const { isCluster, data } = point
      ctx.fillStyle
      if (isCluster) {
        drawCircle(ctx, x, y, width / 2)
        drawText(ctx, x, y, data.getCount())
      } else {
        drawCircle(ctx, x, y, width / 6)
        drawRect(ctx, x, y, width / 10, height / 6)
      }
    }
  })
  console.log(cluster)
})
