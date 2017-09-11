import * as types from './mutation-types'
console.log(types)
// 类似于locastrorage  的setItem()方法localStorage.setItem("hello", "world");设置值
const mutations = {
  [types.SET_SINGER](state, singer) { // 这里是一个方法  方法名SET_SINGER
    state.singer = singer
  },
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST](state, list) {
    state.playList = list
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  }
}
export default mutations