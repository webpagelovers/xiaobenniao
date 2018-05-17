X.define("modules.index", ["modules.common.global", "model.productsModel", "modules.user.regist"], function (global, productsModel, registView) {
    //初始化视图对象
    var view = X.view.newOne({
        el: $(".js-content"),
        url: X.config.index.tpl.notFound,
        res: X.config.index.res.index
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function (callback) {
        return view.render(function () {

        });

    };


    ctrl.load = function () {
        ctrl.rendering();
    };

    ctrl.load();

    return ctrl;
});