X.define("modules.commodityManage.commodityManageList", ["modules.common.routerHelper", "model.commodityManageModel", "data.currencyEntireData", "common.commonMethod"],
    function (routerHelper, commodityManageModel, currencyEntireData, commonMethod) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.commodityManage.tpl.commodityManageList
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {
        return view.render({},function () {
            activeTabLiInfo = route.getRoute() || activeTabLiInfo;
            ctrl.initPage();
        });
    };

    /**
     @method getRoute 路由
     */
    var getRoute = function () {
        var route = {panel:activeTabLiInfo, ldata:lists[activeTabLiInfo].val()};
        return route;
    };

    var header = (function () {
        return {
            "tabAll" :  [
                {
                    field:{
                        name:"",
                        title:"",
                        type:"int"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return '<input type="checkbox" />';
                        }
                    },
                    width:"5%"
                },
                {
                    field:{
                        name:"commodityAttachmentList",
                        title:"商品图片",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function(data) {
                            var imgHost  = X.constructor.prototype.config.PATH_FILE.path.imageStoreUrl,
                              imageUrl = data.commodityAttachmentList[0].filePath.indexOf(imgHost) > -1? data.commodityAttachmentList[0].filePath: (imgHost +'/'+data.commodityAttachmentList[0].filePath)
                            return '<img class="mt5" style="max-width:80px; max-height: 80px;" src="' + imageUrl + '">'
                        }
                    },
                    width:"13%",
                    className:"tL"
                },
                {
                    field:{
                        name: "commodityNumber",
                        title:"商品编号",
                        type:"string"
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"title",
                        title:"商品标题",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function(data) {
                            return '<p class="word-cut w160" title="' + data.title + '">'+ data.title +'</p>';
                        }
                    },
                    width:"14%"
                },
                {
                    field:{
                        name:"price",
                        title:"价格",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function(data) {
                            if(data.currency != -1) {
                                return commonMethod.formatMoney(data.price, 2, true) + ' ' + currencyEntireData.source[data.currency].value;
                            }
                        }
                    },
                    width:"13%"
                },
                {
                    field:{
                        name:"commodityStatus",
                        title:"状态",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function(data) {
                            return commodityManageModel.CONSTANTS.status[data.commodityStatus].value;
                        }
                    },
                    width:"7%"
                },
                {
                    field:{
                        name:"status",
                        title:"操作",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data) {
                            if (data.commodityStatus === '0') {
                                return '<a class="orange-font curp ml10 mr10 js-edit">编辑</a>';
                            } else if (data.commodityStatus === '1') {
                                return '<a class="orange-font curp mr10 js-detail">查看</a>|<a class="orange-font curp ml10 js-edit">编辑</a>';

                            }
                        }
                    },
                    className: "operation_main",
                    width:"10%"
                }
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
                toolbar: {
                    items: [
                        {
                            ctrlType: "ToolbarButton",
                            name: "add",
                            title: "新增商品 ",
                            icon:"icon-add",
                            className: "mr10",
                            click: function (item) {
                                X.publish(X.CONSTANTS.channel.menuCall, {m: "commodityManage.addCommodity"});
                            }
                        },
                        {
                            ctrlType: "ToolbarButton",
                            name: "remove",
                            title: "删除",
                            icon: "icon-lajitong",
                            click: function (item) {
                                var selectedRows = lists[activeTabLiInfo].toolbar.target.getSelectedRows();
                                if (selectedRows.length > 0) {
                                    var layerDelete = layer.confirm("确认删除", {
                                        title: "提示",
                                        content: "<div class='tac'>确认删除？</div>",
                                        yes: function () {
                                            layer.close(layerDelete);
                                            var commodityIds = [];
                                            for (var i = 0, len = selectedRows.length; i < len; i++) {
                                                commodityIds.push(selectedRows[i].data.commodityId);
                                            }
                                            var  temp = {};
                                            temp.commodityIds = commodityIds;
                                            commodityManageModel.deleteCommodity(temp, function (result) {
                                                ctrl.load();
                                            });
                                        }
                                    });
                                } else {
                                    layer.open({
                                        title: '提示',
                                        closeBtn: 0,
                                        content: "<div class='tac'>至少选择一个商品</div>",
                                        btn:["确定"]
                                    });
                                }
                            }
                        }
                    ]
                },
                gridMeta :{
                    columns : header["tabAll"],
                    showCheckbox : true,
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
                url : X.config.commodityManage.api.commodityManageList
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
    ctrl.initPage  =function (){
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

    /**
     @method load 加载
     */
    ctrl.load = function (para) {
        ctrl.rendering();
    };

    var route = new routerHelper("commodityManage.commodityManageList", schemas, getRoute);

    return ctrl;

});