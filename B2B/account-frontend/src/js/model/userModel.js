X.define("model.userModel",function () {

    //临时测试数据
    var query = "js/data/mockData/bidList.json";
    var find = "";

    var userModel =	X.model.create("model.userModel",{idAttribute:"tenderId",service:{query:query,find:find}});

    //获取系统消息列表
    userModel.getUserInfo = function(callback){
        var option = {url: X.config.user.api.userId,type:"GET",callback:function(result){
            userModel.userInfo = result.data[0]
            callback&&callback(result);
        }};

        X.loadData(option);
    };
    //邮箱
    userModel.bindEmail = function(data,callback){
        var option = {url:X.config.accountSettings.api.bindEmail,data:data,type:"POST",callback:function(result){
            if(result.statusCode=="2000000"){
                callback&&callback(result);
            }
        }};
        X.loadData(option);
    };

    //修改密码
    userModel.password = function (data,callback) {
        var option = {url:X.config.accountSettings.api.resetPassword,data:data,type:"PUT",callback:function(result){
            if(result.statusCode=="2000000"){
                callback&&callback(result);
            }
        }};
        X.loadData(option);
    };

    //退出
    userModel.logout = function(callback){
        var option = {url: X.config.user.api.logout,type:"GET",callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };
    userModel.constants = {
        gender :{
            FEMALE : { key : "0", text :"女" },
            MALE : { key : "1", text :"男" }
        }
    };
    userModel.userInfo = null


    return userModel;
});

