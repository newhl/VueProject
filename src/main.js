import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import VeeValidate, { Validator } from 'vee-validate'
// 导入VeeValidate的中文包
import zhCN from 'vee-validate/dist/locale/zh_CN'
import { fmtDate } from '@/utils/dayjs'
import 'vant/lib/index.css'
import './styles/index.less'
import Checklogin from '@/utils/CheckLogin'

// 注册插件  Checklogin.install(Vue)
Vue.use(Checklogin)
// Vue.prototype.$checkLogin = () => {
//   console.log('checklogin')
// }

// 获取相对时间的过滤器
Vue.filter('fmtDate', fmtDate)

Vue.use(Vant)
// 配置插件VeeValidate
Vue.use(VeeValidate, {
  // 文本框中触发验证的事件，默认是input
  // 如果为空的话，文本框输入过程中不验证，需要调用validate方法验证
  events: ''
})
// 配置中文
Validator.localize('zhCN', zhCN)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
