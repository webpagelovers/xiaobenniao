//获取列表
async function getListByPage(params, ctx) {
    return await ctx.post('/gcfsSupplier/listPage', params);
}

//详情
async function info(id, ctx) {
    return await ctx.get('/gcfsSupplier/info', id);
}

//保存
async function save(params, ctx) {
    return await ctx.post('/gcfsSupplier/save', params);
}

//删除单条
async function deleteCurrent(id, ctx) {
    return await ctx.get('/gcfsSupplier/delete', id);
}

//批量删除
async function batchDelete(ids, ctx) {
    return await ctx.post('/gcfsSupplier/batchDelete', ids);
}

//校验供应商名称是否重复
async function validateName(params, ctx) {
    return await ctx.post('/gcfsSupplier/validateName', params, null, true);
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

export const supplier = {
    getListByPage,
    info,
    save,
    deleteCurrent,
    batchDelete,
    validateName,
    getGcfsDictionary
};

