<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import { Edit, Delete } from '@element-plus/icons-vue'


const { proxy } = getCurrentInstance()

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
    callback(new Error('未输入手机号！'))
  } else {
    let isTel = RegExp(/^1[3-9]\d{9}$|^0\d{2,3}-\d{7,8}$/).test(value)
    if (!isTel) {
      callback(new Error('请输入正确的手机号！'))
    } else {
      callback()
    }
  }
}
const qqValidator = (_rule, value, callback) => {
  if (value == '') {
    callback(new Error('未输入 QQ 号！'))
  } else {
    let isQQ = RegExp(/^[1-9]{1}[0-9]{4,14}$/).test(value)
    if (!isQQ) {
      callback(new Error('请输入正确的 QQ 号！'))
    } else {
      callback()
    }
  }
}
// 网上找来的身份证合法性校验
const identityValidator = (_rule, value, callback) => {
  if (value === '') {
    callback(new Error('未输入身份证号！'))
  }
  // 校验出生日期是否合理
  let validateBirthday = (year, month, day) => {
    year = Number(year) // 年
    month = Number(month) // 月
    day = Number(day) // 日
    const nowTime = new Date().getTime() // 当前时间戳
    const birthTime = new Date(`${year}-${month}-${day}`).getTime() // 获取出生日期的时间戳
    // 不能是明天出生的吧
    if (birthTime > nowTime) {
      return false
    }
    // 一般人活不到150岁吧
    const nowYear = new Date().getFullYear()
    if ((nowYear - year) > 150) {
      return false
    }
    // 不能是13月出生的吧
    if (month < 1 || month > 12) {
      return false
    }
    // 不能是2月30号、4月31号、5月32号出生的吧
    const date = new Date(year, month, 0) // 获取当月的最后一天
    if (day < 1 || day > date.getDate()) {
      return false
    }
    return true
  }
  const psidno = String(value)
  // 1.校验身份证号格式和长度
  const regPsidno = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[X])$)$/
  if (!regPsidno.test(psidno)) {
    callback(new Error('请输入正确的身份证号！'))
  }
  // 2.校验前两位的省份编码是否正确
  const province = { 11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江 ', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北 ', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏 ', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外' }
  if (!province[Number(psidno.slice(0, 2))]) {
    callback(new Error('请输入正确的身份证号！'))
  }
  // 3.校验出生日期
  if (psidno.length === 15) {
    // 15位号码 省（2位）市（2位）县（2位）年（2位）月（2位）日（2位）校验码（3位）
    const reg = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/)
    const arrSplit = psidno.match(reg)
    // 15位号码在年份前补 19 或 20
    const year = Number(arrSplit[2].charAt(0)) > 0 ? '19' + arrSplit[2] : '20' + arrSplit[2]
    const month = arrSplit[3]
    const day = arrSplit[4]
    if (!validateBirthday(year, month, day)) {
      callback(new Error('请输入正确的身份证号！'))
    }
  } else if (psidno.length === 18) {
    // 18位号码 省（2位）市（2位）县（2位）年（4位）月（2位）日（2位）校验码（4位）
    const reg = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/)
    const arrSplit = psidno.match(reg)
    const year = arrSplit[2]
    const month = arrSplit[3]
    const day = arrSplit[4]
    if (!validateBirthday(year, month, day)) {
      callback(new Error('请输入正确的身份证号！'))
    }
  } else {
    callback(new Error('请输入正确的身份证号！'))
  }
  // 4.18位号码校验生成的校验码
  if (psidno.length === 18) {
    const Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] // 加权因子
    const parity = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'] // 校验码
    let sum = 0
    for (let i = 0; i < 17; i++) {
      sum += Number(psidno.charAt(i)) * Wi[i]
    }
    if (parity[sum % 11] !== psidno[17]) {
      callback(new Error('请输入正确的身份证号！'))
    }
  }
  callback()
}
const rules = {
  name: [{required: true, message: '未输入姓名！', trigger: 'blur'}],
  gender: [{required: true, message: '未输入性别！', trigger: 'blur'}],
  mobile: [{required: true, validator: telValidator, trigger: 'blur'}],
  identity: [{required: true, validator: identityValidator, trigger: 'blur'}],
  academy: [{required: true, message: '未输入学院！', trigger: 'blur'}],
  profession: [{required: true, message: '未输入专业！', trigger: 'blur'}],
  qq: [{required: true, message: '未输入 QQ 号！', trigger: 'blur'}],
  email: [{required: true, validator: emailValidator, trigger: 'blur'}]
}

