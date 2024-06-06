<script setup>
import { ref } from 'vue'

import NavBar from '@/components/NavBar.vue'
import FootBar from '@/components/FootBar.vue'


const active = ref(1)
</script>

<template>
  <el-container class="teamcenter-container">
    <NavBar />
    <el-container class="teamcenter-main-container">
      <el-aside class="teamcenter-aside">
        <el-menu default-active="1" :active="active" style="width: 15vw;">
          <el-container class="teamcenter-menu-title-container">
            <label class="teamcenter-menu-title">功能列表</label>
          </el-container>
          <el-menu-item class="teamcenter-menu-item" index="1" @click="active = 1">
            <el-icon><UserFilled /></el-icon>
            <span class="teamcenter-menu-text">队伍信息</span>
          </el-menu-item>
          <el-menu-item class="teamcenter-menu-item" index="2" @click="active = 2">
            <el-icon><Checked /></el-icon>
            <span class="teamcenter-menu-text">比赛汇总</span>
          </el-menu-item>
          <el-menu-item class="teamcenter-menu-item" index="3" @click="active = 3">
            <el-icon><StarFilled /></el-icon>
            <span class="teamcenter-menu-text">分数汇总</span>
          </el-menu-item>
          <el-menu-item class="teamcenter-menu-item" index="4" @click="active = 4">
            <el-icon><Opportunity /></el-icon>
            <span class="teamcenter-menu-text">奖项信息</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="teamcenter-main">

      </el-main>
    </el-container>
    <FootBar />
  </el-container>
</template>

<style scoped>
.teamcenter-container {
  display: flex;
  flex-direction: column;
}
.teamcenter-main-container {
  display: flex;
  background-color: #181818;
}
.teamcenter-aside {
  display: flex;
  height: calc(100vh - 140px);
  width: 15vw;
}
.teamcenter-main {
  display: flex;
  height: calc(100vh - 140px);
  width: 85vw;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.teamcenter-menu-title-container {
  display: flex;
  justify-content: center;
  padding: 2.5vh 0;
}
.teamcenter-menu-title {
  margin-right: 3vw;
  color: white;
  font-size: x-large;
  text-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
}
.teamcenter-menu-item {
  justify-content: center;
}
.teamcenter-menu-text {
  margin-right: 1.5vw;
  text-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
  font-size: large;
}
</style>
