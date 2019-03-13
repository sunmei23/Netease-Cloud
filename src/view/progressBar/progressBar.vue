<template>
    <div class="progress-bar" ref="progressBar" @click="progressClick">
      <div class="bar-inner">
        <div class="progress" ref="progress"></div>
        <div class="progress-btn-wrapper" ref="progressBtn"
             @touchstart.prevent="progressTouchStart"
             @touchmove.prevent="progressTouchMove"
             @touchend="progressTouchEnd"
        >
          <div class="progress-btn"></div>
        </div>
      </div>
    </div>
</template>

<script>
  const progressBtnWidth = 0    //小球宽度
    export default {
        name: "progressBar",
      props:{
        precent:{
          type:Number,
          default:0
        }
      },
      watch:{
        precent(newPercent){
          if(newPercent>=0 && !this.touch.initated){
            const barWidth = this.$refs.progressBar.clientWidth - this.$refs.progressBtn.clientWidth/2;
            const offsetWidth = newPercent * barWidth;
            this.$refs.progress.style.width = `${offsetWidth}px`;
            this.$refs.progressBtn.style.transform=`translate3d(${offsetWidth}px,0,0)`
          }
        }
      },
      created(){
        this.touch = {};
      },
      methods:{
        progressTouchStart(e){
          this.touch.initiated = true;
          this.touch.startX = e.touches[0].pageX;
          this.touch.left = this.$refs.progress.clientWidth;
        },
        progressTouchMove(e){
          if(!this.touch.initiated){
            return;
          }
          let deltaX = e.touches[0].pageX - this.touch.startX;
          let offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth,Math.max(0,this.touch.left + deltaX));
          this._offset(offsetWidth);
        },
        progressTouchEnd(e){
          this.touch.initiated = false;
          this._triggerPercent();
        },
        progressClick(e){
          const rect = this.$refs.progressBar.getBoundingClientRect();
          const offsetWidth = e.pageX - rect.left;
          this._offset(offsetWidth);
          this._triggerPercent();
        },
        _offset(offsetWidth){
          this.$refs.progress.style.width = `${offsetWidth}px`;
          this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px,0,0)`;
        },
        _triggerPercent(){
          const barWidth = this.$refs.progressBar.clientWidth - this.$refs.progressBtn.clientWidth/2;
          const percent = this.$refs.progress.clientWidth / barWidth;
          this.$emit("percentChange",percent)
        }
      }
    }
</script>

<style scoped lang="less">
  .progress-bar{
    width: 100%;
    height: 100%;
    background-color: #bfbfbf;
    position: relative;
    .bar-inner{
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      font-size: 0;
      z-index: 1;
      .progress{
        height: 100%;
        background-color:#fff;
      }
      .progress-btn-wrapper{
        height: 0.3rem;
        width: 0.3rem;
        border-radius: 50%;
        background-color: rgba(184,82,72,.5);
        padding: 0.08rem;
        margin-top: -0.152rem;
        margin-left: -0.07rem;
        .progress-btn{
          height: 100%;
          width: 100%;
          background-color: #B85248;
          border-radius: 50%;
        }
      }
    }

  }

</style>
