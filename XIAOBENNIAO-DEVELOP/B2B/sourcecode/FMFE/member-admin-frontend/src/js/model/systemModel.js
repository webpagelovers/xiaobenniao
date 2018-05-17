X.define("model.systemModel",function () {

    //临时测试数据
    var query = "js/data/mockData/purchasers.json";

    var systemModel =	X.model.create("model.systemModel",{service:{ query:query}});


    //修改管理员密码提交
    systemModel.changePass = function (data,callback) {

        var option = {data:data,url:X.config.authority.api.changePass,type:"PUT",callback:function(result){
            if(result.statusCode=="2000000"){
                console.log("修改成功");
                callback&&callback();
            }
        }};

        X.loadData(option);
    };

    return systemModel;
});
