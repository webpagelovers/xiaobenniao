(function ($,X) {

    X.prototype.controls.widget("ComboBox",function (controlType) {

        var BaseControl = X.prototype.controls.getControlClazz("BaseControl");

        /**
         @class ComboBox 下拉框
         @constructor 构造函数
         @param elem {DomNode} Dom节点
         @param option {Object} 配置信息
         */
        function ComboBox(elem,options){
            BaseControl.call(this,elem,options);
            !this.elem.html() && this.loadTemplate()
            this.opts = this.elem.find('ul.dropdown');
            this.placeholder = this.elem.children('i');
            this.input = this.elem.find('input');
            this.selectItem = {"key":-1,"value":""};

            this.isHidden = true;

            this.init();
        }

        /**
         @method getTemplate
         @static 类静态方法
         @return 获取下拉框控件模板
         */
        ComboBox.getTemplate = function(item){
            var html =    '<div class="wrapper-dropdown '+ item['className']+' selected js-'+item["name"]+'">';
            html +=    '<input type="hidden" name="'+item["name"]+'">';
            html +=        '<i>please select</i>';
            html +=             '<ul class="dropdown">';
            html +=             '</ul>';
            html +=    '</div>';
            return html;
        }


        X.prototype.controls.extend(ComboBox,"BaseControl");

        ComboBox.prototype.loadTemplate = function(){
            var name = this.elem.attr('data-property-name') || this.elem.attr('name')
                html = [
                    '<input type="hidden" name="'+ name +'">',
                    '<i>please select</i>',
                    '<ul class="dropdown"></ul>'
                ].join('')
                
            this.elem.html(html)    
        }

        /**
         @method getLists 生成下拉列表
         @param ds {Array} 下拉数据源
         @param dv {string} 默认选中项
         @return 获取下拉框控件选项
         */
        ComboBox.prototype.getLists = function(ds,dv){
            var html = '<li index-data="-1" class="none"><span>please select</span></li>';
            var item;
            for(var i=0,il=ds.length; i<il; i++){
                item = ds[i];
                if(item){
                    if(item["key"]==dv){
                        html += '<li index-data="'+item["key"]+'" active><span class="Truncate">'+item["value"]+'</span></li>';
                        //html += "<option value='"+key+"' selected>" + ds[key] + "</option>";
                    }
                    else{
                        //html += "<option value='"+key+"' >" + ds[key] + "</option>";
                        html += '<li index-data="'+item["key"]+'"><span class="Truncate">'+item["value"]+'</span></li>';
                    }
                }
            }
            return html;
        };

        /**
         @method getDataSource 获取下拉列表
         @param field {Object} 下拉数据源配置，从服务器获取
         @param callback {function} 回调函数，得到数据后，调用此方法
         */
        ComboBox.prototype.getDataSource = function(field,callback){
            X.prototype.controls.getDataSource(field["refUrl"],field["refKey"],field["refValue"],callback,field["type"],field["postData"]);
        };

        /**
         @method getDataSource 显示下拉列表         
         */
        ComboBox.prototype.show = function () {
            this.elem.siblings(".wrapper-dropdown").removeClass("active");
            this.elem.toggleClass('active'); 
            this.isHidden = false; 
        };

        /**
         @method getDataSource 隐藏下拉列表
         */
        ComboBox.prototype.hide = function () {            
            this.isHidden = true;            
            this.elem.removeClass('active'); 
        };

        /**
         @method init 初始化下拉框
         @param field {Object} 下拉数据源配置，数据从服务器获取
         @param callback {function} 回调函数，初始化完成后调用
         */
        ComboBox.prototype.init = function() {
            
            $('body').click(function(event) {
                if ( (event.target === that.elem[0]|| $(event.target).parent().get(0)== that.elem[0])  && that.isHidden) {
                    return that.show();
                } else if (!that.isHidden) {
                    return that.hide();
                }
            });
            
            var that = this;
            var seleted = function(){                
                that.opts.on('click',function(event){
                    if(event.target.tagName =="LI" || event.target.tagName =="SPAN") {
                        var opt = $(event.target);
                        if(event.target.tagName=="SPAN"){
                            opt = $(event.target).parent("li");
                        }
                        else{
                            opt = $(event.target);
                        }
                        that.selectItem.value = opt.text();
                        that.selectItem.key = opt.attr("index-data");
                        that.placeholder.text(opt.text());
                        that.input.value = opt.text();
                        if(that.options.selectedChanged){
                            that.options.selectedChanged({text:that.selectItem.value,key:that.selectItem.key});
                        } else {
                            var input = that.input
                            input.length > 0 ? input.val(that.selectItem.key) : '';
                            input.length > 0 ? input.valid && input.valid(): '';
                        }
                    }
                });
            }

            seleted();

            this.setDataSource();
            this.setValue(this.options.selectItem.key);
        };

        /**
         @method setDataSource 设置下拉列表
         @param dataSource {Object} 下拉数据源配置，从服务器获取
         */
        ComboBox.prototype.setDataSource = function(dataSource){
            var that = this;
            var $ul = that.elem.find("ul");
            $ul.empty();
            that.placeholder.html("please select");
            var ds = dataSource || this.options.dataSource;
            var html = "", defaultValue=this.options ["defaultValue"];
            if(ds){
                html = this.getLists(ds,defaultValue);
                $ul.append(html);
                if(defaultValue!=undefined){
                    that.val(defaultValue);
                }
            }
            else{
                //如果没有配置dataSource,则尝试从服务器取数据
                if(this.options ["refUrl"]){
                    var that = this;
                    this.getDataSource(this.options ,function(data){
                        //填充界面数据，
                        html = that.getLists(data,defaultValue);
                        $ul.append(html);
                        if(defaultValue){
                            that.val(defaultValue);
                        }
                    });
                }
            }
        };

        /**
         @method init 设置（获取）下拉框的值
         @param value {string} 设置下拉框选中值
         */
        ComboBox.prototype.val = function(){

            var that = this;

            var _setValue = function (value) {
                var text = that.elem.find('ul>li[index-data="'+key+'"]').addClass("active").text();
                that.elem.find("i").attr("index-data",key);
                that.elem.find("i").html(text);
                that.selectItem = {key:key,value:text};
                if(key==-1){
                    //如果选择的是请选择，则移除active样式，灰度显示
                    that.elem.find("span").removeClass("active");
                }else{
                    that.elem.find("span").addClass("active");
                }

                if(that.options.selectedChanged){
                    that.options.selectedChanged({text:that.selectItem.value,key:that.selectItem.key});
                }
            };


            if(this.elem){
                if(arguments.length>0){
                    var key = arguments[0]
                    //if(key=="") key=-1;
                    if(this.options.dataSource){
                        //已经有数据，直接设置即可
                        if(key!=that.selectItem.key){
                            _setValue(key);
                        }                        
                    }
                    else{
                        //因存在异步数据问题，先将值保存在 this.selectItem.key中，避免在等待数据返回时，
                        //其它代码调用获取数据，见问题 FTFBIZ-1491
                        this.selectItem.key = key;
                        //等数据返回后，再设置
                        var t1 = setInterval(function() {
                            if(that.elem.find("ul>li").length>0){
                                _setValue(key);
                                clearInterval(t1);
                            }
                        },50)
                    }
                }
                else{                    
                    return this.selectItem.key==-1 ? "": this.selectItem.key;
                }
            }
        };

        /**
         @method init 获取下拉框的值
         @param value {string} 获取下拉框选中值
         */
        ComboBox.prototype.getValue = function(){
            return  this.selectItem.key;
        };

         /**
         @method init 设置（获取）下拉框的值
         @param item {string} 设置下拉框选中值
         */
         ComboBox.prototype.setValue = function(value){
            if(this.selectItem.key!=value){
                this.val(value);
            }             
            //this.placeholder.text(item.value);
        };

        /**
         @method init 重置下拉框，设置为-1
         */
        ComboBox.prototype.reset = function () {
            this.val(-1);
        };

        return ComboBox;

    });

})(jQuery,this.Xbn);