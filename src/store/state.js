import {playMode} from '../common/js/config'
const state = {// vuex集中式存储管理运用
  singer: {}, // 公共状态歌手信息
  playing: false, // 音乐播放状态
  fullScreen: false, // 全屏幕
  playList: [], // 播放音乐的列表
  sequenceList: [], // 顺序列表
  mode: playMode.sequence, // 此处是指音乐的播放模式
  currentIndex: -1, // 是指当前歌曲在播放列表中的索引值
  // 此处是disc的state
  disc: {}
}
export default state