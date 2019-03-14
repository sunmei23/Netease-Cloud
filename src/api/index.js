const _baseUrl = 'https://musicapi.leanapp.cn'
// const _baseUrl2 = 'https://api.imjad.cn/cloudmusic/'
export default {
  /**
   * 获取首页Banner图片数据
   */
  getBannerList () {
    return `${_baseUrl}/banner`
  },
  /**
   * 获取推荐歌单
   */
  getPersonalized () {
    return `${_baseUrl}/top/playlist?limit=12&order=hot`
  },
  /**
   * 获取推荐歌单
   */
  getPersonalizedSong () {
    return `${_baseUrl}/personalized/newsong`
  },
  /**
   * 获取推荐 mv
   */
  getPersonalizedMV () {
    return `${_baseUrl}/personalized/mv`
  },
  /**
   *
   * @param {*} cat
   * @param {*} order
   * @param {*} offset
   * @param {*} total
   * @param {*} limit
   */
  getPlayListByWhere (offset, limit) {
    return `${_baseUrl}/top/playlist?limit=${limit}&order=all&offset=${offset}`
  },
  /**
   * 获取歌词API
   * @param {Number} id
   */
  getLrc (id) {
    return `${_baseUrl}/lyric?id=${id}`
  },
  /**
   * 获取歌曲 播放URL
   * @param {Number} id
   */
  getSong (id) {
    return `${_baseUrl}/song/url?id=${id}`
  },
  /**
   * 获取歌单详情
   * @param {Number} id
   */
  getPlayListDetail (id) {
    return `${_baseUrl}/playlist/detail?id=${id}`
  },
  getMv (id) {
    return _baseUrl2 + '?type=mv&id=' + id
  },
  search (words) {
    return _baseUrl2 + '?type=search&s=' + words
  },
    /*
  获取歌曲详情
  @param {Number} id
   */
  getSongDetail (id) {
    return `${_baseUrl}/song/detail?ids=${id}`
  },

  /*
  搜索功能
  @param {String} keyWords
  @param {Number} type
  /search?keywords= 海阔天空
   */
  getSearchResult(keywords,type=1){
    return `${_baseUrl}/search?keywords=${keywords}&type=${type}`;
  },
  /* 获取搜索建议/search/suggest?keywords= 海阔天空&type=mobile*/
  getSearchSuggest(keywords,type='mobile'){
    return `${_baseUrl}/search/suggest?keywords=${keywords}&type=${type}`;
  }

}


