"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function _createClass(t,e,i){return e&&_defineProperties(t.prototype,e),i&&_defineProperties(t,i),t}function _defineProperty(t,e,i){return e in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}function _objectSpread(t){for(var e=1;e<arguments.length;e++){var i=null!=arguments[e]?arguments[e]:{},n=Object.keys(i);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(i).filter(function(t){return Object.getOwnPropertyDescriptor(i,t).enumerable}))),n.forEach(function(e){_defineProperty(t,e,i[e])})}return t}function _slicedToArray(t,e){return _arrayWithHoles(t)||_iterableToArrayLimit(t,e)||_nonIterableRest()}function _arrayWithHoles(t){if(Array.isArray(t))return t}function _iterableToArrayLimit(t,e){var i=[],n=!0,o=!1,r=void 0;try{for(var s,a=t[Symbol.iterator]();!(n=(s=a.next()).done)&&(i.push(s.value),!e||i.length!==e);n=!0);}catch(t){o=!0,r=t}finally{try{n||null==a.return||a.return()}finally{if(o)throw r}}return i}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}Object.defineProperty(exports,"__esModule",{value:!0});var Canvas=function(){function t(e){_classCallCheck(this,t),this.layer=null,this.hoverCanvas=null,this.hoverCanvasCtx=null,this.clusterCanvas=null,this.clusterCanvasCxt=null,this.options=e,this.pixelRatio=this.getPixelRatio(),this.init()}return _createClass(t,[{key:"init",value:function(){var t=this.options,e=t.map,i=t.visible,n=t.zIndex,o=t.render,r=document.createElement("div"),s=document.createElement("canvas");s.style.position="absolute";var a=document.createElement("canvas");a.style.position="absolute",r.appendChild(s),r.appendChild(a),this.clusterCanvas=s,this.hoverCanvas=a,this.clusterCanvasCxt=s.getContext("2d"),this.hoverCanvasCtx=a.getContext("2d"),this.layer=new AMap.CustomLayer(r,{map:e,zIndex:n,visible:i,zooms:[1,20]}),this.layer.render=o}},{key:"getPixelRatio",value:function(){return Math.min(2,Math.round(window.devicePixelRatio||1))}},{key:"setCanvasSize",value:function(t,e,i){var n=this.pixelRatio;t.width=e*n,t.height=i*n,t.style.width=e+"px",t.style.height=i+"px"}}]),t}(),ClusterItem=function(){function t(e,i){_classCallCheck(this,t),this.coordinate=e.coordinate,this.points=[e],this.options=i}return _createClass(t,[{key:"getCount",value:function(){return this.points.length}},{key:"updateCenter",value:function(){var t=this.points,e=this.points.length,i=this.coordinate,n=i.x,o=i.y;if(this.options.averageCenter){var r=t[e-1].coordinate,s=(n*(e-1)+r.x)/e,a=(o*(e-1)+r.y)/e;this.coordinate={x:s,y:a}}}},{key:"addPoint",value:function(t){this.points.push(t),this.updateCenter()}},{key:"contains",value:function(t){var e=t.coordinate,i=e.x,n=e.y,o=this.coordinate,r=o.x,s=o.y,a=this.options.gridSize;return i>=r-a&&i<=r+a&&n>=s-a&&n<=s+a}}]),t}(),PixelCoordinate=function(){function t(e){_classCallCheck(this,t),this.map=e.map,this.gridSize=e.gridSize}return _createClass(t,[{key:"getGrideSize",value:function(){return this.gridSize}},{key:"getRenderData",value:function(t){var e=this,i=this.map.getBounds();return t.filter(function(t){return i.contains(t.position)}).map(function(t){return _objectSpread({},t,{coordinate:e.map.lngLatToContainer(t.position),renderPixel:e.coordinateToPixel(t)})})}},{key:"coordinateToPixel",value:function(t){return t.coordinate}}]),t}();function lonLat2Mercator(t){var e=_slicedToArray(t,2),i=e[0],n=e[1],o=20037508.34*i/180,r=Math.log(Math.tan((90+n)*Math.PI/360))/(Math.PI/180);return{x:o,y:r=20037508.34*r/180}}function mercator2LonLat(t){var e=t.x,i=t.y/20037508.34*180;return[e/20037508.34*180,i=180/Math.PI*(2*Math.atan(Math.exp(i*Math.PI/180))-Math.PI/2)]}var ZoomCoordinate=function(){function t(e){_classCallCheck(this,t),this.map=e.map,this.gridSize=e.gridSize}return _createClass(t,[{key:"getGridSize",value:function(){return this.gridSize*Math.pow(2,18-this.map.getZoom())}},{key:"getRenderData",value:function(t){var e=this,i=this.getExtendedBounds();return t.filter(function(t){return!t.coordinate}).map(function(t){var n=lonLat2Mercator(t.position);return e.contains(i,n)?_objectSpread({},t,{coordinate:n,renderPixel:e.coordinateToPixel(t)}):null}).filter(function(t){return!!t})}},{key:"getExtendedBounds",value:function(){var t=this.getGridSize(),e=this.map.getBounds(),i=e.getSouthWest(),n=e.getNorthEast(),o=lonLat2Mercator([i.lng,i.lat]),r=lonLat2Mercator([n.lng,n.lat]);return o.x-=t,o.y-=t,r.x+=t,r.y+=t,[o,r]}},{key:"coordinateToPixel",value:function(t){return this.map.lngLatToContainer(t.position||mercator2LonLat(t.coordinate))}},{key:"contains",value:function(t,e){var i=_slicedToArray(t,2),n=i[0],o=i[1],r=e.x,s=e.y;return o.x<=0||r>=n.x&&r<=o.x&&s>=n.y&&s<=o.y}}]),t}(),Event=function(){function t(e){_classCallCheck(this,t),this.hoverPoint=null,this.zooming=!1,this.cluster=e,this.map=e.options.map,this.customContains=e.options.customContains,this.click=e.options.clickHandler,this.mouseout=e.options.mouseoutHandler,this.mouseover=e.options.mouseoverHandler,this.mousemove=e.options.mousemoveHandler,this.zoomOnClick=e.options.zoomOnClick,this.normalPointStyle=e.options.normalPointStyle,this.clusterPointStyle=e.options.clusterPointStyle,this.hoverNormalPointStyle=e.options.hoverNormalPointStyle,this.hoverClusterPointStyle=e.options.hoverClusterPointStyle,this.initEvent()}return _createClass(t,[{key:"initEvent",value:function(){this.map.on("click",this.clickHandler.bind(this)),this.map.on("mousemove",this.mousemoveHandler.bind(this)),this.map.on("zoomstart",this.zoomstartHandler.bind(this)),this.map.on("zoomend",this.zoomendHandler.bind(this))}},{key:"clickHandler",value:function(t){var e=t.pixel,i=this.findPoint(e);if(i){var n=this.cluster.isCluster(i),o={isCluster:n,data:i};this.mouseoutHandler(i),this.zoomOnClick&&n&&this.zoomOnClickHandler(i),this.cluster.isFunction(this.click)&&this.click(o)}}},{key:"mousemoveHandler",value:function(t){var e=t.pixel,i=this.hoverPoint;!this.zooming&&i&&this.constains(i,e)||(i=this.findPoint(e),this.mouseoutHandler(i),this.mouseoverHandler(i)),this.cluster.isFunction(this.mousemove)&&this.mousemove(t,i)}},{key:"mouseoutHandler",value:function(t){this.hoverPoint&&(this.cluster.clearHoverPoint(),this.cluster.isFunction(this.mouseout)&&this.mouseout(this.cluster.getParams(this.hoverPoint))),this.hoverPoint=t}},{key:"mouseoverHandler",value:function(t){if(t){var e=this.cluster.getParams(t);this.cluster.renderHoverPoint(e),this.cluster.isFunction(this.mouseover)&&this.mouseover(e)}}},{key:"zoomstartHandler",value:function(){this.zooming=!0,this.cluster.clearHoverPoint()}},{key:"zoomendHandler",value:function(){this.zooming=!1,this.hoverPoint=null,this.cluster.clearHoverPoint()}},{key:"zoomOnClickHandler",value:function(t){var e=this.map.containerToLngLat(t.renderPixel);this.map.setCenter(e),this.map.zoomIn()}},{key:"findPoint",value:function(t){for(var e=this.cluster.getPoints(),i=e.length,n=0;n<i;n++){var o=e[n];if(this.constains(o,t))return o}return null}},{key:"constains",value:function(t,e){var i=this.cluster.isCluster(t)?this.clusterPointStyle:this.normalPointStyle;if(this.cluster.isFunction(this.customContains))return this.customContains(t.renderPixel,e,i);var n=i.width,o=i.height,r=t.renderPixel,s=r.x,a=r.y,l=e.x,u=e.y;return l>=s&&l<=s+n&&u>=a&&u<=a+o}}]),t}(),ClusterTypes={MERCATOR:"zoom",PIXEL:"pixel"},defaultStyle={width:60,height:69},defaultOptions={type:ClusterTypes.PIXEL,maxZoom:18,gridSize:60,minClusterSize:2,averageCenter:!0,zoomOnClick:!0,zIndex:120,visible:!0,getPosition:function(t){var e=t.location;return e?[e.longitude,e.latitude]:null},render:null,hoverRender:null,clickHandler:null,mouseoutHandler:null,mouseoverHandler:null,mousemoveHandler:null,normalPointStyle:defaultStyle,clusterPointStyle:defaultStyle,hoverNormalPointStyle:defaultStyle,hoverClusterPointStyle:defaultStyle},Cluster=function(){function t(e){_classCallCheck(this,t),this.data=null,this.renderData=null,this.points=null,this.clusterItems=null,this.options=Object.assign({},defaultOptions,e),this.options.data=null,this.eventEngine=new Event(this),this.renderEngine=new Canvas({map:this.options.map,zIndex:this.options.zIndex,visible:this.options.visible,render:this.build.bind(this)}),this.coordinateEngine=e.type===ClusterTypes.PIXEL?new PixelCoordinate(this.options):new ZoomCoordinate(this.options),this.setData(e.data)}return _createClass(t,[{key:"setData",value:function(t){var e=this,i=this.options.getPosition;this.data=[],t&&t.forEach(function(t){t.position=i(t),e.data.push(t)}),this.build()}},{key:"build",value:function(){this.buildCusterItem(),this.updatePoints(),this.renderPoint()}},{key:"buildCusterItem",value:function(){var t=this,e={gridSize:this.coordinateEngine.getGridSize(),averageCenter:this.options.averageCenter};this.clusterItems=[],this.renderData=this.coordinateEngine.getRenderData(this.data),this.renderData.forEach(function(i){var n=null,o=-1,r=i.coordinate,s=r.x,a=r.y;if(t.clusterItems.forEach(function(t){if(t.contains(i)){var e=t.coordinate,r=e.x,l=e.y,u=Math.pow(s-r,2)+Math.pow(a-l,2);(o<0||o>u)&&(n=t,o=u)}}),n)n.addPoint(i);else{var l=new ClusterItem(i,e);l.renderPixel=t.coordinateEngine.coordinateToPixel(l),t.clusterItems.push(l)}})}},{key:"updatePoints",value:function(){var t=this.clusterItems,e=this.options,i=e.map,n=e.minClusterSize,o=e.maxZoom;if(i.getZoom()>=o)this.points=t.reduce(function(t,e){return t.concat(e.points)},[]);else{var r=[];t.forEach(function(t){t.getCount()>=n?r.push(t):r=r.concat(t.points)}),this.points=r}}},{key:"renderLater",value:function(t){this.renderTimer||(this.renderTimer=setTimeout(this.renderPoint.bind(this),t||50))}},{key:"renderPoint",value:function(){var t=this,e=this.points,i=this.options.render,n=this.renderEngine,o=n.pixelRatio,r=n.clusterCanvasCxt;this.isFunction(i)&&(this.renderTimer&&(clearTimeout(this.renderTimer),this.renderTimer=null),this.clearCluster(),e.forEach(function(n,s){var a=t.getParams(n);i(r,n.renderPixel.x*o,n.renderPixel.y*o,a.style.width,a.style.height,{index:s,data:a.data,isCluster:a.isCluster},e)}))}},{key:"renderHoverPoint",value:function(t){if(this.isFunction(this.options.hoverRender)){var e=t.isCluster,i=t.data.renderPixel,n=i.x,o=i.y,r=this.renderEngine,s=this.renderEngine.hoverCanvasCtx,a=this.options,l=a.hoverRender,u=a.hoverNormalPointStyle,h=a.hoverClusterPointStyle,c=e?h:u,d=c.width,v=c.height,m=r.getPixelRatio();l(s,n*m,o*m,d,v,t)}}},{key:"clearCluster",value:function(){var t=this.renderEngine,e=this.renderEngine.clusterCanvas,i=this.options.map.getSize(),n=i.width,o=i.height;t.setCanvasSize(e,n,o)}},{key:"clearHoverPoint",value:function(){var t=this.renderEngine,e=this.renderEngine.hoverCanvas,i=this.options.map.getSize(),n=i.width,o=i.height;t.setCanvasSize(e,n,o)}},{key:"getPoints",value:function(){return this.points}},{key:"getParams",value:function(t){var e=this.isCluster(t);return{isCluster:e,data:t,style:e?this.options.clusterPointStyle:this.options.normalPointStyle}}},{key:"isCluster",value:function(t){return t instanceof ClusterItem}},{key:"isFunction",value:function(t){return"function"==typeof t}}]),t}();exports.ClusterTypes=ClusterTypes,exports.default=Cluster;
//# sourceMappingURL=amap-cluster-canvas.cjs.js.map
