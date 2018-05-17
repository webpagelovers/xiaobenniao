X.define("modules.customerClearance.declareProductList", ["modules.common.routerHelper", "model.declareProductModel"], function (routerHelper, declareProductModel) {
    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.customerClearance.tpl.declareProductList
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });


    ctrl.rendering = function () {
        return view.render({}, function () {
            activeTabLiInfo = route.getRoute() || activeTabLiInfo;
            ctrl.initPage();
        });

    };

    var header = (function () {
        var tabList = ["tabAll", "audit", "adopt", "perfect", "reject", "draft", "recycle"];
        return createHead(tabList);
    })();

    var getRoute = function () {
        var route = {panel: activeTabLiInfo, ldata: lists[activeTabLiInfo].val()};
        return route;
    };

    var schemas = (function () {
        var schemaList = [
            {
                tabName: "tabAll",
                status: 8
            },
            {
                tabName: "audit",
                status: 1
            },
            {
                tabName: "adopt",
                status: 2
            },
            {
                tabName: "perfect",
                status: 3
            },
            {
                tabName: "reject",
                status: 4
            },
            {
                tabName: "draft",
                status: 0
            },
            {
                tabName: "recycle",
                status: 5
            }
        ];
        return createSchemas(schemaList);
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

    ctrl.load = function (para) {
        ctrl.rendering();
    };

    //获取操作栏该返回什么按钮，链接到哪个页面
    function getBtns(data) {
        //分割线
        var $line = $("<span class='m5'> | </span>");
        //编辑
        var $edit = $("<span class='colff6 curp'>编辑</span>")
            .on("click", function (event) {
                event.stopPropagation();
                X.publish(X.CONSTANTS.channel.menuCall, {
                    m: "customerClearance.editDeclareProduct",
                    para: {productId: data.productId}
                });
            });
        //详情
        var $detail = $("<span class='colff6 curp'>详情</span>")
            .on("click", function (event) {
                event.stopPropagation();
                X.publish(X.CONSTANTS.channel.menuCall, {
                    m: "customerClearance.declareProductDetail",
                    para: {productId: data.productId, status: Number(data.status)}
                });
            });
        //删除
        var $delete = $("<span class='colff6 curp'>删除</span>")
            .on("click", function (event) {
                event.stopPropagation();
                var layerDelete = layer.confirm('确认删除', {
                    title: "提示",
                    content: "<div class='tac'>确认删除？</div>",
                    yes: function () {
                        layer.close(layerDelete);
                        declareProductModel.m_delete({
                            data: data, callback: function (result) {
                                setTimeout(function () {
                                    for (var key in lists) {
                                        if (lists.hasOwnProperty(key)) {
                                            lists[key].loadData();
                                        }
                                    }
                                    var index2 = layer.alert('删除成功',{
                                        title:"提示"
                                    }, function () {
                                        layer.close(index2)
                                    })
                                }, 400);
                            }
                        });
                    }
                });
            });
        //加入回收站
        var $putOut = $("<span class='colff6 curp'>加入回收站</span>")
            .on("click", function (event) {
                event.stopPropagation();
                var putOut = layer.confirm('加入回收站', {
                    title: "提示",
                    content: "<div class='tac'>确认加入回收站？</div>",
                    yes: function () {
                        layer.close(putOut);
                        declareProductModel.productDown(data.productId, function (result) {
                            var index2 = layer.alert('加入回收站成功',{
                                title:"提示"
                            }, function () {
                                layer.close(index2)
                            })
                            ctrl.load();
                        });

                    }
                });
            });
        //恢复使用
        var $up = $("<span class='colff6 curp'>恢复使用</span>")
            .on("click", function (event) {
                event.stopPropagation();
                var up = layer.confirm('恢复使用', {
                    title: "提示",
                    content: "<div class='tac'>确认恢复使用？</div>",
                    yes: function () {
                        layer.close(up);
                        declareProductModel.productUp(data.productId, function (result) {
                            var index2 = layer.alert('恢复使用成功', {
                                title:"提示"
                            }, function () {
                                layer.close(index2)
                            })
                            ctrl.load();
                        });

                    }
                });
            });


        switch (Number(data.status)) {
            case 0:
                return $("<div></div>").append($edit).append($line).append($delete)[0];
                break;
            case 1:
                return $("<div></div>").append($detail)[0];
                break;
            case 2:
                return $("<div></div>").append($detail).append($line).append($putOut)[0];
                break;
            case 3:
                return $("<div></div>").append($detail)[0];
                break;
            case 4:
                return $("<div></div>").append($detail).append($line).append($delete)[0];
                break;
            case 5:
                return $("<div></div>").append($detail).append($line).append($up)[0];
                break;
            default:
                return $("<div></div>").append($detail).append($line).append($delete)[0];
        }
    }

    //创建head
    function createHead(tabList) {
        var head = {};
        var thead = [
            {
                field: {
                    name: "",
                    title: "序号",
                    type: "int"
                },
                width: "5%",
                className: "tL"
            },
            {
                field: {
                    name: "nameCn",
                    title: "产品名称",
                    type: "string"
                },
                itemRenderer: {
                    render: function (data) {
                        return '<p class="contract-word-cut w80" title="' + data.nameCn + '">' + data.nameCn + '</p>'
                    }
                },
                width: "9%"
            },
            {
                field: {
                    name: "nameEn",
                    title: "产品英文名称",
                    type: "string"
                },
                itemRenderer: {
                    render: function (data) {
                        return '<p class="contract-word-cut w80" title="' + data.nameEn + '">' + data.nameEn + '</p>'
                    }
                },
                width: "9%"
            },
            {
                field: {
                    name: "HSCode",
                    title: "HSCode",
                    type: "string"
                },
                itemRenderer: {
                    render: function (data) {
                        return '<p class="contract-word-cut w80" title="' + data.hsCode + '">' + data.hsCode + '</p>'
                    }
                },
                width: "9%"
            },
            {
                field: {
                    name: "brand",
                    title: "品牌",
                    type: "string"
                },
                itemRenderer: {
                    render: function (data) {
                        return '<p class="contract-word-cut w80" title="' + data.brand + '">' + data.brand + '</p>'
                    }
                },
                width: "10%"
            },
            {
                field: {
                    name: "texture",
                    title: "材质",
                    type: "string"
                },
                itemRenderer: {
                    render: function (data) {
                        return '<p class="contract-word-cut w50" title="' + data.texture + '">' + data.texture + '</p>'
                    }
                },
                width: "5%"
            },
            {
                field: {
                    name: "model",
                    title: "型号",
                    type: "string"
                },
                itemRenderer: {
                    render: function (data) {
                        return '<p class="contract-word-cut w50" title="' + data.model + '">' + data.model + '</p>'
                    }
                },
                width: "5%"
            },
            {
                field: {
                    name: "usage",
                    title: "用途",
                    type: "string"
                },
                itemRenderer: {
                    render: function (data) {
                        return '<p class="contract-word-cut w50" title="' + data.usage + '">' + data.usage + '</p>'
                    }
                },
                width: "5%"
            },
            {
                field: {
                    name: "status",
                    title: "状态",
                    type: "string"
                },
                itemRenderer: {
                    render: function (data) {
                        return declareProductModel.constants.status[data.status].value;
                    }
                },
                width: "8%"
            },
            {
                field: {
                    name: "",
                    title: "操作",
                    type: "string"
                },
                itemRenderer: {
                    render: function (data, field, index, grid) {//SAVED REJECTED
                        return getBtns(data);
                    }
                },
                width: "15%"
            }
        ];
        for (var i = 0; i < tabList.length; i++) {
            head[tabList[i]] = thead;
        }
        return head;
    }

    //创建schemas
    function createSchemas(schemaList) {
        var schemaItem = {};
        for (var i = 0; i < schemaList.length; i++) {
            var tbody = {
                searchMeta: {
                    schema: (function () {
                        if (i == 0) {
                            return {
                                simple: [
                                    {
                                        name: "nameCn",
                                        inputName: "nameCn",
                                        title: "产品名称",
                                        ctrlType: "TextBox",
                                        placeholder: "产品名称",
                                        className: "mr30"
                                    },
                                    {
                                        name: "status",
                                        title: "状态",
                                        ctrlType: "ComboBox",
                                        className: "w160 va_8 tac",
                                        dataSource: declareProductModel.constants.searchStatus
                                    }
                                ]
                            }
                        } else {
                            return {
                                simple: [
                                    {
                                        name: "nameCn",
                                        inputName: "nameCn",
                                        title: "产品名称",
                                        ctrlType: "TextBox",
                                        placeholder: "产品名称",
                                        className: "mr30"
                                    }
                                ]
                            }
                        }
                    })(),
                    search: {
                        onSearch: function (data, searcher, click) {
                            if (click) {
                                route.setRoute(getRoute());
                            }
                            if (searcher.options.currStatus == 8) {
                                if ((searcher.options.currStatus || searcher.options.currStatus == 0) && !searcher.options.defaultValue) {
                                    data.query.status = searcher.options.currStatus;
                                }
                            } else {
                                data.query.status = searcher.options.currStatus;
                            }

                            if (data.query.status == 8) {
                                delete data.query.status;
                            }
                            return data;
                        }
                    },
                    reset: {
                        show: false
                    },
                    currStatus: schemaList[i].status,
                    selector: schemaList[i].tabName
                },
                gridMeta: {
                    columns: header[schemaList[i].tabName],
                    primaryKey: "productId",
                    orderMode: 1,
                    afterRowRender: function (row, data, index) {
                        $(row.dom).find("td").first().html(index + 1);
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
                url: X.config.customerClearance.api.declareProductList,
                toolbar: {
                    items: [
                        {
                            ctrlType: "ToolbarButton",
                            name: "add",
                            title: "创建产品",
                            icon: "icon-add",
                            click: function (item) {
                                X.router.run("m=customerClearance.addDeclareProduct", "");
                            }
                        }
                    ]
                }
            };
            schemaItem[schemaList[i].tabName] = tbody;
        }
        return schemaItem;
    };

    var route = new routerHelper("customerClearance.declareProductList", schemas, getRoute);

    return ctrl;
});
