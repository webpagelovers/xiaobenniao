X.define("adapter.underscore",function () {


	var root = "js/lib/underscore/";

	var option = {
		url:  root + (X.config.env.production ? "underscore.min.js" : "underscore.js")
	};

	//X.syncRequestScript(option);

	var rText = X.syncRequest(option.url);
	try{
		window.eval(rText);
	}catch(e){
		//IE8,9兼容性问题
		window.execScript(rText);
	}

});
