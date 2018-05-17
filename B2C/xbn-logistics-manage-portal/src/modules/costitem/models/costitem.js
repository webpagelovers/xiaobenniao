//获取列表
async function getListByPage(params, ctx) {
    return await ctx.post('/gcfsExpenseItem/listPage', params);
}

//详情
async function info(params, ctx) {
    return await ctx.get('/gcfsExpenseItem/info', params);
}


//新建
async function save(params, ctx) {
    return await ctx.post('/gcfsExpenseItem/save', params);
}

//编辑
async function update(params, ctx) {
    return await ctx.post('/gcfsExpenseItem/update', params);
}


//删除单条
async function deleteCurrent(id, ctx) {
    return await ctx.get('/gcfsExpenseItem/delete', id);
}

//批量删除
async function batchDelete(id, ctx) {
    return await ctx.post('/gcfsExpenseItem/batchDelete', id);
}

//校验费用项名称是否重复
async function validateName(params, ctx) {
    return await ctx.post('/gcfsExpenseItem/validateName', params, null, true);
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
    const receiptTypeOption = [{type: '01', name: '报关单'}, {type: '02', name: '请关单'}];

    dictionaryData.receiptType = convertOpts(receiptTypeOption, 'receiptType', 'type');

    return dictionaryData;
}

export const costitem = {
    getListByPage,
    info,
    save,
    update,
    deleteCurrent,
    batchDelete,
    validateName,
    getGcfsDictionary
};

