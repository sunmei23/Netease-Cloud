<template>
    <div id="playMusic">
      <!--name="pullDown"-->
      <transition name="move" >
        <div class="normal-player" key="normal" v-if="fullScreen">
          <div class="bg-wrapper">
            <div class="bg">
              <img :src="currentSong.al && currentSong.al.picUrl+'?param=400y400'" alt=""/>
            </div>
            <div class="bg2"></div>
          </div>
          <nav class="header-wrapper">
            <div class="left">
              <span class="ele-icon-arrow_lift goBack" @click="goBack"></span>
            </div>
            <div class="center-wrapper">
              <div class="song-name">
                <span class="name">{{currentSong.name}}</span>
                <span class="alias" v-if="(typeof(currentSong.alia)==='Array') && currentSong.alia.length > 0"> ({{currentSong.alia[0]}})</span>
              </div>
              <div class="singer">
                <span v-for="(singer,index) in currentSong.ar">{{singer.name}}<i v-if="index != currentSong.ar.length - 1"> / </i></span>
                <span v-for="(singer,index) in currentSong.artists">{{singer.name}}<i v-if="index != currentSong.artists.length - 1"> / </i></span>
              </div>
            </div>
            <div class="right"></div>
          </nav>
          <div class="middle" :class="{'showImg': !showLyric}" @click="_toggleLyric">
            <message-alert :isShow="isShowAlert" :message="alertMessage" :fadeOutDuration="3000"
                           @unShow="changeAlertFlag(false)"></message-alert>
            <div class="show-img-wrapper" :class="showLyric ? 'hide':'show'">
              <div class="img-wrapper" >
                <img :src="currentSong.al&&currentSong.al.picUrl && currentSong.al.picUrl+'?param=400y400'" class="img"
                     :class="playing ? 'running': 'pause'">
              </div>
              <!--显示当前歌词-->
              <div class="currentLyric">
                <div v-if="currentLyric && lyricState===0">{{currentLineLyric}}</div>
                <div v-else class="lyric-error">
                  <span v-show="lyricState===1">纯音乐,没有歌词</span>
                  <span v-show="lyricState===2">未找到歌词</span>
                  <span v-show="lyricState===3">请求歌词失败</span>
                </div>
              </div>
            </div>
            <div class="show-lyric-wrapper" :class="showLyric ? 'show':'hide'">
              <div v-if="lyricState===0" class="lyric-ok">
                <lyric-scroll :lyric-lines="currentLyric && currentLyric.lines" :current-line="currentLine"
                              @changeCurrentTime="_setCurrentTime"></lyric-scroll>
              </div>
              <div v-if="lyricState!==0" class="lyric-error">
                <span v-show="lyricState===1">纯音乐,没有歌词</span>
                <span v-show="lyricState===2">未找到歌词</span>
                <span v-show="lyricState===3">请求歌词失败</span>
               </div>
            </div>
          </div>
          <div class="bottom">
            <div class="progress-wrapper">
              <span class="time time-l">{{format(currentTime) }}</span>
              <div class="progress-bar-wrapper">
                <progress-bar :precent="playPercent" @percentChange="handlePercentChange"></progress-bar>
              </div>
              <span class="time time-r">{{format((currentSong.dt|currentSong.duration)/1000)}}</span>
            </div>
            <div class="play-set">
              <div class="methods" @click="SET_PLAY_MODE()">
                <span class="icon-loop" v-show="mode===0"></span>
                <span v-show="mode===1"><img src="static/single_loop.png" width="24" height="22"/></span>
                <span class="icon-shuffle" v-show="mode===2"></span>
              </div>
              <div class="pre" @click="playPre"><span class="icon-previous"></span></div>
              <div class="playing">
                <span v-show="playing" class="icon-pause" @click.stop="SET_PLAYING_STATE(false)"></span>
                <span v-show="!playing" class="icon-play2" @click.stop="SET_PLAYING_STATE(true)"></span>
              </div>
              <div class="next" @click="playNext"><span class="icon-next"></span></div>
              <div class="play-list" @click.stop="togglePlayList"><span class="icon-list2"></span></div>
            </div>
          </div>
        </div>
        <div class="small-player"  key="small" v-else>
          <div class="border-1px">
            <div class="right">
              <div class="playing">
                <span v-show="playing" class="icon-pause" @click.stop="SET_PLAYING_STATE(false)"></span>
                <span v-show="!playing" class="icon-play2" @click.stop="SET_PLAYING_STATE(true)"></span>
              </div>
              <div class="play-list" @click.stop="togglePlayList"><span class="icon-list2"></span></div>
            </div>
            <div class="left" @click="changeRouter(currentSongId,true)">
              <div class="img"><img :src="currentSong.al && currentSong.al.picUrl+'?param=200y200'"/></div>
              <div class="song-name-wrapper">
                <span class="name">{{currentSong.name}}</span>
                <div class="singer">
                  <span v-for="(singer,index) in currentSong.ar">{{singer.name}}<i v-if="index != currentSong.ar.length - 1"> / </i></span>
                  <span v-for="(singer,index) in currentSong.artists">{{singer.name}}<i v-if="index != currentSong.artists.length - 1"> / </i></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
      <audio :src="mp3Src || (currentSong && currentSong.url)" ref="audio" autoplay @canplay="ready" @error="error"
             @play="play" @timeupdate="updateTime" @ended="end"></audio>
      <play-list @hidePlayList="togglePlayList" @emptyList="goBack" :isShow="showPlayListFlag" ></play-list>

    </div>
