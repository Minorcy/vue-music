# Minorcy云音乐

##技术栈
```
Vue：用于构建用户界面的 MVVM 框架
vue-router：为单页面应用提供的路由系统，使用了 Lazy Loading Routes 技术来实现异步加载优化性能
vuex：Vue 集中状态管理，在多个组件共享某些状态时非常便捷
vue-lazyload：实现图片懒加载，节省用户流量，优化页面加载速度
better-scroll：解决移动端各种滚动场景需求的插件，使移动端滑动体验更加流畅
less：less 预编译处理器
ES6：ECMAScript 新一代语法，模块化、解构赋值、Promise、Class 等方法非常好用
```
##实现功能
```
播放器内核、推荐页面、热榜页面、歌手页面、歌单详情、歌手详情、排行榜详情、搜索页面、播放列表、用户中心等等功能。
```
##推荐页面
```
推荐页分成三个部分，分别是 banner 轮播图、推荐歌单、推荐歌曲，数据都是使用 axios 请求 API 获取得到的，图片都使用 vue-lazyload 实现懒加载。

轮播图：使用 better-scroll 实现，具体可以看这里 Slide 。点击跳转方面只实现歌曲和歌单的跳转，因为暂时只实现了这两个功能。

推荐歌单，推荐歌曲：使用 vuex 管理数据，方便组件之间的数据交互（播放器播放歌曲）.
```
##排行榜页面
```
同样是通过 API 获取到排行榜的数据，但是因为 API 获取到的是排行榜中所有歌曲的数据，所以难免在加载速度上有点慢，后期再看能不能优化一下，加载的慢毕竟太影响用户体验了，别的就没什么了。
```
##歌手页面
```
实现歌手列表的左右联动
```
##歌曲列表组件
```
用来显示歌曲列表，在很多的地方都进行了复用，例如：歌单详情页、排行榜详情页、歌手详情页、搜索结果、用户中心等等。
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
