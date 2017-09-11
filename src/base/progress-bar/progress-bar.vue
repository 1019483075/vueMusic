<template>
<div class="progress-bar" ref="progressBar">
    <div class="bar-inner">
        <div class="progress" ref="progress"></div>
        <div class="progress-btn-wrapper" ref="progressBtn">
            <div class="progress-btn"></div>
        </div>
    </div>
</div>
</template>

<script>
const progressWidth = 10// 此处是按钮的宽度
export default {
  name: 'progress-bar',
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  watch: {
    percent(newPercent) { // 里面newPercent就是进度条的值
      if (newPercent >= 0) {
        const barWidth = this.$refs.progressBar.clientWidth - progressWidth// 此处是进度条的宽度减去按钮的宽度
        const offsetWidth = newPercent * barWidth
        this.$refs.progress.style.width = `${offsetWidth}px`
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
