<template>
  <div>
    <div class="page-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/pageHome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>运营管理</el-breadcrumb-item>
        <el-breadcrumb-item>设备管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <div class="el-tabs--border-card">
        <div class="el-tabs__content">
          <el-form :inline="true" :model="searchForm" ref="searchForm" size="small" class="demo-form-inline">
            <!-- <el-form-item label="" prop="deviceNum">
              <el-input v-model="searchForm.deviceNum" clearable placeholder="请输入设备编号"></el-input>
            </el-form-item> -->
            <el-form-item>
              <!-- <el-button @click="resetSearchForm('searchForm')">重置</el-button>
              <el-button type="primary" @click="getData(1)">查询</el-button> -->
              <el-button type="primary" @click="addDialogVisible = true" v-if="btnRole.addOrUpdate">添加</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="dataList.objList" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="rName" label="角色名称" min-width="80"></el-table-column>
            <el-table-column prop="remark" label="备注" min-width="80"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
            <el-table-column label="操作" width="140">
              <template slot-scope="scope" v-if="scope.row.isPublic == 0">
                <el-button @click="modify(scope.row)" type="text" size="small" v-if="btnRole.addOrUpdate">修改</el-button>
                <el-button @click="showRole(scope.row)" type="text" size="small" v-if="btnRole.auth">权限</el-button>
                <el-button @click="submitDel(scope.row)" type="text" size="small" v-if="btnRole.del">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination style="margin-top:10px" @current-change="getData" :current-page.sync="page" @size-change="sizeChange" :page-size="rows" :page-sizes="[10, 20, 30, 40]" :total="dataList.totalCount" background layout="total, sizes, prev, pager, next"></el-pagination>
        </div>
      </div>
    </div>
    <el-dialog title="添加" :visible.sync="addDialogVisible" width="30%">
      <el-form :model="addForm" status-icon :rules="addRules" ref="addForm" label-width="100px">
        <el-form-item label="角色名称" prop="rName">
          <el-input v-model="addForm.rName" clearable placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="addForm.remark" clearable placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改" :visible.sync="modifyDialogVisible" width="30%">
      <el-form :model="modifyForm" status-icon :rules="addRules" ref="modifyForm" label-width="100px">
        <el-form-item label="角色名称" prop="rName">
          <el-input v-model="modifyForm.rName" clearable placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="modifyForm.remark" clearable placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitModify('modifyForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="权限" :visible.sync="roleDialogVisible" width="30%">
      <!-- default-expand-all -->
      <el-tree ref="tree" :data="roleList" show-checkbox node-key="id" :default-checked-keys="role">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ data.title }}</span>
        </span>
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRole">确 定</el-button>
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
        deviceNum: '',
      },
      page: 1,
      rows: 10,
      dataList: '',
      addDialogVisible: false,
      addForm: {
        rName: '',
        remark: '',
      },
      addRules: {
        rName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
      },
      modifyDialogVisible: false,
      modifyForm: {
        id: '',
        rName: '',
        remark: '',
        isPublic: '',
      },
      roleDialogVisible: false,
      roleList: [],
      role: [],
      roleId: '',
      btnRole:{
        addOrUpdate: false,
        del: false,
        auth: false
      }
    }
  },
  created () {
    if (sessionStorage.rows) {
      this.rows = parseInt(sessionStorage.rows)
    }
    this.getData(1)
    let roleElement = JSON.parse(sessionStorage.roleElement)
    if (roleElement.rolePage) {
      for (let i in roleElement.rolePage) {
        if (roleElement.rolePage[i].servlet == 'addOrUpdateRole') {
          this.btnRole.addOrUpdate = true
        }
        if (roleElement.rolePage[i].servlet == 'delRole') {
          this.btnRole.del = true
        }
        if (roleElement.rolePage[i].servlet == 'addRoleAuthority') {
          this.btnRole.auth = true
        }
      }
    }
  },
  mounted () {
  
  },
  updated () {
    
  },
  methods: {
    showDeptPart (id) {
      if (id) {
        this.$postByForm(api.host + '/comm/queryDeptPartForSelect', {
          id: id
        }).then(data => {
          this.deptPart = data.resultData
        })
      }
    },
    sizeChange(val) {
      this.rows = val
      this.getData(1)
      sessionStorage.rows = val
    },
    getData (val) {
      this.page = val
      this.loading = true
      this.$postByForm(api.host + '/role/queryRolesForPage', {
        pageNum: this.page,
        pageSize: this.rows,
        deviceNum: this.searchForm.deviceNum,
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
        this.$postByForm(api.host + '/role/delRole', {id: data.id}).then(data => {
          if (data.resultCode == 200) {
            this.getData(this.page)
            this.$message.success('删除成功')
          }else{
            this.$message.error(data.resultMsg)
          }

        })
      }).catch(_ => { })
    },
    submitAdd (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$postByForm(api.host + '/role/addOrUpdateRole', this.addForm).then(data => {
            if(data.resultCode==200){
              this.getData(this.page)
              this.$refs[formName].resetFields()
              this.$message.success('保存成功')
              this.addDialogVisible = false
            }else{
              this.$message.error(data.resultMsg);
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
      this.modifyDialogVisible = true
    },
    submitModify (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$postByForm(api.host + '/role/addOrUpdateRole', this.modifyForm).then(data => {
            if (data.resultCode == 200) {
              this.getData(this.page)
              this.$refs[formName].resetFields()
              this.$message.success('修改成功')
              this.modifyDialogVisible = false
            } else {
              this.$message.error(data.resultMsg)
              this.modifyDialogVisible = false
            }
          })
        } else { return false }
      })
    },
    showRole (data) {
      this.roleId = data.id
      this.$postByForm(api.host + '/role/queryPageElementByRoleId', {
        roleId: data.id
      }).then(data => {
        this.roleList = data.resultData.elements
        this.role = data.resultData.selectElements
        this.roleDialogVisible = true
      })
    },
    submitRole () {
      let checked = this.$refs.tree.getCheckedNodes(), arr = []
      for (let i in checked) {
        if (!checked[i].children) {
          arr.push(checked[i].id)
        }
      }
      this.$postByForm(api.host + '/role/addRoleAuthority', {
        roleId: this.roleId,
        elementIds: arr.join(','),
      }).then(data => {
        if (data.resultCode == 200) {
          this.getData(this.page)
          this.$message.success('保存成功')
          this.roleDialogVisible = false
        } else {
          this.$message.error(data.resultMsg)
          this.roleDialogVisible = false
        }
      })
    },
  },
  watch: {

  }
}
</script>

<style lang="less" scoped>

 
</style>