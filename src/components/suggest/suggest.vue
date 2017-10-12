<template>
  <div class="suggest"><!--此处是搜索检索的列表页面-->
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result">
        <div class="icon">
          <i :class="getIconCls"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading></loading>
    </ul>
    <div class="no-result-wrapper"></div>
  </div>
</template>

<script>
import {search} from '../../api/search'
import {ERR_OK} from '../../api/config'
const TYPE_SINGER = 'singer'
import {filterSinger} from '../../common/js/song'
export default {
  name: 'suggest',
  // 此组件是依赖于检索词的
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {// 是否显示歌手
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1, // 页数
      result: []// 用于接受数据
    }
  },
  methods: {
    search() {
      search(this.query, this.page, this.showSinger).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data)
          console.log(res.data)
        }
      })
    },
    _genResult(data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      if (data.song) {
        ret = ret.concat(data.song.list)
      }
      return ret
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    }
  },
  watch: {
    query() {
      this.search()
    }
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
