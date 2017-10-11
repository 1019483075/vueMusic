import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
import Reaconmend from '../components/reaconmend/reaconmend.vue'
import Singer from '../components/singer/singer.vue'
import Rank from '../components/rank/rank.vue'
import Search from '../components/search/search.vue'

import SingerDetail from '../components/singer-detail/singer-detail.vue'
import Disc from '../components/disc/disc.vue'// 此处是推荐列表跳转的内容页面   此处的页面是类似于歌手详情页的组件的
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/reaconmend'// redirect是指默认初始化的那个路由
    },
    {
      path: '/reaconmend',
      component: Reaconmend,
      children: [// 此处是子路由  里面是存放数组的
        {
          path: ':id', // 此组件是个子路由
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank
    },
    {
      path: '/search',
      component: Search
    }
  ]
})
