X.define("modules.user.userDisplay", ["model.userModel"], function (userModel) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.user.tpl.userDisplay
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
            return view.render(data, function () {
                $(".js-record").loadTemplate($(".js-record-tpl"), data.userOperationHistoryList);
                if (data.userOperationHistoryList === '') {
                    $(".js-history").hide();
                    $(".js-location").html('审核');
                    $(".js-companyNameCn-detail").hide();
                    $(".js-companyNameCn-edit").show();
                    $(".js-userName-detail").hide();
                    $(".js-userName-edit").show();
                    $(".js-button-modify").hide();
                    $(".js-button-confirm").show();

                    $(".js-editUser").validate({
                        rules: {
                            companyNameCn: {
                                required: true,
                                rangelength: [6, 50],
                                isChineseNumber: true
                            },
                            userName: {
                                required: true,
                                rangelength: [2, 4],
                                isChinese: true
                            },
                            status: {
                                required: true
                            }
                        },
                        messages: {
                            companyNameCn: {
                                required: "请输入公司名称",
                                rangelength: "请输入6-50个字符的公司名称",
                                isChineseNumber: "公司名称只能为中文和数字"
                            },
                            userName: {
                                required: "请输入姓名",
                                rangelength: "请输入2-4位中文",
                                isChinese: "姓名只能为中文"
                            },
                            status: {
                                required: "请选择审核状态"
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

                    $(".js-button-confirm").click(function () {
                        var temp = {};
                        temp.status = $('input:radio:checked').val();
                        temp.userId = data.userId;
                        temp.companyNameCn = $(".js-companyNameCn-edit input").val();
                        temp.userName = $(".js-userName-edit input").val();

                        if ($(".js-editUser").valid()) {
                            userModel.userAudit(temp, function (result) {
                                ctrl.load({userId: data.userId});
                                if (data.statusCode != X.constructor.prototype.constant.statusCode.SUCCESS && result.statusCode != 2000000) {
                                    layer.alert(result.message, {
                                        title: "提示",
                                        success: function () {
                                        }
                                    })
                                }
                            });
                        }
                    });
                } else {
                    $(".js-history").show();
                    $(".js-location").html('用户详情');
                    $(".js-companyNameCn-detail").show();
                    $(".js-companyNameCn-edit").hide();
                    $(".js-userName-detail").show();
                    $(".js-userName-edit").hide();
                    $(".js-button-modify").show();
                    $(".js-button-confirm").hide();
                    $(".js-button-modify").click(function () {
                        var layer1 = layer.open({
                            type: 1,
                            content: view.find(".js-changeResult"),
                            title: "结果变更",
                            area: ["300px", "200px"],
                            btn: ["保存"],
                            success: function (layero, index) {
                                changeStatus("js-changeResult", "#pass1", "#noPass1");
                            },
                            yes: function () {
                                var data2 = ctrl.addUserVM.collectData();
                                var temp = {};
                                temp.status = data2.status2;
                                temp.userId = data.userId;


                                if (data.status !== data2.status2) {
                                    userModel.userAudit(temp, function (data) {
                                        if (data.statusCode == X.constructor.prototype.constant.statusCode.SUCCESS) {
                                            layer.close(layer1);
                                            ctrl.load({userId: data.data[0].userId});
                                        } else {
                                            layer.close(layer1);
                                            ctrl.load({userId: temp.userId});
                                            layer.alert(data.message, {
                                                title: "提示",
                                                success: function () {
                                                    layer.close(layer1);
                                                }
                                            })
                                        }
                                    });
                                } else {
                                    layer.close(layer1);
                                }
                            }
                        });
                    });
                }

                ctrl.addUserVM = ctrl.getViewModel(view.find(".js-changeResult"));
                ctrl.addUserVM.initControl();
                changeStatus(".js-status", "#pass", "#noPass");

                //改变是否通过审核的状态
                function changeStatus(parent, input1, input2) {
                    if (data.status == '1') {
                        $(parent).find(".radioBox").eq(1).hide();
                        $(input1).attr("checked", true);
                    } else if (data.status == '2') {
                        $(parent).find(".radioBox").eq(0).hide();
                        $(input2).attr("checked", true);
                    }
                }
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