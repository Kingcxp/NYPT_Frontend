<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'


const { proxy } = getCurrentInstance()

const membersInfo = ref([])
const schoolSelected = ref(null)
const teamSelected = ref(null)
const recordSelected = ref(null)
const roomdata = ref({})

const roomCount = ref(0)
const roundCount = ref(0)
const roomOffset = ref(0)
const roundOffset = ref(0)

const messageWhenCatch = (error) => {
  ElMessage({
    showClose: true,
    message: error.response === undefined ? '网络错误！' : error.response.data.msg,
    center: true,
    type: error.response === undefined ? 'warning' : 'error'
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
    schoolSelected.value = roomdata.value.schoolMap['1']
    selectFirstTeamBySchool()
  }).catch(messageWhenCatch)
  await proxy.$http.get(`/assist/total/room`).then((response) => {
    roomCount.value = response.data.rooms
    roomOffset.value = response.data.offset
  })
  await proxy.$http.get(`/assist/total/round`).then((response) => {
    roundCount.value = response.data.rounds
    roundOffset.value = response.data.offset
  })
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
  name: '',
  gender: '男'
})
const memberFormRules = {
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
  membersInfo.value.splice(index, 1)
  for (let item of roomdata.value.teamDataList) {
    if (item.name === teamSelected.value) {
      item.playerDataList = membersInfo.value
      break
    }
  }
}

const newMember = () => {
  memberForm.name = ''
  memberForm.gender = '男'
  memberDialogVisible.value = true
}

const saveMember = () => {
  memberFormRef.value.validate((valid) => {
    if (!valid) {
      return
    }
    membersInfo.value.push({
      name: memberForm.name,
      gender: memberForm.gender
    })
    for (let item of roomdata.value.teamDataList) {
      if (item.name === teamSelected.value) {
        item.playerDataList = membersInfo.value
        break
      }
    }
    memberDialogVisible.value = false
  })
}

const newRecord = () => {
  recordForm.round = 0
  recordForm.phase = 1
  recordForm.roomID = 0
  recordForm.questionID = '1'
  recordForm.masterID = 0
  recordForm.role = 'R'
  recordForm.score = 0.0
  recordForm.weight = 0.0
  recordDialogVisible.value = true
}

const removeRecord = (index) => {
  recordSelected.value.splice(index, 1)
  for (let item of roomdata.value.teamDataList) {
    if (item.name === teamSelected.value) {
      item.recordDataList = recordSelected.value
      break
    }
  }
}

const saveRecord = () => {
  recordFormRef.value.validate((valid) => {
    if (!valid) {
      return
    }
    recordSelected.value.push({
      round: recordForm.round,
      phase: recordForm.phase,
      roomID: recordForm.roomID,
      questionID: recordForm.questionID,
      masterID: recordForm.masterID,
      role: recordForm.role,
      score: recordForm.score,
      weight: recordForm.weight
    })
    for (let item of roomdata.value.teamDataList) {
      if (item.name === teamSelected.value) {
        item.recordDataList = recordSelected.value
        break
      }
    }
    recordDialogVisible.value = false
  })
}

