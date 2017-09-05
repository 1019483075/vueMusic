import Vue from 'vue'
import Vuex from 'vuex'

import * as actions from './actions'//* 是通配符匹配export的内容用as后面的变量作为导入   as是作为的意思
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NOOD_ENV !== 'production'
export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug, // 严格模式   开发环境使用  会有影响   上线的时候就要关闭
  plugins: debug ? [createLogger()] : []
})