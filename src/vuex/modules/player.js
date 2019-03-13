import {playMode} from '../../common/js/config.js';
import types from '../types'
const state = {
  singer:{},
  playing:false,    //是否播放
  fullScreen:false,    //是否全屏
  playList:[],   //播放列表
  sequenceList:[],    // 非顺序播放列表
  mode:playMode.sequence,   // 播放模式（顺序0，循环1，随机2）
  currentIndex:-1,  //当前播放索引,
  currentSongId:'',//当前播放歌曲ID,
  showPlayFlag:false//是否显示播放界面
};

const getters = {
  showPlayFlag(state){
    return state.showPlayFlag;
  },
  fullScreen(state){
    return state.fullScreen;
  },
  playList(state){
    return state.playList;
  },
  currentSong(state){
    if (state.currentIndex === -1 || state.playList.length===0) {
      return {}
    }else{
      return state.playList[state.currentIndex];
    }
  },
  currentSongId(state){
   return state.currentSongId;
  },
  mode(state){
    return state.mode;
  },
  playing(state){
    return state.playing;
  },
  currentIndex(state,getters){
    return state.currentIndex;
  },
  idIsHas:(state)=>(id)=>{
    return state.playList.findIndex((item)=>{
      // return item.songListId == id;
      return item.id == id;
    })
  }
};
const mutations = {
  [types.SET_SHOW_PLAY_FLAG](state,flag){
    state.showPlayFlag = flag;
  },
  [types.SET_SONG_ID](state,id){
    state.currentSongId = id;
  },
  [types.SET_PLAYLIST](state,list){
     state.playList = list;
  },
  [types.DELETE_PLAYLIST](state,index){
    console.log(index);
     state.playList.splice(index,1);
  },
  [types.SET_SEQUENCE_LIST](state,list){
     state.sequenceList = list;
  },
  [types.ADD_PLAYLIST](state,song){
    state.playList.push(song) ;
    console.log(state.playList);
  },
  [types.SET_CURRENT_INDEX](state,index){
     state.currentIndex = index;
     this.commit('SET_SONG_ID',state.playList[index].id);
  },
  [types.INCREASE_CURRENT_INDEX](state){
    state.currentIndex++;
    if (state.currentIndex > state.playList.length -1){
      state.currentIndex = 0;
    }
    this.commit('SET_SONG_ID',state.playList[state.currentIndex].id);
  },
  [types.DECREASE_CURRENT_INDEX](state){
    state.currentIndex--;
    if (state.currentIndex < 0){
      state.currentIndex = state.playList.length -1;
    }
    this.commit('SET_SONG_ID',state.playList[state.currentIndex].id);
  },
  [types.SET_FULL_SCREEN](state,flag){
    state.fullScreen = flag;
  },
  [types.SET_PLAYING_STATE](state,flag){
     state.playing = flag;
  },
  [types.SET_PLAY_MODE](state){
     state.mode++;
    if (state.mode > playMode.length - 1){
      state.mode = 0;
    }
  }
};

const actions = {
  selectPlay({commit, state}, {list, index}) {
    commit(types.SET_SEQUENCE_LIST, list);
    commit(types.SET_PLAYLIST, list);
    commit(types.SET_CURRENT_INDEX, index);
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAYING_STATE, true);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}
