!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(t["amap-cluster-canvas"]={})}(this,function(t){"use strict";var e=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},n=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),i=function(){return function(t,e){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return function(t,e){var n=[],i=!0,o=!1,r=void 0;try{for(var s,a=t[Symbol.iterator]();!(i=(s=a.next()).done)&&(n.push(s.value),!e||n.length!==e);i=!0);}catch(t){o=!0,r=t}finally{try{!i&&a.return&&a.return()}finally{if(o)throw r}}return n}(t,e);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),o=function(){function t(n){e(this,t),this.layer=null,this.hoverCanvas=null,this.hoverCanvasCtx=null,this.clusterCanvas=null,this.clusterCanvasCxt=null,this.options=n,this.pixelRatio=this.getPixelRatio(),this._init()}return n(t,[{key:"_init",value:function(){var t=this.options,e=t.map,n=t.visible,i=t.zIndex,o=document.createElement("div"),r=document.createElement("canvas");r.style.position="absolute";var s=document.createElement("canvas");s.style.position="absolute",o.appendChild(r),o.appendChild(s),this.clusterCanvas=r,this.hoverCanvas=s,this.clusterCanvasCxt=r.getContext("2d"),this.hoverCanvasCtx=s.getContext("2d"),this.layer=new AMap.CustomLayer(o,{map:e,zIndex:i,visible:n,zooms:[1,20]})}},{key:"getPixelRatio",value:function(){return Math.min(2,Math.round(window.devicePixelRatio||1))}},{key:"setCanvasSize",value:function(t,e,n){var i=this.pixelRatio;t.width=e*i,t.height=n*i,t.style.width=e+"px",t.style.height=n+"px"}},{key:"clearCluster",value:function(){var t=this.options.map.getSize(),e=t.width,n=t.height;this.setCanvasSize(this.clusterCanvas,e,n)}}]),t}(),r=function(){function t(n,i){e(this,t),this.coordinate=n.coordinate,this.points=[n],this.options=i}return n(t,[{key:"getCount",value:function(){return this.points.length}},{key:"updateCenter",value:function(){var t=this.points,e=this.points.length,n=this.coordinate,i=n.x,o=n.y;if(this.options.isAverageCenter){var r=t[e-1].coordinate,s=(i*(e-1)+r.x)/e,a=(o*(e-1)+r.y)/e;this.coordinate={x:s,y:a}}}},{key:"addPoint",value:function(t){this.points.push(t),this.updateCenter()}},{key:"contains",value:function(t){var e=t.coordinate,n=e.x,i=e.y,o=this.coordinate,r=o.x,s=o.y,a=this.options.gridSize;return n>=r-a&&n<=r+a&&i>=s-a&&i<=s+a}}]),t}();function s(t){var e=i(t,2),n=e[0],o=e[1],r=20037508.34*n/180,s=Math.log(Math.tan((90+o)*Math.PI/360))/(Math.PI/180);return{x:r,y:s=20037508.34*s/180}}var a={ZOOM:"zoom",PIXEL:"pixel"},u={width:60,height:69},l={type:a.PIXEL,maxZoom:18,gridSize:60,minClusterSize:2,averageCenter:!0,zoomOnClick:!0,zIndex:120,visible:!0,getPosition:function(t){var e=t.location;return e?[e.longitude,e.latitude]:null},render:null,hoverRender:null,clickHandler:null,mouseoutHandler:null,mouseoverHandler:null,mousemoveHandler:null,normalPointStyle:u,clusterPointStyle:u,hoverNormalPointStyle:u,hoverClusterPointStyle:u},h=function(){function t(n){e(this,t);var i=n.map,r=n.data;this.options=Object.assign({},l,n),this.points=[],this.buildFn=null,this.pixelFn=null,this.lastPixel={},this.oldHoverPoint=null,this.renderTimer=null,this.clusterItems=null,this.renderEngine=new o({map:i,zIndex:this.options.zIndex,visible:this.options.visible}),this._init(r),this._customEngine(),this._bindEvent()}return n(t,[{key:"renderLater",value:function(t){this.renderTimer||(this.renderTimer=setTimeout(this.render.bind(this),t||50))}},{key:"render",value:function(){var t=this,e=this.points,n=this.options,i=n.render,o=n.normalPointStyle,r=n.clusterPointStyle,s=this.renderEngine,a=s.pixelRatio,u=s.clusterCanvasCxt;this.renderTimer&&(clearTimeout(this.renderTimer),this.renderTimer=null),this.renderEngine.clearCluster(),e.forEach(function(n,s){var l=t.pixelFn(n.coordinate),h=l.x,c=l.y,d=t._isCluster(n),v=d?r:o,f=v.width,p=v.height;i(u,(h-f/2)*a,(c-p/2)*a,f,p,{index:s,isCluster:d,data:n},e)})}},{key:"setData",value:function(t){this.data=t,this._buildCluster(),this.render()}},{key:"_init",value:function(t){this._createBuildFn(),this._createPixelFn(),this.setData(t)}},{key:"_createBuildFn",value:function(){var t=this,e=this.options,n=e.map,i=e.type,o=e.gridSize,r=e.averageCenter,u=e.getPosition;this.buildFn=i===a.PIXEL?function(){var e=n.getBounds(),i={gridSize:o,averageCenter:r};t.data.forEach(function(o){var r=u(o);r&&e.contains(r)&&(o.coordinate=n.lngLatToContainer(r),t._buildClusterItem(o,i))})}:function(){var e=n.getZoom(),i=t._getExtendedBounds(),a={averageCenter:r,gridSize:o*Math.pow(2,18-e)};t.data.forEach(function(e){var n=u(e);n&&(e.coordinate||(e.coordinate=s(n)),t._pointInScreen(i,e.coordinate)&&t._buildClusterItem(e,a))})}}},{key:"_createPixelFn",value:function(){var t=this.options,e=t.type,n=t.map;this.pixelFn=e===a.PIXEL?function(t){return t}:function(t){var e,i,o,r=(i=(e=t).x,o=e.y/20037508.34*180,[i/20037508.34*180,o=180/Math.PI*(2*Math.atan(Math.exp(o*Math.PI/180))-Math.PI/2)]);return n.lngLatToContainer(r)}}},{key:"_buildCluster",value:function(){this.clusterItems=[],this.data&&(this.buildFn(),this._updatePoints(),this.render())}},{key:"_buildClusterItem",value:function(t,e){var n=null,i=-1,o=t.coordinate,s=o.x,a=o.y;if(this.clusterItems.forEach(function(e){if(e.contains(t)){var o=e.coordinate,r=o.x,u=o.y,l=Math.pow(s-r,2)+Math.pow(a-u,2);(i<0||i>l)&&(n=e,i=l)}}),n)n.addPoint(t);else{var u=new r(t,e);this.clusterItems.push(u)}}},{key:"_updatePoints",value:function(){var t=this.clusterItems,e=this.options,n=e.map,i=e.minClusterSize,o=e.maxZoom;if(n.getZoom()>=o)this.points=t.reduce(function(t,e){return t.concat(e.points)},[]);else{var r=[];t.forEach(function(t){t.getCount()>=i?r.push(t):r=r.concat(t.points)}),this.points=r}}},{key:"_customEngine",value:function(){this.renderEngine.layer.render=this._buildCluster.bind(this)}},{key:"_bindEvent",value:function(){var t=this.options.map;t.on("click",this._clickHandler.bind(this)),t.on("mousemove",this._mousemoveHandler.bind(this))}},{key:"_clickHandler",value:function(t){var e=t.pixel,n=this._findEventPoint(e);if(n){var i=this.options,o=i.zoomOnClick,r=i.clickHandler,s={data:n,isCluster:this._isCluster(n)};this.mouseoutHandler(),o&&this._zoomOnClickHandler(s),this._isFunction(r)&&r(s)}}},{key:"_mousemoveHandler",value:function(t){var e=t.pixel,n=this.lastPixel,i=this.oldHoverPoint;if(n.x!==e.x||n.y!==e.y){var o=this._findEventPoint(e);o!==i&&(this.mouseoutHandler(o),this.mouseoverHandler(o),this.lastPixel=e)}}},{key:"mouseoutHandler",value:function(t){var e=this.oldHoverPoint,n=this.options.mouseoutHandler;e&&(this._clearHoverPoint(),this._isFunction(n)&&n({data:e,isCluster:this._isCluster(e)})),this.oldHoverPoint=t}},{key:"mouseoverHandler",value:function(t){if(t){var e=this.options.mouseoverHandler,n={data:t,isCluster:this._isCluster(t)};this._drawHoverPoint(n),this._isFunction(e)&&e(n)}}},{key:"_zoomOnClickHandler",value:function(t){var e=t.isCluster,n=t.data.coordinate;if(e){var i=this.options.map,o=(0,this.pixelFn)(n),r=i.containerToLngLat(o);i.setCenter(r),i.zoomIn()}}},{key:"_drawHoverPoint",value:function(t){var e=this.options,n=e.hoverRender,i=e.normalPointStyle,o=e.clusterPointStyle,r=this.renderEngine,s=this.renderEngine,a=s.hoverCanvas,u=s.hoverCanvasCtx;if(this._isFunction(n)){var l=t.isCluster,h=t.data.coordinate,c=h.x,d=h.y,v=l?o:i,f=v.width,p=v.height,y=f+20,m=p+20,C=c-y/2,x=d-m/2,g=r.getPixelRatio();a.style.left=C+"px",a.style.top=x+"px",a.style.cursor="pointer",r.setCanvasSize(a,y,m),u.save(),u.translate(-C*g,-x*g),n(u,C+10,x+10,f,p,t),u.restore()}}},{key:"_clearHoverPoint",value:function(){var t=this.renderEngine,e=this.renderEngine.hoverCanvas;t.setCanvasSize(e,0,0)}},{key:"_findEventPoint",value:function(t){var e=this,n=this.points,i=this._constains,o=this.options,r=o.normalPointStyle,s=o.clusterPointStyle,a=[],u=[];n.forEach(function(t){e._isCluster(t)?a.push(t):u.push(t)});for(var l=0,h=a.length;l<h;l++){var c=a[l];if(i(c.coordinate,t,s))return c}for(var d=0,v=u.length;d<v;d++){var f=u[d];if(i(f.coordinate,t,r))return f}return null}},{key:"_constains",value:function(t,e,n){var i=n.width,o=n.height,r=t.x,s=t.y,a=e.x,u=e.y;return a>=r-i/2&&a<=r+i/2&&u>=s-o/2&&u<=s+o/2}},{key:"_getExtendedBounds",value:function(){var t=this.options,e=t.map,n=t.gridSize,i=e.getZoom(),o=e.getBounds(),r=o.getSouthWest(),a=o.getNorthEast(),u=s([r.lng,r.lat]),l=s([a.lng,a.lat]),h=n*Math.pow(2,18-i);return u.x-=h,u.y-=h,l.x+=h,l.y+=h,[u,l]}},{key:"_pointInScreen",value:function(t,e){var n=i(t,2),o=n[0],r=n[1],s=e.x,a=e.y;return r.x<=0||s>=o.x&&s<=r.x&&a>=o.y&&a<=r.y}},{key:"_isFunction",value:function(t){return"function"==typeof t}},{key:"_isCluster",value:function(t){return t instanceof r}}]),t}();t.ClusterTypes=a,t.default=h,Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=amap-cluster-canvas.umd.js.map
