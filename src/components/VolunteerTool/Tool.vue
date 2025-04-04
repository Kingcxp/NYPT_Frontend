<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import CUPTRule from '@/utils/PTRules/CUPT'
import JSYPTRule from '@/utils/PTRules/JSYPT'


const { proxy } = getCurrentInstance()

const props = defineProps({
  roomdata: Object,
  matchType: String,
  rule: String,
  roomID: Number,
  round: Number,
  token: String
})

const data = ref({})
const roomdataRef = ref(null)

const dialogVisible = ref(false)

const selectedQuestion = ref('-1')
const phase = ref(1)

const teamReport = ref('team001')
const memberReport = ref('')
const membersReport = ref([])
const teamOppose = ref('team002')
const memberOppose = ref('')
const membersOppose = ref([])
const teamReview = ref('team003')
const memberReview = ref('')
const membersReview = ref([])
const teamSpecator = ref('team004')

const judgers = ref([[0, 0, 0]])

const matchState = ref('QUESTION')

let roundPlayerRecordList = []
let refusedQuestionList = []
let usedQuestionList = []


const nextRound = () => {
  let PTRules = {
    CUPT:   new CUPTRule(),
    JSYPT:  new JSYPTRule(),
  }
  // ! 加载队名
  let len = roomdataRef.value.teamDataList.length
  if (len === 3) {
    teamSpecator.value = '无观摩方'
  } else {
    teamSpecator.value = roomdataRef.value.teamDataList[3].name
  }
  teamReport.value = roomdataRef.value.teamDataList[0].name
  teamOppose.value = roomdataRef.value.teamDataList[1].name
  teamReview.value = roomdataRef.value.teamDataList[2].name

  roomdataRef.value.teamDataList.push(roomdataRef.value.teamDataList.shift())

  // ! 读取记录
  let repTeamRecordDataList = props.roomdata.teamDataList.find(
    element => { return element.name === teamReport.value }
  ).recordDataList
  let repPlayerDataList = props.roomdata.teamDataList.find(
    element => { return element.name === teamReport.value }
  ).playerDataList
  let oppTeamRecordDataList = props.roomdata.teamDataList.find(
    element => { return element.name === teamOppose.value }
  ).recordDataList
  let oppPlayerDataList = props.roomdata.teamDataList.find(
    element => { return element.name === teamOppose.value }
  ).playerDataList
  let revTeamRecordDataList = props.roomdata.teamDataList.find(
    element => { return element.name === teamReview.value }
  ).recordDataList
  let revPlayerDataList = props.roomdata.teamDataList.find(
    element => { return element.name === teamReview.value }
  ).playerDataList

  // ! 加载可用问题列表
  let questionIDList = PTRules[props.rule].getOptionalQuestionIDList(
    repTeamRecordDataList,
    oppTeamRecordDataList,
    usedQuestionList,
    Object.keys(props.roomdata.questionMap),
    props.matchType
  )
  for (let key of Object.keys(roomdataRef.value.questionMap)) {
    if (questionIDList.includes(key.toString()) || roomdataRef.value.questionMap[key].endsWith('[!Disabled]')) {
      continue
    }
    roomdataRef.value.questionMap[key] += '[!Disabled]'
  }

  // ! 加载本场可用队员
  let validPlayerIDListReport = PTRules[props.rule].getValidPlayerIDList(
    roundPlayerRecordList,
    repTeamRecordDataList,
    repPlayerDataList
  )
  membersReport.value = repPlayerDataList.filter(
    element => { return validPlayerIDListReport.includes(element.id) }
  ).map(element => { return element.name })

  let validPlayerIDListOppose = PTRules[props.rule].getValidPlayerIDList(
    roundPlayerRecordList,
    oppTeamRecordDataList,
    oppPlayerDataList
  )
  membersOppose.value = oppPlayerDataList.filter(
    element => { return validPlayerIDListOppose.includes(element.id) }
  ).map(element => { return element.name })

  let validPlayerIDListReview = PTRules[props.rule].getValidPlayerIDList(
    roundPlayerRecordList,
    revTeamRecordDataList,
    revPlayerDataList
  )
  membersReview.value = revPlayerDataList.filter(
    element => { return validPlayerIDListReview.includes(element.id) }
  ).map(element => { return element.name })
}

