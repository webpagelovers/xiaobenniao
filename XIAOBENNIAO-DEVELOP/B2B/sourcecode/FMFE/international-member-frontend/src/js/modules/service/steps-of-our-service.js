X.define('modules.request.stepService', [ "modules.common.global", "modules.common.suspensionBox"], function (global) {

    var view = X.view.newOne({
        el: $('.js-stepService-content'),
        url: X.config.service.tpl.stepService,
        res: X.config.service.res.stepService
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
    
        global.load([{
            src: "../images/stepService.jpg",
            selector: ".js-stepService-img",
            isBg: true
        }]);
    });
    
    return ctrl
});


