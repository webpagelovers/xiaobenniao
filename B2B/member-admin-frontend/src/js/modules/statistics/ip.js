X.define("modules.statistics.ip", ["model.statisticsModel", "modules.common.routerHelper"], function (statisticsModel, routerHelper) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.statistics.tpl.ip
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {
        view.render({}, function () {
            activeTabLiInfo = route.getRoute() || activeTabLiInfo;
            ctrl.initPage();
            ctrl.selectPlatform();
        });
    };

    ctrl.load = function (para) {
        ctrl.rendering();
    };

    var platform = 'atcdeal';
    ctrl.selectPlatform = function () {
        ctrl.view.find(".js-platform").parent().parent().hide();
        var oldValue = ctrl.view.find(".js-platform").val();
        if (oldValue) {
            var temp = ctrl.view.find(".js-selectPlatform div[name=" + oldValue + "]");
            temp.addClass('select-platform-active');
            temp.siblings().removeClass('select-platform-active');
        }
        ctrl.view.find(".js-selectPlatform div").click(function () {
            platform = $(this).attr('name');
            $(this).addClass('select-platform-active');
            $(this).siblings().removeClass('select-platform-active');
            ctrl.view.find(".js-platform").val(platform);
        });
    };

    var number = 0;

    var header = (function () {

        return {
            "tabAll": [
                {
                    field: {
                        name: "number",
                        title: "序号",
                        type: ""
                    },
                    itemRenderer: {
                        render: function () {
                            number = number + 1;
                            var temp = '';
                            if (number < 10) {
                                temp = '0' + number;
                            } else {
                                temp = number + '';
                            }
                            return temp;
                        }
                    },
                    width: "3%",
                    className: "tL"
                },
                {
                    field: {
                        name: "ip",
                        title: "IP地址",
                        type: "string"
                    },
                    width: "12%"
                },
                {
                    field: {
                        name: "interviewCount",
                        title: "访问量(次)",
                        type: "string"
                    },
                    width: "9%"
                },
                {
                    field: {
                        name: "interviewrea",
                        title: "访问地区",
                        type: "string"
                    },
                    width: "20%"

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
                                name:"date",
                                title:"选择日期",
                                ctrlType:"DateRangePicker"
                            },
                            {
                                name:"platform",
                                title:"选择平台",
                                ctrlType:"TextBox",
                                className : "js-platform"
                            }
                        ]
                    },
                    search: {
                        onSearch: function (data, searcher, click) {
                            if (click) {
                                route.setRoute(getRoute());
                            }
                            if (data.query.date) {
                                data.query.date = data.query.date.split('@');
                                data.beginDate = data.query.date[0];
                                data.endDate = data.query.date[1];
                            }
                            data.platForm = platform;
                            delete data.query;
                            delete data.pageNo;
                            delete data.pageSize;
                            ctrl.view.find(".js-selectPlatform div[name=" + platform + "]").addClass('select-platform-active');
                            ctrl.view.find(".js-selectPlatform div[name=" + platform + "]").siblings().removeClass('select-platform-active');

                            ctrl.getEchartData(data, X.config.statistics.api.ip);
                            return data;
                        }
                    },
                    selector: "tabAll",
                    reset: {
                        show: false
                    }
                },
                gridMeta: {
                    columns: header["tabAll"],
                    orderMode: 1,
                    primaryKey: "statisticsId",
                    afterRowRender: function (row, data) {
                        $(row.dom).find('.operation_main').on("click", function () {
                            X.router.run("m=statistics.statisticsDisplay&statisticsId=" + data["statisticsId"]);
                        });
                    },
                    afterTableRender: function () {
                        number = 0;
                    }
                },
                pageInfo: {
                    pageSize: '20',
                    totalPages: '20',
                    pageNo: '1',
                    smallPapogation: {
                        isShow: false,
                        elem: '.js_small_papogation1'
                    }
                },
                //type: 'GET',
                //url: X.config.statistics.api.ip,
            }
        };

        return schemas;
    })();

    ctrl.getEchartData = function (data, url){
        var callback = function(result){
            if(result.statusCode == X.constructor.prototype.constant.statusCode.SUCCESS){
                if (result.data.length > 10) {
                    //result.data.length = 8;
                }
                lists['tabAll'].grid.loadData(result.data);
            }
        };
        statisticsModel.getEchartData(data, callback, url);
    };


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
                    route.setRoute({panel: tabLiInfo});
                }
            }
        });
    };

    var route = new routerHelper("statistics.ip", schemas, getRoute);


    return ctrl;

});
