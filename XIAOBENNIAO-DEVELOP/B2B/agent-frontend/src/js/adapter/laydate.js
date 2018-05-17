X.define("adapter.laydate", function () {

	var option = {
		url: "js/lib/laydate/laydate.js"		
	};

	//X.syncRequestScript(option)

	var rText = X.syncRequest(option.url);
	window.eval(rText);    
});
