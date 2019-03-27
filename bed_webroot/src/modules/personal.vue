<template>
  <div>
    <div class="page-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/pageHome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>账户信息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <div class="el-tabs--border-card">
        <div class="el-tabs__content">
          <p>我的账户信息</p>
          <div style="width: 600px;margin: 10px auto">
            <el-form ref="form" label-width="120px">
              <el-form-item label="姓名">
                <el-input :value="dataList.rName"></el-input>
              </el-form-item>
              <el-form-item label="登陆账号">
                <el-input v-model="dataList.account">
                  <el-button slot="append" icon="el-icon-edit" style="color: #00C0FF" @click="modifyAccount"></el-button>
                </el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="dataList.email">
                  <el-button slot="append" icon="el-icon-edit" style="color: #00C0FF" @click="modifyEmail"></el-button>
                </el-input>
              </el-form-item>
              <el-form-item label="手机号">
                <el-input v-model="dataList.phone">
                  <el-button slot="append" icon="el-icon-edit" style="color: #00C0FF" @click="modifyPhone"></el-button>
                </el-input>
              </el-form-item>
              <el-form-item label="运营商名称">
                <el-input :value="dataList.oName"></el-input>
              </el-form-item>
              <el-form-item label="微信号">
                <el-input :value="dataList.wxName"></el-input>
              </el-form-item>
              <el-form-item label="分成方式">
                <el-input v-if="dataList.extractStatus == 0" value="按固定比例"></el-input>
                <el-input v-if="dataList.extractStatus == 1" value="按月销售分段浮动"></el-input>
              </el-form-item>
              <el-form-item label="提成比例" v-if="dataList.extractStatus == '0'">
                <el-input v-model="dataList.extractPer">
                  <span slot="suffix">%&nbsp;</span>
                </el-input>
              </el-form-item>
              <el-form-item label="浮动比例" v-if="dataList.extractStatus == '1' && float.length>0">
                <el-row v-for="(item, index) in float" :key="'key' + index" class="margin-b">
                  <el-col :span="7">
                    <el-form-item label-width="0px" :prop="'float.' + index + '.low'">
                      <el-input v-model="item.low" placeholder="">
                        <span slot="suffix">元&nbsp;</span>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2" style="text-align: center;">至</el-col>
                  <el-col :span="7">
                    <el-form-item label-width="0px" :prop="'float.' + index + '.high'">
                      <el-input v-model="item.high" placeholder="">
                        <span slot="suffix">元&nbsp;</span>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="1">&nbsp;</el-col>
                  <el-col :span="7">
                    <el-form-item label-width="0px" :prop="'float.' + index + '.ratio'">
                      <el-input v-model="item.ratio">
                        <span slot="suffix">%&nbsp;</span>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="结算开户行">
                <el-input :value="dataList.bankName"></el-input>
              </el-form-item>
              <el-form-item label="结算银行卡号">
                <el-input :value="dataList.bankNum"></el-input>
              </el-form-item>
              <el-form-item label="卡信息" v-if="bankImageFile.length > 0">
                <el-upload class="no-upload" :on-preview="handlePreview" :file-list="bankImageFile" list-type="picture" action=""></el-upload>
              </el-form-item>
              <el-form-item label="企业资质文件" v-if="dataList.typeCode == '1' && licenseImageFile.length > 0">
                <el-upload class="no-upload" :on-preview="handlePreview" :file-list="licenseImageFile" list-type="picture" action=""></el-upload>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="预览" :visible.sync="handlePreviewVisible" width="40%">
      <img :src="handlePreviewImage" style="margin: auto;display: block; max-width: 100%;">
    </el-dialog>
    <el-dialog title="修改手机号" :visible.sync="modifyDialogVisible" width="30%">
      <el-form label-width="100px">
        <el-form-item label="验证码" prop="rName">
          <el-input v-model="code" clearable placeholder="请输入收到的验证码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitModify">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '../utils/api'
