X.define("modules.user.userList", ["model.userModel", "modules.common.routerHelper"], function (userModel, routerHelper) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.user.tpl.userList
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
                        name: "userId",
                        title: "ID",
                        type: "int"
                    },
                    width: "3%",
                    className: "tL"
                },
                {
                    field: {
                        name: "mobile",
                        title: "手机号",
                        type: "string"
                    },
                    width: "12%"
                },
                {
                    field: {
                        name: "userName",
                        title: "姓名",
                        type: "string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            if (data.userName.length > 5) {
                                return data.userName.substr(0, 6) + "...";
                            } else {
                                return data.userName
                            }
                        }
                    },
                    width: "9%"
                },
                {
                    field: {
                        name: "companyNameCn",
                        title: "所属公司",
                        type: "string"
                    },
                    width: "20%"

                },
                {
                    field: {
                        name: "createDate",
                        title: "注册时间",
                        type: "string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            var arr = data.createDate.split(':');
                            arr.pop();
                            str = arr.join(':');
                            return str;
                        }
                    },
                    width: "14%"
                },
                {
                    field: {
                        name: "status",
                        title: "状态",
                        type: "string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            var result = '';
                            if (data.status === '0') {
                                result = userModel.statusconst.status.PENDING.text;
                            } else if (data.status === '1') {
                                result = userModel.statusconst.status.PASS.text;
                            } else if (data.status === '2') {
                                result = userModel.statusconst.status.REJECT.text;
                            }

                            return result;
                        }
                    },

                    width: "8%"
                },
                {
                    field: {
                        name: "status",
                        title: "操作",
                        type: "operation"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            var result = '';
                            if (data.status === '0') {
                                result = '<a class="colBlue curp">审核</a>';
                            } else if (data.status === '1' || data.status === '2') {
                                result = '<a class="colBlue curp">详情</a>';
                            }

                            return result;
                        }
                    },
                    width: "10%",
                    className: "operation_main"
                }
            ],
            "pending": [
                {
                    field: {
                        name: "userId",
                        title: "ID",
                        type: "int"
                    },
                    width: "3%",
                    className: "tL"
                },
                {
                    field: {
                        name: "mobile",
                        title: "手机号",
                        type: "string"
                    },
                    width: "12%"
                },
                {
                    field: {
                        name: "userName",
                        title: "姓名",
                        type: "string"
                    },
                    width: "9%"
                },
                {
                    field: {
                        name: "companyNameCn",
                        title: "所属公司",
                        type: "string"
                    },
                    width: "20%"

                },
                {
                    field: {
                        name: "createDate",
                        title: "注册时间",
                        type: "string"
                    },
                    width: "14%"
                },
                {
                    field: {
                        name: "status",
                        title: "状态",
                        type: "string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            var result = '';
                            if (data.status === '0') {
                                result = userModel.statusconst.status.PENDING.text;
                            } else if (data.status === '1') {
                                result = userModel.statusconst.status.PASS.text;
                            } else if (data.status === '2') {
                                result = userModel.statusconst.status.REJECT.text;
                            }

                            return result;
                        }
                    },

                    width: "8%"
                },
                {
                    field: {
                        name: "",
                        title: "操作",
                        type: "operation"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            var result = '';
                            if (data.status === '0') {
                                result = '<a  class="colBlue curp">审核</a>';
                            } else if (data.status === '1' || data.status === '2') {
                                result = '<a  class="colBlue curp">详情</a>';
                            }

                            return result;
                        }
                    },
                    width: "10%",
                    className: "operation_main"
                }
            ],
            "adopted": [
                {
                    field: {
                        name: "userId",
                        title: "ID",
                        type: "int"
                    },
                    width: "3%",
                    className: "tL"
                },
                {
                    field: {
                        name: "mobile",
                        title: "手机号",
                        type: "string"
                    },
                    width: "12%"
                },
                {
                    field: {
                        name: "userName",
                        title: "姓名",
                        type: "string"
                    },
                    width: "9%"
                },
                {
                    field: {
                        name: "companyNameCn",
                        title: "所属公司",
                        type: "string"
                    },
                    width: "20%"

                },
                {
                    field: {
                        name: "createDate",
                        title: "注册时间",
                        type: "string"
                    },
                    width: "14%"
                },
                {
                    field: {
                        name: "status",
                        title: "状态",
                        type: "string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            var result = '';
                            if (data.status === '0') {
                                result = userModel.statusconst.status.PENDING.text;
                            } else if (data.status === '1') {
                                result = userModel.statusconst.status.PASS.text;
                            } else if (data.status === '2') {
                                result = userModel.statusconst.status.REJECT.text;
                            }

                            return result;
                        }
                    },

                    width: "8%"
                },
                {
                    field: {
                        name: "",
                        title: "操作",
                        type: "operation"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            var result = '';
                            if (data.status === '0') {
                                result = '<a  class="colBlue curp">审核</a>';
                            } else if (data.status === '1' || data.status === '2') {
                                result = '<a  class="colBlue curp">详情</a>';
                            }

                            return result;
                        }
                    },
                    width: "10%",
                    className: "operation_main"
                }
            ],
            "rejected": [
                {
                    field: {
                        name: "userId",
                        title: "ID",
                        type: "int"
                    },
                    width: "3%",
                    className: "tL"
                },
                {
                    field: {
                        name: "mobile",
                        title: "手机号",
                        type: "string"
                    },
                    width: "12%"
                },
                {
                    field: {
                        name: "userName",
                        title: "姓名",
                        type: "string"
                    },
                    width: "9%"
                },
                {
                    field: {
                        name: "companyNameCn",
                        title: "所属公司",
                        type: "string"
                    },
                    width: "20%"

                },
                {
                    field: {
                        name: "createDate",
                        title: "注册时间",
                        type: "string"
                    },
                    width: "14%"
                },
                {
                    field: {
                        name: "status",
                        title: "状态",
                        type: "string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            var result = '';
                            if (data.status === '0') {
                                result = userModel.statusconst.status.PENDING.text;
                            } else if (data.status === '1') {
                                result = userModel.statusconst.status.PASS.text;
                            } else if (data.status === '2') {
                                result = userModel.statusconst.status.REJECT.text;
                            }

                            return result;
                        }
                    },

                    width: "8%"
                },
                {
                    field: {
                        name: "",
                        title: "操作",
                        type: "operation"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            var result = '';
                            if (data.status === '0') {
                                result = '<a  class="colBlue curp">审核</a>';
                            } else if (data.status === '1' || data.status === '2') {
                                result = '<a  class="colBlue curp">详情</a>';
                            }

                            return result;
                        }
                    },
                    width: "10%",
                    className: "operation_main"
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
                                name: "companyNameCn",
                                inputName: "companyNameCn",
                                title: "所属公司",
                                ctrlType: "TextBox",
                                placeholder: "请输入所属公司"
                            },
                            {
                                name: "mobile",
                                inputName: "mobile",
                                title: "手机号码",
                                ctrlType: "TextBox",
                                placeholder: "请输入11位手机号码"
                            },
                            {
                                name: "status",
                                inputName: "status",
                                title: "状态",
                                ctrlType: "ComboBox",
                                dataSource: userModel.statusconst.cases
                            },
                            {
                                name: "userId",
                                inputName: "userId",
                                title: "用户ID",
                                ctrlType: "TextBox",
                                placeholder: "请输入用户ID"
                            }
                        ]
                    },
                    search: {
                        onSearch: function (data, searcher, click) {
                            if (click) {
                                route.setRoute(getRoute());
                            }
                            if(data.query.userId && isNaN(data.query.userId)){
                                data.query.userId = -1;
                            }
                            data.query.tabType = '0';
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
                url: X.config.user.api.userlistByPage,
                toolbar: {
                    items: [
                        {
                            ctrlType: "ToolbarButton",
                            name: "add",
                            title: "新增用户",
                            icon: "icon-add",
                            click: function (item) {
                                X.router.run("m=user.userEdit", "");
                            }
                        }
                    ]
                }

            },
            "pending": {
                searchMeta: {
                    schema: {
                        simple: [
                            {
                                name: "companyNameCn",
                                inputName: "companyNameCn",
                                title: "所属公司",
                                ctrlType: "TextBox",
                                placeholder: "请输入所属公司"
                            },
                            {
                                name: "mobile",
                                inputName: "mobile",
                                title: "手机号码",
                                ctrlType: "TextBox",
                                placeholder: "请输入11位手机号码"
                            },
                            {
                                name: "userId",
                                inputName: "userId",
                                title: "用户ID",
                                ctrlType: "TextBox",
                                placeholder: "请输入用户ID"
                            }
                        ]
                    },
                    search: {
                        onSearch: function (data, searcher, click) {
                            if (click) {
                                route.setRoute(getRoute());
                            }
                            if(data.query.userId && isNaN(data.query.userId)){
                                data.query.userId = -1;
                            }
                            data.query.tabType = '3';
                            return data;
                        }
                    },
                    selector: "pending",
                    reset: {
                        show: false
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
                url: X.config.user.api.userlistByPage,
                toolbar: {
                    items: [
                        {
                            ctrlType: "ToolbarButton",
                            name: "add",
                            title: "新增用户",
                            icon: "icon-add",
                            click: function (item) {
                                X.router.run("m=user.userEdit", "");
                            }
                        }
                    ]
                }

            },
            "adopted": {
                searchMeta: {
                    schema: {
                        simple: [
                            {
                                name: "companyNameCn",
                                inputName: "companyNameCn",
                                title: "所属公司",
                                ctrlType: "TextBox",
                                placeholder: "请输入所属公司"
                            },
                            {
                                name: "mobile",
                                inputName: "mobile",
                                title: "手机号码",
                                ctrlType: "TextBox",
                                placeholder: "请输入11位手机号码"
                            },
                            {
                                name: "userId",
                                inputName: "userId",
                                title: "用户ID",
                                ctrlType: "TextBox",
                                placeholder: "请输入用户ID"
                            }
                        ]
                    },
                    search: {
                        onSearch: function (data, searcher, click) {
                            if (click) {
                                route.setRoute(getRoute());
                            }
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
                url: X.config.user.api.userlistByPage,
                toolbar: {
                    items: [
                        {
                            ctrlType: "ToolbarButton",
                            name: "add",
                            title: "新增用户",
                            icon: "icon-add",
                            click: function (item) {
                                X.router.run("m=user.userEdit", "");
                            }
                        }
                    ]
                }

            },
            "rejected": {
                searchMeta: {
                    schema: {
                        simple: [
                            {
                                name: "companyNameCn",
                                inputName: "companyNameCn",
                                title: "所属公司",
                                ctrlType: "TextBox",
                                placeholder: "请输入所属公司"
                            },
                            {
                                name: "mobile",
                                inputName: "mobile",
                                title: "手机号码",
                                ctrlType: "TextBox",
                                placeholder: "请输入11位手机号码"
                            },
                            {
                                name: "userId",
                                inputName: "userId",
                                title: "用户ID",
                                ctrlType: "TextBox",
                                placeholder: "请输入用户ID"
                            }
                        ]
                    },
                    search: {
                        onSearch: function (data, searcher, click) {
                            if (click) {
                                route.setRoute(getRoute());
                            }
                            if(data.query.userId && isNaN(data.query.userId)){
                                data.query.userId = -1;
                            }
                            data.query.tabType = '2';
                            return data;
                        }
                    },
                    selector: "rejected",
                    reset: {
                        show: false
                    }
                },
                gridMeta: {
                    columns: header["rejected"],
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
                url: X.config.user.api.userlistByPage,
                toolbar: {
                    items: [
                        {
                            ctrlType: "ToolbarButton",
                            name: "add",
                            title: "新增用户",
                            icon: "icon-add",
                            click: function (item) {
                                X.router.run("m=user.userEdit", "");
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

    var route = new routerHelper("user.userList", schemas, getRoute);


    return ctrl;

});
