X.define("modules.message.systemMessage",["model.messageModel","common.layer"],function (messageModel,layer) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.message.tpl.systemMessage
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {
        return view.render({}, function () {
            ctrl.initPage()
        });
    };

    var schemas = (function(){
        var schemas = {
            "tabMessage" :{
                searchMeta: {
                    schema: {
                        simple:[]
                    },
                    search: {
                        onSearch : function (data) {
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
                            $(row.dom).find(".js-messageStatus").html("未读");
                        }else if(data.status == "1"){
                            $(row.dom).find(".js-messageStatus").css("display","none");
                        }
                        $(row.dom).on("click", function (event) {
                            event.stopPropagation();
                            event.preventDefault();
                            layer.successBtn('<p class="col66 pb10 bottomBorder">发送时间：'+data.createDate+'</p><p class="mt20">'+data.content+'</p>',"消息内容",function(number){
                                var postData ={
                                    messageId: data.messageId,
                                    status: data.status
                                };
                                var callback = function(result){
                                    if(result.statusCode ==2000000){
                                        layer.closeIt(number);
                                        lists["tabMessage"].loadData();
                                        X.publish(X.CONSTANTS.channel.menuUpdate, "systemMessage");
                                    }
                                };
                                messageModel.readMessage(postData,callback);
                            })
                        });
                        $(row.dom).find(".js-delete").on("click", function (event) {
                            event.stopPropagation();
                            event.preventDefault();
                            layer.successConfirm('确认删除？', function(index){
                                var pData = data.messageId;
                                var callback = function(result){
                                    if(result.statusCode ==2000000){
                                        //删除成功;
                                        layer.successMsg('删除成功',function(index){
                                            layer.closeIt(index);
                                        });
                                        lists["tabMessage"].loadData();
                                        X.publish(X.CONSTANTS.channel.menuUpdate, "systemMessage");
                                    }
                                };
                                messageModel.deleteMessage(pData,callback);
                            });
                        });
                    },
                    type : "C",
                    selector : ".js-message-systenMessage-tpl"
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
                url : X.config.message.api.listSystemMessages
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

    return ctrl;
});
