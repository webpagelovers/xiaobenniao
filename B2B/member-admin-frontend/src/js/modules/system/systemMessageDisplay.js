X.define("modules.system.systemMessageDisplay",["model.systemMessageModel","adapter.ueditor"],function (systemMessageModel) {
    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.system.tpl.systemMessageDisplay
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });
    //获取信息
    ctrl.getData = function (callback) {
        systemMessageModel.find({data:{"messageId":_para["messageId"]},callback:callback});
    };

    ctrl.rendering = function () {
        var callback = function (model) {
            var data = model.attributes;
            data.receiveUserCompanyType = (data.receiveUserCompanyType == systemMessageModel.const.receiver[0].key) ? systemMessageModel.const.receiver[0].value : (data.receiveUserCompanyType == systemMessageModel.const.receiver[1].key ? systemMessageModel.const.receiver[1].value : systemMessageModel.const.receiver[2].value);;
            return view.render(data,function () {
            });
        };
        ctrl.getData(callback);
    };

    var _para;
    ctrl.load = function(para){
        para = para || {};
        _para = para ;
        ctrl.rendering();
    };

    return ctrl;
});