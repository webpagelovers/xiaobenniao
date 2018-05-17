X.define("modules.inquiry.addRFQ", ["model.inquiryModel",'common.layer',"adapter.intlTelInput","adapter.webuploader",'adapter.jqthumb',"adapter.laydate"], function (inquiryModel,layer1) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.inquiry.tpl.addRFQ
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {
        view.render({}, function () {
            var initData={},info = ctrl.getCookie('info');

            if(JSON.parse(info)){
                JSON.parse(info).postTime ? initData.postTime = JSON.parse(info).postTime : '';
                JSON.parse(info).email ? initData.email = JSON.parse(info).email : '';
                initData.source = 1; //PC/Contact Us
                if(ctrl.HandleCookieData(JSON.parse(info).subject,JSON.parse(info).message)){
                    initData.details = ctrl.HandleCookieData(JSON.parse(info).subject,JSON.parse(info).message);
                }
                ctrl.HandleCookieData(JSON.parse(info).firstName,JSON.parse(info).lastName) ? initData.name = ctrl.HandleCookieData(JSON.parse(info).firstName,JSON.parse(info).lastName):'';
            }
            ctrl.vmaddRFQ = ctrl.getViewModel(ctrl.view.el.find(".js-addRFQ"),{meta: {"source":{dataSource:inquiryModel.const.source,selectedChanged: function(item){
                var inputSource = ctrl.view.el.find(".js-inputSource");
                var sourceError = ctrl.view.el.find(".currency-error");
                inputSource.val(item.text);
                sourceError.html('');
            }},"sourcingRequestAttachments":{size:15,type:18,hiddenBtn:true,maxNum:10,extensions:"gif,jpg,jpeg,png,xlsx,xls,csv,ppt,pptx,doc,docx,txt,pdf,rm,rmvb,wmv,avi",
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
                        '<span class="js-uploadData colBlue" href="'+ path +'" style="background-color: white;padding: 0px 10px 0px 12px">' + response.data.fileName + '</span>' +
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
            }},data:initData});
            ctrl.vmaddRFQ.initControl();

            //ctrl.validateValue();
            ctrl.datetimeInit(initData);
            ctrl.formValidate();
            ctrl.getArea();

            var abstract = ctrl.view.find(".js-details");
            var abstractNumber = ctrl.view.find(".js-detailsNumber");
            ctrl.counter(abstract,abstractNumber,10000);

            ctrl.setDataCounter(abstract,abstractNumber,10000);
        });
    };

    ctrl.load = function (para) {
        ctrl.rendering();
    };


    /**
     @method HandleCookieData 处理获取的cookie数据
     */
    ctrl.HandleCookieData = function(name1,name2){
        var data ='';
        if(name1 && name2){
            data = name1 +'\r\n'+ name2;
        }else if(name1 && !name2){
            data = name1;
        }else if(!name1 && name2){
            data = name2;
        }
        return data;
    };

    /**
     @method getCookie 获取cookie
     */
    ctrl.getCookie = function(name){
        var aCookie = document.cookie.split("; ");
        for (var i=0; i < aCookie.length; i++)
        {
            var aCrumb = aCookie[i].split("=");
            if (name == aCrumb[0])
                return unescape(aCrumb[1]);
        }
        return null;
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
     @method getArea 获取国际区号
     */
    ctrl.getArea = function(){
        var rfq = ctrl.view.el.find(".js-addRFQ");
        rfq.find("#phone").intlTelInput({
            preferredCountries: ["cn"],
            utilsScript: "js/lib/utils.js"
        });

        rfq.find("#phone").on("countrychange", function(e, countryData) {
            rfq.find('.js-dialCode').text('+' + countryData.dialCode);
            ctrl.countryName = countryData.name;
            if (countryData.dialCode == 259) {
                var flag = rfq.find('.selected-flag .iti-flag-add');
                flag.removeClass('iti-flag');
            }
            if (countryData.dialCode == '' || countryData.dialCode == undefined) {
                rfq.find('.js-dialCode').text('');
            }
        });
    };

    /**
     @method setDataCounter 数据回填计算字数
     @param elem {input} 添加事件的元素
     @param eleNum {string} 显示计数的元素
     @param number {number} 最大显示的数字，计数超过时可做些操作
     */
    ctrl.setDataCounter = function (elem,eleNum,number) {
        var length = $(elem).val().length;
        $(eleNum).html(length);
        length >= number ? $(eleNum).addClass('redFont') : $(eleNum).removeClass('redFont');
    };

    /**
     @method counter 计算输入的字数
     @param elem {input} 添加事件的元素
     @param eleNum {string} 显示计数的元素
     @param number {number} 最大显示的数字，计数超过时可做些操作
     */
    ctrl.counter = function (elem,eleNum,number) {
        $(elem).on('keydown keyup change', function() {
            ctrl.setDataCounter(elem,eleNum,number);
        });
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
    ctrl.datetimeInit = function (data) {
        $.datetimepicker.setLocale('en');
        $('.datetimepicker').datetimepicker({
            //value:'2015/04/15 05:03',
            dayOfWeekStart : 1,
            lang:'en',
            format:"Y-m-d H:i",
            disabledDates:['1986/01/08','1986/01/09','1986/01/10']
            //startDate:	'1986/01/05'
        });
        data.postTime ? $($('.datetimepicker')[0]).val(data.postTime):$($('.datetimepicker')[0]).val(ctrl.getDatetime());
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
     @method formValidate 表单数据校验
     */
    ctrl.formValidate = function(){
        ctrl.validate = {
            rules: {
                productName: {
                    required: true
                },
                details: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                },
                postTime:{
                    required: true
                },
                inputSource: {
                    required: true
                }
            },
            messages: {
                productName: {
                    required: "Please enter the product name"
                },
                details: {
                    required: "Please enter detailed product description"
                },
                email: {
                    required: "Please enter your Email",
                    email: "Please enter a valid Email address"
                },
                postTime: {
                    required: "Please enter the Post Time"
                },
                inputSource : {
                    required: "Please select a source"
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
        X.router.back();
    };

    /**
     @method formSubmit 表单数据提交
     */
    ctrl.formSubmit = function(){
        if(ctrl.view.el.find(".js-addForm").valid()){
            var data = ctrl.vmaddRFQ.collectData();
            var dialCode = ctrl.view.el.find(".js-addRFQ").find('.js-dialCode').text();
            data.phone ? data.phone = dialCode + '-' + data.phone : data.phone = dialCode;
            data.destination = (ctrl.countryName || "China (中国)");
            data.postTime = data.postTime +":00";

            var callback = function(result){
                if (result.statusCode ===  X.constructor.prototype.constant.statusCode.SUCCESS){
                    X.router.back();
                }
            };

            inquiryModel.addRFQ(data,callback);
        }
    };

    ctrl.addEvent("click", ".js-cancel", "cancel");
    ctrl.addEvent("click", ".js-addButton", "formSubmit");

    return ctrl;

});
