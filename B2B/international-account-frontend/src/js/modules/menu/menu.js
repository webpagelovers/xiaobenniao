X.define("modules.menu.menu",["model.menuModel","modules.menu.breadCrumb"],function (menuModel, breadCrumb) {

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
            if(module){                
                module.load(para);
                setCrumb(para);
            }
            else{
                X.require([realModule],function (module) {
                    module.load(para);
                    setCrumb(para);
                }); 
            }            
            //销毁上一个module
            if(opara && opara.m){
                var r = X.config.route[opara.m];
                if(r){
                    var omodule = X.require.getModule(r);
                    if(omodule){
                        omodule.dispose();
                    }
                }               
            }                       
        }
    };

    function getFirstLevelNode(node) {
        var temp = node;
        while(temp.parent.id !="root"){
            temp = temp.parent;
        }

        return temp;
    }

   
    /*X.subscribe(X.CONSTANTS.channel.menuCall,function(channel,data){
        if(data && data["m"]){
            //如果当前一级菜单与要打开的菜单不一致，则需要跳转到            
            ctrl.fireItemClick(data["m"],data["para"]);
        }
       
    });*/

    ctrl.load = function (para) {
        menuModel.getMenu(function (menus) {                
            var children = menus.children;           

            view.render(function(){
                ctrl.Accordion = X.controls.getControl("Accondion",$(".js-accondion"),
                    {allowShrink:false,onItemClick:function (item,data) {
                        fireClick(data);
                    }});
                ctrl.Accordion.init({"children":children});
                //加载面包屑
                breadCrumb.load(function () {
                    //加载完成后
                    initRouter();
                    //X.publish(X.CONSTANTS.channel.menuReady);
                });

                menuHelper.init(menus);                
            });
        });
    }

    var fireClick = function (data,para) {        
        if(data && data.code){
            var url = "m=" + data.code;
            if(para){
                url += "&" + X.toUrlPara(para);
            }
            X.router.run(url,data.name);
            //breadCrumb.setCrumb(data);
            menuHelper.setStatistics();
            menuHelper.setCustomerMessage();
            menuHelper.setPlatformMessage();
            menuHelper.setSystemMessage();
            menuHelper.setMessageCenter();
        }            
    };


    var setCrumb = function (para) {
        var code = para.m;
        delete para.m;   

        menuModel.getMenu(function(menus){
            var node = menus.getTreeNodeByCode(code);
            breadCrumb.setCrumb(node);
        });         
    };

    ctrl.fireItemClick = function (menuCode,para) {
        menuModel.getMenu(function(menus){
            var node = menus.getTreeNodeByCode(menuCode);
            if(node.visible==false){
                fireClick(node,para);  
            }
            else{
                ctrl.Accordion.fireClick(node);    
            }           
        });
    };

    var menuHelper = (function(){
        var _menus;

        function formateDisplay (name, count){
            var item = '';
            if (count === 0) {
                item = name + '(' + count + ')';
            } else if (count < 100) {
                item = name + '(<span class="redFont">' + count + '</span>)';
            } else if (count >= 100) {
                item = name + '(<span class="redFont">99<sup>+</sup></span>)';
            } else {
                item = name + '(0)';
            }
            return item;
        }

        function setStatistics(){
            var infoManageNode = _menus.getTreeNodeByCode('infoManage.infoManageList');
            var myResponseNode = _menus.getTreeNodeByCode('infoManage.myResponseList');
            var callback = function(result){                
                ctrl.Accordion.updateItem(infoManageNode, formateDisplay(infoManageNode.name, result.data[0].newPurchaseInfoCount));
                ctrl.Accordion.updateItem(myResponseNode, formateDisplay(myResponseNode.name, result.data[0].newResponseCount));
            }
            //infoManageModel.getStatistics(callback);
        }

        function setCustomerMessage(){
            var clientMessageNode = _menus.getTreeNodeByCode('message.clientMessage');
            if(clientMessageNode){
                var callback = function(result){
                    ctrl.Accordion.updateItem(clientMessageNode, formateDisplay(clientMessageNode.name, result.data[0]));                   
                }
                //messageModel.findUnReadClientMessageCount(callback);
            }
        }

        function setPlatformMessage() {
            var platformMessageNode = _menus.getTreeNodeByCode('message.systemBulletin');
            if (platformMessageNode) {
                var callback = function(result){
                    ctrl.Accordion.updateItem(platformMessageNode, formateDisplay(platformMessageNode.name, result.data[0]));
                }
                //messageModel.getPlatformMessageCount(callback);
            }
        }

        function setSystemMessage() {
            var systemMessageNode = _menus.getTreeNodeByCode('message.systemMessage');
            if (systemMessageNode) {
                var callback = function(result){
                    ctrl.Accordion.updateItem(systemMessageNode, formateDisplay(systemMessageNode.name, result.data[0]));
                };
                //messageModel.getSystemMessageCount(callback);
            }
        }

        function setMessageCenter() {
            var messageCenter = $(".js-messageCenter");
            if (messageCenter) {
                var callback = function(result){
                    messageCenter.html(formateDisplay('消息中心', result.data[0]));
                }
                //messageModel.getMessageCenterCount(callback);
            }
        }

        function init(menus){
            _menus = menus;
            setStatistics();
            setCustomerMessage();
            setPlatformMessage();
            setSystemMessage();
            setMessageCenter();
        }


        return {
            init : init,
            setStatistics : setStatistics,
            setCustomerMessage : setCustomerMessage,
            setSystemMessage : setSystemMessage,
            setPlatformMessage : setPlatformMessage,
            setMessageCenter : setMessageCenter
        }

    }());    

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
                }
            }
        };
        //初始化路由分发器
        X.router.init();

    }  


    /*X.subscribe(X.CONSTANTS.channel.breadCrumbChange,function(channel,data){
        //递归找到第一个可显示的父节点，设置选中
        var node = data;
        while(node && node.visible==false){
            node = node.parent;
        }       

        if(node && node.visible!=false){
            ctrl.Accordion.setSelectedItem(node);
        }              
    });*/

   /* X.subscribe(X.CONSTANTS.channel.menuUpdate,function(channel,data){
        if (data == "statistics") {
            menuHelper.setStatistics();
        } else if (data == "customerMessge") {
            menuHelper.setCustomerMessage();
            menuHelper.setMessageCenter();
        } else if (data == "systemMessage") {
            menuHelper.setSystemMessage();
            menuHelper.setMessageCenter();
        }
    });*/


    $(document).on("click","a[data-back]",function(){
        X.router.back();
    });

    return ctrl;
});
