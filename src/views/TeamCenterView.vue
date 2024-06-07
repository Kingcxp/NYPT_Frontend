<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus';

import NavBar from '@/components/NavBar.vue'
import FootBar from '@/components/FootBar.vue'


const { proxy } = getCurrentInstance()

const active = ref(1)
const dialogVisible = ref(false)
const leaders = ref([])
const members = ref([])
const isLeader = ref(false)
const index = ref(0)
const formRef = ref(null)
const form = reactive({
  name: '',
  gender: '男',
  mobile: '',
  identity: '',
  academy: '',
  profession: '',
  qq: '',
  email: ''
})
const rules = {
  name: [{required: true, message: '未输入姓名！', trigger: 'blur'}],
  gender: [{required: true, message: '未输入性别！', trigger: 'blur'}],
  mobile: [{required: true, message: '未输入手机号码！', trigger: 'blur'}],
  identity: [{required: true, message: '未输入身份证号！', trigger: 'blur'}],
  academy: [{required: true, message: '未输入学院！', trigger: 'blur'}],
  profession: [{required: true, message: '未输入专业！', trigger: 'blur'}],
  qq: [{required: true, message: '未输入 QQ 号！', trigger: 'blur'}],
  email: [{required: true, message: '未输入邮箱！', trigger: 'blur'}]
}

const newForm = (notLeader) => {
  isLeader.value = !notLeader
  if (isLeader) {
    if (leaders.value.length < 2 && leaders.value.length + members.value.length < 5) {
      leaders.value.push('')
      index.value = leaders.value.length - 1
    } else {
      ElMessage({
        showClose: true,
        message: leaders.value.length === 2 ? '领队数不能超过 2 人！' : '队伍总人数不能超过 5 人！',
        center: true,
        type: 'error'
      })
      return
    }
  } else {
    if (leaders.value.length + members.value.length < 5) {
      members.value.push('')
      index.value = members.value.length - 1
    } else {
      ElMessage({
        showClose: true,
        message: '队伍总人数不能超过 5 人！',
        center: true,
        type: 'error'
      })
      return
    }
  }

  form.name = '',
  form.gender = '男',
  form.mobile = '',
  form.identity = '',
  form.academy = '',
  form.profession = '',
  form.qq = '',
  form.email = ''
  dialogVisible.value = true
}

const loadForm = (notLeader, idx) => {
  isLeader.value = !notLeader
  index.value = idx
  let data = []
  if (isLeader.value) {
    data = leaders.value[index.value].split(' - ')
  } else {
    data = members.value[index.value].split(' - ')
  }
  form.name = data[0]
  form.gender = data[1]
  form.mobile = data[2]
  form.identity = data[3]
  form.academy = data[4]
  form.profession = data[5]
  form.qq = data[6]
  form.email = data[7]
  dialogVisible.value = true
}

const saveForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      let formStr = `${form.name} - ${form.gender} - ${form.mobile} - ${form.identity} - ${form.academy} - ${form.profession} - ${form.qq} - ${form.email}`
      if (isLeader) {
        leaders.value[index.value] = formStr
      } else {
        members.value[index.value] = formStr
      }
      dialogVisible.value = false
    }
  })
}

const removeForm = (notLeader, idx) => {
  if (!notLeader) {
    leaders.value.splice(idx, 1)
  } else {
    members.value.splice(idx, 1)
  }
}
</script>

