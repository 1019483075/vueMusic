<template>
  <scroll 
  class="listview" 
  :data="data" 
  ref="listview" 
  :listenScroll="listenScroll"
  :probeType="probeType"
  @scroll="scroll"><!--当绑定的属性过多的时候建议这种书写的方法方便阅读-->
      <ul>
          <li class="list-group" v-for='group in data' ref="listGroup">
              <h2 class="list-group-title">{{group.title}}</h2>
              <ul>
                <!--子组件给父组件传值1，在子组件创建一个按钮，给按钮绑定一个点击事件-->
                  <li @click="selectedItem(item)" v-for="item in group.items" class="list-group-item">
                      <img class="avatar" v-lazy="item.avatar" alt="" width="50" heigth="50"/>
                      <span class="name">{{item.name}}</span>
                  </li>
              </ul>
          </li>
      </ul>
      <!--右侧列表-->
      <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove"><!--当手指移入屏幕时触发-->
          <ul>
              <li  v-for="(item,index) in shortcutList" class="item" :class="{'current':currentIndex===index}":data-index="index"><!--拓展data-index的属性-->
                  {{item}}
              </li>
          </ul>
      </div>
      <div class="list-fixed" v-show="fixedTitle" ref="fixed"><!--这个判断是里面有数据的时候才会显示-->
        <h1 class="fixed-title">{{fixedTitle}}</h1>
      </div>
      <div class="loading-container" v-show="!data.length"><!--v-show是指元素始终被渲染在dom中，只不过是用css的display来判断的-->
        <loading></loading>
      </div>
  </scroll>
</template>

<script>
import Scroll from '../scroll/scroll'
import {getData} from '../../common/js/dom'
import Loading from '../loading/loading'// 此处是优化  增加loading的效果
const ANCHOR_HEIGHT = 18// 右侧锚点的高度 size高度加上下padding
const TITLE_HEIGHT = 30// 样式定义title的高度
export default {
  name: 'listview',
  created() {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  props: {
    data: {// 父组件给子组件传递data数据
      type: Array,
      default: []
    }
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0, //
      diff: -1// 当前的上线与滚动的位置
    }
  },
  computed: {// 计算属性
    shortcutList() { // 获取右侧的列表信息
      return this.data.map((group) => { // 获取data数据里面的键值对
        return group.title.substr(0, 1)// substr是指抽取下标中指定的字符串  是值data下面数据title中的第一个字符
      })
    },
    fixedTitle() { // fixedTitle是指让头部的title有个固定的效果
    // 当我们从下面王上面拖动的时候会多一个titie，所以应该判断下 这个是边界 的title
      if (this.scrollY > 0) {
        return ''
      }
    // 做这个判断是因为一开始的时候这个数组是一个空的数组
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  methods: {
    // 此处的方法是点击事件的时候跳转到歌手详情页的逻辑
    // 2，在响应点击事件的函数中使用$emit来触发一个自定义事件，并且传递一个参数
    selectedItem(item) {
      this.$emit('select', item)// $emit参数的理解，第一个是传递给父组件的方法，一个是传递给父组件的参数
    },
    // 1. 此处方法比较共有的方法放在前面
    onShortcutTouchStart(e) { // 点击这个事件的时候，对应的滚动到相应的元素
      let anchorIndex = getData(e.target, 'index')// 1.e.target是指当前点击的元素  给当前点击元素添加大dta属性
      let firstTouch = e.touches[0]// 手指刚开始触发的位置
      this.touch.y1 = firstTouch.pageY// 记录下touchstart的值
      this.touch.anchorIndex = anchorIndex// 2.
      this._scrollTo(anchorIndex)
    //  this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex], 0)
    },
    onShortcutTouchMove(e) { // 1.此处是右侧的的列表滚动事件
      let firstTouch = e.touches[0]// 确实能保留所有触发点的事件对象
      this.touch.y2 = firstTouch.pageY//
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0// 这里的|0就类似于math.floor是一样的
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta// (this.touch.anchorIndex是个字符串
     // console.log(anchorIndex)
      this._scrollTo(anchorIndex)
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        return
      }
      // 问题：当滚动到list-shortcut顶部的时候会跑到z的位置
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[index]// 加了这句的时候就可以增加高亮的效果
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    _calculateHeight() { // 高度变化的时候去计算高度
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]// 此处是所有的列表的长度
        height += item.clientHeight// clientHeight = topPadding + bottomPadding+ height - scrollbar.height
        this.listHeight.push(height)
       // console.log(height)
      }
     // console.log(height)
    }
  },
  watch: { // 观测y值的变化   然后去 计算currentIndex
    data() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY(newY) { // 在中间部分滚动
    // 滚动具体分为几种情况  1)滚动到最顶部的情况newY>0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 2)在中间部分的滚动
      const listHeight = this.listHeight
     // for (let i = 0; i < listHeight.length; i++) {
         // 遍历到最后一句的时候要-1
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        // (-newY) >= height1这里一定要>=
        if (!height2 || (-newY) >= height1 && -newY < height2) { // 不理解
          this.currentIndex = i
          this.diff = height2 + newY
          console.log(this.currentIndex)
          return
        }
      }
       // 3）当滚动到底部，且-newY大于最后一个元素的上限
    // this.currentIndex = 0
      this.currentIndex = listHeight.length - 2
    },
    diff(newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },

  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped="scoped" rel="stylesheet/stylus"> 
    @import "~common/stylus/variable"

    .listview
        position :relative
        width :100%
        height :100%
        overflow :hidden
        background :$color-background
        .list-group
            padding-bottom :30px
            .list-group-title
                height :30px
                line-height :30px
                padding-left :20px
                font-size :$font-size-small
                color: $color-text-l
                background: $color-highlight-background
            .list-group-item
                display :flex
                align-items :center
                padding :20px 0 0 30px
                .avatar
                    width :50px
                    height :50px
                    border-radius :50%
                .name
                    margin-left :20px
                    color: $color-text-l
                    font-size: $font-size-medium
        .list-shortcut
            position :absolute
            z-index :30
            right :0
            top :50%
            transform :translateY(-50%)
            width :20px
            padding :20px 0
            border-radius :10px
            text-align :center
            background: $color-background-d
            font-family: Helvetica
            .item
                padding :3px
                line-height :1
                color: $color-text-l
                font-size: $font-size-small
                &.current
                    color: $color-theme
          .list-fixed
            position :absolute
            top :0
            left :0
            width :100%
            .fixed-title
              height :30px
              line-height :30px
              padding-left :20px
              font-size :$font-size-small
              color: $color-text-l
              background: $color-highlight-background
</style>
