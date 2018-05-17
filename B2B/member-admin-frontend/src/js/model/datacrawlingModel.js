X.define("model.datacrawlingModel",function () {

    //临时测试数据
    var query = "js/data/mockData/purchasers.json";

    var datacrawlingModel =	X.model.create("model.datacrawlingModel",{service:{ query:query}});

    return datacrawlingModel;
});
