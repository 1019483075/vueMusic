// 类似于localstorage  的getItem方法localStorage.getItem("hello");取值
// export const singer = state => state.singer
// export const singer = function(state) {
//   return state.singer
// }
export const singer = state => state.singer
export const playing = state => state.playing
export const fullScreen = state => state.fullScreen
export const playList = state => state.playList
export const sequenceList = state => state.sequenceList
export const mode = state => state.mode
export const currentIndex = state => state.currentIndex
export const currentSong = (state) => {
  return state.playList[state.currentIndex] || {}
}