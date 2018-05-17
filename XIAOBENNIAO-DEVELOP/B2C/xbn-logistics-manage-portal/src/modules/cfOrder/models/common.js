
import merge from 'deepmerge';
// 路由到
function routeTo(url) {
    this.$router.push(url);
}
function goBack() {
    this.$router.go(-1);
}
function deepCopy(obj) {
    let tempObj = Object.assign({}, obj);
    function deep(object) {
        for (let name in object) {
            if (Object.prototype.toString.call(object[name]).indexOf('[object Object]') > -1) {
                // 对象类型
                if (Object.keys(object[name]).length === 1) {
                    // 只有一个属性
                    for (let one in object[name]) {
                        let oldObj = object[name];
                        object[name] = {};
                        object[name][one] = oldObj[one];
                        deep(object[name]);
                    }
                } else {
                    // 多个属性
                    object[name] = Object.assign({}, object[name]);
                    deep(object[name]);
                }
            }
            if (Object.prototype.toString.call(object[name]).indexOf('[object Array]') > -1) {
                // 数组类型
                let oldObj = object[name];
                object[name] = [];
                for (let one in oldObj) {
                    object[name][one] = oldObj[one];
                    deep(object[name]);
                }
            }

        }
    }
    deep(tempObj);
    return tempObj;
}

// 初始化
async function initBaseDictionary(callback) {
    let dictionary = null;
    let statusEnum = null;
    try {
        dictionary = await this.ctx.models.taxrefund.getGcfsDictionary();
        statusEnum = await this.ctx.models.taxrefund.getEnum();
        // dictionary.customsPort = statusEnum.data['51'];
        // dictionary.orderStatus = statusEnum.data['50'];
        // dictionary.exchangeStatus = statusEnum.data['52'];
        // dictionary.invoiceStatus = statusEnum.data['53'];
        dictionary = merge(dictionary, statusEnum);
    } catch (err) {
        //交给框架处理的异常
        this.ctx.onerror(err);
    }
    return dictionary;
}

