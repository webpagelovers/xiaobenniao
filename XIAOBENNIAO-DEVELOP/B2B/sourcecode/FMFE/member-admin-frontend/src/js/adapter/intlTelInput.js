X.define("adapter.intlTelInput",function () {
	

	var root = "js/lib/";

	var option = {
		url:  root + (X.config.env.production ? "intlTelInput.min.js" : "intlTelInput.js")
	};

	//X.syncRequestScript(option);

	var rText = X.syncRequest(option.url);
	window.eval(rText);

});
