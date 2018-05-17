X.define('modules.user.common', ['common.layer'], function (layers) {
	
	var loginRegist
    $.validator.addMethod('emailUsed', function(value, element) {
        var res
        $.ajax({
            type: "POST",
            url: X.config.user.api.verifyEmail,
            async: false,
            data: JSON.stringify({
                'email': value
            }),
            success: function (data) {
                if (data.statusCode == X.CONSTANT.statusCode.SUCCESS) {
                    res = data.data[0].code;
                }
            }
        })

        return res == '1'? false: true
    })
    
	var common = {
		init: function() {
            var dom = [
                '<div class="login-regist none">',
                '    <div class="js-login none"></div>',
                '    <div class="js-regist none"></div>',
                '</div>'
            ].join('')
            loginRegist = $(dom)
            $('body').append(loginRegist)
            common.jsLogin  = loginRegist.children('.js-login')
            common.jsRegist = loginRegist.children('.js-regist')

            //loginRegist.on('click', function(e) {
            //	if (e.target.className.indexOf('login-regist') > -1) {
            //		$(this).addClass('none')
	         //   	common.jsRegist.addClass('none')
	         //   	common.jsLogin.addClass('none')
            //	}
            //})
		},
        generateValidate: function(type,isCheckCode) {
            var regist = type === 'regist'? true: false
            var login = type === 'login'? true: false
            var isCheckCode = isCheckCode ==='true'?true:false;
            var validate = {
                rules: {
                    firstName:      { required: true, rangelength: [1, 30], isAllEnglish: true },
                    lastName:       { required: true, rangelength: [1, 30], isAllEnglish: true },
                    email:          { required: true, email: regist, rangelength: [1, 60], emailUsed: regist },
                    password:       { required: true, stringCheck: regist, isSpace: regist },              
                    checkCode:      { required: isCheckCode, verCode: isCheckCode }
                },
                messages: {
                    firstName:      { required: $.i18n.prop("user_first_name_required"),        rangelength: $.i18n.prop("user_first_name_length"), isAllEnglish:  $.i18n.prop("user_first_name_engilsh") },
                    lastName:       { required: $.i18n.prop("user_last_name_required"),         rangelength: $.i18n.prop("user_last_name_length"), isAllEnglish:  $.i18n.prop("user_last_name_engilsh") },
                    email:          { required: $.i18n.prop("user_email_required"),             emailUsed: $.i18n.prop("user_email_used"), email: $.i18n.prop("user_email_invalid"), rangelength: $.i18n.prop("user_email_length")},
                    password:       { required: $.i18n.prop("user_password_required"),          rangelength: $.i18n.prop("user_password_length"),  stringCheck: $.i18n.prop("user_password_invalid"), isSpace: $.i18n.prop("user_password_invalid") },
                    checkCode:      { required: $.i18n.prop("user_verification_code_required"), verCode: $.i18n.prop("user_verification_code_error")  }
                },
                onkeyup: false,
                onfocusout: function (element) {
                    var elem = $(element);
                    elem.valid();
                },
                errorPlacement: function (error, element) {
                    element.after(error)
                    var width = element.parent().width() - 8,
                        marginLeft = -2

                    element.attr('name') === 'checkCode' && (width = 436, marginLeft = 5)
                    error.css({width: width, 'margin-left': marginLeft })

                }
            }

            return validate
        },
        serverError: function() {
            layers.alert($.i18n.prop("user_server_error"))
        },
        oauthSign: function(tar) {
            var links  = X.config.oauth.link,
                re_url =  "",
                register_url
                if(location.href == X.config.PATH_FILE.path.root+"/agent/agent-register.html"){
                    re_url = '?redirect_uri=' + location.href
                   
                }else{
                    re_url = '?redirect_uri=' + X.config.PATH_FILE.path.root
                }
                

            for (var i in links) {
                tar.find('.' + i + '-link').attr('href', links[i] + re_url)
            }
        },
        addInterface: function(ctrl) {
            for (var i in interfaces) {
                ctrl[i] = interfaces[i]
            }
        },
        switchLoginRegist: function(el) {
            $('.loginRegistSwitch', el).on('click', function(e) {
                loginRegist.children().each(function(i, item) {
                    $(item).toggleClass('none')
                })
            })
        },
        registrationSuccessful:function(){
            var content = $(".js-regist-successful").html();
            var layerIndex = layer.open({
                id: 'registLayer',
                title: '',
                content: content,
                btn: [],
                closeBtn: 0,
                fixed: true,
                resize: false,
                move: false,
                area: ['644', '243'],
                success: function () {
                    var hyperLink = $(".js-free-to-source")
                    $('#registLayer').parent().find(".layui-layer-content").css({"padding":"0","height":"243px","width":"644px"});
                    hyperLink.attr('href', X.config.common.link.freeSource);
                    var myTimer = $("#registLayer #timer");
                    var count = 30;
                    var timer = setInterval(function () {
                        if (count > 1) {
                            myTimer.html('' + (--count));
                        } else {
                            location.href = X.config.common.link.home;
                            layer.close(layerIndex);
                            clearInterval(timer);
                        }
                    },1000);
                    hyperLink.click(function(){
                        layer.close(layerIndex);
                        clearInterval(timer);
                    });
                }
            });
        },
        showCode: function(viewHtml) {
            var data = new Date().getTime().toString();
            $('#code', viewHtml).attr("src", X.config.imageVerification.imageVerificationController + "/ImageVerificationCode/create/" + data);
        }
	};

    var interfaces = {
        bindShowView: function(el) {
            var me = this
            el.on('click', function(e) {
                loginRegist.toggleClass('none')
                me.view.el.toggleClass('none')
                loginRegist.find('label.error').hide()
            })
            common.oauthSign(me.view.el)
        },
        showView: function() {
            loginRegist.find('label.error').hide()
            this.view.el.removeClass('none')
            loginRegist.removeClass('none')
        },
        hideView: function() {
            this.view.el.addClass('none')
            loginRegist.addClass('none')
        },
        success: function(data) {
            var me = this
            this.hideView()
            X.publish(X.CONSTANT.channel[me.name + 'Success'], data)
        }
    };
	common.init()

	return common
})