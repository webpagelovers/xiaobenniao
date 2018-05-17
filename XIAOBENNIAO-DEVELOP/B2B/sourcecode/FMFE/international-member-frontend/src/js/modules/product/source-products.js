X.define("modules.product.productList",["model.productsModel","modules.common.global","adapter.searchValidate", "modules.common.suspensionBox"],function (productsModel,global,searchValidate){


    //初始化视图对象
    var view = X.view.newOne({
        el: $(".js-content"),
        url: X.config.product.tpl.sourceProduct,
        res : X.config.product.res.sourceProduct
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
   

    ctrl.view.render(function(){

        $(document).attr("title",$.i18n.prop('productList_titleHead'));
        ctrl.view.find(".js-buttonBuy").attr("href",X.config.common.link.sourceRequest);

        global.load([{
            src: "../images/productList.jpg",
            selector: ".js-productListImg",
            isBg: true
        }]);

    });
    

    return ctrl;

});