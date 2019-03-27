<template>
  <div>
    <div class="page-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/pageHome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>运营商</el-breadcrumb-item>
        <el-breadcrumb-item>部门管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <div class="el-tabs--border-card">
        <div class="el-tabs__content">
          <el-form :inline="true" size="small" class="demo-form-inline">
            <el-form-item>
              <el-button type="primary" @click="append('top')">添加</el-button>
            </el-form-item>
          </el-form>
          <div class="tree-wrap">
            <div class="tree-item" v-for="item,index in dataList" :key="index">
              <div class="tree-con">
                <el-tree :data="item" :props="treeProps" node-key="id" default-expand-all :expand-on-click-node="false">
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                    <span>
                      <el-button type="text" size="mini" icon="el-icon-edit" @click="() => edit(data)"></el-button>
                      <el-button type="text" size="mini" icon="el-icon-plus" @click="() => append(data)"></el-button>
                      <el-button type="text" size="mini" icon="el-icon-delete" @click="() => remove(node, data)"></el-button>
                    </span>
                  </span>
                </el-tree>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="添加" :visible.sync="addDialogVisible" width="30%">
      <el-form :model="addForm" status-icon :rules="addRules" ref="addForm" label-width="100px">
        <el-form-item label="上级部门" prop="parentName">
          <el-input v-model="addForm.parentName" clearable disabled></el-input>
        </el-form-item>
        <el-form-item label="部门名称" prop="dName">
          <el-input v-model="addForm.dName" clearable placeholder="请输入部门名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改" :visible.sync="modifyDialogVisible" width="30%">
      <el-form :model="modifyForm" status-icon :rules="addRules" ref="modifyForm" label-width="100px">
        <el-form-item label="部门名称" prop="dName">
          <el-input v-model="modifyForm.dName" clearable placeholder="请输入部门名称"></el-input>
        </el-form-item>
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
      dataList: [],
      topId: '',
      topName: '',
      treeProps: {
        label: 'dName',
        children: 'deptList',
      },
      addDialogVisible: false,
      addForm: {
        parentName: '',
        parentId: '',
        dName: '',
      },
      addRules: {
        dName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
        ],
      },
      modifyDialogVisible: false,
      modifyForm: {
        id: '',
        dName: '',
        parentId: '',
      }
    }
  },
  created () {
    this.getData()
  },
  mounted () {
  
  },
  updated () {
    
  },
  methods: {
    getData (val) {
      this.page = val
      this.loading = true
      this.$postByForm(api.host + '/operator/queryDept').then(data => {
        this.topName = data.resultData[0].dName
        this.topId = data.resultData[0].id
        let arr = []
        for (let i in data.resultData[0].deptList) {
          arr.push([data.resultData[0].deptList[i]])
        }
        this.dataList = arr
        this.loading = false
      })
    },
    edit(data) {
      this.modifyForm.dName = data.dName
      this.modifyForm.id = data.id
      this.modifyForm.parentId = data.parentId
      this.modifyDialogVisible = true
    },
    append(data) {
      console.info(data)
      if (data == 'top') {
        this.addForm.parentName = this.topName
        this.addForm.parentId = this.topId
      } else {
        this.addForm.parentName = data.dName
        this.addForm.parentId = data.id
      }
      this.addDialogVisible = true
    },
    remove(node, data) {
      this.$confirm('确认删除？').then(_ => {
        this.$postByForm(api.host + '/operator/delDept', {id: data.id}).then(data => {
          if (data.resultCode == 200) {
            this.getData()
            this.$message.success('删除成功')
          } else {
            this.$message.error(data.resultMsg)
          }
        })
      }).catch(_ => { })
    },
    submitAdd (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$postByForm(api.host + '/operator/addOrUpdateDept', this.addForm).then(data => {

            if (data.resultCode == 200) {
              this.getData()
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
    submitModify(formName){
      this.$refs[formName].validate((valid) =>{
        if (valid) {
          this.$postByForm(api.host + '/operator/addOrUpdateDept', this.modifyForm).then(data => {
            if (data.resultCode == 200) {
              this.getData()
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
    }
  },
  watch: {

  }
}
</script>

<style lang="less">
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.tree-wrap{
  display: flex;
  flex-wrap: wrap;
  .tree-item{
    min-width: 310px;
    height: 380px;
    margin: 0 20px 20px 0;
    border: 1px solid #d1d1d1;
    box-sizing: border-box;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    z-index: 999;
    .el-tree-node__content {
      height: 50px!important;
    }
    .tree-con{
      height: 380px;
      overflow-y: auto;
    }
  }
  .tree-item:hover{
    box-shadow: 0 0 20px #d1d1d1;
  }
}
</style>