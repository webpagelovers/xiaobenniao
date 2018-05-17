X.define("modules.infoManage.myResponseList", ["modules.common.routerHelper","model.infoManageModel", "modules.common.moment"],function (routerHelper, infoManageModel, moment) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.infoManage.tpl.myResponseList
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {
        return view.render({},function () {
            activeTabLiInfo = route.getRoute() || activeTabLiInfo;
            ctrl.initPage();
        });

    };

    var getRoute = function () {
        var route = {panel:activeTabLiInfo, ldata:lists[activeTabLiInfo].val()};
        return route;
    };

    var header = (function () {
        return {
            "tabAll" :  [
                {
                    field:{
                        name:"title",
                        title:"公告名称",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function(data) {
                            return '<p class="word-cut w180" title="' + data.title + '">'+ data.title +'</p>'
                        }
                    },
                    width:"20%",
                    className:"tL"
                },
                {
                    field:{
                        name: "country",
                        title:"国别",
                        type:"string"
                    },
                    width:"15%"
                },
                {
                    field:{
                        name:"createDate",
                        title:"发布日期",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function(data) {
                            return data.createDate.split(' ')[0];
                        }
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"purchaseNum",
                        title:"采购数量",
                        type:"string"
                    },
                    width:"15%"
                },
                {
                    field:{
                        name:"infoType",
                        title:"类型",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function(data) {
                            return infoManageModel.CONSTANTS.infoType[data.infoType].value;
                        }
                    },
                    width:"10%",
                    className:"tL"
                },
                {
                    field:{
                        name:"",
                        title:"操作",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data) {
                            return $('<span class="colff6 curp">详情</span>').on("click",function () {
                                X.publish(X.CONSTANTS.channel.menuCall, {m: "infoManage.myResponseDetail", para:{purchaseInfoId:data["purchaseInfoId"], response:true}});
                            })[0];
                        }
                    },
                    className: "operation_main",
                    width:"10%"
                }
            ]
        }
    })();

    var schemas = (function(){
        var schemas = {
            "tabMyResponse" :{
                searchMeta: {
                    schema: {
                        simple:[
                            {
                                name:"title",
                                inputName: "formNumber",
                                title:"公告名称",
                                ctrlType:"TextBox",
                                placeholder:"请输入公告名称",
                                className : "mr60"
                            },
                            {
                                name:"createDate",
                                inputName: "createDate",
                                title:"发布日期",
                                ctrlType:"DateRangePicker",
                                placeholder:"",
                                className : "mr30"
                            }
                        ]
                    },
                    search: {
                        onSearch : function (data) {
                            if (data.query.title) {
                                data.query.searchString = data.query.title;
                                delete data.query.title;
                            }
                            if(data.query.createDate){
                                data.query.createDate = data.query.createDate.split('@');
                                data.query.startTimeRange = {
                                    "beginTime": data.query.createDate[0],
                                    "endTime": data.query.createDate[1]
                                };
                                delete data.query.createDate;
                            }
                            return data;
                        }
                    },
                    reset :{
                        show:false
                    }
                },
                gridMeta :{
                    columns : header["tabAll"],
                    /*afterRowRender: function (row, data) {
                        if (data.infoType === "0") {
                            $(row.dom).find(".js-infoType").text('询价');
                        } else if (data.infoType === "1") {
                            $(row.dom).find(".js-infoType").text('招标');
                        }
                        if (data.noticeable === "0") {
                            $(row.dom).find(".js-noticeable").text('');
                        } else if (data.noticeable === "1") {
                            $(row.dom).find(".js-noticeable").text('new');
                        }
                        if (data.responseResult === '0') {
                            $(row.dom).find(".js-status").text("待反馈");
                            $(row.dom).find('.js-status-img').hide();
                        } else if (data.responseResult === '1') {
                            $(row.dom).find(".js-status").text("已反馈");
                            $(row.dom).find('.js-status-img').attr('src', '././images/winner.png');
                        } else if (data.responseResult === '2') {
                            $(row.dom).find(".js-status").text("已反馈");
                            $(row.dom).find('.js-status-img').hide();
                        } else if (data.responseResult === '3') {
                            $(row.dom).find(".js-status").text("已反馈");
                            $(row.dom).find('.js-status-img').hide();
                        } else if (data.responseResult === '4') {
                            $(row.dom).find(".js-status").text("已反馈");
                            $(row.dom).find('.js-status-img').attr('src', '././images/purpose.png');
                        } else if (data.responseResult === '5') {
                            $(row.dom).find(".js-status").text("已反馈");
                            $(row.dom).find('.js-status-img').hide();
                        }
                        if (data.responseNewMessageCount === 0) {
                            $(row.dom).find(".js-messageCount").html("");
                        } else {
                            $(row.dom).find(".js-messageCount").html('新回复<span class="redFont">' + data.responseNewMessageCount + '</span>');
                        }
                        var myDate = new Date();
                        myDate.toLocaleDateString();

                        var systemDateTime = data.systemDateTime;

                        if (systemDateTime) {
                            var dueDate = data.dueDate;
                            var dayCount = Math.ceil((moment(dueDate) - moment(systemDateTime)) / (1000 * 60 * 60 * 24));
                            moment(dueDate);
                            dueDate = dueDate.split(' ')[0].replace(/[-]/g, '');
                            $(row.dom).find(".js-dueDate").html(dueDate);
                            if (dayCount <= 0) {
                                $(row.dom).find(".js-dueDateStatus").html('已过截止日期');
                            } else {
                                $(row.dom).find(".js-dueDateStatus").html('剩余' + dayCount + '天');
                            }
                        }

                        $(row.dom).find('.js-title').on("click", function (event) {
                            event.stopPropagation();
                            X.router.run("m=infoManage.myResponseDetail&myResponseId=" + data["responseId"]);

                            var callback = function (result) {
                                if (result.statusCode == 2000000) {
                                    X.publish(X.CONSTANTS.channel.menuUpdate, "statistics");
                                }
                            };
                            infoManageModel.clearMyResponseNotice(data["responseId"], callback);
                            var callback = function (result) {
                                X.publish(X.CONSTANTS.channel.menuUpdate, "customerMessge");
                            };
                            infoManageModel.readByBussinessId(data["purchaseInfoId"], callback);
                        });
                    }*/
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
                url : X.config.infoManage.api.myResponseList
            }
        };
        return schemas;
    })();

    var lists = {};
    var activeTabLiInfo = 'tabMyResponse';
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
            afterChangeTab: function (tabLiInfo, targetLi, index, tabPage, oldTab) {
                activeTabLiInfo = tabLiInfo;
                activeTabLi = targetLi;
                // 为了样式效果，把当前选中的前一个加上样式名
                targetLi.prev().addClass('tab_lineNone');
                if(tabLiInfo != oldTab){
                    route.setRoute({panel:tabLiInfo});
                }
            }
        });
    };

    ctrl.load = function (para) {
        ctrl.rendering();
    };

    var route = new routerHelper("infoManage.myResponseList", schemas, getRoute);

    return ctrl;

});