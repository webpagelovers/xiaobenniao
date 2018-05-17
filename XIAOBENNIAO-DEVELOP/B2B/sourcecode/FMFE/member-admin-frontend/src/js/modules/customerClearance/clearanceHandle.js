X.define("modules.customerClearance.clearanceHandle",["model.customerClearanceModel","common.layer","adapter.laydate","adapter.webuploader","data.currencyData","modules.common.checkIsIE"],function (customerClearanceModel,layer,laydate,webuploader,currencyData,checkIsIE) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.customerClearance.tpl.clearanceHandle
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    //获取报关信息
    ctrl.getData = function (callback) {
        customerClearanceModel.find({data:{"exportFormId":_para["exportFormId"]},callback:callback});
    };

    //判断报关状态

    ctrl.judgmentState = function(data){
        var exportStatus  = data.status ;
        if(exportStatus!=customerClearanceModel.const.declarationStatus.CANCEL.key){
            if(exportStatus == customerClearanceModel.const.declarationStatus.REVIEW.key){ //待审核
                ctrl.view.find('.js-reviewform').removeClass("none");
            }else if(exportStatus == customerClearanceModel.const.declarationStatus.BOOKING.key){ //待订舱
                ctrl.view.renderIn(".js-review-tpl",".js-review",data.documentVerify);
                ctrl.view.find('.js-bookingform').removeClass("none");
                ctrl.view.find('.js-bookingBg').addClass("blueBg");
            }else if(exportStatus == customerClearanceModel.const.declarationStatus.CLEARANCE.key){ //待报关
                ctrl.view.renderIn(".js-review-tpl",".js-review",data.documentVerify);
                ctrl.view.renderIn(".js-exportBooking-tpl",".js-exportBooking",data.exportBooking);
                ctrl.view.find(".js-booking").loadTemplate(".js-booking-tpl",data.exportBooking.bookings);
                ctrl.view.find('.js-clearanceform').removeClass("none");
                ctrl.view.find('.js-bookingBg').addClass("blueBg");
                ctrl.view.find('.js-clearanceBg').addClass("blueBg");
            }else if(exportStatus == customerClearanceModel.const.declarationStatus.CONVERSION.key) { //待结汇
                ctrl.view.renderIn(".js-review-tpl",".js-review",data.eocumentVerify);
                ctrl.view.renderIn(".js-exportBooking-tpl",".js-exportBooking",data.exportBooking);
                ctrl.view.find(".js-booking").loadTemplate(".js-booking-tpl",data.exportBooking.bookings);
                //ctrl.view.renderIn(".js-booking-tpl",ctrl.view.find(".js-booking"),data.exportBooking.bookings);
                ctrl.view.renderIn(".js-clearance-tpl",".js-clearance",data.exportDeclaration);
                ctrl.view.renderIn(".js-customs-tpl",".js-customs",data.exportDeclaration.declarationPeoples);
                ctrl.view.find(".js-customs").loadTemplate(".js-customs-tpl",data.exportDeclaration.declarationPeoples);
                ctrl.view.find('.js-conversionform').removeClass("none");
                ctrl.view.find('.js-bookingBg').addClass("blueBg");
                ctrl.view.find('.js-conversionBg').addClass("blueBg");
                ctrl.view.find('.js-clearanceBg').addClass("blueBg");
                ctrl.view.find('.js-currency').html(currencyData.getCurrency(data.exportSettlement.settlementCurrency))
            }else if(exportStatus == customerClearanceModel.const.declarationStatus.DRAWBACK.key) { //待退税
                ctrl.view.renderIn(".js-review-tpl",".js-review",data.documentVerify);
                ctrl.view.renderIn(".js-exportBooking-tpl",".js-exportBooking",data.exportBooking);
                ctrl.view.find(".js-booking").loadTemplate(".js-booking-tpl",data.exportBooking.bookings);
                ctrl.view.renderIn(".js-clearance-tpl",".js-clearance",data.exportDeclaration);
                ctrl.view.find(".js-customs").loadTemplate(".js-customs-tpl",data.exportDeclaration.declarationPeoples);
                ctrl.view.renderIn(".js-conversion-tpl",".js-conversion",data.exportSettlement);
                ctrl.view.find('.js-drawbackform').removeClass("none");
                ctrl.view.find('.js-bookingBg').addClass("blueBg");
                ctrl.view.find('.js-conversionBg').addClass("blueBg");
                ctrl.view.find('.js-clearanceBg').addClass("blueBg");
                ctrl.view.find('.js-drawbackBg').addClass("blueBg");
                ctrl.view.find('.js-currency').html(currencyData.getCurrency(data.exportSettlement.settlementCurrency))

            }else if(exportStatus == customerClearanceModel.const.declarationStatus.COMPLETE.key) {//已完成
                ctrl.view.renderIn(".js-review-tpl",".js-review",data.documentVerify);
                ctrl.view.renderIn(".js-exportBooking-tpl",".js-exportBooking",data.exportBooking);
                ctrl.view.find(".js-booking").loadTemplate(".js-booking-tpl",data.exportBooking.bookings);
                ctrl.view.renderIn(".js-clearance-tpl",".js-clearance",data.exportDeclaration);
                ctrl.view.find(".js-customs").loadTemplate(".js-customs-tpl",data.exportDeclaration.declarationPeoples);
                ctrl.view.renderIn(".js-conversion-tpl",".js-conversion",data.exportSettlement);
                ctrl.view.renderIn(".js-drawback-tpl",".js-drawback",data.exportRefund);
                ctrl.view.find('.js-cancelnone').addClass("none");
                ctrl.view.find('.js-bookingBg').addClass("blueBg");
                ctrl.view.find('.js-conversionBg').addClass("blueBg");
                ctrl.view.find('.js-clearanceBg').addClass("blueBg");
                ctrl.view.find('.js-drawbackBg').addClass("blueBg");
                ctrl.view.find('.js-currency').html(currencyData.getCurrency(data.exportSettlement.settlementCurrency))
            }

        }
        else{
            var cancelStatus = data.cancelStatus;
            if(cancelStatus == customerClearanceModel.const.declarationStatus.REVIEW.key){ //待审核 js-cancelForm
                ctrl.view.renderIn(".js-cancel-tpl",".js-cancel",data.cancelExport);
                ctrl.view.find('.js-cancelForm').addClass("none");
            }else if(cancelStatus == customerClearanceModel.const.declarationStatus.BOOKING.key){ //待订舱
                ctrl.view.renderIn(".js-review-tpl",".js-review",data.documentVerify);
                ctrl.view.renderIn(".js-cancel-tpl",".js-cancel",data.cancelExport);
                ctrl.view.find('.js-bookingBg').addClass("blueBg");
                ctrl.view.find('.js-cancelForm').addClass("none");
            }else if(cancelStatus == customerClearanceModel.const.declarationStatus.CLEARANCE.key){ //待报关
                ctrl.view.renderIn(".js-review-tpl",".js-review",data.eocumentVerify);
                ctrl.view.renderIn(".js-exportBooking-tpl",".js-exportBooking",data.exportBooking);
                ctrl.view.find(".js-booking").loadTemplate(".js-booking-tpl",data.exportBooking.bookings);
                ctrl.view.renderIn(".js-cancel-tpl",".js-cancel",data.cancelExport);
                ctrl.view.find('.js-bookingBg').addClass("blueBg");
                ctrl.view.find('.js-cancelForm').addClass("none");

            }else if(cancelStatus == customerClearanceModel.const.declarationStatus.CONVERSION.key) { //待结汇
                ctrl.view.renderIn(".js-review-tpl",".js-review",data.eocumentVerify);
                ctrl.view.renderIn(".js-exportBooking-tpl",".js-exportBooking",data.exportBooking);
                ctrl.view.find(".js-booking").loadTemplate(".js-booking-tpl",data.exportBooking.bookings);
                ctrl.view.renderIn(".js-cancel-tpl",".js-cancel",data.cancelExport);
                ctrl.view.renderIn(".js-clearance-tpl",".js-clearance",data.exportDeclaration);
                ctrl.view.find(".js-customs").loadTemplate(".js-customs-tpl",data.exportDeclaration.declarationPeoples);
                ctrl.view.renderIn(".js-cancel-tpl",".js-cancel",data.cancelExport);
                ctrl.view.find('.js-bookingBg').addClass("blueBg");
                ctrl.view.find('.js-clearanceBg').addClass("blueBg");
                ctrl.view.find('.js-cancelForm').addClass("none");
                ctrl.view.find('.js-currency').html(currencyData.getCurrency(data.exportSettlement.settlementCurrency))
            }else if(cancelStatus == customerClearanceModel.const.declarationStatus.DRAWBACK.key) { //待退税
                ctrl.view.renderIn(".js-review-tpl",".js-review",data.eocumentVerify);
                ctrl.view.renderIn(".js-exportBooking-tpl",".js-exportBooking",data.exportBooking);
                ctrl.view.find(".js-booking").loadTemplate(".js-booking-tpl",data.exportBooking.bookings);
                ctrl.view.renderIn(".js-cancel-tpl",".js-cancel",data.cancelExport);
                ctrl.view.renderIn(".js-clearance-tpl",".js-clearance",data.exportDeclaration);
                ctrl.view.find(".js-customs").loadTemplate(".js-customs-tpl",data.exportDeclaration.declarationPeoples);
                ctrl.view.renderIn(".js-cancel-tpl",".js-cancel",data.cancelExport);
                ctrl.view.renderIn(".js-conversion-tpl",".js-conversion",data.exportSettlement);
                ctrl.view.find('.js-bookingBg').addClass("blueBg");
                ctrl.view.find('.js-conversionBg').addClass("blueBg");
                ctrl.view.find('.js-clearanceBg').addClass("blueBg");
                ctrl.view.find('.js-cancelForm').addClass("none");
                ctrl.view.find('.js-currency').html(currencyData.getCurrency(data.exportSettlement.settlementCurrency))
            }
        }
    };
    var operationHistoryList;

    ctrl.rendering = function () {
        var callback = function (model) {
            ctrl.vmBerths = [];
            ctrl.vmuserBases = [];
            var data = model.attributes;//js-drawback-contacts
            return view.render(data, function () {
                if ($.validator) {
                    $.validator.prototype.elements = function () {
                        var validator = this,
                            rulesCache = {};

                        // select all valid inputs inside the form (no submit or reset buttons)
                        return $(this.currentForm)
                            .find("input, select, textarea")
                            .not(":submit, :reset, :image, [disabled]")
                            .not(this.settings.ignore)
                            .filter(function () {
                                if (!this.name && validator.settings.debug && window.console) {
                                    console.error("%o has no name assigned", this);
                                }
                                rulesCache[this.name] = true;
                                return true;
                            });
                    }
                }

                //自定义属性
                $.addTemplateFormatter({
                    //货柜类型
                    containerTypemater: function (value, template) {
                        return customerClearanceModel.const.containerType[value];
                    },
                    //货柜个数
                    containerCountmater:function (value, template) {
                        return customerClearanceModel.const.containerCount[value];
                    },
                    //币种
                    currencyFormater:function (value, template) {
                        return currencyData.getCurrency(value);
                    }
                });
                ctrl.judgmentState(data);
                operationHistoryList = data.operationHistoryList;
                ctrl.initPage();
                ctrl.addUser();
                ctrl.contactsShow(data);
                //附件
                var fileUploadController = window.X.config.PATH_FILE.path.rootUploadUrl || [];
                var exportBooking = data.exportBooking.bookingAttachments || [];//订舱附件
                var exportDeclaration  = data.exportDeclaration.declarationAttachments || [] ;//
                var otherAttachmentsList = data.exportSettlement.settlementAttachments || [];//结汇
                var taxAttachmentsList = data.exportRefund.exportRefundAttachments || [];//

                var domesticTradeContractAttachments = ctrl.view.el.find(".js-domesticTradeContractAttachments");
                ctrl.displayFile = function(content,postions){
                    $.each(content, function (i, item) {
                        /*var a = '<div class="grayBlock mr10 mb15">' +
                            '<a target="_blank" href=' + fileUploadController + '?fileType=3&filePath='
                            + item.filePath + '&fileName=' + item.filename + ' class="underline c009add">'
                            + item.filename + '</a>' +
                            '</div>';*/
                         var a = '<div class="wrapUpload">' +
                             '<a href="'+fileUploadController+'?fileType=3&filePath='+item.filePath+'&fileName='+item.filename+'" class="accessory white-block">'+item.filename+'</a></div>';
                        ctrl.view.el.find(postions).append(a);
                    });
                };
                ctrl.displayFile(exportBooking,".js-bookingAttachments");
                ctrl.displayFile(exportDeclaration,".js-exportDeclaration");
                ctrl.displayFile(taxAttachmentsList,".js-taxAttachments");
                ctrl.displayFile(otherAttachmentsList,".js-otherAttachments");
                // 报关资料审核验证
                ctrl.view.find(".js-reviewform").validate({
                    rules: {
                        documentVerifyDescription: {
                            rangelength: [0, 100]
                        }
                    },
                    messages: {
                        documentVerifyDescription: {
                            rangelength: "最多能输入100个字符"
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
                        //that.trigger("submit");
                    }
                });
                ctrl.vmreview = ctrl.getViewModel(ctrl.view.el.find(".js-reviewform"));
                ctrl.vmreview.initControl();
                // 订舱验证
                ctrl.view.find(".js-bookingform").validate({
                    rules: {
                        bookingDescription: {
                            rangelength: [0, 100]
                        }
                    },
                    messages: {
                        bookingDescription: {
                            rangelength: "最多能输入100个字符"
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
                ctrl.vmbooking = ctrl.getViewModel(ctrl.view.el.find(".js-bookingform"), {
                    meta: {
                        "bookingAttachments": {
                            size: 20,
                            type: 6,
                            maxNum: 5,
                            downloadType: 3,
                            filePicker: ctrl.view.el.find(".js-addBooking").find(".filePicker").get(0)
                        }
                    }
                });

                ctrl.vmbooking.initControl();
                ctrl.addBerth();
                //报关资料验证
                ctrl.view.find(".js-clearanceform").validate({
                    rules: {
                        declarationPlanDate: {
                            required: true
                        },
                        declarationDate: {
                            required: true
                        },
                        declarationDescription: {
                            rangelength: [0, 100]
                        }
                    },
                    messages: {
                        declarationPlanDate: {
                            required: "请选择申报日期"
                        },
                        declarationDate: {
                            required: "请选择放行日期"
                        },
                        declarationDescription: {
                            rangelength: "最多能输入100个字符"
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
                ctrl.vmclearance = ctrl.getViewModel(ctrl.view.el.find(".js-clearanceform"), {
                    meta: {
                        "declarationAttachments": {
                            size: 20,
                            type: 6,
                            maxNum: 5,
                            downloadType: 3,
                            filePicker: ctrl.view.el.find(".js-addclearanceFlies").find(".filePicker").get(0)
                        },
                        "declarationPlanDate": {
                            //min: moment().add('days',1).format("YYYY-MM-DD HH:mm:ss"),//X.controls.getControlClazz("DatePicker").now()
                            afterDateChange: function(that, date) {
                                $(that.elem).valid();
                            }
                        },
                        "declarationDate": {
                            //选择的时间必须大于当前时间
                            //min: moment().add('days',1).format("YYYY-MM-DD HH:mm:ss"),//X.controls.getControlClazz("DatePicker").now()
                            afterDateChange: function(that, date) {
                                $(that.elem).valid();
                            }
                        }
                    }
                });
                ctrl.vmclearance.initControl();
                //采集增加用户信息
                ctrl.vmuserRow = ctrl.getViewModel(ctrl.view.el.find(".js-adduserRow"));
                ctrl.vmuserRow.initControl();

                // 结汇验证
                ctrl.view.find(".js-conversionform").validate({
                    rules: {
                        contacts: {
                            required: true,
                            rangelength: [1, 10]
                        },
                        phoneNumber: {
                            required: true,
                            rangelength: [1, 16]
                        },
                        imEmail: {
                            rangelength: [1, 20]
                        },
                        settlementAmount: {
                            required: true,
                            rangelength: [1, 10]
                        },
                        settlementRmb: {
                            required: true,
                            rangelength: [1, 10]
                        },
                        settlementDescription: {
                            rangelength: [1, 100]
                        }
                    },
                    messages: {
                        contacts: {
                            required: "请输入结汇处理人",
                            rangelength: "最多输入10个字符"
                        },
                        phoneNumber: {
                            required: "请输入联系电话",
                            rangelength: "最多输入16个字符"
                        },
                        imEmail: {
                            rangelength:  "最多输入20个字符"
                        },
                        settlementAmount: {
                            required: "请输入结汇外币",
                            rangelength:  "最多输入10个字符"
                        },
                        settlementRmb: {
                            required: "请输入结汇金额",
                            rangelength:  "最多输入10个字符"
                        },
                        settlementDescription: {
                            rangelength:  "最多输入100个字符"
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
                //币种
                var settlementCurrencyArr = [{key: 0, value: "USD"}, {key: 1, value: "RMB"}];
                ctrl.vmconversion = ctrl.getViewModel(ctrl.view.el.find(".js-conversionform"), {
                    meta: {
                        "settlementCurrency": {dataSource: settlementCurrencyArr},
                        "settlementAmount" :{money:232},
                        "settlementRmb" :{money:232},
                        "settlementAttachments": {
                            size: 20,
                            type: 6,
                            maxNum: 5,
                            downloadType: 3,
                            filePicker: ctrl.view.el.find(".js-addconversionFlies").find(".filePicker").get(0)
                        }
                    }
                });
                ctrl.vmconversion.initControl();

                //退税资料验证
                ctrl.view.find(".js-drawbackform").validate({
                    rules: {
                        contacts: {
                            required: true,
                            rangelength: [1, 10]
                        },
                        phoneNumber: {
                            required: true,
                            rangelength: [0, 16]
                        },
                        imEmail: {
                            rangelength: [0, 30]
                        },
                        refundAmount: {
                            required: true,
                            rangelength: [1, 10]
                        },
                        refundDescription: {
                            rangelength: [0, 100]
                        }
                    },
                    messages: {
                        contacts: {
                            required: "请输入退税处理人",
                            rangelength: "最多输入10个字符"
                        },
                        phoneNumber: {
                            required: "请输入联系电话",
                            rangelength: "最多输入16个字符"
                        },
                        imEmail: {
                            rangelength:"最多输入30 个字符"
                        },
                        refundAmount: {
                            required: "请输入退税金额",
                            rangelength: "最多输入10个字符"
                        },
                        refundDescription: {
                            rangelength: "最多输入100个字符"
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
                ctrl.vmdrawback = ctrl.getViewModel(ctrl.view.el.find(".js-drawbackform"), {
                    meta: {
                        "refundAmount":{money:232},
                        "exportRefundAttachments": {
                            size: 20,
                            type: 6,
                            maxNum: 5,
                            downloadType: 3,
                            filePicker: ctrl.view.el.find(".js-adddrawbackFlies").find(".filePicker").get(0)
                        }
                    }
                });
                ctrl.vmdrawback.initControl();

                // 取消提交验证
                ctrl.view.find(".js-cancelForm").validate({
                    rules: {
                        cancelExplain: {
                            required: true,
                            rangelength: [0, 100]
                        }
                    },
                    messages: {
                        cancelExplain: {
                            required: "请输入订单取消原因",
                            rangelength: "最多输入100个字符"
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
                ctrl.vmcancel = ctrl.getViewModel(ctrl.view.el.find(".js-cancelForm"));
                ctrl.vmcancel.initControl();
                //人员
                ctrl.userBase = function(){
                    var data = [];
                    for (var i = 0 ;i < ctrl.vmuserBases.length; i++){
                        data.push(ctrl.vmuserBases[i].collectData());
                    }
                    return data
                };
                //舱位
                ctrl.berthData = function(){
                    var data = [];
                    for (var i = 0 ;i < ctrl.vmBerths.length; i++){
                        data.push(ctrl.vmBerths[i].collectData());
                    }
                    return data
                };

            });

        };
        ctrl.getData(callback);

    };
    ctrl.contactsShow =function(data){
        if (data.exportRefund.bankContacts == "" && data.exportRefund.bankPhoneNumber == "" && data.exportRefund.bankImEmail== ""){
            ctrl.view.find(".js-drawback-contacts").html(" ");
        }
        if (data.exportSettlement.bankContacts == "" && data.exportSettlement.bankPhoneNumber== "" && data.exportSettlement.bankImEmail== ""){
            ctrl.view.find(".js-conversion-contacts").html(" ");
        }
    };

    var header ={
        "tabAll" :[
            {
                field:{
                    name:"operateDate",
                    title:"操作时间",
                    type:"string"
                },
                width:"33%",
                className:"tL"
            },
            {
                field:{
                    name:"operationDescription",
                    title:"操作事项",
                    type:"string"
                },
                width:"33%"
            },
            {
                field:{
                    name: "backendUserName",
                    title:"操作员",
                    type:"string"
                },
                width:"33%"
            }
        ]
    };

    var schemas = {
        "tabAll" :{
            searchMeta: {
                schema: {
                    simple:[
                    ]
                },
                search: {
                    onSearch : function (data) {
                        return data;
                    }
                },
                reset :{
                    show:false
                }
            },
            gridMeta :{
                columns : header["tabAll"],
                orderMode : 1,
                primaryKey:"bidId",
                orderMode : 1,
                afterRowRender: function (row, data) {
                }
            },
            pageInfo : {
                pageSize : '10',
                totalPages : '10',
                pageNo: '1',
                smallPapogation: {
                    isShow: false,
                    elem: '.js_small_papogation1'
                }
            },
            //url : X.config.customerClearance.api.getExportFormId
        }
    };


    var lists = {};
    var activeTabLiInfo;
    function initTabPage($elem,schema,tabPage) {
        var list = X.controls.getControl("DataGrid", $elem[0], schema.gridMeta);
        list.init();
        list.loadData(operationHistoryList);
    }
    ctrl.initPage  =function (){
        var tabPannel = X.controls.getControl("TabPanel",$('.js_tabPannel1'), {
            activeTabInfo: activeTabLiInfo,
            beforeChangeTab: function (tabLiInfo, targetLi, index, tabPage) {
                activeTabLiInfo = tabLiInfo;
                // 刊登状态 不同
                var page = $(tabPage);
                if(!page.data("hasInited")){
                    var schema = schemas[tabLiInfo];
                    if(schema){
                        initTabPage(page,schema,tabLiInfo);
                    }
                    page.data("hasInited",true);
                }
                // 为了样式效果，把当前选中的前一个加上样式名
                targetLi.prev().removeClass('tab_lineNone');
                return true;
            },
            afterChangeTab: function (tabLiInfo, targetLi, index, tabPage) {
                activeTabLiInfo = tabLiInfo;
                activeTabLi = targetLi;
                // 为了样式效果，把当前选中的前一个加上样式名
                targetLi.prev().addClass('tab_lineNone');
            }
        });
    };
    //  审核报关资料
    ctrl.reviewCallback = function (data) {
        var callback = function(data){
            if(data.statusCode == "2000000"){
                ctrl.rendering();
            }else{
                layer.layerPrompt("操作异常，请刷新当前页面",function(index){
                    layer.closeIt(index);
                    window.location.reload();
                })
            }
        };
        ctrl.reviewSubmit(callback);
    };
    ctrl.reviewSubmit = function (callback) {
        if (ctrl.view.find(".js-reviewform").valid()) {
            var data = ctrl.vmreview.collectData();
            data.exportFormId = _para["exportFormId"];
            customerClearanceModel.reviewRegister(data,callback);
        }
    };
    //订舱
    ctrl.bookingCallback = function () {
        var callback = function(data){
            if(data.statusCode == "2000000"){
                ctrl.rendering();
            }else{
                layer.layerPrompt("操作异常，请刷新当前页面",function(index){
                    layer.closeIt(index);
                    window.location.reload();
                })
            }
        };
        ctrl.bookingSubmit(callback);
    };
    /*ctrl.berthData = function(){
        var data = [];
        for (var i = 0 ;i < ctrl.vmBerths.length; i++){
            data.push(ctrl.vmBerths[i].collectData());
        }
        return data
    };*/
    ctrl.bookingSubmit = function (callback) {
        if ( Array.prototype.slice.call(ctrl.view.find(".js-berthBaseRow")).every(function(form){
                return  $(form).valid()
            }) &&  ctrl.view.find(".js-bookingform").valid() && ctrl.view.find(".js-attachError").text()=="" ) {
            var data = ctrl.vmbooking.collectData();
            data.bookings = ctrl.berthData();
             data.exportFormId = _para['exportFormId'];
            customerClearanceModel.bookingRegister(data,callback);
        }
    };
    //报关
    ctrl.clearanceCallback = function () {
        var callback = function(data){
            if(data.statusCode == "2000000"){
                ctrl.rendering();
            }else{
                layer.layerPrompt("操作异常，请刷新当前页面",function(index){
                    layer.closeIt(index);
                    window.location.reload();
                })
            }
        };
        ctrl.clearanceSubmit(callback);
    };
    /*//获取多条人员信息
    ctrl.userBase = function(){
        var data = [];
        for (var i = 0 ;i < ctrl.vmuserBases.length; i++){
            data.push(ctrl.vmuserBases[i].collectData());
        }
        return data
    };*/
    ctrl.clearanceSubmit = function (callback) {
        if ( Array.prototype.slice.call(ctrl.view.find(".js-adduserRow")).every(function(form){
              return  $(form).valid()
            }) && ctrl.view.find(".js-clearanceform").valid() && ctrl.view.find(".js-attachError").text()=="" ) {
            var data = ctrl.vmclearance.collectData();
                data.declarationPeoples = ctrl.userBase();
                data.exportFormId = _para['exportFormId'];
                delete data.fullname;
                delete data.imEmail;
                delete data.phoneNumber;
            customerClearanceModel.clearanceRegister(data,callback);
        }
    };
    //结汇
    ctrl.conversionCallback = function () {
        var callback = function(data){
            if(data.statusCode == "2000000"){
                ctrl.rendering();
            }else{
                layer.layerPrompt("操作异常，请刷新当前页面",function(index){
                    layer.closeIt(index);
                    window.location.reload();
                })
            }
    };
        ctrl.conversionSubmit(callback);
    };
    ctrl.conversionSubmit = function (callback) {
        if (ctrl.view.find(".js-conversionform").valid() && ctrl.view.find(".js-attachError").text()=="") {
            var data = ctrl.vmconversion.collectData();
                data.exportFormId = _para['exportFormId'];
            customerClearanceModel.conversionRegister(data,callback);
        }
    };
    //退税
    ctrl.drawbackCallback = function () {
        var callback = function(data){
            if(data.statusCode == "2000000"){
                ctrl.rendering();
            }else{
                layer.layerPrompt("操作异常，请刷新当前页面",function(index){
                    layer.closeIt(index);
                    window.location.reload();
                })
            }
        };
        ctrl.drawbackSubmit(callback);
    };
    ctrl.drawbackSubmit = function (callback) {
        if (ctrl.view.find(".js-attachError").text() == "" && ctrl.view.find(".js-drawbackform").valid()  ) {
            var data = ctrl.vmdrawback.collectData();
                data.exportFormId = _para['exportFormId'];
            customerClearanceModel.drawbackRegister(data,callback);
        }
    };
    //取消
    ctrl.cancelCallback = function () {
        var callback = function(data){
            if(data.statusCode == "2000000"){
                ctrl.rendering();
            }else{
                layer.layerPrompt("操作异常，请刷新当前页面",function(index){
                    layer.closeIt(index);
                    window.location.reload();
                })
            }
        };
        ctrl.cancelSubmit(callback);
    };
    ctrl.cancelSubmit = function (callback) {
        if (ctrl.view.find(".js-cancelForm").valid()) {
            var data = ctrl.vmcancel.collectData();
            data.exportFormId = _para["exportFormId"];
            layer.successConfirm('确认取消？', function(index){
                customerClearanceModel.cancelRegister(data,callback);
                layer.successMsg("取消成功",function(){
                    layer.closeIt();
                });
            });
        }
    };
    //添加舱位
    ctrl.addBerth =function(){
        var berthBase = ctrl.view.find('.js-berthBase'),
            baseRow   = $('<form class="js-berthBaseRow"></form>');
        berthBase.append(baseRow);
        ctrl.view.renderIn(".js-berthBaseRow-tpl", berthBase.children().last());
        ctrl.berthBaseValidate();
        ctrl.vmBerth = ctrl.getViewModel(baseRow, {
            meta: {
                "containerType": {
                    dataSource: customerClearanceModel.const.containerSizeArr,
                    selectedChanged:function(item){
                        var currencyError = ctrl.view.el.find(".containerType-error");
                        if (currencyError) {
                            currencyError.hide();
                        }
                        var currencyHiddenInput = ctrl.view.el.find(".containerTypeHidden");
                        if (currencyHiddenInput) {
                            currencyHiddenInput.val(item.key);
                        }
                    }
                },
                "containerCount": {
                    dataSource: customerClearanceModel.const.containerNumArr,
                    selectedChanged:function(item){
                        var containerCountError = ctrl.view.el.find(".containerCount-error");
                        if (containerCountError) {
                            containerCountError.hide();
                        }
                        var containerCountHidden = ctrl.view.el.find(".containerCountHidden");
                        if (containerCountHidden) {
                            containerCountHidden.val(item.key);
                        }
                    }
                },
                "sailDate": {
                    //min: moment().add('days',1).format("YYYY-MM-DD HH:mm:ss"),//X.controls.getControlClazz("DatePicker").now()
                    afterDateChange: function(that, date) {
                        $(that.elem).valid();
                    }
                }
            }
        });
        ctrl.vmBerth.initControl();
        ctrl.vmBerths.push(ctrl.vmBerth);
    };
    ctrl.berthBaseValidate = function() {
        ctrl.view.find(".js-berthBaseRow").last().validate({
            rules: {
                shipCompany: {
                    required: true,
                    rangelength: [1, 15]
                },
                containerTypeHidden: {
                    required: true
                },
                containerCountHidden: {
                    required: true
                },
                voyageNumber: {
                    required: true,
                    rangelength: [1, 15]
                },
                sailDate: {
                    required: true
                }
            },
            messages: {
                shipCompany: {
                    required: "请输入船名",
                    rangelength: "最多能输入15个字符"
                },
                containerTypeHidden: {
                    required: "请选择货柜类型"
                },
                containerCountHidden: {
                    required: "请选择货柜个数"
                },
                voyageNumber: {
                    required: "请输入航次",
                    rangelength: "最多能输入15个字符"
                },
                sailDate: {
                    required: "请选择开船日期"
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
    };

    //添加人员
    ctrl.addUser =function(){
        var userbase = ctrl.view.find(".js-adduser"),
            userRow  = $('<form class="js-adduserRow"></form>');
        userbase.append(userRow);
        ctrl.view.renderIn(".js-adduserRow-tpl", userbase.children().last());
        ctrl.berthUserValidate();
        ctrl.vmuserBase = ctrl.getViewModel(userRow, {
            meta: {
            }
        });
        ctrl.vmuserBase.initControl();
        ctrl.vmuserBases.push(ctrl.vmuserBase);
    };
    ctrl.berthUserValidate = function(){
        ctrl.view.find(".js-adduserRow").last().validate({
            rules: {
                fullname: {
                    required: true,
                    rangelength: [1, 10]
                },
                phoneNumber: {
                    required: true,
                    rangelength: [1, 16]
                },
                imEmail: {
                    required: true,
                    rangelength: [1, 30]
                }
            },
            messages: {
                fullname: {
                    required: "请输入姓名",
                    rangelength: "最多能输入10个字符"
                },
                phoneNumber: {
                    required: "请输入电话/手机号",
                    rangelength: "最多能输入16个字符"
                },
                imEmail: {
                    required: "请输入QQ／邮箱",
                    rangelength: "最多能输入30个字符"
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
    };
    //删除舱位
    ctrl.delBerth =function(){
        if(ctrl.view.find(".js-delBerth").length>1){
            var row = $(this.that).parents(".js-berthBaseRow");
            var index;
            if(row && row.length>0){
                index = row.index();
                ctrl.vmBerths.splice(index,1);
                row.remove();
            }

        }else if(ctrl.view.find(".js-delBerth").length===1){
            layer.layerAlert("最少添加一条",function(){

            });
        }
    };
    //删除人员
    ctrl.deluserRow =function(){
        if(ctrl.view.find(".js-deluserRow").length>1){
            var row = $(this.that).parents(".js-adduserRow");
            var index;
            if(row && row.length>0){
                index = row.index();
                ctrl.vmuserBases.splice(index,1);
                row.remove();
            }
        }else if(ctrl.view.find(".js-deluserRow").length===1){
            layer.layerAlert("最少添加一条",function(){

            });
        }
    };
    ctrl.addEvent("click", ".js-reviewbutton", "reviewCallback");
    ctrl.addEvent("click", ".js-bookingbutton", "bookingCallback");
    ctrl.addEvent("click", ".js-clearanceButton", "clearanceCallback");
    ctrl.addEvent("click", ".js-conversionButton", "conversionCallback");
    ctrl.addEvent("click", ".js-drawbackButton", "drawbackCallback");
    ctrl.addEvent("click", ".js-cancelButton", "cancelCallback");
    ctrl.addEvent("click", ".js-addBerth", "addBerth");
    ctrl.addEvent("click", ".js-addUser", "addUser");
    ctrl.addEvent("click", ".js-delBerth", "delBerth");
    ctrl.addEvent("click", ".js-deluserRow", "deluserRow");
    var _para;
    ctrl.load = function(para){
        para = para || {};
        _para = para ;
        ctrl.rendering();
    };
   /* var vmBerths = [];
    var vmuserBases = [];*/

    return ctrl;

});