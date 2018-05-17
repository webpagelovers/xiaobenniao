X.define("modules.contract.contractDetails",["model.contractModel"],function (contractModel) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.contract.tpl.contractDetails
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.getData = function (callback) {
        contractModel.find({data:{"contractId":_para["contractId"]},callback:callback});
    };

    ctrl.rendering = function () {
        var callback = function (model) {
            var data = model.attributes;
            return view.render(data,function () {
                var fileUploadController = window.X.config.PATH_FILE.path.rootUploadUrl || [];
                var contractFiles = data.contractAttachmentList|| [];
                ctrl.displayFile = function(content,postions){
                    var uploadSuccessInfo;
                    $.each(content, function (i, item) {
                        uploadSuccessInfo = '<div class="wrapUpload disb">' +
                            '<a href="'+fileUploadController+'?fileType=4&filePath='+item.filePath+'&fileName='+item.fileName+'" class="accessory orange-font">'+item.fileName+'</a>' +
                            '<span class="ml10 va8">附件说明：</span><span class="col66 va8">'+item.filespec +'</span></div>';
                        ctrl.view.el.find(postions).append(uploadSuccessInfo);
                    });
                };
                ctrl.displayFile(contractFiles,".js-contractFils");

            });
        };
        ctrl.getData(callback);

    };



    var _para;
    ctrl.load = function(para){
        para = para || {};
        _para = para ;
        ctrl.rendering();
    };

    return ctrl;
});