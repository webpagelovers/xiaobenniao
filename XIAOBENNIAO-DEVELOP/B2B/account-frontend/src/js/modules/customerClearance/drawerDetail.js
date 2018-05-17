X.define("modules.customerClearance.drawerDetail", ["model.customerClearanceModel","data.currencyEntireData","adapter.jqthumb","common.layer", "model.declareProductModel", "adapter.webuploader"],function (customerClearanceModel,currencyEntireData,jqthumb,layer1,declareProductModel,webuploader) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.customerClearance.tpl.drawerDetail
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.load = function (para) {
        customerClearanceModel.getDrawerById(para["drawerId"], function (result) {
            if(result.statusCode == X.constructor.prototype.CONSTANTS.statusCode.SUCCESS) {
                return view.render(result.data.data[0], function () {
                    var data = result.data.data[0];
                    X.controls.getControl("ProgressBar", view.el.find(".progress-wrap"), ctrl.getProgressData(Number(data.status)));
                    var status = customerClearanceModel.CONSTANTS.drawerStatus[data.status];
                    ctrl.view.el.find('.js-status').html(status);
                    ctrl.view.el.find('.js-identified-time').html(data.identifiedTime.split(' ')[0]);
                    var index = data.drawerAddress.lastIndexOf(' ');
                    var drawerAddress = data.drawerAddress.slice(0, index) + '<br>' + data.drawerAddress.slice(index + 1) ;
                    ctrl.view.el.find('.js-drawer-address').html(drawerAddress);
                    var commodityAttachmentList = data.commodityAttachmentList;
                    var wrapImg = ctrl.view.el.find(".js-historyAttachment");
                    $.each(commodityAttachmentList, function (i, item) {
                        var imgHost  = X.constructor.prototype.config.PATH_FILE.path.imageStoreUrl,
                          imageUrl = item.filePath.indexOf(imgHost) > -1? item.filePath: (imgHost + item.filePath);
                        var a = '<div class="wrapUpload disib"><img src="'+imageUrl+'"/><p class="mt10 tac contract-word-cut">'+item.fileName+'</p></div>';
                        $(wrapImg).append(a);
                    });
                    if (data.status === '6') {
                        ctrl.view.el.find('.js-warning').show();
                    } else if (data.status === '3') {
                        ctrl.completeInformation(data.completeInformation, data.completeAttachment);
                        ctrl.view.el.find('.js-submit').show();
                        ctrl.view.el.find('.js-submit').click(ctrl.submit);
                    }
                    ctrl.view.el.find(".js-drawerBaseInfo>div:last").removeClass('mb30');
                    var setThumbnailWrap = ctrl.view.el.find(".js-historyAttachment");
                    ctrl.setThumbnail(setThumbnailWrap);
                    ctrl.initPage();
                    lists["tabAll"].grid.loadData(result.data.productList)
                    if (result.data.productList.length > 5) {
                        ctrl.view.el.find(".drawerDetailTable tbody tr").each(function(){
                            $(this).children("td:last").find('p').attr("style","width:105px!important;");
                        });
                        ctrl.view.el.find(".drawerDetailTable thead th:last").attr("style", "padding-right:20px;");
                    }
                });
            }
        });
    };

    ctrl.getProgressData = function (status) {
        var obj = {};
        switch (status) {
            case 3:
                obj = {
                    progressContent: ["1", "2", "3"],
                    progressContentInfo: ["提交审核", "审核中", "资料待完善"],
                    allSteps: 3,
                    nowStep: 3
                };
                break;
            case 4:
                obj = {
                    progressContent: ["1", "2", "3"],
                    progressContentInfo: ["提交审核", "审核中", "审核通过"],
                    allSteps: 3,
                    nowStep: 3
                };
                break;
            case 5:
                obj = {
                    progressContent: ["1", "2", "3"],
                    progressContentInfo: ["提交审核", "审核中", "临时审核通过"],
                    allSteps: 3,
                    nowStep: 3
                };
                break;
            case 6:
                obj = {
                    progressContent: ["1", "2", "3"],
                    progressContentInfo: ["提交审核", "审核中", "审核拒绝"],
                    allSteps: 3,
                    nowStep: 3
                };
                break;
        }
        return obj;
    };

    /**
     @method setThumbnail 设置缩略图
     @param elem {string} 范围内图片设置缩略图
     */
    ctrl.setThumbnail = function (elem) {
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

    var header = (function () {
        return {
            "tabAll" :  [
                {
                    field:{
                        name:"nameCn",
                        title:"产品名称",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data) {
                            return '<p class="contract-word-cut" title="' + data.nameCn + '">' + data.nameCn + '</p>'
                        }
                    },
                    width:"136px",
                    className:"tL"
                },
                {
                    field: {
                        name: "nameEn",
                        title: "产品英文名称",
                        type: "string"
                    },
                    itemRenderer: {
                        render: function (data) {
                            return '<p class="contract-word-cut" title="' + data.nameEn + '">' + data.nameEn + '</p>'
                        }
                    },
                    width: "135px"
                },
                {
                    field:{
                        name:"HSCode",
                        title:"HSCode",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data) {
                            return '<p class="contract-word-cut" title="' + data.hsCode + '">' + data.hsCode + '</p>'
                        }
                    },
                    width:"135px"
                },
                {
                    field:{
                        name:"model",
                        title:"型号",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data) {
                            return '<p class="contract-word-cut" title="' + data.model + '">' + data.model + '</p>'
                        }
                    },
                    width:"135px"
                },
                {
                    field: {
                        name: "brand",
                        title: "品牌",
                        type: "string"
                    },
                    itemRenderer: {
                        render: function (data) {
                            return '<p class="contract-word-cut" title="' + data.brand + '">' + data.brand + '</p>'
                        }
                    },
                    width: "135px"
                },
                {
                    field: {
                        name: "status",
                        title: "状态",
                        type: "string"
                    },
                    itemRenderer: {
                        render: function (data) {
                            return '<p>' + declareProductModel.constants.status[data.status].value + '</p>';
                        }
                    },
                    width: "135px"
                },
            ]
        }
    })();

    var schemas = (function(){
        var schemas = {
            "tabAll" :{
                searchMeta: {
                    schema: {
                        simple:[
                            {
                                name:"tagKeyword",
                                inputName: "formNumber",
                                title:"关键字查询",
                                ctrlType:"TextBox",
                                placeholder:"请输入关键字",
                                className : "mr60"
                            },
                            {
                                name:"commodityNumber",
                                inputName: "formNumber",
                                title:"商品编号",
                                ctrlType:"TextBox",
                                placeholder:"请输入商品编号",
                                className : "mr60"
                            },
                        ]
                    },
                    search: {
                        onSearch : function (data) {
                            return data;
                        }
                    },
                    reset :{
                        show:false
                    },
                    selector: "tabAll",
                },
                gridMeta :{
                    columns : header["tabAll"],
                    afterRowRender: function (row, data) {
                        $(row.dom).find('.js-detail').on("click", function (event) {
                            X.publish(X.CONSTANTS.channel.menuCall, {m: "commodityManage.commodityDetail", para: {commodityId: data["commodityId"]}});
                        });
                        $(row.dom).find('.js-edit').on("click", function (event) {
                            X.publish(X.CONSTANTS.channel.menuCall, {m: "commodityManage.addCommodity", para: {commodityId: data["commodityId"],commodityStatus: data["commodityStatus"]}});
                        });
                    },
                    afterTableRender: function () {
                        ctrl.view.el.find("input[type=checkbox]:first").attr("checked", false);
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
                //type: "GET",
                //url : X.config.customerClearance.api.declareProductList
            }
        };
        return schemas;
    })();

    var lists = {};
    var activeTabLiInfo = 'tabAll';

    /**
     @method initTabPage 初始化Tab页面    */
    function initTabPage($elem,schema,tabPage) {
        var list = X.controls.getControl("List",$elem,schema);
        list.init();
        lists[tabPage] = list;
    }

    /**
     @method initPage 初始化页面
     */
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
            afterChangeTab: function (tabLiInfo, targetLi, index, tabPage, oldTab) {
                activeTabLiInfo = tabLiInfo;
                activeTabLi = targetLi;
                // 为了样式效果，把当前选中的前一个加上样式名
                targetLi.prev().addClass('tab_lineNone');
                if(tabLiInfo != oldTab){
                    route.setRoute({panel:tabLiInfo});
                }
            }
        });
    };

    ctrl.completeInformation = function (completeInformation, completeAttachment) {
        var temp = '';
        for (var i = 0, len = completeInformation.length; i < len; i++) {
            temp += '<div class="mb30"><label class="tar w155 disib col66"><i class="redFont"> * </i>' + completeInformation[i].label + '：</label>' +
                '<input type="text" name="' + completeInformation[i].field + '" data-property-name="' + completeInformation[i].field + '" data-control-type="TextBox"  class="default_input" >' +
                '<span class="js-error"></span></div>';
        }
        ctrl.view.el.find(".js-drawerBaseInfo").append(temp);

        var helper = function (i, completeInformation) {
          return function (e) {
              if (this.value === '') {
                  if(!$(this).parent().find(".js-error").html()){
                      var temp = $('<label for="title" generated="true" class="error ml10 mt5">' + completeInformation[i].label + '不能为空</label>');
                      temp.appendTo($(this).parent().find(".js-error"));
                  }
              }
          };
        };

        for (var i = 0, len = completeInformation.length; i < len; i++) {
            ctrl.view.el.find(".js-drawerBaseInfo [name='" + completeInformation[i].field + "']").blur(helper(i, completeInformation));
        }

        var temp2 = '';
        var meta = {};

        for (var i = 0, len = completeAttachment.length; i < len; i++) {
            temp2 += '<div data-property-name="drawerAttachment' + i + '" data-control-type="Upload" class="disib por h120 js-uploadBoxBig">' +
                '<div class="queueList disib h120 uploadBoxBig">' +
                '<div class="filePicker w120 h120 ti8 disib add-filebgBig filePickera' + i + '" '+ ' style="width:120px"></div>' +
                '</div>' +
                '<div class="js-wrapUploadData w120 h120"></div>' +
                '<p class="mt40"><label class="js-error redFont js-attachError poa t5 l125"></label></p>' +
                '</div>';
            meta['drawerAttachment' + i] = {singleSize: 2,type:14,maxNum:20,cancel:true,filePicker:'.filePickera' + i,filePickerLabel:"添加 上传图片",uploadSuccess: ctrl.uploadSuccess,cancel:ctrl.cancel};
        }
        ctrl.view.el.find(".js-historyAttachment").append(temp2);

        ctrl.viewModel = ctrl.getViewModel(ctrl.view.el.find(".js-drawerDetail"),{
            meta: meta});
        ctrl.viewModel.initControl();
        // var uploadBoxBig = ctrl.view.el.find(".js-uploadBoxBig");
        // //var temp2 = uploadBoxBig.clone();
        // ctrl.view.el.find(".js-historyAttachment").append(uploadBoxBig);
        // ctrl.view.el.find(".js-historyAttachment").append(uploadBoxBig.clone());
    };

    ctrl.uploadSuccess = function (index) {
        ctrl.view.el.find(".js-wrapUploadData").attr('style', 'position:absolute;top:0px;;z-index:100');
        ctrl.view.el.find(".js-wrapUploadData img").attr('style', 'width:122px;height:122px;background-color:white');
        ctrl.view.el.find(".js-wrapUploadData .cancel").attr('style', 'right:-9px');
        ctrl.view.el.find(".js-wrapUploadData .contract-word-cut").text('进项发票');
        var temp = ctrl.view.el.find(".js-wrapUploadData");
        for (var i = 0, len = temp.length; i < len; i++) {
            if ($(temp[i]).find("img").length === 0) {
                $(temp[i]).attr('style', 'display:none');
            }
        }
    };

    ctrl.cancel = function (index) {
        //ctrl.view.el.find(".js-wrapUploadData").attr('style', 'display:none');
        var temp = ctrl.view.el.find(".js-wrapUploadData");
        for (var i = 0, len = temp.length; i < len; i++) {
            if ($(temp[i]).find("img").length === 0) {
                $(temp[i]).attr('style', 'display:none');
            }
        }
    };

    ctrl.submit = function () {

    };

    return ctrl;
});