X.define('modules.request.sourcingRequestDetail', ["model.productsModel", "model.userModel"], function (productsModel, userModel) {

    var view = X.view.newOne({
        el: $('.js-sourcing-request-detail'),
        url: X.config.request.tpl.sourcingRequestDetail,
        res: X.config.request.res.sourcingRequestDetail
    });

    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {
        var para = X.getRequest();
        if (para && para["id"]) {
            productsModel.getSourcingRequestById(para["id"], function (data) {
                _data = data.data;


                $.addTemplateFormatter({
                    postTimeFormater: function (value, template) {
                        var date = "";
                        var dateMatch = /^\d{4}(\-\d{2}){2}/;
                        if (value.match(dateMatch)) {
                            date = value.match(/^\d{4}(\-\d{2}){2}/)[0];
                        } else {
                            date = "";
                        }
                        return date;
                    }
                });

                return view.render(_data, function () {
                    $(document).attr("title", "Find Quality China Wholesale Product Suppliers : Weintrade.com");

                    var submit = view.el.find(".js-submit")
                    userModel.userInfo(function (res) {
                        if (res.data[0]) {
                            if (res.data[0].personalId && res.data[0].personalName) {//信息待完善
                                $(submit).attr("href", X.config.common.link.qutation + "?id=" + para["id"]);
                            } else {
                                $(submit).attr("href", X.config.common.link.additionalIinfo);
                            }

                        } else {
                            $(submit).attr("href", X.config.common.link.agentRegist + '?id=' + para["id"]);
                        }
                    });

                    //附件
                    var orderAttachmentsList = _data["sourcingRequestAttachPublishes"];

                    var orderAttachments = ctrl.view.el.find(".js-sourcingRequestAttachments");

                    if (orderAttachmentsList) {
                        ctrl.addAttachment(orderAttachments, orderAttachmentsList);
                    }

                    requestAdditional = _data.sRequestAdditionalPublishList;
                    if (requestAdditional) {
                        view.el.find(".js-additional").loadTemplate(view.el.find(".js-additional-tpl"), requestAdditional, {
                            success: function () {
                                view.el.find(".js-additional-attachment").each(function (index, elem) {
                                    if (requestAdditional[index].sourcingRequestAdditionalAttachmentPublishList) {
                                        ctrl.addAttachment($(elem), requestAdditional[index].sourcingRequestAdditionalAttachmentPublishList);
                                    }
                                });
                                view.el.find(".js-content").each(function (index, elem) {
                                    $(this).html(requestAdditional[index].content);
                                    $(this).find("table").attr("border","1");
                                })

                            }
                        });
                    }
                });
            })
        }
    };


    ctrl.addAttachment = function (parentDiv, data) {

        var wrap = parentDiv;
        $.each(data, function (i, item) {
            var fileType = item.fileName.split(".")[1];
            var temp = fileTypeFunc(item, fileType, uploadTemplate);
            temp ? wrap.append(temp) : '';
        });


        function fileTypeFunc(data, fileType, callback) {
            var temp;

            fileType = fileType.toLowerCase();

            switch (fileType) {
                case 'pdf':
                    temp = callback(data, fileType, "pdf");
                    break;
                case 'jpg':
                    temp = callback(data, fileType, "jpg");
                    break;
                case 'jpeg':
                    temp = callback(data, fileType, "jpg");
                    break;
                case 'png':
                    temp = callback(data, fileType, "jpg");
                    break;
                case 'gif':
                    temp = callback(data, fileType, "jpg");
                    break;
                case 'ppt':
                    temp = callback(data, fileType, "ppt");
                    break;
                case 'pptx':
                    temp = callback(data, fileType, "ppt");
                    break;
                case 'xls':
                    temp = callback(data, fileType, "xls");
                    break;
                case 'xlsx':
                    temp = callback(data, fileType, "xls");
                    break;
                case 'csv':
                    temp = callback(data, fileType, "csv");
                    break;
                case 'doc':
                    temp = callback(data, fileType, "doc");
                    break;
                case 'docx':
                    temp = callback(data, fileType, "doc");
                    break;
                case 'txt':
                    temp = callback(data, fileType, "txt");
                    break;
                case 'text':
                    temp = callback(data, fileType, "txt");
                    break;
                case 'rm':
                    temp = callback(data, fileType, "mv");
                    break;
                case 'rmvb':
                    temp = callback(data, fileType, "mv");
                    break;
                case 'wmv':
                    temp = callback(data, fileType, "mv");
                    break;
                case 'avi':
                    temp = callback(data, fileType, "mv");
                    break;
            }
            return temp;
        }

        function uploadTemplate(data, fileType, type) {
            var html, downloadType = '7',
                uploadUrl = X.constructor.prototype.config.attach.download;
            if (type !== "jpg") {
                html = '<a href="' + uploadUrl + '?fileType=' + downloadType + '&filePath=' + data.filePath + '&fileName=' + data.fileName + '">' +
                    '<div class="mt30 disib mr30 por"><div class="center por file-icon file-icon-' + type + '"><p class="poa colff tac b2 w100p">' + fileType + '</p></div>' +
                    '<p class="f12 col00 mt5" style="width: 56px;height: 15px;overflow: hidden;" title="' + data.fileName + '">' + data.fileName + '</p>' +
                    '</div></a>';
            } else {
                html = '<a class="disib" href="' + uploadUrl + '?fileType=' + downloadType + '&filePath=' + data.filePath + '&fileName=' + data.fileName + '">' +
                    '<div class="disib mt30 mr30 por"><div class="img-icon center tac por"><img src="' + uploadUrl + '?fileType=' + downloadType + '&filePath=' + data.filePath + '&fileName=' + data.fileName + '" class="w100p h100p">' +
                    '<div class="file-icon-type poa b0 f12 colff w100p tac" style="background: #02d644;">' + fileType + '</div>' +
                    '</div>' +
                    '<p class="f12 col00 mt5 tac" style="width: 56px;height: 15px;overflow: hidden;" title="' + data.fileName + '">' + data.fileName + '</p>' +
                    '</div></a>';
            }
            return html;
        }
    }


    ctrl.load = function () {
        ctrl.rendering();
    };
    ctrl.load();

    return ctrl
})
;


