<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

import Base64 from '@/utils/Base64'


const { proxy } = getCurrentInstance()
const base64 = new Base64()
let selfID = 0

const addUserDialogVisible = ref(false)
const addMultiUserDialogVisible = ref(false)

const page = ref(1)
const pageSize = ref(10)
const userData = ref([])
const userTotal = ref(0)
const searchRef = ref("")
const searchData = ref([])

const userFormRef = ref(null)
const userForm = reactive({
  name: '',
  identity: '',
  token: '',
  email: '',
})
const multiUserFormRef = ref(null)
const multiUserForm = reactive({
  begin: 0,
  end: 0,
  identity: '',
  length: 8,
})

const userEmailValidator = (_rule, value, callback) => {
  if (value !== '') {
    let isEmail = RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(value)
    if (!isEmail) {
      callback(new Error('请输入正确的邮箱！'))
    }
  }
  callback()
}
const notNullValidator = (_rule, value, callback) => {
  if (value !== undefined && value !== NaN && value !== null) {
    callback();
  }
  callback(new Error('不可以为空！'))
}

const userRules = {
  name: [{required: true, message: '未输入姓名！', trigger: 'blur'}],
  token: [{required: true, message: '未输入密码！', trigger: 'blur'}],
  identity: [{required: true, message: '未确定身份！', trigger: 'blur'}],
  email: [{required: true, validator: userEmailValidator, trigger: 'blur'}]
}
const multiUserRules = {
  begin: [{required: true, validator: notNullValidator, trigger: 'blur'}],
  end: [{required: true, validator: notNullValidator, trigger: 'blur'}],
  identity: [{required: true, message: '未确定身份！', trigger: 'blur'}],
  length: [{required: true, validator: notNullValidator, trigger: 'blur'}]
}

const messageWhenCatch = (error) => {
  ElMessage({
    showClose: true,
    message: error.response.data.msg,
    center: true,
    type: 'error'
  })
}

const showCreateDialog = () => {
  addUserDialogVisible.value = true
  userForm.name = ''
  userForm.identity = 'Team'
  userForm.token = ''
  userForm.email = ''
}

const showMultiCreateDialog = () => {
  addMultiUserDialogVisible.value = true
  multiUserForm.begin = 1
  multiUserForm.end = 100
  multiUserForm.identity = 'Team'
  multiUserForm.length = 8
}

const searchUser = async () => {
  if (searchRef.value === '') {
    ElMessage({
      showClose: true,
      message: '搜索内容不可以为空！',
      center: true,
      type: 'error'
    })
    return
  }
  searchData.value = []
  await proxy.$http.get(`/auth/manage/user/search/${searchRef.value}`).then((response) => {
    searchData.value.push(response.data)
  }).catch(messageWhenCatch)
}

const removeUser = async (idx) => {
  if (userData.value[idx].user_id === selfID) {
    ElMessage({
      showClose: true,
      message: '不可以删除自己！',
      center: true,
      type: 'error'
    })
    return
  }
  await proxy.$http.get(`/auth/manage/user/delete/${userData.value[idx].user_id}`).then((_) => {
    userData.value.splice(idx, 1)
    userTotal.value -= 1
    ElMessage({
      showClose: true,
      message: '删除成功！',
      center: true,
      type: 'success'
    })
  }).catch(messageWhenCatch)
}

const removeSearchUser = async (idx) => {
  if (searchData.value[idx].user_id === selfID) {
    ElMessage({
      showClose: true,
      message: '不可以删除自己！',
      center: true,
      type: 'error'
    })
    return
  }
  await proxy.$http.get(`/auth/manage/user/delete/${searchData.value[idx].user_id}`).then((_) => {
    searchData.value = []
    userData.value = userData.value.filter((user) => user.user_id !== searchData.value[idx].user_id)
    userTotal.value -= 1
    ElMessage({
      showClose: true,
      message: '删除成功！',
      center: true,
      type: 'success'
    })
  }).catch(messageWhenCatch)
}

const newUser = async () => {
  userFormRef.value.validate(async (valid) => {
    if (valid) {
      await proxy.$http.post(`/auth/manage/user/create`, {
        'name': userForm.name,
        'identity': userForm.identity,
        'token': userForm.token,
        'email': userForm.email === '' ? null : userForm.email
      }).then(async (_) => {
        userTotal.value += 1
        await getPage()
        addUserDialogVisible.value = false
        ElMessage({
          showClose: true,
          message: '添加成功！',
          center: true,
          type: 'success'
        })
      }).catch(messageWhenCatch)
    }
  })
}

