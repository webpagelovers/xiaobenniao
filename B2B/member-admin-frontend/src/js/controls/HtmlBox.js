(function ($,X) { 

X.prototype.controls.widget("HtmlBox",function (controlType) {
    /**
    @class HtmlBox text值
    @constructor 构造函数
    @param elem {DomNode} Dom节点
    @param option {Object} 配置信息
    */
    function HtmlBox(elem,options) {
        this.elem = elem;
        this.option = options;
    }

    X.prototype.controls.extend(HtmlBox,"BaseControl");
    HtmlBox.prototype.constructor = HtmlBox;

    HtmlBox.prototype.setValue = function (value) {
        return this.elem.text(value);
    };

    HtmlBox.prototype.getValue = function () {
        return this.elem.text();
    };

    HtmlBox.prototype.reset = function () {
        this.elem.text("");
    };

    return HtmlBox;
});


})(jQuery,this.Xbn);