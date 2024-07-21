<script setup>
import { reactive, getCurrentInstance } from 'vue'


const { proxy } = getCurrentInstance()
const props = defineProps({
  roomCount: Number, roundCount: Number
})
const emits = defineEmits(['roomdata', 'rule', 'matchType'])

const form = reactive({
  roomID: 0,
  round: 0,
  token: '',
})

const onEnter = async () => {
  await proxy.$http.post('/assist/roomdata', form).then((response) => {
    
  })
}
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
              <el-option v-for="i in roomCount" :key="i-1" :label="i-1" :value="i-1"/>
            </el-select>  
          </el-form-item>
        </el-col>
        <el-col :span="2" />
        <el-col class="enter-match-col" :span="11">
          <el-form-item :span="6" class="enter-match-item" label="比赛轮次" prop="round">
            <el-select v-model="form.round" size="large">
              <el-option v-for="i in roundCount" :key="i-1" :label="i-1" :value="i-1"/>
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
