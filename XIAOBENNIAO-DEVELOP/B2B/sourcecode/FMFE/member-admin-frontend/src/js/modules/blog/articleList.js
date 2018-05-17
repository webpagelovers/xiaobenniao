X.define("modules.blog.articleList",["model.blogModel","common.layer"],function (blogModel,layer) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.blog.tpl.articleList
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.load = function (para) {
        view.render({},function(){
            ctrl.initPage();
            events.bind()
        });
    };

    var events = {
        bind: function() {
            $(".js-datagrid", view.el).on("click", ".js-delete", function(){
                var that = this;
                var callback = function(){
                    var data = {postId: that.id};
                    blogModel.del(data, function(res) {
                        layer.closeAll();
                        if (res.statusCode === X.constant.statusCode.SUCCESS) {
                            layer.successMsg('删除成功', function() {
                                blogModel.renderStaticPage($(that).parents('tr').siblings().find('.js-delete')[0].id)
                                ctrl.load()
                            })

                        } else {
                            layer.alert('删除失败, 请联系服务人员')
                        }
                    })
                };

                var opt = {
                    title: '提示',
                    btn: ['确定','取消'],
                    area: ['300px','200px'],
                    content: '<div style="padding:45px 90px 20px;font-size: 18px;">' + '确定要删除？'+'</div>',
                    yes: callback
                };

                //弹窗提示是否删除
                layer.layerOpen(opt);
            });

            $(".js-datagrid").on("click", ".js-detail", function () {
                window.open(X.constructor.prototype.config.PATH_FILE.path.weInTdUrl+'blog/' + this.id+'.html');
            });

            $(".js-datagrid").on("click", ".js-articleEdit", function () {
                X.router.run('m=blog.articleEdit&postId=' + this.id)
            });
        }
    };


    var header = (function () {

        return {
            "tabAll" : [
                {
                    field:{
                        name:"postTitle",
                        title:"文章标题",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            var dataTitle = data.postTitle.length > 65 ?  data.postTitle.slice(0,65)+'...' : data.postTitle;
                            return "<span title=\""+data.postTitle+"\">"+dataTitle+"</span>";
                        }
                    },
                    width:"22%"
                },
                {
                    field:{
                        name: "postAuthor",
                        title:"作者",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            var postAuthor = data.postAuthor.length > 25 ?  data.postAuthor.slice(0,25)+'...' : data.postAuthor;
                            return "<span title='"+ data.postAuthor + "'>"+postAuthor+"</span>";
                        }
                    },
                    width:"8%"
                },
                {
                    field:{
                        name:"createTime",
                        title:"更新时间",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return data.postModified ? data.postModified : data.createTime;
                        }
                    },
                    width:"8%"

                },
                {
                    field:{
                        name:"postStatus",
                        title:"状态",
                        type:"string"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return data.postStatus == blogModel.statusconst.postStatus.PUBLISH.key ?  blogModel.statusconst.postStatus.PUBLISH.text : blogModel.statusconst.postStatus.SAVE.text;
                        }
                    },
                    width:"5%"
                },
                {
                    field:{
                        name:"",
                        title:"操作",
                        type:"operation"
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            if(data.postStatus == blogModel.statusconst.postStatus.PUBLISH.key){
                                return "<span class='colBlue js-detail' id='"+data.postId+"'>查看</span><span class='ml10 colBlue js-articleEdit' id='"+data.postId+"'>编辑</span><span class='ml10 colBlue js-delete' id='"+ data.postId +"'>删除</span>"
                            }else{
                                return "<span class='ml10 colBlue js-articleEdit' id='"+data.postId+"'>编辑</span><span class='ml10 colBlue js-delete' id='"+ data.postId +"'>删除</span>"
                            }
                        }
                    },
                    width:"10%",
                    className:"operation_main colBlue"
                }
            ]
        }

    })();


    var schemas = (function(){


        var schemas = {
            "tabAll" : {
                searchMeta: {
                    schema:{
                        simple: []
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
                url : X.config.blog.api.articleList,
                toolbar: {
                    items: [
                        {
                            ctrlType: "ToolbarButton",
                            name: "add",
                            title: "新建文章",
                            icon: "icon-add",
                            click: function (item) {
                                X.router.run("m=blog.articleEdit", "");
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


    return ctrl;

});
