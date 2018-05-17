X.define("modules.user.userEdit", ["model.userModel", "adapter.webuploader"], function (userModel) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.user.tpl.userEdit
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view,
        model: userModel
    });

    ctrl.initControl = function (id) {
    };

    ctrl.collectDate = function () {
        alert(JSON.stringify(ctrl.vm.collectData()));
    };

    ctrl.rendering = function () {
        return view.render({}, function () {
            // 用户注册验证
            $(".js-addUser").validate({
                rules: {
                    companyNameCn: {
                        required: true,
                        rangelength: [6, 50],
                        isChineseNumber: true,
                        checkFiled: true
                    },
                    userName: {
                        required: true,
                        rangelength: [2, 4],
                        isChinese: true,
                    },
                    mobile: {
                        required: true,
                        minlength: 11,
                        maxlength: 11,
                        isDigits: true,
                        isMobile: true,
                        isIphone: true
                    },
                    password: {
                        required: true,
                        rangelength: [6, 16],
                        equalFalse: {
                            target: {
                                tel: $("[name=mobile]"),
                                email: $("[name=email]")
                            },
                            elem: $("#password")
                        },
                        strongPsw: true
                    },
                    email: {
                        email: true,
                        emailTrue: true, //不允许输入点开头的邮箱
                        rangelength: [5, 20],
                        isEmail: true
                    }
                },
                messages: {
                    companyNameCn: {
                        required: "请输入公司名称",
                        rangelength: "请输入6-50个字符的公司名称",
                        isChineseNumber: "公司名称只能为中文和数字",
                        checkFiled: "公司名称已被注册"
                    },
                    userName: {
                        required: "请输入姓名",
                        rangelength: "请输入2-4位中文",
                        isChinese: "姓名只能为中文"
                    },
                    mobile: {
                        required: "请输入11位手机号码",
                        minlength: "请输入11位手机号码",
                        maxlength: "请输入11位手机号码",
                        isDigits: "请输入正确的手机号码",
                        isMobile: "请输入13/14/15/17/18开头的手机号",
                        isIphone: "您的手机号已被注册"
                    },
                    password: {
                        required: "请输入密码",
                        rangelength: "请输入6-16个字符",
                        equalFalse: "密码不能与手机号或邮箱一致",
                        strongPsw: "请输入6-16个字符且至少两种字符组合"
                    },
                    email: {
                        email: "邮箱格式不正确，请输入正确的邮箱",
                        emailTrue: "邮箱格式不正确，请输入正确的邮箱", //不允许输入点开头的邮箱
                        rangelength: "请输入5位以上20位以下邮箱",
                        isEmail: "该邮箱已注册"
                    }
                },
                onkeyup: false,
                onfocusout: function (element) {
                    var elem = $(element);
                    elem.valid();
                },
                success: function (value, element) {

                },
                errorPlacement: function (error, element) {
                    error.appendTo(element.parent().find(".js-error"));
                },
                submitHandler: function (form) {
                    //that.trigger("submit");
                }

            });

            ctrl.vmadduser = ctrl.getViewModel(ctrl.view.el.find(".js-addUser"), {
                meta: {
                    "portraitUrl": {
                        size: 2,
                        type: 0,
                        filePicker: ".filePicker"
                    }
                }
            });
            ctrl.vmadduser.initControl();
        });
    };
    ctrl.next = function () {
        var callback = function () {
            console.log("提交成功");
            X.router.run("m=user.userList");
        };
        ctrl.Submit(callback);
    };

    //提交用户信息
    ctrl.Submit = function (callback) {
        if ($(".js-addUser").valid()) {
            var data = ctrl.vmadduser.collectData();
            userModel.register(data, callback);
        }
    };

    ctrl.addEvent("click", ".js-button", "next");

    ctrl.load = function (para) {
        ctrl.rendering();
    };

    return ctrl;
});