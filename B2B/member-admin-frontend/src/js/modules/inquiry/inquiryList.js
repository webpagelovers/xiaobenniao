X.define("modules.inquiry.inquiryList", ["model.inquiryModel", "modules.common.routerHelper", "data.countryData"], function (inquiryModel, routerHelper, countryData) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.inquiry.tpl.inquiryList
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {
        view.render({}, function () {
            activeTabLiInfo = route.getRoute() || activeTabLiInfo;
            ctrl.initPage();
            /*view.el.find(".js-searchContainer").find("input").each(function (index, elem) {
             $(elem).attr("disabled", true);
             })*/
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
                        name: "rfqNumber",
                        title: "编号",
                        type: "int"
                    },
                    width: "10%",
                    className: "tL"
                },
                {
                    field: {
                        name: "postTime",
                        title: "发布时间",
                        type: "string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            var date = "";
                            var dateMatch = /^\d{4}(\-\d{2}){2}\s+\d{2}\:\d{2}/;
                            if (data.postTime.match(dateMatch)) {
                                date = data.postTime.match(/^\d{4}(\-\d{2}){2}\s+\d{2}\:\d{2}/)[0];
                            } else {
                                date = "";
                            }
                            return date;
                        }
                    },
                    width: "13%"
                },
                {
                    field: {
                        name: "productName",
                        title: "产品名称",
                        type: "string"
                    },
                    width: "20%"
                },
                {
                    field: {
                        name: "destination",
                        title: "国家",
                        type: "string"
                    },
                    width: "20%",
                    itemRenderer: {
                        render: function (data) {

                            if (data.destination == "Sri Lanka (ශ්‍රී ලංකාව)") {
                                data.destination = "Sri Lanka";
                            }

                            return '<p class="showEllipsis w210 tac center" title="' + data.destination + '">' + data.destination + '</p>'
                        }
                    }
                },
                {
                    field: {
                        name: "quoteCount",
                        title: "报价数量",
                        type: "string"
                    },
                    width: "10%"
                },
                {
                    field: {
                        name: "owner",
                        title: "负责人",
                        type: "string"
                    },
                    width: "5%",
                    itemRenderer: {
                        render: function (data) {
                            return '';
                        }
                    }
                },
                {
                    field: {
                        name: "source",
                        title: "来源",
                        type: "string"
                    },
                    width: "15%",
                    itemRenderer: {
                        render: function (data) {
                            if (data.source.match(/^\d+$/)) {
                                var source = inquiryModel.const.source;
                                for (var i = 0, len = source.length; i < len; i++) {
                                    if (source[i].key == data.source) {
                                        return inquiryModel.const.source[i].value;
                                    }
                                }
                                return '';
                            } else {
                                return data.source;
                            }
                        }
                    },
                    className: ""
                },
                {
                    field: {
                        name: "status",
                        title: "状态",
                        type: "string"
                    },
                    width: "10%",
                    className: ""
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
                                name: "productName",
                                inputName: "productName",
                                title: "产品名称",
                                ctrlType: "TextBox",
                                placeholder: "请输入产品名称"
                            },
                            {
                                name: "status",
                                inputName: "status",
                                title: "询盘状态",
                                ctrlType: "ComboBox",
                                dataSource: inquiryModel.const.cases,
                                className:'z10000'
                            },
                            {
                                name: "postTime",
                                inputName: "postTime",
                                title: "发布时间",
                                ctrlType: "DateRangePicker"
                            },
                            {
                                name: "destination",
                                inputName: "destination",
                                title: "国家",
                                ctrlType: "ComboBox",
                                dataSource: countryData,
                                className:'w150'
                            },
                            /*
                             {
                             name: "owner",
                             inputName: "owner",
                             title: "负责人",
                             ctrlType: "ComboBox",
                             dataSource: inquiryModel.const.cases[0]
                             },*/
                            {
                                name: "readStatus",
                                inputName: "readStatus",
                                title: "更新状态",
                                ctrlType: "ComboBox",
                                dataSource: inquiryModel.const.readStatus
                            }
                        ]
                    },
                    search: {
                        onSearch: function (data, searcher, click) {
                            if (data.query.status == -2) {
                                data.query.status = '';
                            }
                            if (click) {
                                route.setRoute(getRoute());
                            }

                            if (data.query.postTime) {
                                data.query.postTime = data.query.postTime.split('@');
                                data.query.startPostTime = data.query.postTime[0];
                                data.query.endPostTime = data.query.postTime[1];
                                delete data.query.postTime;
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
                    primaryKey: "userId",
                    afterRowRender: function (row, data) {
                        $(row.dom).on("click", function () {
                            inquiryModel.updateReadStatus({
                                sourcingRequestId: data["sourcingRequestId"],
                                status: "1"
                            }, function (result) {
                                X.router.run("m=inquiry.inquiryDetail&sourcingRequestId=" + data["sourcingRequestId"]);
                            });
                        });

                        if (data.readStatus == 0) {
                            $(row.dom).css({"font-weight": "bold"})
                        }

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
                //type: "GET",
                url: X.config.inquiry.api.inquiryList,
                toolbar: {
                    items: [
                        {
                            ctrlType: "ToolbarButton",
                            name: "add",
                            title: "新增RFQ",
                            icon: "icon-add",
                            click: function (item) {
                                X.router.run("m=inquiry.addRFQ", "");
                            }
                        },
                        /*{
                            ctrlType: "ToolbarButton",
                            name: "add",
                            title: "导出RFQ",
                            icon: "icon-daochu",
                            click: function (item) {
                                
                            }
                        }*/
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
        //lazyRender()
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

    //由于部署在国外 导致服务器很慢 优化方案：
    //1、优先渲染页面
    //2、回填数据
    //3、执行基本需求
    //4、下载大文件并执行
    /*function lazyRender() {
        //IntlTelInput
        X.require('adapter.intlTelInput', function() {
            var input = $('.js-destination', view.el)
            X.controls.getControl("IntlTelInput", input, {})
        })
    }*/

    var route = new routerHelper("inquiry.inquiryList", schemas, getRoute);


    return ctrl;

});