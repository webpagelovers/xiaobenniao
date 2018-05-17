X.define("modules.customerClearance.clearanceDetail",["model.customerClearanceModel","data.currencyData","data.addressData"],function (customerClearanceModel,currencyData,addressData) {
    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.customerClearance.tpl.clearanceDetail
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.load = function (para) {

        customerClearanceModel.getById(para["exportFormId"],function(data){

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

            //自定义属性
            $.addTemplateFormatter({
                //收款方式
                exchangeMethodFormater: function (value, template) {
                    return customerClearanceModel.const.exchangeMethod[value];
                },
                //价格条款
                priceTermFormater:function (value, template) {
                    if(value > 3){
                        return "其它" +customerClearanceModel.const.priceTerm[value];
                    }else{
                        return customerClearanceModel.const.priceTerm[value];
                    }
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
                    return customerClearanceModel.const.exportGoods.attribute[value];
                },
                //提货地址
                exportGoodsLocationFormater:function (value, template) {
                    if(value){
                        return addressData.getPro(value.province)+"-"+addressData.getCity(value.city)+"-"+value.address+"-"+value.contacts+"-"+value.phone;
                    }
                }
            });

            view.render(data, function () {

                var back = ctrl.view.el.find(".js-back");
                back.click(function(){
                    X.router.run("m=customerClearance.clearanceList");
                });

                var wrapPreview = ctrl.view.el.find(".js-wrapPreview");

                var edit = ctrl.view.el.find(".js-edit");
                //已完成和已取消状态下不可编辑
               if(data.status == 6 || data.status == 0){
                   edit.css("display","none");
               }

                var contractNumberReview = wrapPreview.find(".js-contractNumberReview");
                if(data.contractType == "2"){
                    contractNumberReview.css("display","none");
                }

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

                //采取联系人显示
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
                financeShowHide(data.acount);
                //货品清单
                var exportGoodsList = X.config.customerClearance.tpl.exportGoodsList;
                $.each(data.exportGoods,function(i,item){
                    data.exportGoods[i].currency = data.currency;
                });
                $(".js-exportGoodsList").loadTemplate(exportGoodsList, data.exportGoods,{
                    success:function(){
                        $(".js-showHide").attr("onOff","off");
                        $(".js-showHide").click(function(){
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
                        })
                    }
                });

                //点击处理按钮，跳到处理页面
                ctrl.view.el.find(".js-dealt").click(function(){
                    X.router.run("m=customerClearance.clearanceHandle&exportFormId=" + data["exportFormId"], '通关结汇处理详情');
                });

                //点击编辑按钮，跳到编辑页面
                ctrl.view.el.find(".js-edit").click(function(){
                    X.router.run("m=customerClearance.clearanceEdit&exportFormId=" + data["exportFormId"], '通关结汇编辑详情');
                });

                //进度条 //0-已取消//1-待审核||2-待订舱||3-待报关||4-待结汇||5-待退税||6-已完成
                X.controls.getControl("ProgressBar",view.el.find(".progress-wrap"),{
                    progressContent: ["1","2","3","4","5","6","7"],
                    progressContentInfo:["资料提交","待审核","待订舱","待报关","待结汇","待退税","已完成"],
                    allSteps : 7,
                    nowStep : getNowStep(data)+1,
                    cancelled:getCancelled(data.status)
                });

                //判断当前订单是不是已经取消
                function getCancelled(status){
                    if(Number(status) == 0){
                        $(".js-cancelStatus").show();
                        return true;
                    }else{
                        $(".js-cancelStatus").hide();
                        return false;
                    }
                }
                //获取当前订单所进行的状态
                function getNowStep(data){
                    return Number(data.status) == 0 ? Number(data.cancelStatus) : Number(data.status);
                }

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

            });

        });

    };

    return ctrl;
});
