<template>
  <div>
    <div class="page-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/pageHome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>运营管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <div class="el-tabs--border-card">
        <div class="el-tabs__content">
          <el-form :inline="true" :model="searchForm" ref="searchForm" size="small" class="demo-form-inline">
            <el-form-item label="" prop="strParam">
              <el-input v-model="searchForm.strParam" clearable placeholder="请输入手机号或昵称"></el-input>
            </el-form-item>
            <el-form-item label="" prop="operatorId">
              <el-select v-model="searchForm.operatorId" clearable placeholder="请选择所属运营商" style="width:100%">
                <el-option v-for="(item,$index) in operator" :key="$index" :label="item.oName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="arrears">
              <el-select v-model="searchForm.arrears" clearable placeholder="请选择是否欠费" style="width:100%">
                <el-option label="欠费" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button @click="resetSearchForm('searchForm')">重置</el-button>
              <el-button type="primary" @click="getData(1)">查询</el-button>
              <el-button type="primary" @click="exportData">导出</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="dataList.objList" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="nickname" label="用户昵称" min-width="80"></el-table-column>
            <el-table-column prop="phone" label="手机号码" min-width="80"></el-table-column>
            <el-table-column prop="deposit" label="押金(元)" min-width="80"></el-table-column>
            <el-table-column prop="total" label="累计消费金额(元)" min-width="80"></el-table-column>
            <el-table-column prop="createAddr" label="注册来源" min-width="80"></el-table-column>
            <el-table-column prop="createTime" label="注册时间" width="160"></el-table-column>
            <el-table-column prop="remark" label="备注" min-width="80"></el-table-column>
            <el-table-column prop="status" label="状态" width="60" v-if="btnRole.updateUser">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="changeStatus(scope.row)"></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160">
              <template slot-scope="scope">
                <el-button @click="record(scope.row)" type="text" size="small">使用记录</el-button>
                <el-button @click="refund(scope.row)" type="text" size="small" v-if="btnRole.refundMoney">退押金</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination style="margin-top:10px" @current-change="getData" :current-page.sync="page" @size-change="sizeChange" :page-size="rows" :page-sizes="[10, 20, 30, 40]" :total="dataList.totalCount" background layout="total, sizes, prev, pager, next"></el-pagination>
        </div>
      </div>
    </div>
    <el-dialog :title="userPhone + '-使用记录'" :visible.sync="recordDialogVisible" width="80%">
      <el-form :inline="true" :model="searchForm" ref="searchForm" size="small" class="demo-form-inline">
        <el-form-item>
          <el-button type="primary" @click="exportDetail">导出</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="recordList.objList" stripe style="width: 100%">
        <el-table-column prop="startTime" label="日期" width="160"></el-table-column>
        <el-table-column prop="userPhone" label="手机号" min-width="80"></el-table-column>
        <el-table-column prop="orderNo" label="订单号" min-width="80"></el-table-column>
        <el-table-column prop="startTime" label="开始时间" width="160"></el-table-column>
        <el-table-column prop="endTime" label="结束时间" width="160"></el-table-column>
        <el-table-column prop="useMin" label="使用时长(分)" min-width="80"></el-table-column>
        <el-table-column prop="payNum" label="消费金额(元)" width="100"></el-table-column>
        <el-table-column prop="payStatus" label="支付状态" min-width="80">
          <template slot-scope="scope">
            <template v-if="scope.row.payStatus == 0">未付款</template>
            <template v-if="scope.row.payStatus == 1">已付款</template>
            <template v-if="scope.row.payStatus == 2">已退款</template>
          </template>
        </el-table-column>
        <el-table-column prop="deviceNum" label="设备编号" min-width="80"></el-table-column>
        <el-table-column prop="hName" label="设备医院" min-width="80"></el-table-column>
      </el-table>
      <el-pagination style="margin-top:10px" @current-change="getDetailData" :current-page.sync="pageDetail" @size-change="sizeChangeDetail" :page-size="rowsDetail" :page-sizes="[10, 20, 30, 40]" :total="recordList.totalCount" background layout="total, sizes, prev, pager, next"></el-pagination>

    </el-dialog>
    <el-dialog title="退押金" :visible.sync="refundDialogVisible" width="30%">
      <el-form :model="refundForm" status-icon :rules="refundRules" ref="refundForm" label-width="100px">
        <el-form-item label="用户押金">
          <el-input v-model="refundData.deposit" clearable disabled></el-input>
        </el-form-item>
        <el-form-item label="未支付金额">
          <el-input v-model="refundData.payNum" clearable disabled></el-input>
        </el-form-item>
        <el-form-item label="可退金额">
          <el-input :value="(refundData.deposit - refundData.payNum)" clearable disabled></el-input>
        </el-form-item>
        <el-form-item label="退款金额" prop="refundNum">
          <el-input v-model="refundForm.refundNum" clearable placeholder="请输入退款金额"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="refundForm.remark" clearable placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel('refundForm')">取 消</el-button>
        <el-button type="primary" @click="submitRefund('refundForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../utils/api'
