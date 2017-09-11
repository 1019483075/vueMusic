<template>
  <div class="player" v-show="playList.length>0">
     <transition name="normal"
     @enter="enter"
     @after-enter="afterEnter"
     @leave="leave"
     @after-leave="afterLeave"
     > 
      <div class="normal-player" v-show="fullScreen">
          <div class="background">
            <img  alt="" width="100%" height="100%" :src="currentSong.image">
          </div>
          <div class="top">
            <div class="back" @click="back"><!--添加按钮返回事件-->
              <i class="icon-back"></i>
            </div>
            <h1 class="title" v-html="currentSong.name"></h1>
            <h2 class="subtitle" v-html="currentSong.singer"></h2>
          </div>
          <div class="middle">
            <div class="middle-l">
              <div class="cd-wrapper" ref="cdWrapper">
                <div class="cd" :class="cdCls"><!--此处给一个cd图片的旋转事件 当音乐播放的时候cd图片旋转-->
                  <img alt="" class="image" :src="currentSong.image">
                </div>
              </div>
            </div>
          </div>
          <div class="bottom">
            <!--音乐加载器进度条-->
            <div class="progress-wrapper">
              <span class="time time-l">{{format(currentTime)}}</span>
              <div class="progress-bar-wrapper">
                <progress-bar :percent="percent"></progress-bar>
              </div>
              <span class="time time-r">{{format(currentSong.duration)}}</span>
            </div>
            <div class="operators">
              <div class="icon i-left">
                <i class="icon-sequence"></i>
              </div>
              <div class="icon i-left" :class="disableCls">
                <i @click="prev" class="icon-prev"></i>
              </div>
              <div class="icon i-center">
                <i @click="togglePlaying" :class="playIcon"></i><!--此处的icon-play是控制音乐的播放暂停的-->
              </div>
              <div class="icon i-right" :class="disableCls">
                <i @click="next" class="icon-next"></i>
              </div>
              <div class="icon i-right">
                <i class="icon icon-not-favorite"></i>
              </div>
            </div>
          </div>
      </div>
      </transition>
       <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon"><!--此处的cdcls也是添加音乐播放，图片旋转动画效果-->
          <img :class="cdCls" alt="" width="40" height="40" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <div class="progress-circle"><!--下面的click加一个stop的原因是因为父元素有open点击事件   子元素的点击事件会冒泡到父元素的点击事件 加stop是阻止冒泡事件-->
              <i @click.stop="togglePlaying" class="icon-mini icon-play-mini" :class="miniIcon"></i>
          </div>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
      </transition>
      <!--下面添加audo音乐播放标签  src是指英语的播放地址-->
      <audio ref="audio" :src="currentSong.url" @play='ready' @error="error"  @timeupdate="updateTime"></audio>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'// 此插件是js关键帧动画
