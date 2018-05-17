X.define("modules.common.header",[],function () {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".js-header"),
        url: X.config.common.tpl.header,
        res : X.config.common.res.header
    });

    //初始化控制器
    var header = X.controller.newOne({
        view: view
    });   

    header.rendering = function () {
        return view.render(function () {
           view.el.find(".js-joinFree").click(function(){
                alert("hello");
           });
           view.el.find(".js-lang").click(function(event){
               var req = X.getRequest();
               req.lang = $(this).data("lang");
               $.cookie("lang",lang);
               window.location.reload();
               //window.location.search = X.toUrlPara(req);               
               event.preventDefault();
               event.stopPropagation();
           });

        });
    };
    
    header.load = function () {


        header.rendering();
    };

    header.load();

    return header;
});