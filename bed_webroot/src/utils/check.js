'use strict'

export default {
  num: (rule, value, callback) => {
    if (!(value == '') && !(/^\d+(\.\d+)?$/.test(value))) {
      callback(new Error('请输入数字值'))
    } else {
      callback()
    }
  },
  checkPhone: (rule, value, callback) => {
    if (!(/^[1]\d{10}$/.test(value))) {
      callback(new Error('请输入正确手机号'))
    } else {
      callback()
    }
  },
  checkPhoneMore: (rule, value, callback) => {
    if (!(/^[1]\d{10}$|^400[0-9]{7}/.test(value))) {
      callback(new Error('请输入正确电话'))
    } else {
      callback()
    }
  },
  checkAccount: (rule, value, callback) => {
    if (!(/^[a-zA-Z0-9_-]{4,16}$/.test(value))) {
      callback(new Error('请输入4-16位英文账号'))
    } else {
      callback()
    }
  },
}