const newMultiUser = async () => {
  multiUserFormRef.value.validate(async (valid) => {
    if (valid) {
      await proxy.$http.post(`/auth/manage/user/createall`, {
        'begin': multiUserForm.begin,
        'end': multiUserForm.end,
        'identity': multiUserForm.identity,
        'length': multiUserForm.length
      }).then(async (response) => {
        userTotal.value = response.data.total
        addMultiUserDialogVisible.value = false
        await getPage()
        ElMessage({
          showClose: true,
          message: '添加成功！',
          center: true,
          type: 'success'
        })
      }).catch(messageWhenCatch)
    }
  })
}

const getPage = async () => {
  if (selfID === 0) {
    return
  }
  await proxy.$http.get(`/auth/manage/user/getall/${page.value}/${pageSize.value}`).then((response) => {
    userData.value = response.data.users
  }).catch(messageWhenCatch)
}

const handlePageChange = async (pg) => {
  if (pg === undefined) {
    pg = 1
  }
  page.value = pg
  await getPage()
}

onMounted(async () => {
  await proxy.$http.get(`/auth/id`).then(async (response) => {
    selfID = response.data.user_id
  }).catch(messageWhenCatch)
  await proxy.$http.get(`/auth/manage/user/total`).then((response) => {
    userTotal.value = response.data.total
  })
  await getPage()
})
</script>

