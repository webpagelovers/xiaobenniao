X.define("adapter.echarts",function () {

	var root = "js/lib/";

	var option = {
		url:  root +  "echarts.common.min.js"
	};

	var rText = X.syncRequest(option.url);
	try{
		window.eval(rText);
	}catch(e){
		//IE8,9兼容性
		window.execScript(rText);
	}
});
