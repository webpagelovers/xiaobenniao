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
        this.props()
        this.loadTemplate()
        elem.find("label").click(function(){
            var input = $(this).siblings("input")
            that.valueChanged(input)
        });
    }


    X.prototype.controls.extend(RadioBox,"BaseControl");
    RadioBox.prototype.constructor = RadioBox;

    RadioBox.prototype.props = function() {
        this.name           =  this.elem.attr('data-property-name') || this.elem.attr('name')
        this.association    =  this.elem.attr('data-association') !== undefined
        this.assocBox       =  this.association? this.elem.next(): null
        this.data           =  this.options.dataSource
    }
    

    RadioBox.prototype.loadTemplate = function(){
        var html = '',
            data = null

        if ((data = this.data) && data.length) {
            var isObj = Object.prototype.toString.call(data[0]) === '[object Object]'

            html += '<input type="hidden" name="'+ this.name +'">'
            
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
       return this.elem.find("input[type='radio']:checked").val() || this.elem.find('input[type=hidden]').val();
    };

    /**
     @method init 设置单选框的值
     @param value {string} 设置单选框选中值
     */
    RadioBox.prototype.setValue = function(value){
        var input = this.elem.find("input[value='"+value+"']").attr("checked","checked");
        this.valueChanged(input)
    };

    /**
     @method changed 单选框的值发生改变
     @param value {string} 设置单选框选中值
     */
    RadioBox.prototype.valueChanged = function(input){
        var val = input.val()
        if(this.options && X.prototype.isFunction(this.options.selectedChanged)){
            this.options.selectedChanged(val);
        } else {
            var hidden = this.elem.find('input[type=hidden]')
            if (hidden.length) {
                hidden.val(val)
                hidden.valid && hidden.valid()
            }
        }

        this.association && this.assocBox.length && this.matchAssociation(input)
    };

    RadioBox.prototype.matchAssociation = function(input){
        var index    = input.parent().index('.radioBox'),
            children = this.assocBox.children(),
            target   = children.eq(index)
        
        children.addClass('none').children('input').addClass('ignore')
        target.removeClass('none').children('input').removeClass('ignore')
    }

    /**
    @method init 重置单选框，设置为false
    */
    RadioBox.prototype.reset = function () {
        this.setValue("0");
    };

    return RadioBox;
});


})(jQuery,this.Xbn);