X.define("modules.infoManage.infoManageDetail", ["model.infoManageModel", "model.userModel", "data.currencyData", "common.layer"], function (infoManageModel, userModel, currencyData, layer) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.infoManage.tpl.infoManageDetail
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {
        var companyId = "";
        userModel.getUserInfo(function (data) {
            companyId = data.data[0].companyId;
        });

        $.addTemplateFormatter({
            //产品类别
            productsCategoryFormater: function (value, template) {
                if (value.split("&")[2]) {
                    return value.split("&")[2];
                } else {
                    return value;
                }
            },
            //项目类型
            infoTypeFormater: function (value, template) {
                return infoManageModel.CONSTANTS.infoType[value].value;
            },
            //是否已读
            isReadFormater: function (value, template) {
                return infoManageModel.CONSTANTS.isRead[value].value;
            },
            createDateFormater: function (value, template) {
                return value.split(/\s+/)[0];
            },
            dueDateFormater: function (value, template) {
                return value.split(/\s+/)[0];
            },
            currencyFormater: function (value, template) {
                return currencyData.getCurrency(value);
            },
            statusFormater: function (value, template) {
                return infoManageModel.CONSTANTS.status[value].value;
            }
        });

        var para = X.getRequest();


        if (para && para["purchaseInfoId"]) {
            infoManageModel.getById(para["purchaseInfoId"], function (data) {
                data = addResponseInfoData(data);
                return view.render(data, function () {
                    hideItems(data.shoppingTerms, ".js-shoppingTerms");
                    hideItems(data.paymentTerms, ".js-paymentTerms");
                    hideItems(data.currency, ".js-currency");
                    hideItems(data.budget, ".js-budget");
                    if (!data.purchaseInfoAttachmentList[0]) {
                        view.el.find(".js-infoDetailAttachTitle").remove();
                    }

                    if (para["response"]) {
                        view.el.find(".js-resBtn").remove();
                        showResponseInfo(data);
                    }

                    loadDataList(data.purchaseInfoId);


                    $(".js-question").click(function () {

                        if(!ifBad(data.status)){
                            return false;
                        }

                        if (!passDate(data.dueDate)) {
                            return false;
                        }

                        if ($(".js-questionFont").val().replace(/\s+/, "").length <= 5) {
                            $(".js-responseInfo").html("请输入超过5个字进行提问哦");
                        } else {
                            $(".js-responseInfo").html("");
                            var _data = {
                                "businessInfoId": data.purchaseInfoId,
                                "businessType": data.infoType,
                                "message": $(".js-questionFont").val(),
                                "messageSource": 0,
                                "receiveCompanyId": companyId,
                                "senderCompanyId": data.purchaserCompanyId
                            };

                            infoManageModel.setMessage(_data, function (result) {
                                $(".js-questionFont").val("");
                                ctrl.load();
                            });
                        }

                    });

                    //附件
                    var fileUploadController = window.X.config.PATH_FILE.path.rootUploadUrl;
                    var purchaseInfoAttachmentList = data["purchaseInfoAttachmentList"];
                    var infoDetailAttach = ctrl.view.el.find(".js-infoDetailAttach");
                    $.each(purchaseInfoAttachmentList, function (i, item) {
                        var a = '<div class="wrapUpload">' +
                            '<a href="' + fileUploadController + '?fileType=6&filePath=' + item.filePath + '&fileName=' + item.fileName + '" class="accessory orange-font">' + item.fileName + '</a></div>';
                        $(infoDetailAttach).append(a);
                    });

                    $(".js-resBtn").click(function () {

                        if(!ifBad(data.status)){
                            return false;
                        }

                        if (!passDate(data.dueDate)) {
                            return false;
                        }
                        var links = 'm=infoManage.infoManageRes&responseId=' + data["purchaseInfoId"];
                        window.open(menuCall(data), "_self");
                    });


                });
            });
        }
        ;

        function loadDataList(companyId) {
            infoManageModel.findMessageByPage(companyId, function (result) {
                $(".js-questionList").loadTemplate($(".js-questionList-tpl"), result.data.list.reverse(), {
                    success: function () {

                        $(".js-questionList-tpl").each(function (index, elem) {
                            $(this).removeClass("none");
                            var data = result.data.list[index];
                            messageSource = data.messageSource;
                            messageTime = data.messageTime.split(/\s+/)[0];
                            message = data.message;

                            if (messageSource == 0 || messageSource == "0") {
                                $(this).find(".ask").show();
                                $(this).find(".answer").hide();
                                $(this).find(".ask").find(".messageTime").html(messageTime);
                                $(this).find(".ask").find(".message").html(message);
                            } else if (messageSource == 1 || messageSource == "1") {
                                $(this).find(".ask").hide();
                                $(this).find(".answer").show();
                                $(this).find(".answer").find(".messageTime").html(messageTime);
                                $(this).find(".answer").find(".message").html(message);
                            }
                        })
                    }
                });
            });
        }
    };

    //是否废标
    function ifBad(status){
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

    //是否过期
    function passDate(dueDate) {
        var pass;
        if (compareDate(dueDate) < 0) {
            var layer1 = layer.successMsgClose('本采购信息已截止，请查看其它采购信息', function () {
            });
            pass = false;
        } else {
            pass = true;
        }
        return pass;
    }

    //隐藏非现实字段
    function hideItems(data, elem) {
        if (data == "") {
            view.el.find(elem).remove();
        }
    }

    //比较当前时间和截止日期之间的大小
    function compareDate(dueDate) {
        var comResult = dueDate.split(/\s+/)[0].split('-').join('') - getLocalTime(new Date().getTime());
        return comResult;
    }

    //把时间戳转换成日期数字
    function getLocalTime(nS) {
        var now = new Date();
        var yy = now.getFullYear();
        var mm = now.getMonth() + 1;
        var dd = now.getDate();
        var clock = yy;
        if (mm < 10) clock += "0";
        clock += mm;
        if (dd < 10) clock += "0";
        clock += dd;
        return clock;
    }

    /**
     * 添加响应信息的数据
     *
     * @method addResponseInfoData
     * @param data {Object} 原始数据
     * @return {Object} 整理后的数据
     */
    function addResponseInfoData(data) {
        var temp = {};
        var responseInfo = data.purchaseInfoResponse[0];
        for (var p in responseInfo) {
            var tempIndex = p.slice(0, 1).toUpperCase() + p.slice(1);
            var index = 'response' + tempIndex;
            temp[index] = responseInfo[p];
        }
        var newData = $.extend(temp, data);
        return newData;
    }

    /**
     * 展示响应信息
     *
     * @method showResponseInfo
     * @param data {Object} 数据
     */
    function showResponseInfo(data) {
        var fileUploadController = window.X.config.PATH_FILE.path.rootUploadUrl || [];
        var responseAttach = data.responsePurchaseResponseAttachmentList || [];
        ctrl.displayFile = function (content, postions) {
            $.each(content, function (i, item) {
                var filesPostion = '<div class="eeeBlock mb10 f14">' +
                    '<a target="_blank" href=' + fileUploadController + '?fileType=4&filePath=' +
                    item.filePath + '&fileName=' + item.fileName + ' class="underline col66">' +
                    item.fileName + '</a>' +
                    '</div>';
                ctrl.view.el.find(postions).append(filesPostion);
            });
        };
        ctrl.displayFile(responseAttach, ".js-responseAttach");
        ctrl.view.el.find('.js-responseInfoSummary').html(data['responseResponseInfo']);
        ctrl.view.el.find('.js-responseInfoStatus').removeClass('none');
    }


    var menuCall = function (data) {
        var links = 'infoManage.infoManageRes&responseId=' + data["purchaseInfoId"];
        links = X.config.PATH_FILE.path.rootPath + X.browserAdapter.adaptRoute(links);
        return links;
    }

    ctrl.load = function () {
        ctrl.rendering();
    };


    return ctrl;

});