X.define('modules.blog.articleEdit', ['model.blogModel','common.layer','modules.common.ueditorImageUploader','adapter.jqthumb'], function(blogModel,layer1) {
	var view = X.view.newOne({
		el: $('.xbn-content'),
		url: X.config.blog.tpl.articleEdit
	});

	var ctrl = X.controller.newOne({
		view: view
	});

	ctrl.rendering = function(){
		var addArticleFunction = function (data) {
			if(data.listImage){
				var listImage = [];
				listImage.push({filePath:data.listImage});
				data.listImage = listImage;
			}

			if(data.headPic){
				var headPic = [];
				headPic.push({filePath:data.headPic});
				data.headPic = headPic;
			}

			data.postStatus ? ctrl.postStatus = data.postStatus : '';

			return view.render(data, function () {
				var uploadOpt = {
					size: 5,
					type: 19,
					auto: false,
					filePicker: ".filePicker1",
					filePickerLabel : "上传附件",
					extensions : 'gif,jpg,jpeg,png,bmp',
					Q_TYPE_DENIED_TEXT : '图片格式不支持',
					uploadSuccess: function(res,wrap){
						ctrl.uploadSuccess(wrap,'200','150');
						//上传按钮样式变化
						ctrl.buttonStyleChange(wrap);
					},
					//上传成功后的数据回填格式函数
					uploadSuccessPageShow : function (response, wrap) {
						(($(wrap).html() == '')? '' : $(wrap).html(''));
						return  '<div class="wrapUpload disib"><img src="'+ response.data.url +'"/><span class="cancel">X</span></div>';
					},
					//数据回填的扩展函数
					setValuePageShow : function(item,wrap){
						ctrl.buttonStyleChange(wrap);
						return '<div class="wrapUpload disib"><img src="'+ item.filePath +'"/><span class="cancel">X</span></div>';
					},
					//数据回填成功的扩展函数
					setValueSuccess : function(response, wrap){
						ctrl.uploadSuccess(wrap,'200','150');
					},
					//删除图片成功后的扩展函数
					cancelSuccessAfter : function(wrap){
						$(wrap).next().children().addClass('default_button').css("color","#00aff0").css("border-width",'1').css('background','white');
						$(wrap).next().children().children('.webuploader-pick').text('上传图片');
					},
					crop: {
	                    aspectRatio: "1.35",
	                    data: {},
	                    done: function() {},
	                    modal: true,
	                    preview: ""
	                }
				};
				var uploadOpt2 = {
					size: uploadOpt.size,
					type: 20,
					filePicker: ".filePicker2",
					extensions : uploadOpt.extensions,
					Q_TYPE_DENIED_TEXT : uploadOpt.Q_TYPE_DENIED_TEXT,
					uploadSuccess: uploadOpt.uploadSuccess,
					filePickerLabel : uploadOpt.filePickerLabel,
					uploadSuccessPageShow : uploadOpt.uploadSuccessPageShow,
					setValuePageShow : uploadOpt.setValuePageShow,
					setValueSuccess : uploadOpt.setValueSuccess,
					cancelSuccessAfter : uploadOpt.cancelSuccessAfter
				};

				ctrl.addArticleVM = ctrl.getViewModel(view.find(".js-addArticle"),{
					meta: {
						"listImage": uploadOpt,
						"headPic": uploadOpt2
					},
					data: data
				});
				ctrl.addArticleVM.initControl();

				var nav = ctrl.view.find(".js-nav");
				_para["postId"] ? nav.text('编辑文章') : nav.text('发布文章');

				// blogModel.statusconst.postStatus.PUBLISH.key 为已发布状态
				if((data && data.postStatus ) == blogModel.statusconst.postStatus.PUBLISH.key){
					var saveButton = ctrl.view.find(".js-save");
					var publishButton = ctrl.view.find(".js-publish");
					saveButton.css('display','none');
					publishButton.val('更新');
				}

				//初始化编辑器
				var editorid = {
					article: "modules.blog.articleEdit"
				};
				UE.delEditor(editorid['article']);
				ctrl.UEditor = UE.getEditor(editorid['article'],{wordCount:false, onready:function(){
					var hiddenArticleContent = ctrl.view.find(".js-hiddenArticleContent");
					if(data && data.postContent){
						var content = ctrl.getBodyHtml(data.postContent);
						ctrl.UEditor.setContent(content);
						$(hiddenArticleContent).val(ctrl.UEditor.getContentTxt());
					}
					ctrl.UEditor.addListener('blur',function(){
						var errorWrap = $(hiddenArticleContent).next().find(".js-error");
						errorWrap.html("");
						$(hiddenArticleContent).val(ctrl.UEditor.getContentTxt());
						if(!$(hiddenArticleContent).val()){
							var error = "<label class='error'>请输入文章内容</label>";
							$(error).appendTo(errorWrap);
						}/*else if($(hiddenArticleContent).val()){
							$(hiddenArticleContent).valid();
						}*/
					});

					/*ctrl.UEditor.dom.domUtils.on(ctrl.UEditor.body, 'paste',function(e){
						alert('1');
					})*/

				}});

				var title = ctrl.view.find(".js-title");
				var titleNumber = ctrl.view.find(".js-titleNumber");
				data && data.postTitle ? ctrl.setDataCounter(title,titleNumber,130) : '';
				ctrl.counter(title,titleNumber,130);

				var abstract = ctrl.view.find(".js-abstract");
				var abstractNumber = ctrl.view.find(".js-abstractNumber");
				data && data.briefDesc ? ctrl.setDataCounter(abstract,abstractNumber,300) : '';
				ctrl.counter(abstract,abstractNumber,300);

				//表单验证
				ctrl.validate = {
					rules: {
						postTitle: {
							required: true,
							isEnglishNumberSpecialChar: true,
							rangelength: [5,130]
						},
						editor: {
							required: true,
							minlength: 10
						},
						briefDesc: {
							required: true,
							isEnglishNumberSpecialChar: true,
							rangelength: [180,300]
						}
					},
					messages: {
						postTitle: {
							required: "文章标题应为5-130个英文字符",
							isEnglishNumberSpecialChar: "文章标题应为5-130个英文字符",
							rangelength: "文章标题应为5-130个英文字符"
						},
						editor: {
							required: "文章内容不得少于10个英文字符",
							minlength: "文章内容不得少于10个英文字符"
						},
						briefDesc: {
							required: "摘要应为180-300个英文字符",
							isEnglishNumberSpecialChar: "摘要应为180-300个英文字符",
							rangelength: "摘要应为180-300个英文字符"
						}
					},
					onkeyup: false,
					onfocusout: function (element) {
						var elem = $(element);
						var valid = elem.valid();
						//校验成功去掉红色边框和红色感叹号
						if(valid == 1){
							elem.next().find('.js-error').html("");
							var parent = elem.parent();
							$(parent).find("input").length > 0 ? $(parent).find("input").css("border-color","#ccc") : $(parent).find("textarea").css("border-color","#ccc");
						}
					},
					success: function(value){},
					errorPlacement: function (error, element) {
						if($(error).html()){
							var errorWrap = element.parent().find(".js-error");
							errorWrap.html("");
							$(element).css("border-color","red");
							error.appendTo(errorWrap);
							$('<img src="images/error.jpg" style="visibility: visible;left: 1520px;top: -48px;position: relative">').appendTo(errorWrap);
						}
					}
				};
				ctrl.view.el.find(".js-addArticle").validate(ctrl.validate);
			});
		};

		var callback = function(result){
			var data = result.data;
			addArticleFunction(data);
		};
		_para["postId"] ? ctrl.getArticleData(callback) : addArticleFunction({});
	};

	//获取文章数据
	ctrl.getArticleData = function(callback){
		var data = {
			postId:_para["postId"]
		};
		blogModel.getIdArticle(data,callback);
	};

	//收集提交数据
	ctrl.collectAllData = function () {
		var data = ctrl.addArticleVM.collectData();
		data.postContent = ctrl.UEditor.getAllHtml();
		return data;
	};

	/**
	 @method setDataCounter 数据回填计算字数
	 @param elem {input} 添加事件的元素
	 @param eleNum {string} 显示计数的元素
	 @param number {number} 最大显示的数字，计数超过时可做些操作
	 */
	ctrl.setDataCounter = function (elem,eleNum,number) {
		var length = $(elem).val().length;
		$(eleNum).html(length);
		length >= number ? $(eleNum).addClass('redFont') : $(eleNum).removeClass('redFont');
	};

	/**
	 @method counter 计算输入的字数
	 @param elem {input} 添加事件的元素
	 @param eleNum {string} 显示计数的元素
	 @param number {number} 最大显示的数字，计数超过时可做些操作
	 */
	ctrl.counter = function (elem,eleNum,number) {
		$(elem).on('keydown keyup', function() {
			ctrl.setDataCounter(elem,eleNum,number);
		});
	};

	/**
	 @method buttonStyleChange 上传成功后上传按钮样式变化
	 @param elem {string} 范围内的button改变样式
	 */
	ctrl.buttonStyleChange = function (elem) {
		$(elem).next().children('.default_button').removeClass('default_button').css("color","#00aff0").css("border-width",'0').css('background','#eee');
		$(elem).next().children().children('.webuploader-pick').text('重新上传');
	};


	/**
	 @method getBodyHtml 截取body标签内的元素
	 @param content {html} 需要截取的html
	 */
	ctrl.getBodyHtml = function (content) {
		var REG_BODY = /<body[^>]*>([\s\S]*)<\/body>/;
		function getBody(content){
			var result = REG_BODY.exec(content);
			if(result && result.length === 2)
				return result[1];
			return content;
		}
		return getBody(content);
	};

	/**
	 @method uploadSuccess 上传成功设置缩略图
	 @param elem {string} 范围内图片设置缩略图
	 @param width {string} 设置缩略图width，默认145px
	 @param height {string} 设置缩略图height，默认145px
	 */
	ctrl.uploadSuccess = function (elem,width,height) {
		elem.find('img').jqthumb(
			{
				width: width || 145,
				height: height || 145,
				after: function(imgObj){
					imgObj.click(function(e){
						var imgUrl = $(e.target).parent().next().attr("src");
						var content = "<img src='"+imgUrl +"' />";
						var opt = {
							shadeClose:true,
							closeBtn:1,
							content:content,
							callback:function(){
								$(".layui-layer-content").click(function(){
									layer1.closeAll();
								})
							}
						};
						layer1.layerOpen(opt);
					});
				}
			}
		);
	};

	/**
	 @method insert_flg 字符串插入内容
	 @param str {string} 表示原字符串变量
	 @param flg {string} 表示要插入的字符串
	 @param sn {string} 表示要插入的位置
	 */
	ctrl.insert_flg = function (str,flg,sn) {
		var newstr = str.substring(0, sn) + flg + str.substring(sn);
		return newstr;
	};

	//保存提交数据
	ctrl.save = function (){
		ctrl.sub(0);
	};

	//预览提交数据
	ctrl.preview = function (){
		var data = ctrl.collectAllData();
		data.headPic.length == 0 ? delete data.headPic : data.headPic = data.headPic[0].filePath;
		var title = data.postTitle;
		var content = ctrl.UEditor.getAllHtml();
		var titleHtml = "<h1 style='text-align: center;font-size: 20px'>"+ title +"<h1/>";
		content = ctrl.insert_flg(content,titleHtml,(content.indexOf("<body")+7));

		if(data.headPic){
			var headPicHtml = '<div style="text-align: center"><img src="'+data.headPic+'"></div>';
			content = ctrl.insert_flg(content,headPicHtml,(content.indexOf("<h1/")+5));
		}
		/*var opt = {
			area: ['1017px','600px'],
			closeBtn:1,
			content: content,
			callback: function(){}
		};
		layer1.layerOpen(opt);*/

		//全屏预览文章
		var index = layer.open({
			type: 1,
			content: content,
			maxmin: true,
			success: function(){
				$(".layui-layer") ? $(".layui-layer").find('.layui-layer-content').addClass('tac') : '';
			}
		});
		layer.full(index);
	};

	//发布提交数据
	ctrl.publish = function (){
		if(ctrl.view.el.find(".js-addArticle").valid()){
			ctrl.sub(1);
		}
	};

	//公共提交方法
	ctrl.sub = function(status){
		var data = ctrl.collectAllData();
		data.listImage.length == 0 ?  data.listImage = '' : data.listImage = data.listImage[0].filePath;
		data.headPic.length == 0 ? data.headPic = '': data.headPic = data.headPic[0].filePath;
		_para["postId"] ? (ctrl.postStatus == 0 ? data.postStatus = status : '') : data.postStatus = status;
		//更新文章时候，需要传给后端文章id
		_para["postId"] ? data.postId = _para["postId"] : '';
		var callback = function(result){
			if(result.statusCode == X.constructor.prototype.constant.statusCode.SUCCESS){
				ctrl.renderStaticPage(_para["postId"] || result.data.postId);
				X.router.run('m=blog.articleList')
			}else{
				layer.msg('请检查网络后重试');
			}
		};
		_para["postId"] ? blogModel.putIdArticle(data,callback) : blogModel.postIdArticle(data,callback);
	};

	//向node层，发起一个请求，生成一个blog 详情页面
	ctrl.renderStaticPage = function(id) {
		blogModel.renderStaticPage(id)
	};

	ctrl.addEvent("click", ".js-save", "save");
	ctrl.addEvent("click", ".js-preview", "preview");
	ctrl.addEvent("click", ".js-publish", "publish");

	var _para;
	ctrl.load = function (para) {
		para = para || {};
		_para = para;
		ctrl.rendering();
	};

	return ctrl
});