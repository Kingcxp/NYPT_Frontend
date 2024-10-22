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
~~点击右上角`登录按钮`前往登录界面，在登录界面可以找到`注册按钮`。~~\n\
~~在填写完注册信息之后，系统将告知主办方`有新的注册请求`。~~\n\
~~主办方尽快审核后会`通过邮件告知`账号密码，此时即可登录账号。~~\n\
新建用户现在完全由管理员控制，不再支持自主注册\n\
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
## 管理员\n\
新系统会默认创建第一个用户并自动获得管理员身份，登录之后，在右上角打开`管理员仪表盘`\n\
管理员仪表盘是一款~~先进的~~老旧的比赛管理工具，可以生成比赛信息，查看比赛情况和修改比赛记录。\n\
它的操作方式非常的通俗易懂：\n\
#### 账号管理\n\
能轻松地`管理所有账号`，能够`查询和创建用户`，以及`批量以固定形式增加某种类型的用户`\n\
如果你`为后端配置了邮箱`并且创建用户时`提供了邮箱`，它还会`向邮箱自动发送信息`告知账号密码。\n\
~~看，确实很先进吧~~\n\
#### 配置管理\n\
在这里能够快速看到所有的会场密码信息（也可以`导出成表格`），旁边的控制台还可以通过几步点击，轻松完成比赛配置\n\
#### 比赛管理\n\
在这里能够看到所有的`比赛数据`，和老系统的 data.json 文件内容几乎一致\n\
~~如果看一眼代码，这俩货就几乎没啥区别~~\n\
#### ~~更多功能~~\n\
~~作为` 强 大 `的管理员，管理员能亲自下场并担任任何职务！~~\n\
~~他们能够`作为团队参赛`，也能够作为`计分员`和`计时员`！~~\n\
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
  overflow-x: hidden;
}
.doc-main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0;
  color: white;
  background-color: #101010;
  width: 100vw;
}
.doc-preview-container {
  width: 50vw;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-top: none;
  box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.5);
}
</style>
