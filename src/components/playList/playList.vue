<template>
  <transition name="move">
    <div id="playList" ref="playList">
      <nav class="nav" ref="nav">
        <span class="ele-icon-arrow_lift goBack" @click="goBack"></span>
        <span class="center"><i v-if="height_1 < 0">{{(listProps&&listProps.name) || playListInfo.name}}</i><i v-else>歌单</i></span>
        <div class="right">
            <span class="more">
              <i class="dot"></i>
              <i class="dot"></i>
            </span>
        </div>
        <div class="nav-bg-wrapper">
          <div class="nav-bg" ref="navBg">
            <img :src="(listProps&&listProps.coverImgUrl+'?param=400y400') || playListInfo.coverImgUrl+'?param=400y400'" class="nav-img">
          </div>
        </div>
      </nav>
      <div class="header-fixed" v-show="height_2 < 0">
        <div class="header-content">
          <div class="Number">
            <span class="playAll icon-play2"></span>
          </div>
          <div class="song border-1px">
            <span class="name">播放全部</span>
            <span class="count">(共{{(listProps&&listProps.trackCount) || playListInfo.trackCount}}首)</span>
            <span class="collect"></span>
          </div>
        </div>
      </div>
      <div id="playlist-wrapper">
        <div class="playList-content">
          <div class="listDes-wrapper" ref="listDes">
            <div class="bg">
              <img :src="(listProps&&listProps.coverImgUrl+'?param=400y400') || playListInfo.coverImgUrl+'?param=400y400'" class="img">
            </div>
            <div class="bg2"></div>
            <div class="center-wrapper">
              <div class="center-left">
                <img class="small-img" :src="(listProps&&listProps.coverImgUrl+'?param=400y400') || playListInfo.coverImgUrl+'?param=400y400'"/>
                <span class="count"><span class="icon-headphones"></span> {{(listProps&&listProps.playCount || playListInfo.playCount) | playCountTransform()}}</span>
              </div>
              <div class="center-right">
                <div class="title" ref="authorSite">{{listProps&&listProps.name || playListInfo.name}}</div>
                <div class="author">
                  <span class="avatar"><img :src="playListInfo.creator.backgroundUrl+'?param=200y200'"></span>
                  <span class="name">{{playListInfo.creator.nickname}}</span>
                </div>
              </div>
            </div>
            <ul class="bottom">
              <li class="comment">
                <span class="icon icon-twitch"> </span>
                <span class="text">{{playListInfo.commentCount | playCountTransform()}}</span>
              </li>
              <li class="transmit">
                <span class="icon icon-share"> </span>
                <span class="text">{{playListInfo.shareCount | playCountTransform()}} </span>
              </li>
              <li class="download">
                <span class="icon icon-download3"></span>
                <span class="text">下载</span>
              </li>
              <li class="multi-choose ">
                <span class="icon icon-checkbox-checked"> </span>
                <span class="text">多选</span>
              </li>
            </ul>
          </div>
          <div class="main-playlist" ref="mainSite">
            <div class="header">
              <div class="Number">
                <span class="playAll icon-play2"></span>
              </div>
              <div class="song border-1px">
                <span class="name">播放全部</span>
                <span class="count">(共{{playListInfo.trackCount}}首)</span>
                <span class="collect"></span>
              </div>
            </div>
            <div class="loading" v-if="!dataDownLoadFlag"><span class="icon-spinner6"></span></div>
            <ul v-else class="songlist-wrapper">
              <li v-for="(song,index) in playListInfo.tracks" :key='index' class="song-item">
                <div class="Number">{{index+1}}</div>
                <div class="song" :class="(index == playListInfo.tracks.length-1) ?'border-none':'border-1px'">
                  <div class="right">
                    <!--<span class="icon-play2"></span>-->
                    <span class="more">
                  <i class="dot"></i>
                  <i class="dot"></i>
                  <i class="dot"></i>
                </span>
                  </div>
                  <div class="left" @click="selectPlay({list:playListInfo.tracks,index:index})">
                    <router-link :to="{name:'playMusic',params:{musicId:song.id}}">
                      <div class="song-name"><span class="name">{{song.name}}</span><span class="alias" v-if="song.alias && song.alias.length > 0"> ({{song.alias[0]}})</span></div>
                      <div class="singer">
                        <span v-for="(singer,index) in song.ar">{{singer.name}}<i v-if="index != song.ar.length - 1"> / </i></span>
                        <span> - {{song.al.name}}</span>
                      </div>
                    </router-link>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import api from '../../api/index.js'
  import {mapActions,mapMutations} from 'vuex';
  import BScroll from 'better-scroll'
    export default {
        name: "playList",
        data(){
          return {
            playListInfo:{
              creator:{
                backgroundUrl:'',
                nickname:''
              }
            },
            dataDownLoadFlag:false,
            listProps: null,
            PScroll:null,
            PScrollY:0,
            height_1:0,
            height_2:0,
            opacityRate:0,
            navHeight:0,
            topHeight:0
          }
        },
      watch: {
        $route(to,from) {
          if (to.meta.index === 3 && from.meta.index === 0) {//重新进入刷新数据
            this.listProps = this.$route.params.data;
          }
        },
        opacityRate(newVal){
          this.$refs.navBg.style.opacity = newVal;
        }
      },
      created(){
         //获得歌单id 请求数据
        let id = this.$route.params.id;
        this.listProps = this.$route.params.data;
        this.$nextTick(()=>{
          this.initPlayListScroll();
        });
      },
      mounted(){
          this.navHeight = this.$refs.nav.getBoundingClientRect().height;
          this.topHeight = this.$refs.listDes.getBoundingClientRect().height;
      },
      activated(){
        // this.listProps = this.$route.params.data;
        this.height_1 = this.$refs.authorSite.getBoundingClientRect().top;
        this.height_2 = this.$refs.mainSite.getBoundingClientRect().top - this.navHeight;
        if (this.PScroll) {
          this.PScroll.refresh();
        }
          //是否需要请求数据，如果需要，并发送请求
        this.requestData(this.$route.params.id);
      },
      methods:{
        ...mapActions([
          'selectPlay'
        ]),
        ...mapMutations([
          'SET_PLAYLIST',
          'SET_CURRENT_INDEX'
        ]),
        goBack(){
          this.$router.go(-1);
        },
        requestData(id){
          let tempObj = this.$store.getters.getPlayListById(id);
          if (typeof (tempObj) === 'undefined') {
            this.dataDownLoadFlag = false;
            // let url = api.getPlayListDetail(id);
            // let url = `https://api.bzqll.com/music/netease/songList?key=579621905&id=${id}&limit=10&offset=0`;
            this.$http(api.getPlayListDetail(id)).then((res)=>{
              if (res.data.code === 200 ){
                this.playListInfo = res.data.playlist;
                //因为歌单数据固定一份 id都一样，手动更改id
                // this.playListInfo.id = id;
                this.$store.commit('addPlayList', this.playListInfo);
                this.dataDownLoadFlag = true;
              }
            }).catch((err)=>{
              console.log(err);
            })
          }else{
            this.playListInfo = tempObj;
            this.dataDownLoadFlag = true;
          }
        },
        initPlayListScroll(){
          if(!this.PScroll) {
            this.PScroll = new BScroll('#playlist-wrapper',{
              scrollX:false,
              scrollY:true,
              click:true,
              probeType: 3
            });
          }else{
            this.PScroll.refresh();
          }
          this.PScroll.on('scroll',(pos)=>{
            this.PScrollY = -pos.y;
            this.height_1 = this.$refs.authorSite.getBoundingClientRect().top;
            this.height_2 = this.$refs.mainSite.getBoundingClientRect().top - this.navHeight;
            if (this.height_2 < 0){
              this.opacityRate = 1;
            }else if (this.PScrollY <= 0) {
              this.opacityRate = 0;
            } else if(this.PScrollY < (this.topHeight)){
              this.opacityRate = this.PScrollY / this.topHeight;
            }
          })
        }
      }
    }
