<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import JSConfetti from 'js-confetti'


const { proxy } = getCurrentInstance()

const confetti = new JSConfetti()
const imageSource = ref('')

const showConfetti = () => {
  confetti.addConfetti({
    emojis: [
      '🥳', '🪅', '🍾', '🎊', '🎆', '🎇', '🎉',
      '🌈', '💥', '✨', '💫', '🌸'
    ],
    emojiSize: 48,
    confettiNumber: 200
  })
}

onMounted(async () => {
  showConfetti()
  await proxy.$http.get(`/auth/userdata/award`).then((response) => {
    imageSource.value = response.data.award
  }).catch((error) => {
    ElMessage({
      showClose: true,
      message: error.response ? error.response.data.msg : '网络错误！',
      center: true,
      type: error.response ? 'error' : 'warning'
    })
  })
})
</script>

<template>
  <h2 class="award-title" @click="showConfetti">🎉 恭喜！</h2>
  <img class="award-image" :src="imageSource" alt="award" v-if="imageSource !== ''" />
  <p class="award-text" v-else>啊喔！奖状走丢啦！😅</p>
</template>

<style scoped>
.award-title {
  color: #fff;
  cursor: pointer;
  text-align: center;
  margin-bottom: 32px;
}
.award-image {
  max-height: 65vh;
  width: auto;
}
.award-text {
  font-size: xx-large;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}
</style>
