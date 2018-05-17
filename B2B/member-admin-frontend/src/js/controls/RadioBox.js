(function ($,X) { 

X.prototype.controls.widget("RadioBox",function (controlType) {

    var BaseControl = X.prototype.controls.getControlClazz("BaseControl");

	/**
    @class RadioBox 单选框
    @constructor 构造函数
    @param elem {DomNode} Dom节点
    @param option {Object} 配置信息
    */
    function RadioBox(elem,options) {
        BaseControl.call(this,elem,options);
        var that = this;
        this.loadTemplate()
        elem.find("label").click(function(){
            var val = $(this).siblings("input").val()
            that.valueChanged(val)
        });
    }


    X.prototype.controls.extend(RadioBox,"BaseControl");
    RadioBox.prototype.constructor = RadioBox;

    RadioBox.prototype.loadTemplate = function(){
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
                            '<div class="radioBox">',
                            '   <input type="radio" name="radio" value="'+ key +'" id="radio'+ i +'">',
                            '   <label for="radio'+ i +'"></label>',
                            '   <span>'+ val +'</span>',
                            '</div>'
                        ].join('')
            })
            
            this.elem.html(html)
        }
    }

    /**
     @method init 获取单选框的值
     @param value {string} 获取单选框选中值
     */
    RadioBox.prototype.getValue = function(){
       return this.elem.find("input[type='radio']:checked").val();
    };

    /**
     @method init 设置单选框的值
     @param value {string} 设置单选框选中值
     */
    RadioBox.prototype.setValue = function(value){
        this.elem.find("input[value='"+value+"']").attr("checked","checked");
        this.valueChanged(value)
    };

    /**
     @method changed 单选框的值发生改变
     @param value {string} 设置单选框选中值
     */
    RadioBox.prototype.valueChanged = function(val){
        if(this.options && X.prototype.isFunction(this.options.selectedChanged)){
            this.options.selectedChanged(val);
        } else {
            var input = this.elem.find('input[type=hidden]')
            if (input.length) {
                input.val(val)
                input.valid && input.valid()
            }
        }
    };

    /**
    @method init 重置单选框，设置为false
    */
    RadioBox.prototype.reset = function () {
        this.setValue("0");
    };

   	return RadioBox;
});


})(jQuery,this.Xbn);