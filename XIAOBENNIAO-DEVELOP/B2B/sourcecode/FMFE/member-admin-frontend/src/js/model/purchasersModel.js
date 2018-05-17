X.define("model.purchasersModel",function () {

    //临时测试数据
    var query = "js/data/mockData/purchasers.json";

    var purchasersModel =	X.model.create("model.purchasersModel",{service:{ query:query}});

    return purchasersModel;
});
