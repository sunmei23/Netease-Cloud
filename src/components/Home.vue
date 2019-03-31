<template>
    <div id="home">
      <div ref="header" class="header-wrapper">
        <nt-header></nt-header>
        <!--<div class="link-tab-wrapper">-->
          <!--<div class="link-wrapper">-->
            <!--<router-link :to="{name:'nowHot'}">推荐</router-link>-->
            <!--<router-link :to="{name:'top'}">排行榜</router-link>-->
            <!--<router-link :to="{name:'hotSinger'}">热门歌手</router-link>-->
          <!--</div>-->
          <!--<span class="tab-link-highLight" ref="highLight">-->
      <!--<span class="content"></span>-->
    <!--</span>-->
        <!--</div>-->
      </div>
      <div  class="main-content" ref="main">
        <div class="content-wrapper">
          <div class="pulldown-wrapper" v-if="linkIndex===0">
            <div class="redBack"></div>
            <div v-if="suggestFlag">
              <div class="downSuggest" v-if="!update">下拉推荐</div>
              <div class="leaveSuggest" v-else>松手推荐</div>
            </div>
            <div class="suggesting" v-show="touchEndFlag"><span class="icon-spinner3"></span></div>
            <transition name="show" v-bind:css="false"
                        v-on:before-enter="beforeEnter"
                        v-on:enter="enter"
                        v-on:leave="leave">
              <div  class="updateResult" v-if="updateResult.has">
                <span v-if="updateResult.state">已为你推荐最新个性化内容</span>
                <span v-else>数据刷新失败!</span>
              </div>
            </transition>
          </div>
          <keep-alive>
            <router-view  :update="touchEndFlag"></router-view>
          </keep-alive>
        </div>
      </div>
    </div>
</template>

<script>
  import NtHeader from './nt-header/nt-header'
  import NtFooter from './nt-footer/nt-footer'
  import  Velocity from 'velocity-animate'
  import BScroll from 'better-scroll';
  const PULL_DOWN_HEIGHT = 0.8;
  export default {
    name: 'home',
    data(){
      return{
        linkIndex: this.$route.meta.index,
        mainScroll:null,
        mainScrollY:0,
        update:false,
        touchEndFlag:false,
        updateResult:{
          has:false,
          state:false
        },
        fadeInDuration:1000,
        fadeOutDuration: 800
      }
    },
    computed:{
      suggestFlag(){
        return !this.touchEndFlag && !(this.updateResult.has);
      },
      CurrentHtmlFontSize(){
        return this.getFontSize(document.documentElement);
      }
    },
    watch:{
      //监测路由变化
      $route(newVal,oldVal){
        this.linkIndex = newVal.meta.index;
       // this._setHighLightOffset();
      },
      mainScrollY(newVal,oldVal){
        let threshold = PULL_DOWN_HEIGHT * this.CurrentHtmlFontSize;
        if (newVal >=  threshold && oldVal < threshold){
          this.update = true;
        }
        else if (newVal < threshold) {
          this.update = false;
        }
      }
    },
    created(){
      this.$nextTick(()=>{
        this._initMainScroll();
        this._mainScrollListener();
      });
    },
    mounted(){
      //this._setHighLightOffset();
    },
    methods:{
      _setHighLightOffset(){
        let offsetVal = this.linkIndex * 100;
        let spanEle = this.$refs.highLight;
        let text = `translate3d(${offsetVal}%,0px,0px)`;
        spanEle.style.transform = text;
        spanEle.style.webkitTransform = text;
      },
      _initMainScroll(){
        if(!this.mainScroll){
          this.mainScroll = new BScroll(".main-content",{
            scrollX:false,
            scrollY:true,
            click:true,
            probeType: 3,
            pullDownRefresh:{
              threshold:PULL_DOWN_HEIGHT * this.CurrentHtmlFontSize ,
              stop: (PULL_DOWN_HEIGHT - 0.1)* this.CurrentHtmlFontSize
            }
          });
        } else{
          this.mainScroll.refresh();
        }
        this.touchEndFlag = false;
        this.mainScroll.on('pullingDown',()=>{
          console.log('处理下拉刷新操作');
          this.touchEndFlag = true;
          this.update = false;
          this.$root.eventHub.$on('answerUpdateResult', (data)=>{
            // 处理数据
            this.update = false;
            this.touchEndFlag = false;
            this.updateResult.has = true;
            this.updateResult.state = data;
            this.mainScroll.finishPullDown();
          });
        })
      },
      _mainScrollListener(){
        this.mainScroll.on('scroll',(pos)=>{
          this.mainScrollY = Math.round(pos.y);
        })
      },
      beforeEnter: function (el) {
        //step1
        el.style.opacity = 0;
      },
      // 当与 CSS 结合使用时
      // 回调函数 done 是可选的
      enter: function (el, done) {
        // step2
        let vm = this;
        Velocity(el,
          { opacity: 1 },
          {
            duration: this.fadeInDuration,
            complete: function () {
              done();
              vm.updateResult.has = false;
            }
          }
        );
      },
      leave: function (el, done) {
        // step3
        let vm = this;
        Velocity(el,
          { opacity: 0 },
          {
            duration: this.fadeOutDuration,
            complete: function () {
              done();
            }
          }
        );
      },
      afterLeave: function (el) {
        console.log(6);
        el.style.opacity = 0
        // ...
      }
    },
    components:{
      NtHeader,
      NtFooter
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../common/less/var";
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
  #home {
    height: 100%;
    .header-wrapper{
      position: fixed;
      width: 100%;
      left: 0;
      top: 0;
      z-index: 200;
      background-color: @snColor;
      .link-tab-wrapper{
        .link-wrapper{
          display: flex;
          height: 0.66rem;
          a{
            color: #fff;
            display: inline-block;
            flex: 1;
            height: 100%;
            padding: 0rem 10px 0rem;
            text-align: center;
            line-height: 0.72rem;
            &.tab-active{
              color: #fff;
            }
          }
        }
        .tab-link-highLight{
          padding:  0 10px;
          display: block;
          width: 33.3333%;
          height: 0.04rem;
          transition:all 0.5s linear;
          .content{
            display: block;
            width: 100%;
            height: 100%;
            background-color: #fff;
          }
        }
      }
    }
    .main-content{
      position: fixed;
      left: 0;
      /*top: 1.66rem;*/
      top: 0.88rem;
      padding-bottom: 1.08rem;
      width: 100%;
      height: 100%;
      z-index: 100;
      .content-wrapper{
        position: relative;
        padding-bottom: 2.08rem;
        .redBack{
          position: absolute;
          width: 100%;
          height: 50%;
          background-color: @snColor;
          left: 0px;
          top: -50%;
          margin-top: 2.8rem;
        }
        .leaveSuggest,.suggesting,.downSuggest{
          width: 100%;
          height: 0.28rem;
          text-align: center;
          position: absolute;
          left: 0;
          top: -0.28rem;
          z-index: 1;
          font-size: 0.28rem;
          color: #fff;
          &.suggesting{
            top: -0.3rem;
            animation: rotating 5s linear infinite;
            .icon-spinner3{
              font-size: 0.36rem;
            }
          }
        }
        .updateResult{
          position: absolute;
          left: 0;
          top: 0.3rem;
          right: 0;
          z-index: 2;
          span{
            text-align: center;
            border: 1px solid #ccc;
            background-color: rgba(0,0,0,.4);
            color: #fff;
            font-size: 0.28rem ;
            padding: 0.08rem 0.2rem;
            border-radius: 8px;
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
