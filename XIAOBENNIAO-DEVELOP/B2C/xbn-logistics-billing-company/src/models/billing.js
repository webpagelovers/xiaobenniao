//获取列表
async function getListByPage(params, ctx) {
    return await ctx.post('/gcfsBillingCompany/listPage', params);
}

//获取详情
async function getInfo(id, ctx) {
    return await ctx.get('/gcfsBillingCompany/info', {id: id});
}

//直接提审
async function audit(id, ctx) {
    return await ctx.get('/gcfsBillingCompany/audit', id, null, true);
}

//未关联产品列表
async function listNoLinked(params, ctx) {
    return await ctx.post('/gcfsBillingCompanyCommodity/listNoLinked', params, null, true);
}

//已关联产品列表
async function listLinked(params, ctx) {
    return await ctx.get('/gcfsBillingCompanyCommodity/listLinked', params, null, true);
}

//保存关联产品数据并提审
async function saveLinked(params, ctx) {
    return await ctx.post('/gcfsBillingCompanyCommodity/save', params, null, true);
}

//新建并保存开票厂商数据
async function newToSave(params, ctx) {
    return await ctx.post('/gcfsBillingCompany/newToSave', params);
}

//新建并提审开票厂商数据
async function newToAudit(params, ctx) {
    return await ctx.post('/gcfsBillingCompany/newToAudit', params);
}

//编辑并保存
async function updateToSave(params, ctx) {
    return await ctx.post('/gcfsBillingCompany/updateToSave', params);
}

//编辑并提审
async function updateToAudit(params, ctx) {
    return await ctx.post('/gcfsBillingCompany/updateToAudit', params);
}

//删除单条开票厂商
async function deleteCurrent(id, ctx) {
    return await ctx.get('/gcfsBillingCompany/delete', id);
}

//校验开票厂商名字及统一信用代码是否重复
async function validateNameAndCreditCode(params, ctx) {
    return await ctx.post('/gcfsBillingCompany/validateNameAndCreditCode', params, null, true);
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

    const letterStatus = [
        {id: '2', letterStatus: '待发函'},
        {id: '3', letterStatus: '待回函'},
        {id: '4', letterStatus: '转审核'},
        {id: '5', letterStatus: '已完成'}
    ];
    const billingCompanyStatus = [
        {id: '1', billingCompanyStatus: '新建'},
        {id: '2', billingCompanyStatus: '审核中'},
        {id: '3', billingCompanyStatus: '待补充资料'},
        {id: '4', billingCompanyStatus: '审核通过'},
        {id: '5', billingCompanyStatus: '临时审核通过'},
        {id: '6', billingCompanyStatus: '审核驳回'}
    ];

    dictionaryData.letterStatus = convertOpts(letterStatus, 'id', 'letterStatus');                      //函调状态
    dictionaryData.billingCompanyStatus = convertOpts(billingCompanyStatus, 'id', 'billingCompanyStatus');     //全部状态

    return dictionaryData;
}

export const billing = {
    getListByPage,
    getInfo,
    audit,
    listNoLinked,
    listLinked,
    saveLinked,
    newToSave,
    newToAudit,
    updateToSave,
    updateToAudit,
    deleteCurrent,
    validateNameAndCreditCode,
    getGcfsDictionary
};

