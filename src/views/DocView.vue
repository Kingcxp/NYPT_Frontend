<script setup>
import { ref } from 'vue'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css';

import NavBar from '@/components/NavBar.vue'
import FootBar from '@/components/FootBar.vue'


const text = ref('\n\
# NYPT Assistant 使用指南\n\
### ✨ By Kingcq 2024.9.7 ✨\n\
## 新用户\n\
点击右上角登录按钮前往登录界面，在登录界面可以找到注册按钮。\n\
在填写完注册信息之后，系统将告知主办方有新的注册请求。\n\
主办方尽快审核后会通过邮件告知账号密码，此时即可登录账号。\n\
## 比赛团队\n\
登录之后，在右上角菜单打开`团队空间`\n\
请在获得账号后尽快完善`队伍信息`中的所有团队信息并点击页面底部的`保存信息`将信息提交到服务器\n\
> #### 请多次检查信息是否填写正确，之后的赛程信息生成都依赖于你填写的数据！\n\
\n\
在比赛过程中，`比赛汇总`和`分数汇总`会实时显示现在所有团队的比赛情况和你的团队的得分情况\n\
而`奖项信息`会在比赛完成之后展示主办方上传的奖状图片，并喷出彩纸，为你庆祝\n\
## 志愿者 A（赛场计分员）\n\
登录之后，在右上角菜单打开`计分工具`\n\
确认好比赛轮次和会场编号之后，输入主办方提供的会场令牌进入计分工具\n\
计分过程的每一步所需要按下的按钮都会用`绿色实心`的格式标识，\n\
计分工具整体看上去还是挺通俗易懂的，在熟悉比赛规则的情况下完成计分应该完全没有问题\n\
## 志愿者 B（赛程计时员）\n\
登录之后，在右上角菜单打开`赛程秒表`\n\
`赛程秒表`是由另一位同学提供的古老工具，相对于其它工具较为简陋，但功能十分完善\n\
页面正下方的按钮可以选择比赛环节，点击按钮后秒表会自动启动计时\n\
志愿者也可以在右侧选择手动设置计时，或者启动`下一个环节`的计时\n\
')
</script>

<template>
  <el-container class="doc-container">
    <NavBar />
    <el-main class="doc-main">
      <el-container class="doc-preview-container">
        <MdPreview
          v-model="text"
          theme="dark"
          language="zh-CN"
          preview-theme="arknights"
        />
      </el-container>
    </el-main>
    <FootBar />
  </el-container>
</template>

<style scoped>
.doc-container {
  display: flex;
  flex-direction: column;
}
.doc-main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0;
  color: white;
  background-color: #101010;
}
.doc-preview-container {
  width: 50vw;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-top: none;
  box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.5);
  margin-bottom: 20px;
}
</style>
