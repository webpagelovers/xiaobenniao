//获取列表
async function listPlans(params, ctx) {
    return await ctx.post('/gcfsLogisticsPlan/listPage', params);
}

//添加
async function addPlan(params, ctx) {
    return await ctx.post('/gcfsLogisticsPlan/save', params, null, true);
}

//删除单条
async function deletePlan(id, ctx) {
    return await ctx.get('/gcfsLogisticsPlan/delete', {id: id});
}

//批量删除
async function batchDelete(ids, ctx) {
    return await ctx.post('/gcfsLogisticsPlan/batchDelete', {ids: ids});
}

//修改
async function updatePlan(params, ctx) {
    return await ctx.post('/gcfsLogisticsPlan/update', params, null, true);
}

//获取详情
async function getInfoPlan(id, ctx) {
    return await ctx.get('/gcfsLogisticsPlan/info', {id: id});
}

//校验物流编码是否存在
async function validatePlanCode(params, ctx) {
    return await ctx.post('/gcfsLogisticsPlan/validatePlanCode', params, null, true);
}

//根据目的港口获取终点站
async function getLastStationByPort(portId, ctx) {
    return await ctx.get('/gcfsLogisticsPlan/getLastStationByPort', {portId: portId});
}

//根据港口获取仓库
async function getStoreByPortId(portId, ctx) {
    return await ctx.get('/gcfsStore/listByPortId', {portId: portId});
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
    const types = params || [1, 2, 3, 4, 5, 6];

    const response = await ctx.servers.default.post('/gcfsDataDictionary/getDictionary', {
        'dictionaryTypes': types
    });
    const responseData = response.data;
    const dictionaryData = {};

    dictionaryData.disposalSite = convertOpts(responseData['1'], 'id', 'name');           //处理地点
    dictionaryData.logisticsType = convertOpts(responseData['2'], 'id', 'logisticsType');     //物流方式
    dictionaryData.targetPort = convertOpts(responseData['3'], 'id', 'name');                 //目的港口
    //dictionaryData.startStation = convertOpts(responseData['4'], 'id', 'country');               //始发站
    dictionaryData.lastStation = convertOpts(responseData['4'], 'abbreviation', 'abbreviation');               //终点站
    return dictionaryData;
}

export const plans = {
    listPlans,
    addPlan,
    updatePlan,
    getInfoPlan,
    deletePlan,
    batchDelete,
    getLastStationByPort,
    getStoreByPortId,
    getGcfsDictionary,
    validatePlanCode
};

