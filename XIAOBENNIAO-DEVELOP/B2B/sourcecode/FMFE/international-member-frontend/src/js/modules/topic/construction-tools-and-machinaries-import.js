X.define('modules.topic.constructionTools', ["modules.common.global","modules.common.commonRequest","modules.topic.common"], function (global,commonRequest,common) {

    var view = X.view.newOne({
        el: $('.js-content'),
        url: X.config.topic.tpl.constructionTools,
        res: X.config.topic.res.constructionTools
    });

    var ctrl = X.controller.newOne({
        view: view
    });
    ctrl.rendering = function () {
        return view.render(function () {
            //控制轮播图效果
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


