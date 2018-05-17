X.define("modules.common.menu",["model.menuModel"],function (menuModel) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".js-menu"),
        url: X.config.common.tpl.menu
    });

    //初始化控制器
    var menu = X.controller.newOne({
        view: view
    });    

    menu.rendering = function (para) {
        menuModel.getMenu(function (menus) {
            var node = menus.getTreeNodeByCode("userManage");            
            if(node){
                view.render(function () {
                    menu.Accordion = X.controls.getControl("Accondion",$(".js-accondion"),
                        {onItemClick:function (item,data) {
                            fireClick(data);
                        }}); 
                    menu.Accordion.init({"children":node.children});
                    //加载完成，默认调用哪一个功能？
                    if(X.isFunction(para)){
                        para(menu.setSeleted);
                    }
                });    
            }
        });       
    };

    menu.setSeleted = function(id){
        menuModel.getMenu(function (menus) {
            var node = menus.getTreeNodeById(id);
            var item = menu.Accordion.getItem(node);
            if(item){
                if(node.parent){
                    menu.Accordion.expandRecursive(node.parent);
                }
                menu.Accordion.setSelectedItem(node);                
            }
        });

    };

    var fireClick = function (data,para) {        
        if(data && data.href){
            var url = data.href;
            if(para){
                url += "&" + X.toUrlPara(para);
            }
            window.location.href = X.config.PATH_FILE.path.root + url;            
        }            
    };

    menu.load = function (para) {
        menu.rendering(para);
    }
    

    //menu.load();

    return menu;
});