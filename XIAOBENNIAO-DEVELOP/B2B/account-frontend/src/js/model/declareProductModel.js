X.define("model.declareProductModel", function () {

    //临时测试数据
    var query = "js/data/mockData/bidList.json";
    var find = X.config.customerClearance.api.declareProduct;
    var additional = X.config.customerClearance.api.additional;
    var productDown = X.config.customerClearance.api.productDown;
    var productUp = X.config.customerClearance.api.productUp;

    var declareProductModel = X.model.create("model.declareProductModel", {
        idAttribute: "productId",
        service: {query: query, find: find, delete: find}
    });

    //创建报关产品
    declareProductModel.addDeclareProduct = function (data, callback) {
        var option = {
            url: find, type: "POST", data: data, callback: function (result) {
                if (result.statusCode == 2000000) {
                    callback && callback(result);
                }
            }
        };

        X.loadData(option);
    };


    //修改报关产品
    declareProductModel.changeDeclareProduct = function (data, callback) {
        var option = {
            url: find, type: "PUT", data: data, callback: function (result) {
                if (result.statusCode == 2000000) {
                    callback && callback(result);
                }
            }
        };

        X.loadData(option);
    };

    //获取报关产品详情
    declareProductModel.getDeclareProduct = function (data, callback) {
        var option = {
            url: find + data.productId, type: "GET", callback: function (result) {
                if (result.statusCode == 2000000) {
                    callback && callback(result);
                }
            }
        };

        X.loadData(option);
    };

    //修改补充内容
    declareProductModel.additional = function (data, callback) {
        var option = {
            url: additional, type: "PUT", data: data, callback: function (result) {
                if (result.statusCode == 2000000) {
                    callback && callback(result);
                }
            }
        };

        X.loadData(option);
    };

    //产品下架
    declareProductModel.productDown = function (productId, callback) {
        var option = {
            url: productDown + productId, type: "PUT", callback: function (result) {
                if (result.statusCode == 2000000) {
                    callback && callback(result);
                }
            }
        };

        X.loadData(option);
    };

    //产品上架
    declareProductModel.productUp = function (productId, callback) {
        var option = {
            url: productUp + productId, type: "PUT", callback: function (result) {
                if (result.statusCode == 2000000) {
                    callback && callback(result);
                }
            }
        };

        X.loadData(option);
    };



    declareProductModel.constants = {
        searchStatus: [
            {key: 8, value: "全部"},
            {key: 0, value: "草稿"},
            {key: 1, value: "审核中"},
            {key: 2, value: "通过"},
            {key: 3, value: "待完善"},
            {key: 4, value: "驳回"},
            {key: 5, value: "回收站"}
        ],
        status: [
            {key: 0, value: "草稿"},
            {key: 1, value: "审核中"},
            {key: 2, value: "通过"},
            {key: 3, value: "待完善"},
            {key: 4, value: "驳回"},
            {key: 5, value: "回收站"}
        ]
    }

    return declareProductModel;
});

