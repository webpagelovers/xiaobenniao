X.define("modules.system.systemlogList",["model.systemLogModel","common.layer","modules.common.routerHelper"],function (systemLogModel,layer,routerHelper) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.systemLog.tpl.systemlogList
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

    var header = (function () {
        return {
            "tabAll": [
                {
                    field: {
                        name: "backendUserName",
                        title: "操作人",
                        type: "string"
                    },
                    width: "5%",
                    className: "tL"
                },
                {
                    field: {
                        name: "operationDetail",
                        title: "行为",
                        type: "string"
                    },
                    width: "15%"
                },
                {
                    field: {
                        name: "createDate",
                        title: "时间",
                        type: "string"
                    },
                    width: "9%"
                },
                {
                    field: {
                        name: "ipAddress",
                        title: "IP",
                        type: "string"
                    },
                    width: "6%"

                },
                {
                    field: {
                        name: "",
                        title: "操作",
                        type: "operation"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return $("<i class='iconfont icon-lajitong'></i>")
                                .on("click", function (event) {
                                    var deldata =[];
                                    deldata.push(data.operationLogId);
                                    layer.successConfirm('确认删除？', function(index){
                                        systemLogModel.systemLogDelete(deldata,function(){
                                            layer.successMsg('删除成功',function(){
                                                layer.closeIt();
                                            });
                                            lists["tabAll"].loadData();
                                        });

                                    });

                                })[0];
                        }
                    },
                    width: "10%",
                    className: "operation_main"

                }
            ]
        }
    })();
    var formatSearchData = function(data){
        var createDateRange = data.query.createDateRange;
        if(createDateRange){
            createDateRanges=createDateRange.split("@");
            beginTime=createDateRanges[0]+" 00:00:00";
            endTime=createDateRanges[1]+" 23:59:59";
            data.query.createDateRange ={beginTime:beginTime,endTime:endTime};
        }
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
                                name:"backendUserName",
                                title:"操作人",
                                ctrlType:"TextBox",
                                placeholder :"请输入操作人姓名"
                            },
                            {
                                name:"createDateRange",
                                title:"操作时间",
                                ctrlType:"DateRangePicker",
                                placeholder:"2015/6/22-2016/2/16"
                            },
                            {
                                name:"ipAddress",
                                title:"IP",
                                ctrlType:"TextBox",
                                placeholder :"输入IP地址"
                            },
                            {
                                name:"operationId",
                                title:"功能模块",
                                ctrlType:"ComboBox",
                                refUrl : X.config.systemLog.api.operationModules,
                                refKey : "operationId",
                                refValue : "operationName"
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
                    primaryKey:systemLogModel.option.idAttribute,
                    orderMode : 1
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
                url : X.config.systemLog.api.operationLogListByPage,
                toolbar : {
                    items: [
                        {
                            ctrlType:"ToolbarButton",
                            name:"csvFile",
                            title:"导出",
                            icon:"icon-daochu",
                            click:function (item) {
                                //var url = X.config.systemLog.api.csvFile;
                                var pageInfo = schemas.tabAll.pageInfo,
                                    option = {
                                        data: lists[activeTabLiInfo].condition,
                                        callback: function(result) {
                                            var blob = new Blob(['\ufeff' + result], {type: 'text/cfv'}),
                                                url  = URL.createObjectURL(blob),
                                                link = ctrl.view.el.find('.listButton.js-csvFile'),
                                                href = $('<a href="'+url+'" class="chk" download="操作日志.csv"></a>')

                                            link.after(href);
                                            href[0].click();
                                            href.remove();
                                        }
                                    };

                                systemLogModel.export(option);
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

    ctrl.load = function (para) {
        ctrl.rendering();
    };

    var route = new routerHelper("system.systemlogList",schemas,getRoute);

    return ctrl;

});

