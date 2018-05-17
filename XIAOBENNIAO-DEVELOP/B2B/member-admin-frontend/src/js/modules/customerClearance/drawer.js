X.define("modules.customerClearance.drawer",["modules.common.routerHelper","model.drawerModel","data.addressData","adapter.webuploader","adapter.jqthumb","common.layer"],function (routerHelper,drawerModel,addressData,webuploader,jqthumb,layer) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.customerClearance.tpl.drawer
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function (para) {

        //自定义属性
        $.addTemplateFormatter({

            addressProvinceFormat: function (value, template) {
                if (value != "") {
                    return addressData.getPro(value);
                }
            },
            addressCityFormat: function (value, template) {
                if (value != "") {
                    return addressData.getCity(value);
                }
            },
            addressDistrictFormat: function (value, template) {
                if (value != "") {
                    return addressData.getDistrict(value);
                }
            },
            exportRightFormat: function(value, template){
                if (value && value<2) {
                    return value == 0 ? "有":"无";
                }
            },
            vatRatesFormat: function(value, template){
                if (value && 0<value<3) {
                    return value == 1 ? "13%":"17%";
                }
            }
        });

        drawerModel.getById(para["exportDrawerId"],function(data){
            return view.render(data, function () {

                ctrl.para = para;

                var showName = ctrl.view.el.find(".js-drawer").find(".js-showName");
                if(data.exportRight && data.exportRight <2){
                    data.exportRight == 0 ? showName.html("海关注册登记编码 ：") : showName.html('组织机构代码 ：');
                }

                X.controls.getControl("ProgressBar", view.el.find(".progress-wrap"), {
                    progressContent: ["1", "2", "3"],
                    progressContentInfo: ["提交审核", "审核中", "审核通过"],
                    allSteps: 3,
                    nowStep: Number(data.drawerStatus) > 1 ?  3: Number(data.drawerStatus) + 1
                });

                var auditResult = ctrl.view.el.find(".js-drawer").find(".js-auditResult");
                var auditStatusResult = ctrl.view.el.find(".js-drawer").find(".progress-wrap").find("ul").children("li:last").find("p");

                var auditButton = ctrl.view.el.find(".js-drawer").find(".js-auditButton");
                var imgIcon = ctrl.view.el.find(".js-drawer").find(".js-imgIcon");
                //状态为1即待审核时，审核一系列按钮显示
                //为2即资料待完善时，提交审核按钮显示，其它上传图片按钮显示
                switch (Number(data.drawerStatus)) {
                    case 1:
                        auditButton.removeClass("none");
                        auditResult.html("审核中");
                        imgIcon.css("color","#f20000");
                        break;
                    case 2:
                        auditResult.html("资料待完善");
                        auditStatusResult.html("资料待完善");
                        imgIcon.css("color","#f20000");
                        break;
                    case 3:
                        auditResult.html("审核通过");
                        imgIcon.removeClass("icon-gantanhao").addClass("icon-duigouBG");
                        break;
                    case 4:
                        auditResult.html("临时审核通过");
                        auditStatusResult.html("临时审核通过");
                        imgIcon.removeClass("icon-gantanhao").addClass("icon-duigouBG");
                        break;
                    case 5:
                        auditResult.html("审核拒绝");
                        auditStatusResult.html("审核拒绝");
                        imgIcon.css("color","#f20000");
                        break;
                }


                //判断是否返回数据otherAttachment是否有内容
                if(data.exportDrawerAttributeList.length >0) {
                    var parent = ctrl.view.el.find(".js-drawer").find(".js-wrapContent")
                    $.each(data.exportDrawerAttributeList, function (i,item) {
                        var html = '<p class="mb30"><span class="disib w160 tar">'+ item.label +'</span>：<span>'+ item.value +'</span></p>';
                        $(parent).append(html);
                    })
                }

                //判断其它有数据时再显示
                 var otherImg = ctrl.view.el.find(".js-drawer").find(".js-otherImg");
                data.otherAttachment.filePath ?  '' : otherImg.remove();

                //开票人补充证件照展示
                if(data.exportDrawerAuxiliaryAttachmentList.length > 0){
                    var templateWrap = ctrl.view.el.find(".js-drawer").find(".js-templateWrap");
                    templateWrap.loadTemplate($(".js-license-item-tpl"), data.exportDrawerAuxiliaryAttachmentList, {
                        success: function () {},append:true
                    });
                }

                //设置缩略图
                var setThumbnailWrap = ctrl.view.el.find(".js-attachmentInfo");
                ctrl.uploadSuccess("",setThumbnailWrap);


                //操作记录
                var header ={
                    "tabAll" :[
                        {
                            field:{
                                name:"nameCn",
                                title:"产品名称",
                                type:"string"
                            },
                            width:"210px",
                            className:"tL"
                        },
                        {
                            field:{
                                name:"nameEn",
                                title:"产品英文名称",
                                type:"string"
                            },
                            width:"210px",
                            className:"tL"
                        },
                        {
                            field:{
                                name: "hsCode",
                                title:"HSCode",
                                type:"string"
                            },
                            width:"210px"
                        },
                        {
                            field:{
                                name: "model",
                                title:"型号",
                                type:"string"
                            },
                            width:"210px"
                        },
                        {
                            field:{
                                name: "brand",
                                title:"品牌",
                                type:"string"
                            },
                            width:"210px"
                        },
                        {
                            field:{
                                name: "texture",
                                title:"材质",
                                type:"string"
                            },
                            width:"210px"
                        },
                        {
                            field:{
                                name: "usage",
                                title:"用途",
                                type:"string"
                            },
                            width:"210px"
                        }
                    ]
                };

                var schemas = {
                    "tabAll" :{
                        searchMeta: {
                            schema: {
                                simple:[
                                ]
                            },
                            search: {
                                onSearch : function (data) {
                                    return data;
                                }
                            },
                            reset :{
                                show:false
                            }
                        },
                        gridMeta :{
                            columns : header["tabAll"],
                            orderMode : 1,
                            primaryKey:"bidId",
                            orderMode : 1,
                            afterRowRender: function (row, data) {
                            }
                        },
                        pageInfo : {
                            pageSize : '10',
                            totalPages : '10',
                            pageNo: '1',
                            smallPapogation: {
                                isShow: false,
                                elem: '.js_small_papogation1'
                            }
                        },
                        //url : X.config.customerClearance.api.getExportFormId
                    }
                };

                var lists = {};
                var activeTabLiInfo;
                function initTabPage($elem,schema,tabPage) {
                    var list = X.controls.getControl("DataGrid", $elem[0], schema.gridMeta);
                    list.init();
                    list.loadData(data.productList);
                }
                ctrl.initPage = function (){
                    var tabPannel = X.controls.getControl("TabPanel",$('.js_tabPannel1'), {
                        activeTabInfo: activeTabLiInfo,
                        beforeChangeTab: function (tabLiInfo, targetLi, index, tabPage) {
                            activeTabLiInfo = tabLiInfo;
                            // 刊登状态 不同
                            var page = $(tabPage);
                            if(!page.data("hasInited")){
                                var schema = schemas[tabLiInfo];
                                if(schema){
                                    initTabPage(page,schema,tabLiInfo);
                                }
                                page.data("hasInited",true);
                            }
                            // 为了样式效果，把当前选中的前一个加上样式名
                            targetLi.prev().removeClass('tab_lineNone');
                            return true;
                        },
                        afterChangeTab: function (tabLiInfo, targetLi, index, tabPage) {
                            activeTabLiInfo = tabLiInfo;
                            activeTabLi = targetLi;
                            // 为了样式效果，把当前选中的前一个加上样式名
                            targetLi.prev().addClass('tab_lineNone');
                        }
                    });
                };
                ctrl.initPage();

                var drawerDetailTable = ctrl.view.el.find(".js-drawer").find(".js-drawerDetailTable").find("tbody");
                drawerDetailTable.find("tr").length > 5 ? drawerDetailTable.css("height","246px") : '';

                ctrl.addEvent("click",".js-auditThrough","auditThrough");
                ctrl.addEvent("click",".js-auditReject","auditReject");
                ctrl.addEvent("click",".js-temporaryThrough","temporaryThrough");
                ctrl.addEvent("click",".js-bePerfect","bePerfect");
            })
        })
    }


    /**
     @method timeOutFun 定时器函数
     */
    ctrl.timeOutFun = function (time) {
        var timer = setTimeout(function(){
            X.router.back();
            clearTimeout(timer);
        }, time)
    };

    /**
     @method layerContent 弹窗函数
     */
    ctrl.layerContent = function () {
        var opt = {
            title:"提示",
            content: '<div style="padding:30px  60px;font-size:20px;">提交成功</div>',
            btn: [],
            closeBtn: 0,
            time:3000,
            callback:function (){
                ctrl.timeOutFun(3000);
            }
        };
        layer.layerOpen(opt);
    };


    /**
     @method auditThrough 点击审核通过按钮事件
     */
    ctrl.auditThrough = function () {
        var data = {
            exportDrawerId:ctrl.para["exportDrawerId"]
        };
        var callback = function (result) {
            if(result.statusCode == X.constructor.prototype.constant.statusCode.SUCCESS){
                ctrl.layerContent();
            }else{
                layer.sMsg(result.message, function (){
                    layer.closeAll();
                },"","","",0)
            }
        };
        drawerModel.putAuditThrough(data,callback);
    };

    /**
     @method auditReject 点击审核拒绝按钮事件
     */
    ctrl.auditReject = function () {
        var data = {
            exportDrawerId:ctrl.para["exportDrawerId"]
        };
        var callback = function (result) {
            if(result.statusCode == X.constructor.prototype.constant.statusCode.SUCCESS){
                ctrl.layerContent();
            }else{
                layer.sMsg(result.message, function (){
                    layer.closeAll();
                },"","","",0)
            }
        };
        drawerModel.putAuditReject(data,callback);
    };

    /**
     @method temporaryThrough 点击临时审核通过按钮事件
     */
    ctrl.temporaryThrough = function () {
        var data = {
            exportDrawerId:ctrl.para["exportDrawerId"]
        };
        var callback = function (result) {
            if(result.statusCode == X.constructor.prototype.constant.statusCode.SUCCESS){
                ctrl.layerContent();
            }else{
                layer.sMsg(result.message, function (){
                    layer.closeAll();
                },"","","",0)
            }
        };
        drawerModel.putTemporaryThrough(data,callback);
    };


    /**
     @method bePerfect 点击资料待审核按钮事件
     */
    ctrl.bePerfect = function () {
        var content = ctrl.view.el.find(".js-drawer").find(".js-bombBox");
        var opt = {
            title:"资料待完善",
            area: ["700px","600px"],
            content:content,
            btn:['确定','取消'],
            yes:function(){
                ctrl.callback();
            }
        };
        layer.layerOpen(opt);
    };

    /**
     @method callback 资料待审核弹窗点击确定回调事件
     */
    ctrl.callback = function () {
        if(ctrl.basicInfoCallback().length > 0 || ctrl.imgInfoCallback().length >0){
            layer.closeAll();
            var data = {
                exportDrawerAttributeList: ctrl.basicInfoCallback(),
                exportDrawerAuxiliaryAttachmentList: ctrl.imgInfoCallback(),
                exportDrawerId:ctrl.para["exportDrawerId"],
                drawerStatus:"2"
            };
            var callback = function () {
                ctrl.layerContent();
            };
            drawerModel.postBePerfect(data,callback);
        }else{
            layer.sMsg("至少选择一项", function (index){
                layer.closeIt(index);
            })
        }
    };

    /**
     @method basicInfoCallback 资料待审核弹窗点击确定判断基本信息
     */
    ctrl.basicInfoCallback = function () {
        var basicInput = $(".js-basicInfo").find("input[type=text]");
        var basicInputList = [];
        if(basicInput.length > 0){
            $.each(basicInput, function (i, item){
                var val = $(item).val();
                val ? basicInputList.push({label:$(item).val()}) : '';
            });
        }
        return basicInputList;
    };

    /**
     @method imgInfoCallback 资料待审核弹窗点击确定判断证照信息
     */
    ctrl.imgInfoCallback = function () {
        var basicInput = $(".js-imgInfo").find("input[type=text]");
        var basicCheck = $(".js-imgInfo").find("input[type=checkbox]");
        var basicInputList = [];
        if(basicInput.length > 0){
            $.each(basicInput, function (i, item){
                var val = $(item).val();
                val ? basicInputList.push({label:$(item).val()}) : '';
            });
        }
        if(basicCheck.length > 0){
            $.each(basicCheck, function (i, item){
                if($(item).val() !== "0" && $(item).attr("checked")){
                    basicInputList.push({label:$(item).val()});
                }
            });
        }
        return basicInputList;
    };

    /**
     @method uploadSuccess 上传成功设置缩略图
     @param result{string} 获取上传的图片
     @param elem {string} 范围内图片设置缩略图
     */
    ctrl.uploadSuccess = function (result,elem) {
        elem.find('img').jqthumb(
          {
              width: 145,
              height: 145,
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
                      layer.layerOpen(opt);
                  });
              }
          }
        );
    };


    ctrl.load = function (para) {

        ctrl.rendering(para);

    };

    return ctrl;


});