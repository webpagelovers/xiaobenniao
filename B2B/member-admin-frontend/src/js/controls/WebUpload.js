
(function ($,X) {

    X.prototype.controls.widget("WebUpload",function (controlType) {

        var BaseControl = X.prototype.controls.getControlClazz("BaseControl");

        //上传图片
        function WebUpload(elem, options){
            BaseControl.call(this,elem,options);
            this.Size = this.options.size;
            this.type = this.options.type;
            this.maxNum = this.options.maxNum;
            this.downloadType = this.options.downloadType;
            this.extensions = this.options.extensions;
            this.server = this.options.server;
            this.downUrl = this.options.downUrl;
            this.width = this.options.width ? this.options.width : '';
            this.height = this.options.height ? this.options.height : '';

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
                    fileType: that.type, //上传type后端区分文件
                    width: that.width,   //图片压缩后的宽
                    height: that.height  //图片压缩后的高
                },
                auto:that.options.auto === undefined || that.options.auto === true? true: false,
                swf: 'js/lib/webuploader/Uploader.swf',
                sendAsBinary:true, //指明使用二进制的方式上传文件
                duplicate:true,
                chunked: false,
                crop: that.options.crop,
                chunkSize: 512 * 1024,
                server: that.server || X.prototype.config.PATH_FILE.path.rootImg, //上传服务接口
                fileSizeLimit: that.Size * 1024 * 1024,
                fileSingleSizeLimit: that.Size * 1024 * 1024,
                accept :{
                    extensions : that.extensions || "doc,docx,xls,xlsx,ppt,pptx,pdf,jpg,jpeg,gif,png" //接受文件类型
                }
            });

            that.duplicate();
            // 文件上传成功
            this.uploader.on( 'uploadSuccess', function( file,response) {

                if(response.data){
                    error.html('');
                    var uploadUrl = X.prototype.config.PATH_FILE.path.rootUploadUrl;
                    var a = '';
                    if(X.prototype.isFunction(that.options["uploadSuccessPageShow"])){
                        a = that.options["uploadSuccessPageShow"](response,that.wrapData);
                    }else{
                        if (response.data.url) {
                            a = '<div class="wrapUpload disib"><img src="'+ response.data.url +'"/><span class="cancel">X</span><p class="mt10 tac contract-word-cut">'+response.data.fileName+'</p></div>'
                        } else {
                            a = '<div class="wrapUpload"><a href="'+uploadUrl+'?fileType='+ that.options.downloadType+'&filePath='+response.data.path+'&fileName='+response.data.fileName+'" class="accessory white-block">'+response.data.fileName+'</a><span class="redFont cancel curp">X</span></div>';
                        }
                    }
                    $(that.wrapData).append(a);
                    that.cancel();

                    that.maxNumber();

                    if(X.prototype.isFunction(that.options["uploadSuccess"])){
                        that.options["uploadSuccess"](response,that.wrapData);
                    }
                    that.trigger("uploadSuccess");
                }
            });

            this.uploader.on( 'error', function( type ) {
                var text;
                switch( type ) {
                    case 'Q_EXCEED_SIZE_LIMIT':
                        text = that.options.Q_EXCEED_SIZE_LIMIT || '请上传大小在'+ that.Size +'M以内的文件';
                        break;

                    case 'Q_EXCEED_NUM_LIMIT':
                        text = that.options.Q_EXCEED_NUM_LIMIT || '文件数量超出最大值';
                        break;
                    case 'F_DUPLICATE':
                        text = that.options.F_DUPLICATE || '文件不能重复上传';
                        break;
                    case 'Q_TYPE_DENIED':
                        text = that.options.Q_TYPE_DENIED_TEXT || '请上传右侧支持的文件格式';
                        break;
                }
                error.text(text);
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
        WebUpload.prototype.cancel = function(){
            var that = this;
            var cancel = that.elem.find(".cancel");
            that.wrapData = that.elem.find(".js-wrapData");
            cancel.on('click',function(event){
                var fatherDiv = $(event.target).parent();
                fatherDiv.remove();
                that.maxNumber(true);
                if(X.prototype.isFunction(that.options["cancelSuccessAfter"])){
                    that.options["cancelSuccessAfter"](that.wrapData);
                }
            });
        };

        /**
         @method init 获取上传文件
         @param value {string} 获取上传文件值
         */
        WebUpload.prototype.getValue = function(type){
            var that = this;
            var value = that.wrapData.children();
            var arr = [];
            function getArgStr(value){
                var argStr='';
                argStr = value.split('&')[1].split('=')[1];
                return argStr;
            }
            if(X.prototype.isFunction(that.options["getValueData"])){
                arr = that.options["getValueData"](value,type);
            }else{
                $.each(value,function(i,item){
                    var me = $(item),
                        filePath, fileName;
                    if (me.children('img').length) {
                        filePath = me.children('img').attr("src");
                        fileName = me.children('p').html();
                    } else {
                        filePath = me.children('a').attr("href");
                        fileName = me.children('a').html();
                    }

                    var tar = $(item).find('a' || 'img');
                    arr.push({attachmentType:type,filePath:filePath, fileName:fileName});
                });
            }
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
                var uploadUrl = that.downUrl || X.prototype.config.PATH_FILE.path.rootUploadUrl;
                $.each(arr,function(i,item){
                    var filename = item.filename || item.fileName,
                        filePath = item.filepath || item.filePath;
                    var a = '';
                    if(X.prototype.isFunction(that.options["setValuePageShow"])){
                         a = that.options["setValuePageShow"](item,wrap);
                    }else{
                        if (/png|jpeg|jpg|gif|bmp/.test(filePath)) {
                            var url = item.url || item.filePath;
                            a = '<div class="wrapUpload disib pt20"><img src="'+ url +'" class="upload-imgage"/><span class="cancel">X</span><p class="mt10 tac contract-word-cut">'+filename+'</p></div>'
                        } else {
                            a = '<div class="wrapUpload"><a href="'+uploadUrl+'?fileType='+ that.downloadType+'&filePath='+item.filePath+'&fileName='+item.filename+'" class="accessory white-block">'+item.filename+'</a><span class="redFont cancel">X</span></div>';
                        }
                    }
                    $(wrap).append(a);

                    if(X.prototype.isFunction(that.options["setValueSuccess"])){
                        that.options["setValueSuccess"](item,wrap);
                    }
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
            if(that.options.hiddenBtn){
                if(wrap.length >= that.maxNum){
                    input.parent().parent().addClass("nonei");
                }else{
                    input.parent().parent().removeClass("nonei");
                }
            }else{
                if (wrap.length > that.maxNum) {
                    var text = that.options.Q_EXCEED_NUM_LIMIT || "上传附件不能超过" + that.maxNum + "张";
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

})(jQuery,this.Xbn);