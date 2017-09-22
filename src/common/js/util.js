function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)// 此处加1的目的是为了获取上线的值   math.floor是指向上取整
}
export function shuffle(arr) { // 此处需要更加深刻的理解  洗牌思路去遍历arr
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}
