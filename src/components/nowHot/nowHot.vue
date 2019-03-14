<template>
    <div id="nowHot">
      <div v-if="loadingFlag" class="loading-wrapper">
        <div class="loading"></div>
        <div class="loading-text">正在加载中</div>
      </div>
      <div v-else>
        <div v-if=swiperSlides.length class="banner-wrapper">
          <swiper :options="swiperOption" ref="mySwiper">
            <swiper-slide v-for="(slide,index) in swiperSlides" :key="index">
              <div class="banner-item">
                <img :src="slide.picUrl" class="banner-img" v-if="index===0 || index===swiperSlides.length-1"/>
                <div v-lazy-container="{ selector: 'img' }" v-else>
                  <img  :data-src="slide.picUrl+'?param=710y330'" class="banner-img"  data-loading="static/image_335x175.png"
                        data-error="static/image_335x175.png"/>
                </div>
              </div>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
        <div class="nh-content-wrapper">
          <section class="songList-wrapper">
            <div class="flag">
              <div class="left">
                <span class="icon-calendar"></span>
                <span class="text">推荐歌单</span>
              </div>
              <div class="right">更多 ></div>
            </div>
            <div class="sl-content-wrapper">
              <div v-for="listitem in recommendPlayLists" :key="listitem.id" class="sl-content">
                <router-link :to="{name:'playList',params: {id:listitem.id,data:listitem}}" >
                  <list-item :playlist="listitem"></list-item>
                </router-link>
              </div>
            </div>
          </section>
          <section class="mvList-wrapper">
            <div class="flag">
              <div class="left">
                <span class="icon-calendar"></span>
                <span class="text">推荐歌曲</span>
              </div>
              <div class="right">更多 ></div>
            </div>
            <div class="mv-content-wrapper">
              <div class="mv-content" v-for="songitem in recommendSongLists" :key="songitem.id">
                <router-link :to="{name:'playMusic',params:{musicId:songitem.id}}">
                <img v-lazy="songitem.song.album.picUrl+'?param=400y400'" class="mv-img">
                <div class="mv-name">{{songitem.name}}</div>
                <div class="mv-singer">
                  <span v-for="(singer,index) in songitem.song.artists" :key="singer.id">{{singer.name}}
                    <i class="split" v-if="index !== songitem.song.artists.length -1"> / </i></span>
                </div>
                </router-link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
</template>

<script>
  import api from '../../api/index.js'
  import 'swiper/dist/css/swiper.css'
  import listItem from '../../view/listItem/listItem'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
    export default {
      name: "nowHot",
      data(){
          return{
            swiperOption: {
              pagination: {
                el: '.swiper-pagination'
              },
              autoplay:{
                disableOnInteraction:false,
                delay:4000
              },
              speed:800,
              loop:true,
              initialSlide :0,
              observer:true,
              observeParents:true
            },
            swiperSlides:[],
            recommendPlayLists:[],
            recommendSongLists:[],
            recommendMVLists:[],
            loadingFlag:true,
          }
      },
      props:{
        update:{
          type:Boolean,
          default: false
        }
      },
      watch:{
        $route(newVal,oldVal) {
            if (newVal.meta.index !== 0) {
              this.swiper.autoplay.stop();
            }
            else {
              this.swiper.autoplay.start();
            }
          },
        update(newOld){
          if (newOld){//更新数据 重新发送Ajax请求
            Promise.all([this.$http.get(api.getBannerList()),this.$http.get(api.getPersonalized()),
              this.$http.get(api.getPersonalizedSong())]).then((lists)=>{
              this.swiperSlides = lists[0].data.banners;
              this.swiper.slideNext();
              this.recommendPlayLists = lists[1].data.playlists;
              this.recommendSongLists = lists[2].data.result;
              this.$root.eventHub.$emit('answerUpdateResult', true);
            }).catch((err)=>{
              console.log(err);
              this.$root.eventHub.$emit('answerUpdateResult', false);
            })
          }
        }
      },
      computed:{
        swiper(){
          return this.$refs.mySwiper.swiper;
        }
      },
      created(){
        Promise.all([this.$http.get(api.getBannerList()),this.$http.get(api.getPersonalized()),
          this.$http.get(api.getPersonalizedSong())]).then((lists)=>{
          this.swiperSlides = lists[0].data.banners;
          this.recommendPlayLists = lists[1].data.playlists;
          this.recommendSongLists = lists[2].data.result;
          this.loadingFlag = false;
        }).catch((err)=>{
          console.log(err);
        })
      },
      mounted(){
      },
      methods:{
        _getBannerData(){
          this.$http.get(api.getBannerList()).then(res=>{
            this.swiperSlides = res.banners;
          }).catch(err=>{
            console.log(err.name + err.message);
          })
        },
        _getRecommendPlayList(){
          this.$http.get(api.getPersonalized()).then(res=>{
            this.recommendPlayLists = res.data.result.slice(0,6);
          }).catch(err=>{
            console.log(err.name + err.message);
          })
        },
        _getRecommendMVList(){
          this.$http.get(api.getPersonalizedMV()).then(res=>{
            console.log(res);
            this.recommendMVLists = res.data.result;
          }).catch(err=>{
            console.log(err.name + err.message);
          })
        },
        showListDetail(listitem){
          this.$router.push({name : "playList" , params:{id:listitem.id}});
        }
      },
      components: {
        swiper,
        swiperSlide,
        listItem
      }
    }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import '../../../node_modules/swiper/dist/css/swiper.css';
  @import "../../common/less/var";
