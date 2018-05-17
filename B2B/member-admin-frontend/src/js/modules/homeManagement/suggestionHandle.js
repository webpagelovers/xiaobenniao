X.define("modules.homeManagement.suggestionHandle", ["model.homeManagementModel", "common.layer"], function (homeManagementModel, layer) {
    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.homeManagement.tpl.suggestionHandle
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });


    ctrl.load = function (para) {
        document.title = "意见反馈处理";


        homeManagementModel.getById(para["feedbackId"], function (data) {

            view.render(data, function () {

                $(".js-Handle").on("click", function () {
                    var handleValLen = $(".js-handleText").val().length;
                    if (handleValLen < 10 || handleValLen > 500) {
                        $(".js-error").html("10-500个字符");
                        return false;
                    } else {
                        $(".js-error").html("");
                        var data = {
                            feedbackId: para["feedbackId"],
                            processResult: $(".js-handleText").val()
                        };
                        homeManagementModel.setById(data, function (data) {
                            layer.sMsgSucc("提交成功", function (number) {
                                setTimeout(function () {
                                    layer.closeIt(number);
                                    X.router.run("m=homeManagement.suggestionList");
                                }, 200)
                            });
                        })
                    }
                });

            });

        });

    };


    return ctrl;
});
