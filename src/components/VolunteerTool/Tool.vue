<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'


const props = defineProps({
  roomdata: Object,
  matchType: String,
  rule: String
})

const selectedQuestion = ref('-1')
const phase = ref(1)

const teamPositive = ref('team001')
const memberPositive = ref('')
const teamNegative = ref('team002')
const memberNegative = ref('')
const teamReview = ref('team003')
const memberReview = ref('')
const teamSpecator = ref('team004')

const judgers = ref([[0, 0, 0]])

const matchState = ref('QUESTION')

const onRefuse = () => {
  if (props.matchType !== 'NORMAL' || matchState.value !== 'QUESTION') {
    return
  }
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
  // TODO
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
const onNext = () => {
  if (matchState.value !== 'NEXT') {
    return
  }
  // TODO
  selectedQuestion.value = '-1'
  matchState.value = 'QUESTION'
  phase.value += 1
  if (phase.value > roomdata.teamDataList.length) {
    // TODO
    ElMessage({
      showClose: true,
      message: '本轮比赛已完成！',
      center: true,
      type: 'success'
    })
  } else {
    ElMessage({
      showClose: true,
      message: '下一场开始！',
      center: true,
      type: 'success'
    })
  }
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
          {{ (id < 10 ? ' 0' : ' ') + id + ' ' + question.replace('[!Disabled]', '') }}
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
          <el-input class="showcase-display" :value="(roomdata.questionMap[selectedQuestion] || '').replace('[!Disabled]', '')" placeholder="选题显示在这里！" disabled/>
        </el-tooltip>
        <el-button
          class="showcase-button"
          :type="matchState === 'QUESTION' ? 'success' : 'primary'"
          :plain="matchState === 'QUESTION' ? false : true"
          @click="onConfirm"
        >锁定选题</el-button>
        <el-button class="showcase-button" type="danger" @click="onRefuse" plain>拒绝选题</el-button>
      </el-container>
      <el-text class="control-panel-title">答题成员</el-text>
      <el-container class="tool-team-select">
        <el-container class="team-select-row interval-helper">
          <el-text class="control-panel-label">正：</el-text>
          <el-input class="team-select-team" :value="teamPositive" placeholder="队伍名称" disabled/>
          <el-select class="team-select-partner" placeholder="选择成员" :disabled="matchState === 'NEXT' ? true : false">

          </el-select>
        </el-container>
        <el-container class="team-select-row interval-helper">
          <el-text class="control-panel-label">反：</el-text>
          <el-input class="team-select-team" :value="teamNegative" placeholder="队伍名称" disabled/>
          <el-select class="team-select-partner" placeholder="选择成员" :disabled="matchState === 'NEXT' ? true : false">

          </el-select>
        </el-container>
        <el-container class="team-select-row interval-helper">
          <el-text class="control-panel-label">评：</el-text>
          <el-input class="team-select-team" :value="teamReview" placeholder="队伍名称" disabled/>
          <el-select class="team-select-partner" placeholder="选择成员" :disabled="matchState === 'NEXT' ? true : false">

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
</style>
