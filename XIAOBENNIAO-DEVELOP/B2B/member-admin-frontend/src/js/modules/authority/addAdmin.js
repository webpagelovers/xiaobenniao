X.define("modules.authority.addAdmin",["model.adminModel","model.roleModel","common.layer"],function (adminModel,roleModel,layer) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.authority.tpl.addAdmin
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view,
        model:adminModel
    });

    ctrl.rendering = function () {
        //ctrl.getRoleList();
        var render = function(data,str,number,verification){
            view.render(data, function () {

                //ctrl.changeSource(result[0].data);
                ctrl.vmaddAdmin = ctrl.getViewModel(ctrl.view.el.find(".js-addAdmin"),{meta: {"roleId":{refUrl:X.config.authority.api.getAdminRole,"refKey":"roleId","refValue":"roleName",defaultValue:number,selectedChanged: function (item) {
                    var inputRold = ctrl.vmaddAdmin.getControl("roleId").getElement().parent().find("input[name='roleId']");
                    inputRold.val((item.key==-1)?"":item.key);
                    if(inputRold.val()){
                        ctrl.view.el.find(".js-roleIdError").html("");
                    }
                }}},data:data});
                ctrl.vmaddAdmin.initControl();
                ctrl.view.el.find(".js-title").html(str);

                verification();
            });
        };

        var callback = function (model) {
            var data = model.attributes;
            var str="编辑管理员";
            var verification = function(){
                $(".js-addAdmin").validate({
                    rules: {
                        userName: {
                            required: true,
                            rangelength: [2, 15]
                        },
                        realname: {
                            required: true,
                            rangelength: [2, 8],
                            isChinese: true
                        },
                        password: {
                            required: true,
                            rangelength: [6, 16],
                            strongPsw: true
                        }
                    },
                    messages: {
                        userName: {
                            required: "请输入登录名",
                            rangelength: "请输入2位以上15位以下姓名"
                        },
                        realname: {
                            required: "请输入真实姓名",
                            rangelength: "请输入2位以上8位以下姓名",
                            isChinese: "姓名只能包含中文"
                        },
                        password: {
                            required: "请输入6位以上的密码",
                            rangelength: "请输入6位以上16位以下密码",
                            strongPsw: "密码必须包含字母、大小写、数字、特殊字符其中两种规则"
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
            };
            render(data,str,data.roleId,verification);
            ctrl.view.el.find(".js-cosPassword").css("display","none");
        };
        if(_para["backendUserId"]){
            ctrl.getData(callback);
            ctrl.addEvent("click", ".js-button", "nexted");
        }
        else{
            var str="新增管理员";
            var verification = function(){
                $(".js-addAdmin").validate({
                    rules: {
                        userName: {
                            required: true,
                            rangelength: [2, 15],
                            isAdminName: true,
                            stringCheck: true
                        },
                        realname: {
                            required: true,
                            rangelength: [2, 8],
                            isChinese: true
                        },
                        password: {
                            required: true,
                            rangelength: [6, 16],
                            strongPsw: true
                        },
                        cosPassword: {
                            required: true,
                            equalTo: "#password"
                        },
                        roleId: {
                            required: true
                        }
                    },
                    messages: {
                        userName: {
                            required: "请输入登录名",
                            rangelength: "请输入2位以上15位以下姓名",
                            isAdminName: "登录名已注册",
                            stringCheck: "用户名不能包含特殊字符"
                        },
                        realname: {
                            required: "请输入真实姓名",
                            rangelength: "请输入2位以上8位以下姓名",
                            isChinese: "姓名只能包含中文"
                        },
                        password: {
                            required: "请输入6位以上的密码",
                            rangelength: "请输入6位以上16位以下密码",
                            strongPsw: "密码必须包含字母、大小写、数字、特殊字符其中两种规则"
                        },
                        cosPassword: {
                            required: "请再次输入密码",
                            equalTo: "两次密码输入不一致"
                        },
                        roleId: {
                            required: "请选择角色"
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
            };
            render({},str,-1,verification);
            ctrl.addEvent("click", ".js-button", "next");
        }
    };

    //获取ID对应的管理员信息
    ctrl.getData = function (callback) {
        adminModel.find({data:{"backendUserId":_para["backendUserId"]},callback:callback});
    };

    ctrl.next = function () {
        var callback = function(){
            layer.successMsg("保存成功",function(){
                X.router.back();
            });
        };
        ctrl.Submit(callback);
    };

    ctrl.resets = function () {
        ctrl.view.el.find("input[name=cosPassword]").attr("value","");
        ctrl.view.el.find(".js-error").html("");
        ctrl.vmaddAdmin.reset();
    };

    //提交新增管理员信息
    ctrl.Submit = function (callback) {
        if ($(".js-addAdmin").valid()) {
            var data_system = ctrl.vmaddAdmin.collectData();
            var data = $.extend( false, {},data_system,{status:0});
            adminModel.addAdmin(data,callback);
        }
    };

    ctrl.nexted = function () {
        var callback = function(){
            layer.successMsg("保存成功",function(){
                X.router.back();
            });
        };
        ctrl.Submited(callback);
    };

    //提交修改管理员信息
    ctrl.Submited = function (callback) {
        if ($(".js-addAdmin").valid()) {
            var data_system = ctrl.vmaddAdmin.collectData();
            var data = $.extend( false, {},data_system,{backendUserId:_para["backendUserId"]},{status:0});
            adminModel.changeAdmin(data,callback);
        }
    };

    ctrl.addEvent("click", ".js-reset", "resets");

    var _para;
    ctrl.load = function(para){
        para = para || {};
        _para = para ;
        ctrl.rendering();
    };

    return ctrl;

});

