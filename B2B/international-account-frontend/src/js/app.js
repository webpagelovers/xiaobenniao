

//获取 model&modules 的版本
!function loadRevision() {
    var url = X.config.PATH_FILE.path.root + '/rev/manifest.json'
    try {
        X.require.revision = JSON.parse(X.syncRequest(url))
    } catch(e) {
        
    }
}()

X.define("app",["modules.menu.menu","model.dashboardModel"],function (menu,dashboardModel) {

	$.ajaxSetup({
		contentType: "application/json;charset=utf-8",
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true
	});

	jQuery.support.cors = true;

	//初始化视图对象
	var view = X.view.newOne({
		el: $(".xbn-frame")
	});

	//初始化控制器
	var ctrl = X.controller.newOne({
		view: view
	});
	ctrl.replaceAddress = function(){
		//registrationUrl
		ctrl.view.find(".js-index").attr("href", X.config.receptionUrl.indexUrl);
		ctrl.view.find(".js-contactus").attr("href", X.config.receptionUrl.contactUsUrl);
		ctrl.view.find(".js-reregisteragreement").attr("href", X.config.receptionUrl.registrationUrl);
		ctrl.view.find(".js-feedback").attr("href", X.config.receptionUrl.feedbackUrl);
		ctrl.view.find(".js-aboutUs").attr("href", X.config.receptionUrl.aboutUs);

	};
	ctrl.replaceAddress();
	//判断用户的类型，近对应的页面
	/*companyModel.checkCompanyType(function(data){
		if(data == 0){
			return true;
		}else if(data == 2){
			return true;
		}else{
			location.href= X.config.receptionUrl.loginUrl;
		}
	});*/

	//获取xbn-content的高度
	ctrl.setContentSize = function (argument) {
		//20为xbn-content的padding 50为#top的高度
		//var xbnconthe = $(window).height()-$(window).scrollTop()-$(".xbn-header").height()-50-20+"px";
		//$(".xbn-content").css("height",xbnconthe);
	};

	ctrl.jump = function(){
		window.open(X.config.receptionUrl.userInfoUrl);
	};

	ctrl.addEvent("click",".personInfo","jump");


	//nav.load(function () {
		menu.load();
	//});

	var initChannels  =function(){
		//订阅服务消息

		X.channels["e"] = "app.serviceError";
		X.channels["i"] = "app.serviceInfo";

		X.subscribe(X.channels["e"],function(){
			layer.alert("访问服务器错误");
		});

		X.subscribe(X.channels["i"],function(){
			layer.alert("访问服务器错误");
		});
	};

	try {
		initChannels();
	}
	catch(e){
		//失败后，退出登录
	}

	//设置QQ客服
	/*ctrl.qqAcount = "1813027670";//设置QQ账号
	ctrl.view.find(".js-webqq").attr("href",'http://wpa.qq.com/msgrd?v=3&uin='+ ctrl.qqAcount +'&site=qq&menu=yes');


	//悬浮窗 目前版本没有以后重新定义
	ctrl.shows = function(item){
		ctrl.view.find(item).mouseover(function () {
			ctrl.view.find(item).prev().removeClass("noneim").addClass("disb");
			ctrl.view.find(item).addClass("change-bg");
		});
		ctrl.view.find(item).parent("li").mouseleave(function () {
			ctrl.view.find(item).prev().removeClass("disb").addClass("noneim");
			ctrl.view.find(item).removeClass("change-bg");
		});
	};
	ctrl.shows(".js-qq");
	ctrl.shows(".js-tell");
	ctrl.shows(".js-mailbox");*/





	view.el.find(".js-tel").html(X.config.contact.tel);

	window.releaseSource = function() {
		var i = arguments.length
		while (i--) {
			var val = arguments[i]
            if (typeof val === 'object') {
                (val.view && val.view.url)? (window.ctrl = val): (window.model = val)
            } else {
                window.id = val
            }
		}
        /*for (var i in arguments) {
            var val = arguments[i]
            if (typeof val === 'object') {
                (val.view && val.view.url)? (window.ctrl = val): (window.model = val)
            } else {
                window.id = val
            }
        }*/
        new XbnViewModel()
    }

	return {};
});
