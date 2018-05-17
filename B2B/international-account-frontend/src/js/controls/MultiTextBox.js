(function ($,X) {

    X.prototype.controls.widget("MultiTextBox",function (controlType) {
        /**
         @class MultiTextBox 文本框
         @constructor 构造函数
         @param elem {DomNode} Dom节点
         @param option {Object} 配置信息
         */
        function MultiTextBox(elem,options) {
            options = options || {}
            this.props(elem, options)
        }

        var config = {
            attrs: [
                'number',
                'clazz',
                'connect-symbol'
            ]
        }

        var a = config.attrs

        var defaulOptions = {
            number: 3,
            clazz:  '',
            connectSymbol: ','
        }

        X.prototype.controls.extend(MultiTextBox,"BaseControl");
        MultiTextBox.prototype.constructor = MultiTextBox;

        /**
         @method init 重置文本框，设置为false
         */
        MultiTextBox.prototype.props = function (elem, options) {
            this.elem  = elem;
            this.name  = elem.attr('data-property-name') || elem.attr('name')

            for (var i in defaulOptions) {
                this[i] = options[i] || defaulOptions[i]
            }

            this.loadTemplate()
        };

        /**
         @method init 重置文本框，设置为false
         */
        MultiTextBox.prototype.loadTemplate = function () {
            var html  = '',
                index = 0

            while (index < this.number) {
                var key = this.name + index++
                html += '<input type="text" class="default_input mr20 '+ this.clazz+'" name="'+ key +'" data-property-name="'+ key +'">'
            }

            this.elem.html(html)
            this.inputs = this.elem.children()
        };

        /**
         @method init 重置文本框，设置为false
         */
        MultiTextBox.prototype.reset = function () {
            this.setValue("");
        };

        /*
         @method getValue 设置文本框val值
         */
        MultiTextBox.prototype.setValue = function (value) {
            if (value) {
                var me = this
                value.split(this.connectSymbol).forEach(function(val, i) {
                    me.inputs[i].value = val
                })
            }
        };

        /*
         @method getValue 获取文本框val值
         */
        MultiTextBox.prototype.getValue = function () {
            var val = ''
            this.inputs.each(function(i, item) {
                val += item.value + ','
            })

            return val.substr(0, val.length - 1)
        };

        return MultiTextBox;
    });


})(jQuery,this.Xbn);