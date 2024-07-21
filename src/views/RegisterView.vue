<script setup>
import { ref, reactive, watch, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'

import NavBar from '@/components/NavBar.vue'
import FootBar from '@/components/FootBar.vue'


const { proxy } = getCurrentInstance()

const isCoolingDown = ref(false)
const cooldownTimer = ref(0)
const isCaptchaDeprecated = ref(true)
let timerRunner = undefined

const formRef = ref(null)
const form = reactive({
  name: '',
  school: '',
  email: '',
  tel: '',
  identity: 'Team',
  captcha: '',
  contact: ''
})

const emailValidator = (_rule, value, callback) => {
  if (value === '') {
    callback(new Error('未输入邮箱！'))
  } else {
    let isEmail = RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(value)
    if (!isEmail) {
      callback(new Error('请输入正确的邮箱！'))
    } else {
      callback()
    }
  }
}
const telValidator = (_rule, value, callback) => {
  if (value === '') {
    callback(new Error('未输入电话号码！'))
  } else {
    let isTel = RegExp(/^1[3-9]\d{9}$|^0\d{2,3}-\d{7,8}$/).test(value)
    if (!isTel) {
      callback(new Error('请输入正确的电话号码！'))
    } else {
      callback()
    }
  }
}
const captchaValidator = (_rule, value, callback) => {
  if (value === '') {
    callback(new Error('未输入验证码！'))
  } else {
    let isCaptcha = RegExp(/^\d{6}$/).test(value)
    if (!isCaptcha) {
      callback(new Error('请输入正确的验证码！'))
    } else {
      callback()
    }
  }
}

const rules = {
  name: [{required: true, message: '未输入' + (form.identity == 'Team' ? '队伍名' : '姓名') + '！', trigger: 'blur'}],
  school: [{required: true, message: '未输入学校！', trigger: 'blur'}],
  identity: [{required: true, message: '未确定身份！', trigger: 'blur'}],
  email: [{required: true, validator: emailValidator, trigger: 'blur'}],
  tel: [{required: true, validator: telValidator, trigger: 'blur'}],
  captcha: [{required: true, validator: captchaValidator, trigger: 'blur'}]
}

const onRegister = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      if (form.identity !== 'Team') {
        form.contact = ''
      }
      await proxy.$http.post(`/auth/register`, {
        'school': form.school,
        'name': form.name,
        'email': form.email,
        'tel': form.tel,
        'identity': form.identity,
        'captcha': form.captcha,
        'contact': form.contact
      }).then((_response) => {
        ElMessage({
          showClose: true,
          message: '注册请求成功，管理员通过后会使用邮件告知！',
          center: true,
          type: 'success'
        })
      }).catch((error) => {
        ElMessage({
          showClose: true,
          message: error.response === undefined ? '网络错误！' : error.response.data.msg,
          center: true,
          type: error.response === undefined ? 'warning' : 'error'
        })
        if (error.response === undefined) {
          return
        }
        if (error.response.data.msg === '邮箱和验证邮箱不相符！' ||
            error.response.data.msg === '该邮箱已经被注册过！') {
          form.email = ''
        }
        form.captcha = ''
      })
    }
  })
}
const onSend = async (address) => {
  let isEmail = RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(address)
  if (isCoolingDown.value) {
    return
  }
  if (!isEmail) {
    ElMessage({
      showClose: true,
      message: '请使用合法的邮箱地址进行验证！',
      center: true,
      type: 'warning'
    })
    return
  }
  cooldownTimer.value = 30
  isCoolingDown.value = true
  isCaptchaDeprecated.value = false
  timerRunner = setInterval(() => {
    cooldownTimer.value -= 1
    if (cooldownTimer.value <= 0) {
      cooldownTimer.value = 0
      isCoolingDown.value = false
      if (!timerRunner) {
        return
      }
      clearInterval(timerRunner)
    }
  }, 1000)
  await proxy.$http.post(`/auth/verify`, {
    'email': address
  }).then((_response) => {
    ElMessage({
      showClose: true,
      message: '验证码发送成功！请检查您的邮箱并尽快验证！',
      center: true,
      type: 'success'
    })
  }).catch((error) => {
    ElMessage({
      showClose: true,
      message: error.response === undefined ? '网络错误！' : error.response.data.msg,
      center: true,
      type: error.response === undefined ? 'warning' : 'error'
    })
    if (error.response === undefined) {
      cooldownTimer.value = 0
    } else if (error.response.status === 400) {
      cooldownTimer.value = error.response.data.time_left
    }
  })
}

