X.define("modules.contactUs", ["modules.common.global","model.contactUsModel","modules.common.cookies", "model.userModel"], function (global, contactUsModel, cookies, userModel) {
    //初始化视图对象
    var view = X.view.newOne({
        el: $(".js-myContactUs"),
        url: X.config.about.tpl.contactUs,
        res : X.config.about.res.contactUs
    });

    //初始化控制器
    var contactUs = X.controller.newOne({
        view: view
    });

    contactUs.rendering = function () {
        return view.render(function () {
            $(document).attr("title", $.i18n.prop("about_contactUs_title"));
            contactUs.view.el.find("#message").text('');
            //获取数据
            contactUs.vmcontactUs = contactUs.getViewModel(contactUs.view.el.find(".js-contactUsInfo"));
            contactUs.vmcontactUs.initControl();

            userModel.userInfo(function(resp) {
                if (resp.statusCode === X.constructor.prototype.CONSTANT.statusCode.SUCCESS) {
                    var data = resp.data[0];
                    contactUs.view.el.find(".js-email").val(data.email);

                } else {
                    var para = X.getRequest();
                    var email = '';
                    if (para && para.email) {
                        email = para.email;
                    } else {
                        email = cookies.getCookies("email");
                    }
                    contactUs.view.el.find(".js-email").val(email);
                }
            });


            contactUs.validate = {
                ignore: ".ignore",
                rules: {
                    firstName: {
                        required: true,
                        maxlength: 128,
                        nonChinese: true
                    },
                    email: {
                        required: true,
                        maxlength: 60,
                        email: true
                    },
                    subject: {
                        required: true,
                        nonChinese: true,
                        maxlength: 128
                    },
                    message: {
                        required: true,
                        nonChinese: true,
                        maxlength: 10000
                    }
                    // code: {
                    //     required: true,
                    //     verCode:true
                    // }
                },
                messages: {
                    firstName: {
                        required: $.i18n.prop("about_contactUs_firstName_required"),
                        maxlength: $.i18n.prop("about_contactUs_firstName_maxlength"),
                        nonChinese: $.i18n.prop("about_contactUs_firstName_isEnglish")
                    },
                    email: {
                        required: $.i18n.prop("about_contactUs_email_required"),
                        maxlength: $.i18n.prop("about_contactUs_email_maxlength"),
                        email: $.i18n.prop("about_contactUs_email_email")
                    },
                    subject: {
                        required: $.i18n.prop("about_contactUs_subject_required"),
                        nonChinese: $.i18n.prop("about_contactUs_onlyEnglish"),
                        maxlength: $.i18n.prop("about_contactUs_subject_maxlength")
                    },
                    message: {
                        required: $.i18n.prop("about_contactUs_message_required"),
                        nonChinese: $.i18n.prop("about_contactUs_onlyEnglish"),
                        maxlength: $.i18n.prop("about_contactUs_message_maxlength")
                    }
                    // code: {
                    //     required: $.i18n.prop("about_contactUs_code_required"),
                    //     verCode: function() {
                    //         return $.i18n.prop("about_contactUs_code_verCode");
                    //     }
                    // }
                },
                onkeyup: false,
                onfocusout: function (element) {
                    var elem = $(element);
                    elem.valid();
                },
                success: function (value, element) {

                },
                // showErrors: function(errorMap, errorList) {
                //     this.numberOfInvalids();
                // },
                errorPlacement: function (error, element) {
                    error.appendTo(element.parent().find(".js-error"));
                }
            };
            contactUs.view.el.find(".js-contactUsInfo").validate(contactUs.validate);

            //图片验证码
            contactUs.changeCode =function(){
                var data = new Date().getTime().toString();
                var img = contactUs.view.el.find("#code");
                img.attr("src", X.config.imageVerification.imageVerificationController + "/ImageVerificationCode/create/"+data);
            };
            contactUs.changeCode();
            contactUs.view.el.find(".js-changeCode").click(function() {
                contactUs.changeCode();
            });
            contactUs.view.el.find(".validateImg").click(function() {
                contactUs.changeCode();
            });

            contactUs.view.el.find("#message").keydown(function(e) {
                var contactUsContent =  contactUs.view.el.find("#message").val();
                var len = contactUsContent.length;
                var isChrome = $.browser["chrome"] === true;
                var brLen;
                if (contactUsContent.match(/[\n]/g)) {
                    brLen = contactUsContent.match(/[\n]/g).length;
                }
                var count;
                if (brLen && isChrome) {
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

            contactUs.view.el.find("#message").keyup(function(data) {
                var contactUsContent =  contactUs.view.el.find("#message").val();
                var len = contactUsContent.length;
                var isChrome = $.browser["chrome"] === true;
                var brLen;
                if (contactUsContent.match(/[\n]/g)) {
                    brLen = contactUsContent.match(/[\n]/g).length;
                }
                var count;
                if (brLen && isChrome) {
                    count = (10000 - len - brLen);
                } else {
                    count = (10000 - len);
                }
                if (count < 0) {
                    count = 0;
                }
                if (count < 7000) {
                    contactUs.view.el.find('#contactUsMessageInfo').parent().find('.js-error').html("");
                    contactUs.view.el.find('#contactUsMessageInfo').html($.i18n.prop("about_contactUs_messageInfo_before") + ' <span class="redFont">' + count + '</span> ' + $.i18n.prop("about_contactUs_messageInfo_after")).show(300);
                    contactUs.view.el.find(".js-button").css({'margin-top': '50px'});
                } else {
                    contactUs.view.el.find('#contactUsMessageInfo').html('').hide(300);
                    contactUs.view.el.find(".js-button").css({'margin-top': '35px'});
                }
            });

            contactUs.view.el.find(".js-button").click(function(){
                view.el.find(".js-code-content-copy").val(view.el.find(".js-code-content").val());
                if (contactUs.view.el.find('.js-contactUsInfo').valid()) {
                    contactUs.google_analytics_submit_button();
                    var that = $(this);
                    var data = contactUs.vmcontactUs.collectData();
                    delete data.code;
                    var temp = {};
                    var x;
                    for (x in data) {
                        if (data[x] !== '') {
                            temp[x] = data[x];
                        }
                    }
                    var cookie = {};
                    cookie.name = "email";
                    cookie.value = data.email;
                    cookie.expire = (30 * 24);
                    cookie.overwrite = true;
                    cookies.setCookies(cookie);
                    var callback = function(data) {
                        if (data.statusCode === 2000000) {
                            var content = $('.js-layer').html();
                            that.attr("disabled", false);
                            var layerIndex = layer.open({
                                    title: $.i18n.prop("about_contactUs_layer_title"),
                                    content: content,
                                    btn: [],
                                    closeBtn: 0,
                                    fixed: true,
                                    resize: false,
                                    move: false,
                                    area: ['480px', '240px'],
                                    success: function () {
                                        $(".js-close").click(function () {
                                            layer.close(layerIndex);
                                            //window.close();
                                            open(location, '_self').close();
                                        });
                                    },
                                    end: function () {
                                        that.removeAttr("disabled");
                                    }
                                }
                            );
                        } else {
                            that.attr("disabled", false);
                        }
                    };
                    that.attr("disabled", true);
                    contactUsModel.contactUs(temp, callback);
                }
            });
        });
    };


    //google analytics submit_button(google analytics转化率)
    contactUs.google_analytics_submit_button = function(){
        ga('send', {
            hitType: 'event',
            eventCategory: 'Contact',
            eventAction: 'Submit',
            eventLabel: 'Send Message'
        });
    };

    contactUs.load = function (argument) {
        contactUs.rendering();
    };

    contactUs.load();

    return contactUs;
});