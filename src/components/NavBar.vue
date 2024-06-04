<script setup>
import { ElMessage } from 'element-plus';
import { ref, onMounted, getCurrentInstance } from 'vue'


const { proxy } = getCurrentInstance()
const emit = defineEmits(['userID'])

const userID = ref()
const userName = ref('')

const jump = (route) => {
  proxy.$router.push(route)
}

const tryFetch = async () => {
  await proxy.$http.get(`/auth/id`).then((response) => {
    userID.value = response.data.user_id
    emit('userID', response.data.user_id)
  }).catch(() => {
    userID.value = undefined
    emit('userID', undefined)
  })
  if (userID.value !== undefined) {
    await proxy.$http.post(`/auth/userdata/user_name`).then((response) => {
      userName.value = response.data.name;
    }).catch(() => {
      userName.value = '';
    })
  }
}

const onLogout = async () => {
  await proxy.$http.get(`/auth/logout`).then((response) => {
    userID.value = undefined
    emit('userID', undefined)
    ElMessage({
      showClose: true,
      message: '登出成功！',
      center: true,
      type: 'success'
    })
  }).catch((error) => {
    ElMessage({
      showClose: true,
      message: '网络错误！',
      center: true,
      type: 'warning'
    })
  })
}

onMounted(async () => {
  await tryFetch()
})
</script>

<template>
  <el-header class="navbar">
    <img src="./icons/nju-logo.png" width="37px" height="37px" style="filter: drop-shadow(0 0 6px #FF25FD);" />
    <img src="./icons/name-bold.png" height="30px" width="auto" style="filter: drop-shadow(0 0 2px #409eff); margin-left: 8px;"/>
    <el-button @click="jump('/login')" class="navbar-btn" v-if="!userID">
      登录
    </el-button>
    <el-dropdown trigger="click" v-else>
      <el-button class="navbar-btn" round>
        菜单
      </el-button>
      <template #dropdown>
        <!-- 此处跳转链接，暂未设计 -->
        <el-dropdown-item>yeee</el-dropdown-item>
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
</style>
