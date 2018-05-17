(function ($,X) { 

    var BaseControl = X.prototype.controls.getControlClazz("BaseControl");


    function Toolbar(elem,option) {
        this.$elem = $(elem);
        this.option = option;
        this.controls = {};
    }

    Toolbar.prototype = X.prototype.createObject(BaseControl.prototype);

    $.extend(Toolbar.prototype,{
        init: function (option) {
            var item ;

            this.option = option || this.option;

            this.$elem.html(this.getTemplate(this.option));

            for (var i = 0; i < this.option.items.length; i++) {
                item = this.option.items[i];
                initControl(item,this);
            }

            function initControl(item,self) {
                if(!item) return;
                var name = item["name"];
                var elem = self.$elem.find(".js-"+item["name"]);
                var ctrl = X.prototype.controls.getControl(item["ctrlType"],elem,item);

                ctrl.init(item,function (argument) {
                    //console.log(name +  "初始化结束");
                });

                ctrl.Parent(self);

                self.controls[name] = ctrl;
            }

        },

        val : function () {
            // body...
        },


        /**
        @method getHtml 获取搜索组件html
        @return 搜索组件html
        */
        getTemplate: function(option){
            var items = option.items;
            var item,html="";
            if(items){
                for (var i = 0; i < items.length; i++) {
                    item = items[i];
                    html += X.prototype.controls.getTemplate(item);
                }
            }

            return html;
        }

    });

    function ToolbarItem(option) {
        if(option){
            this.option = option;
            this.name = option["name"] || "ToolbarItemName";
            this.title = option["title"] || "ToolbarItemTitle";
            this.click = option["click"] ||
                function () {
                    //console.log("没有设置操作函数")
                };
        }
    }

    ToolbarItem.prototype = X.prototype.createObject(BaseControl.prototype);

    $.extend(ToolbarItem.prototype,{
        Parent: function () {
            if(arguments.length>0){
                this.parent = arguments[0];
            }
            else{
                return this.parent;
            }
        }
    });

    /**
    @class ToolbarItem 按钮
    @constructor 构造函数
    @param elem {DomNode} Dom节点
    @param option {Object} 配置信息
    */
    function ToolbarButton(elem,option) {
        ToolbarItem.call(this,option);
        this.$elem = $(elem);
    }



    ToolbarButton.getTemplate = function (option) {
        return '<a href="javascript:;" class="listButton js-'+option["name"]+ ' '+ (option["className"] || '') + '"><em class="iconfont '+ (option["icon"] || "") +'"></em>'+option["title"]+'</a>';
    };


    ToolbarButton.prototype = X.prototype.createObject(ToolbarItem.prototype);

    $.extend(ToolbarButton.prototype,{
        init: function (option) {
            var that = this;
            this.option = option || this.option;
            if(this.option && this.option.click){
                this.$elem.click(function (event) {
                    that.option.click(that);
                });
            }
        },
        val: function () {
            // body...
        }
    });


    /**
    @class ToolbarItem 按钮
    @constructor 构造函数
    @param elem {DomNode} Dom节点
    @param option {Object} 配置信息
    */
    function ToolbarDropdown(elem,option) {
        ToolbarItem.call(this,option);
        this.$elem = $(elem);
        this.option = option;
        this.$dropdown = this.$elem.find(".js-dropdown");
        this.$dropdownItem = this.$elem.find(".js-dropdownItem");
        this.$dropdownItem.hide();
    }

    ToolbarDropdown.prototype = X.prototype.createObject(ToolbarItem.prototype);

    $.extend(ToolbarDropdown.prototype,{
        /**
        @method getLists 初始化，填入下拉项
        */
        init: function () {
            var that = this;
            if(this.option.items){
                this.items = this.getMenuItems(this.option.items);
                var domList = [], item;

                for (var i = 0; i < this.items.length; i++) {
                    item = this.items[i];
                    domList.push(item.$elem);
                }
                this.$dropdownItem.append(domList);
                if(this.option.onItemClick){
                    this.$dropdownItem.on("click",function (event) {
                        if(that.option.onItemClick){
                            if(event.target.tagName=="A"){
                                that.$dropdownItem.hide();
                                var name = $(event.target).data("name");
                                item = that.getMenuItem(name);
                                that.option.onItemClick(item);
                            }
                        }
                    });
                }
            }
            this.$dropdown.click($.proxy(function (argument) {
                this.$dropdownItem.toggle();
            },this));

            $(document).on("click",function (argument) {
                if(!$(event.target).is(".js-dropdown") && !$(event.target).parent().is(".js-dropdown")){
                    if(that.$dropdownItem.is(":visible")){
                        that.$dropdownItem.hide();
                    }
                }
            });
        },

        /**
        @method getLists 生成下拉列表
        @param ds {Array} 下拉数据源
        @param dv {string} 默认选中项
        @return 获取下拉框控件选项
        */
        getMenuItems: function(items){
            var result=[], item;
            for(var i=0,il=items.length; i<il; i++){
                item = items[i];
                if(item){
                     item = new ToolbarMenuItem(item);
                     item.init();
                     result.push(item);
                }
            }
            return result;
        },

        getMenuItem: function (name) {
            for (var i = 0; i < this.items.length; i++) {
                if(this.items[i].name===name){
                    return this.items[i];
                }
            }
            return null;
        }

    });

    ToolbarDropdown.getTemplate = function (option) {
        var template = '<div class="rel inline_block js-'+option["name"]+'">'+
                '<a href="javascript:;" class="listButton mR20 mark js-dropdown">'+option["title"]+'<i class="xbn_ico markSlid"></i></a>'+
                '<div class="oprTips js-dropdownItem">'+
                    '<em class="dot1"></em>'+
                    '<em class="dot2"></em>'+
                '</div>'+
            '</div>';

        return template;
    };


    function ToolbarMenuItem(option) {
        this.option = option;
        ToolbarItem.call(this,option);
    }

    ToolbarMenuItem.getTemplate = function (option) {
        return '<p><em class="'+(option["className"] || '')+'"></em><a href="javascript:;" class="titlelinkDefult js-'+option["name"]+'" data-name="'+option["name"]+'">'+option["title"]+'</a></p>'
    }


    ToolbarMenuItem.prototype = X.prototype.createObject(ToolbarItem.prototype);

    $.extend(ToolbarMenuItem.prototype,{
        init: function (option) {
            this.option = option || this.option;
            var tmpl = ToolbarMenuItem.getTemplate(this.option);
            this.$elem = $(tmpl);
            if(this.option.click){
                this.$elem.on("click",$.proxy(function (argument) {
                    this.option.click(this);
                },this));
            }
        },
        destroy: function (argument) {
            this.option = null;
            this.$elem = null;
        }
    });


    X.prototype.controls.registerControl("ToolbarButton",ToolbarButton);
    X.prototype.controls.registerControl("ToolbarDropdown",ToolbarDropdown);
    X.prototype.controls.registerControl("Toolbar",Toolbar);


})(jQuery,this.Xbn);