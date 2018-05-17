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


    return productsModel
});