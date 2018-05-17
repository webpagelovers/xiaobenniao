X.define("model.bidModel",function () {

    //临时测试数据
    var query = "js/data/mockData/bidList.json";

    var bidModel =	X.model.create("model.bidModel",{idAttribute:"tenderId",service:{query:query}});


    //获取我的投标资审公告
    bidModel.qualificationInfo = function (data,callback) {
        var url = X.config.bid.api.qualificationInfo+"/"+data.tenderId;
        var option = {url:url,type:"GET",callback:function(result){
            if(result.statusCode == 2000000){
                callback&&callback(result);
            }
        }};

        X.loadData(option);
    };

    //新增我的投标资审公告报名
    bidModel.postQualificationApply = function (data,callback) {
        var url = X.config.bid.api.qualificationApply;
        var option = {url:url,type:"POST",data:data,callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };
    //修改我的投标资审公告报名
    bidModel.qualificationApply = function (data,callback) {
        var url = X.config.bid.api.qualificationApply;
        var option = {url:url,type:"PUT",data:data,callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };

    //获取我的投标资审变更
    bidModel.getQualification = function (data,callback) {
        var url = X.config.bid.api.qualification+data.tenderId;
        var option = {url:url,type:"GET",callback:function(result){
            if(result.statusCode == 2000000){
                callback&&callback(result);
            }
        }};

        X.loadData(option);
    };



    //获取我的投标列表
    bidModel.getTenderIdItem = function (data,callback) {
        var url = X.config.bid.api.getMyBidById+data.tenderId+"/tender";
        var option = {url:url,type:"GET",callback:function(result){
            if(result.statusCode == 2000000){
                callback&&callback(result);
            }
        }};

        X.loadData(option);
    };


    //获取我的投标我的招标文件
    bidModel.getFile = function (data,callback) {
        var option = {url: X.config.bid.api.getFile+data.biddingId,type:"GET",callback:function(result){
            if(result.statusCode == 2000000){
                callback&&callback(result);
            }
        }};

        X.loadData(option);
    };

    //修改我的投标我的招标文件信息
    bidModel.putFile = function (data,callback) {
        var option = {url: X.config.bid.api.postFile,type:"PUT",data:data,callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };

    //获取我的投标变更内容
    bidModel.getChangeList = function (data,callback) {
        var option = {url: X.config.bid.api.getChangeList+data.tenderId,type:"GET",callback:function(result){
            if(result.statusCode == 2000000){
                callback&&callback(result);
            }
        }};

        X.loadData(option);
    };

    //获取我的投标招标答疑
    bidModel.getTabAnswerQuestionList = function (data,callback) {
        var option = {url: X.config.bid.api.tabAnswerQuestion,data:data,type:"POST",callback:function(result){
            if(result.statusCode == 2000000){
                callback&&callback(result);
            }
        }};

        X.loadData(option);
    };

    //提交我的投标招标答疑提问问题
    bidModel.postQuestion = function (data,callback) {
        var option = {url: X.config.bid.api.postQuestion,data:data,type:"POST",callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };
    //提交我的投标投标澄清回答问题
    bidModel.postAnswer = function (data,callback) {
        var option = {url: X.config.bid.api.postAnswer,data:data,type:"PUT",callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };

    //清除变更通知
    bidModel.clearNotice = function (data,callback) {
        var option = {url: X.config.bid.api.clearNotice+"?tenderId="+data.tenderId,type:"DELETE",callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };


    bidModel.CONSTANTS = {
        tenderStatus:{
            TENDER: { key : 0, value :"投标中" },
            BIDOPEN: { key : 1, value :"开标中" },
            END: { key : 2, value :"已结束" },
            SIGN: { key : 4, value :"报名中" },
            INSTANCE: { key : 5, value :"资审中" },
            WASTE: { key : 100, value :"废标" },
            FLOWMARK: { key : 200, value :"已中标" }
        },
        status :[
            { key : "", value :"全部" },
            { key : 200, value :"已中标" },
            { key : 4, value :"报名中" },
            { key : 5, value :"资审中" },
            { key : 0, value :"投标中" },
            { key : 1, value :"开标中" },
            { key : 2, value :"已结束" },
            { key : 100, value :"废标" }
        ],
        receiver : {
         OPEN:  { key : 0, value :"公开招标" },
         INVITATION:  { key : 1, value :"邀请招标" }
        },
        rece :[
             { key : 0, value :"公开招标" },
             { key : 1, value :"邀请招标" }
        ]
    };
    return bidModel;
});

