X.define("model.menuModel",function () {

    var query = X.config.common.api.menu,
    	menuModel =	X.model.create("model.menuModel",{service:{ query:query}})

    
    var menus;

    menuModel.getMenu = function(callback) {
    	if(menus==undefined){
    		menuModel.load({},function (models) {    	
		       menus =  X.model.createTreeNode(models["root"].attributes,true);
		       menus.loadFromData(models["root"].attributes.children);
		       //menus.initFromData(models["root"].attributes);
		       if(X.isFunction(callback)){
		           callback(menus);
		       }		       
		    });		
    	}else{
	    	if(X.isFunction(callback)){
			    callback(menus);
			}
		}		       
    };

	return menuModel;
})