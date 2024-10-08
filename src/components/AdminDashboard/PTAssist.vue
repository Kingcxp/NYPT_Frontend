<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'


const { proxy } = getCurrentInstance()

const roomData = ref([])

const messageWhenCatch = (error) => {
  ElMessage({
    showClose: true,
    message: error.message,
    center: true,
    type: 'error'
  })
}

const getRooms = async () => {
  await proxy.$http.get("/assist/manage/rooms/info").then((response) => {
    roomData.value = response.data.rooms
  }).catch(messageWhenCatch)
}

const refreshRooms = async () => {
  await proxy.$http.get("/assist/manage/rooms/clear").then(async (_) => {
    ElMessage({
      showClose: true,
      message: "已重新生成所有会场！",
      center: true,
      type: "success"
    })
    await getRooms()
  }).catch(messageWhenCatch)
}

const generateCounterpartTable = async () => {
  await proxy.$http.get("/assist/manage/counterpart/generate").then((_) => {
    ElMessage({
      showClose: true,
      message: "已生成对阵表！",
      center: true,
      type: "success"
    })
  }).catch(messageWhenCatch)
}

const getConfigTemplate = async () => {
  await proxy.$http.get("/auth/manage/config/template").then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "config_template.xlsx")
    document.body.appendChild(link)
    link.click();
    document.body.removeChild(link)
  }).catch(messageWhenCatch)
}

const downloadConfig = async () => {
  await proxy.$http.get("/assist/manage/config/download").then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "server_config.xlsx")
    document.body.appendChild(link)
    link.click();
    document.body.removeChild(link)
  }).catch(messageWhenCatch)
}

onMounted(async () => {
  await getRooms()
})
</script>

<template>
  <label class="admin-assist-title">全部会场信息</label>
  <el-container class="admin-assist-table-container">
    <el-table class="admin-assist-table" :data="roomData" stripe border>
      <el-table-column fixed prop="room_id" label="房间号" width="80px"></el-table-column>
      <el-table-column prop="token" label="房间令牌" width="240px"></el-table-column>
    </el-table>
    <el-button class="admin-assist-btn" type="success" @click="refreshRooms">
      <el-icon class="admin-assist-icon"><Refresh /></el-icon>
      重新生成所有会场…
    </el-button>
  </el-container>
  <label class="admin-assist-title">比赛控制台</label>
  <el-container class="admin-assist-console-container">
    <el-button class="admin-assist-console-btn" type="primary" @click="getConfigTemplate">
      获取配置模板
    </el-button>
    <el-button class="admin-assist-console-btn" type="primary" @click="generateCounterpartTable">
      生成对阵表
    </el-button>
    <el-button class="admin-assist-console-btn" type="primary" @click="downloadConfig">
      下载配置文件
    </el-button>
  </el-container>
  <el-container class="admin-assist-console-container">
    <el-upload
      class="admin-assist-console-upload"
      :action="proxy.$http.defaults.baseURL + '/assist/manage/config/upload'"
      :limit="1"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      drag
    >

    </el-upload>
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
</style>
