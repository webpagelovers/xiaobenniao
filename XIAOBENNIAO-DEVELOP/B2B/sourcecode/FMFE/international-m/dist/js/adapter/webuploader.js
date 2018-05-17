X.define("adapter.webuploader",function () {
	

	var root = "js/lib/webuploader/";

	var option = {
		url:  root + (X.config.env.production ? "webuploader.min.js" : "webuploader.js")
	};

	//X.syncRequestScript(option);

	var rText = X.syncRequest(option.url);
	window.eval(rText);

});
