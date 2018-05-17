X.define("adapter.webuploader",function () {

	var root = "js/lib/webuploader/";

	var option = {
		url:  root + (X.config.env.production ? "webuploader.min.js" : "webuploader.js")
	};

	var rText = X.syncRequest(option.url);
	try{
		window.eval(rText);
	}catch(e){
		//IE8,9兼容性
		window.execScript(rText);
	}

});
