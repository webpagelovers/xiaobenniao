//获取列表
async function getListByPage(params, ctx) {
    return await ctx.post('/gcfsBillingCompany/listPage', params);
}

//获取详情
async function getInfo(id, ctx) {
    return await ctx.get('/gcfsBillingCompany/info', {id: id});
}

//函调
async function letter(params, ctx) {
    return await ctx.post('/gcfsBillingCompany/letter', params, null, true);
}

//升级
async function increase(id, ctx) {
    return await ctx.get('/gcfsBillingCompany/increase', id);
}

//合同列表
async function getContractListByPage(params, ctx) {
    return await ctx.get('/gcfsBillingCompanyContract/list', params);
}

//审核通过
async function auditPass(params, ctx) {
    return await ctx.post('/gcfsBillingCompany/auditPass', params);
}


//添加合同
async function addContract(params, ctx) {
    return await ctx.post('/gcfsBillingCompanyContract/save', params);
}

//删除合同
async function deleteContract(id, ctx) {
    return await ctx.get('/gcfsBillingCompanyContract/delete', id);
}

//修改合同
async function updateContract(params, ctx) {
    return await ctx.post('/gcfsBillingCompanyContract/update', params);
}


//驳回
async function rejectCommodity(params, ctx) {
    return await ctx.post('/gcfsBillingCompany/rejected', params, null, true);
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
    letter,
    increase,
    getContractListByPage,
    auditPass,
    addContract,
    deleteContract,
    updateContract,
    rejectCommodity,
    getGcfsDictionary
};

