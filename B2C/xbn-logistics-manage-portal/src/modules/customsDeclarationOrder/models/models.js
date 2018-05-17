//错误码
async function getErrorCode(params, ctx) {
    return await ctx.get(`/gcfsDataDictionary/getApiStatusCodeEnum`, params);
}

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

    const response = await ctx.servers.default.post('/gcfsDataDictionary/getDictionary', {
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
    let res = await ctx.get(`/gcfsDataDictionary/getEbayEnumData`, {});

    let obj = {};
    // 订单状态
    obj.orderStatus = res.data['0'];
    obj.orderStatusMap = convertOptsToMap(res.data['0'], 'value', 'label');

    return obj;
}

//获取列表
async function getListByPage(params, ctx) {
    return await ctx.post('/gcfsEbayCustomOrder/listPage', params);
}

//获取详情
async function getInfo(id, ctx) {
    return await ctx.get('/gcfsBillingCompany/info', {id: id});
}


export const cusDecOrder = {
    getGcfsDictionary,
    getEnum,
    getErrorCode,
    getListByPage,
    getInfo
};

