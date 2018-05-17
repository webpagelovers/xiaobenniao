X.define("modules.account.info",["model.infoModel"], function (infoModel) {

    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.account.tpl.info
    });

    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.load = function() {
        view.render(function() {
            ctrl.vmUserInfo = ctrl.getViewModel(ctrl.view.el.find(".js-userInfo"));
            ctrl.vmUserInfo.initControl();
            ctrl.userInfo();
            ctrl.area();
            ctrl.country();
            ctrl.addProductName();
        });
    };

    var userId = ''
    ctrl.userInfo = function () {
        var userInfoCallback = function (result) {
            userId = result.data[0].userId;
            ctrl.view.el.find(".js-name").text(result.data[0].firstName + ' ' + result.data[0].lastName);
            ctrl.view.el.find("#phone").val(result.data[0].mobile);
            ctrl.myVerifyEmail(result)
        };
        infoModel.userInfo(userInfoCallback);

        var buyerInfoCallback = function (result) {
            ctrl.view.renderData(result.data[0]);
            ctrl.updataData(result.data[0]);
            ctrl.myValidate();
            ctrl.submit();
        };
        infoModel.findBuyerInfoByUserId(buyerInfoCallback);
    };

    var countryData;
    ctrl.area = function () {
        var countryCode = localStorage.getItem('countryCode');
        var ifLoading = true;
        var ifDropdown = false;
        if (countryCode) {
            $("#phone").intlTelInput({
                initialCountry: countryCode,
                autoPlaceholder: 'off',
                //autoHideDialCode: false,
                preferredCountries: []
            });
            $(".selected-flag .iti-flag").removeClass('loading').css({'box-shadow': 'none'});
            countryData = $("#phone").intlTelInput("getSelectedCountryData");
            $('.js-dialCode').text('+' + countryData.dialCode);
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
                utilsScript: "js/lib/utils.js",

            });
            ifLoading=true;
            ifDropdown = true
        }
        $(".js-other").css({'background': 'url("../images/other.png")', 'box-shadow': 'none'});
        $(".js-other").parent().parent().find('.dial-code').text('');
        $(".iti-flag-add").removeClass('iti-flag');
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
            if (countryData.dialCode == '' || countryData.dialCode == undefined) {
                $('.js-dialCode').text('');
                $(".selected-flag .js-other").addClass("otherBg").css({ 'box-shadow': 'none'});
            }

            if (countryData.dialCode < 10) {
                jQuery("#phone").css('padding-left', '75px');
            } else if (countryData.dialCode < 100) {
                jQuery("#phone").css('padding-left', '85px');
            } else if (countryData.dialCode < 1000) {
                jQuery("#phone").css('padding-left', '95px');
            } else if (countryData.dialCode < 10000) {
                jQuery("#phone").css('padding-left', '105px');
            }
            $("#country").intlTelInput("setCountry", countryData.iso2);
        });

        $("#phone").focusin(function () {
            if ($('.country-list').hasClass('hide')) {
                if ($('.selected-flag .loading').length) {
                    $('.country-list').removeClass('hide');
                }
            }
        });
        $("#phone").focusout(function () {
            if (!$('.country-list').hasClass('hide')) {
                $('.country-list').addClass('hide');
            }
        });
    };

    ctrl.country = function () {
        var countryCode = localStorage.getItem('countryCode');
        var ifLoading = true;
        var ifDropdown = false;
        if (countryCode) {
            $("#country").intlTelInput({
                initialCountry: countryCode,
                autoPlaceholder: 'off',
                //autoHideDialCode: false,
                preferredCountries: []
            });
            $(".selected-flag .iti-flag").removeClass('loading').css({'box-shadow': 'none'});
            countryData = $("#country").intlTelInput("getSelectedCountryData");
            $('.js-dialCode').text('+' + countryData.dialCode);
            ifLoading = false;
            ifDropdown =true;
        } else{
            $("#country").intlTelInput({
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
                utilsScript: "js/lib/utils.js",

            });
            ifLoading=true;
            ifDropdown = true
        }
        $(".js-other").css({'background': 'url("../images/other.png")', 'box-shadow': 'none'});
        $(".js-other").parent().parent().find('.dial-code').text('');
        $(".iti-flag-add").removeClass('iti-flag');
        if (ifLoading) {$(".selected-flag .iti-flag").addClass('loading').css({'box-shadow': 'none'});}
        if (ifDropdown) {$(".selected-flag").removeClass('w100p');}
        $('.js-country').find('.selected-flag .iti-flag').css({'display': 'none'});
        $('.js-country').find('.selected-flag').prepend('<span style="width: 120px;height:20px;position: absolute;top:-10px;overflow: hidden;" id="myCountry">Select Country</span>');
        $('.js-country').find('.selected-flag .iti-arrow').css({'left': '120px'});
        $('.js-country').find('.country-list').css({'top': '12px'});
        $('.js-country').find('.flag-container').css({'margin-top': '-5px'});
        if (countryData.name) {
            $('#myCountry').text(countryData.name);
        }
        $("#country").on("countrychange", function(e, countryData) {
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
            if (countryData.dialCode == '' || countryData.dialCode == undefined) {
                $('.js-dialCode').text('');
                $(".selected-flag .js-other").addClass("otherBg").css({ 'box-shadow': 'none'});
            }

            if (countryData.dialCode < 10) {
                jQuery("#country").css('padding-left', '75px');
            } else if (countryData.dialCode < 100) {
                jQuery("#country").css('padding-left', '85px');
            } else if (countryData.dialCode < 1000) {
                jQuery("#country").css('padding-left', '95px');
            } else if (countryData.dialCode < 10000) {
                jQuery("#country").css('padding-left', '105px');
            }
            $("#phone").intlTelInput("setCountry", countryData.iso2);
            $('#myCountry').text(countryData.name);
        });

        $("#country").focusin(function () {
            if ($('.country-list').hasClass('hide')) {
                if ($('.selected-flag .loading').length) {
                    $('.country-list').removeClass('hide');
                }
            }
        });
        $("#country").focusout(function () {
            if (!$('.country-list').hasClass('hide')) {
                $('.country-list').addClass('hide');
            }
        });
    };

    ctrl.updataData = function (data) {
        if (data) {
            ctrl.view.el.find(".js-city").val(data.city);
            ctrl.view.el.find(".js-streetAddress").val(data.streetAddress);
            ctrl.view.el.find(".js-websiteUrl").val(data.websiteUrl);
            ctrl.view.el.find(".js-companyName").val(data.companyName);
            try {
                $("#phone").intlTelInput("setCountry", data.country);
            } catch(e) {
            }
            var productName = data.productName.split(',');
            for (var i = 0, len = productName.length - 1; i < len; i++) {
                ctrl.addCategory(productName[i]);
            }
            var key = '';
            if (data.sourcingFrequency >= 0) {
                key = data.sourcingFrequency;
            } else {
                key = -1;
            }
            ctrl.sourcingInfo = ctrl.getViewModel(ctrl.view.el.find(".js-sourcingInfo"),{meta: {"sourcingFrequency":{dataSource:infoModel.const.source, selectItem: {"key": key,"value":""},selectedChanged: function(item){
                var inputSource = ctrl.view.el.find(".js-inputSource");
                var sourceError = ctrl.view.el.find(".currency-error");
                inputSource.val(item.text);
                sourceError.html('');
            }}}});
            ctrl.sourcingInfo.initControl();
        }
    };

    ctrl.myValidate = function () {
        var userInfoValidate = {
            ignore: ".ignore",
            rules: {
                email: {
                    required: true,
                    maxlength: 60,
                    email: true,
                    emailUsed: true
                },
                mobile: {
                    required: true,
                    maxlength: 11
                },
                streetAddress: {
                    maxlength: 128
                },
                city: {
                    maxlength: 60
                },
                websiteUrl: {
                    maxlength: 60
                },
                companyName: {
                    maxlength: 128
                }
            },
            messages: {
                email: {
                    required: 'Please enter your Email',
                    maxlength: 'The max characters should be within 60 characters',
                    email: 'Please enter a valid Email address',
                    emailUsed: 'Email is already existed'
                },
                mobile: {
                    required: 'Please enter your Phone Number',
                    maxlength: 'The max characters should be within 11 characters'
                },
                streetAddress: {
                    maxlength: 'The max characters should be within 128 characters'
                },
                city: {
                    maxlength: 'The max characters should be within 60 characters'
                },
                websiteUrl: {
                    maxlength: 'The max characters should be within 60 characters'
                },
                companyName: {
                    maxlength: 'The max characters should be within 128 characters'
                }
            },
            onkeyup: false,
            onfocusout: function (element) {
                var elem = $(element);
                if (!elem.hasClass('ignore')) {
                    elem.valid();
                }
            },
            success: function (value, element) {

            },
            // showErrors: function(errorMap, errorList) {
            //     this.numberOfInvalids();
            // },
            errorPlacement: function (error, element) {
                var errorContent = element.parent().find(".js-error");
                if (errorContent.length == 0) {
                    errorContent = element.parent().parent().find(".js-error");
                }
                error.appendTo(errorContent);
            }
        };
        ctrl.view.el.find(".js-userInfo").validate(userInfoValidate);
    };

    ctrl.addProductName = function () {
        view.el.on('keydown', function (e) {
            var itemHtml = ctrl.view.find(".js-category-val");
            e.keyCode === 13 && ctrl.addCategory(itemHtml.val());
        })
        ctrl.view.find(".js-add-category").click(function(){
            var itemHtml = ctrl.view.find(".js-category-val");
            ctrl.addCategory(itemHtml.val());
        });
    };

    ctrl.addCategory = function(data) {
        var itemHtml = ctrl.view.find(".js-category-val");
        if (data){
            var categoryHtml = '<div class="addInfo-category colff f16 bold br5 disib bgcd1 js-addCategory-html">';
            categoryHtml += '  <span>'+data+'</span><a class="addInfo-category-btn disib tac ml10 js-del-category fwn f22">×</a>';
            categoryHtml += '</div>';
            ctrl.view.find(".js-category-html").append(categoryHtml);
            ctrl.view.find(".js-category-hidden-val").val(data)
            ctrl.view.find("input[name='category']").valid()
            itemHtml.val("");
            ctrl.delCategory();
            ctrl.view.find(".js-category-error").text(" ");
            if(ctrl.view.find(".js-addCategory-html").length >=6){
                ctrl.view.find(".js-add-category").remove();
                itemHtml.attr("disabled",true)
            }
        }
    };

    ctrl.delCategory = function(){
        ctrl.view.find(".js-del-category").unbind('click').click(function(){
            $(this).parent().remove()
            if(ctrl.view.find(".js-addCategory-html").length < 6){
                if(ctrl.view.find(".js-add-category").length === 0){
                    var addHTML='<a class="addInfo-category-btn disib f16 bold tac ml10 js-add-category" style="background: #d1d1d1;color: #FFFFFF">+</a>'
                    ctrl.view.find(".js-category-val").attr("disabled",false).parent().append(addHTML);
                    ctrl.view.find(".js-add-category").click(function(){ctrl.addCategory()})
                }
                if(ctrl.view.find(".js-addCategory-html").length === 0){
                    ctrl.view.find(".js-category-hidden-val").val("")
                    ctrl.view.find("input[name='category']").valid()
                }
            }
        })
    };

    ctrl.getCategory = function(){
        var category= "";
        var categoryHtml = ctrl.view.find(".js-addCategory-html");
        for (var i=0;i<categoryHtml.length;i++){
            category += $(ctrl.view.find(".js-addCategory-html")[i]).find("span").text()+",";
        }
        return category
    };

    ctrl.myVerifyEmail = function (result) {
        var email = result.data[0].email;
        if (email) {
            ctrl.view.el.find(".js-email").val(result.data[0].email).hide();
            ctrl.view.el.find(".js-email-text").text(result.data[0].email).css({'display': 'inline-block'});
            if(result.data[0].isVerifyEmail  != 1) {
                ctrl.view.el.find(".js-verifyEmail").css({'display': 'inline-block'});
            }
        } else {
            ctrl.view.el.find(".js-email").removeAttr('readonly');
        }
        $.validator.addMethod('emailUsed', function(value, element) {
            var res;
            $.ajax({
                type: "POST",
                url: X.config.account.api.verifyEmail,
                async: false,
                data: JSON.stringify({
                    'email': value,
                    'userType': 0
                }),
                success: function (data) {
                    if (data.statusCode == X.CONSTANTS.statusCode.SUCCESS) {
                        res = data.data[0].code;
                    }
                }
            });

            return res == '1'? false: true;
        });
        ctrl.view.el.find(".js-verifyEmail").click(function () {
            var data = {
                email: email
            };
            var callback = function (result) {
            };

            infoModel.verifyEmail(data, callback)
        });
    };

    ctrl.submit = function () {
        ctrl.view.el.find(".js-viewDetailSubmit").click(function () {
            if (ctrl.view.el.find(".js-userInfo").valid()) {
                var data = ctrl.vmUserInfo.collectData();
                if (ctrl.view.el.find(".js-email").attr('readonly')) {
                    delete data.email;
                }
                data.userId  = userId;
                countryData = $("#phone").intlTelInput("getSelectedCountryData");
                data.country = countryData.iso2;

                var callback = function (result) {
                };

                infoModel.setBuyerInfo(data, callback)
            }
        });
        ctrl.view.el.find(".js-sourcingInfoSubmit").click(function () {
            var data = {};
            var data = ctrl.sourcingInfo.collectData();
            data.userId  = userId;
            data.productName = ctrl.getCategory();
            var callback = function (result) {
            };

            infoModel.setBuyerInfo(data, callback)
        });
    };

    return ctrl;
});