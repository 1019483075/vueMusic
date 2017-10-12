<template>
  <div class="search">
      <div class="search-box-wrapper">
        <search-box ref="searchBox"></search-box><!--此处是搜索框的子组件-->
      </div>
      <div class="shortcut-wrapper">
        <div class="shortcut">
          <div>
            <div class="hot-key">
              <h1 class="title">热门搜索</h1>
              <ul>
                <li @click="addQuery(item.k)" class="item" v-for="item in hotKet"><!--给li一个点击事件-->
                  <span>{{item.k}}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import SearchBox from '../../base/search-box/search-box'
import {getHotKey} from '../../api/search'
import {ERR_OK} from '../../api/config'
export default {
  name: 'search',
  created() {
    this._getHotKey()
  },
  data() {
    return {
      hotKet: []
    }
  },
  methods: {// 此处是点击热门搜索value值会出现在search框内
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
    }
  },
  components: {
    SearchBox
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
</style>