#nowHot{
  padding-top: 0.1rem;
  .loading-wrapper{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: #fff;
    .loading{
      position: absolute;
      top:40%;
      left: 50%;
      background: #fff;
      width: 1rem;
      height: 1rem;
      margin-top: -0.6rem;
      margin-left: -0.5rem;
      background: url('../../../static/rage_loading.png') no-repeat;
      background-size: cover;
      animation: rotating 5s linear infinite;
    }
    .loading-text{
      position: absolute;
      top: 40%;
      left: 50%;
      margin-top: 0.65rem;
      margin-left: -0.6rem;
      color: #595959;
      font-size: 0.22rem;
    }
  }
  .banner-item{
    display: block;
    width: 100%;
    padding: 0px 0.2rem;
    height: 3.47rem;

    .banner-img{
      border-radius: 10px;
      width: 100%;
      height: 100%;
    }
  }
  .nh-content-wrapper{
    width: 100%;
    margin-top: 0.1rem;
    padding: 0rem 0.1rem;
    .flag{
      height: 0.7rem;
      line-height: 0.7rem;
      .left{
        float: left;
        font-size: 0.28rem;
        font-weight: bold;
        .icon-calendar{
          color: @snColor;
        }
      }
      .right{
        font-size: 0.24rem;
        float: right;
        font-weight: bold;
      }
    }
    .songList-wrapper{
      width: 100%;
      text-align: center;
      .sl-content-wrapper{
        width: 100%;
      }
      .sl-content{
        display: inline-block;
        width: 33.333%;
        padding-right: 0.1rem;
        position: relative;
        /*overflow: hidden;*/
        vertical-align: top;
      }
    }
    .mvList-wrapper{
       width: 100%;
      .mv-content-wrapper{
        width: 100%;
      }
      .mv-content{
        width: 50%;
        display: inline-block;
        padding-right: 0.1rem;
        padding-bottom: 0.1rem;
        vertical-align: top;
        text-align: left;
        line-height: 1.5;
        .mv-img{
          width: 100%;
          height: 100%;
        }
        .mv-name{
          width: 100%;
          /*height: 0.42rem;*/
          max-height: 0.84rem;
          overflow: hidden;
        }
        .mv-singer{
          width: 100%;
          height: 0.36rem;
          font-size: 0.24rem;
          overflow:hidden;
          white-space:nowrap;
          text-overflow: ellipsis;
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
</style>
