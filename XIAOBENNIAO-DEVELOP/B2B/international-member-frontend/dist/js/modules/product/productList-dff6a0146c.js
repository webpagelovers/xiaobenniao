X.define("modules.product.productList",["model.productsModel","modules.common.global","adapter.searchValidate", "modules.common.suspensionBox"],function (productsModel,global,searchValidate){


    //初始化视图对象
    var view = X.view.newOne({
        el: $(".js-content"),
        url: X.config.product.tpl.productList,
        res : X.config.product.res.productList
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    X.subscribe(X.CONSTANT.channel["navReady"],function (argument) {
        var model = X.require.getModule("modules.common.nav");
        if(model){
            model.setActive("products");
        }
    });

    $.addTemplateFormatter({
        hrefFormater: function (value, template) {
            return X.constructor.prototype.config.PATH_FILE.path.root + "products/"+value+".html";
        },
        imgsFormater:function (value, template) {
            if(value){
                return X.constructor.prototype.config.PATH_FILE.path.rootImgDisplayUrl + value;
            }
        },
        prodNameFormater :function (value, template) {
            if(value){
                if(value.length>50){
                    return value.substring(0,50)+"...";
                }
                return value;
            }
        }
    });

    ctrl.view.render(function(){

        $(document).attr("title","Product source in China-Weintrade");
        global.load([{
            src: "/images/productList.jpg",
            selector: ".js-productListImg",
            isBg: true
        }]);
        productsModel.getProductList(function(result){
            if(result.statusCode == X.constructor.prototype.CONSTANT.statusCode.SUCCESS){
                var wrapList = ctrl.view.el.find(".js-wrapList");
                wrapList.loadTemplate($(".js-product-productList-tpl"),result.data);
            }
        });
    });

    ctrl.getBuyingRequest = function(){
        window.open(X.config.common.link.buyingRequest);
    };
    ctrl.getSearchList = function(){
        var key = ctrl.view.el.find(".js-serarchKeyword").val();
        searchValidate.keyValidate(key);

    };
    view.el.keyup(function (event) {
        if (event.keyCode == 13) {
            ctrl.getSearchList();
        }
    });

    ctrl.addEvent("click", ".js-serarch", "getSearchList");
    ctrl.addEvent("click", ".js-buttonRFQ", "getBuyingRequest");
    ctrl.addEvent("click", ".js-buttonBuy", "getBuyingRequest");


    return ctrl;

});