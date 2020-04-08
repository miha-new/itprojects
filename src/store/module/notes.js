import axios from 'axios'

export default {
  namespaced: true,
  state: {
    notes: []
  },
  mutations: {
    setNotes(state, options) {
      state.notes.splice(...options)
      localStorage.setItem('notes', JSON.stringify(state.notes));
    }
  },
  actions: {
    async getNotes({commit}) {
      let notes = localStorage.getItem('notes');
      if (!notes) {
        const response = await axios.get('/api/notes.json')
        notes = response.data
      } else {
        notes = JSON.parse(notes)
      }
      commit('setNotes', [0,0,...notes])
    },
    createNote({state,commit},note) {
      let ids = state.notes.map(item => item.id)
      let id = ids.length ? Math.max(...ids) + 1 : 0
      note = Object.assign({id},note)
      const index = state.notes.length
      commit('setNotes', [index,0,note])
    },
    editNote({state,commit},note) {
      const index = state.notes.findIndex(item => item.id === note.id)
      commit('setNotes', [index,1,note])
    },
    removeNote({state,commit},note) {
      const index = state.notes.findIndex(item => item.id === note.id)
      console.log(index)
      commit('setNotes', [index,1])
    }
  }
}