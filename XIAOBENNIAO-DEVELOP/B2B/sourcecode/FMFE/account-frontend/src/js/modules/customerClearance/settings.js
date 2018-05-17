X.define("modules.customerClearance.settings", ["modules.common.routerHelper", "model.customerClearanceModel"], function (routerHelper, customerClearanceModel) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.customerClearance.tpl.settings
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {

        return view.render({}, function () {
            activeTabLiInfo = route.getRoute() || activeTabLiInfo;
            ctrl.initPage();

            ctrl.addUserVM = ctrl.getViewModel(view.find(".js-addContactser"));
            ctrl.addUserVM.initControl();
            ctrl.addAccounterVM = ctrl.getViewModel(view.find(".js-addAccounter"));
            ctrl.addAccounterVM.initControl();

        });

    };


    ctrl.load = function (para) {
        ctrl.rendering();
    };

    var header = (function () {
        return {
            "contacts": [
                {
                    field: {
                        name: "",
                        title: "序号",
                        type: "int"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return "<span class='contactsIndex'></span>"
                        }
                    },
                    width: "10%",
                    className: "tL"
                },
                {
                    field: {
                        name: "contacts",
                        title: "联系人",
                        type: "string"
                    },
                    width: "12%"
                },
                {
                    field: {
                        name: "phone",
                        title: "手机",
                        type: "string"
                    },
                    width: "7%"
                },
                {
                    field: {
                        name: "mobile",
                        title: "联系电话",
                        type: "string"
                    },
                    width: "10%"
                },
                {
                    field: {
                        name: "email",
                        title: "邮箱",
                        type: "string"
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
                            var elems = $("<div><a href='' class='orange-font'>编辑</a>&nbsp;&nbsp;&nbsp;<a href='' class='orange-font'>删除</a></div>")[0]
                            $(elems).find("a").eq(0).click(function (evt) {
                                evt.stopPropagation();
                                evt.preventDefault();
                                ctrl.addUserVM.setData(data);
                                layer.ready(function(){
                                    addContactserValidate();
                                });
                                var layerEdit = layer.open({
                                    type: 1,
                                    content: view.find(".js-addContactser"),
                                    title: "编辑",
                                    area: ["385px", "480px"],
                                    btn: ["保存","取消"],
                                    success: function (layero, index) {
                                        $(".js-error").html("");
                                    },
                                    yes: function () {
                                        addContactserValidate();
                                        if ($(".js-addContactser").valid()) {
                                            var data2 = ctrl.addUserVM.collectData();
                                            ctrl.addUserVM.reset();
                                            data2.exportContactsId = data.exportContactsId;

                                            customerClearanceModel.editExportContacts(data2, function (result) {
                                                layer.close(layerEdit);
                                                ctrl.load();
                                            });
                                        }
                                    }
                                });
                            });
                            $(elems).find("a").eq(1).click(function (evt) {
                                evt.stopPropagation();
                                evt.preventDefault();
                                var layerDelete = layer.confirm('确认删除', {
                                    title:"提示",
                                    content: "<div class='tac'>确认删除？</div>",
                                    yes: function () {
                                        layer.close(layerDelete);
                                        customerClearanceModel.deleteExportContacts([data.exportContactsId], function (result) {
                                            setTimeout(function () {
                                                ctrl.load();
                                            }, 400);
                                        });
                                    }
                                });

                            });
                            return elems;
                        }
                    },
                    width: "10%"
                }
            ],
            "bankAccount": [
                {
                    field: {
                        name: "",
                        title: "序号",
                        type: "int"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {

                        }
                    },
                    width: "5%",
                    className: "tL"
                },
                {
                    field: {
                        name: "accountName",
                        title: "开户名",
                        type: "string"
                    },
                    width: "14%",
                    className : "wb-ba"
                },
                {
                    field: {
                        name: "bankName",
                        title: "开户行",
                        type: "string"
                    },
                    width: "14%",
                    className : "wb-ba"
                },
                {
                    field: {
                        name: "bankAccount",
                        title: "银行账号",
                        type: "string"
                    },
                    width: "10%"
                },
                {
                    field: {
                        name: "bankContacts",
                        title: "财务联系人",
                        type: "string"
                    },
                    width: "8%"
                },
                {
                    field: {
                        name: "bankPhoneNumber",
                        title: "联系方式",
                        type: "string"
                    },
                    width: "10%"
                },
                {
                    field: {
                        name: "bankImEmail",
                        title: "QQ/邮箱",
                        type: "string"
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
                            var elems = $("<div><a href='' class='orange-font'>编辑</a>&nbsp;&nbsp;&nbsp;<a href='' class='orange-font'>删除</a></div>")[0]
                            $(elems).find("a").eq(0).click(function (evt) {
                                evt.stopPropagation();
                                evt.preventDefault();
                                ctrl.addAccounterVM.setData(data);
                                layer.ready(function(){
                                    addAccounterValidate();
                                });
                                var layerEdit = layer.open({
                                    type: 1,
                                    content: view.find(".js-addAccounter"),
                                    title: "编辑",
                                    area: ["405px", "580px"],
                                    btn: ["保存","取消"],
                                    success: function (layero, index) {
                                        $(".js-error").html("");
                                    },
                                    yes: function () {

                                        addAccounterValidate();

                                        if ($(".js-addAccounter").valid()) {
                                            var data2 = ctrl.addAccounterVM.collectData();
                                            ctrl.addAccounterVM.reset();
                                            data2.companyBankAccountId = data.companyBankAccountId;
                                            customerClearanceModel.editCompanyBankAccount(data2, function (result) {
                                                layer.close(layerEdit);
                                                ctrl.load();
                                            });
                                        }
                                    }
                                });
                            });
                            $(elems).find("a").eq(1).click(function (evt) {
                                evt.stopPropagation();
                                evt.preventDefault();
                                var layerDelete = layer.confirm("确认删除", {
                                    title:"提示",
                                    content: "<div class='tac'>确认删除？</div>",
                                    yes: function () {
                                        layer.close(layerDelete);
                                        customerClearanceModel.deleteCompanyBankAccount([data.companyBankAccountId], function (result) {
                                            setTimeout(function () {
                                                ctrl.load();
                                            }, 400)
                                        })
                                    }
                                });
                            });
                            return elems;
                        }
                    },
                    width: "10%"
                }
            ]
        }
    })();

    var header2 = (function () {
        var tabList = ["all", "draft", "under_review", "data", "review_passed", "review_temporary", "review_reject"];
        return createHead(tabList);
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
                                name: "contacts",
                                inputName: "contacts",
                                title: "姓名",
                                ctrlType: "TextBox",
                                placeholder: "",
                                className: "mr30 w180"
                            },
                            {
                                name: "phone",
                                inputName: "phone",
                                title: "手机号码",
                                ctrlType: "TextBox",
                                placeholder: "",
                                className: "mr60 w180"
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
                    columns: header["contacts"],
                    primaryKey: "supplierId",
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
                //type: "GET",
                url: X.config.customerClearance.api.getExportContactsByPage,
                toolbar: {
                    items: [
                        {
                            ctrlType: "ToolbarButton",
                            name: "add",
                            title: "新增账户",
                            icon: "icon-add",
                            click: function (item) {
                                layer.ready(function(){
                                    addContactserValidate();
                                });
                                var layerAddContacts = layer.open({
                                    type: 1,
                                    content: view.find(".js-addContactser"),
                                    title: "新增联系人",
                                    area: ["385px", "480px"],
                                    btn: ["保存","取消"],
                                    success: function (layero, index) {
                                        ctrl.addUserVM.reset();
                                        $(".js-error").html("");
                                    },
                                    yes: function (index) {

                                        addContactserValidate();

                                        if ($(".js-addContactser").valid()) {
                                            var data = ctrl.addUserVM.collectData();
                                            ctrl.addUserVM.reset();
                                            customerClearanceModel.saveExportContacts(data, function () {
                                                layer.close(layerAddContacts);
                                                ctrl.load();
                                            })
                                        }
                                    }
                                });
                            }
                        }
                    ]
                }
            },
            "bankAccount": {
                searchMeta: {
                    schema: {
                        simple: []
                    },
                    search: {
                        onSearch: function (data, searcher, click) {
                            return data;
                        }
                    },
                    selector: "bankAccount"
                },
                gridMeta: {
                    columns: header["bankAccount"],
                    primaryKey: "id",
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
                        elem: '.js_small_papogation2'
                    }
                },
                //type: "GET",
                url: X.config.customerClearance.api.getCompanyBankAccountListByPage,
                toolbar: {
                    items: [
                        {
                            ctrlType: "ToolbarButton",
                            name: "add",
                            title: "新增账户",
                            icon: "icon-add",
                            click: function (item) {
                                layer.ready(function(){
                                    addAccounterValidate();
                                });
                                var layerAddAccounter = layer.open({
                                    type: 1,
                                    content: view.find(".js-addAccounter"),
                                    title: "新增账户",
                                    area: ["405px", "580px"],
                                    btn: ["保存","取消"],
                                    success: function (layero, index) {
                                        ctrl.addAccounterVM.reset();
                                        $(".js-error").html("");
                                    },
                                    yes: function (index) {
                                        addAccounterValidate();

                                        if ($(".js-addAccounter").valid()) {
                                            var data = ctrl.addAccounterVM.collectData();
                                            ctrl.addAccounterVM.reset();
                                            customerClearanceModel.saveCompanyBankAccount(data, function (result) {
                                                layer.close(layerAddAccounter);
                                                ctrl.load();
                                            })
                                        }
                                    }
                                });
                            }
                        }
                    ]
                }
            }
        };

        return schemas;
    })();

    var schemas2 = (function () {
        var schemaList = [
            {
                tabName: "all",
                status: 0
            },
            {
                tabName: "draft",
                status: 1
            },
            {
                tabName: "under_review",
                status: 2
            },
            {
                tabName: "data",
                status: 3
            },
            {
                tabName: "review_passed",
                status: 4
            },
            {
                tabName: "review_temporary",
                status: 5
            },
            {
                tabName: "review_reject",
                status: 6
            }
        ];
        return createSchemas(schemaList);
    })();

    var lists = {};
    var activeTabLiInfo = "contacts";
    var activeTabLiInfo2 = "all";

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
                activeTabLiInfo = tabLiInfo;
                activeTabLi = targetLi;
                // 为了样式效果，把当前选中的前一个加上样式名
                targetLi.prev().addClass('tab_lineNone');
                if (tabLiInfo != oldTab) {
                    route.setRoute({panel: tabLiInfo});
                }

            }
        });

        var tabPannel2 = X.controls.getControl("TabPanel", $('.js_tabPannel2'), {
            activeTabInfo: activeTabLiInfo2,
            beforeChangeTab: function (tabLiInfo, targetLi, index, tabPage) {
                activeTabLiInfo2 = tabLiInfo;
                // 刊登状态 不同
                var page = $(tabPage);
                if (!page.data("hasInited")) {
                    var schema2 = schemas2[tabLiInfo];
                    if (schema2) {
                        initTabPage(page, schema2, tabLiInfo);
                    }
                    page.data("hasInited", true);
                }
                // 为了样式效果，把当前选中的前一个加上样式名
                targetLi.prev().removeClass('tab_lineNone');
                return true;
            },
            afterChangeTab: function (tabLiInfo, targetLi, index, tabPage, oldTab) {
                activeTabLiInfo2 = tabLiInfo;
                activeTabLi = targetLi;
                // 为了样式效果，把当前选中的前一个加上样式名
                targetLi.prev().addClass('tab_lineNone');
                if (tabLiInfo != oldTab) {
                    //route.setRoute({panel: tabLiInfo});
                }

            }
        });
    };

    //联系人管理-新增账户校验
    function addContactserValidate() {
        $(".js-addContactser").validate({
            rules: {
                contacts: {
                    required: true,
                    maxlength: 20
                },
                phone: {
                    required: true,
                    minlength: 11,
                    maxlength: 11,
                    isDigits: true,
                    isMobile: true
                },
                mobile: {
                    required: true,
                    isDigits: true,
                    maxlength: 20
                },
                email: {
                    email: true,
                    maxlength: 30
                }
            },
            messages: {
                contacts: {
                    required: "请输入联系人姓名",
                    maxlength: "联系人不能超过20个字符"
                },
                phone: {
                    required: "请输入11位手机号码",
                    minlength: "请输入11位手机号码",
                    maxlength: "请输入11位手机号码",
                    isDigits: "请输入正确的手机号码",
                    isMobile: "请输入13/14/15/17/18开头的手机号"
                },
                mobile: {
                    required: "请输入联系电话",
                    isDigits: "请输入正确的联系电话",
                    maxlength: "联系人不能超过20个字符"
                },
                email: {
                    email: "请输入正确的邮箱",
                    maxlength: "邮箱在30个字符内"
                }
            },
            onkeyup: false,
            onfocusout: function (element) {
                var elem = $(element);
                elem.valid();
            },
            success: function (value, element) {

            },
            errorPlacement: function (error, element) {
                error.appendTo(element.parent().find(".js-error"));
            },
            submitHandler: function (form) {

            }
        });
    }

    //银行账号管理-新增账户校验
    function addAccounterValidate() {
        $(".js-addAccounter").validate({
            ignore:"ignore",
            rules: {
                accountName: {
                    required: true,
                    maxlength: 50
                },
                bankName: {
                    required: true,
                    maxlength: 50
                },
                bankAccount: {
                    required: true,
                    isDigits: true,
                    maxlength: 50
                },
                bankContacts: {
                    maxlength: 10
                },
                bankPhoneNumber: {
                    isDigits: true,
                    maxlength: 20
                },
                bankImEmail: {
                    maxlength: 30
                }
            },
            messages: {
                accountName: {
                    required: "请输入开户名",
                    maxlength: "开户名不能超过50个字符"
                },
                bankName: {
                    required: "请输入开户行",
                    maxlength: "开户行不能超过50个字符"
                },
                bankAccount: {
                    required: "请输入银行账号",
                    isDigits: "请输入正确的银行账号",
                    maxlength: "银行账号不能超过50个字符"
                },
                bankContacts: {
                    maxlength: "联系人不能超过10个字符"
                },
                bankPhoneNumber: {
                    isDigits: "请输入数字",
                    maxlength: "联系电话不能超过20个字符"
                },
                bankImEmail: {
                    maxlength: "QQ/邮箱在30个字符内"
                }
            },
            onkeyup: false,
            onfocusout: function (element) {
                var elem = $(element);
                elem.valid();
            },
            success: function (value, element) {

            },
            errorPlacement: function (error, element) {
                error.appendTo(element.parent().find(".js-error"));
            },
            submitHandler: function (form) {

            }
        });
    }

    //创建head
    function createHead(tabList) {
        var head = {};
        var thead = [
            {
                field: {
                    name: "name",
                    title: "开票人名称",
                    type: "int"
                },
                itemRenderer: {
                    render: function (data, field, index, grid) {
                        return '<p class="word-cut w200" title="' + data.name + '">'+ data.name +'</p>';
                    }
                },
                width: "10%",
                className: "tL"
            },
            {
                field: {
                    name: "number",
                    title: "纳税人识别号",
                    type: "string"
                },
                width: "10%"
            },
            {
                field: {
                    name: "time",
                    title: "提交时间",
                    type: "string"
                },
                itemRenderer: {
                    render: function(data) {
                        return data.time.split(' ')[0];
                    }
                },
                width: "10%"
            },
            {
                field: {
                    name: "status",
                    title: "状态",
                    type: "string"
                },
                itemRenderer: {
                    render: function (data, field, index, grid) {
                        return customerClearanceModel.CONSTANTS.drawerStatus[data.status];
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
                        if (data.status === '1') {
                            var elems = $("<div><a class='orange-font mr10 curp js-edit'>编辑</a>|<a class='orange-font ml10 curp'>删除</a></div>")[0]
                            $(elems).find("a").eq(1).click(function (evt) {
                                evt.stopPropagation();
                                evt.preventDefault();
                                var layerDelete = layer.confirm('确认删除', {
                                    title:"提示",
                                    content: "<div class='tac'>确认删除？</div>",
                                    yes: function () {
                                        layer.close(layerDelete);
                                        customerClearanceModel.deleteExportContacts([data.id], function (result) {
                                            setTimeout(function () {
                                                ctrl.load();
                                            }, 400);
                                        });
                                    }
                                });
                            });
                            return elems;
                        } else {
                            var elems = $("<div><a class='orange-font curp'>详情</a></div>").click(function (evt) {
                                X.publish(X.CONSTANTS.channel.menuCall, {m: "customerClearance.drawerDetail", para: {drawerId: data["id"]}});
                            })[0];
                            return elems;
                        }
                    }
                },
                width: "10%"
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
                    schema: {
                        simple: [
                            {
                                name: "contacts",
                                inputName: "contacts",
                                title: "开票人名称",
                                ctrlType: "TextBox",
                                placeholder: "",
                                className: "mr30 w180"
                            },
                            {
                                name: "phone",
                                inputName: "phone",
                                title: "纳税人识别号",
                                ctrlType: "TextBox",
                                placeholder: "",
                                className: "mr60 w180"
                            }
                        ]
                    },
                    search: {
                        onSearch: function (data, searcher, click) {
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
                    columns: header2[schemaList[i].tabName],
                    primaryKey: "supplierId",
                    orderMode: 1,
                    afterRowRender: function (row, data, index) {
                        $(row.dom).find(".js-edit").click(function (evt) {
                            X.publish(X.CONSTANTS.channel.menuCall, {m: "customerClearance.drawerEdit", para: {drawerId: data["id"]}});
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
                type: "GET",
                url: X.config.customerClearance.api.getDrawerByPage,
                toolbar: {
                    items: [
                        {
                            ctrlType: "ToolbarButton",
                            name: "add",
                            title: "添加开票人",
                            icon: "icon-add",
                            click: function (item) {
                                X.publish(X.CONSTANTS.channel.menuCall, {m: "customerClearance.addDrawer"});
                            }
                        }
                    ]
                }
            };
            schemaItem[schemaList[i].tabName] = tbody;
        }
        return schemaItem;
    };

    var route = new routerHelper("customerClearance.settings", schemas, getRoute);
    return ctrl;

});