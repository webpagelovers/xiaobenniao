X.define("model.homeManagementModel",function () {

    var getList = X.config.homeManagement.api.getList;
    var getById = X.config.homeManagement.api.getById;

    var homeManagementModel =X.model.create("model.homeManagementModel",{idAttribute:"exportFormId",service:{find:null}});

    //根据page获取列表
    homeManagementModel.getList = function(callback){
        var option = {url: getList,type:"POST",callback:function(result){
            if(result.statusCode == "2000000") {
                var data = result.data.list;
                callback && callback(result);
            }
        }};

        X.loadData(option);
    };
    //根据id获取
    homeManagementModel.getById = function(feedbackId,callback){
        var option = {url: getById + feedbackId,type:"GET",callback:function(result){
            if(result.statusCode == "2000000"){
                callback&&callback(result.data[0]);
            }
        }};

        X.loadData(option);
    };

    //根据id设置
    homeManagementModel.setById = function(data,callback){
        var option = {url: getById,data:data,type:"PUT",callback:function(result){
            if(result.statusCode == "2000000"){
                callback&&callback(result.data[0]);
            }
        }};

        X.loadData(option);
    };



    homeManagementModel.const = {
        processStatus:["未处理","已处理"]
    };

    return homeManagementModel;
});