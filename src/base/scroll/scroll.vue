<template>
  <div ref="wrapper">
      <slot></slot><!--是一个插槽-->
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  name: 'scroll',
  props: {
    probeType: {// 滚动时会派发scroll事件，会截留
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: {//
      type: Boolean,
      default: false
    },
    pullup: {// 检索页的上拉刷新功能，用prop传递
      type: Boolean,
      default: false
    },
    beforScroll: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    setTimeout(() => { // 保证dom刷新完成在执行里面的事情
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
      if (this.listenScroll) { // 监听scroll的滚动事件
        let me = this
        this.scroll.on('scroll', (pos) => { // $emit监听当前实例上的自定义事件
          me.$emit('scroll', pos)
        })
      }
      if (this.pullup) { // scroll.on是监听莫个动作  然后在suggest里面监听这个
        this.scroll.on('scrollEnd', () => { // scrollEnd是表示停止  scrollToEnd是表示滚动到底部
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            this.$emit('scrollToEnd')
          }
        })
      }
      if (this.beforScroll) {
        this.scroll.on('beforScrollStart', () => {
          this.$emit('beforScroll')
        })
      }
    },
    enable() {
      this.scroll && this.scroll.enable()// enable启用better-scroll，默认开启
    },
    disable() {
      this.disable && this.scroll.disable()// 禁用better-scroll
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    scrollTo() { // scrollTo是指滚动到相应的位置
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)// scrollTo是指滚动到相应的位置scrollTo(x,y,时间，宽松)
    },
    scrollToElement() { // ScrollToElement是指滚动到某个元素
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)// 滚动到莫个元素scrollToElement(el,time,offsetX,offsetY,easing)
    }
  },
  watch: {// 监听data是否有变化，如果有变化的话就重新调用下方法
    data() {
      setTimeout(() => { // 保证dom刷新完成在执行里面的事情
        this.refresh()
       // this._initScroll()
      }, 20)
    }
  }
}
</script>

<style scoped="scoped" lang="stylus" rel="stylesheet/stylus">
  
</style>
