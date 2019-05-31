
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
(function () {
  'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
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
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  /**
   * 为点聚合提供画布
   * @param options
   * {
   *   map: 地图,
   *   zIndex: 图层zIndex,
   *   visible: 是否可见
   * }
   */
  var Canvas =
  /*#__PURE__*/
  function () {
    function Canvas(options) {
      _classCallCheck(this, Canvas);

      this.layer = null;
      this.hoverCanvas = null;
      this.hoverCanvasCtx = null;
      this.clusterCanvas = null;
      this.clusterCanvasCxt = null;
      this.options = options;
      this.pixelRatio = this.getPixelRatio();
      this.init();
    }

    _createClass(Canvas, [{
      key: "init",
      value: function init() {
        var _this$options = this.options,
            map = _this$options.map,
            visible = _this$options.visible,
            zIndex = _this$options.zIndex,
            render = _this$options.render;
        var container = document.createElement('div'); // 绘制聚合点

        var clusterCanvas = document.createElement('canvas');
        clusterCanvas.style.position = 'absolute'; // hover状态下的点绘制

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
        this.layer.render = render;
      } // 设备像素比

    }, {
      key: "getPixelRatio",
      value: function getPixelRatio() {
        return Math.min(2, Math.round(window.devicePixelRatio || 1));
      } // 设置canvas的width&height属性可以清理画布

    }, {
      key: "setCanvasSize",
      value: function setCanvasSize(canvas, w, h) {
        var pixelRatio = this.pixelRatio;
        canvas.width = w * pixelRatio;
        canvas.height = h * pixelRatio;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
      }
    }]);

    return Canvas;
  }();

  var ClusterItem =
  /*#__PURE__*/
  function () {
    function ClusterItem(point, options) {
      _classCallCheck(this, ClusterItem);

      this.renderPixel = null;
      this.points = [point];
      this.coordinate = point.coordinate;
      this.averageCenter = options.averageCenter;
      this.coordinateEngine = options.coordinateEngine;
    }

    _createClass(ClusterItem, [{
      key: "getCount",
      value: function getCount() {
        return this.points.length;
      } // 更新聚合点的中心点

    }, {
      key: "updateCenter",
      value: function updateCenter() {
        var averageCenter = this.averageCenter,
            points = this.points,
            length = this.points.length,
            _this$coordinate = this.coordinate,
            centerX = _this$coordinate.x,
            centerY = _this$coordinate.y;

        if (averageCenter) {
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
          this.renderPixel = this.coordinateEngine.coordinateToPixel(this);
        } else {
          var centerPoint = this.points[0];
          this.coordinate = centerPoint.coordinate;
          this.renderPixel = centerPoint.renderPixel;
        }
      } // 往聚合中添加点

    }, {
      key: "addPoint",
      value: function addPoint(point) {
        this.points.push(point);
        this.updateCenter();
      } // 判断一个点是否在改聚合范围内

    }, {
      key: "contains",
      value: function contains(point) {
        var _point$coordinate = point.coordinate,
            pointX = _point$coordinate.x,
            pointY = _point$coordinate.y;
        var _this$coordinate2 = this.coordinate,
            centerX = _this$coordinate2.x,
            centerY = _this$coordinate2.y;
        var gridSize = this.coordinateEngine.getGridSize();
        return pointX >= centerX - gridSize && pointX <= centerX + gridSize && pointY >= centerY - gridSize && pointY <= centerY + gridSize;
      }
    }]);

    return ClusterItem;
  }();

  var AmapCoordinate =
  /*#__PURE__*/
  function () {
    function AmapCoordinate(options) {
      _classCallCheck(this, AmapCoordinate);

      this.map = options.map;
      this.gridSize = options.gridSize;
    }

    _createClass(AmapCoordinate, [{
      key: "getGridSize",
      value: function getGridSize() {
        return this.gridSize;
      }
    }, {
      key: "getRenderData",
      value: function getRenderData(data) {
        var _this = this;

        var renderData = [];
        var bounds = this.map.getBounds();
        data.forEach(function (item) {
          if (bounds.contains(item.position)) {
            // 经纬度转换为相对于地图容器的坐标
            var coordinate = _this.map.lngLatToContainer(item.position);

            renderData.push(_objectSpread({}, item, {
              coordinate: coordinate,
              renderPixel: coordinate
            }));
          }
        });
        return renderData;
      }
    }, {
      key: "coordinateToPixel",
      value: function coordinateToPixel(point) {
        return point.coordinate;
      }
    }]);

    return AmapCoordinate;
  }();

  // 经纬度转墨卡托
  function lonLat2Mercator(lonLat) {
    var _lonLat = _slicedToArray(lonLat, 2),
        longitude = _lonLat[0],
        latitude = _lonLat[1];

    var x = longitude * 20037508.34 / 180;
    var y = Math.log(Math.tan((90 + latitude) * Math.PI / 360)) / (Math.PI / 180);
    y = y * 20037508.34 / 180;
    return {
      x: x,
      y: y
    };
  } // 墨卡托转经纬度

  function mercator2LonLat(pixel) {
    var x = pixel.x,
        y = pixel.y;
    var longitude = x / 20037508.34 * 180;
    var latitude = y / 20037508.34 * 180;
    latitude = 180 / Math.PI * (2 * Math.atan(Math.exp(latitude * Math.PI / 180)) - Math.PI / 2);
    return [longitude, latitude];
  }
  /**
   * 获取 offset 的值
   * @param {number} value
   * @param {any} offset
   * 1. offset 纯数字
   * 2. offset 百分比
   * 3. 默认返回 Number.parseFloat 的值
   */

  function getOffsetValue(value, offset) {
    var type = _typeof(offset);

    switch (type) {
      case 'number':
        return offset;

      case 'string':
        var _offset = offset.trim();

        if (_offset.substr(-1) === '%') {
          return value * (Number.parseFloat(offset) / 100);
        }

        return Number.parseFloat(offset);

      default:
        return Number.parseFloat(offset);
    }
  } // 解析 offset 参数


  function getOffset(style, offset) {
    if (!Array.isArray(offset)) {
      return [0, 0];
    }

    var width = style.width,
        height = style.height;
    return [getOffsetValue(width, offset[0]), getOffsetValue(height, offset[1])];
  }

  var MercatorCoordinate =
  /*#__PURE__*/
  function () {
    function MercatorCoordinate(options) {
      _classCallCheck(this, MercatorCoordinate);

      this.map = options.map;
      this.gridSize = options.gridSize;
    }

    _createClass(MercatorCoordinate, [{
      key: "getGridSize",
      value: function getGridSize() {
        return this.gridSize * Math.pow(2, 18 - this.map.getZoom());
      }
    }, {
      key: "getRenderData",
      value: function getRenderData(data) {
        var _this = this;

        var renderData = [];
        var bounds = this.getExtendedBounds();
        data.forEach(function (item) {
          var coordinate = item.coordinate,
              renderPixel = item.renderPixel;

          if (!coordinate) {
            coordinate = lonLat2Mercator(item.position);
            renderPixel = _this.coordinateToPixel(item);
          }

          if (_this.contains(bounds, coordinate)) {
            renderData.push(_objectSpread({}, item, {
              coordinate: coordinate,
              renderPixel: renderPixel
            }));
          }
        });
        return renderData;
      }
    }, {
      key: "getExtendedBounds",
      value: function getExtendedBounds() {
        var gridSize = this.getGridSize();
        var bounds = this.map.getBounds();
        var southWest = bounds.getSouthWest();
        var northEast = bounds.getNorthEast(); // 上右

        var tr = lonLat2Mercator([southWest.lng, southWest.lat]); // 下左

        var bl = lonLat2Mercator([northEast.lng, northEast.lat]);
        tr.x -= gridSize;
        tr.y -= gridSize;
        bl.x += gridSize;
        bl.y += gridSize;
        return [tr, bl];
      }
    }, {
      key: "coordinateToPixel",
      value: function coordinateToPixel(point) {
        return this.map.lngLatToContainer(point.position || mercator2LonLat(point.coordinate));
      }
    }, {
      key: "contains",
      value: function contains(bounds, coordinate) {
        var _bounds = _slicedToArray(bounds, 2),
            tr = _bounds[0],
            bl = _bounds[1];

        var x = coordinate.x,
            y = coordinate.y; // 小于等于0 ：地图缩放到最小，世界地图都在视图内

        return bl.x <= 0 || x >= tr.x && x <= bl.x && y >= tr.y && y <= bl.y;
      }
    }]);

    return MercatorCoordinate;
  }();

  var Event =
  /*#__PURE__*/
  function () {
    function Event(cluster) {
      _classCallCheck(this, Event);

      this.hoverPoint = null;
      this.cluster = cluster;
      this.map = cluster.options.map;
      this.click = cluster.options.clickHandler;
      this.mouseout = cluster.options.mouseoutHandler;
      this.mouseover = cluster.options.mouseoverHandler;
      this.mousemove = cluster.options.mousemoveHandler;
      this.zoomOnClick = cluster.options.zoomOnClick;
      this.initEvent();
    }

    _createClass(Event, [{
      key: "initEvent",
      value: function initEvent() {
        this.map.on('click', this.clickHandler.bind(this));
        this.map.on('mousemove', this.mousemoveHandler.bind(this));
        this.map.on('zoomstart', this.zoomstartHandler.bind(this));
      }
    }, {
      key: "clickHandler",
      value: function clickHandler(event) {
        var pixel = event.pixel;
        var point = this.findPoint(pixel);

        if (point) {
          var params = this.cluster.getParams(point); // 触发 `mouseout`

          this.mouseoutHandler(point); // 点击聚合点展开聚合

          this.zoomOnClick && params.isCluster && this.zoomOnClickHandler(point);
          this.cluster.isFunction(this.click) && this.click(params);
        }
      } // 由`mousemove`衍生出 `mouseout` & `mouseover`

    }, {
      key: "mousemoveHandler",
      value: function mousemoveHandler(event) {
        var pixel = event.pixel;
        var hoverPoint = this.hoverPoint;
        var point = this.findPoint(pixel); // 先触发 mouseout 事件

        if (hoverPoint && !this.constains(hoverPoint, pixel)) {
          this.mouseoutHandler();
        } // 后触发 mouseover 事件


        if (point && hoverPoint !== point) {
          this.mouseoverHandler(point);
        }

        this.cluster.isFunction(this.mousemove) && this.mousemove(event, point);
      }
    }, {
      key: "mouseoverHandler",
      value: function mouseoverHandler(point) {
        this.hoverPoint = point;
        var params = this.cluster.getParams(point);
        this.cluster.renderHoverPoint(params);
        this.cluster.isFunction(this.mouseover) && this.mouseover(params);
      }
    }, {
      key: "mouseoutHandler",
      value: function mouseoutHandler() {
        this.hoverPoint = null;
        this.cluster.clearHoverPoint();
        this.cluster.isFunction(this.mouseout) && this.mouseout(this.cluster.getParams(this.hoverPoint));
      }
    }, {
      key: "zoomstartHandler",
      value: function zoomstartHandler() {
        this.mouseoutHandler();
      }
    }, {
      key: "zoomOnClickHandler",
      value: function zoomOnClickHandler(point) {
        var _point$renderPixel = point.renderPixel,
            x = _point$renderPixel.x,
            y = _point$renderPixel.y;
        var pixel = new AMap.Pixel(x, y);
        var lnglat = this.map.containerToLngLat(pixel);
        this.map.setCenter(lnglat);
        this.map.zoomIn();
      } // 查找鼠标下面的点，因为聚合点跟实体点的大小可能不一致，所以要分开查找

    }, {
      key: "findPoint",
      value: function findPoint(eventPixel) {
        var data = this.cluster.getPoints();
        var length = data.length;

        for (var i = 0; i < length; i++) {
          var point = data[i];

          if (this.constains(point, eventPixel)) {
            return point;
          }
        }

        return null;
      } // pixel 坐标是否在 point 范围内

    }, {
      key: "constains",
      value: function constains(point, pixel) {
        var params = this.cluster.getParams(point);

        var _params$offset = _slicedToArray(params.offset, 2),
            offsetX = _params$offset[0],
            offsetY = _params$offset[1],
            _params$style = params.style,
            width = _params$style.width,
            height = _params$style.height;

        var _point$renderPixel2 = point.renderPixel,
            x1 = _point$renderPixel2.x,
            y1 = _point$renderPixel2.y;
        var x2 = pixel.x,
            y2 = pixel.y;
        return x2 >= x1 + offsetX && x2 <= x1 + width + offsetX && y2 >= y1 + offsetY && y2 <= y1 + height + offsetY;
      }
    }]);

    return Event;
  }();

  var Coordinate = {
    MERCATOR: 'MERCATOR',
    // 使用 墨卡托 坐标系
    AMAP: 'AMAP' // 使用高德地图容器的相对坐标
    // 默认的点样式

  };
  var defaultStyle = {
    width: 60,
    height: 69 // 聚合默认设置

  };
  var defaultOptions = {
    data: null,
    // 数据集
    coordinate: Coordinate.AMAP,
    // 聚合策略
    maxZoom: 18,
    // 最大的聚合级别，大于该级别就不进行相应的聚合
    gridSize: 60,
    // 聚合计算时，网格的像素大小
    minClusterSize: 2,
    // 聚合的最小数量，小于该数量个点则不能成为一个聚合
    averageCenter: true,
    // 是否取所有点的平均值作为聚合点中心
    zoomOnClick: true,
    // 点击聚合点时，是否展开聚合
    zIndex: 120,
    // canvas图层的zindex
    visible: true,
    // 是否显示
    offset: null,
    // 绘制图形相对于定位点的偏移度
    getPosition: function getPosition(item) {
      // 获取经纬度信息
      var location = item.location;

      var _ref = location || {},
          longitude = _ref.longitude,
          latitude = _ref.latitude;

      return longitude && latitude ? [longitude, latitude] : null;
    },
    render: null,
    // 绘制函数
    hoverRender: null,
    // hover状态下的绘制函数
    // 以下参数主要用于事件系统
    clickHandler: null,
    // click事件
    mouseoutHandler: null,
    // mouseout事件
    mouseoverHandler: null,
    // mouseover事件
    mousemoveHandler: null,
    // mousemove事件
    normalPointStyle: defaultStyle,
    // 实体点的样式
    clusterPointStyle: defaultStyle,
    // 聚合点的样式
    hoverNormalPointStyle: defaultStyle,
    // hover状态下实体点的样式
    hoverClusterPointStyle: defaultStyle // hover状态下聚合点的样式

  };

  var Cluster =
  /*#__PURE__*/
  function () {
    function Cluster(options) {
      _classCallCheck(this, Cluster);

      this.data = null;
      this.points = [];
      this.renderData = null;
      this.clusterItems = null;
      this.options = Object.assign({}, defaultOptions, options); // 解除 data 引用

      this.options.data = null;
      this.normalOffset = getOffset(this.options.normalPointStyle, options.offset);
      this.clusterOffset = getOffset(this.options.clusterPointStyle, options.offset);
      this.eventEngine = new Event(this);
      this.renderEngine = new Canvas({
        map: this.options.map,
        zIndex: this.options.zIndex,
        visible: this.options.visible,
        render: this.build.bind(this)
      });
      this.coordinateEngine = this.options.coordinate === Coordinate.AMAP ? new AmapCoordinate(this.options) : new MercatorCoordinate(this.options);
      this.setData(options.data, false);
    }

    _createClass(Cluster, [{
      key: "setData",
      value: function setData(data) {
        var _this = this;

        var rebuild = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var getPosition = this.options.getPosition;
        this.data = [];

        if (data) {
          data.forEach(function (item) {
            var position = getPosition(item);

            if (position) {
              item.position = position;

              _this.data.push(item);
            }
          });
        }

        if (rebuild) {
          this.build();
        }
      }
    }, {
      key: "build",
      value: function build() {
        {
          console.time('聚合构建时间：');
        }

        this.buildCusterItem();
        this.updatePoints();
        this.render();

        {
          console.timeEnd('聚合构建时间：');
          console.log('%c构建聚合模块数量：' + this.points.length, 'color: red');
        }
      }
    }, {
      key: "buildCusterItem",
      value: function buildCusterItem() {
        var _this2 = this;

        var options = {
          coordinateEngine: this.coordinateEngine,
          averageCenter: this.options.averageCenter
        };
        this.clusterItems = [];
        this.renderData = this.coordinateEngine.getRenderData(this.data);
        this.renderData.forEach(function (point) {
          var parent = null;
          var distance = -1; // 当前点与聚合中心的距离

          var _point$coordinate = point.coordinate,
              pointX = _point$coordinate.x,
              pointY = _point$coordinate.y;

          _this2.clusterItems.forEach(function (clusterItem) {
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

            _this2.clusterItems.push(clusterItem);
          }
        });
      }
    }, {
      key: "updatePoints",
      value: function updatePoints() {
        var clusterItems = this.clusterItems,
            _this$options = this.options,
            map = _this$options.map,
            minClusterSize = _this$options.minClusterSize,
            maxZoom = _this$options.maxZoom;

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
      key: "renderLater",
      value: function renderLater(delay) {
        if (!this.renderTimer) {
          this.renderTimer = setTimeout(this.render.bind(this), delay || 50);
        }
      }
    }, {
      key: "render",
      value: function render() {
        var _this3 = this;

        var points = this.points,
            render = this.options.render,
            _this$renderEngine = this.renderEngine,
            pixelRatio = _this$renderEngine.pixelRatio,
            clusterCanvasCxt = _this$renderEngine.clusterCanvasCxt;

        if (!this.isFunction(render)) {
          return;
        }

        if (this.renderTimer) {
          clearTimeout(this.renderTimer);
          this.renderTimer = null;
        }

        {
          console.time('绘制时间：');
        } // 清理画布


        this.clearCluster(); // 绘制

        points.forEach(function (point, index) {
          var params = _this3.getParams(point);

          params.index = index; // 定位到中心位置

          render(clusterCanvasCxt, point.renderPixel.x * pixelRatio, point.renderPixel.y * pixelRatio, params.style.width, params.style.height, params, points);
        });

        {
          console.timeEnd('绘制时间：');
        }
      }
    }, {
      key: "renderHoverPoint",
      value: function renderHoverPoint(params) {
        if (this.isFunction(this.options.hoverRender)) {
          var isCluster = params.isCluster,
              _params$data$renderPi = params.data.renderPixel,
              x = _params$data$renderPi.x,
              y = _params$data$renderPi.y;
          var renderEngine = this.renderEngine,
              hoverCanvasCtx = this.renderEngine.hoverCanvasCtx,
              _this$options2 = this.options,
              hoverRender = _this$options2.hoverRender,
              hoverNormalPointStyle = _this$options2.hoverNormalPointStyle,
              hoverClusterPointStyle = _this$options2.hoverClusterPointStyle;
          var style = isCluster ? hoverClusterPointStyle : hoverNormalPointStyle;
          var width = style.width,
              height = style.height;
          var pixelRatio = renderEngine.getPixelRatio();
          var canvasLeft = x * pixelRatio;
          var canvasTop = y * pixelRatio;
          hoverRender(hoverCanvasCtx, canvasLeft, canvasTop, width, height, params);
        }
      } // 清除聚合

    }, {
      key: "clearCluster",
      value: function clearCluster() {
        var renderEngine = this.renderEngine,
            clusterCanvas = this.renderEngine.clusterCanvas,
            map = this.options.map;

        var _map$getSize = map.getSize(),
            width = _map$getSize.width,
            height = _map$getSize.height;

        renderEngine.setCanvasSize(clusterCanvas, width, height);
      } // 清除 hover 点

    }, {
      key: "clearHoverPoint",
      value: function clearHoverPoint() {
        var renderEngine = this.renderEngine,
            hoverCanvas = this.renderEngine.hoverCanvas,
            map = this.options.map;

        var _map$getSize2 = map.getSize(),
            width = _map$getSize2.width,
            height = _map$getSize2.height;

        renderEngine.setCanvasSize(hoverCanvas, width, height);
      }
    }, {
      key: "getPoints",
      value: function getPoints() {
        return this.points;
      }
    }, {
      key: "getParams",
      value: function getParams(point) {
        var offset = this.normalOffset;
        var style = this.options.normalPointStyle;
        var isCluster = this.isCluster(point);

        if (isCluster) {
          offset = this.clusterOffset;
          style = this.options.clusterPointStyle;
        }

        return {
          isCluster: isCluster,
          offset: offset,
          style: style,
          data: point
        };
      }
    }, {
      key: "isCluster",
      value: function isCluster(point) {
        return point instanceof ClusterItem;
      }
    }, {
      key: "isFunction",
      value: function isFunction(fn) {
        return typeof fn === 'function';
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

  for (var i = 0; i < 1000; i++) {
    data.push([random(longitude, 5), random(latitude, 5)]);
  }

  function initCanvasCluster(options) {
    // `cluster` 依赖 `AMap.CustomLayer`
    AMap.plugin('AMap.CustomLayer', function () {
      var cluster = new Cluster({
        data: data,
        gridSize: 80,
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
        getPosition: function getPosition(item) {
          return item;
        },
        mousemoveHandler: function mousemoveHandler(event, data) {// console.log( 'mousemove: ', {event,data} )
        },
        mouseoutHandler: function mouseoutHandler(data) {// console.log( 'mouseout: ', data )
        },
        mouseoverHandler: function mouseoverHandler(data) {// console.log( 'mouseover: ', data )
        },
        render: function render(ctx, x, y, width, height, point) {
          /**
           * 因为绘制圆，`定位点` 是作为圆心，所以默认相当于偏于了 [-50%,-50%]；
           * 要把图形绘制到 `定位点` 上方，还需要再 Y 轴上面添加 -50% 的偏移度
           * offset: [-50%, -100%] 就完成了 `定位点` 在图形正下方
           */
          var isCluster = point.isCluster,
              data = point.data;
          var r = width / 2;
          var centerX = x;
          var centerY = y - r - 3;

          if (isCluster) {
            drawCircle(ctx, centerX, centerY, r);
            drawText(ctx, centerX, centerY, data.getCount()); // 定位点

            drawCircle(ctx, x, y, 3, 'green');
          } else {
            drawCircle(ctx, centerX, centerY, r, 'green');
          }
        },
        hoverRender: function hoverRender(ctx, x, y, width, height, point) {
          var isCluster = point.isCluster,
              data = point.data;
          var r = width / 2;
          var centerX = x;
          var centerY = y - r - 3;

          if (isCluster) {
            drawCircle(ctx, centerX, centerY, r, 'white');
            drawText(ctx, centerX, centerY, data.getCount(), 'red');
          } else {
            drawCircle(ctx, centerX, centerY, r, 'blue');
          }
        }
      });
      window.cluster = cluster;
    });
  }

  var amapMap = new AMap.Map('amap', {
    zoom: 6,
    center: [longitude, latitude]
  });
  var mercatorMap = new AMap.Map('mercator', {
    zoom: 6,
    center: [longitude, latitude]
  });
  var markerMap = new AMap.Map('marker', {
    zoom: 6,
    center: [longitude, latitude]
  });
  initCanvasCluster({
    map: amapMap,
    type: Coordinate.AMAP
  }); // initCanvasCluster({
  //   map: mercatorMap,
  //   type: Coordinate.MERCATOR,
  // })
  // initAmapCluster(markerMap)

}());
//# sourceMappingURL=amap-cluster-canvas.test.js.map
