<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { Delete, Finished, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'


const { proxy } = getCurrentInstance()

/*
{
  room_id: string,
  round_id: string,
  time_info: string,
}
should be sorted.
*/
const scoringData = ref([])

const errorWhenCatch = (error) => {
  ElMessage({
    center: true,
    showClose: true,
    message: error.response === undefined ? '网络错误！' : error.response.data.msg,
    type: error.response === undefined ? 'warning' : 'error',
  })
}

const removeFile = async (index) => {
  await proxy.$http.post(`/assist/manage/scoring/remove`, scoringData.value[index]).then((response) => {
    scoringData.value.splice(index, 1)
    ElMessage({
      center: true,
      showClose: true,
      message: '删除成功！',
      type: 'success',
    })
  }).catch(errorWhenCatch)
}

const mergeFile = async (index) => {
  await proxy.$http.post(`/assist/manage/scoring/merge`, scoringData.value[index]).then((response) => {
    scoringData.value.splice(index, 1)
    ElMessage({
      center: true,
      showClose: true,
      message: '合并成功！',
      type: 'success',
    })
  }).catch(errorWhenCatch)
}

const downloadFile = async (index) => {
  await proxy.$http.post(`/assist/manage/scoring/download`, scoringData.value[index], {responseType: 'blob'}).then((response) => {
    const link = document.createElement("a")
    link.href = URL.createObjectURL(new Blob([response.data]))
    document.body.appendChild(link)
    link.setAttribute('download', `${scoringData.value[index].room_id}-${scoringData.value[index].round_id}-${scoringData.value[index].time_info}.json`)
    link.click();
    document.body.removeChild(link)
  })
}

onMounted(async () => {
  await proxy.$http.get(`/assist/manage/scoring/list`).then((response) => {
    scoringData.value = response.data.files
  }).catch(errorWhenCatch)
})
</script>

<template>
  <label class="admin-scoring-title">全部房间计分信息</label>
  <el-container class="admin-scoring-table-container">
    <el-table class="admin-scoring-table" :data="scoringData" stripe border>
      <el-table-column fixed prop="room_id" label="房间号" width="120px"></el-table-column>
      <el-table-column prop="round_id" label="轮次号" width="120px"></el-table-column>
      <el-table-column prop="time_info" label="上传时间" width="280px"></el-table-column>
      <el-table-column fixed="right" label="丢弃" width="80px">
        <template #default="scope">
          <el-button style="height: 40px; width: 40px;" type="danger" :icon="Delete" circle @click="removeFile(scope.$index)" />
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="合并" width="80px">
        <template #default="scope">
          <el-button style="height: 40px; width: 40px;" type="success" :icon="Finished" circle @click="mergeFile(scope.$index)" />
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="下载" width="80px">
        <template #default="scope">
          <el-button style="height: 40px; width: 40px;" type="primary" :icon="Download" circle @click="downloadFile(scope.$index)" />
        </template>
      </el-table-column>
    </el-table>
  </el-container>
</template>

<style scoped>
.admin-scoring-title {
  color: white;
  font-size: xx-large;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
  margin-top: 3vh;
  margin-bottom: 2vh;
  text-align: center;
}
.admin-scoring-table-container {
  display: flex;
  flex-direction: column;
  flex: none;
  height: auto;
  width: auto;
}
.admin-scoring-table {
  width: fit-content;
  max-width: 70vw;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}
</style>