const onRefuse = () => {
  if (props.matchType !== 'NORMAL' || matchState.value !== 'QUESTION') {
    return
  }
  refusedQuestionList.push(selectedQuestion.value)
  roomdataRef.value.questionMap[selectedQuestion.value] += '[!Disabled]'
  selectedQuestion.value = '-1'
  ElMessage({
    showClose: true,
    message: '选题已被拒绝！',
    center: true,
    type: 'error'
  })
}
const onConfirm = () => {
  if (selectedQuestion.value === '-1' || matchState.value !== 'QUESTION') {
    return
  }
  usedQuestionList.push(selectedQuestion.value)
  roomdataRef.value.questionMap[selectedQuestion.value] += '[!Disabled]'
  matchState.value = 'SUBMIT'
  ElMessage({
    showClose: true,
    message: '选题已经锁定！',
    center: true,
    type: 'warning'
  })
}
const onSave = () => {
  let PTRules = {
    CUPT:   new CUPTRule(),
    JSYPT:  new JSYPTRule(),
  }
  if (matchState.value !== 'SUBMIT') {
    return
  }
  if (teamReport.value.trim() === '' || teamOppose.value.trim() === '' || teamReview.value.trim() === '') {
    ElMessage({
      showClose: true,
      message: '啊哦？你是不是还有东西没填完？',
      center: true,
      type: 'error'
    })
    return
  }
  let repTeamData = roomdataRef.value.teamDataList.find(
    team => { return team.name === teamReport.value }
  )
  let repPlayerID = repTeamData.playerDataList.find(
    player => { return player.name === memberReport.value }
  ).id
  let repScores = []
  for (let i = 0; i < judgers.value.length; i++) {
    repScores.push(judgers.value[i][0])
  }
  let oppTeamData = roomdataRef.value.teamDataList.find(
    team => { return team.name === teamOppose.value }
  )
  let oppPlayerID = oppTeamData.playerDataList.find(
    player => { return player.name === memberOppose.value }
  ).id
  let oppScores = []
  for (let i = 0; i < judgers.value.length; i++) {
    oppScores.push(judgers.value[i][1])
  }
  let revTeamData = roomdataRef.value.teamDataList.find(
    team => { return team.name === teamReview.value }
  )
  let revPlayerID = revTeamData.playerDataList.find(
    player => { return player.name === memberReview.value }
  ).id
  let revScores = []
  for (let i = 0; i < judgers.value.length; i++) {
    revScores.push(judgers.value[i][2])
  }
  roundPlayerRecordList.push([repPlayerID, oppPlayerID, revPlayerID])
  refusedQuestionList.forEach(question => {
    repTeamData.recordDataList.push({
      'round': props.round,
      'phase': phase.value,
      'roomID': props.roomID,
      'questionID': question,
      'masterID': 0,
      'role': 'X',
      'score': 0.0,
      'weight': PTRules[props.rule].getRepScoreWeight(
        repTeamData.recordDataList, true
      )
    })
  })
  let refusedLen = refusedQuestionList.length
  for (let i = 0; i < refusedLen; ++i) {
    refusedQuestionList.pop()
  }
  repTeamData.recordDataList.push({
    'round': props.round,
    'phase': phase.value,
    'roomID': props.roomID,
    'questionID': selectedQuestion.value,
    'masterID': repPlayerID,
    'role': 'R',
    "score": PTRules[props.rule].getScore(repScores),
    'weight': PTRules[props.rule].getRepScoreWeight(
      repTeamData.recordDataList, false
    )
  })
  oppTeamData.recordDataList.push({
    'round': props.round,
    'phase': phase.value,
    'roomID': props.roomID,
    'questionID': selectedQuestion.value,
    'masterID': oppPlayerID,
    'role': 'O',
    'score': PTRules[props.rule].getScore(oppScores),
    'weight': PTRules[props.rule].getOppScoreWeight()
  })
  revTeamData.recordDataList.push({
    'round': props.round,
    'phase': phase.value,
    'roomID': props.roomID,
    'questionID': selectedQuestion.value,
    'masterID': revPlayerID,
    'role': 'V',
    'score': PTRules[props.rule].getScore(revScores),
    'weight': PTRules[props.rule].getRevScoreWeight()
  })
  matchState.value = 'NEXT'

  // ! 清除所有 disabled
  for (let question of Object.keys(roomdataRef.value.questionMap)) {
    roomdataRef.value.questionMap[question] = roomdataRef.value.questionMap[question].replaceAll('[!Disabled]', '')
  }

  ElMessage({
    showClose: true,
    message: '本场记录已经保存！',
    center: true,
    type: 'success'
  })
  ElMessage({
    showClose: true,
    message: '注意：只是保存在页面中，刷新页面也意味着丢失！',
    center: true,
    type: 'warning'
  })
}
const onNext = async () => {
  if (matchState.value !== 'NEXT') {
    return
  }
  judgers.value.forEach(
    element => {
      element[0] = element[1] = element[2] = 0
    }
  )
  memberReport.value = memberOppose.value = memberReview.value = ''
  selectedQuestion.value = '-1'
  matchState.value = 'QUESTION'
  phase.value += 1
  if (phase.value > roomdataRef.value.teamDataList.length) {
    while (true) {
      let quit = false
      await proxy.$http.post(`/assist/roomdata/upload`, {
      'room_id': props.roomID,
      'round_id': props.round,
      'token': props.token,
      'new_data': roomdataRef.value
      }).then(() => {
        ElMessage({
          showClose: true,
          message: '数据已上传！',
          center: true,
          type: 'success'
        })
        quit = true
      }).catch(() => {
        ElMessage({
          showClose: true,
          message: '啊哦！数据上传失败！重传中，请勿关闭页面！',
          center: true,
          type: 'error',
        })
      })
      if (quit) {
        break
      }
    }
    ElMessage({
      showClose: true,
      message: '本轮比赛已完成！',
      center: true,
      type: 'success'
    })
    dialogVisible.value = true
  } else {
    nextRound()
    ElMessage({
      showClose: true,
      message: '下一场开始！',
      center: true,
      type: 'success'
    })
  }
}
const dialogConfirm = () => {
  dialogVisible.value = false
  proxy.$router.push('/')
}

