
X.define("model.statisticsModel", function () {
    //临时测试数据
  /*  var query = X.config.statistics.api.ip;*/

    var statisticsModel = X.model.create("model.statisticsModel");

    /*//获取用户信息列表
    statisticsModel.getList = function (callback) {

        return X.loadData({
            "url": X.config.statistics.api.ip, "type": "GET", callback: function (data) {
                callback(data);
            }
        });
    };*/
    //获取pv、uv统计数据
    statisticsModel.getEchartData = function (data,callback,url) {
        var url = url ? url: X.config.statistics.api.historicalFlowPV;
        var option = {data:data,url:url,type:"POST",callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };

    //页面排名
    statisticsModel.getPageRankingList = function (data,callback,url) {
        var url = url ? url: X.config.statistics.api.getPageRankingList;
        var option = {data:data,url:url,type:"POST",callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };

    //搜索热词
    statisticsModel.getHotWordsList = function (data,callback,url) {
        var url = url ? url: X.config.statistics.api.getHotWordsList;
        var option = {data:data,url:url,type:"POST",callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };

    statisticsModel.const = {
        domaiName: ['atcdeal','weintrade','bmsupplier']

    };

    return statisticsModel;
});