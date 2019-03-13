<template>
    <div id="playListWrapper" v-show="isShow">
      <header class="header border-1px">
        <div class="methods" @click="SET_PLAY_MODE()">
          <span class="icon-loop" v-show="mode===0"> 循环播放</span>
          <span v-show="mode===1" class="img"><img src="static/single_loop2.png" width="22" height="20"/> <span class="text">单曲循环</span></span>
          <span class="icon-shuffle" v-show="mode===2"> 随机播放</span>
          <span class="count">(共{{playList.length}}首)</span>
        </div>
        <div class="right">
          <div class="save">
            <span class="icon-plus"></span>
            <span>收藏全部</span>
          </div>
          <div class="delete border-1px">
            <span class="icon-bin " @click="_deleteAll"></span>
          </div>
        </div>
      </header>
      <div id="bsWrapper" ref="bsBox">
        <div class="list-wrapper">
          <ul class="content-wrapper">
            <li v-for="(song,index) in playList" class="list-item border-1px" :class="currentIndex===index? 'highLight':'normal'">
              <div class="right">
                <span class="icon-attachment" v-show="currentIndex===index"></span>
                <span class="icon-cross" @click="_deleteSingle(index)"></span>
              </div>
              <div class="left" @click="SET_CURRENT_INDEX(index)">
                <div class="song-name">
                  <span class="icon-volume-medium" v-show="currentIndex===index"></span>
                  <span class="name">{{song.name}}</span>
                  <span class="alias" v-if="song.alias && song.alias.length > 0"> ({{song.alias[0]}})</span>
                  <span v-for="(singer,index) in song.ar" class="singer">- {{singer.name}}<i v-if="index != song.ar.length - 1"> / </i></span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="close" @click="_hideList">关闭</div>
    </div>
</template>

<script>
   import {mapGetters,mapMutations} from 'vuex';
   import BSCroll from 'better-scroll'
    export default {
      name: "playList",
      data(){
        return {
          listScroll:null
        }
      },
      props:{
        isShow:{
          type:Boolean,
          default:false
        }
      },
      computed:{
        ...mapGetters([
          'playList',
          'currentIndex',
          'mode'
        ])
      },
      watch:{
        isShow(newVal){
          if (newVal && this.listScroll){
            this.listScroll.refresh();
          }
        }
      },
      created(){
        this.$nextTick(()=>{
          this._setBoxHeight();
          this. _initListScroll();
        })
      },
      methods:{
        ...mapMutations([
          'SET_PLAY_MODE',
          'SET_CURRENT_INDEX',
          'INCREASE_CURRENT_INDEX',
          'DELETE_PLAYLIST',
          'DECREASE_CURRENT_INDEX',
          'SET_PLAYLIST'
        ]),
        _hideList(){
          this.$emit('hidePlayList');
        },
        _initListScroll(){
          if (!this.listScroll) {
            this.listitem = new BSCroll("#bsWrapper",{
              scrollX:false,
              scrollY:true,
              click:true
            })
          }else{
            this.listScroll.refresh();
          }
        },
        _setBoxHeight(){
          let height =  document.documentElement.clientHeight || document.body.clientHeight;
          console.log(height);
          this.$refs.bsBox.style.maxHeight = height*0.6 + 'px';
        },
        _deleteSingle(index){
          this.DELETE_PLAYLIST(index);
          if (this.currentIndex >= index) {
            this.DECREASE_CURRENT_INDEX();
          }
        },
        _deleteAll(){
          this.SET_PLAYLIST([]);
          this.$emit('emptyList');
        }
      }
    }
</script>

<style scoped lang="less">
  @import "../../common/less/index";
  #playListWrapper{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    max-height: 60%;
    border-radius: 0.2rem 0.2rem 0rem 0rem;
    z-index: 400;
    overflow: hidden;
    background-color: #fff;
    padding: 0rem 0.2rem;
    box-shadow: 1px -0.5px 1px 1px #ccc;
    .header {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 0.8rem;
      line-height: 0.8rem;
      background-color: #fff;
      z-index: 1;
      &.border-1px {
        .border-1px(#fafafa);
      }
      .methods {
        float: left;
        display: inline-block;
        line-height: 0.8rem;
        height: 100%;
        font-size: 0.32rem;
        vertical-align: middle;
        text-align: left;
        .img{
          display: inline-block;
          height: 100%;
          line-height: 0.8rem;
          vertical-align: middle;
          img{
            vertical-align: middle;
          }
        }
        .text{
          display: inline-block;
          vertical-align: middle;
        }
        .count{
          color: #bfbfbf;
        }

      }
      .right{
        float: right;
        height: 100%;
        font-size: 0.32rem;
        .delete{
          color: #bfbfbf;
          display: inline-block;
          position: relative;
          padding-right: 0.2rem;
          padding-left: 0.3rem;
          line-height: 0.8rem;
          height: 100%;
          &::before{
            content: '';
            display: block;
            position: absolute;
            left: 0;
            top: 0.1rem;
            height: 0.6rem;
            width: 1px;
            border-left: 1px solid #f5f5f5;
          }
        }
        .save{
          display: inline-block;
          height: 100%;
          padding-right: 0.2rem;
          .icon-plus{
            font-size: 0.28rem;
          }
        }
      }
    }
    .close{
      position: absolute;
      left: 0;
      bottom: 0;
      height: 0.8rem;
      width: 100%;
      line-height: 0.8rem;
      background-color: #fff;
    }
    #bsWrapper{
      width: 100%;
      overflow: hidden;
      .list-wrapper{
        padding-bottom: 1.4rem;
        max-height: 100%;
        overflow: hidden;
        .content-wrapper{
          .list-item{
            height: 0.8rem;
            line-height: 0.8rem;
            width: 100%;
            overflow: hidden;
            text-align: left;
            &.border-1px{
              .border-1px(#fafafa);
            }
            &.highLight{
              .left{
                .song-name{
                  color: rgba(184,82,72,.8);
                  .name,.alias,.icon-volume-medium{
                    color: rgba(184,82,72,.8);
                  }
                }
              }
            }
            .right{
              float: right;
              padding-right: 0.2rem;
              .icon-attachment{
                padding-right: 0.2rem;
                font-size: 0.3rem;
                color: #bfbfbf;
              }
              .icon-cross{
                font-size: 0.28rem;
                color: #bfbfbf ;
              }
            }
            .left{
              overflow: hidden;
              text-align: left;
              .song-name{
                .name,.alias,.icon-volume-medium{
                  color: rgba(0,0,0,4);
                  font-size: 0.32rem;
                }
              }
            }
          }
        }
      }
    }

  }
</style>
