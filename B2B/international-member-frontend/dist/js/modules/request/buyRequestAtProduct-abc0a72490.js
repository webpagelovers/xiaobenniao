X.define('modules.request.buyRequestAtProduct', ["modules.common.global", "modules.common.config", "model.productsModel", "modules.user.login", "modules.user.regist","modules.common.checkIsIE", "adapter.webuploader"], function (global, config, productsModel, login, regist,checkIsIE, webuploader) {

    var view = X.view.newOne({
        el: $('.js-atProduct'),
        url: X.config.request.tpl.buyRequestAtProduct,
        res: X.config.request.res.buyRequestAtProduct
    });

    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.view.render(function () {
        var buyProductId = getParam("productId");
        var data = {
            productId : buyProductId
        };
        if (buyProductId) {
            productsModel.getProductDetail(data, function (result) {
                data = result.data[0];
                json = JSON.parse(data.description);
                var s = "";
                for(var i in json){
                    s += i + ':' + json[i] + '\n';
                }
                data.description = s;
                var meta = {
                    "productImage": {
                        size: 2,
                        type: 13,
                        single: true,
                        accept: {
                            extensions: 'jpg,jpeg,png,gif',
                            mimeTypes: 'image/png,image/jpg,image/jpeg,image/gif'
                        },
                        filePicker: ".filePicker",
                        filePickerLabel: $.i18n.prop('buyingRequestAtProdct_upload'),
                        Q_EXCEED_SIZE_LIMIT: $.i18n.prop('buyingRequestAtProduct_file_limit_2M')
                    }
                };

                if (data.imgs[0]) {
                    ctrl.view.el.find(".js-imgs").attr("src", data.imgs[0]);
                }
                ctrl.viewModel = ctrl.getViewModel(view.el, {meta: meta, data: data});
                ctrl.viewModel.initControl();
                ctrl.init(data);

                checkIsIE.checkIsIE();
            })
        }
        //校验
        view.el.find(".js-buyRequestAtProduct-form").validate({
            rules: {
                productTitle: {required: true, nonChinese: true, rangelength: [1, 250]},
                quantity: {required: true, isDigits: true, rangelength: [1, 19]},
                unit: {required: true, nonChinese: true, rangelength: [1, 19]},
                description: {required: true, rangelength: [1, 1500], nonChinese: true},
                productImage: {required: true}
            },
            messages: {
                productTitle: {
                    required: $.i18n.prop('buyingRequestAtProduct_prodName'),
                    nonChinese: $.i18n.prop('buyingRequestAtProduct_onlyEnglish'),
                    rangelength: $.i18n.prop('buyingRequestAtProdct_max_length_250')
                },
                quantity: {
                    required: $.i18n.prop('buyingRequestAtProduct_quantity_require'),
                    rangelength: $.i18n.prop('buyingRequestAtProdct_max_length_20'),
                    isDigits: $.i18n.prop('buyingRequestAtProduct_onlyNumber')
                },
                unit: {
                    required: $.i18n.prop('buyingRequestAtProduct_unit_require'),
                    nonChinese: $.i18n.prop('buyingRequestAtProduct_onlyEnglish'),
                    rangelength: $.i18n.prop('buyingRequestAtProdct_max_length_20'),
                    isDigits: $.i18n.prop('buyingRequestAtProduct_onlyNumber')
                },
                description: {
                    required: $.i18n.prop('buyingRequestAtProduct_description'),
                    rangelength: $.i18n.prop('buyingRequestAtProdct_max_length_1500'),
                    nonChinese: $.i18n.prop('buyingRequestAtProduct_onlyEnglish')
                },
                productImage: {
                    required: $.i18n.prop('buyingRequestAtProduct_productImage')
                }
            },
            onkeyup: false,
            onfocusout: function (element) {
                var elem = $(element);
                elem.valid();
            },
            errorPlacement: function (error, element) {
                var errorWrap = element.parent().find(".js-error");
                errorWrap.html("");
                error.appendTo(errorWrap);
            }
        });
        ctrl.view.el.find(".js-description").keydown(function(e) {
            var contactUsContent =  ctrl.view.el.find(".js-description").val();
            var len = contactUsContent.length;
            var isChrome = $.browser["chrome"] === true;
            var brLen;
            if (contactUsContent.match(/[\n]/g)) {
                brLen = contactUsContent.match(/[\n]/g).length;
            }
            var count;
            if (brLen && isChrome) {
                count = (1500 - len - brLen);
            } else {
                count = (1500 - len);
            }
            if (count < 0) {
                count = 0;
            }
            if (count <= 0 && e.keyCode !== 8 && e.keyCode !== 37 && e.keyCode !== 38 &&
                e.keyCode !== 39 && e.keyCode !== 40 && e.keyCode !== 46) {
                event.returnValue = false;
            }
        });

        ctrl.view.el.find(".js-description").keyup(function(data) {
            var contactUsContent =  ctrl.view.el.find(".js-description").val();
            var len = contactUsContent.length;
            var isChrome = $.browser["chrome"] === true;
            var brLen;
            if (contactUsContent.match(/[\n]/g)) {
                brLen = contactUsContent.match(/[\n]/g).length;
            }
            var count;
            if (brLen && isChrome) {
                count = (1500 - len - brLen);
            } else {
                count = (1500 - len);
            }
            if (count < 0) {
                count = 0;
            }
            view.el.find(".js-remain").html(count);
        });
    });

    ctrl.init = function (result) {
        $(document).attr("title", $.i18n.prop('buyingRequestAtProduct_title'));
        ctrl.keyword = result.category;
        view.el.find(".webuploader-pick").empty();
        view.el.find(".js-remain").html(1500 - result.description.length);
        img = X.config.PATH_FILE.path.rootImgDisplayUrl + result.imgs[0];
        view.el.find(".js-imgs").attr("src", img);
    };
    function getParam(paramName) {
        var url = window.location.href;
        var id = url.substring(url.lastIndexOf("/")+1).replace(".html","");
        return id;
    }
    ctrl.submit = function () {
        var data = ctrl.viewModel.collectData();
        data.productId = getParam("productId");
        data.productName = data.productTitle;
        data.keyword = ctrl.keyword;

        var imageName = data.productImage.split('/')[data.productImage.split('/').length-1];
        if(imageName == "transparent.png"){
            data.productImage = "";
        }
        if (view.el.find(".js-imgs").attr("src")) {
            data.productImageDefault = view.el.find(".js-imgs").attr("src");
        }
        if (data.productImageDefault == "" && data.productImage == "") {
            var disc = $.i18n.prop('buyingRequestAtProduct_description');
            view.el.find(".js-productImage-err").html(disc);
            return false;
        } else {
            view.el.find(".js-productImage-err").html("");
        }

        if(data.productImageDefault == ""){
            data.originalImage = 1;
        }else{
            data.originalImage = 0;
        }

        delete data.productTitle;
        delete data.productImageDefault;

        if (view.el.find(".js-buyRequestAtProduct-form").valid()) {
            productsModel.postBuyingRequest(data, function (res) {
                if (res.statusCode == X.constructor.prototype.CONSTANT.statusCode.SUCCESS) {
                    view.el.find(".js-submit").attr("disabled","disabled");
                    window.open(X.config.common.link.submitSuccessfully, "_self");
                } else if (res.statusCode == X.constructor.prototype.CONSTANT.statusCode.NOLOGIN) {
                    regist.showView();
                }
            });
        }
    };

    ctrl.deleteImg = function (a, v) {
        $('.request-img-delete').remove()
    };

    ctrl.addEvent("click", ".js-submit", "submit");
    ctrl.addEvent("click", ".request-img-delete-icon", "deleteImg");

    X.subscribe(X.CONSTANT.channel.loginSuccess, function(channelName, data) {
        login.hideView();
    });

    X.subscribe(X.CONSTANT.channel.registSuccess, function(channelName, data) {
        regist.hideView();
    });

    return ctrl
});

