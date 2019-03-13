<template>
    <div id="listItem">
      <div class="number">
        <div class="number-val">{{playlist.playCount | playCountTransform()}}</div>
      </div>
      <img class="img" v-lazy="playlist.coverImgUrl + '?param=400y400'" />
      <div class="title">{{playlist.name}}</div>
    </div>
</template>

<script>
    export default {
        name: "listItem",
        props:{
          playlist:{
            type:Object,
            default:{}
          }
        }
    }
</script>

<style scoped lang="less">
#listItem{
  width: 100%;
  .number{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 0.5rem;
    padding-right: 0.1rem;
    .number-val{
      width: 100%;
      background-color: rgba(0,0,0,.2);
      padding: 0.04rem 0.1rem;
      text-align: right;
      color: white;
      font-size: 0.2rem;
    }
  }
  .img{
    width: 100%;
    height: 100%;
  }
  .title{
    width: 100%;
    min-height: 0.8rem;
    font-size: 0.24rem;
    text-align: left;
    line-height: 1.5;
  }
}
</style>
