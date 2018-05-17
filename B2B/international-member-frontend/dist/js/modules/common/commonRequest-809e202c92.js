X.define("modules.common.commonRequest",["model.productsModel", "modules.user.login", "modules.user.regist", "adapter.searchValidate","modules.common.multipleFiles","modules.common.checkIsIE", "modules.common.suspensionBox","modules.common.cookies","model.userModel"],function (productsModel, login, regist, searchValidate,multipleFiles,checkIsIE,suspensionBox,cookies,userModel) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".js-common-request"),
        url: X.config.common.tpl.commonRequest,
        res :X.config.request.res.sourcingRequest
    });

    //初始化控制器
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
        ctrl.view.el.find("input,textarea").on("keyup change",function(){
            var value = $(this).val();
            var temp = ctrl.deleteSpecialChar(value);
            if (temp != value) {
                $(this).val(ctrl.deleteSpecialChar(temp));
            }
        })
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
    ctrl.UserInfo = function(){
            var emailHtml = ctrl.view.find("input[name='email']")
            var phoneNumberHtml = ctrl.view.find("input[name='phone']")
            var urlEmail = ctrl.GetQueryString('email')
            var urlPhone = ctrl.GetQueryString('phoneNum')
            var phoneNumber = cookies.getCookies('phoneNumber') || '';
            if (urlEmail ) {
                if (urlPhone) {
                    phoneNumberHtml.val(urlPhone)
                }else{
                    phoneNumberHtml.val(phoneNumber)
                }
                emailHtml.val(urlEmail)
                
            }else{
                userModel.userInfo(function(resp){      
                    if (resp.statusCode === X.constructor.prototype.CONSTANT.statusCode.SUCCESS) {
                        var data = resp.data[0]
                        if (data.mobile) {
                            phoneNumberHtml.val(data.mobile)
                        }else{
                            phoneNumberHtml.val(phoneNumber)
                        }
                        emailHtml.val(data.email)
                        
                    }else{
                        var email = cookies.getCookies('email') || '';                    
                        emailHtml.val(email)
                        phoneNumberHtml.val(phoneNumber)
                    }

                })
            }

          
     
    }

    var events = {
        init:function(){
            if (location.href.indexOf('import') == -1) {
                $(document).attr("title", "Find Quality China Wholesale Product Suppliers : Weintrade.com");
            }
            ctrl.registForm = view.el.find("form");
            var meta = {
                "productImage": {
                    width:56,
                    height:58,
                    size: 15,
                    type: 18,
                    maxNum: 10,
                    accept: {
                        extensions: 'gif,jpg,jpeg,png,xlsx,xls,csv,ppt,pptx,doc,docx,txt,pdf,zip,rtf,key,numbers,pages,mp3,bmp,tiff,rm,rmvb,wmv,avi,3gp,dat,dmv,amv',
                        mimeTypes: '.gif,.jpg,.jpeg,.png,.xlsx,.xls,.csv,.ppt,.pptx,.doc,.docx,.txt,.pdf,.rm,.rmvb,.wmv,.avi'

                    },
                    filePicker: ".myFilePicker",
                    filePickerLabel: "Attachment",
                    cancel: true,
                    uploadSuccess: ctrl.uploadSuccess,
                    uploadBeforeSend: ctrl.uploadBeforeSend,
                    cancel: ctrl.cancel
                }
            };
            ctrl.viewModel = ctrl.getViewModel(ctrl.registForm, {meta: meta});
            ctrl.viewModel.initControl();

            setTimeout(function () {
                ctrl.view.el.find(".myFilePicker input").removeAttr('multiple');
            }, 1000);
            ctrl.UserInfo();
            if ($.browser["msie"]==true && parseInt($.browser["version"])<10) {
                var index = layer.msg('<span style="font-size: 24px;line-height: 29px">You are using an outdated version of Internet Explorer. The attachment upload is not supported.</span>', {
                    id: 'myLayerMsgForIE',
                    time: 10000,
                    area: ['640px', '80px']
                });
                $('#myLayerMsgForIE').parent().css('border-radius', '0px');
            }

            ctrl.view.el.find(".webuploader-pick").css('border-radius', '5px')

            ctrl.validate = {
                rules: {
                    productName: {required: true},
                    email: {required: true, email: true},
                    details: {required: true}
                },
                messages: {
                    productName: {
                        required: "Please enter the product name"
                    },
                    email: {
                        required: "Please enter the E-mail",
                        email: 'Please enter a valid E-mail address'
                    },
                    details: {
                        required: "Please enter the details of the products"
                    }
                },
                onkeyup: false,
                onfocusout: function (element) {
                    var elem = $(element);
                    var flg = elem.valid();
                    ctrl.myValidate(elem, flg);
                },
                errorPlacement: function (error, element) {
                    element.after(error);
                    ctrl.getDataSource() == 0 ? error.css({position: "absolute", "left": "154px","bottom":"-20px" }) 
                                              :error.css({position: "absolute", "left": "157px","bottom":"-20px" })
                    
                    /*var elem = $(element);
                    var errorWrap = element.parent().find(".js-error");
                    errorWrap.html("");
                    error.appendTo(errorWrap);
                    ctrl.myValidate(elem, false);*/
                }
                // showErrors : function (errorMap, elementList) {
                //     var a =0;
                // }
            };
            ctrl.view.el.find("form").validate(ctrl.validate);
            ctrl.view.el.find(".js-description").keydown(function(e) {
                var contactUsContent =  ctrl.view.el.find(".js-description").val();
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

            ctrl.view.el.find(".js-description").keyup(function(data) {
                var contactUsContent =  ctrl.view.el.find(".js-description").val();
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
                    ctrl.view.el.find('#myUpload').css('margin-top', '50px');
                    ctrl.view.el.find('#buyingRequestDescriptionInfo').parent().find('.js-error').html("");
                    ctrl.view.el.find('#buyingRequestDescriptionInfo').html("You can also continue to enter" + ' <span class="redFont">' + count + '</span> ' + "characters").show(300);
                } else {
                    ctrl.view.el.find('#myUpload').css('margin-top', '15px');
                    ctrl.view.el.find('#buyingRequestDescriptionInfo').html('').hide(300);
                }
            });
            ctrl.view.el.find(".js-description").val('');

            if (location.href.indexOf('import') !== -1) {
                $('.js-buyingRequest').unbind('click');
                $('.js-buyingRequest').click(function () {
                    $('html, body').animate({
                        scrollTop: $("#rfq").offset().top - 20
                    },100);
                });
            } else {
                $('.suspensionBox > li').eq(4).hide().parent().show();
            }


            ctrl.validateValue();
            ctrl.area();
            ctrl.setStyle();
            ctrl.view.find(".js-description").focusin(function () {
                $(this).attr('placeholder', '');                
            });
            ctrl.view.find(".js-description").focusout(function () {
                $(this).attr('placeholder',"Please indicate your detailed requirements,including material,size/dimension,grade/quality standard,packaging requirements and/or others.");
            });
             ctrl.view.find(".selected-flag").focusin(function () {                
                $(".js-change-border").css('border', '1px solid #00ad36');
            });
            ctrl.view.find(".selected-flag").focusout(function () {
                $(".js-change-border").css('border', '1px solid #cccccc');
            });
        
            
        }
    };

    ctrl.myValidate = function (elem, flg) {
        var box = elem.parent().parent();
        if (box.hasClass("js-box")) {
            if (flg) {
                flg = box.hasClass("js-textarea");
                if (flg) {
                    box.animate({"margin-bottom":"0px"});
                } else {
                    box.animate({"margin-bottom":"20px"});
                }
                box.find("img").css("visibility", "hidden");
                box.find('textarea').css('border-color', '#cccccc');
                box.find('input').css('border-color', '#cccccc');
            } else {
                flg = box.hasClass("js-textarea");
                if (flg) {
                    box.animate({"margin-bottom":"29px"});
                    box.find('textarea').css('border-color', '#993333');
                } else {
                    box.animate({"margin-bottom":"36px"});
                    box.find('input').css('border-color', '#993333');
                }
                box.find("img").css("visibility", "visible");
            }
        }
    };

    ctrl.uploadBeforeSend = function (that, data) {
        var a = '<div class="wrapUpload loading" style="display: block"><img src="images/loading.gif" class="poa" style="top:1px;"><span class="accessory col66 myFileLoading" style="background-color: white;padding: 0px 10px 0px 12px">' + data.name + '</span><span class="redFont cancel" style="right: auto;top:2px"><img src="images/delete.jpg"></span></div>';
        $(that.wrapData).append(a);
    };

     ctrl.uploadSuccess = function (result, wrap) {
        var showUpload = view.el.find(".showUpload");
        var name = view.el.find(".js-name");
        var myContent = $("#myContent");
        var wrapHtml = $(".js-common-request")
        if (wrap.length >= 10) {
            showUpload.hide();
            name.css('margin-top', '20px');
            myContent.height(1032);
        } else {
            showUpload.show();
            name.css('margin-top', '35px');
            var height = myContent.height() + 30;
            var bottom = wrapHtml.css("bottom");
            myContent.height(height);
            ctrl.getDataSource() == 0 ? wrapHtml.css('bottom',bottom) :
            wrapHtml.css('bottom',parseInt(bottom) - 10)
        }
    };

    ctrl.cancel = function (wrap) {
        var showUpload = view.el.find(".showUpload");
        var name = view.el.find(".js-name");
        var myContent = view.el.find("#myContent");
         var wrapHtml = $(".js-common-request")
        if (wrap.length >= 10) {
            showUpload.hide();
            name.css('margin-top', '20px');
        } else if (wrap.length === 4) {
            showUpload.show();
            name.css('margin-top', '35px');
            myContent.height(935);
        } else {
            showUpload.show();
            name.css('margin-top', '35px');
            var height = myContent.height() - 30;
            var bottom = wrapHtml.css("bottom");
            myContent.height(height);
            ctrl.getDataSource() == 0 ? wrapHtml.css('bottom',bottom) :
            wrapHtml.css('bottom',parseInt(bottom) + 10)
        }
    };

    ctrl.submitInfo = function () {
        if (ctrl.view.el.find("form").valid()) {
            ctrl.google_analytics_submit_button();
            var that = $(this.that);
            var data = ctrl.viewModel.collectData();
            var wrapData = view.el.find(".js-wrapData .accessory");
            var files = [];
            for (var i = 0, len = wrapData.length; i < len; i++) {
                var temp = {};
                var path = $(wrapData[i]).attr('path');
                temp.filePath = path;
                temp.fileName = $(wrapData[i]).html();
                files.push(temp);
            }
            delete data.productImage;
            data.sourcingRequestAttachments = files;
            //data.originalImage = "1";
            var countryData = $("#phone").intlTelInput("getSelectedCountryData");
            data.destination = countryData.name;
            if (data.phone){
                data.phone ="+"+ countryData.dialCode +"-"+ data.phone;
            }else{
                data.phone ="+"+ countryData.dialCode;
            }
            data.source = ctrl.getDataSource();
            //data.phone ="+"+ countryData.dialCode +"-"+ data.phone;
            that.attr("disabled", true);
            productsModel.postSourcingRequest(data, function (res) {
                if (res.statusCode == X.constructor.prototype.CONSTANT.statusCode.SUCCESS) {
                    var emailInfo = {}; emailInfo.name = "email";emailInfo.value = data.email; emailInfo.expire = (30 * 24); emailInfo.overwrite = true;
                    cookies.setCookies(emailInfo);
                    var phoneNumberInfo = {}; phoneNumberInfo.name = "phoneNumber";phoneNumberInfo.value = ctrl.viewModel.getValue("phone").phone; phoneNumberInfo.expire = (30 * 24); phoneNumberInfo.overwrite = true;
                    cookies.setCookies(phoneNumberInfo);

                    var content = $('.js-layer').html();
                    that.attr("disabled", true);
                    var layerIndex = layer.open({
                        id: 'myLayer',
                        title: '',
                        content: content,
                        btn: [],
                        closeBtn: 0,
                        fixed: true,
                        resize: false,
                        move: false,
                        area: ['565px', '320px'],
                        success: function () {
                            $(".js-close").click(function () {
                                location.href = X.config.common.link.home;
                                layer.close(layerIndex);
                            });
                            $(".js-close").hover( function(event){
                                $(this).css("color", "#FFFFFF");
                                $(this).css("background-color", "#00ad36");
                            }, function(event){
                                $(this).css("color", "#00ad36");
                                $(this).css("background-color", "#FFFFFF");
                            });
                            $(".js-close").css('border-radius', '5px');
                            var myTimer = $("#myLayer #timer");
                            var count = 15;
                            var timer = setInterval(function () {
                                if (count > 1) {
                                    myTimer.html('' + (--count));
                                } else {
                                    location.href = X.config.common.link.home;
                                    layer.close(layerIndex);
                                    clearInterval(timer);
                                }
                            },1000);
                        },
                        end: function () {
                            that.removeAttr("disabled");
                        }
                    });

                    $('#myLayer').parent().css('border-radius', '0px');
                } else {
                    that.removeAttr("disabled");
                }
            })
        }
    };
    ctrl.addEvent("click", ".js-submit", "submitInfo");
    X.subscribe(X.CONSTANT.channel.loginSuccess, function(channelName, data) {
        login.hideView();
    });

    X.subscribe(X.CONSTANT.channel.registSuccess, function(channelName, data) {
        regist.hideView();
    });
    //google analytics submit_button(google analytics转化率)
    ctrl.google_analytics_submit_button = function(){
        if(location.pathname == '/request/sourcing-request.html'){
            ga('send', {
                hitType: 'event',
                eventCategory: 'Request',
                eventAction: 'Submit',
                eventLabel: 'Submit Request'
            });
        }else{
            ga('send', {
                hitType: 'event',
                eventCategory: 'P Request',
                eventAction: 'P Submit',
                eventLabel: 'Submit P Request'
            });
        }
    }
    // 获取URL地址,根据不同的URL来判断不同的data.source
    ctrl.getDataSource = function(){
        var url = window.location.pathname
        var source = productsModel.consts.source
        var datalength = source.length
        for(var i = 0; i<source.length; i++){
            if (url == source[i].value) {
                return source[i].key
            }
        }
    }
    // 因原来的rfq布局跟品类也些出入，所以rfq样式有些细微的调整
    ctrl.setStyle = function(){
        var fileHtml = ctrl.view.find(".js-wrapData");
        var surplusHtml = ctrl.view.find("#buyingRequestDescriptionInfo")
        var requestHeader = ctrl.view.find(".js-request-header")
        surplusHtml.hide();
       ctrl.getDataSource() == 0 ?fileHtml.css("margin-left","154px") && surplusHtml.css("left","54px") && requestHeader.hide(): 
                        fileHtml.css("margin-left","154px") && surplusHtml.css("left","53px") && requestHeader.show()
    }
    ctrl.load = function () {        
        view.render(function() {
            events.init()
        })
    };
    ctrl.load();

    return ctrl;
});