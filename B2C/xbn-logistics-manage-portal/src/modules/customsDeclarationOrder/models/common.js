function clickDownloadCostome(row){
    this.customsDeclarationPopup = true;
    this.getDownloadCostome(row.id);
}

//获取报关资料
 async function getDownloadCostome(id){
    try {
        let res = await this.ctx.models.taxrefund.downLoadAllData(id);
        let callback = (info) =>{
            this.downloadCostome = info.data;
        };

        this.callbackFun(res,callback,true);

    } catch (err) {
        //交给框架处理的异常
        this.ctx.onerror(err);
    }

}

//下载报关单
async function downBaoGuanDan(){
    this.ctx.servers.tax.postFrom(this.url, {fileUrl:this.downloadCostome.bao_guan_dan.fileUrl,originalName:this.downloadCostome.bao_guan_dan.originalName} , {
        token: this.ctx.authentication.getToken()
    });
}

//下载QP单
function downQPDan(){
    this.ctx.servers.tax.postFrom(this.url, {fileUrl:this.downloadCostome.QP_dan.fileUrl,originalName:this.downloadCostome.QP_dan.originalName} , {
        token: this.ctx.authentication.getToken()
    });
}

//下载全部
function downAll(){
    this.ctx.servers.tax.postFrom(this.url, {fileUrl:this.downloadCostome.bao_guan_zi_liao.fileUrl,originalName:this.downloadCostome.bao_guan_zi_liao.originalName} , {
        token: this.ctx.authentication.getToken()
    });
    this.customsDeclarationPopup = false;
}

//下载开票模板
function clickDownloadTemplate(row){
    this.getDownloadTemplate(row.id);
}

//获取模板
async function getDownloadTemplate(id){
    try {
        this.ctx.servers.tax.postFrom(this.urlTemplate, {id:id} , {
            token: this.ctx.authentication.getToken(),
            method:'get'
        });

    } catch (err) {
        //交给框架处理的异常
        this.ctx.onerror(err);
    }

}

//提审
function goArraignment(data){
    let res, parm = [],d=false;
    if(this.$nt.isArray(data)){
        res = data.length;
        data.forEach((v)=>{
            if(v.status !==1){
                d = true;
                return ;
            }
            parm.push(v.id);
        })
    }else{
        res = data;
        if(res.status !==1){
            d = true;
        }

        parm = res.id;
    }
    if(res){
        if(d){
            this.$message({
                showClose: true,
                message: '无法提审状态不是“新建”的退税订单。',
                type: 'error'
            });
        }else{
            this.submitMutipleAudit(parm)
        }
    }else{
        this.$message({
            showClose: true,
            message: '请选择退税订单',
            type: 'error'
        });
    }
}

function taxDeleteFun(){
    this.submitMutipleDelete(this.taxNum)
}

//删除退税订单
function taxDelete(data){
    let res,parm = [],d=false;
    if(this.$nt.isArray(data)){
        res = data.length;
        data.forEach((v)=>{
            if(v.status ===1 || v.status ===12){
                d = true;
                return ;
            }
            parm.push(v.id);
        })
    }else{
        res = data;
        if(res.status ===1 || res.status ===12){
            d = true;
        }
        res ? parm = res.id:'';
    }
    if(res){
        if(!d){
            this.$message({
                showClose: true,
                message: '无法删除状态不是“新建”或“已驳回”的退税订单。',
                type: 'error'
            });
        }else{
            this.dialog = true;
        }
    }else{
        this.$message({
            showClose: true,
            message: '请选择退税订单',
            type: 'error'
        });
    }
    this.taxNum = parm;
}

//确认委托函
async function clickConfirmLetterOfEntrustment(id){
    this.letterOfEntrustmentPopup = true;
    this.taxId = id;
    try {
        let res = await this.ctx.models.taxrefund.findEntrustedLetter(id);
        let callback = (info) =>{
            if(info.data.length){
                info.data.forEach(v=>{
                    if(v.fileType === '.doc'){
                        this.letter.letterOfEntrustmentDownUrl = v.fileUrl;
                        this.letter.originalName = v.originalName;
                    }
                    if(v.fileType === '.pdf'){
                        debugger
                        this.letter.letterOfEntrustmentUrl = v.fileUrl;
                    }
                });
            }
            this.letterOfEntrustmentPopup = true;
        };

        this.callbackFun(res,callback,true);

    } catch (err) {
        //交给框架处理的异常
        this.ctx.onerror(err);
    }

}

