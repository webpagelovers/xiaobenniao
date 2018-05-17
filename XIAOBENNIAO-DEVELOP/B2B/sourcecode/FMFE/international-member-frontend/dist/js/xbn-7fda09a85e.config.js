window.X = Xbn();
X.require.config.baseurl = "js/";
X.require.config.rules.push(["\\.", "/"]);

(function (win, X) {

    //网站根目录
    var rootPath = "http://dev.weintrade.com/";
    //前台服务域名
    var prefixUrl = rootPath + "api/international";
    //图片上传下载域名
    var imageUrl = rootPath + "api/general";
    //图片验证码
    var codeUrl = rootPath + "api/general";
    //附件
    var generalUrl = rootPath + "api/general/file/";
    //下载附件
    var downloadUrl = generalUrl + "download";
    //图片显示
    var imgDisplayUrl = rootPath;
    //图片存放地址
    var imgUrl = "https://img.dev.weintrade.com";
    //寰贸云地址
    var atcdealPath = "http://dev.atcdeal.com/";

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
                rootImg: generalUrl + "upload",
                prefixUrl: prefixUrl,
                imgUrl: imgUrl,
                rootImgDisplayUrl: imgDisplayUrl,
                atcdealPath: atcdealPath,
                modules: "js/modules"
            }
        },

        channel: {},


        attach: {
            upload: imageUrl + "/file/upload",
            download: imageUrl + "/file/download",
            downloadTemplate: imageUrl + "/file/",
        },


        imageVerification: {
            imageVerificationController: codeUrl
        },

        common: {
            tpl: {
                header: rootPath + "tpl/common/header.tpl",
                nav: rootPath + "tpl/common/nav.tpl",
                footer: rootPath + "tpl/common/footer.tpl",
                commonRequest: "tpl/common/commonRequest.tpl"
            },
            api: {
                menu: "js/data/menu.json"
            },
            res: {
                header: rootPath + "i18n/common/common",
                footer: rootPath + "i18n/common/common",
                nav: rootPath + "i18n/common/common",
                common: rootPath + "i18n/common/common",
                commonRequest: rootPath + "i18n/"
            },
            link: {
                home: rootPath,
                products: rootPath + "product/product-list.html",
                sourceProducts: rootPath + "product/source-products.html",
                searchList: rootPath + "product/search-list.html",
                buyingRequest: rootPath + "request/buying-request.html",
                sourceRequest: rootPath + "request/sourcing-request.html",
                submitSuccessfully: rootPath + "request/submit-successfully.html",
                aboutUs: rootPath + "about/about-us.html",
                termOfUse: rootPath + "about/term-of-use.html",
                privacyPollicy: rootPath + "about/privacy-policy.html",
                contactUs: rootPath + "about/contact-us.html",
                blogDetail: rootPath + "blog/blog-detail.html",
                blogs: rootPath + "blogs/",
                blogIndex: rootPath + "blog/",
                freeSource: rootPath + "request/sourcing-request.html",
                siteMap: rootPath + "about/site-map.html",
                stepsOfService: rootPath + "service/steps-of-our-service.html",
                guarantee: rootPath + "service/guarantee.html",
                aboutPayment: rootPath + "service/about-payment.html",
                sourcingRequestDetail: rootPath + "request/sourcing-request-detail.html",
                additionalIinfo: rootPath + "agent/additional-info.html",
                qutation: rootPath + "agent/qutation.html",
                agentRegist: rootPath + "agent/agent-register.html",
                category: rootPath + "promotion/category.html",
                //https://www.weintrade.com/
                gardenTools: rootPath + "topic/garden-tools-and-equipments-import.html",
                computerHardware: rootPath + "topic/computer-hardware-import.html",
                beautyEquipment: rootPath + "topic/beauty-equipment-import.html",
                automobileAccessory: rootPath + "topic/automobile-accessory-import.html",
                promotionProducts: rootPath + "topic/promotion-products-import.html",
                constructionTools: rootPath + "topic/construction-tools-and-machinaries-import.html",
                login: rootPath + 'user/login.html',
                regist: rootPath + 'user/regist.html',
                resetPassword: rootPath + 'user/reset-password.html'
            }
        },

        about: {
            tpl: {
                contactUs: rootPath + "tpl/about/contact-us.tpl",
                aboutUs: rootPath + "tpl/about/about-us.tpl",
                termOfUse: rootPath + "tpl/about/term-of-use.tpl",
                privacyPolicy: rootPath + "tpl/about/privacy-policy.tpl",
                siteMap: rootPath + "tpl/about/site-map.tpl"
            },
            api: {
                contactUs: rootPath + "api/international/contactUs"
            },
            res: {
                contactUs: rootPath + "i18n/about/contact-us",
                aboutUs: rootPath + "i18n/about/about-us",
                termOfUse: rootPath + "i18n/about/term-of-use",
                privacyPolicy: rootPath + "i18n/about/privacy-policy",
                siteMap: rootPath + "i18n/about/site-map"
            }
        },

        user: {
            tpl: {
                login: rootPath + "tpl/user/login.tpl",
                regist: rootPath + "tpl/user/regist.tpl",
                resetPassword: rootPath + "tpl/user/reset-password.tpl"
            },
            api: {
                login: prefixUrl + "/member/login",
                regist: prefixUrl + "/member/registerByEmail",
                logout: prefixUrl + "/member/logout",
                userInfo: prefixUrl + "/member/loginInfo",
                verifyEmail: prefixUrl + "/member/verifyEmail",
                resetPassword: prefixUrl + "/member/password/reset",
                resetRequest:prefixUrl + "/member/password/resetRequest",
                resetCheck:prefixUrl + "/member/password/resetCheck/"
            },
            res: {
                login: rootPath + "i18n/user/user",
                regist: rootPath + "i18n/user/user",
                resetPassword: rootPath + "i18n/user/user"
            }
        },

        oauth: {
            link: {
                facebook: prefixUrl + '/member/oauth/facebookLogin',
                linkedin: prefixUrl + '/member/oauth/linkedinLogin',
                twitter: prefixUrl + '/member/oauth/twitterLogin'
            }
        },

        request: {
            tpl: {
                buyRequest: rootPath + "tpl/request/buying-request.tpl",
                sourcingRequest: rootPath + "tpl/request/sourcing-request.tpl",
                sourcingRequestDetail: rootPath + "tpl/request/sourcing-request-detail.tpl",
                buyRequestAtProduct: rootPath + "tpl/request/buy-request-at-product.tpl",
                submitSuccessfully: rootPath + "tpl/request/submit-successfully.tpl"
            },
            api: {
                buyRequest: rootPath + "api/international/buyingRequest/",
                sourcingRequest: rootPath + "api/international/sourcingRequest/",
                getIpInfo: prefixUrl + "/ipinfo"
            },
            res: {
                buyRequest: rootPath + "i18n/request/buying-request",
                sourcingRequest: rootPath + "i18n/request/sourcing-request",
                sourcingRequestDetail: rootPath + "i18n/request/sourcing-request-detail",
                buyRequestAtProduct: rootPath + "i18n/request/buy-request-at-product",
                submitSuccessfully: rootPath + "i18n/request/submit-successfully"
            }
        },

        agent: {
            tpl: {
                additionalInfo: rootPath + "tpl/agent/additionalInfo.tpl",
                qutation: rootPath + "tpl/agent/qutation.tpl",
                agentRegist: rootPath + "tpl/agent/agent-regist.tpl"
            },
            api: {
                getAgent: prefixUrl + "/sourcingRequest/",
                postAgent: prefixUrl + "/sourcingRequestQuote/",
                mobileCode: codeUrl + "/VerificationCode/send/",
                agentRegister: prefixUrl + "/member/agentRegister",
                agentInformation: prefixUrl + "/member/agentInformation",
                getAgentInfo: prefixUrl + "/member/loginInfo"

            },
            res: {
                buyRequest: rootPath + "i18n/agent/agent",
                qutation: rootPath + "i18n/agent/qutation"
            }
        },

        index: {
            tpl: {
                index: rootPath + "tpl/index/index.tpl",
                firstScreen: rootPath + "tpl/index/first-screen.tpl",
                notFound: rootPath + "tpl/index/notFound.tpl"
            },
            api: {
                browseProducts: rootPath + "js/data/browseProducts.json",
                getRecentUpdates: prefixUrl + "/commodity/recommendCommodity"
            },
            res: {
                index: rootPath + "i18n/index/index"

            }
        },

        product: {
            tpl: {
                searchList: rootPath + "tpl/product/search-list.tpl",
                productList: rootPath + "tpl/product/product-list.tpl",
                productDetail: rootPath + "tpl/product/product-detail.tpl",
                sourceProduct: rootPath + "tpl/product/source-products.tpl"
            },
            api: {
                getsearchList: rootPath + "api/international-search-product/search",
                getproductList: rootPath + "api/international/commodity/hotSaleCommodity",
                getRecommendProductList: rootPath + "api/international/product/recommendProducts",
                getsearchHotWords: rootPath + "api/international-search-product/hotWord",
                getsearchRecommend: rootPath + "api/international-search-product/recommend",
                getProductDetail: rootPath + "api/international/commodity/detail",
                getReProductDetail: rootPath + "api/international/product/recommendDetail"
            },
            res: {
                searchList: rootPath + "i18n/product/search-list",
                productList: rootPath + "i18n/product/product-list",
                sourceProduct: rootPath + "i18n/product/source-products",
                productDetail: rootPath + "i18n/product/product-detail"
            }
        },
        blog: {
            tpl: {
                index: rootPath + "tpl/blog/index.tpl",
                blogDetail: rootPath + "tpl/blog/blog-detail.tpl"
            },
            api: {
                blogList: prefixUrl + "/blog/listTenPosts",
                blogDetail: prefixUrl + "/blog/",
                postComments: prefixUrl + "/blogComment/",
                loadComments: prefixUrl + "/blog/listCommentByPage",
                listPostByPage: prefixUrl + "/blog/listPostByPage",
                hotPost: prefixUrl + "/blog/listHotPosts"
            },
            res: {
                index: rootPath + "i18n/blog/index",
                detail: rootPath + "i18n/blog/blog-detail"
            }
        },
        service: {
            tpl: {
                guarantee: rootPath + "tpl/service/guarantee.tpl",
                stepService: rootPath + "tpl/service/steps-of-our-service.tpl",
                aboutPayment: rootPath + "tpl/service/about-payment.tpl"
            },
            res: {
                guarantee: rootPath + "i18n/service/guarantee",
                stepService: rootPath + "i18n/service/steps-of-our-service",
                aboutPayment: rootPath + "i18n/service/about-payment"
            }
        },
        topic: {
            tpl: {
                promotionGift: rootPath + "tpl/topic/promotion-products-import.tpl",
                gardenTools: rootPath + "tpl/topic/garden-tools-and-equipments-import.tpl",
                constructionTools: rootPath + "tpl/topic/construction-tools-and-machinaries-import.tpl",
                beautyEquipment: rootPath + "tpl/topic/beauty-equipment-import.tpl",
                computerHardware: rootPath + "tpl/topic/computer-hardware-import.tpl",
                automobileAccessory: rootPath + "tpl/topic/automobile-accessory-import.tpl"
            },
            res: {
                promotionGift: rootPath + "i18n/common/common-request",
                gardenTools: rootPath + "i18n/common/common-request",
                constructionTools: rootPath + "i18n/common/common-request",
                beautyEquipment: rootPath + "i18n/common/common-request",
                computerHardware: rootPath + "i18n/common/common-request",
                automobileAccessory: rootPath + "i18n/common/common-request"
            }
        },

        contact: {
            tel: "010-81281397",
            email: "service@ftfbiz.com"
        },

        env: {
            production: (rootPath.indexOf("dev") == -1)
        }
    };


    X.prototype.config = config;


    X.prototype.CONSTANT = {
        statusCode: {
            SUCCESS: 2000000,
            NOTPHONE: 2000309,//登录手机号码不存在
            NOTPASSWORD: 2000310, //登录密码不正确
            LOGININVALID: 2000312, //登录用户名或密码错误
            FROEENACOUNT: 2000205, //当前用户已被冻结
            SESSIONEXPIRE: 1000100,//session 失效
            NOLOGIN: 2001000,//未登录
            INVALIDPRODUCT: 2000800 //失效产品
        },
        channel: {
            "navReady": "navReady",
            "companySubmitAudit": "companySubmitAudit",
            "loginSuccess": "loginSuccess",
            "registSuccess": "registSuccess"
        }
    };

})(window, this.Xbn);