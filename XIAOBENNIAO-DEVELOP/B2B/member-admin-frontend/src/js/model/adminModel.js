X.define("model.adminModel",function () {

    //临时测试数据
    var query = "js/data/mockData/purchasers.json";
    var find = X.config.authority.api.getAdminById;
    var deleteUrl = X.config.authority.api.delete;

    var adminModel =	X.model.create("model.adminModel",{service:{ query:query,delete:deleteUrl,find:find},"idAttribute":"backendUserId"});

    //新增管理员信息提交
    adminModel.addAdmin = function (data,callback) {

        var option = {url: X.config.authority.api.addAdmin,type:"POST",data:data,callback:function(){
            console.log("提交成功");
            callback&&callback();
        }};

        X.loadData(option);
    };

    //修改管理员信息提交
    adminModel.changeAdmin = function (data,callback) {

        var option = {url: X.config.authority.api.changeAdmin,type:"PUT",data:data,callback:function(){
            console.log("提交成功");
            callback&&callback();
        }};

        X.loadData(option);
    };


    //管理员登录
    adminModel.login = function (data,callback) {
          var option = {
            url: X.config.authority.api.login,
            type:"POST",            
            contentType: "application/json;charset=utf-8",
            data: data,
            callback:function(result){
                if (result.statusCode == X.constant.statusCode.SUCCESS) {
                    callback&&callback(result)
                } else {
                    layer.alert(result.message)
                }
                /*if(result.statusCode=="2000000"){
                    if(X.isArray(result.data)){
                        adminModel.currentAdminModel = adminModel.create(result.data[0]);

                        console.log("管理员登录");
                        callback&&callback();
                    }                
                }*/            
        }};

        X.loadData(option);

    };

    adminModel.logout = function (callback) {
        var option = {
            url : X.config.authority.api.logout,  
            type:"POST",
            callback:function(result){
                if (result.statusCode == X.constant.statusCode.SUCCESS) {
                    callback&&callback(result)
                } else {
                    layer.alert(result.message)
                }
            }            
        }

        X.loadData(option);
    };

    adminModel.checkLogin = function (callback) {
        var isLogin = $.cookie("isLogin");
        if(isLogin){
            callback({statusCode:"2000000"});
        }
        else{
            callback({statusCode:"2000001"});
        }
    };
    //管理员登录后信息查询 GET /backendUser/loginInformation
    adminModel.getAdminInfo = function (callback) {
        var option = {url: X.config.admin.api.getAdminInfo,type:"GET",callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);

    };
    return adminModel;
});

