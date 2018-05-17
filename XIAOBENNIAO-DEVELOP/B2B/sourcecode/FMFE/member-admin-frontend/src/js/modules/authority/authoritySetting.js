X.define("modules.authority.authoritySetting",["model.adminModel","model.roleModel","modules.common.routerHelper","common.layer"],function (adminModel,roleModel,routerHelper,layer) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.authority.tpl.authoritySetting
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {
        view.render({},function(){
            activeTabLiInfo = route.getRoute() || activeTabLiInfo;
            ctrl.initPage()
        });
    };

    var header = (function () {
        return {
            "tabAdministrator" :  [
                {
                    field:{
                        name:"userName",
                        title:"登录名",
                        type:"int"
                    },
                    width:"10%",
                    className:"tL"
                },
                {
                    field:{
                        name: "lastLoginTime",
                        title:"上次登录时间",
                        type:"string"
                    },
                    width:"12%"
                },
                {
                    field:{
                        name:"lastLoginIp",
                        title:"上次登录IP",
                        type:"string"
                    },
                    width:"7%"
                },
                {
                    field:{
                        name:"loginCount",
                        title:"登陆次数",
                        type:"string"
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"role.roleName",
                        title:"角色",
                        type:"string"
                    },
                    width:"10%",
                    itemRenderer:{
                        render: function(data, field, index, grid){
                            return data.role.roleName;
                        }
                    }

                },
                {
                    field:{
                        name:"",
                        title:"操作",
                        type:"operation"
                    },
                    width:"10%",
                    className:"operation_main",
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return $("<i class='iconfont icon-lajitong'></i>")
                                .on("click", function (event) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    layer.successConfirm('确认删除？', function(index){
                                        adminModel.m_delete({
                                            "data": data, callback: function () {
                                                layer.successMsg('删除成功',function(){
                                                    //删除成功;
                                                    layer.closeIt();
                                                    lists["tabAdministrator"].loadData();
                                                });
                                            }
                                        });
                                    });
                                })[0];
                        }
                    }
                }
            ],
            "tabRole": [
                {
                    field:{
                        name:"roleName",
                        title:"角色名称",
                        type:"int"
                    },
                    width:"10%",
                    className:"tL"
                },
                {
                    field:{
                        name: "",
                        title:"编辑",
                        type:"string"
                    },
                    width:"12%",
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return $("<div>").attr("width",50)
                                .attr("height",20).attr("class","iconfont icon-write")
                                .on("click",function(event){

                                })[0];
                        }
                    }
                },
                {
                    field:{
                        name:"",
                        title:"删除",
                        type:"string"
                    },
                    width:"7%",
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return $("<i class='iconfont icon-lajitong'></i>")
                                .on("click", function (event) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    layer.successConfirm('确认删除？', function(index){
                                        roleModel.m_delete({
                                            "data": data, callback: function () {
                                                layer.successMsg('删除成功',function(){
                                                    //删除成功;
                                                    layer.closeIt();
                                                    lists["tabRole"].loadData();
                                                });
                                            }
                                        });
                                    });
                                })[0];
                        }
                    }
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
            "tabAdministrator" : {
                searchMeta: {
                    schema:{
                        simple:[

                        ]
                    },
                    search: {
                        onSearch : function (data,searcher,click) {
                            if(click){
                                route.setRoute(getRoute());
                            }
                            return data;
                        }
                    }
                },
                gridMeta :{
                    columns : header["tabAdministrator"],
                    primaryKey:"backendUserId",
                    orderMode : 1,
                    afterRowRender : function (row,data) {
                        $(row.dom).on("click",function () {
                            X.router.run("m=authority.addAdmin&backendUserId="+data["backendUserId"]);
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
                url : X.config.authority.api.adminListPage,
                toolbar : {
                    items: [
                        {
                            ctrlType:"ToolbarButton",
                            name:"add",
                            title:"增加管理员",
                            icon:"icon-add",
                            click:function (item) {
                                X.router.run("m=authority.addAdmin","");
                            }
                        }
                    ]
                }
            },
            "tabRole" : {
                searchMeta: {
                    schema:{
                        simple:[

                        ]
                    },
                    search: {
                        onSearch : function (data,searcher,click) {
                            if(click){
                                route.setRoute(getRoute());
                            }
                            return data;
                        }
                    }
                },
                gridMeta :{
                    columns :  header["tabRole"],
                    primaryKey:"roleId",
                    orderMode : 1,
                    afterRowRender : function (row,data) {
                        $(row.dom).on("click",function () {
                            X.router.run("m=authority.addRole&roleId="+data["roleId"]);
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
                        elem: '.js_small_papogation3'
                    }
                },
                url : X.config.authority.api.roleListPage,
                toolbar : {
                    items: [
                        {
                            ctrlType:"ToolbarButton",
                            name:"add",
                            title:"增加角色",
                            icon:"icon-add",
                            click:function (item) {
                                X.router.run("m=authority.addRole","");
                            }
                        }
                    ]
                }
            }
        };

        return schemas;
    })();

    var lists = {};
    var activeTabLiInfo = "tabAdministrator";
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

    ctrl.load = function (para) {
        ctrl.rendering();
    };

    var route = new routerHelper("authority.authoritySetting",schemas,getRoute);
    return ctrl;

});
