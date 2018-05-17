(function ($,X) {

    X.prototype.controls.widget("SubmitControl",function (controlType) {

        var BaseControl = X.prototype.controls.getControlClazz("BaseControl");

        /**
         @class Submit 多表单提交
         @constructor 构造函数
         @param elem {DomNode} Dom节点
         @param option {Object} 配置信息
         */
        function SubmitControl(elem, options){

            BaseControl.call(this,elem,options);

            this.validate();
            var that = this;
            debugger;
            this.elem.find(".js-submit").click(function(){
                 that.sub(options);
            })
        };

        X.prototype.controls.extend(SubmitControl,"BaseControl");

        SubmitControl.prototype.constructor = SubmitControl;

        /**
         @method init 验证
         */
        SubmitControl.prototype.validate = function () {
            var that = this;
            that.elem.find(".js-bidanswer").validate({
                rules: {
                    answerContent: {
                        rangelength: [1, 300]
                    }
                },
                messages: {
                    answerContent: {
                        rangelength: "字数超出限制，请输入300字以内的答案！"
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


        /**
         @method init 点击按钮提交表单
         */
        SubmitControl.prototype.sub = function(options){
            var that = this;

            var textBox = X.prototype.controls.getControl("TextBox", that.elem.find("[name=answerContent]"));
            textBox.init();

            var postData = textBox.getValue();
            var tenderTalkId = that.elem.find("input[type=hidden]").val();

            if(X.prototype.isFunction(options.submit2)) {
                if(postData == ""){
                    var error = '<label for="answerContent" generated="true" class="error">不能为空</label>';
                    $(error).appendTo(that.elem.find(".js-error"));
                }else if(postData && that.elem.find(".js-bidanswer").valid()){
                    options.submit2(postData,tenderTalkId);
                }
            }
        };

        return SubmitControl;
    });

})(jQuery,this.Xbn);