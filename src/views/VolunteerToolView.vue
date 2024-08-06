<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'

import NavBar from '@/components/NavBar.vue'
import FootBar from '@/components/FootBar.vue'
import EnterRoom from '@/components/VolunteerTool/EnterRoom.vue'
import Tool from '@/components/VolunteerTool/Tool.vue'


const roomdata = ref({ "questionMap": {} })
const rule = ref('')
const matchType = ref('')
const roomID = ref(1)
const round = ref(1)
const token = ref('')

const dialogVisible = ref(false)
</script>

<template>
  <el-container class="volunteer-container">
    <NavBar />
    <el-container class="volunteer-main-container">
      <EnterRoom
        @roomdata="(data) => { roomdata = data; dialogVisible = true; }"
        @rule="(data) => rule = data"
        @match-type="(data) => matchType = data"
        @room-i-d="(data) => roomID = data"
        @round="(data) => round = data"
        @token="(data) => token = data"
        v-if="rule === ''"
      />
      <el-container v-else>
        <Tool
          :roomdata="roomdata"
          :match-type="matchType"
          :rule="rule"
          :room-i-d="roomID"
          :round="round"
          :token="token"
        />
      </el-container>
    </el-container>
    <FootBar />
  </el-container>

  <el-dialog v-model="dialogVisible" align-center>
    <el-text style="font-size: xx-large;" class="text-error">警告！<br></el-text>
    <el-text>
      <el-text class="text-warn">比赛记录</el-text>在<el-text class="text-success">本地</el-text>运算，在你<el-text class="text-error">最终提交</el-text>之前，你所做的<el-text class="text-warn">所有操作</el-text>都<el-text class="text-error">不会被保存！</el-text><br><el-text class="text-primary">请确保</el-text>你<el-text class="text-success">不会</el-text><el-text class="text-warn">刷新页面</el-text>，<el-text class="text-primary">或保证</el-text>所有<el-text class="text-success">计分过程</el-text>均有<el-text class="text-warn">其它途径</el-text>记录，否则<el-text class="text-error">后果自负！</el-text><br>
    </el-text>
    <template #footer>
      <div>
        <el-button @click="dialogVisible = false" type="primary" style="color: black;">
          好的，我明白了！
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.volunteer-container {
  display: flex;
  flex-direction: column;
  background-color: #181818;
}
.volunteer-main-container {
  display: flex;
  height: calc(100vh - 140px);
  justify-content: center;
  align-items: center;
  flex-direction: column;
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
