(function ($, X) {

    X.prototype.controls.widget("RadioBox", function (controlType) {

        var BaseControl = X.prototype.controls.getControlClazz("BaseControl");

        /**
         @class RadioBox 单选框
         @constructor 构造函数
         @param elem {DomNode} Dom节点
         @param option {Object} 配置信息
         */
        function RadioBox(elem, options) {
            BaseControl.call(this, elem, options);
            var that = this;
            elem.find("label").click(function () {
                if (that.options && X.prototype.isFunction(that.options.selectedChanged)) {
                    that.options.selectedChanged($(this).siblings("input").val());
                }
            });
        }


        X.prototype.controls.extend(RadioBox, "BaseControl");
        RadioBox.prototype.constructor = RadioBox;


        /**
         @method init 获取单选框的值
         @param value {string} 获取单选框选中值
         */
        RadioBox.prototype.getValue = function () {
            return this.elem.find("input[type='radio']:checked").val();
        };

        /**
         @method init 设置单选框的值
         @param value {string} 设置单选框选中值
         */
        RadioBox.prototype.setValue = function (value) {
            this.elem.find("input[value='" + value + "']").attr("checked", "checked");
        };

        /**
         @method init 重置单选框，设置为false
         */
        RadioBox.prototype.reset = function () {
            this.setValue("0");
        };

        return RadioBox;
    });


})(jQuery, this.Xbn);