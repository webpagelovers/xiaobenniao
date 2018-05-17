
X.define("modules.supplier.supplierList",["model.companyModel","data.addressData","modules.common.routerHelper"],function (companyModel,address,routerHelper) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.supplier.tpl.supplierList
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
        var userTypeRender = {
            render: function(data, field, index, grid){
                var result = "";
                companyModel.const.companyType.forEach(function(value,index,array){
                    if(value["key"]==data["memberType"]){
                        result = value["value"];
                    }                    
                });

                return result;
            }
        };

        var operationTypeRender = {
            render: function (data, field, index, grid) {
                if(data.status == companyModel.const.status.NOAUDIT.key){
                    var $edit = $("<span class='curp'>审核</span>")
                        .on("click", function (event) {
                            event.stopPropagation();
                            X.router.run("m=supplier.supplierDisplay&companyId=" + data["companyId"]);
                        });
                    return  $("<div></div>").append($edit)[0];
                }else{
                    var $details = $("<span class='curp'>详情</span>")
                        .on("click", function (event) {
                            event.stopPropagation();
                            X.router.run("m=supplier.supplierDisplay&companyId=" + data["companyId"]);
                        });

                    return  $("<div></div>").append($details)[0];
                }
            }
        };

        return {
            "tabAll":  [
                {
                    field:{
                        name: "companyNameCn",
                        title:"公司名称",
                        type:"string"
                    },
                    width:"12%"
                },
                {
                    field:{
                        name:"user",
                        title:"注册者手机号",
                        type:"string"
                    },
                    itemRenderer:{
                        render: function(data, field, index, grid){
                            return formatMobile(data);
                        }
                    },
                    width:"7%"
                },
                {
                    field:{
                        name:"registeredCapital",
                        title:"注册资金",
                        type:"string"
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"createDate",
                        title:"提交时间",
                        type:"string"
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"memberType",
                        title:"会员种类",
                        type:"string"
                    },
                    width:"10%",
                    itemRenderer : userTypeRender
                },
                {
                    field:{
                        name:"companyAddress",
                        title:"所在地",
                        type:"string"
                    },
                    itemRenderer:{
                        render: function(data, field, index, grid){
                            if(data.province || data.district){
                                return address.getPro(data.province)+'-'+address.getDistrict(data.district);
                            }else {
                                return "";
                            }
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
                    itemRenderer:{
                        render: function(data, field, index, grid){
                            return formatStatus(data);
                        }
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"",
                        title:"操作",
                        type:"operation"
                    },
                    itemRenderer: operationTypeRender,
                    width:"10%",
                    className:"operation_main colBlue"
                 }
            ],
            "tabPending": [
                {
                    field:{
                        name: "companyNameCn",
                        title:"公司名称",
                        type:"string"
                    },
                    width:"12%"
                },
                {
                    field:{
                        name:"user",
                        title:"注册者手机号",
                        type:"string"
                    },
                    itemRenderer:{
                        render: function(data, field, index, grid){
                            return formatMobile(data);
                        }
                    },
                    width:"7%"
                },
                {
                    field:{
                        name:"registeredCapital",
                        title:"注册资金",
                        type:"string"
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"createDate",
                        title:"提交时间",
                        type:"string"
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"memberType",
                        title:"会员种类",
                        type:"string"
                    },
                    width:"10%",
                    itemRenderer : userTypeRender
                },
                {
                    field:{
                        name:"companyAddress",
                        title:"所在地",
                        type:"string"
                    },
                    itemRenderer:{
                        render: function(data, field, index, grid){
                            if(data.province || data.district){
                                return address.getPro(data.province)+'-'+address.getDistrict(data.district);
                            }else {
                                return "";
                            }
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
                    itemRenderer:{
                        render: function(data, field, index, grid){
                            return formatStatus(data);
                        }
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"",
                        title:"操作",
                        type:"operation"
                    },
                    width:"10%",
                    itemRenderer: operationTypeRender,
                    className:"operation_main colBlue"
                }
            ],
            "tabPass": [
                {
                    field:{
                        name: "companyNameCn",
                        title:"公司名称",
                        type:"string"
                    },
                    width:"12%"
                },
                {
                    field:{
                        name:"user",
                        title:"注册者手机号",
                        type:"string"
                    },
                    itemRenderer:{
                        render: function(data, field, index, grid){
                            return formatMobile(data);
                        }
                    },
                    width:"7%"
                },
                {
                    field:{
                        name:"registeredCapital",
                        title:"注册资金",
                        type:"string"
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"createDate",
                        title:"提交时间",
                        type:"string"
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"memberType",
                        title:"会员种类",
                        type:"string"
                    },
                    width:"10%",
                    itemRenderer : userTypeRender
                },
                {
                    field:{
                        name:"companyAddress",
                        title:"所在地",
                        type:"string"
                    },
                    itemRenderer:{
                        render: function(data, field, index, grid){
                            if(data.province || data.district){
                                return address.getPro(data.province)+'-'+address.getDistrict(data.district);
                            }else {
                                return "";
                            }
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
                    itemRenderer:{
                        render: function(data, field, index, grid){
                            return formatStatus(data);
                        }
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"",
                        title:"操作",
                        type:"operation"
                    },
                    width:"10%",
                    itemRenderer: operationTypeRender,
                    className:"operation_main colBlue"
                }
            ],
            "tabNopass" : [
                {
                    field:{
                        name: "companyNameCn",
                        title:"公司名称",
                        type:"string"
                    },
                    width:"12%"
                },
                {
                    field:{
                        name:"user",
                        title:"注册者手机号",
                        type:"string"
                    },
                    itemRenderer:{
                        render: function(data, field, index, grid){
                            return formatMobile(data);
                        }
                    },
                    width:"7%"
                },
                {
                    field:{
                        name:"registeredCapital",
                        title:"注册资金",
                        type:"string"
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"createDate",
                        title:"提交时间",
                        type:"string"
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"memberType",
                        title:"会员种类",
                        type:"string"
                    },
                    width:"10%",
                    itemRenderer : userTypeRender
                },
                {
                    field:{
                        name:"companyAddress",
                        title:"所在地",
                        type:"string"
                    },
                    itemRenderer:{
                        render: function(data, field, index, grid){
                            if(data.province || data.district){
                                return address.getPro(data.province)+'-'+address.getDistrict(data.district);
                            }else {
                                return "";
                            }
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
                    itemRenderer:{
                        render: function(data, field, index, grid){
                            return formatStatus(data);
                        }
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"",
                        title:"操作",
                        type:"operation"
                    },
                    width:"10%",
                    itemRenderer: operationTypeRender,
                    className:"operation_main colBlue"
                }
            ]
        }
    })();
   

    var formatSearchData = function(data){        
              
        return data;
    };
    var formatStatus = function(data){
        var status = "";
        switch (data.status){
            case companyModel.const.status.NOAUDIT.key:
                status = companyModel.const.status.NOAUDIT.text;
                break;
            case companyModel.const.status.APPROVED.key:
                status = companyModel.const.status.APPROVED.text;
                break;
            case companyModel.const.status.REJECTED.key:
                status = companyModel.const.status.REJECTED.text;
                break;
            case companyModel.const.status.DELETED.key:
                status = companyModel.const.status.DELETED.text;
                break;
        }
        return status;
    };

    var formatMobile = function(data){
        return data["mobile"];
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
                        simple:[
                            {
                                name:"companyNameCn",
                                inputName: "companyNameCn",
                                title:"公司名称",
                                ctrlType:"TextBox",
                                placeholder :"请输入公司名称"
                            },
                            {
                                name:"mobile",
                                inputName: "mobile",
                                title:"注册者手机号",
                                ctrlType:"TextBox",
                                placeholder:"请输入11位手机号"
                            },
                          /*  {
                                name:"number",
                                inputName: "number",
                                title:"营业执照编码",
                                ctrlType:"TextBox",
                                placeholder:"请输入10位营业执照编号"
                            },*/
                            {
                                name:"memberType",
                                inputName: "memberType",
                                title:"会员种类",
                                ctrlType:"ComboBox",
                                dataSource: companyModel.const.companyType
                            }
                        ]
                    },
                    search: {
                        onSearch : function (data,searcher,click) {                            
                            if(click){
                                //storeHelper.setStore(tabPannel);
                                route.setRoute(getRoute());
                            }
                            var result = formatSearchData(data);
                            result.query.tabType = 0; //全部                            
                            return result;
                        }
                    },
                    selector :"tabAll"
                },
                gridMeta :{
                    columns : header["tabAll"],
                    primaryKey:"companyId",
                    orderMode : 1,
                    afterRowRender : function (row,data) {
                        // $(row.dom).on("click",function () {
                        //     X.router.run("m=supplier.supplierDisplay&companyId="+data["companyId"]);
                        // });
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
                url : X.config.supplier.api.listByPage
            },
            "tabPending" : {
                searchMeta: {
                    schema:{
                        simple:[
                            {
                                name:"companyNameCn",
                                inputName: "companyNameCn",
                                title:"公司名称",
                                ctrlType:"TextBox",
                                placeholder :"请输入公司名称"
                            },
                            {
                                name:"mobile",
                                inputName: "mobile",
                                title:"注册者手机号",
                                ctrlType:"TextBox",
                                placeholder:"请输入11位手机号"
                            },
                            /*{
                                name:"number",
                                inputName: "number",
                                title:"营业执照编码",
                                ctrlType:"TextBox",
                                placeholder:"请输入10位营业执照编号"
                            },*/
                            {
                                name:"memberType",
                                inputName: "memberType",
                                title:"会员种类",
                                ctrlType:"ComboBox",
                                dataSource: companyModel.const.companyType
                            }
                        ]
                    },
                    search: {
                        onSearch : function (data,searcher,click) {
                            if(click){
                                //storeHelper.setStore(tabPannel);
                                route.setRoute(getRoute());
                            }
                            var result = formatSearchData(data);
                            result.query.tabType = 1; //待审核    
                            
                            return result;
                        }
                    },
                    selector :"tabPending"
                },
                gridMeta :{
                    columns : header["tabPending"],
                    primaryKey:"companyId",
                    orderMode : 1,
                    afterRowRender : function (row,data) {
                        // $(row.dom).on("click",function () {
                        //     X.router.run("m=supplier.supplierDisplay&companyId="+data["companyId"]);
                        // });
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
                url : X.config.supplier.api.listByPage
            },
            "tabPass" : {
                searchMeta: {
                    schema:{
                        simple:[
                            {
                                name:"companyNameCn",
                                inputName: "companyNameCn",
                                title:"公司名称",
                                ctrlType:"TextBox",
                                placeholder :"请输入公司名称"
                            },
                            {
                                name:"mobile",
                                inputName: "mobile",
                                title:"注册者手机号",
                                ctrlType:"TextBox",
                                placeholder:"请输入11位手机号"
                            },
                            /*  {
                             name:"number",
                             inputName: "number",
                             title:"营业执照编码",
                             ctrlType:"TextBox",
                             placeholder:"请输入10位营业执照编号"
                             },*/
                            {
                                name:"memberType",
                                inputName: "memberType",
                                title:"会员种类",
                                ctrlType:"ComboBox",
                                dataSource: companyModel.const.companyType
                            }
                        ]
                    },
                    search: {
                        onSearch : function (data,searcher,click) {
                            if(click){
                                //storeHelper.setStore(tabPannel);
                                route.setRoute(getRoute());
                            }
                            var result = formatSearchData(data);
                            result.query.tabType = 2; //审核通过   
                             return result;
                        }
                    },
                    selector :"tabPass"
                },
                gridMeta :{
                    columns : header["tabPass"],
                    primaryKey:"companyId",
                    orderMode : 1,
                    afterRowRender : function (row,data) {
                        // $(row.dom).on("click",function () {
                        //     X.router.run("m=supplier.supplierDisplay&companyId="+data["companyId"]);
                        // });
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
                url : X.config.supplier.api.listByPage
            },
            "tabNopass" : {
                searchMeta: {
                    schema:{
                        simple:[
                            {
                                name:"companyNameCn",
                                inputName: "companyNameCn",
                                title:"公司名称",
                                ctrlType:"TextBox",
                                placeholder :"请输入公司名称"
                            },
                            {
                                name:"mobile",
                                inputName: "mobile",
                                title:"注册者手机号",
                                ctrlType:"TextBox",
                                placeholder:"请输入11位手机号"
                            },
                           /* {
                                name:"number",
                                inputName: "number",
                                title:"营业执照编码",
                                ctrlType:"TextBox",
                                placeholder:"请输入10位营业执照编号"
                            },*/
                            {
                                name:"memberType",
                                inputName: "memberType",
                                title:"会员种类",
                                ctrlType:"ComboBox",
                                dataSource: companyModel.const.companyType
                            }
                        ]
                    },
                    search: {
                        onSearch : function (data,searcher,click) {
                            if(click){
                                route.setRoute(getRoute());
                            }
                            var result = formatSearchData(data);
                            result.query.tabType = 3; //驳回                            
                            return result;
                           
                        }
                    },
                    selector :"tabNopass"
                },
                gridMeta :{
                    columns : header["tabNopass"],
                    primaryKey:"companyId",
                    orderMode : 1,
                    afterRowRender : function (row,data) {
                        // $(row.dom).on("click",function () {
                        //     X.router.run("m=supplier.supplierDisplay&companyId="+data["companyId"]);
                        // });
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
                url : X.config.supplier.api.listByPage
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


    var route = new routerHelper("supplier.supplierList",schemas,getRoute);
    return ctrl;

});