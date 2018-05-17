X.define("modules.declare.orderList", ["modules.common.routerHelper","data.orderCountryData"], function (routerHelper,orderCountryData) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.declare.tpl.orderList
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {
        view.render({}, function () {
            activeTabLiInfo = route.getRoute() || activeTabLiInfo;
            ctrl.initPage();
        });
    };

    ctrl.load = function (para) {
        ctrl.rendering();
    };

    var header = (function () {

        return {
            "tabAll": [
                {
                    field: {
                        name: "orderNo",
                        title: "订单号",
                        type: "int"
                    },
                    width: "15%"
                },
                {
                    field: {
                        name: "wayBillNo",
                        title: "运单号",
                        type: "string"
                    },
                    width: "15%"
                },
                {
                    field: {
                        name: "goodsName",
                        title: "商品名称",
                        type: "string"
                    },
                    width: "10%"
                },
                {
                    field: {
                        name: "totalPrice",
                        title: "商品总价",
                        type: "string"
                    },
                    width: "10%"
                },
                {
                    field: {
                        name: "consignee",
                        title: "收货人",
                        type: "string"
                    },
                    width: "10%"
                },
                {
                    field: {
                        name: "consigneeCountry",
                        title: "目的国",
                        type: "string"
                    },
                    width: "10%",
                    itemRenderer: {
                        render: function (data) {
                            return orderCountryData.getCountry(data.consigneeCountry);
                        }
                    }
                },
                {
                    field: {
                        name: "shippingTime",
                        title: "发货日期",
                        type: "string"
                    },
                    width: "15%",
                    itemRenderer: {
                        render: function (data) {
                            return data.shippingTime.split(" ")[0];
                        }
                    }
                },
                {
                    field: {
                        name: "retStatus",
                        title: "状态",
                        type: "string"
                    },
                    width: "10%",
                    itemRenderer: {
                        render: function (data) {
                            switch (data.retStatus) {
                                case "1" :
                                    data.retStatus = "成功";
                                case "2" :
                                    data.retStatus = "失败";
                            }
                            return data.retStatus
                        }
                    }
                },
                {
                    field: {
                        name: "createUser",
                        title: "提交人",
                        type: "string"
                    },
                    width: "10%"
                }
            ]
        }

    })();

    var getRoute = function () {
        var route = {panel: activeTabLiInfo, ldata: lists[activeTabLiInfo].val()};
        return route;
    };

    var schemas = (function () {
        var schemas = {
            "tabAll": {
                searchMeta: {
                    schema: {
                        simple: [
                            {
                                name: "goodsName",
                                inputName: "goodsName",
                                title: "商品名称",
                                ctrlType: "TextBox",
                                placeholder: ""
                            },
                            {
                                name: "wayBillNo",
                                inputName: "wayBillNo",
                                title: "运单号",
                                ctrlType: "TextBox",
                                placeholder: ""
                            },
                            {
                                name:"consigneeCountry",
                                title:"目的国",
                                ctrlType:"ComboBox",
                                dataSource: orderCountryData.country,
                                className:'w150'
                            },
                            {
                                name: "createTime",
                                inputName: "createTime",
                                title: "发货时间",
                                ctrlType: "DateRangePicker",
                                placeholder: ""
                            }
                        ]
                    },
                    search: {
                        onSearch: function (data, searcher, click) {
                            if(data.query.createTime){
                                data.query.createTime = data.query.createTime.split('@');
                                data.query.beginShippingTime = Date.parse(data.query.createTime[0] + ' 00:00:00')/1000;
                                data.query.endShippingTime = Date.parse(data.query.createTime[1] + ' 23:59:59')/1000;

                                delete data.query.createTime;
                            }
                            return data;
                        }
                    },
                    selector: "tabAll",
                    reset: {
                        show: true
                    }
                },
                gridMeta: {
                    columns: header["tabAll"],
                    orderMode: 1,
                    primaryKey: "orderId",
                    afterRowRender: function (row, data) {}
                },
                pageInfo: {
                    pageSize: '10',
                    totalPages: '10',
                    pageNo: '1',
                    smallPapogation: {
                        isShow: false,
                        elem: '.js_small_papogation1'
                    }
                },
                //type: "GET",
                url: X.config.declare.api.orderList,
                toolbar : {
                    items: [
                        {
                            ctrlType:"ToolbarButton",
                            name:"add",
                            title:"发布订单",
                            icon:"icon-add",
                            click:function (item) {
                                var callback = function(url,mold){
                                    var li = $('.js-accondion').find('li');
                                    $.each(li, function(index,value){
                                        if(url.split('=')[1] == $(value).attr('code')){
                                            $(value).children("div").addClass("selected");
                                        }else if(mold.m == $(value).attr('code')){
                                            $(value).children("div").removeClass("selected");
                                        }
                                    })
                                };
                                X.router.run("m=declare.addOrder","","",callback);
                            }
                        }
                    ]
                }
            }
        };

        return schemas;
    })();


    var lists = {};
    var activeTabLiInfo = "tabAll";

    function initTabPage($elem, schema, tabPage) {
        var list = X.controls.getControl("List", $elem, schema);
        list.init();
        lists[tabPage] = list;
    }

    ctrl.initPage = function () {
        var tabPannel = X.controls.getControl("TabPanel", $('.js_tabPannel'), {
            activeTabInfo: activeTabLiInfo,
            beforeChangeTab: function (tabLiInfo, targetLi, index, tabPage) {
                activeTabLiInfo = tabLiInfo;
                // 刊登状态 不同
                var page = $(tabPage);
                if (!page.data("hasInited")) {
                    var schema = schemas[tabLiInfo];
                    if (schema) {
                        initTabPage(page, schema, tabLiInfo);
                    }
                    page.data("hasInited", true);
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
                if (tabLiInfo != oldTab) {
                    route.setRoute({panel: tabLiInfo});
                }
            }
        });
    };

    var route = new routerHelper("declare.orderList", schemas, getRoute);


    return ctrl;

});