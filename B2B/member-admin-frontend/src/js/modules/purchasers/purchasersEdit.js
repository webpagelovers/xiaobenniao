X.define("modules.purchasers.purchasersEdit",["model.companyModel","data.addressData","common.layer","adapter.webuploader","adapter.laydate"],function (companyModel,address,layer) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.purchasers.tpl.purchasersEdit
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    var option = {
        meta :{ "companyAddress": {dataSource : address},
            "licenseAddress":{dataSource : address}
        }
    };

    var render = function(data){
        view.render(data,function(){
            $(".js-purchasersEdit").validate({
                rules: {
                    companyNameCn: {
                        required: true,
                        isChinese: true,
                        rangelength: [6, 50],
                        isCompanyCn:true

                    },
                    registeredCapital: {
                        isFloat: true,
                        isSpace:true,
                        firstNozero:true,
                        rangelength: [1, 10]
                    },
                    companyPhone: {
                        isPhone:true,
                        rangelength:[8,16]
                    },
                    detailedAddress:{
                        isSpace: true,
                        rangelength:[1,99]
                    },
                    userId:{
                        required: true,
                        checkUserIsBind: true,
                        maxlength:6,
                        isDigits:true
                    }
                },
                messages: {
                    companyNameCn: {
                        required: "请输入企业名称",
                        rangelength: "请输入6-50个字符的公司名称",
                        isChinese: "名称只能包含中文",
                        isCompanyCn:"该公司已经注册"
                    },
                    companyPhone: {
                        isPhone: "请输入正确的电话号码",
                        rangelength:"请输入8-16位电话号码"
                    },
                    registeredCapital: {
                        rangelength: "请输入1位以上10位以下注册资金",
                        isFloat:"请输入正确的注册资金",
                        isSpace:"请输入正确的注册资金",
                        firstNozero:"注册资金不能为0"
                    },
                    detailedAddress:{
                        isSpace:"请输入正确详细地址",
                        rangelength:"请输入100字以内的地址"
                    },
                    userId:{
                        required: "请输入绑定用户",
                        isDigits: "请输入数字"
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
            ctrl.view.el.find(".js-zerotype").validate({
                rules: {
                    number:{
                        checkLicenseNumber:true,
                        minlength: 15,
                        maxlength: 15
                    }
                },
                messages: {
                    number: {
                        checkLicenseNumber:"该证件号已被绑定",
                        minlength: "请输入15位营业执照编号",
                        maxlength: "请输入15位营业执照编号"
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
            ctrl.view.el.find(".js-onetype").validate({
                rules: {
                    number:{
                        checkLicenseNumber:true,
                        minlength: 10,
                        maxlength: 10
                    }
                },
                messages: {
                    number: {
                        checkLicenseNumber:"该证件号已被绑定",
                        minlength: "请输入10位组织机构代码编号",
                        maxlength: "请输入10位组织机构代码编号"
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
            ctrl.view.el.find(".js-twotype").validate({
                rules: {
                    number:{
                        checkLicenseNumber:true,
                        minlength: 15,
                        maxlength: 15
                    }
                },
                messages: {
                    number: {
                        checkLicenseNumber:"该证件号已被绑定",
                        minlength: "请输入15位税务登记证",
                        maxlength: "请输入15位税务登记证"
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
            ctrl.view.el.find(".js-threetype").validate({
                rules: {
                    number:{
                        checkLicenseNumber:true,
                        minlength: 10,
                        maxlength: 10
                    }
                },
                messages: {
                    number: {
                        checkLicenseNumber:"该证件号已被绑定",
                        minlength: "请输入正确的证件编号",
                        maxlength: "请输入正确的证件编号"
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
            ctrl.view.el.find(".js-fourtype").validate({
                rules: {
                    number:{
                        checkLicenseNumber:true,
                        rangelength: [1,30]
                    }
                },
                messages: {
                    number: {
                        checkLicenseNumber:"该证件号已被绑定",
                        rangelength:"社会统一代码长度不能超过30位"
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
            ctrl.vmaddpurchasers = ctrl.getViewModel(ctrl.view.el.find(".js-filetype"),{meta: {"imgurl": {size: 1,type:1}},data:data});
            var clearAdd = function (argument) {

            };

            /** 主数据 **/
            ctrl.purchasersEdit = ctrl.getViewModel(ctrl.view.el.find(".js-purchasersEdit"),{ meta :{ "companyAddress": {dataSource : address,defaultValue:data["companyAddress"]}},data:getBaseInfo(data)});
            ctrl.purchasersEdit.initControl();

            /*** 证件 ***/
            /*证件社会统一信用代码*/
            var fourtype = ctrl.view.el.find(".js-fourtype");
            ctrl.fourtype = ctrl.getViewModel(fourtype,{
                meta: {"imgurl": {size: 20,type:1},"licenseAddress": {dataSource : address}},data:getLicenses(data,companyModel.const.lincenseType.CREDIT.key)
            });
            ctrl.fourtype.initControl();
            ctrl.fourtype.getControl("imgurl").addButton([
                {id:fourtype.find(".js-filePickerButton")[0],"label":"<span>上传统一社会信用代码</span>"},
                {id:fourtype.find(".js-resetButton")[0],"label":"<span>修改</span>"}
            ]);
            ctrl.fourtype.getControl("imgurl").on("uploadSuccess",function (argument) {
                fourtype.find(".js-resetButton").show();
            });
            /*证件社会统一信用代码*/


            /*营业执照*/
            var zerotype = ctrl.view.el.find(".js-zerotype");
            ctrl.zerotype = ctrl.getViewModel(zerotype,{
                meta: {"imgurl": {size: 20,type:1},"licenseAddress": {dataSource : address}},data:getLicenses(data,companyModel.const.lincenseType.LINCENSECODE.key)
            });
            ctrl.zerotype.initControl();
            ctrl.zerotype.getControl("imgurl").addButton([
                {id:zerotype.find(".js-filePickerButton")[0],"label":"<span>上传营业执照</span>"},
                {id:zerotype.find(".js-resetButton")[0],"label":"<span>修改</span>"}
            ]);
            ctrl.zerotype.getControl("imgurl").on("uploadSuccess",function (argument) {
                zerotype.find(".js-resetButton").show();
            });
            /*营业执照*/

            /*上传组织机构代码证*/
            var onetype = ctrl.view.el.find(".js-onetype");
            ctrl.onetype = ctrl.getViewModel(onetype,{ meta: {"imgurl": {size: 20,type:1}},data:getLicenses(data,companyModel.const.lincenseType.ORGANIZTION.key)

            });
            ctrl.onetype.initControl();
            ctrl.onetype.getControl("imgurl").addButton([
                {id:onetype.find(".js-filePickerButton")[0],"label":"<span>上传组织机构代码证</span>"},
                {id:onetype.find(".js-resetButton")[0],"label":"<span>修改</span>"}
            ]);
            ctrl.onetype.getControl("imgurl").on("uploadSuccess",function (argument) {
                onetype.find(".js-resetButton").show();
            });

            /*上传组织机构代码证*/

            /*税务登记证*/
            var twotype = ctrl.view.el.find(".js-twotype");
            ctrl.twotype = ctrl.getViewModel(twotype,{ meta: {"imgurl": {size: 20,type:1}},data:getLicenses(data,companyModel.const.lincenseType.TAXCODE.key)});
            ctrl.twotype.initControl();
            ctrl.twotype.getControl("imgurl").addButton([
                {id:twotype.find(".js-filePickerButton")[0],"label":"<span>税务登记证</span>"},
                {id:twotype.find(".js-resetButton")[0],"label":"<span>修改</span>"}
            ]);

            ctrl.twotype.getControl("imgurl").on("uploadSuccess",function (argument) {
                twotype.find(".js-resetButton").show();
            });

            /*上传入住许可证*/
            var threetype = ctrl.view.el.find(".js-threetype");
            ctrl.threetype = ctrl.getViewModel(threetype,{ meta: {"imgurl": {size: 20,type:1}},data:getLicenses(data,companyModel.const.lincenseType.ENTRY.key)});
            ctrl.threetype.initControl();
            ctrl.threetype.getControl("imgurl").addButton([
                {id:threetype.find(".js-filePickerButton")[0],"label":"<span>上传入住许可证</span>"},
                {id:threetype.find(".js-resetButton")[0],"label":"<span>修改</span>"}
            ]);
            ctrl.threetype.getControl("imgurl").on("uploadSuccess",function (argument) {
                threetype.find(".js-resetButton").show();
            });



            /*上传入住许可证*/
            /*** 证件 ***/
            /**** 选择三证合一 *****/
            ctrl.chckbox = X.controls.getControl("CheckboxBox",ctrl.view.el.find(".js-threeToOne"),{click:function(){
                if(ctrl.chckbox.getChecked()){
                    ctrl.view.el.find(".hidde").hide();
                    ctrl.view.el.find(".js-fourtype").show();
                }else{
                    ctrl.view.el.find(".hidde").show();
                    ctrl.view.el.find(".js-fourtype").hide();
                }
            }});
            /** 根据是否所有数据对界面控件处隐藏显示  **/
            showEdit(data);
        });
    };

    var getBaseInfo = function(data){
        return data;
    };
    var loadBaseInfo = function(data){
        ctrl.getCompanyAddress(data);
        ctrl.view.renderIn(".js-baseInfo-tpl",".js-baseInfo",getBaseInfo(data));
    };

    var getLicenses = function(data,type){
        if(data && data.licenses){
            for(var i = 0; i < data.licenses.length; i++ ){
                if(data.licenses[i].licenseType  ==type){
                    return data.licenses[i];
                }
            }
        }
        return {};
    };

    var loadTemplate = function(data){
        ctrl.toEnlarge = function(sata,item){
            ctrl.view.find(sata).click(function(){
                var img = "<img  src='"+getLicenses(data,item).imgurl+"'/>";
                layer.layerBigImg(img);
            });

        };
        if(data.licenses.length===2){
            //社会统一信用代码 js-imgfour
            ctrl.view.renderIn(".js-certificate-merge-tpl",".js-certificate-merge",getLicenses(data,companyModel.const.lincenseType.CREDIT.key),
            ctrl.getLicensesAddress(getLicenses(data,companyModel.const.lincenseType.CREDIT.key))
            );
            ctrl.toEnlarge(".js-imgfour",companyModel.const.lincenseType.CREDIT.key);
        }
        else {
            //营业执照
            ctrl.view.renderIn(".js-lincensTypeZero-tpl",".js-lincensTypeZero",getLicenses(data,companyModel.const.lincenseType.LINCENSECODE.key),
                ctrl.getLicensesAddress(getLicenses(data,companyModel.const.lincenseType.LINCENSECODE.key))
            );
            ctrl.toEnlarge(".js-imgzero",companyModel.const.lincenseType.LINCENSECODE.key);
            //组织机构 js-imgone
            ctrl.view.renderIn(".js-lincensTypeOne-tpl",".js-lincensTypeOne",getLicenses(data,companyModel.const.lincenseType.ORGANIZTION.key));
            ctrl.toEnlarge(".js-imgone",companyModel.const.lincenseType.ORGANIZTION.key);
            //税务登记证
            ctrl.view.renderIn(".js-lincensTypeTwo-tpl",".js-lincensTypeTwo",getLicenses(data,companyModel.const.lincenseType.TAXCODE.key));
            ctrl.toEnlarge(".js-imgtwo",companyModel.const.lincenseType.TAXCODE.key);
        }
        //入驻许可证
        ctrl.view.renderIn(".js-threeCertificate-tpl",".js-threeCertificate",getLicenses(data,companyModel.const.lincenseType.ENTRY.key));
        ctrl.toEnlarge(".js-imgtree",companyModel.const.lincenseType.ENTRY.key);

    };

    ctrl.getLicensesAddress = function(data){
        if (data.licenseAddress != undefined){
            data.licenseAddress.provinceName = address.getPro(data.licenseAddress.province);
            data.licenseAddress.cityName = address.getCity(data.licenseAddress.city);
            data.licenseAddress.districtName = address.getDistrict(data.licenseAddress.district)
        }

    };


    var showEdit = function(data){
        if(_para["companyId"]){
            ctrl.view.el.find(".js-add").hide();
            ctrl.view.el.find(".js-licenseAdd").hide();
            ctrl.view.el.find(".js-hideButton").hide();
            ctrl.view.el.find(".js-title").text('采购商信息');
            ctrl.view.el.find(".js-editfont").text('采购商信息');
            //根据license的数量来判断是否三证合一
            ctrl.licensesInOne = data.licenses.length===2? true: false;
            if(ctrl.licensesInOne){
                ctrl.view.el.find(".certificate-merge").show();
            } else {
                ctrl.view.el.find(".certificate-three").show();
            }
            loadTemplate(data);
            loadBaseInfo(data);
        }
        else{
            ctrl.view.el.find(".js-edit").hide();
            ctrl.view.el.find(".js-resetButton").hide();
            ctrl.view.el.find(".js-submitButton").hide();
            ctrl.view.el.find(".js-licenseEdit").hide();
            ctrl.view.el.find(".js-liceButton").hide();
            ctrl.view.el.find(".certificate-three").hide();
            ctrl.view.el.find(".js-creator").hide();
        }
    };
    ctrl.getCompanyAddress = function(data){
        data.companyAddress.provinceName = address.getPro(data.companyAddress.province);
        data.companyAddress.cityName = address.getCity(data.companyAddress.city);
        data.companyAddress.districtName = address.getDistrict(data.companyAddress.district);
    };
    ctrl.rendering = function () {
        if(_para["companyId"]){
            ctrl.getData(function(model){
                var data  = model.attributes;
                ctrl.getCompanyAddress(data);
                render(data);
            });
        }
        else{
            render({});
        }

    };

    //获取采购商信息
    ctrl.getData = function (callback) {
        companyModel.find({data:{"companyId":_para["companyId"]},callback:callback});
    };

    var _para;
    ctrl.load = function(para){
        para = para || {};
        _para = para ;
        ctrl.rendering();
    };

    ctrl.append = function () {
        var callback = function(){
            layer.successMsg("保存成功",function(){
                X.router.run("m=purchasers.purchasersList");
                layer.closeIt();
            });
        };
        ctrl.Submit(callback);
    };
    //提交企业（采购商）信息
    ctrl.Submit = function (callback) {
        if(ctrl.view.find(".js-check").is(":checked")){
            if (ctrl.view.find(".js-purchasersEdit").valid() &&
                ctrl.view.find(".js-fourtype").valid()) {
                var data = getPurchasersEditData();
                data.licenses = getLicenseData();
                companyModel.register(data,callback);
            }
        }else{
            if (ctrl.view.find(".js-purchasersEdit").valid() &&
                ctrl.view.find(".js-zerotype").valid() &&
                ctrl.view.find(".js-onetype").valid() &&
                ctrl.view.find(".js-twotype").valid()) {
                var data = getPurchasersEditData();
                data.licenses = getLicenseData();
                companyModel.register(data,callback);
            }
        }
    };
    //点击编辑采购商基本信息
    ctrl.edit = function(){
        ctrl.view.el.find(".js-add").show();
        ctrl.view.el.find(".js-edit").hide();
        if(ctrl.view.el.find(".js-resetButton em").html() == "编辑"){
            ctrl.view.el.find(".js-resetButton em").html("确定");
        }
        else{
            ctrl.basicEdlit(function(data){
                ctrl.view.el.find(".js-resetButton em").html("编辑");
                ctrl.view.el.find(".js-add").hide();
                ctrl.view.el.find(".js-edit").show();
                loadBaseInfo(data);
            });
        }
    };
    //点击编辑采购商执照信息
    ctrl.liceEdit = function(){
        ctrl.view.el.find(".js-licenseAdd").show();
        ctrl.view.el.find(".js-licenseEdit").hide();
        if(ctrl.view.el.find(".js-liceButton em").html() == "编辑"){
            ctrl.view.el.find(".js-liceButton em").html("确定");
            ctrl.licensesInOne? ctrl.chckbox.elem.children(':eq(0)')[0].click(): 1;
        }else{
            ctrl.licensesEdlit(function(data){
                ctrl.view.el.find(".js-liceButton em").html("编辑");
                ctrl.view.el.find(".js-licenseAdd").hide();
                loadTemplate(data);
                if(data.licenses.length == "2"){
                    ctrl.view.el.find(".certificate-merge").show();
                    ctrl.view.el.find(".certificate-three").hide();
                } else {
                    ctrl.view.el.find(".certificate-merge").hide();
                    ctrl.view.el.find(".certificate-three").show();
                }
                ctrl.rendering();
                ctrl.view.el.find(".js-licenseEdit").show();
                ctrl.licensesInOne? ctrl.chckbox.elem.children(':eq(0)')[0].click(): 1;
            });
        }
    };
    //采集采购商基本信息
    var getPurchasersEditData = function(){
        var data = ctrl.purchasersEdit.collectData();
        var userId = data.userId;
        data.companyAddress.detailedAddress = data.detailedAddress;
        data.companyAddress.addressId= data.addressId;
        data.companyType=1;
        data.user ={userId:userId};
        delete data.detailedAddress;
        delete  data.userId;
        delete  data.addressId;
        return data;
    };
    //  采集采购商执照信息
    var getLicenseData = function(){
        var licenses =[];
        var zerotype = ctrl.zerotype.collectData();
        var onetype = ctrl.onetype.collectData();
        var twotype = ctrl.twotype.collectData();
        var threetype = ctrl.threetype.collectData(),
            fourtype   = ctrl.fourtype.collectData();
        if(!ctrl.chckbox.getChecked()){
            zerotype.licenseType=companyModel.const.lincenseType.LINCENSECODE.key;
            onetype.licenseType=companyModel.const.lincenseType.ORGANIZTION.key;
            twotype.licenseType=companyModel.const.lincenseType.TAXCODE.key;
            licenses.push(zerotype);
            licenses.push(onetype);
            licenses.push(twotype);
        } else {
            fourtype.licenseType=companyModel.const.lincenseType.CREDIT.key;
            licenses.push(fourtype);
        }

        threetype.licenseType=companyModel.const.lincenseType.ENTRY.key;
        licenses.push(threetype);

        return licenses;
    };

    // 修改采购商基本信息
    ctrl.basicEdlit =function(callback){
        if (ctrl.view.find(".js-purchasersEdit").valid()) {
            var data = getPurchasersEditData();
            data.companyId=_para["companyId"];
            companyModel.companyBase(data,callback);
        }
    };
    //修改采购商执照信息
    ctrl.licensesEdlit =function(callback){
        if(ctrl.view.find(".js-check").is(":checked")){
            if (ctrl.view.find(".js-fourtype").valid()) {
                var data = {};
                data.licenses = getLicenseData();
                data.companyId=_para["companyId"];
                companyModel.companyLicenses(data,callback);
            }
        }else{
            if (ctrl.view.find(".js-zerotype").valid() &&
                ctrl.view.find(".js-onetype").valid() &&
                ctrl.view.find(".js-twotype").valid()) {
                var data = {};
                data.licenses = getLicenseData();
                data.companyId=_para["companyId"];
                companyModel.companyLicenses(data,callback);
            }
        }
    };
    ctrl.addEvent("click", ".js-buttons", "append");
    ctrl.addEvent("click",".js-resetButton","edit");
    ctrl.addEvent("click",".js-liceButton","liceEdit");

    (function (_$) {
        var ROOT_PATH = window.X.config.PATH_FILE.path.prefixUrl;
        //验证用户是否已绑定企业
        _$.validator.addMethod("checkUserIsBind", function (value, element) {
            var flag = 1;
            _$.ajax({
                type: "POST",
                url: X.config.purchasers.api.checkUserIsBindCompany,
                async: false,
                data: toStringify({
                    'userId': value,
                    'companyId': _para["companyId"]
                }),
                success: function (data) {
                    if (data.statusCode == '2000000') {
                        flag = data.data;
                    }else
                    if(data.statusCode=='2000100'){
                        flag = 1;
                    }
                }
            });
            if (flag==0) {
                return true;
            } else if(flag==1){
                return false;
            }
        }, '您的用户名已被绑定');
        //验证执照编码是否已绑定企业
        _$.validator.addMethod("checkLicenseNumber", function (value, element) {

            var flag = 1;

            _$.ajax({
                type: "POST",
                url: X.config.purchasers.api.checkLicenseNumber,
                async: false,
                data: toStringify({
                    'number': value,
                    'companyId': _para["companyId"]
                }),
                success: function (data) {
                    if (data.statusCode == '2000000') {
                        flag = data.data;
                    }
                }
            });

            if (flag==0) {
                return true;
            } else if(flag==1){
                return false;
            }

        }, '您的执照编码已被绑定');
        _$.validator.addMethod("isCompanyCn", function (value, element) {

            var flag = 1;

            _$.ajax({
                type: "POST",
                url: X.config.purchasers.api.checkCompanyCn,
                async: false,
                data: toStringify({
                    'companyNameCn': value,
                    'companyId': _para["companyId"]
                }),
                success: function (data) {
                    if (data.statusCode == '2000000') {
                        flag = data.data;
                    }
                }
            });

            if (flag==0) {
                return true;
            } else if(flag==1){
                return false;
            }

        }, '公司名称已被绑定');
        function toStringify(o) {
            return JSON.stringify(o);
        }
    })(jQuery);
    return ctrl;
});

