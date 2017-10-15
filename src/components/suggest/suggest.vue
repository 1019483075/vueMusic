<template>
  <scroll class="suggest" 
  :data="result" 
  @scrollToEnd="searchMore"
  :beforScroll="beforScroll"
  @beforScroll="listScroll"
  ref="suggest"
  :pullup="pullup"><!--此处是搜索检索的列表页面   添加滚动的效果-->
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="item in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading><!--上拉加载时候的loading事件-->
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore&&!result.length">
      <no-result title="抱歉，暂无搜索结果"></no-result>
      </div><!--此处是检索搜索时   未搜索到的温馨提示-->
  </scroll>
</template>

<script>
import {search} from '../../api/search'
import {ERR_OK} from '../../api/config'
import {createdSong} from '../../common/js/song'
import Scroll from '../../base/scroll/scroll'
import Loading from '../../base/loading/loading'
import Singer from '../../common/js/singer'
import {mapMutations, mapActions} from 'vuex'
import NoResult from '../../base/no-result/no-result'
const TYPE_SINGER = 'singer'
const perpage = 20

export default {
  name: 'suggest',
  // 此组件是依赖于检索词的
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {// 是否显示歌手   默认是显示歌手的
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1, // 页数
      result: [], // 用于接受数据
      pullup: true, // 是否上拉刷新
      hasMore: false,
      beforScroll: true
    }
  },
  methods: {
    refresh() {
      this.$refs.suggest.refresh()
    },
    search() { // 请求服务端，抓取检索数据
      this.page = 1
      this.hasMore = true
      this.$refs.suggest.scrollTo(0, 0)
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data)
          console.log(this.result)
          this._checkMore(res.data)
        }
      })
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    _genResult(data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albummid) {
          ret.push(createdSong(musicData))
        }
      })
      return ret
    },
    searchMore() { // 上拉刷新事件   调取接口 加载数据 并且每次只调用20条数据
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._genResult(res.data))
          this._checkMore(res.data)
        }
      })
    },
    _checkMore(data) {
      const song = data.song
      if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
        this.hasMore = false
      }
    },
    listScroll() {
      this.$emit('listScroll')
    },
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        console.log(1)
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      this.$emit('select', item)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },

  watch: {// 监听query的变化
    query() {
      this.search()
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }

}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped="scoped">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.suggest
  height :100%
  overflow :hidden
  .suggest-list
    padding :0 30px
    .suggest-item
      display :flex
      align-items :center
      padding-bottom :20px
      .icon
        flex :0 0 30px
        width :30px
        [class^="icon-"]
          font-size :14px
          color: $color-text-d
      .name
        flex :1
        font-size: $font-size-medium
        color: $color-text-d
        overflow :hidden
        .text
          no-wrap()
    .no-result-wrapper
      position :absolute
      width :100%
      top:50%
      transform :translateY(-50%)
</style>
