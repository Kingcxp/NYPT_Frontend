<script setup>
import { ref, onMounted } from 'vue'
import { Delete, Finished } from '@element-plus/icons-vue'

/*
{
  room_id: string,
  round_id: string,
  time_info: string,
}
should be sorted.
*/
const scoringData = ref([])

onMounted(async () => {

})
</script>

<template>
  <label class="admin-scoring-title">全部房间计分信息</label>
  <el-container class="admin-scoring-table-container">
    <el-table class="admin-scoring-table" :data="scoringData" stripe border>
      <el-table-column fixed prop="room_id" label="房间号" width="120px"></el-table-column>
      <el-table-column prop="round_id" label="轮次号" width="120px"></el-table-column>
      <el-table-column prop="time_info" label="上传时间" width="280px"></el-table-column>
      <el-table-column fixed="right" label="丢弃" width="72px">
        <template #default="scope">
          <el-button style="height: 25px; width: 25px;" type="danger" :icon="Delete" circle @click="removeFile(scope.$index)" />
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="合并" width="72px">
        <template #default="scope">
          <el-button style="height: 25px; width: 25px;" type="danger" :icon="Finished" circle @click="mergeFile(scope.$index)" />
        </template>
      </el-table-column>
    </el-table>
  </el-container>
</template>

<style scoped>
.admin-scoring-title {
  color: white;
  font-size: xx-large;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
  margin-top: 3vh;
  margin-bottom: 2vh;
  text-align: center;
}
.admin-scoring-table-container {
  display: flex;
  flex-direction: column;
  flex: none;
  height: auto;
  width: auto;
}
.admin-scoring-table {
  width: fit-content;
  max-width: 70vw;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}
</style>
