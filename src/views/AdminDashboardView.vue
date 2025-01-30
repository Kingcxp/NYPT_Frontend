<script setup>
import { ref } from 'vue'

import NavBar from '@/components/NavBar.vue'
import FootBar from '@/components/FootBar.vue'
import Auth from '@/components/AdminDashboard/Auth.vue'
import PTAssist from '@/components/AdminDashboard/PTAssist.vue'
import RoomManager from '@/components/AdminDashboard/RoomManager.vue'
import Scoring from '@/components/AdminDashboard/Scoring.vue'
import ScoreInfo from '@/components/AdminDashboard/ScoreInfo.vue'


const active = ref(1)
</script>

<template>
  <el-container class="admin-container">
    <NavBar />
    <el-container class="admin-main-container">
      <el-aside class="admin-aside">
        <el-menu :default-active="String(active)" :active="active" style="width: 15vw;">
          <el-container class="admin-menu-title-container">
            <label class="admin-menu-title">功能列表</label>
          </el-container>
          <el-menu-item class="admin-menu-item" index="1" @click="active = 1">
            <el-icon><UserFilled /></el-icon>
            <span class="admin-menu-text">账号管理</span>
          </el-menu-item>
          <el-menu-item class="admin-menu-item" index="2" @click="active = 2">
            <el-icon><Management /></el-icon>
            <span class="admin-menu-text">配置管理</span>
          </el-menu-item>
          <el-menu-item class="admin-menu-item" index="3" @click="active = 3">
            <el-icon><Edit /></el-icon>
            <span class="admin-menu-text">比赛管理</span>
          </el-menu-item>
          <el-menu-item class="admin-menu-item" index="4" @click="active = 4">
            <el-icon><MessageBox /></el-icon>
            <span class="admin-menu-text">计分管理</span>
          </el-menu-item>
          <el-menu-item class="admin-menu-item" index="5" @click="active = 5">
            <el-icon><StarFilled /></el-icon>
            <span class="admin-menu-text">分数汇总</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="admin-main">
        <el-container class="admin-content-container" v-if="active === 1">
          <Auth />
        </el-container>
        <el-container class="admin-content-container" v-else-if="active === 2">
          <PTAssist />
        </el-container>
        <el-container class="admin-content-container" v-else-if="active === 3">
          <RoomManager />
        </el-container>
        <el-container class="admin-content-container" v-else-if="active === 4">
          <Scoring />
        </el-container>
        <el-container class="admin-content-container" v-else-if="active === 5">
          <ScoreInfo />
        </el-container>
      </el-main>
    </el-container>
    <FootBar />
  </el-container>
</template>

<style scoped>
.admin-container {
  display: flex;
  flex-direction: column;
  background-color: #181818;
}
.admin-main-container {
  display: flex;
  flex-direction: row;
}
.admin-aside {
  display: flex;
  height: calc(100vh - 140px);
  width: 15vw;
}
.admin-content-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
}
.admin-main {
  display: flex;
  height: calc(100vh - 140px);
  width: 85vw;
  align-items: center;
  flex-direction: column;
  padding: 0;
  overflow: scroll;
}
.admin-menu-title-container {
  display: flex;
  justify-content: center;
  padding: 20px 0;
  padding-top: 5vh;
}
.admin-menu-title {
  margin-right: 3vw;
  color: white;
  font-size: x-large;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
}
.admin-menu-item {
  justify-content: center;
}
.admin-menu-text {
  margin-right: 1.5vw;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
  font-size: large;
}
</style>
