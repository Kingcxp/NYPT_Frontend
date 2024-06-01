<script setup>
import { ref, getCurrentInstance } from 'vue'

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
  }).catch((error) => {
    userID.value = undefined;
  })
  if (userID.value !== undefined) {
    await proxy.$http.post(`/auth/userdata/user_name`).then((response) => {
      userName.value = response.data.name;
    }).catch((error) => {
      userName.value = '';
    })
  }
}
</script>

<template>
  <el-header class="navbar">
    <img src="./icons/nju-logo.png" width="37px" height="37px"/>
    <img src="./icons/name-bold.png" height="30px" width="auto"/>
    <el-button @click="jump('/login')" class="navbar-btn" v-if="!userID">
      登录
    </el-button>
  </el-header>
</template>

<style>
.navbar {
  height: 60px;
  padding: 0 12px 0 32px;
  width: 100vw;
  display: inline-flex;
  align-items: center;
  border-bottom: 1px solid #666666;
}
.navbar-btn {
  background-color: rgba(255, 255, 255, 0.3);
  color: white;
  border: none;
  height: 3vh;
  align-items: center;
  border-radius: 5px;
  height: 36px;
  width: 78px;
  padding: 0;
  margin-left: calc(100vw - 261px);
}
.navbar-btn:hover {
  cursor: pointer;
  color: #409eff;
  background-color: rgba(198, 226, 255, 0.3);
}
</style>
