// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from 'axios'
import './common/less/index.less'
import 'normalize.css'
import './common/css/style.css'
import VueLazyload from 'vue-lazyload'
import './mock.js'
import VueX from 'vuex'
import store from './vuex/store'
//引入公共JS函数
import {sleep,getFontSize} from './common/js/utils'
import FastClick from 'fastclick'
FastClick.attach(document.body);

Vue.use(VueX);
Vue.use(VueLazyload,{
  error:'./static/image_177x177.png',
  loading:'./static/image_177x177.png'
});
// Axios.defaults.headers.common['Origin']= 'http://ser.caijin.tech:3002'
// Axios.defaults.headers.common['Referer']= 'http://ser.caijin.tech:3002/'
Vue.prototype.$http = Axios;
Vue.config.productionTip = false
Vue.prototype.sleep = sleep;
Vue.prototype.getFontSize = getFontSize;

Vue.filter('playCountTransform',function (counts) {
    if (typeof(counts) === "undefined") {
      return 0;
    }
   if (counts > 10000){
     return Math.floor(counts/10000) + '万';
   } else{
     return counts;
   }
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  data:{
    eventHub:new Vue()
  }
})
