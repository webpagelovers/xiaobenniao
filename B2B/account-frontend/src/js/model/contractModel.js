X.define("model.contractModel",function () {

    //临时测试数据
    var query = "js/data/mockData/bidList.json";
    var find = X.config.contract.api.contractHandel;

    var contractModel = X.model.create("model.contractModel",{idAttribute:"contractId",service:{query:query,find:find}});

    //创建合同信息
    contractModel.addContract = function (data,callback){
        var option = {url:find,type:"POST",data:data,callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };

    //修改合同信息
    contractModel.changeContract = function (data,callback){
        var option = {url:find,type:"PUT",data:data,callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };

    //获取合同详细信息
    contractModel.getContract = function (data,callback){
        var url = find+data.contractId;
        var option = {url:url,type:"GET",callback:function(result){
            if(result.statusCode == 2000000){
                callback&&callback(result);
            }
        }};

        X.loadData(option);
    };

    //获取账户资金信息
    contractModel.getAcountInfo = function (callback){
        var url = X.config.contract.api.fundDetails;
        var option = {url:url+"fundTotal",type:"GET",callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };

    //获取账户资金管理详细信息
    contractModel.getAcountDetailInfo = function (data,callback){
        var url = X.config.contract.api.fundDetails;
        var option = {url:url+"fundDetails/"+data.exportFormId,type:"GET",callback:function(result){
            if(result.statusCode == 2000000){
                callback&&callback(result);
            }
        }};

        X.loadData(option);
    };

    //删除联系人信息
    contractModel.deleteContract = function(data, callback){
        var option = {url: find,data: data, type:"DELETE",callback:function(result){
            if(result.statusCode == "2000000") {
                callback && callback(result);
            }
        }};

        X.loadData(option);
    };

    contractModel.constants = {
        searchStatus : [
            { key : "", value :"全部"},
            { key : 0, value :"已保存"},
            { key : 1, value :"待审批"},
            { key : 2, value :"审批驳回"},
            { key : 3, value :"已生效" }
        ],
        viewStatus:{
            SAVED:{key : "0",text : "已保存"},
            AUDIT:{key : "1",text : "待审批"},
            REJECTED:{key : "2",text : "审批驳回"},
            EFFECT:{key : "3",text : "已生效"}
        },
        settlementStatus : [
            { key : "", value :"全部"},
            { key : 0, value :"未入账"},
            { key : 1, value :"已结汇"},
            { key : 2, value :"已提取" }
        ],
        refundStatus : [
            { key : "", value :"全部"},
            { key : 0, value :"未退税"},
            { key : 1, value :"已退税"},
            { key : 2, value :"已提取" }
        ],
        currencyArr:[
            {key:0,value:"USD"},
            {key:1,value:"HKD"},
            {key:2,value:"EUR"},
            {key:3,value:"CNY"},
            {key:4,value:"GBP"},
            {key:5,value:"AED"},
            {key:6,value:"AUD"},
            {key:7,value:"CAD"},
            {key:8,value:"CHF"},
            {key:9,value:"JPY"},
            {key:10,value:"NZD"},
            {key:11,value:"SEK"},
            {key:12,value:"SGD"}
        ]
    };

    contractModel.getItemById = function(id, key, list) {
        var item = null;
        if (list && list instanceof Array && list.length) {
            for (var i = list.length - 1; i >= 0; i--) {
                if ( list[i][key] == id) {
                    item = list[i];
                    break
                }
            }
        }

        return item;
    };

    return contractModel;
});

