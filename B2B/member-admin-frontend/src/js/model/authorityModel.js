X.define("model.authorityModel",function () {

    //临时测试数据
    var query = "js/data/mockData/purchasers.json";

    var authorityModel =	X.model.create("model.authorityModel",{service:{ query:query}});

    return authorityModel;
});
