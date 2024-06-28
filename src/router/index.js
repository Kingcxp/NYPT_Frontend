import { createRouter, createWebHistory } from 'vue-router'
import axios from "@/utils/AxiosInstance"
import { ElMessage } from 'element-plus'
import HomeView from '@/views/HomeView.vue'
import LoginView from "@/views/LoginView.vue"
import RegisterView from '@/views/RegisterView.vue'
import TeamCenterView from '@/views/TeamCenterView.vue'
import VolunteerToolView from '@/views/VolunteerToolView.vue'
import TimerView from '@/views/TimerView.vue'


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
    },
    {
      path: '/team-center',
      name: 'team-center',
      meta: {
        requireAuth: false,
        identity: 'Team',
      },
      component: TeamCenterView
    },
    {
      path: '/volunteer-tool',
      name: 'volunteer-tool',
      meta: {
        requireAuth: false,
        identity: 'VolunteerA',
      },
      component: VolunteerToolView
    },
    {
      path: '/timer',
      name: 'timer',
      meta: {
        requireAuth: true,
        identity: 'VolunteerB',
      },
      component: TimerView
    }
  ]
})

router.beforeEach(async (to, _from) => {
  if ((to.meta.requireAuth === undefined || to.meta.requireAuth === false) && 
      (to.meta.notAllowedWhenAuth === undefined || to.meta.notAllowedWhenAuth === false)) {
    return
  }
  let userID = undefined
  await axios.get(`/auth/id`).then((response) => {
    userID = response.data.user_id
  }).catch((error) => {
    if (error.response === undefined) {
      if (to.meta.requireAuth === true) {
        ElMessage({
          showClose: true,
          message: '网络错误！',
          center: true,
          type: 'warning'
        })
      }
      return
    }
    if (to.meta.requireAuth === true) {
      ElMessage({
        showClose: true,
        message: error.response.msg,
        center: true,
        type: 'error'
      })
    }
  })
  if (userID === undefined) {
    if (to.meta.requireAuth === true) {
      return '/login'
    }
  } else {
    if (to.meta.notAllowedWhenAuth === true) {
      return '/'
    }
    if (to.meta.identity !== undefined) {
      let identity = undefined
      await axios.get(`/auth/userdata/identity`).then((response) => {
        identity = response.data.identity
      })
      if (identity !== to.meta.identity) {
        ElMessage({
          showClose: true,
          message: '这个页面与你的身份不相符！',
          center: true,
          type: 'error'
        })
        return '/'
      }
    }
  }
})

export default router
