X.define('modules.request.guarantee', [ "modules.common.global", "modules.common.suspensionBox"], function (global) {

    var view = X.view.newOne({
        el: $('.js-content'),
        url: X.config.service.tpl.guarantee,
        res: X.config.service.res.guarantee
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
        view.el.find('#anchorStrict').click(function(){
            $('html, body').animate({
                scrollTop: 520
            }, 500);
            return false;
        });

        view.el.find('#anchorDegree').click(function(){
            $('html, body').animate({
                scrollTop: 1615
            }, 500);
            return false;
        });

        view.el.find('#anchorTailored').click(function(){
            $('html, body').animate({
                scrollTop: 2020
            }, 500);
            return false;
        });

        global.load([{
            src: "../images/serviceGuarantee.jpg",
            selector: ".js-serviceGuarantee-img",
            isBg: true
        }]);
    });
    
    return ctrl
});


