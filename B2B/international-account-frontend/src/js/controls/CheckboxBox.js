(function ($,X) { 

X.prototype.controls.widget("CheckboxBox",function (controlType) {

    var BaseControl = X.prototype.controls.getControlClazz("BaseControl");

    /**
    @class CheckboxBox 多选框
    @constructor 构造函数
    @param elem {DomNode} Dom节点
    @param option {Object} 配置信息
    */
    function CheckboxBox(elem,options) {
        BaseControl.call(this,elem,options);
        var that = this;
        this.elem.find("input[type=checkbox]").click(function(){
            var input = that.elem.find("input[type=checkbox]") ;
            if(options.click && X.prototype.isFunction(options.click)){
                options.click();
            }
            that.trigger("click");
        });

    }

    X.prototype.controls.extend(CheckboxBox,"BaseControl");
    CheckboxBox.prototype.constructor = CheckboxBox;


    /**
     @method init 获取多选框的值
     @param value {string} 获取多选框选中值
     */
    CheckboxBox.prototype.getValue = function(){
        item = this.elem.find("input[type='checkbox']");
        return item.val();
    };

    /**
     @method getTemplate
     @static 类静态方法
     @return 获取多选框控件模板
     */
    CheckboxBox.getTemplate = function (item) {
        var html = '<div>';
        html +=         '<input type="checkbox" id="item' + item.operationId + '" class="chk" value="'+ item.operationId +'"/><label for="item' + item.operationId + '"></label><span class="mt_5">' + item.operationName + '</span>';
        html +=    '</div>';
        return html;
    };

    /**
     @method setValue 设置多选框的值
     @param value {string} 设置多选框选中值
     */
    CheckboxBox.prototype.setValue = function(value){
        this.elem.find("input[type='checkbox'][value='"+value +"']");
    };

    /**
     @method getValue 获取多选框的值
     @param value {string} 获取多选框的选中值
     */
    CheckboxBox.prototype.getValue = function(){
        var checkbox = [];
        this.elem.find("input[type='checkbox']:checked").each(function(){
            checkbox.push($(this).val());
        });
        return checkbox;
    };

    /**
     @method setChecked 设置多选框的状态
     @param value {string} 设置多选框选中状态
     */
    CheckboxBox.prototype.setChecked = function(value){
        this.elem.find("input[type='checkbox']").attr("checked",value);
    };


    /**
     @method getChecked 获取多选框的状态
     @param value {string} 获取多选框选中状态
     */
    CheckboxBox.prototype.getChecked = function(){
        return this.elem.find("input[type='checkbox']").attr("checked");
    };


    /**
    @method init 重置多选框，设置为false
    */
    CheckboxBox.prototype.reset = function () {
        this.setValue(1);
    };

    return CheckboxBox;
});


})(jQuery,this.Xbn);