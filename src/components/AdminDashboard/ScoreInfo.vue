<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'


const { proxy } = getCurrentInstance()

const teamdata = ref([])
const minRounds = ref(0)
const maxRounds = ref(0)

const range = (start, end) => {
  const length = end - start + 1
  return Array.from({ length }, (_, index) => start + index)
}

const getNum = (str) => {
  let pattern = new RegExp('[0-9]+')
  let num = str.match(pattern)
  return num
}

onMounted(async () => {
  await proxy.$http.get(`/assist/total/round`).then((response) => {
    maxRounds.value = response.data.rounds
    minRounds.value = response.data.offset
  })
  await proxy.$http.get(`/assist/manage/rooms/data`).then((response) => {
    for (let idx in response.data.teamDataList) {
      let selfData = {}
      selfData['teamname'] = response.data.teamDataList[idx].name
      selfData['total'] = 0.0
      for (let curRound = minRounds.value; curRound <= maxRounds.value; ++curRound) {
        selfData[curRound.toString()] = 0.0
      }
      for (let index in response.data.teamDataList[idx].recordDataList) {
        let score = response.data.teamDataList[idx].recordDataList[index].score *
                    response.data.teamDataList[idx].recordDataList[index].weight
        selfData[response.data.teamDataList[idx].recordDataList[index].round.toString()] += score
        selfData['total'] += score
      }
      teamdata.value.push(selfData)
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
  teamdata.value.sort((lhs, rhs) => {
    if (getNum(lhs.teamname) === '' || getNum(rhs.teamname) === '') {
      return lhs.teamname < rhs.teamname ? -1 : 1
    }
    return getNum(lhs.teamname) - getNum(rhs.teamname)
  })
})
</script>

<template>
  <label class="admin-score-info-title">得分情况</label>
  <el-table class="admin-score-info-table" :data="teamdata" stripe border>
    <el-table-column fixed prop="teamname" label="队伍名" width="100px"></el-table-column>
    <el-table-column v-for="index in range(minRounds, maxRounds)" :prop="index.toString()" :label="'第 ' + index + ' 轮'" width="100px"></el-table-column>
    <el-table-column fixed="right" prop="total" label="总分" width="100px"></el-table-column>
  </el-table>
</template>

<style scoped>
.admin-score-info-title {
  color: white;
  font-size: xx-large;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
  margin-top: 2vh;
  margin-bottom: 3vh;
  text-align: center;
}
.admin-score-info-table {
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
  max-width: 80vw;
  max-height: 65vh;
  width: fit-content;
}
</style>
