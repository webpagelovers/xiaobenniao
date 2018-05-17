X.define("modules.accountSettings.companyInfo",["data.addressData","adapter.webuploader","model.companyModel","adapter.jqthumb","common.layer"],function (address,webuploader,companyModel,jqthumb,layers) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.accountSettings.tpl.companyInfo
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    var option = {
        meta : {
            "companyAddress": {
                dataSource : address,
                provinceSelectedChanged: function() {
                    this.elem.parent().find('[name=companyAddressProvince]').val(arguments[0].key).valid()
                    $('[name=companyAddressCity]' ,view.el).val('')
                    $('[name=companyAddressDistrict]' ,view.el).val('')
                },
                citySelectedChanged: function() {
                    this.elem.parent().find('[name=companyAddressCity]').val(arguments[0].key).valid()
                    $('[name=companyAddressDistrict]' ,view.el).val('')
                },
                districtSelectedChanged: function() {
                    this.elem.parent().find('[name=companyAddressDistrict]').val(arguments[0].key).valid()
                }
            }
        }
    };

    ctrl.getAddress = function(data){
        data.provinceName = address.getPro(data.companyAddress.province);
        data.cityName = address.getCity(data.companyAddress.city);
        data.districtName = address.getDistrict(data.companyAddress.district)
    };
    //实时保存
    ctrl.companySave = function(){
        var baseInfo = ctrl.getCompanyBaseInfo();
        var str = JSON.stringify(baseInfo);
        var getStr = sessionStorage.baseInfo;
        if (baseInfo){
            if (getStr){
                if (JSON.stringify(baseInfo) != getStr ){
                    companyModel.companyInfoSave(baseInfo);
                    sessionStorage.baseInfo = str;
                }
            }else{
                companyModel.companyInfoSave(baseInfo);
                sessionStorage.baseInfo = str;
            }
        }


    };
    ctrl.judgeStatus = function(data){
        var timer = setInterval(ctrl.companySave,20000);
        if(data.status == companyModel.CONSTANT.status.EDITING.key){//编辑中
            ctrl.view.find(".js-complete").show();
            ctrl.view.find(".js-companyEdit").show();
            ctrl.initBase(data);
        }else if(data.status == companyModel.CONSTANT.status.NOAUDIT.key){// 未审核
            ctrl.view.find(".js-noaudit").show();
            ctrl.displayFile(data);
            window.clearInterval(timer)
        }else if (data.status == companyModel.CONSTANT.status.APPROVED.key){//通过
            ctrl.view.find(".js-approved").show();
            ctrl.displayFile(data);
            window.clearInterval(timer)
        }else {
            ctrl.view.find(".js-rejected").show();
            ctrl.view.find(".js-companyEdit").show();
            ctrl.initBase(data);
        }
    };
    ctrl.displayFile = function(data){
        ctrl.view.renderIn(".js-companyBase-tpl",".js-companyBase",data,
            ctrl.getAddress(data)
        );
        ctrl.setUploadDataFun = function(arr,elem){
            var wrap = elem.find(".js-wrapUploadData");
            if(arr){
                $.each(arr,function(i,item){
                    var uploadSuccessInfo;
                    if(arr[i].url){
                        uploadSuccessInfo = '<div class="wrapUpload disib"><img src="'+arr[i].url+'"/><p class="mt10 tac contract-word-cut">'+arr[i].filename+'</p></div>';
                    }
                    $(wrap).append(uploadSuccessInfo);

                });
            }
        };
        ctrl.setUploadDataFun(ctrl.echoImgThumb(data.businessLicense,true),ctrl.view.find(".js-zerotypes"));
        ctrl.setUploadDataFun(ctrl.echoImgThumb(data.organizationCode,true),ctrl.view.find(".js-onetypes"));
        ctrl.setUploadDataFun(ctrl.echoImgThumb(data.taxRegistrationCertificate,true),ctrl.view.find(".js-twotypes"));
        ctrl.setUploadDataFun(ctrl.echoImgThumb(data.companyBusinessLicense,true),ctrl.view.find(".js-threetypes"));
        ctrl.setUploadDataFun(ctrl.echoImgThumb(data.socialUnityCreditCode,true),ctrl.view.find(".js-fourtypes"));
        ctrl.setUploadDataFun(ctrl.echoOtherImgThumb(data.othersLicense,true),ctrl.view.find(".js-othertypes"));
        ctrl.setUploadDataFun(ctrl.echoImgThumb(data.licenseFiveCardShowInfo,true),ctrl.view.find(".js-fivetypes"));
        ctrl.view.el.find(".js-companyBase").find('img').jqthumb(
            {
                width: 100,
                height: 100,
                after: function(imgObj){
                    imgObj.click(function(e){
                        e.stopPropagation();
                        var imgUrl = $(e.target).parent().next().attr("src");
                        var content = "<img src='"+imgUrl +"' />";
                        var opt = {
                            shadeClose:true,
                            content:content,
                            closeBtn:1,
                            callback:function(){
                                $(".layui-layer-content").click(function(){
                                    layer.closeAll();
                                })
                            }
                        };
                        layers.layerOpen(opt);
                    });
                },

            }
        );
    };
    ctrl.echoImgThumb = function(item,para){
        if (item){
            if (item.imageUrl.url){
                var imgurls=[];
                imgurls.push(item.imageUrl);
                item.imageUrl = imgurls;
                item.imgurls = item.imageUrl;
                delete item.imageUrl;
                if(para == true ){//判断是否是缩略图
                    return item.imgurls
                }else{
                    return item
                }
            }else{
                delete item.imageUrl;
                return item
            }
        }else {
            return {}
        }
    };

    ctrl.echoOtherImgThumb = function(item,para){
        var imgurls = [];
        if(item){
            for (var i in item){
                imgurls.push(item[i].imageUrl);
                item.imgurls = imgurls;
                delete item[i]
            }
            var data = $.extend( false, {},item);
            if (para == true){
                return data.imgurls
            }else{
                return data
            }
        }else {
            return {}
        }

    };
    //附件不能为空
    var fileError = function(postion){
        var wrapAttachError = ctrl.view.el.find(postion).find(".js-attachError");
        if(!wrapAttachError.html()){
            var error = '<label class="error">附件不能为空</label>';
            $(error).appendTo(wrapAttachError);
        }
    };
    ctrl.valiFile = function(options,goal){
        if(options.getValue("imgurls").imgurls.length){
            return true
        }else {
            fileError(goal);
        }
    };
    ctrl.publicMethod = function (callback){
        var companyView = ctrl.view;
        var radioVal =  ctrl.view.find(".js-chooseCardType input[type='radio']:checked").val();
            if(radioVal == companyModel.CONSTANT.cardType.ONETHREE.key ){
                if(ctrl.vmFourtype.getValue("imgurls").imgurls.length){
                    if (companyView.find(".js-companyBaseInfo").valid()
                        && companyView.find(".js-fourtype").valid()) {
                        var data = ctrl.getCompanyBaseInfo();
                        companyModel.companyBaseEdit(data,callback);
                    }
                }else {
                    fileError(".js-fourtype");
                }

            }else if(radioVal == companyModel.CONSTANT.cardType.FIVE.key){
                ctrl.view.find(".js-shuiwu-number").focus();
                if(ctrl.valiFile(ctrl.vmZerotype,".js-zerotype") && ctrl.valiFile(ctrl.vmOnetype,".js-onetype") &&
                                 ctrl.valiFile(ctrl.vmTwotype,".js-twotype")){
                    if (companyView.find(".js-companyBaseInfo").valid()
                        && companyView.find(".js-zerotype").valid()
                        &&companyView.find(".js-onetype").valid()
                        &&companyView.find(".js-twotype").valid() && ctrl.view.find(".js-custom-error").text()=="" ) {
                        var data = ctrl.getCompanyBaseInfo();
                        companyModel.companyBaseEdit(data,callback);
                    }
                }
            }else if(radioVal == companyModel.CONSTANT.cardType.ONEFIVE.key){
                if(ctrl.vmFivetype.getValue("imgurls").imgurls.length){
                    if (companyView.find(".js-companyBaseInfo").valid()
                        && companyView.find(".js-fivetype").valid()) {
                        var data = ctrl.getCompanyBaseInfo();
                        companyModel.companyBaseEdit(data,callback);
                    }
                }else {
                    fileError(".js-fivetype");
                }
            }
    };

    ctrl.changeSize = function(goal){
        ctrl.view.find(goal).children().css({"width":"90px","height":"35px"});
    };
    //设置缩略图
    var uploadSuccess = function (result,elem) {
        elem.find('img').jqthumb(
            {
                width: 100,
                height: 100,
                after: function(imgObj){
                    imgObj.click(function(e){
                        e.stopPropagation();
                        var imgUrl = $(e.target).parent().next().attr("src");
                        var content = "<img src='"+imgUrl +"' />";
                        var opt = {
                            shadeClose:true,
                            content:content,
                            closeBtn:1,
                            callback:function(){
                                $(".layui-layer-content").click(function(){
                                    layer.closeAll();
                                })
                            }
                        };

                        layers.layerOpen(opt);
                    });
                },

            }
        );
    };
    ctrl.initBase = function(data){
        //营业执照
        ctrl.vmZerotype = ctrl.getViewModel(ctrl.view.el.find(".js-zerotype"),
            {meta: {"imgurls": {singleSize: 2,type:1,thumb:{width: 110,height: 110,quality: 70},
                maxNum:1,cancel:true,uploadSuccess:uploadSuccess,setValue:uploadSuccess,filePicker:".filePicker1",filePickerLabel:"上传附件"}},
                data:ctrl.echoImgThumb(data.businessLicense,false)});
        ctrl.vmZerotype.initControl();
        //组织机构代码
        ctrl.vmOnetype = ctrl.getViewModel(ctrl.view.el.find(".js-onetype"),
            {meta: {"imgurls": {singleSize: 2,type:1,thumb:{width: 110,height: 110,quality: 70},
                maxNum:1,cancel:true,uploadSuccess:uploadSuccess,setValue:uploadSuccess,filePicker:".filePicker2",filePickerLabel:"上传附件"}},
                data:ctrl.echoImgThumb(data.organizationCode,false)});
        ctrl.vmOnetype.initControl();
        //税务登记证
        ctrl.vmTwotype = ctrl.getViewModel(ctrl.view.el.find(".js-twotype"),
            {meta: {"imgurls": {singleSize: 2,type:1,thumb:{width: 110,height: 110,quality: 70},
                maxNum:1,cancel:true,uploadSuccess:uploadSuccess,setValue:uploadSuccess,filePicker:".filePicker3",filePickerLabel:"上传附件"}},
                data:ctrl.echoImgThumb(data.taxRegistrationCertificate,false)});
        ctrl.vmTwotype.initControl();
        //企业授权书
        ctrl.vmThreetype = ctrl.getViewModel(ctrl.view.el.find(".js-threetype"),
            {meta: {"imgurls": {singleSize: 2,type:1,thumb:{width: 110,height: 110,quality: 70},
                maxNum:1,cancel:true,uploadSuccess:uploadSuccess,setValue:uploadSuccess,filePicker:".filePicker4",filePickerLabel:"上传附件"}},
                data:ctrl.echoImgThumb(data.companyBusinessLicense,false)});
        ctrl.vmThreetype.initControl();
        //社会统一信用代码
        ctrl.vmFourtype = ctrl.getViewModel(ctrl.view.el.find(".js-fourtype"),
            {meta: {"imgurls": {singleSize: 2,type:1,thumb:{width: 110,height: 110,quality: 70},
                maxNum:1,cancel:true,uploadSuccess:uploadSuccess,setValue:uploadSuccess,filePicker:".filePicker0",filePickerLabel:"上传附件"}},
                data:ctrl.echoImgThumb(data.socialUnityCreditCode,false)});
        ctrl.vmFourtype.initControl();
        //五证合一
        ctrl.vmFivetype= ctrl.getViewModel(ctrl.view.el.find(".js-fivetype"),
            {meta: {"imgurls": {singleSize: 2,type:1,thumb:{width: 110,height: 110,quality: 70},
                maxNum:1,cancel:true,uploadSuccess:uploadSuccess,setValue:uploadSuccess,filePicker:".filePicker5",filePickerLabel:"上传附件"}},
                data:ctrl.echoImgThumb(data.licenseFiveCardShowInfo,false)});
        ctrl.vmFivetype.initControl();
        //其他
        ctrl.vmOthertype = ctrl.getViewModel(ctrl.view.el.find(".js-othertype"),
            {meta: {"imgurls": {singleSize: 2,type:1,thumb:{width: 110,height: 110,quality: 70},
                maxNum:10,cancel:true,uploadSuccess:uploadSuccess,setValue:uploadSuccess,filePicker:".filePickerO",filePickerLabel:"上传附件"}},
                data:ctrl.echoOtherImgThumb(data.othersLicense,false)}
        );
        ctrl.vmOthertype.initControl();
    };
    //获取审核状态
    ctrl.getStatus = function(data){
        if(data.status == companyModel.CONSTANT.status.EDITING.key){
            return Number(1);
        }else if(data.status == companyModel.CONSTANT.status.NOAUDIT.key){
            return Number(2)
        }else if(data.status == companyModel.CONSTANT.status.APPROVED.key||data.status == companyModel.CONSTANT.status.REJECTED.key){
            return Number(3)
        }
    };
    ctrl.rendering = function () {
        var callback = function(result){
            var data = result.data[0];
            //var data = {};
            return view.render(data, function (){
                var shuiwuNuber = ctrl.view.find('.js-shuiwu-number');
                var yingyeNumber = ctrl.view.find('.js-yingye-number');
                ctrl.aa = function(){
                    shuiwuNuber.on('input', function() {
                        ctrl.verificationOnly(".js-shuiwu-number");
                    });
                    shuiwuNuber.on('focus', function() {
                        ctrl.verificationOnly(".js-shuiwu-number");
                    });
                    yingyeNumber.on('input', function() {
                        ctrl.verificationOnly('.js-yingye-number');
                    });
                    yingyeNumber.on('focus', function() {
                        ctrl.verificationOnly('.js-yingye-number');
                    });
                };
                ctrl.aa();
                ctrl.verificationOnly = function(postion){
                    var errorHtml =  ctrl.view.find(postion).parent().find(".js-custom-error");
                    if(ctrl.view.find(postion).val().length >= 15){
                        if (yingyeNumber.val() === shuiwuNuber.val() ){
                            errorHtml.text("证件号不能一致")
                        }else{
                            errorHtml.text("")
                        }
                    }else{
                        errorHtml.text("")
                    }
                };

                //基本信息
                ctrl.view.el.find(".js-companyBaseInfo").validate({
                    rules: {
                        registeredCapital: {
                            isDigits:true,
                            rangelength: [1, 9]
                        },
                        companyPhone: {
                            required: true,
                            rangelength:[8,20]
                        },
                        companyAddressDistrict:{
                            required: true
                        },
                        employees: {
                            required: true,
                            isDigits:true,
                            rangelength:[1,9]
                        }
                    },
                    messages: {
                        companyPhone: {
                            required: "请输入电话号码",
                            rangelength:"请输入8-20位字符"
                        },
                        registeredCapital: {
                            isDigits:"请输入数字",
                            rangelength: "请输入10位以内字符"
                        },
                        companyAddressDistrict:{
                            required: "请选择所在地"
                        },
                        employees: {
                            required: "请输入员工人数",
                            isDigits:"请输入数字",
                            rangelength: "请输入10位以内字符"
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
                        error.appendTo(element.parent().find(".js-error"));
                    },
                    submitHandler: function (form) {
                    }
                });
                //社会信用代码
                ctrl.view.el.find(".js-zerotype").validate({
                    rules: {
                        number:{
                            required: true,
                            minlength: 15,
                            maxlength: 15,
                            isNoChinese:true,
                            isLicenseNumber:true
                        }
                    },
                    messages: {
                        number: {
                            required: "请输入营业执照",
                            minlength: "请输入正确的编号，例如123456789777777",
                            maxlength: "请输入正确的编号，例如123456789777777",
                            isLicenseNumber:"此证件已被注册，请重新输入证件编码",
                            isNoChinese:"请输入正确的编号，例如123456789777777"
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
                    },
                    submitHandler: function (form) {
                        //that.trigger("submit");
                    }

                });
                ctrl.view.el.find(".js-onetype").validate({
                    rules: {
                        number:{
                            required: true,
                            minlength: 10,
                            maxlength: 10,
                            isLicenseNumber: true
                        }
                    },
                    messages: {
                        number: {
                            required: "请输入组织机构代码",
                            minlength: "请输入正确的编号，例如12345678-4",
                            maxlength: "请输入正确的编号，例如12345678-4",
                            isLicenseNumber:"此证件已被注册，请重新输入证件编码"
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
                    },
                    submitHandler: function (form) {
                        //that.trigger("submit");
                    }

                });
                ctrl.view.el.find(".js-twotype").validate({
                    rules: {
                        number:{
                            required: true,
                            minlength: 15,
                            maxlength: 15,
                            isNoChinese:true,
                            isLicenseNumber:true
                        }
                    },
                    messages: {
                        number: {
                            required: "请输入税务登记证",
                            minlength: "请输入正确的编号，例如123456789777777",
                            maxlength: "请输入正确的编号，例如123456789777777",
                            isLicenseNumber:"此证件已被注册，请重新输入证件编码",
                            isNoChinese:"请输入正确的编号，例如123456789777777"
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
                    },
                    submitHandler: function (form) {
                        //that.trigger("submit");
                    }

                });
                ctrl.view.el.find(".js-fourtype").validate({
                    rules: {
                        number:{
                            required: true,
                            rangelength: [1,30],
                            isNoChinese:true,
                            isLicenseNumber: true
                        }
                    },
                    messages: {
                        number: {
                            required: "请输入社会统一信用代码",
                            rangelength:"请输入正确的社会统一信用代码",
                            isLicenseNumber:"此证件已被注册，请重新输入证件编码",
                            isNoChinese:"请输入正确的社会统一信用代码"
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
                    },
                    submitHandler: function (form) {
                        //that.trigger("submit");
                    }

                });
                ctrl.view.el.find(".js-fivetype").validate({
                    rules: {
                        registrationNumber:{
                            required: true,
                            rangelength: [1,30],
                            isNoChinese:true,
                            isLicenseNumber:true,
                            equalFalse: {
                                target: {
                                    organizationCode: $("[name=organizationCode]"),
                                    socialInsuranceRegistrationCardNumber: $("[name=socialInsuranceRegistrationCardNumber]"),
                                    statisticalRegistrationNumber: $("[name=statisticalRegistrationNumber]"),
                                    taxRegistrationCertificate: $("[name=taxRegistrationCertificate]")
                                },
                                elem: $("#registrationNumber")
                            }

                        },
                        organizationCode:{
                            required: true,
                            rangelength: [1,30],
                            isNoChinese:true,
                            equalFalse: {
                                target: {
                                    registrationNumber: $("[name=registrationNumber]"),
                                    socialInsuranceRegistrationCardNumber: $("[name=socialInsuranceRegistrationCardNumber]"),
                                    statisticalRegistrationNumber: $("[name=statisticalRegistrationNumber]"),
                                    taxRegistrationCertificate: $("[name=taxRegistrationCertificate]")
                                },
                                elem: $("#organizationCode")
                            },
                            isLicenseNumber:true

                        },
                        socialInsuranceRegistrationCardNumber:{
                            required: true,
                            rangelength: [1,30],

                            isNoChinese:true,
                            equalFalse: {
                                target: {
                                    registrationNumber: $("[name=registrationNumber]"),
                                    organizationCode: $("[name=organizationCode]"),
                                    statisticalRegistrationNumber: $("[name=statisticalRegistrationNumber]"),
                                    taxRegistrationCertificate: $("[name=taxRegistrationCertificate]")
                                },
                                elem: $("#socialInsuranceRegistrationCardNumber")
                            },
                            isLicenseNumber:true
                        },
                        statisticalRegistrationNumber:{
                            required: true,
                            rangelength: [1,30],
                            isNoChinese:true,
                            equalFalse: {
                                target: {
                                    registrationNumber: $("[name=registrationNumber]"),
                                    organizationCode: $("[name=organizationCode]"),
                                    socialInsuranceRegistrationCardNumber: $("[name=socialInsuranceRegistrationCardNumber]"),
                                    taxRegistrationCertificate: $("[name=taxRegistrationCertificate]")
                                },
                                elem: $("#statisticalRegistrationNumber")
                            },
                            isLicenseNumber:true
                        },
                        taxRegistrationCertificate:{
                            required: true,
                            rangelength: [1,30],
                            isNoChinese:true,
                            equalFalse: {
                                target: {
                                    registrationNumber: $("[name=registrationNumber]"),
                                    organizationCode: $("[name=organizationCode]"),
                                    socialInsuranceRegistrationCardNumber: $("[name=socialInsuranceRegistrationCardNumber]"),
                                    statisticalRegistrationNumber: $("[name=statisticalRegistrationNumber]")
                                },
                                elem: $("#taxRegistrationCertificate")
                            },

                            isLicenseNumber:true
                        }
                    },
                    messages: {
                        registrationNumber: {
                            required: "请输入注册号",
                            rangelength:"请输入正确的注册号",
                            equalFalse:"证件号不能一致",
                            isLicenseNumber:"此证件已被注册，请重新输入证件编码",
                            isNoChinese:"请输入正确的注册号"
                        },
                        organizationCode: {
                            required: "请输入组织机构代码证号",
                            rangelength:"请输入正确的组织机构代码证号",
                            isLicenseNumber:"此证件已被注册，请重新输入证件编码",
                            isNoChinese:"请输入正确的组织机构代码证号",
                            equalFalse:"证件号不能一致"
                        },
                        socialInsuranceRegistrationCardNumber: {
                            required: "请输入社会保险登记证号",
                            rangelength:"请输入正确的社会保险登记证号",
                            isLicenseNumber:"此证件已被注册，请重新输入证件编码",
                            isNoChinese:"请输入正确的社会保险登记证号",
                            equalFalse:"证件号不能一致"
                        },
                        statisticalRegistrationNumber: {
                            required: "请输入统计登记证号",
                            rangelength:"请输入正确的统计登记证号",
                            isLicenseNumber:"此证件已被注册，请重新输入证件编码",
                            isNoChinese:"请输入正确的统计登记证号",
                            equalFalse:"证件号不能一致"
                        },
                        taxRegistrationCertificate: {
                            required: "请输入税务登记证号",
                            rangelength:"请输入正确的税务登记证号",
                            isLicenseNumber:"此证件已被注册，请重新输入证件编码",
                            isNoChinese:"请输入正确的税务登记证号",
                            equalFalse:"证件号不能一致"
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
                    },
                    submitHandler: function (form) {
                        //that.trigger("submit");
                    }

                });

                X.controls.getControl("ProgressBar", view.el.find(".progress-wrap"), {
                    progressContent: ["1", "2", "3"],
                    progressContentInfo: ["提交审核", "资质审核", "完成"],
                    allSteps: 3,
                    nowStep: ctrl.getStatus(data)
                });
                ctrl.judgeStatus(data);
                ctrl.companyEdit = ctrl.getViewModel(ctrl.view.el.find(".js-companyBaseInfo"),{meta :option.meta,data:data});
                ctrl.companyEdit.initControl();
                ctrl.editChooseCardType(data.isSocialUnityCreditCode);
                ctrl.dataChooseCardType(data.isSocialUnityCreditCode);
                ctrl.chooseCardType();
                ctrl.changeSize(".filePicker0");
                ctrl.changeSize(".filePicker1");
                ctrl.changeSize(".filePicker2");
                ctrl.changeSize(".filePicker3");
                ctrl.changeSize(".filePicker5");
            });
        };
        companyModel.getCompanyInfo(callback);
    };
    //选择企业类型
    ctrl.chooseCardType = function(){
        ctrl.view.find(".js-chooseCardType input").each(function(index){
            ctrl.view.find(this).click(function(){
                ctrl.view.find(".js-threeCertificate li:eq("+index+")").show().siblings().hide();
            })
        })
    };
    ctrl.dataChooseCardType = function(index){
              ctrl.view.find(".js-threeCertificateData li:eq("+index+")").show().siblings().hide();
    };
    ctrl.editChooseCardType = function(index){
        ctrl.view.find(".js-chooseCardType input:eq("+index+")").attr("checked",true);
        ctrl.view.find(".js-threeCertificate li:eq("+index+")").show().siblings().hide();
    };
    //上传
    /*ctrl.getImgurl = function(item){
        if(item.imgurls.length>0){
            item.licenseName = item.imgurls[0].filename;
            item.imgurl = item.imgurls[0].url;
            delete item.imgurls;
            return item;
        }else if (item.number && item.imgurls.length <= 0 ){
            delete item.imgurls;
            return item
        }else if (item.number && item.imgurls.length <= 0 ){

        }else{
            return null
        }
    };*/
    ctrl.getImgurl = function(item){
        if(item.imgurls.length>0){
            item.licenseName = item.imgurls[0].filename;
            item.imgurl = item.imgurls[0].url;
            delete item.imgurls;
            return item;
        }else{
            delete item.imgurls;
            return item
        }
    };
    //其他证件类型
    ctrl.otherLicense = function(item){
        if(item.imgurls.length>0){
            for (var i=0; i<item.imgurls.length; i++){
                item.imgurls[i].imgurl = item.imgurls[i].url;
                item.imgurls[i].licenseName = item.imgurls[i].filename;
                delete item.imgurls[i].filename;
                delete item.imgurls[i].url;
                delete item.imgurls[i].attachmentType
            }
            return item.imgurls;
        }else {
            return null
        }

    };

    //采集信息
    ctrl.getCompanyBaseInfo =function(){
        var companyBase = ctrl.companyEdit.collectData();
        var zerotype = ctrl.getImgurl(ctrl.vmZerotype.collectData());
        var onetype =  ctrl.getImgurl(ctrl.vmOnetype.collectData());
        var twoType =  ctrl.getImgurl(ctrl.vmTwotype.collectData());
        var threeType =ctrl.getImgurl(ctrl.vmThreetype.collectData());
        var fourType =  ctrl.getImgurl(ctrl.vmFourtype.collectData());
        var fiveType =  ctrl.getImgurl(ctrl.vmFivetype.collectData());
        var other =  ctrl.otherLicense(ctrl.vmOthertype.collectData());

        switch (ctrl.view.find(".js-chooseCardType input[type='radio']:checked").val()){
            case companyModel.CONSTANT.cardType.FIVE.key:
                var data = $.extend( false, {},companyBase,{businessLicense:zerotype},{organizationCode:onetype},
                    {taxRegistrationCertificate:twoType},{othersLicense:other},{companyBusinessLicense:threeType});
                return data;
            break;
            case companyModel.CONSTANT.cardType.ONETHREE.key:
                var data = $.extend( false, {},companyBase,{socialUnityCreditCode:fourType},{othersLicense:other},{companyBusinessLicense:threeType});
                return data;
            break;
            case companyModel.CONSTANT.cardType.ONEFIVE.key:
                var  data = $.extend( false, {},companyBase,{licenseFiveCardInfo:fiveType},{othersLicense:other},{companyBusinessLicense:threeType});
                return data;
            break;
        }
    };
    ctrl.companySubmit = function () {
        var callback = function(){
            var layerSuccess =layer.open({
                title: '提示',
                content: '提交成功',
                yes:function(){
                    layer.close(layerSuccess);
                    ctrl.load();
                }
            });
        };
        ctrl.Submit(callback);
    };
    //提交企业（采购商）信息
    ctrl.Submit = function (callback) {
        ctrl.publicMethod(callback);
    };
    ctrl.addEvent("click", ".js-companyButton", "companySubmit");
    ctrl.load = function () {
        ctrl.rendering();
    };
    return ctrl;
});
