X.define("modules.bid.publicBidding",["model.publicBidModel", "data.addressData","modules.common.routerHelper"],function (publicBidModel, addressData,routerHelper) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.bid.tpl.publicBidding
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.initControl = function (id) {};

    ctrl.rendering = function () {
        return view.render({}, function () {
            activeTabLiInfo = route.getRoute() || activeTabLiInfo;
            ctrl.initPage()
        });
    };

    var header ={
        "tabAll" :[
            {
                field:{
                    name:"tenderName",
                    title:"招标名称",
                    type:"string"
                },
                width:"10%",
                className:"tL"
            },
            {
                field:{
                    name:"companyName",
                    title:"招标方",
                    type:"string"
                },
                width:"15%"
            },
            {
                field:{
                    name: "createDate",
                    title:"发布时间",
                    type:"string"
                },
                width:"9%"
            },
            {
                field:{
                    name:"tenderStatus",
                    title:"状态",
                    type:"string"
                },
                itemRenderer:{
                    render: function(data, field, index, grid){
                        switch(Number(data.tenderStatus)){
                            case publicBidModel.CONSTANTS.tenderStatus.TENDER.key:
                                return publicBidModel.CONSTANTS.tenderStatus.TENDER.value;
                                break;
                            case publicBidModel.CONSTANTS.tenderStatus.BIDOPEN.key:
                                return publicBidModel.CONSTANTS.tenderStatus.BIDOPEN.value;
                                break;
                            case publicBidModel.CONSTANTS.tenderStatus.END.key:
                                return publicBidModel.CONSTANTS.tenderStatus.END.value;
                                break;
                            case publicBidModel.CONSTANTS.tenderStatus.SIGN.key:
                                return publicBidModel.CONSTANTS.tenderStatus.SIGN.value;
                                break;
                            case publicBidModel.CONSTANTS.tenderStatus.INSTANCE.key:
                                return publicBidModel.CONSTANTS.tenderStatus.INSTANCE.value;
                                break;
                            case publicBidModel.CONSTANTS.tenderStatus.WASTE.key:
                                return publicBidModel.CONSTANTS.tenderStatus.WASTE.value;
                                break;
                            case publicBidModel.CONSTANTS.tenderStatus.FLOWMARK.key:
                                return publicBidModel.CONSTANTS.tenderStatus.FLOWMARK.value;
                                break;
                        }
                    }
                },
                width:"4%"
            },
            {
                field:{
                    name:"tenderType",
                    title:"招标方式",
                    type:"string"
                },
                width:"5%",
                itemRenderer:{
                    render: function(data, field, index, grid){
                        return (data.tenderType == publicBidModel.CONSTANTS.receiver.OPEN.key) ? publicBidModel.CONSTANTS.receiver.OPEN.value:publicBidModel.CONSTANTS.receiver.INVITATION.value;
                    }
                }
            },
            {
                field:{
                    name:"procurementArea",
                    title:"采购地区",
                    type:"string"
                },
                width:"7%",
                itemRenderer:{
                    render: function(data, field, index, grid){
                        return (addressData.getPro(data.purchaseProvince) || '') + '-' + (addressData.getCity(data.purchaseCity) || '');
                    }
                }
            },
            {
                field:{
                    name:"operation",
                    title:"操作",
                    type:"operation"
                },
                itemRenderer: {
                    render: function (data, field, index, grid) {
                        return $("<a href='' class='orange-font'>详情</a>")
                            .on("click", function (event) {
                                event.stopPropagation();
                                event.preventDefault();
                                X.publish(X.CONSTANTS.channel.menuCall,{m:"bid.tenderDetailPublic",para:{tenderId:data.tenderId}});
                            })[0];
                    }
                },
                width:"4%",
                className:"operation_main"
            }
        ]
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
                                name:"tenderName",
                                title:"招标名称",
                                ctrlType:"TextBox",
                                placeholder :"输入招标名称",
                                className : "mr66"
                            },
                            {
                                name:"companyName",
                                title:"招标方",
                                ctrlType:"TextBox",
                                placeholder :"输入招标方",
                                className : "mr66"
                            },
                            {
                                name:"startTimeRange",
                                title:"发布时间",
                                ctrlType:"DateRangePicker",
                                placeholder:"2015/6/22-2016/2/16",
                                position:1
                            },
                            {
                                name:"tenderStatus",
                                title:"招标状态",
                                ctrlType:"ComboBox",
                                dataSource: publicBidModel.CONSTANTS.status,
                                className : "w160 m0 va_8",
                                defaultValue:""
                            }                            
                        ]
                    },
                    search: {
                        onSearch : function (data) {
                            if(data.query.startTimeRange){

                                var value =data.query.startTimeRange;
                                var range = value.split("@");
                                var beginTime = range[0];
                                var endTime = range[1];
                                var startTimeRange;
                                if(beginTime ==""){
                                    startTimeRange = {endTime:endTime};
                                }else if(endTime ==""){
                                    startTimeRange = {beginTime:beginTime};
                                }else{
                                    startTimeRange = {beginTime:beginTime,endTime:endTime};
                                }

                                data.query.startTimeRange = startTimeRange;
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
                    primaryKey:"bidId",
                    orderMode : 1,
                    afterRowRender: function (row, data) {
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
                url : X.config.bid.api.getPublicBidListByPage
            }
        };

        return schemas;
    })();


    var lists = {};
    var activeTabLiInfo;
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

    var route = new routerHelper("bid.publicBidding",schemas,getRoute);
    return ctrl;
});
