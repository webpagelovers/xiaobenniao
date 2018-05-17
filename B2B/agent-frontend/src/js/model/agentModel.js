X.define("model.agentModel",function () {
    var model =	X.model.create("model.agentModel"),
        api   = X.config.agent.api;

    model.submit = function() {

    };

    model.getAgentInfo = function(id, callback) {
        var option = {url:api.getAgent + id,type:"GET", callback:function(result) {
            callback && callback(result);
        }};

        X.loadData(option);
    };

    model.postAgentInfo = function(data, callback) {
        var option = {url:api.postAgent,type:"POST",contentType:"application/json", data:data,callback:function(result) {
            if (result.statusCode === X.constructor.prototype.CONSTANT.statusCode.SUCCESS){
                callback && callback(result);
            }
        }};

        X.loadData(option);
    };
    //agent注册提交
    model.aegenSubmit = function(data,callback) {
        var option = {url:X.config.agent.api.agentRegister,data:data,type:"post",callback:function(result){
            if(result.statusCode==X.constructor.prototype.CONSTANT.statusCode.SUCCESS){
                callback&&callback(result);
            }
        }};
        X.loadData(option);
    };

    //短信验证码
    model.msgCode = function (data,type, callback) {
        var option = {
            url: X.config.agent.api.mobileCode + data +"/"+type, type: "POST", callback: function (result) {
                    callback && callback(result);                    
            }
        };

        X.loadData(option);
    };
    // 获取agent信息
    model.getAgentUserInfo = function(callback) {
        var option = {url:api.getAgentInfo,type:"GET", callback:function(result) {
            callback && callback(result);
        }};

        X.loadData(option);
    };
    // 补充agent信息
    model.agentInformation = function(data,callback){
        var option = {url:X.config.agent.api.agentInformation,data:data,type:"post",callback:function(result){
            if(result.statusCode==X.constructor.prototype.CONSTANT.statusCode.SUCCESS){
                callback&&callback(result);
            }
        }};
        X.loadData(option);
    };
    model.languageType = [
        {key: 1, value: 'English'},
        {key: 9, value: 'Albanian'},
        {key:11, value: 'Arabic'},
        {key:12, value: 'Korean'},
        {key: 4, value: 'Spanish'},
        {key: 2, value: 'German'},
        {key:13, value: 'Russian'},
        {key: 3, value: 'French'},
        {key:14, value: 'Dutch'},
        {key: 5, value: 'Italian'},
        {key: 6, value: 'Portuguese'},
        {key:15, value: 'Thai'},
        {key: 8, value: 'Japanese'},
        {key:16, value: 'Turkish'},
        {key:10, value: 'Others'}
    ];
    
    return model
});