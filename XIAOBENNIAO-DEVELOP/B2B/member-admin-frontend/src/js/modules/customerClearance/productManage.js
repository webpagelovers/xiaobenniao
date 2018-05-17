X.define("modules.customerClearance.productManage", ["modules.common.routerHelper","model.productManageModel"], function (routerHelper, model) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.customerClearance.tpl.productManage
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    var gridColumns = [
        {
            field:{
                name:"",
                title:"序号",
                type:"int"
            },
            width:"5%",
            itemRenderer: {
                render: function(data) {
                    return '' + (data['_index'] + 1)
                }
            },
            className:"tL"
        },
        {
            field:{
                name: "nameCn",
                title:"产品名称",
                type:"string"
            },
            width:"8%"
        },
        {
            field:{
                name:"nameEn",
                title:"产品英文名称",
                type:"string"
            },
            width:"8%"
        },
        {
            field:{
                name:"hsCode",
                title:"hsCode",
                type:"string"
            },
            width:"8%"
        },
        {
            field:{
                name:"brand",
                title:"品牌",
                type:"string"
            },
            width:"8%"
        },
        {
            field:{
                name:"texture",
                title:"材质",
                type:"string"
            },
            width:"5%"
        },
        {
            field:{
                name:"createTime",
                title:"提交时间",
                type:"string"
            },
            itemRenderer: {
                render: function(data) {
                    return data.createTime? data.createTime.split(' ')[0]:''
                }
            },
            width:"5%"
        },
        {
            field:{
                name:"auditerName",
                title:"审核人",
                type:"string"
            },
            width:"5%"
        },
        {
            field:{
                name:"status",
                title:"状态",
                type:"string"
            },
            itemRenderer: {
                render: function(data) {
                    return model.productStatus[data.status]
                }
            },
            width:"5%"
        },
        {
            field:{
                name:"",
                title:"操作"
            },
            itemRenderer: {
                render: function (data) {
                   return '<span class="productDetail curp colBlue" id="'+ data.productId +'" status="'+ data.status +'">'+ (data.status == 1? '审核': '详情') +'</span>'
                }
            },
            width:"10%"
        }
    ]

    var header  = {},
        schemas = {}

    var searchMeta = {
        schema: {
            simple: [
                {
                    name:"nameCn",
                    inputName: "nameCn",
                    title:"产品名称",
                    ctrlType:"TextBox",
                    placeholder :"产品名称",
                    className : "mr30"
                },
                {
                    name:"status",
                    inputName: "status",
                    title:"状态",
                    ctrlType:"ComboBox",
                    className: '',
                    dataSource: model.genAuditStatus()
                }
            ]
        },
        search: {
            onSearch : function(data, searcher) {
                if (!data.query.status) {
                    data.query.status = searcher.elem.parent().index() - 1
                }
                data.query.status == 0 && delete data.query.status
                return data
            }
        }
    }

    var events = {
        init: function() {
            this.genSchemas()
            view.el.on('click', '.productDetail', function() {
                var id      = this.id,
                    status  = this.getAttribute('status')

                X.router.run('m=customerClearance.productDetail&id='+id+'&status='+status)
            })
        },
        genSchemas: function() {
            model.auditStatus.forEach(function(item, i) {
                var schema = {
                    searchMeta: searchMeta,
                    gridMeta: {columns: gridColumns},
                    pageInfo: { pageSize : '10', pageNo : '1' },
                    url: X.config.customerClearance.api.productManage
                }

                schemas[item] = schema
            })
        }
    }


    var getRoute = function () {
        var route = {panel:activeTabLiInfo,ldata:lists[activeTabLiInfo].val()};
        return route;
    };


    var lists = {};
    var activeTabLiInfo = model.auditStatus[0];
    function initTabPage($elem,schema,tabPage) {
        var list = X.controls.getControl("List",$elem,schema);
        list.init();
        lists[tabPage] = list;
    };


    ctrl.load  =function (){
        view.render(function(){
            activeTabLiInfo = route.getRoute() || activeTabLiInfo;
            events.init()

            var tabPannel = X.controls.getControl("TabPanel", $('.js_tabPannel'), {
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
                    return true;
                },
                afterChangeTab: function (tabLiInfo, targetLi, index, tabPage,oldTab) {
                    activeTabLiInfo = tabLiInfo;
                    activeTabLi = targetLi;
                    if(tabLiInfo!=oldTab){
                        route.setRoute({panel:tabLiInfo});
                    }
                    
                    var statusCom = $('.js-status').parent().parent()
                    index? statusCom.hide(): statusCom.show()
                }
            });
        })
    };

    var route = new routerHelper("customerClearance.productManage",schemas,getRoute);

    return ctrl
})