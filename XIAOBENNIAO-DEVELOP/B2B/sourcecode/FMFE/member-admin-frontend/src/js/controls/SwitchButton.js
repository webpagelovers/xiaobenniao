(function ($,X) { 

X.prototype.controls.widget("SwitchButton",function (controlType) {

    var BaseControl = X.prototype.controls.getControlClazz("BaseControl");

	/**
    @class SwitchButton 状态框
    @constructor 构造函数
    @param elem {DomNode} Dom节点
    @param option {Object} 配置信息
    */
    function SwitchButton(elem,options) {
        BaseControl.call(this,elem,options);
        var that = this;
        this.elem.find("label").on("click", function(){
            var input = that.elem.find("input");
            if(input.val()==1){
                input.val(0);
                that.elem.find(".checkboxOne").removeClass("disabled");
                that.elem.find("span").eq(0).addClass("open").siblings("span").removeClass("open");
            }else{
                input.val(1);
                that.elem.find(".checkboxOne").addClass("disabled");
                that.elem.find("span").eq(1).addClass("open").siblings("span").removeClass("open");
            }
            if(X.prototype.isFunction(that.options.selectedChanged)){
                that.options.selectedChanged(input.val());
            }
        });
    }


    X.prototype.controls.extend(SwitchButton,"BaseControl");
    SwitchButton.prototype.constructor = SwitchButton;

    /**
     @method init 获取状态框的值
     @param value {string} 获取状态框选中值
     */
    SwitchButton.prototype.getValue = function(){
        return this.elem.find("input").val();
    };

    /**
     @method init 设置状态框的值
     @param value {string} 设置状态框选中值
     */
    SwitchButton.prototype.setValue = function(value){
        this.elem.find("input").val(value);
        if(value==1){
            this.elem.find(".checkboxOne").addClass("disabled");
            this.elem.find("input").attr("checked","checked");
            this.elem.find("span").eq(1).addClass("open");
        }
        else {
            this.elem.find(".checkboxOne").removeClass("disabled");
            this.elem.find("span").eq(0).addClass("open");
        }
    };

    /**
    @method init 重置状态框框，设置为1
    */
    SwitchButton.prototype.reset = function () {
        this.setValue("1");
    };

   	return SwitchButton;
});


})(jQuery,this.Xbn);