<script setup>
import { ref } from 'vue'


const props = defineProps({
  roomdata: Object,
  matchType: String,
  rule: String
})

const selectedQuestion = ref('1')
</script>

<template>
  <el-container class="tool-main-container">
    <el-aside class="tool-question-list-wrapper">
      <el-radio-group class="tool-question-list" v-model="selectedQuestion">
        <el-radio class="tool-question" v-for="[id, question] in Object.entries(roomdata.questionMap)" :value="id" :disabled="question.startsWith('[!Disabled]')">
          {{ question }}
        </el-radio>
      </el-radio-group>
    </el-aside>
    <el-main class="tool-control-panel">
      <!-- TODO -->
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
  padding-top: 2.5vh;
}
.tool-question {
  width: 100%;
  margin: 6px 0;
  height: min-content;
}
</style>
