X.define("modules.homeManagement.suggestionDetail", ["model.homeManagementModel", "data.currencyData", "data.addressData"], function (homeManagementModel, currencyData, addressData) {
    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.homeManagement.tpl.suggestionDetail
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.load = function (para) {
        document.title = "意见反馈详情";

        homeManagementModel.getById(para["feedbackId"], function (data) {

            view.render(data, function () {

            });

        });

    };

    return ctrl;
});
