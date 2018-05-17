X.define("modules.infoManage.infoManageList",["modules.common.routerHelper","model.infoManageModel"],function (routerHelper,infoManageModel) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.infoManage.tpl.infoManageList
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {

        return view.render({},function () {
            activeTabLiInfo = route.getRoute() || activeTabLiInfo;
            ctrl.initPage();

            view.el.find(".screen_box").children().eq(0).hide();
            view.el.find(".js-search").addClass('ml30');

            $.addTemplateFormatter({
                //
                isReadFormater: function (value, template) {
                    return infoManageModel.CONSTANTS.isRead[value].value;
                },
                createDateFormater: function (value, template) {
                    return value.split(/\s+/)[0];
                },
                dueDateFormater: function (value, template) {
                    return value.split(/\s+/)[0];
                },
                //询价类型
                infoTypeFormater: function (value, template) {
                    return infoManageModel.CONSTANTS.infoType[value].value;
                }
            });
        });

    };


    ctrl.load = function (para) {
        ctrl.rendering();
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
                        name:"title",
                        title:"公告名称",
                        type:"int"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            if(data.title.length > 20){
                                return "<span title="+ data.title +">"+ data.title.substr(0,20) +"...</span>";
                            }else{
                                return data.title
                            }
                        }
                    },
                    width:"20%"
                },
                {
                    field:{
                        name:"country",
                        title:"国别",
                        type:"int"
                    },
                    width:"15%"
                },
                {
                    field:{
                        name:"createDate",
                        title:"发布日期",
                        type:"int"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return data.createDate.split(/\s+/)[0];
                        }
                    },
                    width:"15%"
                },
                {
                    field:{
                        name:"purchaseNum",
                        title:"采购数量",
                        type:"int"
                    },
                    width:"20%"
                },
                {
                    field:{
                        name:"infoType",
                        title:"类型",
                        type:"int"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return infoManageModel.CONSTANTS.infoType[data.infoType].value;
                        }
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"",
                        title:"操作",
                        type:"int"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return '<a class="orange-font curp mr10 js-infoDetail">详情</a> | <a class="orange-font curp ml10 js-infoRemove">删除</a>';
                        }
                    },
                    width:"15%"
                }
            ]
        }
    })();


    var getRoute = function () {
        var route = {panel:activeTabLiInfo,ldata:lists[activeTabLiInfo].val()};
        return route;
    };

    var schemas = (function(){


        var schemas = {
            "tabAll" : {
                searchMeta: {
                    schema: {
                        simple: [
                            {
                                name: "title",
                                inputName: "title",
                                title: "项目名称",
                                ctrlType: "TextBox",
                                placeholder: "项目名称、关键字",
                                className: ""
                            }
                        ]
                    },
                    search: {
                        onSearch: function (data, searcher, click) {
                            if (data.query.title) {
                                data.query.searchString = data.query.title;
                                delete data.query.title;
                            }
                            return data;
                        }
                    },
                    reset: {
                        show: false
                    },
                    selector: "tabAll"
                },
                gridMeta :{
                    columns : header["tabAll"],
                    primaryKey:"supplierId",
                    orderMode : 1,
                    afterRowRender : function (row,data) {
                        if(data.isRead == 1){
                            $(row.dom).find(".labelNew").remove();
                        }
                        if(data.matchingNewMessageCount == 0){
                            $(row.dom).find(".js-matNewMesCount").eq(0).hide();
                        }

                        $(row.dom).find(".js-infoDetail").eq(0).click(function(){
                            var links = 'm=infoManage.infoManageDetail&purchaseInfoId=' + data["purchaseInfoId"];
                            X.router.run(links);
                        });

                        $(row.dom).find(".js-infoRemove").eq(0).click(function(){
                            var layerDelete = layer.confirm("确认删除", {
                                title:"提示",
                                content: "<div class='tac'>确认删除？</div>",
                                yes: function () {
                                    layer.close(layerDelete);
                                    infoManageModel._delete(data["purchaseInfoId"],function(result){
                                        ctrl.load();
                                        X.publish(X.CONSTANTS.channel.menuUpdate, "statistics");
                                    })
                                }
                            });
                        });


                        $(row.dom).find(".js-title").eq(0).click(function(){
                            infoManageModel.setIsRead(data,function(result){
                                X.publish(X.CONSTANTS.channel.menuUpdate, "statistics");
                                var links = 'm=infoManage.infoManageDetail&purchaseInfoId=' + data["purchaseInfoId"];
                                X.router.run(links);
                            });

                            var callback = function (result) {
                                X.publish(X.CONSTANTS.channel.menuUpdate, "customerMessge");
                            };
                            infoManageModel.readByBussinessId(data["purchaseInfoId"], callback);
                        });
                    },
                    showCheckbox : true
                },
                pageInfo : {
                    pageSize : '10',
                    totalPages : '10',
                    pageNo : '1',
                    smallPapogation: {
                        isShow: false,
                        elem: '.js_small_papogation1'
                    }
                },
                //type: "GET",
                url : X.config.infoManage.api.getList,
                toolbar: {
                    items: [
                        {
                            ctrlType: "ToolbarButton",
                            name: "remove",
                            title: "删除",
                            icon: "icon-lajitong",
                            click: function (item) {
                                var aDelete = lists[activeTabLiInfo].toolbar.target.getSelectedRows();

                                if (aDelete.length > 0) {
                                    var layerDelete = layer.confirm("确认删除", {
                                        title: "提示",
                                        content: "<div class='tac'>确认删除？</div>",
                                        yes: function () {
                                            layer.close(layerDelete);
                                            $.each(aDelete, function (i, item) {
                                                var purchaseInfoId = item.data.purchaseInfoId;
                                                infoManageModel._delete(purchaseInfoId, function (result) {
                                                    ctrl.load();
                                                    X.publish(X.CONSTANTS.channel.menuUpdate, "statistics");
                                                })
                                            });
                                        }
                                    });
                                } else {
                                    layer.open({
                                        title: '提示',
                                        closeBtn: 0,
                                        content: "<div class='tac'>至少选择一条匹配信息</div>",
                                        btn:["确定"]
                                    });
                                }
                            }
                        }
                    ]
                }

            }
        };

        return schemas;
    })();


    var menuCall = function (data) {
        var links = 'm=infoManage.infoManageDetail&purchaseInfoId=' + data["purchaseInfoId"];
        links = X.config.PATH_FILE.path.rootPath + X.browserAdapter.adaptRoute(links);
        return links;
    }

    var lists = {};
    var activeTabLiInfo ="tabAll";
    function initTabPage($elem,schema,tabPage) {
        var list = X.controls.getControl("List",$elem,schema);
        list.init();
        lists[tabPage] = list;

    };

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
            afterChangeTab: function (tabLiInfo, targetLi, index, tabPage,oldTab) {
                activeTabLiInfo = tabLiInfo;
                activeTabLi = targetLi;
                // 为了样式效果，把当前选中的前一个加上样式名
                targetLi.prev().addClass('tab_lineNone');
                if(tabLiInfo!=oldTab){
                    route.setRoute({panel:tabLiInfo});
                }
            }
        });
    };



    var route = new routerHelper("infoManage.infoManageList",schemas,getRoute);
    return ctrl;

});