X.define('modules.request.submitSuccessfully', ["modules.common.global", "modules.common.config", "modules.user.login", "modules.user.regist"], function (global, config, login, regist) {

    var view = X.view.newOne({
        el: $('.js-submitSuccessfully'),
        url: X.config.request.tpl.submitSuccessfully,
        res: X.config.request.res.submitSuccessfully
    });

    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.view.render(function () {
        $(document).attr("title", $.i18n.prop('submitSuccessfully_titleHead'));

        var num = 5;
        setInterval(function(){
            num --;
            if(num <= 0){
                window.open(X.config.PATH_FILE.path.root +"/index.html", "_self");
            }
        },1000)
    });

    return ctrl
});

