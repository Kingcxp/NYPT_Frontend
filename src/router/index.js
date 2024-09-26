import { createRouter, createWebHistory } from 'vue-router'
import axios from "@/utils/AxiosInstance"
import { ElMessage } from 'element-plus'
import HomeView from '@/views/HomeView.vue'
import LoginView from "@/views/LoginView.vue"
import TeamCenterView from '@/views/TeamCenterView.vue'
import VolunteerToolView from '@/views/VolunteerToolView.vue'
import TimerView from '@/views/TimerView.vue'
import DocView from '@/views/DocView.vue'
import AdminDashboardView from '@/views/AdminDashboardView.vue'


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
      path: '/team-center',
      name: 'team-center',
      meta: {
        requireAuth: true,
        identity: 'Team|Administrator',
      },
      component: TeamCenterView
    },
    {
      path: '/volunteer-tool',
      name: 'volunteer-tool',
      meta: {
        requireAuth: true,
        identity: 'VolunteerA|Administrator',
      },
      component: VolunteerToolView
    },
    {
      path: '/timer',
      name: 'timer',
      meta: {
        requireAuth: true,
        identity: 'VolunteerB|Administrator',
      },
      component: TimerView
    },
    {
      path: '/user-doc',
      name: 'user-doc',
      meta: {
        requireAuth: false,
      },
      component: DocView
    },
    {
      path: '/admin-dashboard',
      name: 'admin-dashboard',
      meta: {
        requireAuth: true,
        identity: 'Administrator',
      },
      component: AdminDashboardView
    },
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
      console.log(error)
      ElMessage({
        showClose: true,
        message: error.response.data.msg,
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
      if (to.meta.identity.indexOf(identity) === -1) {
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
