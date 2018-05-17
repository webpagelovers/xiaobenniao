X.define("modules.homePage.home",["model.homeModel","model.userModel","model.companyModel","common.layer"],function (homeModel,userModel,companyModel,layer) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.homePage.tpl.home
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });


    ctrl.rendering = function(){

        var callback = function(result){
            var data = result.data[0];
            return view.render(data, function () {
                var getData;
                var callback = function(result){
                    if(result.statusCode ==2000000){
                        getData = result.data[0];
                        ctrl.vmdata = ctrl.getViewModel(ctrl.view.el.find(".js-home"),{meta: {"logoUrl": {size: 2,type:0,filePicker:".filePicker",uploadSuccess:function(){
                            var data = {
                                logoUrl: ctrl.vmdata.getControl("logoUrl").getValue()
                            };
                            var callback = function(result){
                                if(result.statusCode =="2000000"){
                                    layer.successMsg("上传成功",function(number){
                                        layer.closeIt(number);
                                    });
                                }
                            };
                            companyModel.putLogoUrl(data,callback);
                        }}},data:getData});
                        ctrl.vmdata.initControl();
                        ctrl.view.el.find(".userName").html(getData.userName);
                        ctrl.view.el.find(".mobile").html(getData.mobile);
                        ctrl.view.el.find(".lastLoginDate").html(getData.lastLoginDate);
                        ctrl.view.el.find(".tenderCount").click(function(evt){
                            menuCall(evt,"bid.publicBidding");
                        });
                        ctrl.view.el.find(".myBiddingCount").click(function(evt){
                            menuCall(evt,"bid.myBid");
                        });
                        ctrl.view.el.find(".answeredCount").click(function(evt){
                            menuCall(evt,"bid.myBid");
                        });
                        ctrl.view.el.find(".unansweredCount").click(function(evt){
                            menuCall(evt,"bid.myBid");
                        });
                        ctrl.view.el.find(".js-sysMsgCount").click(function(evt){
                            menuCall(evt,"message.systemMessage");
                        });

                       
                    }
                };
                userModel.getUserInfo(callback);

                view.el.find(".js-tel").html(X.config.contact.tel);
                view.el.find(".js-email").html(X.config.contact.email);
            });
        };

        homeModel.statistics(callback);
    };

    function menuCall(evt,mid){
        evt.stopPropagation();
        evt.preventDefault();
        X.publish(X.CONSTANTS.channel.menuCall,{m:mid});
    }

    ctrl.load = function (para) {
        ctrl.rendering();
    };

    $.addTemplateFormatter({
        platformMsgCountFormater:function(value, template){
            if(value > 99){
                return "99+"
            }else{
                return value;
            }
        }
    });

    return ctrl;
});