//点击关联外汇
function clickRelatedForeignExchange(row){
    this.orderInfoRelation = row;

    if(this.orderInfoRelation.linkedAmount && this.orderInfoRelation.totalCommidityValue){
        if(this.orderInfoRelation.waitLinkedAmount < 0){
            this.orderInfoRelation.percentage = 100;
        }else{
            this.orderInfoRelation.percentage = (this.orderInfoRelation.linkedAmount/this.orderInfoRelation.totalCommidityValue)*100;
        }
    }

    this.orderInfoRelation.linkedAmount = outputmoney(this.orderInfoRelation.linkedAmount);
    this.orderInfoRelation.totalCommidityValue = outputmoney(this.orderInfoRelation.totalCommidityValue);
    this.orderInfoRelation.waitLinkedAmount < 0 ? this.orderInfoRelation.waitLinkedAmount = outputmoney(0):'';

    if(Number(row.exchangeStatus) === 2){
        this.showPrompt = true;
    }

    this.foreignExchangePopup = true;

    this.param.payNo = this.payNo;
    this.param.currency = this.orderInfoRelation.currency;
    this.param.id = this.orderInfoRelation.id;
    this.param.taxRefundOrderCode = row.taxRefundOrderCode;
    this.getForeignExchangeList(this.param);
}
//格式化金额
function outputmoney(number) {
    number = String(number).replace(/\,/g, "");

    if(isNaN(number) || number == ""){
        return "";
    }

    number = Math.round(number * 100) / 100;

    /*if (number < 0){
        return '-' + this.outputdollars(Math.floor(Math.abs(number) - 0) + '') + this.outputcents(Math.abs(number) - 0);
    }else{
        return '+' + this.outputdollars(Math.floor(number - 0) + '') + this.outputcents(number - 0);
    }*/

    return outputdollars(Math.floor(number - 0) + '') + outputcents(number - 0);
}
function outputdollars(number) {
    if (number.length <= 3){
        return (number == '' ? '0' : number);
    }else {
        let mod = number.length % 3;
        let output = (mod == 0 ? '' : (number.substring(0, mod)));
        for (let i = 0; i < Math.floor(number.length / 3); i++) {
            if ((mod == 0) && (i == 0))
                output += number.substring(mod + 3 * i, mod + 3 * i + 3);
            else
                output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
        }
        return (output);
    }
}
function outputcents(amount) {
    amount = Math.round(((amount) - Math.floor(amount)) * 100);
    return (amount < 10 ? '.0' + amount : '.' + amount);
}
function searchPayNo(){
    this.getForeignExchangeList(this.param);
}
//获取关联外汇列表
async function getForeignExchangeList(param) {
    try {
        let res = await this.ctx.models.taxrefund.getForeignExchange(param);
        let callback = (info) =>{
            this.base.foreignExchangeList = info.data;
            debugger;
            this.base.foreignExchangeList.forEach(v=>{
                v.remainAmount = outputmoney(v.remainAmount);
            })
        };
        this.callbackFun(res,callback,true);
    } catch (err) {
        //交给框架处理的异常
        this.ctx.onerror(err);
    }
}
function handleTabClick(tabName){
    if(tabName.name ==='first'){
        this.getForeignExchangeList(this.param);
    }else if(tabName.name ==='second'){
        this.getLinkedOrderList({id:this.param.taxRefundOrderCode});
    }
}
//获取关联外汇记录
async function getLinkedOrderList(param) {
    try {
        let res = await this.ctx.models.taxrefund.getLinkedOrder(param);
        let callback = (info) =>{
            this.base.linkedOrderList = info.data;
            this.base.linkedOrderList.forEach(v=>{
                if(!v.settleStatus){
                    v.settleStatus = 1;
                }
            })
        };
        this.callbackFun(res,callback,true);
    } catch (err) {
        //交给框架处理的异常
        this.ctx.onerror(err);
    }
}
//保存关联外汇
async function saveLinkedOrder(){
    let data = this.getIdAcount();
    if(data.exchanges.length){
        try {
            let res = await this.ctx.models.taxrefund.saveLinkedOrder(data);
            let callback = (info) =>{
                this.foreignExchangePopup = false;
            };
            this.callbackFun(res,callback,true);
        } catch (err) {
            //交给框架处理的异常
            this.ctx.onerror(err);
        }
    }else{
        if(!this.showPrompt){
            this.$message({
                showClose: true,
                message: '请选择关联外汇',
                type: 'error'
            });
        }else{
            this.foreignExchangePopup = false;
        }
    }
}
//截取秒
function spliceDateFun(data){
    let date = "";
    let dateMatch = /^\d{4}(\-\d{2}){2}\s+\d{2}\:\d{2}/;
    if (data && data.match(dateMatch)) {
        date = data.match(/^\d{4}(\-\d{2}){2}\s+\d{2}\:\d{2}/)[0];
    } else {
        date = "";
    }
    return date;
}
function linkTimeFormatter(row){
    row.linkTime = this.spliceDateFun(row.linkTime);
}
function settleStatusFormatter(row){
    switch (Number(row.settleStatus)){
        case 1 :
            row.settleStatusChange = '未结汇';
            break;
        case 2 :
            row.settleStatusChange = ' 结汇中';
            break;
        case 3 :
            row.settleStatusChange = '已结汇';
            break;
    }
}
//获取保存的关联外汇的id和关联金额
function getIdAcount(){
    let data = {
        exchanges:[],
        orderId:this.orderInfoRelation.id
    };

    this.base.foreignExchangeList.forEach((v)=>{
        if(v.remainAmount){
            data.exchanges.push({exchangeId:v.id,linkedAmount:Number(v.remainAmount.replace(/,/g,''))})
        }
    });

    return data;
}
//确认关联外汇收齐
async function clickConfirmForeignExchange(row){
    try {
        let res = await this.ctx.models.taxrefund.confirmForeignExchange(row.id);
        let callback = (info) =>{};
        this.callbackFun(res,callback);
    } catch (err) {
        //交给框架处理的异常
        this.ctx.onerror(err);
    }
}


function clickIsInvestigate (id, isList) {
    let callback = null;
    if (isList) {
        callback = this.refreshList;
    } else {
        callback = this.refreshPage;
    }
    this.$refs.isInvestigateDialog.show({
        id: id,
    }, callback);
}
function clickIsInvestigateComplete (id, isList) {
    let callback = null;
    if (isList) {
        callback = this.refreshList;
    } else {
        callback = this.refreshPage;
    }
    this.$refs.isInvestigateCompleteDialog.show({
        id: id,
    }, callback);
}



