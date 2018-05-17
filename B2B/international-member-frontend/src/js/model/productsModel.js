X.define("model.productsModel",function () {
    var productsModel =	X.model.create("model.productsModel");


    productsModel.getBrowseProducts = function(callback){
        var option = {};
        option.url  = X.config.index.api.browseProducts;

        option.type = 'GET';
        option.callback = callback;

        X.loadData(option)
    };
    //GET /api/international/product/recommendProducts
    productsModel.getRecentUpdates = function(callback){
            var option = {url:X.config.index.api.getRecentUpdates,type:"GET",callback:function(result){
                callback&&callback(result);

            }};

            X.loadData(option);

    };

    //buyingRequest
    productsModel.postBuyingRequest = function(data ,callback){
        var option = {url:X.config.request.api.buyRequest,type:"POST",data:data,callback:function(result){
            callback&&callback(result);
        }};
        X.loadData(option);
    };

    //sourcingRequest
    productsModel.postSourcingRequest = function(data ,callback){
        var option = {url:X.config.request.api.sourcingRequest,type:"POST",data:data,callback:function(result){
            callback&&callback(result);
        }};
        X.loadData(option);
    };

    //get sourcingRequest
    productsModel.getSourcingRequestById = function(id,callback){
        var option = {url:X.config.request.api.sourcingRequest + id,type:"GET",callback:function(result){
            callback&&callback(result);
        }};
        X.loadData(option);
    };

    //获取产品列表
    productsModel.getProductList = function(callback){
        var option = {url:X.config.product.api.getproductList,type:"GET",callback:function(result){
            callback&&callback(result);
        }};
        X.loadData(option);
    };
    //获取搜索关联热词
    productsModel.getSearchHotWord = function(data,callback){
        var option = {url:X.config.product.api.getsearchHotWords,data:data,type:"POST",callback:function(result){
            callback&&callback(result);
        }};
        X.loadData(option);
    };
    //产品详情推荐
    productsModel.getsearchRecommend = function(data,callback){
        var option = {url:X.config.product.api.getsearchRecommend,data:data,type:"POST",callback:function(result){
            callback&&callback(result);
        }};
        X.loadData(option);
    };

    //获取产品列表产品详情
    productsModel.getProductDetail = function(data,callback){
        var option = {url:X.config.product.api.getProductDetail+"/"+data.productId,type:"GET",callback:function(result){
            callback&&callback(result);
        }};
        X.loadData(option);
    };

    //获取推荐产品列表产品详情
    productsModel.getReProductDetail = function(data,callback){
        var option = {url:X.config.product.api.getReProductDetail+"/"+data.productId,type:"GET",callback:function(result){
            callback&&callback(result);
        }};
        X.loadData(option);
    };
     //ip info
    productsModel.getIpInfo = function(callback){
        var option = {url:X.config.request.api.getIpInfo,type:"GET",callback:function(result){
            callback&&callback(result);
        }};
        X.loadData(option);
    };
    //frq来源
    productsModel.consts = {
        source:[
            {key: 0,  value: "/request/sourcing-request.html"},
            {key: 13, value: "/topic/promotion-products-import.html"},
            {key: 14, value: "/topic/garden-tools-and-equipments-import.html"},
            {key: 15, value: "/topic/construction-tools-and-machinaries-import.html"},
            {key: 16, value: "/topic/beauty-equipment-import.html"},
            {key: 17, value: "/topic/computer-hardware-import.html"},
            {key: 18, value: "/topic/automobile-accessory-import.html"},
            {key: 25, value: "/topic/import-promotion-products.html"},
            {key: 26, value: "/topic/import-garden-tools-and-equipments.html"},
            {key: 27, value: "/topic/import-construction-tools-and-machinaries.html"},
            {key: 28, value: "/topic/import-beauty-equipment.html"},
            {key: 29, value: "/topic/import-computer-hardware.html"},
            {key: 30, value: "/topic/import-automobile-accessory.html"}
        ],
    }

    return productsModel
});