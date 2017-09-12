import {playMode} from '../common/js/config'
const state = {// vuex集中式存储管理运用
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence, // 此处是指音乐的播放模式
  currentIndex: -1// 是指当前播放歌曲的索引

}
export default state