const newForm = (notLeader) => {
  isLeader.value = !notLeader
  if (isLeader.value) {
    if (leaders.value.length < 2 && leaders.value.length + members.value.length < 5) {
      index.value = leaders.value.length
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
      index.value = members.value.length
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
  if (isLeader.value) {
    Object.assign(form, leaders.value[index.value])
  } else {
    Object.assign(form, members.value[index.value])
  }
  dialogVisible.value = true
}

const saveForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      if (isLeader.value) {
        leaders.value[index.value] = {...form}
      } else {
        members.value[index.value] = {...form}
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
  <label class="teamcenter-info-title">领队信息</label>
  <label class="teamcenter-info-tip">(最多两名领队，队伍总人数不得超过5人)</label>
  <el-table class="teamcenter-info-table" :data="leaders" stripe>
    <el-table-column fixed prop="name" label="姓名" width="75px" />
    <el-table-column prop="gender" label="性别" width="60px" />
    <el-table-column prop="mobile" label="手机号" width="118px" />
    <el-table-column prop="identity" label="身份证号" width="172px" />
    <el-table-column prop="academy" label="学院" width="172px" />
    <el-table-column prop="profession" label="专业" width="145px" />
    <el-table-column prop="qq" label="QQ 号" width="118px"/>
    <el-table-column prop="email" label="邮箱" width="200px" />
    <el-table-column class="teamcenter-table-button" fixed="right" label="编辑" width="72px">
      <template #default="scope">
        <el-button type="primary" :icon="Edit" circle @click="loadForm(false, scope.$index)" />
      </template>
    </el-table-column>
    <el-table-column class="teamcenter-table-button" fixed="right" label="删除" width="72px">
      <template #default="scope">
        <el-button type="danger" :icon="Delete" circle @click="removeForm(false, scope.$index)" />
      </template>
    </el-table-column>
  </el-table>
  <el-button class="teamcenter-info-add" @click="newForm(false)">
    <el-icon class="teamcenter-info-icon"><Plus /></el-icon>
    添加条目……
  </el-button>
  <label class="teamcenter-info-title">队员信息</label>
  <label class="teamcenter-info-tip">(队伍总人数不得超过5人)</label>
  <el-table class="teamcenter-info-table" :data="members" stripe>
    <el-table-column fixed prop="name" label="姓名" width="75px" />
    <el-table-column prop="gender" label="性别" width="60px" />
    <el-table-column prop="mobile" label="手机号" width="118px" />
    <el-table-column prop="identity" label="身份证号" width="172px" />
    <el-table-column prop="academy" label="学院" width="172px" />
    <el-table-column prop="profession" label="专业" width="145px" />
    <el-table-column prop="qq" label="QQ 号" width="118px"/>
    <el-table-column prop="email" label="邮箱" width="200px" />
    <el-table-column class="teamcenter-table-button" fixed="right" label="编辑" width="72px">
      <template #default="scope">
        <el-button type="primary" :icon="Edit" circle @click="loadForm(true, scope.$index)" />
      </template>
    </el-table-column>
    <el-table-column class="teamcenter-table-button" fixed="right" label="删除" width="72px">
      <template #default="scope">
        <el-button type="danger" :icon="Delete" circle @click="removeForm(true, scope.$index)" />
      </template>
    </el-table-column>
  </el-table>
  <el-button class="teamcenter-info-add" @click="newForm(true)">
    <el-icon class="teamcenter-info-icon"><Plus /></el-icon>
    添加条目……
  </el-button>
  <el-button class="teamcenter-info-save" type="primary">保存信息</el-button>

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
.teamcenter-form-item {
  margin-left: 5vw;
  margin-right: 5vw;
}
.teamcenter-info-title {
  color: white;
  font-size: xx-large;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
  margin-top: 4vh;
  margin-bottom: 1vh;
  text-align: center;
}
.teamcenter-info-tip {
  color: rgba(255, 255, 255, 0.75);
  font-size: small;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
  text-align: center;
  margin-bottom: 4vh;
}
.teamcenter-info-add {
  width: 30vw;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.25);
  filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.25));
  margin: 0 auto;
}
.teamcenter-info-add:hover {
  text-shadow: 0 0 2px rgba(64, 158, 255, 0.25);
  filter: drop-shadow(0 0 2px rgba(64, 158, 255, 0.25));
}
.teamcenter-info-icon {
  margin-right: 12px;
  margin-bottom: 2px;
  filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.25));
}
.teamcenter-info-table {
  margin-bottom: 3vh;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
}
.teamcenter-info-save {
  width: 50vw;
  margin: auto;
  margin-top: 5vh;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
  filter: drop-shadow(0 0 4px rgba(64, 158, 255, 0.5));
}
</style>
