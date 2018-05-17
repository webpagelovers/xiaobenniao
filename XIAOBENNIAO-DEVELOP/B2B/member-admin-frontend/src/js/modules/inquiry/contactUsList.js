X.define("modules.inquiry.contactUsList", ["modules.common.routerHelper","data.countryData"], function (routerHelper, countryData) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.inquiry.tpl.contactUsList
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
                        name: "sourcingRequestId",
                        title: "编号",
                        type: "int"
                    },
                    width: "20%",
                    itemRenderer: {
                        render: function (data) {
                            var getRandom = function (num){
                                return Math.floor((Math.random()+Math.floor(Math.random()*9+1))*Math.pow(10,num-1));
                            };
                            var generateRandomNumber = function(str){
                                var date = new Date();
                                return str + date.getFullYear()+(date.getMonth()+1)+date.getDate()+date.getHours()+date.getMinutes()+date.getSeconds()+getRandom(3);
                            };
                            return generateRandomNumber('CU');
                        }
                    }
                },
                {
                    field: {
                        name: "createTime",
                        title: "发布时间",
                        type: "string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            var date = "";
                            var dateMatch = /^\d{4}(\-\d{2}){2}\s+\d{2}\:\d{2}/;
                            if (data.createTime.match(dateMatch)) {
                                date = data.createTime.match(/^\d{4}(\-\d{2}){2}\s+\d{2}\:\d{2}/)[0];
                            }
                            return date;
                        }
                    },
                    width: "13%"
                },
                {
                    field: {
                        name: "subject",
                        title: "标题",
                        type: "string"
                    },
                    width: "20%"
                },
                {
                    field: {
                        name: "countryName",
                        title: "国家",
                        type: "string"
                    },
                    width: "15%",
                    itemRenderer: {
                        render: function (data) {
                            if (data.countryName == "Sri Lanka (ශ්‍රී ලංකාව)") {
                                data.countryName = "Sri Lanka";
                            }
                            return '<p class="showEllipsis w210 tac center" title="' + data.countryName + '">' + data.countryName + '</p>'
                        }
                    }
                },
                {
                    field: {
                        name: "responsiblePerson",
                        title: "负责人",
                        type: "string"
                    },
                    width: "10%",
                    itemRenderer: {
                        render: function (data) {
                            var responsiblePerson;
                            (data && data.responsiblePerson) ? responsiblePerson = data.responsiblePerson : responsiblePerson =  '薛冰'
                            return responsiblePerson;
                        }
                    }
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
                                name: "createDate",
                                inputName: "createDate",
                                title: "发布时间",
                                ctrlType: "DateRangePicker",
                                placeholder: ""
                            },
                            {
                                name:"countryName",
                                title:"国家",
                                ctrlType:"ComboBox",
                                dataSource: countryData,
                                className:'w150'
                            }
                        ]
                    },
                    search: {
                        onSearch: function (data, searcher, click) {
                            if(data.query.createDate){
                                data.query.createDate = data.query.createDate.split('@');
                                data.query.beginTime = data.query.createDate[0] + ' 00:00:00';
                                data.query.endTime = data.query.createDate[1] + ' 23:59:59';
                                delete data.query.createDate;
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
                    primaryKey: "contactUsId",
                    afterRowRender: function (row, data) {
                        $(row.dom).on("click", function () {
                            X.router.run("m=inquiry.contactUsDetail&contactUsId=" + data["feedBackId"]);
                        });

                        if (data.readStatus && data.readStatus == 0) {
                            $(row.dom).css({"font-weight": "bold"})
                        }

                        $(row.dom).hover(function(){
                            $(this).css("cursor","pointer");
                        },function(){
                            $(this).css("cursor","auto");
                        })
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
                url: X.config.inquiry.api.contactUsList
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
                    route.setRoute({panel: tabLiInfo});
                }
            }
        });
    };

    var route = new routerHelper("inquiry.contactUsList", schemas, getRoute);


    return ctrl;

});