<template>
  <div>
    <div class="page-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/pageHome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>运营商</el-breadcrumb-item>
        <el-breadcrumb-item>运营商管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <div class="el-tabs--border-card">
        <div class="el-tabs__content">
          <el-form :inline="true" :model="searchForm" ref="searchForm" size="small" class="demo-form-inline">
            <el-form-item label="" prop="hName">
              <el-input v-model="searchForm.hName" clearable placeholder="请输入关键字"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="resetSearchForm('searchForm')">重置</el-button>
              <el-button type="primary" @click="getData(1)">查询</el-button>
              <el-button type="primary" @click="showAdd">添加</el-button>
            </el-form-item>
          </el-form>
          <!-- 表格上面的 hrader 部分是 v-tier组件 -->
          <v-tier :dataList="dataList.objList" v-loading="loading" @changeStatus="changeStatus" @modify="modify" @submitDel="submitDel"></v-tier>
          <!-- <el-table :data="dataList.objList" stripe style="width: 100%" v-loading="loading" class="no-padding">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-table :data="props.row.operators" style="width: 100%">
                  
                </el-table>
              </template>
            </el-table-column>
            <el-table-column prop="oName" label="运营商名称" width="110"></el-table-column>
            <el-table-column prop="account" label="登录账号" width="120"></el-table-column>
            <el-table-column prop="rName" label="真实姓名" width="80"></el-table-column>
            <el-table-column prop="licenseImage" label="营业执照" width="80">
              <div slot-scope="scope" class="img-w">
                <template v-if="scope.row.licenseImage">
                  <img :src="scope.row.licenseImage.split('||')[0]">
                </template>
              </div>
            </el-table-column>
            <el-table-column prop="level" label="等级" width="80"></el-table-column>
            <el-table-column prop="lLevel" label="下级代理数" width="100"></el-table-column>
            <el-table-column prop="oName" label="上级" width="180"></el-table-column>
            <el-table-column prop="bedNum" label="设备数" width="80"></el-table-column>
            <el-table-column prop="wxName" label="微信号" width="180"></el-table-column>
            <el-table-column prop="wxOpenid" label="微信绑定" width="120"></el-table-column>
            <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
            <el-table-column prop="phone" label="手机" width="120"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
            <el-table-column prop="extractPer" label="分成比" width="80"></el-table-column>
            <el-table-column prop="status" label="状态" width="80">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="changeStatus(scope.row)"></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="modify(scope.row)" type="text" size="small">修改</el-button>
                <el-button @click="submitDel(scope.row)" type="text" size="small">权限</el-button>
                <el-button @click="submitDel(scope.row)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table> -->
          <!-- 这一个自带的组件  -->
          <el-pagination style="margin-top:10px" @current-change="getData" :current-page.sync="page" @size-change="sizeChange" :page-size="rows" :page-sizes="[10, 20, 30, 40]" :total="dataList.totalCount" background layout="total, sizes, prev, pager, next"></el-pagination>
        </div>
      </div>
    </div>
    <el-dialog title="预览" :visible.sync="handlePreviewVisible" width="40%">
      <img :src="handlePreviewImage" style="margin: auto;display: block; max-width: 100%;">
    </el-dialog>
    <el-dialog title="添加" :visible.sync="addDialogVisible" width="80%">
      <el-form :model="addForm" status-icon :rules="addRules" ref="addForm" label-width="130px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="账户名" prop="account">
              <el-input v-model="addForm.account">
                <el-button slot="append" @click="createPwd" icon="el-icon-refresh"></el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="rName">
              <el-input v-model="addForm.rName" clearable placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="微信号" prop="wxName">
              <el-input v-model="addForm.wxName" clearable placeholder="请输入微信号"></el-input>
            </el-form-item>
            <el-form-item label="运营商名称" prop="oName">
              <el-input v-model="addForm.oName" clearable placeholder="没有公司则填写新增代理真实姓名"></el-input>
            </el-form-item>
            <el-form-item label="代理类型" prop="typeCode">
              <template>
                <el-radio v-model="addForm.typeCode" :label="1">企业</el-radio>
                <el-radio v-model="addForm.typeCode" :label="0">个人</el-radio>
              </template>
            </el-form-item>
            <el-form-item label="企业资质文件" prop="licenseImage" v-if="addForm.typeCode == '1'">
              <el-upload :on-preview="handlePreview" :on-remove="companyImageRemove" :on-success="companyImageSuccess" :action="host + '/comm/uploadImage'" :headers="headers" list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  <p style="line-height: 20px">公司营业执照，组织机构代码</p>
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item label="分成方式" prop="extractStatus">
              <template>
                <el-radio v-model="addForm.extractStatus" label="0">按固定比例</el-radio>
                <el-radio v-model="addForm.extractStatus" label="1">按月销售分段浮动</el-radio>
              </template>
            </el-form-item>
            <el-form-item label="提成比例" prop="extractPer" v-if="addForm.extractStatus == '0'">
              <el-input v-model="addForm.extractPer" clearable placeholder="请输入提成比例">
                <span slot="suffix">%&nbsp;</span>
              </el-input>
            </el-form-item>
            <el-form-item label="浮动比例" v-if="addForm.extractStatus == '1'">
              <el-row v-for="(item, index) in addForm.float" :key="'key' + index" style="margin-bottom: 22px;">
                <el-col :span="7">
                  <el-form-item label-width="0px" :prop="'float.' + index + '.low'" :rules="[{ validator: checkNum, trigger: 'blur' }]">
                    <el-input v-model="item.low" clearable placeholder="">
                      <span slot="suffix">元&nbsp;</span>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="text-align: center;">至</el-col>
                <el-col :span="7">
                  <el-form-item label-width="0px" :prop="'float.' + index + '.high'" :rules="[{ validator: checkNum, trigger: 'blur' }]">
                    <el-input v-model="item.high" clearable placeholder="">
                      <span slot="suffix">元&nbsp;</span>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1">&nbsp;</el-col>
                <el-col :span="7">
                  <el-form-item label-width="0px" :prop="'float.' + index + '.ratio'" :rules="[{ validator: checkNum, trigger: 'blur' }]">
                    <el-input v-model="item.ratio" clearable>
                      <span slot="suffix">%&nbsp;</span>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password" disabled></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="addForm.phone" clearable placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email" clearable placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item label="上级运营商" prop="parentId">
              <el-select v-model="addForm.parentId" clearable placeholder="请选择上级运营商" style="width:100%">
                <el-option v-for="(item,$index) in operator" :key="$index" :label="item.oName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="结算开户行" prop="bankName">
              <el-input v-model="addForm.bankName" clearable placeholder="请输入结算开户行"></el-input>
            </el-form-item>
            <el-form-item label="结算银行卡号" prop="bankNum">
              <el-input v-model="addForm.bankNum" clearable placeholder="请输入结算银行卡号"></el-input>
            </el-form-item>
            <el-form-item label="卡信息上传" prop="bankImage">
              <el-upload :on-preview="handlePreview" :on-remove="bankImageRemove" :on-success="bankImageSuccess" :action="host + '/comm/uploadImage'" :headers="headers" list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  <p style="line-height: 20px">1.公司账号加盖公司公章，拍照以图片方式提交<br>2.如果您是个人用户，写上收款账号并签名，拍照以图片方式提交</p>
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改" :visible.sync="modifyDialogVisible" width="80%">
      <el-form :model="modifyForm" status-icon :rules="addRules" ref="modifyForm" label-width="130px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="账户名" prop="account">
              <el-input v-model="modifyForm.account">
                <el-button slot="append" @click="createPwd" icon="el-icon-refresh"></el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="rName">
              <el-input v-model="modifyForm.rName" clearable placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="微信号" prop="wxName">
              <el-input v-model="modifyForm.wxName" clearable placeholder="请输入微信号"></el-input>
            </el-form-item>
            <el-form-item label="运营商名称" prop="oName">
              <el-input v-model="modifyForm.oName" clearable placeholder="没有公司则填写新增代理真实姓名"></el-input>
            </el-form-item>
            <el-form-item label="代理类型" prop="typeCode">
              <template>
                <el-radio v-model="modifyForm.typeCode" :label="1">企业</el-radio>
                <el-radio v-model="modifyForm.typeCode" :label="0">个人</el-radio>
              </template>
            </el-form-item>
            <el-form-item label="企业资质文件" prop="licenseImage" v-if="modifyForm.typeCode == '1'">
              <el-upload :file-list="licenseImageFile" :on-preview="handlePreview" :on-remove="companyImageRemove" :on-success="companyImageSuccess" :action="host + '/comm/uploadImage'" :headers="headers" list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  <p style="line-height: 20px">公司营业执照，组织机构代码</p>
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item label="分成方式" prop="extractStatus">
              <template>
                <el-radio v-model="modifyForm.extractStatus" label="0">按固定比例</el-radio>
                <el-radio v-model="modifyForm.extractStatus" label="1">按月销售分段浮动</el-radio>
              </template>
            </el-form-item>
            <el-form-item label="提成比例" prop="extractPer" v-if="modifyForm.extractStatus == '0'">
              <el-input v-model="modifyForm.extractPer" clearable placeholder="请输入提成比例">
                <span slot="suffix">%&nbsp;</span>
              </el-input>
            </el-form-item>
            <el-form-item label="浮动比例" v-if="modifyForm.extractStatus == '1'">
              <el-row v-for="(item, index) in modifyForm.float" :key="'key' + index" style="margin-bottom: 22px;">
                <el-col :span="7">
                  <el-form-item label-width="0px" :prop="'float.' + index + '.low'" :rules="[{ validator: checkNum, trigger: 'blur' }]">
                    <el-input v-model="item.low" clearable placeholder="">
                      <span slot="suffix">元&nbsp;</span>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="text-align: center;">至</el-col>
                <el-col :span="7">
                  <el-form-item label-width="0px" :prop="'float.' + index + '.high'" :rules="[{ validator: checkNum, trigger: 'blur' }]">
                    <el-input v-model="item.high" clearable placeholder="">
                      <span slot="suffix">元&nbsp;</span>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1">&nbsp;</el-col>
                <el-col :span="7">
                  <el-form-item label-width="0px" :prop="'float.' + index + '.ratio'" :rules="[{ validator: checkNum, trigger: 'blur' }]">
                    <el-input v-model="item.ratio" clearable>
                      <span slot="suffix">%&nbsp;</span>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="modifyForm.phone" clearable placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="modifyForm.email" clearable placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item label="上级运营商" prop="parentId">
              <el-select v-model="modifyForm.parentId" clearable placeholder="请选择上级运营商" style="width:100%" :disabled="modifyForm.parentId == 0">
                <el-option label="顶级" :value="0"></el-option>
                <el-option v-for="(item,$index) in operator" :key="$index" :label="item.oName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="结算开户行" prop="bankName">
              <el-input v-model="modifyForm.bankName" clearable placeholder="请输入结算开户行"></el-input>
            </el-form-item>
            <el-form-item label="结算银行卡号" prop="bankNum">
              <el-input v-model="modifyForm.bankNum" clearable placeholder="请输入结算银行卡号"></el-input>
            </el-form-item>
            <el-form-item label="卡信息上传" prop="bankImage">
              <el-upload :file-list="bankImageFile" :on-preview="handlePreview" :on-remove="bankImageRemove" :on-success="bankImageSuccess" :action="host + '/comm/uploadImage'" :headers="headers" list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  <p style="line-height: 20px">1.公司账号加盖公司公章，拍照以图片方式提交<br>2.如果您是个人用户，写上收款账号并签名，拍照以图片方式提交</p>
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitModify('modifyForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../utils/api'
import check from '../../utils/check'
export default {
  props: {
    isCollapse: Boolean,
  },
  data () {
    return {
      host: api.host,
      headers: {
        'Access-Token': JSON.parse(sessionStorage.sysUser).token
      },
      loading: true,
      searchForm: {
        hName: '',
      },
      page: 1,
      rows: 10,
      dataList: '',
      addDialogVisible: false,
      addForm: {
        account: '',
        rName: '',
        wxName: '',
        oName: '',
        typeCode: '',
        licenseImage: [],
        extractStatus: '',
        extractPer: '',
        float: [{
          low: '',
          high: '',
          ratio: '',
        },{
          low: '',
          high: '',
          ratio: '',
        },{
          low: '',
          high: '',
          ratio: '',
        }],
        password: '888888',
        phone: '',
        email: '',
        parentId: '',
        bankName: '',
        bankNum: '',
        bankImage: [],
      },
      addRules: {
        rName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        oName: [
          { required: true, message: '请输入运营商名称', trigger: 'blur' },
        ],
        typeCode: [
          { required: true, message: '请选择代理类型', trigger: 'change' },
        ],
        licenseImage: [
          { required: true, message: '请上传企业资质文件', trigger: 'blur' },
        ],
        parentId: [
          { required: true, message: '请选择上级运营商', trigger: 'change' },
        ],
      },
      modifyDialogVisible: false,
      modifyForm: {
        id: '',
        account: '',
        rName: '',
        wxName: '',
        oName: '',
        typeCode: '',
        licenseImage: [],
        extractStatus: '',
        extractPer: '',
        float: [{
          low: '',
          high: '',
          ratio: '',
        },{
          low: '',
          high: '',
          ratio: '',
        },{
          low: '',
          high: '',
          ratio: '',
        }],
        password: '888888',
        phone: '',
        email: '',
        parentId: '',
        bankName: '',
        bankNum: '',
        bankImage: [],
      },
      handlePreviewVisible: false,
      handlePreviewImage: '',
      operator: [],
      licenseImageFile: [],
      bankImageFile: [],
    }
  },
  created () {
    this.$postByForm(api.host + '/comm/queryOperatorForSelect').then(data => {
      this.operator = data.resultData
    })
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
    checkNum: (rule, value, callback) => {
      if (!(value == '') && !(/^\d+(\.\d+)?$/.test(value))) {
        callback(new Error('请输入数字值'))
      } else {
        callback()
      }
    },
    showAdd (){
      this.addDialogVisible = true
      this.createPwd()
    },
    createPwd () {
      this.$postByForm(api.host + '/comm/getAccount').then(data => {
        if (this.addDialogVisible) {
          this.addForm.account = data.resultData
        } else if (this.modifyDialogVisible) {
          this.modifyForm.account = data.resultData
        }
      })
    },
    changeStatus(data) {
      this.$postByForm(api.host + '/operator/addOrUpdateOperator', {
        id: data.id,
        status: data.status
      }).then(data => {
        this.getData(this.page)
        this.$message.success('操作成功')
      })
    },
    sizeChange(val) {
      this.rows = val
      this.getData(1)
      sessionStorage.rows = val
    },
    getData (val) {
      this.page = val
      this.loading = true
      this.$postByForm(api.host + '/operator/queryOperators', {
        pageNum: this.page,
        pageSize: this.rows,
        hName: this.searchForm.hName,
      }).then(data => {
        this.dataList = data.resultData
        this.loading = false
      })
    },
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
      this.getData(1)
    },
    submitDel (data) {
      this.$confirm('确认启用/禁用？').then(_ => {
        this.$postByForm(api.host + '/hospital/delHospital', {id: data.id}).then(data => {
          if (data.resultCode == 200) {
            this.getData(this.page)
            this.$message.success('启用/禁用成功')
          }else {
            this.$message.error(data.resultMsg)
          }

        })
      }).catch(_ => { })
    },
    submitAdd (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addForm.licenseImage = this.addForm.licenseImage.join('||')
          this.addForm.bankImage = this.addForm.bankImage.join('||')
          let _arr = []
          if (this.addForm.extractStatus == '1') {
            for (let i in this.addForm.float) {
              if (this.addForm.float[i].low && this.addForm.float[i].high && this.addForm.float[i].ratio) {
                _arr.push(this.addForm.float[i].low + '-' + this.addForm.float[i].high + '-' + this.addForm.float[i].ratio)
              }
            }
            this.addForm.extractPer = _arr.join('||')
          }
          this.$postByForm(api.host + '/operator/addOrUpdateOperator', this.addForm).then(data => {
            if (data.resultCode == 200) {
              this.getData(this.page)
              this.$refs[formName].resetFields()
              this.$message.success('保存成功')
              this.addDialogVisible = false
            } else {
              this.addForm.licenseImage = this.addForm.licenseImage.split('||')
              this.addForm.bankImage = this.addForm.bankImage.split('||')
              this.$message.error(data.resultMsg)
            }
          })
        } else { return false }
      })
    },
    modify (data) {
      console.log(data)
      this.$postByForm(api.host + '/operator/selectOperatorById', {
        id: data.id
      }).then(res => {
        this.modifyForm.id = res.resultData.id
        this.modifyForm.account = res.resultData.account
        this.modifyForm.rName = res.resultData.rName
        this.modifyForm.wxName = res.resultData.wxName
        this.modifyForm.oName = res.resultData.oName
        this.modifyForm.typeCode = res.resultData.typeCode
        this.modifyForm.extractStatus = res.resultData.extractStatus
        this.modifyForm.extractPer = res.resultData.extractPer
        this.modifyForm.phone = res.resultData.phone
        this.modifyForm.email = res.resultData.email
        this.modifyForm.parentId = res.resultData.parentId
        this.modifyForm.bankName = res.resultData.bankName
        this.modifyForm.bankNum = res.resultData.bankNum
        this.modifyForm.licenseImage = []
        this.modifyForm.bankImage = []
        this.modifyDialogVisible = true
        this.licenseImageFile = []
        this.bankImageFile = []
        if (res.resultData.licenseImage) {
          let licenseImageList = res.resultData.licenseImage.split('||')
          for (let i in licenseImageList) {
            this.licenseImageFile.push({
              name: '企业资质图片' + (parseInt(i) + 1),
              url: licenseImageList[i]
            })
            this.modifyForm.licenseImage.push(licenseImageList[i])
          }
        }
        if (res.resultData.bankImage) {
          let bankImageList = res.resultData.bankImage.split('||')
          for (let i in bankImageList) {
            this.bankImageFile.push({
              name: '卡信息图片' + (parseInt(i) + 1),
              url: bankImageList[i]
            })
            this.modifyForm.bankImage.push(bankImageList[i])
          }
        }
        if (res.resultData.extractPer) {
          let extractPerArr = res.resultData.extractPer.split('||')
          for (let i=0; i<3; i++ ) {
            if (extractPerArr[i]) {
              this.modifyForm.float[i].low = extractPerArr[i].split('-')[0]
              this.modifyForm.float[i].high = extractPerArr[i].split('-')[1]
              this.modifyForm.float[i].ratio = extractPerArr[i].split('-')[2]
            } else {
              this.modifyForm.float[i].low = ''
              this.modifyForm.float[i].high = ''
              this.modifyForm.float[i].ratio = ''
            }
          }
        }
      })
    },
    submitModify (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.modifyForm.licenseImage = this.modifyForm.licenseImage.join('||')
          this.modifyForm.bankImage = this.modifyForm.bankImage.join('||')
          let _arr = []
          if (this.modifyForm.extractStatus == '1') {
            for (let i in this.modifyForm.float) {
              if (this.modifyForm.float[i].low && this.modifyForm.float[i].high && this.modifyForm.float[i].ratio) {
                _arr.push(this.modifyForm.float[i].low + '-' + this.modifyForm.float[i].high + '-' + this.modifyForm.float[i].ratio)
              }
            }
            this.modifyForm.extractPer = _arr.join('||')
          }
          this.$postByForm(api.host + '/operator/addOrUpdateOperator', this.modifyForm).then(data => {
            if (data.resultCode == 200) {
              this.getData(this.page)
              this.$refs[formName].resetFields()
              this.$message.success('保存成功')
              this.modifyDialogVisible = false
            } else {
              this.modifyForm.licenseImage = this.modifyForm.licenseImage.split('||')
              this.modifyForm.bankImage = this.modifyForm.bankImage.split('||')
              this.$message.error(data.resultMsg)
            }
          })
        } else { return false }
      })
    },
    record (data) {
      this.$postByForm(api.host + '/operate/queryBedUseHistory', {
        id: data.id
      }).then(res => {
        this.recordList = res.resultData
        this.recordDialogVisible = true
      })
    },
    handlePreview (file) {
      this.handlePreviewImage = file.url
      this.handlePreviewVisible = true
    },
    companyImageRemove (file, fileList) {
      if (this.addDialogVisible) {
        this.addForm.licenseImage = []
        for (let i in fileList) {
          this.addForm.licenseImage.push(fileList[i].url)
        }
      } else if (this.modifyDialogVisible) {
        this.modifyForm.licenseImage = []
        for (let i in fileList) {
          this.modifyForm.licenseImage.push(fileList[i].url)
        }
      }
    },
    bankImageRemove (file, fileList) {
      if (this.addDialogVisible) {
        this.addForm.bankImage = []
        for (let i in fileList) {
          this.addForm.bankImage.push(fileList[i].url)
        }
      } else if (this.modifyDialogVisible) {
        this.modifyForm.bankImage = []
        for (let i in fileList) {
          this.modifyForm.bankImage.push(fileList[i].url)
        }
      }
    },
    companyImageSuccess (res, file) {
      if (res.resultCode == 200) {
        if (this.addDialogVisible) {
          this.addForm.licenseImage.push(res.resultData)
        } else if (this.modifyDialogVisible) {
          this.modifyForm.licenseImage.push(res.resultData)
        }
      } else {
        this.$message.error(data.resultMsg)
      }
    },
    bankImageSuccess (res, file) {
      if (res.resultCode == 200) {
        if (this.addDialogVisible) {
          this.addForm.bankImage.push(res.resultData)
        } else if (this.modifyDialogVisible) {
          this.modifyForm.bankImage.push(res.resultData)
        }
      } else {
        this.$message.error(data.resultMsg)
      }
    },
  },
  watch: {

  }
}
</script>

<style lang="less" scoped>

</style>