<template>
  <label class="admin-auth-title">全部用户信息</label>
  <el-container class="admin-auth-table-container">
    <el-table class="admin-auth-table" :data="userData" stripe border>
      <el-table-column fixed prop="user_id" label="用户 ID" width="80px"></el-table-column>
      <el-table-column fixed prop="name" label="用户名" width="120px"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="200px"></el-table-column>
      <el-table-column prop="identity" label="身份类型" width="160px"></el-table-column>
      <el-table-column prop="token" label="登录令牌" width="240px">
        <template #default="scope">
          <el-container>
            <span>{{ userData[scope.$index].view_token ? base64.decode(userData[scope.$index].token) : userData[scope.$index].token }}</span>
            <el-icon
              class="admin-auth-view-icon"
              @click="userData[scope.$index].view_token = !userData[scope.$index].view_token"
            >
              <View class="admin-auth-view-icon-detail" v-if="!userData[scope.$index].view_token" />
              <Hide class="admin-auth-view-icon-detail" v-else />
            </el-icon>
          </el-container>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="删除" width="72px">
        <template #default="scope">
          <el-button style="height: 25px; width: 25px;" type="danger" :icon="Delete" circle @click="removeUser(scope.$index)" />
        </template>
      </el-table-column>
    </el-table>
    <el-button class="admin-auth-btn" @click="showCreateDialog">
      <el-icon class="admin-auth-icon"><Plus /></el-icon>
      添加用户…
    </el-button>
    <el-button class="admin-auth-btn" @click="showMultiCreateDialog">
      <el-icon class="admin-auth-icon"><Plus /></el-icon>
      批量添加用户…
    </el-button>
    <el-pagination
      class="admin-auth-pagination"
      layout="prev, pager, next, jumper"
      :total="userTotal"
      @current-change="handlePageChange"
      background
    />
  </el-container>
  <label class="admin-auth-title">查询用户</label>
  <el-container class="admin-auth-table-container">
    <el-container style="margin-bottom: 32px;">
      <el-input class="admin-auth-search" v-model="searchRef" placeholder="请输入用户名" clearable @keyup.enter="searchUser" />
      <el-button class="admin-auth-search-button" @click="searchUser" type="primary">查询</el-button>
    </el-container>
    <el-table class="admin-auth-table" :data="searchData" stripe border>
      <el-table-column fixed prop="user_id" label="用户 ID" width="80px"></el-table-column>
      <el-table-column fixed prop="name" label="用户名" width="120px"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="200px"></el-table-column>
      <el-table-column prop="identity" label="身份类型" width="160px"></el-table-column>
      <el-table-column prop="token" label="登录令牌" width="240px">
        <template #default="scope">
          <el-container>
            <span>{{ searchData[scope.$index].view_token ? base64.decode(searchData[scope.$index].token) : searchData[scope.$index].token }}</span>
            <el-icon
              class="admin-auth-view-icon"
              @click="searchData[scope.$index].view_token = !searchData[scope.$index].view_token"
            >
              <View class="admin-auth-view-icon-detail" v-if="!searchData[scope.$index].view_token" />
              <Hide class="admin-auth-view-icon-detail" v-else />
            </el-icon>
          </el-container>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="删除" width="72px">
        <template #default="scope">
          <el-button style="height: 25px; width: 25px;" type="danger" :icon="Delete" circle @click="removeSearchUser(scope.$index)" />
        </template>
      </el-table-column>
    </el-table>
  </el-container>

  <el-dialog v-model="addUserDialogVisible" title="新建用户">
    <el-form ref="userFormRef" :model="userForm" :rules="userRules" label-position="left" label-width="100px">
      <el-form-item class="admin-auth-form-item" label="姓名" prop="name" @keyup.enter="newUser">
        <el-input v-model="userForm.name" placeholder="请输入姓名" clearable/>
      </el-form-item>
      <el-form-item class="admin-auth-form-item" label="密码" prop="token" @keyup.enter="newUser">
        <el-input v-model="userForm.token" placeholder="请输入密码" clearable/>
      </el-form-item>
      <el-form-item class="admin-auth-form-item" label="身份" prop="identity">
        <el-radio-group v-model="userForm.identity">
          <el-radio-button value="Admin">管理员</el-radio-button>
          <el-radio-button value="Team">比赛队伍</el-radio-button>
          <el-radio-button value="VolunteerA">志愿者 A 类</el-radio-button>
          <el-radio-button value="VolunteerB">志愿者 B 类</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="admin-auth-form-item" label="邮箱" prop="email" @keyup.enter="newUser">
        <el-input v-model="userForm.email" placeholder="请输入邮箱，若邮箱不为空则会自动发邮件给用户告知账号密码" clearable/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="addUserDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="newUser">确定</el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="addMultiUserDialogVisible" title="新建用户">
    <el-form ref="multiUserFormRef" :model="multiUserForm" :rules="multiUserRules" label-position="left" label-width="200px">
      <el-form-item class="admin-auth-form-item" label="起始编号(1~999)" prop="begin">
        <el-input-number v-model="multiUserForm.begin" :min="1" :max="999" />
      </el-form-item>
      <el-form-item class="admin-auth-form-item" label="终止编号(1~999)" prop="end">
        <el-input-number v-model="multiUserForm.end" :min="multiUserForm.begin" :max="999" />
      </el-form-item>
      <el-form-item class="admin-auth-form-item" label="身份" prop="identity">
        <el-radio-group v-model="multiUserForm.identity">
          <el-radio-button value="Admin">管理员</el-radio-button>
          <el-radio-button value="Team">比赛队伍</el-radio-button>
          <el-radio-button value="VolunteerA">志愿者 A 类</el-radio-button>
          <el-radio-button value="VolunteerB">志愿者 B 类</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="admin-auth-form-item" label="密码长度(4~20)" prop="length">
        <el-input-number  v-model="multiUserForm.length" :min="4" :max="20" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="addMultiUserDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="newMultiUser">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.admin-auth-title {
  color: white;
  font-size: xx-large;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
  margin-top: 3vh;
  margin-bottom: 2vh;
  text-align: center;
}
.admin-auth-table {
  width: fit-content;
  max-width: 70vw;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}
.admin-auth-view-icon {
  height: min-content;
  width: min-content;
  cursor: pointer;
  margin: auto;
  margin-right: 0;
}
.admin-auth-view-icon-detail {
  width: 20px;
  height: auto;
}
.admin-auth-btn {
  width: 100%;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.25);
  filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.25));
  margin: 0 auto;
}
.admin-auth-btn:hover {
  text-shadow: 0 0 2px rgba(64, 158, 255, 0.25);
  filter: drop-shadow(0 0 2px rgba(64, 158, 255, 0.25));
}
.admin-auth-icon {
  margin-right: 12px;
  margin-bottom: 2px;
  filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.25));
}
.admin-auth-form-item {
  margin-left: 5vw;
  margin-right: 5vw;
}
.admin-auth-table-container {
  display: flex;
  flex-direction: column;
  flex: none;
  height: auto;
  width: auto;
  padding-bottom: 32px;
}
.admin-auth-pagination {
  justify-content: center;
  vertical-align: middle;
  height: 64px;
  width: 100%;
  border: 1px solid #666666;
  filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.25));
}
.admin-auth-search {
  width: calc(90% - 20px);
  margin-right: 20px;
}
.admin-auth-search-button {
  width: 10%;
  color: #000;
  font-size: large;
}
</style>
