
X.define("modules.menu.menu", function () {
	
	var map = X.config.menu.tpl.nas;

	//初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-menu"),
        url: X.config.menu.tpl.nas
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    var loadModule = function(para,state,opara){
		var realModule = X.config.route[para.m];
		var module;
		if(realModule){	
			module = X.require.getModule(realModule);
			para.state = state;
			if(module){
				para["isPostBack"] = true;
				module.load(para);
			}
			else{
				X.require([realModule],function (module) {
					module.load(para);
				});	
			}
			
			//销毁上一个module, 有些时候会有类似 blog 不完整的，应该是blog.blogDetail这样
			if(opara && opara.m && opara.m.split('.').length > 1){
				var omodule = X.require.getModule(X.config.route[opara.m]);
				if(omodule){
					omodule.dispose();
				}				
			}						
		}

	};

	function initRouter() {
        //导航路由响应事件回调函数
        X.router.callback = function (para,state,opara) {
            if (!para.m) {

                //默认模块地址写入路由 基础配置内
                //main.router.setHistory("", "系统管理");
                //根据权限设置默认页面
                //var roles=JSON.parse(win.localStorage.Roles)[0];            
                X.router.setHistory("m=" +X.config.route["default"], "基本信息");
                X.router.init();
            } else {

                //验证登录
                if(para.m === "login.login"){
                    loadModule(para,state,opara);                                    
                }else{
                    loadModule(para,state,opara);                 
                    /*if(ctrl.Accordion==undefined){
                    	m.getModel('menuModel', function(menuModel) {
                    		menuModel.getMenu(function (menus) {
								var node = menus.getTreeNodeByCode(para.m);					
								if(node){
									ctrl.initNode = node;
								}
							});
                    	})
                    }*/
                    
                }
            }
        };
        //初始化路由分发器
        X.router.init();

    }  

    ctrl.load = function (para) {
    	var currentModule = X.getRequest();
		if(currentModule && currentModule.m!="login.login"){

			view.render(function() {
				events.init()
			});
			
		}

		initRouter();
    };

    var m = X.lazyloadModules
    var events = {
    	init: function() {
    		var modules  = ['model.menuModel', 'model.systemModel', 'model.adminModel', 'common.layer']
    		m.init(modules)
    		this.renderMenu()
    		this.getAdminBase()
    	},
    	renderMenu: function() {
    		var me   = this,
    			data = dataCache.menuData()

    		//先用localStorage里的数据进行渲染，然后去后台拿数据，最后比较是否相同 来判断是否需要重新渲染
    		data && me._renderMenu(data)

    		m.getModel('menuModel', function(menuModel) {
    			menuModel.getMenu(function(result) {
    				if (JSON.stringify(result) != JSON.stringify(dataCache.menuData())) {
	    				dataCache.menuData(result)
	    				me._renderMenu(result)
    				}
    			})
    		})
    	},
    	_renderMenu: function(result) {
    		//var menus = result
			var root  =  null,
				menus =  X.model.createTreeNode(root = this._recursiveMap(result), true),
				options = {
	    			map:{id:"menuId","name":"menuName","ico":"iconUrl"},
	    			onItemClick:function (item, data) {
	                	events.fireClick(data);
		    		}
		    	}

	    	menus.loadFromData(root.children);
    		ctrl.Accordion = X.controls.getControl("Accondion",$(".js-accondion"), options);
    		ctrl.Accordion.init({"children":menus.children});
    		ctrl.initNode && ctrl.Accordion.setSelectedItem(ctrl.initNode);
    		
    		this.addMenuEvents()
    	},
    	_recursiveMap: function(root) {
			var len = root.children.length,
				child
			for (var i = 0 ; i < len; i++) {
				child = root.children[i];
				child.code = child.link;			
				if(child.children){
					this._recursiveMap(child)
				}
			}
			return root;
		},
    	addMenuEvents: function() {
    		view.el.find(".changePassword").unbind('click').click(function() {
    			events.changePassword()
    		})
    	},
	    fireClick: function (data,para) {
	        if(data && data.link){
	            var url = "m=" + data.link;
	            if(para){
	                url += "&" + X.toUrlPara(para);
	            }
	            X.router.run(url,data.name);
	            //breadCrumb.setCrumb(data);
	        }
	    },
	    changePassword: function() {
	    	layer.open({
				id:"changePasLayer",
				type :1,
				title :"修改密码",
				btn:["确定"],
				area:["320px","340px"],
				content: ctrl.view.find(".js-changePasLayer").html(),
				success:function(){
					$('#changePasLayer').find(".js-changePas").validate({
						rules: {
							oldPas: {
								required: true,
								isUserPas:true
							},
							newPas: {
								required: true,
								rangelength: [6, 16],
								strongPsw: true
							},
							confirmPas: {
								required: true,
								equalTo: "#changePasLayer #newPas"
							}
						},
						messages: {
							oldPas: {
								required: "请输入原密码！",
								isUserPas:"原密码输入不正确！"
							},
							newPas: {
								required: "请设置新密码！",
								rangelength:"请输入6到16位密码！",
								strongPsw:"至少包含数字与字母的组合！"
							},
							confirmPas: {
								required: "请再次输入新密码！",
								equalTo:"两次密码输入不一致！"
							}
						},
						onkeyup: false,
						onfocusout: function (element) {
							var elem = $(element);
							elem.valid();
						},
						errorPlacement: function (error, element) {
							error.appendTo(element.parent().find(".js-error"));
						}
					});
				},
				yes :function(index){
					if($('#changePasLayer').find(".js-changePas").valid()){
						var data ={
							password:$('#changePasLayer').find(".js-newPas").val()
						};
						var callback = function (index) {
							m.getModel('layer', function(customLayer) {
				    			customLayer.successMsg("修改密码成功",function(index){
									layer.closeAll();
									m.getModel('adminModel', function(adminModel) {
										adminModel.logout(function (argument) {
											location.href = X.config.PATH_FILE.path.root + '?m=login.login';
										});
									})
								})
	    					})
						};
						m.getModel('systemModel', function(systemModel) {
							systemModel.changePass(data,callback);
						})
					}
				}

			});
	    },
	    getAdminBase: function(){
	    	var me   = this,
	    		data = dataCache.adminData()
	    	data && me._renderAdminBase(data)
	    	
			m.getModel('adminModel', function(adminModel) {
				adminModel.getAdminInfo(function(result){
					if (JSON.stringify(result) !== JSON.stringify(dataCache.adminData())) {
						me._renderAdminBase(result)
						dataCache.adminData(result)
					}
				})
			})
		},
		_renderAdminBase: function(result) {
			ctrl.view.find(".js-adminName").html(result.data[0].userName);
			ctrl.view.find(".js-adminRole").html(result.data[0].realname);
			if(result.data[0].avatarUrl){
				ctrl.view.find(".js-avatar").attr('src',result.data[0].avatarUrl)
			}
		}
    }

    //由于部署在国外的weintrade速度慢，所以打算将admin、menu的数据，缓存在localstorage里，等页面展示完再去更新
  	var dataTypes = ['adminData', 'menuData'],
  		dataCache = (function(){
  			var result = {}
  			dataTypes.forEach(function(item) {
  				result[item] = function(data) {
  					return data? localStorage.setItem(item, JSON.stringify(data)): JSON.parse(localStorage.getItem(item))
  				}
  			})
  			return result
  	})()

    $(document).on("click","a[data-back]",function(){
		X.router.back();
	});

	return ctrl;
});