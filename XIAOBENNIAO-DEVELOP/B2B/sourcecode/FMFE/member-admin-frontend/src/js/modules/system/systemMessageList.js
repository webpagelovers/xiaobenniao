X.define("modules.system.systemMessageList",["model.systemMessageModel","common.layer","modules.common.routerHelper"],function (systemMessageModel,layer,routerHelper) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.system.tpl.systemMessageList
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {
        view.render({},function(){
            ctrl.initPage()
        });
    };
    ctrl.load = function (para) {
        activeTabLiInfo = route.getRoute() || activeTabLiInfo;
        ctrl.rendering();
    };

    var formatSearchData = function(data){
        var createDateRange = data.query.createDateRange;
        if(createDateRange){
            createDateRanges=createDateRange.split("@");
            beginTime=createDateRanges[0];
            endTime=createDateRanges[1];
            data.query.createDateRange ={beginTime:beginTime,endTime:endTime};
        }
        return data;
    };
    var header ={
        "tabAll" :[
            {
                field:{
                    name:"title",
                    title:"通知标题",
                    type:"string"
                },
                width:"5%",
                className:"tL"
            },
            {
                field:{
                    name:"content",
                    title:"通知内容",
                    type:"string"
                },
                width:"17%",
                className:"breakAll"
            },
            {
                field:{
                    name: "receiveUserCompanyType",
                    title:"接受范围",
                    type:"string"
                },
                itemRenderer:{
                    render: function(data, field, index, grid){
                        return (data.receiveUserCompanyType == systemMessageModel.const.receiver[0].key) ? systemMessageModel.const.receiver[0].value : (data.receiveUserCompanyType == systemMessageModel.const.receiver[1].key ? systemMessageModel.const.receiver[1].value : systemMessageModel.const.receiver[2].value);
                    }
                },
                width:"9%"
            },
            {
                field:{
                    name:"sendUserRealname",
                    title:"创建人",
                    type:"string"
                },
                width:"6%"

            },
            {
                field:{
                    name:"createDate",
                    title:"创建时间",
                    type:"string"
                },
                width:"12%"
            },
            /*{
                field:{
                    name:"status",
                    title:"状态",
                    type:"string"
                },
                itemRenderer:{
                    render: function(data, field, index, grid){
                        return (data.status == systemMessageModel.const.status.UNPOST.key)?systemMessageModel.const.status.UNPOST.text:systemMessageModel.const.status.POSTED.text;
                    }
                },
                width:"12%"
            },*/
            {
                field:{
                    name:"operation",
                    title:"操作",
                    type:"operation"
                },
                itemRenderer: {
                    render: function (data, field, index, grid) {
                        if(data.status == systemMessageModel.const.status.UNPOST.key){
                            var $edit = $("<i class='iconfont icon-write pr10'></i>")
                                .on("click", function (event) {
                                    event.stopPropagation();
                                    X.router.run("m=system.systemmessageEdit&messageId=" + data["messageId"]);
                                });
                            var $delete = $("<i class='iconfont icon-lajitong '></i>")
                                .on("click", function (event) {
                                    var deldata = [];
                                    deldata.push(data.messageId);
                                    event.stopPropagation();
                                    layer.successConfirm('确认删除？', function(index){
                                        systemMessageModel.messageDelete(deldata,function(){
                                            layer.successMsg('删除成功',function(){
                                                layer.closeIt();
                                            });
                                            lists["tabAll"].loadData();
                                        });

                                    });

                                });

                            return  $("<div></div>").append($edit).append($delete)[0];
                        }


                    }
                },
                width:"10%",
                className:"operation_main"
            }
        ]
    };

    var address = {

    };
    var option = {
        meta :{ "licenseCode": {dataSource : address}
        }
    };

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
            "tabAll" :{
                    searchMeta: {
                        schema: {
                            simple:[
                                {
                                    name:"title",
                                    title:"标题",
                                    ctrlType:"TextBox",
                                    placeholder :"请输入标题内容"
                                },
                                {
                                    name:"sendUserRealname",
                                    title:"创建人",
                                    ctrlType:"TextBox",
                                    placeholder :"输入创建人姓名"
                                },
                                {
                                    name:"receiveUserCompanyType",
                                    title:"接受者范围",
                                    ctrlType:"ComboBox",
                                    dataSource: systemMessageModel.const.receiver
                                },
                                {
                                    name:"createDateRange",
                                    title:"创建时间",
                                    ctrlType:"DateRangePicker",
                                    placeholder:"2015/6/22-2016/2/16"
                                }
                            ]
                        },
                        search: {
                            onSearch : function (data,searcher,click) {                            
                                if(click){
                                    //storeHelper.setStore(tabPannel);
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
                        orderMode : 1,
                        primaryKey:"messageId",
                        orderMode : 1,
                        afterRowRender: function (row, data) {
                            $(row.dom).on("click", function () {

                                X.router.run("m=system.systemMessageDisplay&messageId=" + data["messageId"]);

                            });
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
                    url : X.config.system.api.systemMessageListByPage,
                    toolbar : {
                        items: [
                            {
                                ctrlType:"ToolbarButton",
                                name:"add",
                                title:"创建系统消息",
                                icon:"icon-add",
                                click:function (item) {
                                    X.router.run("m=system.systemmessageEdit","");
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
            afterChangeTab: function (tabLiInfo, targetLi, index, tabPage,oldTab) {
                activeTabLiInfo = tabLiInfo;
                activeTabLi = targetLi;
                // 为了样式效果，把当前选中的前一个加上样式名
                targetLi.prev().addClass('tab_lineNone');
                if(tabLiInfo!=oldTab){
                    route.setRoute({panel:tabLiInfo});
                }                
            }
        });
    };


     var route = new routerHelper("system.systemMessageList",schemas,getRoute);
    return ctrl;

});
