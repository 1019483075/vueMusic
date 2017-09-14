<template>
<transition name="slider">
      <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
 </transition>
</template>

<script>
import {mapGetters} from 'vuex'// 调用了mapgetters
import {getSingerDetail} from '../../api/singer'// 引用promise的方法
import {ERR_OK} from '../../api/config'// 引入判断
import {createdSong} from '../../common/js/song'// 引入处理的数据
import MusicList from '../../components/music-list/music-list'
export default {
  name: 'singer-detail',
  computed: {// 这个必须在singers之前 依赖的值发生变化会重新计算title
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  data() {
    return {
      songs: []
    }
  },
  created() {
    this._getDetial()
    // console.log(this.singer)
  },
  methods: {
    _getDetial() {
      if (!this.singer.id) {
        this.$router.push('/singer')// 此处的目的是指如果在歌手详情页不小心刷新了就直接返回到歌手页
        return
      }
      getSingerDetail(this.singer.id).then((res) => { // 此处的数据虽然已经获取到了，但是不是我们需要的数据，所以要进行逻辑修改
        if (res.code === ERR_OK) {
          this.songs = this.__normalizeSongs(res.data.list)
          console.log(this.songs)
        }
      })
    },
    __normalizeSongs(list) { // 此处是对list数据的处理，成立成我们需要的数据
      let ret = []
      list.forEach((item) => {
        let {musicData} = item
        if (musicData.songid && musicData.albumid) {
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

<style lang="stylus" scoped="scoped" rel="stylesheet/stylus">
  .slider-enter-active,.slider-leave-active/*动画效果写法*/
    transition :all .3s
  .slider-enter,.slider-leave-to
    transform :translate3d(100%,0,0)
</style>
