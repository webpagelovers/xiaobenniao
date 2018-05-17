X.define('modules.user.login', ['model.userModel', 'modules.user.common', 'common.layer'], function (userModel, common, layer) {

    var view = X.view.newOne({
        el: common.jsLogin,
        url: X.config.user.tpl.login,
        res: X.config.user.res.login
    })

    var ctrl = X.controller.newOne({
        view: view
    })


    ctrl.name = 'login'
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
        init: function () {
            var me = this,
                registSubmit = $('#login-submit', view.el),
                rememberMe = $('#remember', view.el),
                jsChangeCode = $('.js-changeCode', view.el);
            registSubmit.on('click', me.submit)
            jsChangeCode.on('click', function(){common.showCode(view.el);})
            view.el.on('keydown', function (e) {
                e.keyCode === 13 && me.submit()
            })

            me.userInfo()
            me.isNewUser()
            me.checkOauthLogin()
            ctrl.bindShowView($('.js-signIn', view.el))
            common.switchLoginRegist(view.el)
            userModel.createConstants()
            if (ctrl.operationCookies.getCookie("times")>2){
                common.showCode(view.el)
                ctrl.view.find(".js-img-code").show()
                ctrl.form.validate(common.generateValidate('login','true'))
            }else {
                ctrl.form.validate(common.generateValidate('login','false'))
            }

        },
        submit: function () {
            if (ctrl.form.valid()) {
                var data = ctrl.viewModel.collectData()
                data.userType = '1';
                userModel.login(data, function (res) {
                    var statusCode = res.statusCode;
                    var times;
                    switch (statusCode){
                        case X.CONSTANT.statusCode.SUCCESS:
                            events.userInfo();
                            times = 0;
                            ctrl.operationCookies.setCookie("times",times);
                              if (res.data.userType == 1){//
                                if (ctrl.GetQueryString("id")) {
                                    var user = {};
                                    res.data ? (res.data.email ? user.email = res.data.email : '') : '';
                                    res.data ? (res.data.mobile ? user.mobile = res.data.mobile : '') : '';
                                    res.data ? (res.data.firstName ? user.firstName = res.data.firstName : '') : '';
                                    ctrl.operationCookies.setCookie("user",JSON.stringify(user));
                                    userModel.userInfo(function(reslut){
                                        if(reslut.data[0].language && reslut.data[0].selfIntroduction){
                                        window.location.href = X.config.common.link.qutation + "?id=" + ctrl.GetQueryString("id")    
                                    }else{
                                        window.location.href = X.config.common.link.additionalIinfo + "?id=" + ctrl.GetQueryString("id")    
                                    }
                                    })
                                    
                                }
                               } 
                            break;
                        case X.CONSTANT.statusCode.LOGININVALID:
                            layer.alert(userModel.statusCode[statusCode]);
                            var getTimes = ctrl.operationCookies.getCookie("times");
                            var times= getTimes++;
                                ctrl.operationCookies.setCookie("times",getTimes);
                            if (ctrl.operationCookies.getCookie("times") >2){
                                common.showCode(view.el)
                                ctrl.view.find(".js-img-code").show();
                                ctrl.form.validate(common.generateValidate('login','true'))
                            }
                            break;
                        default:
                            common.serverError();
                            break;
                    }
                    ga('send', {
                        hitType: 'event',
                        eventCategory: 'Log In',
                        eventAction: 'Submit Log In',
                        eventLabel: 'Submit Log In'
                    });
                })
            }
        },
        signOut: function (callback) {
            userModel.signOut(function (res) {
                if (res.statusCode == X.CONSTANT.statusCode.SUCCESS) {
                    callback ?
                        callback() :
                        // layer.alert(lang.user_sign_out_success, function(){
                        //   location.reload()
                        // })
                        location.reload();
                } else {
                    common.serverError()
                }
            })
        },
        userInfo: function () {
            /*var email = /(^| )email=([^;]*)(;|$)/.exec(document.cookie)
             email && (email = email[2]) && common.loginSuccess(email)*/
            /*
            * 登陆成功后根据角色进入不同页面
            * */
            userModel.userInfo(function (res) {
                res.statusCode == X.CONSTANT.statusCode.SUCCESS && ctrl.success(res.data[0]);
            })
        },
        checkOauthLogin: function () {
            var loginError = location.search.indexOf('code=60000000') > -1
            loginError && layer.alert($.i18n.prop("user_oauth_login_error"), function () {
                location.search = location.search.replace('code=60000000&message=%E7%AC%AC%E4%B8%89%E6%96%B9%E7%99%BB%E5%BD%95%E5%BC%82%E5%B8%B8', '')
            })
        },
        isNewUser: function () {
            var isNew = getUrlParam();
            if (isNew != null && isNew.toString().length > 1) {
                if (isnew == 1) {
                    common.registrationSuccessful()
                }
            }
        }

    };

    ctrl.google_analytics = function () {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Sign Up',
            eventAction: 'Click Social Button',
            eventLabel: 'Click Social'
        });
    };
    ctrl.operationCookies ={
        setCookie:function(name,value){
            document.cookie = name +"=" + value + "; " ;
        },
        getCookie:function(times){
            var aCookie = document.cookie.split("; ");
            for (var i=0; i < aCookie.length; i++)
            {
                var aCrumb = aCookie[i].split("=");
                if (times == aCrumb[0])
                    return unescape(aCrumb[1]);
            }
            return null;
        }
    };
    ctrl.load = function () {
        common.addInterface(ctrl)
        view.render(function () {
            ctrl.form = view.el.find("form")
            var meta = {}
            ctrl.viewModel = ctrl.getViewModel(ctrl.form, {meta: meta})
            ctrl.viewModel.initControl()
            events.init()

            ctrl.addEvent("click", ".js-google-analytics", "google_analytics");
        })
    }

    ctrl.bindSignOut = function (el, callback) {
        el.on('click', function () {
            events.signOut(callback)
        })
    };

    function getUrlParam() {
        var searchKey = X.getRequest();
        return searchKey.isnew
    }

    ctrl.userInfo = events.userInfo

    ctrl.load()

    return ctrl
})
