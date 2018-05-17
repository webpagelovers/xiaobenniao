X.define("model.publicBidModel",function () {

    //临时测试数据
    var query = "js/data/mockData/bidList.json";

    var publicBidModel =	X.model.create("model.publicBidModel",{idAttribute:"tenderId",service:{query:query}});


    //获取公共投标资审公告
    publicBidModel.qualificationApply = function (data,callback) {
        var url = X.config.bid.api.qualificationApply;
        var option = {url:url,type:"PUT",data:data,callback:function(result){
            if(result.statusCode == 2000000){
                callback&&callback(result);
            }
        }};

        X.loadData(option);
    };

    //新增我的投标资审公告报名
    publicBidModel.qualificationApply = function (data,callback) {
        var url = X.config.bid.api.qualificationApply;
        var option = {url:url,type:"POST",data:data,callback:function(result){
            if(result.statusCode == 2000000){
                callback&&callback(result);
            }
        }};

        X.loadData(option);
    };

    //提交公共招标我的投标文件信息
    publicBidModel.postFile = function (data,callback) {
        var option = {url: X.config.bid.api.postFile,type:"POST",data:data,callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };

    //获取公开招标我的投标文件
    publicBidModel.getPublicBidFile = function (data,callback) {
        var option = {url: X.config.bid.api.getPublicBidFile+data.tenderId,type:"GET",callback:function(result){
            if(result.statusCode == 2000000){
                callback&&callback(result);
            }
        }};

        X.loadData(option);
    };

    publicBidModel.CONSTANTS = {
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
            { key : 4, value :"报名中" },
            { key : 5, value :"资审中" },
            { key : 0, value :"投标中" },
            { key : 1, value :"开标中" }
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
    return publicBidModel;
});

