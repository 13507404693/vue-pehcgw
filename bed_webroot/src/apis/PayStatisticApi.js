import axios from 'axios';
import qs from 'qs';
//支付统计接口
export const payStatistic = (beginTime ,endTime ,operaterId) => {
    console.log(beginTime ,endTime ,operaterId)
    return  axios({
        method: "post",
        url: "/api/paystatistic/allPayStatistic",
        headers: {  'Access-Token' : JSON.parse(sessionStorage.sysUser).token},
        data:qs.stringify( {
            begin_time: beginTime,
            end_time: endTime,
            operator_id: operaterId
        })
    });

}

