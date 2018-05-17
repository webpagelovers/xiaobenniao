X.define("app", ["modules.menu.menu", "model.adminModel"], function (menu, adminModel) {
    $.ajaxSetup({
        contentType: "application/json;charset=utf-8",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true
    });

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-frame")
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.logout = function () {
        adminModel.logout(function (argument) {
            location.href = X.config.PATH_FILE.path.root + '?m=login.login';
        });
    };

    ctrl.addEvent("click", ".js-logout", "logout");
    var initChannels = function () {
        //订阅服务消息

        X.channels["e"] = "app.serviceError";
        X.channels["i"] = "app.serviceInfo";

        X.subscribe(X.channels["e"], function () {
            layer.alert("访问服务器错误");
        });

        X.subscribe(X.channels["i"], function () {
            layer.alert("访问服务器错误");
        });
    };

    try {

        initChannels();

        menu.load();


    }
    catch (e) {
        //失败后，退出登录
        console.error(e)
    }




    return {};
});
