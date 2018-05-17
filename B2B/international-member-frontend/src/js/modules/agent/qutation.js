X.define('modules.agent.qutation', ["model.agentModel", "modules.common.global", "modules.common.multipleFiles","modules.common.checkIsIE", "modules.agent._validate","common.layer","common.ueditorImageUploader","adapter.webuploader"], function (model, global,multipleFiles, checkIsIE, _validate,layer) {

    var view = X.view.newOne({
        el: $('.js-qutation'),
        url: X.config.agent.tpl.qutation,
        res: X.config.agent.res.qutation
    });

    var ctrl = X.controller.newOne({
        view: view
    });

    var events = {
        init: function(res) {
            var that = this;
            var meta = {
                'sourcingRequestQuoteAttachments': {
                    size:15,
                    type: 22,
                    maxNum: 10,
                    hiddenBtn:true,
                    extensions: "gif,jpg,jpeg,png,xlsx,xls,csv,ppt,pptx,doc,docx,txt,pdf,rm,rmvb,wmv,avi",
                    filePicker: ctrl.view.find(".filePicker").get(0),
                    filePickerLabel: "+",
                    Q_EXCEED_SIZE_LIMIT:'The maximum file size should be within 10 MB',
                    Q_EXCEED_NUM_LIMIT: 'The number of files exceeded the maximum',
                    F_DUPLICATE: 'Files repeating',
                    Q_TYPE_DENIED: 'format not accepted,only gif,jpg,jpeg,png,xlsx,xls,csv,ppt,pptx,doc,docx,txt,pdf,rm,rmvb,wmv,avi',
                    uploadSuccessBackFill: function(data){
                        var fileType = data.data.fileName.split(".")[1];
                        var temp = that.fileTypeFunc(data.data,fileType,that.uploadSuccessTemplate);
                        return temp;
                    },
                    getValue:function(value,type){
                        var arr = [];
                        $.each(value,function(i,item){
                            var me = $(item),
                                filePath, fileName,fileSize;

                            filePath = me.attr("href");
                            fileName = me.html();
                            fileSize = me.attr("size");

                            arr.push({attachmentType:type,filePath:filePath, fileName:fileName,fileSize:fileSize});
                        });
                        return arr;
                    },
                    duplicate:function(wrap){
                        var nameArr = [];
                        var namewrapArr = wrap.find(".js-uploadData");
                        $.each(namewrapArr,function(i,item){
                            nameArr.push($(namewrapArr[i]).html());
                        });
                        return nameArr;
                    }
                }
            };

            ctrl.vm = ctrl.getViewModel(ctrl.view.find(".js-qutationWrap"),{ meta: meta,data:res});
            ctrl.vm.initControl();

            //初始化编辑器
            var editorid = {
                article: "modules.agent.qutation"
            };
            UE.delEditor(editorid['article']);
            ctrl.UEditor = UE.getEditor(editorid['article'],{wordCount:false, onready:function(){
                /*ctrl.UEditor.setContent(content);*/
            }});

            res ? ctrl.sourcingRequestId = res.sourcingRequestId : '';
            res ? ctrl.quoteCount = res.quoteCount : '';
            res ? ctrl.agentId = res.agentId : '';

            that.validate();

            res ? (res.sourcingRequestAttachPublishes  ? that.setUploadData(res.sourcingRequestAttachPublishes):'') : '';

            res ? (res.sRequestAdditionalPublishList  ? that.setAdditionalInformation(res.sRequestAdditionalPublishList):'') : '';

            var showBtn = false;
            var qutationWrap = ctrl.view.find(".js-qutationUploadDataWrap");
            var informationWrap = ctrl.view.find(".js-information");
            ctrl.view.find(".js-showBtn").on('click', function(){
                var rm = ctrl.view.find(".js-rm");
                var rmbg = ctrl.view.find(".js-rmbg");
                showBtn = !showBtn;
                if(showBtn){
                    rm.html('');
                    rmbg.css("background","url('images/quotationArror.png') 0px 18px");
                    res ? (res.sourcingRequestAttachPublishes ? qutationWrap.css('display','block') : '') : '';
                    res ? (res.sRequestAdditionalPublishList.length > 0 ? informationWrap.css('display','block') : '') : '';
                }else{
                    rm.html('Read More');
                    rmbg.css("background","url('images/quotationArror.png') 18px 18px");
                    res ? (res.sourcingRequestAttachPublishes ? qutationWrap.css('display','none') : '') : '';
                    res ? (res.sRequestAdditionalPublishList.length > 0 ? informationWrap.css('display','none') : '') : '';
                }
            });

            ctrl.view.find(".js-templDownLoad").attr("href",X.constructor.prototype.config.attach.downloadTemplate+"downloadTemplate?fileType=0");

            ctrl.view.find(".js-submit").on('click', that.submit);

            //判断是否是第一次报价
            if(ctrl.quoteCount > 0){
                layer.beforePostConfirm("You have already submitted a Quotation.  Do  you  want to submit again?",{btn:['No','Yes'],title:'Prompt'},
                    function(index){
                        layer.close(index);
                        window.location.href = X.config.common.link.sourcingRequestDetail +'?id='+ctrl.agentId;
                    },function(index){
                        layer.close(index);
                    }
                )
            }
        },
        //获取cookie
        getCookie:function(times){
            var aCookie = document.cookie.split("; ");
            for (var i=0; i < aCookie.length; i++)
            {
                var aCrumb = aCookie[i].split("=");
                if (times == aCrumb[0])
                    return unescape(aCrumb[1]);
            }
            return null;
        },
        //附件类型判断
        fileTypeFunc:function(data,fileType,callback){
            var temp,type = fileType.toLowerCase();
            switch (type) {
                case 'pdf':
                    temp = callback(data,fileType,"pdf");
                    break;
                case 'jpg':
                    temp = callback(data,fileType,"jpg");
                    break;
                case 'jpeg':
                    temp = callback(data,fileType,"jpg");
                    break;
                case 'png':
                    temp = callback(data,fileType,"jpg");
                    break;
                case 'gif':
                    temp = callback(data,fileType,"jpg");
                    break;
                case 'ppt':
                    temp = callback(data,fileType,"ppt");
                    break;
                case 'pptx':
                    temp = callback(data,fileType,"ppt");
                    break;
                case 'xls':
                    temp = callback(data,fileType,"xls");
                    break;
                case 'xlsx':
                    temp = callback(data,fileType,"xls");
                    break;
                case 'csv':
                    temp = callback(data,fileType,"csv");
                    break;
                case 'doc':
                    temp = callback(data,fileType,"doc");
                    break;
                case 'docx':
                    temp = callback(data,fileType,"doc");
                    break;
                case 'txt':
                    temp = callback(data,fileType,"txt");
                    break;
                case 'text':
                    temp = callback(data,fileType,"txt");
                    break;
                case 'rm':
                    temp = callback(data,fileType,"mv");
                    break;
                case 'rmvb':
                    temp = callback(data,fileType,"mv");
                    break;
                case 'wmv':
                    temp = callback(data,fileType,"mv");
                    break;
                case 'avi':
                    temp = callback(data,fileType,"mv");
                    break;
            }
            return temp;
        },
        //上传成功的回填模板
        uploadSuccessTemplate:function(data,fileType,type){
            var html,uploadDomin = X.constructor.prototype.config.PATH_FILE.path.imgUrl;
            if(type !=="jpg"){
                html ='<div class="disib mr30 por wrapUpload"><span class="file-icon-del bgcd1 curp poa colff tac cancel">X</span><a class="none" size="'+data.fileSize+'" href="'+data.url+'">'+ data.fileName +'</a>'+
                    '<div class="center por file-icon file-icon-'+type+'"><p class="poa colff tac b2 w100p">'+fileType+'</p></div>'+
                    '<p class="f12 col00 mt5 js-uploadData" style="width: 56px;height: 15px;overflow: hidden;" title="'+ data.fileName +'">'+ data.fileName +'</p>'+
                    '</div>';
            }else{
                html = '<div class="disib mr30 por wrapUpload"><span class="file-icon-del bgcd1 curp poa colff tac cancel">X</span>' +
                    '<div class="img-icon center tac por"><a class="none" href="'+data.url+'" size="'+data.fileSize+'">'+ data.fileName +'</a>'+
                    '<img src="'+ uploadDomin + data.url +'" class="w100p">' +
                    '<div class="file-icon-type poa b0 f12 colff w100p tac" style="background: #02d644;">'+fileType+'</div>' +
                    '</div>' +
                    '<p class="f12 col00 mt5 tac js-uploadData" style="width: 56px;height: 15px;overflow: hidden;" title="'+ data.fileName +'">' + data.fileName + '</p>' +
                    '</div>';
            }
            return html;
        },
        //获取agent信息
        getAgentInfo: function(callbackFun){
            var that = this;
            var agentId = that.GetQueryString("id");
            var callback = function(res){
                if (res.statusCode === X.constructor.prototype.CONSTANT.statusCode.SUCCESS){
                    res.data.agentId = agentId;
                    callbackFun(res);
                }else{
                    callbackFun({});
                }
            };
            model.getAgentInfo(agentId,callback);
        },
        //获取url参数
        GetQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
            var context = "";
            if (r != null)
                context = r[2];
            reg = null;
            r = null;
            return context == null || context == "" || context == "undefined" ? "" : context;
        },
        //additionalInformation回填
        setAdditionalInformation: function(additionalInformation) {
            var that = this;
            $.each(additionalInformation,function(i,item){
                item.postTime ? item.postTime = item.postTime.split(' ')[0] : '';
            });

            ctrl.view.find(".js-additionalInformationWrap").loadTemplate($(".js-agent-additionalInformationData-tpl"), additionalInformation,{
                success:function(){
                    var addInfoWrap = ctrl.view.find(".js-addInfo");
                    $.each(additionalInformation,function(i,item){
                        that.setIframeContent(i,item.content);
                        item.sourcingRequestAdditionalAttachmentPublishList  ? that.setUploadData(item.sourcingRequestAdditionalAttachmentPublishList ,$(addInfoWrap[i]).find('.js-wrapImg')):'';
                    })
                }
            });
        },
        setIframeContent: function(index,data) {
            var that = this;
            var iframe = $('.js-additionalInfoFrame')[index],
                docum  = iframe.contentWindow.document;

            //去掉后台的发布的body的样式
            data = data.replace(/<style type="text\/css"[^>]*>body([\s\S]*)<\/style>/, ' ');

            docum.body.innerHTML = that.getBodyHtml(data);
            docum.head.innerHTML = that.getHeadHtml(data);
            //iframe设置自适应height
            iframe.style.height  = docum.documentElement.offsetHeight + 'px';
        },
        /**
         @method getHeadHtml 截取head标签内的元素
         @param content {html} 需要截取的html
         */
        getHeadHtml: function (content) {
            var REG_BODY = /<head[^>]*>([\s\S]*)<\/head>/;
            function getHead(content){
                var result = REG_BODY.exec(content);
                if(result && result.length === 2)
                    return result[1];
                return content;
            }
            return getHead(content);
        },
        /**
         @method getBodyHtml 截取body标签内的元素
         @param content {html} 需要截取的html
         */
        getBodyHtml: function (content) {
            var REG_BODY = /<body[^>]*>([\s\S]*)<\/body>/;
            function getBody(content){
                var result = REG_BODY.exec(content);
                if(result && result.length === 2)
                    return result[1];
                return content;
            }
            return getBody(content);
        },
        //上传附件回填
        setUploadData: function(data,wrapL){
            var that = this;
            var wrap='';
            wrapL ? wrap = wrapL : wrap  = ctrl.view.find(".js-qutationUploadDataWrap");
            $.each(data,function(i,item){
                var fileType = item.fileName.split(".")[1];
                var temp = that.fileTypeFunc(item,fileType,that.uploadTemplate);
                temp ? wrap.append(temp) : '';
            });

        },
        //agent附件模板
        uploadTemplate:function(data,fileType,type){
            var html,downloadType='7',
            uploadUrl = X.constructor.prototype.config.attach.download,
                imgUrl = X.constructor.prototype.config.PATH_FILE.path.imgUrl;
            if(type !=="jpg"){
                html ='<a href="' + uploadUrl + '?fileType=' + downloadType + '&filePath=' + data.filePath + '&fileName=' + data.fileName + '">' +
                    '<div class="disib mr30 por"><div class="center por file-icon file-icon-'+type+'"><p class="poa colff tac b2 w100p">'+fileType+'</p></div>'+
                    '<p class="f12 col00 mt5" style="width: 56px;height: 15px;overflow: hidden;" title="'+ data.fileName +'">'+ data.fileName +'</p>'+
                    '</div></a>';
            }else{
                html = '<a class="disib mr30" href="' + uploadUrl + '?fileType=' + downloadType + '&filePath=' + data.filePath + '&fileName=' + data.fileName + '">' +
                    '<div class="disib mr30 por"><div class="img-icon center tac por"><img src="'+ imgUrl + '/'+data.filePath+'" class="w100p">' +
                    '<div class="file-icon-type poa b0 f12 colff w100p tac" style="background: #02d644;">'+fileType+'</div>' +
                    '</div>' +
                    '<p class="f12 col00 mt5 tac" style="width: 56px;height: 15px;overflow: hidden;" title="'+ data.fileName +'">' + data.fileName + '</p>' +
                    '</div></a>';
            }
            return html;
        },
        validate: function(){
            ctrl.view.find('.js-qutationForm').validate(_validate)
        },
        submit: function() {
            if(ctrl.view.find('.js-qutationForm').valid()){
                var data = ctrl.vm.collectData();
                data.details = ctrl.UEditor.getAllHtml();
                data.sourcingRequestId = ctrl.sourcingRequestId;
                var callback = function(res){
                    var wrap  = ctrl.view.find(".js-hiddenWrap");
                    var okBtn  = ctrl.view.find(".js-ok");
                    $(document.body).css("overflow-y","hidden");
                    wrap.css('display',"block");
                    okBtn.click(function(){
                        window.location.href = X.config.PATH_FILE.path.atcdealPath;
                    });
                };
                model.postAgentInfo(data,callback);
            }
        }
    };

    ctrl.load = function() {
        var callback = function(data){
            var initData;
            if(data.data){
                data.data.postTime ? data.data.postTime = data.data.postTime.split(' ')[0] : '';
                if(data.data.destination){
                    if(data.data.destination.split(' ').length > 2){
                        var destination = data.data.destination.split(' ')[0] + data.data.destination.split(' ')[1];
                        destination == 'SriLanka' ? data.data.destination = 'Sri Lanka' : '';
                    }
                }
            }

            var user = events.getCookie('user');
            if(user){
                var dara = JSON.parse(user);
                data.data ? data.data.name = dara.firstName : '';
                data.data ? data.data.phone = dara.mobile : '';
                data.data ? data.data.email = dara.email : '';
            }

            data.data ? initData = data.data : initData = {};

            view.render(initData,function() {
                events.init(initData);
            })
        };
        events.getAgentInfo(callback);
    };

    ctrl.load();

    return ctrl
});