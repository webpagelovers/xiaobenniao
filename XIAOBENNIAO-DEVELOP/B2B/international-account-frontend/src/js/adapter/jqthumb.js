X.define("adapter.jqthumb",function () {

	var root = "js/lib/";

	var option = {
		url:  root + (X.config.env.production ? "jqthumb.min.js" : "jqthumb.js")
	};

	var rText = X.syncRequest(option.url);
	try{
		window.eval(rText);
	}catch(e){
		//IE8,9兼容性
		window.execScript(rText);
	}
});
