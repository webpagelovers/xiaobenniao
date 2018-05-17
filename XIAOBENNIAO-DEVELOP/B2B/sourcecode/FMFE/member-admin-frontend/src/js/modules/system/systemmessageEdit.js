X.define("modules.system.systemmessageEdit",["model.systemMessageModel","common.layer","adapter.ueditor"],function (systemMessageModel,layer) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.system.tpl.systemmessageEdit
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.getData = function (callback) {
        systemMessageModel.find({data:{"messageId":_para["messageId"]},callback:callback});
    };

    ctrl.rendering = function () {
        var callback = function (model) {
            var data = model.attributes;
            view.render(data,function(){
                if(data){
                    $('.js-title').text('系统消息');
                    $('.js-label').html('系统消息')
                }
                ctrl.initControls(data);
            });
        };


        if(_para["messageId"]){
            ctrl.getData(callback);
        }
        else {
            view.render({},function(){
                ctrl.initControls();
            });
        }

    };


    ctrl.initControls = function (data) {
        data = data || {};
        ctrl.message = ctrl.getViewModel(ctrl.view.el.find(".js-type"),{meta: {"receiveUserCompanyType":{dataSource:systemMessageModel.const.receiver,
            defaultValue:0,
            selectedChanged: function (item) {
                var receiveTypeInput = ctrl.view.find(".receiveTypeVal");
                receiveTypeInput.val(item.key);
            }}},data:data});
        ctrl.message.initControl();
        UE.delEditor(editorId);
        ctrl.editor = UE.getEditor(editorId,{maximumWords:2000, toolbars:[["bold", "forecolor", "fontsize", "paragraph", "link"]]});
        UE.getEditor(editorId).addListener('blur',function(){
            var val = ctrl.editor.getContent();
            var editortext = ctrl.editor.getContentTxt()
            $('input[data-property-name=content]', view.el).val(val).next().val(editortext).valid()
        });
        ctrl.addEvent("click",".js-submit","send");
        ctrl.view.find(".js-save").click(function(){
            ctrl.save();
        });
        dataValidate();
    };
    var dataValidate = function () {                
        ctrl.view.el.find(".js-systemMessage").validate({
            rules: {
                title: {
                    required: true,
                    maxlength:50
                },
                receiveUserCompanyType : {
                    required : true
                },
                content:{
                    required: true,
                    rangelength:[1,2000]
                }
            },
            messages: {
                title: {
                    required: "请输入通知标题",
                    maxlength: "标题最多只能输入50个字"
                },
                receiveUserCompanyType : {
                    required : "请选择接收者"
                },
                content:{
                    required: "提示通知内容不能为空",
                    rangelength:"通知内容最多只能输入2000个字"
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

    ctrl.save = function(option){
        if(ctrl.view.el.find(".js-systemMessage").valid()){
            var data = ctrl.message.collectData();
            data.content = ctrl.editor.getContentTxt();
           systemMessageModel.save(data,function(result){
               ctrl.view.find(".js-save").unbind("click");
               if(result.statusCode=="2000000"){
                   layer.successMsg("保存成功",function(){
                       X.router.run("m=system.systemMessageList");
                   });
               }else{
                   layer.failMsg("保存失败",function(){
                       X.router.run("m=system.systemMessageList");
                   });
               }
            });
        }
    };
    ctrl.send = function (argument) {
        if(ctrl.view.el.find(".js-systemMessage").valid()){
            var data = ctrl.message.collectData();
            data.content = ctrl.editor.getContentTxt();
            layer.successConfirm('确认发送？', function(index){
                $(".layui-layer-btn0").unbind("click")
                systemMessageModel.send(data,function(result){
                    if(result.statusCode == "2000000"){
                        layer.successMsg("发送成功",function(){
                            layer.closeIt();
                            X.router.run("m=system.systemMessageList");
                        });
                    }else{
                        layer.failMsg("发送失败",function(){
                            layer.closeIt();
                            X.router.run("m=system.systemMessageList");
                        });
                    }

                });

            });
        }
    };

    var editorId = 'modules-system-systemMessage-editor';
    ctrl.dispose = function(){
        UE.delEditor(editorId);
    };

    var _para;
    ctrl.load = function(para){
        para = para || {};
        _para = para ;
        ctrl.rendering();
    };
    return ctrl;

});