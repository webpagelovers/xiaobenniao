X.define("modules.agent.agentList",["model.agentModel","common.layer","modules.common.routerHelper"],function (agentModel,layer,routerHelper) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.agent.tpl.agentList
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {
        view.render({},function(){
            activeTabLiInfo = route.getRoute() || activeTabLiInfo;
            ctrl.initPage()
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
                        title: "编号",
                        type: "string"
                    },
                    width: "5%",
                    className: "tL"
                },
                {
                    field: {
                        name: "firstName",
                        title: "姓名",
                        type: "string"
                    },
                    width: "8%"
                },
                {
                    field: {
                        name: "location",
                        title: "国家",
                        type: "string"
                    },
                    width: "9%"
                },
                {
                    field: {
                        name: "mobile",
                        title: "电话",
                        type: "string"
                    },
                    width: "6%"

                },
                {
                    field: {
                        name: "email",
                        title: "邮箱",
                        type: "string"
                    },
                    width: "6%"

                },
                {
                    field: {
                        name: "workCondition",
                        title: "类型",
                        type: "string"
                    },
                    width: "6%",
                    itemRenderer: {
                        render: function (data) {
                            if (data.workCondition == '0') {
                                return 'freelancer';
                            } else if (data.workCondition == '1') {
                                return 'employee';
                            }
                        }
                    }

                },
                {
                    field: {
                        name: "quoteCount",
                        title: "参与报价（次）",
                        type: "string"
                    },
                    width: "6%"

                },
                {
                    field: {
                        name: "createDate",
                        title: "注册时间",
                        type: "string"
                    },
                    width: "15%",
                    itemRenderer: {
                        render: function (data) {
                            var temp = data.createDate;
                            if (temp.indexOf(':') != temp.lastIndexOf(':')) {
                                temp = temp.slice(0, temp.lastIndexOf(':'));
                            }
                            return temp;
                        }
                    }
                }
            ]
        }
    })();

    var formatSearchData = function(data){
        var createDateRange = data.query.createDate;
        if(createDateRange){
            var createDateRanges=createDateRange.split("@");
            var beginTime=createDateRanges[0];
            var endTime=createDateRanges[1];
            data.query.startDate = beginTime;
            data.query.endDate = endTime;
        }
        delete data.query.createDate;

        return data;
    };

    var getRoute = function () {
        var route = {panel:activeTabLiInfo,ldata:lists[activeTabLiInfo].val()};
        return route;
    };

    var schemas = (function(){

        var schemas = {
            "tabAll" :  {
                searchMeta: {
                    schema: {
                        simple:[
                            {
                                name:"firstName",
                                title:"姓名",
                                ctrlType:"TextBox",
                                placeholder:"name",
                            },
                            {
                                name:"createDate",
                                title:"注册日期",
                                ctrlType:"DateRangePicker",
                                placeholder:"2015/6/22-2016/2/16"
                            }
                        ]
                    },
                    search: {
                        onSearch : function (data,searcher,click) {
                            if(click){
                                route.setRoute(getRoute());
                            }
                            return formatSearchData(data);
                        }
                    },
                    reset :{
                        show:true
                    }
                },
                gridMeta :{
                    columns : header["tabAll"],
                    primaryKey:agentModel.option.idAttribute,
                    orderMode : 1,
                    afterRowRender: function (row, data) {
                        // $(row.dom).on("click", function () {
                        //     X.router.run("m=agent.agentDetail&userId=" + data["userId"]);
                        // });

                        // if (data.readStatus == 0) {
                        //     $(row.dom).css({"font-weight": "bold"})
                        // }

                    }
                },
                pageInfo : {
                    pageSize : '10',
                    totalPages : '10',
                    pageNo: '1',
                    smallPapogation: {
                        isShow: false,
                        elem: '.js_small_papogation1'
                    }
                },
                //type: 'GET',
                url : X.config.agent.api.agentList,
                toolbar : {
                    items: [
                        {
                            ctrlType:"ToolbarButton",
                            name:"csvFile",
                            title:"导出",
                            icon:"icon-daochu",
                            click:function (item) {
                                //var url = X.config.agent.api.csvFile;
                                var pageInfo = schemas.tabAll.pageInfo,
                                    option = {
                                        data: lists[activeTabLiInfo].condition,
                                        callback: function(result) {
                                            result = "编号,操作内容,操作时间,操作人ID,登录IP,\n" +
                                                "1262,后台用户管理-登录:后台管理员用户名=ftfbiz;后台管理员密码=xbn1234;,2016-11-02 07:12:19.0,2,172.16.2.173,\n" +
                                                "1264,用户管理-增加用户:用户名称=mingjia5;,2016-11-02 15:20:25.0,1,172.16.2.244,\n" +
                                                "1266,用户管理-激活或冻结用户:用户Id=236;状态（0-激活，1-冻结）=1;,2016-11-02 15:47:10.0,1,172.16.2.244";
                                            var blob = new Blob(['\ufeff' + result], {type: 'text/cfv'}),
                                                url  = URL.createObjectURL(blob),
                                                link = ctrl.view.el.find('.listButton.js-csvFile'),
                                                href = $('<a href="'+url+'" class="chk" download="操作日志.csv"></a>')

                                            link.after(href);
                                            href[0].click();
                                            href.remove();
                                        }
                                    };

                                agentModel.export(option);
                                //ctrl.view.el.find(".js-spreadDownload").attr("src",url);
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
    function initTabPage($elem,schema,tabPage) {
        var list = X.controls.getControl("List",$elem,schema);
        list.init();
        lists[tabPage] = list;
    }
    ctrl.initPage  =function (){
        var tabPannel = X.controls.getControl("TabPanel",$('.js_tabPannel1'), {
            activeTabInfo: activeTabLiInfo,
            beforeChangeTab: function (tabLiInfo, targetLi, index, tabPage) {
                activeTabLiInfo = tabLiInfo;
                // 刊登状态 不同
                var page = $(tabPage);
                if(!page.data("hasInited")){
                    var schema = schemas[tabLiInfo];
                    if(schema){
                        initTabPage(page,schema,tabLiInfo);
                    }
                    page.data("hasInited",true);
                }
                // 为了样式效果，把当前选中的前一个加上样式名
                targetLi.prev().removeClass('tab_lineNone');
                return true;
            },
            afterChangeTab: function (tabLiInfo, targetLi, index, tabPage) {
                activeTabLiInfo = tabLiInfo;
                activeTabLi = targetLi;
                // 为了样式效果，把当前选中的前一个加上样式名
                targetLi.prev().addClass('tab_lineNone');
            }
        });
    };

    var route = new routerHelper("agent.agentList",schemas,getRoute);

    return ctrl;

});

