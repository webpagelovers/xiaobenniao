import Notification from 'nt-element/src/components/notification/index.js';
import Enum from './enum.js';
//刘晗的流程用不习惯，定义什么errorCode呀，前端不关心这个，
//除2000000外都直接弹出错误并reject，需要处理时再try
function checkAjaxData(json, isOpenErrMsg = true) {
    return new Promise(function (resolve, reject) {
        if (json.statusCode == '2000000') {
            resolve(json.data);
        } else {
            if (isOpenErrMsg) {
                let msg = json.errMsg || '未知错误';
                if (!json.errMsg && json.errorList.length > 0) {
                    msg = json.errorList.join(';');
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
//获产品列表
async function listPage(params, ctx) {
    let json = await ctx.post('/gcfsCommodityAdmin/listPage', params, true);
    return json;
}
//获取产品信息
async function getCommodityInfo(params, ctx) {
    let json = await ctx.get('/gcfsCommodityAdmin/info', params, true);
    return checkAjaxData(json);
}
//产品审核
async function auditCommodity(params, ctx) {
    let json = await ctx.post('/gcfsCommodityAdmin/auditCommodity', params, true);
    return checkAjaxData(json);
}
//审核拒绝
async function rejectCommodity(params, ctx) {
    let json = await ctx.post('/gcfsCommodityAdmin/rejectCommodity', params, true);
    return checkAjaxData(json);
}
//导出产品列表
async function exportCommodity(params, ctx) {
    let json = await ctx.post('/gcfsCommodityAdmin/exportCommodity', params, true);
    return checkAjaxData(json);
}
//更新报关信息
async function updateCustomInfo(params, ctx) {
    let json = await ctx.post('/gcfsCommodityAdmin/updateCustomInfo', params, true);
    return checkAjaxData(json);
}
//获取联系人信息
async function getContactInfo(params, ctx) {
    let json = await ctx.get('/gcfsCommodityAdmin/contactInfo', params, true);
    return checkAjaxData(json);
}



//
async function getEbayEnumData(params, ctx) {
    var arrToObj = function(arr){
        var obj = {};
        arr.forEach(element => {
            obj[element.value] = { value:element.value,label:element.label};
        });
        return obj;
    };
    let json = await ctx.get('/gcfsDataDictionary/getEbayEnumData', params, true);
    
    var EbayEnumData = await checkAjaxData(json);
    var applyUnitEnum = new Enum(arrToObj(EbayEnumData['6']));//获取币制枚举
    var taxFreeTypeEnum = new Enum(arrToObj(EbayEnumData['7']));//征减免税方式
    var countryEnum = new Enum(arrToObj(EbayEnumData['3']));//国别代码
    return {
        applyUnitEnum,taxFreeTypeEnum,countryEnum
    };
}


//产品品牌类型枚举
async function getCommodityBrandTypeEnum(params, ctx) {
    let json = await ctx.get('/gcfsDataDictionary/getCommodityBrandTypeEnum', params, true);
    var data = await checkAjaxData(json);
    var enumData = {};
    for (var key in data) {
        enumData[key] = { value: key, label: data[key] };
    }
    return new Enum(enumData);
}

//这种写法， 以后进行支持。 相当于给模型方法声明一个命名空间
export const product = {
    listPage,
    getCommodityInfo,
    auditCommodity,
    exportCommodity,
    updateCustomInfo,
    getContactInfo,
    rejectCommodity,
    getCommodityBrandTypeEnum,
    getEbayEnumData
};