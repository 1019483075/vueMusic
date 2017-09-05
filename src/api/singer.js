// 抓取数据 同样也是依赖jsonp的
import jsonp from '../common/js/jsonp'
import {commonParams, options} from './config'
// 此处是歌手页面接口数据
export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100, // 是指请求多少数据
    pagenum: 1, // 查第几页的数据
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    g_tk: 1664029744
  })
  return jsonp(url, data, options)
}
// 下面的方法是获取歌手详情页的接口信息
export function getSingerDetail(singerid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    g_tk: 1664029744,
    singermid: singerid
  })
  return jsonp(url, data, options)
}