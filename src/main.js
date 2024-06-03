import './assets/main.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import axios from "@/utils/AxiosInstance"

const app = createApp(App)

app.use(ElementPlus, { size: "large", zIndex: 3000 });
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(router)

app.mount('#app')

app.config.globalProperties.$http = axios
