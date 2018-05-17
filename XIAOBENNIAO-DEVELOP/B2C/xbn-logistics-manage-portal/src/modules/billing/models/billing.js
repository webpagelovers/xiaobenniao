//获取列表
async function getListByPage(params, ctx) {
    return await ctx.post('/gcfsBillingCompany/listPage', params);
}

//获取详情
async function getInfo(id, ctx) {
    return await ctx.get('/gcfsBillingCompany/info', {id: id});
}

//认证
async function certifiedPass(id, ctx) {
    return await ctx.get('/gcfsBillingCompany/certifiedPass', id, null);
}

//取消认证
async function cancelCertified(id, ctx) {
    return await ctx.get('/gcfsBillingCompany/cancelCertified', id, null, true);
}

//未关联产品列表
async function listNoLinked(params, ctx) {
    return await ctx.post('/gcfsBillingCompanyCommodity/listNoLinked', params, null, true);
}

//已关联产品列表
async function listLinked(params, ctx) {
    return await ctx.post('/gcfsBillingCompanyCommodity/listLinked', params, null, true);
}

//批量保存关联产品
async function batchSave(params, ctx) {
    return await ctx.post('/gcfsBillingCompanyCommodity/batchSave', params, null, true);
}

//批量删除关联产品
async function batchDelete(params, ctx) {
    return await ctx.post('/gcfsBillingCompanyCommodity/batchDelete', params, null, true);
}


//新建并保存开票厂商数据
async function newToSave(params, ctx) {
    return await ctx.post('/gcfsBillingCompany/newToSave', params);
}

//编辑并保存
async function updateToSave(params, ctx) {
    return await ctx.post('/gcfsBillingCompany/updateToSave', params);
}

//删除单条开票厂商
async function deleteCurrent(id, ctx) {
    return await ctx.get('/gcfsBillingCompany/delete', id);
}

//校验开票厂商名字及统一信用代码是否重复
async function validateNameAndCreditCode(params, ctx) {
    return await ctx.post('/gcfsBillingCompany/validateNameAndCreditCode', params, null, true);
}

//获取用户信息列表
async function listByName(params, ctx) {
    return await ctx.get('/gcfsUserInfo/listByName', params, null, true);
}


function convertOpts(options, valueField, labelField) {
    for (let option of options) {
        option['value'] = option[valueField];
        option['label'] = option[labelField];
    }
    return options;
}

//获取数据字典列表
async function getGcfsDictionary(params, ctx) {

    const types = params || [];

    await ctx.servers.default.post('/gcfsDataDictionary/getDictionary', {
        'dictionaryTypes': types
    });
    const dictionaryData = {};

    const billingCompanyStatus = [
        {id: '1', billingCompanyStatus: '待认证'},
        {id: '2', billingCompanyStatus: '已认证'}
    ];

    dictionaryData.billingCompanyStatus = convertOpts(billingCompanyStatus, 'id', 'billingCompanyStatus');                      //全部状态

    return dictionaryData;
}

export const billing = {
    getListByPage,
    getInfo,
    certifiedPass,
    cancelCertified,
    listNoLinked,
    listLinked,
    batchSave,
    batchDelete,
    newToSave,
    updateToSave,
    deleteCurrent,
    validateNameAndCreditCode,
    listByName,
    getGcfsDictionary
};

