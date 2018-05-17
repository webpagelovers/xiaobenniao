//获取列表分页
async function getListByPage(params, ctx) {
    return await ctx.post('/gcfsLclPlan/listPage', params);
}

//获取详情
async function getInfo(id, ctx) {
    return await ctx.get('/gcfsLclPlan/info', {id: id});
}

//拼箱列表
async function getContractListByPage(params, ctx) {
    return await ctx.get('/gcfsLclPlan/list', params);
}

//保存
async function save(params, ctx) {
    return await ctx.post('/gcfsLclPlan/save', params);
}


//删除单条
async function deleteCurrent(id, ctx) {
    return await ctx.get('/gcfsLclPlan/delete', id);
}

//修改
async function update(params, ctx) {
    return await ctx.post('/gcfsLclPlan/editPlan', params);
}

//拼箱计划编码
async function createPlanCode(params, ctx) {
    return await ctx.get('/gcfsLclPlan/createPlanCode', params);
}

//增加装箱单号
async function addBox(boxOrderCode, ctx) {
    return await ctx.get('/gcfsLclPlan/addBox', boxOrderCode);
}

//指派
async function assign(params, ctx) {
    return await ctx.get('/gcfsLclPlan/assign', params);
}


//获取集货仓列表
async function getStoreList(params, ctx) {
    return await ctx.post('/gcfsStore/list', params);
}

//获取集货仓详情
async function getStoreInfo(params, ctx) {
    return await ctx.get('/gcfsStore/info', params);
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

    const source = [
        {id: 1, source: '小笨鸟'},
        {id: 2, source: 'UBI'}
    ];
    const status = [
        {id: 1, status: '新建'},
        {id: 2, status: '已指派'},
        {id: 3, status: '已发柜'}
    ];

    dictionaryData.source = convertOpts(source, 'id', 'source');                      //来源
    dictionaryData.status = convertOpts(status, 'id', 'status');                       //状态

    return dictionaryData;
}

export const lclplan = {
    getListByPage,
    getInfo,
    getContractListByPage,
    save,
    deleteCurrent,
    update,
    createPlanCode,
    addBox,
    assign,
    getStoreList,
    getStoreInfo,
    getGcfsDictionary
};

