import Notification from 'nt-element/src/components/notification/index.js';
//刘晗的流程用不习惯，定义什么errorCode呀，前端不关心这个，
//除2000000外都直接弹出错误并reject，需要处理时再try
function checkAjaxData(json,isOpenErrMsg = true) {
    return new Promise(function(resolve,reject){
        if (json.statusCode == "2000000") {
            resolve(json.data);
        } else {
            if (isOpenErrMsg) {
                let msg = json.errMsg || '未知错误';
                if(!json.errMsg && json.errorList && json.errorList.length>0){
                    msg = json.errorList.join(';')
                }
                Notification.error({
                    title: '错误',
                    message: msg
                });
            }
            reject(json);
        }
    });
}

//收汇功能列表
async function incomeListPage(params, ctx) {
    let json = await ctx.post('/gcfsExchangeIncomeDetail/incomeListPage',params,true);
    return json;
}
//结汇管理列表
async function settlementListPage(params, ctx) {
    let json = await ctx.post('/gcfsExchangeIncomeDetail/settlementListPage',params,true);
    return json;
}
//获取详情信息
async function getInfo(params, ctx) {
    let json = await ctx.get('/gcfsExchangeIncomeDetail/info',params,true);
    return checkAjaxData(json);
}
//驳回收汇信息  incomeReject
async function incomeReject(params, ctx) {
    let json = await ctx.post('/gcfsExchangeIncomeDetail/incomeReject',params,true);
    return checkAjaxData(json);
}
//确认结汇
async function incomeConfirm(params, ctx) {
    let json = await ctx.post('/gcfsExchangeIncomeDetail/incomeConfirm',params,true);
    return checkAjaxData(json);
}
//获取确认结汇信息
async function settlementConfirmInfo(params, ctx) {
    let json = await ctx.get('/gcfsExchangeIncomeDetail/settlementConfirmInfo',params,true);
    return checkAjaxData(json);
}
//确认结汇时的外汇列表
async function settlementWZFList(params, ctx) {
    let json = await ctx.post('/gcfsExchangeIncomeDetail/settlementWZFList',params,true);
    return checkAjaxData(json);
}
// 确认汇率(外综服)
async function confirmRateWZF(params, ctx) {
    let json = await ctx.post('/gcfsExchangeIncomeDetail/confirmRateWZF',params,true);
    return checkAjaxData(json);
}
// 确认汇率(自营出口)
async function confirmRateZYCK(params, ctx) {
    let json = await ctx.get('/gcfsExchangeIncomeDetail/confirmRateZYCK',params,true);
    return checkAjaxData(json);
}
//确认结汇 
async function settlementConfirm(params, ctx) {
    let json = await ctx.get('/gcfsExchangeIncomeDetail/settlementConfirm',params,true);
    return checkAjaxData(json);
}
//获取币种枚举
async function getCustomsCurrencyEnum(params,ctx){
    let json = await ctx.get('/gcfsDataDictionary/getCustomsCurrencyEnum',params,true);
    var arr = await checkAjaxData(json);
    var list = [];
    for(var i = 0; i<arr.length; i++){
        list.push({label:arr[i],value:arr[i]});
    }
    return list;
}
//这种写法， 以后进行支持。 相当于给模型方法声明一个命名空间
export const exchange = {
    incomeListPage,
    settlementListPage,
    incomeReject,
    incomeConfirm,
    getInfo,
    settlementConfirmInfo,
    settlementWZFList,
    confirmRateZYCK,
    confirmRateWZF,
    settlementConfirm,
    getCustomsCurrencyEnum
}