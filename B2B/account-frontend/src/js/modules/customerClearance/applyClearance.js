/**
 * Created by Administrator on 2016/10/13.
 */
X.define("modules.customerClearance.applyClearance",["adapter.webuploader","common.layer","adapter.laydate","data.addressData","model.clearanceModel","model.customerClearanceModel","data.currencyData"],function (webuploader,layer1,laydate,addressData,clearanceModel,customerClearanceModel,currencyData) {
    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.customerClearance.tpl.applyClearance
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.load = function (para) {
        ctrl.rendering();
    };

    ctrl.rendering = function () {
        return view.render({}, function () {
            var currencyArr = customerClearanceModel.const.currencyArr;
            var packingAllMethodArr = customerClearanceModel.const.packingAllMethodArr;
            var contractTypeArr = customerClearanceModel.const.contractTypeArr;
            var attributeArr = customerClearanceModel.const.attributeArr;
            var deleteButtonCount = 0;
            ctrl.vmdeclare =ctrl.getViewModel(ctrl.view.el.find(".js-declare"),{meta: {"shipmentDate":{
                min:laydate.now(),
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
            }},"packagingMaterial":{dataSource:packingAllMethodArr,selectedChanged:function(item){
                var trayType = ctrl.view.el.find(".js-trayType");
                  if(Number(item.key) == 4){
                      trayType.css("display","block");
                      var trayTypeError = ctrl.view.el.find(".tray-type-error");
                      if (trayTypeError) {
                          trayTypeError.show();
                      }
                      var trayTypeErrorLabel = ctrl.view.el.find(".tray-type-error").find("label");
                      if (trayTypeErrorLabel) {
                          trayTypeErrorLabel.text("");
                      }
                      var trayTypeHiddenInput = ctrl.view.el.find(".trayTypeHiddenInput");
                      if (trayTypeHiddenInput) {
                          trayTypeHiddenInput.removeClass('ignore');
                      }
                  }else{
                      trayType.css("display","none");
                      var trayTypeError = ctrl.view.el.find(".tray-type-error");
                      if (trayTypeError) {
                          trayTypeError.hide();
                      }
                      var trayTypeHiddenInput = ctrl.view.el.find(".trayTypeHiddenInput");
                      if (trayTypeHiddenInput) {
                          trayTypeHiddenInput.addClass('ignore');
                      }
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
                "otherAttachments":{size: 20,type:5,maxNum:5,downloadType:2,filePicker:ctrl.view.el.find(".js-addotherAttachments").find(".filePicker").get(0),filePickerLabel:"上传附件"}}});
            ctrl.vmdeclare.initControl();
            scrollTo();

            ctrl.vmaddAcount =ctrl.getViewModel(ctrl.view.el.find(".js-addAcount"));
            ctrl.vmaddAcount.initControl();
            ctrl.vmaddContacts =ctrl.getViewModel(ctrl.view.el.find(".js-addContacts"));
            ctrl.vmaddContacts.initControl();

            var accountWrap = ctrl.view.el.find(".js-account");
            var accountWrapButton = ctrl.view.el.find(".js-showacountButton");
            var contactsWrap = ctrl.view.el.find(".js-contacts");
            var contactsWrapButton = ctrl.view.el.find(".js-showcontactsButton");
            var accountIdForShowHide;
            var contactsIdForShowHide;
            var showHide = function(showButton,data){
                var showHide = showButton;
                showHide.parent().siblings(data).children().css("display","none").first().css("display","block").find("input[type=radio]");
                showHide.attr("onOff","on");
                showHide.click(function(event){
                    if (data === ".js-account") {
                        ctrl.vmaddAcount.reset();
                        var accountcompanyBankAccountId = accountIdForShowHide;
                        var index = 0;
                        var selectFlg = false;
                        for (var i = 0, len = acountData.length; i < len; i++) {
                            if (acountData[i].accountcompanyBankAccountId === accountcompanyBankAccountId) {
                                index = i;
                                selectFlg = true;
                            }
                        }
                        var temp = X.clone(acountData[index]);
                        for (var i = index; i > 0; i--) {
                            acountData[i] = acountData[i - 1];
                        }
                        acountData[0] = temp;
                        accountWrap.loadTemplate($(".js-bid-getCountData-tpl"), acountData, {
                            success: function () {
                                contactsEaitFunction(1);
                            }
                        });
                        if (selectFlg) {
                            var companyBankAccountIdRadioFirst = ctrl.view.el.find(".company-bank-account-id-div").find(".radioBox").get(0).children[0];
                            companyBankAccountIdRadioFirst.checked = true;
                        }
                        var companyBankAccountIdRadio = ctrl.view.el.find(".company-bank-account-id-div").find(".radioBox");
                        companyBankAccountIdRadio.change(function(event){
                            accountIdForShowHide = event.target.id;
                            var companyBankAccountIdError = ctrl.view.el.find(".company-bank-account-id-error");
                            if (companyBankAccountIdError) {
                                companyBankAccountIdError.hide();
                            }
                            var companyBankAccountIdHiddenInput = ctrl.view.el.find(".companyBankAccountIdHiddenInput");
                            if (companyBankAccountIdHiddenInput) {
                                companyBankAccountIdHiddenInput.addClass('ignore');
                            }
                        });
                    } else if (data === ".js-contacts") {
                        ctrl.vmaddContacts.reset();
                        var contactsexportContactsId = contactsIdForShowHide;
                        var index = 0;
                        var selectFlg = false;
                        for (var i = 0, len = contactsData.length; i < len; i++) {
                            if (contactsData[i].contactsexportContactsId === contactsexportContactsId) {
                                index = i;
                                selectFlg = true;
                            }
                        }
                        var temp = X.clone(contactsData[index]);
                        for (var i = index; i > 0; i--) {
                            contactsData[i] = contactsData[i - 1];
                        }
                        contactsData[0] = temp;
                        contactsWrap.loadTemplate($(".js-bid-getContactsData-tpl"), contactsData, {
                            success: function () {
                                contactsEaitFunction(1);
                            }
                        });
                        if (selectFlg) {
                            var exportContactsIdRadioFirst = ctrl.view.el.find(".export-contacts-id-div").find(".radioBox").get(0).children[0];
                            exportContactsIdRadioFirst.checked = true;
                        }
                        var exportContactsIdRadio = ctrl.view.el.find(".export-contacts-id-div").find(".radioBox");
                        exportContactsIdRadio.change(function (event) {
                            contactsIdForShowHide = event.target.id;
                            var exportContactsIdError = ctrl.view.el.find(".export-contacts-id-error");
                            if (exportContactsIdError) {
                                exportContactsIdError.hide();
                            }
                            var exportContactsIdHiddenInput = ctrl.view.el.find(".exportContactsIdHiddenInput");
                            if (exportContactsIdHiddenInput) {
                                exportContactsIdHiddenInput.addClass('ignore');
                            }
                        });
                    }

                    var onOff = $(this).attr("onOff");
                    if(onOff == "off"){
                        $(this).attr("onOff","on");
                        $(this).parent().siblings(data).children().css("display","none").first().css("display","block");
                    }else if(onOff == "on"){
                        $(this).attr("onOff","off");
                        $(this).parent().siblings(data).children().css("display","block");
                    }
                });
            };

            //获取账户列表
            var acountData = [];
            var getAcountListCallback = function(result){
                if(result.statusCode == 2000000){
                    if(result.data.length>0){
                        $.each(result.data,function(i,item){
                            result.data[i].accountcompanyBankAccountId ="account_"+result.data[i].companyBankAccountId;
                        });
                        accountWrap.loadTemplate($(".js-bid-getCountData-tpl"),result.data,{success:function(){
                            acountData = result.data;
                            showHide(accountWrapButton,".js-account");
                        }});

                        var companyBankAccountIdRadio = ctrl.view.el.find(".company-bank-account-id-div").find(".radioBox");
                        companyBankAccountIdRadio.change(function(){
                            var companyBankAccountIdError = ctrl.view.el.find(".company-bank-account-id-error");
                            if (companyBankAccountIdError) {
                                companyBankAccountIdError.hide();
                            }
                            var companyBankAccountIdHiddenInput = ctrl.view.el.find(".companyBankAccountIdHiddenInput");
                            if (companyBankAccountIdHiddenInput) {
                                companyBankAccountIdHiddenInput.addClass('ignore');
                            }
                        });
                    } else {
                        var companyBankAccountIdError = ctrl.view.el.find(".company-bank-account-id-error");
                        if (companyBankAccountIdError) {
                            companyBankAccountIdError.addClass("company-bank-account-id-upper-error");
                        }
                        var showAll = ctrl.view.el.find(".js-showacountButton");
                        if (showAll) {
                            showAll.hide();
                        }
                    }
                }
            };
            clearanceModel.getAcountList(getAcountListCallback);
            var acountButton = ctrl.view.el.find(".js-acountButton");
            acountButton.click(function(){
                ctrl.vmaddAcount.reset();
                layer1.successChange(view.find(".js-addAcount"),"添加收款账号",function (number){
                    if ($(".js-addAcount").valid()) {
                        var postAcountCallback = function (result) {
                            if (result.statusCode == 2000000) {
                                result.data[0].accountcompanyBankAccountId = "account_" + result.data[0].companyBankAccountId;
                                accountWrap.loadTemplate($(".js-bid-getCountData-tpl"), result.data[0], {
                                    success: function () {
                                        acountData.push(result.data[0]);
                                        accountWrapButton.parent().siblings(".js-account").children().css("display","none").first().css("display","block").find("input[type=radio]");
                                    }, prepend: true
                                });
                                var companyBankAccountIdRadio = ctrl.view.el.find(".company-bank-account-id-div").find(".radioBox").get(0).children[0];
                                companyBankAccountIdRadio.checked = true;
                                accountIdForShowHide = companyBankAccountIdRadio.attributes.id.value;
                                var companyBankAccountIdError = ctrl.view.el.find(".company-bank-account-id-error");
                                if (companyBankAccountIdError) {
                                    companyBankAccountIdError.removeClass("company-bank-account-id-upper-error");
                                }

                                var showAll = ctrl.view.el.find(".js-showacountButton");
                                if (showAll) {
                                    showAll.show();
                                }

                                var companyBankAccountIdRadio = ctrl.view.el.find(".company-bank-account-id-div").find(".radioBox");
                                companyBankAccountIdRadio.change(function(){
                                    var companyBankAccountIdError = ctrl.view.el.find(".company-bank-account-id-error");
                                    if (companyBankAccountIdError) {
                                        companyBankAccountIdError.hide();
                                    }
                                    var companyBankAccountIdHiddenInput = ctrl.view.el.find(".companyBankAccountIdHiddenInput");
                                    if (companyBankAccountIdHiddenInput) {
                                        companyBankAccountIdHiddenInput.addClass('ignore');
                                    }
                                });
                            }
                        };
                        var postAcountData = ctrl.vmaddAcount.collectData();
                        clearanceModel.postAcount(postAcountData, postAcountCallback);
                        layer1.closeIt(number);
                    }
                },["400px","415px"]);
            });

            var exchangeMethodRadio = ctrl.view.el.find(".exchangeMethodRadio");
            exchangeMethodRadio.change(function(){
                var exchangeMethodError = ctrl.view.el.find(".exchange-method-error");
                if (exchangeMethodError) {
                    exchangeMethodError.hide();
                }
                var exchangeMethodHiddenInput = ctrl.view.el.find(".exchangeMethodHiddenInput");
                if (exchangeMethodHiddenInput) {
                    exchangeMethodHiddenInput.addClass('ignore');
                }
            });

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

            var priceTermRadio = ctrl.view.el.find(".priceTermRadio");
            priceTermRadio.change(function(){
                var priceTermError = ctrl.view.el.find(".price-term-error");
                if (priceTermError) {
                    priceTermError.hide();
                }
                var priceTermHiddenInput = ctrl.view.el.find(".priceTermHiddenInput");
                if (priceTermHiddenInput) {
                    priceTermHiddenInput.addClass('ignore');
                }
                switch(Number($(this).val())){
                    case 0:
                        if (fareInput) {
                            fareInput.addClass('ignore');
                        }
                        if (premiumInput) {
                            premiumInput.addClass('ignore');
                        }
                        break;
                    case 1:
                        var fareError = ctrl.view.el.find(".fare-error").find("label");
                        if (fareError) {
                            fareError.text("");
                        }
                        var premiumError = ctrl.view.el.find(".premium-error").find("label");
                        if (premiumError) {
                            premiumError.text("");
                        }
                        if (fareInput) {
                            fareInput.removeClass('ignore');
                        }
                        if (premiumInput) {
                            premiumInput.removeClass('ignore');
                        }
                        break;
                    case 2:
                        var fareError = ctrl.view.el.find(".fare-error").find("label");
                        if (fareError) {
                            fareError.text("");
                        }
                        if (fareInput) {
                            fareInput.removeClass('ignore');
                        }
                        if (premiumInput) {
                            premiumInput.addClass('ignore');
                        }
                        break;
                }
            });

            var packageTypeRadio = ctrl.view.el.find(".packageTypeRadio");
            packageTypeRadio.change(function(){
                var packageTypeError = ctrl.view.el.find(".package-type-error");
                if (packageTypeError) {
                    packageTypeError.hide();
                }
                var packageTypeHiddenInput = ctrl.view.el.find(".packageTypeHiddenInput");
                if (packageTypeHiddenInput) {
                    packageTypeHiddenInput.addClass('ignore');
                }
            });

            var trayTypedRadio = ctrl.view.el.find(".trayTypedRadio");
            trayTypedRadio.change(function(){
                var trayTypeError = ctrl.view.el.find(".tray-type-error");
                if (trayTypeError) {
                    trayTypeError.hide();
                }
                var trayTypeHiddenInput = ctrl.view.el.find(".trayTypeHiddenInput");
                if (trayTypeHiddenInput) {
                    trayTypeHiddenInput.addClass('ignore');
                }
            });

            var detailConfirmedRadio = ctrl.view.el.find(".detailConfirmedRadio");
            detailConfirmedRadio.change(function(){
                var detailConfirmedErrorLabel = ctrl.view.el.find(".detail-confirmed-error").find("label");
                if (detailConfirmedErrorLabel) {
                    detailConfirmedErrorLabel.text("");
                }
                var detailConfirmedHiddenInput = ctrl.view.el.find(".detailConfirmedHiddenInput");
                if (detailConfirmedHiddenInput) {
                    detailConfirmedHiddenInput.addClass('ignore');
                }
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

            //联系人编辑功能
            var contactsData = [];
            var contactsEaitFunction = function(data){
                var contactsEait;
                if(data){
                    contactsEait = contactsWrap.find(".js-contactsEait");
                }else{
                    contactsEait = contactsWrap.find(".js-contactsEait").last();
                }
                contactsEait.click(function(event){
                    var target;
                    if(event.target.tagName =="I"){
                        target = $(event.target).parent("p").parent("span").parent("div").index();
                    }
                    var getIndex = Number(target);
                    var data = contactsData[getIndex];
                    ctrl.vmaddContacts.setData(data);
                    layer1.successChange(view.find(".js-addContacts"),"编辑联系人",function(number){
                        var newData = ctrl.vmaddContacts.collectData();
                        ctrl.vmaddContacts.reset();
                        var exportContactsId = contactsData[getIndex]["exportContactsId"];
                        for (var i = getIndex; i > 0; i--) {
                            contactsData[i] = contactsData[i - 1];
                        }
                        contactsData[0] = newData;
                        newData.exportContactsId = exportContactsId;
                        $.each(contactsData,function(i,item){
                            contactsData[i].contactsexportContactsId = "contacts_" + contactsData[i].exportContactsId;
                        });
                        contactsWrap.loadTemplate($(".js-bid-getContactsData-tpl"),contactsData,{success:function(){
                            var putContactsData = X.clone(newData);
                            delete  putContactsData.contactsexportContactsId;
                            var putContactsCallback = function(result){
                                if(result.statusCode == 2000000){
                                    contactsEaitFunction(1);
                                }
                            };
                            clearanceModel.putContacts(putContactsData,putContactsCallback);
                            layer1.closeIt(number);
                        }});
                        var exportContactsIdRadioFirst = ctrl.view.el.find(".export-contacts-id-div").find(".radioBox").get(0).children[0];
                        exportContactsIdRadioFirst.checked = true;
                        contactsIdForShowHide = exportContactsIdRadioFirst.attributes.id.value;
                    },["400px","466px"]);
                });
            };
            //获取联系人列表
            var getContactsListCallback = function(result){
                if(result.statusCode == 2000000){
                    if(result.data.length>0){
                        $.each(result.data,function(i,item){
                            result.data[i].contactsexportContactsId = "contacts_"+result.data[i].exportContactsId;
                        });
                        contactsWrap.loadTemplate($(".js-bid-getContactsData-tpl"),result.data,{success:function(){
                            showHide(contactsWrapButton,".js-contacts");
                             contactsData = result.data;
                            contactsEaitFunction(1);
                        }});

                        var exportContactsIdRadio = ctrl.view.el.find(".export-contacts-id-div").find(".radioBox");
                        exportContactsIdRadio.change(function(){
                            var exportContactsIdError = ctrl.view.el.find(".export-contacts-id-error");
                            if (exportContactsIdError) {
                                exportContactsIdError.hide();
                            }
                            var exportContactsIdHiddenInput = ctrl.view.el.find(".exportContactsIdHiddenInput");
                            if (exportContactsIdHiddenInput) {
                                exportContactsIdHiddenInput.addClass('ignore');
                            }
                        });
                    } else {
                        var exportContactsIdError = ctrl.view.el.find(".export-contacts-id-error");
                        if (exportContactsIdError) {
                            exportContactsIdError.addClass("export-contacts-id-upper-error");
                        }
                        var showAll = ctrl.view.el.find(".js-showcontactsButton");
                        if (showAll) {
                            showAll.hide();
                        }
                    }
                }
            };
            clearanceModel.getContactsList(getContactsListCallback);
            var contactsButton = ctrl.view.el.find(".js-contactsButton");
            contactsButton.click(function(){
                ctrl.vmaddContacts.reset();
                layer1.successChange(view.find(".js-addContacts"),"新增联系人",function (number){
                    if ($(".js-addContacts").valid()) {
                        var postContactsCallback = function (result) {
                            if (result.statusCode == 2000000) {
                                result.data[0].contactsexportContactsId = "contacts_" + result.data[0].exportContactsId;
                                contactsWrap.loadTemplate($(".js-bid-getContactsData-tpl"), result.data[0], {
                                    success: function () {
                                        contactsData.push(result.data[0]);
                                        contactsEaitFunction();
                                        contactsWrapButton.parent().siblings(".js-contacts").children().css("display","none").first().css("display","block").find("input[type=radio]");
                                    }, prepend: true
                                });

                                var exportContactsIdRadio = ctrl.view.el.find(".export-contacts-id-div").find(".radioBox").get(0).children[0];
                                exportContactsIdRadio.checked = true;
                                contactsIdForShowHide = exportContactsIdRadio.attributes.id.value;

                                var exportContactsIdError = ctrl.view.el.find(".export-contacts-id-error");
                                if (exportContactsIdError) {
                                    exportContactsIdError.removeClass("export-contacts-id-upper-error");
                                }

                                var showAll = ctrl.view.el.find(".js-showcontactsButton");
                                if (showAll) {
                                    showAll.show();
                                }

                                var exportContactsIdRadio = ctrl.view.el.find(".export-contacts-id-div").find(".radioBox");
                                exportContactsIdRadio.change(function(){
                                    var exportContactsIdError = ctrl.view.el.find(".export-contacts-id-error");
                                    if (exportContactsIdError) {
                                        exportContactsIdError.hide();
                                    }
                                    var exportContactsIdHiddenInput = ctrl.view.el.find(".exportContactsIdHiddenInput");
                                    if (exportContactsIdHiddenInput) {
                                        exportContactsIdHiddenInput.addClass('ignore');
                                    }
                                });
                            }
                        };
                        var postContactsData = ctrl.vmaddContacts.collectData();
                        clearanceModel.postContacts(postContactsData, postContactsCallback);
                        layer1.closeIt(number);
                    }
                },["400px","466px"]);
            });
            
            var currencyUnitSelect;
            var currencyUnit = ctrl.view.el.find(".js-currencyUnit");
            if(currencyUnitSelect){
                currencyUnit.html("("+currencyUnitSelect+")");
            }
            var priceClause = ctrl.view.el.find(".js-priceClause");
            var premium = ctrl.view.el.find(".js-premium");
            var fare = ctrl.view.el.find(".js-fare");
            priceClause.find("input").click(function(){
                switch(Number($(this).val())){
                    case 0:
                        premium.css("display","none");
                        fare.css("display","none");
                        break;
                    case 1:
                        premium.css("display","block");
                        fare.css("display","block");
                        break;
                    case 2:
                        premium.css("display","none");
                        fare.css("display","block");
                        break;
                }
            });

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
            }
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
                            var newData = ctrl.vmaddInternationalTrader.collectData();
                            dataTrader = newData;
                            wrapInternationalTrader.loadTemplate($(".js-bid-getInternationalTraderData-tpl"), newData,{
                                success:function(){
                                    hidewrapAddInternationalTrader(newData);
                                    layer1.closeIt(index);
                                }
                            });

                        }
                    });
                })
            };
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
                    return customerClearanceModel.const.attribute[value];
                }
            });
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
                            var newData = ctrl.vmaddExportGoodsLocation.collectData();
                            dataGoodsLocation = newData;
                            wrapExportGoodsLocation.loadTemplate($(".js-bid-getExportGoodsLocationData-tpl"), newData,{
                                success:function(){
                                    hidewrapAddExportGoodsLocation(newData);
                                    layer1.closeIt(index);
                                }
                            });

                        }
                    });
                })
            };
            var addFunction = function(clickElem,contElem,wrapElem,title,modelElem,vmElem,callback, area){
                clickElem.click(function(){
                    layer1.successChange(view.find(contElem),title,function (number){
                        if (title === "添加境外贸易商") {
                            if (!$(".js-addInternationalTrader").valid()) {
                                return;
                            } else {
                                var internationalTraderError = ctrl.view.el.find(".international-trader-error");
                                if (internationalTraderError) {
                                    internationalTraderError.hide();
                                }
                                var internationalTraderHiddenInput = ctrl.view.el.find(".internationalTraderHiddenInput");
                                if (internationalTraderHiddenInput) {
                                    internationalTraderHiddenInput.addClass('ignore');
                                }
                            }
                        } else if (title === "提货地址") {
                            if (!$(".js-addExportGoodsLocation").valid()) {
                                return;
                            } else {
                                var exportGoodsLocationFirstError = ctrl.view.el.find(".export-goods-location-first-error");
                                if (exportGoodsLocationFirstError) {
                                    exportGoodsLocationFirstError.hide();
                                }
                                var exportGoodsLocationFirstHiddenInput = ctrl.view.el.find(".exportGoodsLocationFirstHiddenInput");
                                if (exportGoodsLocationFirstHiddenInput) {
                                    exportGoodsLocationFirstHiddenInput.addClass('ignore');
                                }
                            }
                        }
                        var data = vmElem.collectData();
                        wrapElem.loadTemplate(modelElem, data);
                        callback && callback(data);
                        layer1.closeIt(number);
                    },area);
                });
            };

            wrapAddDispatchList.click(function(){
                ctrl.vmaddGood.reset();
                layer.open({
                    type : 1,
                    content:view.find(".js-addGood"),
                    title :"添加货品",
                    area:["740px","768px"],
                    btn:["保存"],
                    yes : function(index){
                        if (!$(".js-addGood").valid()) {
                            return;
                        }
                        var data = ctrl.vmaddGood.collectData();
                        ctrl.vmaddGood.reset();
                        var exportGoodsList = X.config.customerClearance.tpl.exportGoodsList;
                        $(".js-wrapGood").loadTemplate(exportGoodsList, data,{
                            success:function(){
                                var deleteButtonFirst = wrapGood.find(".js-delete").first();
                                deleteButtonCount++;
                                if (deleteButtonCount === 1 ) {
                                    deleteButtonFirst.hide();
                                } else {
                                    deleteButtonFirst.show();
                                }

                                var showHide = function(data){
                                    var showHide;
                                    if(data){
                                        showHide = ctrl.view.el.find(".js-showHide").last();
                                    }else{
                                        showHide = ctrl.view.el.find(".js-showHide");
                                    }
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
                                getAddGoodNum(data);
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
                                    if(getData){
                                        editButton = editArror;
                                        deleteButton = deleteArror;
                                    }else{
                                        editButton = edit;
                                        deleteButton = deleteData;
                                    }
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
                                                var deleteButtonFirst = wrapGood.find(".js-delete").first();
                                                if (deleteButtonCount === 1 ) {
                                                    deleteButtonFirst.hide();
                                                } else {
                                                    deleteButtonFirst.show();
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
                                        var deleteButtonFirst = wrapGood.find(".js-delete").first();
                                        deleteButtonCount--;
                                        if (deleteButtonCount === 1 ) {
                                            deleteButtonFirst.hide();
                                        } else {
                                            deleteButtonFirst.show();
                                        }
                                    });
                                };
                                editExportGoods();
                                layer1.closeIt(index);
                            },
                            append:true
                        });
                    }
                });
            });
            addFunction(wrapAddInternationalTrader,$(".js-addInternationalTrader"),wrapInternationalTrader,"添加境外贸易商",$(".js-bid-getInternationalTraderData-tpl"),ctrl.vmaddInternationalTrader,hidewrapAddInternationalTrader, ["500px","517px"]);
            addFunction(wrapAddExportGoodsLocation,$(".js-addExportGoodsLocation"),wrapExportGoodsLocation,"提货地址",$(".js-bid-getExportGoodsLocationData-tpl"),ctrl.vmaddExportGoodsLocation,hidewrapAddExportGoodsLocation, ["500px","499px"]);


            ctrl.getData = function(){
                var data = ctrl.vmdeclare.collectData();
                data.exportGoods = data2;
                // data.advance = "30";
                // data.finalPayment = "70";
                $.each(data.exportGoods,function(i,item){
                    switch (data.exportGoods[i].attribute){
                        case "自产":
                            data.exportGoods[i].attribute = "0";
                            break;
                        case "委托加工":
                            data.exportGoods[i].attribute = "1";
                            break;
                        case "外购":
                            data.exportGoods[i].attribute = "2";
                            break;
                    }
                });
                data.internationalTrader  = ctrl.vmaddInternationalTrader.collectData();
                data.exportGoodsLocation = ctrl.vmaddExportGoodsLocation.collectData();
                data.exportGoodsLocation.city = data.exportGoodsLocation.exportGoodsLocation.city;
                data.exportGoodsLocation.district = data.exportGoodsLocation.exportGoodsLocation.district;
                data.exportGoodsLocation.province = data.exportGoodsLocation.exportGoodsLocation.province;
                delete data.exportGoodsLocation.exportGoodsLocation;

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
                            layer1.successMsg("提交成功", function (number) {
                                layer1.closeIt(number);
                                menuCall("customerClearance.clearanceList");
                            });
                        }
                    };
                    clearanceModel.applyClearance(data, callback);
                }
            };

            ctrl.preview = function(){
                var wrapPreview = ctrl.view.el.find(".js-wrapPreview");

                var data = ctrl.getData();
                var comBankAccountId = data.companyBankAccountId;
                var expContactsId = data.exportContactsId;
                //联系人数字转换文字信息展示
                $.each(contactsData,function(i,item){
                    if(expContactsId == contactsData[i].exportContactsId){
                        data.exportContacts = contactsData[i];
                    }
                });
                //账户数字转换文字信息展示
                $.each(acountData,function(i,item){
                    if(comBankAccountId == acountData[i].companyBankAccountId){
                        data.acount = acountData[i];
                    }
                });

                //自定义属性
                $.addTemplateFormatter({
                    //收款方式
                    exchangeMethodFormater: function (value, template) {
                        return customerClearanceModel.const.exchangeMethod[value];
                    },
                    //价格条款
                    priceTermFormater:function (value, template) {
                        return customerClearanceModel.const.priceTerm[value];
                    },
                    //包装方式
                    packageTypeFormater:function (value, template) {
                        return customerClearanceModel.const.packageType[value];
                    },
                    //产品信息是否确定
                    detailConfirmedFormater:function (value, template) {
                        return customerClearanceModel.const.detailConfirmed[value];
                    },
                    //整体包装材料种类
                    packagingMaterialFormater:function (value, template) {
                        return customerClearanceModel.const.packagingMaterial[value];
                    },
                    //托盘种类
                    trayTypeFormater:function (value, template) {
                        return customerClearanceModel.const.trayType[value];
                    },
                    //币种
                    currencyFormater:function (value, template) {
                        return currencyData.getCurrency(value);
                    },
                    //境外贸易商
                    exchangeInternationalTraderFormater:function (value, template) {
                        if(value.name){
                            if(value.fax){
                                return value.name+"-"+value.nation+"-"+value.address+"-"+value.phone+"-"+value.fax;
                            }else{
                                return value.name+"-"+value.nation+"-"+value.address+"-"+value.phone;
                            }
                        }
                    },
                    //合同类型
                    exchangeContractTypeFormater:function (value, template) {
                        return customerClearanceModel.const.contractType[value];
                    },
                    //货品属性
                    attributeFormater:function (value, template) {
                        return customerClearanceModel.const.attribute[value];
                    },
                    //联系人
                    exportContactsFormater:function (value, template) {
                        if(value.email){
                            return value.contacts+"-"+value.mobile+"-"+value.phone+"-"+value.email;
                        }else{
                            return value.contacts+"-"+value.mobile+"-"+value.phone;
                        }
                    },
                    //账户
                    acountFormater:function (value, template) {
                        return value.accountName+"-"+value.bankName+"-"+value.bankAccount;
                    },
                    //提货地址
                    exportGoodsLocationFormater:function (value, template) {
                        return addressData.getPro(value.province)+"-"+addressData.getCity(value.city)+"-"+value.address+"-"+value.contacts+"-"+value.phone;
                    }
                });

                wrapPreview.loadTemplate($(".js-bid-previewData-tpl"),data);

                //弹出即全屏
                var index = layer.open({
                    type: 1,
                    title:"&nbsp;",
                    content: wrapPreview,
                    maxmin: false,
                    success:function(){
                        $(".layui-layer-content").css({"overflow-y":"auto"});
                    }
                });
                layer.full(index);

                var contractNumberReview = wrapPreview.find(".js-contractNumberReview");
                if(data.contractType == "2"){
                    contractNumberReview.css("display","none");
                }
                //货品清单
                var exportGoodsList = X.config.customerClearance.tpl.exportGoodsList;
                $(".js-exportGoodsList").loadTemplate(exportGoodsList, data.exportGoods,{
                    success:function(){
                        var showHide = $(".js-exportGoodsList").find(".js-showHide");
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
                    }
                });

                var fareData = ctrl.view.el.find(".js-fareData");
                var premiumData = ctrl.view.el.find(".js-premiumData");
                if(data.priceTerm == 1){
                    fareData.css("display","block");
                    premiumData.css("display","block");
                }else if(data.priceTerm == 2){
                    fareData.css("display","block");
                    premiumData.css("display","none");
                }else{
                    fareData.css("display","none");
                    premiumData.css("display","none");
                }

                var packagingM = ctrl.view.el.find(".js-packagingM");
                if(data.packagingMaterial == 4){
                    packagingM.css("display","block");
                }else{
                    packagingM.css("display","none");
                }

                var totalValueUnit = wrapPreview.find(".js-totalValueUnit");
                var currencyUnit = wrapPreview.find(".js-currencyUnit");
                currencyUnit.html("("+ totalValueUnit.html() +")");

                //附件
                var fileUploadController = window.X.config.PATH_FILE.path.rootUploadUrl;
                var orderAttachmentsList = data["orderAttachments"];
                var domesticTradeContractAttachmentsList = data["domesticTradeContractAttachments"];
                var otherAttachmentsList = data["otherAttachments"];

                var orderAttachments = ctrl.view.el.find(".js-orderAttachments");
                var domesticTradeContractAttachments = ctrl.view.el.find(".js-domesticTradeContractAttachments");
                var otherAttachments = ctrl.view.el.find(".js-otherAttachments");

                $.each(orderAttachmentsList, function (i, item) {
                    var a = '<div class="grayBlock mr10 mb15"><a href=' + fileUploadController + '?fileType=2&filePath=' + item.filePath + '&fileName=' + item.filename + ' class="underline c009add">' + item.filename + '</a></div>';
                    $(orderAttachments).append(a);
                });
                $.each(domesticTradeContractAttachmentsList, function (i, item) {
                    var a = '<div class="grayBlock mr10 mb15"><a href=' + fileUploadController + '?fileType=2&filePath=' + item.filePath + '&fileName=' + item.filename + ' class="underline c009add">' + item.filename + '</a></div>';
                    $(domesticTradeContractAttachments).append(a);
                });
                $.each(otherAttachmentsList, function (i, item) {
                    var a = '<div class="grayBlock mr10 mb15"><a href=' + fileUploadController + '?fileType=2&filePath=' + item.filePath + '&fileName=' + item.filename + ' class="underline c009add">' + item.filename + '</a></div>';
                    $(otherAttachments).append(a);
                });
            };

            // 申请报关验证
            $(".js-declare").validate({
                ignore: ".ignore",
                rules: {
                    exchangeMethodHiddenInput: {
                        required: true
                    },
                    companyBankAccountIdHiddenInput: {
                        required: true
                    },
                    exportContactsIdHiddenInput: {
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
                    }
                },
                messages: {
                    exchangeMethodHiddenInput: {
                        required: "请选择收汇方式"
                    },
                    companyBankAccountIdHiddenInput: {
                        required: "结汇/退税收款账户不能为空"
                    },
                    exportContactsIdHiddenInput: {
                        required: "本单联系人不能为空"
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

            // 增加收款帐号验证
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

            // 增加联系人验证
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

            // 增加货品验证
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
                        maxlength: 50,
                        isContainsSpecialCharNotSpace: true,
                        isNoDigits: true
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
                        maxlength: 50,
                        isContainsSpecialCharNotSpace: true,
                        isNoDigits: true
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
                        maxlength: "请填写正确的型号",
                        isContainsSpecialCharNotSpace: "请填写正确的型号",
                        isNoDigits: "请填写正确的型号"
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
                        maxlength: "请填写正确的包装/托盘尺寸",
                        isContainsSpecialCharNotSpace: "请填写正确的包装/托盘尺寸",
                        isNoDigits: "请填写正确的包装/托盘尺寸"
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

            // 增加境外贸易商验证
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

            // 增加货物存放地址验证
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

            ctrl.addEvent("click", ".js-submit", "submit");
            ctrl.addEvent("click", ".js-preview", "preview");

        });
    };

    function menuCall(mid){
        X.publish(X.CONSTANTS.channel.menuCall,{m:mid});
    }

    function scrollTo() {
        var span = ctrl.view.el.find(".fixNav").find("a");
        span.click(function(event){
            event.stopPropagation();
            event.preventDefault();
            var link = $(this);
            var target = link.data("target");
            if(target){
                var targetDiv = view.el.find("." + target);
                if(targetDiv && targetDiv.length>0){
                    var height = targetDiv.offset().top;                    

                    $(document.body).animate({
                        scrollTop: height 
                    });                    
                }
            }           
        });
    }
    return ctrl;
});
