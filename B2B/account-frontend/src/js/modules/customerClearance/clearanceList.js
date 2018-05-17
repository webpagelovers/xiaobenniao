X.define("modules.customerClearance.clearanceList",["modules.common.routerHelper","model.customerClearanceModel"],function (routerHelper,customerClearanceModel) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.customerClearance.tpl.clearanceList
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


    ctrl.load = function (para) {
        ctrl.rendering();
    };

    var header = (function () {
        return {
            "tabAll" :  [
                {
                    field:{
                        name:"formNumber",
                        title:"单号",
                        type:"int"
                    },
                    width:"10%",
                    className:"tL"
                },
                {
                    field:{
                        name: "customsPort",
                        title:"出口口岸",
                        type:"string"
                    },
                    width:"12%"
                },
                {
                    field:{
                        name:"tradeNation",
                        title:"运抵国",
                        type:"string"
                    },
                    width:"15%"
                },
                {
                    field:{
                        name:"exportGoodsInfo",
                        title:"货品",
                        type:"string"
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"createDate",
                        title:"创建时间",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return data.createDate.split(/\s+/g)[0];
                        }
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"status",
                        title:"状态",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return customerClearanceModel.CONSTANTS.status[data.status];
                        }
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"",
                        title:"操作",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return menuCall(data);
                        }
                    },
                    width:"10%"
                }
            ],
            "tabPending": [
                {
                    field:{
                        name:"formNumber",
                        title:"单号",
                        type:"int"
                    },
                    width:"10%",
                    className:"tL"
                },
                {
                    field:{
                        name: "customsPort",
                        title:"出口口岸",
                        type:"string"
                    },
                    width:"12%"
                },
                {
                    field:{
                        name:"tradeNation",
                        title:"运抵国",
                        type:"string"
                    },
                    width:"15%"
                },
                {
                    field:{
                        name:"exportGoodsInfo",
                        title:"货品",
                        type:"string"
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"createDate",
                        title:"创建时间",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return data.createDate.split(/\s+/g)[0];
                        }
                    },
                    width:"10%"
                },                {
                    field:{
                        name:"status",
                        title:"状态",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return customerClearanceModel.CONSTANTS.status[data.status];
                        }
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"",
                        title:"操作",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return menuCall(data);
                        }
                    },
                    width:"10%"
                }
            ],
            "tabCompleted" : [
                {
                    field:{
                        name:"formNumber",
                        title:"单号",
                        type:"int"
                    },
                    width:"10%",
                    className:"tL"
                },
                {
                    field:{
                        name: "customsPort",
                        title:"出口口岸",
                        type:"string"
                    },
                    width:"12%"
                },
                {
                    field:{
                        name:"tradeNation",
                        title:"运抵国",
                        type:"string"
                    },
                    width:"15%"
                },
                {
                    field:{
                        name:"exportGoodsInfo",
                        title:"货品",
                        type:"string"
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"createDate",
                        title:"创建时间",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return data.createDate.split(/\s+/g)[0];
                        }
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"status",
                        title:"状态",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return customerClearanceModel.CONSTANTS.status[data.status];
                        }
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"",
                        title:"操作",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return menuCall(data);
                       }
                    },
                    width:"10%"
                }
            ],
            "tabCancelled" : [
                {
                    field:{
                        name:"formNumber",
                        title:"单号",
                        type:"int"
                    },
                    width:"10%",
                    className:"tL"
                },
                {
                    field:{
                        name: "customsPort",
                        title:"出口口岸",
                        type:"string"
                    },
                    width:"12%"
                },
                {
                    field:{
                        name:"tradeNation",
                        title:"运抵国",
                        type:"string"
                    },
                    width:"15%"
                },
                {
                    field:{
                        name:"exportGoodsInfo",
                        title:"货品",
                        type:"string"
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"createDate",
                        title:"创建时间",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return data.createDate.split(/\s+/g)[0];
                        }
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"status",
                        title:"状态",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return customerClearanceModel.CONSTANTS.status[data.status];
                        }
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"",
                        title:"操作",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                           return menuCall(data);
                        }
                    },
                    width:"10%"
                }
            ]
        }
    })();

    var menuCall = function (data) {
        var links = 'customerClearance.clearanceDetail&exportFormId=' + data["exportFormId"];
        links = X.config.PATH_FILE.path.rootPath + X.browserAdapter.adaptRoute(links);
        return $("<a href= '"+ links +"' class='orange-font'>详情</a>")[0];
    }


    var getRoute = function () {
        var route = {panel:activeTabLiInfo,ldata:lists[activeTabLiInfo].val()};
        return route;
    };

    var schemas = (function(){


        var schemas = {
            "tabAll" : {
                searchMeta: {
                    schema:{
                        simple:[
                            {
                                name:"formNumber",
                                inputName: "formNumber",
                                title:"单号",
                                ctrlType:"TextBox",
                                placeholder :"",
                                className : "mr30"
                            },
                            {
                                name:"createDate",
                                inputName: "createDate",
                                title:"创建时间",
                                ctrlType:"DateRangePicker",
                                placeholder:"",
                                className : "mr60"
                            }
                        ]
                    },
                    search: {
                        onSearch : function (data,searcher,click) {
                            $(".js-datagrid tbody").html("");
                            if(data.query.createDate){
                                data.query.createDate = data.query.createDate.split('@');
                                data.query.beginTime = data.query.createDate[0];
                                data.query.endTime = data.query.createDate[1];
                                delete data.query.createDate;
                            }
                            return data;
                        }
                    },
                    reset :{
                        show:false
                    },
                    selector :"tabAll"
                },
                gridMeta :{
                    columns : header["tabAll"],
                    primaryKey:"supplierId",
                    orderMode : 1,
                    afterRowRender : function (row,data) {

                    }
                    // showCheckbox : true,
                },
                pageInfo : {
                    pageSize : '10',
                    totalPages : '10',
                    pageNo : '1',
                    smallPapogation: {
                        isShow: false,
                        elem: '.js_small_papogation1'
                    }
                },
                //type: "GET",
                url : X.config.customerClearance.api.getList
            },
            "tabPending" : {
                searchMeta: {
                    schema:{
                        simple:[
                            {
                                name:"formNumber",
                                inputName: "formNumber",
                                title:"单号",
                                ctrlType:"TextBox",
                                placeholder :"",
                                className : "mr30"
                            },
                            {
                                name:"createDate",
                                inputName: "createDate",
                                title:"创建时间",
                                ctrlType:"DateRangePicker",
                                placeholder:"",
                                className : "mr60"
                            }
                        ]
                    },
                    search: {
                        onSearch : function (data,searcher,click) {
                            $(".js-datagrid tbody").html("");
                            if(data.query.createDate){
                                data.query.createDate = data.query.createDate.split('@');
                                data.query.beginTime = data.query.createDate[0];
                                data.query.endTime = data.query.createDate[1];
                                delete data.query.createDate;
                            }
                            data.query.tabType = 1;
                            return data;
                        }
                    },
                    reset :{
                        show:false
                    },
                    selector :"tabPending"
                },
                gridMeta :{
                    columns : header["tabPending"],
                    primaryKey:"id",
                    orderMode : 1,
                    afterRowRender : function (row,data) {

                    }
                    // showCheckbox : true,
                },
                pageInfo : {
                    pageSize : '10',
                    totalPages : '10',
                    pageNo : '1',
                    smallPapogation: {
                        isShow: false,
                        elem: '.js_small_papogation2'
                    }
                },
                //type: "GET",
                url : X.config.customerClearance.api.getList
            },
            "tabCompleted" : {
                searchMeta: {
                    schema:{
                        simple:[
                            {
                                name:"formNumber",
                                inputName: "formNumber",
                                title:"单号",
                                ctrlType:"TextBox",
                                placeholder :"",
                                className : "mr30"
                            },
                            {
                                name:"createDate",
                                inputName: "createDate",
                                title:"创建时间",
                                ctrlType:"DateRangePicker",
                                placeholder:"",
                                className : "mr60"
                            }
                        ]
                    },
                    search: {
                        onSearch : function (data,searcher,click) {
                            $(".js-datagrid tbody").html("");
                            if(data.query.createDate){
                                data.query.createDate = data.query.createDate.split('@');
                                data.query.beginTime = data.query.createDate[0];
                                data.query.endTime = data.query.createDate[1];
                                delete data.query.createDate;
                            }
                            data.query.tabType = 6;
                            return data;
                        }
                    },
                    reset :{
                        show:false
                    },
                    selector :"tabCompleted"
                },
                gridMeta :{
                    columns : header["tabCompleted"],
                    primaryKey:"id",
                    orderMode : 1,
                    afterRowRender : function (row,data) {

                    }
                    // showCheckbox : true,
                },
                pageInfo : {
                    pageSize : '10',
                    totalPages : '10',
                    pageNo : '1',
                    smallPapogation: {
                        isShow: false,
                        elem: '.js_small_papogation3'
                    }
                },
                //type: "GET",
                url : X.config.customerClearance.api.getList
            },
            "tabCancelled" : {
                searchMeta: {
                    schema:{
                        simple:[
                            {
                                name:"formNumber",
                                inputName: "formNumber",
                                title:"单号",
                                ctrlType:"TextBox",
                                placeholder :"",
                                className : "mr30"
                            },
                            {
                                name:"createDate",
                                inputName: "createDate",
                                title:"创建时间",
                                ctrlType:"DateRangePicker",
                                placeholder:"",
                                className : "mr60"
                            }
                        ]
                    },
                    search: {
                        onSearch : function (data,searcher,click) {
                            $(".js-datagrid tbody").html("");
                            if(data.query.createDate){
                                data.query.createDate = data.query.createDate.split('@');
                                data.query.beginTime = data.query.createDate[0];
                                data.query.endTime = data.query.createDate[1];
                                delete data.query.createDate;
                            }
                            data.query.tabType = 0;
                            return data;
                        }
                    },
                    reset :{
                        show:false
                    },
                    selector :"tabCancelled"
                },
                gridMeta :{
                    columns : header["tabCancelled"],
                    primaryKey:"id",
                    orderMode : 1,
                    afterRowRender : function (row,data) {

                    }
                    // showCheckbox : true,
                },
                pageInfo : {
                    pageSize : '10',
                    totalPages : '10',
                    pageNo : '1',
                    smallPapogation: {
                        isShow: false,
                        elem: '.js_small_papogation4'
                    }
                },
                //type: "GET",
                url : X.config.customerClearance.api.getList
            }
        };

        return schemas;
    })();



    var lists = {};
    var activeTabLiInfo ="tabAll";
    function initTabPage($elem,schema,tabPage) {
        var list = X.controls.getControl("List",$elem,schema);
        list.init();
        lists[tabPage] = list;

    };

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


    var route = new routerHelper("customerClearance.clearanceList",schemas,getRoute);
    return ctrl;

});