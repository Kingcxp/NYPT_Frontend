<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="router-wrapper">
    <RouterView />
  </div>
</template>

<style scoped>
.router-wrapper {
  background-image: url(./src/components/icons/bg1.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  animation: frames 24s ease-out 6s infinite;
}
@keyframes frames {
  0% {
    background-image: url(./src/components/icons/bg1.jpg);
  }
  8% {
    background-image: url(./src/components/icons/bg2.jpg);
  }
  33% {
    background-image: url(./src/components/icons/bg2.jpg);
  }
  41% {
    background-image: url(./src/components/icons/bg3.jpg);
  }
  66% {
    background-image: url(./src/components/icons/bg3.jpg);
  }
  75% {
    background-image: url(./src/components/icons/bg1.jpg);
  }
  100% {
    background-image: url(./src/components/icons/bg1.jpg);
  }
}
</style>
