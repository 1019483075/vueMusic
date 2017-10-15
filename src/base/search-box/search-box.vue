<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="blur" type="text" class="box" :placeholder="placeholder" v-model="query">
    <i v-show="query" class="icon-dismiss" @click="clear"></i>
  </div>
</template>

<script>
import {debounce} from '../../common/js/util'
export default {
  name: 'search-box',
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲，歌手'
    }
  },
  data() {
    return {
      query: ''// 此处使用了v-model实现了数据的双向绑定的指令
    }
  },
  methods: {
    clear() { // 搜索框取消，清空的功能
      this.query = ''
    },
    setQuery(query) {
      this.query = query
    },
    blur() {
      this.$refs.query.blur()
    }
  },
  created() {
    // $watch是用于观察vue实例上的数据变化
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 200))
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped="scoped">
 @import "~common/stylus/variable"
.search-box
  display :flex
  align-items :center
  box-sizing :border-box
  width :100%
  padding :0 6px
  height :40px
  background: $color-highlight-background
  border-radius: 6px
  .icon-search
    font-size :24px
    color :$color-background
  .box
    flex :1
    margin :0 5px
    line-height :18px
    background: $color-highlight-background
    color: $color-text
    font-size: $font-size-medium
    &::placeholder
      color: $color-text-d
  .icon-dismiss
    font-size: 16px
    color: $color-background
</style>
