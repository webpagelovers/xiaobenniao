X.define("modules.agent.agentDetail", ["model.agentModel", "modules.common.routerHelper"], function (agentModel, routerHelper) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.agent.tpl.agentDetail
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    var header = (function () {

        return {
            "tabAll": [
            ],
            "pending": [
                {
                    field: {
                        name: "id",
                        title: "询盘单ID",
                        type: "string"
                    },
                    width: "5%",
                    className: "tL"
                },
                {
                    field: {
                        name: "name",
                        title: "产品名称",
                        type: "string"
                    },
                    width: "15%"
                },
                {
                    field: {
                        name: "date",
                        title: "发布时间",
                        type: "string"
                    },
                    width: "15%"
                },
                {
                    field: {
                        name: "date",
                        title: "报价时间",
                        type: "string"
                    },
                    width: "15%"
                },
                {
                    field: {
                        name: "type",
                        title: "询盘单状态",
                        type: "string"
                    },
                    width: "15%"
                },
                {
                    field: {
                        name: "type",
                        title: "报价状态",
                        type: "string"
                    },
                    width: "15%"
                }
            ],
            "adopted": [
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
                        ]
                    },
                    search: {
                        onSearch: function (data, searcher, click) {
                        }
                    },
                    selector: "tabAll",
                    reset: {
                        show: false
                    }
                },
                gridMeta: {
                    columns: [],
                    orderMode: 1,
                    primaryKey: "userId",
                    afterRowRender: function (row, data) {
                        $(row.dom).find('.operation_main').on("click", function () {
                            X.router.run("m=user.userDisplay&userId=" + data["userId"]);
                        });
                    }
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
                // type: 'GET',
                // url : X.config.agent.api.agentList,
                toolbar: {
                    items: [
                    ]
                }

            },
            "pending": {
                searchMeta: {
                    schema: {
                        simple: [
                            {
                                name:"createDateRange",
                                title:"发布时间",
                                ctrlType:"DateRangePicker",
                                placeholder:"2015/6/22-2016/2/16"
                            },
                        ]
                    },
                    search: {
                        onSearch: function (data, searcher, click) {
                            if(data.query.userId && isNaN(data.query.userId)){
                                data.query.userId = -1;
                            }
                            data.query.tabType = '3';
                            return data;
                        }
                    },
                    selector: "pending",
                    reset: {
                        show: true
                    }
                },
                gridMeta: {
                    columns: header["pending"],
                    orderMode: 1,
                    primaryKey: "userId",
                    afterRowRender: function (row, data) {
                        $(row.dom).find('.operation_main').on("click", function () {
                            X.router.run("m=user.userDisplay&userId=" + data["userId"]);
                        });
                    }
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
                type: 'GET',
                url : X.config.agent.api.agentList,
                toolbar: {
                    items: [
                    ]
                }

            },
            "adopted": {
                searchMeta: {
                    schema: {
                        simple: [
                        ]
                    },
                    search: {
                        onSearch: function (data, searcher, click) {
                            if(data.query.userId && isNaN(data.query.userId)){
                                data.query.userId = -1;
                            }
                            data.query.tabType = '1';
                            return data;
                        }
                    },
                    selector: "adopted",
                    reset: {
                        show: false
                    }
                },
                gridMeta: {
                    columns: header["adopted"],
                    orderMode: 1,
                    primaryKey: "userId",
                    afterRowRender: function (row, data) {
                        $(row.dom).find('.operation_main').on("click", function () {
                            X.router.run("m=user.userDisplay&userId=" + data["userId"]);
                        });
                    }
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
                // url: X.config.user.api.userlistByPage,
                toolbar: {
                    items: [
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
        var tabPannel = X.controls.getControl("TabPanel", $('.js_tabPannel1'), {
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
                    //route.setRoute({panel: tabLiInfo});
                }
            }
        });

        ctrl.myInit();
    };

    ctrl.myInit = function () {
        ctrl.view.el.find("li[tabChangeInfo=tabAll]").click(function () {
            var callback = function (result) {
                if (result.statusCode="2000000") {
                    ctrl.initBaseInfo(result.data[0]);
                }
            };

            agentModel.getAgentDetail(_para["userId"], callback);
        });
        ctrl.view.el.find("li[tabChangeInfo=tabAll]").click();
    };

    ctrl.initBaseInfo = function (data) {
        var baseInfo = ctrl.view.el.find("#baseInfo");
        baseInfo.find('.js-mobile').text(data.mobile);
        baseInfo.find('.js-category').text(data.category);
        baseInfo.find('.js-expCommission').text(data.expCommission);
        baseInfo.find('.js-language').text(data.language);
        baseInfo.find('.js-location').text(data.location);
        baseInfo.find('.js-personalName').text(data.personalName);
        baseInfo.find('.js-qq').text(data.qq);
        baseInfo.find('.js-selfIntrodution').text(data.selfIntrodution);
        baseInfo.find('.js-wechat').text(data.wechat);
        baseInfo.find('.js-workCondition').text(data.workCondition);

    };

    //var route = new routerHelper("agent.agentList", schemas, getRoute);

    ctrl.rendering = function () {
        view.render({}, function () {
            //activeTabLiInfo = route.getRoute() || activeTabLiInfo;
            ctrl.initPage();
        });
    };

    var _para;
    ctrl.load = function (para) {
        para = para || {};
        _para = para ;
        ctrl.rendering();
    };


    return ctrl;

});
