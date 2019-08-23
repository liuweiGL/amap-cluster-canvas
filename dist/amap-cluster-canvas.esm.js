function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}function e(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function n(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function i(t,e,i){return e&&n(t.prototype,e),i&&n(t,i),t}function o(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function r(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},i=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),i.forEach(function(e){o(t,e,n[e])})}return t}function s(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=[],i=!0,o=!1,r=void 0;try{for(var s,a=t[Symbol.iterator]();!(i=(s=a.next()).done)&&(n.push(s.value),!e||n.length!==e);i=!0);}catch(t){o=!0,r=t}finally{try{i||null==a.return||a.return()}finally{if(o)throw r}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var a=function(){function t(n){e(this,t),this.layer=null,this.hoverCanvas=null,this.hoverCanvasCtx=null,this.clusterCanvas=null,this.clusterCanvasCxt=null,this.options=n,this.pixelRatio=this.getPixelRatio(),this.init()}return i(t,[{key:"init",value:function(){var t=this.options,e=t.map,n=t.visible,i=t.zIndex,o=t.render,r=document.createElement("div"),s=document.createElement("canvas");s.style.position="absolute";var a=document.createElement("canvas");a.style.position="absolute",r.appendChild(s),r.appendChild(a),this.clusterCanvas=s,this.hoverCanvas=a,this.clusterCanvasCxt=s.getContext("2d"),this.hoverCanvasCtx=a.getContext("2d"),this.layer=new AMap.CustomLayer(r,{map:e,zIndex:i,visible:n,zooms:[1,20]}),this.layer.render=o}},{key:"getPixelRatio",value:function(){return Math.min(2,Math.round(window.devicePixelRatio||1))}},{key:"setCanvasSize",value:function(t,e,n){var i=this.pixelRatio;t.width=e*i,t.height=n*i,t.style.width=e+"px",t.style.height=n+"px"}}]),t}(),u=function(){function t(n,i){e(this,t),this.renderPixel=null,this.points=[n],this.coordinate=n.coordinate,this.averageCenter=i.averageCenter,this.coordinateEngine=i.coordinateEngine}return i(t,[{key:"getCount",value:function(){return this.points.length}},{key:"updateCenter",value:function(){var t=this.averageCenter,e=this.points,n=this.points.length,i=this.coordinate,o=i.x,r=i.y;if(t){var s=e[n-1].coordinate,a=(o*(n-1)+s.x)/n,u=(r*(n-1)+s.y)/n;this.coordinate={x:a,y:u},this.renderPixel=this.coordinateEngine.coordinateToPixel(this)}else{var l=this.points[0];this.coordinate=l.coordinate,this.renderPixel=l.renderPixel}}},{key:"addPoint",value:function(t){this.points.push(t),this.updateCenter()}},{key:"contains",value:function(t){var e=t.coordinate,n=e.x,i=e.y,o=this.coordinate,r=o.x,s=o.y,a=this.coordinateEngine.getGridSize();return n>=r-a&&n<=r+a&&i>=s-a&&i<=s+a}}]),t}(),l=function(){function t(n){e(this,t),this.map=n.map,this.gridSize=n.gridSize}return i(t,[{key:"getGridSize",value:function(){return this.gridSize}},{key:"getRenderData",value:function(t){var e=this,n=[],i=this.map.getBounds();return t.forEach(function(t){if(i.contains(t.position)){var o=e.map.lngLatToContainer(t.position);n.push(r({},t,{coordinate:o,renderPixel:o}))}}),n}},{key:"coordinateToPixel",value:function(t){return t.coordinate}}]),t}();function h(t){var e=s(t,2),n=e[0],i=e[1],o=20037508.34*n/180,r=Math.log(Math.tan((90+i)*Math.PI/360))/(Math.PI/180);return{x:o,y:r=20037508.34*r/180}}function c(e,n){switch(t(n)){case"number":return n;case"string":return"%"===n.trim().substr(-1)?e*(Number.parseFloat(n)/100):Number.parseFloat(n);default:return Number.parseFloat(n)}}function d(t,e){if(!Array.isArray(e))return[0,0];var n=t.width,i=t.height;return[c(n,e[0]),c(i,e[1])]}var v=function(){function t(n){e(this,t),this.map=n.map,this.gridSize=n.gridSize}return i(t,[{key:"getGridSize",value:function(){return this.gridSize*Math.pow(2,18-this.map.getZoom())}},{key:"getRenderData",value:function(t){var e=this,n=[],i=this.getExtendedBounds();return t.forEach(function(t){var o=t.coordinate,s=t.renderPixel;o||(o=h(t.position),s=e.coordinateToPixel(t)),e.contains(i,o)&&n.push(r({},t,{coordinate:o,renderPixel:s}))}),n}},{key:"getExtendedBounds",value:function(){var t=this.getGridSize(),e=this.map.getBounds(),n=e.getSouthWest(),i=e.getNorthEast(),o=h([n.lng,n.lat]),r=h([i.lng,i.lat]);return o.x-=t,o.y-=t,r.x+=t,r.y+=t,[o,r]}},{key:"coordinateToPixel",value:function(t){return this.map.lngLatToContainer(t.position||(e=t.coordinate,n=e.x,i=e.y/20037508.34*180,[n/20037508.34*180,i=180/Math.PI*(2*Math.atan(Math.exp(i*Math.PI/180))-Math.PI/2)]));var e,n,i}},{key:"contains",value:function(t,e){var n=s(t,2),i=n[0],o=n[1],r=e.x,a=e.y;return o.x<=0||r>=i.x&&r<=o.x&&a>=i.y&&a<=o.y}}]),t}(),f=function(){function t(n){e(this,t),this.hoverPoint=null,this.cluster=n,this.map=n.options.map,this.click=n.options.clickHandler,this.mouseout=n.options.mouseoutHandler,this.mouseover=n.options.mouseoverHandler,this.mousemove=n.options.mousemoveHandler,this.zoomOnClick=n.options.zoomOnClick,this.clickHandler=this.clickHandler.bind(this),this.mousemoveHandler=this.mousemoveHandler.bind(this),this.zoomstartHandler=this.zoomstartHandler.bind(this),this.initEvent()}return i(t,[{key:"initEvent",value:function(){this.map.on("click",this.clickHandler),this.map.on("mousemove",this.mousemoveHandler),this.map.on("zoomstart",this.zoomstartHandler)}},{key:"off",value:function(){this.map.off("click",this.clickHandler),this.map.off("mousemove",this.mousemoveHandler),this.map.off("zoomstart",this.zoomstartHandler)}},{key:"clickHandler",value:function(t){var e=t.pixel,n=this.findPoint(e);if(n){var i=this.cluster.getParams(n);this.mouseoutHandler(n),this.zoomOnClick&&i.isCluster&&this.zoomOnClickHandler(n),this.cluster.isFunction(this.click)&&this.click(i)}}},{key:"mousemoveHandler",value:function(t){var e=t.pixel,n=this.hoverPoint,i=this.findPoint(e);n&&!this.constains(n,e)&&this.mouseoutHandler(),i&&n!==i&&this.mouseoverHandler(i),this.cluster.isFunction(this.mousemove)&&this.mousemove(t,i)}},{key:"mouseoverHandler",value:function(t){this.hoverPoint=t;var e=this.cluster.getParams(t);this.cluster.renderHoverPoint(e),this.cluster.isFunction(this.mouseover)&&this.mouseover(e)}},{key:"mouseoutHandler",value:function(){this.hoverPoint=null,this.cluster.clearHoverPoint(),this.cluster.isFunction(this.mouseout)&&this.mouseout(this.cluster.getParams(this.hoverPoint))}},{key:"zoomstartHandler",value:function(){this.mouseoutHandler()}},{key:"zoomOnClickHandler",value:function(t){var e=t.renderPixel,n=e.x,i=e.y,o=new AMap.Pixel(n,i),r=this.map.containerToLngLat(o);this.map.setCenter(r),this.map.zoomIn()}},{key:"findPoint",value:function(t){for(var e=this.cluster.getPoints(),n=e.length,i=0;i<n;i++){var o=e[i];if(this.constains(o,t))return o}return null}},{key:"constains",value:function(t,e){var n=this.cluster.getParams(t),i=s(n.offset,2),o=i[0],r=i[1],a=n.style,u=a.width,l=a.height,h=t.renderPixel,c=h.x,d=h.y,v=e.x,f=e.y;return v>=c+o&&v<=c+u+o&&f>=d+r&&f<=d+l+r}}]),t}(),m={MERCATOR:"MERCATOR",AMAP:"AMAP"},p={width:60,height:69},y={data:null,coordinate:m.AMAP,maxZoom:18,gridSize:60,minClusterSize:2,averageCenter:!0,zoomOnClick:!0,zIndex:120,visible:!0,offset:null,getPosition:function(t){var e=t.location||{},n=e.longitude,i=e.latitude;return n&&i?[n,i]:null},render:null,hoverRender:null,clickHandler:null,mouseoutHandler:null,mouseoverHandler:null,mousemoveHandler:null,normalPointStyle:p,clusterPointStyle:p,hoverNormalPointStyle:p,hoverClusterPointStyle:p};export default(function(){function t(n){e(this,t),this.data=null,this.points=[],this.renderData=null,this.clusterItems=null,this.options=Object.assign({},y,n),this.options.data=null,this.normalOffset=d(this.options.normalPointStyle,n.offset),this.clusterOffset=d(this.options.clusterPointStyle,n.offset),this.eventEngine=new f(this),this.renderEngine=new a({map:this.options.map,zIndex:this.options.zIndex,visible:this.options.visible,render:this.build.bind(this)}),this.coordinateEngine=this.options.coordinate===m.AMAP?new l(this.options):new v(this.options),this.setData(n.data,!1)}return i(t,[{key:"setData",value:function(t){var e=this,n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],i=this.options.getPosition;this.data=[],t&&t.forEach(function(t){var n=i(t);n&&(t.position=n,e.data.push(t))}),n&&this.build()}},{key:"build",value:function(){this.buildCusterItem(),this.updatePoints(),this.render()}},{key:"buildCusterItem",value:function(){var t=this,e={coordinateEngine:this.coordinateEngine,averageCenter:this.options.averageCenter};this.clusterItems=[],this.renderData=this.coordinateEngine.getRenderData(this.data),this.renderData.forEach(function(n){var i=null,o=-1,r=n.coordinate,s=r.x,a=r.y;if(t.clusterItems.forEach(function(t){if(t.contains(n)){var e=t.coordinate,r=e.x,u=e.y,l=Math.pow(s-r,2)+Math.pow(a-u,2);(o<0||o>l)&&(i=t,o=l)}}),i)i.addPoint(n);else{var l=new u(n,e);t.clusterItems.push(l)}})}},{key:"updatePoints",value:function(){var t=this.clusterItems,e=this.options,n=e.map,i=e.minClusterSize,o=e.maxZoom;if(n.getZoom()>=o)this.points=t.reduce(function(t,e){return t.concat(e.points)},[]);else{var r=[];t.forEach(function(t){t.getCount()>=i?r.push(t):r=r.concat(t.points)}),this.points=r}}},{key:"renderLater",value:function(t){this.renderTimer||(this.renderTimer=setTimeout(this.render.bind(this),t||50))}},{key:"render",value:function(){var t=this,e=this.points,n=this.options.render,i=this.renderEngine,o=i.pixelRatio,r=i.clusterCanvasCxt;this.isFunction(n)&&(this.renderTimer&&(clearTimeout(this.renderTimer),this.renderTimer=null),this.clearCluster(),e.forEach(function(i,s){var a=t.getParams(i);a.index=s,n(r,i.renderPixel.x*o,i.renderPixel.y*o,a.style.width,a.style.height,a,e)}))}},{key:"renderHoverPoint",value:function(t){if(this.isFunction(this.options.hoverRender)){var e=t.isCluster,n=t.data.renderPixel,i=n.x,o=n.y,r=this.renderEngine,s=this.renderEngine.hoverCanvasCtx,a=this.options,u=a.hoverRender,l=a.hoverNormalPointStyle,h=a.hoverClusterPointStyle,c=e?h:l,d=c.width,v=c.height,f=r.getPixelRatio();u(s,i*f,o*f,d,v,t)}}},{key:"clearCluster",value:function(){var t=this.renderEngine,e=this.renderEngine.clusterCanvas,n=this.options.map.getSize(),i=n.width,o=n.height;t.setCanvasSize(e,i,o)}},{key:"clearHoverPoint",value:function(){var t=this.renderEngine,e=this.renderEngine.hoverCanvas,n=this.options.map.getSize(),i=n.width,o=n.height;t.setCanvasSize(e,i,o)}},{key:"getPoints",value:function(){return this.points}},{key:"getParams",value:function(t){var e=this.normalOffset,n=this.options.normalPointStyle,i=this.isCluster(t);return i&&(e=this.clusterOffset,n=this.options.clusterPointStyle),{isCluster:i,offset:e,style:n,data:t}}},{key:"isCluster",value:function(t){return t instanceof u}},{key:"isFunction",value:function(t){return"function"==typeof t}},{key:"destroy",value:function(){clearTimeout(this.renderTimer),this.eventEngine.off(),this.renderEngine.layer.hide(),this.data=null,this.points=null,this.renderData=null,this.clusterItems=null}}]),t}());export{m as Coordinate};
//# sourceMappingURL=amap-cluster-canvas.esm.js.map
