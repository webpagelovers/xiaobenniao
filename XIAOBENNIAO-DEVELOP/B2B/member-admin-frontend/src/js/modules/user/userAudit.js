X.define("modules.user.userAudit", ["model.userModel","common.layer"], function (userModel,layer1) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.user.tpl.userAudit
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });
    //获取用户信息
    ctrl.getData = function (callback) {
        userModel.find({data: {"userId": _para["userId"]}, callback: callback});
    };

    ctrl.rendering = function () {
        $.addTemplateFormatter({
            //注册时间
            createDateFormater: function (value, template) {
                var arr = value.split(':');
                arr.pop();
                str = arr.join(':');
                return str;
            }
        });
        var callback = function (model) {
            var data = model.attributes;
            model.attributes.gender = (data.gender == userModel.const.gender.MALE.key ) ? userModel.const.gender.MALE.text : userModel.const.gender.FEMALE.text;
            return view.render(data, function () {
                ctrl.addUserVM = ctrl.getViewModel(view.find(".js-changeResult"));
                ctrl.addUserVM.initControl();

                $(".js-button").click(function () {
                    layer1.successMsg("保存成功", function () {
                        X.router.run("m=user.userList");
                    });
                });


            });


        };
        ctrl.getData(callback);


    };

    var _para;
    ctrl.load = function (para) {
        para = para || {};
        _para = para;
        ctrl.rendering();
    };

    return ctrl;

});