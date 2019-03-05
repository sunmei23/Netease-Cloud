import Vue from 'vue'
import Router from 'vue-router'
import NowHot from '../components/nowHot/nowHot.vue'
import SongList from '../components/songList/songList.vue'
import Top from '../components/top/top.vue'
import HotSinger from '../components/hotSinger/hotSinger.vue'
import PlayList from '../components/playList/playList.vue'
import Home from '../components/Home.vue'

Vue.use(Router)

export default new Router({
  // mode:'history',
  linkActiveClass: 'tab-active',
  routes: [
    {
      path:'/',
      component:Home,
      children:[
        {
          path:'/',
          redirect:{
            name: 'nowHot',
          }
        },
        {
          path: 'nowHot',
          name: 'nowHot',
          component: NowHot,
          meta:{
            index:0
          }
        },
        {
          path: 'top',
          name: 'top',
          component: Top,
          meta:{
            index:1
          }
        },
        {
          path: 'hotSinger',
          name: 'hotSinger',
          component: HotSinger,
          meta:{
            index:2
          }
        },
      ],
    },
    {
      path: "/playList/:id",
      name:"playList",
      component:PlayList,
      meta:{
        index:3
      }
    }
  ]
})
