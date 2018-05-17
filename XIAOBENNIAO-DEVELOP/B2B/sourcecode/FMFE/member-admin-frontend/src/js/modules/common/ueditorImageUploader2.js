X.define("modules.common.ueditorImageUploader2",["adapter.webuploader","adapter.ueditor"],function () {

	var  regUEImgUpload = {
		setImgUpload:{
			type : 17,  //上传图片传给后端类型
			size : 5,   //上传图片大小
			width : 1000,  //上传成功后在编辑器展示的宽度
			height : 1000  //上传成功后在编辑器展示的高度
		},
		//上传图片代码
		imageUploader : function(Editor,setImgUpload){
			var that = this;
			var opt = {
				Editor : Editor, //传入的UEditor对象
				pick : $('.edui-for-上传图片').find('.edui-button-body'), //上传按钮
				dnd : Editor.body, //拖拽上传容器，添加则开启拖拽事件
				paste : document.body, //粘贴上传容器，添加则开启粘贴事件,只支持QQ截图的图片
				type : setImgUpload.type,  //上传图片传给后端类型
				size : setImgUpload.size,   //上传图片大小
				width : setImgUpload.width,  //上传成功后在编辑器展示的宽度
				height : setImgUpload.height, //上传成功后在编辑器展示的高度
				extensions : "jpg,jpeg,gif,png,bmp", //允许上传图片类型
				server : X.constructor.prototype.config.PATH_FILE.path.rootImg  //上传接口
			};

			// 实例化
			var uploader = WebUploader.create({
				pick:opt.pick,
				formData: {
					fileType: opt.type
				},
				dnd:opt.dnd,
				paste:opt.paste,
				auto:true,
				swf: 'js/lib/webuploader/Uploader.swf',
				sendAsBinary:true, //指明使用二进制的方式上传文件
				duplicate:true,  //重复上传
				chunked: false,
				chunkSize: 512 * 1024,
				server: opt.server,
				fileSizeLimit: opt.size * 1024 * 1024,
				accept :{
					extensions : opt.extensions
				}
			});


			//在Editor底部添加上传图片错误容器
			var errorWrap = $('#edui1_bottombar').find('tbody').find('tr');
			errorWrap.prepend('<td id="edui1_errorPic" class="edui-editor-bottombar edui-default error"></td>');
			// 图片上传成功
			uploader.on( 'uploadSuccess', function( file,response) {
				if(response.data){
					errorWrap.find('#edui1_errorPic').text('');
					//判断是否包含域名，没有域名就补全域名
					var src, url = response.data.url;
					if(url.split('/')[0] == "http:" || url.split('/')[0] == "https:"){
						src = url;
					}else{
						src = X.constructor.prototype.config.PATH_FILE.path.imgUrl + response.data.url;
					}

					var width = opt.width ? opt.width : (file._info ? (file._info.width > opt.width ? opt.width : file._info.width)  : '100');
					var htight = opt.height ? opt.height : (file._info ? (file._info.height > opt.width ? opt.width : file._info.height) : '100');
					//图片上传成功后，在编辑器光标处插入
					opt.Editor.execCommand( 'insertimage', {
						src: src,
						width: width,
						height: htight
					});
				}
			});

			uploader.on( 'error', function( type ) {
				var text;
				switch( type ) {
					case 'Q_EXCEED_SIZE_LIMIT':
						text = '请上传大小在'+ opt.size +'M以内的文件';
						break;

					case 'Q_EXCEED_NUM_LIMIT':
						text = '文件数量超出最大值';
						break;
					case 'F_DUPLICATE':
						text = '文件不能重复上传';
						break;
					case 'Q_TYPE_DENIED':
						text = '请上传支持的文件格式';
						break;
				}
				errorWrap.find('#edui1_errorPic').text(text).css("color","red");
			});

		},

		/*注册上传图片按钮*/
		registerUE : function (imageUploader,setImgUpload){
			UE.registerUI('上传图片', function(editor, uiName) {
				//注册按钮执行时的command命令，使用命令默认就会带有回退操作
				editor.registerCommand(uiName, {
					execCommand: function() {
						//调用具体代码
						alert('execCommand:' + uiName)
					}
				});
				//创建一个button
				var btn = new UE.ui.Button({
					//按钮的名字
					name: uiName,
					//提示
					title: "上传图片",
					//添加额外样式，指定icon图标，这里默认使用一个重复的icon
					cssRules: 'background-position: -381px 0;',
					//点击时执行的命令
					onclick: function() {
						//这里可以不用执行命令,做你自己的操作也可
						/*editor.execCommand(uiName);*/
					}
				});
				//当点到编辑内容上时，按钮要做的状态反射
				editor.addListener('selectionchange', function() {
					var state = editor.queryCommandState(uiName);
					if (state == -1) {
						btn.setDisabled(true);
						btn.setChecked(false);
					} else {
						btn.setDisabled(false);
						btn.setChecked(state);
					}
				});

				var Editor = editor;
				//初始化UEditor对象赋值给editor参数
				//以在图片上传成功后执行uploadSuccess事件，回调里执行Editor.execCommand下注册的insertimage事件
				//以便在编辑器里展示上传的图片
				editor.ready( function(editor) {
					imageUploader(Editor,setImgUpload);
				});

				//因为你是添加button,所以需要返回这个button
				return btn;
			});
		},
		registerUEFun : function(opt){
			var that = this;
			var setImgUpload = opt || that.setImgUpload;
			return that.registerUE(that.imageUploader,setImgUpload)
		}
	};

	return regUEImgUpload;

});