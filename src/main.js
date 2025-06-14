import { createApp } from 'vue'
import pinia from './stores/index.js'
import App from './App.vue'
import router from './router'
import './index.css'

//Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhTwEl from 'element-plus/es/locale/lang/zh-tw'


//Font Awesome
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
library.add(fas, far)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.use(pinia)
app.use(ElementPlus, {
  locale: zhTwEl
})
app.mount('#app')
