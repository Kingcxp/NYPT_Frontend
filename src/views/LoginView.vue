<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import Base64 from '@/utils/Base64'
import { sha256 } from 'js-sha256'
import { ElMessage } from 'element-plus'

import NavBar from '@/components/NavBar.vue'
import FootBar from '@/components/FootBar.vue'


const base = new Base64()
const { proxy } = getCurrentInstance()
const router = useRouter()

const formRef = ref(null)
const form = reactive({
  name: '',
  passwd: ''
})
const rules = {
  name: [{required: true, message: '未输入用户名！', trigger: 'blur'}],
  passwd: [{required: true, message: '未输入密码！', trigger: 'blur'}]
}

const onLogin = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      let salt = Math.random().toString(36).slice(-4)
      await proxy.$http.post(`/auth/login`, {
        "name": form.name,
        "token": sha256(String(base.encode(form.passwd)) + salt),
        "salt": salt
      }).then(async (_response) => {
        ElMessage({
          showClose: true,
          message: '登录成功！',
          center: true,
          type: 'success'
        })
        router.push({path: '/'})
      }).catch((error) => {
        ElMessage({
          showClose: true,
          message: error.response === undefined ? "网络错误！" : error.response.data.msg,
          center: true,
          type: error.response === undefined ? 'warning' : 'error'
        })
        if (error.response === undefined) {
          return
        }
        if (error.response.data.msg == '用户名不存在！') {
          form.name = ''
        }
        form.passwd = ''
      })
    }
  })
}
</script>

<template>
  <el-container class="login-container">
    <NavBar />
    <el-main class="login-main">
      <el-container class="login-form-container">
        <el-form class="login-form" ref="formRef" :model="form" :rules="rules" label-position="left" label-width="80px">
          <el-container class="login-form-div">
            <img src="../components/icons/phy-logo.png" style="width: 100%; height: auto; filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.32)) brightness(135%);"/>
          </el-container>
          <el-container class="login-form-div">
            <el-text class="login-form-title">登录</el-text>
          </el-container>
          <el-form-item class="login-form-item" label="用户名" prop="name" @keyup.enter="onLogin(formRef)">
            <el-input v-model="form.name" placeholder="请输入用户名"/>
          </el-form-item>
          <el-form-item class="login-form-item" label="密码" prop="passwd">
            <el-input v-model="form.passwd" placeholder="请输入密码" type="password" @keyup.enter="onLogin(formRef)"/>
          </el-form-item>
          <el-button type="primary" style="width: 100%; margin-top: 1.5vh;" @click="onLogin(formRef)">登录</el-button>
          <el-container style="width: 100%; margin-top: 2vh;">
            <label style="margin: auto; color: rgba(255, 255, 255, 0.8);">
              没有账号？
              <a href="/register" style="text-decoration: none; color: #409eff; text-shadow: 0 0 12px #409eff">注册</a>
            </label>
          </el-container>
        </el-form>
      </el-container>
    </el-main>
    <FootBar />
  </el-container>
</template>

<style scoped>
.login-container {
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
.login-main {
  display: flex;
  height: calc(100vh - 140px);
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.login-form-container {
  width: 36vw;
  height: 75vh;
  border: 1px solid white;
  border-radius: 8px;
  box-shadow: 2px 2px 12px white;
  margin: 0;
  flex: none;
  background-color: rgba(24, 24, 24, 0.92);
}
.login-form {
  width: 100%;
  margin: auto 6vw;
}
.login-form-title {
  font-size: xx-large;
  color: white;
  margin: auto;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}
.login-form-div {
  width: 100%;
  margin-bottom: 4vh;
}
.login-form-item {
  margin-bottom: 4vh !important;
}
</style>

<style>
.el-form-item__label {
  font-size: larger;
  color: white;
}
.el-input {
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.3);
}
.el-radio-button {
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.3);
  margin-right: 2px;
}
</style>
