X.define("model.systemMessageModel",function () {

    //临时测试数据
    var query = "js/data/mockData/purchasers.json";
    var find = X.config.system.api.systemMessageDisplay;

    var systemMessageModel = X.model.create("model.systemMessageModel",{idAttribute:"messageId",service:{query:query,find:find,delete:find}});

    //管理员信息提交
    systemMessageModel.addAdmin = function (data,callback) {

        var option = {url: X.config.system.api.addAdmin,type:"POST",data:data,callback:function(){
            //console.log("提交成功");
            callback&&callback();
        }};

        X.loadData(option);
    };

    //管理员权限组信息获取
    systemMessageModel.getPermission = function (data,callback) {

        var option = {url: X.config.system.api.addAdmin,type:"POST",data:data,callback:function(){
            //console.log("提交成功");
            callback&&callback();
        }};

        X.loadData(option);
    };
    /*   systemModel.const = {
     status :{
     ALL : { key : "0", text :"全部企业" },
     SUPPLIER : { key : "1", text :"全部供应商" },
     PURCHASER : { key : "2", text :"全部采购商" }
     }
     };*/
    //systemMessageModel.const ={
    //
    //};


    systemMessageModel.save = function(data,callback){
        var option = {url:X.config.system.api.systemMessageSave,type:"POST",data:data,callback:function(result){
                callback&&callback(result);

        }};

        X.loadData(option);
    };

    systemMessageModel.send = function(data,callback){
        var option = {url:X.config.system.api.systemMessageSend,type:"POST",data:data,callback:function(result){
                callback&&callback(result);

        }};

        X.loadData(option);
    };
    systemMessageModel.getMessageById = function(option){

        var callback = option.callback;
        var success = function(model){
            var data = model.attributes;
            callback(model)
        };

        option.callback = success;
        this.find(option);
    };
    systemMessageModel.messageDelete = function (data,callback) {

        var option = {url: find,type:"DELETE",data:data,callback:function(){
            callback&&callback();
        }};

        X.loadData(option);
    };
    systemMessageModel.const = {
        status :{
            UNPOST : { key : "0", text :"未发布" },
            POSTED : { key : "1", text :"已发布" }
        },
        receiver : [
            { key : 0, value :"全部企业" },
            { key : 1, value :"供应商" },
            { key : 2, value :"采购商" }
        ]
    };
    return systemMessageModel;
});
