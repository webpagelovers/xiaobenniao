X.define("adapter.ueditor",function () {
	var export2 = {
		msg : "ueditor.ready"
	};

	var root = "js/lib/ueditor/dist/";
	window.UEDITOR_HOME_URL = root;

	var msg = ["ueditor.config.ready","ueditor.all.ready","zh-cn"];

	var option0 = {
		url : root + (X.config.env.production ? "ueditor.config.js" : "ueditor.config.js"),	
		callback : function(){X.requestScript(option1)}
	};

	var option1 = {
		url : root + (X.config.env.production ? "ueditor.all.min.js" : "ueditor.all.js"),
		callback :  function(){X.requestScript(option2)}	
	};
	

	var option2 = {
		url : root + "lang/zh-cn/zh-cn.js",
		callback : function(){
			window.UEDITOR_CONFIG.toolbars = [
					[ 'bold','forecolor','insertcode','fontsize','paragraph','link']
				];

			window.UEDITOR_CONFIG.elementPathEnabled = false;			
			X.publish(export2.msg)	
		}		
	};

	//X.requestScript(option0);
	
	
	var rText = X.syncRequest(option0.url);
	window.eval(rText);
	var rText = X.syncRequest(option1.url);
	window.eval(rText);
	var rText = X.syncRequest(option2.url);
	window.eval(rText);

	window.UEDITOR_CONFIG.toolbars = [
					[ 'bold','forecolor','insertcode','fontsize','paragraph','link']
				];

			window.UEDITOR_CONFIG.elementPathEnabled = false;			
			X.publish(export2.msg)	

	return export2;

});
