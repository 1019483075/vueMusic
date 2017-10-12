<template><!--此页面是排行详情页-->
    <transition name="slide">
       <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script>
import MusicList from '../../components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getMusicList} from '../../api/rank'
import {ERR_OK} from '../../api/config'
import {createdSong} from '../../common/js/song'
export default {
  name: 'top-list',
  computed: {
    title() {
      return this.topList.topTitle
    },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
      // return this.topList.picUrl
    },
    ...mapGetters([
      'topList'
    ])
  },
  created() {
    this._getMusicList()
  },
  data() {
    return {
      songs: [], // 创建一个songs用于接受歌曲数据
      rank: true
    }
  },
  methods: {
    _getMusicList() {
      if (!this.topList.id) { // 判断列表内容页面的数据没有获取到，刷新的时候是会退到父组件
        this.$router.push('/rank  ')
        return
      }
      getMusicList(this.topList.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.songlist)
          console.log(this.songs)
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((item) => {
        const musicData = item.data
        if (musicData.songid && musicData.albummid) {
          ret.push(createdSong(musicData))
        }
      })
      return ret
    }
  },
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
