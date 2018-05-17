(function ($,X) { 

X.prototype.controls.widget("List",function (controlType) {
    var BaseControl = X.prototype.controls.getControlClazz("BaseControl");

    var List = function(elem,option) {
        this.elem = elem;
        this.option = X.prototype.clone(option);
    };

    X.prototype.controls.extend(List,"BaseControl");


    List.prototype = $.extend(List.prototype,{
        init : function (data) {

            var that = this;

            if(this.elem){
                var $searcher = this.elem.find(".js-searchbox");
                var $dataGrid = this.elem.find(".js-datagrid");
                var $pagination = this.elem.find(".js-pagination");
                var $toolbar = this.elem.find(".js-operation");
            }

            this.searcher = X.prototype.controls.getControl("Searcher",$searcher,this.option.searchMeta);
            this.searcher.init();

            if(this.option && this.option.searchMeta && this.option.searchMeta["search"]){
                var onSearch = this.searcher.onSearch;
                var innerSearch = null;
                if(onSearch){
                    innerSearch = function(data,searcher,click) {
                        data = data || {};
                        var queryData = {query:data};
                        queryData.pageSize = that.pagination.pageSize;
                        queryData.pageNo = click ? 1 : that.pagination.pageNo;

                        //获取排序字段后，传入搜索, 由具体业务决定如何使用排序项
                        var orderColumns = that.grid.getReorderColumn();
                        var fields =[],type=[];
                        for(var key in orderColumns){
                            if(orderColumns.hasOwnProperty(key)){
                                fields.push(key);
                                type.push(orderColumns[key]);
                            }
                        }
                        if(fields.length>0){
                            queryData.orderInfo = { fields:fields,type:type };
                        }

                        var result = onSearch(queryData,searcher,click);

                        that.loadData(result);
                    };
                    this.searcher.onSearch = innerSearch;
                }
                else{
                    this.searcher.onSearch = function(data,searcher) {
                        data = data || {};
                        data.pageSize = that.pagination.pageSize;
                        data.pageNo = 1;

                        //获取排序字段后，传入搜索, 由具体业务决定如何使用排序项
                        that.loadData(result,searcher);
                    }
                }               
            }

            // if(this.searcher && this.searcher.onReset){
            //     var onReset = this.searcher.onReset;
            //     if(onReset){
            //         this.searcher.onReset = function () {
            //             onReset();

            //         };
            //     }
            // }

            var gridType = (function (type) {
                if(type === "S"){
                    return "SDataGrid";
                }
                else if(type === "C"){
                    return "TDataGrid";
                }
                else{
                    return "DataGrid";
                }
            })(this.option.gridMeta.type)

            this.grid = X.prototype.controls.getControl(gridType,$dataGrid.get(0),this.option.gridMeta);
            this.grid.init();




            if(X.prototype.isFunction(this.option.gridMeta.beforeReorder)){
                var beforeReorder = this.option.gridMeta.beforeReorder;
                var innerBeforeReorder = function (grid,column,field,columnIndex) {
                    beforeReorder(grid,column,field,columnIndex);
                    that.searcher.fireSearch();
                }

                this.option.gridMeta.beforeReorder = innerBeforeReorder;
            }
            else{
                this.option.gridMeta.beforeReorder = function (grid,column,field,columnIndex) {
                    beforeReorder(grid,column,field,columnIndex);
                    that.searcher.fireSearch();
                }
            }



            initPageInfo(this.option);
            this.pagination = X.prototype.controls.getControl("Pagination",$pagination,this.option.pageInfo);

            if(this.option.toolbar && $toolbar.length>0){
                this.toolbar = X.prototype.controls.getControl("Toolbar",$toolbar,this.option.toolbar);
                this.toolbar.init();
                this.toolbar.target = this.grid;
            }

            // //默认加载没有过滤项，并且加载第一页
            // if(this.option.defaultValue){
            //     this.searcher.val(this.option.defaultValue);
            //     this.loadData(this.option.defaultValue);
            // }
            // else{
            //     this.searcher.fireSearch();
            // }

            this.searcher.fireSearch();


            function initPageInfo(option){
                function bindPageClick(item,index,pageInfo) {
                    var itemclick = option.pageInfo[item];
                    var pageNo = 1;
                    if(itemclick){
                        option.pageInfo[item] = function () {
                            pageNo = (item==="changePageSize") ? 1 : that.pagination.pageNo;
                            itemclick(item);
                            if(that.condition){
                               that.condition.pageNo = pageNo;
                            }
                            that.loadData();
                        }
                    }
                    else{
                        option.pageInfo[item] = function () {
                            pageNo = (item==="changePageSize") ? 1 : that.pagination.pageNo;
                            if(that.condition){
                               that.condition.pageNo = pageNo;
                               that.condition.pageSize = that.pagination.pageSize;
                            }
                            that.loadData();
                        }
                    }
                }

                var pageItem = ["clickFirstPage","clickLastPage","clickPrePage","clickNextPage","clickOtherPage","changePageSize"];
                if(option && option.pageInfo){
                    pageItem.forEach(bindPageClick);
                }

                if(that.option.defaultValue){
                    if(that.option.defaultValue["pageSize"]){
                        if(option.pageInfo){
                            option.pageInfo.pageSize =  that.option.defaultValue["pageSize"];
                        }
                    }
                    if(that.option.defaultValue["pageNo"]){
                        if(option.pageInfo){
                           option.pageInfo.pageNo = that.option.defaultValue["pageNo"];
                        }
                    }
                }
            }

        },


        loadData : function (condition) {
            this.condition = condition || this.condition;
            var that = this;

            var setData = function (data) {
                if(data.list && data.page && data.page.hasOwnProperty("pageSize")
                    && data.page.hasOwnProperty("totalCount")
                    && data.page.hasOwnProperty("totalPages")
                    && data.page.hasOwnProperty("pageNo")){
                        that.grid.loadData(data.list);
                        that.pagination.set({pageSize : data.page.pageSize,
                                       totalCount : data.page.totalCount ,
                                       totalPages : data.page.totalPages ,
                                           pageNo : data.page.pageNo
                         });
                    }
                    else{
                        X.prototype.echo('格式不规范，请格式化为{data:[],page:{pageSize:"",totalCount:"",totalPages:"",pageNo:""}}');
                        //console.log('格式不规范，请格式化为{data:[],page:{pageSize:"",totalCount:"",totalPages:"",pageNo:""}}');
                    }
            };


            var callback = function (result) {
                var data = result.data;
                if(that.option.afterDataLoad){
                     var data = that.option.afterDataLoad(data);
                     setData(data);
                }else{
                    setData(data);
                }
            };

            var postData = this.condition;


            //临时模拟数据
            if(this.option.url){
                X.prototype.loadData({
                    url: that.option.url,
                    type: that.option.type || "POST",
                    dataType:"JSON",
                    data: postData,
                    callback: function (data) {
                        if (data.statusCode == "2000000") {
                            callback(data);
                        } else {
                            layer.alert(data.message||"");
                        }
                    }
                });
            }
        },
        val : function (data) {
            if(data){
                if(data["searchData"]){
                    //设置搜索数据
                }
                if(data["gridData"]){
                    //设置DataGrid数据
                }
                if(data["pData"]){
                    //设置
                }
            }
            else{
                var svalue = this.searcher.val();
                var pvalue = this.pagination.get();
                var dvalue = this.grid.getReorderColumn();
                return{
                    searchData : svalue,
                    pData : pvalue,
                    gridData : dvalue
                }
            }
        }

    });

    return List;


});

})(jQuery,this.Xbn);