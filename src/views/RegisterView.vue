<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import Base64 from '@/utils/Base64'
import { sha256 } from 'js-sha256'
import { ElMessage } from 'element-plus'

import NavBar from '@/components/NavBar.vue'


const base = new Base64()
const { proxy } = getCurrentInstance()

const formRef = ref(null)
const form = reactive({
  name: '',
  passwd: ''
})
const rules = {
  name: [{required: true, message: '未输入用户名！', trigger: 'blur'}],
  passwd: [{required: true, message: '未输入密码！', trigger: 'blur'}]
}

const onRegister = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      let salt = Math.random().toString(36).slice(-4)
      await proxy.$http.post(`/auth/register`, {
        "name": form.name.toString(),
        "token": sha256(String(base.encode(form.passwd.toString())) + salt),
        "salt": salt
      }).then(async () => {
        ElMessage({
          showClose: true,
          message: '登录成功！',
          center: true,
          type: 'success'
        })
      }).catch((error) => {
        ElMessage({
          showClose: true,
          message: error.response === undefined ? "网络错误！" : error.response.data.msg,
          center: true,
          type: 'error'
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
    <el-container class="register-container">
    <NavBar />
    <el-main class="register-main">
      <el-container class="register-form-container">
        <el-form class="register-form" ref="formRef" :model="form" :rules="rules" label-position="left" label-width="80px">
          <el-container style="width: 100%; margin-bottom: 4vh;">
            <el-text class="register-form-title">注册</el-text>
          </el-container>
          <el-form-item class="register-form-item" label="用户名" prop="name" @keyup.enter="onRegister(formRef)">
            <el-input v-model="form.name" placeholder="请输入用户名"/>
          </el-form-item>
          <el-form-item class="register-form-item" label="密码" prop="passwd">
            <el-input v-model="form.passwd" placeholder="请输入密码" type="password" @keyup.enter="onRegister(formRef)"/>
          </el-form-item>
          <el-button type="primary" style="width: 100%" @click="onRegister(formRef)">注册</el-button>
          <el-container style="width: 100%; margin-top: 2vh;">
            <label style="margin: auto;">
              已有账号？
              <a href="/login" style="text-decoration: none; color: #409eff;">登录</a>
            </label>
          </el-container>
        </el-form>
      </el-container>
    </el-main>
  </el-container>
</template>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
}
.register-main {
  display: flex;
  height: calc(100vh - 60px);
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.register-form-container {
  width: 32vw;
  height: 75vh;
  border: 1px solid #409eff;
  border-radius: 8px;
  box-shadow: 2px 2px 12px #409eff;
  margin: 0;
  flex: none;
}
.register-form {
  width: 100%;
  margin: auto 6vw;
}
.register-form-title {
  font-size: xx-large;
  color: white;
  margin: auto;
}
.register-form-item {
  margin-bottom: 4vh !important;
}
</style>

<style>
.el-form-item__label {
  font-size: larger;
  color: white;
}
</style>
