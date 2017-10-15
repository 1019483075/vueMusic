<template>
  <div class="search">
      <div class="search-box-wrapper">
        <search-box ref="searchBox" @query="onQueryChange"></search-box><!--此处是搜索框的子组件-->
      </div>
      <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
        <scroll class="shortcut" ref="shortcut" :data="shortcut">
          <div>
            <div class="hot-key">
              <h1 class="title">热门搜索</h1>
              <ul>
                <li @click="addQuery(item.k)" class="item" v-for="item in hotKet"><!--给li一个点击事件-->
                  <span>{{item.k}}</span>
                </li>
              </ul>
            </div>
            <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :searches="searchHistory"></search-list>
          </div>
          </div>
        </scroll>
      </div>
      <div ref="searchResult" class="search-result" v-show="query" >
          <suggest ref="suggest" @select="saveSearch" @listScroll="blurInput" :query="query" ></suggest>
      </div>
      <router-view></router-view><!--此处是一个2级路由  当点击检索列表时就跳转到此路由-->
  </div>
</template>

<script>
import SearchBox from '../../base/search-box/search-box'
import {getHotKey} from '../../api/search'
import {ERR_OK} from '../../api/config'
import Suggest from '../../components/suggest/suggest'
import {mapActions, mapGetters} from 'vuex'

import SearchList from '../../base/search-list/search-list'
import {playlistMixin} from '../../common/js/mixin'
import Scroll from '../../base/scroll/scroll'
export default {
  name: 'search',
  mixins: [playlistMixin],
  created() {
    this._getHotKey()
  },
  data() {
    return {
      hotKet: [],
      query: ''
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ]),
    shortcut() {
      return this.hotKet.concat(this.searchHistory)
    }
  },
  methods: {// 此处是点击热门搜索value值会出现在search框内
    handlePlaylist(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    _getHotKey() {
      getHotKey().then((res) => { // 此处是搜索热门的列表接口    需要实现点击热门搜索的时候   要把值给搜索框
        if (res.code === ERR_OK) {
          this.hotKet = res.data.hotkey.slice(0, 10)
          // console.log(res.data.hotkey)
        }
      })
    },
    onQueryChange(query) {
      this.query = query
    },
    blurInput() {
      this.$refs.searchBox.blur()
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    ...mapActions([
      'saveSearchHistory'
    ])
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Scroll
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped="scoped">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
  .search
    .search-box-wrapper
      margin :20px
    .shortcut-wrapper
      position :fixed
      top:178px
      bottom :0
      width:100%
      .shortcut
        height :100%
        overflow :hidden
        .hot-key
          margin:0 20px 20px 20px
          .title
            margin-bottom :20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display :inline-block
            padding :5px 10px
            margin :0 20px 10px 0
            border-radius :6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position :relative
          margin:0 20px
          .title
            display :flex
            align-items :center
            height :40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex :1
            .clear
               extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position :fixed
      width :100%
      top:178px
      bottom :0
</style>
