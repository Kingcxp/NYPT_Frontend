<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import { Edit, Delete } from '@element-plus/icons-vue'


const { proxy } = getCurrentInstance()

const membersInfo = ref([])
const schoolSelected = ref(null)
const teamSelected = ref(null)
const recordSelected = ref(null)
const roomdata = ref({})

const messageWhenCatch = (err) => {
  ElMessage({
    showClose: true,
    message: err.response.data.msg,
    center: true,
    type: 'error',
  })
}

const selectFirstTeamBySchool = () => {
  if (schoolSelected.value === null) {
    return
  }
  for (const item of roomdata.value.teamDataList) {
    if (item.school === schoolSelected.value) {
      selectTeam(item)
      break
    }
  }
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
    selectFirstTeamBySchool()
  }).catch(messageWhenCatch)
}

const selectSchool = (name) => {
  schoolSelected.value = name
  selectFirstTeamBySchool()
}

const selectTeam = (item) => {
  teamSelected.value = item.name
  membersInfo.value = item.playerDataList
  recordSelected.value = item.recordDataList
}

const memberDialogVisible = ref(false)
const recordDialogVisible = ref(false)

const memberFormRef = ref(null)
const memberForm = reactive({
  school: '',
  team: '',
  name: '',
  gender: ''
})
const memberFormRules = {
  school: [{ required: true, message: '请输入学校', trigger: 'blur' }],
  team: [{ required: true, message: '请输入队伍名称', trigger: 'blur' }],
  name: [{ required: true, message: '请输入队员姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择队员性别', trigger: 'change' }]
}

const recordFormRef = ref(null)
const recordForm = reactive({
  round: 0,
  phase: 1,
  roomID: 0,
  questionID: '1',
  masterID: 0,
  role: 'R',
  score: 0.0,
  weight: 0.0
})
const recordFormRules = {
  round: [{ required: true, message: '请输入轮次', trigger: 'blur' }],
  phase: [{ required: true, message: '请输入阶段', trigger: 'blur' }],
  roomID: [{ required: true, message: '请输入会场 ID', trigger: 'blur' }],
  questionID: [{ required: true, message: '请输入题目 ID', trigger: 'blur' }],
  masterID: [{ required: true, message: '请输入主控队员 ID', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  score: [{ required: true, message: '请输入分数', trigger: 'blur' }],
  weight: [{ required: true, message: '请输入权重', trigger: 'blur' }]
}

const removeMember = (index) => {
  // TODO
}

const newMember = () => {
  // TODO
}

const saveMember = () => {
  // TODO
}

const newRecord = () => {
  // TODO
}

const removeRecord = (index) => {
  // TODO
}

const loadRecord = (index) => {
  // TODO
}

const saveRecord = () => {
  // TODO
}

onMounted(getRoomData)
</script>

<template>
  <el-container class="room-manager-main-container">
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
        <el-table-column label="删除" min-width="1">
          <template #default="scope">
            <el-button type="danger" :icon="Delete" circle @click="removeMember(scope.$index)" />
          </template>
        </el-table-column>
      </el-table>
      <el-button class="room-manager-add rm-panel" @click="newMember()">
        <el-icon class="room-manager-icon"><Plus /></el-icon>
        添加选手……
      </el-button>
    </el-container>
    <el-container class="room-manager-main">
      <el-table class="room-manager-main-table" :data="recordSelected" stripe border>
        <el-table-column prop="round" label="轮次" min-width="1"></el-table-column>
        <el-table-column prop="phase" label="阶段" min-width="1"></el-table-column>
        <el-table-column prop="roomID" label="房间号" min-width="2"></el-table-column>
        <el-table-column prop="questionID" label="题号" min-width="1"></el-table-column>
        <el-table-column prop="masterID" label="主控队员 ID" min-width="3"></el-table-column>
        <el-table-column prop="role" label="角色" min-width="1"></el-table-column>
        <el-table-column prop="score" label="分数" min-width="1"></el-table-column>
        <el-table-column prop="weight" label="系数" min-width="1"></el-table-column>
        <el-table-column label="编辑" min-width="1">
          <template #default="scope">
            <el-button type="primary" :icon="Edit" circle @click="loadRecord(scope.$index)" />
          </template>
        </el-table-column>
        <el-table-column label="删除" min-width="1">
          <template #default="scope">
            <el-button type="danger" :icon="Delete" circle @click="removeRecord(scope.$index)" />
          </template>
        </el-table-column>
      </el-table>
      <el-button style="width: 100%;" class="room-manager-add" @click="newRecord()">
        <el-icon class="room-manager-icon"><Plus /></el-icon>
        添加记录……
      </el-button>
    </el-container>
  </el-container>

  <el-dialog v-model="memberDialogVisible" title="添加选手">
    <el-form ref="memberFormRef" :model="memberForm" :rules="memberFormRules" label-width="80px">

    </el-form>
    <template #footer>
      <el-button @click="memberDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="saveMember()">
        确定
      </el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="recordDialogVisible" title="添加选手">
    <el-form ref="recordFormRef" :model="recordForm" :rules="recordFormRules" label-width="80px">

    </el-form>
    <template #footer>
      <el-button @click="recordDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="saveRecord()">
        确定
      </el-button>
    </template>
  </el-dialog>
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
  margin-bottom: 2vh !important;
  border: 1px solid rgba(202, 197, 197, 0.35);
  box-shadow: 0px 0px 8px rgba(255, 255, 255, 0.3);
}
.room-manager-member-table {
  padding: 0;
  height: 30vh;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
}
.room-manager-main {
  flex: none;
  width: 52vw;
  height: 80vh;
  margin-left: 16px;
  flex-direction: column;
}
.room-manager-main-table {
  height: 100%;
  width: 100%;
  margin-bottom: 2vh;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(202, 197, 197, 0.35);
  box-shadow: 0px 0px 8px rgba(255, 255, 255, 0.3);
}
.room-manager-add {
  height: 4vh;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.25);
  filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.25));
  margin: 0 auto;
}
.room-manager-add:hover {
  text-shadow: 0 0 2px rgba(64, 158, 255, 0.25);
  filter: drop-shadow(0 0 2px rgba(64, 158, 255, 0.25));
}
.room-manager-icon {
  margin-right: 12px;
  margin-bottom: 2px;
  filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.25));
}
</style>
