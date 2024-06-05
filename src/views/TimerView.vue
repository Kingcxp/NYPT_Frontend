<script setup>
import NavBar from '@/components/NavBar.vue'
import FootBar from '@/components/FootBar.vue'
</script>

<template>
  <el-container class="timer-container">
    <NavBar />
    <el-main class="timer-main">
      <iframe src="../../public/Timer/Timer.html" frameborder="0" style="height: 100%; width: 100%;"></iframe>
    </el-main>
    <FootBar />
  </el-container>
</template>

<style scoped>
.timer-container {
  display: flex;
  flex-direction: column;
}
.timer-main {
  display: flex;
  height: calc(100vh - 140px);
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0;
}
</style>
