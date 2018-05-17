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
            this.textareaRule()
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

        /**
         @method init 长文本 超过3000个字符后在输入框下方给出提示语You can also continue to enter XXX characters
         */
        TextBox.prototype.textareaRule = function () {
            var ele = this.elem
            if (ele[0].tagName === 'TEXTAREA') {
                var limit  = ele.attr('maxlength') || 10000,
                    start  = 3000,
                    notice = $('<label class="error textareaError none">You can also continue to enter <span>'+ (limit - start) +'</span> characters</label>'),
                    numBox = notice.children('span')

                ele.after(notice)   
                ele.on('keyup', function() {
                    var len = this.value.length
                    len > start? (numBox.html(limit - len), notice.removeClass('none')): notice.addClass('none')
                })
            }
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