(function ($, X) {

    X.prototype.controls.widget("UploadNew", function (controlType) {

        var BaseControl = X.prototype.controls.getControlClazz("BaseControl");

        //上传图片
        function Upload(elem, options) {
            BaseControl.call(this, elem, options);
            this.Size = this.options.size;
            this.type = this.options.type;
            this.width = this.options.width ? this.options.width : '';
            this.height = this.options.height ? this.options.height : '';
            this.upload();
        };

        X.prototype.controls.extend(Upload, "BaseControl");

        Upload.prototype.constructor = Upload;

        /**
         @method init webuploader初始化设置
         */
        Upload.prototype.upload = function () {
            var that = this;
            var img = that.elem.find("img"),
                error = that.elem.find('.js-error');

            that.wrapData = that.elem.find(".js-wrapData");

            if (X.prototype.isFunction(this.options["click"])) {
                img.on("click", function (event) {
                    this.options["click"](img.attr("src"));
                });
            }

            // WebUploader实例
            var id = this.options["filePicker"];
            var label = this.options["filePickerLabel"];
            var pick;
            if (id && label) {
                pick = {id: id, label: label}
            }

            // 实例化
            this.uploader = WebUploader.create({
                pick: pick,
                formData: {
                    fileType: that.type,
                    width: that.width,   //图片压缩后的宽
                    height: that.height  //图片压缩后的高
                },
                auto: true,
                swf: 'js/lib/webuploader/Uploader.swf',
                chunked: false,
                sendAsBinary:true,
                duplicate:that.options.duplicate || true,
                chunkSize: 512 * 1024,
                server: X.prototype.config.PATH_FILE.path.rootImg,
                fileNumLimit: 300,
                fileSizeLimit: that.Size * 1024 * 1024,
                accept:that.options.accept || {
                    /*title: 'Images',*/
                    extensions: 'jpg,jpeg,png',
                    mimeTypes: 'image/png,image/jpg,image/jpeg'
                }
            });

            that.duplicate();

            // 文件上传成功
            this.uploader.on('uploadSuccess', function (file, response) {
                if (response.data) {
                    error.html('');
                    if(that.options.single){
                        img.attr("src",response.data.url);
                    }else{
                        $(that.wrapData).find(".loading").remove();
                        var path = '';
                        if (response.data.url) {
                            path = response.data.url;
                        } else {
                            path = response.data.path;
                        }
                        var a = '<div class="wrapUpload" style="display: block"><img src="images/right.jpg" class="poa" style="top:1px;"><span class="accessory col66 word-cut myFile" path='+ path + ' fileSize='+ response.data.fileSize + ' style="background-color: white;padding: 0px 10px 0px 22px;max-width: 380px">'
                            + response.data.fileName + '</span><span class="accessory col66">' + response.data.fileSize + '</span><span class="redFont cancel" style="right: auto;top:2px;background-color: white;"><img src="images/delete.jpg"></span></div>';
                        $(that.wrapData).append(a);
                    }

                    that.cancel();

                    that.maxNumber();

                    if (X.prototype.isFunction(that.options["uploadSuccess"])) {
                        var wrap = that.elem.find(".wrapUpload");
                        that.options["uploadSuccess"](response, wrap);
                    }
                    that.trigger("uploadSuccess");
                }
            });

            this.uploader.on('error', function (type, file) {
                var text;
                switch (type) {
                    case 'Q_EXCEED_SIZE_LIMIT':
                        text = 'The maximum file size should be within 10 MB';
                        break;

                    case 'Q_EXCEED_NUM_LIMIT':
                        text = 'File number exceeded';
                        break;
                    case  'F_DUPLICATE':
                        text = 'Files repeating';
                        break;
                    case  'Q_TYPE_DENIED':
                        text = '<span class="word-cut" style="max-width: 275px;line-height: 32px;">' + file.name + '</span>' + ' format not accepted';
                        break;
                }
                //error.text(text);
                $(that.wrapData).find(".loading").remove();
                var index = layer.msg('<span style="font-size: 24px;line-height: 29px">' + text + '</span>', {
                    id: 'myLayerMsg',
                    time: 3000,
                    area: ['600px', '56px']
                });
                $('#myLayerMsg').parent().css('border-radius', '0px');
            });
        };

        Upload.prototype.addButton = function (buttons) {
            if (!X.prototype.isArray(buttons)) {
                buttons = [buttons];
            }
            for (var i = 0; i < buttons.length; i++) {
                this.uploader.addButton(buttons[i]);
            }
        };

        /**
         @method init 获取上传图片
         @param value {string} 获取上传图片值
         */
        Upload.prototype.getValue = function () {
            return this.elem.find("img").attr("src");
        };

        Upload.prototype.cancel = function () {
            var that = this;
            var cancel = that.elem.find(".cancel");
            cancel.unbind("click");
            cancel.on('click', function (event) {
                var fatherDiv = $(event.currentTarget).parent();
                fatherDiv.remove();
                that.maxNumber(true);
                if (X.prototype.isFunction(that.options["cancel"])) {
                    var wrap = that.elem.find(".wrapUpload");
                    that.options["cancel"](wrap);
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
            if (wrap.length >= that.options.maxNum) {
                input.attr("disabled",true);
            } else {
                input.attr("disabled",false);
                error.text("");
            }
        };

        /**
         @method init 设置上传图片
         @param value {string} 设置上传图片值
         */
        Upload.prototype.setValue = function (imgUrl) {
            this.elem.find("img").attr("src", imgUrl);
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

            _this.on( 'beforeFileQueued', function(file) {
                var nameArr = [];
                var namewrapArr = that.elem.find(".js-wrapData .myFile");

                var publicInfoAttach = '';
                if (that.elem.hasClass('js-publicInfoFlg')) {
                    publicInfoAttach = $(".js-publicInfoAttach a");
                }

                var publicAddInfoAttach = [];
                if (that.elem.hasClass('js-publicAddInfoFlg')) {
                    publicAddInfoAttach = that.elem.parent().parent().parent().find('.js-singleAttachment a');
                }

                for (var i = 0, len = namewrapArr.length; i < len; i++) {
                    nameArr.push($(namewrapArr[i]).text());
                }

                for (var i = 0, len = publicInfoAttach.length; i < len; i++) {
                    nameArr.push($(publicInfoAttach[i]).text());
                }

                for (var i = 0, len = publicAddInfoAttach.length; i < len; i++) {
                    nameArr.push($(publicAddInfoAttach[i]).text());
                }

                for (var i = 0, len = nameArr.length; i < len; i++) {
                    if(nameArr[i] == file.name){
                        _this.trigger( 'error', 'F_DUPLICATE', file );
                        return false;
                    }
                }
                if (X.prototype.isFunction(that.options["uploadBeforeSend"])) {
                    that.options["uploadBeforeSend"](that, file);
                }
                return true;
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


        return Upload;
    });

})(jQuery, this.Xbn);