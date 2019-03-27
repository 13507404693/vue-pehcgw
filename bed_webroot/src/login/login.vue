<template>
  <div style="overflow:hidden;padding-bottom: 30px;">
    <div class="demo-ruleForm login-container">
      <h3 class="title">领歌云康智能陪护床运营管理平台</h3>
      <el-tabs v-model="activeName">
        <el-tab-pane label="账号密码登录" name="first">
          <el-form :model="accountForm" :rules="accountRules" ref="accountForm" label-position="left" label-width="0px" style="padding-top: 7px">
            <el-form-item prop="account">
              <el-input type="text" auto-complete="off" placeholder="请输入账号" v-model="accountForm.account"></el-input>
            </el-form-item>
            <el-form-item prop="pwd">
              <el-input type="password" auto-complete="off" placeholder="请输入密码" v-model="accountForm.pwd" @keyup.native.enter="doLogin"></el-input>
            </el-form-item>
            <el-form-item prop="code">
              <el-input placeholder="请输入验证码" v-model="accountForm.code" @keyup.native.enter="doLogin">
                <template slot="append">
                  <div class="validate-width"></div>
                  <div class="validate-img" :style="{backgroundImage:'url('+ validateImg +')'}" @click="getValidateImg"></div>
                </template>
              </el-input>
            </el-form-item>
            <el-button type="primary" style="width:100%;" @click="doLogin" :loading="loading">登 录</el-button>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="手机号码登录" name="second">
          <el-form :model="phoneForm" :rules="phoneRules" ref="phoneForm" label-position="left" label-width="0px" style="padding-top: 7px">
            <el-form-item prop="phone">
              <el-input type="text" auto-complete="off" placeholder="请输手机号" v-model="phoneForm.phone"></el-input>
            </el-form-item>
            <el-form-item prop="code">
              <el-input placeholder="请输验证码" v-model="phoneForm.code" class="input-with-select">
                <el-button slot="append" @click="getCode">{{codeText}}</el-button>
              </el-input>
            </el-form-item>
            <el-button type="primary" style="width:100%;" @click="doLogin" :loading="loading">登 录</el-button>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!--<form  method="post" id="hideForm" action="/j_spring_security_check">-->
      <!--<input type="hidden" name="j_username" id="j_username"  />-->
      <!--<input type="hidden" name="j_password" id="j_password"/>-->
    <!--</form>-->
    <!-- <p style="text-align: center;margin: 48px;font-size: 14px;color: #ccc;">2018 © </p> -->
  </div>
</template>

<script>
import api from '../utils/api'
export default {
  data () {
    return {
      accountForm: {
        account: '',
        pwd: '',
        type: 0,
        sessionId: '',
        code: '',
      },
      accountRules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
      },
      codeText: '获取验证码',
      codeState: true,
      time: 60,
      interval: '',
      phoneForm: {
        phone: '',
        code: '',
        type: 1,
      },
      phoneRules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
      },
      remember: false,
      loading: false,
      validateImg: '',
      activeName: 'first'
    }
  },
  created () {
      this.getValidateImg()
//    if (sessionStorage.uuid) {
//      this.getValidateImg()
//    } else {
//      let charStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', uuid = ''
//      for(let i = 0; i < 32; i ++){
//        let index = Math.round(Math.random() * (charStr.length-1))
//        uuid += charStr.substring(index,index+1)
//      }
//      sessionStorage.uuid = uuid

//    }
  },
  mounted(){
  
  },
  updated(){
      
  },
  methods: {
    doLogin(){
        const self = this;
        this.$refs['accountForm'].validate((valid) => {
            if (!valid) {
                return ;
            }
            self.$post("/login/ajaxLoginValidator",{
                ...self.accountForm
            }).then(res =>{
                if(res.resultCode != 200){
                    self.$message.error(res.resultMsg);
                    return ;
                }
                window.location.href = "/index.html";
            })
        });
//      if (this.activeName == 'first'){
//        this.$refs['accountForm'].validate((valid) => {
//          if (valid) {
//            this.loading = true;
//              $("#j_username").val(this.accountForm.account) ;
//              $("#j_password").val($.md5(this.accountForm.pwd));
//              $("#code").val(this.accountForm.code);
//              $("#type").val(this.accountForm.type);
//              $("#sessionId").val(this.accountForm.sessionId);
//              $("#hideForm").submit();
//          }
//        })
//      } else if (this.activeName == 'second') {
//        this.$refs['phoneForm'].validate((valid) => {
//          if (valid) {
//            this.loading = true
//            this.$post(api.host + '/login/login', this.phoneForm).then(data => {
//              this.loading = false
//              if (data.resultCode == '200') {
//                sessionStorage.sysUser = JSON.stringify(data.resultData.user)
//                sessionStorage.menus = JSON.stringify(data.resultData.router)
//                sessionStorage.roleElement = JSON.stringify(data.resultData.roleElement)
//                this.$router.push({path: '/pageHome'})
//              } else {
//                this.$message.error(data.resultMsg)
//              }
//            })
//          }
//        })
//      }
    },
    getValidateImg () {
      this.$post('/login/getCode', {
//        sessionId: sessionStorage.uuid,
//        d: Math.random()
      }).then(data => {
        this.validateImg = data
      })
    },
    getCode () {
      if (!(/^[1]\d{10}$/.test(this.phoneForm.phone))) {
        this.$message.error('请输入正确的手机号')
        return
      }
      let _vue = this
      if (this.codeState) {
        this.codeState = false
        _vue.wait()
        this.interval = setInterval(_vue.wait, 1000)
        this.$post(api.host + '/login/getSmsCode', {
          phone: this.phoneForm.phone
        }).then(data => {
          if (data.resultCode == 200) {
            this.$message.success('获取成功')
          } else {
            this.$message.error(data.resultMsg)
          }
        })
      }
    },
    wait (){
      if (this.time == 0) {
        clearInterval(this.interval)
        this.codeText = '获取验证码'
        this.time = 60
        this.interval = ''
        this.codeState = true
      } else {
        this.codeText = this.time.toString()
        this.time += -1
      }
    },
  },
  watch: {
    
  },
}
</script>

<style lang="less" scoped>
.login-container {
  border-radius: 5px;
  background-clip: padding-box;
  margin: 180px auto 0;
  width: 350px;
  padding: 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  .title {
    margin: 0px auto 20px auto;
    text-align: center;
    color: #505458;
  }
}
.validate-width {
  width: 56px;
}
.validate-img {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>