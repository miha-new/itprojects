// Инициализируем Vue-Приложение

import Vue from 'vue'
import App from './App.vue' // Основной компонент приложения
import router from './router' // Маршрутизатор
import store from './store' // Хранилище данных

// Регистрируем компонент Confirm глобально
import Confirm from './components/Confirm'
Vue.component('confirm', Confirm);

Vue.config.productionTip = false

// Создаем экземпляр, подключаем к нему модули и
// монтируем экземпляр к элементу #app
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')