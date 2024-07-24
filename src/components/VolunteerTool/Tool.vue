<script setup>
import { ref } from 'vue'


const props = defineProps({
  roomdata: Object,
  matchType: String,
  rule: String
})

const selectedQuestion = ref('1')

const teamPositive = ref('team001')
const memberPositive = ref('1号选手')
const teamNegative = ref('team002')
const memberNegative = ref('1号选手')
const teamReview = ref('team0003')
const memberReview = ref('1号选手')
const teamSpecator = ref('team004')

const judgers = ref([[0, 0, 0]])
</script>

<template>
  <el-container class="tool-main-container">
    <el-aside class="tool-question-list-wrapper">
      <el-radio-group class="tool-question-list" v-model="selectedQuestion">
        <el-radio class="tool-question" v-for="[id, question] in Object.entries(roomdata.questionMap)" :value="id" :disabled="question.startsWith('[!Disabled]')">
          {{ (id < 10 ? ' 0' : ' ') + id + ' ' + question }}
        </el-radio>
      </el-radio-group>
    </el-aside>
    <el-main class="tool-control-panel">
      <el-container class="tool-quesition-showcase interval-helper">
        <el-text class="control-panel-title">选题：</el-text>
        <el-input class="showcase-display" :value="roomdata.questionMap[selectedQuestion]" placeholder="选题显示在这里！" disabled/>
        <el-button class="showcase-button" type="primary" plain>锁定选题</el-button>
        <el-button class="showcase-button" type="primary" plain>拒绝选题</el-button>
      </el-container>
      <el-container class="tool-team-select">
        <el-container class="team-select-row interval-helper">
          <el-text class="control-panel-title">正：</el-text>
          <el-input class="team-select-team" placeholder="队伍名称" disabled/>
          <el-select class="team-select-partner" placeholder="选择成员"></el-select>
        </el-container>
        <el-container class="team-select-row interval-helper">
          <el-text class="control-panel-title">反：</el-text>
          <el-input class="team-select-team" placeholder="队伍名称" disabled/>
          <el-select class="team-select-partner" placeholder="选择成员"></el-select>
        </el-container>
        <el-container class="team-select-row interval-helper">
          <el-text class="control-panel-title">评：</el-text>
          <el-input class="team-select-team" placeholder="队伍名称" disabled/>
          <el-select class="team-select-partner" placeholder="选择成员"></el-select>
        </el-container>
        <el-container class="team-select-row interval-helper">
          <el-text class="control-panel-title">观：</el-text>
          <el-input class="team-select-team" placeholder="队伍名称" disabled/>
        </el-container>
      </el-container>
      <el-container class="tool-scoreboard">
        <el-container class="scoreboard-col" style="flex: none; width: 80px; padding: 0">
          <el-text class="control-panel-title interval-helper" style="line-height: 38px;">正：</el-text>
          <el-text class="control-panel-title interval-helper" style="line-height: 38px;">反：</el-text>
          <el-text class="control-panel-title interval-helper" style="line-height: 38px;">评：</el-text>
        </el-container>
        <el-container class="scoreboard-col" v-for="i in judgers.length">
          <el-input-number class="scoreboard-number interval-helper" :min="0" :max="10" v-model="judgers[i-1][0]"/>
          <el-input-number class="scoreboard-number interval-helper" :min="0" :max="10" v-model="judgers[i-1][1]"/>
          <el-input-number class="scoreboard-number interval-helper" :min="0" :max="10" v-model="judgers[i-1][2]"/>
        </el-container>
        <el-container class="scoreboard-col" style="flex: none; width: 80px;">
          <el-button type="primary" class="scoreboard-button" @click="judgers.push([0, 0, 0])" plain>
            添加评委
          </el-button>
          <el-button type="danger" class="scoreboard-button" @click="judgers.pop()" plain>
            减少评委
          </el-button>
        </el-container>
      </el-container>
      <el-container class="tool-submit-dock">
        <el-button type="primary">暂存本场结果</el-button>
        <el-button type="primary">下一场</el-button>
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
}
.tool-quesition-showcase {
  margin-top: 10px;
  flex: none;
}
.control-panel-title {
  width: 80px;
  cursor: default;
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
  margin-top: 20px;
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
  margin-top: 20px;
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
  margin-top: 20px;
  flex: none;
}
.scoreboard-button {
  width: 80px;
  margin: 20px 0;
}
</style>
