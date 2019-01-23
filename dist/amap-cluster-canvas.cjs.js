"use strict";function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}function _defineProperty(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function _objectSpread(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},i=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),i.forEach(function(e){_defineProperty(t,e,n[e])})}return t}function _slicedToArray(t,e){return _arrayWithHoles(t)||_iterableToArrayLimit(t,e)||_nonIterableRest()}function _arrayWithHoles(t){if(Array.isArray(t))return t}function _iterableToArrayLimit(t,e){var n=[],i=!0,r=!1,o=void 0;try{for(var s,a=t[Symbol.iterator]();!(i=(s=a.next()).done)&&(n.push(s.value),!e||n.length!==e);i=!0);}catch(t){r=!0,o=t}finally{try{i||null==a.return||a.return()}finally{if(r)throw o}}return n}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}Object.defineProperty(exports,"__esModule",{value:!0});var Canvas=function(){function t(e){_classCallCheck(this,t),this.layer=null,this.hoverCanvas=null,this.hoverCanvasCtx=null,this.clusterCanvas=null,this.clusterCanvasCxt=null,this.options=e,this.pixelRatio=this.getPixelRatio(),this.init()}return _createClass(t,[{key:"init",value:function(){var t=this.options,e=t.map,n=t.visible,i=t.zIndex,r=t.render,o=document.createElement("div"),s=document.createElement("canvas");s.style.position="absolute";var a=document.createElement("canvas");a.style.position="absolute",o.appendChild(s),o.appendChild(a),this.clusterCanvas=s,this.hoverCanvas=a,this.clusterCanvasCxt=s.getContext("2d"),this.hoverCanvasCtx=a.getContext("2d"),this.layer=new AMap.CustomLayer(o,{map:e,zIndex:i,visible:n,zooms:[1,20]}),this.layer.render=r}},{key:"getPixelRatio",value:function(){return Math.min(2,Math.round(window.devicePixelRatio||1))}},{key:"setCanvasSize",value:function(t,e,n){var i=this.pixelRatio;t.width=e*i,t.height=n*i,t.style.width=e+"px",t.style.height=n+"px"}}]),t}(),ClusterItem=function(){function t(e,n){_classCallCheck(this,t),this.renderPixel=null,this.points=[e],this.coordinate=e.coordinate,this.averageCenter=n.averageCenter,this.coordinateEngine=n.coordinateEngine}return _createClass(t,[{key:"getCount",value:function(){return this.points.length}},{key:"updateCenter",value:function(){var t=this.averageCenter,e=this.points,n=this.points.length,i=this.coordinate,r=i.x,o=i.y;if(t){var s=e[n-1].coordinate,a=(r*(n-1)+s.x)/n,l=(o*(n-1)+s.y)/n;this.coordinate={x:a,y:l},this.renderPixel=this.coordinateEngine.coordinateToPixel(this)}else{var u=this.points[0];this.coordinate=u.coordinate,this.renderPixel=u.renderPixel}}},{key:"addPoint",value:function(t){this.points.push(t),this.updateCenter()}},{key:"contains",value:function(t){var e=t.coordinate,n=e.x,i=e.y,r=this.coordinate,o=r.x,s=r.y,a=this.coordinateEngine.getGridSize();return n>=o-a&&n<=o+a&&i>=s-a&&i<=s+a}}]),t}(),AmapCoordinate=function(){function t(e){_classCallCheck(this,t),this.map=e.map,this.gridSize=e.gridSize}return _createClass(t,[{key:"getGridSize",value:function(){return this.gridSize}},{key:"getRenderData",value:function(t){var e=this,n=[],i=this.map.getBounds();return t.forEach(function(t){if(i.contains(t.position)){var r=e.map.lngLatToContainer(t.position);n.push(_objectSpread({},t,{coordinate:r,renderPixel:r}))}}),n}},{key:"coordinateToPixel",value:function(t){return t.coordinate}}]),t}();function lonLat2Mercator(t){var e=_slicedToArray(t,2),n=e[0],i=e[1],r=20037508.34*n/180,o=Math.log(Math.tan((90+i)*Math.PI/360))/(Math.PI/180);return{x:r,y:o=20037508.34*o/180}}function mercator2LonLat(t){var e=t.x,n=t.y/20037508.34*180;return[e/20037508.34*180,n=180/Math.PI*(2*Math.atan(Math.exp(n*Math.PI/180))-Math.PI/2)]}function getOffsetValue(t,e){switch(_typeof(e)){case"number":return e;case"string":return"%"===e.trim().substr(-1)?t*(Number.parseFloat(e)/100):Number.parseFloat(e);default:return Number.parseFloat(e)}}function getOffset(t,e){if(!Array.isArray(e))return[0,0];var n=t.width,i=t.height;return[getOffsetValue(n,e[0]),getOffsetValue(i,e[1])]}var MercatorCoordinate=function(){function t(e){_classCallCheck(this,t),this.map=e.map,this.gridSize=e.gridSize}return _createClass(t,[{key:"getGridSize",value:function(){return this.gridSize*Math.pow(2,18-this.map.getZoom())}},{key:"getRenderData",value:function(t){var e=this,n=[],i=this.getExtendedBounds();return t.forEach(function(t){var r=t.coordinate,o=t.renderPixel;r||(r=lonLat2Mercator(t.position),o=e.coordinateToPixel(t)),e.contains(i,r)&&n.push(_objectSpread({},t,{coordinate:r,renderPixel:o}))}),n}},{key:"getExtendedBounds",value:function(){var t=this.getGridSize(),e=this.map.getBounds(),n=e.getSouthWest(),i=e.getNorthEast(),r=lonLat2Mercator([n.lng,n.lat]),o=lonLat2Mercator([i.lng,i.lat]);return r.x-=t,r.y-=t,o.x+=t,o.y+=t,[r,o]}},{key:"coordinateToPixel",value:function(t){return this.map.lngLatToContainer(t.position||mercator2LonLat(t.coordinate))}},{key:"contains",value:function(t,e){var n=_slicedToArray(t,2),i=n[0],r=n[1],o=e.x,s=e.y;return r.x<=0||o>=i.x&&o<=r.x&&s>=i.y&&s<=r.y}}]),t}(),Event=function(){function t(e){_classCallCheck(this,t),this.hoverPoint=null,this.cluster=e,this.map=e.options.map,this.click=e.options.clickHandler,this.mouseout=e.options.mouseoutHandler,this.mouseover=e.options.mouseoverHandler,this.mousemove=e.options.mousemoveHandler,this.zoomOnClick=e.options.zoomOnClick,this.initEvent()}return _createClass(t,[{key:"initEvent",value:function(){this.map.on("click",this.clickHandler.bind(this)),this.map.on("mousemove",this.mousemoveHandler.bind(this)),this.map.on("zoomstart",this.zoomstartHandler.bind(this))}},{key:"clickHandler",value:function(t){var e=t.pixel,n=this.findPoint(e);if(n){var i=this.cluster.getParams(n);this.mouseoutHandler(n),this.zoomOnClick&&i.isCluster&&this.zoomOnClickHandler(n),this.cluster.isFunction(this.click)&&this.click(i)}}},{key:"mousemoveHandler",value:function(t){var e=t.pixel,n=this.hoverPoint,i=this.findPoint(e);n&&!this.constains(n,e)&&this.mouseoutHandler(),i&&n!==i&&this.mouseoverHandler(i),this.cluster.isFunction(this.mousemove)&&this.mousemove(t,i)}},{key:"mouseoverHandler",value:function(t){this.hoverPoint=t;var e=this.cluster.getParams(t);this.cluster.renderHoverPoint(e),this.cluster.isFunction(this.mouseover)&&this.mouseover(e)}},{key:"mouseoutHandler",value:function(){this.hoverPoint=null,this.cluster.clearHoverPoint(),this.cluster.isFunction(this.mouseout)&&this.mouseout(this.cluster.getParams(this.hoverPoint))}},{key:"zoomstartHandler",value:function(){this.mouseoutHandler()}},{key:"zoomOnClickHandler",value:function(t){var e=t.renderPixel,n=e.x,i=e.y,r=new AMap.Pixel(n,i),o=this.map.containerToLngLat(r);this.map.setCenter(o),this.map.zoomIn()}},{key:"findPoint",value:function(t){for(var e=this.cluster.getPoints(),n=e.length,i=0;i<n;i++){var r=e[i];if(this.constains(r,t))return r}return null}},{key:"constains",value:function(t,e){var n=this.cluster.getParams(t),i=_slicedToArray(n.offset,2),r=i[0],o=i[1],s=n.style,a=s.width,l=s.height,u=t.renderPixel,h=u.x,c=u.y,d=e.x,f=e.y;return d>=h+r&&d<=h+a+r&&f>=c+o&&f<=c+l+o}}]),t}(),Coordinate={MERCATOR:"MERCATOR",AMAP:"AMAP"},defaultStyle={width:60,height:69},defaultOptions={data:null,coordinate:Coordinate.AMAP,maxZoom:18,gridSize:60,minClusterSize:2,averageCenter:!0,zoomOnClick:!0,zIndex:120,visible:!0,offset:null,getPosition:function(t){var e=t.location;return e?[e.longitude,e.latitude]:null},render:null,hoverRender:null,clickHandler:null,mouseoutHandler:null,mouseoverHandler:null,mousemoveHandler:null,normalPointStyle:defaultStyle,clusterPointStyle:defaultStyle,hoverNormalPointStyle:defaultStyle,hoverClusterPointStyle:defaultStyle},Cluster=function(){function t(e){_classCallCheck(this,t),this.data=null,this.points=[],this.renderData=null,this.clusterItems=null,this.options=Object.assign({},defaultOptions,e),this.options.data=null,this.normalOffset=getOffset(this.options.normalPointStyle,e.offset),this.clusterOffset=getOffset(this.options.clusterPointStyle,e.offset),this.eventEngine=new Event(this),this.renderEngine=new Canvas({map:this.options.map,zIndex:this.options.zIndex,visible:this.options.visible,render:this.build.bind(this)}),this.coordinateEngine=e.coordinate===Coordinate.AMAP?new AmapCoordinate(this.options):new MercatorCoordinate(this.options),this.setData(e.data,!1)}return _createClass(t,[{key:"setData",value:function(t){var e=this,n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],i=this.options.getPosition;this.data=[],t&&t.forEach(function(t){t.position=i(t),e.data.push(t)}),n&&this.build()}},{key:"build",value:function(){this.buildCusterItem(),this.updatePoints(),this.render()}},{key:"buildCusterItem",value:function(){var t=this,e={coordinateEngine:this.coordinateEngine,averageCenter:this.options.averageCenter};this.clusterItems=[],this.renderData=this.coordinateEngine.getRenderData(this.data),this.renderData.forEach(function(n){var i=null,r=-1,o=n.coordinate,s=o.x,a=o.y;if(t.clusterItems.forEach(function(t){if(t.contains(n)){var e=t.coordinate,o=e.x,l=e.y,u=Math.pow(s-o,2)+Math.pow(a-l,2);(r<0||r>u)&&(i=t,r=u)}}),i)i.addPoint(n);else{var l=new ClusterItem(n,e);t.clusterItems.push(l)}})}},{key:"updatePoints",value:function(){var t=this.clusterItems,e=this.options,n=e.map,i=e.minClusterSize,r=e.maxZoom;if(n.getZoom()>=r)this.points=t.reduce(function(t,e){return t.concat(e.points)},[]);else{var o=[];t.forEach(function(t){t.getCount()>=i?o.push(t):o=o.concat(t.points)}),this.points=o}}},{key:"renderLater",value:function(t){this.renderTimer||(this.renderTimer=setTimeout(this.render.bind(this),t||50))}},{key:"render",value:function(){var t=this,e=this.points,n=this.options.render,i=this.renderEngine,r=i.pixelRatio,o=i.clusterCanvasCxt;this.isFunction(n)&&(this.renderTimer&&(clearTimeout(this.renderTimer),this.renderTimer=null),this.clearCluster(),e.forEach(function(i,s){var a=t.getParams(i);a.index=s,n(o,i.renderPixel.x*r,i.renderPixel.y*r,a.style.width,a.style.height,a,e)}))}},{key:"renderHoverPoint",value:function(t){if(this.isFunction(this.options.hoverRender)){var e=t.isCluster,n=t.data.renderPixel,i=n.x,r=n.y,o=this.renderEngine,s=this.renderEngine.hoverCanvasCtx,a=this.options,l=a.hoverRender,u=a.hoverNormalPointStyle,h=a.hoverClusterPointStyle,c=e?h:u,d=c.width,f=c.height,v=o.getPixelRatio();l(s,i*v,r*v,d,f,t)}}},{key:"clearCluster",value:function(){var t=this.renderEngine,e=this.renderEngine.clusterCanvas,n=this.options.map.getSize(),i=n.width,r=n.height;t.setCanvasSize(e,i,r)}},{key:"clearHoverPoint",value:function(){var t=this.renderEngine,e=this.renderEngine.hoverCanvas,n=this.options.map.getSize(),i=n.width,r=n.height;t.setCanvasSize(e,i,r)}},{key:"getPoints",value:function(){return this.points}},{key:"getParams",value:function(t){var e=this.normalOffset,n=this.options.normalPointStyle,i=this.isCluster(t);return i&&(e=this.clusterOffset,n=this.options.clusterPointStyle),{isCluster:i,offset:e,style:n,data:t}}},{key:"isCluster",value:function(t){return t instanceof ClusterItem}},{key:"isFunction",value:function(t){return"function"==typeof t}}]),t}();exports.Coordinate=Coordinate,exports.default=Cluster;
//# sourceMappingURL=amap-cluster-canvas.cjs.js.map
