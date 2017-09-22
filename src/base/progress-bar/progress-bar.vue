<template>
<div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
        <div class="progress" ref="progress"></div>
        <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"
        >
            <div class="progress-btn"></div>
        </div>
    </div>
</div>
</template>

<script>
import {prefixStyle} from '../../common/js/dom'// 此处是获取transfrom的值
const progressWidth = 10// 此处是按钮的宽度
const progressBtnWidth = 16//
const transform = prefixStyle('transform')
export default {
  name: 'progress-bar',
  props: {
    percent: {// 此处是指计算进度条的百分比
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    progressTouchStart(e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX// 刚开始点击的横向坐标
      this.touch.left = this.$refs.progress.clientWidth// 获取滚动条的初始位置
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX// x抽的位置
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)// Math.min(整个滚动条的位置)- Math.max（音乐播放的位置+滚定的位置）  //此处的Math.min是指两个值中返回最小值
    },
    progressTouchEnd(e) {
      this.touch.initiated = false
      this._triggerPercent()
    },
    progressClick(e) { // 这里当我们点击progressbtn的时候e.offsetX
      // const rect = this.$refs.progressBar.getBoundingClientRect()
      // const offsetWidth = e.pageX - rect.left
      // this._offset(offsetWidth)
      // this._offset(e.offsetX)//相对当前坐标系的border左上角开始的坐标
      const rect = this.$refs.progressBar.getBoundingClientRect()// getBoundingClientRect用于获取莫个元素相对于视窗的位置集合
      const offsetWidth = e.pageX - rect.left
      this._offset(offsetWidth)
      this._triggerPercent()
      // console.log(1)
    },
    _offset(offsetWidth) { // 此处是封装的方法
      this.$refs.progress.style.width = `${offsetWidth}px`// 进度条的偏移位置
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`// 滚动条的偏移位置
    },
    _triggerPercent() { // 告诉外面拖动了多少
      const barWidth = this.$refs.progressBar.clientWidth - progressWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChange', percent)// 高度拖动完成
    }

  },

  watch: {
    percent(newPercent) { // 1.里面newPercent就是进度条的值  进度条的值可以动起来
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressWidth// 计算整个滚动条的宽度 此处是进度条的宽度减去小球按钮的宽度
        const offsetWidth = newPercent * barWidth
       // this.$refs.progress.style.width = `${offsetWidth}px`//此处就是进度条变化的偏移量
       // this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`//此处是小球的偏移量
        this._offset(offsetWidth)
      }
    }
  }
}
</script>

<style lang="stylus" scoped='scope' rel="stylesheet/stylus">
@import "~common/stylus/variable"
.progress-bar
    height :30px
    .bar-inner
        position :relative
        top :13px
        height :4px
        background :rgba(0,0,0,0.3)
        .progress
            position:absolute
            height :100%
            background: $color-theme
        .progress-btn-wrapper
            position :absolute
            left :-8px
            top:-13px
            width :30px
            height :30px
            .progress-btn
                position :relative
                top:7px
                left :7px
                box-sizing :border-box
                width:16px
                height :16px
                border:3px solid $color-text
                border-radius :50%
                background: $color-theme
</style>
