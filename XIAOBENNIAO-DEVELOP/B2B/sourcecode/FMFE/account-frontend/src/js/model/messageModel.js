X.define("model.messageModel",function () {

    //临时测试数据
    var query = "js/data/mockData/bidList.json";

    var messageModel =	X.model.create("model.messageModel",{idAttribute:"tenderId",service:{query:query}});

    //获取系统消息列表
    messageModel.listSystemMessages = function(callback){
        var option = {url: X.config.message.api.listSystemMessages,type:"POST",callback:function(result){
            if (result.statusCode == 2000000) {
                callback && callback(result);
            }
        }};

        X.loadData(option);
    };

    //获取系统公告
    messageModel.listPlatformMessages = function(callback){
        var option = {url: X.config.message.api.listPlatformMessages,type:"POST",callback:function(result){
            if (result.statusCode == 2000000) {
                callback && callback(result);
            }
        }};

        X.loadData(option);
    };

    //删除系统消息
    messageModel.deleteMessage = function(data,callback){
        var option = {url: X.config.message.api.deleteMessage+"?messageId="+data,type:"DELETE",callback:function(result){
            if (result.statusCode == 2000000) {
                callback && callback(result);
            }
        }};

        X.loadData(option);
    };

    //更改消息已读未读状态
    messageModel.readMessage = function(data,callback){
        var option = {url: X.config.message.api.readMessage,data:data,type:"POST",callback:function(result){
            if (result.statusCode == 2000000) {
                callback && callback(result);
            }
        }};

        X.loadData(option);
    };

    messageModel.deleteClientMessage = function(messageId,callback){
        var option = {url: X.config.message.api.deleteClientMessages + messageId, type:"DELETE",callback: function(result) {
            if (result.statusCode == 2000000) {
                callback && callback(result);
            }
        }};

        X.loadData(option);
    };

    messageModel.readClientMessage = function(messageId,callback){
        var option = {url: X.config.message.api.deleteClientMessages + messageId, type:"PUT",callback: function(result) {
            if (result.statusCode == 2000000) {
                callback && callback(result);
            }
        }};

        X.loadData(option);
    };

    messageModel.findUnReadClientMessageCount = function(callback){
        var option = {url: X.config.message.api.findUnReadClientMessageCount, type:"GET",callback: function(result) {
            if (result.statusCode == 2000000) {
                callback && callback(result);
            }
        }};

        X.loadData(option);
    };

    messageModel.getPlatformMessageCount = function(callback){
        var option = {url: X.config.message.api.getPlatformMessageCount, type:"GET",callback: function(result) {
            if (result.statusCode == 2000000) {
                callback && callback(result);
            }
        }};

        X.loadData(option);
    };

    messageModel.getSystemMessageCount = function(callback){
        var option = {url: X.config.message.api.getSystemMessageCount, type:"GET",callback: function(result) {
            if (result.statusCode == 2000000) {
                callback && callback(result);
            }
        }};

        X.loadData(option);
    };

    messageModel.getMessageCenterCount = function(callback){
        var option = {url: X.config.message.api.getMessageCenterCount, type:"GET",callback: function(result) {
            if (result.statusCode == 2000000) {
                callback && callback(result);
            }
        }};
        X.loadData(option);
    };

    messageModel.findMessageByPage = function (callback) {
        X.loadData({
            url: X.config.message.api.listClientMessages,
            type: "POST",
            dataType: "JSON",
            data: {
                pageNo: '1',
                pageSize: '3',
                query: {
                    messageSource: '1'
                }
            },
            callback: function (data) {
                if (data.statusCode == "2000000") {
                    callback(data);
                }
            }
        });
    };

    return messageModel;
});

