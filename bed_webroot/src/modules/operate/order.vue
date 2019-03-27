<template>
  <div>
    <div class="page-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/pageHome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>运营管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <div class="el-tabs--border-card">
        <div class="el-tabs__content">
          <el-form :inline="true" :model="searchForm" ref="searchForm" size="small" class="demo-form-inline">
            <el-form-item label="" prop="deviceNum">
              <el-input v-model="searchForm.deviceNum" clearable placeholder="请输入设备编号"></el-input>
            </el-form-item>
            <el-form-item label="" prop="hospitalId">
              <el-select v-model="searchForm.hospitalId" clearable placeholder="请选择所在医院" style="width:100%">
                <el-option v-for="(item,$index) in hospitals" :key="$index" :label="item.hName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
           <!-- <el-form-item label="" prop="lockStatus">
              <el-select v-model="searchForm.lockStatus" clearable placeholder="请选择锁机状态">
                <el-option label="已关锁" value="0"></el-option>
                <el-option label="未关锁" value="1"></el-option>
              </el-select>
            </el-form-item>-->
            <el-form-item label="" prop="payStatus">
              <el-select v-model="searchForm.payStatus" clearable placeholder="请选择支付状态">
                <el-option label="已支付" value="1"></el-option>
                <el-option label="未支付" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="oStatus">
              <el-select v-model="searchForm.oStatus" clearable placeholder="请选择订单状态">
                <el-option label="进行中" value="0"></el-option>
                <el-option label="已结束" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="overWay">
              <el-select v-model="searchForm.overWay" clearable placeholder="请选择结束方式">
                <el-option label="正常结束" value="0"></el-option>
                <el-option label="后台人工结束" value="1"></el-option>
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
            <el-table-column prop="userPhone" label="用户手机" width="120"></el-table-column>
            <el-table-column prop="orderNo" label="订单号" min-width="80"></el-table-column>
            <el-table-column prop="deviceNum" label="设备编号" min-width="80"></el-table-column>
            <el-table-column prop="hName" label="所在医院" min-width="160"></el-table-column>
            <el-table-column prop="startTime" label="开始时间" width="170"></el-table-column>
            <el-table-column prop="endTime" label="结束时间" width="170"></el-table-column>
            <el-table-column prop="minNum" label="使用时长(分)" width="120"></el-table-column>
            <el-table-column prop="oStatus" label="订单状态" min-width="80">
              <template slot-scope="scope">
                <template v-if="scope.row.oStatus == 1">已结束</template>
                <template v-else>进行中</template>
              </template>
            </el-table-column>
           <!-- <el-table-column prop="lockStatus" label="门锁状态" min-width="80">
              <template slot-scope="scope">
                <template v-if="scope.row.lockStatus == 0">已关锁</template>
                <template v-if="scope.row.lockStatus == 1">未关锁</template>
              </template>
            </el-table-column>-->
            <el-table-column prop="overWay" label="结束方式" min-width="80">
              <template slot-scope="scope">
                <template v-if="scope.row.overWay == 1">后台人工结束</template>
                <template v-if="scope.row.overWay == 0">正常结束</template>
              </template>
            </el-table-column>
            <el-table-column prop="noteTime" label="蓝牙锁开关时间" width="170">
              <template slot-scope="scope">
                <div>{{scope.row.noteStartTime}}</div>
                <div>{{scope.row.noteEndTime}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="payMoney" label="计费金额(元)" width="100"></el-table-column>
            <el-table-column prop="payStatus" label="支付状态" min-width="80">
              <template slot-scope="scope">
                <template v-if="scope.row.payStatus == 0">未付款</template>
                <template v-if="scope.row.payStatus == 1">已付款</template>
                <template v-if="scope.row.payStatus == 2">已退款</template>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" min-width="120"></el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template slot-scope="scope">
                <el-button @click="overOrder(scope.row)" type="text" size="small" v-if="scope.row.oStatus == 0 && btnRole.update">结束订单</el-button>
                <el-button @click="refund(scope.row)" type="text" size="small" v-if="scope.row.payStatus == 1 && btnRole.refund">退款</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination style="margin-top:10px" @current-change="getData" :current-page.sync="page" @size-change="sizeChange" :page-size="rows" :page-sizes="[10, 20, 30, 40]" :total="dataList.totalCount" background layout="total, sizes, prev, pager, next"></el-pagination>
        </div>
      </div>
    </div>
    <el-dialog title="退款" :visible.sync="refundDialogVisible" width="30%">
      <el-form :model="refundForm" status-icon :rules="refundRules" ref="refundForm" label-width="100px">
        <el-form-item label="订单金额">
          <el-input v-model="refundData.payMoney" clearable disabled></el-input>
        </el-form-item>
        <el-form-item label="退款金额" prop="refundNum">
          <el-input v-model="refundForm.refundNum" clearable placeholder="请输入退款金额"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="refundForm.remark" clearable placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="refundDialogVisible = false">取 消</el-button>
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
      if (value > this.refundData.payMoney) {
        callback(new Error('不能超过可退金额'))
      } else {
        callback()
      }
    }
    return {
      loading: true,
      searchForm: {
        deviceNum: '',
        hospitalId: '',
        lockStatus: '',
        payStatus: '',
        oStatus: '',
        overWay: '',
        operatorId: '',
        date: '',
      },
      page: 1,
      rows: 10,
      dataList: '',
      refundDialogVisible: false,
      refundForm: {
        id: '',
        refundNum: '',
        remark: '',
        type: 1,
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
      btnRole: {
        update: false,
        refund: false,
        exp: false,
      },
      hospitals: [],
      operator: [],
    }
  },
  created () {
    if (sessionStorage.rows) {
      this.rows = parseInt(sessionStorage.rows)
    }
    this.$postByForm(api.host + '/comm/queryHospitalsForSelect').then(data => {
      this.hospitals = data.resultData
    })
    this.$postByForm(api.host + '/comm/queryOperatorForSelect').then(data => {
      this.operator = data.resultData
    })
    this.getData(1)
    let roleElement = JSON.parse(sessionStorage.roleElement)
    if (roleElement.order) {
      for (let i in roleElement.order) {
        if (roleElement.order[i].servlet == 'updateOrderById') {
          this.btnRole.update = true
        }
        if (roleElement.order[i].servlet == 'refundMoney') {
          this.btnRole.refund = true
        }
        if (roleElement.order[i].servlet == 'exportExcelForOrder') {
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
      this.$postByForm(api.host + '/operate/queryOrders', {
        pageNum: this.page,
        pageSize: this.rows,
        deviceNum: this.searchForm.deviceNum,
        hospitalId: this.searchForm.hospitalId,
        lockStatus: this.searchForm.lockStatus,
        payStatus: this.searchForm.payStatus,
        oStatus: this.searchForm.oStatus,
        overWay: this.searchForm.overWay,
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
    refund (data) {
      this.$postByForm(api.host + '/operate/selectOrderById', {
        id: data.id
      }).then(res => {
        if (res.resultCode == 200) {
          this.refundData = res.resultData
          this.refundForm.id = data.id
          this.refundDialogVisible = true
        }else {
          this.$message.error(res.resultMsg)
          this.refundDialogVisible  = false
        }

      })
    },
    submitRefund (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$postByForm(api.host + '/operate/refundMoney', this.refundForm).then(data => {
            if (data.resultCode == 200) {
              this.getData(this.page)
              this.$refs[formName].resetFields()
              this.$message.success('退款成功')
              this.refundDialogVisible = false
            }else{
              this.$message.error(data.resultMsg);
            }

          })
        } else { return false }
      })
    },
    overOrder (data) {
      this.$confirm('结束订单将会结束本次计费，确认结束订单？').then(_ => {
        this.$postByForm(api.host + '/operate/updateOrderById', {id: data.id}).then(data => {
          this.getData(this.page)
          this.$message.success('操作成功')
        })
      }).catch(_ => { })
    },
    exportData () {
      this.$postByExport(api.host + '/operate/exportExcelForOrder', {
        deviceNum: this.searchForm.deviceNum,
      }).then(data => {
        var blob = data
        var reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = function (e) {
          var downloadElement = document.createElement('a')
          var href = e.target.result
          downloadElement.href = href
          downloadElement.download = '订单管理-'+getNowFormatDate()+'.xlsx'
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