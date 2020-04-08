import Vue from 'vue'
import Vuex from 'vuex'
import notes from './module/notes'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    notes
  }
})
