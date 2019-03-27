<template>
  <el-table :data="dataList" stripe style="width: 100%" class="no-padding" :default-expand-all="false">
    <el-table-column type="expand">
      <template slot-scope="props">
        <v-tier :dataList="props.row.operators" @changeStatus="changeStatus" @modify="modify" @submitDel="submitDel"></v-tier>
      </template>
    </el-table-column>
    <el-table-column prop="oName" label="运营商名称" width="110"></el-table-column>
    <el-table-column prop="account" label="登录账号" width="120"></el-table-column>
    <el-table-column prop="rName" label="真实姓名" width="80"></el-table-column>
    <el-table-column prop="licenseImage" label="营业执照" width="80">
      <div slot-scope="scope" class="img-w">
        <template v-if="scope.row.licenseImage">
          <img :src="scope.row.licenseImage.split('||')[0]">
        </template>
      </div>
    </el-table-column>
    <el-table-column prop="level" label="等级" width="80"></el-table-column>
    <el-table-column prop="lLevel" label="下级代理数" width="100"></el-table-column>
    <el-table-column prop="parentName" label="上级" width="180"></el-table-column>
    <el-table-column prop="bedNum" label="设备数" width="80"></el-table-column>
    <el-table-column prop="wxName" label="微信号" width="180"></el-table-column>
    <el-table-column prop="wxOpenid" label="微信绑定" width="120"></el-table-column>
    <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
    <el-table-column prop="phone" label="手机" width="120"></el-table-column>
    <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
    <el-table-column prop="extractPer" label="分成比" width="80">
      <template slot-scope="scope">
        <template v-if="scope.row.extractPer && scope.row.extractPer.split('-').length > 1">浮动</template>
        <template v-else>{{scope.row.extractPer}}</template>
      </template>
    </el-table-column>
    <el-table-column prop="status" label="状态" width="80">
      <template slot-scope="scope">
        <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="changeStatus(scope.row)"></el-switch>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="100">
      <template slot-scope="scope">
        <el-button @click="modify(scope.row)" type="text" size="small">修改</el-button>
        <el-button @click="submitDel(scope.row)" type="text" size="small">启用/禁用</el-button>
        <!-- <el-button @click="submitDel(scope.row)" type="text" size="small">删除</el-button> -->
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    dataList: Array
  },
  data () {
    return {

    }
  },
  created () {
    
  },
  mounted () {

  },
  updated () {
      
  },
  methods: {
    changeStatus (data) {
      this.$emit('changeStatus', data)
    },
    modify (data) {
      this.$emit('modify', data)
    },
    submitDel (data) {
      this.$emit('submitDel', data)
    }
  },
  watch:{
        
  }
}
</script>

<style lang="less" scoped>
.img-w{
  width: 200px;
  overflow: hidden;
  img{
    display: block;
    float: left;
    width: 60px;
  }
}
</style>