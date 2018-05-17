X.define("modules.datacrawling.dataCrawling",["model.datacrawlingModel"],function () {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.datacrawling.tpl.dataCrawling
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {
        view.render({},function(){

        });
    }


    ctrl.load = function (para) {
        ctrl.rendering();
    };

    return ctrl;

});
