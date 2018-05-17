
X.define("model.userModel", function () {


    //临时测试数据
    var query = X.config.user.api.userlistByPage;
    var find = X.config.user.api.getUserById;
    var status = X.config.user.api.status;
    var audit = X.config.user.api.audit;
    var register = X.config.user.api.register;


    var userModel = X.model.create("model.userModel", {idAttribute: "userId", service: {query: query, find: find}});

    //获取用户信息列表
    userModel.getList = function (callback) {

        return X.loadData({
            "url": X.config.user.uri.getList, "type": "GET", callback: function (data) {
                callback(data);
            }
        });
    };


    userModel.checkLogin = function (callback) {

        var isLogin = $.cookie("isLogin");
        if (isLogin) {
            callback({statusCode: "2000000"});
        }
        else {
            callback({statusCode: "2000001"});
        }
        //return X.loadData({"url":X.config.user.uri.checkLogin,"type":"GET",callback:function (data) {
        //	callback(data);
        //}});
    };


    //前台注册提交
    userModel.register = function (data, callback) {
        var option = {
            data: data, url: register, type: "POST", callback: function (result) {
                if (result.statusCode == "2000000") {
                    callback && callback();
                }
            }
        };
        X.loadData(option);
    };


    //短信验证码
    userModel.msgCode = function (data, callback) {
        var option = {
            url: X.config.user.api.msgCode, type: "POST", callback: function () {
                console.log("发送短信验证码");
                callback && callback();
            }
        };
        X.loadData(option);
    };


    //新增用户信息提交
    userModel.addUser = function (data, callback) {
        var option = {
            url: X.config.user.api.addUser, type: "POST", success: function () {
                console.log("提交成功");
                callback && callback();
            }
        };
        X.loadData(option);
    };


    //用户状态
    userModel.StatusChange = function (data, callback) {
        var option = {
            url: status, type: "PUT", data: data, callback: function () {
                console.log("提交成功");
                callback && callback();
            }
        };
        X.loadData(option);
    };

    userModel.validateTel = function (callback) {
        setTimeout(1000, function () {
            callback({statusCode: 2000000});
        })
    };


    userModel.getUserById = function (option) {
        var callback = option.callback;
        var success = function (model) {
            var data = model.attributes;
            data.gender_text = (data.gender == userModel.const.gender.MALE.key) ? userModel.const.gender.MALE.text : userModel.const.gender.FEMALE.text;
            callback(model)
        };
        option.callback = success;
        this.find(option);
    };

    userModel.userAudit = function (data,callback) {
        var option = {url:audit, type:"POST", data:data, callback: function(result){
			callback && callback(result);
        }};

        X.loadData(option);
    };

    userModel.const = {
        gender: {
            FEMALE: {key: "0", text: "女"},
            MALE: {key: "1", text: "男"}

        }
    };

    userModel.statusconst = {
        status: {
            PENDING: {key: "0", text: "待审核"},
            PASS: {key: "1", text: "通过"},
            REJECT: {key: "1", text: "驳回"}
        },
        cases: [
            {key: "", value: "全部"},
            {key: 0, value: "待审核"},
            {key: 1, value: "通过"},
            {key: 2, value: "驳回"}
        ]
    };

    return userModel;
});