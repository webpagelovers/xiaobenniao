/**
 * Created by Administrator on 2017/5/5.
 */
X.define("model.drawerModel",function () {

    //临时测试数据
    var query = "js/data/mockData/purchasers.json";
    var getById = X.config.customerClearance.api.getByDrawerId;
    var postBePerfect = X.config.customerClearance.api.postBePerfect;

    var drawerModel = X.model.create("model.drawerModel", {idAttribute: "exportDrawerId", service: {query: query}});


    //根据id获取详细信息
    drawerModel.getById = function(exportDrawerId,callback){
        var option = {url: getById + exportDrawerId,type:"GET",callback:function(result){
            if(result.statusCode == X.constructor.prototype.constant.statusCode.SUCCESS){
                callback&&callback(result.data);
            }
        }};

        X.loadData(option);
    };

    //提交资料待审核内容
    drawerModel.postBePerfect = function(data,callback){
        var option = {url: postBePerfect+data.exportDrawerId,type:"POST",data:data,callback:function(result){
            if(result.statusCode == X.constructor.prototype.constant.statusCode.SUCCESS){
                callback&&callback(result.data);
            }
        }};

        X.loadData(option);
    };

    //审核通过
    drawerModel.putAuditThrough = function(data,callback){
        var option = {url: X.config.customerClearance.api.putAuditThrough+data.exportDrawerId,type:"PUT",callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };

    //审核拒绝
    drawerModel.putAuditReject = function(data,callback){
        var option = {url: X.config.customerClearance.api.putAuditReject+data.exportDrawerId,type:"PUT",callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };

    //临时审核通过
    drawerModel.putTemporaryThrough = function(data,callback){
        var option = {url: X.config.customerClearance.api.putTemporaryThrough+data.exportDrawerId,type:"PUT",callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };

    drawerModel.statusconst = {
        status:["草稿","提交","审核通过","待完善","驳回","下架"],
        drawerStatus: {//draft Be perfect Adopt TemporaryAdopt
            DRAFT:          {key: "0", text: "草稿"},
            PENDING:        {key: "1", text: "待审核"},
            BEPERFECT:      {key: "2", text: "资料待完善"},
            ADOPT:          {key: "3", text: "审核通过"},
            TEMPORARYADOPT: {key: "4", text: "临时审核通过"},
            REFUSE:         {key: "5", text: "审核拒绝"}
        }
    };




    return drawerModel;
});
