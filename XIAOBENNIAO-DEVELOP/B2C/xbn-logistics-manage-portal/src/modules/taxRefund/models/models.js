// 后台

function convertOpts(options, valueField, labelField) {
    for (let option of options) {
        option['value'] = option[valueField];
        option['label'] = option[labelField];
    }
    return options;
}
function convertOptsToMap(options, valueField, labelField) {
    let tempMap = {};
    for (let option of options) {
        tempMap[option[valueField]] = option[labelField];
    }
    return tempMap;
}
//获取数据字典列表
async function getGcfsDictionary(params, ctx) {
    /**
     * "types": {
        "1": "物流处理地点数据字典",
            "2": "物流方式数据字典",
            "3": "物流港口数据字典",
            "4": "国家数据字典",
            "5": "国家地区数据字典",
            "6": "国家地区数据字典"
    }*/
    const types = params || [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const response = await ctx.servers.default.post('/gcfsDataDictionary/getDictionary', {
        'dictionaryTypes': types
    });
    const responseData = response.data;
    const dictionaryData = {};
    dictionaryData.disposalSite = convertOpts(responseData['1'], 'id', 'name');                //处理地点
    dictionaryData.logisticsType = convertOpts(responseData['2'], 'id', 'logisticsType');          //物流方式
    // 物流方式map
    dictionaryData.logisticsTypeMap = convertOptsToMap(responseData['2'], 'id', 'logisticsType');
    dictionaryData.targetPort = convertOpts(responseData['3'], 'id', 'name');                      //目的港口
    //dictionaryData.startStation = convertOpts(responseData['4'], 'id', 'country');               //始发站
    dictionaryData.lastStation = convertOpts(responseData['4'], 'abbreviation', 'abbreviation');   //终点站
    dictionaryData.abroadCountries = convertOpts(responseData['9'], 'id', 'country');   //终点站
    return dictionaryData;
}
// 获取 枚举
async function getEnum(params, ctx) {
    let res = await ctx.post(`/gcfsTaxRefundOrder/getTaxOrderListDictionary`, {});
    let obj = {};
    // 订单状态
    obj.orderStatus = res.data['50'];
    obj.orderStatusMap = convertOptsToMap(res.data['50'], 'value', 'label');
    // 报关口岸
    obj.customsPort = res.data['51'];
    obj.customsPortMap = convertOptsToMap(res.data['51'], 'value', 'label');
    // 收汇状态
    obj.exchangeStatus = res.data['52'];
    obj.exchangeStatusMap = convertOptsToMap(res.data['52'], 'value', 'label');
    // 发票状态
    obj.invoiceStatus = res.data['53'];
    obj.invoiceStatusMap = convertOptsToMap(res.data['53'], 'value', 'label');
    // 退税订单类型
    obj.orderTypeStatus = res.data['54'];
    obj.orderTypeStatusMap = convertOptsToMap(res.data['54'], 'value', 'label');
    // 开票方式
    obj.billingType = res.data['55'];
    obj.billingTypeMap = convertOptsToMap(res.data['55'], 'value', 'label');
    // 合同编号类型
    obj.contractNumberType = res.data['56'];
    obj.contractNumberTypeMap = convertOptsToMap(res.data['56'], 'value', 'label');
    // 收汇方式
    obj.taxType = res.data['57'];
    obj.taxTypeMap = convertOptsToMap(res.data['57'], 'value', 'label');
    // 特殊关系确认、价格影响确认、支持特许权使用费确认、是否关联收货预报字典
    obj.yesOrNo = res.data['59'];
    obj.yesOrNoMap = convertOptsToMap(res.data['59'], 'value', 'label');
    // 装柜方式
    obj.cupboardType = res.data['60'];
    obj.cupboardTypeMap = convertOptsToMap(res.data['60'], 'value', 'label');
    // 包装说明
    obj.packExplain = res.data['61'];
    obj.packExplainMap = convertOptsToMap(res.data['61'], 'value', 'label');
    // 包装种类
    obj.packClass = res.data['62'];
    obj.packClassMap = convertOptsToMap(res.data['62'], 'value', 'label');
    // 包装方式
    obj.packType = res.data['63'];
    obj.packTypeMap = convertOptsToMap(res.data['63'], 'value', 'label');
    // 价格条款
    obj.priceProvision = res.data['64'];
    obj.priceProvisionMap = convertOptsToMap(res.data['64'], 'value', 'label');
    // 产品 单位
    obj.productUnit = res.data['65'];
    obj.productUnitMap = convertOptsToMap(res.data['65'], 'value', 'label');
    return obj;
}
// 错误码   错误码枚举列表
async function getErrorCode(params, ctx) {
    return await ctx.get(`/gcfsDataDictionary/getApiStatusCodeEnum`, params);
}
// 查询列表
async function list(params, ctx) {
    return await ctx.post(`gcfsTaxRefundOrder/listPage`, params);
}

// 获取关联外汇列表
async function getForeignExchange(params, ctx) {
    return await ctx.post(`/gcfsExchangeIncomeDetail/listForRefundOrder`, {
        currency: params.currency,
        payNo: params.payNo,
        id:params.id
    });
}
// 获取关联外汇记录
async function getLinkedOrder(params, ctx) {
    return await ctx.post(`/gcfsTaxRefundOrder/listLinkedOrder`, {
        taxRefundOrderCode:params.id,
        linkStatus: 1  //1为有效，0代表取消的
    });
}
// 保存关联外汇
async function saveLinkedOrder(params, ctx) {
    return await ctx.post(`/gcfsTaxRefundOrder/savelLink`, {
        exchanges:params.exchanges,
        orderId:params.orderId
    });
}
// 确认外汇收齐
async function confirmForeignExchange(params, ctx) {
    return await ctx.post(`/gcfsTaxRefundOrder/confirmReceipt`, {
        orderId:params
    });
}

// 计算接口
async function compute(params, ctx) {
    return await ctx.get(`/gcfsDataDictionary/compute`, params);
}
// 审核
async function batchPass(params, ctx) {
    return await ctx.post(`/gcfsTaxRefundOrder/batchPass`, params);
}
// 详情
async function getInfo(params, ctx) {
    return await ctx.get(`/gcfsTaxRefundOrder/info`, params);
}
// 上传报关清单
async function uploadDeclaration(params, ctx) {
    return await ctx.post(`/gcfsTaxRefundOrder/uploadDeclaration`, params);
}
// 获取补充信息
async function findAddInfo(params, ctx) {
    return await ctx.get(`/gcfsTaxRefundOrder/findAddInfo`, params);
}
// 确认补充信息
async function confirmAddInfo(params, ctx) {
    return await ctx.post(`/gcfsTaxRefundOrder/confirmAddInfo`, params);
}
// 录入发票信息
async function inputInvoiceInfo(params, ctx) {
    return await ctx.post(`/gcfsTaxRefundOrder/inputInvoiceInfo`, params);
}
// 录入退税信息
async function inputTaxRefundInfo(params, ctx) {
    return await ctx.post(`/gcfsTaxRefundOrder/inputTaxRefundInfo`, params);
}
// 查看委托函
async function checkLetter(params, ctx) {
    return await ctx.post(`/gcfsTaxRefundOrder/checkLetter`, params);
}

//这种写法， 以后进行支持。 相当于给模型方法声明一个命名空间
export const taxrefund = {
    getErrorCode,
    getGcfsDictionary,
    getEnum,
    list,
    compute,
    batchPass,
    getInfo,
    uploadDeclaration,
    findAddInfo,
    confirmAddInfo,
    inputInvoiceInfo,
    inputTaxRefundInfo,
    checkLetter,



    getForeignExchange,
    getLinkedOrder,
    saveLinkedOrder,
    confirmForeignExchange
}
