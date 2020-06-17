// Инициализируем хранилище данных

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // Заметки
    notes: []
  },
  getters: {
    // Массив id заметок
    idNotes(state) {
      return state.notes.map(item => item.id)
    },
    // Уникальный id заметки
    uniqueIdNotes(state, getters) {
      const idNotes = getters.idNotes
      return idNotes.length ? Math.max(...idNotes) + 1 : 0
    },
  },
  mutations: {
    // Вносит изменения в заметки
    setNotes(state, options) {
      state.notes.splice(...options)
      localStorage.setItem('notes', JSON.stringify(state.notes));
    }
  },
  actions: {
    // Инициализирует заметки
    initNotes({commit}) {
      let notes = localStorage.getItem('notes');
      notes = notes ? JSON.parse(notes) : []
      commit('setNotes', [0, 0, ...notes])
    },
    // Создает новую заметку с уникальным id
    createNote({state, getters, commit}, note) {
      const id = getters.uniqueIdNotes
      const index = state.notes.length
      note = Object.assign({id}, note)
      commit('setNotes', [index, 0, note])
    },
    // Редактирует заметку
    editNote({state, commit}, note) {
      const index = state.notes.findIndex(item => item.id === note.id)
      commit('setNotes', [index, 1, note])
    },
    // Удаляет заметку
    removeNote({state, commit}, note) {
      const index = state.notes.findIndex(item => item.id === note.id)
      commit('setNotes', [index, 1])
    }
  }
})
