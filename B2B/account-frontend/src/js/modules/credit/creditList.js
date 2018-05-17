X.define('modules.credit.creditList', ['model.creditModel', 'modules.common.InitHelper', 'modules.common.routerHelper'], function(model, InitHelper, routerHelper) {
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.credit.tpl.creditList
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.load = function (para) {
        view.render({}, function () {
            activeTabLiInfo = route.getRoute() || activeTabLiInfo;
            ctrl.initPage();

            ctrl.addUserVM = ctrl.getViewModel(view.find(".js-addContactser"));
            ctrl.addUserVM.initControl();
            ctrl.addAccounterVM = ctrl.getViewModel(view.find(".js-addAccounter"));
            ctrl.addAccounterVM.initControl();

            bindEvent()

        })
    };

    var header = (function () {
        return {
            "contacts": [
                {
                    field: {
                        name: "createDate",
                        title: "提交时间"
                    },
                    width: "10%",
                    className: "tL"
                },
                {
                    field: {
                        name: "salesmanNumber",
                        title: "草稿业务号"
                    },
                    width: "12%"
                },
                {
                    field: {
                        name: "accountee",
                        title: "开证申请人"
                    },
                    width: "7%"
                },
                {
                    field: {
                        name: "amount",
                        title: "信用证金额"
                    },
                    itemRenderer: {
                        render: function(data) {
                            return data.amount.toFixed(2)
                        }
                    },
                    width: "10%"
                },
                {
                    field: {
                        name: "lastAuditDate",
                        title: "审核时间"
                    },
                    width: "10%"
                },
                {
                    field: {
                        name: "letterCreditStatus",
                        title: "状态"
                    },
                    itemRenderer: {
                        render: function(data) {
                            return model.letterCreditStatus[parseInt(data.letterCreditStatus) + 1].value
                        }
                    },
                    width: "10%"
                },
                {
                    field: {
                        name: "",
                        title: "操作",
                        type: "string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            var elems = data.letterCreditStatus == 0 
                                ? [
                                    "<div id='"+ data.letterCreditId +"'>",
                                    "   <a href='javascript:void(0);' class='orange-font credit-list-event' type='edit'>编辑</a>&nbsp;&nbsp;&nbsp;",
                                    "   <a href='javascript:void(0);' class='orange-font credit-list-event' type='remove'>删除</a>",
                                    "</div>"
                                ].join('')
                                : "<div id='"+ data.letterCreditId +"'><a href='javascript:void(0);' class='orange-font credit-list-event' type='detail'>详情</a>"
                            return elems;
                        }
                    },
                    width: "10%"
                }
            ],
            "bankAccount": [
                {
                    field: {
                        name: "createDate",
                        title: "提交时间"
                    },
                    width: "10%"
                },
                {
                    field: {
                        name: "salesmanNumber",
                        title: "正本业务号"
                    },
                    width: "10%"
                },
                {
                    field: {
                        name: "letterCreditNumber",
                        title: "信用证号码"
                    },
                    width: "10%"
                },
                {
                    field: {
                        name: "amount",
                        title: "信用证金额"
                    },
                    itemRenderer: {
                        render: function(data) {
                            return data.amount.toFixed(2);
                        }
                    },
                    width: "10%"
                },
                {
                    field: {
                        name: "latestShippingDate",
                        title: "最迟装运日期"
                    },
                    width: "8%"
                },
                {
                    field: {
                        name: "effectiveDate",
                        title: "交单期"
                    },
                    width: "10%"
                },
                {
                    field: {
                        name: "validityCreditDate",
                        title: "信用证有效期"
                    },
                    width: "10%"
                },
                {
                    field: {
                        name: "letterCreditStatus",
                        title: "状态"
                    },
                    itemRenderer: {
                        render: function(data) {
                            return model.letterCreditStatus[parseInt(data.letterCreditStatus) + 1].value;
                        }
                    },
                    width: "10%"
                },
                {
                    field: {
                        name: "",
                        title: "操作",
                        type: "string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {                            
                            var elems = data.letterCreditStatus == 0 
                                ? [
                                    "<div id='"+ data.letterCreditId +"'>",
                                    "   <a href='javascript:void(0);' class='orange-font credit-list-event' type='edit'>编辑</a>&nbsp;&nbsp;&nbsp;",
                                    "   <a href='javascript:void(0);' class='orange-font credit-list-event' type='remove'>删除</a>",
                                    "</div>"
                                ].join('')
                                : "<div id='"+ data.letterCreditId +"'><a href='javascript:void(0);' class='orange-font credit-list-event' type='detail'>详情</a>";
                            return elems;
                        }
                    },
                    width: "10%"
                }
            ]
        };
    })();


    var getRoute = function () {
        var route = {panel: activeTabLiInfo, ldata: lists[activeTabLiInfo].val()};
        return route;
    };

    var schemas = (function () {


        var schemas = {
            "contacts": {
                searchMeta: {
                    schema: {
                        simple: [
                            {
                                name: "salesmanNumber",
                                inputName: "salesmanNumber",
                                title: "草稿业务号",
                                ctrlType: "TextBox",
                                placeholder: "请输入草稿业务号"
                            },
                            {
                                name: "accountee",
                                inputName: "accountee",
                                title: "开证申请人",
                                ctrlType: "TextBox",
                                placeholder: "请输入开证申请人"
                            },
                            {
                                name:"letterCreditStatus",
                                title:"草稿状态",
                                ctrlType: "ComboBox",
                                dataSource: model.letterCreditStatus,
                                className: 'w160 va_8 tac'
                            }
                        ]
                    },
                    search: {
                        onSearch: function (data, searcher, click) {
                            return data;
                        }
                    },
                    reset: {
                        show: false
                    },
                    selector: "contacts"
                },
                gridMeta: {
                    columns: header["contacts"]
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
                url: X.config.credit.api.creditListDraft,
                toolbar: {
                    items: [
                        {
                            ctrlType: "ToolbarButton",
                            name: "add",
                            title: "上传信用证草稿",
                            icon: "icon-add",
                            click: function (item) {
                                model.creditStatus = 0
                                model.addOrMerge   = 'POST'
                                X.publish(X.CONSTANTS.channel.menuCall,{m:"credit.addCreditDraft"})
                            }
                        }
                    ]
                }
            },
            "bankAccount": {
                searchMeta: {
                    schema: {
                        simple: [
                            {
                                name: "letterCreditNumber",
                                inputName: "letterCreditNumber",
                                title: "信用证号码",
                                ctrlType: "TextBox",
                                placeholder: "请输入信用证号码"
                            },
                            {
                                name: "minAmount",
                                inputName: "minAmount",
                                title: "信用证金额",
                                ctrlType: "TextBox",
                                placeholder: "最小金额",
                                className: 'w100'
                            },
                            {
                                name: "maxAmount",
                                inputName: "maxAmount",
                                title: "",
                                association: true,
                                ctrlType: "TextBox",
                                placeholder: "最大金额",
                                className: 'w100'
                            }
                        ]
                    },
                    search: {
                        onSearch: function (data, searcher, click) {
                            return data;
                        }
                    },
                    reset: {
                        show: false
                    },
                    selector: "bankAccount"
                },
                gridMeta: {
                    columns: header["bankAccount"]
                },
                pageInfo: {
                    pageSize: '10',
                    totalPages: '10',
                    pageNo: '1',
                    smallPapogation: {
                        isShow: false,
                        elem: '.js_small_papogation2'
                    }
                },
                //type: "GET",
                url: X.config.credit.api.creditListOriginal,
                toolbar: {
                    items: [
                        {
                            ctrlType: "ToolbarButton",
                            name: "add",
                            title: "直接登记信用证正本",
                            icon: "icon-add",
                            click: function (item) {
                                model.creditStatus = 1;
                                model.addOrMerge   = 'POST';
                                X.publish(X.CONSTANTS.channel.menuCall,{m:"credit.addCredit"});
                            }
                        }
                    ]
                }
            }
        };

        return schemas;
    })();


    var lists = {};
    var activeTabLiInfo = "contacts";

    function initTabPage($elem, schema, tabPage) {
        var list = X.controls.getControl("List", $elem, schema);
        list.init();
        lists[tabPage] = list;

    };

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
                model.creditStatus = index
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

    //用于绑定 编辑、详情、删除
    function bindEvent() {
        $('.js_tabPannel1').on('click', '.credit-list-event', function() {
            var me   = $(this),
                type = me.attr('type'),
                id   = me.parent().attr('id'),
                detailm = model.creditStatus==1? '': 'Draft'

            switch (type) {
                case 'detail':
                    X.publish(X.CONSTANTS.channel.menuCall,{m:"credit.creditDetail" + detailm, para:{id: id}})
                    break;
                case 'edit':
                    model.addOrMerge = 'PUT'
                    X.publish(X.CONSTANTS.channel.menuCall,{m:"credit.addCredit" + detailm, para:{id: id}})
                    break;
                case 'remove':
                    var layerDelete = layer.confirm('确认删除', {
                        title:"提示",
                        content: "<div class='tac'>确认删除？</div>",
                        yes: function () {
                            layer.close(layerDelete);
                            model.deleteCredit(id, function (result) {
                                if (result.statusCode === X.CONSTANTS.statusCode.SUCCESS) {
                                    var index2 = layer.alert('信用证删除成功', function() {
                                        layer.close(index2)
                                        setTimeout(function () { ctrl.load(); }, 600);
                                    })
                                    $('.layui-layer-close').hide()
                                }
                            });
                        }
                    });
                    break;
            }
        })
    }

    

    var route = new routerHelper("credit.creditList", schemas, getRoute);
    return ctrl;

});