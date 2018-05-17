X.define("modules.message.clientMessage",["modules.common.routerHelper", "model.messageModel", "model.infoManageModel", "common.layer"],function (routerHelper, messageModel,infoManageModel, myLayer) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.message.tpl.clientMessage
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {
        return view.render({}, function () {
            activeTabLiInfo = route.getRoute() || activeTabLiInfo;
            ctrl.initPage();
        });
    };

    var getRoute = function () {
        var route = {panel:activeTabLiInfo, ldata:lists[activeTabLiInfo].val()};
        return route;
    };

    var schemas = (function(){
        var schemas = {
            "tabClient"  :{
                //type: 'GET',
                searchMeta: {
                    schema: {
                        simple:[]
                    },
                    search: {
                        onSearch : function (data) {
                            data.query.messageSource = '1';
                            return data;
                        }
                    },
                    reset :{
                        show:false
                    }
                },
                gridMeta :{
                    columns : [],
                    afterRowRender: function (row, data) {
                        if(data.status == "0"){
                            $(row.dom).find(".js-status").html("未读");
                        }else if(data.status == "1"){
                            $(row.dom).find(".js-status").html("已读").removeClass('bgcDarkOran').addClass('bgcDarkGray');
                        }
                        if(data.message.length > 20){
                            $(row.dom).find(".js-message-content").html(data.message.slice(0, 20) + '...');
                        }else {
                            $(row.dom).find(".js-message-content").html(data.message);
                        }
                        if(data.title.length > 15){
                            $(row.dom).find(".js-title-data").html(data.title.slice(0, 15) + '...');
                        }else {
                            $(row.dom).find(".js-title-data").html(data.title);
                        }

                        $(row.dom).on("click", function (event) {
                            event.stopPropagation();
                            event.preventDefault();
                            var layerTemp = $('.js-layer');
                            layerTemp.find('.js-title').html(data.title);
                            var messageTime = data.messageTime.split(' ')[0];
                            layerTemp.find('.js-messageTime').html(messageTime);
                            layerTemp.find('.js-companyName').html(data.senderCompanyName + ':');
                            layerTemp.find('.js-message').html(data.message);
                            var content = layerTemp.html();
                            var layerIndex = layer.open({
                                    id: 'msgBox',
                                    title: '客户消息',
                                    content: content,
                                    btn: [],
                                    closeBtn: 0,
                                    fixed: true,
                                    resize: false,
                                    move: false,
                                    scrollbar: false,
                                    success: function () {

                                        $(".js-close").click(function () {
                                            layer.close(layerIndex);
                                        });
                                        $(".js-detail").click(function () {
                                            infoManageModel.isResponseExist(data.businessInfoId, function (result) {
                                                layer.close(layerIndex);
                                                if (result == "") {
                                                    X.router.setHistory("m=infoManage.infoManageList");
                                                    X.publish(X.CONSTANTS.channel.menuCall, {
                                                        m: "infoManage.infoManageDetail",
                                                        para: {purchaseInfoId: data.businessInfoId}
                                                    });
                                                } else {
                                                    X.router.setHistory("m=infoManage.myResponseList");
                                                    X.publish(X.CONSTANTS.channel.menuCall, {
                                                        m: "infoManage.myResponseDetail",
                                                        para: {myResponseId: result}
                                                    });
                                                }
                                            });
                                        });
                                        var messageId = data.messageId;
                                        var callback = function (result) {
                                            if (result.statusCode == 2000000) {
                                                lists["tabClient"].loadData();
                                                X.publish(X.CONSTANTS.channel.menuUpdate, "customerMessge");
                                            }
                                        };
                                        messageModel.readClientMessage(messageId, callback);

                                    }
                                }
                            );
                        });
                        $(row.dom).find(".js-delete").on("click", function (event) {
                            event.stopPropagation();
                            event.preventDefault();
                            myLayer.successConfirm('确认删除？', function(index){
                                var messageId = data.messageId;
                                var callback = function(result){
                                    if(result.statusCode == 2000000){
                                        myLayer.successMsg('删除成功',function(index){
                                            myLayer.closeIt(index);
                                        });
                                        lists["tabClient"].loadData();
                                    }
                                };
                                messageModel.deleteClientMessage(messageId, callback);
                            });
                        });
                    },
                    type : "C",
                    selector : ".js-modules-message-clientMessage"
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
                url : X.config.message.api.listClientMessages
            }
        };
        return schemas;
    })();


    var lists = {};
    var activeTabLiInfo = 'tabClient';
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
            afterChangeTab: function (tabLiInfo, targetLi, index, tabPage, oldTab) {
                activeTabLiInfo = tabLiInfo;
                activeTabLi = targetLi;
                // 为了样式效果，把当前选中的前一个加上样式名
                targetLi.prev().addClass('tab_lineNone');
                if(tabLiInfo != oldTab){
                    route.setRoute({panel:tabLiInfo});
                }
            }
        });
    };

    ctrl.load = function (para) {
        ctrl.rendering();
    };

    var route = new routerHelper("message.clientMessage", schemas, getRoute);

    return ctrl;
});
