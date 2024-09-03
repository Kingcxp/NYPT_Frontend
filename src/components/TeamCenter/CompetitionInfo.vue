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
const currentData = ref([])

const getNum = (str) => {
  let pattern = new RegExp('[0-9]+')
  let num = str.match(pattern)
  return num
}

const refresh = async () => {
  currentData.value = []
  teamdata.value = []
  for (let i = minRooms.value; i <= maxRooms.value; ++i) {
    await proxy.$http.post(`/assist/roomdata`, {
      'roomID': i,
      'round': round.value
    }).then((response) => {
      currentData.value.push(response.data.data)
    })
  }
  for (let i in currentData.value) {
    for (let idx in currentData.value[i].teamDataList) {
      let tmpRecord = {}
      for (let id in currentData.value[i].questionMap) {
        tmpRecord[id] = ''
      }
      for (let index in currentData.value[i].teamDataList[idx].recordDataList) {
        if (
          currentData.value[i].teamDataList[idx].recordDataList[index].role === 'B' ||
          currentData.value[i].teamDataList[idx].recordDataList[index].round > round.value
        ) {
          continue
        }
        tmpRecord[currentData.value[i].teamDataList[idx].recordDataList[index].questionID.toString()]
          += currentData.value[i].teamDataList[idx].recordDataList[index].role
      }
      teamdata.value.push({
        teamname: currentData.value[i].teamDataList[idx].name,
        ...tmpRecord
      })
    }
  }
  teamdata.value.sort((lhs, rhs) => {
    if (getNum(lhs.teamname) === '' || getNum(rhs.teamname) === '') {
      return lhs.teamname < rhs.teamname ? -1 : 1
    }
    return getNum(lhs.teamname) - getNum(rhs.teamname)
  })
}

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
  if (maxRounds.value === 0) {
    ElMessage({
      showClose: true,
      message: '网络错误！',
      center: true,
      type: 'warning'
    })
    return
  }
  await refresh()
})
</script>

<template>
  <label class="competition-info-title">比赛回顾（前 <el-input-number v-model="round" :min="minRounds" :max="maxRounds" @change="refresh()"/> 轮）</label>
  <el-table class="competition-info-table" :data="teamdata" stripe border>
    <el-table-column fixed prop="teamname" label="队伍名" width="100px"></el-table-column>
    <el-table-column
      v-for="[id, question] in Object.entries(currentData[0] ? currentData[0].questionMap : {})"
      :prop="id" :label="(id < 10 ? ' 0' : ' ') + id + ' ' + question" width="200px"
    ></el-table-column>
  </el-table>
</template>

<style scoped>
.competition-info-title {
  color: white;
  font-size: xx-large;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
  margin-top: 2vh;
  margin-bottom: 3vh;
  text-align: center;
}
.competition-info-table {
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
  width: 80vw;
  height: 68vh;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}
</style>