X.define("modules.email.emailSetting",["model.emailModel","modules.common.ueditorImageUploader"],function (emailModel) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.email.tpl.emailSetting
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    var editorid = {
        email: "modules.email.emailSetting-email",
        password:"modules.email.emailSetting-password",
        testEmail: "modules.email.emailSetting-testEmail"
    };
    var tabArr = {
        email: "validateContent",
        password : "retrievePasswordContent",
        testEmail : "testContent"
    };

    var emailData;

    ctrl.rendering = function () {

        //第一步，向服务器请求数据（邮箱配置）
        //得到数据


        var callback = function(data){
            ctrl.vm = ctrl.getViewModel(ctrl.view.el.find(".js-emailSetting"),{data:emailData.emailSetting});
            ctrl.vm.initControl();

            //ctrl["email"].setContent(data.validateContent);

            ctrl.view.el.find(".js-tabWrite").click(function(event){
                var data_id = $(this).parent().siblings().find(".edui-default").attr("id");
                var ue = UE.getEditor(data_id);
                if($(this).find("em").html() == "编辑"){
                    $(this).find("em").html("保存");
                    ue.setEnabled();
                }
                else{
                    $(this).find("em").html("编辑");
                    var emailType = $(this).parent().find(".js-emailType").text();
                    emailModel.emailTemplate({ data:{type:getEmailType(emailType),content:ue.getContent()}  ,callback:function(data){
                        //向服务器上传新内容
                        ue.setDisabled();
                    }});
                }
            });
        };

        view.render({},function(){
            dataValidate();
            emailModel.getEmail(function(data){
                emailData = data;
                callback(data);
                ctrl.vm.setDisabled();
            });
            ctrl.initPage();
        });

    };


    var bindEvent = function(){
        ctrl.addEvent("click",".js-write","write");
        ctrl.addEvent("click",".js-send","send");

        //ctrl.addEvent("click",".js-tabWrite","toggleUE");
    };
    ctrl.send = function(){
        if(ctrl.view.el.find(".js-testEmailForm").valid()){
            var emailAddress = ctrl.view.el.find(".js-testEmail").val();
            emailModel.emailTest({data:{emailAddress:emailAddress},callback:function(){
                console.log("成功");
            }});
        }
    };
    var getEmailType = function(type){
        if(type == emailModel.constant.emailType.EMAIL.text){
            return emailModel.constant.emailType.EMAIL.key
        }else if(type == emailModel.constant.emailType.PASSWORD.text){
            return emailModel.constant.emailType.PASSWORD.key
        }else{
            return emailModel.constant.emailType.TESTEMAIL.key
        }
    };
    ctrl.resetData = function(){
        ctrl.vm.reset();
    };
    ctrl.write = function(){
        if( ctrl.view.el.find(".js-write em").html() == "编辑" ){
            ctrl.view.el.find(".js-write em").html("保存");
            ctrl.vm.setDisabled(false);
        }
        else{
            if(ctrl.view.el.find(".js-emailSetting").valid()){
                var data = ctrl.vm.collectData();
                emailModel.emailSetting({data:data,callback:function(result){
                    ctrl.view.el.find(".js-write em").html("编辑");
                    ctrl.vm.setDisabled();
                }});
            }

        }
    };



    bindEvent();

    var dataValidate = function(){
        ctrl.view.el.find(".js-emailSetting").validate({
            rules: {
                stmpServer: {
                    required: true,
                    rangelength: [1, 30]
                },
                stmpUserName: {
                    required: true,
                    rangelength: [1, 10]
                },
                stmpPort: {
                    required: true,
                    rangelength: [1, 10]
                },
                stmpPassword: {
                    required: true,
                    rangelength: [1, 30]
                },
                senderEmail: {
                    required: true,
                    rangelength: [1, 30]
                }
            },
            messages: {
                stmpServer: {
                    required: "请输入邮件服务器地址",
                    rangelength: "服务器地址应当在30字以内"
                },
                stmpUserName: {
                    required: "请输入STMP用户名",
                    rangelength: "服务器地址应当在10字以内"
                },
                stmpPort: {
                    required: "请输入STMP端口",
                    rangelength: "服务器端口应当在10字以内"
                },
                stmpPassword: {
                    required: "请输入STMP密码",
                    rangelength: "STMP密码应当在30字以内"
                },
                senderEmail: {
                    required: "请输入发件人邮箱",
                    rangelength: "发件人邮箱应当在30字以内"
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
                error.appendTo(element.siblings().find('.js-error'));
            },
            submitHandler: function (form) {
                //that.trigger("submit");
            }

        });
        ctrl.view.el.find(".js-testEmailForm").validate({
            rules: {
                testEmail: {
                    required: true,
                    email : true
                }
            },
            messages: {
                testEmail: {
                    required: "请输入测试邮箱地址",
                    email: "请输入合法的邮箱地址"
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
                error.appendTo(element.siblings().find('.js-error'));
            },
            submitHandler: function (form) {
                //that.trigger("submit");
            }

        });

        ctrl.vm = ctrl.getViewModel(ctrl.view.el.find(".js-supplierInfo"),{meta:{status:{selectedChanged:function(value){
            ctrl.review(value);
        }}}});
        ctrl.vm.initControl();
    };

    ctrl.load = function (para) {
        ctrl.rendering();
    };

    function initTabPage($elem,tabPage) {
        UE.delEditor(editorid[tabPage]);
        ctrl[tabPage] = UE.getEditor(editorid[tabPage],{maximumWords:2000,onready:function(){
            if(emailData && emailData.emailTemplate){
                console.log(tabArr[tabPage]);
                ctrl[tabPage].setContent(emailData.emailTemplate[tabArr[tabPage]]);
                //所有word不可用
                ctrl[tabPage].setDisabled();
            }
        }});
        ctrl.view.find(".edui-editor").removeAttr("style");
        ctrl.view.find(".edui-editor").css("z-index","999");
    }
    ctrl.initPage  =function (){
        var tabPannel = X.controls.getControl("TabPanel",$('.js_tabPannel'), {
            activeTabInfo: "email",
            beforeChangeTab: function (tabLiInfo, targetLi, index, tabPage) {
                activeTabLiInfo = tabLiInfo;
                // 刊登状态 不同
                var page = $(tabPage);
                if(!page.data("hasInited")){
                    initTabPage(page,tabLiInfo);
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

    ctrl.dispose = function(){
        for(var k in editorid){
            if(editorid.hasOwnProperty(k)){
                UE.delEditor(editorid[k]);
            }
        }
    };
    return ctrl;

});
