X.define("adapter.laydate",function () {

	var option = {
		url: "js/lib/laydate/laydate.js"		
	};

	//X.syncRequestScript(option)

	var rText = X.syncRequest(option.url);
	try{
		window.eval(rText);
	}catch(e){
		//IE8,9兼容性问题
		window.execScript(rText);
	}

	return laydate;
});
