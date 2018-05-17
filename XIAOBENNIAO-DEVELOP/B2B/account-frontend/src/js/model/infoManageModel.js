X.define("model.infoManageModel", function () {

    var getList = X.config.infoManage.api.getList;
    var getById = X.config.infoManage.api.getById;
    var setIsRead = X.config.infoManage.api.setIsRead;
    var addRes = X.config.infoManage.api.addRes;
    var setMessage = X.config.infoManage.api.setMessage;
    var getMyResponseDetailById = X.config.infoManage.api.getMyResponseDetailById;
    var getStatistics = X.config.infoManage.api.getStatistics;
    var clearMyResponseNotice = X.config.infoManage.api.clearMyResponseNotice;
    var readByBussinessId = X.config.infoManage.api.readByBussinessId;
    var isResponseExist = X.config.infoManage.api.isResponseExist;
    var deleteMessage = X.config.infoManage.api.deleteMessage;

    var infoManageModel = X.model.create("model.infoManageModel", {});

    //查询匹配信息列表
    infoManageModel.getList = function (callback) {
        var option = {
            url: getList, type: "POST", callback: function (result) {
                if (result.statusCode == "2000000") {
                    var data = result.data.list;
                    callback && callback(result);
                }
            }
        };

        X.loadData(option);
    };

    //删除匹配信息
    infoManageModel._delete = function (purchaseInfoId,callback) {
        var option = {
            url: deleteMessage + purchaseInfoId, type: "DELETE", callback: function (result) {
                if (result.statusCode == "2000000") {
                    var data = result.data.list;
                    callback && callback(result);
                }
            }
        };

        X.loadData(option);
    };

    //查询采购信息详情
    infoManageModel.getById = function (purchaseInfoId, callback) {
        var option = {
            url: getById + purchaseInfoId, type: "GET", callback: function (result) {
                if (result.statusCode == "2000000") {
                    callback && callback(result.data[0]);
                }
            }
        };

        X.loadData(option);
    };

    //设置采购信息为已读
    infoManageModel.setIsRead = function (data, callback) {
        var option = {
            url: setIsRead + "?purchaseInfoId=" + data.purchaseInfoId, type: "PUT", callback: function (result) {
                if (result.statusCode == "2000000") {
                    var data = result.data.list;
                    callback && callback(result);
                }
            }
        };

        X.loadData(option);
    };

    //新增响应信息
    infoManageModel.addRes = function (data, callback) {
        var option = {
            url: addRes, data: data, type: "POST", callback: function (result) {
                if (result.statusCode == "2000000") {
                    var data = result.data.list;
                    callback && callback(result);
                }
            }
        };

        X.loadData(option);
    };

    infoManageModel.getMyResponseDetailById = function (exportFormId, callback) {
        var option = {
            url: getMyResponseDetailById + exportFormId + '/all', type: "GET", callback: function (result) {
                if (result.statusCode == "2000000") {
                    callback && callback(result.data[0]);
                }
            }
        };

        X.loadData(option);
    };

    infoManageModel.findMessageByPage = function (purchaseInfoId, callback) {
        X.loadData({
            url: X.config.message.api.listClientMessages,
            type: "POST",
            dataType: "JSON",
            data: {
                pageNo: '1',
                pageSize: '100',
                query: {
                    businessInfoId: purchaseInfoId
                }
            },
            callback: function (data) {
                if (data.statusCode == "2000000") {
                    callback(data);
                }
            }
        });
    };

    infoManageModel.listMyResponse = function (callback) {
        X.loadData({
            url: X.config.infoManage.api.myResponseList,
            type: "POST",
            dataType: "JSON",
            data: {
                pageNo: '1',
                pageSize: '3'
            },
            callback: function (data) {
                if (data.statusCode == "2000000") {
                    callback(data);
                }
            }
        });
    };

    //新增提问信息
    infoManageModel.setMessage = function (data, callback) {
        var option = {
            url: setMessage, data: data, type: "POST", callback: function (result) {
                if (result.statusCode == "2000000") {
                    var data = result.data.list;
                    callback && callback(result);
                }
            }
        };

        X.loadData(option);
    };

    infoManageModel.getStatistics = function (callback) {
        var option = {
            url: getStatistics, type: "GET", callback: function (result) {
                if (result.statusCode == 2000000) {
                    callback && callback(result);
                }
            }
        };

        X.loadData(option);
    };

    infoManageModel.clearMyResponseNotice = function (responseId, callback) {
        var option = {
            url: clearMyResponseNotice + "?responseId=" + responseId, type: "DELETE", callback: function (result) {
                if (result.statusCode == 2000000) {
                    callback && callback(result);
                }
            }
        };

        X.loadData(option);
    };

    infoManageModel.readByBussinessId = function (purchaseInfoId, callback) {
        var option = {
            url: readByBussinessId + purchaseInfoId, type: "PUT", callback: function (result) {
                if (result.statusCode == 2000000) {
                    callback && callback(result);
                }
            }
        };

        X.loadData(option);
    };

    //判断是否响应
    infoManageModel.isResponseExist = function (purchaseInfoId, callback) {
        var option = {
            url: isResponseExist + purchaseInfoId, type: "GET", callback: function (result) {
                if (result.statusCode == "2000000") {
                    callback && callback(result.data[0]);
                }
            }
        };

        X.loadData(option);
    };

    infoManageModel.CONSTANTS = {
        isRead: [
            {key: 0, value: "NEW"},
            {key: 1, value: "已读"}
        ],
        infoType: [
            {key: 0, value: "询价"},
            {key: 1, value: "招标"}
        ],
        status: [
            {key: 0, value: "进行中"},
            {key: 1, value: "进行中"},
            {key: 2, value: "进行中"},
            {key: 3, value: "失效"}
        ]
    };

    return infoManageModel;
});