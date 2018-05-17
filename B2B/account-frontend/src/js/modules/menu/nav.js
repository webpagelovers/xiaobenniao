X.define("modules.menu.nav", ["model.menuModel", "model.userModel", "model.messageModel"], function (menuModel, userModel, messageModel) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-nav"),
        url: X.config.menu.tpl.nav
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    var data = [];
    var data2 =　{};    
    ctrl.load = function (para) {
        var loadData = function(){
            view.render(function(){                    
                    if(X.isFunction(para))  {
                        para();
                    }//js-purchaser
                ctrl.view.find(".js-index").attr("href", X.config.receptionUrl.indexUrl);
                ctrl.view.find(".js-user-center").click(function(){
                    X.router.run(X.config.route['default']);
                    ctrl.view.find(".js-user-center").addClass('colff6im');
                    ctrl.view.find(".js-purchaseInfoManage").removeClass('colff6im');
                    ctrl.view.find(".js-messageCenter").removeClass('colff6im');
                });
                ctrl.view.find(".js-purchaseInfoManage").click(function(){
                    X.publish(X.CONSTANTS.channel.menuCall, {m: 'infoManage.infoManageList'});
                    ctrl.view.find(".js-user-center").removeClass('colff6im');
                    ctrl.view.find(".js-purchaseInfoManage").addClass('colff6im');
                    ctrl.view.find(".js-messageCenter").removeClass('colff6im');
                });
                ctrl.view.find(".js-messageCenter").click(function(){
                    X.publish(X.CONSTANTS.channel.menuCall, {m: 'message.clientMessage'});
                    ctrl.view.find(".js-user-center").removeClass('colff6im');
                    ctrl.view.find(".js-purchaseInfoManage").removeClass('colff6im');
                    ctrl.view.find(".js-messageCenter").addClass('colff6im');
                });

                ctrl.view.find(".js-purchaser").click(function(){
                    layer.open({
                            title: '',
                            content: "<p class='tac'>您好，暂时无操作权限!</p>",
                            btn: [],
                            fixed: true,
                            resize: false,
                            move: false,
                            time: 3000
                        }
                    );
                });
            });
        };
        
        loadData();
        var callback =function(result){
            ctrl.view.el.find(".userName").html(result.data[0].userName);
            ctrl.view.el.find(".userMobile").html(result.data[0].mobile);
            ctrl.view.el.find(".userMobile").text(ctrl.view.el.find(".userMobile").text().substring(0, 3) + "****" + ctrl.view.el.find(".userMobile").text().substring(7, 11));
        };

        userModel.getUserInfo(callback);


        ctrl.loginout = function(){
            var callback =function(result){
                if(result.statusCode ==2000000){
                    location.href= X.config.receptionUrl.loginUrl;
                }
            };
            userModel.logout(callback);
        };

        ctrl.addEvent("click",".js-logout","loginout");
              
      /*  ctrl.view.el.on("click","a[href]",function(event){
            event.stopPropagation();
            event.preventDefault();
            if($(this).attr("href")=="homeMap"){
                //映射到主页
                ctrl.view.el.find("a[href='home']").trigger("click");
            }
            else{
                changeSelected($(this));
                var newHref = $(this).attr("href");
                if(newHref!=ctrl.currentNav){
                    switchMenu(newHref);
                }
            }            
        });*/
    };    


    return ctrl;
});