import Vue from 'vue'
import VueX from 'vuex'
import player from './modules/player'
Vue.use(VueX);

const state = {
  playListArr:[]
};
const getters = {
  getPlayListById: (state) => (id) => {
    return state.playListArr.find(list => {
      // return list.songListId == id;
      return list.id == id;
    });
  },
  getAllList:(state) => {
    return state.playListArr;
  }
};
const mutations = {
  addPlayList(state,list){
    state.playListArr.push(list);
  }
};

export default new VueX.Store({
  state,
  getters,
  mutations,
  modules:{
    player
  }
})
