X.define("modules.login.login",["model.adminModel"],function (adminModel) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-frame"),
        url: X.config.login.tpl.login
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {
        return view.render({},function () {
            ctrl.admin = ctrl.getViewModel(ctrl.view.el.find(".loginBox"));
            ctrl.admin.initControl();


            //供应商登录验证ctrl.view.el.find(".loginBox")
            ctrl.admin.elem.validate({
                rules: {
                    userName: {
                        required: true                    
                    },                   
                    password: {
                        required: true,
                        rangelength: [6, 16],
                        strongPsw: true
                    }
                },
                messages: {
                    userName: {
                        required: "请输入管理员名称"                        
                    },                    
                    password: {
                        required: "请输入登录密码",
                        rangelength: "请输入6位以上16位以下密码",
                        strongPsw:"密码包含字母、大小写、数字、特殊字符其中两种"
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
                    //error.appendTo(element.parent().next(".js-error").find(".js-error"));
                    element.parent().next(".js-error").html(error.html())
                },
                submitHandler: function (form) {
                    //that.trigger("submit");
                }

            });

            ctrl.view.el.find("input").keyup(function (event) {
                if (event.keyCode == 13) {
                    ctrl.Submit();
                }
            });

        });
    }



    //提交审核结果
    ctrl.Submit = function (callback) {
        if (ctrl.admin.elem.valid()) {            

            var data = ctrl.admin.collectData();


            adminModel.login(data,function(result) {                
                window.location.href = X.config.PATH_FILE.path.root ;
            });

            
            //var data = ctrl.vmuser.collectData();
            //userModel.supLogin(data,callback);
        }
    };

    //点击提交审核结果
    ctrl.addEvent("click", ".js-login", "Submit");

    ctrl.load = function () {
        ctrl.rendering();
    };

    return ctrl;
});