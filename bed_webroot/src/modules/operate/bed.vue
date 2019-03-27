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
            <el-form-item label="" prop="deviceNum">
              <el-input v-model="searchForm.deviceNum" clearable placeholder="请输入设备编号或mac地址"></el-input>
            </el-form-item>
            <el-form-item label="" prop="status">
              <el-select v-model="searchForm.status" clearable placeholder="请选择设备状态">
                <el-option label="故障" value="0"></el-option>
                <el-option label="正常" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="disinfectionStatus">
              <el-select v-model="searchForm.disinfectionStatus" clearable placeholder="请选择消毒状态">
                <el-option label="消毒失败" value="0"></el-option>
                <el-option label="消毒成功" value="1"></el-option>
                <el-option label="消毒中" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="lockType">
              <el-select v-model="searchForm.lockType" clearable placeholder="请选择锁机状态">
                <el-option label="锁关门关" value="0"></el-option>
                <el-option label="锁开门开" value="1"></el-option>
                <el-option label="锁关门开" value="2"></el-option>
                <el-option label="锁开门关" value="3"></el-option>
                <el-option label="未知" value="4"></el-option>
              </el-select>

              <el-form-item label="" prop="Operator">
                <el-select v-model="searchForm.operatorId" clearable placeholder="请选所属运营商">
                  <el-option v-for="(item,$index) in operator" :key="$index" :label="item.oName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>

            <el-form-item label="" prop="Hospital">
              <el-select v-model="searchForm.hospitalId" clearable placeholder="请选所属医院">
                <el-option v-for="(item,$index) in searchHospitals" :key="$index" :label="item.hName" :value="item.id" @change="showDeptPart"></el-option>
              </el-select>
            </el-form-item>

              <el-form-item label="" prop="Department">
                <el-select v-model="searchForm.depId" clearable placeholder="请选所属科室">
                  <el-option v-for="(item,$index) in deptPart" :key="$index" :label="item.dName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>

            </el-form-item>
            <el-form-item>
              <el-button @click="resetSearchForm('searchForm')">重置</el-button>
              <el-button type="primary" @click="getData(1)">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addDialogVisible = true" v-if="btnRole.addOrUpdate">添加</el-button>
            </el-form-item>
            <el-form-item>
              <el-upload :on-success="fileSuccess" :show-file-list="false" :action="host + '/operate/importExcelForBed'" :headers="headers" list-type="picture">
                <el-button type="primary">导入</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="exportData" v-if="btnRole.exp">导出数据</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="exportCode" v-if="btnRole.exp">导出二维码</el-button>
            </el-form-item>
            <el-form-item label="低电量预警值：">
              <el-select v-model="warning" @change="changeLowPower" style="width: 100px">
                <el-option label="5%" :value="5"></el-option>
                <el-option label="10%" :value="10"></el-option>
                <el-option label="15%" :value="15"></el-option>
                <el-option label="20%" :value="20"></el-option>
                <el-option label="25%" :value="25"></el-option>
                <el-option label="30%" :value="30"></el-option>
                <el-option label="35%" :value="35"></el-option>
                <el-option label="40%" :value="40"></el-option>
                <el-option label="45%" :value="45"></el-option>
                <el-option label="50%" :value="50"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-table :data="dataList.objList" stripe style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="deviceNum" label="设备编号" min-width="80"></el-table-column>
            <el-table-column prop="status" label="使用状态" min-width="80"></el-table-column>
            <el-table-column prop="hName" label="所在医院" min-width="80"></el-table-column>
            <el-table-column prop="userNum" label="累计使用次数" width="120"></el-table-column>
            <el-table-column prop="operatorName" label="所属运营商" min-width="120"></el-table-column>
            <el-table-column prop="lockType" label="锁机状态" min-width="80">
              <template slot-scope="scope">
                <template v-if="scope.row.lockType == 0">锁关门关</template>
                <template v-if="scope.row.lockType == 1">锁开门开</template>
                <template v-if="scope.row.lockType == 2">锁关门开</template>
                <template v-if="scope.row.lockType == 3">锁开门关</template>
                <template v-if="scope.row.lockType == 4">未知</template>
              </template>
            </el-table-column>
            <el-table-column prop="batteryPercentage" label="设备电量" min-width="80">
              <template slot-scope="scope">
                {{scope.row.batteryPercentage}}%
              </template>
            </el-table-column>
            <el-table-column prop="disinfectionStatus" label="消毒状态" min-width="80">
              <template slot-scope="scope">
                <template v-if="scope.row.disinfectionStatus == 0">消毒失败</template>
                <template v-if="scope.row.disinfectionStatus == 1">消毒成功</template>
                <template v-if="scope.row.disinfectionStatus == 2">消毒中</template>
                <template v-if="scope.row.disinfectionStatus == 3">未消毒</template>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="设备状态" min-width="80">
              <template slot-scope="scope">
                <template v-if="scope.row.status == 0">故障</template>
                <template v-if="scope.row.status == 1">正常</template>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="openPwm" label="开锁力度" min-width="80"></el-table-column>
            <el-table-column prop="openTime" label="开锁时间" min-width="80"></el-table-column>
            <el-table-column prop="closePwm" label="关锁力度" min-width="80"></el-table-column>
            <el-table-column prop="closeTime" label="关锁时间" min-width="80"></el-table-column> -->
            <el-table-column prop="updateTime" label="更新时间" width="160"></el-table-column>
            <el-table-column label="操作" width="160">
              <template slot-scope="scope">
                <el-button @click="modify(scope.row)" type="text" size="small" v-if="btnRole.addOrUpdate">修改</el-button>
                <el-button @click="record(scope.row)" type="text" size="small">使用记录</el-button>
                <el-button @click="submitDel(scope.row)" type="text" size="small" v-if="btnRole.del">删除</el-button>
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
          <el-col :span="8">
            <el-form-item label="所属运营商" prop="operatorId">
              <el-select v-model="addForm.operatorId" clearable placeholder="请选择所属运营商" style="width:100%"  @change="showHospital">
                <el-option v-for="(item,$index) in operator" :key="$index" :label="item.oName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>

          </el-col>
          <el-col :span="8">
            <el-form-item label="所属医院" prop="hospitalId">
              <el-select v-model="addForm.hospitalId" clearable placeholder="请选择所属医院" style="width:100%"  @change="showDeptPart">
                <el-option v-for="(item,$index) in hospitals" :key="$index" :label="item.hName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所在科室" prop="depId">
              <el-select v-model="addForm.depId" clearable placeholder="请选择所在科室" style="width:100%">
                <el-option v-for="(item,$index) in deptPart" :key="$index" :label="item.dName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="所在病房" prop="roomNum">
              <el-input v-model="addForm.roomNum" clearable placeholder="请输入所在病房"></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="8">
             <el-form-item label="所在病床" prop="bedNum">
               <el-input v-model="addForm.bedNum" clearable placeholder="请输入所在病床"></el-input>
             </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备地址" prop="addr">
              <el-input v-model="addForm.addr" clearable placeholder="请输入设备地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="二维码地址" prop="qrUrl">
              <el-input v-model="addForm.qrUrl" clearable placeholder="请输入二维码地址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="二维码编号" prop="qrCode">
              <el-input v-model="addForm.qrCode" clearable placeholder="请输入二维码编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="MAC地址" prop="mac">
              <el-input v-model="addForm.mac" clearable placeholder="请输入MAC地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="密钥" prop="secretKey">
              <el-input v-model="addForm.secretKey" clearable placeholder="请输入密钥"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="密码" prop="pwd">
              <el-input v-model="addForm.pwd" clearable placeholder="请输入密码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备编号" prop="deviceNum">
              <el-input v-model="addForm.deviceNum" clearable   placeholder="请输入设备编号" @change="upqrUrl"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="设备型号" prop="deviceType">
              <el-input v-model="addForm.deviceType" clearable placeholder="请输入设备型号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="版本号" prop="version">
              <el-input v-model="addForm.version" clearable placeholder="请输入版本号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开锁力度" prop="openPwm">
              <el-input v-model="addForm.openPwm" clearable placeholder="请输入版本号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="开锁时间" prop="openTime">
              <el-input v-model="addForm.openTime" clearable placeholder="请输入设备型号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关锁力度" prop="closePwm">
              <el-input v-model="addForm.closePwm" clearable placeholder="请输入版本号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关锁时间" prop="closeTime">
              <el-input v-model="addForm.closeTime" clearable placeholder="请输入版本号"></el-input>
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
          <el-col :span="8">
            <el-form-item label="所属运营商" prop="operatorId">
              <el-select v-model="modifyForm.operatorId" clearable placeholder="请选择所属运营商" style="width:100%"  @change="eidtHospital">
                <el-option v-for="(item,$index) in operator" :key="$index" :label="item.oName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属医院" prop="hospitalId">
              <el-select v-model="modifyForm.hospitalId" clearable placeholder="请选择所属医院" style="width:100%"   @change="eidtDeptPart">
                <el-option v-for="(item,$index) in hospitals" :key="$index" :label="item.hName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所在科室" prop="depId">
              <el-select v-model="modifyForm.depId" clearable placeholder="请选择所在科室" style="width:100%">
                <el-option v-for="(item,$index) in deptPart" :key="$index" :label="item.dName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="所在病房" prop="roomNum">
              <el-input v-model="modifyForm.roomNum" clearable placeholder="请输入所在病房"></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="8">
             <el-form-item label="所在病床" prop="bedNum">
               <el-input v-model="modifyForm.bedNum" clearable placeholder="请输入所在病床"></el-input>
             </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备地址" prop="addr">
              <el-input v-model="modifyForm.addr" clearable placeholder="请输入设备地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="二维码地址" prop="qrUrl">
              <el-input v-model="modifyForm.qrUrl" clearable readonly="true" placeholder="请输入二维码地址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="二维码编号" prop="qrCode">
              <el-input v-model="modifyForm.qrCode" clearable readonly="true" placeholder="请输入二维码编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="MAC地址" prop="mac">
              <el-input v-model="modifyForm.mac" clearable placeholder="请输入MAC地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="密钥" prop="secretKey">
              <el-input v-model="modifyForm.secretKey" clearable placeholder="请输入密钥"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="密码" prop="pwd">
              <el-input v-model="modifyForm.pwd" clearable placeholder="请输入密码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备编号" prop="deviceNum">
              <el-input v-model="modifyForm.deviceNum" clearable placeholder="请输入设备编号" @change="upqrUrl"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="设备型号" prop="deviceType">
              <el-input v-model="modifyForm.deviceType" clearable placeholder="请输入设备型号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="版本号" prop="version">
              <el-input v-model="modifyForm.version" clearable placeholder="请输入版本号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开锁力度" prop="openPwm">
              <el-input v-model="modifyForm.openPwm" clearable placeholder="请输入版本号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="开锁时间" prop="openTime">
              <el-input v-model="modifyForm.openTime" clearable placeholder="请输入设备型号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关锁力度" prop="closePwm">
              <el-input v-model="modifyForm.closePwm" clearable placeholder="请输入版本号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关锁时间" prop="closeTime">
              <el-input v-model="modifyForm.closeTime" clearable placeholder="请输入版本号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitModify('modifyForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="deviceNum+'-使用记录'" :visible.sync="recordDialogVisible" width="60%">
      <el-form :inline="true" :model="searchForm" ref="searchForm" size="small" class="demo-form-inline">
        <el-form-item>
          <el-button type="primary" @click="exportDetail">导出</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="recordList.objList" stripe style="width: 100%">
        <el-table-column prop="startTime" label="日期" min-width="160"></el-table-column>
        <el-table-column prop="orderNo" label="订单号" min-width="80"></el-table-column>
        <el-table-column prop="userPhone" label="手机号" min-width="80"></el-table-column>

        <el-table-column prop="lockStatus" label="锁机状态" min-width="80">
          <template slot-scope="scope">
            <template v-if="scope.row.lockStatus == 0">锁关门关</template>
            <template v-if="scope.row.lockStatus == 1">锁开门开</template>
            <template v-if="scope.row.lockStatus == 2">锁关门开</template>
            <template v-if="scope.row.lockStatus == 3">锁开门关</template>
            <template v-if="scope.row.lockStatus == 4">未知</template>
          </template>
        </el-table-column>
        <el-table-column prop="penergy" label="设备电量" min-width="80"></el-table-column>
        <el-table-column prop="dStatus" label="消毒状态" min-width="80">
          <template slot-scope="scope">
            <template v-if="scope.row.dStatus == 0">消毒失败</template>
            <template v-if="scope.row.dStatus == 1">消毒成功</template>
            <template v-if="scope.row.dStatus == 2">消毒中</template>
            <template v-if="scope.row.dStatus == 3">未消毒</template>
          </template>
        </el-table-column>
        <el-table-column prop="bStatus" label="设备状态" min-width="80">
          <template slot-scope="scope">
            <template v-if="scope.row.bStatus == 0">故障</template>
            <template v-if="scope.row.bStatus == 1">正常</template>
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="订单结束时间" width="160"></el-table-column>
      </el-table>
      <el-pagination style="margin-top:10px" @current-change="getDetailData" :current-page.sync="pageDetail" @size-change="sizeChangeDetail" :page-size="rowsDetail" :page-sizes="[10, 20, 30, 40]" :total="recordList.totalCount" background layout="total, sizes, prev, pager, next"></el-pagination>
    </el-dialog>
    <el-dialog title="低电量预警" :visible.sync="lowPowerVisible" width="30%">
      <p>当前有{{lowCount}}台设备电量低于{{warning}}%，请尽快跟进处理！</p>
      <p>&nbsp;</p>
      <p>电量低于5%时设备将不能继续开锁使用！</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="lowPowerVisible = false">确 定</el-button>
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
      host: api.host,
      headers: {
        'Access-Token': JSON.parse(sessionStorage.sysUser).token
      },
      loading: true,
      searchForm: {
        deviceNum: '',
        status: '',
        disinfectionStatus: '',
        lockType: '',
        hospitalId: '',
        operatorId:'',
        depId:'',
      },
      page: 1,
      rows: 10,
      pageDetail: 1,
      rowsDetail: 10,
      dataList: '',
      addDialogVisible: false,
      addForm: {
        hospitalId: '',
        depId: '',
        roomNum: '',
        bedNum: '',
        operatorId: '',
        addr: '',
        mac: '',
        qrUrl: 'https://testbed.leagoohealth.com/platform/program/createImage?deviceNum=',
        qrCode: '',
        pwd: '',
        secretKey: '',
        deviceNum: '',
        deviceType: '',
        version: '',
        openPwm: '',
        openTime: '',
        closePwm: '',
        closeTime: '',
      },
      addRules: {
        hospitalId: [
          { required: true, message: '请选择所属医院', trigger: 'change' },
        ],
        operatorId: [
          { required: true, message: '请选择所属运营商', trigger: 'change' },
        ],
        qrUrl: [
          { required: true, message: '请输入二维码地址', trigger: 'blur'},
        ],
        qrCode: [
          { required: true, message: '请输入二维码编号', trigger: 'blur'},
        ],
        mac: [
          { required: true, message: '请输入MAC地址', trigger: 'blur'},
        ],
        secretKey: [
          { required: true, message: '请输入密钥', trigger: 'blur'},
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur'},
        ],
      },
      modifyDialogVisible: false,
      modifyForm: {
        id: '',
        hospitalId: '',
        depId: '',
        roomNum: '',
        bedNum: '',
        operatorId: '',
        addr: '',
        mac: '',
        qrUrl: '',
        qrCode: '',
        pwd: '',
        secretKey: '',
        deviceNum: '',
        deviceType: '',
        version: '',
        openPwm: '',
        openTime: '',
        closePwm: '',
        closeTime: '',
        hospitalId2: '',
        depId2: '',
      },
      hospitals: [],
      operator: [],
      deptPart: [],
      recordDialogVisible: false,
      recordList: '',
      departments:[],
      searchHospitals:[],
      searchOperator:[],
      searchDepartments:[],
      deviceId:'',
      deviceNum:'',
      btnRole:{
        addOrUpdate: false,
        del: false,
        exp: false,
      },
      warning: '',
      multipleSelection: [],
      lowPowerVisible: false,
      lowCount: '',
    }
  },
  created () {
    if (sessionStorage.rows) {
      this.rows = parseInt(sessionStorage.rows)
    }
    this.$postByForm(api.host + '/comm/queryHospitalsForSelect').then(data => {
      this.searchHospitals = data.resultData
    })

    this.$postByForm(api.host + '/comm/queryOperatorForSelect').then(data => {
      this.operator = data.resultData
    })

    this.$postByForm(api.host + '/comm/queryDeptPartByOperatorId').then(data => {
      this.searchDepartments = data.resultData
    })


    this.getData(1)
    let roleElement = JSON.parse(sessionStorage.roleElement)
    if (roleElement.bed) {
      for (let i in roleElement.bed) {
        if (roleElement.bed[i].servlet == 'addOrUpdateBed') {
          this.btnRole.addOrUpdate = true
        }
        if (roleElement.bed[i].servlet == 'delBed') {
          this.btnRole.del = true
        }
        if (roleElement.bed[i].servlet == 'exportExcelForBed'){
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
    upqrUrl (deviceNum) {
      console.info(deviceNum);
      this.addForm.qrUrl='https://testbed.leagoohealth.com/platform/program/createImage?deviceNum='+deviceNum;
      this.addForm.qrCode=deviceNum;
    },
    eidtDeptPart (id) {
      this.modifyForm.depId='';
      if (id) {
        this.$postByForm(api.host + '/comm/queryDeptPartForSelect', {
          id: id
        }).then(data => {
          this.deptPart = data.resultData;

        })
      }
    },

    eidtHospital (id) {
      this.modifyForm.hospitalId='';
      this.modifyForm.depId='';
      this.deptPart=[];
      if (id) {
        this.$postByForm(api.host + '/comm/queryHospitalsForSelect', {
          operatorId: id
        }).then(data => {
          this.hospitals = data.resultData;
        })
      }
    },
    showDeptPart (id) {
      if (id) {
        this.$postByForm(api.host + '/comm/queryDeptPartForSelect', {
          id: id
        }).then(data => {
          this.deptPart = data.resultData;

        })
      }
    },

    showHospital (id) {
      if (id) {
        this.$postByForm(api.host + '/comm/queryHospitalsForSelect', {
          operatorId: id
        }).then(data => {
          this.hospitals = data.resultData;

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
      console.log(this.searchForm.Hospital)
      this.loading = true
      this.$postByForm(api.host + '/operate/queryBed', {
        pageNum: this.page,
        pageSize: this.rows,
        deviceNum: this.searchForm.deviceNum,
        status: this.searchForm.status,
        disinfectionStatus: this.searchForm.disinfectionStatus,
        lockType: this.searchForm.lockType,
        hospitalId:this.searchForm.hospitalId || '',
        operatorId:this.searchForm.operatorId,
        depId:this.searchForm.depId
      }).then(data => {
        console.log(data)
        if (data.resultData.lowCount > 0){
          this.lowPowerVisible = true
          this.lowCount = data.resultData.lowCount
        }
        this.warning = data.resultData.lowPower
        this.dataList = data.resultData.page
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
      this.$postByForm(api.host + '/operate/queryBedUseHistory', {
        pageNum: this.pageDetail,
        pageSize: this.rowsDetail,
        id:this.deviceId
      }).then(data => {
        console.log(data)
        this.recordList = data.resultData.page
      })
    },
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
      this.getData(1)
    },
    submitDel (data) {
      this.$confirm('确认删除？').then(_ => {
        this.$postByForm(api.host + '/operate/delBed', {id: data.id}).then(data => {
          this.getData(this.page)
          this.$message.success('删除成功')
        })
      }).catch(_ => { })
    },
    submitAdd (formName) {

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$postByForm(api.host + '/operate/addOrUpdateBed', this.addForm).then(data => {
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

       /* this.$postByForm(api.host + '/operate/addOrUpdateBed', this.addForm).then(data => {
          if (data.resultCode == 200) {
            this.getData(this.page)
            this.$refs[formName].resetFields()
            this.$message.success('保存成功')
            this.addDialogVisible = false
          } else {
            this.$message.error(data.resultMsg)
            this.addDialogVisible = false
          }

      })*/
    },
    modify (data) {
      this.$postByForm(api.host + '/operate/selectBedById', {
        id: data.id
      }).then(res => {
        for (let i in this.modifyForm) {
          this.modifyForm[i] = res.resultData[i]
        }
        this.modifyForm.hospitalId2=this.modifyForm.hospitalId;
        this.modifyForm.depId2=this.modifyForm.depId;
        this.modifyDialogVisible = true;

        this.showHospital(this.modifyForm.operatorId);
        this.showDeptPart(this.modifyForm.hospitalId);
      })
    },
    submitModify (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$postByForm(api.host + '/operate/addOrUpdateBed', this.modifyForm).then(data => {
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
    record (data) {

      this.deviceId=data.id;
      this.deviceNum=data.deviceNum;
      //this.getDetailData(1)
      this.$postByForm(api.host + '/operate/queryBedUseHistory', {
        id: data.id,
        pageNum: this.pageDetail,
        pageSize: this.rowsDetail,
      }).then(res => {
        this.recordDialogVisible=true;
        this.recordList = res.resultData.page;
        console.info( this.recordList)
      })
    },
    exportData () {
      this.$postByExport(api.host + '/operate/exportExcelForBed', {
        deviceNum: this.searchForm.deviceNum,
      }).then(data => {
        var blob = data
        var reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = function (e) {
          var downloadElement = document.createElement('a')
          var href = e.target.result
          downloadElement.href = href
          downloadElement.download = '设备管理-'+getNowFormatDate()+'.xlsx'
          downloadElement.click()
          window.URL.revokeObjectURL(href)
        }
      })
    },
    exportDetail () {
      this.$postByExport(api.host + '/operate/exportExcelForBedDetail', {
        id: this.deviceId,
        pageNum: this.pageDetail,
        pageSize: this.rowsDetail,
      }).then(data => {
        var blob = data
        var reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = function (e) {
          var downloadElement = document.createElement('a')
          var href = e.target.result
          downloadElement.href = href
          downloadElement.download = '设备使用详情-'+getNowFormatDate()+'.xlsx'
          downloadElement.click()
          window.URL.revokeObjectURL(href)
        }
      })
    },

    exportCode () {
      if (this.multipleSelection.length > 0) {
        let _arr = []
        for (let i in this.multipleSelection) {
          _arr.push(this.multipleSelection[i].deviceNum)
        }
        this.$postByExport(api.host + '/operate/downLoadZipFile', {
          devices: _arr.join(','),
        }).then(data => {
          var blob = data
          var reader = new FileReader()
          reader.readAsDataURL(blob)
          reader.onload = function (e) {
            var downloadElement = document.createElement('a')
            var href = e.target.result
            downloadElement.href = href
            downloadElement.download = '设备二维码.zip'
            downloadElement.click()
            window.URL.revokeObjectURL(href)
          }
        })
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    changeLowPower () {
      console.log(this.warning)
      this.$postByForm(api.host + '/operator/updateLowPower', {
        lowPower: this.warning
      }).then(data => {
        this.getData(this.page)
        this.$message.success('修改低电量预警值成功')
      })
    },
    fileSuccess (res, file) {
      if (res.resultCode == 200) {
        this.getData(this.page)
        this.$message.success('导入设备成功')
      } else {
        this.$message.error('导入失败')
      }
    },
  },
  watch: {

  }
}
</script>

<style lang="less" scoped>

 
</style>