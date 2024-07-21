<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'

import NavBar from '@/components/NavBar.vue'
import FootBar from '@/components/FootBar.vue'
import EnterRoom from '@/components/VolunteerTool/EnterRoom.vue'


const { proxy } = getCurrentInstance()

const form = reactive({
  roomID: 0,
  round: 0,
  token: '',
})

const roomdata = ref(null)
const rule = ref(null)
const matchType = ref(null)

const roomCount = ref(0)
const roundCount = ref(0)

onMounted(async () => {
  await proxy.$http.get(`/assist/total/room`).then((response) => {
    roomCount.value = parseInt(response.data)
  })
  await proxy.$http.get(`/assist/total/round`).then((response) => {
    roundCount.value = parseInt(response.data)
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
  <el-container class="volunteer-container">
    <NavBar />
    <el-container class="volunteer-main-container">
      <EnterRoom
        :room-count="roomCount"
        :round-count="roundCount"
        @roomdata="(data) => roomdata = data"
        @rule="(data) => rule = data"
        @match-type="(data) => matchType = data"
        v-if="roomdata === null"
      />
      <el-container v-else>
        <!-- TODO -->
      </el-container>
    </el-container>
    <FootBar />
  </el-container>
</template>

<style scoped>
.volunteer-container {
  display: flex;
  flex-direction: column;
  background-color: #181818;
}
.volunteer-main-container {
  display: flex;
  height: calc(100vh - 140px);
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
