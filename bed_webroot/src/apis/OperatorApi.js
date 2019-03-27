import axios from 'axios';

/**
 * 根据当前身份获取代理商信息
 * 无参数
 * 返回改身份能看到的运营商
 */
export const queryListByLoginUser = () => {
    return  axios({
        method: "get",
        url: "/api/operator/queryListByLoginUser",
        headers: {  'Access-Token' : JSON.parse(sessionStorage.sysUser).token}
    });

}

