<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'


const { proxy } = getCurrentInstance()

const teamdata = ref([])
const round = ref(1)
const currentData = ref({})

const getNum = (str) => {
  let pattern = new RegExp('[0-9]+')
  let num = str.match(pattern)
  return num
}

const refresh = async () => {
  teamdata.value = []

  let tempRecords = {}
  await proxy.$http.get(`/assist/manage/rooms/data`).then((response) => {
    currentData.value = response.data
  }).catch((error) => {
    ElMessage({
      showClose: true,
      message: error.response ? error.response.data.msg : "网络错误！",
      center: true,
      type: error.response ? 'error' : 'warning'
    })
  })
  for (let idx in currentData.value.teamDataList) {
    if (tempRecords[currentData.value.teamDataList[idx].name] === undefined) {
      tempRecords[currentData.value.teamDataList[idx].name] = {}
      for (let id in currentData.value.questionMap) {
        tempRecords[currentData.value.teamDataList[idx].name][id] = ''
      }
    }
    for (let index in currentData.value.teamDataList[idx].recordDataList) {
      if (
        currentData.value.teamDataList[idx].recordDataList[index].role === 'B' ||
        currentData.value.teamDataList[idx].recordDataList[index].round > round.value
      ) {
        continue
      }
      tempRecords[currentData.value.teamDataList[idx].name][currentData.value.teamDataList[idx].recordDataList[index].questionID.toString()]
        += currentData.value.teamDataList[idx].recordDataList[index].role + currentData.value.teamDataList[idx].recordDataList[index].masterID
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
  await refresh()
})
</script>

<template>
  <label class="competition-info-title">比赛回顾</label>
  <el-table class="competition-info-table" :data="teamdata" stripe border>
    <el-table-column fixed prop="teamname" label="队伍名" width="100px"></el-table-column>
    <el-table-column
      v-for="[id, question] in Object.entries(currentData.questionMap ? currentData.questionMap : {})"
      :prop="id" :label="(id < 10 ? ' 0' : ' ') + id + ' ' + question" width="200px"
    >
      <template #default="scope">
        <!-- TODO: fill in the table -->
        {{ teamdata[scope.$index][id] }}
      </template>
    </el-table-column>
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
