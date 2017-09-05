<template>
  <div class="singer"><!--一下是引入组件-->
      <!--在父组件的子标签中监听改自定义事件并且添加一个响应改事件的处理方法-->
      <list-view :data='singers' @select="selectSinger"></list-view><!--data  是指父组件给子组件传值，子组件用于接受父组件传递的东西-->
       <router-view></router-view>
  </div>
</template>

<script>
import listView from '../../base/listview/listview'
import {getSingerList} from '../../api/singer'
import {ERR_OK} from '../../api/config'
import Singer from '../../common/js/singer'
// 获取vuex的语法糖
import {mapMutations} from 'vuex'// mapMutation就是对mutation的封装
const HOT_SINGER_LEN = 10
const HOT_NAME = '热门'
export default {
  name: 'singer',
  data() {
    return {
      singers: []
    }
  },
  created() {
    this._getSingerList()
  },
  methods: {
    selectSinger(singer) {
     // console.log(singer)
      this.$router.push({// router.push等同于router-link  这个方法会向history添加一个新的记录，所以当用户点击浏览器后退按钮时，则回到之前的URL
        path: `/singer/${singer.id}`// 触发li的跳转事件
      })
      this.setSinger(singer)// 调用了mutation的设置方法
    },
    _getSingerList() {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          // console.log(res.data.list)
          // this.singers = res.data.list//获取的数据不是期望的数据
          this.singers = this._normalizeSinger(res.data.list)
          // console.log(this.singers)
        }
      })
    },
    _normalizeSinger(list) { // 这一系列的处理是指为了获取有序的数组
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) { // 前10条为热门数据
          map.hot.items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          name: item.Fsinger_name,
          id: item.Fsinger_mid
        }))
      })
      // console.log(map)// 此处设置可以将数据转换为我们需要的格式
      // 为了得到一个有序列表，我们需要处理map
      let hot = []
      let ret = []// 字母
      for (let key in map) { // for  in就是循环语句
        let val = map[key]
       // console.log(val)
        if (val.title.match(/[a-zA-Z]/)) { // match（）方法可以在字符串内检索指定的值，或者找到一个或者多个正则表达式的匹配
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => { // sort是按照数组的编码进行排序的
        // console.log(a)
        // console.log(b)
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)// charCodeAt 返回指定字符的unicode编码
      })
      return hot.concat(ret)// concat用于连接2个或者是多个数组
    },
    ...mapMutations({// mapmutation的延展操作
      setSinger: 'SET_SINGER'
    })

  },
  components: {
    listView
  }

}
</script>

<style lang="stylus" scoped="scoped" rel="stylesheet/stylus"> 
  .singer
    position :fixed
    top :84px
    bottom :0
    width :100%
</style>
