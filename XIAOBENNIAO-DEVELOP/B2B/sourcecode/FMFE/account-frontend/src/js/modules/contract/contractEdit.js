X.define("modules.contract.contractEdit",["adapter.webuploader","model.contractModel","common.layer"],function (webuploader,contractModel,layer) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.contract.tpl.contractEdit
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {

        //渲染页面
        var addContractFunction = function(data){
            return view.render(data,function () {
                ctrl.vmaddContract = ctrl.getViewModel(ctrl.view.el.find(".js-addContractForm"),{meta: {"contractAttachmentList": {size: 30,type:7,downloadType:4,showExplain:true,explainMaxlength:20,filePicker:".filePicker",filePickerLabel:"添加合同附件"}},data:data});
                ctrl.vmaddContract.initControl();

                //合同表单验证
                ctrl.validate = {
                    rules: {
                        salesman: {
                            isChinese: true,
                            rangelength: [2,4]
                        },
                        customerName: {
                            required: true,
                            isChineseNumber:true,
                            rangelength: [6,50]
                        },
                        contractName: {
                            required: true,
                            isContractName: true
                        }
                    },
                    messages: {
                        salesman: {
                            isChinese: "请输入2-4个汉字",
                            rangelength: "请输入2-4个汉字"
                        },
                        customerName: {
                            required: "请输入6-50个汉字或数字组合",
                            isChineseNumber:"请输入6-50个汉字或数字组合",
                            rangelength: "请输入6-50个汉字或数字组合"
                        },
                        contractName: {
                            required: "请输入1-50个字符",
                            isContractName: "该合同名称已注册"
                        }
                    },
                    onkeyup: false,
                    onfocusout: function (element) {
                        var elem = $(element);
                        elem.valid();
                    },
                    success: function(value,element){

                    },
                    errorPlacement: function (error, element) {
                        var errorWrap = element.parent().find(".js-error");
                        errorWrap.html("");
                        error.appendTo(errorWrap);
                    }
                };

                if(_para["contractId"]){
                    ctrl.validate.rules.contractName.isContractName = false;
                    ctrl.addEvent("change", ".js-contractName", "checkFun");
                    ctrl.checkFun =function(){
                        if (ctrl.view.el.find(".js-contractName").val() == data.contractName){
                            ctrl.validate.rules.contractName.isContractName = false;
                        }else{
                            ctrl.validate.rules.contractName.isContractName = true;
                        }
                    };
                }

                ctrl.view.el.find(".js-addContractForm").validate(ctrl.validate);
            });
        };

        var callback = function(result){
            var data = result.data[0];
            addContractFunction(data);
        };

        if(_para["contractId"]){
            //编辑合同
            ctrl.getContractData(callback);
        }else{
            //创建合同
            addContractFunction({});
        }

    };

    //获取合同信息
    ctrl.getContractData = function(callback){
        var data = {
            contractId:_para["contractId"]
        };
        contractModel.getContract(data,callback);
    };

    //提交合同信息
    ctrl.submitInfo = function (){
        ctrl.publicMethod();
    };

    //保存合同信息
    ctrl.saveInfo = function (){
        ctrl.publicMethod(true);
    };

    ctrl.publicMethod = function (save){
        if(ctrl.vmaddContract.getValue("contractAttachmentList").contractAttachmentList.length){
            if(ctrl.view.el.find(".js-addContractForm").valid()){
                ctrl.publicMethodSubmitSave(save);
            }
        }else{
            var wrapAttachError = ctrl.view.el.find(".js-attachError");
            if(!wrapAttachError.html()){
                var error = '<label class="error">附件不能为空</label>';
                $(error).appendTo(wrapAttachError);
            }
        }
    };

    ctrl.publicMethodSubmit = function(contnet,num){
        var data = ctrl.vmaddContract.collectData();
        data.contractStatus = num;
        var callback = function(result){
            var submitCallback;
            if(result.statusCode == 2000000){
                submitCallback = function (index){
                    layer.closeIt(index);
                    X.router.back();
                };
                layer.successBtn(contnet,"提示",submitCallback);
            }else{
                submitCallback = function (index){
                    layer.closeIt(index);
                    X.publish(X.CONSTANTS.channel.menuCall,{m:"contract.contractList"});
                };
                layer.successBtn(result.message,"提示",submitCallback);
            }
        };
        if(_para["contractId"]){
            data.contractId = _para["contractId"];
            //编辑合同
            contractModel.changeContract(data,callback);
        }else{
            //创建合同
            contractModel.addContract(data,callback);
        }
    };

    ctrl.publicMethodSubmitSave = function(save){
        if(save){
            //保存合同信息
            ctrl.publicMethodSubmit("保存成功",0);
        }else{
            //提交合同信息
            var layerCallback = function (index){
                ctrl.publicMethodSubmit("提交成功",1);
                layer.closeIt(index);
            };
            layer.successConfirm("确定提交此合同信息？",layerCallback,"提示");
        }
    };

    //最大输入100个字符
    ctrl.maxNumber = function (event){
        var value =  $(this.that).val();
        if (value.length >= 100 && event.keyCode !== 8 && event.keyCode !== 37 && event.keyCode !== 38 &&
            event.keyCode !== 39 && event.keyCode !== 40 && event.keyCode !== 46) {
            event.returnValue = false;
        }
    };

    ctrl.addEvent("click", ".js-submit", "submitInfo");
    ctrl.addEvent("click", ".js-preservation", "saveInfo");
    ctrl.addEvent("keydown", ".js-contractRemark", "maxNumber");

    var _para;
    ctrl.load = function(para){
        para = para || {};
        _para = para ;
        ctrl.rendering();
    };

    return ctrl;

});