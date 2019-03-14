const playMode = {
  sequence:0,
  loop:1,
  random:2,
  length:3
}
const lyricStates = {
  NORMAL:0, //正常
  NOTEXIST:1, //没有歌词
  NOTFIND:2, //没有找到歌词
  FAILURE:3 //数据请求失败
}
export {
  playMode,
  lyricStates
}
