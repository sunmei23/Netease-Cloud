import Vue from 'vue'
import Router from 'vue-router'
import NowHot from '../components/nowHot/nowHot.vue'
import SongList from '../components/songList/songList.vue'
import Top from '../components/top/top.vue'
import HotSinger from '../components/hotSinger/hotSinger.vue'
import PlayList from '../components/playList/playList.vue'
import Home from '../components/Home.vue'
import PlayMusic from '../components/playMusic/playMusic'

Vue.use(Router)

export default new Router({
  // mode:'history',
  linkActiveClass: 'tab-active',
  routes: [
    {
      path:'/',
      components:{
        default:Home,
        music:PlayMusic
      },
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
        }
      ],
    },
    {
      path: "/playList/:id",
      name:"playList",
      components: {
        default: PlayList,
        music:PlayMusic
      },
      meta:{
        index:3
      }
    },
    {
      path: "/playMusic/:musicId",
      name:"playMusic",
      components:{
        default:null,
        music:PlayMusic
      },
      meta:{
        index:4
      }
    },
    {
      path: '/top',
      name: 'top',
      components:{
        default:Top,
        music:PlayMusic
      },
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
    }
  ]
})
