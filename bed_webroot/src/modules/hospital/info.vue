<template>
  <div>
    <div class="page-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/pageHome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>医院管理</el-breadcrumb-item>
        <el-breadcrumb-item>医院信息</el-breadcrumb-item>
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
              <!-- <el-button @click="resetSearchForm('searchForm')">重置</el-button> -->
              <el-button type="primary" @click="getData(1)">查询</el-button>
              <el-button type="primary" @click="add">添加</el-button>
              <el-button type="primary" @click="exportData" v-if="btnRole.exp">导出</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="dataList.objList" stripe style="width: 100%" v-loading="loading">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-table :data="props.row.departments" border style="width: 100%" v-loading="loading">
                  <el-table-column prop="dName" label="科室名称" min-width="80"></el-table-column>
                  <el-table-column prop="hName" label="所属医院" min-width="80"></el-table-column>
                  <el-table-column prop="updateTime" label="修改时间" width="160"></el-table-column>
                  <el-table-column prop="createPerson" label="添加人" min-width="80"></el-table-column>
                  <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                      <el-button @click="modifyOffice(scope.row,props.row.id)" type="text" size="small">修改</el-button>
                      <el-button @click="submitDelOffice(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column prop="hName" label="医院名称" min-width="80"></el-table-column>
            <el-table-column prop="proName" label="所在省" min-width="80"></el-table-column>
            <el-table-column prop="cityName" label="所在市" min-width="80"></el-table-column>
            <el-table-column prop="detailAddr" label="详细地址" min-width="80"></el-table-column>
            <el-table-column prop="operatorName" label="运营商" min-width="80"></el-table-column>
            <el-table-column prop="updateTime" label="修改时间" min-width="80"></el-table-column>
            <el-table-column prop="createPerson" label="添加人" min-width="80"></el-table-column>
            <el-table-column label="操作" width="160">
              <template slot-scope="scope">
                <el-button @click="modify(scope.row)" type="text" size="small" v-if="btnRole.addOrUpdate">修改</el-button>
                <el-button @click="addOffice(scope.row)" type="text" size="small" v-if="btnRole.addOrUpdate">添加科室</el-button>
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
        <el-form-item label="医院名称" prop="hName">
          <el-select v-model="addForm.hName" placeholder="请输入医院名称" style="width:100%" clearable filterable remote reserve-keyword allow-create :remote-method="remoteMethod" :loading="addSelectLoading">
            <el-option v-for="(item,$index) in hospitals" :key="$index" :label="item.hName" :value="item.hName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在省份" prop="province">
          <el-select v-model="addForm.province" filterable placeholder="请选择所在省份" style="width: 100%" @change="changeRegion">
            <el-option v-for="item in region" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在城市" prop="city">
          <el-select v-model="addForm.city" filterable placeholder="请选择所在城市" style="width: 100%">
            <el-option v-for="item in city" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址" prop="detailAddr">
          <el-input v-model="addForm.detailAddr" clearable placeholder="请输入详细地址"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel('addForm')">取 消</el-button>
        <el-button type="primary" @click="submitAdd('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改" :visible.sync="modifyDialogVisible" width="30%">
      <el-form :model="modifyForm" status-icon :rules="addRules" ref="modifyForm" label-width="100px">
        <el-form-item label="医院名称" prop="hName">
          <el-select v-model="modifyForm.hName" placeholder="请输入医院名称" style="width:100%" clearable filterable remote reserve-keyword allow-create :remote-method="remoteMethod" :loading="addSelectLoading">
            <el-option v-for="(item,$index) in hospitals" :key="$index" :label="item.hName" :value="item.hName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在省份" prop="province">
          <el-select v-model="modifyForm.province" filterable placeholder="请选择所在省份" style="width: 100%" @change="changeRegion">
            <el-option v-for="item in region" :key="item.id" :label="item.name" :value="item.id.toString()"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在城市" prop="city">
          <el-select v-model="modifyForm.city" filterable placeholder="请选择所在城市" style="width: 100%">
            <el-option v-for="item in city" :key="item.id" :label="item.name" :value="item.id.toString()"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址" prop="detailAddr">
          <el-input v-model="modifyForm.detailAddr" clearable placeholder="请输入详细地址"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitModify('modifyForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加科室" :visible.sync="addOfficeDialogVisible" width="30%">
      <el-form :model="addOfficeForm" status-icon :rules="addOfficeRules" ref="addOfficeForm" label-width="100px">
        <el-form-item label="科室名称" prop="dName">
          <el-input v-model="addOfficeForm.dName" clearable placeholder="请输入科室名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDetail('addOfficeForm')">取 消</el-button>
        <el-button type="primary" @click="submitAddOffice('addOfficeForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改科室" :visible.sync="modifyOfficeDialogVisible" width="30%">
      <el-form :model="modifyOfficeForm" status-icon :rules="addOfficeRules" ref="modifyOfficeForm" label-width="100px">
        <el-form-item label="科室名称" prop="dName">
          <el-input v-model="modifyOfficeForm.dName" clearable placeholder="请输入科室名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyOfficeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitModifyOffice('modifyOfficeForm')">确 定</el-button>
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
        hName: '',
      },
      page: 1,
      rows: 10,
      dataList: '',
      addDialogVisible: false,
      addForm: {
        hName: '',
        province: '',
        city: '',
        detailAddr: '',
      },
      addRules: {
        hName: [
          { required: true, message: '请选择医院', trigger: 'change' },
        ],
        province: [
          { required: true, message: '请输入所在省份', trigger: 'blur' },
        ],
        city: [
          { required: true, message: '请输入所在城市', trigger: 'blur' },
        ],
        detailAddr: [
          { required: true, message: '请输入医院详细地址', trigger: 'blur' },
        ],
      },
      modifyDialogVisible: false,
      modifyForm: {
        id: '',
        hName: '',
        province: '',
        city: '',
        detailAddr: '',
      },
      addSelectLoading: false,
      hospitals: [],
      addOfficeDialogVisible: false,
      addOfficeForm: {
        hospitalId: '',
        dName: ''
      },
      addOfficeRules: {
        dName: [
          { required: true, message: '请输入医科室名称', trigger: 'blur' },
        ],
      },
      modifyOfficeDialogVisible: false,
      modifyOfficeForm: {
        id: '',
        hospitalId: '',
        dName: ''
      },
      region: '',
      city: '',
      btnRole:{
        addOrUpdate: false,
        del: false,
        exp: false,
      }
    }
  },
  created () {
    if (sessionStorage.rows) {
      this.rows = parseInt(sessionStorage.rows)
    }
    this.$postByForm(api.host + '/comm/queryRegion').then(data => {
      this.region = data.resultData
    })
    this.getData(1)
    let roleElement = JSON.parse(sessionStorage.roleElement)
    if (roleElement.hospitalMsg) {
      console.log(roleElement.hospitalMsg)
      for (let i in roleElement.hospitalMsg) {
        if (roleElement.hospitalMsg[i].servlet == 'addOrUpdateHospital') {
          this.btnRole.addOrUpdate = true
        }
        if (roleElement.hospitalMsg[i].servlet == 'delHospital') {
          this.btnRole.del = true
        }
        if (roleElement.hospitalMsg[i].servlet == 'exportExcelForHospital') {
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
    addOffice (data) {
      this.addOfficeForm.hospitalId = data.id
      this.addOfficeDialogVisible = true
    },
    add () {
      this.addForm.hName='';
      this.addForm.province='';
      this.addForm.city='';
      this.addForm.detailAddr='';
      this.addDialogVisible = true
    },
    cancel (formName) {
      this.addDialogVisible = false;
      this.$refs[formName].resetFields();
    },
    cancelDetail (formName) {
      this.addOfficeDialogVisible = false;
      this.$refs[formName].resetFields()
    },

    submitAddOffice (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$postByForm(api.host + '/hospital/addOrUpdateDepartments', this.addOfficeForm).then(data => {
            if (data.resultCode == 200) {
              this.getData(this.page)
              this.$refs[formName].resetFields()
              this.$message.success('保存成功')
              this.addOfficeDialogVisible = false
            }else {
              this.$message.error(data.resultMsg)
              this.addOfficeDialogVisible = false
            }

          })
        } else { return false }
      })
    },
    submitDelOffice (data) {
      this.$confirm('确认删除？').then(_ => {
        this.$postByForm(api.host + '/hospital/delDepartments', {id: data.id}).then(data => {
          if (data.resultCode == 200) {
            this.getData(this.page)
            this.$message.success('删除成功')
          }else {
            this.$message.error(data.resultMsg)
          }

        })
      }).catch(_ => { })
    },
    modifyOffice (data,hospitalId) {
      for (let i in this.modifyOfficeForm) {
        this.modifyOfficeForm[i] = data[i]
      }
      this.modifyOfficeForm.hospitalId = hospitalId
      this.modifyOfficeDialogVisible = true
    },
    submitModifyOffice (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$postByForm(api.host + '/hospital/addOrUpdateDepartments', this.modifyOfficeForm).then(data => {
            if (data.resultCode == 200) {
              this.getData(this.page)
              this.$refs[formName].resetFields()
              this.$message.success('保存成功')
              this.modifyOfficeDialogVisible = false
            } else {
              this.$message.error(data.resultMsg)
              this.roleDialogVisible = false
            }

          })
        } else { return false }
      })
    },
    remoteMethod (query) {
      if (query !== '') {
        this.addSelectLoading = true
        this.$postByForm(api.host + '/comm/selectHospitalByName', {
          hName: query
        }).then(data => {
          this.addSelectLoading = false
          this.hospitals = data.resultData
        })
      } else {
        this.hospitals = []
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
      this.$postByForm(api.host + '/hospital/queryHospitals', {
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
      this.$confirm('确认删除？').then(_ => {
        this.$postByForm(api.host + '/hospital/delHospital', {id: data.id}).then(data => {
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
          this.$postByForm(api.host + '/hospital/addOrUpdateHospital', this.addForm).then(data => {
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
      this.$postByForm(api.host + '/comm/queryRegionByParentId', {parentId: data.province}).then(res => {
        this.city = res.resultData
      })
      this.modifyDialogVisible = true
    },
    submitModify (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$postByForm(api.host + '/hospital/addOrUpdateHospital', this.modifyForm).then(data => {
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
    record (data) {
      this.$postByForm(api.host + '/operate/queryBedUseHistory', {
        id: data.id
      }).then(res => {
        this.recordList = res.resultData
        this.recordDialogVisible = true
      })
    },
    changeRegion (data) {
      if (this.addDialogVisible) {
        this.addForm.city = ''
      }
      if (this.modifyDialogVisible) {
        this.modifyForm.city = ''
      }
      this.$postByForm(api.host + '/comm/queryRegionByParentId', {parentId: data}).then(res => {
        this.city = res.resultData
      })
    },
    exportData () {
      this.$postByExport(api.host + '/hospital/exportExcelForHospital', {
        hName: this.searchForm.hName,
      }).then(data => {
        if (data.resultCode == 200) {
          var blob = data
          var reader = new FileReader()
          reader.readAsDataURL(blob)
          reader.onload = function (e) {
            var downloadElement = document.createElement('a')
            var href = e.target.result
            downloadElement.href = href
            downloadElement.download = '医院信息-'+getNowFormatDate()+'.xlsx'
            downloadElement.click()
            window.URL.revokeObjectURL(href)
          }
        } else {
          this.$message.error(data.resultMsg)
          this.modifyDialogVisible = false
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