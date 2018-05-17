X.define("modules.customerClearance.inspectionProcess",["modules.common.routerHelper","model.customerClearanceModel"],function (routerHelper,customerClearanceModel) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.customerClearance.tpl.inspectionProcess
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
            "inspectionProcess" :  [
                {
                    field:{
                        name:"exportInspectionNumber",
                        title:"单号",
                        type:"int"
                    },
                    width:"10%",
                    className:"tL"
                },
                {
                    field:{
                        name: "companyName",
                        title:"供应商名称",
                        type:"string"
                    },
                    width:"10%"
                },
                {
                    field:{
                        name: "contacts",
                        title:"联系人",
                        type:"string"
                    },
                    width:"12%"
                },
                {
                    field:{
                        name:"phoneNumber",
                        title:"联系电话",
                        type:"string"
                    },
                    width:"7%"
                },
                {
                    field:{
                        name:"createDate",
                        title:"提交时间",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return data.createDate.replace(/:\d+$/g,"");
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
            "inspectionProcess" : {
                searchMeta: {
                    schema:{
                        simple:[
                            {
                                name:"exportInspectionNumber",
                                inputName: "exportInspectionNumber",
                                title:"单号",
                                ctrlType:"TextBox",
                                placeholder :"",
                                className : "mr30"
                            },
                            {
                                name:"companyName",
                                inputName: "companyName",
                                title:"供应商名称",
                                ctrlType:"TextBox",
                                placeholder :"",
                                className : "mr30"
                            },
                            {
                                name:"contacts",
                                inputName: "contacts",
                                title:"联系人",
                                ctrlType:"TextBox",
                                placeholder :"",
                                className : "mr30"
                            },
                            {
                                name:"phoneNumber",
                                inputName: "phoneNumber",
                                title:"联系电话",
                                ctrlType:"TextBox",
                                placeholder :"",
                                className : "mr30"
                            },
                            {
                                name:"createDate",
                                inputName: "createDate",
                                title:"提交时间",
                                ctrlType:"DateRangePicker",
                                placeholder:"",
                                className : "m30"
                            }
                        ]
                    },
                    search: {
                        onSearch : function (data,searcher,click) {
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
                    selector :"inspectionProcess"
                },
                gridMeta :{
                    columns : header["inspectionProcess"],
                    primaryKey:"supplierId",
                    orderMode : 1,
                    afterRowRender: function (row,data,index) {

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
                url : X.config.customerClearance.api.getExportInspectionListByPage
            }
        };

        return schemas;
    })();


    var lists = {};
    var activeTabLiInfo ="inspectionProcess";
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


    var route = new routerHelper("customerClearance.inspectionProcess",schemas,getRoute);
    return ctrl;

});