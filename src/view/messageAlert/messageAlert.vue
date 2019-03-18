<template>
  <transition name="show" v-bind:css="false"
              v-on:before-enter="beforeEnter"
              v-on:enter="enter"
              v-on:leave="leave">
    <div v-if="isShow" id="message-alert">
      <span>{{message}}</span>
    </div>
  </transition>
</template>

<script>
    export default {
      name: "messageAlert",
      props:{
          message:{
            type:String,
            default:''
          },
        isShow:{
            type: Boolean,
            default: false
        },
        fadeInDuration:{
            type:Number,
           default:1000
        },
        fadeOutDuration:{
          type:Number,
          default:800
        }
      },
      methods:{
        beforeEnter: function (el) {
          //step1
          el.style.opacity = 0;
        },
        // 当与 CSS 结合使用时
        // 回调函数 done 是可选的
        enter: function (el, done) {
          // step2
          let vm = this;
          Velocity(el,
            { opacity: 1 },
            {
              duration: this.fadeInDuration,
              complete: function () {
                done();
                // vm.showFlag = false;
                vm.$emit("unShow");
              }
            }
          );
        },
        leave: function (el, done) {
          // step3
          let vm = this;
          Velocity(el,
            { opacity: 0 },
            {
              duration: this.fadeOutDuration,
              complete: function () {
                done();
              }
            }
          );
        },
        afterLeave: function (el) {
          el.style.opacity = 0
        }
      }
    }
</script>

<style scoped lang="less">
  #message-alert{
    position: absolute;
    left: 0;
    top: 0.3rem;
    right: 0;
    z-index: 2;
    span{
      text-align: center;
      border: 1px solid #ccc;
      background-color: rgba(0,0,0,.4);
      color: #fff;
      font-size: 0.28rem ;
      padding: 0.08rem 0.2rem;
      border-radius: 8px;
    }
  }
</style>
