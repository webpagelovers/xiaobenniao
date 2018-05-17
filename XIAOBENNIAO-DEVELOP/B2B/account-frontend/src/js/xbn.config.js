(function (win, X) {

    var receptionUrl = "http://dev.atcdeal.com";
    var rootPath = receptionUrl + "/account";
    var prefixUrl = "http://dev.atcdeal.com/api/account";
    var generalUrl = "http://dev.atcdeal.com/api/general/file/";
    var generalApi = receptionUrl + "/api/general";

    //上传图片存放地址
    var imageStoreUrl = "http://image.dev.atcdeal.com/";

    var imageUrl = generalUrl + "upload";
    var uploadUrl = generalUrl + "download";

    var channel = {
        jr : "http://jr.dev.atcdeal.com/",   //金融服务频道域名
        hwy : "http://hwyy.dev.atcdeal.com/",   //海外运营中心频道域名
        admin : "http://admin.dev.atcdeal.com/"   //海外运营中心频道域名
    }

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
            "default": "homePage.homePage",
            "bid.publicBidding": "modules.bid.publicBidding",
            "bid.myBid": "modules.bid.myBid",
            "bid.tenderDetail": "modules.bid.tenderDetail",
            "bid.tenderDetailPublic": "modules.bid.tenderDetail",
            "homePage.home": "modules.homePage.home",
            "homePage.homePage": "modules.homePage.homePage",
            "message.systemBulletin": "modules.message.systemBulletin",
            "message.systemMessage": "modules.message.systemMessage",
            "message.clientMessage": "modules.message.clientMessage",
            "customerClearance.clearanceList": "modules.customerClearance.clearanceList",
            "customerClearance.clearanceDetail": "modules.customerClearance.clearanceDetail",
            "customerClearance.applyClearance": "modules.customerClearance.applyClearance",
            "customerClearance.settings": "modules.customerClearance.settings",
            "customerClearance.declareProductList": "modules.customerClearance.declareProductList",
            "customerClearance.declareProductDetail": "modules.customerClearance.declareProductDetail",
            "customerClearance.addDeclareProduct": "modules.customerClearance.addDeclareProduct",
            "customerClearance.addDrawer": "modules.customerClearance.addDrawer",
            "customerClearance.editDeclareProduct": "modules.customerClearance.addDeclareProduct",
            "accountSettings.accountInfo": "modules.accountSettings.accountInfo",
            "accountSettings.accountSafety": "modules.accountSettings.accountSafety",
            "commodityManage.commodityManageList": "modules.commodityManage.commodityManageList",
            "commodityManage.commodityDetail": "modules.commodityManage.commodityDetail",
            "commodityManage.addCommodity": "modules.commodityManage.addCommodity",
            "commodityManage.editCommodity": "modules.commodityManage.addCommodity",
            "infoManage.infoManageList": "modules.infoManage.infoManageList",
            "infoManage.infoManageDetail": "modules.infoManage.infoManageDetail",
            "infoManage.infoManageRes": "modules.infoManage.infoManageRes",
            "infoManage.myResponseList": "modules.infoManage.myResponseList",
            "infoManage.myResponseDetail": "modules.infoManage.infoManageDetail",
            "contract.contractList": "modules.contract.contractList",
            "contract.contractEdit": "modules.contract.contractEdit",
            "contract.contractAdd": "modules.contract.contractEdit",
            "contract.contractDetails": "modules.contract.contractDetails",
            "contract.fundList": "modules.contract.fundList",
            "contract.fundDetails": "modules.contract.fundDetails",
            "credit.addCredit": "modules.credit.addCredit",
            "credit.creditList": "modules.credit.creditList",
            "credit.creditDetail": "modules.credit.creditDetail",
            "credit.addCreditDraft": "modules.credit.addCredit",
            "credit.creditDetailDraft": "modules.credit.creditDetail",
            "accountSettings.companyInfo": "modules.accountSettings.companyInfo"
        },

        channel :{
            jr : {
                root : channel.jr
            },
            hwy : {
                root : channel.hwy
            },
            admin:{
                root:channel.admin
            }
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
                breadCrumb: "tpl/menu/breadCrumb.html"
            }
        },
        /**用户设置*/
        user: {
            api: {
                userId: prefixUrl + "/user/loginInfo",
                logout: prefixUrl + "/user/logout"
            }
        },
        /**供应商logo设置*/
        company: {
            api: {
                logoUrl: prefixUrl + "/company/logoUrl",
                checkCompanyType: prefixUrl + "/company/checkCompanyType"
            }
        },

        /**供应商投标首页设置*/
        homePage: {
            tpl: {
                "home": "tpl/homePage/home.html",
                "homePage": "tpl/homePage/homePage.html"
            },
            api: {
                statistics: prefixUrl + "/bidding/statistics"
            }
        },
        /**供应商消息设置*/
        message: {
            tpl: {
                "systemBulletin": "tpl/message/systemBulletin.html",
                "systemMessage": "tpl/message/systemMessage.html",
                "clientMessage": "tpl/message/clientMessage.html"
            },
            api: {
                listSystemMessages: prefixUrl + "/bidding/listSystemMessagesByPage",
                listPlatformMessages: prefixUrl + "/bidding/listPlatformMessagesByPage",
                listClientMessages: prefixUrl + "/message/findMessageByPage",
                deleteClientMessages: prefixUrl + "/message/",
                findUnReadClientMessageCount: prefixUrl + "/message/findMessageCountByCompanyId",
                getPlatformMessageCount: prefixUrl + "/message/countUnreadBulletin",
                getSystemMessageCount: prefixUrl + "/message/countUnreadSystemMessages",
                getMessageCenterCount: generalApi + "/message/count",
                deleteMessage: prefixUrl + "/bidding/message",
                readMessage: prefixUrl + "/message/read"
            }
        },

        /**供应商投标设置*/
        bid: {
            tpl: {
                "publicBidding": "tpl/bid/publicBidding.html",
                "myBid": "tpl/bid/myBid.html",
                "tenderDetail": "tpl/bid/tenderDetail.html"
            },
            uri: {
                myBidListByPage: rootPath + "js/data/mockData/bidList.json", //测试数据
                getMyBidbulletin: rootPath + "js/data/mockData/bidList.json",
                tenderDetails: rootPath + "js/data/mockData/tenderDetails.json",
                getChangeList: rootPath + "js/data/mockData/changeContentList.json",
                getTenderAnswer: rootPath + "js/data/mockData/tenderAnswer.json"
            },
            api: {
                myBidListByPage: prefixUrl + "/bidding/listMyBiddingByPage",
                getMyBidbulletin: prefixUrl + "/bidding/getMyBidbulletin",
                getChangeList: prefixUrl + "/bidding/tenderHistorys/",
                getMyBidById: prefixUrl + "/bidding/",
                tabAnswerQuestion: prefixUrl + "/bidderTalk/listByPage",
                postQuestion: prefixUrl + "/bidderTalk/",
                postAnswer: prefixUrl + "/bidderTalk/",
                getFile: prefixUrl + "/bidding/findBiddingInfoById/",
                getPublicBidFile: prefixUrl + "/bidding/findBiddingInfoByTenderId/",
                putFile: prefixUrl + "/bidding/",
                postFile: prefixUrl + "/bidding/",
                getPublicBidListByPage: prefixUrl + "/bidding/listOpenTenderByPage",
                clearNotice: prefixUrl + "/bidding/notice",
                qualification: prefixUrl + "/bidding/qualificationHistorys/",
                qualificationApply: prefixUrl + "/bidding/qualificationApply",
                qualificationInfo: prefixUrl + "/bidding/qualificationInfo"
            }
        },

        supplier: {
            api: {
                url: rootPath
            }
        },

        customerClearance: {
            tpl: {
                clearanceList: "tpl/customerClearance/clearanceList.html",
                clearanceDetail: "tpl/customerClearance/clearanceDetail.html",
                applyClearance: "tpl/customerClearance/applyClearance.html",
                exportGoodsList: "tpl/customerClearance/exportGoodsList.html",
                settings: "tpl/customerClearance/settings.html",
                drawbackInformation: "tpl/customerClearance/drawbackInformation.html",
                paymentSettling: "tpl/customerClearance/paymentSettling.html",
                customsRecords: "tpl/customerClearance/customsRecords.html",
                bookingInformation: "tpl/customerClearance/bookingInformation.html",
                declareProductList: "tpl/customerClearance/declareProductList.html",
                addDeclareProduct: "tpl/customerClearance/addDeclareProduct.html",
                addDrawer: "tpl/customerClearance/addDrawer.html",
                declareProductDetail: "tpl/customerClearance/declareProductDetail.html"
            },
            api: {
                getList: prefixUrl + '/exportForm/listByPage/',
                applyClearance: prefixUrl + "/exportForm/insert",
                getById: prefixUrl + '/exportForm/',
                getAcountList: prefixUrl + "/companyBankAccount/list",
                getContactsList: prefixUrl + "/exportContacts/list",
                postAcount: prefixUrl + "/companyBankAccount/",
                postContacts: prefixUrl + "/exportContacts/",
                getExportContactsByPage: prefixUrl + '/exportContacts/listByPage',
                getCompanyBankAccountListByPage: prefixUrl + '/companyBankAccount/listByPage',
                exportContacts: prefixUrl + '/exportContacts/',
                companyBankAccount: prefixUrl + '/companyBankAccount/',
                exportFormShowInfo: prefixUrl + '/exportForm/showInfo/',
                //报关产品管理
                declareProduct: prefixUrl + '/product/',
                additional: prefixUrl + '/product/additional',
                productDown: prefixUrl + '/product/productDown/',
                productUp: prefixUrl + '/product/productUp/',
                drawer: prefixUrl + '/exportDrawer/',
                addDrawer: prefixUrl + '/exportDrawer/createExportDrawer',
                updateDrawer: prefixUrl + '/exportDrawer/updateDrawer',
                completeDrawer: prefixUrl + '/exportDrawer/completeDrawer',
                declareProductList: prefixUrl + '/product/listByPage'
            }
        },

        /**商品管理*/
        commodityManage: {
            tpl: {
                commodityManageList: "tpl/commodityManage/commodityManageList.html",
                commodityDetail : "tpl/commodityManage/commodityDetail.html",
                addCommodity : "tpl/commodityManage/addCommodity.html"
            },
            api: {
                commodityManageList: prefixUrl + "/commodity/listByPage",
                commodityDetail : prefixUrl + "/commodity/",
                addCommodity : prefixUrl + "/commodity/",
                deleteCommodity : prefixUrl + "/commodity/"
            }
        },

        infoManage: {
            tpl: {
                infoManageList: "tpl/infoManage/infoManageList.html",
                infoManageDetail: "tpl/infoManage/infoManageDetail.html",
                infoManageRes: "tpl/infoManage/infoManageRes.html",
                myResponseList: "tpl/infoManage/myResponseList.html",
                myResponseDetail: "tpl/infoManage/myResponseDetail.html"
            },
            api: {
                getList: prefixUrl + '/supplier/purchaseInfo/listMatchByPage',
                getById: prefixUrl + '/supplier/purchaseInfo/',
                setIsRead: prefixUrl + '/supplier/purchaseInfo/read',
                addRes: prefixUrl + '/supplier/purchaseInfo/response',
                getNewResponseCount: prefixUrl + '/supplier/purchaseInfo/statistics',
                myResponseList: prefixUrl + "/supplier/purchaseInfo/response/listByPage",
                getMyResponseDetailById: prefixUrl + '/supplier/purchaseInfo/response/',
                getStatistics: prefixUrl + '/supplier/purchaseInfo/statistics',
                clearMyResponseNotice: prefixUrl + '/supplier/purchaseInfo/response/notice',
                readByBussinessId: prefixUrl + '/message/readByBusinessId/',
                setMessage:prefixUrl + '/message/',
                isResponseExist:prefixUrl + "/supplier/purchaseInfo/isResponseExist/",
                deleteMessage:prefixUrl + "/supplier/purchaseInfo/matching/"
            }
        },

        accountSettings: {
            tpl: {
                accountInfo: "tpl/accountSettings/accountInfo.html",
                accountSafety: "tpl/accountSettings/accountSafety.html",
                companyInfo: "tpl/accountSettings/companyInfo.html"
            },
            api: {
                bindEmail: prefixUrl + "/email/verify",
                resetPassword: prefixUrl + "/user/password",
                companyInfo: prefixUrl + "/company/",
                companyInfoSave: prefixUrl + "/company/save"

            }
        },
        /*******合同资金管理**********/
        contract: {
            tpl: {
                contractList: "tpl/contract/contractList.html",
                contractEdit: "tpl/contract/contractEdit.html",
                contractDetails: "tpl/contract/contractDetails.html",
                fundList: "tpl/contract/fundList.html",
                fundDetails: "tpl/contract/fundDetails.html"
            },
            api: {
                contractList: prefixUrl + "/contract/listByPage/",
                contractHandel: prefixUrl + "/contract/",
                fundList:prefixUrl + "/exportFund/listByPage/",
                fundDetails:prefixUrl + "/exportFund/"
            }
        },

        //信用证管理
        credit: {
            tpl: {
                addCredit:        "tpl/credit/addCredit.html",
                creditList:       "tpl/credit/creditList.html",
                creditDetail:     "tpl/credit/creditDetail.html"
            },
            api: {
                creditDraft:            prefixUrl + '/letterCred/draft/',
                creditOriginal:         prefixUrl + '/letterCred/original/',
                deleteCredit:           prefixUrl + "/letterCred/letterCredit/",
                creditListDraft:        prefixUrl + "/letterCred/draft/findLetterCreditDraftShowInfoByPage",
                creditListOriginal:     prefixUrl + "/letterCred/original/findLetterCreditOriginalShowInfoByPage"
            }
        },

        //产品管理
        products: {
            tpl: {
                addProduct:  "tpl/products/addProduct.html"
            },
            api: {
                addProduct:    prefixUrl + '/product/',
                productList:   prefixUrl + '/product/listByPage'
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
        },
        channel: {
            "menuSwitch": "menuSwitch",
            "menuCall": "menuCall",
            "menuReady": "menuReady",
            "breadCrumbChange": "breadCrumbChange",
            "menuUpdate" : "menuUpdate"
        }
    }

})(window, this.Xbn);