onMounted(async () => {
  roomdataRef.value = JSON.parse(JSON.stringify(props.roomdata))
  await proxy.$http.get(`/assist/manage/rooms/data`).then((response) => {
    data.value = response.data
  }).catch((error) => {
    ElMessage({
      showClose: true,
      message: error.response ? error.response.data.msg : "网络错误！",
      center: true,
      type: error.response ? 'error' : 'warning'
    })
  })
  for (let i = 0; i < roomdataRef.value.teamDataList.length; ++i) {
    roomdataRef.value.teamDataList[i].recordDataList = data.value.teamDataList.find(
      element => element.name === roomdataRef.value.teamDataList[i].name
    ).recordDataList
  }
  for (let i = 0; i < props.roomdata.teamDataList.length; ++i) {
    props.roomdata.teamDataList[i].recordDataList = data.value.teamDataList.find(
      element => element.name === props.roomdata.teamDataList[i].name
    ).recordDataList
  }
  nextRound()
})
</script>

<template>
  <el-container class="tool-main-container">
    <el-aside class="tool-question-list-wrapper">
      <el-radio-group class="tool-question-list" v-model="selectedQuestion">
        <el-radio
          class="tool-question"
          v-for="[id, question] in Object.entries(roomdataRef ? roomdataRef.questionMap : {})"
          :key="id"
          :value="id" :disabled="question.endsWith('[!Disabled]') || matchState !== 'QUESTION'"
        >
          {{ (id < 10 ? ' 0' : ' ') + id + ' ' + question.replaceAll('[!Disabled]', '') }}
        </el-radio>
      </el-radio-group>
    </el-aside>
    <el-main class="tool-control-panel">
      <el-text class="control-panel-title">选题操作</el-text>
      <el-container class="tool-quesition-showcase">
        <el-text class="control-panel-label">选题：</el-text>
        <el-tooltip
          :content="matchState === 'QUESTION' ? '选题尚未锁定！' : '选题已经锁定！'"
          placement="top"
          effect="dark"
        >
          <el-input class="showcase-display" :value="((roomdataRef ? roomdataRef.questionMap[selectedQuestion] : '') || '').replaceAll('[!Disabled]', '')" placeholder="选题显示在这里！" disabled/>
        </el-tooltip>
        <el-button
          class="showcase-button"
          :type="selectedQuestion === '-1' || matchState === 'QUESTION' ? 'success' : 'primary'"
          :plain="selectedQuestion === '-1' || matchState === 'QUESTION' ? false : true"
          @click="onConfirm"
        >锁定选题</el-button>
        <el-button
          class="showcase-button"
          type="danger"
          :plain="matchType === 'NORMAL' && matchState === 'QUESTION' ? false: true"
          :disabled="matchType === 'NORMAL' && matchState === 'QUESTION' ? false : true"
          @click="onRefuse"
        >拒绝选题</el-button>
      </el-container>
      <el-text class="control-panel-title">答题成员</el-text>
      <el-container class="tool-team-select">
        <el-container class="team-select-row interval-helper">
          <el-text class="control-panel-label">正：</el-text>
          <el-input class="team-select-team" :value="teamReport" placeholder="队伍名称" disabled/>
          <el-select v-model="memberReport" class="team-select-partner" placeholder="选择成员" :disabled="matchState === 'NEXT' ? true : false">
            <el-option
              v-for="member in membersReport"
              :key="member"
              :label="member"
              :value="member"
            />
          </el-select>
        </el-container>
        <el-container class="team-select-row interval-helper">
          <el-text class="control-panel-label">反：</el-text>
          <el-input class="team-select-team" :value="teamOppose" placeholder="队伍名称" disabled/>
          <el-select v-model="memberOppose" class="team-select-partner" placeholder="选择成员" :disabled="matchState === 'NEXT' ? true : false">
            <el-option
              v-for="member in membersOppose"
              :key="member"
              :label="member"
              :value="member"
            />
          </el-select>
        </el-container>
        <el-container class="team-select-row interval-helper">
          <el-text class="control-panel-label">评：</el-text>
          <el-input class="team-select-team" :value="teamReview" placeholder="队伍名称" disabled/>
          <el-select v-model="memberReview" class="team-select-partner" placeholder="选择成员" :disabled="matchState === 'NEXT' ? true : false">
            <el-option
              v-for="member in membersReview"
              :key="member"
              :label="member"
              :value="member"
            />
          </el-select>
        </el-container>
        <el-container class="team-select-row">
          <el-text class="control-panel-label">观：</el-text>
          <el-input class="team-select-team" :value="teamSpecator" placeholder="队伍名称" disabled/>
        </el-container>
      </el-container>
      <el-text class="control-panel-title">评委计分</el-text>
      <el-container class="tool-scoreboard">
        <el-container class="scoreboard-col" style="flex: none; width: 80px; padding: 0">
          <el-text class="control-panel-label interval-helper" style="line-height: 38px;">正：</el-text>
          <el-text class="control-panel-label interval-helper" style="line-height: 38px;">反：</el-text>
          <el-text class="control-panel-label" style="line-height: 38px;">评：</el-text>
        </el-container>
        <el-container class="scoreboard-col" v-for="i in judgers.length" :key="i">
          <el-input-number
            class="scoreboard-number interval-helper"
            :min="0" :max="10"
            v-model="judgers[i-1][0]"
            :disabled="matchState === 'NEXT' ? true : false"
          />
          <el-input-number
            class="scoreboard-number interval-helper"
            :min="0" :max="10"
            v-model="judgers[i-1][1]"
            :disabled="matchState === 'NEXT' ? true : false"
          />
          <el-input-number
            class="scoreboard-number"
            :min="0" :max="10"
            v-model="judgers[i-1][2]"
            :disabled="matchState === 'NEXT' ? true : false"
          />
        </el-container>
        <el-container class="scoreboard-col" style="flex: none; width: 80px;">
          <el-button
            type="primary"
            class="scoreboard-button"
            @click="judgers.push([0, 0, 0])"
            :disabled="matchState === 'NEXT' ? true : false"
            plain
          >添加评委</el-button>
          <el-button
            type="danger"
            class="scoreboard-button"
            @click="judgers.pop()"
            :disabled="matchState === 'NEXT' ? true : false"
            plain
          >减少评委</el-button>
        </el-container>
      </el-container>
      <el-container class="tool-submit-dock">
        <el-button
          :type="matchState === 'SUBMIT' ? 'success' : 'primary'"
          :plain="matchState === 'SUBMIT' ? false : true"
          @click="onSave"
        >暂存本场结果</el-button>
        <el-button
          :type="matchState === 'NEXT' ? 'success' : 'primary'"
          :plain="matchState === 'NEXT' ? false : true"
          @click="onNext"
        >
          {{
            phase === ((roomdataRef ? roomdataRef.teamDataList : [0]).length)
              ? '完成本轮比赛！' : '下一场（第 '  + (phase+1) + ' 场）'
          }}
        </el-button>
      </el-container>
    </el-main>
  </el-container>

  <el-dialog v-model="dialogVisible" align-center>
    <el-text style="font-size: xx-large;" class="text-info">提示<br></el-text>
    <el-text>
      <el-text class="text-success">本轮比赛</el-text><el-text class="text-primary">已经</el-text><el-text class="text-warn">结束</el-text>！<br><el-text class="text-success">感谢</el-text><el-text class="text-error">您</el-text>的<el-text class="text-primary">辛勤付出</el-text>！<br><el-text class="text-warn">即将回到主页。</el-text>
    </el-text>
    <template #footer>
      <div>
        <el-button @click="dialogConfirm" type="primary" style="color: black;">
          太棒了！
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.tool-main-container {
  width: 100%;
  height: 100%;
  flex-direction: row;
}
.tool-question-list-wrapper {
  border-right: 1px solid #666666;
}
.tool-question-list {
  flex-wrap: nowrap;
  flex-direction: column;
  height: calc(100vh - 140px);
  padding-left: 60px;
  padding-top: 20px;
}
.tool-question {
  width: 100%;
  margin: 6px 0;
  height: min-content;
}
.tool-control-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
}
.tool-quesition-showcase {
  flex: none;
}
.control-panel-label {
  width: 80px;
  cursor: default;
}
.control-panel-title {
  font-size: x-large;
  color: white;
  cursor: default;
  text-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
  margin: 20px auto 10px auto;
}
.showcase-display {
  width: calc((100vw - 420px) / 2 - 15px);
}
.showcase-button {
  width: calc(((100vw - 420px) / 2 - 45px) / 2);
  margin-left: 30px;
  margin-right: 0;
}
.tool-team-select {
  flex: none;
  flex-wrap: wrap;
}
.team-select-row {
  flex-direction: row;
}
.team-select-team {
  width: calc((100vw - 420px) / 2 - 15px);
  margin-right: 15px;
}
.team-select-partner {
  width: calc((100vw - 420px) / 2 - 15px);
  margin-left: 15px;
}
.tool-scoreboard {
  width: 100%;
  display: inline-flex;
  flex: none;
  flex-direction: row;
}
.scoreboard-col {
  flex-direction: column;
  padding-right: 10px;
}
.interval-helper {
  margin-bottom: 10px;
}
.scoreboard-number {
  width: 100%;
}
.tool-submit-dock {
  margin-top: 20px;
  flex: none;
}
.scoreboard-button {
  width: 80px;
  margin: 20px 0;
}
.text-success {
  color: #67C23A;
}
.text-warn {
  color: #E6A23C;
}
.text-info {
  color: #909399;
}
.text-error {
  color: #F56C6C;
}
.text-primary {
  color: #409EFF;
}
</style>
