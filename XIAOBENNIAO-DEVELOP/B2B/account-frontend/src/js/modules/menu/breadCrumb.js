X.define("modules.menu.breadCrumb",function () {

	//初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-breadcrumb"),
        url: X.config.menu.tpl.breadCrumb
    });

    //初始化控制器
    var breadCrumb = X.controller.newOne({
        view: view
    });

    var stack = [];    

    var render = function () {    	
    	breadCrumb.view.renderIn(".js-breadCrumb-tpl",".js-breadCrumb-container",stack[0]);    	
    	for (var i = 1; i < stack.length; i++) {
    	   breadCrumb.view.renderTo(".js-breadCrumb-tpl",".js-breadCrumb-container",stack[i]);    	    		
    	}
        if(stack.length==1 && stack[0].code=="accountSettings.companyInfo"){
            view.el.hide();
        }
        else{
            view.el.show();   
        }
    };

    var getPosition = function (menu) {
        if(menu){
            var temp = menu;
            stack.length = 0;
            while(temp.parent!=null && temp.parent.getLevel()>0){
                stack.push(temp);
                temp = temp.parent;
            }

            stack.reverse();

            render();

            //修订刷新时，不能正确显示标题的问题
            document.title = menu.name;
            
            X.publish(X.CONSTANTS.channel.breadCrumbChange,menu);
        }    	
    };

	
	breadCrumb.setCrumb = function (menu) {
		getPosition(menu);		
	};	
	
    breadCrumb.addCrumb = function (menu,para) {             
        getPosition(menu);           
    };


	breadCrumb.load = function (callback) {
		var that = this;
        breadCrumb.view.render(function () {            
            view.find(".js-breadCrumb-container").on("click",function(event){
                that.nav(event);
            });

            if(X.isFunction(callback)){
                callback();
            }
        });
	};

     breadCrumb.nav = function (event) {
        var that = $(event.target);
        var id = that.attr("id");
        var index;
        if(id && X.isString(id) && id.length>0){
            for(var i=0;i<stack.length;i++){
                if(stack[i].code==id){
                    index = i;
                    break;
                }
            }
        }

        if(index!=undefined){
            var goIndex = index-(stack.length-1);
            if(goIndex !=0){
                window.history.go(goIndex);
            }            
        }        
    };    

	return breadCrumb;
});