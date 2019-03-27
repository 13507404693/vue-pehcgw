<template>
  <div>
    <div class="page-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/pageHome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>结算管理</el-breadcrumb-item>
        <el-breadcrumb-item>我的结算</el-breadcrumb-item>
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
            <el-form-item>
              <el-button @click="resetSearchForm('searchForm')">重置</el-button>
              <el-button type="primary" @click="getData(1)">查询</el-button>
              <el-button type="primary" @click="balance">申请结算</el-button>
              <el-button type="primary" @click="exportData" v-if="btnRole.exp">导出</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="dataList.objList" stripe style="width: 100%" v-loading="loading">
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
          </el-table>
          <el-pagination style="margin-top:10px" @current-change="getData" :current-page.sync="page" @size-change="sizeChange" :page-size="rows" :page-sizes="[10, 20, 30, 40]" :total="dataList.totalCount" background layout="total, sizes, prev, pager, next"></el-pagination>
        </div>
      </div>
    </div>
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
        status: '',
      },
      page: 1,
      rows: 10,
      dataList: '',
      btnRole: {
        exp: false
      }
    }
  },
  created () {
    if (sessionStorage.rows) {
      this.rows = parseInt(sessionStorage.rows)
    }
    this.getData(1)
    let roleElement = JSON.parse(sessionStorage.roleElement)
    if (roleElement.mybalance) {
      console.log(roleElement.mybalance)
      for (let i in roleElement.mybalance) {
        if (roleElement.mybalance[i].servlet == 'exportExcelForBalance') {
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
      this.$postByForm(api.host + '/balance/queryBalance', {
        pageNum: this.page,
        pageSize: this.rows,
        status: this.searchForm.status,
      }).then(data => {
        this.dataList = data.resultData
        this.loading = false
      })
    },
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
      this.getData(1)
    },
    balance () {
      this.$confirm('确认结算？').then(_ => {
        this.$postByForm(api.host + '/balance/addBalance').then(data => {
          this.getData(this.page)
          this.$message.success('结算成功')
        })
      }).catch(_ => { })
    },
    exportData () {
      this.$postByExport(api.host + '/balance/exportExcelForBalance', {
        status: this.searchForm.status,
      }).then(data => {
        var blob = data
        var reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = function (e) {
          var downloadElement = document.createElement('a')
          var href = e.target.result
          downloadElement.href = href
          downloadElement.download = '我的结算-'+getNowFormatDate()+'.xlsx'
          downloadElement.click()
          window.URL.revokeObjectURL(href)
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