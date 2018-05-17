X.define("model.roleModel",function () {

    //临时测试数据
    var query = "js/data/mockData/purchasers.json";
    var find = X.config.authority.api.getRoleById;
    var deleteUrl = X.config.authority.api.roleDelete;

    var roleModel =	X.model.create("model.roleModel",{service:{ query:query,delete:deleteUrl,find:find},"idAttribute":"roleId"});


    //管理员权限组信息获取
    roleModel.getPermission = function (callback) {

        var option = {url: X.config.authority.api.getAdminRole,type:"GET",callback:function(data){
            console.log("提交成功");
            callback&&callback(data);
        }};

        X.loadData(option);
    };

    //新增权限提交
    roleModel.addRole = function(data,callback) {

        var option = {url: X.config.authority.api.addRole,type:"POST",data:data,callback:function(){
            console.log("提交成功");
            callback&&callback();
        }};

        X.loadData(option);
    };

    //权限组获取
    roleModel.getRole = function (callback) {

        var option = {url: X.config.authority.api.getRole,type:"GET",callback:function(data){
            console.log("提交成功");
            callback&&callback(data);
        }};

        X.loadData(option);
    };

    //权限修改
    roleModel.changeRole = function (data,callback) {

        var option = {url: X.config.authority.api.changeRole+data.roleId,type:"PUT",data:data,callback:function(){
            console.log("提交成功");
            callback&&callback();
        }};

        X.loadData(option);
    };

    return roleModel;
});

