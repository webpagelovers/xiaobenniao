X.define("modules.privacyPolicy", ["modules.common.global"], function (global) {
    //初始化视图对象
    var view = X.view.newOne({
        el: $(".js-myPrivacyPolicy"),
        url: X.config.about.tpl.privacyPolicy,
        res : X.config.about.res.privacyPolicy
    });

    //初始化控制器
    var privacyPolicy = X.controller.newOne({
        view: view
    });

    privacyPolicy.rendering = function () {
        return view.render(function () {
            $(document).attr("title","Privacy Policy |  Strategic Sourcing And Procurement Agent in China : Weintrade.com");
        });
    };

    privacyPolicy.load = function (argument) {
        privacyPolicy.rendering();
    };

    privacyPolicy.load();

    return privacyPolicy;
});


