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
		url : root + (X.config.env.production ? "ueditor.all.min.js" : "ueditor.all.min.js"),
		callback :  function(){X.requestScript(option2)}	
	};
	

	var option2 = {
		url : root + "lang/zh-cn/zh-cn.js",
		callback : function(){
			window.UEDITOR_CONFIG.toolbars = [
					/*[ 'bold','forecolor','fontsize','paragraph','link']*/
				[ 'undo', //撤销
					'redo', //重做
					'bold', //加粗
					'indent', //首行缩进
					'italic', //斜体
					'underline', //下划线
					'strikethrough', //删除线
					'subscript', //下标
					'fontborder', //字符边框
					'formatmatch', //格式刷
					'source', //源代码
					'blockquote', //引用
					'pasteplain', //纯文本粘贴模式
					'selectall', //全选
					'horizontal', //分隔线
					'removeformat', //清除格式
					'unlink', //取消链接
					'cleardoc', //清空文档
					'insertparagraphbeforetable', //"表格前插入行"
					'fontfamily', //字体
					'fontsize', //字号
					'paragraph', //段落格式
					'link', //超链接
					'justifyleft', //居左对齐
					'justifyright', //居右对齐
					'justifycenter', //居中对齐
					'justifyjustify', //两端对齐
					'forecolor', //字体颜色
					'imagecenter', //居中
					'lineheight', //行间距
					'autotypeset', //自动排版
					'inserttable' //插入表格
					]
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

	window.UEDITOR_CONFIG.toolbars = [[
		'undo', //撤销
        'redo', //重做
        'bold', //加粗
        'indent', //首行缩进
        'italic', //斜体
        'underline', //下划线
        'strikethrough', //删除线
        'subscript', //下标
        'fontborder', //字符边框
        'formatmatch', //格式刷
        'source', //源代码
        'blockquote', //引用
        'pasteplain', //纯文本粘贴模式
        'selectall', //全选
        'horizontal', //分隔线
        'removeformat', //清除格式
        'unlink', //取消链接
        'cleardoc', //清空文档
        'insertparagraphbeforetable', //"表格前插入行"
        'fontfamily', //字体
        'fontsize', //字号
        'paragraph', //段落格式       
        'link', //超链接
        'justifyleft', //居左对齐
        'justifyright', //居右对齐
        'justifycenter', //居中对齐
        'justifyjustify', //两端对齐
        'forecolor', //字体颜色
        'imagecenter', //居中
        'lineheight', //行间距
        'autotypeset', //自动排版
        'inserttable', //插入表格

	]];

	//启动右键菜单
	window.UEDITOR_CONFIG.enableContextMenu = true;
	window.UEDITOR_CONFIG.elementPathEnabled = false;
	X.publish(export2.msg);

	return export2;

});