import check from '../../utils/check'
import getNowFormatDate from '../../common/date'
export default {
  props: {
    isCollapse: Boolean,
  },
  data () {
    let checkRefund = (rule, value, callback) => {
      console.log(this.refundData)
      if (value > (this.refundData.deposit - this.refundData.payNum)) {
        callback(new Error('不能超过可退金额'))
      } else {
        callback()
      }
    }
    return {
      loading: true,
      searchForm: {
        strParam: '',
        operatorId: '',
        arrears: '',
      },
      page: 1,
      rows: 10,
      pageDetail: 1,
      rowsDetail: 10,
      dataList: '',
      recordDialogVisible: false,
      recordList: [],
      refundDialogVisible: false,
      userUsedId:'',
      userPhone:'',
      refundForm: {
        id: '',
        refundNum: '',
        remark: '',
        type: 0,
      },
      refundRules: {
        refundNum: [
          { required: true, message: '请输入退款金额', trigger: 'blur' },
          { validator: check.num, trigger: 'blur' },
          { validator: checkRefund, trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' },
        ],
      },
      refundData: '',
      btnRole:{
        updateUser: false,
        refundMoney: false,
      },
      operator: '',
    }
  },
  created () {
    if (sessionStorage.rows) {
      this.rows = parseInt(sessionStorage.rows)
    }
    this.getData(1)
    this.$postByForm(api.host + '/comm/queryOperatorForSelect').then(data => {
      this.operator = data.resultData
    })
    let roleElement = JSON.parse(sessionStorage.roleElement)
    if (roleElement.user) {
      for (let i in roleElement.user) {
        if (roleElement.user[i].servlet == 'updateUser') {
          this.btnRole.updateUser = true
        }
        if (roleElement.user[i].servlet == 'refundMoney') {
          this.btnRole.refundMoney = true
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
      this.$postByForm(api.host + '/operate/queryUsers', {
        pageNum: this.page,
        pageSize: this.rows,
        strParam: this.searchForm.strParam,
        operatorId: this.searchForm.operatorId,
        arrears: this.searchForm.arrears,
      }).then(data => {
        this.dataList = data.resultData
        this.loading = false
      })
    },

    sizeChangeDetail(val) {
      this.rowsDetail = val
      this.getDetailData(1)
      sessionStorage.rows = val
    },
    getDetailData (val) {
      this.pageDetail = val
      this.$postByForm(api.host + '/operate/queryBedUseHistoryByUser', {
        pageNum: this.pageDetail,
        pageSize: this.rowsDetail,
        id:this.userUsedId
      }).then(data => {
        console.log(data)
        this.recordDialogVisible=true;
        this.recordList = data.resultData.page
      })
    },

    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
      this.getData(1)
    },
    record (data) {
      this.userUsedId=data.id;
      this.userPhone=data.phone;
      console.log(this.userPhone)
     // this.getDetailData(1)
      this.$postByForm(api.host + '/operate/queryBedUseHistoryByUser', {
        pageNum: this.pageDetail,
        pageSize: this.rowsDetail,
        id: data.id
      }).then(res => {
        this.recordDialogVisible=true;
        this.recordList = res.resultData.page;
      })
    },
    changeStatus(data) {
      this.$postByForm(api.host + '/operate/updateUser', {
        id: data.id,
        status: data.status
      }).then(data => {
        this.getData(this.page)
        this.$message.success('操作成功')
      })
    },
    refund (data) {
      this.$postByForm(api.host + '/operate/selectUserForRefund', {
        id: data.id
      }).then(res => {
        this.refundData = res.resultData
        this.refundForm.id = data.id
        this.refundDialogVisible = true
      })
    },
    submitRefund (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$postByForm(api.host + '/operate/refundMoney', this.refundForm).then(data => {
            this.getData(this.page)
            this.$refs[formName].resetFields()
            this.$message.success('退款成功')
            this.refundDialogVisible = false
          })
        } else { return false }
      })
    },
    exportData () {
      this.$postByExport(api.host + '/operate/exportExcelForUser', {
        strParam: this.searchForm.strParam,
        operatorId: this.searchForm.operatorId,
        arrears: this.searchForm.arrears,
      }).then(data => {
        var blob = data
        var reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = function (e) {
          var downloadElement = document.createElement('a')
          var href = e.target.result
          downloadElement.href = href
          downloadElement.download = '用户-'+getNowFormatDate()+'.xlsx'
          downloadElement.click()
          window.URL.revokeObjectURL(href)
        }
      })
    },
    exportDetail (data) {
      this.$postByExport(api.host + '/operate/exportExcelForUserDetail', {
        id: this.userUsedId
      }).then(data => {
        var blob = data
        var reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = function (e) {
          var downloadElement = document.createElement('a')
          var href = e.target.result
          downloadElement.href = href
          downloadElement.download = '用户使用详情-'+getNowFormatDate()+'.xlsx'
          downloadElement.click()
          window.URL.revokeObjectURL(href)
        }
      })
    },

    cancel (formName) {
      this.refundDialogVisible = false;
      this.getData(this.page)
      this.$refs[formName].resetFields()
    }
   },
  watch: {

  }
}
</script>

<style lang="less" scoped>

 
</style>