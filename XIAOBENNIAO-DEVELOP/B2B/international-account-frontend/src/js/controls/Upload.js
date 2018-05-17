(function ($,X) {

    X.prototype.controls.widget("Upload",function (controlType) {

        var BaseControl = X.prototype.controls.getControlClazz("BaseControl");

        //上传图片
        function Upload(elem, options){
            BaseControl.call(this,elem,options);
            this.singleSize = this.options.singleSize;
            this.Size = this.options.size;
            this.type = this.options.type;
            this.maxNum = this.options.maxNum;
            this.downloadType = this.options.downloadType;
            this.count = 0;
            this.upload();
        };

        X.prototype.controls.extend(Upload,"BaseControl");

        Upload.prototype.constructor = Upload;

        /**
         @method init webuploader初始化设置
         */
        Upload.prototype.upload = function () {
            var that = this;
            var wrapUpload = that.elem.find(".js-wrapUploadData"),
                error = that.elem.find('.js-error');
            /*  if(X.prototype.isFunction(this.options["click"])){
             img.on("click",function(event){
             this.options["click"](img.attr("src"));
             });
             }*/
            // WebUploader实例
            var id = this.options["filePicker"];
            var label = this.options["filePickerLabel"] || "选择图片";
            var pick;
            if(id && label){
                pick = {id:id,label:label}
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
                duplicate:that.options.duplicate || true,
                chunked: true,
                thumb: that.options.thumb ||　false,//上传图片设置缩略图
                server: X.prototype.config.PATH_FILE.path.rootImg,
                fileNumLimit: 300,
                fileSizeLimit: that.Size * 1024 * 1024,
                fileSingleSizeLimit:that.singleSize * 1024 * 1024,//验证单个文件大小是否超出限制
                accept:that.options.accept || {
                    /*title: 'Images',*/
                    extensions: 'jpg,jpeg,png',
                    mimeTypes: 'image/png,image/jpg,image/jpeg'
                }
            });

            that.duplicate();

            this.uploader.on( 'beforeFileQueued', function( file) {
                var guid = file._hash;
                if(wrapUpload.find(".wrapUpload").length){
                    that.count = wrapUpload.find(".wrapUpload").length;
                }
                if(that.options.maxNum){
                    if (that.count >= that.options.maxNum) {
                        return false;
                    }else{
                        that.count++;
                    }
                }
            });

            // 文件上传成功
            this.uploader.on( 'uploadSuccess', function( file,response) {
                if(response.data){
                    error.html('');
                    var uploadSuccessInfo;

                    if(response.data.url){
                        var imgHost  = X.prototype.config.PATH_FILE.path.imageStoreUrl,
                            imageUrl = response.data.url.indexOf(imgHost) > -1? response.data.url: (imgHost + response.data.url)
                        uploadSuccessInfo = '<div class="wrapUpload disib"><img src="'+ imageUrl +'"/><span class="cancel">X</span><p class="mt10 tac contract-word-cut">'+response.data.fileName+'</p></div>';
                    }else{
                        var uploadUrl = X.prototype.config.PATH_FILE.path.rootUploadUrl;
                        uploadSuccessInfo = '<div class="wrapUpload">' +
                            '<a href="'+uploadUrl+'?fileType='+ that.downloadType+'&filePath='+response.data.path+'&fileName='+response.data.fileName+'" class="accessory orange-font">'+response.data.fileName+'</a>' +
                            '<span class="cancel">X</span></div>';
                    }

                    $(wrapUpload).append(uploadSuccessInfo);

                    if(that.options["cancel"]){
                        that.cancel();
                    }

                    if(that.maxNum){
                        that.maxNumber();
                        var wrap = that.elem.find(".wrapUpload");
                        var input = that.elem.find("input[type=file]");
                        if (wrap.length >= that.maxNum) {
                            input.attr("disabled",true);
                        } else {
                            input.attr("disabled",false);
                        }
                    }

                    if(X.prototype.isFunction(that.options["uploadSuccess"])){
                        that.options["uploadSuccess"](response,wrapUpload.find(".wrapUpload").last());
                    }

                    that.trigger("uploadSuccess",response);
                }
            });

            this.uploader.on( 'error', function( type ) {
                var text;
                switch( type ) {
                    case 'Q_EXCEED_SIZE_LIMIT':
                        text = '文件大小超出';
                        break;

                    case 'Q_EXCEED_NUM_LIMIT':
                        text = '文件数量超出最大值';
                        break;

                    case 'Q_TYPE_DENIED':
                        text = '文件类型错误';
                        break;//F_EXCEED_SIZE
                    case 'F_DUPLICATE':
                        text = '文件不能重复上传';
                        break;
                    case 'F_EXCEED_SIZE':
                        text = '文件大小超出';
                        break;
                }
                that.count--;
                error.text(text);
            });
        };

        Upload.prototype.addButton = function (buttons) {
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
        Upload.prototype.duplicate = function(){
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
                    var namewrapArr = that.elem.find(".js-wrapUploadData").find("img").length ? that.elem.find(".js-wrapUploadData").find("img") : that.elem.find(".js-wrapUploadData").find("a");

                    $.each(namewrapArr,function(i,item){
                        if(namewrapArr[i].nodeName == "IMG"){
                            nameArr.push($(namewrapArr[i]).next().next().html());
                        }else{
                            nameArr.push($(namewrapArr[i]).html());
                        }
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
        Upload.prototype.cancel = function(){
            var that = this;
            var cancel = that.elem.find(".cancel");
            cancel.on('click',function(event){
                var fatherDiv = $(event.target).parent();
                fatherDiv.remove();
                that.count--;
                if(that.maxNum){
                    that.maxNumber();
                    var wrap = that.elem.find(".wrapUpload");
                    var input = that.elem.find("input[type=file]");
                    if (wrap.length >= that.maxNum) {
                        input.attr("disabled",true);
                    } else {
                        input.attr("disabled",false);
                    }
                }
                if(X.prototype.isFunction(that.options["cancel"])){
                    that.options["cancel"]();
                }
            });
        };

        /**
         @method init 设置上传文件数量
         @param value {string} 设置上传文件最大数量
         */
        Upload.prototype.maxNumber = function(){
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
         @method init 获取上传图片
         @param value {string} 获取上传图片值
         */
        Upload.prototype.getValue = function(type){
            var that = this;
            var arr = [];
            if(X.prototype.isFunction(that.options["getValue"])){
                arr = that.options["getValue"]();
            }else{
                var value = that.elem.find(".js-wrapUploadData").find(".wrapUpload");
                var arr = [];
                if(value.html()){
                    function getArgStr(value){
                        var argStr='';
                        if(value){
                            argStr = value.split('&')[1].split('=')[1];
                        }
                        return argStr;
                    }
                    $.each(value,function(i,item){
                        if($(this).find("a").length){
                            arr.push({attachmentType:type ||  that.options.attachmentType,filePath:getArgStr($(this).find("a").attr("href")),filename :$(this).find("a").text()});
                        }else{
                            arr.push({attachmentType:type || that.options.attachmentType,url:$(this).find("img").attr("src") || "",filename :$(this).find("p").text()});
                        }
                    });
                }
            }
            return arr;
        };

        /**
         @method init 设置上传图片
         @param value {string} 设置上传图片值
         */
        Upload.prototype.setValue = function(arr){
            var that = this;
            var wrap = that.elem.find(".js-wrapUploadData");
            if(arr){
                var uploadUrl = X.prototype.config.PATH_FILE.path.rootUploadUrl;
                $.each(arr,function(i,item){
                    var uploadSuccessInfo;

                    if(arr[i].url){
                        var imgHost  = X.prototype.config.PATH_FILE.path.imageStoreUrl,
                          imageUrl = arr[i].url.indexOf(imgHost) > -1? arr[i].url: (imgHost + arr[i].url)
                        uploadSuccessInfo = '<div class="wrapUpload disib"><img src="'+imageUrl+'"/><span class="cancel">X</span><p class="mt5 contract-word-cut">'+arr[i].filename+'</p></div>';
                    }else{
                        uploadSuccessInfo = '<div class="wrapUpload">' +
                            '<a href="'+uploadUrl+'?fileType='+ that.downloadType+'&filePath='+arr[i].filePath+'&fileName='+arr[i].filename+'" class="accessory orange-font">'+arr[i].filename+'</a>' +
                            '<span class="cancel">X</span></div>';
                    }

                    $(wrap).append(uploadSuccessInfo);

                    if(arr[i].url){
                     if(X.prototype.isFunction(that.options["setValue"])){
                     that.options["setValue"](arr[i],wrap.find(".wrapUpload").last());
                     }
                     }
                });

                that.cancel();
            }else{
                wrap.html("");
            }
        };

        /**
         @method init 重置上传附件展示
         */
        Upload.prototype.reset = function () {
            this.setValue("");
        };

        return Upload;
    });

})(jQuery,this.Xbn);