<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'


const { proxy } = getCurrentInstance()

const teamdata = ref([])
const round = ref(1)
const maxRounds = ref(0)
const minRounds = ref(0)
let maxRooms = 0
let minRooms = 0
const currentData = ref([])

const getNum = (str) => {
  let pattern = new RegExp('[0-9]+')
  let num = str.match(pattern)
  return num
}

const refresh = async () => {
  teamdata.value = []

  let tempRecords = {}
  for (let curRound = minRounds.value; curRound <= round.value; ++curRound) {
    let withError = false
    for (let i = minRooms; i <= maxRooms; ++i) {
      await proxy.$http.post(`/assist/roomdata`, {
        'room_id': i,
        'round_id': curRound,
        'token': 'just let me pass'
      }).then((response) => {
        if (i === minRooms) {
          currentData.value = []
        }
        currentData.value.push(response.data.data)
      }).catch((error) => {
        if (!withError) {
          withError = true
          ElMessage({
            showClose: true,
            message: error.response ? error.response.data.msg : "网络错误！",
            center: true,
            type: error.response ? 'error' : 'warning'
          })
        }
      })
    }
    for (let i in currentData.value) {
      for (let idx in currentData.value[i].teamDataList) {
        if (tempRecords[currentData.value[i].teamDataList[idx].name] === undefined) {
          tempRecords[currentData.value[i].teamDataList[idx].name] = {}
          for (let id in currentData.value[i].questionMap) {
            tempRecords[currentData.value[i].teamDataList[idx].name][id] = ''
          }
        }
        for (let index in currentData.value[i].teamDataList[idx].recordDataList) {
          if (
            currentData.value[i].teamDataList[idx].recordDataList[index].role === 'B' ||
            currentData.value[i].teamDataList[idx].recordDataList[index].round > round.value
          ) {
            continue
          }
          tempRecords[currentData.value[i].teamDataList[idx].name][currentData.value[i].teamDataList[idx].recordDataList[index].questionID.toString()]
            += currentData.value[i].teamDataList[idx].recordDataList[index].role
        }
      }
    }
  }
  for (let key in tempRecords) {
    teamdata.value.push({
      teamname: key,
      ...tempRecords[key]
    })
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
    maxRooms = response.data.rooms
    minRooms = response.data.offset
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
  max-width: 80vw;
  max-height: 65vh;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}
</style>
