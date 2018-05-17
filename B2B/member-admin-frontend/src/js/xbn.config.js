window.X = Xbn();
X.require.config.baseurl = "js/";
X.require.config.rules.push(["\\.", "/"]);
X.require.config.rules.push(["@", "."]);

(function (win, X) {

    var projectType     =   location.href.indexOf('weintrade.com') > -1? 'weintrade': 'atcdeal';
    var rootPath        =   "//admin.dev."+ projectType +".com/";
    var prefixUrl       =   rootPath + "api/memberadmin";
    var imageUrl        =   rootPath + "api/general/file/upload";
    var uploadUrl       =   rootPath + "api/general/file/download";
    var crawlingImgUrl  =   projectType === 'weintrade'? "http://img.dev."+ projectType +".com": "http://image.dev."+ projectType +".com";

    //新功能换https
    var imgUrl = "https://img.dev."+ projectType +".com";

    //国际站产品详情地址
    /*var weInTradeUrl = "http://dev.weintrade.com/product/productDetail.html";*/
    var weInTradeUrl = "http://dev.weintrade.com/product/";
    //国际站地址
    var weInTdUrl = "http://dev.weintrade.com/";

    var agentUrl = "http://agent.dev.atcdeal.com/";


    var config = {


        PATH_FILE: {
            path: {
                root: document.location.protocol + rootPath,
                rootImg: imageUrl,
                rootUrl: prefixUrl,
                rootUploadUrl: uploadUrl,
                weInTradeUrl: weInTradeUrl,
                modules: "js/modules",
                imgUrl: imgUrl,
                rootCrawlingImgUrl: crawlingImgUrl,
                weInTdUrl: weInTdUrl,
                srPublishUrl: agentUrl + 'request/sourcing-request-detail.html?id='
            }
        },

        route: {
            "default": projectType === "weintrade"? "inquiry.inquiryList":"user.userList",
            "user.userList": "modules.user.userList",
            "user.userDisplay": "modules.user.userDisplay",
            "user.userEdit": "modules.user.userEdit",
            "user.userAudit": "modules.user.userAudit",
            "supplier.supplierList": "modules.supplier.supplierList",
            "supplier.supplierDisplay": "modules.supplier.supplierDisplay",
            "login.login": "modules.login.login",
            "purchasers.purchasersList": "modules.purchasers.purchasersList",
            "purchasers.purchasersEdit": "modules.purchasers.purchasersEdit",
            "email.emailSetting": "modules.email.emailSetting",
            "datacrawling.dataCrawling": "modules.datacrawling.dataCrawling",
            "system.systemMessage": "modules.system.systemMessage",
            "system.systemLog": "modules.system.systemLog",
            "authority.authoritySetting": "modules.authority.authoritySetting",
            "authority.addAdmin": "modules.authority.addAdmin",
            "authority.addRole": "modules.authority.addRole",
            "system.systemmessageEdit": "modules.system.systemmessageEdit",
            "system.systemMessageList": "modules.system.systemMessageList",
            "system.systemMessageDisplay": "modules.system.systemMessageDisplay",
            "system.systemlogList": "modules.system.systemlogList",
            "purchasers.purchasersDisplay": "modules.purchasers.purchasersDisplay",
            "customerClearance.clearanceList": "modules.customerClearance.clearanceList",
            "customerClearance.clearanceDetail": "modules.customerClearance.clearanceDetail",
            "customerClearance.clearanceEdit": "modules.customerClearance.clearanceEdit",
            "customerClearance.clearanceHandle": "modules.customerClearance.clearanceHandle",
            "customerClearance.logisticsProcess": "modules.customerClearance.logisticsProcess",
            "customerClearance.inspectionProcess": "modules.customerClearance.inspectionProcess",
            "customerClearance.productManage": "modules.customerClearance.productManage",
            "customerClearance.productDetail": "modules.customerClearance.productDetail",
            "homeManagement.suggestionList": "modules.homeManagement.suggestionList",
            "homeManagement.suggestionDetail": "modules.homeManagement.suggestionDetail",
            "homeManagement.suggestionHandle": "modules.homeManagement.suggestionHandle",
            "dataCleaning.dataCleaning": "modules.dataCleaning.dataCleaning",
            "productManage.productList": "modules.productManage.productList",
            "productManage.proprietaryList": "modules.productManage.proprietaryList",
            "productManage.productDetail": "modules.productManage.productDetail",
            "productManage.publishProduct": "modules.productManage.publishProduct",
            "purchaseInfo.matchInfo": "modules.purchaseInfo.matchInfo",
            "purchaseInfo.infoDetail": "modules.purchaseInfo.infoDetail",
            "purchaseInfo.matchRecord": "modules.purchaseInfo.matchRecord",
            "purchaseInfo.recordDetail": "modules.purchaseInfo.recordDetail",
            "customerClearance.drawerList": "modules.customerClearance.drawerList",
            "customerClearance.drawer": "modules.customerClearance.drawer",
            "statistics.realTimeTraffic": "modules.statistics.realTimeTraffic", //实时流量
            "statistics.historicalFlow": "modules.statistics.historicalFlow", //历史流量
            "statistics.userInformation": "modules.statistics.userInformation", //用户信息
            "statistics.externalChain": "modules.statistics.externalLinks", //外链统计
            "statistics.ip": "modules.statistics.ip", //IP统计
            "statistics.pageRanking": "modules.statistics.pageRanking", //页面排名
            "blog.articleEdit": "modules.blog.articleEdit",  //文章添加和编辑
            "blog.articleList": "modules.blog.articleList",  //文章列表
            "inquiry.inquiryList": "modules.inquiry.inquiryList",  //询盘列表
            "inquiry.addRFQ": "modules.inquiry.addRFQ",  //新增RFQ
            "inquiry.addPrice": "modules.inquiry.addPrice",  //新增报价
            "inquiry.inquiryDetail": "modules.inquiry.inquiryDetail",
            "agent.agentList": "modules.agent.agentList",
            "agent.agentDetail": "modules.agent.agentDetail",
            "inquiry.contactUsList": "modules.inquiry.contactUsList", //联系我们列表
            "inquiry.contactUsDetail": "modules.inquiry.contactUsDetail" ,//联系我们详情
            "declare.orderList" : "modules.declare.orderList" , //订单列表
            "declare.addOrder" : "modules.declare.addOrder"  //发布订单
        },

        /**
         * @description 导航 模块
         * @param {uri} 导航 接口
         * @param {tpl} 导航 模板
         */
        menu: {
            uri: {
                nas: "js/data/menu.json" //测试数据
            },
            tpl: {
                nas: "tpl/menu/menu.html"
            },
            api: {
                nas: prefixUrl + "/menu/"
            }
        },

        login: {
            tpl: {
                login: "tpl/login/Login.html"
            }
        },

        user: {
            tpl: {
                userList: "tpl/user/userList.html",
                userDisplay: "tpl/user/userDisplay.html",
                userEdit: "tpl/user/userEdit.html",
                userAudit: "tpl/user/userAudit.html"
            },
            uri: {
                login: prefixUrl + "/user/login/",
                logout: prefixUrl + '/user/logout/',
                //checkLogin: prefixUrl + "/user/checkLogin"
                checkLogin: "js/data/login.json",
                getList: "js/data/mockData/userlist.json",
                supplierList: "js/data/mockData/supplierlist.json",
                addressData: "js/data/addressData.json"
            },
            api: {
                userlistByPage: prefixUrl + "/user/listByPage",
                getUserById: prefixUrl + "/user/",
                status: prefixUrl + "/user/status",
                audit: prefixUrl + "/user/audit",
                register: prefixUrl + "/user/register"
            }
        },

        customerClearance: {
            tpl: {
                clearanceList: "tpl/customerClearance/clearanceList.html",
                clearanceDetail: "tpl/customerClearance/clearanceDetail.html",
                clearanceEdit: "tpl/customerClearance/clearanceEdit.html",
                applyClearance: "tpl/customerClearance/applyClearance.html",
                exportGoodsList: "tpl/customerClearance/exportGoodsList.html",
                clearanceHandle: "tpl/customerClearance/clearanceHandle.html",
                logisticsProcess: "tpl/customerClearance/logisticsProcess.html",
                inspectionProcess: "tpl/customerClearance/inspectionProcess.html",
                productManage: "tpl/customerClearance/productManage.html",
                productDetail: "tpl/customerClearance/productDetail.html",
                drawerList: "tpl/customerClearance/drawerList.html",
                drawer: "tpl/customerClearance/drawer.html"
            },
            api: {
                getList: prefixUrl + '/exportForm/listByPage/',
                applyClearance: prefixUrl + "/exportForm/",//申请报关
                postAcount: prefixUrl + "/companyBankAccount/",   //添加银行账号
                postContacts: prefixUrl + "/exportContacts/",     //添加联系人
                getById: prefixUrl + '/exportForm/',
                getExportFormId: prefixUrl + '/exportForm/flow/',
                declarationAudit: prefixUrl + '/exportForm/declarationAudit',//审核报关
                createCancelExport: prefixUrl + '/exportForm/createCancelExport',//取消报关
                createExportBooking: prefixUrl + '/exportForm/createExportBooking',//订舱
                declare: prefixUrl + '/exportForm/declare',//报关处理
                settlement: prefixUrl + '/exportForm/settlement',//结汇
                //	POST /exportForm/refund
                refund: prefixUrl + '/exportForm/refund',//退税
                getLogisticsServiceListByPage: prefixUrl + '/logisticsService/listByPage',
                customsDeclarationForm: prefixUrl + '/exportForm/cgListByPage',
                productManageSuffix: prefixUrl + '/product/',
                productManage: prefixUrl + '/product/listByPage',
                getExportInspectionListByPage: prefixUrl + '/exportInspection/listByPage',
                getDrawerList: prefixUrl + '/exportDrawer/listExportDrawerByPage',
                getByDrawerId: prefixUrl + '/exportDrawer/findExportDrawerById/', //开票人详情
                postBePerfect: prefixUrl + '/exportDrawer/toBePerfect/', //资料待完善提交
                putAuditThrough: prefixUrl + '/exportDrawer/approved/', //审核通过
                putAuditReject: prefixUrl + '/exportDrawer/refuse/', //审核拒绝
                putTemporaryThrough: prefixUrl + '/exportDrawer/temporary/' //临时审核通过
            }
        },

        productManage: {
            tpl: {
                productList: 'tpl/productManage/productList.html',
                proprietaryList: 'tpl/productManage/proprietaryList.html',
                productDetail: 'tpl/productManage/productDetail.html',
                publishProduct: 'tpl/productManage/publishProduct.html'
            },
            api: {
                commodity: prefixUrl + '/commodity/',
                productList: prefixUrl + '/commodity/listByPage',
                proprietaryList: prefixUrl + '/selfCommodity/listByPage',
                selfCommodity: prefixUrl + '/selfCommodity/'
            }
        },

        homeManagement: {
            tpl: {
                suggestionList: "tpl/homeManagement/suggestionList.html",
                suggestionDetail: "tpl/homeManagement/suggestionDetail.html",
                suggestionHandle: "tpl/homeManagement/suggestionHandle.html"
            },
            api: {
                getList: prefixUrl + '/feedback/listByPage',
                getById: prefixUrl + '/feedback/'
            }
        },


        supplier: {
            tpl: {
                supplierList: "tpl/supplier/supplierList.html",
                supplierDisplay: "tpl/supplier/supplierDisplay.html"
            },
            api: {
                listByPage: prefixUrl + "/supplier/listByPage",
                getSupplierById: prefixUrl + "/supplier/",
                audit: prefixUrl + "/supplier/audit"
            }
        },

        purchaseInfo: {
            tpl: {
                matchInfo: "tpl/purchaseInfo/matchInfo.html",
                infoDetail: "tpl/purchaseInfo/infoDetail.html",
                matchRecord: "tpl/purchaseInfo/matchRecord.html",
                recordDetail: "tpl/purchaseInfo/recordDetail.html"
            },
            api: {
                matchPeople: prefixUrl + "/purchaseInfoMatching/matchingUserListByPage",
                filterData: prefixUrl + "/purchaseInfoMatching/matchingPurchaseListByPage",
                submit: prefixUrl + "/purchaseInfoMatching/addPurchaseInfoMatching",
                query: prefixUrl + "/purchaseInfoMatching/",
                recordList: prefixUrl + "/purchaseInfoMatching/matchingRecordListByPage",
                recordDetail: prefixUrl + "/purchaseInfoMatching/matchingDetailsListByPage"
            }
        },

        purchasers: {
            tpl: {
                purchasersList: "tpl/purchasers/purchasersList.html",
                purchasersEdit: "tpl/purchasers/purchasersEdit.html",
                purchasersDisplay: "tpl/purchasers/purchasersDisplay.html"
            },
            uri: {
                purchasersByList: "js/data/mockData/purchasers.json"
            },
            api: {
                purchasersByList: prefixUrl + "/company/listByPage",
                purchasersEdit: prefixUrl + "/company/",
                companyBase: prefixUrl + "/company/companyBase",
                companyLicenses: prefixUrl + "/company/companyLicenses",
                checkUserIsBindCompany: prefixUrl + "/company/checkUserIsBindCompany",
                checkLicenseNumber: prefixUrl + "/company/licenseNumber",
                checkCompanyCn: prefixUrl + "/company/check"
            }
        },
        email: {
            tpl: {
                emailSetting: "tpl/email/emailSetting.html"
            },
            api: {
                email: prefixUrl + "/email/",
                emailSetting: prefixUrl + "/email/emailSetting",
                emailTemplate: prefixUrl + "/email/emailTemplate",
                emailTest: prefixUrl + "/email/test"
            }
        },
        datacrawling: {
            tpl: {
                dataCrawling: "tpl/datacrawling/dataCrawling.html"
            }

        },
        dataCleaning: {
            tpl: {
                dataCleaning: "tpl/dataCleaning/dataCleaning.html"
            },
            api: {
                listByPage: prefixUrl + "/crawlerResult/listProductImages/",
                clearWatermark: prefixUrl + "/crawlerResult/markImageDeleted/",
                markImageRead: prefixUrl + "/crawlerResult/markImageRead/",
                cancelDelete: prefixUrl + "/crawlerResult/cancelDeleteImages/"
            }
        },
        system: {
            tpl: {
                "systemMessage": "tpl/system/systemMessage.html",
                "systemLog": "tpl/system/systemLog.html",
                "systemmessageEdit": "tpl/system/systemmessageEdit.html",
                "systemMessageList": "tpl/system/systemMessageList.html",
                "systemMessageDisplay": "tpl/system/systemMessageDisplay.html"
            },
            api: {
                systemMessageListByPage: prefixUrl + "/message/listByPage",
                systemMessageSave: prefixUrl + "/message/save",
                systemMessageSend: prefixUrl + "/message/send",
                systemMessageDisplay: prefixUrl + "/message/"
            }
        },
        systemLog: {
            tpl: {
                "systemlogList": "tpl/system/systemlogList.html"
            },
            api: {
                operationModules: prefixUrl + "/operationLog/operationModules",
                operationLogListByPage: prefixUrl + "/operationLog/listByPage",
                csvFile: prefixUrl + "/operationLog/csvFile",
                delSystemLog: prefixUrl + "/operationLog/"
            }
        },
        /**管理员、权限设置*/
        authority: {
            tpl: {
                "authoritySetting": "tpl/authority/authoritySetting.html",
                "addAdmin": "tpl/authority/addAdmin.html",
                "addRole": "tpl/authority/addRole.html"
            },
            uri: {
                getRole: "js/data/mockData/role.json"
            },
            api: {
                addAdmin: prefixUrl + "/backendUser/",
                delete: prefixUrl + "/backendUser/",
                changeAdmin: prefixUrl + "/backendUser/",
                getAdminRole: prefixUrl + "/role/listAll",
                addRole: prefixUrl + "/role/",
                getRole: prefixUrl + "/role/new",
                adminListPage: prefixUrl + "/backendUser/listByPage",
                roleListPage: prefixUrl + "/role/listByPage",
                getAdminById: prefixUrl + "/backendUser/",
                getRoleById: prefixUrl + "/role/",
                login: prefixUrl + "/backendUser/login",
                logout: prefixUrl + "/backendUser/logout",
                changeRole: prefixUrl + "/role/",
                roleDelete: prefixUrl + "/role/",
                changePass: prefixUrl + "/backendUser/password"
            }
        },
        admin: {
            api: {
                getAdminInfo: prefixUrl + "/backendUser/loginInformation"
            }
        },
        statistics: {
            tpl: {
                "realTimeTraffic": "tpl/statistics/realTimeTraffic.html",
                "pageRanking": "tpl/statistics/pageRanking.html",
                "searchForHotWords": "tpl/statistics/searchForHotWords.html",
                "historicalFlow": "tpl/statistics/historicalFlow.html",
                "userInformation": "tpl/statistics/userInformation.html",
                "ip": "tpl/statistics/ip.html",
                "externalLinks": "tpl/statistics/externalLinks.html"
            },
            api: {
                getPageRankingList: prefixUrl + "/monitor/urlAccess/stat",
                getHotWordsList: prefixUrl + "/monitor/hotWords/stat",
                "historicalFlowPV": prefixUrl + "/monitor/pv/stat",
                "historicalFlowUV": prefixUrl + "/monitor/uv/stat",
                "userInformationBrowser": prefixUrl + "/monitor/browser/stat",
                "userInformationOperatingSystem": prefixUrl + "/monitor/os/stat",
                ip: prefixUrl + "/monitor/ipAccess/stat",
                externalLinks: prefixUrl + "/monitor/externalLinks/stat",
                realTimeTrafficWs: prefixUrl + "/xbn-ws-monitor/"
            }
        },
        blog: {
            tpl: {
                "articleEdit": "tpl/blog/articleEdit.html",
                "articleList": "tpl/blog/articleList.html"
            },
            api: {
                articleList: prefixUrl + "/blog/listPostByPage",
                articleEdit: prefixUrl + "/blog/"
            }
        },

        inquiry: {
            tpl: {
                inquiryList: "tpl/inquiry/inquiryList.html",
                addRFQ:"tpl/inquiry/addRFQ.html",
                addPrice:"tpl/inquiry/addPrice.html",
                inquiryDetail: "tpl/inquiry/inquiryDetail.html",
                contactUsList: "tpl/inquiry/contactUsList.html",
                contactUsDetail: "tpl/inquiry/contactUsDetail.html"
            },
            api: {
                inquiryList:prefixUrl + '/sourcingRequest/listByPage',
                addRFQ:prefixUrl + "/sourcingRequest/",
                addPrice:prefixUrl + "/sourcingRequestQuote/",
                updateReadStatus:prefixUrl + "/sourcingRequest/readStatus",
                inquiryDetail:prefixUrl + "/sourcingRequest/",
                srPublishDetail:prefixUrl + "/srPublish/",
                quote:prefixUrl + "/sourcingRequestQuote/listByPage",
                additional:prefixUrl +  "/sourcingRequest/additional/",
                updateSRPublish:prefixUrl +  "/srPublish/updateSRPublish",
                updateAdditionalPublish:prefixUrl +  "/srAddPublish/updateAdditionalPublish",
                contactUsList:prefixUrl + '/feedback/listFeedBack',
                contactUsDetail:prefixUrl + '/feedback/detail/',
                contactUsState:prefixUrl + '/feedback/'
            }
        },

        agent: {
            tpl: {
                agentList: "tpl/agent/agentList.html",
                agentDetail: "tpl/agent/agentDetail.html",
            },
            api: {
                agentList: prefixUrl + "/agent/listByPage",
                agentDetail: prefixUrl + "/agent/"
            }
        },
        /**9610业务*/
        declare: {
            tpl: {
                orderList: "tpl/declare/orderList.html",
                addOrder: "tpl/declare/orderEdit.html"
            },
            api: {//POST /api/memberadmin/order/create
                orderList: prefixUrl + "/order/listByPage",
                addOrder: prefixUrl + "/order/create"
            }
        },

        env: {
            production: false
        }

    };

    X.prototype.config = config;


    X.prototype.constant = {
        statusCode: {
            SUCCESS: 2000000
        },
        channel: {
            "menuSwitch": "menuSwitch",
            "menuCall": "menuCall",
            "menuReady": "menuReady",
            "breadCrumbChange": "breadCrumbChange"
        }

    }

})(window, this.Xbn);