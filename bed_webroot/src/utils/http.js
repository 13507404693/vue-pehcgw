'use strict'  //"use strict" 的目的是指定代码在严格条件下执行。 严格模式下你不能使用未声明的变量。
import axios from 'axios'
// axios interceptors 拦截器中添加headers 属性
axios.interceptors.request.use(
    config => {
        if (sessionStorage.sysUser) {
            config.headers['Access-Token'] = JSON.parse(sessionStorage.sysUser).token
        }
        return config
    },
    error => {
        return Promise.reject(error)//es6 报错回调
    }
)

//添加全局post 方法
export function postByJson(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios({
            url: url,
            method: 'post',
            data: data,
        }).then(response => {
            if (response.data.status) {
                resolve(response.data)
            } else if (response.data.errorCode == '546' || response.data.errorCode == '545') {
                this.$router.push({path: '/login'})
            } else {
                resolve(response.data)
            }
        }, error => {
            reject(error)
        })
    })
}

//全局 导人表格 的请求方法 
export function postByForm(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios({
            url: url,
            method: 'post',
            data: data,
            transformRequest: [function (data) {// 做任何你想要的数据转换 `transformRequest` 允许在向服务器发送前，修改请求数据   只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法  后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
                let ret = ''
                for (let i in data) {
                    if (i == null || data[i] == null) {
                        continue;
                    }
                    ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
                }
                return ret
            }],
        }).then(response => {
            if (response.data.status) {
                resolve(response.data)
            } else if (response.data.errorCode == '546' || response.data.errorCode == '545') {
                this.$router.push({path: '/login'})
            } else {
                resolve(response.data)
            }
        }, error => {
            reject(error)
        })
    })
}

//全局 导出 表格的请求方法 
export function postByExport(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios({
            url: url,
            method: 'post',
            data: data,
            responseType: 'blob',
            transformRequest: [function (data) {
                let ret = ''
                for (let i in data) {
                    if (i == null || data[i] == null) {
                        continue;
                    }
                    ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
                }
                return ret
            }],
        }).then(response => {
            if (response.data.status) {
                resolve(response.data)
            } else if (response.data.errorCode == '546' || response.data.errorCode == '545') {
                this.$router.push({path: '/login'})
            } else {
                resolve(response.data)
            }
        }, error => {
            reject(error)
        })
    })
}

export function post(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios({
            url: url,
            method: 'post',
            data: data,
            transformRequest: [function (data) {
                let ret = ''
                for (let i in data) {
                    if (i == null || data[i] == null) {
                        continue;
                    }
                    ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
                }
                return ret
            }],
        }).then(response => {
            resolve(response.data)
        }, error => {
            reject(error)
        })
    })
}

export function postBody(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios({
            url: url,
            method: 'post',
            headers: {'content-type': 'application/json'},
            data: JSON.stringify(data),
        }).then(response => {
            resolve(response.data)
        }, error => {
            reject(error)
        })
    })
}
//其他情况
export const http = axios.create({

    // validateStatus: function (status) {
    //     return status == 200 || status == 400;
    // }
});
