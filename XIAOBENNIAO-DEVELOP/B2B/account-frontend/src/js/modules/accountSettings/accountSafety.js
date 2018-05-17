X.define("modules.accountSettings.accountSafety",["model.userModel"],function (userModel) {
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.accountSettings.tpl.accountSafety
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {
        var callback = function (result) {
            var baseInfo = result.data[0];
            return view.render(baseInfo,function () {
                if (baseInfo.email == "") {
                    ctrl.view.find(".js-email").show();
                } else {
                    ctrl.view.find(".js-email-base").show();
                }
                $('.js-mobile').html('(' + baseInfo.mobile.slice(0, 3) + '****' + baseInfo.mobile.slice(7, 11) + ')');
            });
        };
        userModel.getUserInfo(callback);
    };

    ctrl.bindEmailButton = function () {
        var layerTemp = $('.js-bindEmailLayer');
        var content = layerTemp.html();
        var layerIndex = layer.open({
                id: 'bindEmailLayer',
                title: '邮箱验证',
                content: content,
                btn: [],
                closeBtn: 1,
                fixed: true,
                resize: false,
                move: false,
                success: function () {
                    $('#bindEmailLayer').find('.js-bindEmailForm').validate({
                        rules: {
                            email: {
                                required:true,
                                email: true,
                                emailTrue: true, //不允许输入点开头的邮箱
                                rangelength: [5, 50],
                                isEmail:true
                            }
                        },
                        messages: {
                            email: {
                                required:"请输入邮箱",
                                email: "邮箱格式不正确，请输入正确的邮箱",
                                emailTrue: "邮箱格式不正确，请输入正确的邮箱", //不允许输入点开头的邮箱
                                rangelength: "请输入5位以上50位以下邮箱",
                                isEmail:"该邮箱已注册"
                            }
                        },
                        onkeyup: false,
                        onfocusout: function (element) {
                            var callback = function (result) {
                            }
                            userModel.getUserInfo(callback);
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
                    $('#bindEmailLayer').find(".js-bindEmail").click(function () {
                        var callback = function (result) {
                        }
                        userModel.getUserInfo(callback);
                        if ($('#bindEmailLayer').find('.js-bindEmailForm').valid()) {
                            var that = this;
                            this.setAttribute('disabled', true);
                            var temp = {};
                            var data = $('#bindEmailLayer').find('.emailAddress').val();
                            temp.emailAddress = data;

                            var callback = function(){
                                layer.close(layerIndex);
                                that.setAttribute('disabled', false);
                                layer.open({
                                    id: 'bindEmailLayer',
                                    title: '提示',
                                    content: '<span style="width: 200px;text-align: center;display: inline-block">发送成功</span>',
                                    closeBtn: 1,
                                    fixed: true,
                                    resize: false,
                                    move: false,
                                });
                            };

                            userModel.bindEmail(temp, callback);
                        }
                    });
                }
            }
        );
    };

    ctrl.resetPasswordButton = function () {
        var layerTemp = $('.js-resetPasswordLayer');
        var content = layerTemp.html();
        var layerIndex = layer.open({
                id: 'resetPasswordLayer',
                title: '修改密码',
                content: content,
                btn: [],
                closeBtn: 1,
                fixed: true,
                resize: false,
                move: false,
                area: ['420px', '370px'],
                success: function () {
                    $('#resetPasswordLayer').find('.js-resetPasswordForm').validate({
                        rules: {
                            oldPassword: {
                                required: true,
                                rangelength: [6, 16],
                                strongPsw:true,
                                isOldpassword:true
                            },
                            password: {
                                required: true,
                                rangelength: [6, 16],
                                strongPsw:true
                            },
                            cosPassword: {
                                required: true,
                                rangelength: [6, 16],
                                equalTo: "#resetPasswordLayer #password"
                            }
                        },
                        messages: {
                            oldPassword: {
                                required: "请输入6位以上的密码",
                                rangelength: "请输入6位以上16位以下密码",
                                strongPsw:"请输入6-16个字符且至少两种字符组合",
                                isOldpassword:"您输入的原密码不正确，请重新输入"
                            },
                            password: {
                                required: "请输入6位以上的密码",
                                rangelength: "请输入6位以上16位以下密码",
                                strongPsw:"请输入6-16个字符且至少两种字符组合"
                            },
                            cosPassword: {
                                required: "请重新输入密码",
                                rangelength: "请输入6位以上16位以下密码",
                                equalTo: "两次输入不一致"
                            }
                        },
                        onkeyup: false,
                        onfocusout: function (element) {
                            var callback = function (result) {
                            }
                            userModel.getUserInfo(callback);
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

                    $('#resetPasswordLayer').find(".js-passSubmit").click(function () {
                        var callback = function (result) {
                        }
                        userModel.getUserInfo(callback);
                        if ($('#resetPasswordLayer').find('.js-resetPasswordForm').valid()) {
                            var that = this;
                            this.setAttribute('disabled', true);
                            var temp = {};
                            var data = $('#resetPasswordLayer').find('.password').val();
                            temp.password = data;

                            var callback = function(){
                                layer.close(layerIndex);
                                that.setAttribute('disabled', false);
                                layer.open({
                                    id: 'bindEmailLayer',
                                    title: '提示',
                                    content: '<span style="width: 200px;text-align: center;display: inline-block">修改成功</span>',
                                    closeBtn: 0,
                                    fixed: true,
                                    resize: false,
                                    move: false,
                                });
                            };

                            userModel.password(temp, callback);
                        }
                    });
                }
            }
        );
    };

    ctrl.addEvent('click','.js-bindEmailButton','bindEmailButton');
    ctrl.addEvent('click','.js-resetPasswordButton','resetPasswordButton');

    ctrl.load = function () {
        ctrl.rendering();
    };

    return ctrl;

});
