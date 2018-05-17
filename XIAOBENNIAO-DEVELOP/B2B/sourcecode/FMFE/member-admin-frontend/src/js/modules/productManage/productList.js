X.define("modules.productManage.productList",["model.productsManageModel","data.currencyData","modules.common.routerHelper", 'common.layer'],function (productsManageModel,currencyData,routerHelper, layer) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.productManage.tpl.productList
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.load = function (para) {
        view.render({},function(){
            activeTabLiInfo = route.getRoute() || activeTabLiInfo;
            ctrl.initPage();

            events.bind()
        });
    };

    var events = {
        bind: function() {
            $(".js-datagrid", view.el).on("click", ".js-delete", function(){
                var data = {commodityIds: [this.id]}
                productsManageModel.del(data, function(res) {
                    if (res.statusCode === X.constant.statusCode.SUCCESS) {
                        layer.successMsg('删除成功', function() {
                            ctrl.load()
                        })
                    } else {
                        layer.alert('删除失败, 请联系服务人员')
                    }
                })
            })

            $(".js-datagrid").on("click", ".js-detail", function () {
                window.open(X.constructor.prototype.config.PATH_FILE.path.weInTradeUrl + this.id+'.html')
            });
        }
    }


    var header = (function () {

        return {
            "tabAll" : [
                {
                    field:{
                        name:"commodityNumber",
                        title:"商品编号",
                        type:"string"
                    },
                    width:"8%"
                },
                {
                    field:{
                        name: "dataSourceId",
                        title:"来源",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data) {
                            if(data.dataSourceId && data.dataSourceId < 4){
                                return productsManageModel.dataSource[data.dataSourceId].value;
                            }
                        }
                    },
                    width:"8%"
                },
                {
                    field:{
                        name:"title",
                        title:"商品标题",
                        type:"string"
                    },
                    width:"16%"

                },
                {
                    field:{
                        name:"price",
                        title:"价格",
                        type:"string"
                    },
                    width:"8%"
                },
                {
                    field:{
                        name:"currency",
                        title:"币种",
                        type:"string"
                    },
                    itemRenderer: {
                       render: function (data, field, index, grid) {
                           if(data.currency){
                               return isNaN(data.currency)? data.currency: currencyData.currencyKinds[data.currency].value;
                           }
                           else{
                               return " "
                           }
                    
                       }
                    },
                    width:"8%"
                },
                {
                    field:{
                        name:"companyName",
                        title:"会员名称",
                        type:"string"
                    },
                    width:"8%"
                },
                {
                    field:{
                        name:"",
                        title:"操作",
                        type:"operation"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return "<span class='colBlue js-detail' id='"+data.commodityId+"'>详情</span><a href='#' class='ml10 colBlue js-delete' id='"+ data.commodityId +"'>删除</a>"
                        }
                    },
                    width:"10%",
                    className:"operation_main colBlue"
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
                        simple: [
                            {
                                name: "commodityNumber",
                                title: "商品编号",
                                ctrlType: "TextBox",
                                placeholder: "请输入公司名称"
                            },
                            {
                                name: "title",
                                title: "商品标题",
                                ctrlType: "TextBox",
                                placeholder: "请输入11位手机号码",
                                className : "disb"
                            },
                            {
                                name: "companyName",
                                title: "会员名称",
                                ctrlType: "TextBox",
                                placeholder: "请输入11位手机号码"
                            }
                            //{
                            //    name: "dataSourceId",
                            //    title: "数据来源",
                            //    ctrlType: "ComboBox",
                            //    dataSource: productsManageModel.dataSource
                            //}
                        ]
                    },
                    search: {
                        onSearch : function (data,searcher,click) {
                            return data
                        }
                    },
                    selector :"tabAll",
                    reset: {
                        show: false
                    }
                },
                gridMeta: {
                    columns: header["tabAll"]
                },
                pageInfo : {
                    pageSize : '10',
                    pageNo : '1'
                },
                url : X.config.productManage.api.productList
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

    var route = new routerHelper("productManage.productList",schemas,getRoute);


    return ctrl;

});
