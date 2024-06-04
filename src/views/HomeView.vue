<script setup>
import { ref, watch, getCurrentInstance } from 'vue'

import NavBar from '@/components/NavBar.vue'
import FootBar from '@/components/FootBar.vue'


let timeout = 2000
const { proxy } = getCurrentInstance()
const noticeTotal = ref(1)
const notices = ref([''])
const loading = ref(true)
let noticeAutoFetcher = undefined

const loadPage = async () => {
  await proxy.$http.get(`/notice/total`).then((response) => {
    noticeTotal.value = parseInt(response.data);
    loading.value = false
  }).catch((_error) => {
    noticeAutoFetcher = setInterval(async () => {
      await proxy.$http.get(`/notice/total`).then((resp) => {
        noticeTotal.value = parseInt(resp.data)
        loading.value = true
        clearInterval(noticeAutoFetcher)
      })
    }, timeout)
  })
}

watch(loading, async (value) => {
  if (!value) {
    for (let page = 1; page <= noticeTotal.value; ++page) {
      await proxy.$http.get(`notice/${page}`).then((response) => {
        notices.value[page - 1] = response.data
      })
    }
  }
})

loadPage()
</script>

<template>
  <el-container class="home-container">
    <NavBar />
    <el-main class="home-main">
      <!-- 公告数大于 1 时开启动态模糊效果 -->
      <el-carousel class="home-carousel" trigger="click" v-if="noticeTotal > 1" motion-blur>
        <el-carousel-item class="home-carousel-item" v-for="noticeID in noticeTotal" :innerHTML="notices[noticeID - 1]" v-loading="loading">
        </el-carousel-item>
      </el-carousel>
      <el-carousel class="home-carousel" trigger="click" v-else>
        <el-carousel-item class="home-carousel-item" v-for="noticeID in noticeTotal" :innerHTML="notices[noticeID - 1]" v-loading="loading">
        </el-carousel-item>
      </el-carousel>
    </el-main>
    <FootBar />
  </el-container>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
}
.home-main {
  display: flex;
  height: calc(100vh - 140px);
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.home-carousel {
  max-height: 64vh;
  max-width: 128vh;
  height: 46vw;
  width: 92vw;
}
.home-carousel-item {
  height: 46vw;
  max-height: 64vh;
  width: 92vw;
  max-width: 128vh;
  background-color: rgb(87, 167, 234);
}
</style>
