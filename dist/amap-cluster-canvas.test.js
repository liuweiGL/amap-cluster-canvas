(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
(function () {
  'use strict';

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  /**
   * 为点聚合提供画布
   * @param options
   * {
   *   map: 地图,
   *   zIndex: 图层zIndex,
   *   visible: 是否可见
   * }
   */
  var Canvas = function () {
    function Canvas(options) {
      classCallCheck(this, Canvas);

      this.layer = null;
      this.hoverCanvas = null;
      this.hoverCanvasCtx = null;
      this.clusterCanvas = null;
      this.clusterCanvasCxt = null;
      this.options = options;
      this._init();
    }

    createClass(Canvas, [{
      key: '_init',
      value: function _init() {
        var _options = this.options,
            map = _options.map,
            visible = _options.visible,
            zIndex = _options.zIndex;

        var container = document.createElement('div');
        // 绘制聚合点
        var clusterCanvas = document.createElement('canvas');
        clusterCanvas.style.position = 'absolute';
        // hover状态下的点绘制
        var hoverCanvas = document.createElement('canvas');
        hoverCanvas.style.position = 'absolute';
        container.appendChild(clusterCanvas);
        container.appendChild(hoverCanvas);
        this.clusterCanvas = clusterCanvas;
        this.hoverCanvas = hoverCanvas;
        this.clusterCanvasCxt = clusterCanvas.getContext('2d');
        this.hoverCanvasCtx = hoverCanvas.getContext('2d');

        this.layer = new AMap.CustomLayer(container, {
          map: map,
          zIndex: zIndex,
          visible: visible,
          zooms: [1, 20]
        });
      }
      // 设备像素比

    }, {
      key: 'getPixelRatio',
      value: function getPixelRatio() {
        return Math.min(2, Math.round(window.devicePixelRatio || 1));
      }
      // 设置canvas的width&height属性可以清理画布

    }, {
      key: 'setCanvasSize',
      value: function setCanvasSize(canvas, w, h) {
        var pixelRatio = this.getPixelRatio();
        canvas.width = w * pixelRatio;
        canvas.height = h * pixelRatio;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
      }
      // 清除聚合

    }, {
      key: 'clearCluster',
      value: function clearCluster() {
        var _options$map$getSize = this.options.map.getSize(),
            width = _options$map$getSize.width,
            height = _options$map$getSize.height;

        this.setCanvasSize(this.clusterCanvas, width, height);
      }
    }]);
    return Canvas;
  }();

  var ClusterItem = function () {
    function ClusterItem(point, options) {
      classCallCheck(this, ClusterItem);

      this.coordinate = point.coordinate;
      this.points = [point];
      this.options = options;
    }

    createClass(ClusterItem, [{
      key: "getCount",
      value: function getCount() {
        return this.points.length;
      }
      // 更新聚合点的中心点

    }, {
      key: "updateCenter",
      value: function updateCenter() {
        var points = this.points,
            length = this.points.length,
            _coordinate = this.coordinate,
            centerX = _coordinate.x,
            centerY = _coordinate.y,
            isAverageCenter = this.options.isAverageCenter;

        if (isAverageCenter) {
          var newAddPoint = points[length - 1];
          var _newAddPoint$coordina = newAddPoint.coordinate,
              pointX = _newAddPoint$coordina.x,
              pointY = _newAddPoint$coordina.y;

          var totalX = centerX * (length - 1);
          var totalY = centerY * (length - 1);
          var newCenterX = (totalX + pointX) / length;
          var newCenterY = (totalY + pointY) / length;
          this.coordinate = {
            x: newCenterX,
            y: newCenterY
          };
        }
      }
      // 往聚合中添加点

    }, {
      key: "addPoint",
      value: function addPoint(point) {
        this.points.push(point);
        this.updateCenter();
      }
      // 判断一个点是否在改聚合范围内

    }, {
      key: "contains",
      value: function contains(point) {
        var _point$coordinate = point.coordinate,
            pointX = _point$coordinate.x,
            pointY = _point$coordinate.y;
        var _coordinate2 = this.coordinate,
            centerX = _coordinate2.x,
            centerY = _coordinate2.y,
            gridSize = this.options.gridSize;

        return pointX >= centerX - gridSize && pointX <= centerX + gridSize && pointY >= centerY - gridSize && pointY <= centerY + gridSize;
      }
    }]);
    return ClusterItem;
  }();

  //经纬度转墨卡托
  function lonLat2Mercator(lonLat) {
    var _lonLat = slicedToArray(lonLat, 2),
        longitude = _lonLat[0],
        latitude = _lonLat[1];

    var x = longitude * 20037508.34 / 180;
    var y = Math.log(Math.tan((90 + latitude) * Math.PI / 360)) / (Math.PI / 180);
    y = y * 20037508.34 / 180;
    return {
      x: x,
      y: y
    };
  }
  //墨卡托转经纬度
  function mercator2LonLat(pixel) {
    var x = pixel.x,
        y = pixel.y;

    var longitude = x / 20037508.34 * 180;
    var latitude = y / 20037508.34 * 180;
    latitude = 180 / Math.PI * (2 * Math.atan(Math.exp(latitude * Math.PI / 180)) - Math.PI / 2);

    return [longitude, latitude];
  }

  // 聚合策略
  var ClusterTypes = {
    ZOOM: 'zoom', // 根据缩放层级聚合
    PIXEL: 'pixel' // 根据相对于地图容器的坐标聚合


    // 默认的点样式
  };var defaultStyle = {
    width: 60,
    height: 69
    // 聚合默认设置
  };var defaultOptions = {
    type: ClusterTypes.PIXEL, // 聚合策略
    maxZoom: 18, // 最大的聚合级别，大于该级别就不进行相应的聚合
    gridSize: 60, // 聚合计算时，网格的像素大小
    minClusterSize: 2, // 聚合的最小数量，小于该数量个点则不能成为一个聚合
    averageCenter: true, // 是否取所有点的平均值作为聚合点中心
    zoomOnClick: true, // 点击聚合点时，是否展开聚合
    zIndex: 120, // canvas图层的zindex
    visible: true, // 是否显示
    getPosition: function getPosition(item) {
      // 获取经纬度信息
      var location = item.location;

      return location ? [location.longitude, location.latitude] : null;
    },

    render: null, // 绘制函数
    hoverRender: null, // hover状态下的绘制函数
    // 以下参数主要用于事件系统
    clickHandler: null, // click事件
    mouseoutHandler: null, // mouseout事件
    mouseoverHandler: null, // mouseover事件
    mousemoveHandler: null, // mousemove事件
    normalPointStyle: defaultStyle, // 实体点的样式
    clusterPointStyle: defaultStyle, // 聚合点的样式
    hoverNormalPointStyle: defaultStyle, // hover状态下实体点的样式
    hoverClusterPointStyle: defaultStyle // hover状态下聚合点的样式
  };

  var Cluster = function () {
    function Cluster(options) {
      classCallCheck(this, Cluster);
      var map = options.map,
          data = options.data;

      this.options = Object.assign({}, defaultOptions, options);
      this.points = []; // 聚合点+实体点 = 渲染点
      this.buildFn = null; // 聚合构建器
      this.pixelFn = null; // 还原点坐标到相对地图容器的坐标
      this.lastPixel = {}; // 触发事件的坐标
      this.oldHoverPoint = null; // 触发事件的对象
      this.renderTimer = null;
      this.clusterItems = null;
      this.renderEngine = new Canvas({
        map: map,
        zIndex: this.options.zIndex,
        visible: this.options.visible
      });
      this._init(data);
      this._customEngine();
      this._bindEvent();
    }

    createClass(Cluster, [{
      key: 'renderLater',
      value: function renderLater(delay) {
        if (!this.renderTimer) {
          this.renderTimer = setTimeout(this.render.bind(this), delay || 50);
        }
      }
    }, {
      key: 'render',
      value: function render() {
        var _this = this;

        var points = this.points,
            _options = this.options,
            render = _options.render,
            normalPointStyle = _options.normalPointStyle,
            clusterPointStyle = _options.clusterPointStyle,
            clusterCanvasCxt = this.renderEngine.clusterCanvasCxt;

        if (this.renderTimer) {
          clearTimeout(this.renderTimer);
          this.renderTimer = null;
        }
        {
          console.time('绘制时间：');
        }
        // 清理画布
        this.renderEngine.clearCluster();
        // 绘制
        points.forEach(function (point) {
          var pixel = _this.pixelFn(point.coordinate);
          var x = pixel.x,
              y = pixel.y;

          var isCluster = _this._isCluster(point);
          var style = isCluster ? clusterPointStyle : normalPointStyle;
          var width = style.width,
              height = style.height;
          // 定位到中心位置

          render(clusterCanvasCxt, x - width / 2, y - height / 2, width, height, {
            isCluster: isCluster,
            data: point
          });
        });
        {
          console.timeEnd('绘制时间：');
        }
      }
    }, {
      key: 'setData',
      value: function setData(data) {
        this.data = data;
        this._buildCluster();
        this.render();
      }
    }, {
      key: '_init',
      value: function _init(data) {
        // 根据聚合策略使用不同的聚合构建器
        this._createBuildFn();
        // 把聚合坐标还原为相对于地图容器的坐标
        this._createPixelFn();
        this.setData(data);
      }
    }, {
      key: '_createBuildFn',
      value: function _createBuildFn() {
        var _this2 = this;

        var _options2 = this.options,
            map = _options2.map,
            type = _options2.type,
            gridSize = _options2.gridSize,
            averageCenter = _options2.averageCenter,
            getPosition = _options2.getPosition;

        if (type === ClusterTypes.PIXEL) {
          this.buildFn = function () {
            var bounds = map.getBounds();
            var options = {
              gridSize: gridSize,
              averageCenter: averageCenter
            };
            _this2.data.forEach(function (item) {
              var location = getPosition(item);
              if (location && bounds.contains(location)) {
                // 经纬度转换为相对于地图容器的坐标
                item.coordinate = map.lngLatToContainer(location);
                _this2._buildClusterItem(item, options);
              }
            });
          };
        } else {
          this.buildFn = function () {
            var zoom = map.getZoom();
            var bounds = _this2._getExtendedBounds();
            var options = {
              averageCenter: averageCenter,
              gridSize: gridSize * Math.pow(2, 18 - zoom)
            };
            _this2.data.forEach(function (item) {
              var location = getPosition(item);
              // 反转经纬度的时候使用
              if (location) {
                // 经纬度转换为墨卡托坐标
                if (!item.coordinate) {
                  item.coordinate = lonLat2Mercator(location);
                }
                if (_this2._pointInScreen(bounds, item.coordinate)) {
                  _this2._buildClusterItem(item, options);
                }
              }
            });
          };
        }
      }
    }, {
      key: '_createPixelFn',
      value: function _createPixelFn() {
        var _options3 = this.options,
            type = _options3.type,
            map = _options3.map;

        if (type === ClusterTypes.PIXEL) {
          this.pixelFn = function (coordinate) {
            return coordinate;
          };
        } else {
          this.pixelFn = function (coordinate) {
            // 墨卡托坐标=>经纬度
            var lnglat = mercator2LonLat(coordinate);
            // 经纬度=>相对地图容器的坐标
            return map.lngLatToContainer(lnglat);
          };
        }
      }
    }, {
      key: '_buildCluster',
      value: function _buildCluster() {
        {
          console.time('聚合构建时间：');
        }
        this.clusterItems = [];
        if (this.data) {
          this.buildFn();
          this._updatePoints();
          this.render();
        }
        {
          console.timeEnd('聚合构建时间：');
          console.log('%c构建聚合模块数量：' + this.points.length, 'color: red');
        }
      }
    }, {
      key: '_buildClusterItem',
      value: function _buildClusterItem(point, options) {
        var parent = null;
        var distance = -1; // 当前点与聚合中心的距离
        var _point$coordinate = point.coordinate,
            pointX = _point$coordinate.x,
            pointY = _point$coordinate.y;

        this.clusterItems.forEach(function (clusterItem) {
          if (clusterItem.contains(point)) {
            var _clusterItem$coordina = clusterItem.coordinate,
                centerX = _clusterItem$coordina.x,
                centerY = _clusterItem$coordina.y;

            var currDistance = Math.pow(pointX - centerX, 2) + Math.pow(pointY - centerY, 2);
            if (distance < 0 || distance > currDistance) {
              // 取距离最近的一个聚合
              parent = clusterItem;
              distance = currDistance;
            }
          }
        });
        if (parent) {
          // 该点找到聚合对象
          parent.addPoint(point);
        } else {
          // 以该点为中心创建一个聚合对象
          var clusterItem = new ClusterItem(point, options);
          this.clusterItems.push(clusterItem);
        }
      }
    }, {
      key: '_updatePoints',
      value: function _updatePoints() {
        var clusterItems = this.clusterItems,
            _options4 = this.options,
            map = _options4.map,
            minClusterSize = _options4.minClusterSize,
            maxZoom = _options4.maxZoom;

        if (map.getZoom() >= maxZoom) {
          // 地图放大最大层级，就不存在聚合点了
          this.points = clusterItems.reduce(function (pre, curr) {
            return pre.concat(curr.points);
          }, []);
        } else {
          // 返回的点数据应该是聚合点+实体点
          var points = [];
          clusterItems.forEach(function (clusterItem) {
            if (clusterItem.getCount() >= minClusterSize) {
              // 聚合点
              points.push(clusterItem);
            } else {
              // 实体点
              points = points.concat(clusterItem.points);
            }
          });
          this.points = points;
        }
      }
    }, {
      key: '_customEngine',
      value: function _customEngine() {
        // 重要：当图层发生变动时，自动调用render函数
        this.renderEngine.layer.render = this._buildCluster.bind(this);
      }
    }, {
      key: '_bindEvent',
      value: function _bindEvent() {
        var map = this.options.map;
        // 更新视图
        // map.on('moveend', this._buildCluster.bind(this))
        // map.on('zoomchange', this._buildCluster.bind(this))
        // 实现canvas事件

        map.on('click', this._clickHandler.bind(this)); // => point click 事件
        map.on('mousemove', this._mousemoveHandler.bind(this)); // => point hover 事件
      }
    }, {
      key: '_clickHandler',
      value: function _clickHandler(event) {
        var pixel = event.pixel;

        var point = this._findEventPoint(pixel);
        if (point) {
          var _options5 = this.options,
              zoomOnClick = _options5.zoomOnClick,
              clickHandler = _options5.clickHandler;

          var params = {
            data: point,
            isCluster: this._isCluster(point)
            // 触发 `mouseout`
          };this.mouseoutHandler();
          // 点击聚合点展开聚合
          zoomOnClick && this._zoomOnClickHandler(params);
          this._isFunction(clickHandler) && clickHandler(params);
        }
      }
      // 由`mousemove`衍生出 `mouseout` & `mouseover`

    }, {
      key: '_mousemoveHandler',
      value: function _mousemoveHandler(event) {
        var pixel = event.pixel;
        var lastPixel = this.lastPixel,
            oldHoverPoint = this.oldHoverPoint;

        if (lastPixel.x === pixel.x && lastPixel.y === pixel.y) {
          return;
        }
        var point = this._findEventPoint(pixel);
        if (point === oldHoverPoint) {
          return;
        }
        this.mouseoutHandler(point);
        this.mouseoverHandler(point);
        this.lastPixel = pixel;
      }
    }, {
      key: 'mouseoutHandler',
      value: function mouseoutHandler(point) {
        var oldHoverPoint = this.oldHoverPoint,
            mouseoutHandler = this.options.mouseoutHandler;

        if (oldHoverPoint) {
          this._clearHoverPoint();
          this._isFunction(mouseoutHandler) && mouseoutHandler({
            data: oldHoverPoint,
            isCluster: this._isCluster(oldHoverPoint)
          });
        }
        this.oldHoverPoint = point;
      }
    }, {
      key: 'mouseoverHandler',
      value: function mouseoverHandler(point) {
        if (!point) {
          return;
        }
        var mouseoverHandler = this.options.mouseoverHandler;

        var params = {
          data: point,
          isCluster: this._isCluster(point)
        };
        this._drawHoverPoint(params);
        this._isFunction(mouseoverHandler) && mouseoverHandler(params);
      }
    }, {
      key: '_zoomOnClickHandler',
      value: function _zoomOnClickHandler(data) {
        var isCluster = data.isCluster,
            coordinate = data.data.coordinate;

        if (isCluster) {
          var map = this.options.map,
              pixelFn = this.pixelFn;

          var pixel = pixelFn(coordinate);
          var lnglat = map.containerToLngLat(pixel);
          map.setCenter(lnglat);
          map.zoomIn();
        }
      }
    }, {
      key: '_drawHoverPoint',
      value: function _drawHoverPoint(params) {
        var _options6 = this.options,
            hoverRender = _options6.hoverRender,
            normalPointStyle = _options6.normalPointStyle,
            clusterPointStyle = _options6.clusterPointStyle,
            renderEngine = this.renderEngine,
            _renderEngine = this.renderEngine,
            hoverCanvas = _renderEngine.hoverCanvas,
            hoverCanvasCtx = _renderEngine.hoverCanvasCtx;

        if (this._isFunction(hoverRender)) {
          var margin = 20;
          var isCluster = params.isCluster,
              _params$data$coordina = params.data.coordinate,
              x = _params$data$coordina.x,
              y = _params$data$coordina.y;

          var style = isCluster ? clusterPointStyle : normalPointStyle;
          var width = style.width,
              height = style.height;

          var canvasWidth = width + margin;
          var canvasHeight = height + margin;
          var canvasLeft = x - canvasWidth / 2;
          var canvasTop = y - canvasHeight / 2;
          var pixelRatio = renderEngine.getPixelRatio();
          hoverCanvas.style.left = canvasLeft + 'px';
          hoverCanvas.style.top = canvasTop + 'px';
          hoverCanvas.style.cursor = 'pointer';
          renderEngine.setCanvasSize(hoverCanvas, canvasWidth, canvasHeight);
          hoverCanvasCtx.save();
          hoverCanvasCtx.translate(-canvasLeft * pixelRatio, -canvasTop * pixelRatio);
          hoverRender(hoverCanvasCtx, canvasLeft + margin / 2, canvasTop + margin / 2, width, height, params);
          hoverCanvasCtx.restore();
        }
      }
    }, {
      key: '_clearHoverPoint',
      value: function _clearHoverPoint() {
        var renderEngine = this.renderEngine,
            hoverCanvas = this.renderEngine.hoverCanvas;

        renderEngine.setCanvasSize(hoverCanvas, 0, 0);
      }
    }, {
      key: '_findEventPoint',
      value: function _findEventPoint(mousePoint) {
        var _this3 = this;

        // 查找鼠标下面的点，因为聚合点跟实体点的大小可能不一致，所以要分开查找
        var points = this.points,
            _constains = this._constains,
            _options7 = this.options,
            normalPointStyle = _options7.normalPointStyle,
            clusterPointStyle = _options7.clusterPointStyle;

        var _clusterPoints = [];
        var _normalPoints = [];
        points.forEach(function (item) {
          if (_this3._isCluster(item)) {
            _clusterPoints.push(item);
          } else {
            _normalPoints.push(item);
          }
        });
        for (var i = 0, len1 = _clusterPoints.length; i < len1; i++) {
          var item = _clusterPoints[i];
          if (_constains(item.coordinate, mousePoint, clusterPointStyle)) {
            return item;
          }
        }
        for (var k = 0, len2 = _normalPoints.length; k < len2; k++) {
          var _item = _normalPoints[k];
          if (_constains(_item.coordinate, mousePoint, normalPointStyle)) {
            return _item;
          }
        }
        return null;
      }
    }, {
      key: '_constains',
      value: function _constains(p1, p2, style) {
        // 绘画的时候是以 `p1` 作为中心点
        var width = style.width,
            height = style.height;
        var x1 = p1.x,
            y1 = p1.y;
        var x2 = p2.x,
            y2 = p2.y;

        return x2 >= x1 - width / 2 && x2 <= x1 + width / 2 && y2 >= y1 - height / 2 && y2 <= y1 + height / 2;
      }
    }, {
      key: '_getExtendedBounds',
      value: function _getExtendedBounds() {
        var _options8 = this.options,
            map = _options8.map,
            gridSize = _options8.gridSize;

        var zoom = map.getZoom();
        var bounds = map.getBounds();
        var southWest = bounds.getSouthWest();
        var northEast = bounds.getNorthEast();
        // 上右
        var tr = lonLat2Mercator([southWest.lng, southWest.lat]);
        // 下左
        var bl = lonLat2Mercator([northEast.lng, northEast.lat]);
        var _gridSize = gridSize * Math.pow(2, 18 - zoom);
        tr.x -= _gridSize;
        tr.y -= _gridSize;
        bl.x += _gridSize;
        bl.y += _gridSize;
        return [tr, bl];
      }
    }, {
      key: '_pointInScreen',
      value: function _pointInScreen(bounds, coordinate) {
        var _bounds = slicedToArray(bounds, 2),
            tr = _bounds[0],
            bl = _bounds[1];

        var x = coordinate.x,
            y = coordinate.y;

        return bl.x <= 0 || x >= tr.x && x <= bl.x && y >= tr.y && y <= bl.y;
      }
    }, {
      key: '_isFunction',
      value: function _isFunction(fn) {
        return typeof fn === 'function';
      }
    }, {
      key: '_isCluster',
      value: function _isCluster(point) {
        return point instanceof ClusterItem;
      }
    }]);
    return Cluster;
  }();

  // import Cluster from './lib/cluster'

  function drawCircle(ctx, x, y, r) {
    var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'red';

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawText(ctx, x, y, text) {
    var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'white';

    ctx.font = '18px SimHei';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }

  function random(basic, offset) {
    var change = Math.random() * offset;
    change = Math.random() > 0.5 ? change : -change;
    return basic + change;
  }

  var data = [];
  var longitude = 117.000923;
  var latitude = 36.675807;
  for (var i = 0; i < 100000; i++) {
    data.push([random(longitude, 5), random(latitude, 5)]);
  }
  var map = new AMap.Map('container', {
    zoom: 11,
    center: [longitude, latitude]
  });
  // `cluster` 依赖 `AMap.CustomLayer`
  AMap.plugin('AMap.CustomLayer', function () {
    var cluster = new Cluster({
      map: map,
      data: data,
      type: 'zoom',
      getPosition: function getPosition(item) {
        return item;
      },
      render: function render(ctx, x, y, width, height, point) {
        var isCluster = point.isCluster,
            data = point.data;

        if (isCluster) {
          drawCircle(ctx, x, y, width / 2);
          drawText(ctx, x, y, data.getCount());
        } else {
          drawCircle(ctx, x, y, width / 6, 'green');
        }
      }
    });
    window.cluster = cluster;
  });

}());
//# sourceMappingURL=amap-cluster-canvas.test.js.map
