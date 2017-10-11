<template>
    <div class="reaconmend" ref="reaconmend">
        <scroll ref="scroll" class="reaconmend-content" :data="discList">
            <div>
                <div class="slider-wrapper" v-if="recommends.length"><!--recommends.length确保recmmend这个值是有的时候在去加载 -->
                    <slider>
                        <div v-for="item in recommends" class="slider-item">
                            <a :href="item.linkUrl">
                                <img class="needsclick" @load="loadImage" :src="item.picUrl" alt="">
                            </a>
                        </div>
                    </slider>
                </div>
                <div class="reaconmend-list">
                    <h1 class="list-title">热门歌单推荐</h1>
                    <ul>
                        <li @click="selectItem(item)" v-for="item in discList" class="item">
                            <div class="icon">
                                <img v-lazy="item.imgurl" alt="" width="60px" height="60px">
                            </div>
                            <div class="text">
                                <h2 class="name" v-html="item.creator.name"></h2>
                                <div class="desc" v-html="item.dissname"></div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="loading-container" v-show="!discList.length">
                <loading></loading>
            </div><!--意思是指当没有discList数据的时候就回去显示-->
        </scroll>
        <router-view></router-view>
    </div>
</template>

<script>
import Loading from '../../base/loading/loading'
import Scroll from '../../base/scroll/scroll'
import Slider from '../../base/slider/slider'
import {getReaconmend, getDiscList} from '../../api/reaconmend'
import {ERR_OK} from '../../api/config'
import {playlistMixin} from '../../common/js/mixin'
import {mapMutations} from 'vuex'
export default {
  name: 'reaconmend',
  mixins: [playlistMixin],
  data() {
    return {
      recommends: [],
      discList: []
    }
  },
  created() {
    // setTimeout(() => {
    //   this._getReaconmend()
    // }, 2000)
    this._getReaconmend()
    // setTimeout(() => {
    //   this._getDiscList()
    // }, 2000)
    this._getDiscList()
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''

      this.$refs.rank.style.bottom = bottom
      this.$refs.toplist.refresh()
    },
    selectItem(item) {
      this.$router.push({
        path: `/reaconmend/${item.dissid}`// reaconmend是指跳转的地址  注意不能吧跳转的地址写错
      })
      this.setDisc(item)
    },
    loadImage() {
      if (!this.checkLoaded) {
       // this.$refs.scroll.refesh()
        this.checkLoaded = true
      }
    },
    _getReaconmend() {
      getReaconmend().then((res) => {
        if (res.code === ERR_OK) {
          // console.log(res.data.slider)
          this.recommends = res.data.slider
        }
      })
    },
    _getDiscList() {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
         // console.log(res.data.list)
          this.discList = res.data.list
        }
      })
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>

<style scoped="scoped" lang="stylus" rel="stylesheet/stylus">
 @import "~common/stylus/variable"
.reaconmend
    position:fixed
    width :100%
    top :84px
    bottom :0
    .reaconmend-content
        height :100%
        overflow :hidden
        .slider-wrapper
            position :relative
            width :100%
            overflow :hidden
    .reaconmend-list
        .list-title
            height 65px
            line-height :65px
            text-align :center
            font-size :$font-size-medium
            color :$color-theme
        .item
            display :flex
            box-sizing :border-box
            align-items :center
            padding :0 20px 20px 20px
            .icon
                flex :0 0 60px
                width :60px
                padding-right :20px
            .text
                display :flex
                flex-direction :column
                justify-content :center
                flex :1
                line-height :20px
                overflow :hidden
                color :$font-size-medium
                .name
                    margin-bottom :10px
                    color :$color-text
                .desc
                    color :$color-text-d
    .loading-container
        position :absolute
        width :100%
        top :50%
        transform :translateY(-50%)
</style>
