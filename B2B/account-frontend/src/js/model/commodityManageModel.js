X.define("model.commodityManageModel",function () {

    //临时测试数据
    var query = "js/data/mockData/bidList.json";

    var commodityManageModel =	X.model.create("model.commodityManageModel",{idAttribute:"commodityId",service:{query:query}});

    //提交商品信息
    commodityManageModel.postCommodity = function(data,callback){
        var option = {url: X.config.commodityManage.api.addCommodity,type:"POST",data:data,callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };

    //修改商品信息
    commodityManageModel.putCommodity = function(data,callback){
        var option = {url: X.config.commodityManage.api.addCommodity,type:"PUT",data:data,callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };

    //获取商品信息详情
    commodityManageModel.getCommodity = function(data,callback){
        var option = {url: X.config.commodityManage.api.commodityDetail + data,type:"GET",callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };

    //删除商品
    commodityManageModel.deleteCommodity = function(data, callback){
        var option = {url: X.config.commodityManage.api.deleteCommodity, data:data, type: "DELETE", callback: function(result) {
            if (result.statusCode == "2000000") {
                callback && callback(result);
            }
        }};

        X.loadData(option);
    };

    commodityManageModel.CONSTANTS = {
        status: [
            {key: 0, value: "草稿"},
            {key: 1, value: "上架"}
        ]
    };


    return commodityManageModel;
});

