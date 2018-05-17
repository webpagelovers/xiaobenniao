(function ($, X) {

    X.prototype.controls.widget("WebUpload", function (controlType) {

        var BaseControl = X.prototype.controls.getControlClazz("BaseControl");

        //上传图片
        function WebUpload(elem, options) {
            BaseControl.call(this, elem, options);
            this.Size = this.options.size;
            this.type = this.options.type;
            this.extensions = this.options.extensions;
            this.sourceFile = [];
            this.maxNum = this.options.maxNum;
            this.downloadType = this.options.downloadType;
            this.upload();
        };

        X.prototype.controls.extend(WebUpload, "BaseControl");

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
            var label = this.options["filePickerLabel"] || $.i18n.prop('controls_cspicture');
            var multiple = navigator.userAgent.indexOf('compatible') === -1? true: false
            var pick;
            if (id && label) {
                pick = {id: id, label: label, multiple: multiple}
            }

            // 实例化
            this.uploader = WebUploader.create({
                pick: pick,
                formData: {
                    fileType: that.type
                },
                auto: true,
                swf: 'js/lib/webuploader/Uploader.swf',
                sendAsBinary:true, //指明使用二进制的方式上传文件
                duplicate:true,
                chunked: false,
                chunkSize: 512 * 1024,
                server: X.prototype.config.PATH_FILE.path.rootImg,
                fileSizeLimit: that.Size * 1024 * 1024,
                accept :{
                    extensions : that.extensions || "doc,docx,xls,xlsx,ppt,pptx,pdf,jpg,jpeg,gif,png" //接受文件类型
                }
            });

            that.duplicate();
            // 文件上传成功
            this.uploader.on('uploadSuccess', function (file, response) {
                if(that.elem.find(".wrapUpload").length < that.maxNum){
                    if (response.data) {
                        error.html('');
                        var uploadUrl = X.prototype.config.attach.download;
                        var a='';
                        if (X.prototype.isFunction(that.options["uploadSuccessBackFill"])) {
                            a = that.options["uploadSuccessBackFill"](response);
                        }else{
                            a = '<div class="wrapUpload"><a href="' + uploadUrl + '?fileType=' + that.options.downloadType + '&filePath=' + response.data.path + '&fileName=' + response.data.fileName + '" target="_blank" class="accessory blueFont">' + response.data.fileName + '</a><span class="redFont cancel">X</span></div>';
                        }
                        $(that.wrapData).append(a);

                        that.cancel();
                        that.sourceFile.push(file)
                        that.maxNumber();

                        if (X.prototype.isFunction(that.options["uploadSuccess"])) {
                            that.options["uploadSuccess"](response);
                        }
                        that.trigger("uploadSuccess");
                    }
                }
            });

            /*this.uploader.on('fileQueued', function(file) {
                file.on('statuschange', function( cur, prev ) {
                    console.log(cur + '***' + prev)
                })
            })*/

            this.uploader.on('error', function (type) {
                var text;
                switch (type) {
                    case 'Q_EXCEED_SIZE_LIMIT':
                        text = that.options.Q_EXCEED_SIZE_LIMIT || $.i18n.prop('controls_filesizeexceeded');
                        break;

                    case 'Q_EXCEED_NUM_LIMIT':
                        text = that.options.Q_EXCEED_NUM_LIMIT || $.i18n.prop('controls_filenumberexceeded');
                        break;

                    case 'F_DUPLICATE':
                        text = that.options.F_DUPLICATE || $.i18n.prop('controls_filesrepeating');
                        break;

                    case 'Q_TYPE_DENIED':
                        text = that.options.Q_TYPE_DENIED || $.i18n.prop('controls_filetypeerror');
                        break;

                }
                error.text(text);
                setTimeout(function () {
                    error.text()
                }, 1600)
            });
        };

        WebUpload.prototype.addButton = function (buttons) {
            if (!X.prototype.isArray(buttons)) {
                buttons = [buttons];
            }
            for (var i = 0; i < buttons.length; i++) {
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
                    if(X.prototype.isFunction(that.options["duplicate"])){
                        nameArr = that.options["duplicate"](that.elem.find(".js-wrapData"));
                    }else{
                        var namewrapArr = that.elem.find(".js-wrapData").find("a");
                        $.each(namewrapArr,function(i,item){
                            nameArr.push($(namewrapArr[i]).html());
                        });
                    }

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
        WebUpload.prototype.cancel = function () {
            var that = this;
            var cancel = that.elem.find(".cancel");
            cancel.on('click', function (event) {
                var fatherDiv = $(event.target).parent();
                fatherDiv.remove();
                that.maxNumber(true);

                this.previousElementSibling ? that.removeFile(this.previousElementSibling.innerHTML) : '';
            });
        };

        /**
         @method init 删除上传文件
         */
        WebUpload.prototype.removeFile = function (fileName) {
            var files = this.sourceFile
            for (var i = files.length; i--;) {
                if (files[i].name === fileName) {
                    this.uploader.cancelFile(files.splice(i, 1))
                    break
                }
            }
        }

        /**
         @method init 获取上传文件
         @param value {string} 获取上传文件值
         */
        WebUpload.prototype.getValue = function (type) {
            var that = this;
            var value = that.elem.find("a");
            var arr = [];

            function getArgStr(value) {
                var argStr = '';
                argStr = value.split('&')[1].split('=')[1];
                return argStr;
            }
            if(X.prototype.isFunction(that.options["getValue"])){
                arr = that.options["getValue"](value,type);
            }else{
                $.each(value, function (i, item) {
                    arr.push({attachmentType: type, filePath: getArgStr($(this).attr("href")), filename: $(this).text()});
                });
            }
            return arr;
        };

        /**
         @method init 设置上传文件
         @param value {string} 设置上传文件值
         */
        WebUpload.prototype.setValue = function (arr) {
            var that = this;
            var wrap = that.elem.find(".js-wrapData");
            if (arr) {
                var uploadUrl = X.prototype.config.PATH_FILE.path.rootUploadUrl;
                $.each(arr, function (i, item) {
                    var a = '<div class="wrapUpload"><a href="' + uploadUrl + '?fileType=' + that.downloadType + '&filePath=' + arr[i].filePath + '&fileName=' + arr[i].filename + '" class="accessory blueFont">' + arr[i].filename + '</a><span class="redFont cancel">X</span></div>';
                    $(wrap).append(a);
                });

                that.cancel();
            } else {
                wrap.html("");
            }
        };

        /**
         @method init 设置上传文件数量
         @param value {string} 设置上传文件最大数量
         */
        WebUpload.prototype.maxNumber = function (data) {
            var that = this;
            var wrap = that.elem.find(".wrapUpload");
            var input = that.elem.find("input[type=file]");
            var error = that.elem.find('.js-error');
            if(that.options.hiddenBtn){
                if(wrap.length >= that.maxNum){
                    input.parent().parent().addClass("none");
                }else{
                    input.parent().parent().removeClass("none");
                }
            }else{
                if (wrap.length > that.maxNum) {
                    var text = that.options.Q_EXCEED_NUM_LIMIT || ($.i18n.prop('controls_filenumberexceeded')+ that.maxNum);
                    error.text(text);
                    input.attr("disabled", true);
                } else {
                    input.attr("disabled", false);
                    error.text("");
                }
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

})(jQuery, this.Xbn);