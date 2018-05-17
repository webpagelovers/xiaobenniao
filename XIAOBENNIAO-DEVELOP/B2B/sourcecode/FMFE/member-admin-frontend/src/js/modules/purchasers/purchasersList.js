X.define("modules.purchasers.purchasersList",["model.companyModel","data.addressData","modules.common.routerHelper"],function (companyModel,address,routerHelper) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.purchasers.tpl.purchasersList
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {
        view.render({},function(){
            activeTabLiInfo = route.getRoute() || activeTabLiInfo;
            ctrl.initPage();
        });
    };


    ctrl.load = function (para) {
        ctrl.rendering();
    };

    var formatMobile = function(data){
        return (data.user && data.user.mobile)?data.user.mobile:"";
    };
    var header = (function () {

        return {
            "tabAll" : [
                // {
                //     field:{
                //         name:"companyId",
                //         title:"公司ID",
                //         type:"int"
                //     },
                //     width:"3%",
                //     className:"tL"
                // },
                {
                    field:{
                        name:"companyNameCn",
                        title:"公司名称",
                        type:"string"
                    },
                    width:"13%"
                },
                {
                    field:{
                        name: "creator",
                        title:"创建者",
                        type:"string"
                    },
                    itemRenderer:{
                        render: function(data, field, index, grid){
                            return data.mobile;
                        }
                    },
                    width:"9%"
                },
                {
                    field:{
                        name:"registeredCapital",
                        title:"注册资金",
                        type:"string"
                    },
                    width:"6%"

                },
                {
                    field:{
                        name:"",
                        title:"注册者手机号",
                        type:"string"
                    },
                    itemRenderer:{
                        render: function(data, field, index, grid){
                            return formatMobile(data);
                        }
                    },
                    width:"12%"
                },
                {
                    field:{
                        name:"companyAddress",
                        title:"所在地",
                        type:"string"
                    },
                    itemRenderer:{
                        render: function(data, field, index, grid){
                            if(data.companyAddress!=null){
                                if(data.companyAddress.province==""){
                                    return " ";
                                }else {
                                    return address.getPro(data.companyAddress.province)+'-'+address.getCity(data.companyAddress.city);
                                }

                            }
                        }
                    },
                    width:"17%"
                }
                /*{
                    field:{
                        name:"number",
                        title:"执照编码",
                        type:"string"
                    },
                    itemRenderer:{
                        render: function(data, field, index, grid){
                            if(data.licenses!=""){
                                return data.licenses[0].number;
                            }

                        }
                    },
                    width:"14%"
                },*/
                /*{
                    field:{
                        name:"imgurl",
                        title:"营业执照电子版",
                        type:"string"
                    },
                    itemRenderer:{
                        render: function(data, field, index, grid){
                            return $("<img/>").attr("width",50)
                                .attr("height",20).attr("src","/images/certification.jpg")
                                .on("click",function(event){
                                    event.preventDefault();
                                    event.stopPropagation();

                                    var img = "<img  src='"+data.license.imgurl+"'/>";
                                    layer.open({
                                        type: 1,
                                        content: img
                                    });

                                })[0];
                        }
                    },
                    width:"15%"
                }*/
            ]
        }

    })();

    var formatSearchData = function(data){
        if(data.query.mobile){
            data.query.user = data.query.user || {};
            data.query.user.mobile = data.query.mobile;
            delete  data.query.mobile;
        }

        data.query.companyType=companyModel.const.enterprise.PURCHASEERS.key;
        return data;
    };

    var getRoute = function () {
        var route = {panel:activeTabLiInfo,ldata:lists[activeTabLiInfo].val()};
        return route;
    };

    var schemas = (function(){


        var schemas = {
            "tabAll" : {
                searchMeta: {
                    schema:{
                        simple: [
                            // {
                            //     name: "companyId",
                            //     title: "公司ID",
                            //     ctrlType: "TextBox",
                            //     placeholder: "请输入三位ID"
                            // },
                            {
                                name: "companyNameCn",
                                title: "公司名称",
                                ctrlType: "TextBox",
                                placeholder: "请输入公司名称"
                            },
                            {
                                name: "mobile",
                                title: "注册者手机号",
                                ctrlType: "TextBox",
                                placeholder: "请输入11位手机号码"
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
                    selector :"tabAll"
                },
                gridMeta :{
                    columns : header["tabAll"],
                    primaryKey:"companyId",
                    orderMode : 1,
                    afterRowRender : function (row,data) {
                        $(row.dom).on("click",function () {
                            X.router.run("m=purchasers.purchasersEdit&companyId=" + data["companyId"]);
                        });
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
                url : X.config.supplier.api.listByPage,
                toolbar: {
                    items: [
                        {
                            ctrlType: "ToolbarButton",
                            name: "add",
                            title: "增加采购商",
                            icon: "icon-add",
                            click: function (item) {
                                X.router.run("m=purchasers.purchasersEdit", "");
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

    var route = new routerHelper("purchasers.purchasersList",schemas,getRoute);


    return ctrl;

});
