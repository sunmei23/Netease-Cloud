<template>
  <div id="nt-header">
    <div class="logo"></div>
    <div class="middle"></div>
    <div class="search"><span class="icon-search"></span></div>
  </div>

</template>

<script>
    export default {
        name: "nt-header"
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import '../../common/less/var';
  #nt-header{
    width: 100%;
    height: 0.96rem;
    padding: 0rem 0.16rem;
    background-color: @snColor;
    display: flex;
    text-align: center;
    align-items: center;
    .logo{
      width: 3rem;
      height: 0.96rem;
      line-height: 0.96rem;
      background: url("../../../static/logo.png") no-repeat center;
      background-size: cover;
    }
    .middle{
      flex: 1;
    }
    .search{
      width: 0.96rem;
      height: 0.96rem;
      line-height: 0.96rem;
      text-align: center;
      font-size: 0.32rem;
      .icon-search{
        font-weight: 400;
        color: white;
        line-height: 0.96rem;
      }
    }
  }
</style>
