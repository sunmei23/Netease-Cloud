<template>
    <div id="search" v-show="showFlag">
      <header class="s-header">
        <!--<div class="left">-->
          <input type="search" placeholder="请输入内容" class="input" ref="search" v-model="inputText"/>
          <span class="icon-search search-input"></span>
          <span class="icon-cross" @click="_clearInputText" v-if="inputText.length > 0"></span>
        <!--</div>-->
        <div class="right" @click="_cancel">取消</div>
      </header>
      <div id="s-sroll-wrapper">
        <div class="s-content-wrapper" ref="searchScroll">
          <div class="hot-wrapper" v-if="inputText.length === 0">
            <div class="hot-search-wrapper">
              <div class="header-title">热门搜索</div>
              <div v-for="item in hotSearchs" class="search-words-item" @click="searchMusic(item.first)"
              :class="{'icon':item.iconType===1}">{{item.first}}
              <img v-if="item.iconType===1" src="static/hot.png" class="hot-img"/></div>
            </div>
            <div class="history-search-wrapper">
              <div class="header-title">搜索历史<span class="icon-bin" @click="_clearSearchHistory"></span></div>
              <div v-for="item in historySearchs" class="search-words-item" @click="searchMusic(item)">{{item}}</div>
            </div>
          </div>
          <div v-else>
            <div class="suggest-wrapper" v-if="focusFlag && !searchFlag">
              <ul>
                <li class="input-text li-item border-1px" @click="searchMusic(inputText)">搜索 “{{inputText}}”</li>
                <li class="li-item" v-for="item in searchSuggestSongs" @click="searchMusic(item.name)">
                  <span class="icon-search"></span>
                  <span class="name border-1px">{{item.name}}</span>
                </li>
              </ul>
            </div>
            <div class="search-wrapper" v-if="searchFlag" >
              <div class="song-wrapper">
                <div class="song-nav">
                  <span class="bold type">单曲</span>
                  <span class="icon-play2"></span>
                  <span style="font-size: 0.30rem"> 播放全部</span>
                  <span class="more">查看更多 ></span>
                </div>
                <song-item :songs="searchSongs"></song-item>
              </div>
              <div class="song-list-wrapper">
                <div class="song-list-nav">
                  <span class="bold type">歌单</span>
                  <span class="more">查看更多 ></span>
                </div>
                <div class="content-wrapper">
                  <list-item :songLists="searchSongLists"></list-item>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import api from '../../api/index'
  import songItem from '../../view/songItem/songItem'
  import listItem from '../../view/songListItem/songListItem'
  import BScroll from 'better-scroll'
    export default {
      name: "search",
      components:{listItem, songItem},
      data(){
          return{
            inputFlag:false,
            focusFlag:false,
            searchFlag:false,
            inputText:'',
            timeId:-1,
            searchSuggestSongs:[],
            searchSongs:[],
            searchSongLists:[],
            hotSearchs:[],
            searchScroll:null,
            historySearchs:[]
          }
      },
      props:{
        showFlag:{
          type:Boolean,
          default:false,
        }
      },
      watch: {
        searchFlag(newVal) {
          if (this.searchScroll) {
            this.searchScroll.refresh();
          }
        },
        focusFlag() {
          if (this.searchScroll) {
            this.searchScroll.refresh();
          }
        }
      },
      created(){
        this._requestHotSearch();
        console.log(window.localStorage.getItem('music-serach-words'));
        this.$nextTick(()=>{
          this._initSearchScroll();
          if (window.localStorage.getItem('music-serach-words')) {
            this.historySearchs = localStorage.getItem('music-serach-words').split(',');
          }
        })
      },
      mounted(){
        this.$refs.search.addEventListener('focus',()=>{
          this.focusFlag = true;
        });
        this.$refs.search.addEventListener('keydown',()=>{
          this.inputFlag = true;
        });
        this.$refs.search.addEventListener('keyup',()=>{
          if(this.inputFlag && this.inputText.length !==0){
            if (this.timeId !==-1){
              clearTimeout(this.timeId);
              this.timeId = setTimeout(()=>{
                this._requestSuggestSong(this.inputText);
                this.searchFlag = false;
              },500);
            }else{
              this.timeId = setTimeout(()=>{
                this._requestSuggestSong(this.inputText);
              },500);
            }
          }
        })
        document.addEventListener(('keyup'),(key)=>{
          if (key.keyCode === 13) {
            console.log("keydown"+key);
            console.log(this.inputText);
            if (this.inputText.length >0){
              this.searchMusic(this.inputText);
            }
          }
        })
      },
      methods:{
        _cancel(){
          this.$emit('cancelShow');
        },
        _initSearchScroll(){
          if (!this.searchScroll){
            this.searchScroll = new BScroll("#s-sroll-wrapper",{
              scrollX:false,
              scrollY:true,
              click:true
            })
          }else{
            this.searchScroll.refresh();
          }
        },
        _requestSuggestSong(value){
          this.$http.get(api.getSearchSuggest(value)).then((res)=>{
            if (res.data.code === 200) {
              console.log(res.data.result.songs);
              this.searchSuggestSongs = res.data.result.songs;
            }
          })
        },
        searchMusic(value){
          if(this.timeId !==-1){//清除定时器
            clearTimeout(this.timeId);
          }
          this.inputText = value;
          this._addSearchToHistory(value);
          this.$http.get(api.getSearchResult(value)).then((res)=>{
            if (res.data.code === 200) {
              this.searchSongs = res.data.result.songs.slice(0, 6);
              console.log("search music songs");
              console.log(this.searchSongs);
              this.searchFlag = true;
            }
          })
          this.$http.get(api.getSearchResult(value,1000)).then((res)=>{
            if (res.data.code === 200) {
              this.searchSongLists = res.data.result.playlists.slice(0, 6);
              this.searchFlag = true;
            }
          })
        },
        _requestHotSearch(){
          this.$http.get(api.getHotSearch()).then(res=>{
            if (res.data.code === 200){
              this.hotSearchs = res.data.result.hots;
            }
          })
        },
        _addSearchToHistory(val){
          let preVal = window.localStorage.getItem('music-serach-words');
          if (!preVal){
            window.localStorage.setItem('music-serach-words',val);
            preVal = val;
          }
          else{
            let preArr = preVal.split(',');
            let index = preArr.findIndex((word)=>{
                return word === val;
            });
            if (index!==-1){
               preArr.splice(index,1);
               preArr.unshift(val);
               preVal = preArr.join(',');
              window.localStorage.setItem('music-serach-words',preVal);
            }else{
              preVal = val + ',' + preVal;
              window.localStorage.setItem('music-serach-words',preVal);
            }
          }
          this.historySearchs = preVal.split(',');
        },
        _clearSearchHistory(){
          let preVal = window.localStorage.getItem('music-serach-words');
          if (preVal){
            window.localStorage.removeItem('music-serach-words');
            this.historySearchs = [];
          }
        },
        _clearInputText(){
          this.inputText = '';
        }
      },
    }
