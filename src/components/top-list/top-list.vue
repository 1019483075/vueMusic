<template><!--此页面是排行详情页-->
    <transition name="slide">
       <music-list :title="title" :bg-image="bgImage"></music-list>
    </transition>
</template>

<script>
import MusicList from '../../components/music-list/music-list'
export default {
  name: 'top-list',
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped="scoped">
.slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
