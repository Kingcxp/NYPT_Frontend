<script setup>
import JSConfetti from 'js-confetti'

const confetti = new JSConfetti()

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

showConfetti()
</script>
<template>
  <h2 @click="showConfetti">🎉 Congratulations!</h2>
</template>
<style scoped>
h2 {
  color: #fff;
  cursor: pointer;
}
</style>