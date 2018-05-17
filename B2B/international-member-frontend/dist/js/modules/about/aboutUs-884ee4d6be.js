X.define("modules.aboutUs", ["modules.common.global", "modules.common.suspensionBox"], function (global) {
    //初始化视图对象
    var view = X.view.newOne({
        el: $(".js-myAboutUs"),
        url: X.config.about.tpl.aboutUs,
        res : X.config.about.res.aboutUs
    });

    //初始化控制器
    var aboutUs = X.controller.newOne({
        view: view
    });

    X.subscribe(X.CONSTANT.channel["navReady"],function (argument) {
        var model = X.require.getModule("modules.common.nav");
        if(model){
            model.setActive("aboutUs");
        }
    });

    aboutUs.rendering = function () {
        return view.render(function () {
            $(document).attr("title","About Us | Best Products Sourcing and Procurement Agent in China : Weintrade.com");

            var newContent = [
                'XBN takes part in the Sino-Greek friendly cooperation conference',
                'XBN and B2B-Center joined forces to promote e-commerce',
                'XBN to attend the fifth session of the US-Europe consumer safety tripartite summit',
                'XBN flies to the world from the Beijing e-Commerce Center',
                'XBN talks with Greek government delegation about possible cooperation',
                'Beijing E-Commerce Association established a Special Committee for Cross-border E-Commerce, XBN Platform\'s chairman appointed as director',
                'XBN celebrates its third anniversary',
                'Enthusiastic celebration of XBN\'s opening of operation center in Bahrain'
            ]
            var oldContent = '';
            $(".aboutus-photo").hover(function(){
                var contentBox = $(this).find(".aboutus-photo-cover>p");
                $(this).find(".aboutus-photo-cover").addClass("t0");
                oldContent = contentBox.html();
                contentBox.html(newContent[$(this).index() - 1])
                setTimeout(function(){
                    var contentHeight = contentBox.get(0).offsetHeight;
                    var top = (186 - contentHeight) / 2 + 'px';
                    contentBox.addClass("poa").css("top",top)
                },10)
            },function(){
                var contentBox = $(this).find(".aboutus-photo-cover>p");
                $(this).find(".aboutus-photo-cover").removeClass("t0")
                contentBox.removeClass("mt60")
                contentBox.html(oldContent)
                contentBox.removeClass("poa").css("top",0)
            });
        });
    };

    aboutUs.load = function ( ) {
        aboutUs.rendering();
    };

    aboutUs.load();

    return aboutUs;
});
