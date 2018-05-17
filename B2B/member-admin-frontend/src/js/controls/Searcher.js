(function ($,X) { 

    X.prototype.controls.widget("Searcher",function (controlType) {
        /**
        @class Searcher 搜索组件，是多个控件的集合
        @constructor 构造函数
        @param elem {jQuery对象},作为搜索要操作的Dom
        @param options {Object}  options["search"] : {"title":"搜索标题","onSearch":"回调方法"}
        @param options {Object}  options["reset"] : {"title":"重置标题，","show":"是否显示"}
        @param options {Object}  options["switch"] : {"title1":"高级标题","title2":"精简标题"}
        */
        function Searcher(elem,options){
            this.elem = elem;
            this.options = options || {};
            this.schema = this.options.schema || {};
            this.schema.simple = this.schema.simple || [];
            this.schema.senior = this.schema.senior || [];

            //保存所有创建的子控件
            this.controls =  {};

            

            this.options = initOptions(this.options);

            this.onSearch = this.options["search"] && this.options["search"]["onSearch"];

            this.onReset = this.options["reset"] && this.options["reset"]["onReset"];

            this.onSwich = this.options["switch"] && this.options["switch"]["onSwitch"];

            function initOptions(options){
                var defaultOption = {
                    "search" : {"title": "搜索"},
                    "reset" : {"title": "重置", "show": true, "onReset" : function(){}},
                    "switch" : {"title1" : "高级", "title2" : "精简" }
                };

                return $.extend(true,defaultOption,options);
            }
            
            this.dataFromUrl()
        }


        X.prototype.controls.extend(Searcher,"BaseControl");

        /**
         * 设置 从浏览器地址栏中获取 search 信息
         * 
         * 潜在问题：如果一个页面中有2个list, 就不知道是哪个对哪个, 但原先的routerHelper也没考虑到这个问题,
         *           如果要改改动会比较大, 所以暂时先不考虑这个问题
         * 
         * @method dataFromUrl
         */
        Searcher.prototype.dataFromUrl = function () {
            if (window.autoRouter && autoRouter.route) {
                this.options.defaultValue = autoRouter.route.ldata.searchData;
            }
        }

        /**
        @method init 初始化搜索框
        */
        Searcher.prototype.init = function() {
            if(!this.schema){
                return;
            }

            var that = this;

            var html = this.getHtml();

            this.elem.html(html);

            initSchema(this.schema);

            bindEvent();

            initState();

            setDefaulValue(this,this.options);

            function setDefaulValue(self,options) {
                if(options.defaultValue){
                    try{
                        self.val(options.defaultValue);
                    }
                    catch(e){
                        console.log("搜索条件数据错误");
                    }
                }
            }

            function initSchema(schema){
                var i=0,il=0;
                if(schema.simple && $.isArray(schema.simple)){
                    for(i=0,il=schema.simple.length; i<il ; i++){
                        initControl(that,schema.simple[i]);
                    }
                }

                if(schema.senior && $.isArray(schema.senior) && schema.senior.length>0){
                    for(i=0,il=schema.senior.length; i<il ; i++){
                        initControl(that,schema.senior[i]);
                    }
                }
            }

            function initControl(self,item){
                if(!item) return;
                var name = item["name"];
                var elem = self.elem.find(".js-"+item["name"]);
                var ctrl = X.prototype.controls.getControl(item["ctrlType"],elem,item);

                if(ctrl){
                    self.controls[name] = ctrl;
                    //ctrl.init(item);
                }
            }

            function bindEvent(){


                var binding = [{
                        selector : ".js-search",
                        type:"click",
                        fun : function(event){
                            that.fireSearch(true);
                        }
                    },
                    {
                        selector : "input",
                        type:"keyup",
                        fun : function(e){
                            var e =e||event;
                            if(e.keyCode == 13){
                                that.fireSearch(true);
                            }
                        }
                    },
                    {
                        selector : ".js-switch",
                        type:"click",
                        fun : function(){
                            that.switchState("slow");
                            if(X.prototype.isFunction(that.onSwich)){
                                that.onSwich(that);
                            }
                        }
                    },
                    {
                        selector : ".js-reset",
                        type:"click",
                        fun : function(){
                            that.reset();
                            if(X.prototype.isFunction(that.onReset)){
                                that.onReset();
                            }
                        }
                    }
                ];

                for(var i=0,il=binding.length;i<il;i++){
                    var item = binding[i];
                    that.elem.find(item["selector"]).on(item["type"],item["fun"]);
                }
            }

            function initState(){
                if(that.options.defaultValue && that.options.defaultValue["__senior__"]){
                    that.elem.data("simpleOrSenior","simple");
                }
                else{
                    that.elem.data("simpleOrSenior","senior");
                }
                that.switchState();
            }

        };


        Searcher.prototype.switchState = function (speed) {
            var options = this.options;
            var state = this.elem.data("simpleOrSenior") || "simple";
            var target = this.elem.find(".js-switch");
            if(state==="simple"){
                speed?this.elem.find(".js-seniorContainer").stop().show(speed):this.elem.find(".js-seniorContainer").stop().show();
                this.elem.data("simpleOrSenior","senior");
                target.find("span").text(options["switch"]["title2"]);
                target.find("em").addClass("icon-96");
            }
            else{
                speed?this.elem.find(".js-seniorContainer").stop().hide(speed):this.elem.find(".js-seniorContainer").stop().hide();
                this.elem.data("simpleOrSenior","simple");
                target.find("span").text(options["switch"]["title1"]);
                target.find("em").removeClass("icon-96");
            }
        }


        /**
        @method reset 清空搜索框
        */
        Searcher.prototype.reset = function(){
            if(!this.schema) return;
            var that = this;
            function setFieldValue(item,index,schema){
                var fieldName=item["name"];
                var ctrl = that.controls[fieldName];
                if(ctrl){
                    ctrl.reset();
                }
            }

            this.schema.simple.forEach(setFieldValue);

            this.schema.senior.forEach(setFieldValue);
        };

        /**
        @method setValue 给搜索框设值
        @param elem {Object},作为搜索组件内控件的值{"key1":"value1","key2":"value2"},其中日期控件的值是对象
        */
        Searcher.prototype.setValue = function (data) {
            if(!this.schema) return;
            var that = this;
            function setFieldValue(item,index,schema){
                var fieldName=item["name"];
                if(data[fieldName]!=undefined){
                    var fieldName=item["name"];
                    var ctrlType = item["ctrlType"];
                    var ctrl = that.controls[fieldName];
                    ctrl.val(data[fieldName]);
                }
            }


            this.schema.simple.forEach(setFieldValue);

            this.schema.senior.forEach(setFieldValue);
            if(data["__senior__"]==true){
                this.elem.data("simpleOrSenior","simple");
                this.switchState();
            }
        }

        /**
        @method collectValue 获取搜索组件值
        @return 获取搜索组件填入的值，以对象key,value形式返回{"key1":"value1","key2":"value2"}
        */
        Searcher.prototype.collectValue = function () {
            var schema = this.schema;
            var that = this;
            if(!schema){
                return;
            }
            var data=[];

            var getValue = function(item, itemIndex, schema){
                var ctrlType = item["ctrlType"];
                var name = item["name"];

                var ctrl = that.controls[name];
                if(ctrl){
                    var value = ctrl.val();
                    if(value){
                        return {
                            name : item["name"],
                            value : value,
                            ctrlType : ctrlType
                        }
                    }
                    else{
                        return null;
                    }
                }
            };

            schema.simple.forEach(function (item, itemIndex, schema) {
                    var result = getValue(item,itemIndex,schema);
                    if(result){
                        data.push(result);
                    }
            });

            var state= that.elem.data("simpleOrSenior");
            if("senior"=== state){
                schema.senior.forEach(function (item, itemIndex, schema) {
                    var result = getValue(item,itemIndex,schema);
                    if(result){
                        data.push(result);
                    }
                });

                data.push({name:"__senior__",value:true});
            }

            return data;
        };

        Searcher.prototype.formatValue = function (data) {
            var result = {};
            if(data){

                for (var i = 0; i < data.length; i++) {
                    result[data[i].name] = data[i].value;
                }
            }

            return result;
        };


        Searcher.prototype.val = function () {
            if(arguments.length>0){
                this.setValue(arguments[0]);
            }
            else{
                return this.formatValue(this.collectValue());
            }
        }

        /**
        @method fireSearch 触发搜索
        */
        Searcher.prototype.fireSearch = function (click) {           

            var data = this.collectValue();
            if(JSON.stringify(data)!=JSON.stringify(this._oldData)){
                this._oldData = data;
                data = this.formatValue(data);
                if(this.onSearch){
                    this.onSearch(data,this,click);
                }
            }            
        };

        /**
        @method getFieldHtml 获取单个控件html
        @return 返回单个控件在组件中的html
        */
        Searcher.prototype.getFieldHtml = function(item) {
            var ctrl = X.prototype.controls.getControlClazz(item["ctrlType"]);
            var ctrlHtml = ctrl.getTemplate(item);
            if(item["className"]){
                ctrlHtml = $(ctrlHtml).addClass(item["className"]).prop("outerHTML");
            }

            var html='<dl class="screen_box fL"><dt>' + item["title"] +'：</dt>';
            html +="<dd>" + ctrlHtml +"<dd></dl>";
            return html;
        };

        /**
        @method getHtml 获取搜索组件html
        @return 搜索组件html
        */
        Searcher.prototype.getHtml = function(schema,options){
            schema = schema || this.schema;
            options = options || this.options;
            var html = "",simpleHtml="",seniorHtml="",opHtml="";
            var i,il;
            if(schema.simple && $.isArray(schema.simple)){
                simpleHtml='<div class="screen_search_main fix">';
                for(i=0,il=schema.simple.length; i<il ; i++){
                    simpleHtml += this.getFieldHtml(schema.simple[i]);
                }

                opHtml += '<div class="screen_box search_main fL"><dt><input type="button" class="default_button  fL js-search" value="'+ options.search["title"]+ '">';


                if(options["reset"]["show"]){
                    //重置reset
                    opHtml += '<input type="button" class="reset_button ml30 js-reset" value="重置"><dt></dl>';
                }


                if(schema.senior && $.isArray(schema.senior) && schema.senior.length>0){
                    //若有高级搜索，则其后增加切换（精简/高级的）switchButton.
                    opHtml += '<a href="javascript:;" class="screen_search js-switch"><span>'+options.switch["title1"] +'</span><em class="icon-95"></em></a>';
                }

                opHtml+="</div>";

                simpleHtml+=opHtml;

                simpleHtml+="</div>";
            }



            //高级搜索
            if(schema.senior && $.isArray(schema.senior)){
                seniorHtml ="<div class='js-seniorContainer'>";
                for(i=0,il=schema.senior.length; i<il ; i++){
                    seniorHtml += this.getFieldHtml(schema.senior[i]);
                }
                seniorHtml +="</div>";
            }


            html = Searcher.getTemplate(simpleHtml,seniorHtml);

            return html;
        };


        /**
        @method dispose 释放组件引用的对象
        */
        Searcher.prototype.dispose = function () {
            this.elem = null;
            this.options = null;
            this.schema = null
            this.controls.length = 0;
        }


        /**
        @method getTemplate 获取搜索组件模板
        @static 类静态方法
        */
        Searcher.getTemplate = function(simpleHtml,seniorHtml){
            var html = "<div class='js-searchContainer screen_search_main fix'>";
                html+= simpleHtml;
                html+= seniorHtml;
                html+= "</div>";

            return html;
        }

        return Searcher;

});

})(jQuery,this.Xbn);