X.define("modules.customerClearance.clearanceDetail", ["model.customerClearanceModel", "data.currencyData", "data.addressData"], function (customerClearanceModel, currencyData, addressData) {
    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.customerClearance.tpl.clearanceDetail
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.load = function (para) {
        customerClearanceModel.getById(para["exportFormId"], function (data) {

            //自定义属性
            $.addTemplateFormatter({
                //收款方式
                exchangeMethodFormater: function (value, template) {
                    return customerClearanceModel.CONSTANTS.exchangeMethod[value];
                },
                //价格条款
                priceTermFormater: function (value, template) {
                    value = Number(value);
                    function countVal(value) {
                        var arr = customerClearanceModel.CONSTANTS.priceTermOtherArr;
                        var v = "";
                        if (value > 3) {
                            for (var i = 0; i < arr.length; i++) {
                                if (arr[i].key == value) {
                                    v = arr[i].value;
                                }
                            }
                        }
                        return v;
                    }

                    switch (value) {
                        case 0:
                            return customerClearanceModel.CONSTANTS.priceTerm[value];
                            break;
                        case 1:
                            return customerClearanceModel.CONSTANTS.priceTerm[value] + '（运费：' + data.fare + '，保费：' + data.premium + '）';
                            break;
                        case 2:
                            return customerClearanceModel.CONSTANTS.priceTerm[value] + '（运费：' + data.fare + '）';
                            break;
                        case 3:
                            return customerClearanceModel.CONSTANTS.priceTerm[value];
                            break;
                        default:
                            return "其它 " + countVal(value);
                    }


                },
                //包装方式
                packageTypeFormater: function (value, template) {
                    return customerClearanceModel.CONSTANTS.packageType[value];
                },
                //产品信息是否确定
                detailConfirmedFormater: function (value, template) {
                    return customerClearanceModel.CONSTANTS.detailConfirmed[value];
                },
                //整体包装材料种类
                packagingMaterialFormater: function (value, template) {
                    if (value == 4) {
                        return customerClearanceModel.CONSTANTS.packagingMaterial[value] + '（' + customerClearanceModel.CONSTANTS.trayType[data.trayType] + '）';
                    } else {
                        return customerClearanceModel.CONSTANTS.packagingMaterial[value];
                    }
                },
                //货品属性
                attributeFormater: function (value, template) {
                    return customerClearanceModel.CONSTANTS.attribute[value];
                },
                //币种
                currencyFormater: function (value, template) {
                    return currencyData.getCurrency(value);
                },
                //境外贸易商
                internationalTraderFormater: function (value, template) {
                    var link = value.name + ' ' + value.nation + '  ' + value.address + '  ' + value.phone + '  ' + value.fax;
                    return link;
                },
                //合同类型
                exchangeContractTypeFormater: function (value, template) {
                    return customerClearanceModel.CONSTANTS.contractType[value];
                },
                //船名
                shipCompanyFormater: function (value, template) {
                    return value.bookings[0].shipCompany;
                },
                //20普通柜
                containerCountFormater: function (value, template) {
                    return value.bookings[0].containerCount;
                },
                //航次
                voyageNumberFormater: function (value, template) {
                    return value.bookings[0].voyageNumber;
                },
                //开船日期
                sailDateFormater: function (value, template) {
                    return value.bookings[0].sailDate;
                },
                //报关人员
                declarationPeoplesFarmater: function (value, template) {
                    return value[0].fullname + " " + value[0].phoneNumber;
                },
                //货物存放地址
                exportGoodsLocationFormater: function (value, template) {
                    var link = addressData.getPro(value.province) + ' - ' + addressData.getCity(value.city) + '  ' + value.address + ' ' + value.contacts + ' ' + value.phone;
                    return link;
                },
                //结汇/退汇账户
                acountFormater: function (value, template) {
                    return "开户名：" + data.accountName + " 开户行：" + data.bankName + " 账号：" + data.bankAccount;
                },
                //本单联系人
                contactsFormater: function (value, template) {
                    return data.contacts + " " + data.phone + " " + data.email;
                }
            });

            view.render(data, function () {
                //货品清单
                var exportGoodsList = X.config.customerClearance.tpl.exportGoodsList;

                $(".js-exportGoodsList").loadTemplate(exportGoodsList, data.exportGoods, {
                    success: function () {
                        $(".js-currencyUnit").html(currencyData.getCurrency(data.currency));
                        $(".js-showHide").attr("onOff", "off");
                        $(".js-showHide").click(function () {
                            var onOff = $(this).attr("onOff");
                            if (onOff == "off") {
                                $(this).html("收起");
                                $(this).attr("onOff", "on");
                                $(this).parent().removeClass("current")
                            } else if (onOff == "on") {
                                $(this).html("展开");
                                $(this).attr("onOff", "off");
                                $(this).parent().addClass("current");
                            }
                        })
                    }
                });

                //进度条 //0-已取消//1-待审核||2-待订舱||3-待报关||4-待结汇||5-待退税||6-已完成
                X.controls.getControl("ProgressBar", view.el.find(".progress-wrap"), {
                    progressContent: ["1", "2", "3", "4", "5", "6", "7"],
                    progressContentInfo: ["资料提交", "待审核", "待订舱", "待报关", "待结汇", "待退税", "已完成"],
                    allSteps: 7,
                    nowStep: getNowStep(data) + 1,
                    cancelled: getCancelled(data.status)
                });

                //判断当前订单是不是已经取消
                function getCancelled(status) {
                    if (Number(status) == 0) {
                        $(".js-cancelStatus").show();
                        return true;
                    } else {
                        $(".js-cancelStatus").hide();
                        return false;
                    }
                }

                var _data;
                //获取当前订单所进行的状态
                function getNowStep(data) {
                    $(".js-cancelStatusCon").html(customerClearanceModel.CONSTANTS.cancelStatusCon[Number(data.status)]);
                    return Number(data.status) == 0 ? Number(data.cancelStatus) : Number(data.status);
                }

                //按钮控制各栏目的现实隐藏
                function bntnClick(showHideButton) {
                    $(showHideButton).click(function () {
                        var str = $(this).children().eq(0).html();
                        if (str == "展开") {
                            $(this).children().eq(0).html("收起");
                            $(this).children().eq(1).removeClass("icon-toggleBottom").addClass("icon-toggleTop");
                        } else if (str == "收起") {
                            $(this).children().eq(0).html("展开");
                            $(this).children().eq(1).removeClass("icon-toggleTop").addClass("icon-toggleBottom");
                        }
                        $(this).parent().next().slideToggle();
                    });
                }

                bntnClick(".js-showHideButton5");

                customerClearanceModel.getExportFormShowInfo(data.exportFormId, function (result) {
                    //按钮控制各栏目的现实隐藏
                    judgeStatusCase(Number(data.status), result);

                });
                //根据状态加载相应的模板
                function judgeStatusCase(status, _data) {
                    var drawbackInformation = X.config.customerClearance.tpl.drawbackInformation;
                    var paymentSettling = X.config.customerClearance.tpl.paymentSettling;
                    var customsRecords = X.config.customerClearance.tpl.customsRecords;
                    var bookingInformation = X.config.customerClearance.tpl.bookingInformation;
                    $(".js-showHideButton5").children().eq(0).html("展开");
                    $(".js-showHideButton5").children().eq(1).removeClass("icon-toggleTop").addClass("icon-toggleBottom");
                    $(".js-column5").hide();

                    switch (status) {
                        case 0:
                            $(".js-showHideButton5").hide();
                            $(".js-column5").show();
                            break;
                        case 1:
                            $(".js-showHideButton5").hide();
                            $(".js-column5").show();
                            break;
                        case 2:
                            $(".js-showHideButton5").hide();
                            $(".js-column5").show();
                            break;
                        case 3:
                            $(".js-bookingInformation").loadTemplate(bookingInformation, _data, {
                                success: function () {
                                    $(".js-showHideButton4").children().eq(0).html("收起");
                                    $(".js-showHideButton4").children().eq(1).removeClass("icon-toggleBottom").addClass("icon-toggleTop");
                                    $(".js-showHideButton4").hide();

                                    addBookingAttachments(_data);
                                    bntnClick(".js-showHideButton4");
                                }
                            });
                            $(".js-showHideButton5").show();
                            break;
                        case 4:
                            $(".js-customsRecords").loadTemplate(customsRecords, _data, {
                                success: function () {
                                    $(".js-showHideButton3").children().eq(0).html("收起");
                                    $(".js-showHideButton3").children().eq(1).removeClass("icon-toggleBottom").addClass("icon-toggleTop");
                                    $(".js-showHideButton3").hide();

                                    addCustomsAttachments(_data);
                                    bntnClick(".js-showHideButton3");
                                }
                            });

                            $(".js-bookingInformation").loadTemplate(bookingInformation, _data, {
                                success: function () {
                                    $(".js-column4").hide();
                                    $(".js-showHideButton4").children().eq(0).html("展开");
                                    $(".js-showHideButton4").children().eq(1).removeClass("icon-toggleTop").addClass("icon-toggleBottom");

                                    addBookingAttachments(_data);
                                    bntnClick(".js-showHideButton4");
                                }
                            });
                            $(".js-showHideButton5").show();
                            break;
                        case 5:
                            $(".js-payment").loadTemplate(paymentSettling, _data, {
                                success: function () {
                                    $(".js-showHideButton2").children().eq(0).html("收起");
                                    $(".js-showHideButton2").children().eq(1).removeClass("icon-toggleBottom").addClass("icon-toggleTop");
                                    $(".js-showHideButton2").hide();

                                    addPaymentAttachments(_data);
                                    bntnClick(".js-showHideButton2");
                                }
                            });
                            $(".js-customsRecords").loadTemplate(customsRecords, _data, {
                                success: function () {
                                    $(".js-column3").hide();
                                    $(".js-showHideButton3").children().eq(0).html("展开");

                                    addCustomsAttachments(_data);
                                    bntnClick(".js-showHideButton3");
                                }
                            });
                            $(".js-bookingInformation").loadTemplate(bookingInformation, _data, {
                                success: function () {
                                    $(".js-column4").hide();
                                    $(".js-showHideButton4").children().eq(0).html("展开");
                                    $(".js-showHideButton4").children().eq(1).removeClass("icon-toggleTop").addClass("icon-toggleBottom");

                                    addBookingAttachments(_data);
                                    bntnClick(".js-showHideButton4");
                                }
                            });
                            $(".js-showHideButton5").show();
                            break;
                        case 6:

                            $(".js-drawback").loadTemplate(drawbackInformation, _data, {
                                success: function () {
                                    $(".js-showHideButton1").children().eq(0).html("收起");
                                    $(".js-showHideButton1").children().eq(1).removeClass("icon-toggleBottom").addClass("icon-toggleTop");
                                    $(".js-showHideButton1").hide();

                                    addDrawBackAttachments(_data);
                                    bntnClick(".js-showHideButton1");
                                }
                            });
                            $(".js-payment").loadTemplate(paymentSettling, _data, {
                                success: function () {
                                    $(".js-showHideButton2").children().eq(0).html("收起");
                                    $(".js-showHideButton2").children().eq(1).removeClass("icon-toggleBottom").addClass("icon-toggleTop");

                                    addPaymentAttachments(_data);
                                    bntnClick(".js-showHideButton2");
                                }
                            });
                            $(".js-customsRecords").loadTemplate(customsRecords, _data, {
                                success: function () {
                                    $(".js-showHideButton3").children().eq(0).html("收起");
                                    $(".js-showHideButton3").children().eq(1).removeClass("icon-toggleBottom").addClass("icon-toggleTop");

                                    addCustomsAttachments(_data);
                                    bntnClick(".js-showHideButton3");
                                }
                            });
                            $(".js-bookingInformation").loadTemplate(bookingInformation, _data, {
                                success: function () {
                                    $(".js-showHideButton4").children().eq(0).html("收起");
                                    $(".js-showHideButton4").children().eq(1).removeClass("icon-toggleBottom").addClass("icon-toggleTop");

                                    addBookingAttachments(_data);
                                    bntnClick(".js-showHideButton4");
                                }
                            });

                            $(".js-showHideButton5").show();
                            $(".js-showHideButton5").children().eq(0).html("收起");
                            $(".js-showHideButton5").children().eq(1).removeClass("icon-toggleBottom").addClass("icon-toggleTop");
                            $(".js-column5").show();
                            break;
                        default:
                    }
                }

                //添加群组附件
                function addDrawBackAttachments(data) {
                    //退汇
                    var drawBackAttchmentList = data.exportRefund.exportRefundAttachments;
                    var drawBackAttchment = ctrl.view.el.find(".js-drawBackAttchment");
                    $.each(drawBackAttchmentList, function (i, item) {
                        //var a = '<div class="grayBlock mr10 mb15"><a href=' + fileUploadController + '?fileType=3&filePath=' + item.filePath + '&fileName=' + item.filename + ' class="underline c009add">' + item.filename + '</a></div>';
                        var a = '<div class="grayBlock mr10 mb15">' +
                            '<a href="' + fileUploadController + '?fileType=3&filePath=' + item.filePath + '&fileName=' + item.filename + '" class="accessory orange-font">' + item.filename + '</a></div>';
                        $(drawBackAttchment).append(a);
                    });
                }

                function addPaymentAttachments(data) {
                    //结汇
                    var paymentAttchmentList = data.exportSettlement.settlementAttachments;
                    var paymentAttchment = ctrl.view.el.find(".js-paymentAttchment");
                    $.each(paymentAttchmentList, function (i, item) {
                        //var a = '<div class="grayBlock mr10 mb15"><a href=' + fileUploadController + '?fileType=3&filePath=' + item.filePath + '&fileName=' + item.filename + ' class="underline c009add">' + item.filename + '</a></div>';
                        var a = '<div class="grayBlock mr10 mb15">' +
                            '<a href="' + fileUploadController + '?fileType=3&filePath=' + item.filePath + '&fileName=' + item.filename + '" class="accessory orange-font">' + item.filename + '</a></div>';
                        $(paymentAttchment).append(a);
                    });
                }

                function addCustomsAttachments(data) {
                    //报关
                    var customsAttchmentList = data.exportDeclaration.declarationAttachments;
                    var customsAttchment = ctrl.view.el.find(".js-customsAttchment");
                    $.each(customsAttchmentList, function (i, item) {
                        // var a = '<div class="grayBlock mr10 mb15"><a href=' + fileUploadController + '?fileType=3&filePath=' + item.filePath + '&fileName=' + item.filename + ' class="underline c009add">' + item.filename + '</a></div>';
                        var a = '<div class="grayBlock mr10 mb15">' +
                            '<a href="' + fileUploadController + '?fileType=3&filePath=' + item.filePath + '&fileName=' + item.filename + '" class="accessory orange-font">' + item.filename + '</a></div>';
                        $(customsAttchment).append(a);
                    });
                }

                function addBookingAttachments(data) {
                    //订舱
                    var bookingAttchmentList = data.exportBooking.bookingAttachments;
                    var bookingAttchment = ctrl.view.el.find(".js-bookingAttchment");
                    $.each(bookingAttchmentList, function (i, item) {
                        // var a = '<div class="grayBlock mr10 mb15"><a href=' + fileUploadController + '?fileType=3&filePath=' + item.filePath + '&fileName=' + item.filename + ' class="underline c009add">' + item.filename + '</a></div>';
                        var a = '<div class="grayBlock mr10 mb15">' +
                            '<a href="' + fileUploadController + '?fileType=3&filePath=' + item.filePath + '&fileName=' + item.filename + '" class="accessory orange-font">' + item.filename + '</a></div>';
                        $(bookingAttchment).append(a);
                    });
                }

                //附件
                var fileUploadController = window.X.config.PATH_FILE.path.rootUploadUrl;
                var orderAttachmentsList = data["orderAttachments"];
                var domesticTradeContractAttachmentsList = data["domesticTradeContractAttachments"];
                var otherAttachmentsList = data["otherAttachments"];

                var orderAttachments = ctrl.view.el.find(".js-orderAttachments");
                var domesticTradeContractAttachments = ctrl.view.el.find(".js-domesticTradeContractAttachments");
                var otherAttachments = ctrl.view.el.find(".js-otherAttachments");

                $.each(orderAttachmentsList, function (i, item) {
                    // var a = '<div class="grayBlock mr10 mb15"><a href=' + fileUploadController + '?fileType=2&filePath=' + item.filePath + '&fileName=' + item.filename + ' class="underline c009add">' + item.filename + '</a></div>';
                    var a = '<div class="grayBlock mr10 mb15">' +
                        '<a href="' + fileUploadController + '?fileType=2&filePath=' + item.filePath + '&fileName=' + item.filename + '" class="accessory orange-font">' + item.filename + '</a></div>';
                    $(orderAttachments).append(a);
                });
                $.each(domesticTradeContractAttachmentsList, function (i, item) {
                    //var a = '<div class="grayBlock mr10 mb15"><a href=' + fileUploadController + '?fileType=2&filePath=' + item.filePath + '&fileName=' + item.filename + ' class="underline c009add">' + item.filename + '</a></div>';
                    var a = '<div class="grayBlock mr10 mb15">' +
                        '<a href="' + fileUploadController + '?fileType=2&filePath=' + item.filePath + '&fileName=' + item.filename + '" class="accessory orange-font">' + item.filename + '</a></div>';
                    $(domesticTradeContractAttachments).append(a);
                });
                $.each(otherAttachmentsList, function (i, item) {
                    // var a = '<div class="grayBlock mr10 mb15"><a href=' + fileUploadController + '?fileType=2&filePath=' + item.filePath + '&fileName=' + item.filename + ' class="underline c009add">' + item.filename + '</a></div>';
                    var a = '<div class="grayBlock mr10 mb15">' +
                        '<a href="' + fileUploadController + '?fileType=2&filePath=' + item.filePath + '&fileName=' + item.filename + '" class="accessory orange-font">' + item.filename + '</a></div>';
                    $(otherAttachments).append(a);
                });


            });

        });
    };

    return ctrl;
});
