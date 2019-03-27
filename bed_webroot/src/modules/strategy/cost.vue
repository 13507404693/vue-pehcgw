<template>
  <div>
    <div class="page-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/pageHome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>运营策略</el-breadcrumb-item>
        <el-breadcrumb-item>费用策略</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <div class="el-tabs--border-card">
        <div class="el-tabs__content">
          <el-form :inline="true" :model="searchForm" ref="searchForm" size="small" class="demo-form-inline">
            <el-form-item label="" prop="Operator">
              <el-select v-model="searchForm.operatorId" clearable placeholder="请选所属运营商">
                <el-option v-for="(item,$index) in operators" :key="$index" :label="item.oName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getData(1)">查询</el-button>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="addDialogVisible = true" v-if="btnRole.addOrUpdate">添加</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="dataList.objList" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="sName" label="策略名称" min-width="80"></el-table-column>
            <el-table-column prop="operatorName" label="所属代理" min-width="80"></el-table-column>
            <el-table-column prop="price" label="收费金额(元)/小时" min-width="80"></el-table-column>
            <el-table-column prop="maxSum" label="每天消费总金额封顶(元)" min-width="80"></el-table-column>
            <el-table-column prop="hNum" label="绑定医院数量" min-width="80"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" min-width="80"></el-table-column>
            <el-table-column label="操作" width="160">
              <template slot-scope="scope">
                <el-button @click="modify(scope.row)" type="text" size="small" v-if="btnRole.addOrUpdate">修改</el-button>
                <el-button @click="showBind(scope.row)" type="text" size="small" v-if="btnRole.addOrUpdate">绑定医院</el-button>
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
        <el-form-item label="策略名称" prop="sName">
          <el-input v-model="addForm.sName" clearable placeholder="请输入策略名称"></el-input>
        </el-form-item>
        <el-form-item label="收费金额" prop="price">
          <el-input v-model="addForm.price" clearable placeholder="请输入收费金额"></el-input>
        </el-form-item>
        <el-form-item label="每天消费总金额封顶(元)" prop="maxSum">
          <el-input-number v-model="addForm.maxSum" type="number"  clearable placeholder="每天消费总金额封顶"><span>0表示不限制</span></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改" :visible.sync="modifyDialogVisible" width="30%">
      <el-form :model="modifyForm" status-icon :rules="addRules" ref="modifyForm" label-width="100px">
        <el-form-item label="策略名称" prop="sName">
          <el-input v-model="modifyForm.sName" clearable placeholder="请输入策略名称"></el-input>
        </el-form-item>
        <el-form-item label="收费金额" prop="price">
          <el-input v-model="modifyForm.price" clearable placeholder="请输入收费金额"></el-input>
        </el-form-item>
        <el-form-item label="每天消费总金额封顶(元)" prop="maxSum">
          <el-input-number  v-model="modifyForm.maxSum" type="number" clearable placeholder="每天消费总金额封顶"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitModify('modifyForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="绑定医院" :visible.sync="bindDialogVisible" width="660px">
      <div style="text-align: center">
        <el-transfer v-model="selectHospital" :data="hospital" :titles="['可绑定医院', '已绑定医院']" filterable style="text-align: left; display: inline-block">
          <span slot-scope="{ option }">{{ option.label }}</span>
        </el-transfer>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bindDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitBind">确 定</el-button>
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
        operatorId:'',
      },
      page: 1,
      rows: 10,
      dataList: '',
      addDialogVisible: false,
      operators:[],
      addForm: {
        sName: '',
        price: '',
        maxSum:0,
      },
      addRules: {
        sName: [
          { required: true, message: '请输入策略名称', trigger: 'blur' },
        ],
        price: [
          { required: true, message: '请输入收费金额', trigger: 'blur' },
          { validator: check.num, trigger: 'blur' },
        ],
      },
      modifyDialogVisible: false,
      modifyForm: {
        id: '',
        sName: '',
        price: '',
        maxSum:'',
      },
      bindDialogVisible: false,
      hospital: [],
      selectHospital: [],
      strategyId: '',
      btnRole:{
        addOrUpdate: false,
        del: false,
      }
    }
  },
  created () {
    this.$postByForm(api.host + '/comm/queryOperatorForSelect').then(data => {
      this.operators = data.resultData
    })
    if (sessionStorage.rows) {
      this.rows = parseInt(sessionStorage.rows)
    }
    this.getData(1)
    let roleElement = JSON.parse(sessionStorage.roleElement)
    if (roleElement.cost) {
      for (let i in roleElement.cost) {
        if (roleElement.cost[i].servlet == 'addOrUpdateCostStrategy') {
          this.btnRole.addOrUpdate = true
        }
        if (roleElement.cost[i].servlet == 'delCostStrategy') {
          this.btnRole.del = true
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
    getData (val){
      this.page = val
      this.loading = true
      this.$postByForm(api.host + '/strategy/queryCostStrategy', {
        pageNum: this.page,
        pageSize: this.rows,
        operatorId:this.searchForm.operatorId,
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
        this.$postByForm(api.host + '/strategy/delCostStrategy', {id: data.id}).then(data => {
          if (data.resultCode == 200) {
            this.getData(this.page)
            this.$message.success('删除成功')
          }else {
            this.$message.error(data.resultMsg)
          }

        })
      }).catch(_ => { })
    },
    submitAdd (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$postByForm(api.host + '/strategy/addOrUpdateCostStrategy', this.addForm).then(data => {
            if (data.resultCode == 200) {
              this.getData(this.page)
              this.$refs[formName].resetFields()
              this.$message.success('保存成功')
              this.addDialogVisible = false
            }else {
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
      this.modifyDialogVisible = true
    },
    submitModify (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$postByForm(api.host + '/strategy/addOrUpdateCostStrategy', this.modifyForm).then(data => {
            if (data.resultCode == 200) {
              this.getData(this.page)
              this.$refs[formName].resetFields()
              this.$message.success('保存成功')
              this.modifyDialogVisible = false
            }else {
              this.$message.error(data.resultMsg)
              this.modifyDialogVisible = false
            }

          })
        } else { return false }
      })
    },
    showBind (data) {
      this.$postByForm(api.host + '/comm/selectCostHospital', {strategyId: data.id}).then(res => {
        this.hospital = res.resultData
        for (let i in this.hospital) {
          if (this.hospital[i].isData) {
            this.selectHospital.push(this.hospital[i].key)
          }
        }
      })
      this.strategyId = data.id
      this.bindDialogVisible = true
    },
    submitBind () {
      this.$postByForm(api.host + '/strategy/addCostHospital', {
        ids: this.selectHospital.join(','),
        strategyId: this.strategyId,
      }).then(data => {
        this.getData(this.page)
        this.$message.success('保存成功')
        this.bindDialogVisible = false
      })
    }
  },
  watch: {

  }
}
</script>

<style lang="less">

</style>