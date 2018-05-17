(function ($,X) { 

X.prototype.controls.widget("TabPanel",function (controlType) {     

    var BaseControl = X.prototype.controls.getControlClazz("BaseControl");

    // tabPannel then will into Xbn
    /**
     * tab标签切换
     *
     * @class TabPannel
     * @constructor
     * @param {DOM}     elem  [必需]  tab要做作用于的dom元素，里面应该包括.tab_btn和.js-tabContent元素
     * @param {Object}  opt   [必需]  初始化参数
     *     @param {function}  op.beforeChangeTab  [可选]    点击每个tab标签之前的参数，返回true，继续执行切换，返回false，不执行继续操作
     *     @param {function}  op.afterChangeTab   [可选]    点击每个tab标签之后的回调方法
     *     @param {String}    op.changeType       [可选]    点击每个tab标签的切换方式  'click'  or  'hover'   [default]  'click'
     */
    function TabPannel(elem, opt) {
        BaseControl.call(this,elem,opt);

        this.targetElement = elem;
        this.changeType = opt.changeType === 'hover'? 'mouseenter' : 'click';
        this.beforeChangeTab = opt.beforeChangeTab;
        this.afterChangeTab = opt.afterChangeTab;
        this.activeTabInfo = opt.activeTabInfo;
        this.tabBind();
    }

    X.prototype.controls.extend(TabPannel,"BaseControl");

    TabPannel.prototype.tabBind = function () {
        //功能，给选项卡组件的标题部分绑定事件
        var oUl = this.elem.find('.tab_btn>ul',this.targetElement)[0];
        var oLis =  $(oUl).children("li"); // this.elem.find('.tab_btn>ul>li');
        for (var i = 0; i < oLis.length; i++){
            $(oLis[i]).on(this.changeType, this.clickTabFn.call(this, $(oLis[i])));
        }
        var activeLi
            = ((this.activeTabInfo === '' || !this.activeTabInfo) ? false : $('[tabChangeInfo="' + this.activeTabInfo + '"]', this.targetElement))
            || (($('.tab_btn>ul>li[class="active"]', this.targetElement).length>0) ? ($('.tab_btn>ul>li[class="active"]', this.targetElement)): $('.tab_btn>ul>li',this.targetElement).first());
        this.changeTab(activeLi);
    };

    TabPannel.prototype.clickTabFn = function (oLi) {
        var self = this;
        var li = $(oLi);
        return function (e) {
            self.changeTab(li);
        }
    };

    TabPannel.prototype.changeTab = function (oli) {
        var oldTab = this.activeTabInfo;
        var oLis = $('li', oli.parent());
        var oDivs = this.targetElement.children().last().children();
        var index = $(oli).index();

        var beforeResoult;
        if (this.beforeChangeTab) {
            // 有钩子函数
            beforeResoult = this.beforeChangeTab($(oli).attr('tabChangeInfo'), oli, index, oDivs[index],oldTab);
        } else {
            beforeResoult = true;
        }
        if (beforeResoult) {
            for(var i=0; i<oLis.length; i++){
                oLis[i].className = "";
                oDivs[i].style.display = "none";
            }
            oLis[index].className = "active";
            oDivs[index].style.display = "";
            this.activeTabInfo = $(oLis[index]).attr("tabChangeInfo");
        }
        if (this.afterChangeTab) {
            this.afterChangeTab($(oli).attr('tabChangeInfo'), oli, index, oDivs[index],oldTab);
        }
    };

    TabPannel.prototype.getPanels = function () {
        var panles = [];

        this.elem.find("[tabChangeInfo]").each(function (index,elem) {
            panles.push($(this).attr("tabChangeInfo"));
        });

        return panles;
    };

    TabPannel.prototype.getActivePanel = function(){
        return this.activeTabInfo;
    };

    TabPannel.prototype.indexOf = function (tabInfo) {
        var result = 0;
        this.elem.find("[tabChangeInfo]").each(function (index,elem) {
            if($(this).attr("tabChangeInfo")==tabInfo ){
                result = index ;
            }
        });

        return result;
    };

    return TabPannel;

});

})(jQuery,this.Xbn);