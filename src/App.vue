<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <!--<play-music></play-music>-->
    <div v-show="showPlayFlag" class="small-play">
      <router-view name="music"></router-view>
    </div>
  </div>
</template>

<script>
import playMusic from './components/playMusic/playMusic'
import {mapGetters,mapMutations} from 'vuex';
export default {
  name: 'App',
  data(){
    return {
      showFlag:false
    }
  },
  components:{
    playMusic
  },
  computed:{
    ...mapGetters([
      'playList',
      'showPlayFlag'
    ])
  },
  watch:{
    playList:{
      handler(newVal){
        if (newVal.length > 0) {
          this.SET_SHOW_PLAY_FLAG(true);
        }else{
          this.SET_SHOW_PLAY_FLAG(false);
        }
      },
      deep:true
    }
  },
  methods:{
    ...mapMutations([
      'SET_SHOW_PLAY_FLAG'
    ])
  },
  beforeRouteEnter(to,from,next){
    next(vm=>{
      if (/playMusic/.test(to.path)) {
        console.log(vm.showFlag);
        vm.SET_SHOW_PLAY_FLAG(true);
      }
    })
  }
}
</script>

<style lang="less" rel="stylesheet/less">
  @import "common/less/var";
  html,body{
    height: 100%;
    box-sizing: border-box;
  }
  .swiper-pagination-bullet-active{
    background-color: @snColor;
  }
  .swiper-pagination-bullet{
    width: 0.16rem;
    height: 0.16rem;
  }
  .swiper-container-horizontal > .swiper-pagination-bullets .swiper-pagination-bullet {
    margin: 0 0.08rem;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    font-size: 0.28rem;
    height: 100%;
    .small-play{
      height: 1.2rem;
      width: 100%;
    }
  }
</style>
