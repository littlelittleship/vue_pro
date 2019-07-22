import Vue from 'vue'
import App from './App.vue'
// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入路由模块
// import router from '@/router/index.js'
import router from '@/router/index.js'
// 引入公共样式
import '@/styles/index.less'

// 导航守卫，之前登录过的，可以跳转，不能登录的，去登录页面
router.beforeEach((to, from, next) => {
  var token = localStorage.getItem('itcast_manage_token')
  // 判断是否登陆过
  if (token || to.path === '/login') {
    next()
  } else {
    // 没有登陆过就重定向到登录页
    next({ name: 'login' })
  }
})

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
