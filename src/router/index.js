import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login.vue'
import Home from '@/views/home.vue'
import Welcome from '@/views/welcome.vue'
import Users from '@/views/user/users.vue'
import Roles from '@/views/right/roles.vue'
import Rights from '@/views/right/rights.vue'
import Goods from '@/views/goods/goods.vue'
import List from '@/views/goods/list.vue'
import Add from '@/views/goods/add.vue'

Vue.use(VueRouter)
var router = new VueRouter({
  routes: [
    {
      name: 'default',
      path: '/',
      redirect: { name: 'login' }
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/home',
      component: Home,
      redirect: { name: 'welcome' },
      children: [
        {
          name: 'welcome',
          path: 'welcome',
          component: Welcome
        },
        {
          name: 'users',
          path: 'users',
          component: Users
        },
        {
          name: 'roles',
          path: 'roles',
          component: Roles
        },
        {
          name: 'rights',
          path: 'rights',
          component: Rights
        },
        {
          name: 'goods',
          path: 'goods',
          component: Goods,
          redirect: { name: 'list' },
          children: [
            {
              name: 'list',
              path: 'list',
              component: List
            },
            {
              name: 'add',
              path: 'add',
              component: Add
            }
          ]
        }
      ]
    }
  ]
})
export default router
