X.define("modules.dashboard.index",['model.dashboardModel'], function (dashboardModel) {

	var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.dashboard.tpl.index
    });

    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.load = function() {
    	view.render(function() {
            var sendData = {};
            dashboardModel.getUserInfo(function(res){
                if (res.statusCode == 2000000){
                    var data = res.data[0];
                    sendData.email = data.email;

                    ctrl.view.find('.js-user-name').text(data.lastName);
                    // ��0��δ��֤��1������֤
                    var itemHtml = ctrl.view.find(".js-is-verify-email");
                    data.isVerifyEmail == "1"  ? itemHtml.hide() : itemHtml.show()
                }
            });

            dashboardModel.getNewQuotationCount(function(res){
                if (res.statusCode == 2000000){
                    ctrl.view.find()
                }
            })

            $(".js-verifyEmail").click(function(){
                ctrl.verifyEmail(sendData);
            });

            //ctrl.addEvent("click", ".js-verifyEmail", "verifyEmail");
    	})
    }

    // 邮箱验证
    ctrl.verifyEmail = function(sendData){
        dashboardModel.verifyRequest(sendData, function(res){
            if (res.statusCode == 2000000){
                window.open(X.config.PATH_FILE.path.root+"/emailVerify/emailVerify.html")
            }
            else{}
        });
    }
    return ctrl
});