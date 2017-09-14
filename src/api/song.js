import {commonParams} from './config'// 请求歌词的数据接口
import axios from 'axios'
export function getLyric(mid) {
  const url = '/api/lyric'
  const data = Object.assign({}, commonParams, {
    songmid: mid, // 表示是歌曲的id是在动态变化的
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(), // 当前的时间抽
    format: 'json'// 需要的是json数组
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}