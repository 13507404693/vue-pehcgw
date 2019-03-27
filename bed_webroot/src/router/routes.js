const login = () => import('../modules/login')
const wrap = () => import('../modules/wrap')
const home = () => import('../modules/home')
const personal = () => import('../modules/personal')
const bed = () => import('../modules/operate/bed')
const user = () => import('../modules/operate/user')
const pay = () => import('../modules/operate/pay')
const order = () => import('../modules/operate/order')
const hospitalMsg = () => import('../modules/hospital/info')
const operator = () => import('../modules/operator/operator')
const employee = () => import('../modules/operator/employee')
const dept = () => import('../modules/operator/dept')
const helpCenter = () => import('../modules/operator/help')
const gathering = () => import('../modules/balance/gathering')
const balance = () => import('../modules/balance/balance')
const pendingBalance = () => import('../modules/balance/pending')
const cost = () => import('../modules/strategy/cost')
const disinfection = () => import('../modules/strategy/disinfection')
const pledge = () => import('../modules/strategy/pledge')
const use = () => import('../modules/strategy/use')
const rolePage = () => import('../modules/setting/sys_role')

const faultCount = () => import ("../modules/statistics/faultCount");
const financeCount = () => import ("../modules/statistics/financeCount");
const orderCount = () => import ("../modules/statistics/orderCount");
const payCount = () => import ("../modules/statistics/payCount");
const userCount = () => import ("../modules/statistics/userCount");
const usageCount = () => import("../modules/statistics/usageCount");
export default [
    {path: '/wrap', name: 'wrap', component: wrap, children: [
    {path: '/pageHome', name: 'home', component: home},
    {path: '/bed', name: 'bed', component: bed},
    {path: '/personal', name: 'personal', component: personal},
    {path: '/user', name: 'user', component: user},
    {path: '/pay', name: 'pay', component: pay},
    {path: '/order', name: 'order', component: order},
    {path: '/hospitalMsg', name: 'hospitalMsg', component: hospitalMsg},
    {path: '/operator', name: 'operator', component: operator},
    {path: '/employee', name: 'employee', component: employee},
    {path: '/dept', name: 'dept', component: dept},
    {path: '/helpCenter', name: 'helpCenter', component: helpCenter},
    {path: '/gathering', name: 'gathering', component: gathering},
    {path: '/mybalance', name: 'balance', component: balance},
    {path: '/pendingBalance', name: 'pendingBalance', component: pendingBalance},
    {path: '/cost', name: 'cost', component: cost},
    {path: '/disinfection', name: 'disinfection', component: disinfection},
    {path: '/pledge', name: 'pledge', component: pledge},
    {path: '/use', name: 'use', component: use},
    {path: '/rolePage', name: 'rolePage', component: rolePage},
    {path: '/faultCount', name: '故障统计', component: faultCount},
    {path: '/financeCount', name: '财务统计', component: financeCount},
    {path: '/orderCount', name: '订单统计', component: orderCount},
    {path: '/payCount', name: '支付统计', component: payCount},
    {path: '/userCount', name: '用户统计', component: userCount},
    {path: '/usage', name: '使用率统计', component: usageCount},
  ]},
  {path: '/login', name: 'login', component: login},
  {path: '*', redirect: '/login'}
]

// export default [
//     {
//
//         path : '/',
//         name: '首页',
//         component: HomeView ,
//         children: [
//             { path: 'wrap', name: 'wrap', component: wrap, children: [
//                 {path: 'pageHome', name: 'home', component: home},
//                 {path: 'bed', name: 'bed', component: bed},
//                 {path: 'personal', name: 'personal', component: personal},
//                 {path: 'user', name: 'user', component: user},
//                 {path: 'pay', name: 'pay', component: pay},
//                 {path: 'order', name: 'order', component: order},
//                 {path: 'hospitalMsg', name: 'hospitalMsg', component: hospitalMsg},
//                 {path: 'operator', name: 'operator', component: operator},
//                 {path: 'employee', name: 'employee', component: employee},
//                 {path: 'dept', name: 'dept', component: dept},
//                 {path: 'helpCenter', name: 'helpCenter', component: helpCenter},
//                 {path: 'gathering', name: 'gathering', component: gathering},
//                 {path: 'mybalance', name: 'balance', component: balance},
//                 {path: 'pendingBalance', name: 'pendingBalance', component: pendingBalance},
//                 {path: 'cost', name: 'cost', component: cost},
//                 {path: 'disinfection', name: 'disinfection', component: disinfection},
//                 {path: 'pledge', name: 'pledge', component: pledge},
//                 {path: 'use', name: 'use', component: use},
//                 {path: 'rolePage', name: 'rolePage', component: rolePage}
//             ]
// }
//         ]
//     }
// ]