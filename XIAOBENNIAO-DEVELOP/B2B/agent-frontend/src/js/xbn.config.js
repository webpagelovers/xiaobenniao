
window.X = Xbn();
X.require.config.baseurl="js/";
X.require.config.rules.push(["\\.","/"]);

(function (win,X) {

	//网站根目录
	var rootPath = "http://agent.dev.atcdeal.com/";
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
	var imgUrl= "http://img.dev.atcdeal.com";
	//寰贸云地址
	var atcdealPath = "http://dev.atcdeal.com/";
	//国际展weintrade
	var weintradePath = "http://dev.weintrade.com/";

	var browserAdapter = {
			isLetIE10 : (function () {
				return $.browser["msie"]==true && parseInt($.browser["version"])<10;
			})(),			
			adaptRoute : function(para){
				if(this.isLetIE10){		
					return "/#!m=" + para;			
				}else{
					return "/?m=" + para;					
				}
			}
	};

	var config = {

		PATH_FILE: {
	        path: {
	            root: rootPath,
				rootImg: generalUrl + "upload",
				prefixUrl:prefixUrl,
				imgUrl:imgUrl,
				rootImgDisplayUrl :imgDisplayUrl,
				atcdealPath:atcdealPath,
	            modules: "js/modules",
	            weintradePath:weintradePath
	        }
    	},

    	channel :{
    		
    	},


		attach : {
			upload :imageUrl + "/file/upload",
			download :imageUrl + "/file/download",
			downloadTemplate : imageUrl + "/file/",
		},
		

		imageVerification:{
			imageVerificationController:codeUrl
		},

	    common : {
	    	tpl :{
	    		header : rootPath + "tpl/common/header.tpl",
	    		nav : rootPath + "tpl/common/nav.tpl",
	    		footer : rootPath + "tpl/common/footer.tpl"				
	    	},
			api:{
				menu : "js/data/menu.json"
			},
			res : {
				header : rootPath + "i18n/common/common",
				footer : rootPath + "i18n/common/common",
				nav : rootPath + "i18n/common/common",
				common : rootPath + "i18n/common/common"
			},
			link :{
				home : rootPath,
				sourcingRequestDetail:rootPath+"request/sourcing-request-detail.html",
				additionalIinfo:rootPath+"agent/additional-info.html",
				qutation:rootPath+"agent/qutation.html",
                agentRegist:rootPath+"agent/agent-register.html"
			}
	    },
		user : {
			tpl : {
				login: rootPath + "tpl/user/login.tpl",
				regist: rootPath + "tpl/user/regist.tpl"
			},
			api : {
				login: prefixUrl + "/member/login",
				regist: prefixUrl + "/member/registerByEmail",
				logout: prefixUrl + "/member/logout",
				userInfo: prefixUrl + "/member/loginInfo",
				verifyEmail: prefixUrl + "/member/verifyEmail"
			},
			res : {
				login : rootPath + "i18n/user/user",
				regist : rootPath + "i18n/user/user"
			}
		},

		oauth : {
			link : {
				facebook: prefixUrl + '/member/oauth/facebookLogin',
				linkedin: prefixUrl + '/member/oauth/linkedinLogin',
				twitter:  prefixUrl + '/member/oauth/twitterLogin'
			}
		},

		request: {
			tpl :{
                sourcingRequestDetail : rootPath + "tpl/request/sourcing-request-detail.tpl"
			},
			api:{
				buyRequest : rootPath + "api/international/buyingRequest/",
                sourcingRequest: rootPath + "api/international/sourcingRequest/"
			},
			res : {	 
                sourcingRequestDetail : rootPath + "i18n/request/sourcing-request-detail"
			}
		},

		agent: {
			tpl :{
				additionalInfo : rootPath + "tpl/agent/additional-info.tpl",
				qutation : rootPath + "tpl/agent/qutation.tpl",
				agentRegist:rootPath + "tpl/agent/agent-register.tpl"
			},
			api:{
				getAgent : prefixUrl + "/sourcingRequest/",
				postAgent : prefixUrl + "/sourcingRequestQuote/",
				mobileCode: codeUrl + "/VerificationCode/send/",
				agentRegister:prefixUrl + "/member/agentRegister",
				agentInformation:prefixUrl + "/member/agentInformation",
				getAgentInfo:prefixUrl + "/member/loginInfo"

			},
			res : {
				buyRequest : rootPath + "i18n/agent/agent",
				qutation : rootPath + "i18n/agent/qutation"
			}
		},

	    index : {
	    	tpl : {
	    		index : rootPath + "tpl/index/index.tpl",
				firstScreen:rootPath +"tpl/index/first-screen.tpl",
                notFound : rootPath + "tpl/index/notFound.tpl"
	    	},
	    	api : {
				browseProducts : rootPath + "js/data/browseProducts.json",
				getRecentUpdates :prefixUrl + "/commodity/recommendCommodity"
			},
	    	res : {
	    		index : rootPath + "i18n/index/index"

			}
	    },
	
		
		contact : {
			tel : "010-81281397",
			email : "service@ftfbiz.com" 
		},

		env: {
			production: (rootPath.indexOf("dev") ==-1)
		}
	};



	X.prototype.config = config;


	X.prototype.CONSTANT = {
		statusCode : {
			SUCCESS : 2000000,
			NOTPHONE : 2000309,//登录手机号码不存在
			NOTPASSWORD : 2000310, //登录密码不正确
			LOGININVALID : 2000312, //登录用户名或密码错误
			FROEENACOUNT : 2000205, //当前用户已被冻结
			SESSIONEXPIRE : 1000100,//session 失效
			NOLOGIN : 2001000,//未登录
			INVALIDPRODUCT : 2000800 //失效产品
		},
		channel : {
			"navReady" : "navReady",
			"companySubmitAudit" : "companySubmitAudit",
			"loginSuccess" : "loginSuccess",
			"registSuccess" : "registSuccess"
		}
	};

})(window,this.Xbn);