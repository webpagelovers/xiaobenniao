X.define("modules.emailVerify.emailVerify",['model.dashboardModel'], function (dashboardModel) {

    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.emailVerify.tpl.emailVerify
    });

    var ctrl = X.controller.newOne({
        view: view
    });


    view.render(function() {
        var sendData = {};
        dashboardModel.getUserInfo(function(res){
            if (res.statusCode == 2000000){
                var data = res.data[0];
                sendData.email = data.email;
                ctrl.view.find('.js-userEmail').text(data.email);

                var itemHtml = ctrl.view.find(".js-is-verify-email");
                data.isVerifyEmail == "1"  ? itemHtml.hide() : itemHtml.show()
            }
        });
        $(".js-reSend").click(function(){
            ctrl.verifyEmail(sendData);
        });
    })

    // 邮箱验证
    ctrl.verifyEmail = function(sendData){
        dashboardModel.verifyRequest(sendData, function(res){
            if (res.statusCode == 2000000){}
            else{}
        });
    }

    return ctrl
});