// 取消订单
async function clickCancelOrder(row) {
    // 批量的时候，传的event，通过currentTarget来判断单个or批量
    let callback = null;
    if (!row.currentTarget) {
        // 单个取消 待看回调，做到详情页看
        callback = this.refreshPage;
        this.$refs.updateRemarkDialog.show({
            postData: {
                ids: [row.id],
                param: row.cancelReason
            },
            submitConfig: {
                url: '/gcfsTaxRefundOrder/cancelTaxOrder'
            },
            title: '取消订单原因'
        }, callback);
        return;
    }
    // 批量
    if (this.selectionRows.length === 0) {
        this.$message({
            message: '请选择退税订单',
            type: 'warning'
        });
    } else {
        let isAllTrueStatus = this.selectionRows.every((row) => {
            return (row.status >= 4 && row.status <= 10) || row.status === 12
        });
        if (isAllTrueStatus) {
            let ids = this.selectionRows.map((row) => {
                return row.id
            });
            // 批量取消
            callback = this.refreshList;
            this.$refs.updateRemarkDialog.show({
                postData: {
                    ids: ids,
                    param: ''
                },
                submitConfig: {
                    url: '/gcfsTaxRefundOrder/cancelTaxOrder'
                },
                title: '取消订单原因'
            }, callback);
        } else {
            this.$message({
                message: '不能取消“处理状态”为“待审核”、“审核通过”、“已完成”和“已取消”的退税订单。',
                type: 'warning'
            });
        }
    }
}

// 修改备注
function updateRemark(row, isList) {
    let callback = null;
    if (isList) {
        callback = this.refreshList;
    } else {
        callback = this.refreshPage;
    }
    this.$refs.updateRemarkDialog.show({
        postData: {
            ids: [row.id],
            param: row.xbnRemark
        },
        submitConfig: {
            url: '/gcfsTaxRefundOrder/updateXBNRemark'
        },
        title: '备注'
    }, callback);
}
// 驳回
function clickMutipleReject(row, isList) {
    let callback = null;
    if (isList) {
        callback = this.refreshList;
    } else {
        callback = this.refreshPage;
    }
    this.$refs.updateRemarkDialog.show({
        postData: {
            ids: [row.id],
            param: row.rejectionReason
        },
        submitConfig: {
            url: '/gcfsTaxRefundOrder/batchReject'
        },
        buttonText: ['驳回', '取消'],
        title: '驳回原因'
    }, callback);
}
// 上传报关单证
function clickUploadCostome(row, isList) {
    let callback = null;
    if (isList) {
        callback = this.refreshList;
    } else {
        callback = this.refreshPage;
    }
    this.$refs.uploadCostom.show({
        postData: {
            id: row.id,
            param: row.rejectionReason
        },
    }, callback);
}
// 确认补充信息
function clickConfirmAddInfo(row, isList) {
    let callback = null;
    if (isList) {
        callback = this.refreshList;
    } else {
        callback = this.refreshPage;
    }
    this.$refs.confirmAddInfo.show({
        id: row.id
    }, callback);
}
// 录入发票信息
function clickInputInvoiceInfo(row, isList) {
    let callback = null;
    if (isList) {
        callback = this.refreshList;
    } else {
        callback = this.refreshPage;
    }
    this.$refs.inputInvoice.show({
        id: row.id
    }, callback);
}
// 录入退税信息
function clickInputRefundInfo(row, isList) {
    let callback = null;
    if (isList) {
        callback = this.refreshList;
    } else {
        callback = this.refreshPage;
    }
    this.$refs.inputRefund.show({
        id: row.id
    }, callback);
}

// 查看委托函
async function clickSeeEntrustment(row, isList) {
    // /gcfsTaxRefundOrder/checkLetter 查看委托函
    // {id: ''}
    if (isList) {
        // 列表也，需要请求接口获取url
        let res = await this.ctx.models.taxrefund.checkLetter({id: row.id});
        // debugger;
        for (let item of res.data) {
            if (item.fileType === '.pdf') {
                window.open(item.fileUrl);
                break;
            }
        }
        return;
    }
    window.open(row.entrustedLetter);
}



export default {
    methods: {
        deepCopy,
        routeTo,
        goBack,
        initBaseDictionary,
        // up common
        clickRelatedForeignExchange,
        getForeignExchangeList,
        searchPayNo,
        handleTabClick,
        saveLinkedOrder,

        clickCancelOrder,
        // clickAudit,
        updateRemark,
        clickMutipleReject,
        clickUploadCostome,
        clickConfirmAddInfo,
        clickInputInvoiceInfo,
        clickInputRefundInfo,
        clickSeeEntrustment,


        getLinkedOrderList,
        spliceDateFun,
        linkTimeFormatter,
        settleStatusFormatter,
        getIdAcount,
        clickConfirmForeignExchange,
        clickIsInvestigate,
        clickIsInvestigateComplete,
    },
    // init,
    // routeTo,
}
