<script setup>
import { ref } from 'vue'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css';

import NavBar from '@/components/NavBar.vue'
import FootBar from '@/components/FootBar.vue'


const text = ref('\
# md-editor-v3使用教程\n\
#### 在正常的文本编辑基础上，md-editor-v3能够支持所有的markdown语法，例如：\n\
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
[链接(md-editor-v3)](http://http://ckang1229.gitee.io/vue-markdown-editor/zh/)\n\
![这是一张图片的介绍](https://storage.live.com/users/0x297050f96e844eab/myprofile/expressionprofile/profilephoto:UserTileStatic/p?ck=1&ex=720&sid=026FDF0F192065B601E6CC1318636405&fofoff=1)\n\
``` cpp\n\
#include <iostream>\n\
\n\
int main(int argc, char *argv[]) {\n\
    std::cout << "这是一段代码块" << std::endl;\n\
}\n\
```\n\
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
你可以插入一条todo项：\n\
- [ ] Todo 1\n\
- [x] Todo 2\n\
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
