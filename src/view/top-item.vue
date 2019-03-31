<template>
  <div id="topItem" :class="{isFlex:type==='suggest'}">
    <div v-if="type ==='official'" class="official-top">
      <router-link class="topItem"  :to="{name:'playList',params: {id:listData.id,data:playListData}}" >
        <div class="left f-left">
          <img v-lazy="listData.coverImgUrl+'+?param=400y400'"/>
          <span class="updateFrequency">{{listData.updateFrequency}}</span>
        </div>
        <div class="right">
          <div v-for="(song,index) in tracks" :key="index" class="song-item">
            <span>{{index+1}}.</span>
            <span>{{song.name}} - </span>
            <span v-for="(singer,index) in song.ar">{{singer.name}}<i v-if="index!==song.ar.length-1">/</i></span>
          </div>
        </div>
      </router-link>
    </div>
    <div v-if="type ==='suggest'" class="suggest-top">
      <router-link class="topItem"  :to="{name:'playList',params: {id:listData.id,data:playListData}}" >
        <img class="img" v-lazy="listData.coverImgUrl+'+?param=400y400'" />
        <span class="updateFrequency">{{listData.updateFrequency}}</span>
        <div class="title">{{listData.name}}</div>
      </router-link>
    </div>
  </div>
</template>
<script>
  import api from '../api/index'
    export default {
        name: "top-item",
      data(){
          return {
            playListData:null,
            tracks:null
          }
      },
      props:{
        listData:{
            type:Object,
            default:{}
          },
        type:{
          type:String,
          default: ''
        }
      },
      created(){
          if (this.type === "official") {
            this.$http.get(api.getPlayListDetail(this.listData.id)).then((res)=>{
              if (res.data.code === 200) {
                this.playListData = res.data.playlist;
                this.tracks = this.playListData.tracks.slice(0,3);
              }
            }).catch((err)=>{
              console.log(err);
            })
          }
      }
    }
</script>

<style scoped lang="less">
  #topItem{
    &.isFlex{
      float: left;
      width: 33.33%;
      padding-right: 0.2rem;
    }
    .official-top {
      width: 100%;
      padding: 0.2rem;
      height: 2rem;
      .topItem {
        display: block;
        width: 100%;
        height: 100%;
        .left {
          width: 1.6rem;
          width: 1.6rem;
          position: relative;
          img {
            width: 100%;
            height: 100%;
            border-radius: 0.1rem;
          }
          .updateFrequency {
            position: absolute;
            left: 0.1rem;
            bottom: 0.1rem;
            font-size: 0.22rem;
            color: #e8e8e8;
          }
        }
        .right {
          height: 100%;
          padding: 0.2rem;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: left;
          .song-item {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
    .suggest-top{
      display: inline-block;
      width: 100%;
      margin-bottom: 0.2rem;
      .topItem {
        display: block;
        width: 100%;
        position: relative;
        font-size: 0;
        .img{
          width: 100%;
          height: 100%;
          border-radius: 0.1rem;
        }
        .updateFrequency {
          position: absolute;
          display: block;
          width: 100%;
          //background-color: rgba(0,0,0,.3);
          padding-left: 0.1rem;
          text-align: left;
          left: 0;
          bottom: 0.9rem;
          font-size: 0.22rem;
          height: 0.5rem;
          line-height: 0.5rem;
          color: #e8e8e8;
          border-radius: 0rem 0rem 0.1rem 0.1rem;
        }
        .title{
          width: 100%;
          height: 0.8rem;
          font-size: 0.24rem;
          text-align: left;
          margin-top: 0.1rem;
          line-height: 1.5;
        }
      }
    }
  }
</style>
