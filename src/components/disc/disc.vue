<template>
  <transition name="slide"><!--此处是往左滑的一个动画标签  此组件是分二级路由-->
    <music-list :title="title" :bg-image="bgImage"></music-list>
  </transition><!--次页面是类似于singer-detail的页面组件的 -->
</template>

<script>
import MusicList from '../../components/music-list/music-list'
// 引入抓取数据的js
import {getSongList} from '../../api/reaconmend'
import {ERR_OK} from '../../api/config'
import {mapGetters} from 'vuex'

export default {
  name: 'disc',
  computed: {
    title() {
      return this.disc.dissname
    },
    bgImage() {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  data() { return {} },
  // 抓取歌单详情数据
  created() { // 声明周期钩子   方法
    this._getSongList()
  },
  methods: {// 是一个对象  里面执行一些方法
    _getSongList() {
      getSongList(this.disc.dissid).then((res) => {
        if (res.code === ERR_OK) {
          console.log(res)
        }
      })
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped="scoped" rel="stylesheet/stylus"/>
 .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