//查看委托函
function readLetterOfEntrustment(){
    window.open(this.letter.letterOfEntrustmentUrl)
}

//确认签函
async function confirmationLetter(){
    try {
        let res = await this.ctx.models.taxrefund.confirmTheSignature(this.taxId);
        let callback = (info) =>{
            this.letterOfEntrustmentPopup = false;
        };

        this.callbackFun(res,callback);

    } catch (err) {
        //交给框架处理的异常
        this.ctx.onerror(err);
    }
}

//下载委托函
function confirmationLetterDown(){
    this.ctx.servers.tax.postFrom(this.url, {fileUrl:this.letter.letterOfEntrustmentDownUrl,originalName:this.letter.originalName} , {
        token: this.ctx.authentication.getToken()
    });
}

// 请求提审接口
async function submitMutipleAudit(param) {

    try {
        let res;
        if(this.$nt.isArray(param)){
            res = await this.ctx.models.taxrefund.batchPassList(param);
        }else{
            res = await this.ctx.models.taxrefund.batchPass(param);
        }

        let callback = (info) =>{
            this.$message({
                showClose: true,
                message: '选中的退税订单已提审成功！',
                type: 'success'
            });
        };

        this.callbackFun(res,callback);

    } catch (err) {
        //交给框架处理的异常
        this.ctx.onerror(err);
    }
}

// 请求删除接口
async function submitMutipleDelete(param) {

    try {
        let res;
        if(this.$nt.isArray(param)){
            res = await this.ctx.models.taxrefund.taxDelList(param);
        }else{
            res = await this.ctx.models.taxrefund.taxDel(param);
        }

        let callback = (info) =>{
            this.dialog = false;
            this.$message({
                showClose: true,
                message: '选中的退税订单已删除成功！',
                type: 'success'
            });

            if(this.$route.params && this.$route.params.id){
                this.$router.back();
            }
        };

        if(this.$route.params && this.$route.params.id){
            this.callbackFun(res,callback,true);
        }else{
            this.callbackFun(res,callback);
        }
    } catch (err) {
        //交给框架处理的异常
        this.ctx.onerror(err);
    }
}

//点击关联外汇
function clickRelatedForeignExchange(row){
    this.orderInfo = row;

    if(this.orderInfo.totalCommidityValue){
         if(this.orderInfo.linkedAmount && (Number(this.orderInfo.linkedAmount) > Number(this.orderInfo.totalCommidityValue))){
            this.orderInfo.percentage = 100;
        }else if(this.orderInfo.linkedAmount && this.orderInfo.linkedAmount > 0 && (Number(this.orderInfo.linkedAmount) <= Number(this.orderInfo.totalCommidityValue))){
            this.orderInfo.percentage = (this.orderInfo.linkedAmount/this.orderInfo.totalCommidityValue)*100;
        }else{
             this.orderInfo.percentage = 0;
         }
    }

    Number(this.orderInfo.linkedAmount) <= 0 ? this.orderInfo.linkedAmount = this.outputmoney(Number(this.orderInfo.linkedAmount)) : this.orderInfo.linkedAmount = this.outputmoney(this.orderInfo.linkedAmount);
    this.orderInfo.totalCommidityValue = this.outputmoney(this.orderInfo.totalCommidityValue);
    this.orderInfo.waitLinkedAmount < 0 ? this.orderInfo.waitLinkedAmount = this.outputmoney(0): this.orderInfo.waitLinkedAmount = this.outputmoney(this.orderInfo.waitLinkedAmount);

    if(Number(row.exchangeStatus) === 2){
        this.showPrompt = true;
    }

    this.foreignExchangePopup = true;

    this.param.payNo = this.payNo;
    this.param.currency = this.orderInfo.currency;
    this.param.id = this.orderInfo.id;
    this.param.taxRefundOrderCode = row.taxRefundOrderCode;

    this.getForeignExchangeList(this.param);
}

function searchPayNo(){
    this.getForeignExchangeList(this.param);
}

