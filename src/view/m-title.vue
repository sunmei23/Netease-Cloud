<template>
    <div id="title">
        <span class="bold type">
          <slot name="name"></slot>
        </span>
      <span class="more"><slot name="more"></slot></span>
    </div>
</template>

<script>
    export default {
        name: "title"
    }
</script>

<style scoped lang="less">
  @import "../common/less/mixin";
  #title{
      width: 100%;
      height: 1.0rem;
      line-height: 1.2rem;
      font-size: 0rem;
      color: #262626;
      padding: 0rem 0.2rem;
      //padding-top: 0.2rem;
      text-align: left;
      .border-1px(#fafafa);
      .type {
        font-size: 0.36rem;
      }
      .more{
        float: right;
        font-size: 0.24rem;
      }
  }

</style>
