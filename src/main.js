import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/font/iconfont.css'
import ZkTable from 'vue-table-with-tree-grid'
import axios from 'axios'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor)
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(function(config) {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.component('tree-table', ZkTable)
Vue.filter('dateFormat', function(d) {
  const date = new Date(d)
  const yyyy = date.getFullYear()
  const MM = (date.getMonth() + 1 + '').padStart(2, '0')
  const dd = (date.getDate() + '').padStart(2, '0')
  const hh = (date.getHours() + '').padStart(2, '0')
  const mm = (date.getMinutes() + '').padStart(2, '0')
  const ss = (date.getSeconds() + '').padStart(2, '0')
  return yyyy + '-' + MM + '-' + dd + ' ' + hh + ':' + mm + ':' + ss
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#apps')
