X.define("modules.siteMap", ["modules.common.global", "model.blogModel"], function (global, blogModel) {
    //初始化视图对象
    var view = X.view.newOne({
        el: $(".js-site-map"),
        url: X.config.about.tpl.siteMap,
        res: X.config.about.res.siteMap
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {
        return view.render(function () {
            var blogList = view.el.find(".js-blogList"),
                blogListTpl = view.el.find(".js-blogList-tpl");
            blogModel.getListTenPosts(function (data) {
                _data = data.data.list;
                blogList.loadTemplate(blogListTpl, _data, {
                    success: function () {
                        blogList.find("a").each(function (index) {
                            $(this).attr("href", X.config.common.link.blogs + _data[index].postId + '.html');
                        })
                    }
                });
            })
        });
    };

    ctrl.load = function () {
        ctrl.rendering();
    };

    ctrl.load();

    return ctrl;
});
