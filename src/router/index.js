// Инициализируем маршрутизатор

import Vue from 'vue'
import VueRouter from 'vue-router'

import Notes from '../pages/Notes.vue' // Страница со списком заметок
import Note from '../pages/Note.vue' // Страница создания/редактирования заметки

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'notes',
    component: Notes
  },
  {
    path: '/create',
    name: 'create',
    component: Note
  },
  {
    path: '/edit/:id',
    name: 'edit',
    component: Note,
    props: true
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  // Поведение скролла при переходах как в браузере
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes
})

export default router