import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/Home.vue'
import Note from '../pages/Note.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
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
  routes
})

router.beforeEach((to, from, next) => {
  const toPage = to.name
  const fromPage = sessionStorage.getItem('page')
  const refreshBrowser = toPage == fromPage
  sessionStorage.setItem('page',toPage)
  sessionStorage.setItem('refreshBrowser',refreshBrowser)
  next()
})

export default router