</template>

<script>
  import {mapGetters,mapMutations} from 'vuex';
  import {playMode,lyricStates} from '../../common/js/config.js';
  import progressBar from '../../view/progressBar/progressBar';
  import lyricScroll from '../../view/lyricScroll/lyricScroll';
  import playList from '../../view/playList/playList';
  import Lyric from 'lyric-parser'
  import api from '../../api/index'
  import MessageAlert from '../../view/messageAlert/messageAlert'
    export default {
        name: "playMusic",
      components:{progressBar,lyricScroll,playList,MessageAlert},
      data(){
          return{
            showLyric:false,
            mp3Src:null,
            audio:{},
            currentTime:0,
            currentLyric:null,
            currentLine:0,
            currentLineLyric:'',
            playPercent:0,
            musicId:null,
            showPlayListFlag:false,
            lyricState:lyricStates.NORMAL,
            isShowAlert:false,
            alertMessage:'',
            audioErrorFlag:false
          }
      },
      created(){
        //console.log("created");
        this.requestData(this.$route.params.musicId);
          this.$nextTick(()=> {
            //请求数据
            document.addEventListener("visibilitychange", function () {
              if (this.audio) {
                if(!document.hidden){   //处于当前页面
                  alert("进入");
                  if(this.audio.paused){
                  }
                }else{
                  alert("离开");
                  //this.audio.pause();
                }
              }
            });
          })
      },
      mounted(){
        this.audio = this.$refs.audio;
        window.addEventListener('touchstart', this.forceSafariPlayAudio, false);
      },
      computed:{
        ...mapGetters([
          'fullScreen',
          'playList',
          'currentSong',
          'playing',
          'currentIndex',
          'mode',
          'idIsHas',
          'currentSongId',
          'currentLyricLine'
        ])
      },
      watch: {
          currentSong:{
            handler(newVal, oldVal){
              if (newVal === oldVal){
                return;
              }
              if (this.currentLyric){
                this.currentLyric.stop();
              }
            },
            immediate:true,
            deep:true
          },
        currentSongId(newVal,oldVal){
            if (newVal === oldVal){
              return;
            }
          this.changeRouter(newVal);

        },
        playing(newVal){
          this.audio = this.$refs.audio;
           this.$nextTick(()=>{
             if (this.audioErrorFlag) {
               this.audio.load();
               this.audioErrorFlag = false;
             }else{
               newVal ? this.audio.play(): this.audio.pause()
             }
           })
        },
        currentTime(newVal){
          this.playPercent = newVal / ((this.currentSong.dt | this.currentSong.duration)/1000);
          if (this.currentLyric && this.lyricState === lyricStates.NORMAL){
            let len = this.currentLyric.lines.length;
            for (let i=0; i< len; i++){
              if (i===len-1){
                if (newVal >= this.currentLyric.lines[i].time/1000) {
                  this.currentLine = i;
                }
              }else if(newVal >= this.currentLyric.lines[i].time/1000 && newVal < this.currentLyric.lines[i+1].time/1000){
                this.currentLine = i;
              }
            }
            this.currentLineLyric = this.currentLyric.lines[this.currentLine].txt;
          }
        }
      },
      methods:{
        ...mapMutations([
          'INCREASE_CURRENT_INDEX',
          'DECREASE_CURRENT_INDEX',
          'SET_CURRENT_INDEX',
          'SET_PLAY_MODE',
          'ADD_PLAYLIST',
          'SET_FULL_SCREEN',
          'SET_PLAYING_STATE',
          'SET_SONG_ID',
          'SET_SHOW_PLAY_FLAG',
          'DELETE_PLAYLIST'
        ]),
        requestData(id){
          if (typeof (id) === "undefined"){
            return;
          }
         //根据当前歌曲id获得歌曲信息
        this.$http.get(api.getSongDetail(id))
          .then((res)=>{
            if (res.data.code === 200){
              if (this.playList.length === 0){
                this.ADD_PLAYLIST(res.data.songs[0]);
                this.SET_CURRENT_INDEX(0);
              } else {
                let index = this.idIsHas(id);
                if ( index=== -1) {//播放列表中没找到 添加到播放列表中
                  this.ADD_PLAYLIST(res.data.songs[0]);
                  this.SET_CURRENT_INDEX(this.playList.length -1);
                }else{
                   this.DELETE_PLAYLIST({index:index,song:res.data.songs[0]});
                   this.SET_CURRENT_INDEX(index);
                }
              }
            }
          }).catch(err=>{console.log(err)});
          this._getMusicMp3(id);
          this._getLyric(id);
        },
        _handleLyric(){
        },
        _getMusicMp3(id){
          // this.$http.get(`https://api.bzqll.com/music/netease/url?key=579621905&id=${id}&br=999000`)
          //this.mp3Src= `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
          this.$http.get(api.getSong(id))
            .then((res)=>{
              if (res.data.code === 200){
                this.mp3Src = res.data.data[0].url;
              }
          }).catch((err)=>{
            console.log(err);
          });
        },
        _getLyric(id){
          // this.$http.get(`https://api.bzqll.com/music/netease/lrc?key=579621905&id=${id}`)
          this.$http.get(api.getLrc(id))
            .then((res=>{
              if (typeof(res.data.lrc) === "undefined"){//歌词不存在
                this.lyricState = lyricStates.NOTEXIST;
              }else{
                const lyric = res.data.lrc.lyric;
                this.currentLyric = new Lyric(lyric,this._handleLyric);
                if (this.currentLyric.lines.length === 0){
                  this.lyricState = lyricStates.NOTFIND;
                }else{
                  this.lyricState = lyricStates.NORMAL;
                  if (this.playing) {
                    this.currentLyric.play();
                  }
                }
              }
            })).catch((err)=>{
            this.lyricState = lyricStates.FAILURE;
          })
        },
        ready(){
          //console.log('ready 音乐开始播放');//音乐开始播放
          this.SET_PLAYING_STATE(true);
        },
        error(){
          // console.log('error 失败 播放下一首')//失败 播放下一首
          this.SET_PLAYING_STATE(false);
          this.audioErrorFlag = true;
          this.changeAlertFlag(true);
          this.alertMessage = '音频文件加载失败！'
        },
        updateTime(e){
          this.currentTime = e.target.currentTime;// 获取当前播放时间段
        },
        end(){
          if (this.mode === playMode.sequence) {
            this.INCREASE_CURRENT_INDEX();
          }else if (this.mode === playMode.loop) {
            this.audio.load();
          }else{
            this.SET_CURRENT_INDEX(Math.floor(Math.random()*this.playList.length));
          }
        },
        playNext(){
          if (this.mode === playMode.random){
            this.SET_CURRENT_INDEX(Math.floor(Math.random()*this.playList.length));
          }else{
            this.INCREASE_CURRENT_INDEX();
          }
        },
        playPre(){
          if (this.mode === playMode.random){
            this.SET_CURRENT_INDEX(Math.floor(Math.random()*this.playList.length));
          }else{
            this.DECREASE_CURRENT_INDEX();
          }
        },
        play(){
          //console.log("audio能够播放")
          this.audioErrorFlag = false;
          window.removeEventListener('touchstart', this.forceSafariPlayAudio, false);
        },
        _resetSong(){
          if (this.currentLyric){
            this.currentLyric.stop();
            this.currentLyric.seek(0);//播放完成后重置歌词
          }
          this.currentTime = 0;//audio播放时间设置为0.
        },
        handlePercentChange(percent){//处理点击拖动进度条
          this._setCurrentTime((this.currentSong.dt/1000)*percent);
        },
        _setCurrentTime(val){
          this.currentTime = val;
          if('fastSeek' in this.audio){
            this.audio.fastSeek(this.currentTime);//改变audio.currentTime的值
          }else if( (this.audio.seekable.start(0) <= this.currentTime) && //判断事件是否在缓存时间内
            (this.currentTime <= this.audio.seekable.end(this.audio.seekable.length-1))){
            this.audio.currentTime = this.currentTime;
          }else{
            this.audio.currentTime = this.audio.buffered.end(this.audio.buffered.length-1)
          }
        },
        _toggleLyric(){
          this.showLyric = !this.showLyric;
          this.showPlayListFlag=false;
        },
        goBack(){
          this.SET_FULL_SCREEN(false);
          if (this.playList.length === 0){//播放列表为空 停止播放
            this._resetSong();
            this.audio.pause();
          }
          if (window.history.length <= 1){
            this.$router.push('/');
          }else{
            this.$router.go(-1);
          }
          this.showPlayListFlag = false;//当前播放列表不显示
        },
        changeRouter(songId,flag=false){//切换歌曲，切换路由
          this._resetSong();//清空歌曲信息
          this.audioErrorFlag = false;
          if (!this.fullScreen && !flag){//如果不是全屏 不切换路由
            this.requestData(songId);
            return ;
          }else if (flag){
            this.$router.push({
              path:`/playMusic/${songId}`
            })
          }else{
            this.$router.replace({
              path:`/playMusic/${songId}`
            })
          }
        },
        togglePlayList(){
          this.showPlayListFlag = ! this.showPlayListFlag;
        },
        changeAlertFlag(flag){
          this.isShowAlert = flag;
         },
        format(interval=0){//格式化时间
          const minute = this._pad(Math.floor(interval/60));
          const second = this._pad(Math.floor(interval % 60));
          return `${minute}:${second}`;
        },
        _pad(num,n=2){//填充时间
          let len = num.toString().length;
          while(len<n){
            num = '0' + num;
            len ++;
          }
          return num;
        },
        forceSafariPlayAudio() {//处理IOS自动播放失效
          this.audio = this.$refs.audio;
           if (this.audio) {
             this.audio.load(); // iOS 9   还需要额外的 load 一下, 否则直接 play 无效
             this.audio.play(); // iOS 7/8 仅需要 play 一下
           }
        }
      },
      beforeRouteEnter(to, from, next){//路由进入前
        if (/playMusic/.test(to.path)){
          next(vm=>{
            vm.SET_SONG_ID(vm.$route.params.musicId);
            vm.requestData(to.params.musicId);
            vm.SET_SHOW_PLAY_FLAG(true);
            vm.SET_FULL_SCREEN(true);
          });
        }else{
          next();
        }
      },
      beforeRouteUpdate(to, from, next){//路由参数id改变
          this.requestData(to.params.musicId);
          next();
      }
    }
