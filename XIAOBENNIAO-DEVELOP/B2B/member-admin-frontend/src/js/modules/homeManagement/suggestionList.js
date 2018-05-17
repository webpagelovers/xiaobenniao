X.define("modules.homeManagement.suggestionList",["modules.common.routerHelper","model.homeManagementModel"],function (routerHelper,homeManagementModel) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.homeManagement.tpl.suggestionList
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {
        document.title = "意见反馈管理";
        return view.render({},function () {
            activeTabLiInfo = route.getRoute();
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
                        name: "feedbackContent",
                        title:"反馈内容",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return subStrLen(data.feedbackContent,20);
                        }
                    },
                    width:"25%"
                },
                {
                    field:{
                        name: "contacts",
                        title:"反馈人姓名",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return subStrLen(data.contacts,10);
                        }
                    },
                    width:"12%"
                },
                {
                    field:{
                        name:"mobile",
                        title:"反馈电话",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return subStrLen(data.mobile,10);
                        }
                    },
                    width:"7%"
                },
                {
                    field:{
                        name:"otherWays",
                        title:"其他方式",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return subStrLen(data.otherWays,10);
                        }
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"feedbackDate",
                        title:"反馈时间",
                        type:"string"
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"processStatus",
                        title:"状态",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return homeManagementModel.const.processStatus[data.processStatus]
                        }
                    },
                    width:"8%"
                },
                {
                    field:{
                        name:"",
                        title:"操作",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return "<a href='' class='colBlue'>处理</a>"
                        }
                    },
                    width:"11%"
                }
            ],
            "tabPending": [
                {
                    field:{
                        name: "feedbackContent",
                        title:"反馈内容",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return subStrLen(data.feedbackContent,20);
                        }
                    },
                    width:"25%"
                },
                {
                    field:{
                        name: "feedbackDate",
                        title:"反馈时间",
                        type:"string"
                    },
                    width:"12%"
                },
                {
                    field:{
                        name:"backendUserName",
                        title:"处理人",
                        type:"string"
                    },
                    width:"7%"
                },
                {
                    field:{
                        name:"processDate",
                        title:"处理时间",
                        type:"string"
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"processResult",
                        title:"处理结果",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return subStrLen(data.processResult,20);
                        }
                    },
                    width:"25%"
                },
                {
                    field:{
                        name:"processStatus",
                        title:"状态",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return homeManagementModel.const.processStatus[data.processStatus]
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
                            return "<a href='' class='colBlue'>查看详情</a>"
                        }
                    },
                    width:"10%"
                }
            ]
        }
    })();

    //如果字符大于n个字符，则截取n个字符并显示...
    function subStrLen(data,len){
        var str = "";
        if(data.length > len){
            str = data.substring(0,len) + "...";
        }else{
            str = data;
        }
        return str;
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
                        simple:[]
                    },
                    search: {
                        onSearch : function (data,searcher,click) {
                            data.query.processStatus = 0;
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
                    afterRowRender: function (row,data,index) {

                        $(row.dom).find("a").eq(0).click(function(event){
                            event.stopPropagation();
                            event.preventDefault();
                            window.open(X.config.PATH_FILE.path.root + "?m=homeManagement.suggestionHandle&feedbackId=" + data["feedbackId"],"_blank");
                        });
                    }
                    // showCheckbox : true,
                },
                pageInfo : {
                    pageSize : '20',
                    totalPages : '10',
                    pageNo : '1',
                    smallPapogation: {
                        isShow: false,
                        elem: '.js_small_papogation1'
                    }
                },
                //type: "GET",
                url : X.config.homeManagement.api.getList
            },
            "tabPending" : {
                searchMeta: {
                    schema:{
                        simple:[]
                    },
                    search: {
                        onSearch : function (data,searcher,click) {
                            data.query.processStatus = 1;
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

                        $(row.dom).find("a").eq(0).click(function(event){
                            event.stopPropagation();
                            event.preventDefault();
                            window.open(X.config.PATH_FILE.path.root + "?m=homeManagement.suggestionDetail&feedbackId=" + data["feedbackId"],"_blank");
                        });
                    }
                    // showCheckbox : true,
                },
                pageInfo : {
                    pageSize : '20',
                    totalPages : '10',
                    pageNo : '1',
                    smallPapogation: {
                        isShow: false,
                        elem: '.js_small_papogation2'
                    }
                },
                //type: "GET",
                url : X.config.homeManagement.api.getList
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


    var route = new routerHelper("homeManagement.suggestionList",schemas,getRoute);
    return ctrl;

});