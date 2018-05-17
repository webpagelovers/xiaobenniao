X.define("adapter.layer",function () {

	var option = {
		url: "js/lib/layer/layer.js"
	};

	X.syncRequestScript(option);

	if(layer){
		layer.config({
  			path: '/js/lib/layer/' //layer.js所在的目录，可以是绝对目录，也可以是相对目录
		});
	}
});
