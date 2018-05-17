//获取仓库分页列表
async function listCompany(params, ctx) {
    return await ctx.post('/gcfsLogisticsCompany/listPage', params);
}

//添加
async function addCompany(params, ctx) {
    return await ctx.post('/gcfsLogisticsCompany/save', params, null, true);
}

//修改
async function updateCompany(params, ctx) {
    return await ctx.post('/gcfsLogisticsCompany/update', params, null, true);
}

//删除单条
async function deleteCompany(id, ctx) {
    return await ctx.get('/gcfsLogisticsCompany/delete', {id: id});
}

//获取详情
async function getInfoCompany(id, ctx) {
    return await ctx.get('/gcfsLogisticsCompany/info', {id: id});
}

//校验物流公司名称是否存在
async function validateCompanyName(params, ctx) {
    return await ctx.post('/gcfsLogisticsCompany/validateCompanyName', params, null, true);
}

//校验物流公司名称缩写是否存在
async function validateCompanyAbbreviation(params, ctx) {
    return await ctx.post('/gcfsLogisticsCompany/validateCompanyAbbreviation', params, null, true);
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
    const types = params || [4];

    const response = await ctx.servers.default.post('/gcfsDataDictionary/getDictionary', {
        'dictionaryTypes': types
    });
    const responseData = response.data;
    const dictionaryData = {};

    dictionaryData.country = convertOpts(responseData['4'], 'id', 'country');                              //国家

    return dictionaryData;
}

export const company = {
    listCompany,
    addCompany,
    deleteCompany,
    updateCompany,
    getInfoCompany,
    getGcfsDictionary,
    validateCompanyName,
    validateCompanyAbbreviation
};

