<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>

export default {
  name: 'App'
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
  }
</style>
