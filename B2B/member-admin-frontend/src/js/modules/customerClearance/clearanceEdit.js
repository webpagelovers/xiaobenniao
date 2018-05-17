
X.define("modules.customerClearance.clearanceEdit",["adapter.webuploader","common.layer","adapter.laydate","data.addressData","model.clearanceModel","model.customerClearanceModel","data.currencyData"],function (webuploader,layer1,laydate,addressData,clearanceModel,customerClearanceModel,currencyData) {
    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.customerClearance.tpl.clearanceEdit
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.load = function (para) {
        ctrl.rendering(para);
    };

    ctrl.rendering = function (para) {

        customerClearanceModel.getById(para["exportFormId"],function(data){
            return view.render(data, function () {
                var getInfoData = data;
                var exchangeMethodArr = customerClearanceModel.const.exchangeMethodArr;
                var currencyArr = customerClearanceModel.const.currencyArr;
                var packingAllMethodArr = customerClearanceModel.const.packingAllMethodArr;
                var contractTypeArr = customerClearanceModel.const.contractTypeArr;
                var attributeArr = customerClearanceModel.const.attributeArr;
                var priceTermArr = customerClearanceModel.const.priceTermArr;
                var deleteButtonCount = 0;

                if(data.priceTerm > 3){
                    data.priceTermOther = data.priceTerm;
                    data.priceTerm = 3;
                }

                //银行账户
                data.acount= {
                    accountName:data.accountName,
                    bankName:data.bankName,
                    bankAccount:data.bankAccount,
                    bankContacts:data.bankContacts,
                    bankImEmail:data.bankImEmail,
                    bankPhoneNumber:data.bankPhoneNumber
                };

                //本单联系人
                data.exportContacts= {
                    contacts:data.contacts,
                    mobile:data.mobile,
                    phone:data.phone,
                    email:data.email
                };

                // 申请报关验证
                $(".js-declare").validate({
                    ignore: ".ignore",
                    rules: {
                        exchangeMethodHiddenInput: {
                            required: true
                        },
                        advance: {
                            required: true
                        },
                        customsPort: {
                            required: true,
                            maxlength: 50
                        },
                        currencyHiddenInput: {
                            required: true
                        },
                        priceTermHiddenInput: {
                            required: true
                        },
                        fare: {
                            required: true,
                            number: true,
                            rangelength:[1,10],
                            isNumberFloat2: true
                        },
                        premium: {
                            required: true,
                            number: true,
                            rangelength:[1,10],
                            isNumberFloat2: true
                        },
                        packageTypeHiddenInput: {
                            required: true
                        },
                        bordashedHiddenInput: {
                            required: true
                        },
                        packagingMaterialHiddenInput: {
                            required: true
                        },
                        trayTypeHiddenInput: {
                            required: true
                        },
                        detailConfirmedHiddenInput: {
                            required: true
                        },
                        shipmentDate: {
                            required: true
                        },
                        tradeNation: {
                            required: true,
                            maxlength: 15
                        },
                        targetNation: {
                            required: true,
                            maxlength: 15
                        },
                        destinationCountry: {
                            required: true,
                            maxlength: 15
                        },
                        domesticSource: {
                            required: true,
                            maxlength: 10
                        },
                        internationalTraderHiddenInput: {
                            required: true
                        },
                        exportGoodsLocationFirstHiddenInput: {
                            required: true
                        },
                        contractTypeHiddenInput: {
                            required: true
                        },
                        contractNumber: {
                            required: true,
                            maxlength: 15,
                            isNumCharacter: true
                        },
                        priceTermOtherHiddenInput: {
                            required: true
                        }
                    },
                    messages: {
                        exchangeMethodHiddenInput: {
                            required: "请选择收汇方式"
                        },
                        advance: {
                            required: "预付款不能为空"
                        },
                        customsPort: {
                            required: "请填写出口口岸",
                            maxlength: "请填写正确的出口口岸"
                        },
                        currencyHiddenInput: {
                            required: "请选择报关币种"
                        },
                        priceTermHiddenInput: {
                            required: "请选择价格条款"
                        },
                        fare: {
                            required: "请填写运费",
                            number: "请填写正确的运费",
                            rangelength: "请填写正确的运费",
                            isNumberFloat2: "请填写正确的运费"
                        },
                        premium: {
                            required: "请填写保费",
                            number: "请填写正确的保费",
                            rangelength: "请填写正确的保费",
                            isNumberFloat2: "请填写正确的保费"
                        },
                        packageTypeHiddenInput: {
                            required: "请选择包装方式"
                        },
                        bordashedHiddenInput: {
                            required: "请填写出货清单"
                        },
                        packagingMaterialHiddenInput: {
                            required: "请选择整体包装种类"
                        },
                        trayTypeHiddenInput: {
                            required: "请选择托盘类型"
                        },
                        detailConfirmedHiddenInput: {
                            required: "请选择产品信息是否确定"
                        },
                        shipmentDate: {
                            required: "请选择预计出货日期"
                        },
                        tradeNation: {
                            required: "请填写运抵国",
                            maxlength: "请填写正确的运抵国"
                        },
                        targetNation: {
                            required: "请填写指运港",
                            maxlength: "请填写正确的指运港"
                        },
                        destinationCountry: {
                            required: "请填写最终目的国",
                            maxlength: "请填写正确的最终目的国"
                        },
                        domesticSource: {
                            required: "请填写境内货源地",
                            maxlength: "请填写正确的境内货源地"
                        },
                        internationalTraderHiddenInput: {
                            required: "请填写境外贸易商"
                        },
                        exportGoodsLocationFirstHiddenInput: {
                            required: "请填写提货地址"
                        },
                        contractTypeHiddenInput: {
                            required: "请选择合同类型"
                        },
                        contractNumber: {
                            required: "请填写合同号",
                            maxlength: "请填写正确的合同号",
                            isNumCharacter: "请填写正确的合同号"
                        },
                        priceTermOtherHiddenInput: {
                            required: "请选择价格条款"
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
                    // showErrors: function (errorMap, errorList) {
                    // },
                    submitHandler: function (form) {
                        //that.trigger("submit");
                        var elem = $(element);
                        elem.valid();
                        alert("提交事件!");
                    }
                });

                ctrl.vmdeclare =ctrl.getViewModel(ctrl.view.el.find(".js-declare"),{meta: {"shipmentDate":{
                    min:getInfoData.shipmentDate,
                    afterClearDate:function () {
                        var shipmentDatePickerError = ctrl.view.el.find(".shipment-date-picker-error");
                        if (shipmentDatePickerError) {
                            shipmentDatePickerError.show();
                            shipmentDatePickerError.find("label").html("请选择预计出货日期");
                        }
                        var shipmentDatePickerInput = ctrl.view.el.find(".shipment_date_picker_input");
                        if (shipmentDatePickerInput) {
                            shipmentDatePickerInput.removeClass('ignore');
                        }
                    },
                    afterDateChange:function () {
                        var shipmentDatePickerError = ctrl.view.el.find(".shipment-date-picker-error");
                        if (shipmentDatePickerError) {
                            shipmentDatePickerError.hide();
                        }
                        var shipmentDatePickerInput = ctrl.view.el.find(".shipment_date_picker_input");
                        if (shipmentDatePickerInput) {
                            shipmentDatePickerInput.addClass('ignore');
                        }
                    }},"currency":{dataSource:currencyArr,selectedChanged:function(item){
                    currencyUnitSelect = item.text;
                    var currencyUnit = ctrl.view.el.find(".js-currencyUnit");
                    if(currencyUnit){
                        currencyUnit.html("("+item.text+")");
                    }
                    var currencyError = ctrl.view.el.find(".currency-error");
                    if (currencyError) {
                        currencyError.hide();
                    }
                    var currencyHiddenInput = ctrl.view.el.find(".currencyHiddenInput");
                    if (currencyHiddenInput) {
                        currencyHiddenInput.addClass('ignore');
                    }
                }},"exchangeMethod":{dataSource:exchangeMethodArr,selectedChanged:function(item){
                    var exchangeMethodHiddenInput = ctrl.view.el.find(".exchangeMethodHiddenInput");
                    exchangeMethodHiddenInput.val(item.text);
                }},"priceTermOther":{dataSource:priceTermArr,selectedChanged:function(item){
                    var priceTermOtherHiddenInput = ctrl.view.el.find(".priceTermOtherHiddenInput");
                    priceTermOtherHiddenInput.val(item.text);
                }},"packagingMaterial":{dataSource:packingAllMethodArr,selectedChanged:function(item){
                    var trayType = ctrl.view.el.find(".js-trayType");
                    if(Number(item.key) == 4){
                        trayType.css("display","block");

                    }else{
                        trayType.css("display","none");
                    }
                    var packagingMaterialError = ctrl.view.el.find(".packaging-material-error");
                    if (packagingMaterialError) {
                        packagingMaterialError.hide();
                    }
                    var packagingMaterialHiddenInput = ctrl.view.el.find(".packagingMaterialHiddenInput");
                    if (packagingMaterialHiddenInput) {
                        packagingMaterialHiddenInput.addClass('ignore');
                    }
                }},"contractType":{dataSource:contractTypeArr,selectedChanged:function(item){
                    var contractNumber = ctrl.view.el.find(".js-contractNumber");
                    switch(Number(item.key)){
                        case 0:
                        contractNumber.css("display","block");
                        var contractNumberError = ctrl.view.el.find(".contract-number-error").find("label");
                        if (contractNumberError) {
                            contractNumberError.text("");
                        }
                        var contractNumberInput = ctrl.view.el.find(".contract_number_validate_state");
                        if (contractNumberInput) {
                            contractNumberInput.removeClass('ignore');
                        }
                        break;
                        case 1:
                            contractNumber.css("display","block");
                            var contractNumberError = ctrl.view.el.find(".contract-number-error").find("label");
                            if (contractNumberError) {
                                contractNumberError.text("");
                            }
                            var contractNumberInput = ctrl.view.el.find(".contract_number_validate_state");
                            if (contractNumberInput) {
                                contractNumberInput.removeClass('ignore');
                            }
                            break;
                        case 2:
                            contractNumber.css("display","none");
                            var contractNumberInput = ctrl.view.el.find(".contract_number_validate_state");
                            if (contractNumberInput) {
                                contractNumberInput.addClass('ignore');
                            }
                            break;
                    }
                    var contractTypeError = ctrl.view.el.find(".contract-type-error");
                    if (contractTypeError) {
                        contractTypeError.hide();
                    }
                    var contractTypeHiddenInput = ctrl.view.el.find(".contractTypeHiddenInput");
                    if (contractTypeHiddenInput) {
                        contractTypeHiddenInput.addClass('ignore');
                    }
                }},"orderAttachments":{size: 20,type:5,maxNum:5,downloadType:2,filePicker:ctrl.view.el.find(".js-addorderAttachments").find(".filePicker").get(0),filePickerLabel:"上传SO"},
                    "domesticTradeContractAttachments":{size: 20,type:5,maxNum:5,downloadType:2,filePicker:ctrl.view.el.find(".js-adddomesticTradeContractAttachments").find(".filePicker").get(0),filePickerLabel:"上传合同"},
                    "otherAttachments":{size: 20,type:5,maxNum:5,downloadType:2,filePicker:ctrl.view.el.find(".js-addotherAttachments").find(".filePicker").get(0),filePickerLabel:"上传附件"}},data:data});
                ctrl.vmdeclare.initControl();

                ctrl.vmaddAcount =ctrl.getViewModel(ctrl.view.el.find(".js-addAcount"));
                ctrl.vmaddAcount.initControl();
                ctrl.vmaddContacts =ctrl.getViewModel(ctrl.view.el.find(".js-addContacts"));
                ctrl.vmaddContacts.initControl();

                var advance = ctrl.view.el.find(".js-advance");
                var finalPayment = ctrl.view.el.find(".js-finalPayment");
                advance.focusout(function(){
                    var number = advance.val();
                    if(number>100){
                        number = 100;
                        advance.val(number);
                    }else if(number<0){
                        number = 0;
                        advance.val(number);
                    }
                    finalPayment.html(100 - number);
                });

                var financeShowHide = function(data){
                    var finance = ctrl.view.el.find(".js-finance");
                    var bankContacts = ctrl.view.el.find(".js-person");
                    var bankPhoneNumber = ctrl.view.el.find(".js-perPhone");
                    var bankImEmail = ctrl.view.el.find(".js-perEmail");
                    var financeData = data;
                    if(financeData.bankContacts || financeData.bankImEmail || financeData.bankPhoneNumber){
                        finance.css("display","inline-block");
                        var showFun = function(field,data){
                            if(financeData[field]){
                                data.css("display","inline-block");
                            }
                        };
                        showFun("bankContacts",bankContacts);
                        showFun("bankImEmail",bankImEmail);
                        showFun("bankPhoneNumber",bankPhoneNumber);
                    }else{
                        finance.css("display","none");
                    }
                };
                var accountWrap = ctrl.view.el.find(".js-account");
                //银行账号回填
                accountWrap.loadTemplate($(".js-bid-getCountData-tpl"),data.acount);
                financeShowHide(data.acount);

                //银行账号编辑
                var acountEaitFun = function(data){
                    var acountEait = ctrl.view.el.find(".js-acountEait");
                    acountEait.click(function(){
                        ctrl.vmaddAcount.setData(data);
                        layer1.sChange(view.find(".js-addAcount"),"编辑收款账号",function (number){
                            if ($(".js-addAcount").valid()) {
                                var accountData = ctrl.vmaddAcount.collectData();
                                ctrl.vmaddAcount.reset();
                                accountWrap.loadTemplate($(".js-bid-getCountData-tpl"),accountData,{
                                    success:function(){
                                        financeShowHide(accountData);
                                        acountEaitFun(accountData);
                                    }
                                });
                                layer1.closeIt(number);
                            }
                        },["400px","550px"]);
                    });
                };
                acountEaitFun(data.acount);
                var fareInput = ctrl.view.el.find(".fare_validate_state");
                if (fareInput) {
                    fareInput.addClass('ignore');
                }
                var premiumInput = ctrl.view.el.find(".premium_validate_state");
                if (premiumInput) {
                    premiumInput.addClass('ignore');
                }
                var trayTypeHiddenInput = ctrl.view.el.find(".trayTypeHiddenInput");
                if (trayTypeHiddenInput) {
                    trayTypeHiddenInput.addClass('ignore');
                }

                //价格条款不选中其它不验证其它下拉框
                var priceTermOtherHiddenInputFunction = function(){
                    var priceTermOtherHiddenInput = ctrl.view.el.find(".priceTermOtherHiddenInput");
                    if (priceTermOtherHiddenInput) {
                        priceTermOtherHiddenInput.addClass('ignore');
                    }
                };


                var priceClause = ctrl.view.el.find(".js-priceClause");
                var premium = ctrl.view.el.find(".js-premium");
                var fare = ctrl.view.el.find(".js-fare");
                var priceTermRadio = ctrl.view.el.find(".priceTermRadio");
                var priceTermHiddenInput = ctrl.view.el.find(".priceTermHiddenInput");
                var priceTermError = ctrl.view.el.find(".price-term-error");
                var priceTermOther = ctrl.view.el.find(".js-priceTermOther");
                priceClause.find("input").click(function(){
                    priceTermError.html("");
                    switch(Number($(this).val())){
                        case 0:
                            premium.css("display","none");
                            fare.css("display","none");
                            priceTermOther.css("display","none");
                            priceTermHiddenInput.val(priceTermRadio.val());
                            priceTermOtherHiddenInputFunction();
                            break;
                        case 1:
                            premium.css("display","block");
                            fare.css("display","block");
                            priceTermOther.css("display","none");
                            priceTermHiddenInput.val(priceTermRadio.val());
                            priceTermOtherHiddenInputFunction();
                            break;
                        case 2:
                            premium.css("display","none");
                            fare.css("display","block");
                            priceTermOther.css("display","none");
                            priceTermHiddenInput.val(priceTermRadio.val());
                            priceTermOtherHiddenInputFunction();
                            break;
                        case 3:
                            premium.css("display","none");
                            fare.css("display","none");
                            priceTermOther.css("display","inline-block");
                            var priceTermOtherHiddenInput = ctrl.view.el.find(".priceTermOtherHiddenInput");
                            if (priceTermOtherHiddenInput) {
                                priceTermOtherHiddenInput.removeClass('ignore');
                            }
                            break;
                    }
                });

                if(data.priceTerm && data.priceTerm < 3){
                    if(data.priceTerm == 0){
                        premium.css("display","none");
                        fare.css("display","none");
                    }else if(data.priceTerm == 2){
                        premium.css("display","none");
                    }
                    priceTermHiddenInput.val(data.priceTerm);
                    priceTermOther.css("display","none");
                    priceTermOtherHiddenInputFunction();
                }else if(data.priceTerm =3){
                    priceTermOther.css("display","block");
                    premium.css("display","none");
                    fare.css("display","none");
                }

                var packageTypeRadio = ctrl.view.el.find(".packageTypeRadio");
                var packageTypeRadioError = ctrl.view.el.find(".package-type-error");
                var packageTypeHiddenInput = ctrl.view.el.find(".packageTypeHiddenInput");
                if(data.packageType){
                    packageTypeHiddenInput.val(packageTypeRadio.val());
                }
                packageTypeRadio.change(function(){
                    packageTypeRadioError.html("");
                    packageTypeHiddenInput.val(packageTypeRadio.val());
                });

                var trayTypedRadio = ctrl.view.el.find(".trayTypedRadio");
                var trayTypeHiddenInput = ctrl.view.el.find(".trayTypeHiddenInput");
                var trayTypedRadioError = ctrl.view.el.find(".tray-type-error");
                var trayType = ctrl.view.el.find(".js-trayType");
                if(data.packagingMaterial == 4){
                    trayType.css("display","block");
                }
                if(data.trayType){
                    trayTypeHiddenInput.val(data.trayType);
                }
                trayTypedRadio.change(function(){
                    trayTypedRadioError.html("");
                    trayTypeHiddenInput.val(trayTypedRadio.val());
                });

                var detailConfirmedRadio = ctrl.view.el.find(".detailConfirmedRadio");
                var detailConfirmedHiddenInput = ctrl.view.el.find(".detailConfirmedHiddenInput");
                var detailConfirmedError = ctrl.view.el.find(".detail-confirmed-error");
                if(data.detailConfirmed){
                    detailConfirmedHiddenInput.val(data.detailConfirmed);
                }
                detailConfirmedRadio.change(function(){
                    detailConfirmedError.html("");
                    detailConfirmedHiddenInput.val(detailConfirmedRadio.val());
                });

                var exportGoodsLocationSecondSelect = ctrl.view.el.find(".export-goods-location-second-select").find("ul.dropdown");
                exportGoodsLocationSecondSelect.click(function(event){
                    if(event.target.tagName =="LI" || event.target.tagName =="SPAN") {
                        var exportGoodsLocationError = ctrl.view.el.find(".export-goods-location-error");
                        if (exportGoodsLocationError) {
                            exportGoodsLocationError.hide();
                        }
                        var exportGoodsLocationHiddenInput = ctrl.view.el.find(".exportGoodsLocationHiddenInput");
                        if (exportGoodsLocationHiddenInput) {
                            exportGoodsLocationHiddenInput.addClass('ignore');
                        }
                    }
                });

                var contactsWrap = ctrl.view.el.find(".js-contacts");
                //联系人信息回填
                contactsWrap.loadTemplate($(".js-bid-getContactsData-tpl"),data.exportContacts);

                //联系人编辑功能
                var contactsEaitFun = function(data){
                    var contactsEait = ctrl.view.el.find(".js-contactsEait");
                    contactsEait.click(function(){
                        ctrl.vmaddContacts.setData(data);
                        layer.open({
                            type : 1,
                            content:view.find(".js-addContacts"),
                            title :"编辑联系人",
                            area: ["400px","466px"],
                            btn:["保存"],
                            yes : function(index){
                                if ($(".js-addContacts").valid()) {
                                    var contactsData = ctrl.vmaddContacts.collectData();
                                    ctrl.vmaddContacts.reset();
                                    contactsWrap.loadTemplate($(".js-bid-getContactsData-tpl"),contactsData,{
                                        success:function(){
                                            contactsEaitFun(contactsData);
                                        }
                                    });
                                    layer.close(index);
                                }
                            }
                        });
                    });
                };
                contactsEaitFun(data.exportContacts);

                var currencyUnitSelect;
                var currencyUnit = ctrl.view.el.find(".js-currencyUnit");
                if(currencyUnitSelect){
                    currencyUnit.html("("+currencyUnitSelect+")");
                }

                ctrl.vmaddGood =ctrl.getViewModel(ctrl.view.el.find(".js-addGood"),{meta:{"attribute":{dataSource:attributeArr}}});
                ctrl.vmaddGood.initControl();
                ctrl.vmaddInternationalTrader =ctrl.getViewModel(ctrl.view.el.find(".js-addInternationalTrader"));
                ctrl.vmaddInternationalTrader.initControl();
                ctrl.vmaddExportGoodsLocation =ctrl.getViewModel(ctrl.view.el.find(".js-addExportGoodsLocation"),{meta:{"exportGoodsLocation":{dataSource:addressData}}});
                ctrl.vmaddExportGoodsLocation.initControl();
                var packageValue = ctrl.view.el.find(".js-packageValue");
                var unitPrice = ctrl.view.el.find(".js-unitPrice");
                var quantityUnit = ctrl.view.el.find(".js-quantityUnit");
                var mul = function (arg1, arg2) {
                    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
                    try{ m += s1.split(".")[1].length } catch(e) {}
                    try{ m += s2.split(".")[1].length } catch(e) {}
                    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
                };
                var value;
                ctrl.view.el.find(".js-unitPrice").bind("mouseout",function(){
                    value = mul(Number(quantityUnit.val()), Number(unitPrice.val()));
                    packageValue.html(value);
                });
                ctrl.view.el.find(".js-quantityUnit").bind("mouseout",function(){
                    value = mul(Number(quantityUnit.val()), Number(unitPrice.val()));
                    packageValue.html(value);
                });

                var wrapAddDispatchList = ctrl.view.el.find(".js-wrapAddDispatchList");
                var wrapAddInternationalTrader = ctrl.view.el.find(".js-wrapAddInternationalTrader");
                var wrapAddExportGoodsLocation = ctrl.view.el.find(".js-wrapAddExportGoodsLocation");
                var dispatchList = ctrl.view.el.find(".js-dispatchList");
                var wrapGood = ctrl.view.el.find(".js-wrapGood");
                var internationalTrader = ctrl.view.el.find(".js-internationalTrader");
                var wrapInternationalTrader = ctrl.view.el.find(".js-wrapInternationalTrader");
                var exportGoodsLocation  = ctrl.view.el.find(".js-exportGoodsLocation");
                var wrapExportGoodsLocation  = ctrl.view.el.find(".js-wrapExportGoodsLocation");
                var totalExportGoodsLocation,totalNetWeight,totalGrosWeight,totalGoodsCount,totalValue;
                var data2 = [];
                var dataGoodsLocation ={};
                var dataTrader ={};
                var getAddGoodNum = function (data,deleeteData){
                    var priceClause = ctrl.view.el.find(".js-packageNumber");
                    if(deleeteData){
                        data2=data;
                    }else{
                        data2.push(data);
                    }
                    var TOTALNETWEIGHT =0,TOTALGROSWEIGHT =0,TOTALGOODSCOUNT =0,TOTALVALUE =0;
                    totalExportGoodsLocation = ctrl.view.el.find(".js-totalExportGoodsLocation");
                    totalNetWeight = ctrl.view.el.find(".js-totalNetWeight");
                    totalGrosWeight = ctrl.view.el.find(".js-totalGrosWeight");
                    totalGoodsCount = ctrl.view.el.find(".js-totalGoodsCount");
                    totalValue = ctrl.view.el.find(".js-totalValue");

                    totalExportGoodsLocation.css("display","block");
                    var currencyUnit = ctrl.view.el.find(".js-currencyUnit");
                    if(currencyUnitSelect){
                        currencyUnit.html("("+currencyUnitSelect+")");
                    }
                    var addGoodNum = wrapGood.find(".js-addGoodNum");
                    priceClause.html(addGoodNum.length);

                    $.each(data2,function(i,item){
                        TOTALNETWEIGHT +=Number(item.netWeight);
                        TOTALGROSWEIGHT +=Number(item.grosWeight);
                        TOTALGOODSCOUNT +=Number(item.quantity);
                        TOTALVALUE +=Number(item.packageValue);
                    });
                    totalNetWeight.html(TOTALNETWEIGHT);
                    totalGrosWeight.html(TOTALGROSWEIGHT);
                    totalGoodsCount.html(TOTALGOODSCOUNT);
                    totalValue.html(TOTALVALUE);
                };

                var hidewrapAddInternationalTrader = function (data){
                    dataTrader = data;
                    var wrapAddInternationalTrader = ctrl.view.el.find(".js-wrapAddInternationalTrader");
                    var interTraderEait = ctrl.view.el.find(".js-interTraderEait");
                    wrapAddInternationalTrader.css("display","none");
                    interTraderEait.click(function(){
                        var data = dataTrader;
                        ctrl.vmaddInternationalTrader.setData(data);
                        layer.open({
                            type : 1,
                            content:view.find(".js-addInternationalTrader"),
                            title :"修改境外贸易商",
                            area:["500px","535px"],
                            btn:["保存"],
                            yes : function(index){
                                if($(".js-addInternationalTrader").valid()){
                                    var newData = ctrl.vmaddInternationalTrader.collectData();
                                    dataTrader = newData;
                                    wrapInternationalTrader.loadTemplate($(".js-bid-getInternationalTraderData-tpl"), newData,{
                                        success:function(){
                                            hidewrapAddInternationalTrader(newData);
                                            layer1.closeIt(index);
                                        }
                                    });
                                }
                            }
                        });
                    })
                };

                var hidewrapAddExportGoodsLocation = function (data){
                    dataGoodsLocation = data;
                    var wrapAddExportGoodsLocation = ctrl.view.el.find(".js-wrapAddExportGoodsLocation");
                    var goodsLocationEdit = ctrl.view.el.find(".js-goodsLocationEdit");
                    wrapAddExportGoodsLocation.css("display","none");
                    goodsLocationEdit.click(function(){
                        var data = dataGoodsLocation;
                        ctrl.vmaddExportGoodsLocation.setData(data);
                        layer.open({
                            type : 1,
                            content:view.find(".js-addExportGoodsLocation"),
                            title :"修改货物存放地址",
                            area:["500px","500px"],
                            btn:["保存"],
                            yes : function(index){
                                if($(".js-addExportGoodsLocation").valid()){
                                    var newData = ctrl.vmaddExportGoodsLocation.collectData();
                                    dataGoodsLocation = newData;
                                    wrapExportGoodsLocation.loadTemplate($(".js-bid-getExportGoodsLocationData-tpl"), newData,{
                                        success:function(){
                                            hidewrapAddExportGoodsLocation(newData);
                                            layer1.closeIt(index);
                                        }
                                    });
                                }
                            }
                        });
                    })
                };

                //检测是否只有一个删除按钮
                var isOneDeleteButton = function (sure, yes){
                    var deleteButtonFirst = wrapGood.find(".js-delete").first();
                    sure ? yes ? deleteButtonCount-- : deleteButtonCount++ : "";
                    if (deleteButtonCount >= 1) {
                        deleteButtonFirst.hide();
                    } else {
                        deleteButtonFirst.show();
                    }
                };

                var exportGoodsList = X.config.customerClearance.tpl.exportGoodsList;
                //商品添加功能
                var exportGoodsListFunction = function(data,type){
                    $(".js-wrapGood").loadTemplate(exportGoodsList, data,{
                        success:function(){
                            //最少添加一条，故添加的第一条隐藏删除按钮
                            isOneDeleteButton(true);

                            var showHide = function(data){
                                //此处没有新添加情况，所以去掉判断新添加和数据回填的数据添加展开功能
                                //新添加时只给最后一个也就是新添加的展开按钮添加展开功能
                                //数据回填时，给所有的展开按钮添加展开功能
                                var showHide;
                               /* if(data){
                                    showHide = ctrl.view.el.find(".js-showHide").last();
                                }else{
                                    showHide = ctrl.view.el.find(".js-showHide");
                                }*/
                                showHide = ctrl.view.el.find(".js-showHide");
                                showHide.attr("onOff","off");
                                showHide.click(function(event){
                                    var onOff = $(this).attr("onOff");
                                    if(onOff == "off"){
                                        $(this).html("收起");
                                        $(this).attr("onOff","on");
                                        $(this).parent().removeClass("current")
                                    }else if(onOff == "on"){
                                        $(this).html("展开");
                                        $(this).attr("onOff","off");
                                        $(this).parent().addClass("current")
                                    }
                                });

                                var bordashedError = ctrl.view.el.find(".bordashed-error");
                                if (bordashedError) {
                                    bordashedError.hide();
                                }
                                var bordashedHiddenInput = ctrl.view.el.find(".bordashedHiddenInput");
                                if (bordashedHiddenInput) {
                                    bordashedHiddenInput.addClass('ignore');
                                }
                            };
                            showHide(true);
                            if(type){
                                getAddGoodNum(data,type);
                            }else{
                                getAddGoodNum(data);
                            }

                            var editExportGoods = function(getData){
                                var buttonNone = ctrl.view.el.find(".js-buttonNone");
                                buttonNone.css("display","block");
                                var num = Number(ctrl.view.el.find(".js-packageNumber").text());
                                var editButton,deleteButton;
                                var edit = wrapGood.find(".js-edit").last();
                                var editArror = wrapGood.find(".js-edit");
                                var deleteArror = wrapGood.find(".js-delete");
                                var deleteData = wrapGood.find(".js-delete").last();
                                var deleteGoodNum = wrapGood.find(".js-addGoodNum");
                                var totalExportGoodsNum = ctrl.view.el.find(".js-totalExportGoodsLocation");
                                //此处没有新添加情况，所以去掉判断新添加和数据回填的事件添加对象
                                //新添加时只给最后一个也就是新添加的编辑按钮添加编辑功能
                                //数据回填时，给所有的编辑按钮添加编辑功能
                                /*if(getData){
                                    editButton = editArror;
                                    deleteButton = deleteArror;
                                }else{
                                    editButton = edit;
                                    deleteButton = deleteData;
                                }*/
                                editButton = editArror;
                                deleteButton = deleteArror;
                                editButton.click(function(event){
                                    var target;
                                    if(event.target.tagName =="SPAN"){
                                        target = $(event.target).parent("p").parent("div").index();
                                    }else if(event.target.tagName =="I"){
                                        target = $(event.target).parent("span").parent("p").parent("div").index();
                                    }
                                    var getIndex = Number(target);
                                    var data = data2[getIndex];
                                    ctrl.vmaddGood.setData(data);
                                    layer.open({
                                        type : 1,
                                        content:view.find(".js-addGood"),
                                        title :"修改货品",
                                        area:["740px","790px"],
                                        btn:["保存"],
                                        yes : function(index){
                                            if ($(".js-addGood").valid()) {
                                                var exportGoodsList = X.config.customerClearance.tpl.exportGoodsList;
                                                var newData = ctrl.vmaddGood.collectData();
                                                ctrl.vmaddGood.reset();
                                                data2[getIndex] = newData;
                                                $(".js-wrapGood").loadTemplate(exportGoodsList, data2,{
                                                    success:function(){
                                                        getAddGoodNum(data2,1);
                                                        editExportGoods(1);
                                                        showHide();
                                                        layer1.closeIt(index);
                                                    }
                                                });
                                                isOneDeleteButton();
                                            }
                                        }
                                    });
                                });
                                deleteButton.click(function(event){
                                    var target;
                                    if(event.target.tagName =="SPAN"){
                                        target = $(event.target).parent("p").parent("div").index();
                                    }else if(event.target.tagName =="I"){
                                        target = $(event.target).parent("span").parent("p").parent("div").index();
                                    }
                                    var getIndex =Number(target);
                                    if(getIndex >= 0){
                                        deleteGoodNum[getIndex].remove();
                                        deleteGoodNum.splice(getIndex,1);
                                    }
                                    data2.splice(getIndex,1);
                                    getAddGoodNum(data2,true);
                                    if(deleteGoodNum.length == 0){
                                        totalExportGoodsNum.css("display","none");
                                    }
                                    isOneDeleteButton(true,true);
                                });
                            };
                            editExportGoods();
                        },
                        append:true
                    });
                };
                //货品信息回填
                if(data.exportGoods.length>0){
                    deleteButtonCount = data.exportGoods.length;
                    exportGoodsListFunction(data.exportGoods,1);
                }

                //境外贸易商信息回填
                if(data.internationalTrader){
                    wrapInternationalTrader.loadTemplate($(".js-bid-getInternationalTraderData-tpl"), data.internationalTrader,{
                        success:function(){
                            hidewrapAddInternationalTrader(data.internationalTrader);
                            var internationalTraderHiddenInput = ctrl.view.el.find(".internationalTraderHiddenInput");
                            if (internationalTraderHiddenInput) {
                                internationalTraderHiddenInput.addClass('ignore');
                            }
                        }
                    });
                }

                //自定义属性
                $.addTemplateFormatter({
                    //货品存放地址
                    exchangeaddressFormater: function (value, template) {
                        if(value !=""){
                            return addressData.getPro(value.province)+"-"+addressData.getCity(value.city);
                        }
                    },
                    //货品属性
                    attributeFormater:function (value, template) {
                        if(value>=0){
                            return customerClearanceModel.const.exportGoods.attribute[value];
                        }
                    }
                });
                //提货地址信息回填
                if(data.exportGoodsLocation){
                    data.exportGoodsLocation.exportGoodsLocation = {
                        city:data.exportGoodsLocation.city,
                        province:data.exportGoodsLocation.province
                    };
                    wrapExportGoodsLocation.loadTemplate($(".js-bid-getExportGoodsLocationData-tpl"), data.exportGoodsLocation,{
                        success:function(){
                            hidewrapAddExportGoodsLocation(data.exportGoodsLocation);
                            var exportGoodsLocationFirstHiddenInput = ctrl.view.el.find(".exportGoodsLocationFirstHiddenInput");
                            if (exportGoodsLocationFirstHiddenInput) {
                                exportGoodsLocationFirstHiddenInput.addClass('ignore');
                            }
                        }
                    });
                }

                wrapAddDispatchList.click(function(){
                    ctrl.vmaddGood.reset();
                    layer.open({
                        type : 1,
                        content:view.find(".js-addGood"),
                        title :"添加货品",
                        area:["740px","768px"],
                        btn:["保存"],
                        yes : function(index){
                            if ($(".js-addGood").valid()) {
                                var data = ctrl.vmaddGood.collectData();
                                ctrl.vmaddGood.reset();
                                exportGoodsListFunction(data);
                                layer1.closeIt(index);
                            }
                        }
                    });
                });

                //点击取消按钮，跳到详情页面
                ctrl.view.el.find(".js-cancel").click(function(){
                    X.router.run("m=customerClearance.clearanceDetail&exportFormId=" + data["exportFormId"], '通关结汇处理详情');
                });

                // 修改收款帐号验证
                $(".js-addAcount").validate({
                    rules: {
                        accountName: {
                            required: true,
                            maxlength: 50
                        },
                        bankName: {
                            required: true,
                            maxlength: 50
                        },
                        bankAccount: {
                            required: true,
                            digits: true,
                            maxlength: 20
                        },
                        bankContacts:{
                            maxlength: 10
                        },
                        bankImEmail:{
                            maxlength: 16
                        },
                        bankPhoneNumber:{
                            maxlength: 20
                        }
                    },
                    messages: {
                        accountName: {
                            required: "请填写开户名",
                            maxlength: "请填写正确的开户名"
                        },
                        bankName: {
                            required: "请填写开户行",
                            maxlength: "请填写正确的开户行"
                        },
                        bankAccount: {
                            required: "请填写银行帐号",
                            digits: "请填写正确的银行帐号",
                            maxlength: "请填写正确的银行帐号"
                        },
                        bankContacts:{
                            maxlength: "超出10个字符"
                        },
                        bankImEmail:{
                            maxlength: "超出16个字符"
                        },
                        bankPhoneNumber:{
                            maxlength: "超出20个字符"
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

                // 修改联系人验证
                $(".js-addContacts").validate({
                    rules: {
                        contacts: {
                            required: true,
                            maxlength: 10
                        },
                        phone: {
                            required: true,
                            minlength: 11,
                            maxlength: 11,
                            digits: true
                        },
                        mobile: {
                            required: true,
                            maxlength: 20,
                            digits: true
                        },
                        email: {
                            email:true,
                            maxlength: 30
                        }
                    },
                    messages: {
                        contacts: {
                            required: "请填写联系人姓名",
                            maxlength: "请填写正确的联系人姓名"
                        },
                        phone: {
                            required: "请填写手机号码",
                            minlength: "请填写正确的手机号码",
                            maxlength: "请填写正确的手机号码",
                            digits: "请填写正确的手机号码"
                        },
                        mobile: {
                            required: "请填写联系电话",
                            maxlength: "请填写正确的联系电话",
                            digits: "请填写正确的联系电话"
                        },
                        email: {
                            email: "请填写正确的邮箱",
                            maxlength: "请填写正确的邮箱"
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

                // 修改货品验证
                $(".js-addGood").validate({
                    rules: {
                        nameCn: {
                            required: true,
                            rangelength: [2, 20]
                        },
                        nameEn: {
                            required: true,
                            isEnglish: true,
                            maxlength: 50
                        },
                        hsCode: {
                            required: true,
                            digits:true,
                            maxlength: 10
                        },
                        originCountry: {
                            maxlength: 15,
                            isContainsSpecialCharNotSpace: true,
                            isNoDigits: true
                        },
                        category: {
                            maxlength: 15,
                            isContainsSpecialCharNotSpace: true,
                            isNoDigits: true
                        },
                        brand: {
                            maxlength: 10,
                            isContainsSpecialCharNotSpace: true,
                            isNoDigits: true
                        },
                        model: {
                            maxlength: 50
                        },
                        texture: {
                            maxlength: 10
                        },
                        goodsUsage: {
                            maxlength: 50
                        },
                        manufacturer: {
                            required: true,
                            maxlength: 15,
                            isContainsSpecialCharNotSpace: true,
                            isNoDigits: true
                        },
                        goodsSize: {
                            required: true,
                            maxlength: 50
                        },
                        packageCount: {
                            required: true,
                            digits:true,
                            rangelength: [1, 5]
                        },
                        netWeight: {
                            required: true,
                            number:true,
                            maxlength:7,
                            isNumberFloat2: true
                        },
                        grosWeight: {
                            required: true,
                            number:true,
                            maxlength:7,
                            isNumberFloat2: true
                        },
                        quantity: {
                            required: true,
                            digits: true,
                            rangelength: [1, 6]
                        },
                        unit: {
                            required: true,
                            maxlength: 5,
                            isContainsSpecialCharNotSpace: true,
                            isNoDigits: true
                        },
                        unitPrice: {
                            required: true,
                            maxlength: 10,
                            isNumberFloat2: true
                        }
                    },
                    messages: {
                        nameCn: {
                            required: "请填写货品名称",
                            rangelength: "请填写正确的货品名称"
                        },
                        nameEn: {
                            required: "请填写英文名称",
                            isEnglish: "请填写正确的英文名称",
                            maxlength: "请填写正确的英文名称"
                        },
                        hsCode: {
                            required: "请填写HSCode",
                            digits: "请填写正确的HSCode",
                            maxlength: "请填写正确的HSCode"
                        },
                        originCountry: {
                            maxlength: "请填写正确的原产国",
                            isContainsSpecialCharNotSpace: "请填写正确的原产国",
                            isNoDigits: "请填写正确的原产国"
                        },
                        category: {
                            maxlength: "请填写正确的种类",
                            isContainsSpecialCharNotSpace: "请填写正确的种类",
                            isNoDigits: "请填写正确的种类"
                        },
                        brand: {
                            maxlength: "请填写正确的品牌",
                            isContainsSpecialCharNotSpace: "请填写正确的品牌",
                            isNoDigits: "请填写正确的品牌"
                        },
                        model: {
                            maxlength: "输入内容不能大于50个字符"
                        },
                        texture: {
                            maxlength: "请填写正确的材质"
                        },
                        goodsUsage: {
                            maxlength: "请填写正确的用途"
                        },
                        manufacturer: {
                            required: "请填写生产厂家",
                            maxlength: "请填写正确的生产厂家",
                            isContainsSpecialCharNotSpace: "请填写正确的生产厂家",
                            isNoDigits: "请填写正确的生产厂家"
                        },
                        goodsSize: {
                            required: "请填写包装/托盘尺寸",
                            maxlength: "输入内容不能大于50个字符"
                        },
                        packageCount: {
                            required: "请填写包装件数",
                            digits: "请填写正确的包装件数",
                            rangelength: "请填写正确的包装件数"
                        },
                        netWeight: {
                            required: "请填写净重量",
                            number: "请填写正确的净重量",
                            maxlength: "请填写正确的净重量",
                            isNumberFloat2: "请填写正确的净重量"
                        },
                        grosWeight: {
                            required: "请填写毛重量",
                            number: "请填写正确的毛重量",
                            maxlength: "请填写正确的毛重量",
                            isNumberFloat2: "请填写正确的毛重量"
                        },
                        quantity: {
                            required: "请填写数量",
                            digits: "请填写正确的数量",
                            rangelength: "请填写正确的数量",
                        },
                        unit: {
                            required: "请填写单位",
                            maxlength: "请填写正确的单位",
                            isContainsSpecialCharNotSpace: "请填写正确的单位",
                            isNoDigits: "请填写正确的单位"
                        },
                        unitPrice: {
                            required: "请填写单价",
                            maxlength: "请填写正确的单价",
                            isNumberFloat2: "请填写正确的单价"
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

                // 修改境外贸易商验证
                $(".js-addInternationalTrader").validate({
                    rules: {
                        name: {
                            required: true,
                            maxlength: 15
                        },
                        nation: {
                            required: true,
                            maxlength: 15
                        },
                        address: {
                            required: true,
                            maxlength: 50
                        },
                        phone: {
                            required: true,
                            digits: true,
                            maxlength: 20
                        },
                        fax: {
                            digits: true,
                            maxlength: 11
                        }
                    },
                    messages: {
                        name: {
                            required: "请填写名称",
                            maxlength: "请填写正确的名称"
                        },
                        nation: {
                            required: "请填写国家",
                            maxlength: "请填写正确的国家"
                        },
                        address: {
                            required: "请填写地址",
                            maxlength: "请填写正确的地址"
                        },
                        phone: {
                            required: "请填写电话",
                            digits: "请填写正确的电话",
                            maxlength: "请填写正确的电话"
                        },
                        fax: {
                            digits: "请填写正确的传真",
                            maxlength: "请填写正确的传真",
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

                // 修改货物存放地址验证
                $(".js-addExportGoodsLocation").validate({
                    ignore: ".ignore",
                    rules: {
                        locationId: {
                            required: true
                        },
                        address: {
                            required: true,
                            maxlength: 50
                        },
                        contacts: {
                            required: true,
                            maxlength: 15
                        },
                        phone: {
                            required: true,
                            minlength: 11,
                            maxlength: 11,
                            digits: true
                        }
                    },
                    messages: {
                        locationId: {
                            required: "请选择地址"
                        },
                        address: {
                            required: "请填写存放地址",
                            maxlength: "请填写正确的存放地址"
                        },
                        contacts: {
                            required: "请填写货物联系人",
                            maxlength: "请填写正确的货物联系人"
                        },
                        phone: {
                            required: "请填写联系电话",
                            minlength: "请填写正确的手机号码",
                            maxlength: "请填写正确的手机号码",
                            digits: "请填写正确的手机号码"
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

                ctrl.getData = function(){
                    var data = ctrl.vmdeclare.collectData();
                    data.exportGoods = data2;
                    ctrl.vmeditInternationalTrader = ctrl.getViewModel(ctrl.view.el.find(".js-wrapInternationalTrader"));
                    ctrl.vmeditInternationalTrader.initControl();
                    ctrl.vmeditExportGoodsLocation = ctrl.getViewModel(ctrl.view.el.find(".js-wrapExportGoodsLocation"));
                    ctrl.vmeditExportGoodsLocation.initControl();

                    ctrl.vmEditAcount =ctrl.getViewModel(ctrl.view.el.find(".js-account"));
                    ctrl.vmEditAcount.initControl();
                    ctrl.vmEditContacts =ctrl.getViewModel(ctrl.view.el.find(".js-contacts"));
                    ctrl.vmEditContacts.initControl();
                    var accountData = ctrl.vmEditAcount.collectData();
                    var contactsData = ctrl.vmEditContacts.collectData();
                    data.accountName = accountData.accountName;
                    data.bankName = accountData.bankName;
                    data.bankAccount = accountData.bankAccount;
                    data.bankContacts = accountData.bankContacts;
                    data.bankImEmail = accountData.bankImEmail;
                    data.bankPhoneNumber = accountData.bankPhoneNumber;
                    data.contacts = contactsData.contacts;
                    data.mobile = contactsData.mobile;
                    data.phone = contactsData.phone;
                    data.email = contactsData.email;

                    data.internationalTrader  = ctrl.vmeditInternationalTrader.collectData();
                    data.exportGoodsLocation = ctrl.vmeditExportGoodsLocation.collectData();

                    var exportGoodsLocationArr = [];
                    exportGoodsLocationArr = data.exportGoodsLocation.exportGoodsLocation.split("-");
                    data.exportGoodsLocation.province = addressData.getProId(exportGoodsLocationArr[0]);
                    data.exportGoodsLocation.city = addressData.getCityId(exportGoodsLocationArr[1]);
                    data.exportFormId = getInfoData.exportFormId;
                    delete data.exportGoodsLocation.exportGoodsLocation;

                    if(data.priceTerm == 3){
                        data.priceTerm = data.priceTermOther;
                        delete data.fare;
                        delete data.premium;
                    }else if(data.priceTerm == 2){
                        delete data.premium;
                    }else if(data.priceTerm == 0){
                        delete data.fare;
                        delete data.premium;
                    }

                    delete data.priceTermOther;

                    if(data.contractType == 2){
                        delete data.contractNumber;
                    }

                    return data;
                };
                ctrl.errorLength = function(){
                    var wrapError = ctrl.view.el.find(".js-error");
                    var wrapErrorHtml;
                    var array = [];
                    $.each(wrapError,function(){
                        wrapErrorHtml = $(this).html();
                        if(wrapErrorHtml == ""){
                            array.push(true);
                        }else{
                            array.push(false);
                        }
                    });
                    if($.inArray(false, array) == -1){
                        return true;
                    }else{
                        return false;
                    }
                };
                ctrl.submit = function(){
                    if ($(".js-declare").valid()) {
                        var data = ctrl.getData();
                        var callback = function (result) {
                            if (result.statusCode == 2000000) {
                                console.log("提交成功");
                                layer1.sMsg("提交成功", function (number) {
                                    layer1.closeIt(number);
                                    menuCall("customerClearance.clearanceDetail",para["exportFormId"]);
                                });
                            }
                        };
                        clearanceModel.applyClearance(data, callback);
                    }
                };

                ctrl.addEvent("click", ".js-submit", "submit");

            });
        });
    };

    function menuCall(mid,para){
        X.router.run("m="+mid+"&exportFormId=" + para);
        //X.publish(X.constant.channel.menuCall,{m:mid});
    }
    return ctrl;
});
