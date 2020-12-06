import Vue from 'vue'

import Cookies from 'js-cookie'
import ElementUI from 'element-ui'
import { emitEvent } from '@/views/common/tools'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import table from '@/views/common/table'
import pagination from '@/views/common/pagination'
import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})
ElementUI.Dialog.props.closeOnClickModal.default = false
Vue.component('nice-table', table)
Vue.component('nice-pagination', pagination)
Vue.config.productionTip = false
Vue.prototype.$emitEvent = emitEvent
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
