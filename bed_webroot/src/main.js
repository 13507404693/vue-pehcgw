import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueDND from 'awe-dnd';
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/bar.js'
import 'echarts/lib/chart/pie.js'
import 'echarts/lib/chart/line.js'
import 'echarts/lib/component/title.js';

Vue.use(VueDND)
Vue.use(ElementUI);
Vue.component('v-chart', ECharts)

import components from './components/'
//全局封装组件 components
Object.keys(components).forEach((key) => {
    Vue.component(`v-${key}`, components[key])
})
//把 http 的方法 注册为全局的方法
import {post, postByJson, postByForm, postByExport, http, postBody} from './utils/http'
Vue.prototype.$post = post
Vue.prototype.$postByJson = postByJson
Vue.prototype.$postByForm = postByForm
Vue.prototype.$postByExport = postByExport
Vue.prototype.$http = http
Vue.prototype.$postBody = postBody



import './css/common.less'

Vue.config.productionTip = true;

new Vue({
        router,
        store,
        render: h => h(App)
}).$mount('#app')




