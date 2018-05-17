X.define("modules.commodityManage.commodityDetail", ["model.commodityManageModel","data.currencyEntireData","adapter.jqthumb","common.layer"],function (commodityManageModel,currencyEntireData,jqthumb,layer1) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.commodityManage.tpl.commodityDetail
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.load = function (para) {

        commodityManageModel.getCommodity(para["commodityId"], function (result) {
            if(result.statusCode == X.constructor.prototype.CONSTANTS.statusCode.SUCCESS){
                result.data[0].data = result.data[0].price + currencyEntireData.getCurrency(result.data[0].currency);

                return view.render(result.data[0], function () {
                    //附件
                    var commodityAttachmentList = result.data[0]["commodityAttachmentList"];
                    var wrapImg = ctrl.view.el.find(".js-wrapUploadData");

                    $.each(commodityAttachmentList, function (i, item) {
                        var imgHost  = X.constructor.prototype.config.PATH_FILE.path.imageStoreUrl,
                          imageUrl = item.filePath.indexOf(imgHost) > -1? item.filePath: (imgHost + item.filePath);
                        var a = '<div class="wrapUpload disib"><img src="'+imageUrl+'"/><p class="mt10 tac contract-word-cut">'+item.fileName+'</p></div>';
                        $(wrapImg).append(a);
                    });

                    var setThumbnailWrap = ctrl.view.el.find(".js-wrapUploadData");
                    ctrl.setThumbnail(setThumbnailWrap);

                });
            }
        });
    };


    /**
     @method setThumbnail 设置缩略图
     @param elem {string} 范围内图片设置缩略图
     */
    ctrl.setThumbnail = function (elem) {
        elem.find('img').jqthumb(
            {
                width: 100,
                height: 100,
                after: function(imgObj){
                    imgObj.click(function(e){
                        var imgUrl = $(e.target).parent().next().attr("src");
                        var content = "<img src='"+imgUrl +"' />";
                        var opt = {
                            shadeClose:true,
                            closeBtn:1,
                            content:content,
                            callback:function(){
                                $(".layui-layer-content").click(function(){
                                    layer.closeAll();
                                })
                            }
                        };
                        layer1.layerOpen(opt);
                    });
                }
            }
        );
    };

    return ctrl;

});