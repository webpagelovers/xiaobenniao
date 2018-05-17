
(function ($,X) {

    X.prototype.controls.widget("Upload",function (controlType) {

        var BaseControl = X.prototype.controls.getControlClazz("BaseControl");

        //上传图片
        function Upload(elem, options){
            BaseControl.call(this,elem,options);
            this.Size = this.options.size;
            this.type = this.options.type;
            this.upload();
        };

        X.prototype.controls.extend(Upload,"BaseControl");

        Upload.prototype.constructor = Upload;

        /**
         @method init webuploader初始化设置
         */
        Upload.prototype.upload = function () {
            var that = this;
            var img = that.elem.find("img"),
                error = that.elem.find('.js-error');

            if(X.prototype.isFunction(this.options["click"])){
                img.on("click",function(event){
                    this.options["click"](img.attr("src"));
                });
            }

            // WebUploader实例
            var id = this.options["filePicker"];
            var label = this.options["filePickerLabel"] || "点击选择图片";
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
                chunked: false,
                chunkSize: 512 * 1024,
                server: X.prototype.config.PATH_FILE.path.rootImg,
                fileNumLimit: 300,
                fileSizeLimit: that.Size * 1024 * 1024
            });

            // 文件上传成功
            this.uploader.on( 'uploadSuccess', function( file,response ) {
                if(response.data){
                    error.html('');
                    var imgHost  = X.prototype.config.PATH_FILE.path.rootCrawlingImgUrl,
                      imageUrl = response.data.url.indexOf(imgHost) > -1? response.data.url: (imgHost + response.data.url);
                    img.attr("src",imageUrl);
                    if(X.prototype.isFunction(that.options["uploadSuccess"])){
                        that.options["uploadSuccess"](response);
                    }
                    that.trigger("uploadSuccess",response.data);
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
                }
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
         @method init 获取上传图片
         @param value {string} 获取上传图片值
         */
        Upload.prototype.getValue = function(){
            return this.elem.find("img").attr("src");
        };

        /**
         @method init 设置上传图片
         @param value {string} 设置上传图片值
         */
        Upload.prototype.setValue = function(imgUrl){
            this.elem.find("img").attr("src",imgUrl);
        };

        return Upload;
    });

})(jQuery,this.Xbn);