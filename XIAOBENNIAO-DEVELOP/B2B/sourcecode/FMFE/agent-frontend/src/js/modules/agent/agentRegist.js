X.define('modules.agent.additionalInfo', ["model.agentModel", "modules.common.global", "modules.user.login", "modules.user.regist", "modules.common.multipleFiles","modules.common.checkIsIE", "modules.agent._validate", "modules.common.suspensionBox"], function (model, global, login, regist, multipleFiles, checkIsIE, _validate) {

    var view = X.view.newOne({
        el: $('.js-agent-regist'),
        url: X.config.agent.tpl.agentRegist,
        res: X.config.agent.res.buyRequest
    });

    var ctrl = X.controller.newOne({    
        view: view
    });

    ctrl.countryData = {};
    ctrl.area = function () {
        $("#phone").intlTelInput({           
            preferredCountries: ["cn"],   
            utilsScript: "js/lib/utils.js"
        });
        ctrl.countryData.dialCode=86;
        $(".js-other").css({'background-color': 'white', 'box-shadow': 'none'});
        $(".js-other").parent().parent().find('.dial-code').text('');
        $(".iti-flag-add").removeClass('iti-flag');
        $("#phone").on("countrychange", function(e, countryData) {
            $('.js-dialCode').text('+' + countryData.dialCode);
            ctrl.countryData.dialCode = countryData.dialCode
            if (countryData.dialCode == 259) {
                var flag = jQuery('.selected-flag .iti-flag-add');
                flag.removeClass('iti-flag');
                flag.css({'position':'absolute', 'top': '15px'})
            } else {
                var flag2 = jQuery('.selected-flag .iti-flag');
                flag2.css({'position':'absolute', 'top': '0px'})
            }
            if(countryData.dialCode != 86){
                    ctrl.validate.rules.mobile ={
                        required: true,                        
                        isInternationalCall:true,
                        maxlength:10,
                        verifyMobile:true,
                    }
            }else{
                    ctrl.validate.rules.mobile ={
                        required: true,                        
                        isMobile:true, 
                        verifyMobile:true,
                    }
            }
        });
    };
    ctrl.validate = {
        rules: {
            firstName: {
                required: true,
                rangelength: [4, 20],
                isWordNumBar:true,
                checkUserName:true
            },
            mobile: {
                required: true,
                isMobile:true,                
                isInternationalCall:true,
                verifyMobile:true
            },
            VerificationCode : {
                required: true,
                aeraMobileCode:true
            },
            email:{
                required:true,
                email: true,
                isEmail:true
            },
            password:{
                required:true,
                rangelength: [6, 14],
                stringCheck: true, 
                isSpace: true 
            },
            ConfirmPassword:{
                required:true,
                equalTo:"#Password"
            }
        },
        messages: {
            firstName: {
                required: "Please enter your User Name",
                rangelength:"The characters should between 4-20 characters",
                isWordNumBar:'Format error, support only letters, numbers, "-" ,"_"',
                checkUserName:"User Name is already existed"
            },
            mobile: {
                required: "Please enter your Phone Number",
                isMobile:"Please enter the correct phone number",
                verifyMobile:"Phone Number is already existed",
                isInternationalCall:"Please enter the correct phone number",
                maxlength:"Please enter the correct phone number"
            },
            VerificationCode: {
                required: "Please enter the Verification Code",
                aeraMobileCode:"Please enter the correct verification code"
            },
            email:{
                required:"Please enter your email",
                email:"Please enter a valid email address",
                isEmail:"This Email has been used"
            },
            password:{
                required:"Please enter your password",
                rangelength: "Please enter your password between 6-14 characters",
                stringCheck: "Support numbers, letters, and punctuation, space is not allowed", 
                isSpace: "Support numbers, letters, and punctuation, space is not allowed" 

            },
            ConfirmPassword:{
                required:"Please Confirm your password",
                equalTo:"Inconsistent with the first input password"
            }
        },
        onkeyup: false,
        onfocusout: function (element) {
            var elem = $(element);
            elem.valid();
        },
        errorPlacement: function (error, element) {
            var errorWrap = element.parent().find(".js-error");
                errorWrap.html("");
                error.appendTo(errorWrap);

           /* element.after(error);
            error.css({position: "absolute", "left": "0","bottom":"-20px" })*/
        }
        // showErrors : function (errorMap, elementList) {
        //     var a =0;
        // }
    };
    ctrl.GetQueryString = function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
            var context = "";
            if (r != null)
                context = r[2];
            reg = null;
            r = null;
            return context == null || context == "" || context == "undefined" ? "" : context;
        }
    var events = {
        init: function() {
            var that = this;
            ctrl.area();
            ctrl.view.el.find("form").validate(ctrl.validate);
            ctrl.vmdata = ctrl.getViewModel(ctrl.view.find(".js-agent-regist-form"));
            ctrl.vmdata.initControl();
            ctrl.view.find(".js-regist-submit").click(function(){that.submit()});
            ctrl.view.find(".js-telCode").click(function(){ctrl.dataTime($(this),60)})
            login.bindShowView($('.js-signIn', view.el));
            ctrl.view.find(".selected-flag").focusin(function(){
                ctrl.view.find(".js-mobile-foucs").css("border-color","#00ad36")
            })
            ctrl.view.find(".selected-flag").focusout(function(){
                ctrl.view.find(".js-mobile-foucs").css("border-color","#d1d1d1")
            })
            ctrl.view.find(".js-dialCode").text("+86")
            var agentMobile =  ctrl.view.find("input[name='mobile']")   
            var jsTelCode = ctrl.view.find(".js-telCode")  
            agentMobile.blur(function(){
                var valid = agentMobile.valid()
                valid ? jsTelCode.addClass('activ'): jsTelCode.removeClass('activ');   
            })
        },
        submit: function() {
            if (ctrl.view.el.find("form").valid()) {
                var data = ctrl.vmdata.collectData();
                model.aegenSubmit(data,function(res){
                    if (res.statusCode == X.constructor.prototype.CONSTANT.statusCode.SUCCESS) {
                        var user = {};
                            res.data ? (res.data[0].email ? user.email = res.data[0].email : '') : '';
                            res.data ? (res.data[0].mobile ? user.mobile = res.data[0].mobile : '') : '';
                            res.data ? (res.data[0].firstName ? user.firstName = res.data[0].firstName : '') : '';
                            document.cookie = "user=" + JSON.stringify(user) + ";path='/' " ;
                        window.location.href = X.config.common.link.additionalIinfo + "?id=" + ctrl.GetQueryString("id")

                    }
                })
            }

        }
    };
    //发送短信验证码
    ctrl.dataTime = function (val, countdown) {
        var jsTelCode = ctrl.view.find(".js-telCode")  
        if ( !jsTelCode.hasClass('activ') ) return;
        var countdown = countdown ? countdown : 60;
        var _this = val ? val : $(this);

        var data = ctrl.vmdata.getValue("mobile");
        var promptInfo = ctrl.view.find(".js-errorMessage");
        var areaMobile = "+"+ ctrl.countryData.dialCode +  data.mobile
        ctrl.countryData.dialCode == 86 ? type = 0 :type = 1
        promptInfo.html('');
        model.msgCode(areaMobile,type,function(result){    
            if (result.statusCode == X.constructor.prototype.CONSTANT.statusCode.SUCCESS) {

                ctrl.setTime(_this, countdown);
            }else if (result.statusCode == "20006002") {
                promptInfo.html("You are sending too often,please try again later");
            } else{
                promptInfo.html("Failed to send verification code");
            }               


        });
    };
    //60S后重新发送验证码
    ctrl.setTime = function(val, countdown){
        if (countdown == 0) {
            val.removeAttr("disabled")
            val.val("Send Code");
            countdown = 0;
            return;
        } else {
            val.attr("disabled", true);
            val.val( countdown + "S");
            countdown--;
        }
        setTimeout(function () {
            ctrl.setTime(val, countdown)
        }, 1000);
    };

    //验证短信验证码，因为需要拿到区号所以放在这里
    $.validator.addMethod("aeraMobileCode", function (value, element) {

        var flag = 0;

        $.ajax({
            type: "PUT",
            url: X.config.imageVerification.imageVerificationController + "/VerificationCode/check?" + "mobile="+"%2B"+ ctrl.countryData.dialCode+ctrl.vmdata.getValue("mobile").mobile+"&verificationCode="+value,
            async: false, //同步方法，如果用异步的话，flag永远为1
            success: function (data) {
                if (data.statusCode == '2000000') {
                    flag = 1;
                }else{
                    flag = 0;
                }
            }
        });

        if (flag == 1) {
            return true;
        } else if(flag == 0){
            return false;
        }

    }, "验证码输入错误!");
    ctrl.load = function() {
        view.render(function() {
            events.init();
        })
    };
    ctrl.load();
    X.require(["modules.common.loadingTime"]);
    return ctrl
});
