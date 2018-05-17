X.define("modules.homePage.homePage",
    ["model.homeModel", "model.userModel", "model.companyModel", "common.layer", "model.contractModel",
        "model.messageModel", "model.customerClearanceModel", "model.infoManageModel", "modules.common.moment", "common.commonMethod"],
    function (homeModel, userModel, companyModel, layer, contractModel, messageModel, customerClearanceModel, infoManageModel, moment, commonMethod) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.homePage.tpl.homePage
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });


    ctrl.rendering = function() {
        var data = {};
        return view.render(data, function () {
            $('.selected').removeClass('selected');
            var getUserInfoCallback = function (result) {
                var userInfoData = result.data[0];
                ctrl.view.el.find(".js-userName").html(userInfoData.userName);
                var personalInfoComplete = '';
                ctrl.view.el.find(".js-personalInfoComplete").click(function (evt) {
                    menuCall(evt, "accountSettings.accountInfo");
                });
                var companyNameCn =  userInfoData.companyNameCn;
                ctrl.view.el.find(".js-companyNameCn").html(companyNameCn);
                ctrl.view.el.find(".js-companyNameCn").click(function (evt) {
                    menuCall(evt, "accountSettings.companyInfo");
                });
            };
            userModel.getUserInfo(getUserInfoCallback);

            var getCompanyInfoCallback = function (result) {
                var companyInfoData = result.data[0];
                var companyInfoComplete = '';
                if (companyInfoData.status === '4') {
                    ctrl.view.el.find(".js-companyInfoCompleteHref").val('完善企业信息');
                } else {
                    ctrl.view.el.find(".js-companyInfoCompleteHref").val('查看企业信息');
                }
                ctrl.view.el.find(".js-companyInfoCompleteHref").click(function (evt) {
                    menuCall(evt, "accountSettings.companyInfo");
                });
                ctrl.view.el.find(".js-accountSafetySetting").click(function (evt) {
                    X.publish(X.CONSTANTS.channel.menuCall, {m: "accountSettings.accountSafety", index: '1'});
                });
                ctrl.view.el.find(".js-companyInfoComplete").click(function (evt) {
                    menuCall(evt, "accountSettings.companyInfo");
                });
            };
            companyModel.getCompanyInfo(getCompanyInfoCallback);

            var getAcountInfoCallback = function (result) {
                if(result.statusCode == 2000000) {
                    var accountInfoData = result.data[0];
                    var totalAmount = commonMethod.formatMoney(accountInfoData.totalAmount, 2, true);
                    ctrl.view.el.find(".js-totalAmount").html(totalAmount);
                }
                ctrl.view.el.find(".js-totalAmount-area").click(function (evt) {
                    menuCall(evt, "contract.fundList");
                });
            };
            contractModel.getAcountInfo(getAcountInfoCallback);

            var listPlatformMessagesCallback = function (result) {
                var platformMessagesData = result.data.list;
                for (var i = 0, len = platformMessagesData.length; i < len; i++) {
                    if (i > 2) {
                        break;
                    }
                    if (platformMessagesData[i].status === '0') {
                        $(ctrl.view.el.find(".js-platformMessages-status")[i]).addClass("orange-font");
                    }
                    ctrl.view.el.find(".js-platformMessages-content")[i].innerHTML = platformMessagesData[i].title;
                    ctrl.view.el.find(".js-platformMessages-createDate")[i].innerHTML = platformMessagesData[i].createDate.split(' ')[0];
                }
                for (var i = platformMessagesData.length; i < 3; i++) {
                    ctrl.view.el.find(".js-platformMessages-status")[i].style.visibility = "hidden";
                    ctrl.view.el.find(".js-platformMessages-createDate-lable")[i].style.visibility = "hidden";
                }

                if (platformMessagesData.length === 0) {
                    ctrl.view.el.find(".js-hasPlatformMessage").hide();
                    ctrl.view.el.find(".js-NotHasPlatformMessage").show();
                    ctrl.view.el.find(".js-platformMessages-moreInfo").hide();
                } else {
                    ctrl.view.el.find(".js-hasPlatformMessage").show();
                    ctrl.view.el.find(".js-NotHasPlatformMessage").hide();
                }

                ctrl.view.el.find(".js-platformMessages-moreInfo").click(function (evt) {
                    menuCall(evt, "message.systemBulletin");
                });

                ctrl.view.el.find(".js-platformMessageRow").click(function (evt) {
                    menuCall(evt, "message.systemBulletin");
                });
            };
            messageModel.listPlatformMessages(listPlatformMessagesCallback);

            var getPlatformMessageCountCallback = function(result){
                ctrl.view.el.find(".js-platformMessages-count").html('(' + result.data[0] + ')') ;
            }
            messageModel.getPlatformMessageCount(getPlatformMessageCountCallback);

            var listClientMessagesCallback = function (result) {
                var clientMessagesData = result.data.list;
                for (var i = 0, len = clientMessagesData.length; i < len; i++) {
                    if (i > 2) {
                        break;
                    }
                    if (clientMessagesData[i].status === '0') {
                        $(ctrl.view.el.find(".js-clientMessages-status")[i]).addClass("orange-font");
                    }
                    ctrl.view.el.find(".js-clientMessages-content")[i].innerHTML = clientMessagesData[i].message;
                    ctrl.view.el.find(".js-clientMessages-createDate")[i].innerHTML = clientMessagesData[i].messageTime.split(' ')[0];
                }
                for (var i = clientMessagesData.length; i < 3; i++) {
                    ctrl.view.el.find(".js-clientMessages-status")[i].style.visibility = "hidden";
                    ctrl.view.el.find(".js-clientMessages-createDate-lable")[i].style.visibility = "hidden";
                }

                if (clientMessagesData.length === 0) {
                    ctrl.view.el.find(".js-hasClientMessage").hide();
                    ctrl.view.el.find(".js-NotHasClientMessage").show();
                    ctrl.view.el.find(".js-clientMessages-moreInfo").hide();
                } else {
                    ctrl.view.el.find(".js-hasClientMessage").show();
                    ctrl.view.el.find(".js-NotHasClientMessage").hide();
                }

                ctrl.view.el.find(".js-clientMessages-moreInfo").click(function (evt) {
                    menuCall(evt, "message.clientMessage");
                });

                ctrl.view.el.find(".js-clientMessageRow").click(function (evt) {
                    menuCall(evt, "message.clientMessage");
                });
            };
            messageModel.findMessageByPage(listClientMessagesCallback);

            var findUnReadClientMessageCountCallback = function(result){
                ctrl.view.el.find(".js-clientMessage-count").html('(' + result.data[0] + ')') ;
            }
            messageModel.findUnReadClientMessageCount(findUnReadClientMessageCountCallback);

            var listSystemMessagesCallback = function (result) {
                var systemMessagesData = result.data.list;
                for (var i = 0, len = systemMessagesData.length; i < len; i++) {
                    if (i > 2) {
                        break;
                    }
                    if (systemMessagesData[i].status === '0') {
                        $(ctrl.view.el.find(".js-systemMessages-status")[i]).addClass("orange-font");
                    }
                    ctrl.view.el.find(".js-systemMessages-content")[i].innerHTML = systemMessagesData[i].title;
                    ctrl.view.el.find(".js-systemMessages-createDate")[i].innerHTML = systemMessagesData[i].createDate.split(' ')[0];
                }
                for (var i = systemMessagesData.length; i < 3; i++) {
                    ctrl.view.el.find(".js-systemMessages-status")[i].style.visibility = "hidden";
                    ctrl.view.el.find(".js-systemMessages-createDate-lable")[i].style.visibility = "hidden";
                }

                if (systemMessagesData.length === 0) {
                    ctrl.view.el.find(".js-hasSystemMessage").hide();
                    ctrl.view.el.find(".js-NotHasSystemMessage").show();
                    ctrl.view.el.find(".js-systemMessages-moreInfo").hide();
                } else {
                    ctrl.view.el.find(".js-hasSystemMessage").show();
                    ctrl.view.el.find(".js-NotHasSystemMessage").hide();
                }

                ctrl.view.el.find(".js-systemMessages-moreInfo").click(function (evt) {
                    menuCall(evt, "message.systemMessage");
                });

                ctrl.view.el.find(".js-systemMessageRow").click(function (evt) {
                    menuCall(evt, "message.systemMessage");
                });
            };
            messageModel.listSystemMessages(listSystemMessagesCallback);

            var getSystemMessageCountCallback = function(result){
                ctrl.view.el.find(".js-systemMessages-count").html('(' + result.data[0] + ')') ;
            }
            messageModel.getSystemMessageCount(getSystemMessageCountCallback);

            var listExportFormCallback = function (result) {
                var exportFormData = result.data.list;
                for (var i = 0, len = exportFormData.length; i < len; i++) {
                    if (i > 2) {
                        break;
                    }
                    ctrl.view.el.find(".js-exportForm-formNumber")[i].innerHTML = exportFormData[i].formNumber;
                    ctrl.view.el.find(".js-exportForm-customsPort")[i].innerHTML = '<p class="tac">出口口岸</p><p class="tac word-cut w65 ml20">' + exportFormData[i].customsPort + '</p>';
                    ctrl.view.el.find(".js-exportForm-tradeNation")[i].innerHTML = '<p class="tac">运抵国</p><p class="tac w50 word-cut w50 ml20">' + exportFormData[i].tradeNation + '</p>';
                    ctrl.view.el.find(".js-exportForm-exportGoodsInfo")[i].innerHTML = exportFormData[i].exportGoodsInfo;
                    ctrl.view.el.find(".js-exportForm-createDate")[i].innerHTML = exportFormData[i].createDate.split(' ')[0];
                    ctrl.view.el.find(".js-exportForm-status")[i].innerHTML = customerClearanceModel.CONSTANTS.status[exportFormData[i].status];

                    (function(exportFormId) {
                        $(ctrl.view.el.find(".js-exportFormRow")[i]).click(function () {
                            X.router.setHistory("m=customerClearance.clearanceList");
                            X.router.run("m=customerClearance.clearanceDetail&exportFormId=" + exportFormId);
                        })})(exportFormData[i]["exportFormId"]);
                }

                for (var i = exportFormData.length; i < 3; i++) {
                    $(ctrl.view.el.find(".js-exportFormRow")[i]).hide();
                }

                if (exportFormData.length === 0) {
                    ctrl.view.el.find(".js-hasExportForm").hide();
                    ctrl.view.el.find(".js-NotHasExportForm").show();
                    ctrl.view.el.find(".js-exportForm-moreInfo").hide();
                } else {
                    ctrl.view.el.find(".js-hasExportForm").show();
                    ctrl.view.el.find(".js-NotHasExportForm").hide();
                }

                ctrl.view.el.find(".js-exportForm-moreInfo").click(function (evt) {
                    menuCall(evt, "customerClearance.clearanceList");
                });
            };
            customerClearanceModel.getList(listExportFormCallback);

            var listMyResponseCallback = function (result) {
                var myResponseData = result.data.list;
                for (var i = 0, len = myResponseData.length; i < len; i++) {
                    if (i > 2) {
                        break;
                    }
                    var infoType = '';
                    if (myResponseData[i].infoType === "0") {
                        infoType = '询价';
                    } else if (myResponseData[i].infoType === "1") {
                        infoType = '招标';
                    }
                    var dueDate = myResponseData[i].dueDate;
                    var dayCount = Math.ceil((moment(dueDate) - moment(myResponseData[i].systemDateTime)) / (1000 * 60 * 60 * 24));
                    dueDate = dueDate.split(' ')[0].replace(/[-]/g, '');
                    var dayCountString = '';
                    if (dayCount <= 0) {
                        dayCountString = '已过截止日期';
                    } else {
                        dayCountString = '剩余' + dayCount + '天';
                    }
                    var responseResult = '';
                    if (myResponseData[i].responseResult === '0') {
                        responseResult = '待反馈';
                    } else {
                        responseResult = '已反馈';
                    }
                    ctrl.view.el.find(".js-myResponse-infoType")[i].innerHTML = infoType;
                    ctrl.view.el.find(".js-myResponse-title")[i].innerHTML = myResponseData[i].title;
                    ctrl.view.el.find(".js-myResponse-dueDate")[i].innerHTML = dueDate + '<br>' + dayCountString;
                    ctrl.view.el.find(".js-myResponse-responseResult")[i].innerHTML = responseResult;
                    ctrl.view.el.find(".js-myResponse-budget")[i].innerHTML = myResponseData[i].budget + '<br>USD';
                    (function(responseId) {
                        $(ctrl.view.el.find(".js-myResponseRow")[i]).click(function () {
                            X.router.setHistory("m=infoManage.myResponseList");
                        X.router.run("m=infoManage.myResponseDetail&myResponseId=" + responseId);
                    })})(myResponseData[i]["responseId"]);
                }

                for (var i = myResponseData.length; i < 3; i++) {
                    $(ctrl.view.el.find(".js-myResponseRow")[i]).hide();
                }

                if (myResponseData.length === 0) {
                    ctrl.view.el.find(".js-hasMyResponse").hide();
                    ctrl.view.el.find(".js-NotHasMyResponse").show();
                    ctrl.view.el.find(".js-myResponse-moreInfo").hide();
                } else {
                    ctrl.view.el.find(".js-hasMyResponse").show();
                    ctrl.view.el.find(".js-NotHasMyResponse").hide();
                }

                ctrl.view.el.find(".js-myResponse-moreInfo").click(function (evt) {
                    menuCall(evt, "infoManage.myResponseList");
                });
            };
            infoManageModel.listMyResponse(listMyResponseCallback);

            view.el.find(".js-jr").attr("href",X.config.channel.jr.root);
            view.el.find(".js-hwy").attr("href",X.config.channel.hwy.root);
        });
    };

    function menuCall(evt, mid){
        evt.stopPropagation();
        evt.preventDefault();
        X.publish(X.CONSTANTS.channel.menuCall, {m: mid});
    }

    ctrl.load = function (para) {
        ctrl.rendering();
    };

    $.addTemplateFormatter({
        platformMsgCountFormater:function(value, template){
            if(value > 99){
                return "99+"
            }else{
                return value;
            }
        }
    });

    return ctrl;
});
