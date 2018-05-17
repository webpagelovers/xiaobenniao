
X.define("modules.supplier.supplierDisplay",["model.userModel","model.supplierModel","common.layer","data.addressData","model.companyModel"],function (userModel,supplierModel,layer1,address,companyModel) {
    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.supplier.tpl.supplierDisplay
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {

        var callback = function (model) {
            var data = model.attributes;
            if(data.companyAddress.province==""){
                data.companyAddress.province="-1";
                data.companyAddress.city="-1";
                data.companyAddress.district="-1";
            }
            data.companyAddress.provinceName = address.getPro(data.companyAddress.province);
            data.companyAddress.cityName = address.getCity(data.companyAddress.city);
            data.companyAddress.districtName = address.getDistrict(data.companyAddress.district);

            return view.render(data,function () {

                ctrl.vm = ctrl.getViewModel(ctrl.view.el.find(".js-supplierInfo"),{meta:{status:{selectedChanged:function(value){
                    ctrl.review(value);
                }}}});
                ctrl.vm.initControl();
                ctrl.vm.setValue("status",data.status);
                ctrl.review(data.status,data.lastAuditLogging);

                renderLicense(data);

                $(".businessImg").click(function() {
                    var img = "<img  src='" + this.attributes.src.value + "'/>";
                    var index = layer.open({
                        type: 1,
                        content: img,
                        maxmin: true
                    });
                    layer.full(index);
                });

                if (data.status == companyModel.const.status.NOAUDIT.key) {
                    $(".js-location").html('供应商审核');
                } else {
                    $(".js-location").html('供应商详情');
                }

                //判断审核or未审核
                if( data.status == 0 ){
                    $(".needCheckResult").show();
                }
                else{
                    $(".needChangeResult").show();

                    //变更状态弹框
                    ctrl.changeResultContent = ctrl.getViewModel(view.find(".js-changeResultContent"));
                    ctrl.changeResultContent.initControl();
                    $(".js-changeResult").click(function () {
                        var content = view.find(".js-changeResultContent");
                        if(data.status == companyModel.const.status.APPROVED.key){
                            content.find('.js-textarea').hide();
                            content.find('input[value=1]').attr("checked",true);
                        }else{
                            content.find('input[value=2]').attr("checked",true);
                            content.find('.js-textarea').hide();
                            setTimeout(function(){
                                content.find('.js-textarea').show();
                            },30)
                        }
                        content.validate({
                            rules: {
                                noPassReason: {
                                    required: true,
                                    rangelength: [1, 350],
                                    isChinese: true
                                }
                            },
                            messages: {
                                noPassReason: {
                                    required: "请输入不通过原因",
                                    rangelength: "字数超出限制，请输入350字以内的原因",
                                    isChinese: "原因只能为中文"
                                }
                            },
                            onkeyup: false,
                            onfocusout: function (element) {
                                var elem = $(element);
                                elem.valid();
                            },
                            success: function (value, element) {},
                            errorPlacement: function (error, element) {
                                error.appendTo(element.parent().find(".js-error"));
                            }
                        });
                        var layer1 = layer.open({
                            type: 1,
                            content: content,
                            title: "结果变更",
                            //area: ["300px", "200px"],
                            btn: ["保存"],
                            success: function (layero, index) {
                                var $changeTextarea = $(".js-changeResultContent .js-textarea");
                                $changeTextarea.val("");
                                content.find('.js-error').html('');
                                $("#noPass1").click(function(){
                                    $changeTextarea.show();
                                    $changeTextarea.focus();
                                });
                                $("#pass1").click(function(){
                                    $changeTextarea.hide();
                                    content.find('.js-error').html('');
                                })
                            },
                            yes: function () {
                                var data2 = ctrl.changeResultContent.collectData();
                                data2.companyId = _para.companyId;
                                if(data2.status == companyModel.const.status.APPROVED.key){
                                    data2.lastAuditLogging = "";
                                    if (data.status !== data2.status) {
                                        supplierModel.audit(data2, function () {
                                            ctrl.load({companyId: data.companyId});
                                        });
                                    }
                                    layer.close(layer1);
                                } else if (content.valid()) {
                                    if (data.status !== data2.status) {
                                        supplierModel.audit(data2, function () {
                                            ctrl.load({companyId: data.companyId});
                                        });
                                    }
                                    layer.close(layer1);
                                }
                            }
                        });
                    });

                    ctrl.memberKindContent = ctrl.getViewModel(view.find(".js-memberKindContent"));
                    ctrl.memberKindContent.initControl();
                    $(".js-changeMemberKind").click(function () {
                        var layer1 = layer.open({
                            type: 1,
                            content: view.find(".js-memberKindContent"),
                            title: "会员种类变更",
                            area: ["300px", "200px"],
                            btn: ["保存"],
                            success: function (layero, index) {
                                changeStatus("js-changeResult", "#normal", "#vip");
                            },
                            yes: function () {
                                var data2 = ctrl.memberKindContent.collectData();
                                data2.companyId = _para.companyId;
                                if (data.memberType !== data2.memberType) {
                                    supplierModel.audit(data2, function () {
                                        ctrl.load({companyId: data.companyId});
                                    });
                                }
                                layer.close(layer1);
                            }
                        });
                    });
                    function changeStatus(parent, input1, input2) {
                        if (data.memberType == '0') {
                            $(input1).attr("checked", true);
                        } else if (data.memberType == '1') {
                            $(input2).attr("checked", true);
                        }
                    }

                    //历史记录
                    var historyData = data.companyOperationHistoryList;
                    historyData && $(".js-hisRecord").loadTemplate($(".js-record-tpl"),historyData,{});
                }
            });
        };

        ctrl.getData(callback);

    };

    ctrl.review = function (value,placeholder) {
                var text = ctrl.view.find(".js-textarea");
        if(value == "1" || value == "0"){
            text.find("textarea").hide();
            $(".js-error").text("");
            ctrl.view.find(".js-button").attr("disabled", false);
        }else{
            text.find("textarea").show().val("");
            ctrl.view.find("textarea").attr("value",placeholder);
            $(".js-textarea").validate({
                rules: {
                    noPassReason: {
                        required: true,
                        rangelength: [1, 350],
                        isChinese: true
                    }
                },
                messages: {
                    noPassReason: {
                        required: "请输入不通过原因",
                        rangelength: "字数超出限制，请输入350字以内的原因",
                        isChinese: "原因只能为中文"
                    }
                },
                onkeyup: false,
                onfocusout: function (element) {
                    var elem = $(element);
                    elem.valid();
                },
                success: function (value, element) {},
                errorPlacement: function (error, element) {
                    error.appendTo(element.parent().find(".js-error"));
                }
            });
        }
    };

    //提交审核结果
    ctrl.Submit = function () {
        var postData = ctrl.vm.collectData();
        if(postData && postData.status == 1){
            postData.lastAuditLogging = '';
            ctrl.postData(postData);
        }else {
            if(postData && $(".js-textarea").valid()){
                ctrl.postData(postData);
            }
        }
    };

    ctrl.postData = function(postData){
            postData.companyId = _para["companyId"];
            supplierModel.audit(postData,function(result){
            if(result.statusCode ==2000305){
                ctrl.view.el.find(".js-sub").find(".js-error").html("该公司已被注册");
            }else if(result.statusCode ==2000306) {
                ctrl.view.el.find(".js-sub").find(".js-error").html("该公司已被注册");
            }else if(result.statusCode ==2000000){
                layer1.successMsg("保存成功", function () {
                    X.router.back();
                });
            }
        });
    };

    //获取企业信息
    ctrl.getData = function (callback) {
        //var data = ctrl.vmuser.collectData();
        supplierModel.find({data:{"supplierId":_para["companyId"]},callback:callback});
    };


    //点击提交审核结果
    ctrl.addEvent("click", ".js-button", "Submit");

    var _para;
    ctrl.load = function(para){
        para = para || {};
        _para = para ;
        ctrl.rendering();
    };

    //地址拼接、数据转换
    $.addTemplateFormatter({
        companyAddressFormat: function(val) {
            return (address.getPro(val.province) || '未填写') + '-' + (address.getCity(val.city) || '未填写') + '-' + (address.getDistrict(val.district) || '未填写');
        },
        memberTypeChange: function(val) {
            //return companyModel.const.companyType[parseInt(val) + 1].value;
            var companyTypeData = companyModel.const.companyType;
            for(var i = 0 ; i < companyTypeData.length ; i++){
                if( parseInt(val) === companyTypeData[i].key ){
                    return companyTypeData[i].value;
                }
            }
        },
        statusChange: function(val) {
            var swift = [
                { key : "0", text :"待审核" },
                { key : "1", text :"审核通过" },
                { key : "2", text :"审核驳回" },
                { key : "3", text :"已删除" },
                { key : "4", text :"编辑中" }
            ];
            return swift[parseInt(val)].text;
        }
    });


    function renderLicense(data) {

        $('.js-licence' + data.isSocialUnityCreditCode, view.el).removeClass('none');

        for (var i in data) {
            /License$/.test(i) && doRender(data[i]);
        }
        function doRender(item) {

            switch (Object.prototype.toString.call(item)) {
                case '[object Object]':
                    item = [item];
                    break;
                case '[object String]':
                    item = [];
                    break;
            }

            for (var j = 0; j < item.length; j ++) {
                if (item[j].imageUrl.url == '') {
                    item.splice(j, 1);
                }
            }
            $('.license-' + i).loadTemplate($('#license-item-tpl'), item, {});
        }
    }

    return ctrl;
});