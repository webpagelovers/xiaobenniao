X.define('modules.request.buyRequest', ["model.productsModel", "modules.common.global", "modules.user.login", "modules.user.regist", "adapter.searchValidate","modules.common.multipleFiles","modules.common.checkIsIE"], function (productsModel, global, login, regist, searchValidate,multipleFiles,checkIsIE) {

    var view = X.view.newOne({
        el: $('.js-content'),
        url: X.config.request.tpl.buyRequest,
        res: X.config.request.res.buyRequest
    });

    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.view.render(function () {

        $(document).attr("title", "Find Quality China Wholesale Product Suppliers : Weintrade.com");

        ctrl.registForm = view.el.find("form");
        var meta = {
            "productImage": {
                size: 2, type: 13, single: true, accept: {
                    extensions: 'jpg,jpeg,png,gif',
                    mimeTypes: 'image/png,image/jpg,image/jpeg,image/gif'
                }, filePicker: ".filePicker", filePickerLabel: "Attachment"
            }
        };
        ctrl.viewModel = ctrl.getViewModel(ctrl.registForm, {meta: meta});
        ctrl.viewModel.initControl();

        ctrl.validate = {
            rules: {
                productName: {required: true, nonChinese: true},
                keyword: {nonChinese: true},
                keyword1: {nonChinese: true},
                keyword2: {nonChinese: true},
                quantity: {required: true, isDigits: true},
                unit: {required: true, nonChinese: true},
                description: {required: true, nonChinese: true}
            },
            messages: {
                productName: {
                    required: "Please enter the product name",
                    nonChinese: "Please enter English only"
                },
                keyword: {
                    nonChinese: "Please enter English only"
                },
                keyword1: {
                    nonChinese: "Please enter English only"
                },
                keyword2: {
                    nonChinese: "Please enter English only"
                },
                quantity: {
                    required: $.i18n.prop('buyingRequest_quantityRe'),
                    isDigits: "Please enter number only"
                },
                unit: {
                    required: $.i18n.prop('buyingRequest_unitRe'),
                    nonChinese: "Please enter English only"
                },
                description: {
                    required: "Please enter the detailed description",
                    nonChinese: "Please enter English only"
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
        };
        ctrl.view.el.find("form").validate(ctrl.validate);

        view.el.find(".js-home").attr("href",X.config.common.link.home);
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
            ctrl.view.el.find('#buyingRequestDescriptionInfo').html("You can also continue to enter" + ' <span class="redFont">' + count + '</span> ' + "characters");
        });

        //搜索栏添加enter事件
        ctrl.view.el.find(".js-serarchKeyword").keyup(function(e) {
            if(e && e.keyCode==13){
                ctrl.getSearchList()
            }
        });

    });

    ctrl.submitInfo = function () {
        if (ctrl.view.el.find("form").valid()) {
            var data = ctrl.viewModel.collectData();
            if(data.productImage == "images/resPhoto.png"){
                data.productImage = "";
            }
            data.keyword = data.keyword + ',' + data.keyword1 + ',' + data.keyword2;
            delete data.keyword1;
            delete data.keyword2;

            var array = data.keyword.split(',');
            var cacheArray = [];
            $.each(array, function(i,item){
                if(item){
                    cacheArray.push(item);
                }
            });
            cacheArray.length > 0 ? data.keyword = cacheArray.join(",") : delete data.keyword;

            productsModel.postBuyingRequest(data, function (res) {
                if (res.statusCode == X.constructor.prototype.CONSTANT.statusCode.SUCCESS) {
                    //防止多次提交
                    view.el.find(".js-submit").attr("disabled","disabled");
                    view.el.find(".js-title").addClass('displayNone');
                    view.el.find(".js-form").addClass('displayNone');
                    view.el.find(".js-success").removeClass('displayNone');
                    view.el.find(".js-href").attr("href",X.constructor.prototype.config.PATH_FILE.path.root);

                    var timer = setTimeout(function(){
                        clearTimeout(timer);
                        window.location.href = X.constructor.prototype.config.PATH_FILE.path.root;
                    },5000)

                } else if (res.statusCode == X.constructor.prototype.CONSTANT.statusCode.NOLOGIN) {
                    regist.showView();
                }
            })
        }
    };

    ctrl.getSearchList = function(){
        var key = ctrl.view.el.find(".js-serarchKeyword").val();
        searchValidate.keyValidate(key);

    };

    ctrl.addEvent("click", ".js-serarch", "getSearchList");

    ctrl.addEvent("click", ".js-submit", "submitInfo");

    X.subscribe(X.CONSTANT.channel.loginSuccess, function(channelName, data) {
        login.hideView();
    });

    X.subscribe(X.CONSTANT.channel.registSuccess, function(channelName, data) {
        regist.hideView();
    });
    multipleFiles.introduceFiles(X.config.common.res.common,function(){
        checkIsIE.checkIsIE();
    });

    return ctrl
});


