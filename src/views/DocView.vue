<script setup>
import { ref } from 'vue'

import NavBar from '@/components/NavBar.vue'
import FootBar from '@/components/FootBar.vue'


const text = ref('\
# v-md-editor使用教程\n\
#### 在正常的文本编辑基础上，v-md-editor能够支持所有的markdown语法，例如：\n\
# H1\n\
## H2\n\
### H3\n\
#### H4\n\
##### H5\n\
###### H6\n\
**粗体**\n\
*斜体*\n\
> 引用\n\
- 无序列表\n\
1. 有序列表\n\
------------------------------------\n\
|column1|表格|column3|\n\
|-|-|-|\n\
|content1|content2|content3|\n\n\
[链接(v-md-editor)](http://http://ckang1229.gitee.io/vue-markdown-editor/zh/)\n\
![这是一张图片的介绍](https://storage.live.com/users/0x297050f96e844eab/myprofile/expressionprofile/profilephoto:UserTileStatic/p?ck=1&ex=720&sid=026FDF0F192065B601E6CC1318636405&fofoff=1)\n\
``` cpp\n\
#include <iostream>\n\
\n\
int main(int argc, char *argv[]) {\n\
    std::cout << "这是一段代码块" << std::endl;\n\
}\n\
```\n\
### 此外，我们添加了v-md-editor提供的所有插件：\n\
#### Tip功能\n\
::: tip\n\
  这是一段提示\n\
:::\n\
::: warning\n\
  这是一段警告\n\
:::\n\
::: danger\n\
  这是一段危险警告\n\
:::\n\
::: details\n\
  这是一个详情块，在 IE / Edge 中不生效\n\
:::\n\
::: tip 自定义标题\n\
  你也可以自定义块中的标题\n\
:::\n\
你可以通过上方的插入提示按钮快速插入提示。\n\
#### Emoji表情\n\
你可以通过上方的插入表情快速插入想要的表情。\n\
:sweat_smile:\n\
#### katex公式\n\
你可以使用katex语法来编写公式：\n\
$$\n\sum_{i=1}^n a_i=0$$\n\
#### mermaid流程图\n\
你可以使用特定的语法编写漂亮的流程图：\n\
```mermaid\n\
graph LR\n\
A --- B\n\
B-->C[fa:fa-ban forbidden]\n\
B-->D(fa:fa-spinner);\n\
```\n\
\n\
#### Todo List\n\
你可以通过上方的todo按钮快速插入一条todo项：\n\
- [ ] Todo 1\n\
- [x] Todo 2\n\
#### 高亮代码行\n\
你可以指定需要高亮的代码行，来更方便地突出部分代码：\n\
``` cpp {1-3,5}\n\
#include <iostream>\n\
\n\
int main(int argc, char *argv[]) {\n\
    std::cout << "这是一段代码块" << std::endl;\n\
}\n\
```\n\
#### 内容定位\n\
利用align可以设置部分段落的横向位置：\n\
::: align-left\n\
  left\n\
:::\n\
::: align-center\n\
  center\n\
:::\n\
::: align-right\n\
  right\n\
:::\
')
</script>

<template>
  <el-container class="doc-container">
    <NavBar />
    <el-main class="doc-main">
      <v-md-editor 
        v-model="text"
        mode="preview"
        :default-show-toc="true"
      />
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
  background-color: #181818;
}
</style>
