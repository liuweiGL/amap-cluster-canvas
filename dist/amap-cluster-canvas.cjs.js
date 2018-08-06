"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var classCallCheck=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},createClass=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),slicedToArray=function(){return function(t,e){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return function(t,e){var n=[],i=!0,r=!1,o=void 0;try{for(var s,a=t[Symbol.iterator]();!(i=(s=a.next()).done)&&(n.push(s.value),!e||n.length!==e);i=!0);}catch(t){r=!0,o=t}finally{try{!i&&a.return&&a.return()}finally{if(r)throw o}}return n}(t,e);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),Canvas=function(){function t(e){classCallCheck(this,t),this.layer=null,this.hoverCanvas=null,this.hoverCanvasCtx=null,this.clusterCanvas=null,this.clusterCanvasCxt=null,this.options=e,this._init()}return createClass(t,[{key:"_init",value:function(){var t=this.options,e=t.map,n=t.visible,i=t.zIndex,r=document.createElement("div"),o=document.createElement("canvas");o.style.position="absolute";var s=document.createElement("canvas");s.style.position="absolute",r.appendChild(o),r.appendChild(s),this.clusterCanvas=o,this.hoverCanvas=s,this.clusterCanvasCxt=o.getContext("2d"),this.hoverCanvasCtx=s.getContext("2d"),this.layer=new AMap.CustomLayer(r,{map:e,zIndex:i,visible:n,zooms:[1,20]})}},{key:"getPixelRatio",value:function(){return Math.min(2,Math.round(window.devicePixelRatio||1))}},{key:"setCanvasSize",value:function(t,e,n){var i=this.getPixelRatio();t.width=e*i,t.height=n*i,t.style.width=e+"px",t.style.height=n+"px"}},{key:"clearCluster",value:function(){var t=this.options.map.getSize(),e=t.width,n=t.height;this.setCanvasSize(this.clusterCanvas,e,n)}}]),t}(),ClusterItem=function(){function t(e,n){classCallCheck(this,t),this.coordinate=e.coordinate,this.points=[e],this.options=n}return createClass(t,[{key:"getCount",value:function(){return this.points.length}},{key:"updateCenter",value:function(){var t=this.points,e=this.points.length,n=this.coordinate,i=n.x,r=n.y;if(this.options.isAverageCenter){var o=t[e-1].coordinate,s=(i*(e-1)+o.x)/e,a=(r*(e-1)+o.y)/e;this.coordinate={x:s,y:a}}}},{key:"addPoint",value:function(t){this.points.push(t),this.updateCenter()}},{key:"contains",value:function(t){var e=t.coordinate,n=e.x,i=e.y,r=this.coordinate,o=r.x,s=r.y,a=this.options.gridSize;return n>=o-a&&n<=o+a&&i>=s-a&&i<=s+a}}]),t}();function lonLat2Mercator(t){var e=slicedToArray(t,2),n=e[0],i=e[1],r=20037508.34*n/180,o=Math.log(Math.tan((90+i)*Math.PI/360))/(Math.PI/180);return{x:r,y:o=20037508.34*o/180}}function mercator2LonLat(t){var e=t.x,n=t.y/20037508.34*180;return[e/20037508.34*180,n=180/Math.PI*(2*Math.atan(Math.exp(n*Math.PI/180))-Math.PI/2)]}var ClusterTypes={ZOOM:"zoom",PIXEL:"pixel"},defaultStyle={width:60,height:69},defaultOptions={type:ClusterTypes.PIXEL,maxZoom:18,gridSize:60,minClusterSize:2,averageCenter:!0,zoomOnClick:!0,zIndex:120,visible:!0,getPosition:function(t){var e=t.location;return e?[e.longitude,e.latitude]:null},render:null,hoverRender:null,clickHandler:null,mouseoutHandler:null,mouseoverHandler:null,mousemoveHandler:null,normalPointStyle:defaultStyle,clusterPointStyle:defaultStyle,hoverNormalPointStyle:defaultStyle,hoverClusterPointStyle:defaultStyle},Cluster=function(){function t(e){classCallCheck(this,t);var n=e.map,i=e.data;this.options=Object.assign({},defaultOptions,e),this.points=[],this.buildFn=null,this.pixelFn=null,this.lastPixel={},this.oldHoverPoint=null,this.renderTimer=null,this.clusterItems=null,this.renderEngine=new Canvas({map:n,zIndex:this.options.zIndex,visible:this.options.visible}),this._init(i),this._customEngine(),this._bindEvent()}return createClass(t,[{key:"renderLater",value:function(t){this.renderTimer||(this.renderTimer=setTimeout(this.render.bind(this),t||50))}},{key:"render",value:function(){var t=this,e=this.points,n=this.options,i=n.render,r=n.normalPointStyle,o=n.clusterPointStyle,s=this.renderEngine.clusterCanvasCxt;this.renderTimer&&(clearTimeout(this.renderTimer),this.renderTimer=null),this.renderEngine.clearCluster(),e.forEach(function(e){var n=t.pixelFn(e.coordinate),a=n.x,l=n.y,u=t._isCluster(e),h=u?o:r,c=h.width,d=h.height;i(s,a-c/2,l-d/2,c,d,{isCluster:u,data:e})})}},{key:"setData",value:function(t){this.data=t,this._buildCluster(),this.render()}},{key:"_init",value:function(t){this._createBuildFn(),this._createPixelFn(),this.setData(t)}},{key:"_createBuildFn",value:function(){var t=this,e=this.options,n=e.map,i=e.type,r=e.gridSize,o=e.averageCenter,s=e.getPosition;i===ClusterTypes.PIXEL?this.buildFn=function(){var e=n.getBounds(),i={gridSize:r,averageCenter:o};t.data.forEach(function(r){var o=s(r);o&&e.contains(o)&&(r.coordinate=n.lngLatToContainer(o),t._buildClusterItem(r,i))})}:this.buildFn=function(){var e=n.getZoom(),i=t._getExtendedBounds(),a={averageCenter:o,gridSize:r*Math.pow(2,18-e)};t.data.forEach(function(e){var n=s(e);n&&(e.coordinate||(e.coordinate=lonLat2Mercator(n)),t._pointInScreen(i,e.coordinate)&&t._buildClusterItem(e,a))})}}},{key:"_createPixelFn",value:function(){var t=this.options,e=t.type,n=t.map;e===ClusterTypes.PIXEL?this.pixelFn=function(t){return t}:this.pixelFn=function(t){var e=mercator2LonLat(t);return n.lngLatToContainer(e)}}},{key:"_buildCluster",value:function(){this.clusterItems=[],this.data&&(this.buildFn(),this._updatePoints(),this.render())}},{key:"_buildClusterItem",value:function(t,e){var n=null,i=-1,r=t.coordinate,o=r.x,s=r.y;if(this.clusterItems.forEach(function(e){if(e.contains(t)){var r=e.coordinate,a=r.x,l=r.y,u=Math.pow(o-a,2)+Math.pow(s-l,2);(i<0||i>u)&&(n=e,i=u)}}),n)n.addPoint(t);else{var a=new ClusterItem(t,e);this.clusterItems.push(a)}}},{key:"_updatePoints",value:function(){var t=this.clusterItems,e=this.options,n=e.map,i=e.minClusterSize,r=e.maxZoom;if(n.getZoom()>=r)this.points=t.reduce(function(t,e){return t.concat(e.points)},[]);else{var o=[];t.forEach(function(t){t.getCount()>=i?o.push(t):o=o.concat(t.points)}),this.points=o}}},{key:"_customEngine",value:function(){this.renderEngine.layer.render=this._buildCluster.bind(this)}},{key:"_bindEvent",value:function(){var t=this.options.map;t.on("click",this._clickHandler.bind(this)),t.on("mousemove",this._mousemoveHandler.bind(this))}},{key:"_clickHandler",value:function(t){var e=t.pixel,n=this._findEventPoint(e);if(n){var i=this.options,r=i.zoomOnClick,o=i.clickHandler,s={data:n,isCluster:this._isCluster(n)};this.mouseoutHandler(),r&&this._zoomOnClickHandler(s),this._isFunction(o)&&o(s)}}},{key:"_mousemoveHandler",value:function(t){var e=t.pixel,n=this.lastPixel,i=this.oldHoverPoint;if(n.x!==e.x||n.y!==e.y){var r=this._findEventPoint(e);r!==i&&(this.mouseoutHandler(r),this.mouseoverHandler(r),this.lastPixel=e)}}},{key:"mouseoutHandler",value:function(t){var e=this.oldHoverPoint,n=this.options.mouseoutHandler;e&&(this._clearHoverPoint(),this._isFunction(n)&&n({data:e,isCluster:this._isCluster(e)})),this.oldHoverPoint=t}},{key:"mouseoverHandler",value:function(t){if(t){var e=this.options.mouseoverHandler,n={data:t,isCluster:this._isCluster(t)};this._drawHoverPoint(n),this._isFunction(e)&&e(n)}}},{key:"_zoomOnClickHandler",value:function(t){var e=t.isCluster,n=t.data.coordinate;if(e){var i=this.options.map,r=(0,this.pixelFn)(n),o=i.containerToLngLat(r);i.setCenter(o),i.zoomIn()}}},{key:"_drawHoverPoint",value:function(t){var e=this.options,n=e.hoverRender,i=e.normalPointStyle,r=e.clusterPointStyle,o=this.renderEngine,s=this.renderEngine,a=s.hoverCanvas,l=s.hoverCanvasCtx;if(this._isFunction(n)){var u=t.isCluster,h=t.data.coordinate,c=h.x,d=h.y,v=u?r:i,f=v.width,y=v.height,p=f+20,C=y+20,m=c-p/2,x=d-C/2,g=o.getPixelRatio();a.style.left=m+"px",a.style.top=x+"px",a.style.cursor="pointer",o.setCanvasSize(a,p,C),l.save(),l.translate(-m*g,-x*g),n(l,m+10,x+10,f,y,t),l.restore()}}},{key:"_clearHoverPoint",value:function(){var t=this.renderEngine,e=this.renderEngine.hoverCanvas;t.setCanvasSize(e,0,0)}},{key:"_findEventPoint",value:function(t){var e=this,n=this.points,i=this._constains,r=this.options,o=r.normalPointStyle,s=r.clusterPointStyle,a=[],l=[];n.forEach(function(t){e._isCluster(t)?a.push(t):l.push(t)});for(var u=0,h=a.length;u<h;u++){var c=a[u];if(i(c.coordinate,t,s))return c}for(var d=0,v=l.length;d<v;d++){var f=l[d];if(i(f.coordinate,t,o))return f}return null}},{key:"_constains",value:function(t,e,n){var i=n.width,r=n.height,o=t.x,s=t.y,a=e.x,l=e.y;return a>=o-i/2&&a<=o+i/2&&l>=s-r/2&&l<=s+r/2}},{key:"_getExtendedBounds",value:function(){var t=this.options,e=t.map,n=t.gridSize,i=e.getZoom(),r=e.getBounds(),o=r.getSouthWest(),s=r.getNorthEast(),a=lonLat2Mercator([o.lng,o.lat]),l=lonLat2Mercator([s.lng,s.lat]),u=n*Math.pow(2,18-i);return a.x-=u,a.y-=u,l.x+=u,l.y+=u,[a,l]}},{key:"_pointInScreen",value:function(t,e){var n=slicedToArray(t,2),i=n[0],r=n[1],o=e.x,s=e.y;return r.x<=0||o>=i.x&&o<=r.x&&s>=i.y&&s<=r.y}},{key:"_isFunction",value:function(t){return"function"==typeof t}},{key:"_isCluster",value:function(t){return t instanceof ClusterItem}}]),t}();exports.ClusterTypes=ClusterTypes,exports.default=Cluster;
//# sourceMappingURL=amap-cluster-canvas.cjs.js.map
