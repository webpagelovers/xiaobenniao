X.define("modules.customerClearance.addDeclareProduct", ["adapter.webuploader", "model.declareProductModel", "common.layer", "adapter.jqthumb", "model.menuModel"], function (webuploader, declareProductModel, layer, jqthumb, menuModel) {
    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.customerClearance.tpl.addDeclareProduct
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {

        //渲染页面
        var addDeclareProductFunction = function (data) {
            return view.render(data, function () {

                //全部删除上传文件
                var deleteAll = function (elem) {
                    var allCancelButton = elem.find(".js-allCancel");
                    if (allCancelButton) {
                        allCancelButton.click(function () {
                            elem.find(".js-wrapUploadData > .wrapUpload > .cancel").click();
                        })
                    }
                };

                deleteAll(ctrl.view.el.find(".js-declareAttachment"));
                deleteAll(ctrl.view.el.find(".js-productAppearancePic"));
                deleteAll(ctrl.view.el.find(".js-productVipassanaPic"));
                deleteAll(ctrl.view.el.find(".js-productModelPic"));
                deleteAll(ctrl.view.el.find(".js-declareOther"));

                //设置缩略图
                var uploadSuccess = function (result, elem) {
                    elem.find('img').jqthumb(
                        {
                            width: 100,
                            height: 100,
                            after: function (imgObj) {
                                imgObj.click(function (e) {
                                    e.stopPropagation();
                                    var imgUrl = $(e.target).parent().next().attr("src");
                                    var content = "<img src='" + imgUrl + "' />";
                                    var opt = {
                                        shadeClose: true,
                                        content: content,
                                        callback:function(){
                                            $(".layui-layer-content").bind("click",function(){
                                                layer.closeAll();
                                            })
                                        }
                                    };
                                    layer.layerOpen(opt);
                                });

                            }
                        }
                    );
                };

                //产品信息
                ctrl.vmaddDeclareProduct = ctrl.getViewModel(ctrl.view.el.find(".js-addDeclareProduct"), {data: data});
                ctrl.vmaddDeclareProduct.initControl();

                //历史报关单
                ctrl.vmdeclareAttachment = ctrl.getViewModel(ctrl.view.el.find(".js-declareAttachment"), {
                    meta: {
                        "productCustomsAttachment": {
                            singleSize: 2,
                            type: 8,
                            attachmentType: 0,
                            maxNum: 1,
                            cancel: true,
                            accept: {extensions: 'doc,docx,pdf,jpg,jpeg,png'},
                            downloadType: 5,
                            uploadSuccess: uploadSuccess,
                            setValue: uploadSuccess,
                            filePicker: ".filePicker1",
                            filePickerLabel: "上传附件",
                            getValue: function () {
                                var value = ctrl.view.el.find(".js-declareAttachment").find(".js-wrapUploadData");
                                var arr = [];
                                if (value.html()) {
                                    var declareAttachmentOptions = ctrl.vmdeclareAttachment.getControls("Upload").productCustomsAttachment;

                                    function getArgStr(value) {
                                        var argStr = '';
                                        argStr = value.split('&')[1].split('=')[1];
                                        return argStr;
                                    }

                                    $.each(value, function (i, item) {
                                        if ($(this).find("img").length) {
                                            arr.push({
                                                attachmentType: declareAttachmentOptions.options.attachmentType,
                                                filePath: $(this).find("img").attr("src"),
                                                filename: $(this).find("p").text()
                                            });
                                        } else {
                                            arr.push({
                                                attachmentType: declareAttachmentOptions.options.attachmentType,
                                                filePath: getArgStr($(this).find("a").attr("href")),
                                                filename: $(this).find("a").text()
                                            });
                                        }
                                    });
                                }
                                return arr;
                            }
                        }
                    }, data: data
                });
                ctrl.vmdeclareAttachment.initControl();

                //产品（含配件）整体外观图
                ctrl.vmproductAppearancePic = ctrl.getViewModel(ctrl.view.el.find(".js-productAppearancePic"), {
                    meta: {
                        "productWholeAttachment": {
                            singleSize: 2,
                            type: 9,
                            attachmentType: 1,
                            maxNum: 5,
                            cancel: true,
                            uploadSuccess: uploadSuccess,
                            setValue: uploadSuccess,
                            filePicker: ".filePicker2",
                            filePickerLabel: "上传附件"
                        }
                    }, data: data
                });
                ctrl.vmproductAppearancePic.initControl();

                //产品内包装图（分别体现不同面）
                ctrl.vmproductVipassanaPic = ctrl.getViewModel(ctrl.view.el.find(".js-productVipassanaPic"), {
                    meta: {
                        "productInsideAttachment": {
                            singleSize: 2,
                            type: 11,
                            attachmentType: 3,
                            maxNum: 5,
                            cancel: true,
                            uploadSuccess: uploadSuccess,
                            setValue: uploadSuccess,
                            filePicker: ".filePicker3",
                            filePickerLabel: "上传附件"
                        }
                    }, data: data
                });
                ctrl.vmproductVipassanaPic.initControl();

                //品牌/型号确认图
                ctrl.vmproductModelPic = ctrl.getViewModel(ctrl.view.el.find(".js-productModelPic"), {
                    meta: {
                        "productModelAttachment": {
                            singleSize: 2,
                            type: 10,
                            attachmentType: 2,
                            maxNum: 5,
                            cancel: true,
                            uploadSuccess: uploadSuccess,
                            setValue: uploadSuccess,
                            filePicker: ".filePicker4",
                            filePickerLabel: "上传附件"
                        }
                    }, data: data
                });
                ctrl.vmproductModelPic.initControl();

                //其他（可选，如历史报关单、产品说明书、质保证书）
                ctrl.vmdeclareOtherList = ctrl.getViewModel(ctrl.view.el.find(".js-declareOther"), {
                    meta: {
                        "productOtherAttachment": {
                            singleSize: 2,
                            type: 12,
                            attachmentType: 4,
                            maxNum: 5,
                            cancel: true,
                            uploadSuccess: uploadSuccess,
                            setValue: uploadSuccess,
                            filePicker: ".filePicker5",
                            filePickerLabel: "上传附件"
                        }
                    }, data: data
                });
                ctrl.vmdeclareOtherList.initControl();


                //产品信息表单验证
                ctrl.validate = {
                    rules: {
                        nameCn: {
                            required: true,
                            rangelength: [2, 20],
                            //isProductName: true
                        },
                        nameEn: {
                            required: true,
                            isEnglishBackSpace: true,
                            maxlength: 50
                        },
                        hsCode: {
                            required: true,
                            digits: true,
                            isIntGtZero: true,
                            maxlength: 10
                        },
                        brand: {
                            required: true,
                            maxlength: 10
                        },
                        model: {
                            required: true,
                            maxlength: 50
                        },
                        texture: {
                            required: true,
                            maxlength: 10
                        },
                        goodsUsage: {
                            required: true,
                            maxlength: 50
                        }
                    },
                    messages: {
                        nameCn: {
                            required: "请填写产品名称",
                            rangelength: "产品名称在2-20个字符间",
                            //isProductName: "产品名称已存在"
                        },
                        nameEn: {
                            required: "请填写产品英文名称",
                            isEnglishBackSpace: "请填写正确的产品英文名称",
                            maxlength: "产品英文名称在50个字符内"
                        },
                        hsCode: {
                            required: "请输入HSCode",
                            digits: "请填写正确的HSCode",
                            isIntGtZero: "请输入1-10个正整数",
                            maxlength: "HSCode在10个字符内"
                        },
                        brand: {
                            required: "请输入品牌",
                            maxlength: "品牌在10个字符内"
                        },
                        model: {
                            required: "请输入型号",
                            maxlength: "型号在50个字符内"
                        },
                        texture: {
                            required: "请输入材质",
                            maxlength: "材质在10个字符内"
                        },
                        goodsUsage: {
                            required: "请输入用途",
                            maxlength: "用途在50个字符内"
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
                        var errorWrap = element.parent().find(".js-error");
                        errorWrap.html("");
                        error.appendTo(errorWrap);
                    }
                };

                if (_para["productId"]) {
                    ctrl.validate.rules.nameCn.isProductName = false;
                }

                ctrl.view.el.find(".js-addDeclareProduct").validate(ctrl.validate);


                ctrl.addEvent("click", ".js-save", "saveFun");
                ctrl.addEvent("click", ".js-submit", "submitFun");

            });
        };

        if (_para["productId"]) {

            var callback = function (result) {
                var data = result.data[0];
                addDeclareProductFunction(data);
            };
            //编辑报关产品
            ctrl.getDeclareProduct(callback);
        } else {
            //创建报关产品
            addDeclareProductFunction({});
        }

    };

    ctrl.getDeclareProduct = function (callback) {
        var data = {
            productId: _para["productId"]
        };
        declareProductModel.getDeclareProduct(data, callback);
    };


    ctrl.saveFun = function () {
        if (ctrl.errorLength() && ctrl.view.el.find(".js-addDeclareProduct").valid()) {
            ctrl.submitMethod(0);
        }
    };

    ctrl.submitFun = function () {
        if (ctrl.errorLength() && ctrl.view.el.find(".js-addDeclareProduct").valid()) {
            ctrl.submitMethod(1);
        }
    };


    ctrl.submitData = function () {
        var data = ctrl.vmaddDeclareProduct.collectData();
        data.productCustomsAttachment = ctrl.vmdeclareAttachment.collectData().productCustomsAttachment;
        data.productWholeAttachment = ctrl.vmproductAppearancePic.collectData().productWholeAttachment;
        data.productInsideAttachment = ctrl.vmproductVipassanaPic.collectData().productInsideAttachment;
        data.productModelAttachment = ctrl.vmproductModelPic.collectData().productModelAttachment;
        data.productOtherAttachment = ctrl.vmdeclareOtherList.collectData().productOtherAttachment;

        return data;
    };

    ctrl.submitMethod = function (status) {
        var statusObj = getObjData(status);

        function getObjData(status) {
            var obj = {};
            if (status == 0) {
                obj = {
                    m: "customerClearance.declareProductList",
                    font: "保存成功",
                    status: status
                };
            } else if (status == 1) {
                obj = {
                    m: "customerClearance.declareProductList",
                    font: "提交成功",
                    status: status
                };
            }
            return obj;
        }

        var data = ctrl.submitData();
        data.status = statusObj.status;
        var callback = function () {
            var submitCallback = function (index) {
                layer.closeIt(index);
                setTimeout(function () {
                    if(_para.fromCredit){
                        close();
                        document.cookie = _para.fromCredit + '='+ data.nameCn;
                    }else if(_para.from=="Clearance"){
                        close();
                    }
                    else {
                        X.router.back();
                    }

                }, 600);
            };
            layer.successBtn(statusObj.font, "提示", submitCallback);
        };

        if (_para["productId"]) {

            data.productId = _para["productId"];
            //编辑报关产品提交
            declareProductModel.changeDeclareProduct(data, callback)
        } else {
            //创建报关产品提交
            declareProductModel.addDeclareProduct(data, callback)
        }

    };

    //判断是否有错误提示
    ctrl.errorLength = function () {
        var wrapError = $(".js-errorLength").find(".js-error");
        var wrapErrorHtml;
        var array = [];
        $.each(wrapError, function () {
            wrapErrorHtml = $(this).html();
            if (wrapErrorHtml == "") {
                array.push(true);
            } else {
                array.push(false);
            }
        });
        if ($.inArray(false, array) == -1) {
            return true;
        } else {
            return false;
        }
    };


    var _para;
    ctrl.load = function (para) {
        para = para || {};
        _para = para;
        ctrl.rendering();
    };

    return ctrl;
});
