X.define("modules.inquiry.inquiryDetailInfo", ["model.inquiryModel"], function (inquiryModel) {
    var ctrl = {};
    var ctrlView = {};
    var _para = {};
    function init(ctrlView, para) {
        ctrl.view = ctrlView.view;
        ctrl.getViewModel = ctrlView.getViewModel;
        ctrl.viewModel = ctrlView.viewModel;
        _para = para;
    };
    ctrl.originalInfoTabInit = function (data, ctrl, _para) {
        ctrlView = ctrl;
        init(ctrlView, _para);
        ctrl.view.renderData(data);
        var phone = ''
        if (data.phone == "+undefined") {
            phone = ''
        } else {
            phone = data.phone;
        }
        ctrl.view.el.find(".js-tabContent-original .js-phone").html(phone);
        var temp = data.postTime;
        if (temp.indexOf(':') != temp.lastIndexOf(':')) {
            var temp = temp.slice(0, temp.lastIndexOf(':'));
        }
        ctrl.view.el.find(".js-tabContent-original .js-postTime").text(temp);
        var source = '';
        if (data.source != '') {
            if(data.source.match(/^\d+$/)){
                source = inquiryModel.const.source[data.source].value;
            }else{
                source = data.source;
            }
        }

        ctrl.view.el.find(".js-tabContent-original .js-source").html(source)
        //附件
        var fileUploadController = window.X.config.PATH_FILE.path.rootUploadUrl;
        var attachmentList = data.sourcingRequestAttachments;
        var infoDetailAttach = ctrl.view.el.find(".js-infoDetailAttach");
        $.each(attachmentList, function (i, item) {
            var a = '<div class="grayBlock mr10" style="margin-bottom: 10px;"><a href=' + fileUploadController + '?fileType=7&filePath=' + item.filePath + '&fileName=' + encodeURIComponent($.trim(item.fileName)) + ' class="underline c009add">' + item.fileName + '</a><span class="accessory col66 ml30">' + item.fileSize + '</span></div><br>';
            $(infoDetailAttach).append(a);
        });
        if (attachmentList.length == 0) {
            infoDetailAttach.css({'display': 'inline-block'})
        }

        $('.js-datagrid table').css({'border-width': '0px'});
        //编辑器
        X.require(['modules.common.ueditorImageUploader'], function () {
            UE.delEditor('orginalInfoUEcontainer');
            var ue = UE.getEditor('orginalInfoUEcontainer', {
                //maximumWords: 2000,
                autoHeightEnabled: true,
                focus: true,
                serverUrl: ''
            });
            ue.ready(function() {//编辑器初始化完成再赋值
                $('.edui-for-上传图片').css({'visibility': 'hidden'});
            });
        });


        ctrl.registForm = ctrl.view.el.find(".js-tabContent-original");
        var meta = {
            "productImage": {
                size: 15,
                type: 18,
                width: 56,
                height: 58,
                maxNum: 10,
                accept: {
                    extensions: 'gif,jpg,jpeg,png,xlsx,xls,csv,ppt,pptx,doc,docx,txt,pdf,zip,rtf,key,numbers,pages,mp3,bmp,tiff,rm,rmvb,wmv,avi,3gp,dat,dmv,amv',
                    mimeTypes: '.gif,.jpg,.jpeg,.png,.xlsx,.xls,.csv,.ppt,.pptx,.doc,.docx,.txt,.pdf,.rm,.rmvb,.wmv,.avi'

                },
                filePicker: ".myFilePickerForOriginal",
                filePickerLabel: 'Upload',
                cancel: true,
                uploadSuccess: ctrl.uploadSuccess,
                uploadBeforeSend: ctrl.uploadBeforeSend,
                cancel: ctrl.cancel
            },
            "duty": {
                dataSource: inquiryModel.const.duty,
                selectedChanged: function(val, key) {

                }
            }
        };

        ctrl.viewModel = ctrl.getViewModel(ctrl.registForm, {meta: meta});
        ctrl.viewModel.initControl();

        setTimeout(function () {
            ctrl.view.el.find(".myFilePickerForOriginal input").removeAttr('multiple');
        }, 1000);

        var requestAdditional = data.requestAdditional;
        for (var i = 0, len = requestAdditional.length; i < len; i++) {
            var html = '<div><div class="mb20 vat"><span class="col66 block w160 tar fl">Post time:</span><span class="ml20">'+ requestAdditional[i].postTime + '</span></div>';
            if (requestAdditional[i].content != '') {
                html += '<div class="mb20 vat"><span class="col66 vat disib w160 tar mr20">Content:</span><iframe class="w78p disib" frameborder="no" border="0" style="width:60%;margin-left: -8px;margin-top: -10px;"></iframe></div>';
            } else {
                html += '<div class="mb20 vat"><span class="col66 block w160 tar fl mr20">Content:</span><span style="display: inline-block;"></span></div>';
            }

            html += '<div class="mb20 vat"><span class="col66 block w160 tar fl">Attachment:</span>';
            var attachments = requestAdditional[i].requestAdditionalAttachments;
            if (attachments.length > 0) {
                html += '<div style="margin-left: 180px;">';
                $.each(attachments, function (i, item) {
                    html += '<div class="grayBlock mr10" style="margin-bottom: 10px;"><a href=' + fileUploadController + '?fileType=' + 7 + '&filePath=' + item.filePath + '&fileName=' + encodeURIComponent($.trim(item.fileName)) + ' class="underline c009add">' + item.fileName + '</a><span class="accessory col66 ml30">' + item.fileSize + '</span></div><br>';
                });
                html += '</div>';
            } else {
                html += '<div style="height: 30px;"></div>';
            }
            html += '</div><p class="f16 bottomBorder pb10 mb30 ml30 mr30"></p></div>';
            ctrl.view.el.find(".js-originalInfoAddInfo").append($(html));
        }

        var originalInfoAddInfo =  ctrl.view.el.find(".js-originalInfoAddInfo");
        var iframe = originalInfoAddInfo.find('iframe');
        for (var i = 0, len = iframe.length; i < len; i++) {
            var myIframe = $(iframe[i])[0];
            var docum  = myIframe.contentWindow.document;
            var content = requestAdditional[i].content;
            content = content.replace(/<style type="text\/css">body{background-color:#ffffff; background-image:;.*<\/style>/, '');
            docum.body.innerHTML = content;
            //ctrl.initIframeHeight(20, myIframe);
            myIframe.style.height  = docum.documentElement.offsetHeight + 'px';
        }

        ctrl.view.el.find(".js-originalInfoSubmit").click(function () {
            var postTime = $(".js-tabContent-original .datetimepicker").val();
            var content = UE.getEditor('orginalInfoUEcontainer').getAllHtml();

            if (postTime == '') {
                $(".js-tabContent-original .js-error").html('Please enter the Post Time.');
                return;
            } else {
                postTime += ':00';
                $(".js-tabContent-original .js-error").html('');
            }

            var wrapData = ctrl.view.el.find(".myFilePickerForOriginalContainer .js-wrapData .accessory.myFile");
            var files = [];
            for (var i = 0, len = wrapData.length; i < len; i++) {
                var temp = {};
                var path = $(wrapData[i]).attr('path');
                var fileSize = $(wrapData[i]).attr('fileSize');
                temp.attachmentType = 1,
                    temp.filePath = path;
                temp.fileName = $(wrapData[i]).html();
                temp.fileSize = fileSize;
                files.push(temp);
            }
            var myData = {
                "postTime": postTime,
                "content": content,
                "requestAdditionalAttachments": files,
                "sourcingRequestId":data.sourcingRequestId,
            };
            var callback = function (result) {
                var data = result.data;
                if (result.statusCode="2000000") {
                    ctrl.load(_para);
                }
            };

            inquiryModel.addAttachedInfo(myData, callback);
        });
    };

    ctrl.publicInfoTabInit = function (data) {
        ctrl.publicInfoUpdate(data);
        var url = window.X.config.PATH_FILE.path.srPublishUrl + data.id;
        var clipboard = new Clipboard('.js-copyBtn', {
            text: function() {
                return url;
            }
        });
        ctrl.view.el.find(".js-copyBtn").click(function () {
            layer.msg('链接已复制', {
                icon: 1,
                time: 2000 //2秒关闭（如果不配置，默认是3秒）
            }, function(){
                //do something
            });
        });

        ctrl.registFormPublic = ctrl.view.el.find(".js-publicInfoMain");
        var meta = {
            "productImage": {
                size: 15,
                type: 18,
                width: 56,
                height: 58,
                maxNum: 10,
                accept: {
                    extensions: 'gif,jpg,jpeg,png,xlsx,xls,csv,ppt,pptx,doc,docx,txt,pdf,zip,rtf,key,numbers,pages,mp3,bmp,tiff,rm,rmvb,wmv,avi,3gp,dat,dmv,amv',
                    mimeTypes: '.gif,.jpg,.jpeg,.png,.xlsx,.xls,.csv,.ppt,.pptx,.doc,.docx,.txt,.pdf,.rm,.rmvb,.wmv,.avi'

                },
                filePicker: ".myFilePickerForPublic",
                filePickerLabel: 'attachment',
                cancel: true,
                uploadSuccess: ctrl.uploadSuccess,
                uploadBeforeSend: ctrl.uploadBeforeSend,
                cancel: ctrl.cancel
            }
        };

        ctrl.viewModel = ctrl.getViewModel(ctrl.registFormPublic, {meta: meta});
        ctrl.viewModel.initControl();

        setTimeout(function () {
            ctrl.view.el.find(".myFilePickerForPublic input").removeAttr('multiple');
        }, 1000);

        var meta = {};
        var fileUploadController = window.X.config.PATH_FILE.path.rootUploadUrl;
        ctrl.view.el.find(".js-publicInfoAddInfo").html('');
        var temp = data.sRequestAdditionalPublishList;
        for (var i = 0, len = temp.length; i < len; i++) {
            var openCss = ''
            if (temp[i].isPublic == '0') {
                openCss = 'close';
            } else if (temp[i].isPublic == '1') {
                openCss = 'open';
            }
            var html = '<div><div class="mb20 vat"><span class="col66 block w160 tar fl">Post time:</span><span data-content-text="responseSupplierName" class="ml20 js-notEditable">' + temp[i].postTime + '</span><input type="text" class="ml20 cccBorder datetimepicker js-editable" data="' + temp[i].id + '" style="display: none;" value="' + temp[i].postTime + '"/></div>' +
                '<div class="mb20 vat" style="height: 10px;"><div class="fr" style="margin-right: 200px;"><span class="" style="margin-right: 5px;">是否公开</span><div class="curp js-open ' + openCss + '" data="' + temp[i].id + '" publishSourcingId="' + temp[i].publishSourcingId + '" style="width: 38px;height: 23px;display: inline-block;vertical-align:top;"></div></div></div>' +
                '<div class="mt20 vat"><input type="button" style="margin-right: 200px;position: relative;"  class="fr f16 Raleway default_button bold curp w140 js-addInfoEdit" data="' + temp[i].id + '" value="编辑" /></div>' +
                '<div class="mb20 vat"><span class="col66 vat disib w160 tar mr20">Content:</span><iframe class="w78p js-notEditable" flg="my" frameborder="no" border="0" style="margin-left: 172px;margin-top: -40px;vertical-align: top;"></iframe>' +
                '<div class="js-editable" style="width:100%;margin-left: 180px;margin-top: -20px;display: none;">'　+
                '<script id="publicInfoUEcontainer' + temp[i].id + '" style="width:700px;height:150px;" type="text/plain" >' + '</script>' +
                '</div>' +
                '</div>' +
                '<div class="mb20 vat"><span class="col66 block w160 tar fl">Attachment:</span>';


            var attachments = temp[i].sourcingRequestAdditionalAttachmentPublishList;
            if (attachments.length > 0) {
                html += '<div style="margin-left: 180px;">';
                $.each(attachments, function (i, item) {
                    html += '<div class="grayBlock mr10 js-singleAttachment" style="margin-bottom: 10px;"><a href=' + fileUploadController + '?fileType=' + 7 + '&filePath=' + item.filePath + '&fileName=' + encodeURIComponent($.trim(item.fileName)) + ' class="underline c009add">' + item.fileName + '</a><img src="images/delete.jpg" class="js-delete" style="display: none"><span class="accessory col66 ml30 js-fileSize">' + item.fileSize + '</span></div><br>';
                });
                html += '</div>';
            } else {
                html += '<div style="margin-left: 180px;"><div class="mr10" style="margin-bottom: 10px;"></div><br>';
                html += '</div>';
            }

            html += '</div><div class="js-editable js-addInfoAttachment" style="display: none;">' +
                '<div style="margin-top: 15px;margin-left: 180px;">' +
                '<div data-property-name="publicAddInfoAttachment' + i + '" data-control-type="UploadNew" class="por fl js-publicAddInfoFlg" style="margin-bottom: -15px">' +
                '<div class="js-wrapData" style="padding-top: 5px;"></div>' +
                '<div class="showUpload mb15 por">' +
                '<div class="fl" style="margin-left: 2px;">' +
                '<a style="color:#666;cursor:pointer" class="f16 myFilePicker pr request myFilePickerForPublicAddInfoIndex' + i + '" ></a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>'+
                '<div class="tac js-addInfoSave" style="margin-top: 100px;display: none;">'+
                '<input type="button" class="f16 Raleway default_button bold js-save curp w130" data="' + temp[i].id + '" publishSourcingId="' + temp[i].publishSourcingId + '" value="保存">'+
                '<input type="button" class="f16 Raleway default_button bold js-cancel curp w130" style="margin-left: 5px;" value="取消">'+
                '</div>'+
                '</div>'+
                '</div>' +
                '<p class="f16 bottomBorder pb10 mb30 ml30 mr30"></p>';

            ctrl.view.el.find(".js-publicInfoAddInfo").append($(html));

            var deleteIcon = ctrl.view.el.find(".js-publicInfoAddInfo .js-delete");
            deleteIcon.click(function () {
                $(this).parent().remove();
            });

            meta['publicAddInfoAttachment' + i] = {
                size: 15,
                type: 18,
                width: 56,
                height: 58,
                maxNum: 10,
                accept: {
                    extensions: 'gif,jpg,jpeg,png,xlsx,xls,csv,ppt,pptx,doc,docx,txt,pdf,zip,rtf,key,numbers,pages,mp3,bmp,tiff,rm,rmvb,wmv,avi,3gp,dat,dmv,amv',
                    mimeTypes: '.gif,.jpg,.jpeg,.png,.xlsx,.xls,.csv,.ppt,.pptx,.doc,.docx,.txt,.pdf,.rm,.rmvb,.wmv,.avi'

                },
                filePicker: ".myFilePickerForPublicAddInfoIndex" + i,
                filePickerLabel: 'Upload',
                cancel: true,
                uploadSuccess: ctrl.uploadSuccess,
                uploadBeforeSend: ctrl.uploadBeforeSend,
                cancel: ctrl.cancel
            };
        }
        ctrl.registFormPublic = ctrl.view.el.find(".js-publicInfoAddInfo");
        ctrl.viewModel = ctrl.getViewModel(ctrl.registFormPublic, {meta: meta});
        ctrl.viewModel.initControl();

        setTimeout(function () {
            ctrl.view.el.find(".js-publicInfoAddInfo input").removeAttr('multiple');
        }, 1000);

        var helper = function (temp) {
            UE.delEditor('publicInfoUEcontainer' + temp.id);
            var ue = UE.getEditor('publicInfoUEcontainer' + temp.id, {
                //maximumWords: 2000,
                autoHeightEnabled: true,
                focus: true,
                serverUrl: ''
            });
            ue.ready(function() {
                $('.edui-for-上传图片').css({'visibility': 'hidden'});
                var index = temp.content.indexOf('<body');
                var endIndex = temp.content.indexOf('<\/body>');
                var content = '';
                if (index != -1) {
                    content = temp.content.slice(index + 7, endIndex - 4);
                }
                ue.setContent(content);
            });
        };

        X.require(['modules.common.ueditorImageUploader'], function () {
            for (var j = 0, len = temp.length; j < len; j++) {
                helper(temp[j]);
            }
        });

        var publicInfoAddInfo =  ctrl.view.el.find(".js-publicInfoAddInfo");
        var iframe = publicInfoAddInfo.find('iframe[flg=my]');
        for (var i = 0, len = iframe.length; i < len; i++) {
            var myIframe = $(iframe[i])[0];
            var docum  = myIframe.contentWindow.document;
            // docum.body.innerHTML = temp[i].content;
            // myIframe.style.height  = docum.documentElement.offsetHeight + 'px';
            var content = temp[i].content;
            content = content.replace(/<style type="text\/css">body{background-color:#ffffff; background-image:;.*<\/style>/, '');
            docum.body.innerHTML = content;
            myIframe.style.height  = docum.documentElement.offsetHeight + 'px';
            //ctrl.initIframeHeight(20, myIframe);
        }

        ctrl.view.el.find(".js-publicInfoMain .js-open").unbind('click');
        ctrl.view.el.find(".js-publicInfoMain .js-open").click(function () {
            var that = this;
            if ($(that).hasClass('open')) {
                $(that).removeClass('open').addClass('close');
            } else if ($(that).hasClass('close')) {
                $(that).removeClass('close').addClass('open');
            }
            ctrl.publicMainSave(data, 'openBtn');
        });

        ctrl.view.el.find(".js-publicInfoAddInfo .js-open").click(function () {
            var that = this;
            if ($(that).hasClass('open')) {
                $(that).removeClass('open').addClass('close');
            } else if ($(that).hasClass('close')) {
                $(that).removeClass('close').addClass('open');
            }
            ctrl.publicAddInfoSave(data, 'openBtn', that);
        });

        ctrl.view.el.find(".js-publicInfoEdit").click(function () {
            var that = this;
            $(that).parent().parent().find('.js-notEditable').css({"display": 'none'});
            $(that).parent().parent().find('.js-editable').css({"display": 'inline-block'});
            $(that).hide();
            ctrl.view.el.find(".js-publicInfoSave").css({"display": "block"});
            var deleteIcon = ctrl.view.el.find(".js-publicInfoMain .js-publicInfoAttach .js-singleAttachment .js-delete");
            deleteIcon.css({"display": 'inline-block'});
            ctrl.view.el.find(".js-publicInfoMain .js-open").parent().hide();
            $(that).parent().parent().find('.js-postTime-content').css({'width': '800px'});

        });
        ctrl.view.el.find(".js-publicInfoSave .js-cancel").click(function () {
            var that = this;
            $(that).parent().parent().find('.js-notEditable').css({"display": 'inline-block'});
            $(that).parent().parent().find('.js-editable').css({"display": 'none'});
            ctrl.view.el.find(".js-publicInfoEdit").show();
            ctrl.view.el.find(".js-publicInfoSave").css({"display": "none"});
            var deleteIcon = ctrl.view.el.find(".js-publicInfoMain .js-publicInfoAttach .js-singleAttachment .js-delete");
            deleteIcon.css({"display": 'none'});
            ctrl.view.el.find(".js-publicInfoMain .js-open").parent().show();
            $(that).parent().parent().find('.js-postTime-content').css({'width': '320px'});
            var detailCountInfo = $('#buyingRequestDescriptionInfo');
            detailCountInfo.html('');
        });

        ctrl.view.el.find(".js-publicInfoSave .js-save").unbind('click').click(function () {
            var that = this;
            ctrl.publicMainSave(data, 'saveBtn');
            ctrl.view.el.find(".js-publicInfoMain .js-open").parent().show();
            $(that).parent().parent().find('.js-postTime-content').css({'width': '320px'});
            var detailCountInfo = $('#buyingRequestDescriptionInfo');
            detailCountInfo.html('');
        });

        ctrl.view.el.find(".js-publicInfoAddInfo .js-addInfoEdit").click(function () {
            var that = this;
            $(that).parent().parent().find('.js-notEditable').css({"display": 'none'});
            $(that).parent().parent().find('.js-editable').css({"display": 'inline-block'});
            $(that).parent().parent().find('.js-addInfoAttachment').css({"display": 'block'});
            $(that).hide();
            $(that).parent().parent().find(".js-addInfoSave").css({"display": "block"});
            var deleteIcon = $(that).parent().parent().find(".js-delete");
            deleteIcon.css({"display": 'inline-block'});
            setTimeout(function () {
                var ue = UE.getEditor('publicInfoUEcontainer' + $(that).attr('data'));
                ue.focus();
                var content = ue.getContent();
                ue.setContent(content);
            }, 500);

            $(that).parent().parent().find(".js-open").parent().hide();
        });

        ctrl.view.el.find(".js-publicInfoAddInfo .js-save").click(function () {
            var that = this;
            ctrl.publicAddInfoSave(data, 'saveBtn', that);
            $(that).parent().parent().find(".js-open").parent().show();
        });

        ctrl.view.el.find(".js-publicInfoAddInfo .js-cancel").click(function () {
            var that = this;
            $(that).parent().parent().find('.js-notEditable').css({"display": 'inline-block'});
            $(that).parent().parent().find('.js-editable').css({"display": 'none'});
            ctrl.view.el.find(".js-publicInfoAddInfo .js-addInfoEdit").show();
            $(that).parent().parent().find(".js-addInfoSave").css({"display": "none"});
            var deleteIcon = $(that).parent().parent().find(".js-delete");
            deleteIcon.css({"display": 'none'});
            $(that).parent().parent().find(".js-open").parent().show();
        });

        ctrl.datetimeInit();
    };

    var countryName = '';
    ctrl.publicInfoUpdate = function (data) {
        var content = ctrl.view.el.find(".js-tabContent-public");
        var overStatus = data.overStatus;
        var temp = '';
        if (overStatus == '0') {
            temp = '未公开';
        } else if (overStatus == '1') {
            temp = '部分公开';
        } else if (overStatus == '2') {
            temp = '已公开';
        }
        content.find('.js-overStatus').html(temp);
        content.find('.js-sourcingRequestId').html(data.rfqNumber);
        var url = window.X.config.PATH_FILE.path.srPublishUrl + data.id;
        content.find('.js-publishUrl').val(url);

        if (data.isPublic == '0') {
            content.find('.js-open').addClass('close');
        } else if (data.isPublic == '1') {
            content.find('.js-open').addClass('open');
        }
        content.find('.js-createDate').html(data.postTime);
        content.find('.js-productName').html(data.productName);
        content.find('.js-quantity').html(data.quantity);
        content.find('.js-destination').html(data.destination);
        content.find('.js-details').html(data.details);

        $(".js-publicInfoMain .js-datetimepickerEdit").val(data.postTime);
        $(".js-publicInfoMain .js-productNameEdit").val(data.productName);
        $(".js-publicInfoMain .js-quantityEdit").val(data.quantity);
        $(".js-publicInfoMain .js-detailsEdit").val(data.details);
        ctrl.detailCount();

        var allCountries = inquiryModel.const.allCountries;
        var temp = data.destination;
        var initialCountry = 'cn';
        for (var i = 0, len = allCountries.length; i < len; i++) {
            if (allCountries[i][0] == temp) {
                initialCountry = allCountries[i][1];
            }
        }

        $(".js-publicInfoMain #phone").intlTelInput({
            initialCountry: initialCountry,
            autoPlaceholder: 'off',
            //autoHideDialCode: false,
            preferredCountries: []
        });

        var countryData = $("#phone").intlTelInput("getSelectedCountryData");
        countryName = countryData.name;

        jQuery("#phone").on("countrychange", function(e, countryData) {
            countryName = countryData.name;
            content.find('.js-destination').html(countryName);
        });

        ctrl.view.el.find('.js-publicInfoMain .js-notEditable').css({"display": 'inline-block'});
        ctrl.view.el.find('.js-publicInfoMain .js-editable').css({"display": 'none'});
        ctrl.view.el.find(".js-publicInfoEdit").show();
        ctrl.view.el.find(".js-publicInfoSave").css({"display": "none"});

        ctrl.view.el.find('.js-publicInfoAddInfo .js-notEditable').css({"display": 'inline-block'});
        ctrl.view.el.find('.js-publicInfoAddInfo .js-editable').css({"display": 'none'});
        ctrl.view.el.find(".js-publicInfoAddInfo .js-addInfoEdit").show();
        ctrl.view.el.find(".js-publicInfoAddInfo .js-addInfoSave").css({"display": "none"});

        //附件
        var fileUploadController = window.X.config.PATH_FILE.path.rootUploadUrl;
        var attachmentList = data.sourcingRequestAttachPublishes;
        var infoDetailAttach = ctrl.view.el.find(".js-publicInfoAttach");
        infoDetailAttach.html('');
        if (attachmentList && attachmentList.length > 0) {
            $.each(attachmentList, function (i, item) {
                var a = '<div class="grayBlock mr10 js-singleAttachment" style="margin-bottom: 10px;"><a href=' + fileUploadController + '?fileType=7&filePath=' + item.filePath + '&fileName=' + encodeURIComponent($.trim(item.fileName)) + ' class="underline c009add">' + item.fileName
                    + '</a><img src="images/delete.jpg" class="js-delete" style="display: none"><span class="accessory col66 ml30 js-fileSize">' + item.fileSize + '</span></div><br>';
                $(infoDetailAttach).append(a);
            });
        }

        var deleteIcon = ctrl.view.el.find(".js-publicInfoMain .js-publicInfoAttach .js-singleAttachment .js-delete");
        deleteIcon.click(function () {
            $(this).parent().remove();
        });

        ctrl.formValidate();
        //ctrl.validateValue();

    };

    ctrl.detailCount = function () {
        var detail = $(".js-publicInfoMain .js-detailsEdit");
        detail.keydown(function(e) {
            var contactUsContent =  detail.val();
            var len = contactUsContent.length;
            var isChrome = $.browser["chrome"] === true;
            var brLen;
            if (contactUsContent.match(/[\n]/g)) {
                brLen = contactUsContent.match(/[\n]/g).length;
            }
            var count;
            if (brLen && isChrome) {
                count = (10000 - len - brLen);
            } else {
                count = (10000 - len);
            }
            if (count < 0) {
                count = 0;
            }
            if (count <= 0 && e.keyCode !== 8 && e.keyCode !== 37 && e.keyCode !== 38 &&
                e.keyCode !== 39 && e.keyCode !== 40 && e.keyCode !== 46) {
                event.returnValue = false;
            }
        });

        detail.keyup(function(data) {
            var contactUsContent =  detail.val();
            var len = contactUsContent.length;
            var isChrome = $.browser["chrome"] === true;
            var brLen;
            if (contactUsContent.match(/[\n]/g)) {
                brLen = contactUsContent.match(/[\n]/g).length;
            }
            var count;
            if (brLen && isChrome) {
                count = (10000 - len - brLen);
            } else {
                count = (10000 - len);
            }
            if (count < 0) {
                count = 0;
            }
            var detailCountInfo = $('#buyingRequestDescriptionInfo');
            if (count < 7000) {
                detailCountInfo.parent().find('.js-error').html("");
                detailCountInfo.html('You can also continue to enter ' + ' <span class="" style="color:#d26b22;">' + count + '</span> ' + 'characters').css('visibility', 'visible');
            } else {
                detailCountInfo.html('').css('visibility', 'visible');
            }
        });
    };

    /**
     @method formValidate 表单数据校验
     */
    ctrl.formValidate = function(){
        ctrl.validate = {
            rules: {
                productName: {
                    required: true
                },
                details: {
                    required: true
                },
                postTime:{
                    required: true
                }
            },
            messages: {
                productName: {
                    required: "Please enter the product name"
                },
                details: {
                    required: "Please enter detailed product description"
                },
                postTime: {
                    required: "Please enter the Post Time"
                }
            },
            onkeyup: false,
            onfocusout: function (element) {
                var elem = $(element);
                elem.valid();
            },
            success: function(value){},
            errorPlacement: function (error, element) {
                if($(error).html()){
                    var errorWrap = element.parent().find(".js-error");
                    errorWrap.html("");
                    error.appendTo(errorWrap);
                }
            }
        };
        ctrl.view.el.find('.js-addForm').validate(ctrl.validate);
    };

    /**
     @method deleteSpecialChar 删除非英文
     */
    ctrl.deleteSpecialChar = function (value) {
        var temp = '';
        for (var i = 0, len = value.length; i < len; i++) {
            var char = value.charAt(i);
            if (/[A-Za-z0-9\s(\`)(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\_)(\-)(\+)(\=)(\|)(\\)(\{)(\})(\')(\:)(\;)(\')(\")(',)(\[)(\])(\.)(\<)(\>)(\/)(\?)(\~)(\！)(\@)(\#)(\￥)(\%)(\…)(\&)(\*)(\（)(\）)(\—)(\+)(\|)(\{)(\})(\【)(\】)(\‘)(\；)(\：)(\”)(\“)(\’)(\。)(\，)(\、)(\？)]/.test(char)) {
                temp += char;
            }
        }
        return temp;
    };

    ctrl.validateValue = function () {

        var fun = function(wrap,value){
            var temp = ctrl.deleteSpecialChar(value);
            if (temp != value) {
                $(wrap).val(ctrl.deleteSpecialChar(temp));
            }
        };

        ctrl.view.el.find("input").on("keyup change",function(){
            var value = $(this).val();
            fun(this,value);
        });
        ctrl.view.el.find("textarea").on("keyup change",function () {
            var value = $(this).val();
            fun(this,value);
        });
    };

    ctrl.getDatetime = function () {
        function p(s) {
            return s < 10 ? '0' + s: s;
        }

        var myDate = new Date();
        var year=myDate.getFullYear();
        var month=myDate.getMonth()+1;
        var date=myDate.getDate();
        var h=myDate.getHours();       //获取当前小时数(0-23)
        var m=myDate.getMinutes();     //获取当前分钟数(0-59)
        var s=myDate.getSeconds();

        var now=year+'-'+p(month)+"-"+p(date)+" "+p(h)+':'+p(m);
        return now;
    };

    ctrl.datetimeInit = function () {
        $.datetimepicker.setLocale('en');
        $('.datetimepicker').datetimepicker({
            //value:'2015/04/15 05:03',
            dayOfWeekStart : 1,
            lang:'en',
            format:"Y-m-d H:i",
            disabledDates:['1986/01/08','1986/01/09','1986/01/10']
            //startDate:	'1986/01/05'
        });
        $($('.datetimepicker')[0]).val(ctrl.getDatetime());
        $('.datetimepicker').datetimepicker({value:'',step:10});
        $('.datetimepicker').focusin(function () {
            $('.xbn-frame').css({
                "overflow-y": "hidden"
            });
            $('.datetimepicker').css('border-color', '#00aff0');
        });
        $('.datetimepicker').focusout(function () {
            $('.xbn-frame').css({
                "overflow-y": "auto"
            });
            $('.datetimepicker').css('border-color', '#cccccc');
            if ($(this).val() == '') {
                $(this).val(ctrl.getDatetime());
            }
        });
    };

    ctrl.publicMainSave = function (data, btn) {
        var postTime = $(".js-publicInfoMain .js-datetimepickerEdit").val();
        var productName = $(".js-publicInfoMain .js-productNameEdit").val();
        var quantity = $(".js-publicInfoMain .js-quantityEdit").val();
        var destination = countryName;
        var details = $(".js-publicInfoMain .js-detailsEdit").val();
        var open = $(".js-publicInfoMain .js-open");
        var isPublic = '0'
        if (open.hasClass('open')) {
            isPublic = '1';
        } else if (open.hasClass('close')) {
            isPublic = '0';
        }


        var singleAttachment = ctrl.view.el.find(".js-publicInfoMain .js-publicInfoAttach .js-singleAttachment");

        function getQueryString(url, name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = url.match(reg);
            if (r != null) return unescape(r[2]); return null;
        }

        var files = [];

        for (var i = 0, len = singleAttachment.length; i < len; i++) {
            var href = $(singleAttachment[i]).find('a').attr('href');
            var fileSize = $(singleAttachment[i]).find('.js-fileSize').text();
            var index = href.indexOf('?');
            href = href.slice(index);
            var filePath = getQueryString(href, 'filePath');
            var fileName = $(singleAttachment[i]).find('a').text();
            var temp = {};
            temp.filePath = filePath;
            temp.fileName = fileName;
            temp.fileSize = fileSize;
            temp.publishSourcingId = data.id;
            files.push(temp);
        }

        var wrapData = ctrl.view.el.find(".js-publicInfoMain .js-wrapData .accessory.myFile");
        for (var i = 0, len = wrapData.length; i < len; i++) {
            var temp = {};
            var path = $(wrapData[i]).attr('path');
            var fileSize = $(wrapData[i]).attr('fileSize');
            temp.filePath = path;
            temp.fileName = $(wrapData[i]).html();
            temp.fileSize = fileSize;
            temp.publishSourcingId = data.id;
            files.push(temp);
        }
        var wrapData = ctrl.view.el.find(".js-publicInfoMain .js-wrapData").html('');
        var myData = {
            "id": data.id,
            "isPublic": isPublic,
            "postTime": postTime,
            "productName": productName,
            "quantity": quantity,
            "destination": destination,
            "details": details,
            "sourcingRequestAttachPublishes": files,
            "sourcingRequestId": data.sourcingRequestId,
        };
        var callback = function (result) {
            var data = result.data;
            if (result.statusCode=="2000000") {
                if (btn == 'saveBtn') {
                    ctrl.publicInfo();
                } else {
                    ctrl.updateMainStatus();
                }

            }
        };
        inquiryModel.updateSRPublish(myData, callback);
    };

    ctrl.publicAddInfoSave = function (data, btn, that) {
        var id = $(that).attr('data');
        var publishSourcingId = $(that).attr('publishSourcingId');
        var postTime = $(".js-publicInfoAddInfo .datetimepicker[data="+ id +"]").val();
        var content = UE.getEditor('publicInfoUEcontainer' + id).getAllHtml();

        var open = $(".js-publicInfoAddInfo .js-open[data="+ id +"]");
        var isPublic = '0'
        if (open.hasClass('open')) {
            isPublic = '1';
        } else if (open.hasClass('close')) {
            isPublic = '0';
        }

        var singleAttachment = ''
        if (btn == 'saveBtn') {
            singleAttachment = $(that).parent().parent().find(".js-singleAttachment")
        } else {
            singleAttachment = $(that).parent().parent().parent().find(".js-singleAttachment")
        }

        function getQueryString(url, name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = url.match(reg);
            if (r != null) return unescape(r[2]); return null;
        }

        var files = [];

        for (var i = 0, len = singleAttachment.length; i < len; i++) {
            var href = $(singleAttachment[i]).find('a').attr('href');
            var fileSize = $(singleAttachment[i]).find('.js-fileSize').text();
            var index = href.indexOf('?');
            href = href.slice(index);
            var filePath = getQueryString(href, 'filePath');
            var fileName = $(singleAttachment[i]).find('a').text();;
            var temp = {};
            temp.filePath = filePath;
            temp.fileName = fileName;
            temp.fileSize = fileSize;
            temp.publishAdditionalId = id;
            files.push(temp);
        }

        var wrapData = ''
        if (btn == 'saveBtn') {
            wrapData = $(that).parent().parent().find(".js-wrapData .accessory.myFile");
        } else {
            wrapData = $(that).parent().parent().parent().find(".js-wrapData .accessory.myFile");
        }

        for (var i = 0, len = wrapData.length; i < len; i++) {
            var temp = {};
            var path = $(wrapData[i]).attr('path');
            var fileSize = $(wrapData[i]).attr('fileSize');
            temp.filePath = path;
            temp.fileName = $(wrapData[i]).html();
            temp.fileSize = fileSize;
            temp.publishAdditionalId = id;
            files.push(temp);
        }
        if (btn == 'saveBtn') {
            wrapData = $(that).parent().parent().find(".js-wrapData").html('');
        } else {
            wrapData = $(that).parent().parent().parent().find(".js-wrapData").html('');
        }
        var myData = {
            'id':id,
            "postTime": postTime,
            "content": content,
            "isPublic": isPublic,
            "publishSourcingId": publishSourcingId,
            "sourcingRequestAdditionalAttachmentPublishList": files
        };
        var callback = function (result) {
            var data = result.data;
            if (result.statusCode=="2000000") {
                if (btn == 'saveBtn') {
                    ctrl.publicInfo();
                } else {
                    ctrl.updateMainStatus();
                }
            }
        };
        inquiryModel.updateAdditionalPublish(myData, callback);
    };

    ctrl.updateMainStatus = function () {
        var callback = function (result) {
            if (result.statusCode="2000000") {
                var content = ctrl.view.el.find(".js-tabContent-public");
                var overStatus = result.data.overStatus;
                var temp = '';
                if (overStatus == '0') {
                    temp = '未公开';
                } else if (overStatus == '1') {
                    temp = '部分公开';
                } else if (overStatus == '2') {
                    temp = '已公开';
                }
                content.find('.js-overStatus').html(temp);
            }
        };

        inquiryModel.getSrPublishDetailById(_para["sourcingRequestId"], callback);
    };

    ctrl.uploadBeforeSend = function (that, data) {
        var a = '<div class="wrapUpload loading" style="display: block"><img src="images/loading.gif" class="poa" style="top:1px;"><span class="accessory col66 ml30 myFileLoading" style="background-color: white;padding: 0px 10px 0px 22px">' + data.name + '</span><span class="redFont cancel" style="right: auto;top:2px;background-color: white;"><img src="images/delete.jpg"></span></div>';
        $(that.wrapData).append(a);
    };

    ctrl.uploadSuccess = function (result, wrap) {
        var showUpload = wrap.parent().parent().parent().parent().parent().find(".showUpload");
        var addInfoSave = wrap.parent().parent().parent().parent().parent().find(".js-addInfoSave");
        var input = wrap.parent().parent().parent().parent().parent().find("input[type=file]");
        if (wrap.length >= 10) {
            showUpload.hide();
        } else {
            showUpload.show();
            var temp = addInfoSave.css('margin-top');
            if (temp) {
                temp = temp.slice(0, temp.length - 2);
                var height = temp - 0 + 30;
                addInfoSave.css({'margin-top': height + 'px'});
            }
        }
        if (input.attr('disabled') == 'disabled') {
            showUpload.hide();
        }
    };


    ctrl.cancel = function (wrap) {
        var showUpload = wrap.parent().parent().parent().parent().parent().find(".showUpload");
        var addInfoSave = wrap.parent().parent().parent().parent().parent().find(".js-addInfoSave");
        if (wrap.length >= 10) {

        } else {
            var temp = addInfoSave.css('margin-top');
            if (temp) {
                temp = temp.slice(0, temp.length - 2);
                var height = temp - 30;
                addInfoSave.css({'margin-top': height + 'px'});
            }
        }
        showUpload.show();
    };

    ctrl.initIframeHeight = function (height, iframe){
        var userAgent = navigator.userAgent;
        var subdoc = iframe.contentDocument || iframe.contentWindow.document;
        var subbody = subdoc.body;
        var realHeight = 50;
        if(userAgent.indexOf("Chrome") > -1){
            var content = $(subdoc.documentElement).find("body").children();
            $(subdoc.documentElement).find("body").css({'overflow': 'hidden'});
            if (content) {
                for (var i = 0, len = content.length; i < len; i++) {
                    var tagName = $(content[i]).get(0).tagName.toLowerCase();;
                    if (tagName != 'link' && tagName != 'style') {
                        realHeight += $(content[i]).height();
                    }
                }
            }
        }
        else{
            realHeight = subbody.scrollHeight;
        }
        if(realHeight < height){
            $(iframe).height(height);
        }
        else{
            $(iframe).height(realHeight);
        }
    }

    ctrl.publicInfo = function () {
        var callback = function (result) {
            if (result.statusCode="2000000") {
                ctrl.publicInfoTabInit(result.data);
            }
        };

        inquiryModel.getSrPublishDetailById(_para["sourcingRequestId"], callback);
        //inquiryModel.getSrPublishDetailById('17080105231365120', callback);
    };
    return ctrl;

});
