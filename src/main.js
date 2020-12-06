import Vue from 'vue'
import ElementUI from 'element-ui'
import { emitEvent } from '@/views/common/tools'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import table from '@/views/common/table'
import pagination from '@/views/common/pagination'
import './styles/element-variables.scss'

import '@/styles/index.scss' // 全局css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // 权限控制

ElementUI.Dialog.props.closeOnClickModal.default = false // 空白区域点击关闭弹窗: false
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
