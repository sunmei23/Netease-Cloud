<template>
    <div id="songListItem">
      <ul>
        <li v-for="list in songLists">
          <router-link :to="{name:'playList',params:{id:list.id}}" class="list-item">
            <div class="left"><img :src="list.coverImgUrl + '?params=75y75'"/></div>
            <div class="right">
              <span class="title">{{list.name}}</span>
              <span class="desc">
                      <span>{{list.trackCount}}首音乐</span>
                      <span>by{{list.creator.nickname}},</span>
                      <span>播放{{list.playCount | playCountTransform()}}次</span>
            </span>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
</template>

<script>
    export default {
        name: "songListItem",
      props:{
        songLists:{
          type:Array,
          default:[]
        }
      }
    }
</script>

<style scoped lang="less">
#songListItem{
  .list-item{
    height: 1.6rem;
    display: flex;
    align-items: center;
    .left{
      width:1.4rem;
      height: 1.4rem;
      padding: 0.05rem;
      img{
        width: 100%;
        height: 100%;
        border-radius: 0.1rem;
      }
    }
    .right{
      flex: 1;
      align-self: center;
      vertical-align: middle;
      /*height: 1.6rem;*/
      overflow: hidden;
      padding-left: 0.2rem;
      .title,.desc{
        display: inline-block;
        &.title{
          width: 100%;
          color: #262626;
          font-size: 0.30rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          padding-bottom: 0.1rem;
        }
        &.desc{
        color: #8c8c8c;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 0.26rem;
        }
      }
    }
  }
}
</style>
