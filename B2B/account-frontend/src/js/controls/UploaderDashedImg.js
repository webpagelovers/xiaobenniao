(function ($,X) {

    /**
     * 观察当前产品的需求 是一张图片的可能性比较大 
     * 要是后期 产品更改 当前 需求
     * 可以在此基础上修改 或另增一个上传组件
    */
    
    X.prototype.controls.widget("UploaderDashedImg", function (controlType) {

        var BaseControl = X.prototype.controls.getControlClazz("BaseControl");

        function UploaderDashedImg(elem, options){
            BaseControl.call(this,elem,options);
            this.init();
        }

        X.prototype.controls.extend(UploaderDashedImg,"BaseControl");

        UploaderDashedImg.prototype.constructor = UploaderDashedImg;

        UploaderDashedImg.prototype.preProps = function() { 
            this.file               =   this.options.file //all files that to be render
            this.dataWrap           =   this.elem
            this.name               =   this.elem.attr('data-property-name') || this.elem.attr('name')

            this.server             =   X.prototype.config.PATH_FILE.path.rootImg
            this.uploadUrl          =   X.prototype.config.PATH_FILE.path.rootUploadUrl
            this.imageUrl           =   X.prototype.config.PATH_FILE.path.rootCrawlingImgUrl
        }
        /**
         @method props 添加参数
         */
        UploaderDashedImg.prototype.props = function() {
            
            this.filePicker         =   this.elem.find(".filePicker") //the file picker
            this.dataWrap           =   this.elem.children(".js-dataWrap")
            this.inputHidden        =   this.elem.children("input[type=hidden]") //for validate
            this.errorPlace         =   this.elem.find(".js-error") //the error place

            this.minFilesNum        =   this.options.min || 1
            this.maxFilesNum        =   this.options.max || 20
            
            this.uploaderOptions    =   {
                                            pick: {
                                                id: this.filePicker
                                            },
                                            formData: {
                                                fileType: this.options.type || 1
                                            },
                                            auto: true,
                                            swf: 'js/lib/webUploaderDashedImg/Uploader.swf',
                                            sendAsBinary:true,
                                            duplicate: true,
                                            chunked: false,
                                            chunkSize: 512 * 1024,
                                            server: this.server,
                                            fileSingleSizeLimit: this.options.size * 1024 * 1024,
                                            accept : this.options.accept
                                        }
            this.errorText          =   {
                                            Q_EXCEED_SIZE_LIMIT:        '请上传大小在'+ this.options.size +'M以内的文件',
                                            Q_EXCEED_NUM_LIMIT:         '文件数量超出最大值',
                                            F_DUPLICATE:                '文件不能重复上传',
                                            Q_TYPE_DENIED:              '请上传支持的文件格式'
                                        }
        }

        /**
         @method props 添加模板
         */
        UploaderDashedImg.prototype.loadTemplate = function() {
            var html = [
                    '<div class="dashedBox">',
                    '   <img>',
                    '   <i class="obj iconfont icon-add">',
                    '       <p>添加图片</p>',
                    '   </i>',
                    '   <div class="filePicker"></div>',
                    '   <span><label class="js-error"></label></span>',
                    '</div>',
                    '<input type="hidden" name="'+ this.name +'">'
                ].join('')

            this.elem.append(html)
        }

         /**
         @method props 生成webuploader
         */
        UploaderDashedImg.prototype.generate = function() {
            var that = this
            this.uploader = WebUploader.create(this.uploaderOptions)

            this.uploader.on('uploadSuccess', function(file, response) {
                that.setValue(response.data)
            });
        };

        UploaderDashedImg.prototype.doRender = function() {
            var img = this.elem.find('img')//.removeClass('dashed')
            img[0].src = this.file.url || this.file.filePath
        }

        UploaderDashedImg.prototype.setValue = function(file) {
            this.file = file
            this.doRender()
            this.errorPlace.text('')
            this.valueChange()
        }

        UploaderDashedImg.prototype.valueChange = function() {
            var input = this.elem.children('input[type=hidden]')
            input.val('a')
            input.valid && input.valid()
        }

        UploaderDashedImg.prototype.getValue = function() {
            return this.file
        }

        UploaderDashedImg.prototype.error = function() {
            var me = this
            this.uploader.on( 'error', function( type ) {
                me.errorPlace.text(me.errorText[type])
            });
        };

        UploaderDashedImg.prototype.init = function() {
            this.preProps()
            this.loadTemplate()
            this.props()
            this.generate()
            this.error()
        }

        return UploaderDashedImg;
    });

})(jQuery,this.Xbn);