import check from '../utils/check'
export default {
  props: {
    isCollapse: Boolean,
  },
  data () {
    return {
      loading: true,
      dataList: '',
      handlePreviewImage: '',
      handlePreviewVisible: false,
      bankImageFile: [],
      licenseImageFile: [],
      modifyDialogVisible: false,
      float: [],
      code: '',
      phone: '',
    }
  },
  created () {
    if (sessionStorage.rows) {
      this.rows = parseInt(sessionStorage.rows)
    }
    this.getData(1)
  },
  mounted () {
  
  },
  updated () {
    
  },
  methods: {
    getData () {
      this.loading = true
      this.$postByForm(api.host + '/self/selectMyData').then(data => {
        this.dataList = data.resultData
        if (data.resultData.extractPer) {
          let extractPerArr = data.resultData.extractPer.split('||')
          for (let i in extractPerArr) {
            this.float.push({
              low: extractPerArr[i].split('-')[0],
              high: extractPerArr[i].split('-')[1],
              ratio: extractPerArr[i].split('-')[2]
            })
          }
        }
        this.bankImageFile = []
        if (data.resultData.bankImage) {
          let bankImageList = data.resultData.bankImage.split('||')
          for (let i in bankImageList) {
            this.bankImageFile.push({
              name: '卡信息图片' + (parseInt(i) + 1),
              url: bankImageList[i]
            })
          }
        }
        this.licenseImageFile = []
        if (data.resultData.licenseImage) {
          let licenseImageList = data.resultData.licenseImage.split('||')
          for (let i in licenseImageList) {
            this.licenseImageFile.push({
              name: '企业资质文件' + (parseInt(i) + 1),
              url: licenseImageList[i]
            })
          }
        }
        this.phone = data.resultData.phone
        this.loading = false
      })
    },
    handlePreview (file) {
      this.handlePreviewImage = file.url
      this.handlePreviewVisible = true
    },
    modifyAccount () {
      if (!this.dataList.account) {
        this.$message.error('登录账号不能为空')
        return
      }
      this.$confirm('确认修改登录账号？').then(_ => {
        this.$postByForm(api.host + '/self/updateAccount', {account: this.dataList.account}).then(data => {
          if (data.resultCode == 200) {
            this.getData(this.page)
            this.$message.success('修改成功')
          } else {
            this.$message.error(data.resultMsg)
          }
          this.getData()
        })
      }).catch(_ => { })
    },
    modifyEmail () {
      this.$confirm('确认修改邮箱？').then(_ => {
        this.$postByForm(api.host + '/self/updateAccount', {email: this.dataList.email}).then(data => {
          if (data.resultCode == 200) {
            this.getData(this.page)
            this.$message.success('修改成功')
          } else {
            this.$message.error(data.resultMsg)
          }
          this.getData()
        })
      }).catch(_ => { })
    },
    modifyPhone () {
      if (!(/^[1]\d{10}$/.test(this.dataList.phone))) {
        this.$message.error('请输入正确的手机号')
        return
      }
      if (this.phone == this.dataList.phone) {
        this.$message.error('不能修改为同一个手机号')
        return
      }
      this.$confirm('确认修改手机号为' + this.dataList.phone + '？').then(_ => {
        this.$post(api.host + '/login/getSmsCode', {
          phone: this.dataList.phone
        }).then(data =>{
          if (data.resultCode == 200) {
            this.modifyDialogVisible = true
          } else {
            this.$message.error(data.resultMsg)
          }
        })
      }).catch(_ => { })
    },
    submitModify () {
      this.$postByForm(api.host + '/self/updatePhone', {
        phone: this.dataList.phone,
        code: this.code
      }).then(data => {
        if (data.resultCode == 200) {
          this.getData()
          this.$message.success('修改成功')
          this.modifyDialogVisible = false
        } else {
          this.$message.error(data.resultMsg)
          this.modifyDialogVisible = false
        }
      })
    },
  },
  watch: {

  }
}
</script>

<style lang="less">
.margin-b{
  margin-bottom: 22px;
}
.margin-b:last-child{
  margin-bottom: 0px;
}
.no-upload{
  .el-upload--picture{
    display: none;
  }
  .el-upload-list__item-status-label{
    display: none!important;
  }
  .el-icon-close{
    display: none!important;
  }
  .el-icon-close-tip{
    display: none!important;
  }
}
</style>