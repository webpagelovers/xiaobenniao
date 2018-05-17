(function ($, X) {

    X.prototype.controls = X.prototype.controls || (function (X) {
            var controlDict = {};


            /**
             @method registerControl 注册控件到控件仓库
             @param ctrlType {string} 控件类型
             @param control {} 控件类
             @static 类静态方法
             */
            var registerControl = function (ctrlType, control) {
                if (!controlDict[ctrlType]) {
                    controlDict[ctrlType] = control;
                    return;
                }
                //console.log("已经存在此控件类型");
            };


            /**
             @method getControl 获取控件
             @param ctrlType {string} 控件类型
             @param elem {DomNode} Dom节点
             @param option {Object} 控件配置项
             @static 类静态方法
             */
            var getControl = function (ctrlType, elem, option) {

                if (controlDict.hasOwnProperty(ctrlType)) {
                    //console.log("获取控件"+ ctrlType);
                    return new controlDict[ctrlType](elem, option);
                }

                //console.log("没有相应的控件类型" + ctrlType);
                return null;
            };


            var widget = function (ctrlType, func) {
                if (!controlDict[ctrlType]) {
                    controlDict[ctrlType] = func(ctrlType);
                    return;
                }
                //console.log("已经存在此控件类型");
            };


            var extend = function (subCtrl, ctrlType) {
                if (controlDict[ctrlType]) {
                    subCtrl.prototype = X.prototype.createObject(controlDict[ctrlType].prototype);
                }
                //没有可继承的,则返回Object原型
                return Object.prototype;
            }

            var getControlClazz = function (ctrlType) {
                if (controlDict[ctrlType]) {
                    return controlDict[ctrlType];
                }
            }

            var getTemplate = function (item) {
                var ctrlClazz = getControlClazz(item["ctrlType"]);
                if (ctrlClazz) {
                    return ctrlClazz.getTemplate(item);
                }
                //console.log("没有相应的控件类型，不能获得控件模板");
                return "";
            };

            /**
             @method getDataSource 获取下拉框数据源
             @param refUrl {string} 服务地址
             @param refKey {string} 数据主键
             @param refValue {string} 数据要显示的名称
             @param callback {function} 回调方法
             @static 类静态方法
             */
            var getDataSource = function (refUrl, refKey, refValue, callback, type, postData) {
                if (dataSource[refUrl]) {
                    callback(dataSource[refUrl]);
                }
                else {
                    var optObj = {
                        url: refUrl,
                        callback: function (result) {
                            var dataArray = [], item;
                            if (result.statusCode == "2000000") {
                                for (var i = 0, il = result.data.length; i < il; i++) {
                                    item = result.data[i];
                                    dataArray.push({"key": item[refKey], "value": item[refValue]});
                                }

                                dataSource[refUrl] = dataArray;
                                callback(dataArray);
                            }

                        },
                        type: type || "GET",
                        data: postData || {}
                    };

                    X.prototype.loadRemoteData(optObj);
                }
            };

            var dataSource = {}


            return {
                widget: widget,
                registerControl: registerControl,
                getControl: getControl,
                getControlClazz: getControlClazz,
                extend: extend,
                getTemplate: getTemplate,
                getDataSource: getDataSource
            }


        }(X));


    var CS = X.prototype.controls;
    var CONTROL_TYPE_TAG = "data-control-type",
        PROPERTY_NAME_TAG = "data-property-name";


    CS.widget("BaseControl", function (controlType) {


        function BaseControl(elem, options) {
            this.elem = elem;
            this.options = options || {};
        }

        $.extend(BaseControl.prototype, X.prototype.event);


        BaseControl.prototype.controlType = "BaseControl";
        BaseControl.prototype.controlTypeTag = CONTROL_TYPE_TAG;
        BaseControl.prototype.propertyNameTag = PROPERTY_NAME_TAG;
        BaseControl.prototype.init = function () {
            // body...
        };


        BaseControl.prototype.getElement = function () {
            return this.elem;
        };
        BaseControl.prototype.getLabel = function () {
            return this.getElement().parent().prev();
        };
        BaseControl.prototype.getParentDiv = function () {
            return this.getElement().parent();
        };
        BaseControl.prototype.getControlType = function () {
            return this.controlType || this.getElement().attr(this.controlTypeTag);
        };
        BaseControl.prototype.getPropertyName = function () {
            return this.getElement().attr(this.propertyNameTag);
        };
        BaseControl.prototype.get = BaseControl.prototype.getAttribute = function (attr) {
            return this.getElement().attr(attr);
        };
        BaseControl.prototype.set = BaseControl.prototype.setAttribute = function (attr, val) {
            this.getElement().attr(attr, val);
        };
        BaseControl.prototype.getValue = function () {
            return this.getElement().val();
        };
        BaseControl.prototype.setValue = function (val) {
            this.getElement().val(val);
        };
        BaseControl.prototype.getReadOnly = function () {
            return this.getAttribute("readonly");
        };
        BaseControl.prototype.setReadOnly = function (readonly) {
            this.setAttribute("readonly", readonly);
        };
        BaseControl.prototype.getDisabled = function () {
            return this.getAttribute("disabled");
        };
        BaseControl.prototype.setDisabled = function (disabled) {
            this.setAttribute("disabled", disabled);
        };
        BaseControl.prototype.getVisible = function () {
            // return this.getAttribute("display")==="none";
        };
        BaseControl.prototype.setVisible = function (visible) {
            //this.setAttribute("display", visible ? "block" : "none");
        };
        BaseControl.prototype.getTitle = function () {
            return this.getAttribute("title");
        };
        BaseControl.prototype.setTitle = function (title) {
            this.setAttribute("title", title);
        };
        BaseControl.prototype.getText = function () {
            this.getAttribute("innerText");
        };
        BaseControl.prototype.setText = function (text) {
            this.setAttribute("innerText", text);
        };
        BaseControl.prototype.getHtml = function () {
            return this.getElement().html();
        };
        BaseControl.prototype.setHtml = function (html) {
            this.getElement().html(html);
        };
        BaseControl.prototype.setNullable = function (val) {
            var labelObj = this.getLabel();
            labelObj.toggleClass("mustinput", !val);
        };
        BaseControl.prototype.setNoinput = function (val) {
            var labelObj = this.getLabel();
            var divObj = this.getparentDiv();
            labelObj.toggleClass("mustinput-noinput", val);
            divObj.toggleClass("parentdiv-noinput", val);
        };


        BaseControl.prototype.setTips = function (val) {
            supportPlaceholder = 'placeholder' in document.createElement('input'); //检测浏览器是否兼容placeholder
            var self = this;
            if (!supportPlaceholder) {
                this.getElement().focus(function () {
                    if (self.getValue() == val)
                        self.setValue('');
                });
                this.getElement().blur(function () {
                    if (self.getValue() == '') {
                        self.setValue(val);
                    }
                });
            }
            else
                this.set("placeholder", val);
        };
        //获取控件的提示信息Tips
        BaseControl.prototype.getTips = function () {
            return this.get("placeholder");
        };
        //设置控件内文字的对齐方式
        BaseControl.prototype.setTextAlign = function (val) {
            if (val != '') {
                this.set("text-align", val)
            }
            else
                this.set("text-align", "left");
        };
        //获取控件内文字的对齐方式
        BaseControl.prototype.getTextAlign = function () {
            return this.get("text-align");
        };
        //设置焦点（val：true设置焦点/false不设置焦点）
        BaseControl.prototype.setFocus = function (val) {
            if (val)
                this.getElement().focus();
        };
        //设置tab键索引
        BaseControl.prototype.setTabIndex = function (index) {
            if (index >= 0)
                this.set("tabindex", index);
            else
                this.set("tabindex", "-1");
        };
        //获取控件的tab键索引
        BaseControl.prototype.getTabIndex = function () {
            return this.get("tabindex");
        };

        BaseControl.prototype.dispose = function () {
            //移除绑定事件等
        };

        //重置
        BaseControl.prototype.reset = function () {

        };
        //初始化控件
        BaseControl.prototype.init = function (options) {
            this.options = X.prototype.clone(options);
        };

        BaseControl.prototype.val = function () {
            if (arguments.length > 0) {
                this.setValue(arguments[0]);
            }
            else {
                return this.getValue();
            }
        };

        //获取某个配置值
        BaseControl.prototype.getData = function (option) {
            return this.options && this.options[option];
        };

        //设置某个配置值
        BaseControl.prototype.setData = function (option, value) {
            this.options && (this.options[option] = value);
            return this;
        }


        return BaseControl;
    });


    var ViewModel = function (elem, options) {
        var _options = {};
        var _controls = {};

        function vm(elem, options) {
            this.elem = elem;
            if (options) {
                for (var k in options) {
                    _options[k] = options[k];
                }
            }

        };

        vm.prototype.getOption = function (k) {
            return _options[k];
        };

        vm.prototype.getData = function () {
            // body...
            return this.collectData();
        };

        vm.prototype.setData = function (data) {
            // body...
            _options["data"] = data;
            if (_controls) {
                for (var k in _controls) {
                    result[k] = _controls[k].setValue();
                }
            }
        };

        vm.prototype.collectData = function () {
            var result = {};

            if (_controls) {
                for (var k in _controls) {
                    result[k] = _controls[k].getValue();
                }
            }
            //是否考虑做差异化的数据传输？
            return result;
        };

        vm.prototype.initControl = function () {
            var meta = this.getOption("meta") || {};
            var data = this.getOption("data") || {};
            if (this.elem) {
                var list = this.elem.find("[" + CONTROL_TYPE_TAG + "][" + PROPERTY_NAME_TAG + "]");
                var item, ctrlType, pName;
                list.each(function (index, element) {
                    item = $(this);
                    ctrlType = item.attr(CONTROL_TYPE_TAG);
                    pName = item.attr(PROPERTY_NAME_TAG);
                    if (!_controls[pName]) {
                        _controls[pName] = CS.getControl(ctrlType, item, meta[pName] || {});
                        if (data && data[pName]) {
                            _controls[pName].setValue(data[pName]);
                        }
                    }
                    else {
                        //console.log("已经存在的" + pName);
                    }
                });
            }
        };

        vm.prototype.getValue = function (name) {
            var data = {};
            data[name] = _controls[name].val();
            return data;
        };

        vm.prototype.setValue = function (name, value) {
            _controls[name].val(value);
            return this;
        };

        vm.prototype.getControl = function (name) {
            return _controls[name];
        };

        vm.prototype.getControls = function (name) {
            return _controls;
        };


        vm.prototype.setDisabled = function (disabled) {
            if (disabled == undefined) disabled = true;
            for (var k in _controls) {
                _controls[k].setDisabled(disabled);
            }
        };

        vm.prototype.reset = function () {
            for (var k in _controls) {
                _controls[k].reset();
            }
        }
        return new vm(elem, options);

    };


    X.prototype.controller.getViewModel = function (elem, options) {
        var vm = new ViewModel(elem, options);
        return vm;
    }


})(jQuery, this.Xbn);
(function ($, X) {

    X.prototype.controls.widget("Accondion", function (controlType) {
        function Accondion(element, options) {

            /**
             * Default settings for options
             */
            var defaultOptions = {
                useCache: false,
                dataSource: [],
                dataType: "json",
                firstItemClass: "firstChild",
                lastItemClass: "lastChild",
                onItemClick: null,
                onBeforeExpand: null,
                afterExpand: null,
                maxLevel: 3,
                onMoreClick: null,
                pageSize: 20,
                indent: 20,
                folderExpandClass: "icon-xiangxia",
                folderCollapseClass: "icon-xiangyou",
                itemClass: "icon-xiangyou"
            };

            var opts = $.extend({}, defaultOptions, options);

            /**
             * 兼容传入的是界面对象的ID，或者传入的直接是一个对象
             */
            var $elem = null;
            if (typeof (element) == "string") {
                $elem = $("#" + element);
            }
            else {
                $elem = element;
            }

            this.itemSelected = null;
            this.isBusy = false;

            $elem.bind("click", function (event) {
                var $li = (event.target.nodeName != "li") ? $(event.target).closest("li") : $(event.target);
                self.onClick($li);
            });

            /**
             * Init options
             */
            this.options = opts;

            this.$elem = $elem;
            this.$elem.addClass("accondion");

            this.events = {};

            var self = this;

            // var $pullDown, $pullUp, _loadingStep = 0;

            // var $myScroll = null;

            // var initScroller = function () {

            //     document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

            //     var $wrapper = self.$elem.closest(".accondion-wrapper");

            //     if ($wrapper.length && window.IScroll) {
            //         $myScroll = new IScroll($wrapper[0], {
            //             preventDefault: false,
            //             mouseWheel: true // 允许滑轮滚动
            //         });
            //     }
            // };

            // initScroller();
            // this.$scroller = $myScroll;
        }

        Accondion.prototype.fireClick = function (data) {
            var li, pnode, pli;
            if (data) {
                li = this.getItem(data);
                if (li && li.length > 0) {
                    //递归展开其父节点，最后再模拟点击当前菜单
                    pnode = data.parent;
                    if (pnode) {
                        do {
                            pli = this.getItem(pnode);
                            if (pli && pli.length > 0) {
                                this.onClick(pli);
                                pnode = pnode.parent;
                            }
                        } while (pli && pli.length > 0)
                    }

                    this.onClick(li);
                }
            }
        }

        Accondion.prototype.expandRecursive = function (data) {
            var li, pnode, pli;
            if (data) {
                li = this.getItem(data);
                if (li && li.length > 0) {
                    //递归展开其父节点，最后再模拟点击当前菜单
                    pnode = data.parent;
                    if (pnode) {
                        do {
                            pli = this.getItem(pnode);
                            if (pli && pli.length > 0) {
                                this.expand(pli);
                                pnode = pnode.parent;
                            }
                        } while (pli && pli.length > 0)
                    }

                    this.expand(data);
                }
            }
        };


        Accondion.prototype.expand = function (data) {
            var li = this.getItem(data);
            if (li && li.length > 0) {
                if (li.find("li").length > 0) {
                    this.afterItemClick(li);
                }
            }
        };

        Accondion.prototype.setSelectedItem = function (data) {
            var li = this.getItem(data);
            if (li && li.length > 0) {
                if (this.itemSelected) {
                    this.itemSelected.children("div").removeClass("selected");
                }
                this.itemSelected = li;
                li.children("div").addClass("selected");
            }
        };


        Accondion.prototype.onClick = function ($li) {

            var result = $li.data("data");

            if ($li.hasClass("more")) {
                //more click
                if (this.options.onMoreClick != null && $.isFunction(this.options.onMoreClick))
                    this.options.onMoreClick($li, result);
            }
            else {
                if (result) {
                    if (this.itemSelected) {
                        this.itemSelected.children("div").removeClass("selected");
                    }
                    this.itemSelected = $li;

                    $li.children("div").addClass("selected");

                    if ($li.find("li").length > 0) {
                        this.afterItemClick($li);
                    }
                    else {
                        if (this.options.onBeforeExpand != null && $.isFunction(this.options.onBeforeExpand)) {
                            this.options.onBeforeExpand($li, result);
                        }
                    }
                    if (this.options.onItemClick != null && $.isFunction(this.options.onItemClick)) {
                        this.options.onItemClick($li, result);
                    }
                }
            }
        }

        Accondion.prototype.getSelectedItem = function () {
            return this.itemSelected;
        }

        Accondion.prototype.setOptions = function (opts) {
            this.options = $.extend({}, opts, this.options);
        }


        Accondion.prototype.setData = function (data) {
            for (var attr in data) {
                var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
                if (this["set" + attrUpper]) this["set" + attrUpper](data[attr]);
            }
        };

        Accondion.prototype.getItem = function (data) {
            var item = this.$elem.find("li[code='" + data.code + "']");

            return (item && item.length > 0) ? item : null;
        }

        Accondion.prototype.setChildren = function (data, element) {
            if (!element) {
                element = this.getItem(data);
            }
            if (!element) return;


            this.appendChild(data, element);
        }

        Accondion.prototype.setRows = function (dataSource) {
            this.options.dataSource = dataSource;
            if (dataSource != null) {
                this.fetchData();
            }
        }

        Accondion.prototype.initData = function (data) {
            this.init(data)
        }

        Accondion.prototype.setDataSource = function (dataSource) {

            this.options.dataSource = dataSource;
            if (dataSource != null) {
                this.fetchData();
            }
        }

        Accondion.prototype.on = function (eventName, func, context) {
            var event = function (e, args) {
                func.call(context, args);
            };
            this.events[func] = event;
            if (eventName === "itemClick") this.options.onItemClick = event;
            if (eventName === "moreClick") this.options.onMoreClick = event;

            if (eventName == "beforeExpand") {
                this.options.onBeforeExpand = function (element, data) {
                    func.call(context, data);
                };
            }
        };

        Accondion.prototype.un = function (eventName, func) {
            var event = this.events[func];
            if (!event) return;
            if (eventName === "itemClick") this.options.onItemClick = null;
            if (eventName === "moreClick") this.options.onMoreClick = null;
            if (eventName === "beforeExpand") this.options.onBeforeExpand = null;

        };

        /**
         * Get autocomplete data for a given value
         */
        Accondion.prototype.fetchData = function () {
            if (this.options.dataSource) {
                this.init(this.options.dataSource);
            } else {
                var self = this;
                this.fetchRemoteData(function (remoteData) {
                    self.init(remoteData);
                });
            }
        };


        Accondion.prototype.init = function (data) {

            this.$elem.children().remove();

            var $ul = $('<ul></ul>');
            var results = data.children;


            var numResults = results.length;
            if (numResults === 0) {
                return;
            }
            var level = 0;

            var list = this.getFromResults(results, level);

            for (var i = 0; i < list.length; i++) {
                $ul.append(list[i]);
            }

            if (this.isShowMore(numResults)) {
                var $li = this.getMoreLi(data, level);
                $li.appendTo($ul);
            }

            this.$elem.append($ul);
            this.$elem.data("data", data);
            this.$elem.data("level", 0);
            if (this.$scroller)
                this.$scroller.refresh();
        }

        /**
         * Show all results
         * @param results
         * @param filter
         */
        Accondion.prototype.getFromResults = function (results, level) {

            var numResults = results.length;
            var list = new Array();
            var self = this;

            var i, result, $li, first = false, $first = false;
            for (i = 0; i < numResults; i++) {
                result = results[i];
                $li = this.getLiItemFromResult(result, level);
                list.push($li);

                if (first === false) {
                    first = String(result.code);
                    $first = $li;
                    $li.addClass(this.options.firstItemClass);
                }
                if (i === numResults - 1) {
                    $li.addClass(this.options.lastItemClass);
                }
            }
            return list;
        };


        /**
         * Create a results item (LI element) from a result
         * @param result
         */
        Accondion.prototype.getLiItemFromResult = function (result, level) {
            var self = this;
            var $li = null;

            $li = this.getLiItemFromResultWithChild(result, level);

            $li.data("data", result);
            $li.data("level", level);

            // this.setIndent($li, level);


            return $li;
        };

        Accondion.prototype._getIndent = function (level) {
            level = parseInt(level);
            return (level) * this.options.indent + "px";
        }

        Accondion.prototype.setIndent = function (element, level) {
            var indent = this._getIndent(level + 1);
            //element.css("text-indent", indent);
            element.css("padding-left", indent);
        }

        Accondion.prototype.getLiItemFromResultWithChild = function (result, level) {
            var self = this;

            var $div = $('<div class="header"><span class="arrow"><i class="iconfont ' + self.options.folderCollapseClass + '"></i></span><span class="txt"><i class="iconfont ' + result.ico + '"></i><a data-x-href="' + result.code + '">' + result.name + '</a></span></div>');
            $div.attr("level", level);

            this.setIndent($div, level);

            var $ul = $('<ul></ul>');
            if ($.isArray(result.children) && result.children.length > 0) {
                for (var i = 0; i < result.children.length; i++) {
                    var child = result.children[i];
                    if (child.visible == true || child.visible == undefined) {
                        var $li = this.getLiItemFromResult(child, level + 1);
                        $li.appendTo($ul);
                    }
                }
            }
            else {
                $div.find(".arrow").remove();
            }

            var $li = $("<li leaf='0' code=" + result.code + "></li>");
            $li.append($div);
            $li.append($ul);
            $li.data("data", result);
            return $li;
        }

        Accondion.prototype.getMoreLi = function (result, level) {
            var $li = $('<li class="more" pcode="' + result.code + '"><span>'+ "more" +'</span></li>');
            $li.data("data", result);
            $li.data("level", level);
            var self = this;
            return $li;
        }

        Accondion.prototype.isShowMore = function (length) {
            if (length < this.options.pageSize) {
                return false;
            }
            return true;
        }


        Accondion.prototype._append = function (element, result, level) {
            var $ul = element;
            if ($.isArray(result.children)) {
                for (var i = 0; i < result.children.length; i++) {
                    var child = result.children[i];

                    var $li = this.getLiItemFromResult(child, level);
                    $li.appendTo($ul);
                }

                //在此处增加判断，如果分类下数据小于页大小了，说明没有数据了，就不需要增加更多按钮了
                if (this.isShowMore(result.children.length)) {
                    //假设页大小是100
                    var $li = this.getMoreLi(result, level);
                    $li.appendTo($ul);
                }
                if (this.$scroller)
                    this.$scroller.refresh();
            }
        }


        Accondion.prototype.getMoreItem = function (data) {
            var item = this.$elem.find("li[pcode='" + data.code + "']");

            return (item && item.length > 0) ? item : null;
        }

        /**
         * element 代表的是 更多按钮
         */
        Accondion.prototype.appendMore = function (result, element) {

            if (!element) {
                element = this.getMoreItem(result);
            }
            if (!element) return;

            var level = element.data("level") != null ? element.data("level") : 0;
            var $ul = element.parent();
            element.remove();
            this._append($ul, result, level);
            if (this.$scroller)
                this.$scroller.refresh();
        }

        /**
         *  动态增加子数据
         *  element 是div
         */
        Accondion.prototype.appendChild = function (result, element) {
            if (!element) {
                element = this.getItem(result);
            }
            if (!element) return;

            var level = element.data("level") != null ? element.data("level") : 0;
            var $ul = element.children("ul");
            this._append($ul, result, level + 1);
            this.afterItemClick(element);
            //element.data("loaded", true);
            if (this.$scroller)
                this.$scroller.refresh();

        }

        Accondion.prototype.afterItemClick = function (element) {
            if (element.children("ul").css("display") == "block") {
                element.children("ul").slideUp(300);
                element.children("div").removeClass("menu-show");
                element.children("div").find(".arrow i").removeClass(this.options.folderExpandClass);
            }
            else {
                element.children("ul").slideDown(300);
                element.children("div").addClass("menu-show");
                element.children("div").find(".arrow i").addClass(this.options.folderExpandClass);
            }
            if (this.$scroller)
                this.$scroller.refresh();

        }


        /**
         * Sort results
         * @param results
         * @param filter
         */
        Accondion.prototype.sortResults = function (results, filter) {
            var self = this;
            var sortFunction = this.options.sortFunction;
            if (!$.isFunction(sortFunction)) {
                sortFunction = function (a, b, f) {
                    return self.sortValueAlpha(a, b, f);
                };
            }
            results.sort(function (a, b) {
                return sortFunction(a, b, filter);
            });
            return results;
        };

        /**
         * Default sort filter
         * @param a
         * @param b
         */
        Accondion.prototype.sortValueAlpha = function (a, b) {
            a = String(a.value);
            b = String(b.value);
            if (!this.options.matchCase) {
                a = a.toLowerCase();
                b = b.toLowerCase();
            }
            if (a > b) {
                return 1;
            }
            if (a < b) {
                return -1;
            }
            return 0;
        };

        /**
         * Get remote autocomplete data for a given value
         */
        Accondion.prototype.fetchRemoteData = function (callback) {
            var data = this.cacheRead(filter);
            if (data) {
                callback(data);
            } else {
                var self = this;
                //this.dom.$elem.addClass(this.options.loadingClass);
                var ajaxCallback = function (data) {
                    var parsed = false;
                    if (data !== false) {
                        parsed = self.parseRemoteData(data);
                        self.cacheWrite(filter, parsed);
                    }
                    self.dom.$elem.removeClass(self.options.loadingClass);
                    callback(parsed);
                };
                $.ajax({
                    url: this.makeUrl(filter),
                    success: ajaxCallback,
                    error: function () {
                        ajaxCallback(false);
                    },
                    dataType: 'text'
                });
            }
        };


        /**
         * Parse data received from server
         */
        Accondion.prototype.parseRemoteData = function (remoteData) {
            var remoteDataType = this.options.remoteDataType;
            if (remoteDataType === 'json') {
                return this.parseRemoteJSON(remoteData);
            }
            return this.parseRemoteText(remoteData);
        };

        /**
         * Parse data received in text format
         */
        Accondion.prototype.parseRemoteText = function (remoteData) {
            var results = [];
            var text = String(remoteData).replace('\r\n', this.options.lineSeparator);
            var i, j, data, line, lines = text.split(this.options.lineSeparator);
            var value;
            for (i = 0; i < lines.length; i++) {
                line = lines[i].split(this.options.cellSeparator);
                data = [];
                for (j = 0; j < line.length; j++) {
                    data.push(decodeURIComponent(line[j]));
                }
                value = data.shift();
                results.push({value: value, text: data.shift()});
            }
            return results;
        };

        /**
         * Parse data received in JSON format
         */
        Accondion.prototype.parseRemoteJSON = function (remoteData) {
            var aData = $.parseJSON(remoteData);
            var result = new Array();
            for (var i = 0; i < aData.length; i++) {
                result.push({value: aData[i].value, text: aData[i].data});
            }
            return result;
        };

        /**
         * Read from cache
         */
        Accondion.prototype.cacheRead = function (filter) {
            var filterLength, searchLength, search, maxPos, pos;
            if (this.options.useCache) {
                filter = String(filter);
                filterLength = filter.length;
                if (this.options.matchSubset) {
                    searchLength = 1;
                } else {
                    searchLength = filterLength;
                }
                while (searchLength <= filterLength) {
                    if (this.options.matchInside) {
                        maxPos = filterLength - searchLength;
                    } else {
                        maxPos = 0;
                    }
                    pos = 0;
                    while (pos <= maxPos) {
                        search = filter.substr(0, searchLength);
                        if (this.cacheData_[search] !== undefined) {
                            return this.cacheData_[search];
                        }
                        pos++;
                    }
                    searchLength++;
                }
            }
            return false;
        };

        /**
         * Write to cache
         */
        Accondion.prototype.cacheWrite = function (filter, data) {
            if (this.options.useCache) {
                if (this.cacheLength_ >= this.options.maxCacheLength) {
                    this.cacheFlush();
                }
                filter = String(filter);
                if (this.cacheData_[filter] !== undefined) {
                    this.cacheLength_++;
                }
                this.cacheData_[filter] = data;
                return this.cacheData_[filter];
            }
            return false;
        };

        /**
         * Flush cache
         */
        Accondion.prototype.cacheFlush = function () {
            this.cacheData_ = {};
            this.cacheLength_ = 0;
        };

        /**
         * Call hook
         * Note that all called hooks are passed the Accondion object
         */
        Accondion.prototype.callHook = function (hook, data) {
            var f = this.options[hook];
            if (f && $.isFunction(f)) {
                return f(data, this);
            }
            return false;
        };

        X.prototype.controls.extend(Accondion.prototype, "BaseControl");

        return Accondion;

    });


})(jQuery, this.Xbn);
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
                            '   <label for="radio'+ i +'" class="f14 ml14 disib w150 ofh va_5">'+ val +'</label>',
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
            this.options.selectedChanged(val);
        } else {
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
(function ($, X) {

    X.prototype.controls.widget("CheckboxList", function (controlType) {

        var BaseControl = X.prototype.controls.getControlClazz("BaseControl");

        /**
         @class CheckboxBox 多选框
         @constructor 构造函数
         @param elem {DomNode} Dom节点
         @param option {Object} 配置信息
         */
        function CheckboxList(elem, options) {
            BaseControl.call(this, elem, options);

            this.setDataSource();
        };

        /**
         @method getTemplate
         @static 类静态方法
         @return 获取多选框框控件模板
         */
        CheckboxList.getTemplate = function (fatherHtml, sonHtml) {
            var html = '<div class="perAuthority ml80 mt40">';
            html += fatherHtml;
            html += sonHtml;
            html += '</div>';

            return html;
        };

        X.prototype.controls.extend(CheckboxList, "BaseControl");
        CheckboxList.prototype.constructor = CheckboxList;


        /**
         @method getFieldHtml 获取单个控件html
         @return 返回单个控件在组件中的html
         */
        CheckboxList.prototype.getFieldHtml = function (item) {
            var ctrl = X.prototype.controls.getControlClazz("CheckboxBox");
            var ctrlHtml = ctrl.getTemplate(item);
            return ctrlHtml;
        };

        /**
         @method getHtml 获取组合多选框组件html
         @param ds {Array} 数据源
         @param fielHtml {fun} 添加CheckboxBox控件
         @return 组合多选框组件html
         */
        CheckboxList.prototype.getHtml = function (ds) {
            var item, html = "", fatherHtml = "", sonHtml = "";
            var that = this;

            var allHtml = function (item) {
                var fielHtml = that.getFieldHtml(item);
                var field = $(fielHtml).attr("data-control-type", "CheckboxBox");
                field.attr("data-property-name", "operationId" + item.operationId);

                return field.prop("outerHTML");
            };

            for (var i = 0, il = ds.data[0].operations.length; i < il; i++) {
                item = ds.data[0].operations[i];
                if (item) {
                    fatherHtml = "";
                    sonHtml = "";
                    sonHtml += '<div class="eachRow ml90">';
                    for (var j = 0; j < item.childOperations.length; j++) {
                        sonHtml += allHtml(item.childOperations[j]);
                    }
                    sonHtml += '</div>';

                    fatherHtml += '<div class="eachRow">';
                    fatherHtml += allHtml(item);
                    fatherHtml += '</div>';
                }
                html += CheckboxList.getTemplate(fatherHtml, sonHtml);
            }
            return html;
        };


        /**
         @method setDataSource 设置多选框列表
         @param dataSource {Object} 多选框数据源配置，从服务器获取
         */
        CheckboxList.prototype.setDataSource = function (dataSource) {
            var that = this;
            var $wrapRole = that.elem.find(".wrapRole");
            $wrapRole.empty();
            var ds = dataSource || this.options.dataSource;
            var html = "";
            if (ds) {
                html = this.getHtml(ds);
                $wrapRole.append(html);

                var vm = X.prototype.controller.getViewModel($wrapRole);
                vm.initControl();
                var controls = vm.getControls();
                for (var key in controls) {
                    controls[key].on("click", function () {
                        var id = this.getValue();
                        for (var i = 0; i < ds.data[0].operations.length; i++) {
                            if (id == ds.data[0].operations[i].operationId) {
                                for (var j = 0; j < ds.data[0].operations[i].childOperations.length; j++) {
                                    var number = ds.data[0].operations[i].childOperations[j].operationId;
                                    vm.getControl("operationId" + number).setChecked(true);
                                }
                            } else {
                                for (var j = 0; j < ds.data[0].operations[i].childOperations.length; j++) {
                                    if (id == ds.data[0].operations[i].childOperations[j].operationId) {
                                        var number = ds.data[0].operations[i].operationId;
                                        vm.getControl("operationId" + number).setChecked(false);
                                    }
                                }
                            }
                        }

                    }, controls[key]);
                }
            }
        };

        /**
         @method init 设置多组多选框的值
         @param value {string} 设置多组多选框选中值
         */
        CheckboxList.prototype.setValue = function (value) {
            var that = this;
            $.each(value, function (index) {
                that.elem.find("input[type='checkbox'][value='" + value[index] + "']").attr("checked", true);
            })
        };

        /**
         @method init 获取多组多选框的值
         @param value {string} 获取多组多选框选中值
         */
        CheckboxList.prototype.getValue = function (value) {
            var checkbox = [];
            this.elem.find("input[type='checkbox']:checked").each(function () {
                checkbox.push($(this).val());
            });
            return checkbox;
        };

        return CheckboxList;

    });

})(jQuery, this.Xbn);
(function ($, X) {

    X.prototype.controls.widget("ComboBox", function (controlType) {

        var BaseControl = X.prototype.controls.getControlClazz("BaseControl");

        /**
         @class ComboBox 下拉框
         @constructor 构造函数
         @param elem {DomNode} Dom节点
         @param option {Object} 配置信息
         */
        function ComboBox(elem, options) {
            BaseControl.call(this, elem, options);
            this.opts = this.elem.find('ul.dropdown');
            this.placeholder = this.elem.children('i');
            this.input = this.elem.find('input');
            this.selectItem = {"key": -1, "value": ""};

            this.isHidden = true;

            this.init();
        }

        /**
         @method getTemplate
         @static 类静态方法
         @return 获取下拉框控件模板
         */
        ComboBox.getTemplate = function (item) {
            var html = '<div class="wrapper-dropdown selected js-' + item["name"] + '">';
            html += '<input type="hidden" name="' + item["name"] + '">';
            html += '<i>'+ "Please select" +'</i>';
            html += '<ul class="dropdown">';
            html += '</ul>';
            html += '</div>';
            return html;
        }


        X.prototype.controls.extend(ComboBox, "BaseControl");

        /**
         @method getLists 生成下拉列表
         @param ds {Array} 下拉数据源
         @param dv {string} 默认选中项
         @return 获取下拉框控件选项
         */
        ComboBox.prototype.getLists = function (ds, dv) {
            var html = '<li index-data="-1" class="none"><span>'+ "Please select" +'</span></li>';
            var item;
            for (var i = 0, il = ds.length; i < il; i++) {
                item = ds[i];
                if (item) {
                    if (item["key"] == dv) {
                        html += '<li index-data="' + item["key"] + '" active><span class="Truncate">' + item["value"] + '</span></li>';
                        //html += "<option value='"+key+"' selected>" + ds[key] + "</option>";
                    }
                    else {
                        //html += "<option value='"+key+"' >" + ds[key] + "</option>";
                        html += '<li index-data="' + item["key"] + '"><span class="Truncate">' + item["value"] + '</span></li>';
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
        ComboBox.prototype.getDataSource = function (field, callback) {
            X.prototype.controls.getDataSource(field["refUrl"], field["refKey"], field["refValue"], callback, field["type"], field["postData"]);
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
        ComboBox.prototype.init = function () {
            $('body').click(function (event) {
                if ((event.target === that.elem[0] || $(event.target).parent().get(0) == that.elem[0]) && that.isHidden) {
                    return that.show();
                } else if (!that.isHidden) {
                    return that.hide();
                }
            });
            var that = this;
            var seleted = function () {
                that.opts.on('click', function (event) {
                    if (event.target.tagName == "LI" || event.target.tagName == "SPAN") {
                        var opt = $(event.target);
                        if (event.target.tagName == "SPAN") {
                            opt = $(event.target).parent("li");
                        }
                        else {
                            opt = $(event.target);
                        }
                        that.selectItem.value = opt.text();
                        that.selectItem.key = opt.attr("index-data");
                        that.placeholder.text(opt.text());
                        that.input.value = opt.text();
                        if (that.options.selectedChanged) {
                            that.options.selectedChanged({text: that.selectItem.value, key: that.selectItem.key});
                        }
                    }
                });
            }

            seleted();

            this.setDataSource();
        };

        /**
         @method setDataSource 设置下拉列表
         @param dataSource {Object} 下拉数据源配置，从服务器获取
         */
        ComboBox.prototype.setDataSource = function (dataSource) {
            var that = this;
            var $ul = that.elem.find("ul");
            $ul.empty();
            that.placeholder.html("Please select");
            var ds = dataSource || this.options.dataSource;
            var html = "", defaultValue = this.options ["defaultValue"];
            if (ds) {
                html = this.getLists(ds, defaultValue);
                $ul.append(html);
                if (defaultValue) {
                    that.val(defaultValue);
                }
            }
            else {
                //如果没有配置dataSource,则尝试从服务器取数据
                if (this.options ["refUrl"]) {
                    var that = this;
                    this.getDataSource(this.options, function (data) {
                        //填充界面数据，
                        html = that.getLists(data, defaultValue);
                        $ul.append(html);
                        if (defaultValue) {
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
        ComboBox.prototype.val = function () {

            var that = this;

            var _setValue = function (value) {
                var text = that.elem.find('ul>li[index-data="' + key + '"]').addClass("active").text();
                that.elem.find("i").attr("index-data", key);
                that.elem.find("i").html(text);
                that.selectItem = {key: key, value: text};
                if (key == -1) {
                    //如果选择的是请选择，则移除active样式，灰度显示
                    that.elem.find("span").removeClass("active");
                } else {
                    that.elem.find("span").addClass("active");
                }

                if (that.options.selectedChanged) {
                    that.options.selectedChanged({text: that.selectItem.value, key: that.selectItem.key});
                }
            };


            if (this.elem) {
                if (arguments.length > 0) {
                    var key = arguments[0]
                    //if(key=="") key=-1;
                    if (this.options.dataSource) {
                        //已经有数据，直接设置即可
                        if (key != that.selectItem.key) {
                            _setValue(key);
                        }
                    }
                    else {
                        //等数据返回后，再设置
                        var t1 = setInterval(function () {
                            if (that.elem.find("ul>li").length > 0) {
                                _setValue(key);
                                clearInterval(t1);
                            }
                        }, 50)
                    }
                }
                else {
                    return this.selectItem.key == -1 ? "" : this.selectItem.key;
                }
            }
        };

        /**
         @method init 获取下拉框的值
         @param value {string} 获取下拉框选中值
         */
        ComboBox.prototype.getValue = function () {
            return this.selectItem.key;
        };

        /**
         @method init 设置（获取）下拉框的值
         @param item {string} 设置下拉框选中值
         */
        ComboBox.prototype.setValue = function (value) {
            if (this.selectItem.key != value) {
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

})(jQuery, this.Xbn);
(function ($, X) {

    X.prototype.controls.widget("ComboBoxSecond", function (controlType) {

        var BaseControl = X.prototype.controls.getControlClazz("BaseControl");

        /**
         @class ComboBox 下拉框
         @constructor 构造函数
         @param elem {DomNode} Dom节点
         @param option {Object} 配置信息
         */
        function ComboBoxSecond(elem, option) {
            BaseControl.call(this, elem, option);
            this.elem = elem;
            this.option = option;
            this.init();
        }


        X.prototype.controls.extend(ComboBoxSecond, BaseControl);


        /**
         @method init 初始化下拉框
         @param field {Object} 下拉数据源配置，数据从服务器获取
         @param callback {function} 回调函数，初始化完成后调用
         */
        ComboBoxSecond.prototype.init = function () {
            var that = this;
            var ds = [];
            var getDataSource = function (source, target, id, name) {
                $.each(source, function (index, item) {
                    target.push({key: item[id], value: item[name]});
                });
            };

            var addressData = this.option.dataSource;
            if (addressData) {
                getDataSource(addressData["pro"], ds, "ProID", "ProName");
            }


            this.province = X.prototype.controls.getControl("ComboBox", this.elem.find(".js-province"), {
                dataSource: ds, selectedChanged: function (item) {
                    var key = item.key;
                    var citys = [];
                    $.each(addressData.city, function (index, city) {
                        if (city["ProID"] == key) {
                            citys.push({key: city["CityID"], value: city["CityName"]})
                        }
                        that.district.setDataSource();
                    });

                    that.city.setDataSource(citys);
                    if (that.options.provinceSelectedChanged) {
                        that.options.provinceSelectedChanged.call(that, {
                            text: that.province.selectItem.value,
                            key: that.province.selectItem.key
                        });
                    }
                }
            });

            this.city = X.prototype.controls.getControl("ComboBox", this.elem.find(".js-city"), {
                selectedChanged: function (item) {
                    var key = item.key;

                    var countrys = [];
                    $.each(addressData.dis, function (index, district) {
                        if (district["CityID"] == key) {
                            countrys.push({key: district["Id"], value: district["DisName"]})
                        }
                    });

                    that.district.setDataSource(countrys);
                    if (that.options.citySelectedChanged) {
                        that.options.citySelectedChanged.call(that, {
                            text: that.city.selectItem.value,
                            key: that.city.selectItem.key
                        });
                    }
                }
            });

            this.district = X.prototype.controls.getControl("ComboBox", this.elem.find(".js-district"), {
                selectedChanged: function (item) {
                    if (that.options.districtSelectedChanged) {
                        that.options.districtSelectedChanged.call(that, {
                            text: that.district.selectItem.value,
                            key: that.district.selectItem.key
                        });
                    }
                }
            });

            var dvProvince, dvCity, dvDistrict
            if (this.option.defaultValue) {
                dvProvince = this.option.defaultValue.province;
                dvCity = this.option.defaultValue.city;
                dvDistrict = this.option.defaultValue.district;
                this.province.setValue(dvProvince);
                this.city.setValue(dvCity);
                this.district.setValue(dvDistrict);
            }


        };

        /**
         @method init 获取下拉框的值
         @param value {string} 获取下拉框选中值
         */
        ComboBoxSecond.prototype.getValue = function () {
            return {
                province: this.province.val(),
                city: this.city.val(),
                district: this.district.val()
            }
        };

        /**
         @method init 设置（获取）下拉框的值
         @param value {string} 设置下拉框选中值
         */
        ComboBoxSecond.prototype.setValue = function (value) {
            var province = value["province"];
            var city = value["city"];
            var district = value["district"];

            if (province) {
                this.province.setValue(province);
            }
            if (city) {
                this.city.setValue(city);
            }
            if (district) {
                this.district.setValue(district);
            }
        };

        return ComboBoxSecond;

    });

})(jQuery, this.Xbn);
(function ($, X) {

    var BaseControl = X.prototype.controls.getControlClazz("BaseControl");

    /**
     @class DataGrid 表格
     @constructor 构造函数
     @param elem {DomNode} Dom节点
     @param option {Object} 配置信息 {columns:[{field:{name:"栏目名称","title":"栏目显示名称","type":"数据类型"},width:"栏目宽度"}]}
     */
    var DataGrid = function (element, config) {
        this.config = config || {};
        this.config.showCheckbox = this.config.showCheckbox || false;

        this.columns = (config && config.columns) || [];
        this.rows = [];

        element.innerHTML = '<table cellspacing="0" cellpadding="30" rules="rows" border="1"><thead><tr></tr></thead><tbody></tbody></table>';

        this.header = element.firstChild.tHead;
        this.tbody = element.firstChild.tBodies[0];

        this.$table = $(element);

        this.initTableClass();
        this.showHeader();

        this.selectedRow = null;


        this.variables = {};

        this.primary = (config && config.primary) || "id";
    };


    DataGrid.prototype = X.prototype.createObject(BaseControl.prototype);

    /**
     @method prototype 定义DataGrid原型
     */
    DataGrid.prototype = $.extend(DataGrid.prototype, {

        /**
         @method init 初始化，构建DataGrid表头
         @param columns {Array} 栏目数组
         */
        init: function (columns) {
            this.loadColumns(columns);
        },

        /**
         @method init 初始化，构建DataGrid表头
         @param data {Array} 表体数据，可选值，有则设值，否则返回数据
         */
        val: function (data) {
            if (data) {
                this.loadData(data);
            }
            else {
                var result = [];
                for (var i = 0, il = this.rows.length; i < il; i++) {
                    result.push(this.rows[i].data);
                }
                return result;
            }
        },

        /**
         @method loadColumns 构建DataGrid表头
         @param columns {Array} 栏目数组
         */
        loadColumns: function (columns) {
            columns = columns || this.columns;
            this.columns = columns;

            if (this.header.rows.length > 0) {
                this.header.removeChild(this.header.rows[0]);
            }
            var tr = this.header.insertRow(0);


            for (var i = 0; i < columns.length; i++) {
                var th = document.createElement("th");
                if (columns[i].width) {
                    th.width = columns[i].width;
                }
                tr.appendChild(th);
            }


            if (this.config && this.config.showCheckbox) {
                this.columns[0].headerRenderer = HeaderRenderer;
                this.columns[0].itemRenderer = CheckboxRenderer;
            }

            this.renderHeader();
        },

        /**
         @method loadData 构建DataGrid
         @param data {Array 二维数组} 表体数据
         */
        loadData: function (data) {

            if (X.prototype.isFunction(this.config.beforeTableRender)) {
                this.config.beforeTableRender(this,data);
            }

            this.clear();

            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    if (this.config.beforeRowRender) {
                        this.config.beforeRowRender(item);
                    }
                    var row = this.insertRow(item);
                    if (this.config.afterRowRender) {
                        this.config.afterRowRender(row,item);
                    }
                }
            }
            else {
                //没有数据时，显示
                this.renderEmpty();
            }

            this.renderHeader();

            if (X.prototype.isFunction(this.config.afterTableRender)) {
                this.config.afterTableRender(this);
            }

            var event = {
                type: "loadCompleted",
                target: this
            };
            this.trigger(event);
        },

        renderEmpty: function (cell) {
            var row = DataRow.getEmptyRow(this.columns.length, "No eligible data");

            $(this.tbody).append(row);
        },


        /**
         @method clear 清空表体行
         @param data {Array} 表体行数据
         */
        clear: function () {
            try {
                this.tbody.innerHTML = "";
            } catch(e) {
                var tbody = this.tbody
                while (tbody.firstChild) {
                    tbody.removeChild(tbody.firstChild)
                }
            }
            if (this.rows.length > 0) {
                this.rows.forEach(function (item, index, rows) {
                    item.destroy();
                });
                this.rows.length = 0;
            }
            this.set("checkState", "unchecked")
        },

        getNewRow: function (data) {
            return new DataRow(data, this);
        },

        /**
         @method insertRow 插入表体行
         @param data {Array} 表体行数据
         */
        insertRow: function (data) {
            var row = this.getNewRow(data);
            //this.tbody.appendChild(row.dom);
            $(this.$table).find("table").append(row.dom);

            this.rows.push(row);

            var that = this;
            row.on("selected", function (event) {
                that.select(event.row);
            });

            var event = {
                type: "rowInserted",
                newRow: row,
                target: this
            };
            this.trigger(event);
            return row;
        },

        /**
         @method removeRow 删除表体行
         @param data {Array} 表体行对象
         */
        removeRow: function (row) {
            if (row === this.selectedRow) {
                this.selectedRow = null;
            }

            this.tbody.removeChild(row.dom);
            row.destroy();

            for (var i = 0; i < this.rows.length; i++) {
                if (this.rows[i] == row) {
                    this.rows.splice(i, 1);
                    break;
                }
            }

            var event = {
                type: "rowRemoved",
                target: this
            };
            this.trigger(event);
        },

        /**
         @method select 设置选中行
         @param row {DataRow} 表体行对象
         */
        select: function (row) {
            var event = {
                type: "changed",
                target: this,
                oldRow: this.selectedRow,
                newRow: row
            };

            if (this.selectedRow) {
                this.selectedRow.select(false);
            }

            if (row) {
                row.select(true);
            }

            this.selectedRow = row;

            this.trigger(event);
        },

        set: function (key, value) {
            this.variables[key] = value;
            this.renderHeader();
        },

        get: function (key) {
            return this.variables[key];
        },

        /**
         @method refresh 刷新表头
         */
        refresh: function () {
            this.renderHeader();
        },

        /**
         @method renderHeader 渲染表头
         */
        renderHeader: function () {
            var columns = this.columns;
            var temp = "";
            for (var i = 0; i < columns.length; i++) {
                var th = this.header.firstChild.childNodes[i];
                th.innerHTML = "";
                if (columns[i].headerRenderer) {
                    temp = columns[i].headerRenderer.render(this, columns[i].field, i);
                    if (temp) {
                        (typeof temp === "string") ? (th.innerHTML = temp) : th.appendChild(temp);
                    }
                }
                else if (this.headerRenderer) {
                    temp = this.headerRenderer.render(this, columns[i].field, i);
                    if (temp) {
                        (typeof temp === "string") ? (th.innerHTML = temp) : th.appendChild(temp);
                    }
                }
                else {
                    temp = OHeaderRenderer.render(this, columns[i], columns[i].field, i);
                    if (temp) {
                        (typeof temp === "string") ? (th.innerHTML = temp) : th.appendChild(temp);
                    }
                }
            }
        },

        /**
         @method showHeader: is to show datagrid table header? default yes
         */
        showHeader: function () {
            var me = this;
            if (me.config.showHeader === false) {
                me.header.style.display = 'none';
            }
        },
        /**
         @method renderHeader 获取所有选中的行
         @return 表格行信息
         */
        getSelectedRows: function () {
            return CheckboxRenderer.getSelectedRows(this);
        },

        /**
         @method renderHeader 获取所有选中的行
         @return 表格行信息
         */
        initTableClass: function () {
            if (this.config.tableClass) {
                this.$table.find("table").addClass(this.config.tableClass);
            } else {
                //默认样式
                this.$table.find("table").addClass("table");
            }
        },


        /**
         @method getReorderColumn 获取所有排序字段
         @return 表格行信息
         */
        getReorderColumn: function () {
            var result = {};
            for (var i = 0; i < this.columns.length; i++) {
                var column = this.columns[i];
                if (column["field"] && column["reorder"] && column["reorder"]["__className__"] && column["reorder"]["__className__"] != "") {
                    result[column["field"].name] = column["reorder"]["order"];
                }
            }

            return result;
        },

        /**
         @method collectData 获取所有行数据
         @return 表格行信息
         */
        collectData: function () {
            var result = [];
            for (var i = 0; i < this.rows.length; i++) {
                result.push(this.rows[i].getValue());
            }
            return result;
        }
    });


    /**
     @class DataRow 表格行对象
     @constructor 构造函数
     @param elem {DomNode} Dom节点
     @param option {Object} 配置信息 {columns:[{field:{name:"栏目名称","title":"栏目显示名称","type":"数据类型"},width:"栏目宽度"}]}
     */
    var DataRow = function (data, grid) {
        this.data = data;
        this.grid = grid;

        //for edit
        this._controls = {};

        this.create();


    };

    DataRow.getEmptyRow = function (colspan, innerHTML) {
        var row = document.createElement("tr");
        var cell = document.createElement("td");
        row.appendChild(cell);
        cell.setAttribute("colspan", colspan);
        cell.style.textAlign = "center";

        cell.innerHTML = innerHTML || '<img class="mT100 mB100 noDataImg" src="images/nodata_icon.png">';
        return row;
    },

        DataRow.prototype = X.prototype.createObject(X.prototype.event);

    /**
     @method prototype 定义DataRow原型
     */
    DataRow.prototype = $.extend(DataRow.prototype, {
        /**
         @method create 构建表体行,并绑定事件
         */
        create: function () {
            var row = this.createRow();
            this.dom = row;
            this.renderRow(this.data);
            var that = this;
            row.onclick = function (event) {
                var newEvent = {
                    type: "selected",
                    target: that,
                    row: that
                };
                that.trigger(newEvent);
            }
        },

        renderRow:function(data){
           //子类重载
        },

        /**
         @method create 构建表体行
         */
        createRow: function () {
            var row = document.createElement("tr");
            var column = null;
            for (var i = 0; i < this.grid.columns.length; i++) {
                column = this.grid.columns[i];

                var cell = document.createElement("td");
                if (column.className) {
                    cell.className = column.className;
                }
                if (this.grid.config.editable == true) {
                    this.renderEdit(cell, this.data, column.field, column, i);
                } else {
                    this.render(cell, this.data, column.field, column, i);
                }
                row.appendChild(cell);
            }
            return row;
        },

        /**
         @method destroy 销毁表体行
         */
        destroy: function () {
            //todo: 要把渲染器也destroy
            this.dom = null;
            this.data = null;
            this.grid = null;
        },

        /**
         @method select 设置选中行
         @param flag {boolean} 设置行为选中/不选中
         */
        select: function (flag) {
            if (flag) {
                this.dom.className = "info";
            }
            else {
                this.dom.className = "";
            }
        },

        /**
         @method set 修改行数据，并更新
         @param key {string} 要设置的数据的key
         @param value {string} 要设置的数据的value
         */
        set: function (key, value) {
            this.data[key] = value;

            this.refresh(null, [key]);
        },

        /**
         @method get 获取行数据
         @return 返回行数据
         */
        get: function (key) {
            return this.data[key];
        },

        /**
         @method render 渲染行
         @param cell {domNode} 单元格对象
         @param data {Object} 要设置的数据的value
         @param field {Object} 字段信息
         @param column {Number} 栏目信息
         */
        render: function (cell, data, field, column, index) {
            var temp = "";
            cell.innerHTML = "";  //清空内容
            if (data) {
                if (column.itemRenderer) {
                    if (column.itemRenderer === CheckboxRenderer) {
                        temp = column.itemRenderer.render(this, field, index);
                    }
                    else {
                        temp = column.itemRenderer.render(data, field, index, this);
                    }

                    if (temp) {
                        (typeof temp === "string") ? (cell.innerHTML = temp) : cell.appendChild(temp);
                    }
                }
                else if (column.titleFunction) {
                    cell.innerHTML = "";
                    cell.innerHTML = this.grid.columns[index].titleFunction(data, field);
                }
                else if (this.grid.itemRenderer) {
                    temp = this.grid.itemRenderer.render(data, field, index, this);
                    if (temp) {
                        (typeof temp === "string") ? (cell.innerHTML = temp) : cell.appendChild(temp);
                    }
                }
                else if (column.dataFormater) {
                    cell.innerHTML = column.dataFormater.format(data, field);
                }
                else {
                    cell.innerHTML = DataFormater.format(data, field);
                }
            }
        },

        /**
         @method render 渲染行
         @param cell {domNode} 单元格对象
         @param data {Object} 要设置的数据的value
         @param field {Object} 字段信息
         @param column {Number} 栏目信息
         */
        renderEdit: function (cell, data, field, column, index) {
            var temp = "", formatResult = "";
            cell.innerHTML = "";  //清空内容

            var ctrlType, ctrlClazz, ctrl, ctrlHtml;
            ctrlType = field["ctrlType"];
            if (ctrlType) {
                ctrlClazz = X.prototype.controls.getControlClazz(ctrlType);
                if (ctrlClazz) {
                    ctrlHtml = ctrlClazz.getTemplate(field);
                    ctrl = X.prototype.controls.getControl(ctrlType, $(ctrlHtml),field);

                    this._controls[field["name"]] = ctrl;
                }
            }

            if (column.itemRenderer) {
                if (column.itemRenderer === CheckboxRenderer) {
                    temp = column.itemRenderer.render(this, field, index);
                }
                else {
                    temp = column.itemRenderer.render(data, field, index, this);
                }

                if (temp) {
                    (typeof temp === "string") ? (cell.innerHTML = temp) : cell.appendChild(temp);
                }
            }
            else if (column.titleFunction) {
                var title = this.grid.columns[index].titleFunction(data, field);
                if (ctrl) {
                    ctrl.setValue(title);
                    cell.appendChild(ctrl.elem[0]);
                }
                else {
                    cell.innerHTML = title;
                }
            }
            else if (this.grid.itemRenderer) {
                temp = this.grid.itemRenderer.render(data, field, index, this);
                if (temp) {
                    (typeof temp === "string") ? (cell.innerHTML = temp) : cell.appendChild(temp);
                }
            }
            else if (column.dataFormater) {
                formatResult = column.dataFormater.format(data, field);
                if (ctrl) {
                    ctrl.val(formatResult);
                    cell.appendChild(ctrl.elem[0]);
                }
                else {
                    cell.innerHTML = formatResult;
                }
            }
            else {
                formatResult = DataFormater.format(data, field);
                if (ctrl) {
                    ctrl.val(formatResult);
                    cell.appendChild(ctrl.elem[0]);
                }
                else {
                    cell.innerHTML = formatResult;
                }
            }
        },

        /**
         @method refresh 刷新行数据
         @param data {Array} 行数据
         */
        refresh: function (data, keys) {
            if (data) {
                this.data = data;
            }

            if (keys) {
                if (keys.length == 1 && keys[0] === "__checked") {
                    this.render(this.dom.childNodes[0], this.data, this.grid.columns[0].field, this.grid.columns[0], i);
                }
                else {
                    for (var i = 0; i < this.grid.columns.length; i++) {
                        var column = this.grid.columns[i];
                        if (column.field) {
                            if ($.inArray(column.field["name"], keys) != -1) {
                                this.render(this.dom.childNodes[i], this.data, this.grid.columns[i].field, this.grid.columns[i], i);
                            }
                        }
                    }
                }
            }
            else {
                for (var i = 0; i < this.grid.columns.length; i++) {
                    this.render(this.dom.childNodes[i], this.data, this.grid.columns[i].field, this.grid.columns[i], i);
                }
            }
        },

        /**
         @method refresh 刷新行数据
         @param data {Array} 行数据
         */
        getValue: function () {
            var result = {};
            for (var i = 0; i < this.grid.columns.length; i++) {
                var column = this.grid.columns[i];
                if (column["field"] && !(column["nodata"] == true)) {
                    var fieldName = column["field"]["name"];
                    if (column.itemCollector) {
                        result[fieldName] = column.itemCollector(column["field"], i, this, this.dom.childNodes[index].firstChild);
                    }
                    else {
                        var ctrl = this._controls[fieldName];
                        if (ctrl) {
                            result[fieldName] = ctrl.val();
                        }
                        else {
                            result[fieldName] = this.dom.childNodes[i].innerHTML;
                        }
                    }
                }
                if (this.data[this.grid.primary]) {
                    result[this.grid.primary] = this.data[this.grid.primary];
                }
            }


            return result;
        }
    });


    var CheckboxRenderer = {
        render: function (row, field, columnIndex) {
            var grid = row.grid;
            var data = row.data;

            var div = document.createElement("div");
            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = data["__checked"];

            checkbox.onclick = function () {
                data["__checked"] = !data["__checked"];

                var checkedItems = 0;

                var rowLength = grid.rows.length;
                for (var i = 0; i < rowLength; i++) {
                    if (grid.rows[i].get("__checked")) {
                        checkedItems++;
                    }
                }

                if (checkedItems === 0) {
                    grid.set("checkState", "unchecked");
                }
                else if (checkedItems === rowLength) {
                    grid.set("checkState", "checked");
                }
                else {
                    grid.set("checkState", "indeterminate");
                }
                
                if(X.prototype.isFunction(grid.config.afterChecked)){
                    grid.config.afterChecked([row.data],data["__checked"]);
                }
            };
            div.appendChild(checkbox);

            var span = document.createElement("span");
            span.innerHTML = data[(field && field["name"] )] || "";
            div.appendChild(span);

            return div;
        },

        getSelectedRows: function (grid) {
            var checkState = grid.get("checkState");
            if (checkState === "checked") {
                return grid.rows;
            }
            else if (checkState === "unchecked") {
                return [];
            }
            else {
                var result = [];
                for (var i = 0; i < grid.rows.length; i++) {
                    var row = grid.rows[i];
                    if (row.data["__checked"]) {
                        result.push(row);
                    }
                }
                return result;
            }
        }
    };

    var HeaderRenderer = {
        render: function (grid, field, columnIndex) {
            var rows = grid.rows;
            var div = document.createElement("div");
            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";

            switch (grid.get("checkState")) {
                case "checked":
                {
                    checkbox.checked = true;
                    break;
                }
                case "unchecked":
                {
                    checkbox.checked = false;
                    break;
                }
                case "indeterminate":
                {
                    checkbox.indeterminate = true;
                    break;
                }
            }
            div.appendChild(checkbox);

            checkbox.onclick = function () {
                var checked = this.checked;
                for (var i = 0; i < rows.length; i++) {
                    rows[i].set("__checked", checked);
                }
	            checked?grid.set("checkState","checked"):grid.set("checkState","unchecked");
                if(X.prototype.isFunction(grid.config.afterChecked)){
                    var dataArray = [];
                    grid.rows.forEach(function (item, index, rows) {
                        dataArray.push(item["data"]);
                    });
                    grid.config.afterChecked(dataArray,checked);
                }
            };

            var span = document.createElement("span");
            span.innerHTML = (field && field["title"]) || "";
            div.appendChild(span);

            return div;
        },

        destroy: function () {

        }
    };


    var OHeaderRenderer = {
        createReorder: function (grid, column, field, columnIndex) {
            var div = document.createElement("div");

            var $div = $(div);


            //var span = document.createElement("span");
            var title = (field && field["title"]) || "";

            $div.append(title);


            //span.innerHTML = title;

            var reorder = column["reorder"];


            if (reorder && reorder["order"] != "no") {
                var order = reorder["order"];
                (order === "asc") ? reorder["__className__"] = "up" : reorder["__className__"] = "down";
                if (reorder["__className__"] === "up") {
                    $div.append('<span class="sort"><em class="sort_up icon-100 on"></em><em class="sort_down icon-101"></em></span>');
                }
                else if (reorder["__className__"] === "down") {
                    $div.append('<span class="sort"><em class="sort_up icon-100"></em><em class="sort_down icon-101 on"></em></span>');
                }


                $div.on("click", function () {
                    //排序
                    (order === "asc") ? column["reorder"]["order"] = "desc" : column["reorder"]["order"] = "asc";

                    if (grid.config["orderMode"] == 1) {
                        //如果只允许同时只有一列排序。
                        for (var i = 0; i < grid.columns.length; i++) {
                            if (grid.columns[i]["reorder"]) {
                                grid.columns[i]["reorder"]["__className__"] = "";
                            }
                        }
                    }


                    (order === "asc") ? reorder["__className__"] = "up" : reorder["__className__"] = "down";


                    grid.renderHeader();

                    //执行排序后抛出事件
                    if (X.prototype.isFunction(grid.config.beforeReorder)) {
                        grid.config.beforeReorder(grid, column, field, columnIndex);
                    }
                });
            }


            return div;
        },


        render: function (grid, column, field, columnIndex) {
            if (column["reorder"]) {
                return this.createReorder(grid, column, field, columnIndex);
            }
            else {
                return field.title;
            }
        }
    };


    var DataFormater = {
        format: function (data, field) {
            var result = "";
            if (field && data) {
                result = data[field["name"]];
                switch (field["type"]) {
                    case "string":
                        break;
                    case "date":
                        break;
                    case "currency":
                        break;
                    case "image":
                        //此处需要根据实际，从文件服务器取到数据后，回填
                        result = '<img src="' + data[field["name"]] + '">';
                        break;
                    default:
                        break;
                }
            }
            return result;
        }
    };

    //X.controls.registerControl("DataGrid",DataGrid)


    /**
     @class SDataGrid 标准主子表对象
     @constructor 构造函数
     @param elem {DomNode} Dom节点
     @param option {Object} 配置信息 {columns:[{field:{name:"栏目名称","title":"栏目显示名称","type":"数据类型"},width:"栏目宽度"}]}
     */
    var SDataGrid = function (element, config) {

        DataGrid.call(this, element, config);


        element.innerHTML = '<table border="1" style="border-color:#ccc;" class="w100p" bordercolor="#ccc"  cellpadding="30"><thead><tr></tr></thead></table>';

        this.header = element.firstChild.tHead;
        this.tbody = element.firstChild;

        this.initTableClass();
        this.showHeader();
    };

    SDataGrid.prototype = X.prototype.createObject(DataGrid.prototype);

    $.extend(SDataGrid.prototype, {
        /**
         @method clear 清空表体行
         @param data {Array} 表体行数据
         */
        clear: function () {
            $(this.tbody).find("tbody").remove();
            if (this.rows.length > 0) {
                this.rows.forEach(function (item, index, rows) {
                    item.destroy();
                });
                this.rows.length = 0;
            }
        },

        getNewRow: function (data) {
            return new SDataRow(data, this);
        },

        renderEmpty: function () {
            var row = SDataRow.getEmptyRow(this.columns.length, this.config.emptyHtml);

            $(this.tbody).append(row);
        }
    });


    function Expand(colspan, row) {
        this.$elem = $('<tr class="more_show_btn">' +
            '<td colspan="' + colspan + '" class="">' +
            '<div class="more_show_conts js-more_show_conts"><span>'+ $.i18n.prop('controls_open') +'</span><em class="icon-95"></em></div>' +
            '</td>' +
            '</tr>');
        this.$elem.on("click", $.proxy(function (argument) {
            this.trigger("click");
        }, this));

        this.row = row;
        $(row.dom).append(this.$elem);
    }

    $.extend(Expand.prototype, {
        setTitle: function (title) {
            this.$elem.find(".js-more_show_conts").find("span").html(title);
        },
        hide: function () {
            this.$elem.hide();

        },
        show: function () {
            this.$elem.show();
        },
        changeState: function (show) {
            show ? this.$elem.find(".js-more_show_conts").find("em").addClass("icon-96") : this.$elem.find(".js-more_show_conts").find("em").removeClass("icon-96");
        }

    }, X.event);


    var SDataRow = function (data, grid) {
        DataRow.call(this, data, grid);

        this.items = [];
    };

    SDataRow.getEmptyRow = function (colspan, innerHTML) {
        var row = document.createElement("tbody");

        $(row).append(DataRow.getEmptyRow(colspan, innerHTML));

        return row;
    },

        SDataRow.prototype = X.prototype.createObject(DataRow.prototype);

    $.extend(SDataRow.prototype, {
        /**
         @method create 构建表体行
         */
        create: function () {
            var row = document.createElement("tbody");

            this.dom = row;

            this.renderRow(this.data);

            var that = this;
            row.onclick = function (event) {
                var newEvent = {
                    type: "selected",
                    target: that,
                    row: that
                };
                that.trigger(newEvent);
            }
        },

        /**
         @method destroy 销毁表体行
         */
        destroy: function () {
            //todo: 要把渲染器也destroy
            this.dom = null;
            this.data = null;
            this.grid = null;
        },
        /**
         @method renderRow 渲染行
         @param cell {domNode} 单元格对象
         @param data {Object} 要设置的数据的value
         @param field {Object} 栏目信息{}
         @param index {Number} 列索引
         */
        renderRow: function (data) {

            var that = this;

            var row = $(this.dom);
            var colspan = this.grid.columns.length;


            row.html();

            //标准的主子表结构
            var tr = this.createRow(this.render);
            $(this.dom).append(tr);

            this.expand = new Expand(colspan, this);

            this.expand.on("click", function () {
                if (that.items && that.items.length > 0) {
                    if (that.items.is(":visible")) {
                        if (X.prototype.isFunction(that.grid.config.onSlideUp)) {
                            var ok = that.grid.config.onSlideUp(that.expand);
                            if (ok) {
                                that.items.hide();
                                that.expand.changeState(false);
                            }
                        }
                        else {
                            that.expand.setTitle("Stop");
                            that.items.hide();
                            that.expand.changeState(false);
                        }
                    }
                    else {
                        if (X.prototype.isFunction(that.grid.config.onSlideDown)) {
                            var ok = that.grid.config.onSlideDown(that.expand);
                            if (ok) {
                                that.items.show();
                                that.expand.changeState(true);
                            }
                        }
                        else {
                            that.expand.setTitle($.i18n.prop('controls_open'));
                            that.items.show();
                            that.expand.changeState(true);
                        }
                    }
                }
                else {
                    if (X.prototype.isFunction(that.grid.config.beforeRowExpand)) {
                        that.grid.config.beforeRowExpand(that.data, that);
                    }
                    else {
                        //console.log("没有定义展开处理事件")
                    }
                    if (X.prototype.isFunction(that.grid.config.onSlideDown)) {
                        that.grid.config.onSlideDown(that.expand);
                        that.expand.changeState(true);
                    }
                }
            });
        },


        /**
         @method refresh 刷新行数据
         @param data {Array} 行数据
         */
        refresh: function (data, keys) {

            if (data) {
                this.data = data;
            }

            if (keys) {
                for (var i = 0; i < this.grid.columns.length; i++) {
                    var column = this.grid.columns[i];
                    if (column.field) {
                        if ($.inArray(column.field["name"], column.field["name"]) != -1) {
                            this.render(this.dom.childNodes[0].cells[i], this.data, this.grid.columns[i].field, this.grid.columns[i], i);
                        }
                    }
                }
                if ($.inArray("__checked", keys) != -1) {
                    this.render(this.dom.childNodes[0].cells[0], this.data, this.grid.columns[0].field, this.grid.columns[0], 0);
                }

            } else {
                for (var i = 0; i < this.grid.columns.length; i++) {
                    this.render(this.dom.childNodes[0].cells[i], this.data, this.grid.columns[i].field, this.grid.columns[i], i);
                }
            }
        },

        createItemRow: function (data) {
            // body...
            var row = document.createElement("tr");
            var column = null;
            for (var i = 0; i < this.grid.columns.length; i++) {
                column = this.grid.columns[i];

                var cell = document.createElement("td");
                if (column.className) {
                    cell.className = column.className;
                }
                var childMap = this.grid.config.childMap;
                if (childMap) {
                    if (column["field"]) {
                        var fieldMap = this.grid.config.childMap[column["field"].name];
                        if (fieldMap) {
                            this.render(cell, data, fieldMap.field, fieldMap, i);
                        }
                    }
                }

                row.appendChild(cell);
            }

            return row;
        },

        /**
         @method createItems 创建子表
         @param data {Array} 行数据
         */
        createItems: function (data) {
            var result = [];
            for (var i = 0; i < data.length; i++) {
                var row = data[i];
                var tr = this.createItemRow(row);
                result.push(tr);
            }

            return result;
        },

        getItems: function (url, postData, callback) {

            X.loadData({
                url: url,
                type: "POST",
                data: postData,
                callback: function (data) {
                    if (data.statusCode == "2000000") {
                        callback(data);
                    } else {
                        layer.alert(getErrorName(data.statusCode));
                    }
                }
            });
        },

        loadItems: function (param) {
            var that = this;
            //标准的主子表结构
            if (param.items) {
                that.appendItems(param, param.items);
            }
            else {
                this.getItems(param.url, param.postData, function (data) {
                    if (param.afterDataback) {
                        var result = param.afterDataback(data);
                        if (result) {
                            that.appendItems(param, result)
                        }
                    }
                    else {
                        that.appendItems(param, data);
                    }
                });
            }
        },

        appendItems: function (param, items) {
            var $row = $(this.dom);
            var nodeList = this.createItems(items);
            if (param.beforeItemAppend) {
                var nodeList = param.beforeItemAppend(items, nodeList, this);
                if (nodeList) {
                    this.items = $(nodeList);
                    this.items.insertBefore(this.expand.$elem);
                }


            } else {
                this.items = $(nodeList);
                this.items.insertBefore(this.expand.$elem);
            }
            var after = param.afterItemAppend;
            if (X.prototype.isFunction(after)) {
                after(this.items, nodeList, this);
            }
        }

    });


    //X.controls.registerControl("SDataGrid",SDataGrid);


    /**
     @class DataRow 表格行对象
     @constructor 构造函数
     @param elem {DomNode} Dom节点
     @param option {Object} 配置信息 {columns:[{field:{name:"栏目名称","title":"栏目显示名称","type":"数据类型"},width:"栏目宽度"}]}
     */

    var TDataGrid = function (element, config) {
        this.$template = $(config.selector);

        SDataGrid.call(this, element, config);
    };

    TDataGrid.prototype = X.prototype.createObject(SDataGrid.prototype);

    $.extend(TDataGrid.prototype, {

        /**
         @method getNewRow 获取行对象
         @param data {Array} 表体行数据
         */
        getNewRow: function (data) {
            return new TDataRow(data, this);
        },

        /**
         @method loadData 构建DataGrid
         @param data {Array 二维数组} 表体数据
         */
        loadData: function (data) {

            if (X.prototype.isFunction(this.config.beforeTableRender)) {
                this.config.beforeTableRender(this,data);
            }

            this.clear();          
            if (data.length > 0) {
                var columnCount = this.config.columnCount;
                if(columnCount){                   
                    for (var i = 0; i < data.length; i+=columnCount) {                        
                        var dataRow = [];
                        for(var j = 0; j < columnCount; j++){
                            if(data[i+j]){
                               dataRow.push(data[i+j]); 
                            }
                        }
                        this.insertRow(dataRow);
                    } 
                }
                else{
                    for (var i = 0; i < data.length; i++) {
                        this.insertRow(data[i]);
                    }    
                }                
            }
            else {
                //没有数据时，显示
                this.renderEmpty();
            }

            this.renderHeader();

            if (X.prototype.isFunction(this.config.afterTableRender)) {
                this.config.afterTableRender(this);
            }

            var event = {
                type: "loadCompleted",
                target: this
            };
            this.trigger(event);
        }
    });


    var TDataRow = function (data, grid) {
        SDataRow.call(this, data, grid);
    };

    TDataRow.prototype = X.prototype.createObject(SDataRow.prototype);

    $.extend(TDataRow.prototype, {

        /**
         @method destroy 销毁表体行
         */
        destroy: function () {
            //todo: 要把渲染器也destroy
            this.dom = null;
            this.data = null;
            this.grid = null;
        },

        /**
         @method renderRow 渲染行
         @param cell {domNode} 单元格对象
         @param data {Object} 要设置的数据的value
         @param field {Object} 栏目信息{}
         @param index {Number} 列索引
         */
        renderRow: function (data) {

            var row = $(this.dom);
            var columnCount = this.grid.config.columnCount;
            if(columnCount){
                var rowTpl = $(this.grid.$template.html());
                var tdhtml = rowTpl.find('td').prop("outerHTML");
                var tr = $("<tr/>");
                data.forEach(function(item, index, array) {
                    tr.loadTemplate($(tdhtml),item,{append:true});
                });
                
                //tr.loadTemplate($(tdhtml),data);
                row.append(tr);
            }
            else{
                row.loadTemplate($(this.grid.$template.html()), data);    
            }

            if (this.grid.config.showCheckbox) {
                var checkbox = CheckboxRenderer.render(this)
                row.find(".check_boxs").empty().append(checkbox);
            }
            if (this.grid.config.afterRowRender) {
                this.grid.config.afterRowRender(this, data);
            }
        },

        /**
         @method refresh 刷新行数据
         @param data {Array} 行数据
         */
        refresh: function (data, keys) {
            if (data) {
                this.data = data;
            }

            if (keys && keys.length === 1 && keys[0] == "__checked") {
                if (this.grid.config.showCheckbox) {
                    var checkbox = CheckboxRenderer.render(this)
                    $(this.dom).find(".check_boxs").empty().append(checkbox);
                }
            }
            else {
                this.renderRow(this.data);
            }
        }


    });


    X.prototype.controls.widget("DataGrid", function (controlType) {
        return DataGrid;
    });

    X.prototype.controls.widget("SDataGrid", function (controlType) {
        return SDataGrid;
    });

    X.prototype.controls.widget("TDataGrid", function (controlType) {
        return TDataGrid;
    });


    /**
     @class DataView 数据视图控件
     @constructor 构造函数
     @param elem {DomNode} Dom节点
     @param option {Object} 配置信息 {"selector":"模板选择器", "className":"样式名"}
     */

    var DataView = function (element, config) {

        this.config = config || {};

        this.config.showEmpty = (this.config.showEmpty === undefined) ? true : this.config.showEmpty;

        this.columns = this.config.columns || [];

        this.$template = $(this.config.selector);
       
        this.dom = $('<ul class="productList disib js-wrapList tal" style="padding-left: 6px"></ul');

        $(element).append(this.dom);      

    };

    DataView.prototype = X.prototype.createObject(BaseControl.prototype);

    $.extend(DataView.prototype, {

        init : function(){

        },

        clear : function(){
            this.dom.html("");
        },
        
        loadData: function (data) {
            var that = this;

            if (X.prototype.isFunction(this.config.beforeTableRender)) {
                data = this.config.beforeTableRender(this,data);
            }

            this.clear();          
            if (data.length > 0) {   
                var template = this.$template.html();
                data.forEach(function(item, index, array) {
                    that.dom.loadTemplate($(template),item,{append:true});
                });                             
            }
            else {
                if(this.config.showEmpty){
                    //没有数据时，显示
                    this.renderEmpty();
                }
            }

            //this.renderHeader();

            if (X.prototype.isFunction(this.config.afterTableRender)) {
                this.config.afterTableRender(this,data);
            }

            var event = {
                type: "loadCompleted",
                target: this
            };
            this.trigger(event);
        },

        renderEmpty: function () {
            var row = this.getEmptyRow();

            this.dom.append(row);
        },

        getEmptyRow : function(){
            return this.config.emptyHtml || '<li><img class="mT100 mB100 noDataImg" src="images/nodata_icon.png"></li>';;
        },

        /**
         @method getReorderColumn 获取所有排序字段
         @return 表格行信息
         */
        getReorderColumn: function () {
            var result = {};
            for (var i = 0; i < this.columns.length; i++) {
                var column = this.columns[i];
                if (column["field"] && column["reorder"] && column["reorder"]["__className__"] && column["reorder"]["__className__"] != "") {
                    result[column["field"].name] = column["reorder"]["order"];
                }
            }

            return result;
        },

    });

    X.prototype.controls.widget("DataView", function (controlType) {
        return DataView;
    });


})(jQuery, this.Xbn);
(function ($, X) {

    X.prototype.controls.widget("DatePicker", function (controlType) {
        var DatePicker = function (elem, options) {
            X.prototype.controls.getControlClazz("BaseControl").call(this, elem, options);
            var that = this;
            if (elem) {
                elem.attr("autocomplete", "off");
                laydate({
                    istime: false,
                    elem: elem.get(0),
                    event: 'focus',
                    format: 'YYYY-MM-DD',
                    min: (that.options && that.options.min) ? that.options.min : "1900-01-01 00:00:00",
                    max: (that.options && that.options.max) ? that.options.max : '2099-06-16 23:59:59',
                    fixed: true,
                    choose: function (date) {
                        if (X.prototype.isFunction(that.options.afterDateChange)) {
                            that.options.afterDateChange(that, date);
                        }
                    },
                    clear: function () {
                        //that.date = "";
                    }
                });
            }
        }

        /**
         @method 获取文本框控件模板
         @static 类静态方法
         @return 获取文本框控件模板
         */
        DatePicker.getTemplate = function (item) {
            return '<input type="text" class="default_input w250 fL js-' + item["name"] + '" >';
        };

        X.prototype.controls.extend(DatePicker, "BaseControl");
        DatePicker.prototype.constructor = DatePicker;

        /**
         @method init 获取文本框的值
         */
        DatePicker.prototype.getValue = function () {
            return this.elem.val();
        };

        DatePicker.prototype.setValue = function (value) {
            this.elem.val(value);
        };

        /**
         @method init 重置文本框，设置为false
         */
        DatePicker.prototype.reset = function () {
            this.setValue("");
        };


        return DatePicker;
    });


})(jQuery, this.Xbn);
(function ($, X) {

    var $, Calendar, DAYS, DateRangePicker, MONTHS, TEMPLATE;

    $ = jQuery;

    //DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    DAYS = ["Mon","Tue", "Wed","Thu","Fri", "Sat", "Sun"];

    //MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    MONTHS = ["Jan","Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct","Nov", "Dec"];

    TEMPLATE = "<div class=\"drp-popup\">\n  <div class=\"drp-timeline\">\n    <ul class=\"drp-timeline-presets\"></ul>\n    <div class=\"drp-timeline-bar\"></div>\n  </div>\n  <div class=\"drp-calendars\">\n    <div class=\"drp-calendar drp-calendar-start\">\n     <div class=\"drp-month-picker\">\n        <div class=\"drp-arrow\"><</div>\n        <div class=\"drp-month-title\"></div>\n        <div class=\"drp-arrow drp-arrow-right\">></div>\n      </div>\n      <ul class=\"drp-day-headers\"></ul>\n      <ul class=\"drp-days\"></ul>\n      <div class=\"drp-calendar-date\"></div>\n   <div class=\"mask\"></div>\n   </div>\n    <div class=\"drp-calendar-separator\"></div>\n    <div class=\"drp-calendar drp-calendar-end\">\n     <div class=\"drp-month-picker\">\n        <div class=\"drp-arrow\"><</div>\n        <div class=\"drp-month-title\"></div>\n        <div class=\"drp-arrow drp-arrow-right\">></div>\n      </div>\n      <ul class=\"drp-day-headers\"></ul>\n      <ul class=\"drp-days\"></ul>\n      <div class=\"drp-calendar-date\"></div>\n  <div class=\"mask\"></div>\n   </div>\n  </div>\n  <div class=\"drp-tip\"></div>\n<div class=\"drp-calendar-btn\"><a class=\"clear\">清除</a><div><a class=\"ok\">确定</a><a  class=\"cancel\">取消</a></div></div></div>";

    var CustomerDate = {
        "Range": 0,
        "Start": 1,
        "End": 2,
        "Week": 3,
        "Month": 4,
        "Season": 5,
        "Year": 6
    }


    DateRangePicker = (function () {

        var Position = {
            "Left": 0,
            "Right": 1
        }

        function DateRangePicker($select, options) {
            this.$select = $select;
            this.$dateRangePicker = $(TEMPLATE);
            this.$dateRangePicker.hide();
            this.$select.attr('tabindex', '-1').before(this.$dateRangePicker);
            this.$ok = this.$dateRangePicker.find(".ok");
            this.$cancel = this.$dateRangePicker.find(".cancel");
            this.$clear = this.$dateRangePicker.find(".clear");

            this.initOptions(options);
            this.isHidden = true;
            this.initBindings();
            this.setRange(this.$select.val());

            //箭头
            this.$arrow = this.$dateRangePicker.find(".drp-tip");
        }

        DateRangePicker.prototype.initOptions = function (options) {
            var defaultOptions = {
                showTimeline: true,
                separator: "-",
                onOk: null,
                position: Position.Left
            }

            this.options = $.extend(defaultOptions, options);

            (this.options["showTimeline"] == true) ? this.$dateRangePicker.find(".drp-timeline").show() : this.$dateRangePicker.find(".drp-timeline").hide();

            var innerOp = this.options.dataSource || [];
            if ($.isArray(innerOp)) {
                innerOp.unshift({"value": "0", "text": "Please select", "selected": "selected"}, {
                    "value": "",
                    "text": "Range"
                }, {"value": "", "text": "Start"}, {"value": "", "text": "Stop"})

                var optionHTML = "";
                for (var i = 0, len = innerOp.length; i < len; i++) {
                    var item = innerOp[i];
                    if (item.selected) {
                        optionHTML += "<option value='" + item.value + "' selected>" + item.text + "</option>";
                    }
                    else {
                        optionHTML += "<option value='" + item.value + "'>" + item.text + "</option>";
                    }
                }
                this.$select.append(optionHTML);
            }
        }

        DateRangePicker.prototype.initBindings = function () {
            var self;
            self = this;

            var setValue = function (index) {
                var presetIndex = index || self.$dateRangePicker.find('.drp-timeline-presets li.drp-selected').index();
                return self.showCustomDate(presetIndex);
            }

            this.$ok.on("click", function (argument) {
                setValue();
                self.hide();
                if (self.options.onOk) {
                    self.options.onOk(self, self.value());
                }
            });
            this.$cancel.on("click", function (argument) {
                self.hide();
            });

            this.$clear.on("click", function (argument) {
                self.$select[0].selectedIndex = 0;
                self.hide();
            });

            this.$select.on('focus mousedown', function (e) {
                var $select;
                $select = this;
                setTimeout(function () {
                    return $select.blur();
                }, 0);
                return false;
            });
            this.$dateRangePicker.click(function (evt) {
                return evt.stopPropagation();
            });
            $('body').click(function (evt) {
                if (evt.target === self.$select[0] && self.isHidden) {
                    return self.show();
                } else if (!self.isHidden) {
                    return self.hide();
                }
            });
            /*时间线*/
            (function () {
                var avwidth = Math.floor((self.$dateRangePicker.find(".drp-calendars").width() - 10) / self.$select.children().length);
                var width = avwidth + "px";
                var left = avwidth / 2 - 6 + "px";

                self.$select.children().each(function (index, element) {
                    if (index != 0) {
                        self.$dateRangePicker.find('.drp-timeline-presets').append($("<li style='width:" + width + "' class='" + (((index == CustomerDate.Range + 1) && 'drp-selected') || '') + "'>" + ($(this).text()) + "<div style='left:" + left + "' class='drp-button'></div></li>"));
                    }
                });

            })();


            this.$dateRangePicker.find('.drp-timeline-presets li').click(function (evt) {
                $(this).addClass('drp-selected').siblings().removeClass('drp-selected');

                var presetIndex = $(this).index();
                if (presetIndex == CustomerDate.Start) {
                    self.startCalendar.Disabled(false);
                    self.endCalendar.Disabled(true);
                } else if (presetIndex == CustomerDate.End) {
                    self.startCalendar.Disabled(true);
                    self.endCalendar.Disabled(false);
                }
                else {
                    //选择了范围，周，月，季，年
                    self.startCalendar.Disabled(false);
                    self.endCalendar.Disabled(false);
                }
                self.customerIndex = presetIndex;
                var cd = self.getCustomDate(presetIndex);
                self.setRange(cd.value);
                self.draw();
            });
        };

        DateRangePicker.prototype.hide = function () {
            this.isHidden = true;
            return this.$dateRangePicker.hide();
        };


        DateRangePicker.prototype.orien = function (obj, offsetWidth, offsetHeight, pos) {
            var tops, rect = this.$select[0].getBoundingClientRect();

            // 判断位置是否超过window的宽度
            if ((rect.left + offsetWidth) > document.body.offsetWidth) {
                obj.style.left = rect.right - offsetWidth + 'px';
            } else {
                obj.style.left = rect.left + (pos ? 0 : DateRangePicker.scroll(1)) + 'px';
            }

            if (rect.bottom + offsetHeight / 1.5 <= DateRangePicker.winarea()) {
                tops = rect.bottom - 1;
            } else {
                tops = rect.top > offsetHeight / 1.5 ? rect.top - offsetHeight + 1 : DateRangePicker.winarea() - obj.offsetHeight;
            }
            obj.style.top = tops + (pos ? 0 : DateRangePicker.scroll()) + 'px';
        };

        DateRangePicker.scroll = function (type) {
            type = type ? 'scrollLeft' : 'scrollTop';
            return document.body[type] | document.documentElement[type];
        };

        DateRangePicker.winarea = function (type) {
            return document.documentElement[type ? 'clientWidth' : 'clientHeight']
        };

        DateRangePicker.prototype.setPosition = function () {

            var that = this, pos;
            var offset = 30;
            var offsetWidth = this.$dateRangePicker.outerWidth();
            var offsetHeight = this.$dateRangePicker.outerHeight();
            var obj = this.$dateRangePicker[0];
            var arrow = this.$arrow[0];

            var tops, rect = this.$select[0].getBoundingClientRect();

            // 判断位置是否超过window的宽度
            if ((rect.left + offsetWidth) > document.body.offsetWidth) {
                //右对齐显示
                obj.style.left = rect.right - offsetWidth + 'px';
                arrow.style.left = offsetWidth - (44 + offset) + 'px';  // 44 = padding(8)*2 + 自身width(28) + 偏移量 20
            } else {
                //左对齐显示
                obj.style.left = rect.left + (pos ? 0 : DateRangePicker.scroll(1)) + 'px';
                arrow.style.left = obj.style.left + offset;
            }


            if (rect.bottom + offsetHeight / 1.5 <= DateRangePicker.winarea()) {
                tops = rect.bottom - 1;
            } else {
                tops = rect.top > offsetHeight / 1.5 ? rect.top - offsetHeight + 1 : DateRangePicker.winarea() - obj.offsetHeight;
            }
            obj.style.top = tops + (pos ? 0 : DateRangePicker.scroll()) + 'px';


            // var outerWidth = this.$dateRangePicker.outerWidth();
            // var position = {
            //     left : this.$select.offset().left,
            //     top : this.$select.offset().top
            // };

            // var sp , ap ;

            // var pos = this.options.position;

            // var setLeftPostion = function () {
            //     sp = { top : position.top + that.$select.height(), left : position.left };
            //     ap = { left : offset };
            // };

            // var setRightPosition = function () {
            //     sp = { top : position.top + that.$select.height(), left : position.left + that.$select.width() - outerWidth };
            //     ap = { left : outerWidth - (44 + offset) };  // 44 = padding(8)*2 + 自身width(28) + 偏移量 20
            // }

            // if(pos == Position.Right){
            //     setRightPosition();
            // }
            // else if(pos == Position.Left){
            //     setLeftPostion();
            // }else{
            //     //自适应位置
            //     if(position.left - $(document.body).width() < 600 ){
            //         setRightPosition();
            //     }
            // }


            // this.$dateRangePicker.css(sp)
            // this.$arrow.css(ap);
        };

        DateRangePicker.prototype.show = function () {
            this.isHidden = false;
            this.setPosition();


            return this.$dateRangePicker.show();
        };

        DateRangePicker.prototype.setCustomDate = function () {
            if (this.$dateRangePicker.find('.drp-timeline-presets li:nth(' + CustomerDate.Start + ')').hasClass("drp-selected") ||
                this.$dateRangePicker.find('.drp-timeline-presets li:nth(' + CustomerDate.End + ')').hasClass("drp-selected")) {
                return;
            }
            return this.$dateRangePicker.find('.drp-timeline-presets li:nth(' + CustomerDate.Range + ')').addClass('drp-selected').siblings().removeClass('drp-selected');
        }

        DateRangePicker.prototype.getCustomDate = function (presetIndex) {
            var text, sd, ed, value;
            switch (presetIndex) {
                case CustomerDate.Range:
                    sd = this.formatDate(this.startDate());
                    ed = this.formatDate(this.endDate());
                    break;
                case CustomerDate.Start:
                    sd = this.formatDate(this.startDate());
                    ed = "";
                    break;
                case CustomerDate.End:
                    sd = "";
                    ed = this.formatDate(this.endDate());
                    break;
                case CustomerDate.Week:
                    sd = new Date();
                    ed = new Date();
                    sd.setDate(sd.getDate() - 7)
                    sd = this.formatDate(sd);
                    ed = this.formatDate(ed);
                    break;
                case CustomerDate.Month:
                    sd = new Date();
                    ed = new Date();
                    sd.setMonth(sd.getMonth() - 1);
                    sd = this.formatDate(sd);
                    ed = this.formatDate(ed);
                    break;
                case CustomerDate.Season:
                    sd = new Date();
                    ed = new Date();
                    sd.setMonth(sd.getMonth() - 3);
                    sd = this.formatDate(sd);
                    ed = this.formatDate(ed);
                    break;
                case CustomerDate.Year:
                    sd = new Date();
                    ed = new Date();
                    sd.setFullYear(sd.getFullYear() - 1);
                    sd = this.formatDate(sd);
                    ed = this.formatDate(ed);
                    break;
            }
            text = sd + ' 至 ' + ed;
            value = sd + "@" + ed;
            return {text: text, value: value};
        };


        DateRangePicker.prototype.showCustomDate = function (presetIndex) {
            var text, value, cd;
            this.$dateRangePicker.find('.drp-timeline-presets li:nth(' + presetIndex + ')').addClass('drp-selected').siblings().removeClass('drp-selected');
            cd = this.getCustomDate(presetIndex);
            text = cd.text;
            value = cd.value;

            var opIndex = presetIndex + 1;

            this.$select.find('option:nth(' + opIndex + ')').attr("value", value)
            this.$select.find('option:nth(' + opIndex + ')').text(text);
            this.$select[0].selectedIndex = opIndex


            this.setRange(this.$select.val());

            return;
        };

        DateRangePicker.prototype.value = function (value) {
            if (value != undefined) {
                var option = this.$select.find("[value='" + value + "']");
                if (option.length > 0) {
                    option.siblings().removeAttr("selected");
                    option.attr("selected", "selected");
                }
                else {
                    var range = value.split("@");
                    var text = range[0] + "To" + range[1];
                    this.$select.append("<option selected value='" + value + "'>" + text + "</option>")
                }
                this.setRange(this.$select.val());
            }
            else {
                return this.$select.val();
            }
        };

        DateRangePicker.prototype.formatDate = function (d) {
            var padding = function function_name(num) {
                if (num < 10) {
                    return "0" + num;
                }
                return num + "";
            }
            var separator = this.options.separator;
            return (d.getFullYear().toString()) + separator + padding((d.getMonth() + 1)) + separator + padding(d.getDate());
        };

        DateRangePicker.prototype.toDate = function (d) {
            var separator = this.options.separator;
            var temp = d.split(separator);

            return new Date(temp[0], temp[1], temp[2]);
        };

        DateRangePicker.prototype.setRange = function (daysAgo) {
            var endDate, startDate;

            if (daysAgo.indexOf(this.options.separator) != -1) {
                var temp = daysAgo.split("@");
                startDate = this.toDate(temp[0]);
                endDate = this.toDate(temp[1]);
            }
            else {
                if (isNaN(daysAgo)) {
                    return false;
                }
                daysAgo = (daysAgo.length === 0) ? 0 : daysAgo -= 1;
                endDate = new Date();
                startDate = new Date();
                startDate.setDate(endDate.getDate() - daysAgo);
            }


            if (this.startCalendar == undefined) {
                this.startCalendar = new Calendar(this, this.$dateRangePicker.find('.drp-calendar:first-child'), startDate, true);
            }
            else {
                this.startCalendar.setDate(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
            }
            if (this.endCalendar == undefined) {
                this.endCalendar = new Calendar(this, this.$dateRangePicker.find('.drp-calendar:last-child'), endDate, false);
            }
            else {
                this.endCalendar.setDate(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
            }

            return this.draw();
        };

        DateRangePicker.prototype.endDate = function () {
            return this.endCalendar.date;
        };

        DateRangePicker.prototype.startDate = function () {
            return this.startCalendar.date;
        };

        DateRangePicker.prototype.draw = function () {
            this.startCalendar.draw();
            return this.endCalendar.draw();
        };

        DateRangePicker.prototype.CustomerDate = function () {
            return this.customerIndex || 0;
        }

        return DateRangePicker;

    })();

    Calendar = (function () {
        function Calendar(dateRangePicker, $calendar, date, isStartCalendar) {
            var self;
            this.dateRangePicker = dateRangePicker;
            this.$calendar = $calendar;
            this.date = date;
            this.isStartCalendar = isStartCalendar;
            self = this;
            this.date.setHours(0, 0, 0, 0);
            this._visibleMonth = this.month();
            this._visibleYear = this.year();
            this.$title = this.$calendar.find('.drp-month-title');
            this.$dayHeaders = this.$calendar.find('.drp-day-headers');
            this.$days = this.$calendar.find('.drp-days');
            this.$dateDisplay = this.$calendar.find('.drp-calendar-date');
            $calendar.find('.drp-arrow').click(function (evt) {
                if ($(this).hasClass('drp-arrow-right')) {
                    self.showNextMonth();
                } else {
                    self.showPreviousMonth();
                }
                return false;
            });
        }

        Calendar.prototype.showPreviousMonth = function () {
            if (this._visibleMonth === 1) {
                this._visibleMonth = 12;
                this._visibleYear -= 1;
            } else {
                this._visibleMonth -= 1;
            }
            return this.draw();
        };

        Calendar.prototype.showNextMonth = function () {
            if (this._visibleMonth === 12) {
                this._visibleMonth = 1;
                this._visibleYear += 1;
            } else {
                this._visibleMonth += 1;
            }
            return this.draw();
        };

        Calendar.prototype.setDay = function (day) {
            this.setDate(this.visibleYear(), this.visibleMonth(), day);
            return this.dateRangePicker.setCustomDate();
        };

        Calendar.prototype.setDate = function (year, month, day) {
            this.date = new Date(year, month - 1, day);
            return this.dateRangePicker.draw();
        };

        Calendar.prototype.draw = function () {
            var day, _i, _len;
            this.$dayHeaders.empty();
            this.$title.text("" + (this.visibleYear()) + "Year" + (this.nameOfMonth(this.visibleMonth())) + " ");
            for (_i = 0, _len = DAYS.length; _i < _len; _i++) {
                day = DAYS[_i];
                this.$dayHeaders.append($("<li>" + (day.substr(0, 2)) + "</li>"));
            }
            this.drawDateDisplay();
            return this.drawDays();
        };

        Calendar.prototype.dateIsSelected = function (date) {
            return date.getTime() === this.date.getTime();
        };

        Calendar.prototype.dateIsInRange = function (date) {
            return date >= this.dateRangePicker.startDate() && date <= this.dateRangePicker.endDate();
        };

        Calendar.prototype.dayClass = function (day, firstDayOfMonth, lastDayOfMonth) {
            var classes, date;
            date = new Date(this.visibleYear(), this.visibleMonth() - 1, day);
            classes = '';
            switch (this.dateRangePicker.CustomerDate()) {
                case CustomerDate.Start:
                    if (this.dateIsSelected(date)) {
                        classes = 'drp-day-selected';
                    } else if (date > this.dateRangePicker.startDate()) {
                        classes += 'drp-day-in-range';
                    }
                    break;
                case CustomerDate.End:
                    if (this.dateIsSelected(date)) {
                        classes = 'drp-day-selected';
                    } else if (date < this.dateRangePicker.endDate()) {
                        classes += 'drp-day-in-range';
                    }
                    break;
                default:
                    if (this.dateIsSelected(date)) {
                        classes = 'drp-day-selected';
                    } else if (this.dateIsInRange(date)) {
                        classes = 'drp-day-in-range';
                        if (date.getTime() === this.dateRangePicker.endDate().getTime()) {
                            classes += ' drp-day-last-in-range';
                        }
                    } else if (this.isStartCalendar) {
                        if (date > this.dateRangePicker.endDate()) {
                            classes += ' drp-day-disabled';
                        }
                    } else if (date < this.dateRangePicker.startDate()) {
                        classes += ' drp-day-disabled';
                    }
                    break;
            }

            if ((day + firstDayOfMonth - 1) % 7 === 0 || day === lastDayOfMonth) {
                classes += ' drp-day-last-in-row';
            }


            return classes;
        };

        Calendar.prototype.drawDays = function () {
            var firstDayOfMonth, i, lastDayOfMonth, self, _i, _j, _ref;
            self = this;
            this.$days.empty();
            firstDayOfMonth = this.firstDayOfMonth(this.visibleMonth(), this.visibleYear());
            lastDayOfMonth = this.daysInMonth(this.visibleMonth(), this.visibleYear());
            for (i = _i = 1, _ref = firstDayOfMonth - 1; _i <= _ref; i = _i += 1) {
                this.$days.append($("<li class='drp-day drp-day-empty'></li>"));
            }
            for (i = _j = 1; _j <= lastDayOfMonth; i = _j += 1) {
                this.$days.append($("<li class='drp-day " + (this.dayClass(i, firstDayOfMonth, lastDayOfMonth)) + "'>" + i + "</li>"));
            }
            return this.$calendar.find('.drp-day').click(function (evt) {
                var day;
                if ($(this).hasClass('drp-day-disabled')) {
                    return false;
                }
                day = parseInt($(this).text(), 10);
                if (isNaN(day)) {
                    return false;
                }
                return self.setDay(day);
            });
        };

        Calendar.prototype.drawDateDisplay = function () {
            return this.$dateDisplay.text([this.year(), this.month(), this.day()].join(this.dateRangePicker.options.separator));
            //return this.$dateDisplay.text([this.month(), this.day(), this.year()].join('/'));
        };

        Calendar.prototype.month = function () {
            return this.date.getMonth() + 1;
        };

        Calendar.prototype.day = function () {
            return this.date.getDate();
        };

        Calendar.prototype.dayOfWeek = function () {
            return this.date.getDay() + 1;
        };

        Calendar.prototype.year = function () {
            return this.date.getFullYear();
        };

        Calendar.prototype.visibleMonth = function () {
            return this._visibleMonth;
        };

        Calendar.prototype.visibleYear = function () {
            return this._visibleYear;
        };

        Calendar.prototype.nameOfMonth = function (month) {
            return MONTHS[month - 1];
        };

        Calendar.prototype.firstDayOfMonth = function (month, year) {
            return new Date(year, month - 1, 1).getDay() + 1;
        };

        Calendar.prototype.daysInMonth = function (month, year) {
            month || (month = this.visibleMonth());
            year || (year = this.visibleYear());
            return new Date(year, month, 0).getDate();
        };

        Calendar.prototype.Disabled = function (disable) {
            if (disable) {
                this.$calendar.find(".mask").show();
            }
            else {
                this.$calendar.find(".mask").hide();
            }
        };

        return Calendar;

    })();


    X.prototype.controls.widget("DateRangePicker", function (controlType) {
        var DateRangePickerWrap = function (elem, options) {
            X.prototype.controls.getControlClazz("BaseControl").call(this, elem, options);
            this.dateRangePicker = new DateRangePicker(elem, options);
        };


        X.prototype.controls.extend(DateRangePickerWrap, "BaseControl");

        DateRangePickerWrap.prototype.val = function (value) {
            return this.dateRangePicker.value(value);
        };

        /**
         @method 获取日期区间控件模板
         @static 类静态方法
         @return 获取日期区间控件模板
         */
        DateRangePickerWrap.getTemplate = function (item) {
            return '<select type="text" placeholder="' + (item["placeholder"] || "") + '" class="default_input w210 fL js-' + item["name"] + '" />';
        };


        /**
         @method init 重置下拉框，设置为-1
         */
        DateRangePickerWrap.prototype.reset = function () {
            this.dateRangePicker.value("0");
        };

        return DateRangePickerWrap;

    });


})(jQuery, this.Xbn);
(function ($, X) {

    X.prototype.controls.widget("HtmlBox", function (controlType) {
        /**
         @class HtmlBox text值
         @constructor 构造函数
         @param elem {DomNode} Dom节点
         @param option {Object} 配置信息
         */
        function HtmlBox(elem, options) {
            this.elem = elem;
            this.option = options;
        }

        X.prototype.controls.extend(HtmlBox, "BaseControl");
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


})(jQuery, this.Xbn);
(function ($, X) {

    X.prototype.controls.widget("List", function (controlType) {
        var BaseControl = X.prototype.controls.getControlClazz("BaseControl");

        var List = function (elem, option) {
            this.elem = elem;
            this.option = X.prototype.clone(option);
        };

        X.prototype.controls.extend(List, "BaseControl");


        List.prototype = $.extend(List.prototype, {
            init: function (data) {

                var that = this;

                if (this.elem) {
                    var $searcher = this.elem.find(".js-searchbox");
                    var $dataGrid = this.elem.find(".js-datagrid");
                    var $pagination = this.elem.find(".js-pagination");
                    var $toolbar = this.elem.find(".js-operation");
                }

                this.searcher = X.prototype.controls.getControl("Searcher", $searcher, this.option.searchMeta);
                this.searcher.init();

                if (this.option && this.option.searchMeta && this.option.searchMeta["search"]) {
                    var onSearch = this.searcher.onSearch;
                    var innerSearch = null;
                    if (onSearch) {
                        innerSearch = function (data, searcher, click) {
                            data = data || {};
                            var queryData = {query: data};
                            queryData.pageSize = that.pagination.pageSize;
                            queryData.pageNo = click ? 1 : that.pagination.pageNo;

                            //获取排序字段后，传入搜索, 由具体业务决定如何使用排序项
                            var orderColumns = that.grid.getReorderColumn();
                            var fields = [], type = [];
                            for (var key in orderColumns) {
                                if (orderColumns.hasOwnProperty(key)) {
                                    fields.push(key);
                                    type.push(orderColumns[key]);
                                }
                            }
                            if (fields.length > 0) {
                                queryData.orderInfo = {fields: fields, type: type};
                            }

                            var result = onSearch(queryData, searcher, click);

                            that.loadData(result);
                        };
                        this.searcher.onSearch = innerSearch;
                    }
                    else {
                        this.searcher.onSearch = function (data, searcher) {
                            data = data || {};
                            data.pageSize = that.pagination.pageSize;
                            data.pageNo = 1;

                            //获取排序字段后，传入搜索, 由具体业务决定如何使用排序项
                            that.loadData(result, searcher);
                        }
                    }
                }

                // if(this.searcher && this.searcher.onReset){
                //     var onReset = this.searcher.onReset;
                //     if(onReset){
                //         this.searcher.onReset = function () {
                //             onReset();

                //         };
                //     }
                // }

                var gridType = (function (type) {
                    if (type === "S") {
                        return "SDataGrid";
                    }
                    else if (type === "C") {
                        return "TDataGrid";
                    }
                    else if(type === "V") {
                        return "DataView";
                    }
                    else{
                        return "DataGrid";   
                    }
                })(this.option.gridMeta.type)

                this.grid = X.prototype.controls.getControl(gridType, $dataGrid.get(0), this.option.gridMeta);
                this.grid.init();


                if (X.prototype.isFunction(this.option.gridMeta.beforeReorder)) {
                    var beforeReorder = this.option.gridMeta.beforeReorder;
                    var innerBeforeReorder = function (grid, column, field, columnIndex) {
                        beforeReorder(grid, column, field, columnIndex);
                        that.searcher.fireSearch();
                    }

                    this.option.gridMeta.beforeReorder = innerBeforeReorder;
                }
                else {
                    this.option.gridMeta.beforeReorder = function (grid, column, field, columnIndex) {
                        beforeReorder(grid, column, field, columnIndex);
                        that.searcher.fireSearch();
                    }
                }


                initPageInfo(this.option);
                this.pagination = X.prototype.controls.getControl("Pagination", $pagination, this.option.pageInfo);

                if (this.option.toolbar && $toolbar.length > 0) {
                    this.toolbar = X.prototype.controls.getControl("Toolbar", $toolbar, this.option.toolbar);
                    this.toolbar.init();
                    this.toolbar.target = this.grid;
                }

                // //默认加载没有过滤项，并且加载第一页
                // if(this.option.defaultValue){
                //     this.searcher.val(this.option.defaultValue);
                //     this.loadData(this.option.defaultValue);
                // }
                // else{
                //     this.searcher.fireSearch();
                // }

                this.searcher.fireSearch();


                function initPageInfo(option) {
                    function bindPageClick(item, index, pageInfo) {
                        var itemclick = option.pageInfo[item];
                        var pageNo = 1;
                        if (itemclick) {
                            option.pageInfo[item] = function () {
                                pageNo = (item === "changePageSize") ? 1 : that.pagination.pageNo;
                                itemclick(item);
                                if (that.condition) {
                                    that.condition.pageNo = pageNo;
                                }
                                that.loadData();
                            }
                        }
                        else {
                            option.pageInfo[item] = function () {
                                pageNo = (item === "changePageSize") ? 1 : that.pagination.pageNo;
                                if (that.condition) {
                                    that.condition.pageNo = pageNo;
                                    that.condition.pageSize = that.pagination.pageSize;
                                }
                                that.loadData();
                            }
                        }
                    }

                    var pageItem = ["clickFirstPage", "clickLastPage", "clickPrePage", "clickNextPage", "clickOtherPage", "changePageSize"];
                    if (option && option.pageInfo) {
                        pageItem.forEach(bindPageClick);
                    }

                    if (that.option.defaultValue) {
                        if (that.option.defaultValue["pageSize"]) {
                            if (option.pageInfo) {
                                option.pageInfo.pageSize = that.option.defaultValue["pageSize"];
                            }
                        }
                        if (that.option.defaultValue["pageNo"]) {
                            if (option.pageInfo) {
                                option.pageInfo.pageNo = that.option.defaultValue["pageNo"];
                            }
                        }
                    }
                }

            },


            loadData: function (condition) {
                this.condition = condition || this.condition;
                var that = this;

                var setData = function (data) {
                    if (data.list && data.page && data.page.hasOwnProperty("pageSize")
                        && data.page.hasOwnProperty("totalCount")
                        && data.page.hasOwnProperty("totalPages")
                        && data.page.hasOwnProperty("pageNo")) {
                        that.pagination.set({
                            pageSize: data.page.pageSize,
                            totalCount: data.page.totalCount,
                            totalPages: data.page.totalPages,
                            pageNo: data.page.pageNo
                        });
                        that.grid.loadData(data.list);
                    }
                    else {
                        //console.log('格式不规范，请格式化为{data:[],page:{pageSize:"",totalCount:"",totalPages:"",pageNo:""}}');
                    }
                };


                var callback = function (result) {

                    var data = result.data;
                    if (that.option.afterDataLoad) {
                        var data = that.option.afterDataLoad(data);
                        setData(data);
                    } else {
                        setData(data);
                    }
                };

                var postData = this.condition;


                //临时模拟数据
                if (this.option.url) {
                    X.prototype.loadData({
                        url: that.option.url,
                        type: that.option.type || "POST",
                        dataType: "JSON",
                        data: postData,
                        callback: function (data) {
                            if (data.statusCode == "2000000") {
                                callback(data);
                            } else {
                                layer.alert(data.message || "");
                            }
                        }
                    });
                }
            },
            val: function (data) {
                if (data) {
                    if (data["searchData"]) {
                        //设置搜索数据
                    }
                    if (data["gridData"]) {
                        //设置DataGrid数据
                    }
                    if (data["pData"]) {
                        //设置
                    }
                }
                else {
                    var svalue = this.searcher.val();
                    var pvalue = this.pagination.get();
                    var dvalue = this.grid.getReorderColumn();
                    return {
                        searchData: svalue,
                        pData: pvalue,
                        gridData: dvalue
                    }
                }
            }

        });

        return List;


    });

})(jQuery, this.Xbn);
(function ($, X) {

    X.prototype.controls.widget("NumberBox", function (controlType) {
        if (!$.browser) {
            $.browser = {};
            $.browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase());
            $.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
            $.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
            $.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
        }
        if (!$.os) {
            $.os = {};
            $.os.macintosh = /macintosh/.test(navigator.userAgent.toLowerCase());
        }
        var self;


        function innerInit($input, settings) {
            // event.stopPropagation()
            // event.preventDefault()
            // return false = event.stopPropagation() + event.preventDefault()
            function handleKeyPress(e, args) {
                var key = e.which || e.charCode || e.keyCode;
                if (key == null) {
                    return false;
                }
                if (key < 46 || key > 57) {
                    e.preventDefault();
                    return true;
                }
                else if (hasReachedMaxLength($input)) {
                    return false;
                }
                else {
                    e.preventDefault();
                    var currentKey = String.fromCharCode(key);
                    var input = $input.get(0);
                    var selection = getInputSelection(input);
                    var startPos = selection.start;
                    var endPos = selection.end;
                    var inputString = input.value.substring(0, startPos) + currentKey + input.value.substring(endPos, input.value.length);
                    var originalLength = inputString.length;
                    // inputString = maskValue(inputString);
                    var newLength = inputString.length;
                    if (checkValue(inputString) && checkValid(inputString)) {
                        input.value = inputString;
                        var cursorPos = startPos + 1 - (originalLength - newLength);
                        setCursorPosition(cursorPos);
                        return false;
                    }
                }
            }

            var timer;
            var imeKey = $.browser.opera ? 197 : 229;

            function handleKeyDown(e, args) {
                var key = e.which || e.charCode || e.keyCode;
                if (key == null) {
                    return false;
                }
                clearInterval(timer);
                if (key == imeKey || $.browser.mozilla && $.os.macintosh) {
                    timer = setInterval(checkTextValue, 50);
                }
            }

            function checkTextValue() {
                var input = $input.get(0);
                var selection = getInputSelection(input);
                var startPos = selection.start;
                var endPos = selection.end;
                var inputString = input.value.substring(0, startPos) + input.value.substring(endPos, input.value.length);
                var originalLength = inputString.length;
                inputString = maskValue(inputString);
                var newLength = inputString.length;
                if (checkValue(inputString) && checkValid(inputString)) {
                    input.value = inputString;
                    var cursorPos = startPos + 1 - (originalLength - newLength);
                    setCursorPosition(cursorPos);
                }
            }

            function checkValue(inputString) {
                var precision = (settings.scale == 0) ? settings.precision : settings.precision + 1;
                if (inputString.length <= precision) {
                    var lMin = false;
                    if (settings.minValue != null) {
                        lMin = parseFloat(inputString) < settings.minValue;
                    }
                    var gMax = false;
                    if (settings.maxValue != null) {
                        gMax = parseFloat(inputString) > settings.maxValue;
                    }
                    return (lMin || gMax) ? false : true;
                }
                else {
                    return false;
                }
            }

            function checkValid(inputString) {
                if (settings.validNumbers != null) {
                    var numbers = settings.validNumbers;
                    if (numbers.length) {
                        var currentNumber = parseFloat(inputString);
                        for (var i = 0; i < numbers.length; i++) {
                            if (numbers[i] == currentNumber) return true;
                        }
                        return false;
                    }
                }
                return true;
            }

            function hasReachedMaxLength(element) {
                var reachedMaxLength = (element.val().length >= settings.maxLength && settings.maxLength >= 0);
                var selection = getInputSelection(element.get(0));
                var start = selection.start;
                var end = selection.end;
                var hasNumberSelected = (selection.start != selection.end && element.val().substring(start, end).match(/\d/)) ? true : false;
                return reachedMaxLength && !hasNumberSelected;
            }

            function handleBlur(e, args) {
                if ($input.val() == "" || $input.val() == getDefaultMask()) {
                    $input.val(getDefaultMask());
                }
                if ($input.change) {
                    $input.change();
                }
            }

            function maskValue(v) {
                var strCheck = "0123456789.";
                var len = v.length;
                var a = "", t = "";
                for (var i = 0; i < len; i++) {
                    if ((v.charAt(i) != "0") && (v.charAt(i) != settings.decimal)) break;
                }
                for (; i < len; i++) {
                    if (strCheck.indexOf(v.charAt(i)) != -1) a += v.charAt(i);
                }
                var n = parseFloat(a);
                n = isNaN(n) ? 0 : n / Math.pow(10, settings.scale);
                t = n.toFixed(settings.scale);
                return t;
            }

            function getDefaultMask() {
                var n = parseFloat("0") / Math.pow(10, settings.scale);
                return n.toFixed(settings.scale);
            }

            function setCursorPosition(pos) {
                $input.each(function (index, elem) {
                    if (elem.setSelectionRange) {
                        elem.focus();
                        elem.setSelectionRange(pos, pos);
                    }
                });
            };

            function getInputSelection(element) {
                var start = 0, end = 0;
                if (typeof element.selectionStart == "number" && typeof element.selectionEnd == "number") {
                    start = element.selectionStart;
                    end = element.selectionEnd;
                }
                return {start: start, end: end};
            }

            function getValueInner() {
                var tempVal = $input.val();
                tempVal = parseFloat(tempVal);
                return tempVal;
            }

            $input.bind("keypress", handleKeyPress);
            $input.bind("keydown", handleKeyDown);
            $input.bind("blur", handleBlur);
            $input.bind("paste", function () {
                return false;
            });

            this.getValue = function () {
                return getValueInner();
            }

            this.setValue = function (val) {
                if (val == null || val == "" || isNaN(val)) val = 0;
                var result = val.toString();
                var temp = result;
                if (temp.indexOf(settings.decimal) != -1) {
                    var array = temp.split(settings.decimal);
                    if (array.length > 1) {
                        var subString = array[1];
                        var len = subString.length;
                        if (len < settings.scale) {
                            for (var i = 0; i < settings.scale - len; i++) {
                                subString += "0";
                            }
                            result = array[0] + settings.decimal + subString;
                        }
                    }
                }
                else {
                    for (var i = 0; i < settings.scale; i++) {
                        result += "0";
                    }
                }
                $input.val(maskValue(result));
            }

            this.on = function (eventName, func, context) {
                if (eventName != "onchange" && eventName != "change")
                    return;
                $input.bind("change", function () {
                    func.call(context);
                });
            }

            this.un = function (eventName) {
                if (eventName != "onchange" && eventName != "change") return;
                $input.unbind("change");
            }
        }

        var _innerInput;

        var control = function (elem, options) {
            self = this;
            var settings = $.extend({
                decimal: ".",
                scale: 0,
                precision: 10
            }, options);

            X.prototype.controls.getControlClazz("BaseControl").call(this, elem, settings);

            if (this.elem.length > 0) {
                _innerInput = new innerInit(this.getElement(), this.options);
            }
        };


        X.prototype.controls.extend(control, "BaseControl");

        control.prototype.init = function () {

        };

        control.prototype.controlType = controlType;

        control.prototype.getValue = function () {
            return _innerInput.getValue();
        };
        control.prototype.setValue = function (val) {
            _innerInput.setValue(val);
        };
        control.prototype.setData = function (data) {
            if (data["precision"] != null && !isNaN(data["precision"])) this.getData("settings").precision = data["precision"];
            if (data["scale"] != null && !isNaN(data["scale"])) this.getData("settings").scale = data["scale"];
            if (data["minValue"] != null && !isNaN(data["minValue"])) this.getData("settings").minValue = data["minValue"];
            if (data["maxValue"] != null && !isNaN(data["maxValue"])) this.getData("settings").maxValue = data["maxValue"];
            for (var attr in data) {
                var attrValue = data[attr];
                if (attr === "value" || attr === "defaultValue") {
                    this.setValue(attrValue);
                }
                else if (attr === "readOnly") {
                    this.setReadOnly(attrValue);
                }
                else if (attr === "nullable") {
                    this.setNullable(attrValue);
                }
            }
        };

        control.prototype.on = function (eventName, func, context) {
            _innerInput.on(eventName, func, context);
        };
        control.prototype.un = function (eventName) {
            _innerInput.un(eventName);
        };


        return control;
    });

})(jQuery, this.Xbn);
(function ($, X) {

    X.prototype.controls.widget("Pagination", function (controlType) {

        /**
         * 页码组件封装
         *
         * @class Pagination
         * @constructor
         * @param {DOM}     elem  [必需]  页码组件要渲染到的dom元素
         * @param {Object}  opt   [必需]  初始化参数
         *     @param {String}    op.id              [可选]     更新数据
         *     @param {String}    op.totalCount      [可选]     总共的条数    [default: 0]
         *     @param {String}    op.pageSize        [可选]     每页显示条数  [default: 10 | > 0]
         *     @param {String}    op.pageNo          [可选]     当前所在页数  [default: 1  | > 1]
         *     @param {String}    op.totalPages      [可选]     总页数       [default: 总共的条数/每页条数]
         *     @param {function}  op.clickFirstPage  [可选]     点击首页的回调方法
         *     @param {function}  op.clickLastPage   [可选]     点击尾页的回调方法
         *     @param {function}  op.clickPrePage    [可选]     点击上一页的回调方法
         *     @param {function}  op.clickNextPage   [可选]     点击下一页的回调方法
         *     @param {function}  op.clickOtherPage  [可选]     点击某一页 或者 输入框输入值且点击确定后的回调方法
         *     @param {function}  op.changePageSize  [可选]     改变每页显示多少条 下拉后的回调方法
         *     @param {Object}    op.smallPapogation [可选]     附属小标题参数对象
         *         @param {Bloolean}  op.isShow [可选]     是否显示附属小标题 true-显示 false-隐藏
         *         @param {DOM}       op.elem [可选]       显示附属小标题的时候，需要被渲染到的dom元素
         */

        function Pagination(elem, opt) {
            // ele
            this.targetElement = elem;
            this.id = opt.id || '';
            // 共 X 条
            this.totalCount = opt.totalCount || '0';
            // 每页显示 X 条  select
            this.pageSize = opt.pageSize || '10';
            // 当前页
            this.pageNo = this.dataFromUrl() || opt.pageNo || '1';
            // 共 X 页
            this.totalPages = opt.totalPages || Math.ceil(this.totalCount / this.pageSize).toString();
            // 用于存放 有用的 element
            this.elementChild = {};
            this.smallPapogation = opt.smallPapogation || {isShow: false};
            // this.smallPapogation = opt.smallPapogation || {isShow: true, elem: $('.small_papogation')};


            // 到 X 页  确定

            // 首页 每页 尾页 到X页 选择每页X条 点击事件
            this.clickFirstPage = opt.clickFirstPage;
            this.clickLastPage = opt.clickLastPage;
            this.clickPrePage = opt.clickPrePage;
            this.clickNextPage = opt.clickNextPage;
            this.clickOtherPage = opt.clickOtherPage;
            this.changePageSize = opt.changePageSize;

            //下拉框数据
            this.dataSource = opt.dataSource;

            this.create();
        }

        // 获得


        Pagination.prototype.get = function () {
            var pageInfo = {
                pageNo: this.pageNo,
                pageSize: this.pageSize
            }
            return pageInfo;
        }
        /**
         * 销毁页码渲染内容，当初传入的DOM元素还存在
         *
         * @method destroy
         */
        Pagination.prototype.destroy = function () {
            this.targetElement.find('ul').remove();
        }

        /**
         * 创建页码的dom元素 及 相应事件绑定
         *
         * @method create
         */
        Pagination.prototype.create = function () {
            var self = this;
            var oUl = $('<ul class="pager"></ul>');
            // 共 X 条
            var firstLi = $('<li class="li-select-page"></li>');
            var oSpan = $('<span class="page_line">'+ "Common" +' </span>');
            var oEm = $('<em>' + this.totalCount+ '</em>');
            this.elementChild.totalCount = oEm;
            oSpan.append(oEm);
            oSpan.append("&nbsp;Item");
            firstLi.append(oSpan);
            firstLi.append('<span>'+ "Per page" +'</span>');
            // 下拉 每页显示 X 条


            var selectLi = $(X.prototype.controls.getControlClazz("ComboBox").getTemplate({name: "changePageSize"}));

            firstLi.append(selectLi);
            selectLi.addClass();

            var cmb = X.prototype.controls.getControl("ComboBox", selectLi, {
                dataSource: self.dataSource || [{key: 10, value: 10}, {key: 20, value: 20}, {key: 30, value: 30}, {key: 50, value: 50}],
                defaultValue: this.pageSize || 10,
                selectedChanged: function (item) {
                    if (self.pageSize != item.key) {
                        self.pageSize = item.key;
                        self.changePageSize(item);
                    }
                }
            });

            //cmb.init();

            this.elementChild.selectPageSize = selectLi;
            firstLi.append("Item");
            oUl.append(firstLi);

            // 首页 按钮
            var oFirstPage = $('<li class="firstPage">'+ "Home page" +'</li>');
            this.elementChild.firstPage = oFirstPage;
            oFirstPage.on('click', $.proxy(this.toFirstPage, this));
            oUl.append(oFirstPage);

            // 上一页 按钮/*0705wfybug350*/
            var oPrePage = $('<li class="none prePage icon-55"></li>');
            this.elementChild.prePage = oPrePage;
            oPrePage.on('click', $.proxy(this.toPrePage, this));
            oUl.append(oPrePage);

            // 具体页码
            this.elementChild.oNumPage = [];
            var oNumPageBox = $('<li class="noneBg"></li>');
            var i = 1;
            var renderLastPages = (Number(this.totalPages) + 1) > 6 ? 6 : (Number(this.totalPages) + 1);
            // 渲染具体页面时用
            this.renderLastPage = renderLastPages;
            this.renderFirstPage = 1;

            if (renderLastPages > 1) {
                for (; i < renderLastPages; i++) {
                    var oNumPage = $('<span data-num="' + i + '">' + i + '</span>');
                    if (i == this.pageNo) {
                        oNumPage.addClass("on");
                    }
                    this.elementChild.oNumPage.push(oNumPage);
                    oNumPageBox.append(oNumPage);
                }
            } else {
                var oNumPage = $('<span data-num="1">1</span>');
                this.elementChild.oNumPage.push(oNumPage);
                oNumPageBox.append(oNumPage);
            }
            this.elementChild.numPageBox = oNumPageBox;
            //this.elementChild.oNumPage[this.pageNo].addClass('on');
            oNumPageBox.on('click', $.proxy(this.clickPage, this));
            oUl.append(oNumPageBox);

            // 下一页 按钮/*0705wfybug350*/
            var oNextPage = $('<li class="nextPage icon-56"></li>');
            this.elementChild.nextPage = oNextPage;
            oNextPage.on('click', $.proxy(this.toNextPage, this));
            oUl.append(oNextPage);

            // 尾页 按钮
            var oLastPage = $('<li class="lastPage">'+ "Last page" +'</li>');
            this.elementChild.lastPage = oLastPage;
            oLastPage.on('click', $.proxy(this.toLastPage, this));
            oUl.append(oLastPage);

            // 页码状态 input
            var oStateLi = $('<li class="li-select-page"></li>');
            oStateLi.append("Common &nbsp;");
            var oState = $('<span>' + this.pageNo + ' / ' + this.totalPages + '</span>');
            this.elementChild.state = oState;
            oStateLi.append(oState);
            oStateLi.append("&nbsp;Page");
            //oStateLi.append(' 页 到第');
            var oPageInput = $('<input class="toPageInput" type="text">');
            this.elementChild.pageInput = oPageInput;
            //oStateLi.append(oPageInput);
            //oStateLi.append('<span>页</span>');
            oUl.append(oStateLi);
            // 确认按钮
            var oConfirmBtn = $('<li class="toPage">'+ "Sure" +'</li>');
            this.elementChild.confirmBtn = oConfirmBtn;
            oConfirmBtn.on('click', $.proxy(this.toOtherPage, this));
            //oUl.append(oConfirmBtn);

            this.targetElement.html('').append(oUl);

            if (this.smallPapogation.isShow) {
                // 显示小页码
                var oFragment = document.createDocumentFragment();
                this.smallPapogation.elem = X.prototype.isString(this.smallPapogation.elem)
                    ? $(this.smallPapogation.elem)
                    : this.smallPapogation.elem;
                this.smallPapogation.elem.html('');
                // smallPrePage
                var oListprev = $('<em class="xbn_ico listprev"></em>');
                this.elementChild.smallPrePage = oListprev;
                oListprev.on('click', $.proxy(this.toPrePage, this));
                oFragment.appendChild(oListprev[0]);
                // smallState
                var oSmallState = $('<span><i class="">' + this.pageNo + '</i> / ' + this.totalPages + '</span>');
                this.elementChild.smallState = oSmallState;
                oFragment.appendChild(oSmallState[0]);
                // smallNextPage
                // var oListnext = $('<em class="se_ico listnext"></em>');
                // // oListnext.on('click', $.proxy(this.toNextPage, this));
                // oListnext.on('click', this.toNextPage);
                // oFragment.appendChild(oListnext[0]);

                // smallNextPage
                var oListnext = $('<em class="xbn_ico listnext"></em>');
                this.elementChild.smallNextPage = oListnext;
                oListnext.on('click', $.proxy(this.toNextPage, this));
                oFragment.appendChild(oListnext[0]);

                this.smallPapogation.elem.append(oFragment);
            } else {

            }
            // listprev
        }

        //
        // 点击 具体页码
        //  - 不管在多少页，都只显示5个可点击页
        // @method reRender
        Pagination.prototype.clickPage = function (event) {
            var _target = $(event.target);
            if (_target[0].nodeName === 'SPAN') {
                var newPageNo = _target.attr('data-num');
                this.toOtherPage(newPageNo);
            }
        },
        /**
         * 重新渲染具体页码的显示
         *  - 不管在多少页，都只显示5个可点击页
         * @method reRender
         */
            Pagination.prototype.reRender = function () {
                if (this.totalPages == '0') {
                    this.targetElement.hide();
                    if (this.smallPapogation.isShow) {
                        this.smallPapogation.elem.hide();
                    }
                } else {
                    var newRenderFirstPage = this.totalPages === '0' ? 1
                        : Number(this.pageNo) + 2 >= this.totalPages
                        ? (this.totalPages - 4 > 0
                        ? this.totalPages - 4
                        : 1)

                        : (this.pageNo - 2 > 0
                        ? this.pageNo - 2
                        : 1);
                    var newRenderLastPage = this.totalPages === '0' ? 1
                        : Number(this.pageNo) + 2 > this.totalPages
                        ? this.totalPages
                        : (Number(this.pageNo) + 2 - newRenderFirstPage > 5
                        ? Number(this.pageNo) + 2
                        : (newRenderFirstPage + 4 < this.totalPages ? newRenderFirstPage + 4 : this.totalPages));
                    // clickLi
                    var i = 0;
                    if (Number(this.renderLastPage) === Number(newRenderLastPage)
                        && Number(this.renderFirstPage) === Number(newRenderFirstPage)) {
                        var arrNumPages = this.elementChild.oNumPage;
                        for (; i < arrNumPages.length; i++) {
                            $(arrNumPages[i]).removeClass('on');
                        }
                        $(arrNumPages[this.pageNo - this.renderFirstPage]).addClass('on');
                    } else {
                        this.elementChild.oNumPage = [];
                        this.renderFirstPage = newRenderFirstPage;
                        this.renderLastPage = newRenderLastPage;
                        this.elementChild.numPageBox.html('');
                        var pFragment = document.createDocumentFragment();
                        for (i = newRenderFirstPage; i <= newRenderLastPage; i++) {
                            var oNumPage = $('<span data-num="' + i + '">' + i + '</span>');
                            this.elementChild.oNumPage.push(oNumPage);
                            pFragment.appendChild(oNumPage[0]);
                        }
                        this.elementChild.numPageBox.append(pFragment);
                    }
                    this.elementChild.oNumPage[this.pageNo - this.renderFirstPage]
                    && this.elementChild.oNumPage[this.pageNo - this.renderFirstPage].addClass('on');
                    // state
                    this.elementChild.state.html(this.pageNo + '/' + this.totalPages);
                    // smallState
                    this.elementChild.smallState && this.elementChild.smallState.html('<i class="">' + this.pageNo + '</i> / ' + this.totalPages);
                    // pageInput
                    this.elementChild.pageInput.val('');
                    // totalCount
                    this.elementChild.totalCount.html(this.totalCount);

                    this.targetElement.show();
                    if (this.smallPapogation.isShow) {
                        this.smallPapogation.elem.show();
                    }

                    if (this.pageNo === '1') {
                        this.elementChild.firstPage.addClass('disable');
                        this.elementChild.prePage.addClass('disable');
                        // this.elementChild.smallPrePage.addClass('disable');

                    } else {
                        this.elementChild.firstPage.removeClass('disable');
                        this.elementChild.prePage.removeClass('disable');
                        // this.elementChild.smallPrePage.removeClass('disable');
                    }
                    if (this.pageNo === this.totalPages) {
                        this.elementChild.lastPage.addClass('disable');
                        this.elementChild.nextPage.addClass('disable');
                        // this.elementChild.smallNextPage.addClass('disable');
                    } else {
                        this.elementChild.lastPage.removeClass('disable');
                        this.elementChild.nextPage.removeClass('disable');
                        // this.elementChild.smallNextPage.removeClass('disable');
                    }
                }

                this.addRouterPagination()
            }

        /**
         * 到首页
         *
         * @method toFirstPage
         */
        Pagination.prototype.toFirstPage = function () {
            if (this.pageNo != '1') {
                this.set({
                    pageNo: '1'
                });
            } else {
                return;
            }
            this.clickFirstPage && this.clickFirstPage();
        }

        /**
         * 到尾页
         *
         * @method toLastPage
         */
        Pagination.prototype.toLastPage = function () {
            if (this.pageNo != this.totalPages) {
                this.set({
                    pageNo: this.totalPages
                });
            } else {
                return;
            }
            this.clickLastPage && this.clickLastPage();
        }

        /**
         * 到上一页
         *
         * @method toPrePage
         */
        Pagination.prototype.toPrePage = function () {
            if (this.pageNo > 1) {
                this.set({
                    pageNo: Number(this.pageNo) - 1
                });
            } else {
                return;
            }
            this.clickPrePage && this.clickPrePage();
        }

        /**
         * 到下一页
         *
         * @method toNextPage
         */
        Pagination.prototype.toNextPage = function () {
            if (this.pageNo > 0 && Number(this.pageNo) < this.totalPages) {
                this.set({
                    pageNo: Number(this.pageNo) + 1
                });
            } else {
                return;
            }
            this.clickNextPage && this.clickNextPage();
        }

        /**
         * 到 X 页
         * @param {String}  page  [必需]
         * @method toOtherPage
         */
        Pagination.prototype.toOtherPage = function (page) {
            if (!X.prototype.isString(page)) {
                page = this.elementChild.pageInput.val();
                if (!Number(page)) {
                    return;
                }
            }
            if (this.pageNo != page && page > 0 && page <= Number(this.totalPages)) {
                var isInteger = function (obj) {
                    return obj % 1 === 0;
                };
                if (isInteger(page) == true) {
                    this.set({
                        pageNo: page
                    });
                }
                ;
            } else {
                return;
            }
            this.clickOtherPage && this.clickOtherPage();
        };

        /**
         * 设置 更新具体数据
         * @param {Obejct}  _opt  [必需]
         *     @param {String}    _opt.pageNo  [可选]  重置当前所在页数
         *     @param {String}    _opt.pageSize  [可选]  重置每页显示条数
         *     @param {String}    _opt.totalCount  [可选]  重置总共的条数
         *     @param {String}    _opt.totalPages  [可选]  重置总页数
         * @method set
         */
        Pagination.prototype.set = function (_opt) {
            if (_opt.pageNo) {
                this.pageNo = _opt.pageNo;
            }
            if (_opt.pageSize) {
                this.pageSize = _opt.pageSize;
            }
            if (_opt.totalCount != undefined) {
                this.totalCount = _opt.totalCount;
            }
            if (_opt.totalPages != undefined) {
                this.totalPages = _opt.totalPages;
            }

            this.reRender();
        }

        Pagination.prototype.addRouterPagination = function () {
            var search = location.search.split('&')[0]
            history.pushState(null, '', location.pathname + search + '&p=' + this.pageNo)
        }

        Pagination.prototype.dataFromUrl = function() {
            var search = location.search.split('&')[1],
                pageNo = null

            if (search) {
                pageNo = search.replace('p=', '')
            }

            return pageNo
        }

        return Pagination;

    });

})(jQuery, this.Xbn);
(function ($, X) {

    X.prototype.controls.widget("RadioBox", function (controlType) {

        var BaseControl = X.prototype.controls.getControlClazz("BaseControl");

        /**
         @class RadioBox 单选框
         @constructor 构造函数
         @param elem {DomNode} Dom节点
         @param option {Object} 配置信息
         */
        function RadioBox(elem, options) {
            BaseControl.call(this, elem, options);
            var that = this;
            elem.find("label").click(function () {
                if (that.options && X.prototype.isFunction(that.options.selectedChanged)) {
                    that.options.selectedChanged($(this).siblings("input").val());
                }
            });
        }


        X.prototype.controls.extend(RadioBox, "BaseControl");
        RadioBox.prototype.constructor = RadioBox;


        /**
         @method init 获取单选框的值
         @param value {string} 获取单选框选中值
         */
        RadioBox.prototype.getValue = function () {
            return this.elem.find("input[type='radio']:checked").val();
        };

        /**
         @method init 设置单选框的值
         @param value {string} 设置单选框选中值
         */
        RadioBox.prototype.setValue = function (value) {
            this.elem.find("input[value='" + value + "']").attr("checked", "checked");
        };

        /**
         @method init 重置单选框，设置为false
         */
        RadioBox.prototype.reset = function () {
            this.setValue("0");
        };

        return RadioBox;
    });


})(jQuery, this.Xbn);
(function ($, X) {

    X.prototype.controls.widget("Searcher", function (controlType) {
        /**
         @class Searcher 搜索组件，是多个控件的集合
         @constructor 构造函数
         @param elem {jQuery对象},作为搜索要操作的Dom
         @param options {Object}  options["search"] : {"title":"搜索标题","onSearch":"回调方法"}
         @param options {Object}  options["reset"] : {"title":"重置标题，","show":"是否显示"}
         @param options {Object}  options["switch"] : {"title1":"高级标题","title2":"精简标题"}
         */
        function Searcher(elem, options) {
            this.elem = elem;
            this.options = options || {};
            this.schema = this.options.schema || {};
            this.schema.simple = this.schema.simple || [];
            this.schema.senior = this.schema.senior || [];

            //保存所有创建的子控件
            this.controls = {};

            this.options = initOptions(this.options);

            this.onSearch = this.options["search"] && this.options["search"]["onSearch"];

            this.onReset = this.options["reset"] && this.options["reset"]["onReset"];

            this.onSwich = this.options["switch"] && this.options["switch"]["onSwitch"];

            function initOptions(options) {
                var defaultOption = {
                    "search": {"title": "Search"},
                    "reset": {
                        "title": "Reset", "show": true, "onReset": function () {
                        }
                    },
                    "switch": {"title1": "Senior", "title2": "Streamline"}
                };

                return $.extend(true, defaultOption, options);
            }
        }


        X.prototype.controls.extend(Searcher, "BaseControl");

        /**
         @method init 初始化搜索框
         */
        Searcher.prototype.init = function () {
            if (!this.schema) {
                return;
            }

            var that = this;

            var html = this.getHtml();

            this.elem.html(html);

            initSchema(this.schema);

            bindEvent();

            initState();

            setDefaulValue(this, this.options);

            function setDefaulValue(self, options) {
                if (options.defaultValue) {
                    try {
                        self.val(options.defaultValue);
                    }
                    catch (e) {
                        //console.log("搜索条件数据错误");
                    }
                }
            }

            function initSchema(schema) {
                var i = 0, il = 0;
                if (schema.simple && $.isArray(schema.simple)) {
                    for (i = 0, il = schema.simple.length; i < il; i++) {
                        initControl(that, schema.simple[i]);
                    }
                }

                if (schema.senior && $.isArray(schema.senior) && schema.senior.length > 0) {
                    for (i = 0, il = schema.senior.length; i < il; i++) {
                        initControl(that, schema.senior[i]);
                    }
                }
            }

            function initControl(self, item) {
                if (!item) return;
                var name = item["name"];
                var elem = self.elem.find(".js-" + item["name"]);
                var ctrl = X.prototype.controls.getControl(item["ctrlType"], elem, item);

                if (ctrl) {
                    self.controls[name] = ctrl;
                    //ctrl.init(item);
                }
            }

            function bindEvent() {


                var binding = [{
                    selector: ".js-search",
                    type: "click",
                    fun: function (event) {
                        that.fireSearch(true);
                    }
                },
                    {
                        selector: "input",
                        type: "keyup",
                        fun: function (e) {
                            var e = e || event;
                            if (e.keyCode == 13) {
                                that.fireSearch(true);
                            }
                        }
                    },
                    {
                        selector: ".js-switch",
                        type: "click",
                        fun: function () {
                            that.switchState("slow");
                            if (X.prototype.isFunction(that.onSwich)) {
                                that.onSwich(that);
                            }
                        }
                    },
                    {
                        selector: ".js-reset",
                        type: "click",
                        fun: function () {
                            that.reset();
                            if (X.prototype.isFunction(that.onReset)) {
                                that.onReset();
                            }
                        }
                    }
                ];

                for (var i = 0, il = binding.length; i < il; i++) {
                    var item = binding[i];
                    that.elem.find(item["selector"]).on(item["type"], item["fun"]);
                }
            }

            function initState() {
                if (that.options.defaultValue && that.options.defaultValue["__senior__"]) {
                    that.elem.data("simpleOrSenior", "simple");
                }
                else {
                    that.elem.data("simpleOrSenior", "senior");
                }
                that.switchState();
            }

        };


        Searcher.prototype.switchState = function (speed) {
            var options = this.options;
            var state = this.elem.data("simpleOrSenior") || "simple";
            var target = this.elem.find(".js-switch");
            if (state === "simple") {
                speed ? this.elem.find(".js-seniorContainer").stop().show(speed) : this.elem.find(".js-seniorContainer").stop().show();
                this.elem.data("simpleOrSenior", "senior");
                target.find("span").text(options["switch"]["title2"]);
                target.find("em").addClass("icon-96");
            }
            else {
                speed ? this.elem.find(".js-seniorContainer").stop().hide(speed) : this.elem.find(".js-seniorContainer").stop().hide();
                this.elem.data("simpleOrSenior", "simple");
                target.find("span").text(options["switch"]["title1"]);
                target.find("em").removeClass("icon-96");
            }
        }


        /**
         @method reset 清空搜索框
         */
        Searcher.prototype.reset = function () {
            if (!this.schema) return;
            var that = this;

            function setFieldValue(item, index, schema) {
                var fieldName = item["name"];
                var ctrl = that.controls[fieldName];
                if (ctrl) {
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
            if (!this.schema) return;
            var that = this;

            function setFieldValue(item, index, schema) {
                var fieldName = item["name"];
                if (data[fieldName] != undefined) {
                    var fieldName = item["name"];
                    var ctrlType = item["ctrlType"];
                    var ctrl = that.controls[fieldName];
                    ctrl.val(data[fieldName]);
                }
            }


            this.schema.simple.forEach(setFieldValue);

            this.schema.senior.forEach(setFieldValue);
            if (data["__senior__"] == true) {
                this.elem.data("simpleOrSenior", "simple");
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
            if (!schema) {
                return;
            }
            var data = [];

            var getValue = function (item, itemIndex, schema) {
                var ctrlType = item["ctrlType"];
                var name = item["name"];

                var ctrl = that.controls[name];
                if (ctrl) {
                    var value = ctrl.val();
                    if (value) {
                        return {
                            name: item["name"],
                            value: value,
                            ctrlType: ctrlType
                        }
                    }
                    else {
                        return null;
                    }
                }
            };

            schema.simple.forEach(function (item, itemIndex, schema) {
                var result = getValue(item, itemIndex, schema);
                if (result) {
                    data.push(result);
                }
            });

            var state = that.elem.data("simpleOrSenior");
            if ("senior" === state) {
                schema.senior.forEach(function (item, itemIndex, schema) {
                    var result = getValue(item, itemIndex, schema);
                    if (result) {
                        data.push(result);
                    }
                });

                data.push({name: "__senior__", value: true});
            }

            return data;
        };

        Searcher.prototype.formatValue = function (data) {
            var result = {};
            if (data) {

                for (var i = 0; i < data.length; i++) {
                    result[data[i].name] = data[i].value;
                }
            }

            return result;
        };


        Searcher.prototype.val = function () {
            if (arguments.length > 0) {
                this.setValue(arguments[0]);
            }
            else {
                return this.formatValue(this.collectValue());
            }
        }

        /**
         @method fireSearch 触发搜索
         */
        Searcher.prototype.fireSearch = function (click, refresh) {

            var data = this.collectValue();
            if (refresh) {
                this._oldData = data;
                data = this.formatValue(data);
                if (this.onSearch) {
                    this.onSearch(data, this, click);
                }
            }
            else {
                if (JSON.stringify(data) != JSON.stringify(this._oldData)) {
                    this._oldData = data;
                    data = this.formatValue(data);
                    if (this.onSearch) {
                        this.onSearch(data, this, click);
                    }
                }
            }
        };

        /**
         @method getFieldHtml 获取单个控件html
         @return 返回单个控件在组件中的html
         */
        Searcher.prototype.getFieldHtml = function (item) {
            var ctrl = X.prototype.controls.getControlClazz(item["ctrlType"]);
            var ctrlHtml = ctrl.getTemplate(item);
            if (item["className"]) {
                ctrlHtml = $(ctrlHtml).addClass(className).prop("outerHTML");
            }

            var html = '<dl class="screen_box fL"><dt>' + item["title"] + '：</dt>';
            html += "<dd>" + ctrlHtml + "<dd></dl>";
            return html;
        };

        /**
         @method getHtml 获取搜索组件html
         @return 搜索组件html
         */
        Searcher.prototype.getHtml = function (schema, options) {
            schema = schema || this.schema;
            options = options || this.options;
            var html = "", simpleHtml = "", seniorHtml = "", opHtml = "";
            var i, il;
            if (schema.simple && $.isArray(schema.simple)) {
                simpleHtml = '<div class="screen_search_main fix">';
                for (i = 0, il = schema.simple.length; i < il; i++) {
                    simpleHtml += this.getFieldHtml(schema.simple[i]);
                }

                opHtml += '<div class="screen_box search_main fL"><dt><input type="button" class="default_button  fL js-search" value="' + options.search["title"] + '">';


                if (options["reset"]["show"]) {
                    //重置reset
                    opHtml += '<input type="button" class="reset_button ml30 js-reset" value="'+ "Reset" +'"><dt></dl>';
                }


                if (schema.senior && $.isArray(schema.senior) && schema.senior.length > 0) {
                    //若有高级搜索，则其后增加切换（精简/高级的）switchButton.
                    opHtml += '<a href="javascript:;" class="screen_search js-switch"><span>' + options.switchButton["title1"] + '</span><em class="icon-95"></em></a>';
                }

                opHtml += "</div>";

                simpleHtml += opHtml;

                simpleHtml += "</div>";
            }


            //高级搜索
            if (schema.senior && $.isArray(schema.senior)) {
                seniorHtml = "<div class='js-seniorContainer'>";
                for (i = 0, il = schema.senior.length; i < il; i++) {
                    seniorHtml += this.getFieldHtml(schema.senior[i]);
                }
                seniorHtml += "</div>";
            }


            html = Searcher.getTemplate(simpleHtml, seniorHtml);

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
        Searcher.getTemplate = function (simpleHtml, seniorHtml) {
            var html = "<div class='js-searchContainer screen_search_main fix'>";
            html += simpleHtml;
            html += seniorHtml;
            html += "</div>";

            return html;
        }

        return Searcher;

    });

})(jQuery, this.Xbn);
(function ($, X) {

    X.prototype.controls.widget("SwitchButton", function (controlType) {

        var BaseControl = X.prototype.controls.getControlClazz("BaseControl");

        /**
         @class SwitchButton 状态框
         @constructor 构造函数
         @param elem {DomNode} Dom节点
         @param option {Object} 配置信息
         */
        function SwitchButton(elem, options) {
            BaseControl.call(this, elem, options);
            var that = this;
            this.elem.find("label").on("click", function () {
                var input = that.elem.find("input");
                if (input.val() == 1) {
                    input.val(0);
                    that.elem.find(".checkboxOne").removeClass("disabled");
                    that.elem.find("span").eq(0).addClass("open").siblings("span").removeClass("open");
                } else {
                    input.val(1);
                    that.elem.find(".checkboxOne").addClass("disabled");
                    that.elem.find("span").eq(1).addClass("open").siblings("span").removeClass("open");
                }
                if (X.prototype.isFunction(that.options.selectedChanged)) {
                    that.options.selectedChanged(input.val());
                }
            });
        }


        X.prototype.controls.extend(SwitchButton, "BaseControl");
        SwitchButton.prototype.constructor = SwitchButton;

        /**
         @method init 获取状态框的值
         @param value {string} 获取状态框选中值
         */
        SwitchButton.prototype.getValue = function () {
            return this.elem.find("input").val();
        };

        /**
         @method init 设置状态框的值
         @param value {string} 设置状态框选中值
         */
        SwitchButton.prototype.setValue = function (value) {
            this.elem.find("input").val(value);
            if (value == 1) {
                this.elem.find(".checkboxOne").addClass("disabled");
                this.elem.find("input").attr("checked", "checked");
                this.elem.find("span").eq(1).addClass("open");
            }
            else {
                this.elem.find(".checkboxOne").removeClass("disabled");
                this.elem.find("span").eq(0).addClass("open");
            }
        };

        /**
         @method init 重置状态框框，设置为1
         */
        SwitchButton.prototype.reset = function () {
            this.setValue("1");
        };

        return SwitchButton;
    });


})(jQuery, this.Xbn);
(function ($,X) { 

X.prototype.controls.widget("TabDataGrid",function (controlType) {


    var BaseControl = X.prototype.controls.getControlClazz("BaseControl");


    /**
    @class TabDataGrid 切换数据表格
    @constructor 构造函数
    @param elem {DomNode} Dom节点
    @param option {Object} 配置信息
    */
    function TabDataGrid(elem,options) {
        BaseControl.call(this, elem, options);

        this.setDataSource();
    }


    /**
    @method 获取切换数据表格控件tab按钮模板
    @static 类静态方法
    @return 获取切换数据表格控件tab按钮模板
    */
    TabDataGrid.getTabTemplate = function (item) {
        var html = '<li tabChangeInfo="' + item.createTime + '">' + item.createTime + '</li>';

        return html;
    };

    /**
     @method 获取切换数据表格控件数据表格模板
     @static 类静态方法
     @return 获取切换数据表格控件数据表格模板
     */
    TabDataGrid.getDataGridTemplate = function (item) {
        var html = '<div class="listWrap mb100">';
            html+=      '<p><span class="col66">变更时间：</span><span class="changeDate">'+ item.createTime+'</span></p>';
            html+=      '<p class="mt10"><span class="f14">变更公告</span><span class="col66">（<span style="color:red">注：</span>主要变更内容：<span class="changeMainContent">'+ item.comment+'</span>）</span></p>';
            html+=      '<div class="table_main js-datagrid"></div>';
            html+= '</div>';

        return html;
    };

    X.prototype.controls.extend(TabDataGrid,"BaseControl");
    TabDataGrid.prototype.constructor = TabDataGrid;

    /**
     @method getHtml 获取组合切换数据表格组件html
     @param ds {Array} 数据源
     @return 组合切换数据表格组件html
     */
    TabDataGrid.prototype.getHtml = function (ds) {
        var item,html = "";
        var that = this;

        var tabHtml = function (ds){
            var tabHtmls =  TabDataGrid.getTabTemplate(ds);
            return  tabHtmls;
        };

        var contentDiv = [];


        html = '<div class="js_tabPannel1">';
        html +=   '<div class="tab_btn fl changeTime mt40 mb100">';
        html +=      '<div class="col66 bgcFf"><p>变更时间</p><p>CHANGE TIME</p></div>';
        html +=      '<ul class="fix">';
        for (var i = 0, il = ds.data.length; i < il; i++) {
            html += tabHtml(ds.data[i]);
            contentDiv.push("<div></div>");
        }
        html +=      '</ul>';
        html +=   '</div>';
        html += '<div class="tab_content js-tabContent fl ml40 mt40 w80p">';
        html += contentDiv.join("");
        html += '</div></div>';

        return html;
    };


    /**
     @method setDataSource 设置切换列表
     @param dataSource {Object} 数据表格数据源配置，从服务器获取
     */
    TabDataGrid.prototype.setDataSource = function (dataSource) {
        var that = this;
        var $wrapTabDataGrid = that.elem.find(".js-wrapTabDataGrid");
        $wrapTabDataGrid.empty();
        var ds = dataSource || this.options.dataSource;
        var html = "";
        if (ds.data.length > 0) {
            html = this.getHtml(ds);
            var tabPanel = $(html);
            $wrapTabDataGrid.append(tabPanel);

            var header;
            function initTabPage($elem,tabPage) {
                for (var i = 0, il = ds.data.length; i < il; i++) {
                    if(tabPage == ds.data[i].createTime){
                        if(that.options.getHeaderF){
                            header = that.options.getHeaderF();
                        }

                        var content =$(TabDataGrid.getDataGridTemplate(ds.data[i]));

                        var grid =  X.prototype.controls.getControl("DataGrid",content.find(".js-datagrid").get(0),{columns:header["tenderHistoryItemList"],afterRowRender: function (row, data,index) {
                            $(row.dom).find("td").first().html(index+1);
                        }});
                        grid.init();
                        grid.loadData(ds.data[i].tenderHistoryItemList);
                        $elem.append(content);
                    }
                }

            }
            var activeTabInfo;
            var tp =  X.prototype.controls.getControl("TabPanel",tabPanel, {
                beforeChangeTab: function (tabLiInfo, targetLi, index, tabPage) {
                    activeTabLiInfo = tabLiInfo;
                    // 刊登状态 不同
                    var page = $(tabPage);
                    if(!page.data("hasInited")){
                        initTabPage(page,tabLiInfo);
                        page.data("hasInited",true);
                    }
                    // 为了样式效果，把当前选中的前一个加上样式名
                    targetLi.prev().removeClass('tab_lineNone');
                    return true;
                },
                afterChangeTab: function (tabLiInfo, targetLi, index, tabPage,oldTab) {
                    activeTabLiInfo = tabLiInfo;
                    activeTabLi = targetLi;
                    // 为了样式效果，把当前选中的前一个加上样式名
                    targetLi.prev().addClass('tab_lineNone');
                    if(tabLiInfo!=oldTab){
                        //route.setRoute({panel:tabLiInfo});
                    }
                }
            });

        }
    };

    return TabDataGrid;
});


})(jQuery,this.Xbn);
(function ($, X) {

    X.prototype.controls.widget("TabPanel", function (controlType) {

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
            BaseControl.call(this, elem, opt);

            this.targetElement = elem;
            this.changeType = opt.changeType === 'hover' ? 'mouseenter' : 'click';
            this.beforeChangeTab = opt.beforeChangeTab;
            this.afterChangeTab = opt.afterChangeTab;
            this.activeTabInfo = opt.activeTabInfo;
            this.tabBind();
        }

        X.prototype.controls.extend(TabPannel, "BaseControl");

        TabPannel.prototype.tabBind = function () {
            //功能，给选项卡组件的标题部分绑定事件
            var oUl = this.elem.find('.js-tab_btn>ul', this.targetElement)[0];
            var oLis = this.elem.find('li', oUl);
            for (var i = 0; i < oLis.length; i++) {
                $(oLis[i]).on(this.changeType, this.clickTabFn.call(this, $(oLis[i])));
            }
            var activeLi
                = ((this.activeTabInfo === '' || !this.activeTabInfo) ? false : $('[tabChangeInfo="' + this.activeTabInfo + '"]', this.targetElement))
                || (($('.js-tab_btn>ul>li[class="active"]', this.targetElement).length > 0) ? ($('.tab_btn>ul>li[class="active"]', this.targetElement)) : $('.tab_btn>ul>li', this.targetElement).first());
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
                beforeResoult = this.beforeChangeTab($(oli).attr('tabChangeInfo'), oli, index, oDivs[index], oldTab);
            } else {
                beforeResoult = true;
            }
            if (beforeResoult) {
                for (var i = 0; i < oLis.length; i++) {
                    $(oLis[i]).removeClass("active")
                    oDivs[i].style.display = "none";
                }
                $(oLis[index]).addClass("active");
                oDivs[index].style.display = "";
                this.activeTabInfo = $(oLis[index]).attr("tabChangeInfo");
            }
            if (this.afterChangeTab) {
                this.afterChangeTab($(oli).attr('tabChangeInfo'), oli, index, oDivs[index], oldTab);
            }
        };

        TabPannel.prototype.getPanels = function () {
            var panles = [];

            this.elem.find("[tabChangeInfo]").each(function (index, elem) {
                panles.push($(this).attr("tabChangeInfo"));
            });

            return panles;
        };

        TabPannel.prototype.getActivePanel = function () {
            return this.activeTabInfo;
        };

        TabPannel.prototype.indexOf = function (tabInfo) {
            var result = 0;
            this.elem.find("[tabChangeInfo]").each(function (index, elem) {
                if ($(this).attr("tabChangeInfo") == tabInfo) {
                    result = index;
                }
            });

            return result;
        };

        return TabPannel;

    });

})(jQuery, this.Xbn);
(function ($, X) {

    X.prototype.controls.widget("TextBox", function (controlType) {
        /**
         @class TextBox 文本框
         @constructor 构造函数
         @param elem {DomNode} Dom节点
         @param option {Object} 配置信息
         */
        function TextBox(elem, options) {
            this.elem = elem;
            this.option = options;
            if (this.option && this.option.money) {
                this.setMoney();
            }
            if (this.option["maxLength"]) {
                this.elem.attr("maxlength", this.option["maxLength"])
            }
        }


        /**
         @method 获取文本框控件模板
         @static 类静态方法
         @return 获取文本框控件模板
         */
        TextBox.getTemplate = function (item) {
            return '<input type="text" placeholder="' + (item["placeholder"] || "") + '" class="default_input w250 fL js-' + item["name"] + '" >';
        };


        X.prototype.controls.extend(TextBox, "BaseControl");
        TextBox.prototype.constructor = TextBox;

        /**
         @method init 重置文本框，设置为false
         */
        TextBox.prototype.reset = function () {
            this.setValue("");
        };

        /*
         @method setMoney 设置文本框，只能输入金额
         */
        TextBox.prototype.setMoney = function () {
            //千分位处理函数
            var departNum = function (textVal, the_other) {
                var the_array = [];
                var i = 0;
                the_array.push(textVal.slice(textVal.length - 2, textVal.length));
                for (i = textVal.length - 5; i >= 0; i -= 3) {
                    the_array.push(textVal.slice(i, i + 3));
                }
                if (0 - i < 3) {
                    the_array.push(textVal.slice(0, 3 + i));
                }
                for (var k = the_array.length - 1; k >= 0; k--) {
                    the_other.push(the_array[k]);
                }
            }
            //输入限制
            this.elem.keypress(function (event) {
                    var current = $(this).val();
                    if (event.keyCode && (event.keyCode < 45 || (event.keyCode > 45 && event.keyCode < 48) || event.keyCode > 57)) {
                        if (event.keyCode == 46 && !/\./.test(current)) {
                            if (!isNaN(parseInt($(this).val().replace(/,/, "")))) {
                                $(this).val(current + ".");
                            } else {
                                $(this).val($(this).val() + "0.");
                            }
                        }
                        event.preventDefault();
                    } else {
                        if (event.keyCode == 45 && /-/.test(current)) {
                            event.preventDefault();
                        }
                        else if (event.keyCode != 45) {
                            if (!/\./.test(current)) {
                                var the_new = $(this).val().replace(/,/g, "");
                                var theArray = [];
                                var theFlag = "";
                                if (/-/.test(current)) {
                                    theFlag = the_new.slice(0, 1);
                                    the_new = the_new.slice(1);
                                }
                                if (parseInt(the_new) >= 100) {
                                    departNum(the_new, theArray);
                                    $(this).val(theFlag + theArray.join(","));
                                }
                            }
                        }
                    }
                })
                .keyup(function (event) {
                    if (event.keyCode == 109 && $(this).val().slice(0, 1) != "-") {
                        var the_Real = $(this).val();
                        $(this).val(the_Real.replace(/-/, ""));
                    }
                })
                .blur(function () {
                    var the_Val = $(this).val().replace(/,/g, "");
                    if (!isNaN(parseFloat(the_Val))) {
                        if (!/\./.test(the_Val)) {
                            var theArray = [];
                            var theFlag = "";
                            var the_one = the_Val.slice(-1);
                            var the_new = the_Val.replace(/\d$/, "");
                            if (/-/.test(the_Val)) {
                                theFlag = the_new.slice(0, 1);
                                the_new = the_new.slice(1);
                            }
                            if (parseInt(the_new) >= 100) {
                                departNum(the_new, theArray);
                                $(this).val(theFlag + theArray.join(",") + the_one + ".00");
                            }
                            else {
                                $(this).val(the_Val + ".00");
                            }
                        }
                        else {
                            var theArray = [];
                            var theFlag = "";
                            var the_now = parseFloat(the_Val).toFixed(2);
                            var the_nowStr = String(the_now).slice(-4);
                            var the_new = String(the_now).replace(/\d\.\d\d/, "");
                            if (/-/.test(the_Val)) {
                                theFlag = the_new.slice(0, 1);
                                the_new = the_new.slice(1);
                            }
                            if (parseInt(the_new) >= 100) {
                                departNum(the_new, theArray);
                                $(this).val(theFlag + theArray.join(",") + the_nowStr);
                            }
                            else {
                                $(this).val(String(the_now));
                            }
                        }
                    }
                });
        };

        TextBox.prototype.getValue = function () {
            if (this.option && this.option.money) {
                return this.elem.val().replace(",", "");
            }
            else {
                return this.elem.val();
            }

        };


        return TextBox;
    });


})(jQuery, this.Xbn);
(function ($, X) {

    var BaseControl = X.prototype.controls.getControlClazz("BaseControl");


    function Toolbar(elem, option) {
        this.$elem = $(elem);
        this.option = option;
        this.controls = {};
    }

    Toolbar.prototype = X.prototype.createObject(BaseControl.prototype);

    $.extend(Toolbar.prototype, {
        init: function (option) {
            var item;

            this.option = option || this.option;

            this.$elem.html(this.getTemplate(this.option));

            for (var i = 0; i < this.option.items.length; i++) {
                item = this.option.items[i];
                initControl(item, this);
            }

            function initControl(item, self) {
                if (!item) return;
                var name = item["name"];
                var elem = self.$elem.find(".js-" + item["name"]);
                var ctrl = X.prototype.controls.getControl(item["ctrlType"], elem, item);

                ctrl.init(item, function (argument) {
                    //console.log(name +  "初始化结束");
                });

                ctrl.Parent(self);

                self.controls[name] = ctrl;
            }

        },

        val: function () {
            // body...
        },


        /**
         @method getHtml 获取搜索组件html
         @return 搜索组件html
         */
        getTemplate: function (option) {
            var items = option.items;
            var item, html = "";
            if (items) {
                for (var i = 0; i < items.length; i++) {
                    item = items[i];
                    html += X.prototype.controls.getTemplate(item);
                }
            }

            return html;
        }

    });

    function ToolbarItem(option) {
        if (option) {
            this.option = option;
            this.name = option["name"] || "ToolbarItemName";
            this.title = option["title"] || "ToolbarItemTitle";
            this.click = option["click"] || function () {
                    //console.log("没有设置操作函数")
                };
        }
    }

    ToolbarItem.prototype = X.prototype.createObject(BaseControl.prototype);

    $.extend(ToolbarItem.prototype, {
        Parent: function () {
            if (arguments.length > 0) {
                this.parent = arguments[0];
            }
            else {
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
    function ToolbarButton(elem, option) {
        ToolbarItem.call(this, option);
        this.$elem = $(elem);
    }


    ToolbarButton.getTemplate = function (option) {
        return '<a href="javascript:;" class="listButton js-' + option["name"] + '"><em class="iconfont ' + (option["icon"] || "") + '"></em>' + option["title"] + '</a>';
    };


    ToolbarButton.prototype = X.prototype.createObject(ToolbarItem.prototype);

    $.extend(ToolbarButton.prototype, {
        init: function (option) {
            var that = this;
            this.option = option || this.option;
            if (this.option && this.option.click) {
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
    function ToolbarDropdown(elem, option) {
        ToolbarItem.call(this, option);
        this.$elem = $(elem);
        this.option = option;
        this.$dropdown = this.$elem.find(".js-dropdown");
        this.$dropdownItem = this.$elem.find(".js-dropdownItem");
        this.$dropdownItem.hide();
    }

    ToolbarDropdown.prototype = X.prototype.createObject(ToolbarItem.prototype);

    $.extend(ToolbarDropdown.prototype, {
        /**
         @method getLists 初始化，填入下拉项
         */
        init: function () {
            var that = this;
            if (this.option.items) {
                this.items = this.getMenuItems(this.option.items);
                var domList = [], item;

                for (var i = 0; i < this.items.length; i++) {
                    item = this.items[i];
                    domList.push(item.$elem);
                }
                this.$dropdownItem.append(domList);
                if (this.option.onItemClick) {
                    this.$dropdownItem.on("click", function (event) {
                        if (that.option.onItemClick) {
                            if (event.target.tagName == "A") {
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
            }, this));

            $(document).on("click", function (argument) {
                if (!$(event.target).is(".js-dropdown") && !$(event.target).parent().is(".js-dropdown")) {
                    if (that.$dropdownItem.is(":visible")) {
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
        getMenuItems: function (items) {
            var result = [], item;
            for (var i = 0, il = items.length; i < il; i++) {
                item = items[i];
                if (item) {
                    item = new ToolbarMenuItem(item);
                    item.init();
                    result.push(item);
                }
            }
            return result;
        },

        getMenuItem: function (name) {
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].name === name) {
                    return this.items[i];
                }
            }
            return null;
        }

    });

    ToolbarDropdown.getTemplate = function (option) {
        var template = '<div class="rel inline_block js-' + option["name"] + '">' +
            '<a href="javascript:;" class="listButton mR20 mark js-dropdown">' + option["title"] + '<i class="xbn_ico markSlid"></i></a>' +
            '<div class="oprTips js-dropdownItem">' +
            '<em class="dot1"></em>' +
            '<em class="dot2"></em>' +
            '</div>' +
            '</div>';

        return template;
    };


    function ToolbarMenuItem(option) {
        this.option = option;
        ToolbarItem.call(this, option);
    }

    ToolbarMenuItem.getTemplate = function (option) {
        return '<p><em class="' + (option["className"] || '') + '"></em><a href="javascript:;" class="titlelinkDefult js-' + option["name"] + '" data-name="' + option["name"] + '">' + option["title"] + '</a></p>'
    }


    ToolbarMenuItem.prototype = X.prototype.createObject(ToolbarItem.prototype);

    $.extend(ToolbarMenuItem.prototype, {
        init: function (option) {
            this.option = option || this.option;
            var tmpl = ToolbarMenuItem.getTemplate(this.option);
            this.$elem = $(tmpl);
            if (this.option.click) {
                this.$elem.on("click", $.proxy(function (argument) {
                    this.option.click(this);
                }, this));
            }
        },
        destroy: function (argument) {
            this.option = null;
            this.$elem = null;
        }
    });


    X.prototype.controls.registerControl("ToolbarButton", ToolbarButton);
    X.prototype.controls.registerControl("ToolbarDropdown", ToolbarDropdown);
    X.prototype.controls.registerControl("Toolbar", Toolbar);


})(jQuery, this.Xbn);
(function ($, X) {

    X.prototype.controls.widget("Upload", function (controlType) {

        var BaseControl = X.prototype.controls.getControlClazz("BaseControl");

        //上传图片
        function Upload(elem, options) {
            BaseControl.call(this, elem, options);
            this.Size = this.options.size;
            this.type = this.options.type;
            this.width = this.options.width ? this.options.width : '';
            this.height = this.options.height ? this.options.height : '';
            this.upload();
        };

        X.prototype.controls.extend(Upload, "BaseControl");

        Upload.prototype.constructor = Upload;

        /**
         @method init webuploader初始化设置
         */
        Upload.prototype.upload = function () {
            var that = this;
            var img = that.elem.find("img"),
                error = that.elem.find('.js-error');

            that.wrapData = that.elem.find(".js-wrapData");

            if (X.prototype.isFunction(this.options["click"])) {
                img.on("click", function (event) {
                    this.options["click"](img.attr("src"));
                });
            }

            // WebUploader实例
            var id = this.options["filePicker"];
            var label = this.options["filePickerLabel"] || "Click Select picture";
            var pick;
            if (id && label) {
                pick = {id: id, label: label}
            }

            // 实例化
            this.uploader = WebUploader.create({
                pick: pick,
                formData: {
                    fileType: that.type,
                    width: that.width,   //图片压缩后的宽
                    height: that.height  //图片压缩后的高
                },
                auto: true,
                swf: 'js/lib/webuploader/Uploader.swf',
                chunked: false,
                sendAsBinary:true,
                duplicate:that.options.duplicate || true,
                chunkSize: 512 * 1024,
                server: X.prototype.config.PATH_FILE.path.rootImg,
                fileNumLimit: 300,
                fileSizeLimit: that.Size * 1024 * 1024,
                accept:that.options.accept || {
                    /*title: 'Images',*/
                    extensions: 'jpg,jpeg,png',
                    mimeTypes: 'image/png,image/jpg,image/jpeg'
                }
            });
           
            that.duplicate();

            // 文件上传成功
            this.uploader.on('uploadSuccess', function (file, response) {
                if (response.data) {
                    error.html('');
                    if(that.options.single){
                        img.attr("src",response.data.url);
                    }else{
                        $(that.wrapData).find(".loading").remove();
                        var path = '';
                        if (response.data.url) {
                            path = response.data.url;
                        } else {
                            path = response.data.path;
                        }
                        var a = '<div class="wrapUpload" style="display: block"><img src="images/right.jpg" class="poa" style="top:1px;"><span class="accessory col66 word-cut myFile" path='+ path + ' style="background-color: white;padding: 0px 10px 0px 12px;max-width: 380px">'
                            + response.data.fileName + '</span><span class="redFont cancel" style="right: auto;top:2px"><img src="images/delete.jpg"></span></div>';
                        $(that.wrapData).append(a);
                    }

                    that.cancel();

                    that.maxNumber();

                    if (X.prototype.isFunction(that.options["uploadSuccess"])) {
                        var wrap = that.elem.find(".wrapUpload");
                        that.options["uploadSuccess"](response, wrap);
                    }
                    that.trigger("uploadSuccess");
                }
            });

            this.uploader.on('error', function (type, file) {
                var text;
                switch (type) {
                    case 'Q_EXCEED_SIZE_LIMIT':
                        text = that.options[type] || ("The maximum file size should be within" + ' ' + (that.Size - 5) + ' ' + "MB");
                        break;

                    case 'Q_EXCEED_NUM_LIMIT':
                        text = that.options[type] || "File number exceeded";
                        break;
                    case  'F_DUPLICATE':
                        text = that.options[type] || "Files repeating";
                        break;
                    case  'Q_TYPE_DENIED':
                        text = that.options[type] || '<span class="word-cut" style="max-width: 275px;line-height: 32px;">' + file.name + '</span> ' + "format not accepted";
                        break;
                }
                //error.text(text);
                var index = layer.msg('<span style="font-size: 24px;line-height: 29px">' + text + '</span>', {
                    id: 'myLayerMsg',
                    time: 3000,
                    area: ['600px', '56px']
                });
                $('#myLayerMsg').parent().css('border-radius', '0px');
            });
        };

        Upload.prototype.addButton = function (buttons) {
            if (!X.prototype.isArray(buttons)) {
                buttons = [buttons];
            }
            for (var i = 0; i < buttons.length; i++) {
                this.uploader.addButton(buttons[i]);
            }
        };

        /**
         @method init 获取上传图片
         @param value {string} 获取上传图片值
         */
        Upload.prototype.getValue = function () {
            return this.elem.find("img").attr("src");
        };

        Upload.prototype.cancel = function () {
            var that = this;
            var cancel = that.elem.find(".cancel");
            cancel.unbind("click");
            cancel.on('click', function (event) {
                var fatherDiv = $(event.currentTarget).parent();
                fatherDiv.remove();
                that.maxNumber(true);
                if (X.prototype.isFunction(that.options["cancel"])) {
                    var wrap = that.elem.find(".wrapUpload");
                    that.options["cancel"](wrap);
                }
            });
        };

        /**
         @method init 设置上传文件数量
         @param value {string} 设置上传文件最大数量
         */
        Upload.prototype.maxNumber = function(){
            var that = this;
            var wrap = that.elem.find(".wrapUpload");
            var input = that.elem.find("input[type=file]");
            var error = that.elem.find('.js-error');
            if (wrap.length >= that.options.maxNum) {
                input.attr("disabled",true);
            } else {
                input.attr("disabled",false);
                error.text("");
            }
        };

        /**
         @method init 设置上传图片
         @param value {string} 设置上传图片值
         */
        Upload.prototype.setValue = function (imgUrl) {
            this.elem.find("img").attr("src", imgUrl);
        };

        /**
         @method init 重复上传文件
         */
        Upload.prototype.duplicate = function(){
            var that = this,
                _this = that.uploader,
                mapping = {};

            function hashString( str ) {
                var hash = 0,
                    i = 0,
                    len = str.length,
                    _char;

                for ( ; i < len; i++ ) {
                    _char = str.charCodeAt( i );
                    hash = _char + (hash << 6) + (hash << 16) - hash;
                }

                return hash;
            }

            _this.on( 'beforeFileQueued', function(file) {
                var hash = file.__hash || (file.__hash = hashString( file.name +
                        file.size + file.lastModifiedDate ));

                // 已经重复了
                if ( mapping[ hash ] ) {
                    var nameArr = [];
                    var namewrapArr = that.elem.find(".js-wrapData .myFile");

                    $.each(namewrapArr,function(i,item){
                        if(namewrapArr[i].nodeName == "IMG"){
                            nameArr.push($(namewrapArr[i]).next().next().html());
                        }else{
                            nameArr.push($(namewrapArr[i]).html());
                        }
                    });

                    var has = function (){
                        var hasName;
                        $.each(nameArr,function(i,item){
                            if(nameArr[i] == file.name){
                                hasName = true;
                            }
                        });
                        return hasName;
                    };

                    if(has()){
                        _this.trigger( 'error', 'F_DUPLICATE', file );
                        return false;
                    } else {
                        if (X.prototype.isFunction(that.options["uploadBeforeSend"])) {
                            that.options["uploadBeforeSend"](that, file);
                        }
                    }
                }
            });

            _this.on( 'fileQueued', function( file ) {
                var hash = file.__hash;

                hash && (mapping[ hash ] = true);
            });

            _this.on( 'fileDequeued', function( file ) {
                var hash = file.__hash;

                hash && (delete mapping[ hash ]);
            });

            _this.on( 'reset', function() {
                mapping = {};
            });
        };


        return Upload;
    });

})(jQuery, this.Xbn);
(function ($, X) {

    X.prototype.controls.widget("WebUpload", function (controlType) {

        var BaseControl = X.prototype.controls.getControlClazz("BaseControl");

        //上传图片
        function WebUpload(elem, options) {
            BaseControl.call(this, elem, options);
            this.Size = this.options.size;
            this.type = this.options.type;
            this.extensions = this.options.extensions;
            this.sourceFile = [];
            this.maxNum = this.options.maxNum;
            this.downloadType = this.options.downloadType;
            this.upload();
        };

        X.prototype.controls.extend(WebUpload, "BaseControl");

        WebUpload.prototype.constructor = WebUpload;

        /**
         @method init webuploader初始化设置
         */
        WebUpload.prototype.upload = function () {
            var that = this;
            that.wrapData = that.elem.find(".js-wrapData");
            var error = that.elem.find('.js-error');
            // WebUploader实例
            var id = this.options["filePicker"];
            var label = this.options["filePickerLabel"] || "Click Select picture";
            var multiple = navigator.userAgent.indexOf('compatible') === -1? true: false
            var pick;
            if (id && label) {
                pick = {id: id, label: label, multiple: multiple}
            }

            // 实例化
            this.uploader = WebUploader.create({
                pick: pick,
                formData: {
                    fileType: that.type
                },
                auto: true,
                swf: 'js/lib/webuploader/Uploader.swf',
                sendAsBinary:true, //指明使用二进制的方式上传文件
                duplicate:true,
                chunked: false,
                chunkSize: 512 * 1024,
                server: X.prototype.config.PATH_FILE.path.rootImg,
                fileSizeLimit: that.Size * 1024 * 1024,
                accept :{
                    extensions : that.extensions || "doc,docx,xls,xlsx,ppt,pptx,pdf,jpg,jpeg,gif,png" //接受文件类型
                }
            });

            that.duplicate();
            // 文件上传成功
            this.uploader.on('uploadSuccess', function (file, response) {
                if(that.elem.find(".wrapUpload").length < that.maxNum){
                    if (response.data) {
                        error.html('');
                        var uploadUrl = X.prototype.config.attach.download;
                        var a='';
                        if (X.prototype.isFunction(that.options["uploadSuccessBackFill"])) {
                            a = that.options["uploadSuccessBackFill"](response);
                        }else{
                            a = '<div class="wrapUpload"><a href="' + uploadUrl + '?fileType=' + that.options.downloadType + '&filePath=' + response.data.path + '&fileName=' + response.data.fileName + '" target="_blank" class="accessory blueFont">' + response.data.fileName + '</a><span class="redFont cancel">X</span></div>';
                        }
                        $(that.wrapData).append(a);

                        that.cancel();
                        that.sourceFile.push(file)
                        that.maxNumber();

                        if (X.prototype.isFunction(that.options["uploadSuccess"])) {
                            that.options["uploadSuccess"](response);
                        }
                        that.trigger("uploadSuccess");
                    }
                }
            });

            /*this.uploader.on('fileQueued', function(file) {
                file.on('statuschange', function( cur, prev ) {
                    console.log(cur + '***' + prev)
                })
            })*/

            this.uploader.on('error', function (type) {
                var text;
                switch (type) {
                    case 'Q_EXCEED_SIZE_LIMIT':
                        text = that.options.Q_EXCEED_SIZE_LIMIT || "The maximum file size should be within";
                        break;

                    case 'Q_EXCEED_NUM_LIMIT':
                        text = that.options.Q_EXCEED_NUM_LIMIT || "File number exceeded";
                        break;

                    case 'F_DUPLICATE':
                        text = that.options.F_DUPLICATE || "Files repeating";
                        break;

                    case 'Q_TYPE_DENIED':
                        text = that.options.Q_TYPE_DENIED || "format not accepted";
                        break;

                }
                error.text(text);
                setTimeout(function () {
                    error.text()
                }, 1600)
            });
        };

        WebUpload.prototype.addButton = function (buttons) {
            if (!X.prototype.isArray(buttons)) {
                buttons = [buttons];
            }
            for (var i = 0; i < buttons.length; i++) {
                this.uploader.addButton(buttons[i]);
            }
        };

        /**
         @method init 重复上传文件
         */
        WebUpload.prototype.duplicate = function(){
            var that = this,
                _this = that.uploader,
                mapping = {};

            function hashString( str ) {
                var hash = 0,
                    i = 0,
                    len = str.length,
                    _char;

                for ( ; i < len; i++ ) {
                    _char = str.charCodeAt( i );
                    hash = _char + (hash << 6) + (hash << 16) - hash;
                }

                return hash;
            }

            _this.on( 'beforeFileQueued', function( file ) {
                var hash = file.__hash || (file.__hash = hashString( file.name +
                        file.size + file.lastModifiedDate ));

                // 已经重复了
                if ( mapping[ hash ] ) {
                    var nameArr = [];
                    if(X.prototype.isFunction(that.options["duplicate"])){
                        nameArr = that.options["duplicate"](that.elem.find(".js-wrapData"));
                    }else{
                        var namewrapArr = that.elem.find(".js-wrapData").find("a");
                        $.each(namewrapArr,function(i,item){
                            nameArr.push($(namewrapArr[i]).html());
                        });
                    }

                    var has = function (){
                        var hasName;
                        $.each(nameArr,function(i,item){
                            if(nameArr[i] == file.name){
                                hasName = true;
                            }
                        });
                        return hasName;
                    };

                    if(has()){
                        _this.trigger( 'error', 'F_DUPLICATE', file );
                        return false;
                    }
                }
            });

            _this.on( 'fileQueued', function( file ) {
                var hash = file.__hash;

                hash && (mapping[ hash ] = true);
            });

            _this.on( 'fileDequeued', function( file ) {
                var hash = file.__hash;

                hash && (delete mapping[ hash ]);
            });

            _this.on( 'reset', function() {
                mapping = {};
            });
        };

        /**
         @method init 删除上传文件
         */
        WebUpload.prototype.cancel = function () {
            var that = this;
            var cancel = that.elem.find(".cancel");
            cancel.on('click', function (event) {
                var fatherDiv = $(event.target).parent();
                fatherDiv.remove();
                that.maxNumber(true);

                this.previousElementSibling ? that.removeFile(this.previousElementSibling.innerHTML) : '';
            });
        };

        /**
         @method init 删除上传文件
         */
        WebUpload.prototype.removeFile = function (fileName) {
            var files = this.sourceFile
            for (var i = files.length; i--;) {
                if (files[i].name === fileName) {
                    this.uploader.cancelFile(files.splice(i, 1))
                    break
                }
            }
        }

        /**
         @method init 获取上传文件
         @param value {string} 获取上传文件值
         */
        WebUpload.prototype.getValue = function (type) {
            var that = this;
            var value = that.elem.find("a");
            var arr = [];

            function getArgStr(value) {
                var argStr = '';
                argStr = value.split('&')[1].split('=')[1];
                return argStr;
            }
            if(X.prototype.isFunction(that.options["getValue"])){
                arr = that.options["getValue"](value,type);
            }else{
                $.each(value, function (i, item) {
                    arr.push({attachmentType: type, filePath: getArgStr($(this).attr("href")), filename: $(this).text()});
                });
            }
            return arr;
        };

        /**
         @method init 设置上传文件
         @param value {string} 设置上传文件值
         */
        WebUpload.prototype.setValue = function (arr) {
            var that = this;
            var wrap = that.elem.find(".js-wrapData");
            if (arr) {
                var uploadUrl = X.prototype.config.PATH_FILE.path.rootUploadUrl;
                $.each(arr, function (i, item) {
                    var a = '<div class="wrapUpload"><a href="' + uploadUrl + '?fileType=' + that.downloadType + '&filePath=' + arr[i].filePath + '&fileName=' + arr[i].filename + '" class="accessory blueFont">' + arr[i].filename + '</a><span class="redFont cancel">X</span></div>';
                    $(wrap).append(a);
                });

                that.cancel();
            } else {
                wrap.html("");
            }
        };

        /**
         @method init 设置上传文件数量
         @param value {string} 设置上传文件最大数量
         */
        WebUpload.prototype.maxNumber = function (data) {
            var that = this;
            var wrap = that.elem.find(".wrapUpload");
            var input = that.elem.find("input[type=file]");
            var error = that.elem.find('.js-error');
            if(that.options.hiddenBtn){
                if(wrap.length >= that.maxNum){
                    input.parent().parent().addClass("none");
                }else{
                    input.parent().parent().removeClass("none");
                }
            }else{
                if (wrap.length > that.maxNum) {
                    var text = that.options.Q_EXCEED_NUM_LIMIT || ("File number exceeded"+ that.maxNum);
                    error.text(text);
                    input.attr("disabled", true);
                } else {
                    input.attr("disabled", false);
                    error.text("");
                }
            }
        };

        /**
         @method init 重置上传附件展示
         */
        WebUpload.prototype.reset = function () {
            this.setValue("");
        };

        return WebUpload;
    });

})(jQuery, this.Xbn);