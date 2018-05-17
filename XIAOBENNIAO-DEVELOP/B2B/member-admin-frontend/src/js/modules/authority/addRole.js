X.define("modules.authority.addRole",["model.roleModel","modules.common.routerHelper","common.layer"],function (roleModel,routerHelper,layer) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.authority.tpl.addRole
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view,
        model:roleModel
    });

    ctrl.rendering = function () {
        var render = function(data,str){
            view.render(data, function () {

                var callback = function (result){
                    ctrl.vmaddRole = ctrl.getViewModel(ctrl.view.el.find(".js-addRole"),{data:data});
                    ctrl.vmaddRole.initControl();
                    ctrl.vmCheckboxList = ctrl.getViewModel(ctrl.view.el.find(".js-CheckboxList"),{meta:{"operationIds":{dataSource:result}},data:data});
                    ctrl.vmCheckboxList.initControl();
                    ctrl.view.el.find(".js-title").html(str);
                };
                roleModel.getRole(callback);
            });
        };

        var callback = function (model) {
            var data = model.attributes;
            var str="编辑角色";
            render(data,str);
            $(".js-roles").validate({
                rules: {
                    roleName: {
                        required: true
                    }
                },
                messages: {
                    roleName: {
                        required: "请输入角色名称"
                    }
                },
                onkeyup: false,
                onfocusout: function (element) {
                    var elem = $(element);
                    elem.valid();
                },
                errorPlacement: function (error, element) {
                    error.appendTo(element.parent().find(".js-error"));
                }
            });
        };
        if(_para["roleId"]){
            ctrl.getData(callback);
            ctrl.addEvent("click", ".js-button", "nexted");
        }
        else{
            var str="新增角色";
            render({},str);
            $(".js-roles").validate({
                rules: {
                    roleName: {
                        required: true,
                        isRole:true
                    }
                },
                messages: {
                    roleName: {
                        required: "请输入角色名称",
                        isRole:"角色名称已存在"
                    }
                },
                onkeyup: false,
                onfocusout: function (element) {
                    var elem = $(element);
                    elem.valid();
                },
                errorPlacement: function (error, element) {
                    error.appendTo(element.parent().find(".js-error"));
                }
            });
            ctrl.addEvent("click", ".js-button", "next");
        }
    };

    //判断是否选择权限
    ctrl.sure = function (){
        var input = $("input[type=checkbox]");
        var error = $(".roleError");
        var errorHtml = "请选择权限";

        var array = [];
        input.each(function(index){
            array.push(input[index]["checked"]);
        });
        if($.inArray(true, array) == -1){
            error.html(errorHtml);
            return false;
        }else{
            error.html("");
            return true;
        }
    };

    //获取ID对应的权限组信息
    ctrl.getData = function (callback) {
        roleModel.find({data:{"roleId":_para["roleId"]},callback:callback});
    };

    ctrl.next = function () {
        var callback = function(){
            layer.successMsg("提交成功",function(){
                X.router.back();
            });
        };
        ctrl.Submit(callback);
    };


    //添加管理员权限信息提交
    ctrl.Submit = function (callback) {
        if( $(".js-roles").valid() && ctrl.sure()){
            var data_system = ctrl.vmaddRole.collectData();
            var data_checkbox =ctrl.vmCheckboxList.collectData();
            var data = $.extend( false, {},data_system,data_checkbox);
            roleModel.addRole(data,callback);
        }
    };

    ctrl.nexted = function () {
        var callback = function(){
            layer.successMsg("提交成功",function(){
                X.router.back();
            });
        };
        ctrl.Submited(callback);
    };

    //修改管理员权限信息提交
    ctrl.Submited = function (callback) {
        if( $(".js-roles").valid() && ctrl.sure()){
            var data_system = ctrl.vmaddRole.collectData();
            var data_checkbox =ctrl.vmCheckboxList.collectData();
            var data = $.extend( false, {},data_system,{roleId:_para["roleId"]},data_checkbox);
            roleModel.changeRole(data,callback);
        }
    };


    var _para;
    ctrl.load = function(para){
        para = para || {};
        _para = para ;
        ctrl.rendering();
    };

    return ctrl;

});

