<script setup>
import NavBar from '@/components/NavBar.vue'
import FootBar from '@/components/FootBar.vue'
</script>

<template>
  <el-container class="volunteer-container">
    <NavBar />
    <el-container class="volunteer-main-container">
      <!-- TODO -->
    </el-container>
    <FootBar />
  </el-container>
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
</style>
