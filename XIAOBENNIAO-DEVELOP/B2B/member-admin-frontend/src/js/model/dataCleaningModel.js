X.define("model.dataCleaningModel",function () {

    //临时测试数据
    var query = "js/data/mockData/purchasers.json";

    var dataCleaningModel =	X.model.create("model.dataCleaningModel",{service:{ query:query}});
    //获取产品图片列表
    dataCleaningModel.getProducImgList = function(indexBegin,indexEnd,totalValue,callback){
        var option = {url:X.config.dataCleaning.api.listByPage+"indexBegin/indexEnd/?indexBegin="+indexBegin+"&indexEnd="+indexEnd+"",
            type:"GET",callback:function(result){

                callback&&callback(result);

            }};

        X.loadData(option);

    };

    //清除产品水印
    dataCleaningModel.clearWatermark =function(objectId,indexOfImage,callback){
            var option = {url:X.config.dataCleaning.api.clearWatermark+"objectId/indexOfImage/?objectId="+objectId+"&indexOfImage="+indexOfImage+"",
                          type:"GET",callback:function(result){
                    callback&&callback(result);

            }};

            X.loadData(option);

    };
    //标记为已读
    dataCleaningModel.markImageRead =function(data,callback){
        var option = {url:X.config.dataCleaning.api.markImageRead,data:data,
            type:"POST",callback:function(result){
                callback&&callback(result);

            }};

        X.loadData(option);

    };

    //恢复产品图片
    dataCleaningModel.cancelDelete =function(objectId,indexOfImage,callback){
        var option = {url:X.config.dataCleaning.api.cancelDelete+"objectId/indexOfImage/?objectId="+objectId+"&indexOfImage="+indexOfImage+"",
            type:"GET",callback:function(result){
                callback&&callback(result);

            }};

        X.loadData(option);

    };
    dataCleaningModel.statusconst = {
        pagingRange: [
            {key: 0, value: "1-100"},
            {key: 1, value: "101-200"},
            {key: 2, value: "201-300"},
            {key: 3, value: "301-400"},
            {key: 4, value: "401-500"},
            {key: 5, value: "501-600"}
        ]
    };
    return dataCleaningModel;
});
