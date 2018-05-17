(function ($,X) { 

    X.prototype.controls.widget("IntlTelInput",function (controlType) {
        /**
        @class IntlTelInput text值
        @constructor 构造函数
        @param elem {DomNode} Dom节点
        @param option {Object} 配置信息
        */
        function IntlTelInput(elem,options) {
            this.elem = elem;
            this.option = options;
            //this.loadTemplate();
            this.init();
        }

        X.prototype.controls.extend(IntlTelInput,"BaseControl");
        IntlTelInput.prototype.constructor = IntlTelInput;

        IntlTelInput.getTemplate = function(item){
            var option = item || this.option,
                name   = option.name,
                html   = [

                    '<dl class="screen_box fL">',
                    '   <dd><input type="text" class="'+ option.className +' default_input w250 fL js-'+ name +'"></dd>',
                    '</dl>'

                ].join('')

            return html
        }

        IntlTelInput.prototype.loadTemplate = function(){
            var option = this.option,
                name   = option.name,
                html   = [

                    '<dl class="screen_box fL">',
                    '   <dt>'+ name +'：</dt>',
                    '   <dd><input type="text" class="default_input w250 fL js-'+ name +'"></dd>',
                    '</dl>'

                ].join('')
                
            this.elem.html(html)
        }

        IntlTelInput.prototype.init = function() {
            var input = this.elem,
                me    = this

            input.intlTelInput({
                initialCountry: 'cn',
                autoPlaceholder: 'off',
                //autoHideDialCode: false,
                preferredCountries: [],
                utilsScript: "js/lib/utils.js"
            });

            input.on('countrychange', function(e, countryData) {
                me.option.countrychange? me.option.countrychange(e, countryData): input.val(countryData.name)
            })
        }

        IntlTelInput.prototype.setValue = function (value) {
            return this.elem.text(value);
        };

        IntlTelInput.prototype.getValue = function () {
            return this.elem.text();
        };

        IntlTelInput.prototype.reset = function () {
            this.elem.text("");
        };

        return IntlTelInput;
    });


})(jQuery,this.Xbn);