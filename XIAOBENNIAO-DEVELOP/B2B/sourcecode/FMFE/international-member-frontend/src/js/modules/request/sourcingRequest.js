X.define('modules.request.sourcingRequest', ["model.productsModel", "modules.common.global", "modules.user.login", "modules.user.regist", "adapter.searchValidate","modules.common.multipleFiles","modules.common.checkIsIE", "modules.common.suspensionBox","modules.common.cookies","model.userModel","modules.common.commonRequest"], function (productsModel, global, login, regist, searchValidate,multipleFiles,checkIsIE,suspensionBox,cookies,userModel,commonRequest) {

    var view = X.view.newOne({
        el: $('.js-content'),
        url: X.config.request.tpl.sourcingRequest,
        res: X.config.request.res.sourcingRequest
    });

    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.deleteSpecialChar = function (value) {
        var temp = '';
        for (var i = 0, len = value.length; i < len; i++) {
            var char = value.charAt(i);
            if (/[A-Za-z0-9\s(\`)(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\_)(\-)(\+)(\=)(\|)(\\)(\{)(\})(\')(\:)(\;)(\')(\")(',)(\[)(\])(\.)(\<)(\>)(\/)(\?)(\~)(\！)(\@)(\#)(\￥)(\%)(\…)(\&)(\*)(\（)(\）)(\—)(\+)(\|)(\{)(\})(\【)(\】)(\‘)(\；)(\：)(\”)(\“)(\’)(\。)(\，)(\、)(\？)]/.test(char)) {
                temp += char;
            }
        }
        return temp;
    };

    ctrl.validateValue = function () {
        ctrl.view.el.find("input").keyup(function () {
            var value = $(this).val();
            var temp = ctrl.deleteSpecialChar(value);
            if (temp != value) {
                $(this).val(ctrl.deleteSpecialChar(temp));
            }
        });
        ctrl.view.el.find("input").change(function () {
            var value = $(this).val();
            var temp = ctrl.deleteSpecialChar(value);
            if (temp != value) {
                $(this).val(ctrl.deleteSpecialChar(temp));
            }
        });
        ctrl.view.el.find("textarea").keyup(function () {
            var value = $(this).val();
            var temp = ctrl.deleteSpecialChar(value);
            if (temp != value) {
                $(this).val(ctrl.deleteSpecialChar(temp));
            }
        });
        ctrl.view.el.find("textarea").change(function () {
            var value = $(this).val();
            var temp = ctrl.deleteSpecialChar(value);
            if (temp != value) {
                $(this).val(ctrl.deleteSpecialChar(temp));
            }
        });
    };
    ctrl.area = function () {
         var countryCode = localStorage.getItem('countryCode');
         var ifLoading = true;
         var ifDropdown = false;
        if (countryCode) {
            $("#phone").intlTelInput({
                initialCountry: countryCode,
                autoPlaceholder: 'off',
                //autoHideDialCode: false,
                preferredCountries: [],
                utilsScript: "js/lib/utils.js"
            });
            $(".selected-flag .iti-flag").removeClass('loading').css({'box-shadow': 'none'});  
            var countryData = $("#phone").intlTelInput("getSelectedCountryData");
            $('.js-dialCode').text('+' + countryData.dialCode);
            countryName = countryData.name;
            ifLoading = false;
            ifDropdown =true;
        } else{          
            $("#phone").intlTelInput({
                initialCountry: 'auto',
                autoPlaceholder: 'off',
                //autoHideDialCode: false,
                preferredCountries: [],
                geoIpLookup: function (callback) {
                    $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
                        var countryCode = (resp && resp.country) ? resp.country : "";
                        callback(countryCode);
                    });
                },
                utilsScript: "js/lib/utils.js"
            });
            ifLoading=true;
            ifDropdown = true
        }
        $(".js-other").css({'background': 'url("../images/other.png")', 'box-shadow': 'none'});
        $(".js-other").parent().parent().find('.dial-code').text('');
        $(".iti-flag-add").removeClass('iti-flag');
        if (ctrl.GetQueryString('phoneNum')) {ifLoading = false}
        if (ifLoading) {$(".selected-flag .iti-flag").addClass('loading').css({'box-shadow': 'none'});}
        if (ifDropdown) {$(".selected-flag").removeClass('w100p');}
        $("#phone").on("countrychange", function(e, countryData) {
            if (countryData.dialCode) {
                $('.js-dialCode').text('+' + countryData.dialCode);                
            }else{
                $('.js-dialCode').text(countryData.dialCode);                
            }            
            if (countryData.dialCode == 259) {
                var flag = $('.selected-flag .iti-flag-add');
                flag.removeClass('iti-flag');
                flag.css({'position':'absolute', 'top': '15px'})
            } else {
                var flag2 = $('.selected-flag .iti-flag');
                flag2.css({'position':'absolute', 'top': '0px'})
            }
            if (countryData.name == 'Others') {
                var flag = $('.iti-flag.js-other');
                flag.addClass('other');
            }else{
                var flag2 = $('.selected-flag .iti-flag');
                flag2.removeClass('other')
            }
        });
    };
    ctrl.load = function(){
        view.el.find(".js-home").attr("href",X.config.common.link.home);
    }
    ctrl.load();

    return ctrl
});


