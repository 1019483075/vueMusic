import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
import Reaconmend from '../components/reaconmend/reaconmend.vue'
import Singer from '../components/singer/singer.vue'
import Rank from '../components/rank/rank.vue'
import Search from '../components/search/search.vue'

import SingerDetail from '../components/singer-detail/singer-detail.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/reaconmend'// redirect是指默认初始化的那个路由
    },
    {
      path: '/reaconmend',
      component: Reaconmend
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
