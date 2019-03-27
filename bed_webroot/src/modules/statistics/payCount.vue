<template>
    <div>
        <el-form :inline="true" :model="form"  >
            <el-form-item label="请选择日期">
                <el-date-picker size="small"
                        v-model="form.time"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="代理商">
                <el-select v-model="form.operator_id" placeholder="请选择代理商"  size="small">
                    <el-option
                            v-for="item in operators"
                            :key="item.id"
                            :label="item.o_name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary"  size="small" @click="refresh">查询</el-button>
            </el-form-item>
        </el-form>
        <v-chart :options="options" autoresize style="width: 90%"
                 v-loading="loading"
                 element-loading-text="拼命加载中"
                 element-loading-spinner="el-icon-loading"/>
    </div>
</template>
<script>
    import moment from 'moment';
    import {payStatistic} from '../../apis/PayStatisticApi';
    import {queryListByLoginUser} from '../../apis/OperatorApi';
    export default {
        components: {},
        props: {},
        data :function(){
            return {
                seriesData: {
                    order_income: [],
                    order_back: [],
                    total_deposit: [],
                    deposit_back: [],
                    out_count: [],
                    in_count: [],
                    time: [],
                },
                form:{
                    time : [ moment().subtract(30, "days") , //开始日期 时间
                            moment() ,//结束日期 时间
                         ],
                    operator_id: -1
                },
                loading: false,
                operators: []
            }
        },
        computed:{
            options(){
             return   {
                    xAxis: {
                        type: 'category',
                            data: this.seriesData.time
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series:  this.getSeriesData
                }
            },
            getSeriesData(){
                return [
                    {
                        name:'订单总收入',
                        type:'line',
                        stack: '总量',
                        data:this.seriesData.order_income
                    },
                    {
                        name:'订单退款',
                        type:'line',
                        stack: '总量',
                        data:this.seriesData.order_back
                    },
                    {
                        name:'押金总额',
                        type:'line',
                        stack: '总量',
                        data:this.seriesData.total_deposit
                    },
                    {
                        name:'押金退款',
                        type:'line',
                        stack: '总量',
                        data:this.seriesData.deposit_back
                    },
                    {
                        name:'支款笔数',
                        type:'line',
                        stack: '总量',
                        data:this.seriesData.out_count
                    },
                    {
                        name:'收款笔数',
                        type:'line',
                        stack: '总量',
                        data:this.seriesData.in_count
                    },
                ]
            }
        },
        created(){
            this.loadOperators();
            this.refresh();
        },
        mounted(){

        },
        updated(){

        },
        methods: {
            //获取代理商新
            loadOperators(){
                const that = this;
                queryListByLoginUser().then(res => {
                    if(res.data.resultCode != 200){
                        that.$message.error(res.data.resultMsg)
                        return ;
                    }
                    that.operators = res.data.resultData;
                },error =>{
                    console.error(error);
                });
            },
            refresh(){
                this.loading = true;
                const that = this;
                payStatistic(moment(that.form.time[0]).format("YYYY-MM-DD"),moment(that.form.time[1]).format("YYYY-MM-DD") ,that.form.operator_id) .then(res =>{
                    if(res.data.resultCode != 200){
                    that.$message.error(res.data.resultMsg)
                      return ;
                     }
                that.seriesData ={
                    order_income: res.data.resultData.map(item => item.order_income),
                        order_back: res.data.resultData.map(item => item.order_back),
                        total_deposit: res.data.resultData.map(item => item.total_deposit),
                        deposit_back: res.data.resultData.map(item => item.deposit_back),
                        out_count: res.data.resultData.map(item => item.out_count),
                        in_count: res.data.resultData.map(item => item.in_count),
                        time: res.data.resultData.map(item => item.time),
                };
                    console.log(that.seriesData)
                that.loading = false;
                },error =>{
                    that.loading = false;
                }).catch (err =>{
                    that.loading = false;
                });
            }

        }
    }
</script>

<style>
</style>