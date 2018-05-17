window.X = Xbn();
X.require.config.baseurl="js/";
X.require.config.rules.push(["\\.","/"]);

(function (win, X) {

    var receptionUrl = "http://dev.weintrade.com/";
    var rootPath = receptionUrl + "account";
    var prefixUrl = receptionUrl + "api/international/";
    var generalUrl = receptionUrl + "api/general/file/";
    var generalApi = receptionUrl + "api/general";

    //上传图片存放地址
    var imageStoreUrl = "http://img.dev.weintrade.com/";

    var imageUrl = generalUrl + "upload";
    var uploadUrl = generalUrl + "download";


    var browserAdapter = {
        isLetIE10: (function () {
            return $.browser["msie"] == true && parseInt($.browser["version"]) < 10;
        })(),
        adaptRoute: function (para) {
            if (this.isLetIE10) {
                return "/#!m=" + para;
            } else {
                return "/?m=" + para;
            }
        }
    };

    var config = {
        PATH_FILE: {
            path: {
                root: rootPath,
                rootPath: rootPath,
                rootImg: imageUrl,
                imageStoreUrl: imageStoreUrl,
                userUrl: prefixUrl,
                rootUploadUrl: uploadUrl,
                rootReceptionUrl: receptionUrl,
                modules: "js/modules"
            }
        },
        receptionUrl: {
            messageUrl: receptionUrl + "/information/announcementDetail.html",
            userInfoUrl: receptionUrl + "/user/accountSetting.html",
            loginUrl: receptionUrl + "/user/login.html",
            indexUrl: receptionUrl,
            contactUsUrl: receptionUrl + "/contact/contactus.html?id=442",
            registrationUrl: receptionUrl + "/user/agreement.html?id=433",
            feedbackUrl: receptionUrl + "/contact/feedback.html",
            aboutUs: receptionUrl + "/contact/aboutus.html"
        },

        route: {
            "default": "dashboard.index",
            "dashboard.index": "modules.dashboard.index",

            "inquirie.inquiriesList": "modules.inquiries.list",
            "inquirie.form": "modules.inquiries.form",

            "inquirie.quotationList": "modules.quotation.list",
            "inquirie.quotationDetail": "modules.quotation.detail",

            "account.info": "modules.account.info",
            "account.password": "modules.account.password",
        },

        /**
         * @description 导航 模块
         * @param {uri} 导航 接口
         * @param {tpl} 导航 模板
         */
        menu: {
            api: 'js/data/menu.json',
            tpl: {
                nas: "tpl/menu/menu.html",
                nav: "tpl/menu/nav.html",
                breadCrumb: "tpl/menu/breadCrumb.html",
                header : "tpl/menu/header.html"
            }
        },

        dashboard: {
            api:{
                getNewQuotationCount : prefixUrl +  "member/remind/newQuotationCount",
                getUserInfo : prefixUrl +  "member/loginInfo",
                verifyRequest : prefixUrl + "member/email/verifyRequest"
            },
            tpl: {
                index: 'tpl/dashboard/index.html'
            }
        },

        emailVerify: {
            api:{

            },
            tpl: {
                emailVerify: 'tpl/emailVerify/emailVerify.html'
            }
        },

        inquiries: {
            api: {
                list:   prefixUrl + 'sourcingRequest/pageRFQByUser',
                submit: prefixUrl + 'sourcingRequest/'
            },
            tpl: {
                list: 'tpl/inquiries/list.html',
                form: 'tpl/inquiries/form.html',
            }
        },

        quotation: {
            api: {
                list:   prefixUrl + 'sourcingRequestQuote/listByPage',
                detail: prefixUrl + 'sourcingRequestQuote',
                submit: prefixUrl + 'sourcingRequest/additional'
            },
            tpl: {
                list:   'tpl/quotation/list.html',
                detail: 'tpl/quotation/detail.html',
                form:   'tpl/quotation/form.html'
            }
        },

        order: {
            api: {

            },
            tpl: {

            }
        },

        account: {
            api: {
                userInfo: prefixUrl + "member/loginInfo",
                findBuyerInfoByUserId: prefixUrl + "member/findBuyerInfoByUserId",
                setBuyerInfoUrl: prefixUrl + "member/buyerInfo",
                verifyEmail: prefixUrl + "member/verifyEmail",
                verifyRequest: prefixUrl + "member/email/verifyRequest"
            },
            tpl: {
                info: 'tpl/account/info.html'
            }
        },
        
        contact: {
            tel: "010-81281397",
            email: "service@atcdeal.com"
        },

        env: {
            production: true
        }

    };

    X.prototype.config = config;
    X.prototype.browserAdapter = browserAdapter;


    X.prototype.CONSTANTS = {
        statusCode: {
            SUCCESS: 2000000
        }
    }

})(window, this.Xbn);