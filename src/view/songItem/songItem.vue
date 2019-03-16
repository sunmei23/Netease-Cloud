<template>
  <div id="songItem">
    <ul class="songlist-wrapper">
      <li v-for="(song,index) in songs" :key='index' class="song-item">
        <div class="Number" v-if="haveNumber">{{index+1}}</div>
        <div class="song" :class="(index == songs.length-1) ?'border-none':'border-1px'">
          <div class="left"   @click="selectPlay({list:songs,index:index})">
            <router-link :to="{name:'playMusic',params:{musicId:song.id}}">
              <div class="song-name"><span class="name">{{song.name}}</span><span class="alias" v-if="song.alias && song.alias.length > 0"> ({{song.alias[0]}})</span></div>
              <div class="singer">
                <span v-for="(singer,index) in song.artists">{{singer.name}}<i v-if="index != song.artists.length - 1"> / </i></span>
                <span v-for="(singer,index) in song.ar">{{singer.name}}<i v-if="index != song.ar.length - 1"> / </i></span>
                <span v-if="song.album"> - {{song.album.name}}</span>
              </div>
              <div class="alias" v-if="song.alias && song.alias.length > 0">
                <span>{{song.alias[0]}}</span>
              </div>
            </router-link>
          </div>
          <div class="right">
            <!--<span class="icon-play2"></span>-->
            <span class="more">
                  <i class="dot"></i>
                  <i class="dot"></i>
                  <i class="dot"></i>
                </span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {mapActions} from 'vuex';
    export default {
        name: "songItem",
        data(){
            return{
              songsId:[]
            }
        },
      props:{
        haveNumber:{
          type:Boolean,
          default:false
        },
        songs:{
          type: Array,
          default: []
        }
      },
      created(){
          this.songs.forEach((val,index)=>{
            this.songsId.push(val.id);
          })
      },
      methods:{
        ...mapActions([
          'selectPlay'
        ])
      }
    }
</script>

<style scoped lang="less">
  @import "../../common/less/index";
  #songItem{
    .songlist-wrapper {
      .song-item {
        display: flex;
        height: 1.5rem;
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
          display: flex;
          align-items: center;
          justify-content: center;
          &.border-1px{
            .border-1px(#fafafa);
          }
          &.border-none{
            .border-none();
          }
          .left {
            overflow: hidden;
            /*padding-top: 0.1rem;*/
            display: inline-block;
            vertical-align: center;
            flex: 1;
            .song-name{
              display: inline-block;
              width: 100%;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              padding-bottom: 0.05rem;
              color: #595959;
              font-size: 0.30rem;
              .alias{
                color: #666;
              }
            }
            .singer,.alias{
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
            /*float: right;*/
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
                width: 0.06rem;
                height: 0.06rem;
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

</style>