const saveData = async () => {
  await proxy.$http.post("/assist/manage/rooms/data/upload", roomdata.value).then((response) => {
    ElMessage({
      showClose: true,
      message: '数据保存成功！',
      center: true,
      type: 'success'
    })
  }).catch(messageWhenCatch)
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
        <el-table-column prop="name" label="姓名" min-width="4"></el-table-column>
        <el-table-column prop="gender" label="性别" min-width="3"></el-table-column>
        <el-table-column label="删除" min-width="3">
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
        <el-table-column label="删除" min-width="1">
          <template #default="scope">
            <el-button type="danger" :icon="Delete" circle @click="removeRecord(scope.$index)" />
          </template>
        </el-table-column>
      </el-table>
      <el-button style="width: 100%; margin-bottom: 2vh;" class="room-manager-add" @click="newRecord()">
        <el-icon class="room-manager-icon"><Plus /></el-icon>
        添加记录……
      </el-button>
      <el-button style="width: 100%;" class="room-manager-add" @click="saveData()" type="success" plain>
        保存数据
      </el-button>
    </el-container>
  </el-container>

  <el-dialog v-model="memberDialogVisible" title="添加选手">
    <el-form ref="memberFormRef" :model="memberForm" :rules="memberFormRules" label-width="80px" label-position="left">
      <el-form-item class="room-manager-form-item" label="学校名" prop="school" @keyup.enter="saveMember()">
        <el-input v-model="schoolSelected" placeholder="学校名" clearable disabled/>
      </el-form-item>
      <el-form-item class="room-manager-form-item" label="队伍名" prop="team" @keyup.enter="saveMember()">
        <el-input v-model="teamSelected" placeholder="队伍名" clearable disabled/>
      </el-form-item>
      <el-form-item class="room-manager-form-item" label="姓名" prop="name" @keyup.enter="saveMember()">
        <el-input v-model="memberForm.name" placeholder="请输入姓名" clearable/>
      </el-form-item>
      <el-form-item class="room-manager-form-item" label="性别" prop="gender">
        <el-radio-group v-model="memberForm.gender">
          <el-radio-button value="男">男</el-radio-button>
          <el-radio-button value="女">女</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="memberDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="saveMember()">
        确定
      </el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="recordDialogVisible" title="添加记录">
    <el-form ref="recordFormRef" :model="recordForm" :rules="recordFormRules" label-width="120px" label-position="left">
      <el-form-item class="room-manager-form-item" label="学校名" prop="school" @keyup.enter="saveMember()">
        <el-input v-model="schoolSelected" placeholder="学校名" clearable disabled/>
      </el-form-item>
      <el-form-item class="room-manager-form-item" label="队伍名" prop="team" @keyup.enter="saveMember()">
        <el-input v-model="teamSelected" placeholder="队伍名" clearable disabled/>
      </el-form-item>
      <el-form-item class="room-manager-form-item" label="轮次" prop="round">
        <el-select v-model="recordForm.round">
          <el-option
            v-for="idx in roundCount + 1"
            :key="idx - 2 + roundOffset"
            :label="idx - 2 + roundOffset"
            :value="idx - 2 + roundOffset"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="room-manager-form-item" label="阶段" prop="phase">
        <el-select v-model="recordForm.phase">
          <el-option
            v-for="idx in [1, 2, 3, 4]"
            :key="idx" :label="idx" :value="idx"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="room-manager-form-item" label="会场 ID" prop="roomID">
        <el-select v-model="recordForm.roomID">
          <el-option
            v-for="idx in roomCount + 1"
            :key="idx - 2 + roomOffset"
            :label="idx - 2 + roomOffset"
            :value="idx - 2 + roomOffset"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="room-manager-form-item" label="题目 ID" prop="questionID">
        <el-select v-model="recordForm.questionID">
          <el-option
            v-for="item in Object.keys(roomdata.questionMap ? roomdata.questionMap : {})"
            :key="item" :label="item" :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="room-manager-form-item" label="主控队员 ID" prop="masterID">
        <el-select v-model="recordForm.masterID">
          <el-option
            v-for="item in Object.keys(membersInfo)"
            :key="parseInt(item) + 1" :label="parseInt(item) + 1" :value="parseInt(item) + 1"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="room-manager-form-item" label="角色" prop="role">
        <el-select v-model="recordForm.role">
          <el-option
            v-for="item in ['R', 'O', 'V', 'X']"
            :key="item" :label="item" :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="room-manager-form-item" label="分数" prop="score">
        <el-input-number v-model="recordForm.score" :min="-100" :max="100" :precision="1" :step="0.1" />
      </el-form-item>
      <el-form-item class="room-manager-form-item" label="权重" prop="weight">
        <el-input-number v-model="recordForm.weight" :min="-100" :max="100" :precision="1" :step="0.1" />
      </el-form-item>
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
.room-manager-form-item {
  margin-left: 5vw;
  margin-right: 5vw;
}
</style>
