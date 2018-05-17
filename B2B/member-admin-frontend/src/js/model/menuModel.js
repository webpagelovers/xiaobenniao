
X.define("model.menuModel",function () {

	//临时测试数据
	//var query = "js/data/menu.json";//X.config.menu.api.nas;

	var query = X.config.menu.api.nas;

	var menuModel =	X.model.create("model.menuModel",{service:{ query:query},"idAttribute":"menuId"});

	menuModel.getMenu = function(callback) {
		menuModel.load({},function (data) {
			callback(data[0]);
		});
	};

	return menuModel;
});