</script>

<style scoped lang="less">
  @import "../../common/less/index";
  #playMusic{
    .normal-player{
      &.pullDown-leave-active,&.pullDown-enter-active{
        transition: all 0.2s 0.5s linear;
      }
      &.pullDown-leave-to,&.pullDown-enter{
        transform: translate3d(0,100%,0);
      }
      &.pullDown-leave,&.pullDown-enter-to{
        transform: translate3d(0,0,0);
      }
      &.move-leave-active{
        transition: all 0.5s linear;
      }
      &.move-enter-active{
        transition: all 0.5s linear;
      }
      &.move-enter,&.move-leave-to{
        transform: translate3d(100%,0,0);
      }
      &.move-enter-to,&.move-leave{
        transform: translate3d(0,0,0);
      }
      width: 100%;
      height: 100%;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 400;
      display: flex;
      flex-direction: column;
      .bg-wrapper{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: -1;
        background-attachment: fixed;
        .bg{
          width: 150%;
          height: 150%;
          margin: -30px;
          filter:blur(30px);
          img{
            width: 100%;
            height: 100%;
          }
        }
        .bg2{
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,.3);//添加一层阴影 处理纯白界面
        }
      }
      .header-wrapper {
        width: 100%;
        height: 1.2rem;
        padding: 0.2rem;
        color: #fff;
        font-size: 0.34rem;
        display: flex;
        text-align: left;
        .left,.center-wrapper,.right{
          height: 100%;
          overflow: hidden;
          &.left{
            flex: 1;
            .goBack{
              /*transform: rotate(-90deg);*/
              display: inline-block;
              height: 0.8rem;
              line-height: 0.8rem;
            }
          }
          &.center-wrapper{
            flex: 3;
            text-align: center;
            .song-name{
              .song-name-style();
            }
            .singer{
              .singer-style();
            }
          }
          &.right{
            flex: 1;
          }
        }
        .border-1px(rgba(255,255,255,.5));
      }
      .middle{
        flex: 1;
        width: 100%;
        line-height: 100%;
        display: flex;
        align-items: center;
        position: relative;
        &.showImg{
          .show-img-wrapper{
            /*padding: 0rem 0.4rem;*/
          }
        }
        .show-img-wrapper{
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          left: 0;
          top: 0;
          .img-wrapper{
            border: 1px solid #262626;
            background-color: #262626;
            border-radius: 50%;
            padding: 0.2rem;
            .img{
              width: 5rem;
              height: 5rem;
              border-radius: 50%;
              animation: rotating 8s linear infinite;
              &.pause{
                animation-play-state:paused;
              }
              &.runing{
                animation-play-state:running;
              }
            }
          }
          .currentLyric{
            position: absolute;
            left: 0;
            bottom: 0.5rem;
            text-align: center;
            width: 100%;
            font-size: 0.32rem;
            color: #fff;
          }
        }
        .show-lyric-wrapper{
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-ok{
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          .lyric-error{
            width: 100%;
            height: 100%;
            overflow: hidden;
            padding-top: 50%;
            color: @snColor;
            font-size: 0.36rem;
          }
        }
      }
      .bottom{
        height: 2.4rem;
        padding: 0rem 0.4rem 0.2rem;
        color: rgba(255,255,255,.6);
        .progress-wrapper{
          height: 0.8rem;
          display: flex;
          align-items: center;
          .time{
            display: inline-block;
            width: 1rem;
            height: 100%;
            line-height: 0.8rem;
            text-align: center;
          }
          .progress-bar-wrapper{
            flex: 1;
            height: 0.04rem;
            width: 100%;
          }
        }
        .play-set{
          display: flex;
          line-height: 1.2rem;
          padding-top: 0.2rem;
          div{
            flex: 1;
            color: rgba(255,255,255,.8);
            font-size: 0.5rem;
            vertical-align: middle;
            text-align: center;
            &.playing{
              font-size: 0.8rem;
            }
            &.pre,&.next{
              font-size: 0.6rem;
            }
            &.methods,&.play-list{
              font-size: 0.4rem;
            }
          }
        }
      }
      @keyframes moving {
        0%{
          transform: translateX(400px);
        }
        20%{
          transform: translateX(100px);
        }
        50%{
          transform: translateX(0px);
        }
        80%{
          transform: translateX(-100px);
        }
        100%{
          transform: translateX(-400px);
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
    .small-player{
      width: 100%;
      height: 1.2rem;
      position: fixed;
      background-color: #fff;
      left: 0;
      bottom: 0;
      z-index: 400;
      .border-1px{
        padding: 0.2rem;
        .border-1px-top(#ccc);
        .left{
          height: 100%;
          text-align: left;
          display: flex;
          overflow: hidden;
          .img{
            width: 0.8rem;
            height: 0.8rem;
            display: inline-block;
            margin-right: 0.1rem;
            img{
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          .song-name-wrapper{
            flex:1;
            overflow: hidden;
            .name{
              .song-name-style();
            }
            .singer{
              display: inline-block;
              .singer-style();
            }
          }
        }
        .right{
          float: right;
          height: 100%;
          padding-right: 0.2rem;
          .playing,.play-list{
            display: inline-block;
            height: 100%;
            line-height: 0.8rem;
            text-align: center;
            color: #B85248;
            vertical-align: middle;
            font-size: 0.4rem;
            &.playing{
              font-size: 0.6rem;
              padding-right: 0.3rem;
              span{
                line-height: 0.8rem;
              }
            }
          }
        }
      }
    }
    .song-name-style{
      display: inline-block;
      width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding-bottom: 0.05rem;
      overflow: hidden;
      .name{
        display: inline-block;
        font-weight: 600;
      }
      .alias{
        font-weight: 400;
      }
    }
    .singer-style{
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
    .show{
      opacity: 1!important;
    }
    .hide{
      opacity: 0!important;
    }
  }
</style>