watch(form, async (value, oldValue) => {
  if (value.email !== oldValue.email && !isCaptchaDeprecated.value) {
    await proxy.$http.get(`/auth/deprecate`).then((_response) => {
      ElMessage({
        showClose: true,
        message: '因为邮箱地址改变，旧的验证码已经被弃用！',
        center: true,
        type: 'warning'
      })
      isCaptchaDeprecated.value = true
    }).catch((_error) => {
      ElMessage({
        showClose: true,
        message: '网络错误！',
        center: true,
        type: 'warning'
      })
    })
  }
})
</script>

<template>
    <el-container class="register-container">
    <NavBar />
    <el-main class="register-main">
      <el-container class="register-form-container">
        <el-form class="register-form" ref="formRef" :model="form" :rules="rules" label-position="left" label-width="80px">
          <el-container class="register-form-div">
            <img src="../components/icons/phy-logo.png" style="width: 100%; height: auto; filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.32)) brightness(135%);" />
          </el-container>
          <el-container class="register-form-div">
            <el-text class="register-form-title">注册</el-text>
          </el-container>
          <el-form-item class="register-form-item" :label="form.identity == 'Team' ? '队伍名' : '姓名'" prop="name" @keyup.enter="onRegister(formRef)">
            <el-input v-model="form.name" :placeholder="'请输入' + (form.identity == 'Team' ? '队伍名' : '姓名')" />
          </el-form-item>
          <el-form-item class="register-form-item" label="学校" prop="school" @keyup.enter="onRegister(formRef)">
            <el-input v-model="form.school" placeholder="请输入学校名" />
          </el-form-item>
          <el-form-item class="register-form-item" label="电话" prop="tel" @keyup.enter="onRegister(formRef)">
            <el-input v-model="form.tel" placeholder="请输入电话号码" />
          </el-form-item>
          <el-form-item class="register-form-item" label="身份" prop="identity">
            <el-radio-group v-model="form.identity">
              <el-radio-button value="Team">比赛队伍</el-radio-button>
              <el-radio-button value="VolunteerA">志愿者 A 类</el-radio-button>
              <el-radio-button value="VolunteerB">志愿者 B 类</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="register-form-item" label="邮箱" prop="email" @keyup.enter="onRegister(formRef)">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item class="register-form-item" label="验证码" prop="captcha" @keyup.enter="onRegister(formRef)">
            <el-input v-model="form.captcha" placeholder="六位验证码" style="width: 11vw; margin-right: 5px;" />
            <el-button :disabled="isCoolingDown" @click="onSend(form.email)" style="width: 7.8vw;" :type="isCoolingDown ? 'info' : 'success'" plain>{{ isCoolingDown ? `等待${cooldownTimer}s` : '发送验证码' }}</el-button>
          </el-form-item>
          <el-form-item class="register-form-item" label="联系人" prop="contact" @keyup.enter="onRegister(formRef)" v-if="form.identity == 'Team'">
            <el-input v-model="form.contact" placeholder="请输入联系人姓名" />
          </el-form-item>
          <el-button type="primary" style="width: 100%; margin-top: 1.5vh;" @click="onRegister(formRef)">注册</el-button>
          <el-container style="width: 100%; margin-top: 2vh;">
            <label style="margin: auto; color: rgba(255, 255, 255, 0.8);">
              已有账号？
              <a href="/login" style="text-decoration: none; color: #409eff; text-shadow: 0 0 12px #409eff">登录</a>
            </label>
          </el-container>
        </el-form>
      </el-container>
    </el-main>
    <FootBar />
  </el-container>
</template>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  background-image: url(../components/icons/bg1.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  animation: frames 24s ease-out 6s infinite;
}
@keyframes frames {
  0% {
    background-image: url(../components/icons/bg1.jpg);
  }
  8% {
    background-image: url(../components/icons/bg2.jpg);
  }
  33% {
    background-image: url(../components/icons/bg2.jpg);
  }
  41% {
    background-image: url(../components/icons/bg3.jpg);
  }
  66% {
    background-image: url(../components/icons/bg3.jpg);
  }
  75% {
    background-image: url(../components/icons/bg1.jpg);
  }
  100% {
    background-image: url(../components/icons/bg1.jpg);
  }
}
.register-main {
  display: flex;
  height: calc(100vh - 140px);
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.register-form-container {
  width: 36vw;
  height: 75vh;
  border: 1px solid white;
  border-radius: 8px;
  box-shadow: 2px 2px 12px white;
  margin: 0;
  flex: none;
  background-color: rgba(24, 24, 24, 0.92);
}
.register-form {
  width: 100%;
  margin: auto 6vw;
}
.register-form-title {
  font-size: xx-large;
  color: white;
  margin: auto;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}
.register-form-div {
  width: 100%;
  margin-bottom: 1.2vh;
}
.register-form-item {
  margin-bottom: 1.2vh !important;
}
</style>
