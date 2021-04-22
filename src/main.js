import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/font/iconfont.css'
import ZkTable from 'vue-table-with-tree-grid'
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(function(config) {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.component('tree-table', ZkTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#apps')
