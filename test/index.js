// import Cluster from './lib/cluster'
import Cluster, { Coordinate } from '../src/cluster'

function drawCircle( ctx, x, y, r, color = 'red' ) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc( x, y, r, 0, Math.PI * 2 )
  ctx.fill()
}

function drawText( ctx, x, y, text, color = 'white' ) {
  ctx.font = '18px SimHei'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = color
  ctx.fillText( text, x, y )
}

function random( basic, offset ) {
  let change = Math.random() * offset
  change = Math.random() > 0.5 ? change : -change
  return basic + change
}

const data = []
const longitude = 117.000923
const latitude = 36.675807
for ( let i = 0; i < 1000; i++ ) {
  data.push( [random( longitude, 5 ), random( latitude, 5 )] )
}

function initCanvasCluster( options ) {
  // `cluster` 依赖 `AMap.CustomLayer`
  AMap.plugin( 'AMap.CustomLayer', function() {
    const cluster = new Cluster( {
      data,
      map: options.map,
      type: options.type,
      averageCenter: true,
      offset: ['-50%', '-100%'],
      normalPointStyle: {
        width: 30,
        height: 30
      },
      clusterPointStyle: {
        width: 60,
        height: 60
      },
      hoverNormalPointStyle: {
        width: 30,
        height: 30
      },
      hoverClusterPointStyle: {
        width: 60,
        height: 60
      },
      getPosition: item => item,
      mousemoveHandler( event, data ) {
        // console.log( 'mousemove: ', {event,data} )
      },
      mouseoutHandler( data ) {
        // console.log( 'mouseout: ', data )
      },
      mouseoverHandler( data ) {
        // console.log( 'mouseover: ', data )
      },
      render( ctx, x, y, width, height, point ) {
        /**
         * 因为绘制圆，`定位点` 是作为圆心，所以默认相当于偏于了 [-50%,-50%]；
         * 要把图形绘制到 `定位点` 上方，还需要再 Y 轴上面添加 -50% 的偏移度
         * offset: [-50%, -100%] 就完成了 `定位点` 在图形正下方
         */
        const { isCluster, data } = point
        const r = width / 2
        const centerX = x
        const centerY = y - r - 3
        if ( isCluster ) {
          drawCircle( ctx, centerX, centerY, r )
          drawText( ctx, centerX, centerY, data.getCount() )
          // 定位点
          drawCircle( ctx, x, y, 3, 'green' )
        } else {
          drawCircle( ctx, centerX, centerY, r, 'green' )
        }
      },
      hoverRender( ctx, x, y, width, height, point ) {
        const { isCluster, data } = point
        const r = width / 2
        const centerX = x
        const centerY = y - r - 3
        if ( isCluster ) {
          drawCircle( ctx, centerX, centerY, r, 'white' )
          drawText( ctx, centerX, centerY, data.getCount(), 'red' )
        } else {
          drawCircle( ctx, centerX, centerY, r, 'blue' )
        }
      }
    } )
    window.cluster = cluster
  } )
}
function initAmapCluster( map ) {
  const markers = data.map(
    item =>
      new AMap.Marker( {
        position: item
      } )
  )
  /*eslint-disable*/
  new AMap.MarkerClusterer(map, markers, {
    gridSize: 60,
  })
}
const amapMap = new AMap.Map('amap', {
  zoom: 6,
  center: [longitude, latitude],
})
const mercatorMap = new AMap.Map('mercator', {
  zoom: 6,
  center: [longitude, latitude],
})
const markerMap = new AMap.Map('marker', {
  zoom: 6,
  center: [longitude, latitude],
})
initCanvasCluster({
  map: amapMap,
  type: Coordinate.AMAP,
})
initCanvasCluster({
  map: mercatorMap,
  type: Coordinate.MERCATOR,
})
initAmapCluster(markerMap)
