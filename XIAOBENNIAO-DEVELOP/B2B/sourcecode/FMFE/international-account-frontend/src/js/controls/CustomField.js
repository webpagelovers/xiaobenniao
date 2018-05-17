(function ($,X) {

    X.prototype.controls.widget("CustomField", function (controlType) {

        var BaseControl = X.prototype.controls.getControlClazz("BaseControl");

        function CustomField(elem, options){
            BaseControl.call(this,elem,options);
            this.init(elem, options);
        }

        X.prototype.controls.extend(CustomField,"BaseControl");

        CustomField.prototype.constructor = CustomField;

        CustomField.prototype.init = function(elem, options) {
            this.props(elem, options)
            this.loadTemplate()
            this.eventBind()

            this.values.length && this.renderAll()
        }

        var defaultOptions = {
            title:    '+自定义字段',
            location: 'prev',
            clazz:    '',
            min:      1,
            max:      20
        }

        //内部使用变量
        var _options = {
            boxClass: 'custom-field-div',
            delClass: 'custom-field-del'
        }

        /**
         @method props 添加属性
         */
        CustomField.prototype.props = function(elem, options) {
            this.name       =   this.elem.attr('data-property-name') || this.elem.attr('name')
            this.elem       =   elem
            this.options    =   options || {}
            this.wrapper    =   this.options.place? $(this.options.place): this.elem.parent().parent(),
            this.values     =   options.values || []//当前定的数据格式为[{key: name, val: huahua}, {key: name, val: huahua}] 根据需求来自定义数据格式

            for (var i in defaultOptions) {
                !this.options[i] && (this.options[i] = defaultOptions[i])
            }
        }

        /**
         @method loadTemplate 添加模板
         */
        CustomField.prototype.loadTemplate = function() {
            var name = this.name,
                html = [
                    '<span>'+ this.options.title +'</span>',
                    '<input type="hidden" name="'+ name +'">'
                ].join('')

            this.elem.append(html)
            this.inputHidden = this.elem.children('input[type=hidden]')
        }

        CustomField.prototype.eventBind = function() {
            var me = this
            //添加字段事件
            this.elem.on('click', '>span:first-child', function() {
                me.currentValue = null
                me.addCustomField.call(me, this)
            })

            //删除字段事件
            $('body').off('click').on('click', '.' + _options.delClass, function() {
                me.delCustomField.call(me, this)
            })

            //input blur 更改 values 值
            $('body').off('blur').on('blur', '.' + _options.boxClass+' input', function() {
                me.valueChanged.call(me, this)
            })
        }

        CustomField.prototype.addCustomField = function() {
            var val = this.currentValue,
                tem = [
                '<div class="'+ _options.boxClass +' '+ this.options.clazz +'">',
                '    <span>',
                '        <input type="text" class="default_input" value="'+ (val? val[0]: '') +'">',
                '    </span>',
                '    <input type="text" class="default_input" value="'+ (val? val[1]: '') +'">',
                '    <i class="'+ _options.delClass +'">删除</i>',
                '</div>'
            ].join('')

            this.wrapper[this.options.location]().after(tem)
        }

        /**
         @method valueChanged
         */
        CustomField.prototype.valueChanged = function() {
            var hiddenVal = '',
                clazz     = this.options.clazz? this.options.clazz: _options.boxClass,
                fields    = this.wrapper.siblings('.' + clazz),
                values    = []

            fields.each(function(i, item) {
                var inputs = $(item).find('input')
                values.push({key: inputs[0].value, val: inputs[1].value})
                hiddenVal += 'a'
            })

            this.values = values
            this.inputHidden.val(hiddenVal).valid()
        }

        CustomField.prototype.delCustomField = function(tar) {
            $(tar).parent().remove()
            this.valueChanged()
        }

        CustomField.prototype.getValue = function() {
            return this.values
        }

        CustomField.prototype.setValue = function(value) {
            this.values = value || []
            this.values.length && this.renderAll()
        }

        CustomField.prototype.renderAll = function(value) {
            var me = this
            this.values.forEach(function(item, i) {
                me.currentValue = item
                me.addCustomField()
            })
        }

        return CustomField;
    });

})(jQuery,this.Xbn);