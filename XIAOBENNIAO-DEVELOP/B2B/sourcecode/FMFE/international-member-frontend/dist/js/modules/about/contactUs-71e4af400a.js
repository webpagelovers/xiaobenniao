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
            $(document).attr("title", "Contact Us |  Finding Buying And Sourcing Agents In China  : Weintrade.com");
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
                        required: "Please enter your name",
                        maxlength: "The max characters should be within 128 characters",
                        nonChinese: "Please enter your name in English only"
                    },
                    email: {
                        required: "Please enter a valid Email address",
                        maxlength: "The max characters should be within 60 characters",
                        email: "Please enter a valid email address"
                    },
                    subject: {
                        required: "Please enter Subject",
                        nonChinese: "Enter english only",
                        maxlength: "The max characters should be within 128 characters"
                    },
                    message: {
                        required: "Please enter the message content",
                        nonChinese: "Enter english only",
                        maxlength: "The max characters should be within 10000 characters"
                    }
                    // code: {
                    //     required: "Please input correct verification code according to the characters in the picture",
                    //     verCode: function() {
                    //         return "Please input correct verification code according to the characters in the picture";
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
                if (count < 9990) {
                    contactUs.view.el.find('#contactUsMessageInfo').parent().find('.js-error').html("");
                    contactUs.view.el.find('#contactUsMessageInfo').html("You can also continue to enter" + ' <span class="redFont">' + count + '</span> ' + "characters").show(300);
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
                                    title: "Submit Successfully",
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