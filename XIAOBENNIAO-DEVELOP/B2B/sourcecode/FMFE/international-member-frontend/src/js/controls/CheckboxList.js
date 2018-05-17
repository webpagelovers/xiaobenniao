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