</script>

<style scoped lang="less">
  @import "../../common/less/index";
#search{
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 999;
  .s-header{
      position: absolute;
      left: 0;
      top: 0;
      height: 1.0rem;
      width: 100%;
      background-color: @snColor;
      display: flex;
      z-index: 2;
      padding: 0.15rem 0rem;
      padding-left: 0.2rem;
      .right{
        height: 100%;
        float: right;
        line-height: 0.7rem;
        font-size: 0.32rem;
        color: #fff;
        padding: 0rem 0.2rem;
        /*width: 1rem;*/
      }
      .input{
        flex: 1;
        width: 100%;
        /*height: 100%;*/
        /*padding:0.3rem 0rem 0.3rem 0.3rem;*/
        overflow: hidden;
        border-radius: 0.4rem;
        line-height: 0.6rem;
        /*background-color: rgba(184,82,72,.3);*/
        background-color: rgba(255,255,255,.2);
        padding-left: 0.6rem;
        color: #fff;
    }
    .search-input{
      position: absolute;
      left: 0.3rem;
      top: 50%;
      margin-top: -0.14rem;
      color: #fff;
    }
    .icon-cross{
      position: absolute;
      right: 1.3rem;
      top: 50%;
      margin-top: -0.11rem;
      color: #bfbfbf;
      font-weight: 100;
      font-size: 0.22rem;
    }
  }
  #s-sroll-wrapper{
    height: 100%;
    width: 100%;
    text-align: left;
    z-index: 1;
    background-color: #fff;
    .s-content-wrapper{
      width: 100%;
      padding-left: 0.15rem;
      padding-top: 0.96rem;
      padding-bottom: 1rem;
      text-align: left;
      .hot-wrapper{
        .hot-search-wrapper,.history-search-wrapper{
          padding-bottom: 0.2rem;
          .border-1px(#fafafa);
          .header-title{
            width: 100%;
            height: 1.2rem;
            line-height: 1.2rem;
            color: #262626;
            font-size: 0.32rem;
            font-weight: bold;
            .icon-bin{
              line-height: 1.2rem;
              float: right;
              color: #bfbfbf;
              padding-right: 0.2rem;
            }
          }
          .search-words-item{
            display: inline-block;
            padding: 0.2rem;
            background-color: #e8e8e8;
            font-size: 0.26rem;
            margin-bottom: 0.2rem;
            margin-right: 0.2rem;
            border-radius: 0.2rem;
            position: relative;
            &.icon{
              padding-right: 0.5rem;
            }
            .hot-img{
              position: absolute;
              width: 0.4rem;
              height: 0.4rem;
              right: 0.05rem;
              top: 50%;
              margin-top: -0.25rem;
            }
          }
        }
      }
      .suggest-wrapper{
        width: 100%;
        .li-item{
          height: 0.8rem;
          width: 100%;
          padding-left: 0.1rem;
          line-height: 0.8rem;
          &.input-text{
            .border-1px(#fafafa);
            color: #40a9ff;
          }
          .icon-search{
            /*padding-right: 0.1rem;*/
            float: left;
            line-height: 0.8rem;
            color: #8c8c8c;
            font-weight: 100;
          }
          .name{
            /*margin-left: 0.4rem;*/
            display: block;
            height: 100%;
            line-height: 0.8rem;
            margin-left: 0.4rem;
            .border-1px(#fafafa);
          }
        }
      }
      .search-wrapper{
        .song-wrapper{
          margin-bottom: 0.1rem;
          width: 100%;
          .song-nav{
            .search-nav-style();
            .type{
              padding-right: 0.2rem;
              line-height: 1rem;
              font-size: 0.30rem;
              position: relative;
              display: inline-block;
              &::after{
                position: absolute;
                right: 0;
                top: 50%;
                content: '';
                height: 0.36rem;
                margin-top: -0.18rem;
                width: 1px;
                border-right: 1px solid #f5f5f5;
              }
            }
            .icon-play2{
              padding-left: 0.2rem;
              padding-right: 0.1rem;
              font-size: 0.30rem;
              font-weight: 100;
            }
          }
        }
        .song-list-wrapper{
          width: 100%;
          .song-list-nav{
            .search-nav-style();
            .type {
              padding-right: 0.2rem;
              line-height: 1rem;
              font-size: 0.32rem;
            }
          }
        }
      }
      .bold{
        font-weight: bold;
      }
      .search-nav-style{
        width: 100%;
        height: 1.2rem;
        line-height: 1.2rem;
        font-size: 0rem;
        color: #262626;
        padding-right: 0.2rem;
        .border-1px(#fafafa);
        span{
          vertical-align: middle;
          font-size: 0.32rem;
        }
        .more{
          float: right;
          font-size: 0.24rem;
          color: #595959;
        }
      }
    }
  }
}
</style>
