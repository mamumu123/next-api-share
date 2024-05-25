### 声明
本文的头像生成部分参考了项目 [txstc55/ugly-avatar](https://github.com/txstc55/ugly-avatar)。


## 效果展示
![](https://github.com/mamumu123/picx-images-hosting/raw/master/截屏2024-05-20-15.44.50.5mnmsiwu1r.webp)

## 体验地址
[demo 体验地址](https://next-api-share.vercel.app)


## 源码地址
[github 地址](https://github.com/mamumu123/next-api-share)

## 项目背景
在浏览社区论坛时，我注意到许多相似的头像，它们虽然并不美观，但却具有鲜明的特点。通过查阅评论，我发现这些头像都是由一个开源的头像生成工具制作的。本文中的头像生成部分，将参考该项目进行讨论。


### 做了哪些优化
- 增设了 API 接口，可以直接返回随机生成的头像；
- 添加了 'id' 和 'username' 参数，通过固定这两个参数，可以确保返回的头像保持一致；
- 增加了 'bg_color' 参数，通过这个参数，可以确保头像的背景色是固定的颜色值；
- 增加了 'o' 参数，通过这个参数，可以指定返回图片的背景透明度；
- 增加了 'w' 和 'h' 参数，通过这个参数，可以指定返回图片的宽度和高度；
- 增加了 'f' 参数，通过这个参数，可以指定返回图片的格式('png', 'webp', 'jpeg')；

### api demo


|需求|参数值|类型（可选项）| demo|
|--|--|--|--|
|随机返回|||<https://next-api-share.vercel.app/api/face> |
|固定背景色|bg_color|rgb、name| <https://next-api-share.vercel.app/api/face?bg_color=rgb(245,245,220)><br/><https://next-api-share.vercel.app/api/face?bg_color=red>|
|透明背景|o|0~1|<https://next-api-share.vercel.app/api/face?o=0>|
|固定返回值|id、username|string|<https://next-api-share.vercel.app/api/face?id=666><br/><https://next-api-share.vercel.app/api/face?username=john>|
|固定宽度或高度|w、h|number|<https://next-api-share.vercel.app/api/face?w=400&h=400>|
|格式|f|png、webp、jpeg|<https://next-api-share.vercel.app/api/face?f=png>|



## 技术细节

### 头像合成
在这个项目中，最核心的部分就是如何生成一个头像图片。这里通过SVG（可缩放矢量图形）来生成的。将整个头像拆分成多个部分，包括脸型、眼睛、鼻子、嘴巴和头发。然后会随机生成这些部分，并随机组合它们。为了保证这些组件在整体上的位置符合逻辑，进行了一些数学计算。这样，每次生成的头像都会有其独特的特点，同时又保持了一定的逻辑性和协调性。
```svg
<svg viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg" width="500" height="500" id="face-svg">
  <g id="mouth">
    <polyline id="faceContour" :points="computedFacePoints" fill="#ffc9a9" stroke="black"/>
  </g>
  <!-- ... -->
  <g id="hairs">
    <polyline v-for="(hair, index) in hairs" :key="index" :points="hair" fill="none" :stroke="hairColor"      :stroke-width="2" stroke-linejoin="round" filter="url(#fuzzy)" />
  </g>
  <!-- ... -->
  <g id="mouth">
    <polyline :points="mouthPoints" fill="rgb(215,127,140)" stroke="black" :stroke-width="3" stroke-linejoin="round"
      filter="url(#fuzzy)" />
  </g>
</svg>
```
这段代码就是动态生成和渲染头像的各个部分的核心代码。

- `<svg>`标签定义了一个SVG的画布，`viewBox`属性定义了视图框的大小和视图框内的坐标系统，`width`和`height`属性定义了SVG的宽度和高度;
- `<g>`标签是一个容器元素，用于将多个元素组合在一起;在这里，它被用来分组和标识头像的不同部分，如头发(hairs)和嘴巴(mouth);
- `<polyline>`标签用于创建只有直线段或曲线段的形状;在这里，它被用来绘制头像的`脸部轮廓(faceContour)`，`头发(hairs)`和`嘴巴(mouth)`。`:points`属性定义了多边形的所有顶点;

### 如何将 vue3 组件移植到服务端返回
在服务端，我们同样可以采用 Vue 框架。通过 Vue，我们能够将渲染结果生成为 HTML 文本并返回:
```js
export const getSvg = async () => {
  // 获取渲染数据
  const data = getImageData();
  const app = createSSRApp({
    template: '<svg>xxxxx</svg>',
    data,
  })
  let svgData = await renderToString(app)
  return svgData;
}
```
在这段代码中，我们首先获取了渲染所需的数据。然后，我们创建了一个服务端渲染应用，并将获取到的数据传入。最后，我们将应用渲染为字符串，并返回这个字符串。

### 如何返回图片类型
如何返回图片类型的数据，以及前端如何解析返回的值，主要取决于`响应头（response header）`中的 `Content-Type` 值。SVG 是一种文本类型，如果我们希望前端将返回的文本视为 SVG 类型的图片，就需要将` Content-Type`设置为 `image/svg+xml`;
```js
const svg = `<svg>xxxx</svg>`
res.status(200).setHeader('Content-Type', 'image/svg+xml').send(svg);
```
我们首先通过计算得到一个 SVG 图片。然后，我们设置了响应的状态码为 200，同时设置了响应头的 `Content-Type` 为 `image/svg+xml`，最后我们将 SVG 图片发送给前端。

### 如何实现对于 id 和 username, 返回的头像是相同的
在生成头像的代码中，我们大量使用了 `Math.random()` 来实现每次生成的头像都不同的效果。然而，Math.random() 生成的是伪随机数，只要固定了种子，生成的随机数就会是固定的。
在这里，我们直接采用了 `id` 和 `username` 作为随机数的种子。这样，对于同一个 `id` 或 `username`，每次生成头像时，结果都会是相同的。
```js
const { id, username } = req.query;
const seed = (id || username || `${Math.random()}`) as string
const rng = seedrandom(seed);
const result = await getSvg(rng);
```

### 其他细节

#### 组件属性大小写问题
viewBox 是一个重要的属性，它定义了 SVG 图形的可视区域；
为了解决这个问题，我们可以在生成 SVG 数据后，通过字符串替换的方式，将 viewbox 替换为正确的 viewBox
```js
svgData = svgData.replace('viewbox', 'viewBox')
```

## TODO
- 引入更多参数，如 hairColor，以确保背景色能够保持固定的颜色值；



## 参考
[ugly-avatar](https://github.com/txstc55/ugly-avatar)


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

## Deploy on Vercel
如果你没有自己的服务端，你可以免费的部署在 vercel 上。
