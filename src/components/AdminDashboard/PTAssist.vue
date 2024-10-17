<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'


const { proxy } = getCurrentInstance()

const roomData = ref([])

const messageWhenCatch = (error) => {
  ElMessage({
    showClose: true,
    message: error.response.data.msg,
    center: true,
    type: 'error'
  })
}

const getRooms = async () => {
  await proxy.$http.get("/assist/manage/rooms/info").then((response) => {
    roomData.value = response.data.rooms
  }).catch(messageWhenCatch)
}

const refreshRoomsLoading = ref(false)
const refreshRooms = async () => {
  refreshRoomsLoading.value = true
  await proxy.$http.get("/assist/manage/rooms/clear").then(async (_) => {
    ElMessage({
      showClose: true,
      message: "已重新生成所有会场！",
      center: true,
      type: "success"
    })
    await getRooms()
  }).catch(messageWhenCatch)
  refreshRoomsLoading.value = false
}

const exportRooms = async () => {
  const link = document.createElement("a")
  link.href = proxy.$http.defaults.baseURL + "/assist/manage/rooms/table"
  document.body.appendChild(link)
  link.click();
  document.body.removeChild(link)
}

const isBtnDisabled = ref(false)
const generateCounterpartLoading = ref(false)
const generateCounterpartTable = async () => {
  isBtnDisabled.value = true
  generateCounterpartLoading.value = true
  await proxy.$http.get("/assist/manage/counterpart/generate").then((_) => {
    ElMessage({
      showClose: true,
      message: "已生成对阵表！",
      center: true,
      type: "success"
    })
  }).catch(messageWhenCatch)
  generateCounterpartLoading.value = false
  isBtnDisabled.value = false
}

const getConfigTemplate = async () => {
  const link = document.createElement("a")
  link.href = proxy.$http.defaults.baseURL + "/auth/manage/config/template"
  document.body.appendChild(link)
  link.click();
  document.body.removeChild(link)
}

const downloadConfig = async () => {
  const link = document.createElement("a")
  link.href = proxy.$http.defaults.baseURL + "/assist/manage/config/download"
  document.body.appendChild(link)
  link.click();
  document.body.removeChild(link)
}

const onUpload = async (param) => {
  let formData = new FormData()
  formData.append("file", param.file)
  await proxy.$http.post("/assist/manage/config/upload", formData).then((response) => {
    ElMessage({
      showClose: true,
      message: "配置文件上传成功！",
      center: true,
      type: "success"
    })
  }).catch(messageWhenCatch)
}

onMounted(async () => {
  await getRooms()
})
</script>

<template>
  <el-container class="admin-assist-main-container">
    <el-container class="admin-assist-container-left">
      <label class="admin-assist-title">全部会场信息</label>
      <el-container class="admin-assist-table-container">
        <el-table class="admin-assist-table" :data="roomData" stripe border>
          <el-table-column fixed prop="room_id" label="房间号" width="80px"></el-table-column>
          <el-table-column prop="token" label="房间令牌" width="240px"></el-table-column>
        </el-table>
        <el-button class="admin-assist-btn" type="success" v-loading="refreshRoomsLoading" @click="refreshRooms">
          <el-icon class="admin-assist-icon"><Refresh /></el-icon>
          重新生成所有会场…
        </el-button>
        <el-button class="admin-assist-btn" type="primary" @click="exportRooms">
          导出会场令牌表…
        </el-button>
      </el-container>
    </el-container>
    <el-container class="admin-assist-container-right">
      <label class="admin-assist-title">配置控制台</label>
      <el-container>
        <el-button type="primary" @click="getConfigTemplate">
          获取配置模板
        </el-button>
        <el-button type="primary" v-loading="generateCounterpartLoading" @click="generateCounterpartTable" :disabled="isBtnDisabled">
          生成对阵信息
        </el-button>
        <el-button type="primary" @click="downloadConfig">
          下载配置文件
        </el-button>
        <el-upload
          style="margin-left: 12px;"
          :show-file-list="false"
          :http-request="onUpload"
          accept="application/vnd.ms-excel"
        >
          <template #trigger>
            <el-button type="primary">上传配置文件</el-button>
          </template>
        </el-upload>
      </el-container>
    </el-container>
  </el-container>
</template>

<style scoped>
.admin-assist-title {
  color: white;
  font-size: xx-large;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
  margin-top: 3vh;
  margin-bottom: 2vh;
  text-align: center;
}
.admin-assist-table {
  width: fit-content;
  max-width: 70vw;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}
.admin-assist-view-icon {
  height: min-content;
  width: min-content;
  cursor: pointer;
  margin: auto;
  margin-right: 0;
}
.admin-assist-view-icon-detail {
  width: 20px;
  height: auto;
}
.admin-assist-btn {
  width: 100%;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.25);
  filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.25));
  margin: 0 auto;
}
.admin-assist-btn:hover {
  text-shadow: 0 0 2px rgba(64, 158, 255, 0.25);
  filter: drop-shadow(0 0 2px rgba(64, 158, 255, 0.25));
}
.admin-assist-icon {
  margin-right: 12px;
  margin-bottom: 2px;
  filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.25));
}
.admin-assist-form-item {
  margin-left: 5vw;
  margin-right: 5vw;
}
.admin-assist-table-container {
  display: flex;
  flex-direction: column;
  flex: none;
  height: auto;
  width: min-content;
}
.admin-assist-main-container {
  display: flex;
  flex-direction: row;
  width: calc(85vw - 40px);
  height: 100%;
}
.admin-assist-container-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 36%;
  margin-left: 14%;
}
.admin-assist-container-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 36%;
  margin: auto 0;
  margin-right: 14%;
}
</style>
