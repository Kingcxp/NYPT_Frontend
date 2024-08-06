<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'


const { proxy } = getCurrentInstance()
const emits = defineEmits(['roomdata', 'rule', 'matchType', 'roomID', 'round', 'token'])

const roomCount = ref(0)
const roundCount = ref(0)
const roomOffset = ref(0)
const roundOffset = ref(0)

const form = reactive({
  roomID: 0,
  round: 0,
  token: '',
})

const onEnter = async () => {
  await proxy.$http.post('/assist/roomdata', {
    'roomID': form.roomID,
    'round': form.round,
    'token': form.token,
  }).then((response) => {
    emits('roomdata', response.data.data)
    emits('rule', response.data.rule)
    emits('matchType', response.data.match_type)
    emits('roomID', form.roomID)
    emits('round', form.round)
    emits('token', form.token)
    ElMessage({
      showClose: true,
      message: '会场进入成功！计分，启动！',
      center: true,
      type: 'success'
    })
  }).catch((error) => {
    if (error.response.status === 400 || error.response.status == 404 || error.response.status == 500) {
      ElMessage({
        showClose: true,
        message: error.response.data.msg,
        center: true,
        type: 'warning'
      })
    } else {
      ElMessage({
        showClose: true,
        message: '网络错误！',
        center: true,
        type: 'warning'
      })
    }
  })
}

onMounted(async () => {
  await proxy.$http.get(`/assist/total/room`).then((response) => {
    roomCount.value = response.data.rooms
    roomOffset.value = response.data.offset
    form.roomID = response.data.offset
  })
  await proxy.$http.get(`/assist/total/round`).then((response) => {
    roundCount.value = response.data.rounds
    roundOffset.value = response.data.offset
    form.round = response.data.offset
  })
  if (roundCount.value === 0) {
    ElMessage({
      showClose: true,
      message: '网络错误！',
      center: true,
      type: 'warning'
    })
  }
})
</script>

<template>
  <el-container class="enter-match-form-container">
    <el-form class="enter-match-form" :model="form" label-position="left" label-width="120px">
      <el-container class="enter-match-div">
        <el-text class="enter-match-title">进入会场</el-text>
      </el-container>
      <el-row>
        <el-col class="enter-match-col" :span="11">
          <el-form-item :span="6" class="enter-match-item" label="会场编号" prop="roomID">
            <el-select v-model="form.roomID" size="large">
              <el-option v-for="i in roomCount" :key="i+roomOffset-1" :label="i+roomOffset-1" :value="i+roomOffset-1"/>
            </el-select>  
          </el-form-item>
        </el-col>
        <el-col :span="2" />
        <el-col class="enter-match-col" :span="11">
          <el-form-item :span="6" class="enter-match-item" label="比赛轮次" prop="round">
            <el-select v-model="form.round" size="large">
              <el-option v-for="i in roundCount" :key="i+roundOffset-1" :label="i+roundOffset-1" :value="i+roundOffset-1"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item class="enter-match-item" label="会场令牌" prop="token">
        <el-input v-model="form.token" placeholder="请输入令牌" type="password" @keyup.enter="onEnter"/>
      </el-form-item>
      <el-button type="primary" style="width: 100%; margin-top: 1.5vh;" @click="onEnter">启动！</el-button>
    </el-form>
  </el-container>
</template>

<style scoped>
.enter-match-form-container {
  width: 60vw;
  height: 60vh;
  border: 1px solid white;
  border-radius: 8px;
  box-shadow: 2px 2px 12px white;
  margin: 0;
  flex: none;
  background-color: rgba(24, 24, 24, 0.92);
}
.enter-match-form {
  width: 100%;
  margin: auto 6vw;
}
.enter-match-title {
  font-size: xx-large;
  color: white;
  margin: auto;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}
.enter-match-div {
  width: 100%;
  margin-bottom: 4vh;
}
.enter-match-item {
  margin-bottom: 4vh !important;
}
.enter-match-col {
  padding: auto 1vw;
}
</style>
