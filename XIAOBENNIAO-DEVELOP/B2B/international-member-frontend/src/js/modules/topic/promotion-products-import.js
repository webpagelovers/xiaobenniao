X.define('modules.promotion.category', ["modules.common.global","modules.common.commonRequest", "modules.topic.common"], function (global,commonRequest,common) {

    var view = X.view.newOne({
        el: $('.js-content'),
        url: X.config.topic.tpl.promotionGift,
        res: X.config.topic.res.promotionGift
    });

    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {
        return view.render(function () {
            $(view.el.find('.js-flexslider1')).flexslider({
                animation: "slide",
                slideshow: false,
                animationLoop: false,
                itemWidth: 300,
                itemMargin: 50,
                manualControls: true,
                maxItems: 3
            });

            $(view.el.find('.js-flexslider2')).flexslider({
                animation: "slide",
                slideshow: false,
                animationLoop: false,
                itemWidth: 340,
                itemMargin: 5,
                manualControls: true,
                minItems: 3
            });
            common.anchorPoint();
        });
    };

    ctrl.load = function () {
        ctrl.rendering();
    };
    ctrl.load();
    X.require(["modules.common.loadingTime"]);
    return ctrl
});


