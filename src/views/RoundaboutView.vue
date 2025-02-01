<script setup>
import { ref, getCurrentInstance } from 'vue'

import NavBar from '@/components/NavBar.vue'
import FootBar from '@/components/FootBar.vue'
import { ElMessage } from 'element-plus'


const { proxy } = getCurrentInstance()

const messageWhenCatch = (error) => {
  ElMessage({
    showClose: true,
    message: error.response === undefined ? '网络错误！' : error.response.data.msg,
    center: true,
    type: error.response === undefined ? 'warning' : 'error'
  })
}

const totalTeams = ref(0)
const numberPool = ref([])
const results = ref([])
const currentTeamIndex = ref(0)
const teamnames = ref(["NULL"])
const currentRotation = ref(0)
const isSpinning = ref(false)
const targetNumber = ref(0)
let ctx = null

const setButtonEnabled = (enabled) => {
  const button = document.getElementsByClassName('drawButton')[0]
  button.disabled = !enabled;
}

const initializeWheel = () => {
  const canvas = document.getElementsByClassName('wheel')[0]
  ctx = canvas.getContext('2d')
  drawWheel()
}

const drawWheel = (rotation = 0) => {
  if (ctx === null) {
    return
  }
  ctx.clearRect(0, 0, 700, 700)
  if (numberPool.value.length === 0) {
    return
  }

  const centerX = 350
  const centerY = 350
  const radius = 320
  const sliceAngle = 360 / numberPool.value.length
  const startOffset = -90

  numberPool.value.forEach((num, i) => {
    const startAngle = startOffset + rotation + i * sliceAngle
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius,
            startAngle * Math.PI/180,
            (startAngle + sliceAngle) * Math.PI/180)
    ctx.closePath()
    ctx.fillStyle = `hsl(${(i * 360 / numberPool.value.length) % 360}, 70%, 65%)`
    ctx.fill()

    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate((startAngle + sliceAngle/2) * Math.PI/180)
    ctx.textAlign = 'center'
    ctx.fillStyle = '#2c3e50'
    ctx.font = '24px Arial'
    ctx.fillText(num, radius/2 + 20, 10)
    ctx.restore()
  })

  ctx.beginPath()
  ctx.arc(centerX, centerY, 25, 0, Math.PI * 2)
  ctx.fillStyle = 'white'
  ctx.fill()
}

const initializeSystem = async () => {
  await proxy.$http.get(`/assist/manage/lottery/teamnames`).then((response) => {
    teamnames.value = response.data.data
    console.log(teamnames.value)
  }).catch(messageWhenCatch)
  await proxy.$http.get(`/assist/manage/teams/number`).then((response) => {
    totalTeams.value = response.data.count
  }).catch(messageWhenCatch)

  if (totalTeams.value < 2) {
    ElMessage({
      showClose: true,
      message: '至少需要 2 支队伍！',
      center: true,
      type: 'error',
    })
  }

  numberPool.value = Array.from({ length: totalTeams.value }, (_, i) => i + 1)
  results.value = []
  currentTeamIndex.value = 0

  document.getElementsByClassName('exportButton')[0].style.display = 'none'
  document.getElementsByClassName('drawButton')[0].style.display = 'block'

  setButtonEnabled(true)
  initializeWheel()
}

const calculateResult = (rotation) => {
  if (numberPool.value.length === 0) return null
  const normalizedRotation = ((rotation % 360) + 360) % 360
  const finalAngle = 360 - normalizedRotation
  const selectedIndex = Math.floor(Math.floor(finalAngle / (360 / numberPool.value.length)) % numberPool.value.length)
  return numberPool.value[selectedIndex]
}

const startSpin = () => {
  if (isSpinning.value || numberPool.value.length === 0) {
    return
  }

  targetNumber.value = numberPool.value[Math.floor(Math.random() * numberPool.value.length)]
  const targetIndex = numberPool.value.indexOf(targetNumber.value)
  const sliceAngle = 360 / numberPool.value.length
  const targetOffset = sliceAngle * 0.15
  const baseRotation = 1440

  const targetPosition = targetIndex * sliceAngle + sliceAngle / 2
  const randomAddition = Math.random() * targetOffset - targetOffset / 2
  const targetRotation = currentRotation.value + baseRotation + targetPosition + randomAddition

  startAnimation(targetRotation)
}

const startAnimation = (targetRotation) => {
  isSpinning.value = true
  setButtonEnabled(false)

  const startTime = Date.now()
  // const duration = 1
  const duration = Math.random() * 2000 + 2000

  const animate = () => {
    const elapsed = Date.now() - startTime
    if (elapsed >= duration) {
      currentRotation.value = targetRotation % 360
      drawWheel(currentRotation.value)
      isSpinning.value = false
      setButtonEnabled(true)

      targetNumber.value = calculateResult(currentRotation.value)
      completeSpin()
      return
    }
    const progress = elapsed / duration
    const easedProgress = 1 - Math.pow(1 - progress, 4)
    const rotation = currentRotation.value + easedProgress * (targetRotation - currentRotation.value)
    drawWheel(rotation)
    requestAnimationFrame(animate)
  }
  requestAnimationFrame(animate)
}

