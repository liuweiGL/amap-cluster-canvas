# amap-cluster-canvas

> 高德地图点聚合插件 canvas 版本，因为跟官方的聚合插件是同一个策略，所以数据量到
> 十万就有点卡顿了，需要引入`woker`处理聚合计算。

## 配置项

| 属性                   | 类型         | 描述                                             | 默认值                                                                    |
| ---------------------- | ------------ | ------------------------------------------------ | ------------------------------------------------------------------------- |
| type                   | ClusterTypes | 聚合策略                                         | ClusterTypes.PIXEL                                                        |
| maxZoom                | Number       | 最大的聚合级别，大于该级别就不进行相应的聚合     | 18                                                                        |
| gridSize               | Number       | 聚合计算时，网格的像素大小                       | 60                                                                        |
| minClusterSize         | Number       | 聚合的最小数量，小于该数量个点则不能成为一个聚合 | 2                                                                         |
| averageCenter          | Boolean      | 是否取所有点的平均值作为聚合点中心               | true                                                                      |
| zoomOnClick            | Boolean      | 点击聚合点时，是否展开聚合                       | true                                                                      |
| zIndex                 | Number       | canvas图层的zindex                               | 120                                                                       |
| visible                | Boolean      | 是否显示                                         | true                                                                      |
| getPosition            | Function     | 获取经纬度信息                                   | ({location})=>location ? [location.longitude,location.latitude] : null  } |
| render                 | Function     | 绘制函数                                         | null                                                                      |
| hoverRender            | Function     | hover状态下的绘制函数                            | null                                                                      |
| clickHandler           | Function     | click事件                                        | null                                                                      |
| mouseoutHandler        | Function     | mouseout事件                                     | null                                                                      |
| mouseoverHandler       | Function     | mouseover事件                                    | null                                                                      |
| mousemoveHandler       | Function     | mousemove事件                                    | null                                                                      |
| normalPointStyle       | Object       | 实体点的样式                                     | defaultStyle                                                              |
| clusterPointStyle      | Object       | 聚合点的样式                                     | defaultStyle                                                              |
| hoverNormalPointStyle  | Object       | hover状态下实体点的样式                          | defaultStyle                                                              |
| hoverClusterPointStyle | Object       | hover状态下聚合点的样式                          | defaultStyle                                                              |

## 声明

### ClusterTypes

> 点的聚合策略：
> 默认是根据点在`地图容器`上的相对坐标来判断是否需要聚合；这种策略的聚合效果就是 `实体点` + `聚合点` 混合显示。
> 第二种是根据点在 `墨卡托坐标系` 上的绝对坐标进行聚合，也就是根据地图的 `zoom` 聚合，聚合效果为全为 `聚合点` 或 `实体点`。

``` js
// cluster.js
export const ClusterTypes = {
  ZOOM: 'zoom', // 根据缩放层级聚合
  PIXEL: 'pixel' // 根据相对于地图容器的坐标聚合，默认策略
}

```

### defaultStyle

> 点的默认样式：
> 因为时间紧迫，并没有提供内置的点绘制功能，样式配置主要是提供点的 `width` & `height` 属性；因为 `canvas` 事件中需要根据点的坐标与点的大小查找当前事件的触发对象。

```js

// 默认的点样式
const defaultStyle = {
  width: 60,
  height: 69
}

```

### 事件

> 直接使用参数的形式进行事件处理，简单暴力。

## 测试

```bash

1、git clone git@github.com:liuweiGL/amap-cluster-canvas.git
2、npm install
3、npm start

```

## 打包

```bash

npm run build

```