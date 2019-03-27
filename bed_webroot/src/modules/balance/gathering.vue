<template>
  <div>
    <div class="page-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/pageHome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>结算管理</el-breadcrumb-item>
        <el-breadcrumb-item>收款设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <div class="el-tabs--border-card">
        <div class="el-tabs__content">
          <el-form :inline="true" :model="searchForm" ref="searchForm" size="small" class="demo-form-inline">
            <el-form-item label="" prop="account">
              <el-input v-model="searchForm.account" clearable placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="resetSearchForm('searchForm')">重置</el-button>
              <el-button type="primary" @click="getData(1)">查询</el-button>
              <el-button type="primary" @click="addDialogVisible = true">添加</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="dataList.objList" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="account" label="登录账号" min-width="80"></el-table-column>
            <el-table-column prop="rName" label="真实姓名" min-width="80"></el-table-column>
            <el-table-column prop="roleName" label="角色" width="120"></el-table-column>
            <el-table-column prop="deptName" label="所在部门" min-width="80"></el-table-column>
            <el-table-column prop="hIds" label="负责医院" min-width="80">
              <template slot-scope="scope">
                {{showHospital(scope.row.hIds)}}
              </template>
            </el-table-column>
            <el-table-column prop="oName" label="所属运营商" width="120"></el-table-column>
            <el-table-column prop="operatorId" label="所属运营商级别" width="120"></el-table-column>
            <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
            <el-table-column prop="wxName" label="微信" min-width="80"></el-table-column>
            <el-table-column prop="wxOpenid" label="微信绑定" min-width="80"></el-table-column>
            <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
            <el-table-column prop="status" label="状态" min-width="80">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="changeStatus(scope.row)"></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="modify(scope.row)" type="text" size="small">修改</el-button>
                <el-button @click="submitDel(scope.row)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination style="margin-top:10px" @current-change="getData" :current-page.sync="page" @size-change="sizeChange" :page-size="rows" :page-sizes="[10, 20, 30, 40]" :total="dataList.totalCount" background layout="total, sizes, prev, pager, next"></el-pagination>
        </div>
      </div>
    </div>
    <el-dialog title="添加" :visible.sync="addDialogVisible" width="60%">
      <el-form :model="addForm" status-icon :rules="addRules" ref="addForm" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="登录账号" prop="account">
              <el-input v-model="addForm.account" clearable placeholder="请输入登录账号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责医院" prop="hospitalIds">
              <el-select v-model="addForm.hospitalIds" multiple placeholder="请选择负责医院" style="width:100%">
                <el-option v-for="(item,$index) in hospitals" :key="$index" :label="item.hName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="登录密码" prop="pwd">
              <el-input v-model="addForm.pwd" clearable placeholder="请输入登录密码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="roleId">
              <el-select v-model="addForm.roleId" clearable placeholder="请选择角色" style="width:100%">
                <el-option v-for="(item,$index) in hospitals" :key="$index" :label="item.hName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="真实姓名" prop="rName">
              <el-input v-model="addForm.rName" clearable placeholder="请输入真实姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属部门" prop="deptId">
              <el-select v-model="addForm.deptId" clearable placeholder="请选所属部门" style="width:100%">
                <el-option v-for="(item,$index) in department" :key="$index" :label="item.dName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="微信号" prop="wxName">
              <el-input v-model="addForm.wxName" clearable placeholder="请输入微信号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="addForm.phone" clearable placeholder="请输入手机号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email" clearable placeholder="请输入邮箱"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改" :visible.sync="modifyDialogVisible" width="60%">
      <el-form :model="modifyForm" status-icon :rules="addRules" ref="modifyForm" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="登录账号" prop="account">
              <el-input v-model="modifyForm.account" clearable placeholder="请输入登录账号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责医院" prop="hospitalIds">
              <el-select v-model="modifyForm.hospitalIds" multiple placeholder="请选择负责医院" style="width:100%">
                <el-option v-for="(item,$index) in hospitals" :key="$index" :label="item.hName" :value="item.id.toString()"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="登录密码" prop="pwd">
              <el-input v-model="modifyForm.pwd" clearable placeholder="请输入登录密码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="roleId">
              <el-select v-model="modifyForm.roleId" clearable placeholder="请选择角色" style="width:100%">
                <el-option v-for="(item,$index) in hospitals" :key="$index" :label="item.hName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="真实姓名" prop="rName">
              <el-input v-model="modifyForm.rName" clearable placeholder="请输入真实姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属部门" prop="deptId">
              <el-select v-model="modifyForm.deptId" clearable placeholder="请选所属部门" style="width:100%">
                <el-option v-for="(item,$index) in department" :key="$index" :label="item.dName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="微信号" prop="wxName">
              <el-input v-model="modifyForm.wxName" clearable placeholder="请输入微信号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="modifyForm.phone" clearable placeholder="请输入手机号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="modifyForm.email" clearable placeholder="请输入邮箱"></el-input>
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
      loading: true,
      searchForm: {
        account: '',
      },
      page: 1,
      rows: 10,
      dataList: '',
      addDialogVisible: false,
      addForm: {
        account: '',
        hospitalIds: [],
        pwd: '',
        roleId: '',
        rName: '',
        roleId: '',
        deptId: '',
        wxName: '',
        phone: '',
        email: '',
      },
      addRules: {
        account: [
          { required: true, message: '请输入登录账号', trigger: 'blur' },
        ],
        hospitalIds: [
          { required: true, message: '请选择负责医院', trigger: 'change' },
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        roleId: [
          { required: true, message: '请选择角色', trigger: 'change' },
        ],
        deptId: [
          { required: true, message: '请选择部门', trigger: 'change' },
        ],
        rName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
        ],
      },
      modifyDialogVisible: false,
      modifyForm: {
        id: '',
        account: '',
        hospitalIds: [],
        pwd: '',
        roleId: '',
        rName: '',
        roleId: '',
        deptId: '',
        wxName: '',
        phone: '',
        email: '',
      },
      hospitals: [],
      department: [],
    }
  },
  created () {
    if (sessionStorage.rows) {
      this.rows = parseInt(sessionStorage.rows)
    }
    this.$postByForm(api.host + '/comm/queryHospitalsForSelect').then(data => {
      this.hospitals = data.resultData
    })
    this.$postByForm(api.host + '/comm/queryDeptForSelect').then(data => {
      this.department = data.resultData
    })
    this.getData(1)
  },
  mounted () {
  
  },
  updated () {
    
  },
  methods: {
    sizeChange(val) {
      this.rows = val
      this.getData(1)
      sessionStorage.rows = val
    },
    getData (val) {
      this.page = val
      this.loading = true
      this.$postByForm(api.host + '/operator/queryEmployees', {
        pageNum: this.page,
        pageSize: this.rows,
        account: this.searchForm.account,
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
      this.$confirm('确认删除？').then(_ => {
        this.$postByForm(api.host + '/operator/delEmployees', {id: data.id}).then(data => {
          this.getData(this.page)
          this.$message.success('删除成功')
        })
      }).catch(_ => { })
    },
    submitAdd (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$postByForm(api.host + '/operator/addOrUpdateEmployees', this.addForm).then(data => {
            if (data.resultCode == 200) {
              this.getData(this.page)
              this.$refs[formName].resetFields()
              this.$message.success('保存成功')
              this.addDialogVisible = false
            } else {
              this.$message.error(data.resultMsg)
              this.addDialogVisible = false
            }


          })
        } else { return false }
      })
    },
    modify (data) {
      for (let i in this.modifyForm) {
        this.modifyForm[i] = data[i]
      }
      this.modifyForm.hospitalIds = data.hIds.split(',')
      this.modifyDialogVisible = true
    },
    submitModify (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$postByForm(api.host + '/operator/addOrUpdateEmployees', this.modifyForm).then(data => {
            if (data.resultCode == 200) {
              this.getData(this.page)
              this.$refs[formName].resetFields()
              this.$message.success('保存成功')
              this.modifyDialogVisible = false
            } else {
              this.$message.error(data.resultMsg)
              this.modifyDialogVisible = false
            }

          })
        } else { return false }
      })
    },
    changeStatus(data) {
      this.$postByForm(api.host + '/operator/addOrUpdateEmployees', {
        id: data.id,
        status: data.status
      }).then(data => {
        this.getData(this.page)
        this.$message.success('操作成功')
      })
    },
    showHospital (str) {
      let resultArr = [], arr = []
      if (str) {
        arr = str.split(',')
      }
      for (let i in this.hospitals) {
        for (let j in arr) {
          if (this.hospitals[i].id == arr[j]) {
            resultArr.push(this.hospitals[i].hName)
          }
        }
      }
      return resultArr.join(',')
    }
  },
  watch: {

  }
}
</script>

<style lang="less" scoped>

 
</style>