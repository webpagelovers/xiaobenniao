X.define("model.clearanceModel",function () {

    //临时测试数据
    var query = "js/data/mockData/bidList.json";

    var clearanceModel =	X.model.create("model.clearanceModel",{idAttribute:"tenderId",service:{query:query}});


    //修改报关单信息
    clearanceModel.applyClearance = function(data,callback){
        var option = {url: X.config.customerClearance.api.applyClearance,type:"PUT",data:data,callback:function(result){
            console.log("提交成功");
            callback&&callback(result);
        }};

        X.loadData(option);
    };

    //修改添加账户信息
    clearanceModel.postAcount = function(data,callback){
        var option = {url: X.config.customerClearance.api.postAcount,type:"PUT",data:data,callback:function(result){
            console.log("提交成功");
            callback&&callback(result);
        }};

        X.loadData(option);
    };

    //修改联系人信息
    clearanceModel.putContacts = function(data,callback){
        var option = {url: X.config.customerClearance.api.postContacts,type:"PUT",data:data,callback:function(result){
            console.log("提交成功");
            callback&&callback(result);
        }};

        X.loadData(option);
    };


    return clearanceModel;
});

