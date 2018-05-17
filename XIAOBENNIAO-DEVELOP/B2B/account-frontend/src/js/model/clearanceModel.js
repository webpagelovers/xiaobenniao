X.define("model.clearanceModel",function () {

    //临时测试数据
    var query = "js/data/mockData/bidList.json";

    var clearanceModel =	X.model.create("model.clearanceModel",{idAttribute:"tenderId",service:{query:query}});

    //提交报关单
    clearanceModel.applyClearance = function(data,callback){
        var option = {url: X.config.customerClearance.api.applyClearance,type:"POST",data:data,callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };

    //提交添加账户信息
    clearanceModel.postAcount = function(data,callback){
        var option = {url: X.config.customerClearance.api.postAcount,type:"POST",data:data,callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };

   //获取结汇/退税收款账户列表
    clearanceModel.getAcountList = function(callback){
        var option = {url: X.config.customerClearance.api.getAcountList,type:"GET",callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };


    //提交添加联系人信息
    clearanceModel.postContacts = function(data,callback){
        var option = {url: X.config.customerClearance.api.postContacts,type:"POST",data:data,callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };

    //修改联系人信息
    clearanceModel.putContacts = function(data,callback){
        var option = {url: X.config.customerClearance.api.postContacts,type:"PUT",data:data,callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };

    //获取联系人列表
    clearanceModel.getContactsList = function(callback){
        var option = {url: X.config.customerClearance.api.getContactsList,type:"GET",callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };

    return clearanceModel;
});

