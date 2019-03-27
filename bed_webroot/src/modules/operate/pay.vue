<template>
  <div>
    <div class="page-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/pageHome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>运营管理</el-breadcrumb-item>
        <el-breadcrumb-item>支付管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <div class="el-tabs--border-card">
        <div class="el-tabs__content">
          <el-form :inline="true" :model="searchForm" ref="searchForm" size="small" class="demo-form-inline">
            <el-form-item label="" prop="userPhone">
              <el-input v-model="searchForm.userPhone" clearable placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="" prop="payStatus">
              <el-select v-model="searchForm.payStatus" placeholder="请选择支付状态">
                <el-option label="未支付" :value="0"></el-option>
                <el-option label="已支付" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="payType">
              <el-select v-model="searchForm.payType" placeholder="请选择支付类型">
                <el-option label="订单付款" :value="0"></el-option>
                <el-option label="订单退款" :value="1"></el-option>
                <el-option label="押金付款" :value="2"></el-option>
                <el-option label="押金退款" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="operatorId">
              <el-select v-model="searchForm.operatorId" clearable placeholder="请选择所属运营商" style="width:100%">
                <el-option v-for="(item,$index) in operator" :key="$index" :label="item.oName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="date">
              <el-date-picker v-model="searchForm.date" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button @click="resetSearchForm('searchForm')">重置</el-button>
              <el-button type="primary" @click="getData(1)">查询</el-button>
              <el-button type="primary" @click="exportData" v-if="btnRole.exp">导出</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="dataList.objList" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="userPhone" label="用户手机号" min-width="80"></el-table-column>
            <el-table-column prop="serialNum" label="流水号" min-width="80"></el-table-column>
            <el-table-column prop="money" label="金额" min-width="80"></el-table-column>
            <el-table-column prop="payStatus" label="支付状态" min-width="80">
              <template slot-scope="scope">
                <template v-if="scope.row.payStatus == 0">未支付</template>
                <template v-if="scope.row.payStatus == 1">已支付</template>
              </template>
            </el-table-column>
            <el-table-column prop="payType" label="支付类型" min-width="80">
              <template slot-scope="scope">
                <template v-if="scope.row.payType == 0">订单付款</template>
                <template v-if="scope.row.payType == 1">订单退款</template>
                <template v-if="scope.row.payType == 2">押金付款</template>
                <template v-if="scope.row.payType == 3">押金退款</template>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="支付时间" width="180"></el-table-column>
            <el-table-column prop="remark" label="备注" min-width="80"></el-table-column>
            <el-table-column prop="opName" label="运营商名称" min-width="80"></el-table-column>
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
export default {
  props: {
    isCollapse: Boolean,
  },
  data () {
    return {
      loading: true,
      searchForm: {
        userPhone: '',
        payStatus: '',
        payType: '',
        operatorId: '',
        date: '',
      },
      page: 1,
      rows: 10,
      dataList: '',
      operator: '',
      btnRole:{
        exp: false,
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
    if (roleElement.pay) {
      for (let i in roleElement.pay) {
        if (roleElement.pay[i].servlet == 'exportExcelForCapitalFlows') {
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
     /* let beginDate = '', endDate = ''
      if (this.searchForm.date && this.searchForm.date.length == 2) {
        beginDate = this.searchForm.date[0]
        endDate = this.searchForm.date[1]
      }*/
      this.page = val
      this.loading = true
      this.$postByForm(api.host + '/operate/queryCapitalFlows', {
        pageNum: this.page,
        pageSize: this.rows,
        userPhone: this.searchForm.userPhone,
        payStatus: this.searchForm.payStatus,
        payType: this.searchForm.payType,
        operatorId: this.searchForm.operatorId,
        date: this.searchForm.date,
      }).then(data => {
        this.dataList = data.resultData
        this.loading = false
      })
    },
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
      this.getData(1)
    },
    exportData () {
     /* let beginDate = '', endDate = ''
      if (this.searchForm.date && this.searchForm.date.length == 2) {
        beginDate = this.searchForm.date[0]
        endDate = this.searchForm.date[1]
      }*/
      this.$postByExport(api.host + '/operate/exportExcelForCapitalFlows', {
        userPhone: this.searchForm.userPhone,
        payStatus: this.searchForm.payStatus,
        payType: this.searchForm.payType,
        operatorId: this.searchForm.operatorId,
        date: this.searchForm.date,
      }).then(data => {
        var blob = data
        var reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = function (e) {
          var downloadElement = document.createElement('a')
          var href = e.target.result
          downloadElement.href = href
          downloadElement.download = '支付管理-'+getNowFormatDate()+'.xlsx'
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