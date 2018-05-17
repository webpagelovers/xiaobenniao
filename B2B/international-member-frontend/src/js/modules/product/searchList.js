X.define("modules.product.searchList",["modules.common.global","model.productsModel","adapter.searchValidate"],function (global,productsModel,searchValidate){


    //初始化视图对象
    var view = X.view.newOne({
        el: $(".js-searchList"),
        url: X.config.product.tpl.searchList,
        res : X.config.product.res.searchList
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    $.addTemplateFormatter({
        hrefFormater: function (value, template) {
            return X.config.PATH_FILE.path.root+"products/"+value+".html";
        },
        imgFormater: function (value, template) {
            if(X.isString(value)){
                value = JSON.parse(value);
            }
            return X.isArray(value)&&value.length>0? X.config.PATH_FILE.path.rootImgDisplayUrl+value[0]:"";

        },
        prodNameFormater :function (value, template) {
            if(value){
                if(value.length>50){
                    return value.substring(0,50)+"...";
                }
                return value;
            }
        }
    });
    ctrl.rendering = function () {
        return view.render({},function(){
            $('.js-searchVal').val(getUrlParam());
            ctrl.initPage();
            global.load([{
                src: "../images/productList.jpg",
                selector: ".js-searchListImg",
                isBg: true
            },{
                src: "../images/productListBanner2.jpg",
                selector: ".js-productListBanner2Img",
                isBg: true
            }]);
            $(document).attr("title",$.i18n.prop("searchList_title"));
            ctrl.view.el.find(".js-recommend-num").text( $.i18n.prop("searchList_Based"));

            ctrl.view.find(".js-buttonRFQ").attr("href", X.config.common.link.buyingRequest);
            //搜索列表
            ctrl.view.find(".js-searchBtn").click(function(){
                var elems = ctrl.view;
                var key = elems.find(".js-searchVal").val();
                if( key == ""){
                    elems.find(".js-title").val("");
                }else{
                    elems.find('.js-title').val(elems.find(".js-searchVal").val());
                }
                var searchPosition = elems.find('.js-search');
                searchValidate.keyValidate(key,searchPosition);
                ctrl.searchHotWords(key);


            });
            view.el.keyup(function (event) {
                if (event.keyCode == 13) {
                    $(".js-searchBtn").click();
                }
            });    
            ctrl.searchHotWords();            
        });

    };

    //搜索相关热词
    ctrl.searchHotWords = function(){
        var item = ctrl.view.find(".js-searchVal").val();
        var query = {};
        //index的值为固定参数
        query.index = "index_weintrade";
        query.searchKeyword = item;
        var data = $.extend(false,{},{query:query});
        var hotWork = ctrl.view;
        hotWork.find(".js-hotWord").empty();
        var getSearchHotWordsCall = function(result){
            var backgroundColor =["#4e93bf","#4e9dd1","#5cade1","#6ab9ed","#78c5f9","#87cffd","#99d5fd","#99d5fd","#b7e2fe"];
            var result =  JSON.parse(result);
            if (result && result.list && result.list.length >0 ){
                for (var i=0; i<result.list.length;i++){
                    var $a = $(" <a target='_blank' class='inlineb w160 tac h45 lh45 f20 showEllipsis pl20 pr20 ml45 mb30'> </a>");
                    $a.text(result.list[i]).css("background-color",backgroundColor[i]);
                    $a.attr("title",result.list[i]);
                    var searchKey= $a.text();
                    $a.attr("href",X.config.common.link.searchList+'?key=' +escape( searchKey));
                    hotWork.find(".js-hotWord").append($a)
                }
            }else{
                var $span = $("<span class='mb30 f16 col66 inlineb '>Sorry! No matches were found for "+item+"</span>");
                hotWork.find(".js-hotWord").append($span)
            }
        };
        productsModel.getSearchHotWord(data,getSearchHotWordsCall)
    };

    /*
    * @todo 搜索的关联推荐
    * @param   length  除去推荐搜索的总数
    * @param   rresult 推荐的内容
    * */
    ctrl.searchRecommend = function(length,rresult){
        ctrl.view.find(".js-searchRecommend").empty();
        ctrl.view.el.find(".js-recommend-num,.js-searchRecommendNo").hide();
        function getRecommendProduct (){
            ctrl.view.el.find(".js-recommend-num").show();
            var  getRecommendcallback = function(result){
                var wrapList = ctrl.view.el.find(".js-searchRecommend");
                if (result && result.length >0 ){//判断推荐结果是否为0
                    wrapList.loadTemplate($(".js-search-recommendList-tpl"),result);
                    ctrl.view.find(".js-searchRecommend").show();
                }else{
                    ctrl.view.find(".js-recommend-num").hide();
                    if(length=="0"){//判断搜索结果是否为0
                        ctrl.view.find(".js-datagrid").hide();
                        ctrl.view.find(".js-searchRecommendNo").show();
                    }else{
                        ctrl.view.el.find(".js-searchRecommendNo").hide();
                    }
                }
            };
            getRecommendcallback(rresult);
        }

        if(length<=8){
            getRecommendProduct();
        }        

    };

    var activeTabLiInfo = "tabAll";
    var schemas = (function(){

        var schemas = {
            "tabAll" :  {
                searchMeta: {
                    schema: {
                        simple:[
                            {
                                name:"title",
                                title:"搜索内容",
                                ctrlType:"TextBox",
                                placeholder :"请输入操作人姓名"
                            },
                            {
                                name:"type",
                                title:"搜索类型",
                                ctrlType:"TextBox",
                                placeholder :"请输入操作人姓名"
                            }
                        ]
                    },
                    search: {
                        onSearch : function (data,searcher,click) {
                            data.query.searchKeyword = getUrlParam() || data.query.title;
                            //index的值为固定参数
                            data.query.index="index_weintrade";
                            ctrl.view.find('.js-searchVal').val(data.query.searchKeyword);
                            if(click){
                                ctrl.view.find('.js-searchVal').val(data.query.title);
                                data.query.searchKeyword = data.query.title;
                                delete data.query.title;
                            }
                            return data;
                        }
                    },
                    reset :{
                        show:true
                    }
                },
                gridMeta :{
                    columns : [],
                    type:"V",
                    showEmpty:false,
                    selector:".js-search-searchList-tpl",
                    beforeTableRender : function (grid,data) {
                        var result =  data;
                        var totalCount = lists[activeTabLiInfo].pagination.totalCount;
                        if (totalCount == 0){
                            ctrl.view.find(".js-total-num").hide();
                        }else{
                            ctrl.view.find(".js-total-num,.js-datagrid").show();
                            ctrl.view.find(".js-view-num").text(totalCount);
                        }

                        var sresult =[], rresult =[];
                        if(totalCount<=8){
                            data.forEach(function(item, index, pageInfo){
                                (item["dataSource"]==="S") ? sresult.push(item) : rresult.push(item);
                            });

                            result = sresult;
                            ctrl.view.find(".js-pagination").hide();
                        }else{
                            ctrl.view.find(".js-pagination").show();
                        }

                        ctrl.searchRecommend(totalCount,rresult);

                        return result;

                    },
                    afterTableRender:function(grid,data){
                        $('body,html').animate({scrollTop:0},30);
                        
                    }
                },
                pageInfo : {
                    pageSize : '36',
                    totalPages : '10',
                    pageNo: '1',
                    dataSource:[{key:36,value:36},{key:72,value:72}],
                    smallPapogation: {
                        isShow: false,
                        elem: '.js_small_papogation1'
                    }
                },
                aaa:"bbb",
                url : X.config.product.api.getsearchList
            }
        };

        return schemas;
    })();

    var lists = {};
    
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

    ctrl.load = function(){
        ctrl.rendering();
    };

    ctrl.load();
    function getUrlParam (){
      var searchKey = X.getRequest();
        return searchKey.key
    }

    return ctrl;


});