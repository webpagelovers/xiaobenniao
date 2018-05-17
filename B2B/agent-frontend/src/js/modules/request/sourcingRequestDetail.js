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
                if(data.statusCode == '2000100'){
                    $('.js-sourcing-request-detail').loadTemplate($(".js-rfqClosed-tpl"));
                    $('.js-sourcing-request-detail').removeClass('none');
                    return false;
                }
                $('.js-sourcing-request-detail').removeClass('none');

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
                    },
                    destinationFormater: function (value, template) {
                        var str = "";
                        if (value == "Sri Lanka (ශ්‍රී ලංකාව)") {
                            str = "Sri Lanka";
                        } else {
                            str = value;
                        }
                        return str;
                    }


                });

                return view.render(_data, function () {
                    $(document).attr("title", $.i18n.prop('sourcingRequestDetail-headTitle'));

                    var submit = view.el.find(".js-submit")
                    userModel.userInfo(function (res) {
                        if (res.data[0]) {
                            if (res.data[0].expCommission && res.data[0].selfIntroduction) {//信息待完善
                                $(submit).attr("href", X.config.common.link.qutation + "?id=" + para["id"]);
                            } else {
                                $(submit).attr("href", X.config.common.link.additionalIinfo + '?id=' + para["id"]);
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

                    if (requestAdditional[0]) {
                        view.el.find(".js-additional").loadTemplate(view.el.find(".js-additional-tpl"), requestAdditional, {
                            success: function () {
                                view.el.find(".js-additional-attachment").each(function (index, elem) {
                                    if (requestAdditional[index].sourcingRequestAdditionalAttachmentPublishList) {
                                        ctrl.addAttachment($(elem), requestAdditional[index].sourcingRequestAdditionalAttachmentPublishList);
                                    }
                                });
                                view.el.find(".js-content").each(function (index, elem) {
                                    $(this).html(requestAdditional[index].content);

                                })
                                view.el.find("table").attr("border", "1");
                            }
                        });
                    } else {
                        view.el.find(".js-additional-wrap").remove();
                    }
                });
            })
        }
    };


    ctrl.addAttachment = function (parentDiv, data) {

        var wrap = parentDiv;
        handlePathData(data);
        $.each(data, function (i, item) {
            var fileTypes = item.fileName.split("."),
                fileType  = fileTypes[fileTypes.length - 1];
            var temp = fileTypeFunc(item, fileType, uploadTemplate);
            temp ? wrap.append(temp) : '';
        });

        function handlePathData(data){
            $.each(data,function(index,value){
                value.filePath_s = value.filePath.split('.')[0]+'_s'+'.'+value.filePath.split('.')[1];
            });
        }

        function fileTypeFunc(data, fileType, callback) {
            var temp;

            if (fileType) {
                fileType = fileType.toLowerCase();
            }

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
                uploadUrl = X.constructor.prototype.config.attach.download,
                imgUrl = X.constructor.prototype.config.PATH_FILE.path.imgUrl;
            if (type !== "jpg") {
                html = '<a href="' + uploadUrl + '?fileType=' + downloadType + '&filePath=' + data.filePath + '&fileName=' + encodeURIComponent($.trim(data.fileName)) + '">' +
                    '<div class="mt30 disib mr30 por"><div class="center por file-icon file-icon-' + type + '"><p class="poa colff tac b2 w100p" style="margin: 0;">' + fileType + '</p></div>' +
                    '<p class="f12 col00 mt5 tac" style="width: 73px;height: 15px;overflow: hidden;" title="' + data.fileName + '">' + data.fileName + '</p>' +
                    '</div></a>';
            } else {
                html = '<a class="disib" href="' + uploadUrl + '?fileType=' + downloadType + '&filePath=' + data.filePath + '&fileName=' + encodeURIComponent($.trim(data.fileName)) + '">' +
                    '<div class="disib mt30 mr30 por"><div class="img-icon center tac por"><img src="'+ imgUrl + '/'+data.filePath_s+'" class="w100p" style="height:58px">' +
                    '<div class="file-icon-type poa b0 f12 colff w100p tac" style="background: #02d644;">' + fileType + '</div>' +
                    '</div>' +
                    '<p class="f12 col00 mt5 tac" style="width: 73px;height: 15px;overflow: hidden;" title="' + data.fileName + '">' + data.fileName + '</p>' +
                    '</div></a>';
            }
            return html;
        }
    }


    ctrl.load = function () {
        ctrl.rendering();
    };
    ctrl.load();
    X.require(["modules.common.loadingTime"]);
    return ctrl
})
;


