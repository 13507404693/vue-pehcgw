<template>
  <div>
    <div class="page-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/pageHome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>结算管理</el-breadcrumb-item>
        <el-breadcrumb-item>待处理结算申请</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <div class="el-tabs--border-card">
        <div class="el-tabs__content">
          <el-form :inline="true" :model="searchForm" ref="searchForm" size="small" class="demo-form-inline">
            <el-form-item label="" prop="status">
              <el-select v-model="searchForm.status" placeholder="请选择状态">
                <el-option label="申请中" :value="0"></el-option>
                <el-option label="已完成" :value="1"></el-option>
                <el-option label="未通过" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="date">
              <el-date-picker v-model="searchForm.date" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="" prop="operatorId">
              <el-select v-model="searchForm.operatorId" clearable placeholder="请选择所属运营商" style="width:100%">
                <el-option v-for="(item,$index) in operator" :key="$index" :label="item.oName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button @click="resetSearchForm('searchForm')">重置</el-button>
              <el-button type="primary" @click="getData(1)">查询</el-button>
              <el-button type="primary" @click="exportData" v-if="btnRole.exp">导出</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="dataList.objList" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="account" label="账号" min-width="80"></el-table-column>
            <el-table-column prop="rName" label="姓名" min-width="80"></el-table-column>
            <el-table-column prop="oName" label="运营商名" min-width="80"></el-table-column>
            <el-table-column prop="startTime" label="开始日期" width="100">
              <template slot-scope="scope">
                {{scope.row.startTime.split(' ')[0]}}
              </template>
            </el-table-column>
            <el-table-column prop="endTime" label="结束日期" width="100">
              <template slot-scope="scope">
                {{scope.row.endTime.split(' ')[0]}}
              </template>
            </el-table-column>
            <el-table-column prop="totalMoney" label="销售金额(元)" min-width="80"></el-table-column>
            <el-table-column prop="totalDay" label="结算天数" min-width="80"></el-table-column>
            <el-table-column prop="balanceMoney" label="结算金额(元)" min-width="80"></el-table-column>
            <el-table-column prop="branchMoney" label="分成金额(元)" min-width="80"></el-table-column>
            <el-table-column prop="status" label="状态" min-width="80">
              <template slot-scope="scope">
                <template v-if="scope.row.status == 0">申请中</template> 
                <template v-if="scope.row.status == 1">已完成</template> 
                <template v-if="scope.row.status == 2">未通过</template> 
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="申请日期" width="100">
              <template slot-scope="scope">
                {{scope.row.createTime.split(' ')[0]}}
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" min-width="80"></el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-button @click="modify(scope.row)" type="text" size="small" v-if="btnRole.update">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination style="margin-top:10px" @current-change="getData" :current-page.sync="page" @size-change="sizeChange" :page-size="rows" :page-sizes="[10, 20, 30, 40]" :total="dataList.totalCount" background layout="total, sizes, prev, pager, next"></el-pagination>
        </div>
      </div>
    </div>
    <el-dialog title="结算" :visible.sync="modifyDialogVisible" width="30%">
      <el-form :model="modifyForm" status-icon :rules="addRules" ref="modifyForm" label-width="100px">
        <el-form-item label="状态" prop="status">
          <el-select v-model="modifyForm.status" placeholder="请选择状态" style="width: 100%;">
            <el-option label="申请中" :value="0"></el-option>
            <el-option label="已完成" :value="1"></el-option>
            <el-option label="未通过" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="3" placeholder="请输入备注" v-model="modifyForm.remark"></el-input>
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
import getNowFormatDate from '../../common/date'

import check from '../../utils/check'
export default {
  props: {
    isCollapse: Boolean,
  },
  data () {
    return {
      loading: true,
      searchForm: {
        date: '',
        status: '',
        operatorId: '',
      },
      page: 1,
      rows: 10,
      dataList: '',
      addRules: {
        status: [
          { required: true, message: '请选择状态', trigger: 'status' },
        ],
      },
      modifyDialogVisible: false,
      modifyForm: {
        id: '',
        status: '',
        remark: '',
      },
      operator: '',
      btnRole: {
        exp: false,
        update: false,
      }
    }
  },
  created () {
    if (sessionStorage.rows) {
      this.rows = parseInt(sessionStorage.rows)
    }
    this.$postByForm(api.host + '/comm/queryOperatorForSelect').then(data => {
      this.operator = data.resultData
    })
    this.getData(1)
    let roleElement = JSON.parse(sessionStorage.roleElement)
    if (roleElement.pendingBalance) {
      for (let i in roleElement.pendingBalance) {
        if (roleElement.pendingBalance[i].servlet == 'updateBalance') {
          this.btnRole.update = true
        }
        if (roleElement.pendingBalance[i].servlet == 'exportExcelForBalanceManager') {
          this.btnRole.exp = true
        }
      }
    }
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
      this.$postByForm(api.host + '/balance/queryBalanceByManager', {
        pageNum: this.page,
        pageSize: this.rows,
        status: this.searchForm.status,
        date: this.searchForm.date,
        operatorId: this.searchForm.operatorId,
      }).then(data => {
        this.dataList = data.resultData
        this.loading = false
      })
    },
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
      this.getData(1)
    },
    modify (data) {
      this.modifyForm.id = data.id
      this.modifyForm.status = data.status
      this.modifyForm.remark = data.remark
      this.modifyDialogVisible = true
    },
    submitModify (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$postByForm(api.host + '/balance/updateBalance', this.modifyForm).then(data => {
            if (data.resultCode == 200) {
              this.getData(this.page)
              this.$refs[formName].resetFields()
              this.$message.success('操作成功')
              this.modifyDialogVisible = false
            } else {
              this.$message.error(data.resultMsg)
              this.modifyDialogVisible = false
            }

          })
        } else { return false }
      })
    },
    exportData () {
      this.$postByExport(api.host + '/balance/exportExcelForBalanceManager', {
        status: this.searchForm.status,
        date: this.searchForm.date,
        operatorId: this.searchForm.operatorId,
      }).then(data => {
        if (data.resultCode == 200) {
          var blob = data
          var reader = new FileReader()
          reader.readAsDataURL(blob)
          reader.onload = function (e) {
            var downloadElement = document.createElement('a')
            var href = e.target.result
            downloadElement.href = href
            downloadElement.download = '待处理结算申请-'+getNowFormatDate()+'.xlsx'
            downloadElement.click()
            window.URL.revokeObjectURL(href)
          }
        } else {
          this.$message.error(data.resultMsg)
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