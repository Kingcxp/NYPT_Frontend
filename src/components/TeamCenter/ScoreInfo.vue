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
let selfName = ''
let selfData = {}

const range = (start, end) => {
  const length = end - start + 1
  return Array.from({ length }, (_, index) => start + index)
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
  await proxy.$http.get(`/auth/userdata/real_name`).then((response) => {
    selfName = response.data.real_name
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
  selfData['teamname'] = selfName
  selfData['total'] = 0.0
  for (let curRound = minRounds.value; curRound <= maxRounds.value; ++curRound) {
    let withError = false, found = false
    selfData[curRound.toString()] = 0.0
    for (let i = minRooms; i <= maxRooms; ++i) {
      await proxy.$http.post(`/assist/roomdata`, {
        'roomID': i,
        'round': curRound
      }).then((response) => {
        for (let idx in response.data.data.teamDataList) {
          if (selfName === response.data.data.teamDataList[idx].name) {
            found = true
            for (let index in response.data.data.teamDataList[idx].recordDataList) {
              selfData[curRound.toString()] +=
                  response.data.data.teamDataList[idx].recordDataList[index].score *
                  response.data.data.teamDataList[idx].recordDataList[index].weight
            }
            break
          }
        }
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
      if (found) {
        selfData['total'] += selfData[curRound.toString()]
        break
      }
    }
  }
  teamdata.value.push(selfData)
})
</script>

<template>
  <label class="score-info-title">得分情况</label>
  <el-table class="score-info-table" :data="teamdata" stripe border>
    <el-table-column fixed prop="teamname" label="队伍名" width="100px"></el-table-column>
    <el-table-column v-for="index in range(minRounds, maxRounds)" :prop="index.toString()" :label="'第 ' + index + ' 轮'" width="100px"></el-table-column>
    <el-table-column fixed="right" prop="total" label="总分" width="100px"></el-table-column>
  </el-table>
</template>

<style scoped>
.score-info-title {
  color: white;
  font-size: xx-large;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
  margin-top: 2vh;
  margin-bottom: 3vh;
  text-align: center;
}
.score-info-table {
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
  max-width: 80vw;
  max-height: 65vh;
}
</style>
