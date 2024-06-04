import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import HomeView from '@/views/HomeView.vue'
import LoginView from "@/views/LoginView.vue"
import RegisterView from '@/views/RegisterView.vue'


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
        requireAuth: false,
        notAllowedWhenAuth: true,
      },
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      meta: {
        requireAuth: false,
        notAllowedWhenAuth: true,
      },
      component: RegisterView
    }
  ]
})

router.beforeEach((to, _from, next) => {
  if (to.meta === undefined || to.meta.requireAuth === undefined || to.meta.requireAuth === false) {
    next()
  }
  axios.get(`/auth/id`).then((_response) => {
    if (to.meta.notAllowedWhenAuth === true) {
      next({path: '/'})
    }
    next()
  }).catch((_error) => {
    ElMessage({
      showClose: true,
      message: '您尚未登录！',
      center: true,
      type: 'error'
    })
    next({path: '/login'})
  })
})

export default router