function handleTabClick(tabName){
    if(tabName.name ==='first'){
        this.getForeignExchangeList(this.param);
    }else if(tabName.name ==='second'){
        this.getLinkedOrderList({id:this.param.taxRefundOrderCode});
    }
}

//获取关联外汇列表
async function getForeignExchangeList(param) {
    try {
        let res = await this.ctx.models.taxrefund.getForeignExchange(param);
        let callback = (info) =>{
            this.baseData.foreignExchangeList = info.data;

            this.baseData.foreignExchangeList.forEach(v=>{
                v.remainAmount ? v.placeholderAmount = this.outputmoney(Number(v.remainAmount)): v.placeholderAmount = 0;
                v.remainAmount = null;
                v.receiptAmount ? v.receiptAmount = this.outputmoney(Number(v.receiptAmount)):'';
                v.relevancyAmount ? v.relevancyAmount = this.outputmoney(Number(v.relevancyAmount)):'';
            })

            this.param.orderBy = null;
            this.param.ascOrDesc = null;
        };
        this.callbackFun(res,callback);
    } catch (err) {
        //交给框架处理的异常
        this.ctx.onerror(err);
    }
}

//获取保存的关联外汇的id和关联金额
function getIdAcount(){
    let data = {
        exchanges:[],
        orderId:this.orderInfo.id
    };

    this.baseData.foreignExchangeList.forEach((v)=>{
        if(v.remainAmount){
            data.exchanges.push({exchangeId:v.id,linkedAmount:Number(v.remainAmount.replace(/,/g,''))})
        }
    });

    return data;
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
            this.callbackFun(res,callback);
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

//获取关联外汇记录
async function getLinkedOrderList(param) {
    try {
        let res = await this.ctx.models.taxrefund.getLinkedOrder(param);
        let callback = (info) =>{
            this.baseData.linkedOrderList = info.data;

            this.baseData.linkedOrderList.forEach(v=>{
                if(!v.settleStatus){
                    v.settleStatus = 1;
                }
                v.amount ? v.amountChange = this.outputmoney(Number(v.amount)):'';
                v.receiptAmount ? v.receiptAmount = this.outputmoney(Number(v.receiptAmount)):'';
            })

            this.param.orderBy = null;
            this.param.ascOrDesc = null;
        };
        this.callbackFun(res,callback,true);
    } catch (err) {
        //交给框架处理的异常
        this.ctx.onerror(err);
    }
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

//取消关联
async function cancleLink(param){
    param.orderId = this.orderInfo.id;
    param.exchanges = [];
    param.exchanges.push({exchangeId:param.exchangeId,linkedAmount:param.amount});

    try {
        let res = await this.ctx.models.taxrefund.cancelLink(param);
        let callback = (info) =>{
            this.getLinkedOrderList({id:this.param.taxRefundOrderCode});
        };
        this.callbackFun(res,callback,true);
    } catch (err) {
        //交给框架处理的异常
        this.ctx.onerror(err);
    }
}


function linkTimeFormatter(row){
    row.linkTime = this.spliceDateFun(row.linkTime);
}

//自动补0
function addAutomaticZero(row){
    row.remainAmount = this.outputmoney(row.remainAmount);
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

    return this.outputdollars(Math.floor(number - 0) + '') + this.outputcents(number - 0);
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

export default {
    methods: {
        clickDownloadCostome,
        getDownloadCostome,
        downBaoGuanDan,
        downQPDan,
        downAll,
        clickDownloadTemplate,
        getDownloadTemplate,
        goArraignment,
        taxDeleteFun,
        taxDelete,
        clickConfirmLetterOfEntrustment,
        readLetterOfEntrustment,
        confirmationLetter,
        submitMutipleAudit,
        submitMutipleDelete,
        clickRelatedForeignExchange,
        searchPayNo,
        handleTabClick,
        getForeignExchangeList,
        getIdAcount,
        saveLinkedOrder,
        clickConfirmForeignExchange,
        getLinkedOrderList,
        confirmationLetterDown,
        settleStatusFormatter,
        cancleLink,
        linkTimeFormatter,
        spliceDateFun,
        addAutomaticZero,
        outputmoney,
        outputdollars,
        outputcents
    },
}