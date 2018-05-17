X.define('modules.service.aboutPayment', [ "modules.common.global", "modules.common.suspensionBox"], function (global) {

    var view = X.view.newOne({
        el: $('.js-about-payment'),
        url: X.config.service.tpl.aboutPayment,
        res: X.config.service.res.aboutPayment
    });

    var ctrl = X.controller.newOne({
        view: view
    });

    X.subscribe(X.CONSTANT.channel["navReady"],function (argument) {
        var model = X.require.getModule("modules.common.nav");
        if(model){
            model.setActive("howItWorks");
        }
    });

    ctrl.view.render(function () {

    });
    
    return ctrl
});