import {prefixStyle} from '../../common/js/dom'
import progressBar from '../../base/progress-bar/progress-bar'
const transform = prefixStyle('transform')
export default {
  name: 'player',
  data() {
    return {
      songReady: false,
      currentTime: 0// 表示当前进度条的时间
    }
  },
  computed: {
    cdCls() {
      return this.playing ? 'play' : 'play pause'
    },
    playIcon() { // 播放音乐按钮的开与关的操作，对应开关按钮icon
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    // percent的width
    percent() { // 进度条的值
      return this.currentTime / this.currentSong.duration
    },
    // 添加一个按钮不能点击时的样式
    disableCls() {
      return this.songReady ? '' : 'disable'
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      'playing', // 对应SET_PLAYING_STATE通过this.playing 去获取当前的状态
      'currentIndex'
    ])
  },
  methods: {
    back() { // 点击back区块的时候页面隐藏  所以设置为false
      this.setFullScreen(false)
    },
    open() { // 点击open区块的时候页面显示  所以设置为true
      this.setFullScreen(true)
    },
    enter(el, done) {
      // 1.首先获取miniplay中图片在区块的位置  x偏移40像素   底部偏移30像素
      const {x, y, scale} = this._getPosAndScale()// 3.获取x,y抽并且给动画关键帧
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      }
      // 4.下面是注册animation
      animations.registerAnimation({// registerAnimation
        name: 'move',
        animation,
        presets: {
          duration: 400, // 是指持续时间
          easing: 'linear'
        }
      })
      // 5.运行animation
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)// done函数是指动画执行完毕后执行这个函数
    },
    afterEnter() {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    // 定义音乐暂停播放的方法
    togglePlaying() {
      this.setPlayingState(!this.playing)// 这音乐取反的操作
    },
    // 播放下首歌曲事件
    next() { // 阻止快速点击歌曲
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex + 1
      // 判断当歌曲为最后一首歌的时候
      if (index === this.playList.length) {
        index = 0
      }
      this.setCurrentIndex(index)
      // 当音乐暂停的时候在点击播放下一首歌曲，音乐在播放但是icon图片是关闭的图片  所以要做逻辑判断
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    // 播放上一首音乐歌曲
    prev() {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playList.length - 1
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    ready() {
      this.songReady = true
    },
    error() { // 判断如个人没有网络或者是下首歌曲没有的情况下
      this.songReady = true
    },
    updateTime(e) { // currentTime是指返回音频或者是视频的当前播放的位置，秒数显示
      this.currentTime = e.target.currentTime
      console.log(this.currentTime)
    },
    // 定义一个函数将时间抽转换成分和秒的形式
    format(interval) {
      interval = interval | 0// 此处的方法类似于取整
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60)//
      return `${minute}:${second}`
    },
    // toString() 方法可把一个逻辑值转换为字符串，并返回结果。
    _pad(num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    // 2.封装一个函数去获取miniplay中小图片偏移的位置
    _getPosAndScale() {
      const targetWidth = 40// 小图片的宽度
      const paddingLeft = 40// 小图片距离左边的距离
      const padddingBottom = 30// 小图片距离下面的距离
      const paddingTop = 80// 大图片距离顶部的距离
      const width = window.innerWidth * 0.8// 大图片的宽度
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft)// x抽是指大图片x中心的位置
      const y = window.innerHeight - paddingTop - width / 2 - padddingBottom
      return {
        x,
        y,
        scale
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    })
  },
  watch: {
    currentSong() {
      // $nextTick()是指延时效果，当dom加载完毕在执行里面的内容
      this.$nextTick(() => {
        this.$refs.audio.play()
      })
    },
    playing(newplaying) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newplaying ? audio.play() : audio.pause()// 此处的意思是newplay的值为true就播放 否则就暂停
      })
    }
  },
  components: {
    progressBar
  }
}
</script>