<template>
  <el-container class="teamcenter-container">
    <NavBar />
    <el-container class="teamcenter-main-container">
      <el-aside class="teamcenter-aside">
        <el-menu default-active="1" :active="active" style="width: 15vw;">
          <el-container class="teamcenter-menu-title-container">
            <label class="teamcenter-menu-title">功能列表</label>
          </el-container>
          <el-menu-item class="teamcenter-menu-item" index="1" @click="active = 1">
            <el-icon><UserFilled /></el-icon>
            <span class="teamcenter-menu-text">队伍信息</span>
          </el-menu-item>
          <el-menu-item class="teamcenter-menu-item" index="2" @click="active = 2">
            <el-icon><Checked /></el-icon>
            <span class="teamcenter-menu-text">比赛汇总</span>
          </el-menu-item>
          <el-menu-item class="teamcenter-menu-item" index="3" @click="active = 3">
            <el-icon><StarFilled /></el-icon>
            <span class="teamcenter-menu-text">分数汇总</span>
          </el-menu-item>
          <el-menu-item class="teamcenter-menu-item" index="4" @click="active = 4">
            <el-icon><Opportunity /></el-icon>
            <span class="teamcenter-menu-text">奖项信息</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="teamcenter-main">
        <el-container class="teamcenter-main-container" v-if="active === 1">
          <label class="teamcenter-info-title">领队信息</label>
          <el-button class="teamcenter-info-add"></el-button>
          <label class="teamcenter-info-title">队员信息</label>
        </el-container>
        <el-container class="teamcenter-main-container" v-else-if="active === 2">
          2
        </el-container>
        <el-container class="teamcenter-main-container" v-else-if="active === 3">
          3
        </el-container>
        <el-container class="teamcenter-main-container" v-else-if="active === 4">
          4
        </el-container>
      </el-main>
    </el-container>
    <FootBar />
  </el-container>
  
  <el-dialog v-model="dialogVisible" title="成员信息录入">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left" label-width="100px">
      <el-form-item class="teamcenter-form-item" label="姓名" prop="name" @keyup.enter="saveForm">
        <el-input v-model="form.name" placeholder="请输入姓名"/>
      </el-form-item>
      <el-form-item class="teamcenter-form-item" label="性别" prop="gender">
        <el-radio-group v-model="form.gender">
          <el-radio-button value="男">男</el-radio-button>
          <el-radio-button value="女">女</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="teamcenter-form-item" label="手机号" prop="mobile" @keyup.enter="saveForm">
        <el-input v-model="form.mobile" placeholder="请输入手机号"/>
      </el-form-item>
      <el-form-item class="teamcenter-form-item" label="身份证号" prop="identity" @keyup.enter="saveForm">
        <el-input v-model="form.identity" placeholder="请输入身份证号"/>
      </el-form-item>
      <el-form-item class="teamcenter-form-item" label="学院" prop="academy" @keyup.enter="saveForm">
        <el-input v-model="form.academy" placeholder="请输入学院"/>
      </el-form-item>
      <el-form-item class="teamcenter-form-item" label="专业" prop="profession" @keyup.enter="saveForm">
        <el-input v-model="form.profession" placeholder="请输入专业"/>
      </el-form-item>
      <el-form-item class="teamcenter-form-item" label="QQ 号" prop="qq" @keyup.enter="saveForm">
        <el-input v-model="form.qq" placeholder="请输入 QQ 号"/>
      </el-form-item>
      <el-form-item class="teamcenter-form-item" label="邮箱" prop="email" @keyup.enter="saveForm">
        <el-input v-model="form.email" placeholder="请输入邮箱"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveForm">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.teamcenter-container {
  display: flex;
  flex-direction: column;
  background-color: #181818;
}
.teamcenter-main-container {
  display: flex;
  flex-direction: column
}
.teamcenter-aside {
  display: flex;
  height: calc(100vh - 140px);
  width: 15vw;
}
.teamcenter-main {
  display: flex;
  height: calc(100vh - 140px);
  width: 85vw;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.teamcenter-menu-title-container {
  display: flex;
  justify-content: center;
  padding: 2.5vh 0;
  padding-top: 5vh;
}
.teamcenter-menu-title {
  margin-right: 3vw;
  color: white;
  font-size: x-large;
  text-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
}
.teamcenter-menu-item {
  justify-content: center;
}
.teamcenter-menu-text {
  margin-right: 1.5vw;
  text-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
  font-size: large;
}
.teamcenter-form-item {
  margin-left: 5vw;
  margin-right: 5vw;
}
.teamcenter-info-title {
  color: white;
  font-size: xx-large;
  text-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
}
</style>
