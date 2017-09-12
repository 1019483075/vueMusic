import {playMode} from '../common/js/config'
const state = {// vuex集中式存储管理运用
  singer: {}, // 歌手信息
  playing: false, // 音乐播放开关
  fullScreen: false,
  playList: [], // 播放音乐的列表
  sequenceList: [], // 原始列表
  mode: playMode.sequence, // 此处是指音乐的播放模式
  currentIndex: -1// 是指当前播放歌曲的索引

}
export default state