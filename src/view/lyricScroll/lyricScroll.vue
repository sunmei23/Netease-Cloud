<template>
    <div id="lyricScroll">
      <div class="lyric-wrapper">
        <ul ref="ulEle">
          <li v-for="(item,index) in lyricLines" :key="index" class="lyric-item"
          :class="currentLine===index?'current':'normal'">{{item.txt}}</li>
          <!--@click.stop="_selectLyricPlay(index)"-->
        </ul>
      </div>
    </div>
</template>

<script>
  import BScroll from 'better-scroll'
    export default {
        name: "lyricScroll",
      data(){
        return {
          lyricScroll:null,
          currentLine:0,
          scrollY:0
        }
      },
       props:{
         lyricLines:{
            type:Array,
            default:[]
          },
         currentTime:{
           type:Number,
           default: 0
         }
       },
      watch:{
        currentTime(newVal){
          let len = this.lyricLines.length;
          for (let i=0; i< len; i++){
            if (i===len-1){
              if (newVal >= this.lyricLines[i].time/1000) {
                this.currentLine = i;
              }
            }else if(newVal >= this.lyricLines[i].time/1000 && newVal < this.lyricLines[i+1].time/1000){
              this.currentLine = i;
            }
          }
        },
        currentLine: {
          handler (newVal,oldVal) {
            //实现歌词滚动
            let ulObj = this.$refs.ulEle;
            let len = ulObj.children[0].clientHeight;
            if(newVal > 5){
              let lineEl = ulObj.children[newVal - 5];
              this.lyricScroll.scrollToElement(lineEl, 1000);
            }else if (newVal === 0) {
              this.lyricScroll.scrollTo(0,0, 1000);
            }else if (-this.scrollY > len * 5) {
              this.lyricScroll.scrollTo(0,-newVal*len, 1000);
            }else{
              this.lyricScroll.scrollBy(0,-len,1000);
            }
          },
          terminate:true
        }
      },
      created(){
          this.$nextTick(()=>{
            this._initLyricScroll();
          })
      },
      methods:{
        _initLyricScroll(){
            if (!this.lyricScroll){
               this.lyricScroll = new BScroll("#lyricScroll",{
                 scrollX:false,
                 scrollY:true,
                 click:true,
                 probeType:3
               })
            }else{
              this.lyricScroll.refresh();
            }
            this.lyricScroll.on('scroll',pos=>{
              this.scrollY = pos.y;
            })
          },
        _selectLyricPlay(index){
          const time = this.lyricLines[index].time/1000;
          this.$emit('changeCurrentTime',time);
        }
      }
    }
</script>

<style scoped lang="less">
#lyricScroll{
  width: 100%;
  height: 100%;
  overflow: hidden;
  .lyric-wrapper{
    padding-top: 50%;
    padding-bottom: 50%;
    width: 100%;
    .lyric-item{
      width: 100%;
      padding: 0.2rem 0rem;
      &.current{
        transform: scale(1.5);
        transition: all 0.5s linear;
        padding: 0.2rem 25%;
        color: #B85248;
      }
      &.normal{
        font-size: 0.28rem;
        color: #fff;
      }
    }
  }
}
</style>
