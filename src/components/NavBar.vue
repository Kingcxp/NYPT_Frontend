<script setup>
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
  }).catch((_error) => {
    userID.value = undefined;
  })
  if (userID.value !== undefined) {
    await proxy.$http.post(`/auth/userdata/user_name`).then((response) => {
      userName.value = response.data.name;
    }).catch((_error) => {
      userName.value = '';
    })
  }
}

onMounted(async () => {
  await tryFetch()
})
</script>

<template>
  <el-header class="navbar">
    <img src="./icons/nju-logo.png" width="37px" height="37px" style="filter: drop-shadow(2px 2px 12px #6f106e);" />
    <img src="./icons/name-bold.png" height="30px" width="auto" style="filter: drop-shadow(2px 2px 8px #409eff); margin-left: 12px;"/>
    <el-button @click="jump('/login')" class="navbar-btn" v-if="!userID">
      登录
    </el-button>
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
}
.navbar-btn:hover {
  cursor: pointer;
  color: #409eff;
  background-color: rgba(198, 226, 255, 0.3);
}
</style>
