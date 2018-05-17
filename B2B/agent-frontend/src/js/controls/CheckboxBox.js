(function ($, X) {

    X.prototype.controls.widget("CheckboxBox", function (controlType) {

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
        this.loadTemplate()
        this.elem.find("input[type=checkbox]").click(function(){
            var input = that.elem.find("input[type=checkbox]") ;
            if(options.click && X.prototype.isFunction(options.click)){
                options.click();
            } else {
                that.valueChanged(this)
            }
            that.trigger("click");
        });

        }

        X.prototype.controls.extend(CheckboxBox, "BaseControl");
        CheckboxBox.prototype.constructor = CheckboxBox;


    /**
     @method init 获取多选框的值
     @param value {string} 获取多选框选中值
     */
    CheckboxBox.prototype.getValue = function(){
        item = this.elem.find("input[type=hidden]");
        return item.val();
    };

        /**
         @method getTemplate
         @static 类静态方法
         @return 获取多选框控件模板
         */
        CheckboxBox.getTemplate = function (item) {
            var html = '<div>';
            html += '<input type="checkbox" id="item' + item.operationId + '" class="chk" value="' + item.operationId + '"/><label for="item' + item.operationId + '"></label><span class="mt_5">' + item.operationName + '</span>';
            html += '</div>';
            return html;
        };


    CheckboxBox.prototype.loadTemplate = function(){
        var name = this.elem.attr('data-property-name') || this.elem.attr('name')
            html = '',
            data = this.options.dataSource

        if (data && data.length) {
            var isObj = Object.prototype.toString.call(data[0]) === '[object Object]'

            html += '<input type="hidden" name="'+ name +'">'
            
            data.forEach(function(item, i) {
                var key = isObj? item.key: i,
                    val = isObj? item.value: item

                html += [
                            '<div class=" mb15 disib">',
                            '   <input type="checkbox" style="width:16px;height:16px;" name="radio" value="'+ key +'" id="radio'+ i +'">',
                            '   <label for="radio'+ i +'" class="f14 ml14 disib w120 ofh va_5">'+ val +'</label>',
                            //'   <span class="disib w150 ofh">'+ val +'</span>',
                            '</div>'
                        ].join('')
            })

            this.elem.html(html)
        }
    }

    /**
     @method init 设置多选框的值
     @param value {string} 设置多选框选中值
     */
    CheckboxBox.prototype.setValue = function(value){
        var target = this.elem.find("input[type='checkbox'][value='"+value +"']")[0];
        target.checked = true
        this.valueChanged(target)
        //target.click()
    };

        /**
         @method init 设置多选框的状态
         @param value {string} 设置多选框选中状态
         */
        CheckboxBox.prototype.setChecked = function (value) {
            this.elem.find("input[type='checkbox']").attr("checked", value);
        };


        /**
         @method init 获取多选框的状态
         @param value {string} 获取多选框选中状态
         */
        CheckboxBox.prototype.getChecked = function () {
            return this.elem.find("input[type='checkbox']").attr("checked");
        };

    /**
     @method changed 多选框的值发生改变
     @param value {string} 设置多选框选中值
     */
    CheckboxBox.prototype.valueChanged = function(target){
        var val     = target.value,
            checked = target.checked

        if(this.options && X.prototype.isFunction(this.options.selectedChanged)){
            this.options.selectedChanged.call(target);
        }
        
        var input = this.elem.find('input[type=hidden]')
        if (input.length) {
                var vval  = input.val(),
                    newV  = '',
                    newVV = ''

            if (checked) {
                newV = vval + ',' + val
            } else {
                vval.split(',').forEach(function(item) {
                    item != val && (newV += item + ',')
                })
            }
            newV.split(',').forEach(function(item) {
                item !== '' && (newVV += item + ',')
            })
            input.val(newVV.substr(0, newVV.length - 1))
            input.valid && input.valid()
        }
        
    };


        /**
         @method init 重置多选框，设置为false
         */
        CheckboxBox.prototype.reset = function () {
            this.setValue(1);
        };

        return CheckboxBox;
    });


})(jQuery, this.Xbn);