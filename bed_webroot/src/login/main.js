import Vue from 'vue'
import App from './login.vue'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//把 http 的方法 注册为全局的方法
import {post, postByJson, postByForm, postByExport, http, postBody} from '../utils/http'
Vue.prototype.$post = post
Vue.prototype.$postByJson = postByJson
Vue.prototype.$postByForm = postByForm
Vue.prototype.$postByExport = postByExport
Vue.prototype.$http = http
Vue.prototype.$postBody = postBody

new Vue({
    render: h => h(App)
}).$mount('#app')
