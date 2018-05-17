X.define("modules.contract.contractList",["modules.common.routerHelper","model.contractModel"],function (routerHelper,contractModel) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.contract.tpl.contractList
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


    var formatStatus = function(data){
        var contractStatus = "";
        switch (data.contractStatus){
            case contractModel.constants.viewStatus.SAVED.key:
                contractStatus = contractModel.constants.viewStatus.SAVED.text;
                break;
            case contractModel.constants.viewStatus.AUDIT.key:
                contractStatus = contractModel.constants.viewStatus.AUDIT.text;
                break;
            case contractModel.constants.viewStatus.EFFECT.key:
                contractStatus = contractModel.constants.viewStatus.EFFECT.text;
                break;
            case contractModel.constants.viewStatus.REJECTED.key:
                contractStatus = contractModel.constants.viewStatus.REJECTED.text;
                break;
        }
        return contractStatus;
    };
    var header = (function () {
        return {
            "tabAll" :  [
                {
                    field:{
                        name:"contractName",
                        title:"名称",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function(data) {
                            return '<p class="contract-word-cut w120" title="'+ data.contractName +'">'+ data.contractName +'</p>'
                        }
                    },
                    width:"10%",
                    className:"tL"
                },
                {
                    field:{
                        name: "contractAbstract",
                        title:"摘要说明",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function(data) {
                            return '<p class="contract-word-cut w120">'+ data.contractAbstract +'</p>'
                        }
                    },
                    width:"12%"
                },
                {
                    field:{
                        name:"customerName",
                        title:"客户名称",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function(data) {
                            return '<p class="contract-word-cut w120" title="'+ data.customerName +'">'+ data.customerName +'</p>'
                        }
                    },
                    width:"15%"
                },
                {
                    field:{
                        name:"createDate",
                        title:"创建时间",
                        type:"string"
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"createUserName",
                        title:"创建人",
                        type:"string"
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"contractStatus",
                        title:"状态",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            switch (data.contractStatus){
                                case contractModel.constants.viewStatus.SAVED.key:
                                    return contractModel.constants.viewStatus.SAVED.text;
                                    break;
                                case contractModel.constants.viewStatus.AUDIT.key:
                                    return contractModel.constants.viewStatus.AUDIT.text;
                                    break;
                                case contractModel.constants.viewStatus.EFFECT.key:
                                    return contractModel.constants.viewStatus.EFFECT.text;
                                    break;
                                case contractModel.constants.viewStatus.REJECTED.key:
                                    return contractModel.constants.viewStatus.REJECTED.text;
                                    break;
                            }
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
                        render: function (data, field, index, grid) {//SAVED REJECTED
                            if(data.contractStatus == contractModel.constants.viewStatus.SAVED.key ||
                                data.contractStatus == contractModel.constants.viewStatus.REJECTED.key ){
                                var $edit = $("<span class='colff6 curp'>编辑</span> <span class='m5'> | </span>")
                                    .on("click", function (event) {
                                        event.stopPropagation();
                                        X.publish(X.CONSTANTS.channel.menuCall,{m:"contract.contractEdit",para:{contractId:data.contractId}});
                                    });
                                var $delete = $("<span class='colff6 curp'>删除</span>")
                                    .on("click", function (event) {
                                        event.stopPropagation();
                                        var layerDelete = layer.confirm('确认删除', {
                                            title:"提示",
                                            content: "<div class='tac'>确认删除？</div>",
                                            yes: function () {
                                                layer.close(layerDelete);
                                                contractModel.deleteContract([data.contractId], function (result) {
                                                   var layerConfim =layer.open({
                                                        title: '提示',
                                                        content: ' <i class="iconfont icon-bgcDuiguo colGreen f24 mr10"></i>删除成功',
                                                       closeBtn: 0,
                                                        yes:function(){
                                                            layer.close(layerConfim);
                                                            ctrl.load();
                                                        }
                                                    });
                                                });
                                            }
                                        });

                                    });

                                return  $("<div></div>").append($edit).append($delete)[0];

                            }else if(data.contractStatus == contractModel.constants.viewStatus.AUDIT.key ||
                                data.contractStatus == contractModel.constants.viewStatus.EFFECT.key){//EFFECT AUDIT
                                var $edit = $("<span class='colff6 curp'>查看详情</span>")
                                    .on("click", function (event) {
                                        event.stopPropagation();
                                        X.router.run("m=contract.contractDetails&contractId="+data["contractId"]);
                                    });
                                return  $("<div></div>").append($edit).append($delete)[0];
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
                                name:"createDate",
                                inputName: "createDate",
                                title:"创建时间",
                                ctrlType:"DateRangePicker",
                                placeholder:"",
                                className : "mr60"
                            },
                            {
                                name:"contractStatus",
                                title:"状态",
                                ctrlType:"ComboBox",
                                className : "w160 va_8 tac",
                                dataSource: contractModel.constants.searchStatus
                            },
                            {
                                name:"searchName",
                                inputName: "formNumber",
                                title:"关键字",
                                ctrlType:"TextBox",
                                placeholder:"名称/客户名称",
                                className : "mr30"
                            }
                        ]
                    },
                    search: {
                        onSearch : function (data,searcher,click) {
                           /* $(".js-datagrid tbody").html("");*/
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
                url : X.config.contract.api.contractList,
                toolbar : {
                    items: [
                        {
                            ctrlType:"ToolbarButton",
                            name:"add",
                            title:"创建合同",
                            icon:"icon-add",
                            click:function (item) {
                                X.router.run("m=contract.contractAdd","");
                            }
                        }
                    ]
                }
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
    function showBox(obj,box){
        var timer = null;
        $(obj).on("mouseover", function (e) {
            clearTimeout(timer);
            var clientX = e.clientX;
            var clientY = e.clientY;
            var txt = $(this).text();
            timer = setTimeout(function () {
                console.log(clientX, clientY);
                $(box).css("left", clientX).css("top", clientY);
                if (txt == "") {
                    $(box).hide();
                } else {
                    $(box).show();
                    $(box).html(txt);
                }
            }, 1000);
        });
        $(obj).on("mouseout",function(){
            clearTimeout(timer);
            $(box).hide();
        });
    }

    showBox(".table_main tbody td",".js-moreText");

    var route = new routerHelper("contract.contractList",schemas,getRoute);
    return ctrl;

});