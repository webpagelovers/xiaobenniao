X.define("modules.customerClearance.declareProductDetail", ["model.declareProductModel", "adapter.jqthumb", "common.layer"], function (declareProductModel, jqthumb, layer) {
    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.customerClearance.tpl.declareProductDetail
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {

        var callback = function (result) {
            var data = result.attributes;
            return view.render(data, function () {

                ctrl.vm = ctrl.getViewModel(ctrl.view.el.find(".js-declareProductDetail"));
                ctrl.vm.initControl();

                var declareProductDetail = ctrl.view.el.find(".js-declareProductDetail");
                //历史报关单
                ctrl.setUploadDataFun(data.productCustomsAttachment, declareProductDetail.find(".js-declareAttachment"), 5);

                //产品（含配件）整体外观图
                ctrl.setUploadDataFun(data.productWholeAttachment, declareProductDetail.find(".js-productAppearancePic"));

                //产品内包装图（分别体现不同面）
                ctrl.setUploadDataFun(data.productInsideAttachment, declareProductDetail.find(".js-productVipassanaPic"));

                //品牌/型号确认图
                ctrl.setUploadDataFun(data.productModelAttachment, declareProductDetail.find(".js-productModelPic"));

                //其他
                ctrl.setUploadDataFun(data.productOtherAttachment, declareProductDetail.find(".js-declareOther"));

                ctrl.view.el.find(".js-declareProductDetail").find('img').jqthumb(
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

                ctrl.addProgress(data);

                view.el.find(".js-additionalContent").validate(ctrl.validate);

                var para = X.getRequest();
                if (para && para["status"]) {
                    var status = Number(para["status"]);
                    //控制补充说明的显示隐藏
                    if (status != 3) {
                        view.el.find(".js-instructions").remove();
                        view.el.find(".js-save").remove();
                        view.el.find(".js-submit").remove();
                    }
                    //驳回原因
                    if (Number(data.status) != 4) {
                        view.el.find(".js-rejectionCon").remove();
                    }
                    //状态为3的时候，没有保存草稿按钮
                    if(status == 3){
                        view.el.find(".js-bcsm").remove();
                        view.el.find(".js-save").remove();
                    }else{
                        if(data.additionalContent == ""){
                            view.el.find(".js-bcsm").remove();
                        }
                    }
                }

            });
        };

        ctrl.getData(callback);

        ctrl.addEvent("click", ".js-save", "saveFun");
        ctrl.addEvent("click", ".js-submit", "submitFun");
    };

    ctrl.setUploadDataFun = function (arr, elem, downloadType) {
        var wrap = elem.find(".js-wrapUploadData");
        if (arr) {
            var uploadUrl = X.config.PATH_FILE.path.rootUploadUrl;
            $.each(arr, function (i, item) {
                var uploadSuccessInfo;

                if (arr[i].url) {
                    uploadSuccessInfo = '<div class="wrapUpload disib"><img src="' + arr[i].url + '"/><p class="mt5 contract-word-cut">' + arr[i].filename + '</p></div>';
                } else if (arr[i].filePath) {
                    uploadSuccessInfo = '<div class="wrapUpload">' +
                        '<a href="' + uploadUrl + '?fileType=' + downloadType + '&filePath=' + arr[i].filePath + '&fileName=' + arr[i].filename + '" class="accessory orange-font">' + arr[i].filename + '</a></div>';
                }

                $(wrap).append(uploadSuccessInfo);

            });
        }
    };

    //获取报关产品信息
    ctrl.getData = function (callback) {
        declareProductModel.find({data: {"productId": _para["productId"]}, callback: callback});
    };

    //保存功能
    ctrl.saveFun = function () {
        ctrl.additionalVm = ctrl.getViewModel(ctrl.view.el.find(".js-additionalContent"));
        ctrl.additionalVm.initControl();

        var data = ctrl.additionalVm.collectData();
        var para = X.getRequest();
        if (para && para["productId"] && para["status"]) {
            data.productId = para["productId"];
            data.status = para["status"];

            if (view.el.find(".js-additionalContent").valid()) {
                declareProductModel.additional(data, function (result) {
                    ctrl.submitMethod(0);
                })
            }
        }
    };
    //提交功能
    ctrl.submitFun = function () {
        ctrl.additionalVm = ctrl.getViewModel(ctrl.view.el.find(".js-additionalContent"));
        ctrl.additionalVm.initControl();

        var data = ctrl.additionalVm.collectData();
        var para = X.getRequest();
        if (para && para["productId"] && para["status"]) {
            data.productId = para["productId"];
            data.status = para["status"];

            if(data.status == 3){
                data.status = 1;
            }

            if (view.el.find(".js-additionalContent").valid()) {
                declareProductModel.additional(data, function (result) {
                    ctrl.submitMethod(1);
                })
            }
        }
    };

    //添加进度条
    ctrl.addProgress = function (data) {
        var para = X.getRequest();
        if (para && para["status"]) {
            var status = Number(para["status"]);
            //进度条 //0-已取消//1-待审核||2-待订舱||3-待报关||4-待结汇||5-待退税||6-已完成
            X.controls.getControl("ProgressBar", view.el.find(".progress-wrap"), getProgressData(status));

            function getProgressData(status) {
                var obj = {};

                if(status == 2 && data.additionalContent != "" && data.additionalRequirement != ""){
                    status = 8;
                }
                switch (status) {
                    case 3:
                        obj = {
                            progressContent: ["1", "2", "3", "4"],
                            progressContentInfo: ["提交审核", "审核中", "资料待完善", "审核通过"],
                            allSteps: 4,
                            nowStep: 3
                        };
                        break;
                    case 4:
                        obj = {
                            progressContent: ["1", "2", "3"],
                            progressContentInfo: ["提交审核", "审核中", "审核拒绝"],
                            allSteps: 3,
                            nowStep: 3
                        };
                        break;
                    case 2:
                        obj = {
                            progressContent: ["1", "2", "3"],
                            progressContentInfo: ["提交审核", "审核中", "审核通过"],
                            allSteps: 3,
                            nowStep: 3
                        };
                        break;
                    case 8://二次通过
                        obj = {
                            progressContent: ["1", "2", "3", "4"],
                            progressContentInfo: ["提交审核", "审核中", "资料完善", "审核通过"],
                            allSteps: 4,
                            nowStep: 4
                        };
                        break;
                    case 1:
                        obj = {
                            progressContent: ["1", "2", "3"],
                            progressContentInfo: ["提交审核", "审核中", "审核通过"],
                            allSteps: 3,
                            nowStep: 2
                        };
                        break;
                    case 5:
                        obj = {
                            progressContent: ["1", "2", "3"],
                            progressContentInfo: ["提交审核", "审核中", "审核通过"],
                            allSteps: 3,
                            nowStep: 3
                        };
                        break;
                }
                return obj;
            }
        }
    };
    //校验补充说明
    ctrl.validate = {
        rules: {
            additionalContent: {
                required: true,
                rangelength: [10, 50]
            }
        },
        messages: {
            additionalContent: {
                required: "请输入补充的资料说明",
                rangelength: "补充说明在10-50个字符间"
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
    //提交路径
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

        var submitCallback = function (index) {
            layer.closeIt(index);
            setTimeout(function () {
                X.router.back();
            }, 600)
        };
        layer.successBtn(statusObj.font, "提示", submitCallback);
    };

    var _para;
    ctrl.load = function (para) {
        para = para || {};
        _para = para;
        ctrl.rendering();
    };

    return ctrl;
});
