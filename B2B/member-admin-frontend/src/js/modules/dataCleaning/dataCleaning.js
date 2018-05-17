/**
 * Created by Administrator on 2017/2/15.
 */
X.define("modules.dataCleaning.dataCleaning",["modules.common.routerHelper","model.dataCleaningModel"],function (routerHelper,dataCleaningModel) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.dataCleaning.tpl.dataCleaning
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });
    $.addTemplateFormatter({
        imgsFormater: function (value, template) {
            return X.config.PATH_FILE.path.rootCrawlingImgUrl+"/attachment/international/mgdb/"+value;
        }
    });
    ctrl.rendering = function () {

        return view.render({},function(){
            var pagingRange = dataCleaningModel.statusconst.pagingRange;
            ctrl.companyEdit = ctrl.getViewModel(ctrl.view.el.find(".js-data-cleaning"),{meta :{"pagingRange":{dataSource:pagingRange,selectedChanged:function(){
                ctrl.imgSearch();
            }}}});
            ctrl.companyEdit.initControl();
            ctrl.imgSearch();
            ctrl.fullScreen();

        });
    };

    ctrl.load = function(){
        ctrl.rendering();
    };

    //删除、恢复

    ctrl.cancelToggle = function(){
        ctrl.view.find(".js-deleted-img").toggle(
            function(){
                var elems = $(this);
                var objectId =elems.find(".js-img-id").text();
                var indexOfImage = elems.find(".js-img-index").text();
                dataCleaningModel.clearWatermark(objectId,indexOfImage,function(){
                    var imgId = ctrl.view.find(".js-img-id");
                    for (var i=0;i<imgId.length;i++){
                        if (imgId[i].innerHTML == objectId){
                            $(imgId[i].parentNode).find("img").addClass("gray").removeClass("js-status");
                            $(imgId[i].parentNode).find(".js-Symbol").addClass("deleteSymbol")
                        }
                    }
                })
            },
            function(){
                var elems = $(this);
                var objectId =elems.find(".js-img-id").text();
                var indexOfImage = elems.find(".js-img-index").text();
                dataCleaningModel.cancelDelete(objectId,indexOfImage,function(){
                    var imgId = ctrl.view.find(".js-img-id");
                    for (var i=0;i<imgId.length;i++){
                        if (imgId[i].innerHTML == objectId){
                            $(imgId[i].parentNode).find("img").removeClass("gray").addClass("js-status");
                            $(imgId[i].parentNode).find(".js-Symbol").removeClass("deleteSymbol")
                        }
                    }
                })
            });
    };
    //全屏
    ctrl.fullScreen = function(){
        ctrl.view.find(".js-fullscreen").toggle(
            function(){
                $(this).val("退出全屏");
                $(".xbn-menu,.xbn-header").hide();
                ctrl.imgSearch();

            },
            function(){
                $(this).val("全屏");
                $(".xbn-menu,.xbn-header").show();
                ctrl.imgSearch();
            });
    };
    var indexBegin;
    var indexEnd;
    //300为图片的宽，高
    //30为退出全屏后.xbn-content的差距

    ctrl.imgSearch = function(){

        var columnValue = parseInt(($(".xbn-content").width()-30)/300);
        var lineValue =parseInt($(window).height()/300);
        var totalValue = columnValue*lineValue;
        var sindex = $(".js-data-cleaning").find("i").text();
        if(sindex == "请选择"){
            indexBegin = "1";
            indexEnd = "100";
        }else{
            var aIndex = sindex.split("-");
            indexBegin = aIndex[0];
            indexEnd = aIndex[1];
        }
        dataCleaningModel.getProducImgList(indexBegin,indexEnd,totalValue,function(result){
            if(result.statusCode == X.constructor.prototype.constant.statusCode.SUCCESS){
                var grid =  X.controls.getControl("TDataGrid",view.el.find(".js-datagrid").get(0),{selector : ".js-data-cleaning-tpl",columnCount:columnValue,tableClass:""});
                if (result.data.length > totalValue){
                    result.data.splice(totalValue)
                }
                grid.loadData(result.data);
                ctrl.cancelToggle();
                ctrl.view.find("table").addClass("table").find("td").css("padding","0")
            }
        })

    };



    //标记为已读
    ctrl.makeRead = function(){
        var unRead = ctrl.view.find(".js-status");
        var arr = [];
        for (var i=0; i<unRead.length;i++){
           var obj = {};
           obj.objectId =  $(unRead[i].parentNode).find(".js-img-id").text();
           obj.index = $(unRead[i].parentNode).find(".js-img-index").text();
           arr.push(obj);
        }
        dataCleaningModel.markImageRead (arr,function(){
            ctrl.imgSearch();
        });

    };

    ctrl.addEvent("click",".js-next-page","makeRead");
    ctrl.addEvent("click",".js-imgSearch","imgSearch");
    //js-imgSearch
    ctrl.load();

    return ctrl;

});
