(function ($,X) {

    X.prototype.controls.widget("Uploader", function (controlType) {

        var BaseControl = X.prototype.controls.getControlClazz("BaseControl");

        function Uploader(elem, options){
            BaseControl.call(this,elem,options);
            this.init();
        }

        X.prototype.controls.extend(Uploader,"BaseControl");

        Uploader.prototype.constructor = Uploader;

        Uploader.prototype.preProps = function() { 
            this.files              =   this.options.files || [] //all files that to be render
            this.renderType         =   ['renderImg', 'renderFile']
            this.dataWrap           =   this.elem
            this.needUpload         =   this.options.needUpload == undefined? true: this.options.needUpload

            this.server             =   X.prototype.config.PATH_FILE.path.rootImg
            this.uploadUrl          =   X.prototype.config.PATH_FILE.path.rootUploadUrl
            this.imageUrl           =   X.prototype.config.PATH_FILE.path.rootCrawlingImgUrl
        }
        /**
         @method props 添加参数
         */
        Uploader.prototype.props = function() {
            
            this.filePicker         =   this.elem.find(".filePicker") //the file picker
            this.dataWrap           =   this.elem.children(".js-dataWrap")
            this.inputHidden        =   this.elem.children("input[type=hidden]") //for validate
            this.errorPlace         =   this.elem.children(".js-error") //the error place

            this.filePickerLabel    =   this.options.filePickerLabel || "上传"
            
            this.minFilesNum        =   this.options.min || 1
            this.maxFilesNum        =   this.options.max || 20
            
            this.uploaderOptions    =   {
                                            pick: {
                                                id: this.filePicker,
                                                label: this.filePickerLabel,
                                                multiple: true
                                            },
                                            formData: {
                                                fileType: this.options.type
                                            },
                                            auto: true,
                                            swf: 'js/lib/webuploader/Uploader.swf',
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
        Uploader.prototype.loadTemplate = function() {
            var name = this.elem.attr('data-property-name') || this.elem.attr('name'),
                html = [
                    '<div class="queueList disib uploadBox">',
                    '   <div class="filePicker w90 ti8 add-filebg disib"></div>',
                    '</div>',
                    '<input type="hidden" name="'+ name +'">',
                    '<div class="js-dataWrap disibni mt20 hauto por"></div>',
                    '<p class="mt20 js-error redFont"></p>',
                    
                ].join('')

            this.elem.append(html)
        }

        Uploader.prototype.init = function() {
            this.preProps()
            //check if upload is necessary
            this.needUpload && (
                this.loadTemplate(),
                this.props(), 
                this.generate(),
                this.error()
            )
            this.eventBind()
            this.files.length && this.renderAll()
        }

        Uploader.prototype.renderAll = function(files) {
            var me   = this
            files && (this.files = this.files.concat(files))
            this.files.forEach(function(item) {
                me.currentFile = item
                me.doRender()
            })
        };

        Uploader.prototype.doRender = function() {
            var html = this[this.typeCheck()].call(this)
            this.dataWrap.append(html)
            this.needUpload && this.fileChanged()
        };

        Uploader.prototype.addFile = function(file) {
            this.files.push(file)
            this.currentFile = file
            this.doRender()
        };

        Uploader.prototype.removeFile = function(file) {
            var files = this.files
            if (file instanceof jQuery) {
                
                //this.maxNumber(true);
                doRemove.call(this, file.next().html())
                file.parent().remove()
                this.fileChanged()
            } else {

            }

            function doRemove(name) {
                for (var i = files.length; i--;) {
                    if (files[i].fileName === name) {
                        files.splice(i, 1)
                        break
                    } 
                }
            }
        };

        Uploader.prototype.eventBind = function() {
            var that = this,
                selectors = ['.wrapUpload > img.upload-imgage', '.wrapUpload > .cancel']

            selectors.forEach(function(item) {
                $('body').off('click', item).on('click', item, function() {
                    that[this.getAttribute('event')]($(this))
                })
            })
        };

        Uploader.prototype.fileChanged = function() {
            var val = ''
            this.files.forEach(function(item) {
                val += 'a'
            })
            this.inputHidden.val(val)
            this.inputHidden.valid && this.files.length >= this.minFilesNum && this.inputHidden.valid()
        };

        /**
         @method init 设置上传文件数量
         @param value {string} 设置上传文件最大数量
         */
        Uploader.prototype.maxNumber = function(data){
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

        Uploader.prototype.typeCheck = function() {
            var index = 0

            if (this.currentFile.url) {
                
            } else if(this.currentFile.filePath && /png|jpg|jpeg/.test(this.currentFile.filePath)) {

            } else {
                index = 1
            }

            return this.renderType[index]
        }

        Uploader.prototype.renderImg = function(item) {
            var item = this.currentFile,
                url  = item.url || item.filePath,
                html = [
                    '<div class="wrapUpload disib pt20">',
                    '   <img src="'+ this.imageUrl + url +'" class="upload-imgage" event="showImg"/>',
                    this.needUpload? '   <span class="redFont cancel" event="removeFile">X</span>': '',
                    '   <p class="mt10 tac contract-word-cut">'+ (item.fileName || item.filename) +'</p>',
                    '</div>'
                ].join('')

            return html
        }

        Uploader.prototype.renderFile = function(item) {
            var item = this.currentFile,
                html = [
                    '<div class="wrapUpload">',
                    '   <a href="'+ this.server +'?fileType='+ this.downloadType+'&filePath='+item.filePath+'&fileName='+item.filename+'" class="accessory white-block">'+item.filename+'</a>',
                    this.needUpload? '   <span class="redFont cancel">X</span>': '',
                    '</div>'
                ].join('')

            return html
        }

        /**
         @method props 生成webuploader
         */
        Uploader.prototype.generate = function() {
            var that = this
            this.uploader = WebUploader.create(this.uploaderOptions)

            this.uploader.on('uploadSuccess', function(file, response) {
                that.addFile(response.data)
                that.errorPlace.text('')
            });
        };

        Uploader.prototype.error = function() {
            var me = this
            this.uploader.on( 'error', function( type ) {
                me.errorPlace.text(me.errorText[type])
            });
        };

        Uploader.prototype.showImg = function(img) {
            var content = '<img src="'+ img[0].src +'">'
            layer.open({
                type: 1,
                title: false,
                content: content
            });
        };

        /**
         @method getValue 获取上传文件
         */
        Uploader.prototype.getValue = function(type){
            //somebody stupid
            this.files.forEach(function(item) {
                if (item.url) {
                    item.filePath = item.url
                    delete item.url
                }
            })
            return this.files
        };

        /**
         @method setValue 渲染上传文件
         */
        Uploader.prototype.setValue = function(arr){
            arr && (this.files = arr)
            this.renderAll()
        };

        /**
         @method init 重置上传附件展示
         */
        Uploader.prototype.reset = function () {
            this.setValue("");
        };

        window.XBNUploader = Uploader

        return Uploader;
    });

})(jQuery,this.Xbn);