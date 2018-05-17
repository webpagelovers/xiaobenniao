X.define("modules.commodityManage.addCommodity", ["model.commodityManageModel","data.currencyEntireData","adapter.webuploader","adapter.jqthumb","adapter.ueditor","common.layer"],function (commodityManageModel,currencyEntireData,webuploader,jqthumb,ueditor,layer1) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.commodityManage.tpl.addCommodity
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {

        if(_para["commodityId"]){
            var callback = function(data){
                data = data.data[0] || {};
                ctrl.init(data);
            };

            ctrl.getData(callback);
        }else{
            ctrl.init({});
        }
    };

    /**
     @method init 渲染页面
     @param data{Object} 获取的商品信息
     @return view.render {function} 页面渲染函数
     */
    ctrl.init = function (data) {
        return view.render(data,function () {

            //图片数据字段转换
            if(data.commodityAttachmentList){
                var arr = [];
                $.each(data.commodityAttachmentList,function(i,item){
                    arr.push({url:item.filePath,filename :item.fileName});
                });
                data.commodityAttachmentList = arr;
            }

            if(data.tagKeyword){
                var dataTag = data.tagKeyword.split(",");
                data.tagKeyword = dataTag[0];
                data.tagKeyword1 = dataTag[1];
                data.tagKeyword2 = dataTag[2];
            }

            ctrl.viewModel = ctrl.getViewModel(ctrl.view.el.find(".js-addCommodity"),{meta: {"currency":{dataSource:currencyEntireData.source,
                selectedChanged: function (item) {
                    var receiveTypeInput = ctrl.view.el.find("input[name=currency]");
                    receiveTypeInput.val(item.key);
                    var currencyError = ctrl.view.el.find(".js-currencyError");
                    if(receiveTypeInput.val() && currencyError.html()){
                        currencyError.html("");
                    }
                }},"commodityAttachmentList":{singleSize: 2,type:14,maxNum:20,cancel:true,filePicker:".filePicker",filePickerLabel:"上传附件",uploadSuccess:ctrl.uploadSuccess,setValue:ctrl.uploadSuccess}},data:data});
            ctrl.viewModel.initControl();
            ctrl.editorId = 'modules-commodityManage-addCommodity-editor';
            UE.delEditor(ctrl.editorId);
            ctrl.editor = UE.getEditor(ctrl.editorId,{maximumWords:1500});
            ctrl.editor.on('wordcountoverflow',function(){
                var content = ctrl.editor.getContentTxt();
                ctrl.editor.setContent(content.substring(0,1500));
                ctrl.editor.focus(true);
            });

            if(data.commodityDescription){
                ctrl.editor.ready(function(){
                    ctrl.editor.setContent(data.commodityDescription);
                });
            }

            //上架状态下没有保存按钮
            if(_para["commodityStatus"] && _para["commodityStatus"] == 1){
                ctrl.view.el.find(".js-save").css("display","none")
            }

            //富文本编辑器添加监听，鼠标离开给input设置value
            ctrl.editor.addListener("blur",function(){
                var arr =UE.getEditor(ctrl.editorId).getContentTxt();
                var error = ctrl.view.el.find(".js-editorError");
                var hiddenInput = ctrl.view.el.find("input[name=commodityDescription]");
                if(!arr.length){
                    error.html("请输入产品描述");
                    hiddenInput.attr("value","");
                }else{
                    hiddenInput.attr("value",arr);
                    error.html("");
                }
            });

            ctrl.watchImg();

            ctrl.dataValidate();

        });
    };

    /**
     @method dataValidate 表单校验
     */
    ctrl.dataValidate = function () {
        var validate = {
            rules: {
                title : {required: true,maxlength:250},
                tagKeyword : {required : true,maxlength:20},
                tagKeyword1 : {maxlength:20},
                tagKeyword2 : {maxlength:20},
                specificationsAndModels : {required : true,maxlength:20},
                hscode : {maxlength:10,isDigits: true},
                price : {required : true,isFloat:true,isNumberFloat2: true,maxPrice:true},
                currency : {required : true},
                port : {required : true,maxlength:50},
                priceClause : {maxlength:50},
                commodityDescription : {required : true},
                texture : {maxlength:20},
                size : {maxlength:20},
                peculiarity : {maxlength:20},
                weight : {maxlength:20},
                colour : {maxlength:20}
            },
            messages: {
                title: {required: "请填写商品标题",maxlength: "标题最大长度为250个字符"},
                tagKeyword : {required : "请填写标签/关键词",maxlength : "标签最大长度为20个字符"},
                tagKeyword1 : {maxlength : "标签最大长度为20个字符"},
                tagKeyword2 : {maxlength : "标签最大长度为20个字符"},
                specificationsAndModels : {required : "请填写规格型号",maxlength : "规格型号最大长度为20个字符"},
                hscode : {maxlength : "HScode最大长度为10个字符",isDigits: "请输入正确的HScode"},
                price : {required : "请填写价格",maxPrice : "价格最大金额为9999999999.99",isNumberFloat2: "请输入正确的价格,小数点后面保留2位",isFloat:"请输入正确的价格"},
                currency : {required : "请选择币种"},
                port : {required : "请填写港口",maxlength : "港口最大长度为50个字符"},
                priceClause : {maxlength : "价格条款最大长度为10个字符"},
                commodityDescription : {required : "请填写产品描述"},
                texture : {maxlength : "最大长度为20个字符"},
                size : {maxlength : "最大长度为20个字符"},
                peculiarity : {maxlength : "最大长度为20个字符"},
                weight : {maxlength : "最大长度为20个字符"},
                colour : {maxlength : "最大长度为20个字符"}
            },
            onkeyup: false,
            onfocusout: function (element) {
                var elem = $(element);
                elem.valid();
            },
            errorPlacement: function (error, element) {
                if(!element.parent().find(".js-error").html()){
                    error.appendTo(element.parent().find(".js-error"));
                }
            }
        };
        ctrl.view.el.find(".js-addCommodity").validate(validate);
    };

    /**
     @method uploadSuccess 上传成功设置缩略图
     @param result{string} 获取上传的图片
     @param elem {string} 范围内图片设置缩略图
     */
    ctrl.uploadSuccess = function (result,elem) {
        elem.find('img').jqthumb(
            {
                width: 100,
                height: 100,
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
                                    layer.closeAll();
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
     @method getData 获取商品数据
     @param callback {function} 获取数据成功时的回调函数
     */
    ctrl.getData = function(callback){
        commodityManageModel.getCommodity(_para["commodityId"],callback);
    };

    /**
     @method collectData 收集表单数据
     @param type {string} 提交类型，发布或保存
     @return data {Object} 提交数据
     */
    ctrl.collectData = function(type){
        var data = ctrl.viewModel.collectData();

        if(data.tagKeyword1 && data.tagKeyword2){
            data.tagKeyword = data.tagKeyword +','+ data.tagKeyword1 +','+ data.tagKeyword2;
        }else if(data.tagKeyword1){
            data.tagKeyword = data.tagKeyword +','+ data.tagKeyword1;
        }else if(data.tagKeyword2){
            data.tagKeyword = data.tagKeyword +','+ data.tagKeyword2;
        }
        delete data.tagKeyword1;
        delete data.tagKeyword2;

        var arr = [];
        //上传图片字段名称转换
        $.each(data.commodityAttachmentList,function(i,item){
            var imagesUrl = item.url.split(".com/");
            arr.push({filePath:imagesUrl[1],fileName :item.filename});
        });
        data.commodityAttachmentList = arr;
        data.commodityDescription = UE.getEditor(ctrl.editorId).getContentTxt();
        data.commodityStatus  = type;
        return data;
    };

    /**
     @method watchImg 监听上传图片的数量
     */
    ctrl.watchImg = function(){
        var wrapData = ctrl.view.el.find(".js-wrapUploadData");
        var wrapError = wrapData.find(".js-attachError");
        if(wrapError.html()){
            if(ctrl.viewModel.getValue("commodityAttachmentList").length >= 3){
                wrapError.html("");
            }
        }
    };


    /**
     @method send 发布商品
     */
    ctrl.send = function(){
        if(ctrl.view.el.find(".js-addCommodity").valid()){
            var data =ctrl.collectData("1");
            //判断上传图片是否大于3张
            if(data.commodityAttachmentList.length >= 3){
                ctrl.callback("确认发布？", data, "提示","发布成功");
            }else{
                var error = '<label class="error redFont">最少上传3张图片</label>';
                $(error).appendTo(ctrl.view.el.find(".js-attachError"));
            }
        }
    };

    /**
     @method save 保存商品
     */
    ctrl.save = function(){
        if(ctrl.view.el.find(".js-addCommodity").valid()){
            var data =ctrl.collectData("0");
            //判断上传图片是否大于3张
            if(data.commodityAttachmentList.length >= 3){
                ctrl.callback("确认保存？" ,data, "提示", "保存成功");
            }else{
                var error = '<label class="error redFont">最少上传3张图片</label>';
                $(error).appendTo(ctrl.view.el.find(".js-attachError"));
            }
        }
    };

    /**
     @method submit 提交商品信息
     */
    ctrl.submit = function(data, callback){
        if(_para["commodityId"]){
            data.commodityId = _para["commodityId"];
            commodityManageModel.putCommodity(data,callback);
        }else{
            commodityManageModel.postCommodity(data,callback);
        }
    };

    /**
     @method callback 提交商品信息回调函数
     @param mes{string} 弹出框内容
     @param title{string} 弹出框title
     @param data{string} 提交数据
     */
    ctrl.callback = function(mes, data, title, successtitle){
        layer.confirm(mes, {
            title: title,
            btn: ['确定','取消'] //按钮
        }, function(){
            var submit = ctrl.view.el.find(".js-submit");
            var save = ctrl.view.el.find(".js-save");
            submit.attr("disabled",true);
            submit.addClass("bgcCc");
            save.attr("disabled",true);
            save.addClass("bgcCc");
            var callback = function(result){
                if(result.statusCode == X.constructor.prototype.CONSTANTS.statusCode.SUCCESS){
                    var submitCallback = function (){
                        layer.closeAll();
                        X.router.back();
                    };
                    layer1.successBtn(successtitle,"提示",submitCallback);
                }else{
                    submit.attr("disabled",false);
                    submit.removeClass("bgcCc");
                    save.attr("disabled",false);
                    save.removeClass("bgcCc");
                }
            };
            ctrl.submit(data,callback);
        });
    };

    //点击发布商品
    ctrl.addEvent("click",".js-submit","send");
    //点击保存商品
    ctrl.addEvent("click",".js-save","save");

    var _para;
    ctrl.load = function(para){
        para = para || {};
        _para = para ;
        ctrl.rendering();
    };


    return ctrl;

});