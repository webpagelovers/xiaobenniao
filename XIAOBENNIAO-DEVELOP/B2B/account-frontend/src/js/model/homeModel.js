X.define("model.homeModel",function () {

    //临时测试数据
    var query = "js/data/mockData/bidList.json";

    var homeModel =	X.model.create("model.homeModel",{idAttribute:"tenderId",service:{query:query}});

    homeModel.statistics = function(callback){
        var option = {url: X.config.homePage.api.statistics,type:"GET",callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };

    return homeModel;
});

