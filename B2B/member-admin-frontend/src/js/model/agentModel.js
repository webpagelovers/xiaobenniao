/**
 * Created by Administrator on 2016/9/3.
 */
X.define("model.agentModel",function () {


    var query = "js/data/mockData/purchasers.json";
    var agentUrl = X.config.agent.api.agentList;
    var agentDetailUrl = X.config.agent.api.agentDetail;

    var   agentModel   = X.model.create("model.agentModel",{"idAttribute":"operationLogId",service:{ query:query}});

    agentModel.getAgentDetail = function (userId, callback) {
        var option = {url: agentDetailUrl + userId,type:"GET",data:{},callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };

    agentModel.export = function(option){
        X.loadData({url: agentUrl, data: {}, type: 'GET',callback: option.callback})
    };

    return agentModel;
});
