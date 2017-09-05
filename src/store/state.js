import {playMode} from '../common/js/config'
const state = {// vuex集中式存储管理运用
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence, //
  currentIndex: -1

}
export default state