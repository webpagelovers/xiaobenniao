X.define("modules.accountSettings.accountInfo",["model.userModel"],function (userModel) {
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.accountSettings.tpl.accountInfo
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {
        var callback = function (result) {
            var baseInfo = result.data[0];
            return view.render(baseInfo,function () {
                if(baseInfo.email !== "") {
                    ctrl.view.find(".js-bindEmail").hide();
                }
                ctrl.view.find(".js-bindEmail").click(function (event) {
                    X.publish(X.CONSTANTS.channel.menuCall, {
                        m: "accountSettings.accountSafety"
                    });
                });
            });
        };
        userModel.getUserInfo(callback);

    };

    ctrl.load = function () {
        ctrl.rendering();
    };

    return ctrl;

});
