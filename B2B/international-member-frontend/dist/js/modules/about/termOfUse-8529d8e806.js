X.define("modules.termOfUse", ["modules.common.global"], function (global) {
    //初始化视图对象
    var view = X.view.newOne({
        el: $(".js-myTermOfUse"),
        url: X.config.about.tpl.termOfUse,
        res : X.config.about.res.termOfUse
    });

    //初始化控制器
    var termOfUse = X.controller.newOne({
        view: view
    });

    termOfUse.rendering = function () {
        return view.render(function () {
            $(document).attr("title","Term Of Use | Best Chinese Procurement and Purchasing Agent : Weintrade.com");
        });
    };

    termOfUse.load = function (argument) {
        termOfUse.rendering();
    };

    termOfUse.load();

    return termOfUse;
});

