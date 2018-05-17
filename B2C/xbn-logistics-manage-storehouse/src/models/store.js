//获取仓库分页列表
async function listStore(params, ctx) {
    return await ctx.post('/gcfsStore/listPage', params);
}

//获取仓库列表
async function list(params, ctx) {
    return await ctx.post('/gcfsStore/list', params);
}


//添加
async function addStore(params, ctx) {
    return await ctx.post('/gcfsStore/save', params, null, true);
}

//删除单条
async function deleteStore(id, ctx) {
    return await ctx.get('/gcfsStore/delete', {id: id});
}

//批量删除
async function batchDelete(ids, ctx) {
    return await ctx.post('/gcfsStore/batchDelete', {ids: ids});
}

//修改
async function updateStore(params, ctx) {
    return await ctx.post('/gcfsStore/update', params, null, true);
}

//获取详情
async function getInfoStore(id, ctx) {
    return await ctx.get('/gcfsStore/info', {id: id});
}

//校验仓库名称是否存在
async function validateStoreName(params, ctx) {
    return await ctx.post('/gcfsStore/validateStoreName', params, null, true);
}

//生成仓库编码
async function genStoreCode(storeType, ctx) {
    return await ctx.get('/gcfsStore/genStoreCode', {storeType: storeType});
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
    /**
     * "types": {
            "1": "物流处理地点数据字典",
            "2": "物流方式数据字典",
            "3": "物流港口数据字典",
            "4": "国家数据字典",
            "5": "国家地区数据字典",
            "6": "国家地区数据字典"
    }*/
    const types = params || [1, 4, 6, 7, 8, 9];

    const response = await ctx.servers.default.post('/gcfsDataDictionary/getDictionary', {
        'dictionaryTypes': types
    });
    const responseData = response.data;
    const dictionaryData = {};

    responseData.storeType = [{storeType: '海外仓', id: '01'}, {storeType: '集货仓', id: '02'}];

    dictionaryData.storePorts = convertOpts(responseData['1'], 'id', 'siteName');                         //起运港
    dictionaryData.country = convertOpts(responseData['4'], 'id', 'country');                              //国家
    dictionaryData.storeCode = convertOpts(responseData['6'], 'id', 'storeName');                          //仓库
    dictionaryData.storeType = convertOpts(responseData.storeType, 'id', 'storeType');                         //仓库类型
    dictionaryData.storeLogisCompanies = convertOpts(responseData['7'], 'id', 'companyName');           //物流公司
    dictionaryData.countryDomestic = convertOpts(responseData['8'], 'id', 'country');                              //国家(国内)
    dictionaryData.countryInternational = convertOpts(responseData['9'], 'id', 'country');                              //国家（国际）

    return dictionaryData;
}

export const store = {
    listStore,
    list,
    addStore,
    updateStore,
    getInfoStore,
    genStoreCode,
    deleteStore,
    batchDelete,
    getGcfsDictionary,
    validateStoreName
};

