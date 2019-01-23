# amap-cluster-canvas

> 高德地图点聚合插件 canvas 版本

## 配置项

| 属性                      | 类型       | 描述                                             | 默认值                                                                 |
| ------------------------- | ---------- | ------------------------------------------------ | ---------------------------------------------------------------------- |
| data                      | Array      | 数据集                                           | null                                                                   |
| [coordinate](#Coordinate) | Coordinate | 聚合策略                                         | Coordinate.AMAP                                                        |
| maxZoom                   | Number     | 最大的聚合级别，大于该级别就不进行相应的聚合     | 18                                                                     |
| gridSize                  | Number     | 聚合计算时，网格的像素大小                       | 60                                                                     |
| minClusterSize            | Number     | 聚合的最小数量，小于该数量个点则不能成为一个聚合 | 2                                                                      |
| averageCenter             | Boolean    | 是否取所有点的平均值作为聚合点中心               | true                                                                   |
| zoomOnClick               | Boolean    | 点击聚合点时，是否展开聚合                       | true                                                                   |
| zIndex                    | Number     | canvas 图层的 zindex                             | 120                                                                    |
| visible                   | Boolean    | 是否显示                                         | true                                                                   |
| getPosition               | Function   | 获取经纬度信息                                   | ({location})=>location ? [location.longitude,location.latitude] : null |
| render                    | Function   | 绘制函数                                         | null                                                                   |
| hoverRender               | Function   | hover 状态下的绘制函数                           | null                                                                   |
| clickHandler              | Function   | click 事件                                       | null                                                                   |
| mouseoutHandler           | Function   | mouseout 事件                                    | null                                                                   |
| mouseoverHandler          | Function   | mouseover 事件                                   | null                                                                   |
| mousemoveHandler          | Function   | mousemove 事件                                   | null                                                                   |
| normalPointStyle          | Object     | 实体点的样式                                     | defaultStyle                                                           |
| clusterPointStyle         | Object     | 聚合点的样式                                     | defaultStyle                                                           |
| hoverNormalPointStyle     | Object     | hover 状态下实体点的样式                         | defaultStyle                                                           |
| hoverClusterPointStyle    | Object     | hover 状态下聚合点的样式                         | defaultStyle                                                           |
| 2.0 版本新增              |
| [offset](#offset)         | Array      | 绘制的图形相对于 `定位点` 的偏移度               | null                                                                   |

### Coordinate

> 点的聚合策略：
>
> 1. 根据点在 `地图容器` 上的相对坐标来判断是否需要聚合。
> 2. 根据点在 `墨卡托坐标系` 上的绝对坐标进行聚合。

```js
// cluster.js
export const Coordinate = {
  AMAP: 'AMAP',
  MERCATOR: 'MERCATOR',
}
```

### defaultStyle

> 点的默认样式：因为时间紧迫，并没有提供内置的点绘制功能，样式配置主要是提供点的 `width` & `height` 属性；因为 `canvas` 事件中需要根据点的坐标与点的大小查找当前事件的触发对象。

```js
// 默认的点样式
const defaultStyle = {
  width: 60,
  height: 69,
}
```

### offset

> 绘制的图形相对于 `定位点` 的偏移度。

```ts
// 支持 百分比 || px
const offsetItem = Number | String
const offset = [offsetItem, offsetItem]
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
