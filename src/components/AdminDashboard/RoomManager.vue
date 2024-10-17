<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'


const { proxy } = getCurrentInstance()

const membersInfo = ref([])
const schoolSelected = ref(null)
const teamSelected = ref(null)
const roomdata = ref({})

const messageWhenCatch = (err) => {
  ElMessage({
    showClose: true,
    message: err.response.data.msg,
    center: true,
    type: 'error',
  })
}

const getRoomData = async () => {
  await proxy.$http.get('/assist/manage/rooms/data').then((response) => {
    roomdata.value = response.data
    ElMessage({
      showClose: true,
      message: '获取房间信息成功！',
      center: true,
      type: 'success',
    })
    schoolSelected.value = roomdata.value.schoolMap['1']
    teamSelected.value = roomdata.value.teamDataList[0].name
  }).catch(messageWhenCatch)
}

const selectSchool = (name) => {
  schoolSelected.value = name
  // TODO: 自动选择第一个队伍
}

const selectTeam = (item) => {
  teamSelected.value = item.name
  membersInfo.value = item.playerDataList
}

onMounted(getRoomData)
</script>

<template>
  <el-container class="room-manager-main-container">
    <el-container class="room-manager-aside-controller">
      <!-- TODO -->
    </el-container>
    <el-container class="room-manager-aside">
      <el-scrollbar style="margin-top: 2vh" height="20vh" class="rm-panel">
        <el-button
          class="room-manager-list-item"
          v-for="item in Object.values(roomdata.schoolMap || {})"
          :key="item"
          :type="item === schoolSelected ? 'primary' : 'default'"
          @click="selectSchool(item)"
          plain
        >{{ item }}</el-button>
      </el-scrollbar>
      <el-scrollbar height="20vh" class="rm-panel">
        <template v-for="item in roomdata.teamDataList || []" :key="item.name">
          <el-button
            class="room-manager-list-item"
            :type="item.name === teamSelected ? 'primary' : 'default'"
            v-if="item.school === schoolSelected"
            @click="selectTeam(item)"
            plain
          >{{ item.name }}</el-button>
        </template>
      </el-scrollbar>
      <el-table class="room-manager-member-table rm-panel" :data="membersInfo" stripe border>
        <el-table-column prop="name" label="姓名" min-width="2"></el-table-column>
        <el-table-column prop="gender" label="性别" min-width="1"></el-table-column>
      </el-table>
    </el-container>
    <el-container class="room-manager-main">
      <!-- TODO -->
    </el-container>
  </el-container>
</template>

<style scoped>
.room-manager-main-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.room-manager-aside-controller {
  flex: none;
  display: flex;
  flex-direction: column;
  width: 8vw;
}
.room-manager-aside {
  flex: none;
  display: flex;
  width: 16vw;
  flex-direction: column;
  align-items: center;
}
.room-manager-list-item {
  width: 100%;
  margin: 0;
}
.rm-panel {
  width: 16vw;
  padding: 0;
  margin-bottom: 2vh;
  border: 1px solid rgba(202, 197, 197, 0.35);
  box-shadow: 0px 0px 8px rgba(255, 255, 255, 0.3);
}
.room-manager-member-table {
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
  padding: 0;
  width: 16vw;
  height: 36vh;
}
.room-manager-main {
  flex: none;
  width: 52vw;
}
</style>
