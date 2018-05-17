X.define("modules.inquiry.addPrice", ["model.inquiryModel",'common.layer',"modules.common.ueditorImageUploader2","adapter.webuploader",'adapter.jqthumb',"adapter.laydate"], function (inquiryModel,layer1,imageUploader) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.inquiry.tpl.addPrice
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {
        view.render({}, function () {
            ctrl.vmaddPrice = ctrl.getViewModel(ctrl.view.el.find(".js-addPrice"),{meta: {"source":{dataSource:inquiryModel.const.source,selectedChanged: function(item){
                var inputSource = ctrl.view.el.find(".js-inputSource");
                var sourceError = ctrl.view.el.find(".currency-error");
                inputSource.val(item.text);
                sourceError.html('');
            }},"postTime":{istime:true,afterDateChange:function (that,date){
                var postTimeRrror = ctrl.view.el.find(".js-postTime-error");
                postTimeRrror.html('');
            },afterClearDate:function (that){}},
                "sourcingRequestQuoteAttachments":{size:15,type:22,maxNum:10,hiddenBtn:true,extensions:"gif,jpg,jpeg,png,xlsx,xls,csv,ppt,pptx,doc,docx,txt,pdf,rm,rmvb,wmv,avi",
                width: '56',height:'58',
                filePicker:ctrl.view.el.find(".js-sourcingRequestAttachments").find(".filePicker").get(0),filePickerLabel:"Attachment",
                Q_EXCEED_SIZE_LIMIT:'The maximum file size should be within 10 MB',
                Q_EXCEED_NUM_LIMIT:'The number of files exceeded the maximum',
                F_DUPLICATE:'Files repeating',
                Q_TYPE_DENIED_TEXT:'format not accepted,only gif,jpg,jpeg,png,xlsx,xls,csv,ppt,pptx,doc,docx,txt,pdf,rm,rmvb,wmv,avi',
                uploadSuccessPageShow : function(response, wrap){
                    var path = '';
                    response.data ? (response.data.url ? path = response.data.url : path = response.data.path) : '';
                    var a = '<div class="wrapUpload" style="display: block">' +
                        '<span class="js-uploadData" href="'+ path +'" style="background-color: white;padding: 0px 10px 0px 12px">' + response.data.fileName + '</span>' +
                        '<span class="js-uploadSize">'+ response.data.fileSize +'</span>'+
                        '<span class="redFont cancel"></span></div>';
                    return a;
                },
                getValueData:function(value,type){
                    var arr = [];
                    $.each(value,function(i,item){
                        var me = $(item),
                            filePath, fileName,fileSize;
                        filePath = me.find('.js-uploadData').attr("href");
                        fileName = me.find('.js-uploadData').html();
                        fileSize = me.find('.js-uploadSize').html();
                        arr.push({attachmentType:type,filePath:filePath, fileName:fileName ,fileSize:fileSize});
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
            }}});
            ctrl.vmaddPrice.initControl();

            /*ctrl.validateValue();*/

            ctrl.datetimeInit();

            //富文本上传图片参数
            var opt = {
                type : 22,
                width: 200,
                height: 200
            };
            imageUploader.registerUEFun(opt);

            //初始化编辑器
            var editorid = {
                article: "modules.inquiry.addPrice"
            };
            UE.delEditor(editorid['article']);
            ctrl.UEditor = UE.getEditor(editorid['article'],{wordCount:false, onready:function(){
                /*ctrl.UEditor.setContent(content);*/
            }});

            ctrl.formValidate()
        });
    };

    /**
     @method deleteSpecialChar 删除非英文
     */
    ctrl.deleteSpecialChar = function (value) {
        var temp = '';
        for (var i = 0, len = value.length; i < len; i++) {
            var char = value.charAt(i);
            if (/[A-Za-z0-9\s(\`)(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\_)(\-)(\+)(\=)(\|)(\\)(\{)(\})(\')(\:)(\;)(\')(\")(',)(\[)(\])(\.)(\<)(\>)(\/)(\?)(\~)(\！)(\@)(\#)(\￥)(\%)(\…)(\&)(\*)(\（)(\）)(\—)(\+)(\|)(\{)(\})(\【)(\】)(\‘)(\；)(\：)(\”)(\“)(\’)(\。)(\，)(\、)(\？)]/.test(char)) {
                temp += char;
            }
        }
        return temp;
    };

    ctrl.validateValue = function () {

        var fun = function(wrap,value){
            var temp = ctrl.deleteSpecialChar(value);
            if (temp != value) {
                $(wrap).val(ctrl.deleteSpecialChar(temp));
            }
        };

        ctrl.view.el.find("input").on("keyup change",function(){
            var value = $(this).val();
            fun(this,value);
        });
        ctrl.view.el.find("textarea").on("keyup change",function () {
            var value = $(this).val();
            fun(this,value);
        });
    };

    /**
     @method formValidate 表单数据校验
     */
    ctrl.formValidate = function(){
        ctrl.validate = {
            rules: {
                name: {
                    required: true
                },
                phone: {
                    required: true,
                    isDigits:true
                },
                email: {
                    required: true,
                    email: true
                },
                inputSource: {
                    required: true
                },
                postTime: {
                    required: true
                }
            },
            messages: {
                name: {
                    required: "Please enter the agent"
                },
                phone: {
                    required: "Please enter the phone",
                    isDigits: "Please enter the correct phone number"
                },
                email: {
                    required: "Please enter your Email",
                    email: "Please enter a valid Email address"
                },
                inputSource : {
                    required: "Please select a source"
                },
                postTime:{
                    required:"Please enter the Post Time"
                }
            },
            onkeyup: false,
            onfocusout: function (element) {
                var elem = $(element);
                 elem.valid();
            },
            success: function(value){},
            errorPlacement: function (error, element) {
                if($(error).html()){
                    var errorWrap = element.parent().find(".js-error");
                    errorWrap.html("");
                    error.appendTo(errorWrap);
                }
            }
        };
        ctrl.view.el.find('.js-addForm').validate(ctrl.validate);
    };

    ctrl.getDatetime = function () {
        function p(s) {
            return s < 10 ? '0' + s: s;
        }

        var myDate = new Date();
        var year=myDate.getFullYear();
        var month=myDate.getMonth()+1;
        var date=myDate.getDate();
        var h=myDate.getHours();       //获取当前小时数(0-23)
        var m=myDate.getMinutes();     //获取当前分钟数(0-59)

        var now=year+'-'+p(month)+"-"+p(date)+" "+p(h)+':'+p(m);
        return now;
    };

    /**
     @method datetimeInit 时间控件初始化
     */
    ctrl.datetimeInit = function () {
        $.datetimepicker.setLocale('en');
        $('.datetimepicker').datetimepicker({
            //value:'2015/04/15 05:03',
            dayOfWeekStart : 1,
            lang:'en',
            format:"Y-m-d H:i",
            disabledDates:['1986/01/08','1986/01/09','1986/01/10']
            //startDate:	'1986/01/05'
        });
        $($('.datetimepicker')[0]).val(ctrl.getDatetime());
        $('.datetimepicker').datetimepicker({value:'',step:10});
        $('.datetimepicker').focusin(function () {
            $('.xbn-frame').css({
                "overflow-y": "hidden"
            });
            $('.datetimepicker').css('border-color', '#00aff0');
        });
        $('.datetimepicker').focusout(function () {
            $('.xbn-frame').css({
                "overflow-y": "auto"
            });
            $('.datetimepicker').css('border-color', '#cccccc');
        });
    };

    /**
     @method uploadSuccess 上传成功设置缩略图
     @param elem {string} 范围内图片设置缩略图
     @param width {string} 设置缩略图width，默认145px
     @param height {string} 设置缩略图height，默认145px
     */
    ctrl.uploadSuccess = function (elem,width,height) {
        elem.find('img').jqthumb(
            {
                width: width || 145,
                height: height || 145,
                after: function(imgObj){
                    imgObj.click(function(e){
                        var imgUrl = $(e.target).parent().next().attr("src");
                        var content = "<img src='"+imgUrl +"' />";
                        var opt = {
                            shadeClose:true,
                            closeBtn:1,
                            content:content,
                            callback:function(){
                                $(".layui-layer-content").click(function(){
                                    layer1.closeAll();
                                })
                            }
                        };
                        layer1.layerOpen(opt);
                    });
                }
            }
        );
    };

    /**
     @method cancel 取消表单数据提交
     */
    ctrl.cancel = function(){
        //X.router.back();
        X.router.run("m=inquiry.inquiryDetail&sourcingRequestId=" + _para["sourcingRequestId"]+"&tab=1");
    };

    /**
     @method formSubmit 表单数据提交
     */
    ctrl.formSubmit = function(){
        if(ctrl.view.el.find(".js-addForm").valid()){
            var data = ctrl.vmaddPrice.collectData();
            data.details = ctrl.UEditor.getAllHtml();
            data.sourcingRequestId = _para["sourcingRequestId"];
            data.postTime = data.postTime +":00";
            var callback = function(result){
                if (result.statusCode ===  X.constructor.prototype.constant.statusCode.SUCCESS){
                    X.router.run("m=inquiry.inquiryDetail&sourcingRequestId=" + _para["sourcingRequestId"]+"&tab=1");
                }
            };

            inquiryModel.addPrice(data,callback);
        }
    };

    ctrl.addEvent("click", ".js-cancel", "cancel");
    ctrl.addEvent("click", ".js-addButton", "formSubmit");

    var _para;
    ctrl.load = function (para) {
        para = para || {};
        _para = para ;
        ctrl.rendering();
    };

    return ctrl;

});
