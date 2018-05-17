X.define("modules.infoManage.myResponseDetail",["model.infoManageModel", "model.userModel", "modules.common.moment"], function (infoManageModel, userModel, moment) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.infoManage.tpl.myResponseDetail
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.getData = function (callback) {
        infoManageModel.getMyResponseDetailById(_para["myResponseId"], callback);
    };

    ctrl.rendering = function () {
        var callback = function (model) {
            var temp = {};
            var purchaseInfo = model.purchaseInfo;
            var responseInfo = model.responseInfo;
            var status = '';
            for (var p in purchaseInfo) {
                if (p === "infoType") {
                    if (purchaseInfo[p] === '0') {
                        purchaseInfo[p] = "招标";
                    } else if (purchaseInfo[p] === '1') {
                        purchaseInfo[p] = "询价";
                    }
                }
                var tempIndex = p.slice(0, 1).toUpperCase() + p.slice(1);
                var index = 'purchase' + tempIndex;
                temp[index] = purchaseInfo[p];
            }
            for (var p in responseInfo) {
                var tempIndex = p.slice(0, 1).toUpperCase() + p.slice(1);
                var index = 'response' + tempIndex;
                temp[index] = responseInfo[p];
            }
            var data = temp;
            return view.render(data, function () {
                var fileUploadController = window.X.config.PATH_FILE.path.rootUploadUrl || [];
                var responseAttach = data.responsePurchaseResponseAttachmentList || [];
                var purchaseAttach = data.purchasePurchaseInfoAttachmentList || [];
                ctrl.displayFile = function(content, postions){
                    $.each(content, function (i, item) {
                        var filesPostion = '<div class="eeeBlock mb10 f14">' +
                            '<a target="_blank" href=' + fileUploadController + '?fileType=4&filePath=' +
                            item.filePath + '&fileName=' + item.fileName + ' class="underline col66">' +
                            item.fileName + '</a>' +
                            '</div>';
                        ctrl.view.el.find(postions).append(filesPostion);
                    });
                };
                ctrl.displayFile(responseAttach,".js-responseAttach");
                ctrl.displayFile(purchaseAttach,".js-purchaseAttach");

                if (purchaseInfo.priceResponse === '1') {
                    ctrl.view.el.find('.js-ResponsePrice').hide();
                }

                if (responseInfo['responseResult'] === '0') {
                    ctrl.view.el.find('.js-status').attr('src', '././images/needFeedback.png');
                } else if (responseInfo['responseResult'] === '1') {
                    ctrl.view.el.find('.js-status').attr('src', '././images/winner.png');
                } else if (responseInfo['responseResult'] === '2') {
                    ctrl.view.el.find('.js-status').attr('src', '././images/noWining.png');
                } else if (responseInfo['responseResult'] === '3') {
                    ctrl.view.el.find('.js-status').attr('src', '././images/abandon.png');
                } else if (responseInfo['responseResult'] === '4') {
                    ctrl.view.el.find('.js-status').attr('src', '././images/purpose.png');
                } else if (responseInfo['responseResult'] === '5') {
                    ctrl.view.el.find('.js-status').attr('src', '././images/notadopted.png');
                }

                ctrl.view.el.find('.js-responseInfo').html(responseInfo['responseInfo']);
                ctrl.view.el.find('.js-purchaseAnnounced').html(purchaseInfo['announced']);
                ctrl.view.el.find('.js-purchaseSummary').html(purchaseInfo['summary']);

                var purchaseInfoId = model.purchaseInfo.purchaseInfoId;
                var callback = function(result){
                    if(result.statusCode == 2000000){
                        var list = result.data.list;
                        list.sort(function (a, b) {
                            return moment(a.messageTime) - moment(b.messageTime);
                        })
                        for (var i = 0, len = list.length; i < len; i++) {
                            var messageTime = list[i].messageTime.split(' ')[0];
                            var messageSource = ';'
                            var messageType = '';
                            if (list[i].messageSource === '0') {
                                messageSource = '供应商';
                                messageType = '问';
                            } else if (list[i].messageSource === '1') {
                                messageSource = '采购商';
                                messageType = '答';
                            }
                            var message = '<p class="mb10"><span class="f14 col66">' + messageSource + '</span><span class="ml20">' + messageTime +
                                '</span></p><span class="askAnswerLabel bgcDarkOran vat">' + messageType + '</span><div class="disib ml10 bgcee lh30 w95p bsb pl10">' +
                                list[i].message + '</div>';
                            ctrl.view.el.find('.js-message').append(message);
                        }

                        if (responseInfo['responseResult'] === '0') {
                            ctrl.view.el.find('.js-ask').show();
                        } else {
                            ctrl.view.el.find('.js-ask').hide();
                        }
                        if(model.purchaseInfo["purchaseInfoId"]){
                            var companyId ="";
                            userModel.getUserInfo(function(data){
                                companyId = data.data[0].companyId;
                            });
                            $(".js-questionFontError").html( '');
                            $(".js-questionFont").keyup(function(e) {
                                var length =  $(".js-questionFont").val().length;
                                if (length > 5) {
                                    $(".js-questionFontError").html('');
                                }
                            });
                            infoManageModel.getById(model.purchaseInfo["purchaseInfoId"], function(data) {
                                $(".js-question").click(function () {
                                    if ($(".js-questionFont").val().length <= 5) {
                                        $(".js-questionFontError").html( '请输入超过5字进行提问哦');
                                    } else {
                                        $(".js-questionFontError").html( '');
                                        var _data = {
                                            "businessInfoId": data.purchaseInfoId,
                                            "businessType": data.infoType,
                                            "message": $(".js-questionFont").val(),
                                            "messageSource": 0,
                                            "receiveCompanyId": companyId,
                                            "senderCompanyId": data.purchaserCompanyId
                                        }
                                        infoManageModel.setMessage(_data, function (result) {
                                            $(".js-questionFont").val("");
                                            ctrl.load(_para);
                                        });
                                    }
                                });
                            });
                        };
                    }
                };
                infoManageModel.findMessageByPage(purchaseInfoId, callback);
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