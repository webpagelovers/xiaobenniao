X.define("modules.index", ["modules.common.global", "model.productsModel", "modules.common.suspensionBox"], function (global, productsModel) {


    //初始化视图对象
    var view = X.view.newOne({
        el: $(".js-content"),
        url: X.config.index.tpl.index,
        res: X.config.index.res.index
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    X.subscribe(X.CONSTANT.channel["navReady"], function (argument) {
        var model = X.require.getModule("modules.common.nav");
        if (model) {
            model.setActive("home");
        }
    });
    $.addTemplateFormatter({
        hrefFormater: function (value, template) {
            return "product/" + value + ".html";
        },
        imgFormater: function (value, template) {
            if (value) {
                return X.config.PATH_FILE.path.rootImgDisplayUrl + value;
            }

        }
    });

    //渲染主页中内容部分
    //框架中包括了对资源文件的加载和替换模板中的字符串标记
    //每个页面都做类似的拆分，将内容主体部分拆分成模板，方便资源文件的处理


    ctrl.rendering = function (callback) {
        var data = {};
        return view.render(data, function () {
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

            callback();
            ctrl.view.find(".js-read-more").attr("href", X.config.PATH_FILE.path.root+"blogs/311.html")
            ctrl.view.find(".js-beautyEquipment").attr("href", X.config.common.link.beautyEquipment)
            ctrl.view.find(".js-promotionProducts").attr("href", X.config.common.link.promotionProducts)
            ctrl.view.find(".js-automobileAccessory").attr("href", X.config.common.link.automobileAccessory)
            ctrl.view.find(".js-computerHardware").attr("href", X.config.common.link.computerHardware)
            ctrl.view.find(".js-constructionTools").attr("href", X.config.common.link.constructionTools)
            ctrl.view.find(".js-gardenTools").attr("href", X.config.common.link.gardenTools)

            //ctrl.view.find(".js-index-postBuy").attr("href", X.config.common.link.freeSource)
            // ctrl.testSpeed()//测试首页加载速度
        });

    };
    ctrl.loginRegist = function () {
        registView.bindShowView($('.js-joinFree', view.el));

    };
    ctrl.load = function () {
        ctrl.rendering(function () {
            $(document).attr("title", "Faster and Easier Products Sourcing Agent in China : Weintrade.com");
            ctrl.ipinfo();
        });
    };
    ctrl.load();

    global.load([{
        src: "../images/indexFirstPage.jpg",
        selector: ".js-firstPage",
        isBg: true
    }]);        
    X.require(["modules.common.loadingTime"]);
     ctrl.ipinfo = function () {
         var countryCode = localStorage.getItem('countryCode');
        if (!countryCode) {
            setTimeout(function () {
               productsModel.getIpInfo(function(resp){
                var countryCode = (resp && resp.data.country) ? resp.data.country : "";
                countryCode = countryCode.toLowerCase();
                if (countryCode == 'undefined' || countryCode == '') {
                    localStorage.setItem('countryCode', 'cn');
                } else {
                    localStorage.setItem('countryCode', countryCode);
                }
            })
            }, 200);
        }
 
       
      
    };

    $(document).ready(function(){
       
    });

    return ctrl;

    

});