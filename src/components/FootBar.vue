<template>
  <el-footer class="footer-container">
    <a href="https://www.nju.edu.cn/">
      <img src="./icons/footer-logo.png" class="footer-img" style="filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))" />
    </a>
    <a href="https://physics.nju.edu.cn/">
      <img src="./icons/phy-title.png" class="footer-img" style="filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5)) grayscale(100%) brightness(100)" />
    </a>
    <label class="footer-text">COPYRIGHT © NANJING UNIVERSITY ALL RIGHTS RESERVED</label>
  </el-footer>
</template>

<style scoped>
.footer-container {
  height: 80px;
  width: 100vw;
  background-color: #6f106e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.footer-text {
  font-size: 20px;
  color: white;
  text-shadow: 0 0 12px white;
}
.footer-img {
  height: 45px;
  width: auto;
  margin-right: 36px;
}
</style>
