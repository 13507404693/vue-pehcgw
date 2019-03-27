<template>
  <div class="container">
    <el-menu :default-active="$route.path" :collapse="isCollapse" background-color="#011529" text-color="hsla(0,0%,100%,.65)" active-text-color="#fff" class="side-nav" :unique-opened="true" :router="true">
      <div class="logo">
        <p v-show="!isCollapse">领歌云康</p>
      </div>
      <el-submenu v-for="(item,index) in menus" :key="item.id" :index="item.path" class="hover-item">
        <template slot="title">
          <i class="el-l-icon" :class="item.meta.icon"></i>
          <span>{{item.meta.title}}</span>
        </template>
        <template v-for="child in item.children">
          <el-menu-item class="hover-item" :class="{'my-active' : $route.path == ('/' + child.path)}" :key="child.id" :index="('/' + child.path)">{{child.meta.title}}</el-menu-item>
        </template>
      </el-submenu>
    </el-menu>
    <div class="right">
      <header>
        <i class="anticon" :class="{'el-icon-arrow-right': isCollapse, 'el-icon-arrow-left': !isCollapse}" @click="collapse"></i>
        <el-menu mode="horizontal" text-color="rgba(0,0,0,.65)">
          <el-submenu index="1">
            <template slot="title">{{sysUser.realName}}</template>
            <el-menu-item index="1-1" @click="toPersonal">账户信息</el-menu-item>
            <el-menu-item index="1-2" @click="dialogVisible = true">修改密码</el-menu-item>
            <el-menu-item index="1-3" @click="logout">退出登陆</el-menu-item>
          </el-submenu>
        </el-menu>
      </header>
      <div class="content">
        <router-view :isCollapse="isCollapse"/>
        <!-- <p class="copyright">2018 © leagoohealth.com - 深圳有限公司版权所有. 备案号：粤ICP备1121212号-1</p> -->
      </div>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogVisible" width="30%">
      <el-form :model="passwordForm" status-icon :rules="passwordRules" ref="passwordForm" label-width="100px">
        <el-form-item label="原始密码" prop="oldPwd">
          <el-input type="password" v-model="passwordForm.oldPwd" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input type="password" v-model="passwordForm.newPwd" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkNewPwd">
          <el-input type="password" v-model="passwordForm.checkNewPwd" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPasswordForm('passwordForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '../utils/api'
export default {
  data () {
    let validatePass = (rule, value, callback) => {
      if (value !== this.passwordForm.newPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    let validatePassLength = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度不能小于六位!'))
      } else {
        callback()
      }
    }
    return {
      isCollapse: false,
      menus: [],
      sysUser: '',
      dialogVisible: false,
      passwordForm: {
        oldPwd: '',
        newPwd: '',
        checkNewPwd: ''
      },
      passwordRules: {
        oldPwd: [
          { required: true, message: '请输入原始密码', trigger: 'blur' },
        ],
        newPwd:[
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validatePassLength, trigger: 'blur' }
        ],
        checkNewPwd:[
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePassLength, trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      },
    }
  },
  created () {
    console.log(localStorage.isCollapse  )
    this.isCollapse = localStorage.isCollapse ? JSON.parse(localStorage.isCollapse) : false;
 
    if (sessionStorage.menus) {
      this.menus = JSON.parse(sessionStorage.menus)
      this.sysUser = JSON.parse(sessionStorage.sysUser)
    }
  },
  mounted () {
  
  },
  updated () {
  },
  methods: {
    collapse () {
      this.isCollapse = !this.isCollapse
      localStorage.isCollapse = this.isCollapse
    },
    logout (done) {
      this.$confirm('确认退出？').then(_ =>{
        sessionStorage.clear()
        this.$router.push({path: '/login'})
      }).catch(_ => { })
    },
    toPersonal () {
      this.$router.push({path: '/personal'})
    },
    submitPasswordForm (formName) {
      this.$refs[formName].validate((valid) =>{
        if (valid){
          this.$postByForm(api.host + '/self/updatePwd', {oldPwd: this.passwordForm.oldPwd, newPwd: this.passwordForm.newPwd}).then(data => {
            if (data.resultCode == 200) {
              this.$message.success('修改成功')
              this.$refs[formName].resetFields()
              this.dialogVisible = false
            }else{
              this.$message.error(data.resultMsg)
            }
          })
        } else { return false }
      })
    },
  },
  watch: {
    
  }
}
</script>

<style lang="less" scoped>
.copyright {
  font-size: 13px;
  text-align: center;
  color: #999;
  padding: 10px;
}
</style>