<style lang="stylus" scoped="scoped" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.player
    .normal-player
        position :fixed
        left :0
        right :0
        top:0
        bottom :0
        z-index :150
        background :$color-background
        .background
          position :absolute
          left :0
          right :0
          width:100%
          height :100%
          z-index :-1
          opacity :0.6
          filter :blur(20px)
        .top
          position :relative
          margin-bottom: 25px
          .back
            position :absolute
            top:0
            left :6px
            z-index:50
            .icon-back
              display :block
              padding :9px
              font-size: $font-size-large-x
              color: $color-theme
              transform: rotate(-90deg)
          .title
            width :70%
            margin :0 auto
            line-height :40px
            text-align :center
            no-wrap()
            font-size: $font-size-large
            color: $color-text
          .subtitle
            line-height :20px
            text-align :center
            font-size: $font-size-medium
            color: $color-text
        .middle
          position :fixed
          width :100%
          top:80px
          bottom :170px
          white-space:nowrap
          font-size :0
          .middle-l
            display :inline-block
            vertical-align :top
            position :relative
            width :100%
            height :0
            padding-top :80%
            .cd-wrapper
              position :absolute
              left :10%
              top :0
              width:80%
              height :100%
              .cd
                width :100%
                height :100%
                box-sizing:border-box
                border :10px solid rgba(255, 255, 255, 0.1)
                border-radius: 50%
                &.play
                  animation: rotate 20s linear infinite
                &.pause
                  animation-play-state: paused
                .image
                  position :absolute
                  left :0
                  top:0
                  width:100%
                  height :100%
                  border-radius: 50%
             .playing-lyric-wrapper
                width: 80%
                margin: 30px auto 0 auto
                overflow: hidden
                text-align: center
                .playing-lyric
                  height :20px
                  line-height :20px
                  font-size: $font-size-medium
                  color: $color-text-l
              .middle-r
                display :inline-block
                vertical-align :top
                width :100%
                height :100%
                overflow :hidden
                .lyric-wrapper
                  width :80%
                  margin:0 auto
                  overflow :hidden
                  text-align :center
                  .text
                    line-height :32px
                    color: $color-text-l
                    font-size: $font-size-medium
                    &.current
                      color: $color-text
        .bottom
          position :absolute
          bottom :50px
          width :100%
          .dot-wrapper
            text-align :center
            font-size :0
            .dot
              display :inline-block
              vertical-align :middle
              margin :0 4px
              width :8px
              height :8px
              border-radius: 50%
              background: $color-text-l
              &.active
                width :20px
                border-radius: 5px
                background: $color-text-ll
          .progress-wrapper
            display :flex
            align-items :center
            width :80%
            margin :0 auto
            padding :10px 0
            .time
              color: $color-text
              font-size: $font-size-small
              flex: 0 0 30px
              line-height: 30px
              width: 30px
              &.time-l
                text-align: left
              &.time-r
                text-align: right
            .progress-bar-wrapper
                  flex: 1
          .operators
            display :flex
            align-items :center
            .icon
              flex :1
              color: $color-theme
              &.disable
                color: $color-theme-d
              i 
                font-size :30px
            .i-left
              text-align :right
            .i-center
              padding :0 20px
              text-align :center
              i 
                font-size :40px
            .i-right
              text-align :left
            .icon-favorite
              color: $color-sub-theme
        &.normal-enter-active,&.normal-leave-active
          transition :all 0.4s
          .top,.bottom
            transition :all 0.4s cubic-bezier(0.86,0.18,0.82,1.32)
        &.normal-enter,&.normal-leave-to
          opacity :0
          .top
            transform :translate3d(0,-100px,0)
          .bottom
            transform :translate3d(0,100px,0)
    .mini-player
        display :flex
        align-items :center
        position :fixed
        left :0
        bottom :0
        z-index :180
        width:100%
        height :60px
        background: $color-highlight-background
        &.mini-enter-active,&.mini-leave-active
          transition :all 0.4
        &.mini-enter,&.mini-leave-to
          opacity :0
        .icon
          flex :0 0 40px
          width :40px
          padding :0 10px 0 20px
          img 
            border-radius:50%
            &.play
              animation: rotate 10s linear infinite
            &.pause
              animation-play-state: paused
        .text
          display :flex
          flex-direction :column
          justify-content:center
          flex :1
          line-height :20px
          overflow :hidden
          .name
            margin-bottom :2px
            no-wrap()
            font-size: $font-size-medium
            color: $color-text
          .desc
            no-wrap()
            font-size: $font-size-small
            color: $color-text-d
        .control
          flex :0 0 30px
          width:30px
          height :30px
          padding :0 10px
          .icon-play-mini, .icon-pause-mini, .icon-playlist
            font-size :30px
            color:$color-theme-d
          .progress-circle
            position :relative
            .icon-mini
              font-size:32px
              position :absolute
              left :0
              top :0
  @keyframes rotate 
    0%
      transform :rotate(0)
    100%
      transform :rotate(360deg)
</style>
