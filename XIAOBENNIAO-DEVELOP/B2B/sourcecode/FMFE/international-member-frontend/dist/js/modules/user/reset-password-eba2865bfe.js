X.define('modules.user.resetPassword', ["modules.common.global", 'model.userModel', 'modules.user.common', 'common.layer', 'modules.common.cookies'], function (global, userModel, common, layer, cookies) {

    var view = X.view.newOne({
        el: $(".js-resetPassword"),
        url: X.config.user.tpl.resetPassword,
        res: X.config.user.res.resetPassword
    })

    var ctrl = X.controller.newOne({
        view: view
    });

    var para = X.getRequest();
    ctrl.view.render(function () {
        ctrl.generateValidate();
        reset_progress = para["reset_progress"];
        resetCode = para["resetCode"];
        if (resetCode) {

            userModel.resetCheck(resetCode,function(res){
                if(res.data[0] == 0){
                    ctrl.loadErrorTpl();
                }else{
                    ctrl.loadUpdatePasswordTpl();
                }
            })
        }

        if (reset_progress == 'continue') {
            ctrl.loadContinueToLoginTpl();
        }else if (reset_progress == 'success') {
            ctrl.loadSetSuccussTpl();
        }else {
            ctrl.loadResetPasswordTpl();
        }


    });

    //发送重置邮件
    ctrl.loadResetPasswordTpl = function () {
        $(".js-resetPassword-tpl").show();
        $(".js-resetPassword-wrap").loadTemplate($(".js-resetPassword-tpl"));
        $(".js-changeCode").attr("src", X.config.imageVerification.imageVerificationController + '/ImageVerificationCode/create/1504508035807')


        var oResetPassword = ctrl.view.el.find("form"),
            oSendEmailSubmit = view.el.find('.js-sendEmailSubmit');
        ctrl.showCode();
        oResetPassword.validate(ctrl.validate)
        oSendEmailSubmit.click(function () {
            if (oResetPassword.valid()) {
                ctrl.addResetPassVM = ctrl.getViewModel(view.find(".js-resetPassword-wrap"));
                ctrl.addResetPassVM.initControl();
                var data = ctrl.addResetPassVM.collectData();
                userModel.resetRequest(data, function (res) {
                    if (res.statusCode == X.CONSTANT.statusCode.SUCCESS) {
                        ctrl.loadUrl('continue');
                    } else {
                        layer.alert("Invalid email", function () {
                            location.href = location.href;
                        });
                    }
                });
            }
        })
    }
    //继续登陆
    ctrl.loadContinueToLoginTpl = function () {
        $(".js-resetPassword-wrap").loadTemplate($(".js-continueToLogin-tpl"));
        $(".js-continueToLogin-tpl").show();
        view.el.find(".js-sendEmailSubmit").click(function () {
            location.href = X.config.common.link.login;
        });
    };

    //设置密码
    ctrl.loadUpdatePasswordTpl = function () {

        $(".js-resetPassword-wrap").loadTemplate($(".js-updatePassword-tpl"));
        $(".js-updatePassword-tpl").show();

        var oUpdate = ctrl.view.el.find("form"),
            oUpdateSubmit = view.el.find('.js-updatePassSubmit');
        oUpdate.validate(ctrl.validate)
        oUpdateSubmit.click(function () {
            if (oUpdate.valid()) {
                ctrl.addUpdateVM = ctrl.getViewModel(view.find(".js-resetPassword-wrap"));
                ctrl.addUpdateVM.initControl();
                var data = ctrl.addUpdateVM.collectData();
                data.resetCode = para["resetCode"];
                userModel.resetPassword(data, function (res) {
                    if (res.statusCode == X.CONSTANT.statusCode.SUCCESS) {
                        ctrl.loadUrl('success');
                    }
                });
            }
        });
    }
    //设置密码成功
    ctrl.loadSetSuccussTpl = function () {
        $(".js-resetPassword-wrap").loadTemplate($(".js-setSuccuss-tpl"));
        $(".js-setSuccuss-tpl").show();
        view.el.find(".js-setSuccessButton").click(function () {
            location.href = X.config.common.link.login;
        });
    }

    ctrl.loadErrorTpl = function () {
        $(".js-resetPassword-wrap").loadTemplate($(".js-setError-tpl"));
        $(".js-setError-tpl").show();
    }


    ctrl.showCode = function (viewHtml) {
        view.el.find(".js-changeCode").on('click', function () {
            var data = new Date().getTime().toString();
            $('#code', viewHtml).attr("src", X.config.imageVerification.imageVerificationController + "/ImageVerificationCode/create/" + data);
        })
    }

    ctrl.loadUrl = function (str) {
        location.href = X.config.common.link.resetPassword + '?reset_progress=' + str;
    }

    ctrl.generateValidate = function () {
        this.validate = {
            rules: {
                email: {
                    required: true,
                    email: true
                },
                checkCode: {
                    required: true,
                    verCode: true
                },
                newPassword: {
                    required: true,
                    rangelength: [6, 14],
                    stringCheck: true,
                    isSpace: true
                },
                resetCode: {
                    required: true,
                    equalTo: "#password"
                }
            },
            messages: {
                email: {
                    required: "Please enter your Email",
                    email: "Please enter a valid E-mail address"
                },
                checkCode: {
                    required: 'Please enter verification code',
                    verCode: 'Please input correct verification code according to the characters in the picture'
                },
                newPassword: {
                    required: "Please enter your password",
                    rangelength: "Please enter your password between 6-14 characters",
                    stringCheck: "Support numbers, letters, and punctuation, space is not allowed",
                    isSpace: "Support numbers, letters, and punctuation, space is not allowed"
                },
                resetCode: {
                    required: "Re-type Password"
                }
            },
            onkeyup: false,
            onfocusout: function (element) {
                var elem = $(element);
                elem.valid();
            },
            errorPlacement: function (error, element) {
                element.after(error);
                error.css({position: "absolute", "left": "11px", "bottom": "-16px"})
            }
        };
    }

    return ctrl
})
