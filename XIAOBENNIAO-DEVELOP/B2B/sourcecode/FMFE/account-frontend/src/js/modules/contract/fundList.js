X.define("modules.contract.fundList", ["modules.common.routerHelper", "model.contractModel","common.commonMethod"], function (routerHelper, contractModel,commonMethod) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.contract.tpl.fundList
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {

        var renderFun = function(data){
            return view.render(data, function () {
                activeTabLiInfo = route.getRoute() || activeTabLiInfo;
                ctrl.initPage();
            });
        };

        var callback = function(result){
            if(result.statusCode == 2000000){
                result.data[0].totalAmount = commonMethod.formatMoney(result.data[0].totalAmount,2,true);
                result.data[0].extractAmount = commonMethod.formatMoney(result.data[0].extractAmount,2,true);
                result.data[0].noExtractAmount = commonMethod.formatMoney(result.data[0].noExtractAmount,2,true);

                renderFun(result.data[0]);
            }else{
                renderFun({});
            }
        };
        //获取账户资金信息
        contractModel.getAcountInfo(callback);
    };


    ctrl.load = function (para) {
        ctrl.rendering();
    };

    var header = (function () {
        return {
            "tabAll": [
                {
                    field: {
                        name: "formNumber",
                        title: "单号",
                        type: "string"
                    },
                    width: "10%",
                    className: "tL"
                },
                {
                    field: {
                        name: "internationalTraderName",
                        title: "贸易商",
                        type: "string"
                    },
                    width: "10%"
                },
                {
                    field: {
                        name: "foreignTradeAmount",
                        title: "实收外汇金额",
                        type: "string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return commonMethod.formatMoney(data.foreignTradeAmount,2)
                        }
                    },
                    width: "6%"
                },
                {
                    field: {
                        name: "currency",
                        title: "币种",
                        type: "string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            var item = contractModel.getItemById(Number(data.currency),"key",contractModel.constants.currencyArr);
                            if(item){
                                return item.value;
                            }
                        }
                    },
                    width: "3%"
                },
                {
                    field: {
                        name: "exchangeRate",
                        title: "汇率",
                        type: "string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return commonMethod.formatMoney(data.exchangeRate,4);
                        }
                    },
                    width: "5%"
                },
                {
                    field: {
                        name: "settlementRmb",
                        title: "结汇金额（CNY）",
                        type: "string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return commonMethod.formatMoney(data.settlementRmb,2);
                        }
                    },
                    width: "8%"
                },
                {
                    field: {
                        name: "settlementStatus",
                        title: "结汇状态",
                        type: "string"
                    },
                    width: "6%"
                },
                {
                    field: {
                        name: "refundAmount",
                        title: "退税金额（CNY）",
                        type: "string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return commonMethod.formatMoney(data.refundAmount,2);
                        }
                    },
                    width: "8%"
                },
                {
                    field: {
                        name: "refundStatus",
                        title: "退税状态",
                        type: "string"
                    },
                    width: "6%"
                },
                {
                    field: {
                        name: "",
                        title: "操作",
                        type: "string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            var $edit = $("<span class='colff6 curp disib' style='width:30px;'>详情</span>")
                                .on("click", function (event) {
                                    event.stopPropagation();
                                    X.publish(X.CONSTANTS.channel.menuCall,{m:"contract.fundDetails",para:{exportFormId  :data.exportFormId}});
                                });
                            return  $("<div></div>").append($edit)[0];
                        }
                    },
                    width: "5%"
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
                                name: "formNumber",
                                inputName: "formNumber",
                                title: "单号",
                                ctrlType: "TextBox",
                                placeholder: "请输入单号",
                                className: "mr10"
                            },
                            {
                                name: "settlementDate",
                                inputName: "settlementDate",
                                title: "收汇日期",
                                ctrlType: "DateRangePicker",
                                placeholder: "",
                                className: ""
                            },
                            {
                                name: "settlementStatus",
                                title: "结汇状态",
                                ctrlType: "ComboBox",
                                className: "w80 va_8 tac jiehui",
                                dataSource: contractModel.constants.settlementStatus
                            },
                            {
                                name: "refundStatus",
                                title: "退税状态",
                                ctrlType: "ComboBox",
                                className: "w80 va_8 tac jiehui",
                                dataSource: contractModel.constants.refundStatus
                            }
                        ]
                    },
                    search: {
                        onSearch: function (data, searcher, click) {
                            /* $(".js-datagrid tbody").html("");*/
                            if (data.query.settlementDate) {
                                data.query.settlementDate = data.query.settlementDate.split('@');
                                data.query.beginTime = data.query.settlementDate[0];
                                data.query.endTime = data.query.settlementDate[1];
                                delete data.query.settlementDate;
                            }
                            return data;
                        }
                    },
                    reset: {
                        show: false
                    },
                    selector: "tabAll"
                },
                gridMeta: {
                    columns: header["tabAll"],
                    primaryKey: "exportFormId",
                    orderMode: 1,
                    afterRowRender: function (row, data) {

                    }
                    // showCheckbox : true,
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
                url: X.config.contract.api.fundList,
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
                    route.setRoute({panel: tabLiInfo});
                }
            }
        });
    };
    function showBox(obj, box) {
        var timer = null;
        $(obj).on("mouseover", function (e) {
            clearTimeout(timer);
            var clientX = e.clientX;
            var clientY = e.clientY;
            var txt = $(this).text();
            timer = setTimeout(function () {
                //console.log(clientX, clientY);
                $(box).css("left", clientX).css("top", clientY);
                if (txt == "") {
                    $(box).hide();
                } else {
                    $(box).show();
                    $(box).html(txt);
                }
            }, 1000);
        });
        $(obj).on("mouseout", function () {
            clearTimeout(timer);
            $(box).hide();
        });
    }

    showBox(".table_main tbody td", ".js-moreText");

    var route = new routerHelper("contract.fundList", schemas, getRoute);
    return ctrl;

});