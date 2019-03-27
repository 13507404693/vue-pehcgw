<template>
  <div >
      <h2>欢迎登录陪护床后台系统</h2>
  </div>
</template>

<script>
import api from '../utils/api'
export default {
  props: {
    isCollapse: Boolean
  },
  data (){
    return {
        userType: 1 ,//用户类型
        orderNumType: 1 ,//订单查询日期类型
        amountNumType: 1 ,//订单当日收入总金额查询日期类型
    }
  },
  created(){

  },
  mounted(){
  
  },
  updated(){
      
  },
  methods:{

  }
  
}
</script>

<style lang="less" scoped>

</style>
