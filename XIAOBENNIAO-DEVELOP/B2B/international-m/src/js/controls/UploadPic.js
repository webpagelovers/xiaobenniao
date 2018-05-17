
define(function (){
　　　　function UploadPic() {
            this.sw = 0;
            this.sh = 0;
            this.tw = 0;
            this.th = 0;
            this.scale = 0;
            this.maxWidth = 0;
            this.maxHeight = 0;
            this.maxSize = 0;
            this.fileSize = 0;
            this.fileDate = null;
            this.fileType = '';
            this.fileName = '';
            this.input = null;
            this.canvas = null;
            this.mime = {};
            this.type = '';
            this.callback = function () {};
            this.loading = function () {};
        }

        UploadPic.prototype.init = function (options) {
            this.options = options;
            this.parentDiv = options.parentDiv || $(".js-upload");
            this.maxWidth = options.maxWidth || 800;
            this.maxHeight = options.maxHeight || 600;
            this.maxSize = options.maxSize * 1024 * 1024 || 3 * 1024 * 1024;
            this.maxNumber = options.maxNumber || 10;
            this.progressEnd = options.progressEnd;
            this.errorTextDisappear = options.errorTextDisappear;
            this.mime = options.mime || {'png': 'image/png', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'bmp': 'image/bmp'};
            this.error = {
                ERROR_TYPE: options.error ? options.error.ERROR_TYPE : '选择的文件类型错误',  //类型错误
                ERROR_MAXSIZE: options.error ? options.error.ERROR_MAXSIZE : '选择文件大于' + this.maxSize / 1024 / 1024 + 'M，请重新选择',  //大小错误
                ERROR_MAXNUMBER: options.error ? options.error.ERROR_MAXNUMBER : '文件数量大于' + this.maxNumber, //数量超过最大值
                ERROR_REPEATING: options.error ? options.error.ERROR_REPEATING : '文件重复上传'
            };
            this.mapping = {};
            this.hashArray = [];
            this.callback = options.callback || this._callback;
            this.loading = options.loading || function () {};

            this.getTemplate();
            this._addEvent();
        };

        /**
         * @description 选择图片后的回调函数
         * @param {Object} base64 转码后的上传的图片数据
         * @param {Function} ajax上传图片数据
         */
        UploadPic.prototype._callback = function (base64) {
            var _this = this;
            $.ajax({
                url:_this.options.url,
                data: {
                    base64File: base64,
                    name: _this.fileName,
                    fileType: _this.options.fileType,
                    width: 56,
                    height: 58
                },
                type:'post',
                dataType:'json',
                xhr: function(){
                  var xhr = $.ajaxSettings.xhr();
                  if(_this.progress && xhr.upload) {
                    xhr.upload.addEventListener("progress" ,$.proxy(_this.progress,_this) , false);
                    return xhr;
                  }
                },
                beforeSend: function(xhr){
                  _this.options.beforeSend && _this.options.beforeSend();
                },
                //提交成功后的回调函数
                success:function(response){
                  _this.options.success ? _this.options.success(response) : _this._success(response);
                }
            })
        };

        /**
         @method init 获取上传文件进度
         @param value {string} 获取上传文件值
         */
        UploadPic.prototype.progress = function (evt) {
            var _this = this;
            var loaded = evt.loaded;     //已经上传大小情况
            var tot = evt.total;      //附件总大小
            var per = Math.floor(100*loaded/tot);  //已经上传的百分比
            if(per == 100){
              _this.options.progressEnd && _this.options.progressEnd();
            }
        };

        /**
         * @description 上传图片成功后的回调函数
         * @param {Object} response 成功后返回的图片url
         * @param {Function} fn 绑定函数
         */
        UploadPic.prototype._success = function (response) {
            var _this = this;
            if(response.statusCode == (_this.options.statusCode || 3000000)) {
                var wrapImg = _this.parentDiv.find('.js-upload-add');
                var a = '<div class="wrapUpload por inlineb" style="margin-left: 1rem;width:2.2rem;height: 2.2rem;">' +
                    '<img src="' + this.options.downloadUrl + response.data.url + '" filename="' + response.data.fileName + '"  class="accessory blueFont poa" style="width:2.2rem;height:2.2rem;"/><img class="cancel poa" style="width:1rem;height:1rem;left:1.7rem;top:-0.2rem;" src="images/error.png"/>' +
                    '</div>';
                $(wrapImg).before(a);

                _this.cancel();
                _this.options.mySuccess(response);
            }
            $('#input').removeAttr("disabled");
        };

        /**
         * @description 删除图片函数
         * @param {Object} elm 元素
         * @param {Function} fn 绑定函数
         */
        UploadPic.prototype.cancel = function () {
            var _this = this;
            var cancel = _this.parentDiv.find('.js-wrapImg').find(".cancel");
            cancel.unbind("click");
            cancel.on('click', function (event) {
                var fatherDiv = $(event.target).parent();
                var index = $(fatherDiv).index();
                _this.mapping[_this.hashArray[index]] = false;
                fatherDiv.remove();
                _this.options.myCancel();
            });
        };

        /**
         @method init 获取上传文件
         @param value {string} 获取上传文件值
         */
        UploadPic.prototype.getValue = function (type) {
          var _this = this;
          var value = _this.parentDiv.find('.js-wrapImg').find("a");
          var arr = [];

          function getArgStr(value) {
            var argStr = '';
            argStr = value.split('&')[1].split('=')[1];
            return argStr;
          }

          $.each(value, function (i, item) {
            arr.push({attachmentType: type, filePath: getArgStr($(this).attr("href"))});
          });
          return arr;
        };

        /**
         * @description 绑定事件
         */
        UploadPic.prototype._addEvent = function () {
            var _this = this;

            this.parentDiv.find('#input').change(function (e) {
                var fn = arguments.callee,
                    clone;

                _this.files = e.target.files;

                clone = this.cloneNode(true);
                clone.value = null;
                this.parentNode.replaceChild(clone, this);

                var input = _this.parentDiv.find('#input');
                input.off();
                input = $(clone).on('change', fn);
                _this._handelSelectFile(e);
            });
        };

        /**
         * @description 初始化上传模板
         */
        UploadPic.prototype.getTemplate = function () {
            var _this = this;
            var template = '<div class="js-wrapImg" style="height: 2.2rem;margin-top: 0.5rem;margin-left: -1rem;">' +
                '<div style="width:2.2rem;height:2.2rem;line-height:2.2rem;border:1px dashed #00ad36;margin-left: 1rem;vertical-align: top;" class="wrapUpload por request-upload-add inlineb js-upload-add"><input type="file" accept="image/*" id="input" style="width:2.2rem;height:2.2rem;"></div></div>'+
              '<p style="color:#d26b22;text-align: left;width:15rem" class="f12 poa js-error"></p>';
            $(_this.parentDiv).append(template);
        };

        /**
         @method init 重复上传文件
         */
        UploadPic.prototype._duplicate = function(file){
            var nameArr = [];
            var namewrapArr = $(".js-wrapImg .accessory");

            for (var i = 0, len = namewrapArr.length; i < len; i++) {
                nameArr.push(namewrapArr[i].attributes.filename.value);
            }

            for (var i = 0, len = nameArr.length; i < len; i++) {
                if(nameArr[i] == file.name){
                    return false;
                }
            }
            return true;
        };

        /**
         * @description 绑定事件
         * @param {Object} elm 元素
         * @param {Function} fn 绑定函数
         */
        UploadPic.prototype._handelSelectFile = function (ev) {
            var _this = this;
            var file = ev.target.files[0];

            this.type = file.type

            function clearErrorText() {
                clearTimeout(time);
                var time = setTimeout(function(){
                _this.parentDiv.find(".js-error").text('');
                },2000);
            };

            var img = $('.js-wrapImg').children();
            if (img.length >= 6) {
                $('.js-upload .js-error').css('margin-top', '60px');
            } else {
                $('.js-upload .js-error').css('margin-top', '5px');
            }

            // 如果没有文件类型，则通过后缀名判断（解决微信及360浏览器无法获取图片类型问题）
            if (!this.type) {
                file.name.match(/\.([^\.]+)$/i) ? this.type = this.mime[file.name.match(/\.([^\.]+)$/i)[1]] : '';
            }

            if (!/image.(png|jpg|jpeg|bmp)/.test(this.type)) {
                _this.parentDiv.find(".js-error").html('<span class="word-cut" style="max-width: 8rem;">' + file.name + '</span>'+ _this.error.ERROR_TYPE);
                _this.errorTextDisappear ? clearErrorText() : '';
                return;
            }

            if (file.size > this.maxSize) {
                _this.parentDiv.find(".js-error").text(_this.error.ERROR_MAXSIZE);
                _this.errorTextDisappear ? clearErrorText() : '';
                return;
            }

            if (_this.parentDiv.find('.js-wrapImg').find('.wrapUpload').length > this.maxNumber) {
                _this.parentDiv.find(".js-error").text(_this.error.ERROR_MAXSIZE);
                _this.errorTextDisappear ? clearErrorText() : '';
                return;
            }

            if (!this._duplicate(file)) {
                _this.parentDiv.find(".js-error").text(_this.error.ERROR_REPEATING);
                _this.errorTextDisappear ? clearErrorText() : '';
                return;
            }

            _this.parentDiv.find(".js-error").text('');

            this.fileName = file.name;
            this.fileSize = file.size;
            this.fileType = this.type;
            this.fileDate = file.lastModifiedDate;
            $('#input').attr("disabled", true);

            this._readImage(file);
        };

        /**
         * @description 读取图片文件
         * @param {Object} image 图片文件
         */
        UploadPic.prototype._readImage = function (file) {
            var _this = this;

            function tmpCreateImage(uri) {
                _this._createImage(uri);
            }

            this.loading();

            this._getURI(file, tmpCreateImage);
        };

        /**
         * @description 通过文件获得URI
         * @param {Object} file 文件
         * @param {Function} callback 回调函数，返回文件对应URI
         * return {Bool} 返回false
         */
        UploadPic.prototype._getURI = function (file, callback) {
            var reader = new FileReader();
            var _this = this;

            function tmpLoad() {
                // 头不带图片格式，需填写格式
                var re = /^data:base64,/;
                var ret = this.result + '';

                if (re.test(ret)) ret = ret.replace(re, 'data:' + _this.mime[_this.fileType] + ';base64,');

                callback && callback(ret);
            }

            reader.onload = tmpLoad;

            reader.readAsDataURL(file);

            return false;
        };

        /**
         * @description 创建图片
         * @param {Object} image 图片文件
         */
        UploadPic.prototype._createImage = function (uri) {
            var img = new Image();
            var _this = this;

            function tmpLoad() {
                _this._drawImage(this);
            }

            img.onload = tmpLoad;

            img.src = uri;
        };

        /**
         * @description 创建Canvas将图片画至其中，并获得压缩后的文件
         * @param {Object} img 图片文件
         * @param {Number} width 图片最大宽度
         * @param {Number} height 图片最大高度
         * @param {Function} callback 回调函数，参数为图片base64编码
         * return {Object} 返回压缩后的图片
         */
        UploadPic.prototype._drawImage = function (img, callback) {
            this.sw = img.width;
            this.sh = img.height;
            this.tw = img.width;
            this.th = img.height;

            this.scale = (this.tw / this.th).toFixed(2);

            if (this.sw > this.maxWidth) {
                this.sw = this.maxWidth;
                this.sh = Math.round(this.sw / this.scale);
            }

            if (this.sh > this.maxHeight) {
                this.sh = this.maxHeight;
                this.sw = Math.round(this.sh * this.scale);
            }

            this.canvas = document.createElement('canvas');
            var ctx = this.canvas.getContext('2d');

            this.canvas.width = this.sw;
            this.canvas.height = this.sh;

            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.sw, this.sh);

            this.callback(this.canvas.toDataURL(this.type));

            ctx.clearRect(0, 0, this.tw, this.th);
            this.canvas.width = 0;
            this.canvas.height = 0;
            this.canvas = null;
        };

        return UploadPic;
　　});

