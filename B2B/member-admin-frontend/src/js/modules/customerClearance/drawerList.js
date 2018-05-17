X.define("modules.customerClearance.drawerList",["modules.common.routerHelper","model.drawerModel"],function (routerHelper,drawerModel) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.customerClearance.tpl.drawerList
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
                        name:"drawerCompany",
                        title:"开票公司名称",
                        type:"int"
                    },
                    width:"10%",
                    className:"tL"
                },
                {
                    field:{
                        name: "taxpayerIdentityNumber",
                        title:"纳税人识别号",
                        type:"string"
                    },
                    width:"10%"
                },
                {
                    field:{
                        name: "createdDate",
                        title:"提交时间",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return data.createdDate.substring(0,11);
                        }
                    },
                    width:"12%"
                },
                {
                    field:{
                        name:"drawerStatus",
                        title:"状态",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                           switch (data.drawerStatus){
                               case drawerModel.statusconst.drawerStatus.DRAFT.key:
                                   return drawerModel.statusconst.drawerStatus.DRAFT.text;
                                   break;
                               case drawerModel.statusconst.drawerStatus.PENDING.key:
                                   return drawerModel.statusconst.drawerStatus.PENDING.text;
                                   break;
                               case drawerModel.statusconst.drawerStatus.BEPERFECT.key:
                                   return drawerModel.statusconst.drawerStatus.BEPERFECT.text;
                                   break;
                               case drawerModel.statusconst.drawerStatus.REFUSE.key:
                                   return drawerModel.statusconst.drawerStatus.REFUSE.text;
                                   break;
                               case drawerModel.statusconst.drawerStatus.TEMPORARYADOPT.key:
                                   return drawerModel.statusconst.drawerStatus.TEMPORARYADOPT.text;
                                   break;
                               case drawerModel.statusconst.drawerStatus.ADOPT.key:
                                   return drawerModel.statusconst.drawerStatus.ADOPT.text;
                                   break;
                               default:
                                   break;

                           }
                        }
                    },
                    width:"7%"
                },
                {
                    field:{
                        name:"drawerStatus",
                        title:"操作",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            if (data.drawerStatus === drawerModel.statusconst.drawerStatus.PENDING.key ){
                                var $reviewed = $("<span class='curp colBlue'>审核</span>")
                                    .on("click", function (event) {
                                        event.stopPropagation();
                                        X.router.run("m=customerClearance.drawer&exportDrawerId=" + data["exportDrawerId"], '开票公司审核');
                                    });
                                return  $("<div></div>").append($reviewed)[0];
                            }else {
                                var $details = $("<span class='curp colBlue'>详情</span>")
                                    .on("click", function (event) {
                                        event.stopPropagation();
                                        X.router.run("m=customerClearance.drawer&exportDrawerId=" + data["exportDrawerId"], '开票公司详情');
                                    });
                                 return  $("<div></div>").append($details)[0];
                            }
                        }
                    },
                    width:"10%"
                }
            ],
            "tabPending" :  [
                {
                    field:{
                        name:"drawerCompany",
                        title:"开票公司名称",
                        type:"int"
                    },
                    width:"10%",
                    className:"tL"
                },
                {
                    field:{
                        name: "taxpayerIdentityNumber",
                        title:"纳税人识别号",
                        type:"string"
                    },
                    width:"10%"
                },
                {
                    field:{
                        name: "createdDate",
                        title:"提交时间",
                        type:"string"
                    },
                    width:"12%"
                },
                {
                    field:{
                        name:"drawerStatus",
                        title:"状态",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            switch (data.drawerStatus){
                                case drawerModel.statusconst.drawerStatus.DRAFT.key:
                                    return drawerModel.statusconst.drawerStatus.DRAFT.text;
                                    break;
                                case drawerModel.statusconst.drawerStatus.PENDING.key:
                                    return drawerModel.statusconst.drawerStatus.PENDING.text;
                                    break;
                                case drawerModel.statusconst.drawerStatus.BEPERFECT.key:
                                    return drawerModel.statusconst.drawerStatus.BEPERFECT.text;
                                    break;
                                case drawerModel.statusconst.drawerStatus.REFUSE.key:
                                    return drawerModel.statusconst.drawerStatus.REFUSE.text;
                                    break;
                                case drawerModel.statusconst.drawerStatus.TEMPORARYADOPT.key:
                                    return drawerModel.statusconst.drawerStatus.TEMPORARYADOPT.text;
                                    break;
                                case drawerModel.statusconst.drawerStatus.ADOPT.key:
                                    return drawerModel.statusconst.drawerStatus.ADOPT.text;
                                    break;
                                default:
                                    break;

                            }
                        }
                    },
                    width:"7%"
                },
                {
                    field:{
                        name:"drawerStatus",
                        title:"操作",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            if (data.drawerStatus === drawerModel.statusconst.drawerStatus.PENDING.key ){
                                var $reviewed = $("<span>审核</span>")
                                    .on("click", function (event) {
                                        event.stopPropagation();
                                        X.router.run();
                                    });
                                return  $("<div></div>").append($reviewed)[0];
                            }else {
                                var $details = $("<span>详情</span>")
                                    .on("click", function (event) {
                                        event.stopPropagation();
                                        X.router.run();
                                    });
                                return  $("<div></div>").append($details)[0];
                            }
                        }
                    },
                    width:"10%"
                }
            ],
            "tabBePerfect" :  [
                {
                    field:{
                        name:"drawerCompany",
                        title:"开票公司名称",
                        type:"int"
                    },
                    width:"10%",
                    className:"tL"
                },
                {
                    field:{
                        name: "taxpayerIdentityNumber",
                        title:"纳税人识别号",
                        type:"string"
                    },
                    width:"10%"
                },
                {
                    field:{
                        name: "createdDate",
                        title:"提交时间",
                        type:"string"
                    },
                    width:"12%"
                },
                {
                    field:{
                        name:"drawerStatus",
                        title:"状态",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            switch (data.drawerStatus){
                                case drawerModel.statusconst.drawerStatus.DRAFT.key:
                                    return drawerModel.statusconst.drawerStatus.DRAFT.text;
                                    break;
                                case drawerModel.statusconst.drawerStatus.PENDING.key:
                                    return drawerModel.statusconst.drawerStatus.PENDING.text;
                                    break;
                                case drawerModel.statusconst.drawerStatus.BEPERFECT.key:
                                    return drawerModel.statusconst.drawerStatus.BEPERFECT.text;
                                    break;
                                case drawerModel.statusconst.drawerStatus.REFUSE.key:
                                    return drawerModel.statusconst.drawerStatus.REFUSE.text;
                                    break;
                                case drawerModel.statusconst.drawerStatus.TEMPORARYADOPT.key:
                                    return drawerModel.statusconst.drawerStatus.TEMPORARYADOPT.text;
                                    break;
                                case drawerModel.statusconst.drawerStatus.ADOPT.key:
                                    return drawerModel.statusconst.drawerStatus.ADOPT.text;
                                    break;
                                default:
                                    break;

                            }
                        }
                    },
                    width:"7%"
                },
                {
                    field:{
                        name:"drawerStatus",
                        title:"操作",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            if (data.drawerStatus === drawerModel.statusconst.drawerStatus.PENDING.key ){
                                var $reviewed = $("<span>审核</span>")
                                    .on("click", function (event) {
                                        event.stopPropagation();
                                        X.router.run();
                                    });
                                return  $("<div></div>").append($reviewed)[0];
                            }else {
                                var $details = $("<span>详情</span>")
                                    .on("click", function (event) {
                                        event.stopPropagation();
                                        X.router.run();
                                    });
                                return  $("<div></div>").append($details)[0];
                            }
                        }
                    },
                    width:"10%"
                }
            ],
            "tabAdopt" :  [
                {
                    field:{
                        name:"drawerCompany",
                        title:"开票公司名称",
                        type:"int"
                    },
                    width:"10%",
                    className:"tL"
                },
                {
                    field:{
                        name: "taxpayerIdentityNumber",
                        title:"纳税人识别号",
                        type:"string"
                    },
                    width:"10%"
                },
                {
                    field:{
                        name: "createdDate",
                        title:"提交时间",
                        type:"string"
                    },
                    width:"12%"
                },
                {
                    field:{
                        name:"drawerStatus",
                        title:"状态",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            switch (data.drawerStatus){
                                case drawerModel.statusconst.drawerStatus.DRAFT.key:
                                    return drawerModel.statusconst.drawerStatus.DRAFT.text;
                                    break;
                                case drawerModel.statusconst.drawerStatus.PENDING.key:
                                    return drawerModel.statusconst.drawerStatus.PENDING.text;
                                    break;
                                case drawerModel.statusconst.drawerStatus.BEPERFECT.key:
                                    return drawerModel.statusconst.drawerStatus.BEPERFECT.text;
                                    break;
                                case drawerModel.statusconst.drawerStatus.REFUSE.key:
                                    return drawerModel.statusconst.drawerStatus.REFUSE.text;
                                    break;
                                case drawerModel.statusconst.drawerStatus.TEMPORARYADOPT.key:
                                    return drawerModel.statusconst.drawerStatus.TEMPORARYADOPT.text;
                                    break;
                                case drawerModel.statusconst.drawerStatus.ADOPT.key:
                                    return drawerModel.statusconst.drawerStatus.ADOPT.text;
                                    break;
                                default:
                                    break;

                            }
                        }
                    },
                    width:"7%"
                },
                {
                    field:{
                        name:"drawerStatus",
                        title:"操作",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            if (data.drawerStatus === drawerModel.statusconst.drawerStatus.PENDING.key ){
                                var $reviewed = $("<span>审核</span>")
                                    .on("click", function (event) {
                                        event.stopPropagation();
                                        X.router.run();
                                    });
                                return  $("<div></div>").append($reviewed)[0];
                            }else {
                                var $details = $("<span>详情</span>")
                                    .on("click", function (event) {
                                        event.stopPropagation();
                                        X.router.run();
                                    });
                                return  $("<div></div>").append($details)[0];
                            }
                        }
                    },
                    width:"10%"
                }
            ],
            "tabTemporaryAdopt" :  [
                {
                    field:{
                        name:"drawerCompany",
                        title:"开票公司名称",
                        type:"int"
                    },
                    width:"10%",
                    className:"tL"
                },
                {
                    field:{
                        name: "taxpayerIdentityNumber",
                        title:"纳税人识别号",
                        type:"string"
                    },
                    width:"10%"
                },
                {
                    field:{
                        name: "createdDate",
                        title:"提交时间",
                        type:"string"
                    },
                    width:"12%"
                },
                {
                    field:{
                        name:"drawerStatus",
                        title:"状态",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            switch (data.drawerStatus){
                                case drawerModel.statusconst.drawerStatus.DRAFT.key:
                                    return drawerModel.statusconst.drawerStatus.DRAFT.text;
                                    break;
                                case drawerModel.statusconst.drawerStatus.PENDING.key:
                                    return drawerModel.statusconst.drawerStatus.PENDING.text;
                                    break;
                                case drawerModel.statusconst.drawerStatus.BEPERFECT.key:
                                    return drawerModel.statusconst.drawerStatus.BEPERFECT.text;
                                    break;
                                case drawerModel.statusconst.drawerStatus.REFUSE.key:
                                    return drawerModel.statusconst.drawerStatus.REFUSE.text;
                                    break;
                                case drawerModel.statusconst.drawerStatus.TEMPORARYADOPT.key:
                                    return drawerModel.statusconst.drawerStatus.TEMPORARYADOPT.text;
                                    break;
                                case drawerModel.statusconst.drawerStatus.ADOPT.key:
                                    return drawerModel.statusconst.drawerStatus.ADOPT.text;
                                    break;
                                default:
                                    break;

                            }
                        }
                    },
                    width:"7%"
                },
                {
                    field:{
                        name:"drawerStatus",
                        title:"操作",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            if (data.drawerStatus === drawerModel.statusconst.drawerStatus.PENDING.key ){
                                var $reviewed = $("<span>审核</span>")
                                    .on("click", function (event) {
                                        event.stopPropagation();
                                        X.router.run();
                                    });
                                return  $("<div></div>").append($reviewed)[0];
                            }else {
                                var $details = $("<span>详情</span>")
                                    .on("click", function (event) {
                                        event.stopPropagation();
                                        X.router.run();
                                    });
                                return  $("<div></div>").append($details)[0];
                            }
                        }
                    },
                    width:"10%"
                }
            ],
            "tabRefuse" :  [
                {
                    field:{
                        name:"drawerCompany",
                        title:"开票公司名称",
                        type:"int"
                    },
                    width:"10%",
                    className:"tL"
                },
                {
                    field:{
                        name: "taxpayerIdentityNumber",
                        title:"纳税人识别号",
                        type:"string"
                    },
                    width:"10%"
                },
                {
                    field:{
                        name: "createdDate",
                        title:"提交时间",
                        type:"string"
                    },
                    width:"12%"
                },
                {
                    field:{
                        name:"drawerStatus",
                        title:"状态",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            switch (data.drawerStatus){
                                case drawerModel.statusconst.drawerStatus.DRAFT.key:
                                    return drawerModel.statusconst.drawerStatus.DRAFT.text;
                                    break;
                                case drawerModel.statusconst.drawerStatus.PENDING.key:
                                    return drawerModel.statusconst.drawerStatus.PENDING.text;
                                    break;
                                case drawerModel.statusconst.drawerStatus.BEPERFECT.key:
                                    return drawerModel.statusconst.drawerStatus.BEPERFECT.text;
                                    break;
                                case drawerModel.statusconst.drawerStatus.REFUSE.key:
                                    return drawerModel.statusconst.drawerStatus.REFUSE.text;
                                    break;
                                case drawerModel.statusconst.drawerStatus.TEMPORARYADOPT.key:
                                    return drawerModel.statusconst.drawerStatus.TEMPORARYADOPT.text;
                                    break;
                                case drawerModel.statusconst.drawerStatus.ADOPT.key:
                                    return drawerModel.statusconst.drawerStatus.ADOPT.text;
                                    break;
                                default:
                                    break;

                            }
                        }
                    },
                    width:"7%"
                },
                {
                    field:{
                        name:"drawerStatus",
                        title:"操作",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            if (data.drawerStatus === drawerModel.statusconst.drawerStatus.PENDING.key ){
                                var $reviewed = $("<span>审核</span>")
                                    .on("click", function (event) {
                                        event.stopPropagation();
                                        X.router.run();
                                    });
                                return  $("<div></div>").append($reviewed)[0];
                            }else {
                                var $details = $("<span>详情</span>")
                                    .on("click", function (event) {
                                        event.stopPropagation();
                                        X.router.run();
                                    });
                                return  $("<div></div>").append($details)[0];
                            }
                        }
                    },
                    width:"10%"
                }
            ]
        }
    })();


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
                                name:"drawerCompany",
                                inputName: "drawerCompany",
                                title:"开票公司名称",
                                ctrlType:"TextBox",
                                className : "mr30"
                            },
                            {
                                name:"taxpayerIdentityNumber",
                                inputName: "taxpayerIdentityNumber",
                                title:"纳税人识别号",
                                ctrlType:"TextBox",
                                className : "mr30"
                            }
                        ]
                    },
                    search: {
                        onSearch : function (data,searcher,click) {
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
                    orderMode : 1
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
                url : X.config.customerClearance.api.getDrawerList
            },
            "tabPending" : {
                searchMeta: {
                    schema:{
                        simple:[
                            {
                                name:"drawerCompany",
                                inputName: "drawerCompany",
                                title:"开票公司名称",
                                ctrlType:"TextBox",
                                className : "mr30"
                            },
                            {
                                name:"taxpayerIdentityNumber",
                                inputName: "taxpayerIdentityNumber",
                                title:"纳税人识别号",
                                ctrlType:"TextBox",
                                className : "mr30"
                            }
                        ]
                    },
                    search: {
                        onSearch : function (data,searcher,click) {
                            data.query.drawerStatus = drawerModel.statusconst.drawerStatus.PENDING.key;
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
                    orderMode : 1
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
                url : X.config.customerClearance.api.getDrawerList
            },
            "tabBePerfect" : {
                searchMeta: {
                    schema:{
                        simple:[
                            {
                                name:"drawerCompany",
                                inputName: "drawerCompany",
                                title:"开票公司名称",
                                ctrlType:"TextBox",
                                className : "mr30"
                            },
                            {
                                name:"taxpayerIdentityNumber",
                                inputName: "taxpayerIdentityNumber",
                                title:"纳税人识别号",
                                ctrlType:"TextBox",
                                className : "mr30"
                            }
                        ]
                    },
                    search: {
                        onSearch : function (data,searcher,click) {
                            data.query.drawerStatus = drawerModel.statusconst.drawerStatus.BEPERFECT.key;
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
                    orderMode : 1
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
                url : X.config.customerClearance.api.getDrawerList
            },
            "tabAdopt" : {
                searchMeta: {
                    schema:{
                        simple:[
                            {
                                name:"drawerCompany",
                                inputName: "drawerCompany",
                                title:"开票公司名称",
                                ctrlType:"TextBox",
                                className : "mr30"
                            },
                            {
                                name:"taxpayerIdentityNumber",
                                inputName: "taxpayerIdentityNumber",
                                title:"纳税人识别号",
                                ctrlType:"TextBox",
                                className : "mr30"
                            }
                        ]
                    },
                    search: {
                        onSearch : function (data,searcher,click) {
                            data.query.drawerStatus = drawerModel.statusconst.drawerStatus.ADOPT.key;
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
                    orderMode : 1
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
                url : X.config.customerClearance.api.getDrawerList
            },
            "tabTemporaryAdopt" : {
                searchMeta: {
                    schema:{
                        simple:[
                            {
                                name:"drawerCompany",
                                inputName: "drawerCompany",
                                title:"开票公司名称",
                                ctrlType:"TextBox",
                                className : "mr30"
                            },
                            {
                                name:"taxpayerIdentityNumber",
                                inputName: "taxpayerIdentityNumber",
                                title:"纳税人识别号",
                                ctrlType:"TextBox",
                                className : "mr30"
                            }
                        ]
                    },
                    search: {
                        onSearch : function (data,searcher,click) {
                            data.query.drawerStatus = drawerModel.statusconst.drawerStatus.TEMPORARYADOPT.key;
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
                    orderMode : 1
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
                url : X.config.customerClearance.api.getDrawerList
            },
            "tabRefuse" : {
                searchMeta: {
                    schema:{
                        simple:[
                            {
                                name:"drawerCompany",
                                inputName: "drawerCompany",
                                title:"开票公司名称",
                                ctrlType:"TextBox",
                                className : "mr30"
                            },
                            {
                                name:"taxpayerIdentityNumber",
                                inputName: "taxpayerIdentityNumber",
                                title:"纳税人识别号",
                                ctrlType:"TextBox",
                                className : "mr30"
                            }
                        ]
                    },
                    search: {
                        onSearch : function (data,searcher,click) {
                            data.query.drawerStatus = drawerModel.statusconst.drawerStatus.REFUSE.key;
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
                    orderMode : 1
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
                url : X.config.customerClearance.api.getDrawerList
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


    var route = new routerHelper("customerClearance.drawerList",schemas,getRoute);
    return ctrl;

});