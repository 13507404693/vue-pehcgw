<template>
    <div>
        <el-row :gutter="15">
            <el-col :span="10">
                <el-card shadow="hover">
                <InOutComeCharts></InOutComeCharts>
                </el-card>
            </el-col>
            <el-col :span="7">
                <el-card shadow="hover">
                    <div slot="header">
                        <el-select v-model="customType" placeholder="请选择">
                            <el-option    label="自营"     :value="1">   </el-option>
                            <el-option    label="代理"     :value="2">   </el-option>
                            <el-option    label="全部"     :value="2">   </el-option>
                        </el-select>
                    </div>
                    <div>
                    <DepostInComeCharts></DepostInComeCharts>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="7">
                <el-card shadow="hover">
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import InOutComeCharts from './charts/InOutComeCharts';
    import DepostInComeCharts from './charts/DepostInComeCharts.vue';
    export default {
        components:{
            InOutComeCharts,DepostInComeCharts
        },
        props: {

        },
        data (){
            return {
                customType: 1
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
<style>

</style>