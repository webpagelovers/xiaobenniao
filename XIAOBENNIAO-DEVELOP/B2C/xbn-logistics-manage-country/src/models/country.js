//获取仓库分页列表
async function listCountry(params, ctx) {
    return await ctx.post('/gcfsCountryCurrency/listPage', params);
}

//添加
async function addCountry(params, ctx) {
    return await ctx.post('/gcfsCountryCurrency/save', params, null, true);
}

//修改
async function updateCountry(params, ctx) {
    return await ctx.post('/gcfsCountryCurrency/update', params, null, true);
}

//删除单条
async function deleteCountry(id, ctx) {
    return await ctx.get('/gcfsCountryCurrency/delete', {id: id});
}

//获取详情
async function getInfoCountry(id, ctx) {
    return await ctx.get('/gcfsCountryCurrency/info', {id: id});
}

//校验物流国家名称是否存在
async function validateCountryName(params, ctx) {
    return await ctx.post('/gcfsCountryCurrency/validateCountryName', params, null, true);
}

//校验物流国家名称缩写是否存在
async function validateCountryAbbreviation(params, ctx) {
    return await ctx.post('/gcfsCountryCurrency/validateCountryAbbreviation', params, null, true);
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

    dictionaryData.country = convertOpts(responseData['4'], 'currencyUnit', 'currencyUnit');                              //国家
    return dictionaryData;
}

export const country = {
    listCountry,
    addCountry,
    deleteCountry,
    updateCountry,
    getInfoCountry,
    getGcfsDictionary,
    validateCountryName,
    validateCountryAbbreviation
};

