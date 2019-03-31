<template>
    <div id="top">
      <top-nav>
        排行榜
      </top-nav>
      <div class="scroll-wrapper" ref="topScroll">
        <div class="scroll-content">
          <m-title>
            <template #name>
              官方版
            </template>
          </m-title>
          <div class="top-content-wrapper">
            <top-item  v-for="(top,index) in toplists.slice(0,4)" :listData="top" :key="index" type="official"></top-item>
          </div>
          <m-title>
            <template #name>
              推荐榜
            </template>
          </m-title>
          <div class="top-content-wrapper clearfix">
            <top-item v-for="(top,index) in toplists.slice(4,10)"  :listData="top" :key="index+4" type="suggest"></top-item>
          </div>
          <m-title>
            <template #name>
              全球榜
            </template>
          </m-title>
          <div class="top-content-wrapper clearfix">
            <top-item v-for="(top,index) in toplists.slice(10,16)"  :listData="top" :key="index+10" type="suggest"></top-item>
          </div>
          <m-title>
            <template #name>
              更多榜单
            </template>
          </m-title>
          <div class="top-content-wrapper clearfix">
            <top-item v-for="(top,index) in toplists.slice(16)" :listData="top" :key="index+16" type="suggest"></top-item>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import api from '../../api/index.js'
  import topNav from '../../view/topNav'
  import mTitle from '../../view/m-title'
  import topItem from '../../view/top-item'
  import listItem from '../../view/listItem/listItem'
  import BScroll from 'better-scroll'
    export default {
      name: "top",
      components:{topNav,mTitle,topItem,listItem},
      data(){
        return{
          toplists:[],
          topScroll:null
        }
      },
      created(){
          this.$http.get(api.getTopList()).then((res=>{
            if (res.data.code === 200){
              this.toplists = res.data.list;
            }
          })).catch((err)=>{
            console.log(err);
          });
        this.$nextTick(()=>{
          this._initTopScroll();
        });
      },
      methods:{
        _initTopScroll(){
          if (!this.topScroll){
            this.topScroll = new BScroll(this.$refs.topScroll,{
              scrollX:false,
              scrollY:true,
              click:true
            })
          }
        }
      }
    }
</script>

<style scoped lang="less">
#top{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 1.2rem 0.0rem 0;
  .scroll-wrapper{
    width: 100%;
    height: 100%;
    .scroll-content{
      padding-bottom: 1rem;
      .top-content-wrapper{
        margin-bottom: 0.5rem;
        &.clearfix{
          padding-top: 0.2rem;
          padding-left: 0.2rem;
          margin-bottom: 0.0rem;
        }
      }
    }
  }

}
</style>