</script>

<style scoped lang="less">
@import "../../common/less/index";
#playList{
  position: fixed;
  left: 0;
  top: 0;
  z-index: 300;
  width: 100%;
  height: 100%;
  background-color: #fff;
  &.move-enter-active,&.move-leave-active{
    transition: all 0.5s linear;
  }
  &.move-enter,&.move-leave-to{
    transform: translate3d(-100%,0,0);
  }
  &.move-enter-to,&.move-leave{
    transform: translate3d(0,0,0);
  }
  .nav{
    position: fixed;
    left: 0;
    top: 0;
    padding:0.2rem 0.2rem;
    width: 100%;
    height: 1.2rem;
    line-height: 0.8rem;
    text-align: center;
    font-size: 0.32rem;
    color: #fff;
    z-index: 1;
    .goBack{
      float: left;
      line-height: 0.8rem;
    }
    .right{
      float: right;
      .more{
        font-size: 0.32rem;
        .dot{
          display: inline-block;
          width: 0.12rem;
          height: 0.12rem;
          border-radius: 50%;
          padding-right: 0.08rem;
          background-color: #fff;
        }
      }
    }
    .nav-bg-wrapper{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height:100%;
      overflow: hidden;
      z-index: -1;
      .nav-bg{
        width: 200%;
        height:200%;
        filter: blur(30px);
        margin: -30px;
        opacity: 0;
        .nav-img{
          width: 100%;
          height: 5.4rem;
        }
     }
    }
  }
  .header-fixed{
    position: fixed;
    left: 0;
    top: 1.2rem;
    width: 100%;
    z-index: 1;
    text-align: left;
    height: 0.8rem;
    background-color: #e8e8e8;
    .header-content{
      width: 100%;
      height: 1rem !important;
      border-radius: 0.4rem 0.4rem 0rem 0rem;
      padding: 0.2rem 0.2rem 0.0rem;
      background-color: #fff;
      .header-style();
    }
  }
  .header-style {
    height: 0.8rem;
    font-size: 0.32rem;
    vertical-align: top;
    display: flex;
    line-height: 0.6rem;
    .Number {
      width: 0.8rem;
      display: inline-block;
      padding-right: 0.2rem;
      font-size: 0.38rem;
      text-align: center;
    }
    .song {
      flex: 1;
      .border-1px(#fafafa);
      .name{
        font-weight: 600;
      }
      .count {
        font-size: 0.28rem;
        color: #666;
      }
    }
  }
  #playlist-wrapper{
    width: 100%;
    height: 100%;
    .playList-content{
      .listDes-wrapper{
        width: 100%;
        height: 5.4rem;
        position: relative;
        padding: 1.2rem 0.2rem 0.2rem;
        .bg{
          position: absolute;
          left: 0;
          top: -100%;
          width: 100%;
          height: 200%;
          z-index: -2;
          filter: blur(100px);
          .img{
            width: 100%;
            height: 100%;
          }
        }
        .bg2{
          position: absolute;
          left: 0;
          top: -100%;
          width: 100%;
          height: 200%;
          z-index: -1;
          background-color: rgba(0,0,0,.3);
        }
        .center-wrapper{
          height: 2.8rem;
          padding: 0.1rem 0rem;
          .center-left{
            float: left;
            width: 2.6rem;
            height: 2.6rem;
            margin-right: 0.6rem;
            position: relative;
            .small-img{
              display: block;
              width: 100%;
              height: 100%;
            }
            .count{
              right: 0.08rem;
              top: 0.08rem;
              position: absolute;
              color: #fff;
            }
          }
          .center-right{
            text-align: left;
            height: 2.6rem;
            padding: 0.4rem 0rem;
            .title{
              color: #fff;
              font-size: 0.32rem;
              padding-bottom: 0.4rem;
            }
            .author{
              .avatar{
                display: inline-block;
                height: 0.6rem;
                width: 0.6rem;
                margin-right: 0.1rem;
                img{
                  width: 100%;
                  height: 100%;
                  border-radius: 50%;
                  vertical-align: middle;
                }
              }
              .name{
                color: #ccc;
              }
            }
          }
        }
        .bottom{
          height: 0.8rem;
          display: flex;
          padding-top: 0.2rem;
          .comment,.transmit,.download,.multi-choose{
            display: inline-block;
            height: 100%;
            flex: 1;
            color: #ccc;
            .icon{
              display: block;
              font-size: 0.36rem;
              padding-bottom: 0.06rem;
            }
            .text{
              color: #ccc;
              font-size: 0.26rem;
            }
          }
        }
      }
      .main-playlist {
        background-color: #fff;
        border-radius: 0.4rem 0.4rem 0rem 0rem;
        width: 100%;
        padding: 0.2rem;
        text-align: left;
        .header {
          .header-style();
        }
        .loading {
          width: 100%;
          height: 100%;
          padding-top: 2.8rem;
          text-align: center;
          .icon-spinner6 {
            display: block;
            color: #000;
            font-size: 0.56rem;
            animation: rotating 5s linear infinite;
          }
        }
        .songlist-wrapper {
          .song-item {
            display: flex;
            height: 1.2rem;
            font-size: 0.32rem;
            width: 100%;
            .Number {
              text-align: center;
              width: 0.8rem;
              display: inline-block;
              font-size: 0.38rem;
              color: #ccc;
              padding-right: 0.2rem;
              line-height: 1rem;
            }
            .song {
              height: 100%;
              flex: 1;
              overflow: hidden;
              &.border-1px{
                .border-1px(#fafafa);
              }
              &.border-none{
                .border-none();
              }
              .left {
                overflow: hidden;
                padding-top: 0.2rem;
                .song-name{
                  display: inline-block;
                  width: 100%;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  overflow: hidden;
                  padding-bottom: 0.1rem;
                  color: #595959;
                  .alias{
                    color: #666;
                  }
                }
                .singer{
                  display: inline-block;
                  width: 100%;
                  font-size: 0.24rem;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  color: #bfbfbf;
                  span{
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                  }
                }
              }
              .right {
                line-height: 1.2rem ;
                float: right;
                width: 0.5rem;
                height: 100%;
                color: #666;
                margin-left: 0.2rem;
                .icon-play2{
                  vertical-align: middle;
                  padding-right: 0.2rem;
                }
                .more {
                  padding-top: 0.4rem;
                  font-size: 0.32rem;
                  display: block;
                  color: #595959;
                  .dot {
                    display: block;
                    width: 0.08rem;
                    height: 0.08rem;
                    border-radius: 50%;
                    margin-bottom: 0.08rem;
                    background-color: #666;
                  }
                }
              }
            }
          }
        }
      }
      @keyframes rotating {
        0%{
          transform: rotate(0deg);
        }
        100%{
          transform: rotate(360deg);
        }
      }
    }
  }
}
</style>
