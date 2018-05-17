(function ($,X) {

	X.prototype.controls.widget("WebUpload",function (controlType) {

		var BaseControl = X.prototype.controls.getControlClazz("BaseControl");

		//上传图片
		function WebUpload(elem, options){
			BaseControl.call(this,elem,options);
			this.Size = this.options.size;
			this.type = this.options.type;
			this.maxNum = this.options.maxNum;
			this.fileSource = [];
			this.downloadType = this.options.downloadType;
			this.upload();
		}

		X.prototype.controls.extend(WebUpload,"BaseControl");

		WebUpload.prototype.constructor = WebUpload;

		/**
		 @method init webuploader初始化设置
		 */
		WebUpload.prototype.upload = function () {
			var that = this;
			that.wrapData = that.elem.find(".js-wrapData");
			var error = that.elem.find('.js-error');
			// WebUploader实例
			var id = this.options["filePicker"];
			var label = this.options["filePickerLabel"] || "选择文件";
			var pick;
			if(id && label){
				pick = {id:id,label:label,multiple:true}
			}

			// 实例化
			this.uploader = WebUploader.create({
				pick:pick,
				formData: {
					fileType: that.type
				},
				auto:true,
				swf: 'js/lib/webuploader/Uploader.swf',
				sendAsBinary:true, //指明使用二进制的方式上传文件
				duplicate:true,
				chunked: true,
				chunkSize: 512 * 1024,
				server: X.prototype.config.PATH_FILE.path.rootImg,
				fileNumLimit: that.Size,
				//fileSizeLimit: that.Size * 1024 * 1024,
				fileSingleSizeLimit: that.options.fileSingleSizeLimit || 10 * 1024 * 1024
			});

			that.duplicate();
			// 文件上传成功
			this.uploader.on( 'uploadSuccess', function( file,response) {

				if(response.data){
					error.html('');
					var uploadUrl = X.prototype.config.PATH_FILE.path.rootUploadUrl;
					var a;
					if(that.options["showExplain"]){
						a = '<div class="wrapUpload disb">' +
							'<a href="'+uploadUrl+'?fileType='+ that.downloadType+'&filePath='+response.data.path+'&fileName='+response.data.fileName+'" class="accessory orange-font">'+response.data.fileName+'</a>' +
							'<span class="cancel">X</span>' +
							'<span class="ml30 va8">附件说明：<input type="text" name="filespec" maxlength=" '+that.options.explainMaxlength+'" class="default_input ml30"/></span></div>';
					}else{
						a = '<div class="wrapUpload">' +
							'<a href="'+uploadUrl+'?fileType='+ that.downloadType+'&filePath='+response.data.path+'&fileName='+response.data.fileName+'" class="accessory orange-font">'+response.data.fileName+'</a>' +
							'<span class="cancel">X</span></div>';
					}

					$(that.wrapData).append(a);

					that.cancel();

					that.maxNumber();

					if(X.prototype.isFunction(that.options["uploadSuccess"])){
						that.options["uploadSuccess"](response);
					}
					that.trigger("uploadSuccess");
					if (that.options.fileChanged) that.options.fileChanged()

					that.fileSource.push(file)
				}
			});

			this.uploader.on( 'error', function( type ) {
				var text;
				switch( type ) {
					case 'Q_EXCEED_SIZE_LIMIT':
						text = '请上传大小在'+ (this.options.fileSingleSizeLimit / 1024 / 1024) +'M以内的文件';
						break;

					case 'Q_EXCEED_NUM_LIMIT':
						text = '文件数量超出最大值';
						break;
					case 'F_DUPLICATE':
						text = '文件不能重复上传';
						break;
					case 'F_EXCEED_SIZE':
						text = '文件需在'+ (this.options.fileSingleSizeLimit / 1024 / 1024)+'M以内' ;
						break;
				}
				error.text(text);
				setTimeout(function() { error.text('') }, 1800)
			});
		};

		WebUpload.prototype.addButton = function (buttons) {
			if(!X.prototype.isArray(buttons)){
				buttons = [buttons];
			}
			for(var i = 0; i < buttons.length; i++){
				this.uploader.addButton(buttons[i]);
			}
		};


		/**
		 @method init 重复上传文件
		 */
		WebUpload.prototype.duplicate = function(){
			var that = this,
				_this = that.uploader,
				mapping = {};

			function hashString( str ) {
				var hash = 0,
					i = 0,
					len = str.length,
					_char;

				for ( ; i < len; i++ ) {
					_char = str.charCodeAt( i );
					hash = _char + (hash << 6) + (hash << 16) - hash;
				}

				return hash;
			}

			_this.on( 'beforeFileQueued', function( file ) {
				var hash = file.__hash || (file.__hash = hashString( file.name +
						file.size + file.lastModifiedDate ));

				// 已经重复了
				if ( mapping[ hash ] ) {
					var nameArr = [];
					var namewrapArr = that.elem.find(".js-wrapData").find("a");
					$.each(namewrapArr,function(i,item){
						nameArr.push($(namewrapArr[i]).html());
					});

					var has = function (){
						var hasName;
						$.each(nameArr,function(i,item){
							if(nameArr[i] == file.name){
								hasName = true;
							}
						});
						return hasName;
					};

					if(has()){
						_this.trigger( 'error', 'F_DUPLICATE', file );
						return false;
					}
				}
			});

			_this.on( 'fileQueued', function( file ) {
				var hash = file.__hash;

				hash && (mapping[ hash ] = true);
			});

			_this.on( 'fileDequeued', function( file ) {
				var hash = file.__hash;

				hash && (delete mapping[ hash ]);
			});

			_this.on( 'reset', function() {
				mapping = {};
			});
		};

		/**
		 @method init 删除上传文件
		 */
		WebUpload.prototype.cancel = function(){
			var that = this;
			var cancel = that.elem.find(".cancel");
			cancel.on('click',function(event){
				var fatherDiv = $(event.target).parent();
				var index = fatherDiv.index()
				fatherDiv.remove();
				that.maxNumber(true);
				that.fileSource[index] && that.uploader.cancelFile(that.fileSource[index])
				if (that.options.fileChanged) that.options.fileChanged()
			});
		};

		/**
		 @method init 获取上传文件
		 @param value {string} 获取上传文件值
		 */
		WebUpload.prototype.getValue = function(type){
			var that = this;
			var value = that.elem.find(".wrapUpload");
			var arr = [];
			function getArgStr(value){
				var argStr='';
				argStr = value.split('&')[1].split('=')[1];
				return argStr;
			}
			$.each(value,function(i,item){
				if(that.options["showExplain"]){
					arr.push({attachmentType:type,filePath:getArgStr($(this).find("a").attr("href")),fileName:$(this).find("a").text(),filespec:$(this).find("input").val()});
				}else{
					arr.push({attachmentType:type,filePath:getArgStr($(this).find("a").attr("href")),fileName:$(this).find("a").text()});
				}
			});
			return arr;
		};

		/**
		 @method init 设置上传文件
		 @param value {string} 设置上传文件值
		 */
		WebUpload.prototype.setValue = function(arr){
			var that = this;
			var wrap = that.elem.find(".js-wrapData");
			if(arr){
				var uploadUrl = X.prototype.config.PATH_FILE.path.rootUploadUrl;
				$.each(arr,function(i,item){
					var a;
					if(that.options["showExplain"]){
						a = '<div class="wrapUpload disb">' +
							'<a href="'+uploadUrl+'?fileType='+ that.downloadType+'&filePath='+arr[i].filePath+'&fileName='+arr[i].fileName+'" class="accessory orange-font">'+arr[i].fileName+'</a>' +
							'<span class="cancel">X</span>' +
							'<span class="ml30 va8">附件说明：<input type="text" name="filespec" maxlength=" '+that.options.explainMaxlength+'" value=" '+arr[i].filespec+' " class="default_input ml30"/></span></div>';
					}else{
						a = '<div class="wrapUpload">' +
							'<a href="'+uploadUrl+'?fileType='+ that.downloadType+'&filePath='+arr[i].filePath+'&fileName='+arr[i].fileName+'" class="accessory orange-font">'+arr[i].fileName+'</a>' +
							'<span class="cancel">X</span></div>';
					}

					$(wrap).append(a);
				});

				that.cancel();
			}else{
				wrap.html("");
			}
		};

		/**
		 @method init 设置上传文件数量
		 @param value {string} 设置上传文件最大数量
		 */
		WebUpload.prototype.maxNumber = function(data){
			var that = this;
			var wrap = that.elem.find(".wrapUpload");
			var input = that.elem.find("input[type=file]");
			var error = that.elem.find('.js-error');
			if (wrap.length > that.maxNum) {
				error.text("上传附件不能超过" + that.maxNum + "张");
				input.attr("disabled",true);
			} else {
				input.attr("disabled",false);
				error.text("");
			}
		};

		/**
		 @method init 重置上传附件展示
		 */
		WebUpload.prototype.reset = function () {
			this.setValue("");
		};

		return WebUpload;
	});

})(jQuery,this.Xbn);