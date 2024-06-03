import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from "../views/LoginView.vue"
import RegisterView from '@/views/RegisterView.vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      alias: '/home',
      name: 'home',
      meta: {
        requireAuth: false
      },
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        requireAuth: false
      },
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      meta: {
        requireAuth: false
      },
      component: RegisterView
    }
  ]
})

router.beforeEach((to, _from, next) => {
  if (to.meta === undefined || to.meta.requireAuth === undefined) {
    next()
  }
  axios.get(`/auth/id`).then((_response) => {
    next()
  }).catch((_error) => {
    ElMessage({
      showClose: true,
      message: '您尚未登录！',
      center: true,
      type: 'error'
    })
  })
})

export default router
