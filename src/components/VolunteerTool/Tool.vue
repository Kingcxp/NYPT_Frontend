<script setup>
import { ref, getCurrentInstance } from 'vue'
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
})
let PTRules = {
  CUPT: CUPTRule,
  JSYPT: JSYPTRule
}

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

const onRefuse = () => {
  if (props.matchType !== 'NORMAL' || matchState.value !== 'QUESTION') {
    return
  }
  refusedQuestionList.push(selectedQuestion.value)
  props.roomdata.questionMap[selectedQuestion.value] += '[!Disabled]'
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
  props.roomdata.questionMap[selectedQuestion.value] += '[!Disabled]'
  matchState.value = 'SUBMIT'
  ElMessage({
    showClose: true,
    message: '选题已经锁定！',
    center: true,
    type: 'warning'
  })
}
const onSave = () => {
  if (matchState.value !== 'SUBMIT') {
    return
  }
  let repTeamData = props.roomdata.teamDataList.find(
    team => { return team.name === teamReport.value }
  )
  let repPlayerID = repTeamData.playerDataList.find(
    player => { player.name === memberReport.value }
  ).id
  let repScores = []
  for (let i = 0; i < judgers.value.length; i++) {
    repScores.push(judgers.value[i][0])
  }
  let oppTeamData = props.roomdata.teamDataList.find(
    team => { return team.name === teamOppose.value }
  )
  let oppPlayerID = oppTeamData.playerDataList.find(
    player => { player.name === memberOppose.value }
  ).id
  let oppScores = []
  for (let i = 0; i < judgers.value.length; i++) {
    oppScores.push(judgers.value[i][1])
  }
  let revTeamData = props.roomdata.teamDataList.find(
    team => { return team.name === teamReview.value }
  )
  let revPlayerID = revTeamData.playerDataList.find(
    player => { player.name === memberReview.value }
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
      'questionID': parseInt(question),
      'masterID': 0,
      'role': 'X',
      'score': 0.0,
      'weight': PTRules[props.rule].getRepScoreWeight(
        repTeamData.recordDataList, true
      )
    })
  })
  repTeamData.recordDataList.push({
    'round': props.round,
    'phase': phase.value,
    'roomID': props.roomID,
    'questionID': parseInt(selectedQuestion.value),
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
    'questionID': parseInt(selectedQuestion.value),
    'masterID': oppPlayerID,
    'role': 'O',
    'score': PTRules[props.rule].getScore(oppScores),
    'weight': PTRules[props.rule].getOppScoreWeight()
  })
  revTeamData.recordDataList.push({
    'round': props.round,
    'phase': phase.value,
    'roomID': props.roomID,
    'questionID': parseInt(selectedQuestion.value),
    'masterID': revPlayerID,
    'role': 'V',
    'score': PTRules[props.rule].getScore(revScores),
    'weight': PTRules[props.rule].getRevScoreWeight()
  })
  matchState.value = 'NEXT'
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
const onNext = async() => {
  if (matchState.value !== 'NEXT') {
    return
  }
  judgers.forEach(
    element => {
      element[0] = element[1] = element[2] = 0
    }
  )
  memberReport.value = memberOppose.value = memberReview.value = ''
  selectedQuestion.value = '-1'
  matchState.value = 'QUESTION'
  phase.value += 1
  if (phase.value > roomdata.teamDataList.length) {
    /* TODO: 上传数据 */
    ElMessage({
      showClose: true,
      message: '本轮比赛已完成！',
      center: true,
      type: 'success'
    })
    dialogVisible.value = true
  } else {
    // TODO
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
</script>

<template>
  <el-container class="tool-main-container">
    <el-aside class="tool-question-list-wrapper">
      <el-radio-group class="tool-question-list" v-model="selectedQuestion">
        <el-radio
          class="tool-question"
          v-for="[id, question] in Object.entries(roomdata.questionMap)"
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
          <el-input class="showcase-display" :value="(roomdata.questionMap[selectedQuestion] || '').replaceAll('[!Disabled]', '')" placeholder="选题显示在这里！" disabled/>
        </el-tooltip>
        <el-button
          class="showcase-button"
          :type="selectedQuestion === '-1' || matchState === 'QUESTION' ? 'success' : 'primary'"
          :plain="selectedQuestion === '-1' || matchState === 'QUESTION' ? false : true"
          @click="onConfirm"
        >锁定选题</el-button>
        <el-button class="showcase-button" type="danger" @click="onRefuse" plain>拒绝选题</el-button>
      </el-container>
      <el-text class="control-panel-title">答题成员</el-text>
      <el-container class="tool-team-select">
        <el-container class="team-select-row interval-helper">
          <el-text class="control-panel-label">正：</el-text>
          <el-input class="team-select-team" :value="teamReport" placeholder="队伍名称" disabled/>
          <el-select v-model="memberReport" class="team-select-partner" placeholder="选择成员" :disabled="matchState === 'NEXT' ? true : false">
            <el-option
              v-for="[index, member] in membersReport.entries()"
              :key="index"
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
              v-for="[index, member] in membersOppose.entries()"
              :key="index"
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
              v-for="[index, member] in membersReview.entries()"
              :key="index"
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
        <el-container class="scoreboard-col" v-for="i in judgers.length">
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
            phase === ((roomdata.teamDataList || [0]).length)
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
  height: 100%;
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
  padding-right: 20px;
}
.interval-helper {
  margin-bottom: 20px;
}
.scoreboard-number {
  width: 100%;
}
.tool-submit-dock {
  margin-top: 40px;
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
