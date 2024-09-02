<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'

const { proxy } = getCurrentInstance()

const teamdata = ref([])
const round = ref(1)
const maxRounds = ref(0)
const minRounds = ref(0)
const room = ref(1)
const maxRooms = ref(0)
const minRooms = ref(0)
const currentRoom = ref({})

onMounted(async () => {
  await proxy.$http.get(`/assist/total/room`).then((response) => {
    room.value = response.data.offset
    maxRooms.value = response.data.rooms
    minRooms.value = response.data.offset
  })
  await proxy.$http.get(`/assist/total/round`).then((response) => {
    round.value = response.data.offset
    maxRounds.value = response.data.rounds
    minRounds.value = response.data.offset
  })
  await proxy.$http.post(`/assist/roomdata`, {
    'roomID': room.value,
    'round': round.value
  }).then((response) => {
    currentRoom.value = response.data.data
  })
  if (maxRounds.value === 0) {
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
  <label class="competition-info-title">比赛回顾（第 <el-input-number class="competition-round-input" v-model="round" :min="1" :max="maxRounds" /> 轮）</label>
  <el-table class="competition-info-table" :data="teamdata" stripe>
    <el-table-column fixed prop="teamname" label="队伍名" width="100px"></el-table-column>

  </el-table>
</template>

<style scoped>
.competition-info-title {
  color: white;
  font-size: xx-large;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
  margin-top: 4vh;
  margin-bottom: 1vh;
  text-align: center;
}
</style>