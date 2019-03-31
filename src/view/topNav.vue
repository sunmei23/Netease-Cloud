<template>
    <div id="topNav">
      <span class="ele-icon-arrow_lift goBack" @click="goBack"></span>
      <span class="center">
        <slot></slot>
      </span>
      <div class="right">
            <span class="more">
              <i class="dot"></i>
              <i class="dot"></i>
              <i class="dot"></i>
            </span>
      </div>
    </div>
</template>

<script>
    export default {
      name: "topNav",
      methods:{
        goBack(){
          this.$router.go(-1);
        }
      }
    }
</script>

<style scoped lang="less">
#topNav{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 1.2rem;
  padding: 0.2rem;
  line-height: 0.8rem;
  color: #595959;
  z-index: 100;
  background-color: #fff;
  .goBack{
    float: left;
    font-size: 0.36rem;
    line-height: 0.8rem;
  }
  .center{
    font-size: 0.36rem;
    color: #000;
  }
  .right{
    float: right;
    .more{
      font-size: 0.32rem;
      .dot{
        display: inline-block;
        width: 0.12rem;
        height: 0.12rem;
        border-radius: 50%;
        padding-right: 0.08rem;
        background-color: #595959;
      }
    }
  }
}
</style>
