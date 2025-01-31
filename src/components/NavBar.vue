<script setup>
import { ElMessage } from 'element-plus';
import { ref, onMounted, getCurrentInstance } from 'vue'


const { proxy } = getCurrentInstance()

const userID = ref()

const jump = (route) => {
  proxy.$router.push(route)
}

const onLogout = async () => {
  await proxy.$http.get(`/auth/logout`).then((response) => {
    userID.value = undefined
    ElMessage({
      showClose: true,
      message: '登出成功！',
      center: true,
      type: 'success'
    })
    jump('/login')
  }).catch((_error) => {
    ElMessage({
      showClose: true,
      message: '网络错误！',
      center: true,
      type: 'warning'
    })
  })
}

onMounted(async () => {
  await proxy.$http.get(`/auth/id`).then((response) => {
    userID.value = response.data.user_id
    // emit('userID', response.data.user_id)
  }).catch(() => {
    userID.value = undefined
    // emit('userID', undefined)
  })
})
</script>

<template>
  <el-header class="navbar">
    <img class="navbar-img" @click="jump('/')" src="./icons/nju-logo.png" width="37px" height="37px" style="filter: drop-shadow(0 0 6px #FF25FD); cursor: pointer;" />
    <img class="navbar-img" @click="jump('/')" src="./icons/name-bold.png" height="30px" width="auto" style="filter: drop-shadow(0 0 2px #409eff); margin-left: 8px;"/>
    <el-button @click="jump('/login')" class="navbar-btn" v-if="!userID">
      登录
    </el-button>
    <el-dropdown trigger="click" v-else>
      <el-button class="navbar-btn" round>
        菜单
      </el-button>
      <template #dropdown>
        <el-dropdown-item @click="jump('/')">主页</el-dropdown-item>
        <el-dropdown-item @click="jump('/timer')">赛程秒表</el-dropdown-item>
        <el-dropdown-item @click="jump('/volunteer-tool')">计分工具</el-dropdown-item>
        <el-dropdown-item @click="jump('/team-center')">团队空间</el-dropdown-item>
        <el-dropdown-item @click="jump('/admin-dashboard')">管理员仪表盘</el-dropdown-item>
        <el-dropdown-item @click="jump('/user-doc')">使用手册</el-dropdown-item>
        <el-dropdown-item @click="onLogout" divided>登出</el-dropdown-item>
      </template>
    </el-dropdown>
  </el-header>
</template>

<style scoped>
.navbar {
  height: 60px;
  padding: 0 32px;
  width: 100vw;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #666666;
  background-color: #181818;
}
.navbar-btn {
  background-color: rgba(255, 255, 255, 0.3);
  color: white;
  border: none;
  height: 3vh;
  align-items: center;
  border-radius: 5px;
  height: 36px;
  width: 85px;
  padding: 0;
  margin-left: calc(100vw - 300px);
  font-size: medium;
  box-shadow: 0 0 16px rgba(255, 255, 255, 0.3);
}
.navbar-btn:hover {
  cursor: pointer;
  color: #409eff;
  background-color: rgba(198, 226, 255, 0.3);
}
.navbar-img:hover {
  cursor: pointer;
}
</style>
