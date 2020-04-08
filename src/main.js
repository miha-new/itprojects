import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Confirm from './components/Confirm'
Vue.component('confirm', Confirm);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')