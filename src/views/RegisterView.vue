<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import Base64 from '@/utils/Base64'
import { sha256 } from 'js-sha256'
import { ElMessage } from 'element-plus'

import NavBar from '@/components/NavBar.vue'
import FootBar from '@/components/FootBar.vue'


const isEmail = (aEmail) => {
  let bValidate = RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(aEmail);
  if (bValidate) {
    return true;
  }
  else {
    return false;
  }
}
const isTel = (aTel) => {
  var bValidate = RegExp(/^1[3-9]\d{9}$|^0\d{2,3}-\d{7,8}$/).test(aTel);
  if (bValidate) {
    return true;
  }
  else {
    return false;
  }
}

const base = new Base64()
const { proxy } = getCurrentInstance()

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

const rules = {
  name: [{required: true, message: '未输入' + (form.identity == 'Team' ? '队伍名' : '姓名') + '！', trigger: 'blur'}],
  school: [{required: true, message: '未输入学校！', trigger: 'blur'}],
  email: [{required: true, message: '未输入邮箱！', trigger: 'blur'}],
  tel: [{required: true, message: '未输入电话号码！', trigger: 'blur'}],
  captcha: [{required: true, message: '未输入验证码！', trigger: 'blur'}]
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
          <el-container class="register-form-div">
            <img src="../components/icons/phy-title.png" style="width: 100%; height: auto; filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.32)) brightness(135%);" />
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
            <el-input v-model="form.captcha" placeholder="四位验证码" />
          </el-form-item>
          <el-form-item class="register-form-item" label="联系人" prop="contact" @keyup.enter="onRegister(formRef)" v-if="form.identity == 'Team'">
            <el-input v-model="form.contact" placeholder="请输入联系人姓名" />
          </el-form-item>
          <el-button type="primary" style="width: 100%; margin-top: 1.5vh;" @click="onRegister(formRef)">注册</el-button>
          <el-container style="width: 100%; margin-top: 2vh;">
            <label style="margin: auto;">
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
  margin-bottom: 2vh;
}
.register-form-item {
  margin-bottom: 2vh !important;
}
</style>

<style>
.el-form-item__label {
  font-size: larger;
  color: white;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}
.el-input {
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}
.el-radio-button {
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
  margin-right: 2px;
}
</style>
