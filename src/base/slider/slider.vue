<template>
  <div class="slider" ref="slider"><!--ref相当于一个id方便获取-->
      <div class="slider-grop" ref="sliderGroup">
          <slot></slot>
      </div>
      <div class="dots">
          <span class="dot" v-for="(item,index) in dots" :class="{active:currentPageIndex===index}"></span>
      </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import {addClass} from '../../common/js/dom'
export default {
  name: 'slider',
  data() {
    return {
      dots: [], // 用于存储dot的个数   方便于页面循环
      currentPageIndex: 0// 表示当前第几页
    }
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  mounted() {
    setTimeout(() => { // 保证dom刷新完成在加载里面的事情   可以是this.nextTivl
        // 在dom加载完成页面已经刷新出来，调用这两个宽度
      this._setSliderWidth()
      this._initDots()// 初始化dots使他的个数与轮播图片的个数一致
      this._initSlider()// 初始化slider滚动
      if (this.autoPlay) {
        this._play()// 调用给dots定义个自动轮播的功能
      }
    }, 20)
    // 监听一个resize窗口改变事件  然后改变slider 的宽度
    window.addEventListener('resize', () => { // resize对浏览器窗口进行计数
      if (!this.slider) { // slider如果还没有初始化
        return
      }
      this._setSliderWidth(true)
      // slider的宽度发生变化重新refresh（）
      this.slider.refresh()
    })
  },
  methods: {
    // 横向滚动在初始化之前设置slider的宽度
    _setSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children// 1.获取轮播图片的个数
      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth// 2.获取轮播图父元素的宽度
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')
        child.style.width = sliderWidth + 'px'// 3.给每个轮播图赋值上宽度
        width += sliderWidth
      }
      if (this.loop && !isResize) { // 这里的意思是指当有自动轮播的时候，better-scroll会自动在首尾添加两个dom。这里的意思就是加上这两个dom的苦啊
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'// 4.给父元素赋值上宽度
    },
    // 初始化slider
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true, // 允许横向滚动
        scrollY: false,
        momentum: false, // 符合惯性拖动的距离
        snap: true, // 在首尾添加两个图片
        snapLoop: this.loop, // 循环的无缝轮播
        snapThreshold: 0.3, // 切换图片时的速度
        snapSpeed: 400 // 切换轮播时执行的时间
        // click: true 会阻止浏览器的click事件
      })
      // 用于图片轮播结束
      this.slider.on('scrollEnd', () => { // 绑定滚动完毕的事件
        let pageIndex = this.slider.getCurrentPage().pageX// 当snap为true时获取当前页,其中pagex与pagey代表横向或者是纵向滚动的位置
        if (this.loop) {
          pageIndex -= 1
        }
        // dotsend
        this.currentPageIndex = pageIndex
        // 自动轮播前，清除一下自动轮播代码  不然会很奇怪
        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    _initDots() {
      this.dots = new Array(this.children.length)// dots的长度
    },
    _play() {
      let pageIndex = this.currentPageIndex + 1
      if (this.loop) {
        pageIndex += 1
      }
      this.timer = setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400)// 当snap为true的时候，滚动到对应的界面goToPage(x, y, time, easing)x
        // x,y是指横向或者是纵向页面的索引，time是表示动画，easing表示欢动函数
      }, this.interval)
    },
    destroyed() { // 计时器不用的时候及时做销毁动作
      clearTimeout(this.timer)
    }
  }
}
</script>

<style scoped="scoped" lang="stylus" rel="stylesheet/stylus">
 @import "~common/stylus/variable"
  .slider
    min-height :1px
    .slider-grop
        position :relative
        overflow :hidden
        white-space :nowrap
        .slider-item
            float :left
            box-sizing :border-box
            overflow :hidden
            text-align:center
            a
                display :block
                width :100%
                overflow :hidden
                text-decoration :none
            img
                display :block
                width :100%
.dots
    position :absolute
    right :0
    left:0
    bottom :12px
    text-align :center
    font-size :0
    .dot
        display :inline-block
        margin :0 4px
        width :8px
        height :8px
        border-radius :50%
        background :$color-text-l
        &.active
            width :20px
            border-radius :5px
            background :$color-text-ll
</style>
