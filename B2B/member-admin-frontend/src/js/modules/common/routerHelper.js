X.define("modules.common.routerHelper",function () {

	 var routerHelper = function (route,schemas,getRoute) {
        var rh = function (route,schemas) {
            this.route = route;
            this.schemas = schemas;            
            this.bindPageItemClick(getRoute);
        }; 

        rh.prototype.bindPageItemClick = function (getRoute) {
            var that = this;
            var bindPageClick = function (item,index,pageInfo) {            
                if(X.isFunction(getRoute)){
                    var route = getRoute();
                    if(route){
                        that.setRoute(route);
                    }
                }                
            };

            var pageItem = ["clickFirstPage","clickLastPage","clickPrePage","clickNextPage","clickOtherPage","changePageSize"];
            for (var item in schemas) {
                if(schemas.hasOwnProperty(item)){
                    for (var i = 0; i < pageItem.length; i++) {
                        schemas[item].pageInfo[pageItem[i]] = bindPageClick;
                    }                    
                }
            }
        };

        rh.prototype.setRoute = function (ldata) {
            if(ldata){                
                var npara = JSON.stringify(ldata);
                var opara = X.getRequest();
                if(opara.ldata != npara){
                    var para = "m="+this.route+"&ldata=" + escape(npara);
                    X.router.run(para,"");
                }
            }
        };

        rh.prototype.getRoute = function () {
            var data = X.getRequest();          
            if(data.ldata){
                var pageData = JSON.parse(data.ldata);
                var ldata = pageData.ldata;
                var panel = pageData.panel || getOneProperty(this.schemas);  //没有页签，则是零
                if(ldata){
                    if(ldata.searchData){
                        this.schemas[panel].searchMeta.defaultValue = ldata.searchData;    
                    }
                    if(ldata.pData){
                        this.schemas[panel].pageInfo.pageNo = ldata.pData.pageNo;
                        this.schemas[panel].pageInfo.pageSize = ldata.pData.pageSize;
                    }
                    if(ldata.gridData){                    
                        for(var key in ldata.gridData){
                            for(var i = 0; i < this.schemas[panel].gridMeta.columns.length; i++){
                                var column = this.schemas[panel].gridMeta.columns[i];
                                if(column && column["field"] && column["field"].name==key && column["reorder"]){
                                    column["reorder"]["order"] = (ldata.gridData[key]=="asc")?"asc":"desc";
                                }
                            }
                        }
                    }
                }
                

                return panel;                
            }   
        };

        var getOneProperty = function (object){
            if(object){
                for(var key in object){
                    if(object.hasOwnProperty(key)){
                        return object[key];    
                    }                    
                }
            }
            return null;
        };


        return new rh(route,schemas);
    };


    return routerHelper;

});