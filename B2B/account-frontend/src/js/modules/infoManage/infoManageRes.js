X.define("modules.infoManage.infoManageRes", ["model.infoManageModel", "model.userModel", "adapter.webuploader", "common.layer", "data.currencyData", "adapter.ueditor"], function (infoManageModel, userModel, webuploader, layer, currencyData) {

        //初始化视图对象
        var view = X.view.newOne({
            el: $(".xbn-content"),
            url: X.config.infoManage.tpl.infoManageRes
        });

        //初始化控制器
        var ctrl = X.controller.newOne({
            view: view
        });

        ctrl.rendering = function (para) {
            var userData = null;
            var companyNameCn = "";
            userModel.getUserInfo(function (data) {
                userData = data.data[0];
                companyNameCn = data.data[0].companyNameCn;

            });

            $.addTemplateFormatter({
                //项目类型
                infoTypeFormater: function (value, template) {
                    return infoManageModel.CONSTANTS.infoType[value].value;
                },
                createDateFormater: function (value, template) {
                    return value.split(/\s+/)[0];
                },
                dueDateFormater: function (value, template) {
                    return value.split(/\s+/)[0];
                },
                statusFormater: function (value, template) {
                    return infoManageModel.CONSTANTS.status[value].value;
                }
            });
            //if (para["responseId"]) {
            infoManageModel.getById(para["responseId"], function (data) {

                data.companyNameCn = companyNameCn;

                return view.render(data, function () {

                    if (data.purchaserName == "" && data.contact == "") {
                        view.el.find(".js-purchaserName-tt").remove();
                        view.el.find(".js-purchaserName-bd").remove();
                    }


                    ctrl.addResVM = ctrl.getViewModel(view.find(".js-response"), {
                        meta: {
                            "purchaseResponseAttachmentList": {
                                size: 30,
                                type: 7,
                                showExplain: false,
                                explainMaxlength: 20,
                                filePicker: ".filePicker",
                                filePickerLabel: "添加附件"
                            },
                            "contact": {
                                maxLength: 50
                            },
                            "contactPhone": {
                                maxLength: 16
                            },
                            "contactEmail": {
                                maxLength: 30
                            },
                            "priceUnit": {
                                dataSource: currencyData.currencyKinds
                            }
                        }
                    });
                    ctrl.addResVM.initControl();

                    hideItems(data.shoppingTerms, ".js-shoppingTerms");
                    hideItems(data.paymentTerms, ".js-paymentTerms");
                    hideItems(data.currency, ".js-currency");
                    hideItems(data.budget, ".js-budget");

                    //隐藏非现实字段
                    function hideItems(data, elem) {
                        if (data == "") {
                            view.el.find(elem).remove();
                        }
                    }

                    if (!data.purchaseInfoAttachmentList[0]) {
                        view.el.find(".js-infoDetailAttachTitle").remove();
                    }

                    if (Number(data.priceResponse) == 1) {
                        $(".js-responsePrice").hide();
                        $(".js-priceUnit").hide();
                    } else {
                        $(".js-responsePrice").show();
                        $(".js-priceUnit").show();
                    }

                    //编辑器
                    UE.delEditor('container');
                    var ue = UE.getEditor('container', {
                        maximumWords: 2000,
                        autoHeightEnabled: true,
                        focus: true
                    });

                    ue.ready(function () {
                        $(".js-contact").val(userData.userName);
                        $(".js-contactPhone").val(userData.mobile);
                        $(".js-contactEmail").val(userData.email);


                        $(".js-res").click(function () {

                            if (!ifBad(data.status)) {
                                return false;
                            }
                            var html = ue.getContent();
                            var text = ue.getContentTxt();
                            $(".js-responseInfoInput").val(text);

                            if ($(".js-response").valid()) {
                                var _data = ctrl.addResVM.collectData();
                                if (Number(data.priceResponse) == 1) {
                                    _data.responsePrice == "";
                                    _data.priceUnit = "";
                                } else {
                                    _data.responsePrice = _data.responsePrice;
                                    _data.priceUnit = currencyData.getCurrency(Number(_data.priceUnit));
                                }
                                _data.purchaseInfoId = data.purchaseInfoId;
                                _data.responseInfo = html;

                                infoManageModel.addRes(_data, function (result) {
                                    var content =
                                        "<div class='tac mt30'>" +
                                        "<h1 class='f18 bold'>提交成功！</h1>" +
                                        "<h3 class='f16 mt30'>请等待采购商反馈！</h3>" +
                                        "<div class='layui-layer-btn mt50'>" +
                                        "<a class='layui-layer-btn0 js-infoMyRes'>进入我的响应</a>" +
                                        "<a class='layui-layer-btn1 js-infoIndex'>返回首页</a>" +
                                        "</div>" +
                                        "<p class='mt10 directionWords h30 lh30'>*本次响应完成后，本条采购信息将列入我的响应列表。</p>" +
                                        "</div>";
                                    layer.custom({
                                        content: content,
                                        area: ["500px", "380px"],
                                        closeBtn:0
                                    }, function () {
                                        $(".js-responseInfo").html("");
                                        $(".js-infoMyRes").click(function () {
                                            $(this).attr("href", menuCall('infoManage.myResponseList'));
                                        });
                                        $(".js-infoIndex").click(function () {
                                            $(this).attr("href", X.config.PATH_FILE.path.rootReceptionUrl);
                                        });
                                    });
                                });
                            }
                        });
                    });

                    $(".js-response").validate({
                        rules: {
                            contact: {
                                required: true,
                                maxlength: 50
                            },
                            contactPhone: {
                                required: true,
                                maxlength: 16,
                                isDigits: true
                            },
                            contactEmail: {
                                required: true,
                                email: true,
                                maxlength: 30
                            },
                            responsePrice: {
                                required: (function () {
                                    if (Number(data.priceResponse) == 1) {
                                        return false;
                                    } else {
                                        return true;
                                    }
                                })(),
                                isFloat: true,
                                maxlength: 30
                            },
                            responseInfo: {
                                required: true,
                                minlength: 10
                            },
                            priceUnit: {
                                required: (function () {
                                    if (Number(data.priceResponse) == 1) {
                                        return false;
                                    } else {
                                        return true;
                                    }
                                })()
                            }
                        },
                        messages: {
                            contact: {
                                required: "请输入联系人姓名",
                                maxlength: "联系人不能超过50个字符"
                            },
                            contactPhone: {
                                required: "请输入联系电话",
                                maxlength: "联系电话不能超过16个字符",
                                isDigits: "请输入正确的联系电话"
                            },
                            contactEmail: {
                                required: "请输入正确的邮箱",
                                email: "请输入正确的邮箱",
                                maxlength: "联系人不能超过30个字符"
                            },
                            responsePrice: {
                                required: "请输入响应金额",
                                isFloat: "响应金额只能是数字",
                                minlength: "资金不能超过30个字符"
                            },
                            responseInfo: {
                                required: "请输入响应信息",
                                minlength: "请至少输入10个字符"
                            },
                            priceUnit: {
                                required: "请输入币种"
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
                            if (element[0]["id"]) {
                                error.appendTo($(".js-error-responseInfo"));
                            } else {
                                error.appendTo(element.parent().find(".js-error"));
                            }
                        },
                        submitHandler: function (form) {

                        }
                    });

                    //是否废标
                    function ifBad(status) {
                        var pass;
                        if (status == 3) {
                            var layer1 = layer.successMsgClose('此信息已失效', function () {
                            });
                            pass = false;
                        } else {
                            pass = true;
                        }
                        return pass;
                    }

                    //路径
                    var menuCall = function (links) {
                        links = X.config.PATH_FILE.path.rootPath + X.browserAdapter.adaptRoute(links);
                        return links;
                    };

                    //添加附件
                    if (ctrl.addResVM.getValue("purchaseResponseAttachmentList").purchaseResponseAttachmentList.length) {
                        if (ctrl.view.el.find(".js-resAttachments").valid()) {

                        }
                    } else {
                        var wrapAttachError = ctrl.view.el.find(".js-attachError");
                        if (!wrapAttachError.html()) {
                            var error = '<label class="error"></label>';
                            $(error).appendTo(wrapAttachError);
                        }
                    }
                });
            });
        }
        //};


        ctrl.load = function (para) {
            ctrl.rendering(para);
        };


        return ctrl;

    }
)
;