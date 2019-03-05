import Vue from 'vue'
import VueX from 'vuex'
Vue.use(VueX);

const store = new VueX.Store({
  state:{
    playListArr:[]
  },
  getters:{
    getPlayListById: (state) => (id) => {
      return state.playListArr.find(list => list.id === id);
    },
    getAllList:(state) => {
      return state.playListArr;
    }
  },
  mutations:{
    addPlayList(state,list){
      state.playListArr.push(list);
    }
  }
})
export default store