const completeSpin = () => {
  numberPool.value = numberPool.value.filter(num => num !== targetNumber.value)
  results.value.unshift({
    team: teamnames.value[currentTeamIndex.value],
    number: targetNumber.value
  })
  drawWheel()
  currentTeamIndex.value += 1
  if (currentTeamIndex.value >= totalTeams.value) {
    document.getElementsByClassName('drawButton')[0].style.display = 'none'
    document.getElementsByClassName('exportButton')[0].style.display = 'inline-block'
  }
}

const exportResults = async () => {
  document.getElementsByClassName('exportButton')[0].disabled = true
  let succeeded = true
  await proxy.$http.get(`/assist/manage/lottery/clear`).catch(messageWhenCatch)
  for (let i = 0; i < results.value.length; i++) {
    await proxy.$http.post(`/assist/manage/lottery/bind`, {
      team_name: results.value[i].team,
      lottery_id: results.value[i].number
    }).catch(() => {
      succeeded = false
    })
  }
  if (succeeded) {
    ElMessage({
      showClose: true,
      message: '保存成功！',
      center: true,
      type: 'success'
    })
  } else {
    ElMessage({
      showClose: true,
      message: '保存失败！',
      center: true,
      type: 'error'
    })
  }
  document.getElementsByClassName('exportButton')[0].disabled = false
}
</script>

<template>
  <NavBar />
  <div class="container">
    <h1>😋 抽抽你的 😋</h1>
    <div class="control-panel">
      <button @click="initializeSystem()">初始化系统</button>
      <span class="currentTeam">当前抽签队伍: {{ teamnames[currentTeamIndex] }}</span>
      <button @click="exportResults()" class="exportButton" style="display: none;">好！把它们上传！</button>
    </div>
    <div class="main-content">
      <div class="wheel-container">
        <canvas class="wheel" width="700" height="700"></canvas>
        <div class="pointer"></div>
        <button class="drawButton spin-button" @click="startSpin()">开始抽签</button>
      </div>
      <div class="info-panel">
        <div class="pool-box">
          <h3 style="color: white;">剩余号码池 (<span class="remainingCount">{{ numberPool.length }}</span>)</h3>
          <div class="poolNumbers">
            <div class="number-bubble" v-for="number in numberPool" :key="number">{{ number }}</div>
          </div>
        </div>
        <div class="results-box">
          <h3 style="color: white;">抽签结果</h3>
          <ul class="resultsList">
            <li v-for="result in results" :key="result.team">
              队伍 {{ result.team }} ➔ 抽中号码 {{ result.number }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <FootBar />
</template>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  margin-bottom: 64px;
  padding: 30px;
  border-radius: 15px;
}
h1 {
  color: #ffffff;
  text-align: center;
  margin-bottom: 40px;
  font-size: 2.8rem;
  letter-spacing: 2px;
}
.control-panel {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  justify-content: center;
  align-items: center;
  width: 100%;
}
input[type="number"] {
  padding: 12px;
  border: 2px solid #3498db;
  border-radius: 5px;
  width: 180px;
  font-size: 1.2rem;
}
button {
  padding: 14px 32px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1.1rem;
}
.control-panel button:first-of-type {
  font-size: 1.2rem;
  padding: 16px 36px;
}
button:hover {
  background: #2980b9;
  transform: scale(1.05);
}
button:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}
.currentTeam {
  font-size: 1.3rem;
  font-weight: 600;
  color: #e74c3c;
  margin-left: 20px;
}
.main-content {
  display: flex;
  justify-content: center;
  gap: 50px;
  width: 100%;
}
.wheel-container {
  position: relative;
  width: 700px;
  height: 700px;
  margin: 20px 0;
}
.wheel {
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease-out;
}
.pointer {
  position: absolute;
  top: -25px;
  left: 340px;
  width: 25px;
  height: 70px;
  background: #e74c3c;
  clip-path: polygon(50% 100%, 0% 0%, 100% 0%);
  z-index: 2;
}
.spin-button {
  position: absolute;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  padding: 20px 40px;
  font-size: 20px;
  background: #3498db;
  box-shadow: 0 4px 15px rgba(52,152,219,0.3);
  transition: all 0.3s ease;
}
.spin-button:hover {
  transform: translateX(-50%) scale(1.1);
  box-shadow: 0 6px 20px rgba(52,152,219,0.5);
}
.info-panel {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 350px;
  margin-top: 20px;
}
.pool-box, .results-box {
  background: var(--container-bg);
  padding: 25px;
  border-radius: 15px;
  border: 2px solid #ecf0f1;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
.poolNumbers {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
}
.number-bubble {
  background: #3498db;
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 1.1em;
  transition: transform 0.2s;
}
.number-bubble:hover {
  transform: scale(1.05);
}
.resultsList {
  list-style: none;
  padding: 0;
  max-height: 500px;
  overflow-y: auto;
  margin-top: 15px;
}
.resultsList li {
  padding: 12px;
  margin: 8px 0;
  border-radius: 8px;
  animation: fadeIn 0.5s;
  border: 1px solid #eee;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
