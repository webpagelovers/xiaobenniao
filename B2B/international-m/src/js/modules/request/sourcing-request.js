require.config({
    baseUrl: 'js'
});


require(['xbn.config','controls/UploadPic','modules/common/contact', 'modules/common/cookies'], function (config,UploadPic,contact,cookies){
    var ctrl = {};

    ctrl.mySuccess = function (response) {
        var img = $('.js-wrapImg').children();
        if (img.length >= 6) {
            $('.js-text').css('margin-top', '3rem');
        }
        if (img.length >= 11) {
            $('.js-upload-add').css('display', 'none');
        }
        $.hidePreloader();
    };
    ctrl.myCancel = function () {
        var img = $('.js-wrapImg').children();
        if (img.length == 5) {
            $('.js-upload .js-error').css('margin-top', '5px');
            $('.js-text').css('margin-top', '2rem');
        }
        if (img.length >= 6 && img.length < 11) {
            $('.js-upload-add').css('display', 'inline-block');
        }
    };

    var uploadPic = new UploadPic();
    uploadPic.init({
        url: config.upload.uploadUrl,
        downloadUrl:config.upload.downloadUrl,
        fileType: 18,
        error: {
            ERROR_TYPE: ' format not accepted,only jpg,jpeg,png,bmp',
            ERROR_MAXSIZE: 'The maximum file size should be within 5 MB',
            ERROR_REPEATING: 'Files repeating'
        },
        maxSize: 5,
        mySuccess: ctrl.mySuccess,
        myCancel: ctrl.myCancel,
        beforeSend : function(){
            $.showPreloader('Upload');
        },
        progressEnd : function(){
            $.hidePreloader();
        }
    });

    var countryName = '';
    ctrl.area = function () {
        var selectFlg = false;
        var countryCode = localStorage.getItem('countryCode');
        var phone = jQuery("#phone");
        if (countryCode) {
            phone.intlTelInput({
                initialCountry: countryCode,
                autoPlaceholder: 'off',
                //autoHideDialCode: false,
                preferredCountries: [],
                utilsScript: "js/lib/utils.js"
            });
            var countryData = jQuery("#phone").intlTelInput("getSelectedCountryData");
            jQuery('.js-dialCode').text('+' + countryData.dialCode);
            countryName = countryData.name;
        } else {
            phone.intlTelInput({
                initialCountry: 'auto',
                autoPlaceholder: 'off',
                //autoHideDialCode: false,
                preferredCountries: [],
                geoIpLookup: function (callback) {
                    jQuery.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
                        if (!selectFlg) {
                            var countryCode = (resp && resp.country) ? resp.country : "";
                            callback(countryCode);
                            countryCode = countryCode.toLowerCase();
                            localStorage.setItem('countryCode', countryCode);
                        }
                    });
                },
                utilsScript: "js/lib/utils.js"
            });
            jQuery(".selected-flag .iti-flag").addClass('loading').css({'box-shadow': 'none'});
        }

        jQuery(".country-list").addClass('mydropdown');
        jQuery(".js-other").css({ 'box-shadow': 'none'});
        jQuery(".js-other").removeClass('iti-flag');
        jQuery(".js-other").parent().parent().find('.dial-code').text('');
        jQuery(".iti-flag-add").removeClass('iti-flag');

        jQuery('.selected-flag').click(function () {
            jQuery('html, body, .content').animate({scrollTop: 655}, 500);
        });

        phone.on("countrychange", function(e, countryData) {
            selectFlg = true;
            jQuery('.js-dialCode').text('+' + countryData.dialCode);
            countryName = countryData.name;
            if (countryData.dialCode == 259) {
                var flag = jQuery('.selected-flag .iti-flag-add');
                flag.removeClass('iti-flag');
                flag.css({'position':'absolute', 'top': '10px'})
            } else if (countryData.dialCode == '') {
                var flag = jQuery('.selected-flag .js-other');
                flag.removeClass('iti-flag');
                flag.css({'position':'absolute', 'top': '10px'})
            } else{
                var flag2 = jQuery('.selected-flag .iti-flag');
                flag2.css({'position':'absolute', 'top': '0px'})
            }
            if (countryData.dialCode == '' || countryData.dialCode == undefined) {
                jQuery('.js-dialCode').text('');
                jQuery(".selected-flag .js-other").css({ 'box-shadow': 'none'});
            }
            jQuery('.js-phone-error').text('');
            if (countryData.dialCode < 10) {
                jQuery("#phone").css('padding-left', '75px');
            } else if (countryData.dialCode < 100) {
                jQuery("#phone").css('padding-left', '85px');
            } else if (countryData.dialCode < 1000) {
                jQuery("#phone").css('padding-left', '95px');
            } else if (countryData.dialCode < 10000) {
                jQuery("#phone").css('padding-left', '105px');
            }
        });

        // phone.focusin(function () {
        //     if (jQuery('.mydropdown').hasClass('hide')) {
        //         if (jQuery('.selected-flag .loading').length) {
        //             jQuery('.mydropdown').removeClass('hide');
        //             jQuery('html, body, .content').animate({scrollTop: 655}, 500);
        //         }
        //     }
        // });
        // phone.focusout(function () {
        //     if (!jQuery('.mydropdown').hasClass('hide')) {
        //         jQuery('.mydropdown').addClass('hide');
        //     }
        // });
    };

    ctrl.area();

    ctrl.getRequest = function (args) {
        var theRequest = {},
            url = window.location.search,
            strs = '',
            str = '';
        if (typeof args == 'string' && args.indexOf("=") != -1) {
            str = args;
        } else if (typeof args != 'undefined') {
            return theRequest;
        } else {
            if (url.indexOf("?") != -1) {
                str = url.substr(1);
            } else {
                return theRequest;
            }
        }
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
        return theRequest;
    }

    ctrl.setCache = function () {
        var para = ctrl.getRequest();
        var email = '';
        if (para && para.email) {
            email = para.email;
        } else {
            email = localStorage.getItem('email');
        }
        var phoneNumber = '';
        if (para && para.phoneNum) {
            var phoneNum = para.phoneNum;
            var index = phoneNum.indexOf(('-'));
            phoneNum = phoneNum.slice(index + 1);
            if (phoneNum) {
                phoneNumber = phoneNum;
            } else {
                phoneNumber = localStorage.getItem('phoneNumber');
            }
        } else {
            phoneNumber = localStorage.getItem('phoneNumber');
        }

        $('#Email').val(email);
        $('#phone').val(phoneNumber);
    };

    ctrl.setCache();

    $("#form").mvalidate({
        type:2,
        onKeyup:true,
        onFocusout: true,
        sendForm:false,
        firstInvalidFocus:true,
        valid:function(event,options){
            ctrl.submit();
            event.preventDefault();
        },
        invalid:function(event, status, options){
            //点击提交按钮时,表单未通过验证触发函数
        },
        eachField:function(event,status,options){

        },
        eachValidField:function(val){

        },
        eachInvalidField:function(event, status, options){
        },
        conditional:{
            // detailLength: function (val) {
            //     return val.length > 50 ? true : false;
            // }
        },
        descriptions:{
            productname:{
                required : 'Please enter the product name',
                valid : ''
            },
            quantity:{
                required : 'Please enter the quantity',
                valid : ''
            },
            detail : {
                required : 'Please enter detailed product description',
                //conditional : 'Please enter from 50 to 10000 characters',
                valid : ''
            },
            name:{
                required : 'Please enter your name',
                valid : ''
            },
            email:{
                required : 'Please enter your E-mail',
                pattern: 'Please enter a valid E-mail address',
                valid : ''
            },
            phone:{
                required : 'Please enter your phone number',
                valid : ''
            },
        }
    });

    $(".js-detail").keydown(function(e) {
        var contactUsContent =  $(".js-detail").val();
        var len = contactUsContent.length;
        var brLen;
        if (contactUsContent.match(/[\n]/g)) {
            brLen = contactUsContent.match(/[\n]/g).length;
        }
        var count;
        if (brLen) {
            count = (10000 - len - brLen);
        } else {
            count = (10000 - len);
        }
        if (count < 0) {
            count = 0;
        }
        if (count <= 0 && e.keyCode !== 8 && e.keyCode !== 37 && e.keyCode !== 38 &&
            e.keyCode !== 39 && e.keyCode !== 40 && e.keyCode !== 46) {
            event.returnValue = false;
        }
    });

    $(".js-detail").keyup(function() {
        var contactUsContent =  $(".js-detail").val();
        var len = contactUsContent.length;
        var brLen;
        if (contactUsContent.match(/[\n]/g)) {
            brLen = contactUsContent.match(/[\n]/g).length;
        }
        var count;
        if (brLen) {
            count = (10000 - len - brLen);
        } else {
            count = (10000 - len);
        }
        if (count < 0) {
            count = 0;
        }
        var detail = $('#buyingRequestDescriptionInfo');
        if (count < 7000) {
            detail.parent().find('.js-error').html("");
            detail.html('You can also continue to enter ' + ' <span class="redFont">' + count + '</span> ' + 'characters').css('visibility', 'visible');
            $('.js-attachment').css('margin-top', '30px');
        } else {
            detail.html('').css('visibility', 'visible');
            $('.js-attachment').css('margin-top', '0px');
        }
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
        var input = $("input[type=text]");
        input.keyup(function () {
            var value = $(this).val();
            var temp = ctrl.deleteSpecialChar(value);
            if (temp != value) {
                $(this).val(ctrl.deleteSpecialChar(temp));
            }
        });
        input.change(function () {
            var value = $(this).val();
            var temp = ctrl.deleteSpecialChar(value);
            if (temp != value) {
                $(this).val(ctrl.deleteSpecialChar(temp));
            }
        });

        var focusin = function (that) {
            var line = $(that).parent().find('div.js-line');
            if (line.length == 0) {
                line = $(that).parent().parent().find('div.js-line');
            }
            if (line.attr('flg') === 'true') {
                line.attr('flg', 'false');
                line.css('width', '0px');
                line.animate({
                    'background-color': '#00c873',
                    'width': '100%'
                }, 500, 'ease-out');
            }
            var height = '';
            if ($(that).attr('id') == 'productName') {
                height = '100xp';
            } else if ($(that).attr('id') == 'Quantity') {
                height = '150xp';
            } else if ($(that).attr('id') == 'Detail') {
                height = '200xp';
            } else if ($(that).attr('id') == 'personName') {
                height = '690xp';
            } else if ($(that).attr('id') == 'Email') {
                height = '690xp';
            } else if ($(that).attr('id') == 'phone') {
                height = '690xp';
            }
            //jQuery('html, body, .content').animate({'scrollTop': height});
        };
        var focusout = function (that) {
            var line = $(that).parent().find('div.js-line');
            if (line.length == 0) {
                line = $(that).parent().parent().find('div.js-line');
            }
            line.attr('flg', 'true');
            line.css('background-color', '#7f7f7f');
        };
        input.focusin(function () {
            var that = this;
            focusin(that);
        });
        input.focusout(function () {
            var that = this;
            focusout(that);
        });
        var textarea = $("textarea");
        textarea.keyup(function () {
            var value = $(this).val();
            var temp = ctrl.deleteSpecialChar(value);
            if (temp != value) {
                $(this).val(ctrl.deleteSpecialChar(temp));
            }
        });
        textarea.change(function () {
            var value = $(this).val();
            var temp = ctrl.deleteSpecialChar(value);
            if (temp != value) {
                $(this).val(ctrl.deleteSpecialChar(temp));
            }
        });
        textarea.focusin(function () {
            var that = this;
            focusin(that);
        });
        textarea.focusout(function () {
            var that = this;
            focusout(that);
        });
    };

    ctrl.validateValue();

    ctrl.scrollIntoView = function () {
        $('input[type="text"],textarea').on('click', function () {
            var target = this;
            setTimeout(function(){
                target.scrollIntoViewIfNeeded();
            },400);
        });
    };
    ctrl.scrollIntoView();

    ctrl.submit = function () {
        var input = $(".js-data");
        var submit = $('#submit');
        var data = {};
        data.productName = input[0].value;
        data.quantity = input[1].value;
        data.details = input[2].value;
        data.name = input[3].value;
        data.email = input[4].value;
        var dialCode = $('.js-dialCode').text();
        localStorage.setItem('email', data.email);
        localStorage.setItem('phoneNumber', input[5].value);
        if (input[5].value == ''){
            data.phone = dialCode + input[5].value;
        } else {
            data.phone = dialCode + '-' + input[5].value;
        }
        data.destination = countryName;
        data.source = "2";
        data.sourcingRequestAttachments = [];
        //data.originalImage = '1';

        // var others = jQuery(".selected-flag .js-other");
        // if (others.length == 0 && dialCode == '') {
        //     $('.js-phone-error').text('Please select your location');
        //     return;
        // }

        submit.attr("disabled", true);
        var wrapData = $('.js-wrapImg').children();
        var files = [];
        for (var i = 0, len = wrapData.length - 1; i < len; i++) {
            var temp = {};
            var path = $(wrapData[i]).find('img').attr('src');
            var index = path.lastIndexOf('.com');
            path = path.slice(index + 4);
            temp.filePath = path;
            temp.fileName = $(wrapData[i]).find('img').attr('fileName');
            files.push(temp);
        }
        data.sourcingRequestAttachments = files;

        var url = config.request.api.sourcingRequest;
        data = JSON.stringify(data);

        var myAjax = {
            url: url,
            async: true,
            crossDomain: true,
            type: "POST",
            cache: false,
            xhrFields: {withCredentials: true},
            data: data,
            dataType: 'json',
            contentType: "application/json",
            success: function (result) {
                if (result.statusCode === config.statusCode.SUCCESS) {
                    //location.href = config.link.home;
                    $.popup('.popup-about');
                    $('.js-done').click(function () {
                        //$.closeModal('.popup-about');
                        location.href = config.link.home;

                        ga("send", {
                            "hitType": "event",
                            "eventCategory": "Send Request",
                            "eventAction": "Submit",
                            "eventLabel": "Submit Request"
                        })

                        return false;
                    });

                    // var myTimer = $("#jump-time");
                    // var count = 15;
                    // var timer = setInterval(function () {
                    //     if (count > 1) {
                    //         myTimer.html('' + (--count));
                    //     } else {
                    //         //$('.js-done')[0].click()
                    //         location.href = config.link.home;
                    //         clearInterval(timer);
                    //     }
                    // },1000);

                    submit.removeAttr("disabled");
                } else {
                    submit.removeAttr("disabled");
                }
            }
        }
        $.ajax(myAjax);
    };

});
