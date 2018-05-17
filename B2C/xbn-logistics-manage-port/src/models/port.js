//获取仓库分页列表
async function listPort(params, ctx) {
    return await ctx.post('/gcfsPort/listPage', params);
}

//添加
async function addPort(params, ctx) {
    return await ctx.post('/gcfsPort/save', params, null, true);
}

//修改
async function updatePort(params, ctx) {
    return await ctx.post('/gcfsPort/update', params, null, true);
}

//删除单条
async function deletePort(id, ctx) {
    return await ctx.get('/gcfsPort/delete', {id: id});
}

//获取详情
async function getInfoPort(id, ctx) {
    return await ctx.get('/gcfsPort/info', {id: id});
}

//校验港口名称是否存在
async function validatePortName(params, ctx) {
    return await ctx.post('/gcfsPort/validatePortName', params, null, true);
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
    const types = params || [4, 8, 9];

    const response = await ctx.servers.default.post('/gcfsDataDictionary/getDictionary', {
        'dictionaryTypes': types
    });
    const responseData = response.data;
    const dictionaryData = {};

    responseData.portType = [{portType: '国内', id: '1'}, {portType: '海外', id: '2'}];
    dictionaryData.country = convertOpts(responseData['4'], 'id', 'country');                              //国家
    dictionaryData.countryDomestic = convertOpts(responseData['8'], 'id', 'country');                     //国家(国内)
    dictionaryData.countryInternational = convertOpts(responseData['9'], 'id', 'country');               //国家（国际）
    dictionaryData.portType = convertOpts(responseData.portType, 'id', 'portType');                       //港口类型

    return dictionaryData;
}

export const port = {
    listPort,
    addPort,
    deletePort,
    updatePort,
    getInfoPort,
    getGcfsDictionary,
    validatePortName
};

