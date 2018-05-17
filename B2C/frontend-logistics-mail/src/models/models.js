
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

    const response = await ctx.servers.mail.post('/gcfsDataDictionary/getDictionary', {
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
    let res = await ctx.servers.mail.post(`/gcfsTaxRefundOrder/getTaxOrderListDictionary`, {});
    let obj = {};
    // 报关口岸
    obj.customsPort = res.data['51'];
    obj.customsPortMap = convertOptsToMap(res.data['51'], 'value', 'label');
    // 订单状态
    obj.orderStatus = res.data['50'];
    obj.orderStatusMap = convertOptsToMap(res.data['50'], 'value', 'label');
    // 收汇状态
    obj.exchangeStatus = res.data['52'];
    obj.exchangeStatusMap = convertOptsToMap(res.data['52'], 'value', 'label');

    // 收汇方式
    obj.exchangeType = res.data['57'];
    obj.exchangeTypeMap = convertOptsToMap(res.data['57'], 'value', 'label');

    // 单位
    obj.numberUnitsList = res.data['65'];
    obj.numberUnitsMap = convertOptsToMap(res.data['65'], 'value', 'label');

    // 发票状态
    obj.invoiceStatus = res.data['53'];
    obj.invoiceStatusMap = convertOptsToMap(res.data['53'], 'value', 'label');
    // 装柜方式
    obj.cupboardType = res.data['60'];
    obj.cupboardTypeMap = convertOptsToMap(res.data['60'], 'value', 'label');
    // 价格条款
    obj.priceProvision = res.data['64'];
    obj.priceProvisionMap = convertOptsToMap(res.data['64'], 'value', 'label');
    // 开票方式
    obj.billingType = res.data['55'];
    obj.billingTypeMap = convertOptsToMap(res.data['55'], 'value', 'label');
    // 合同编号类型
    obj.contractNumberType = res.data['56'];
    obj.contractNumberTypeMap = convertOptsToMap(res.data['56'], 'value', 'label');
    // 包装方式
    obj.packType = res.data['63'];
    obj.packTypeMap = convertOptsToMap(res.data['63'], 'value', 'label');
    // 包装种类
    obj.packClass = res.data['62'];
    obj.packClassMap = convertOptsToMap(res.data['62'], 'value', 'label');
    // 包装说明
    obj.packExplain = res.data['61'];
    obj.packExplainMap = convertOptsToMap(res.data['61'], 'value', 'label');
    // 特殊关系确认、价格影响确认、支持特许权使用费确认、是否关联收货预报字典
    obj.yesOrNo = res.data['59'];
    obj.yesOrNoMap = convertOptsToMap(res.data['59'], 'value', 'label');
    return obj;
}
// 错误码   错误码枚举列表
async function getErrorCode(params, ctx) {
    return await ctx.servers.mail.get(`/mailDataDictionary/getApiStatusCodeEnum`, params);
}
// 计算接口
async function compute(params, ctx) {
    return await ctx.servers.mail.get(`/gcfsDataDictionary/compute`, params);
}
// 以上公用

// 以下 - 写信
// 获取发件人地址   获取用户绑定邮箱列表
async function listUserEmail(params, ctx) {
    return await ctx.servers.mail.post(`/mailInfo/listUserEmail`, params);
}
// 发送邮件
async function sendMail(params, ctx) {
    return await ctx.servers.mail.post(`/mailInfo/sendMail`, params);
}
// 草稿编辑
async function sendMailDraft(params, ctx) {
    return await ctx.servers.mail.post(`/mailInfo/sendMailDraft`, params);
}
// 邮件详情
async function mailInfo(params, ctx) {
    return await ctx.servers.mail.get(`/mailInfo/info`, params);
}


// 以下 - 列表
//邮件列表
async function listEmails(params, ctx) {
    return await ctx.servers.mail.post(`/mailInfo/listPage`, params);
}

//操作邮件（标记为已读|标记为未读|删除|举报）
async function handleEmails(params, ctx) {
    return await ctx.servers.mail.post(`/mailInfo/mailOperate`, params);
}

//获取邮件附件
async function getEmailAttachment(params, ctx) {
    return await ctx.servers.mail.get(`/mailAttachmentInfo/listByMailId`, params);
}

//完全删除邮件
async function deleteEmails(params, ctx) {
    return await ctx.servers.mail.post(`/mailInfo/deleteCompletely`, params);
}

// 以下 - 邮箱设置

/*已绑定的邮箱*/
async function listUserEmail(params, ctx) {
    return await ctx.servers.mail.post(`/mailInfo/listUserEmail`, params);
}

/*新建快速文本*/
async function listUserSave(params, ctx) {
    return await ctx.servers.mail.post(`/mailContentTemplate/save`, params);
}

/*获取快速文本列表*/
async function listUserList(params, ctx) {
    return await ctx.servers.mail.post(`/mailContentTemplate/list`, params);
}

/*删除快速文本*/
async function listUserDelete(params, ctx) {
    return await ctx.servers.mail.get(`/mailContentTemplate/delete`, params);
}

/*修改快速文本*/
async function listUserUpdate(params, ctx) {
    return await ctx.servers.mail.post(`/mailContentTemplate/update`, params);
}

/*获取快速文本详情*/
async function listUserInfo(params, ctx) {
    return await ctx.servers.mail.get(`/mailContentTemplate/info`, params);
}

/*添加黑名单*/
async function blackListSave(params, ctx) {
    return await ctx.servers.mail.post(`/mailSpamAddressInfo/save`, params);
}

/*删除单条黑名单*/
async function blackListDelete(params, ctx) {
    return await ctx.servers.mail.get(`/mailSpamAddressInfo/delete`, params);
}

/*删除单条黑名单*/
async function blackListByPage(params, ctx) {
    return await ctx.servers.mail.post(`/mailSpamAddressInfo/listPage`, params);
}



// 以下 - 联系人

//这种写法， 以后进行支持。 相当于给模型方法声明一个命名空间
export const mail = {
    getErrorCode,
    getGcfsDictionary,
    getEnum,
    compute,
    listUserEmail,
    sendMail,
    sendMailDraft,
    mailInfo,
    listEmails,
    handleEmails,
    deleteEmails,
    getEmailAttachment,
    listUserSave,
    listUserList,
    listUserDelete,
    listUserUpdate,
    listUserInfo,
    blackListSave,
    blackListDelete,
    blackListByPage
}
