/**
 * Created by Administrator on 2016/9/3.
 */
X.define("model.systemLogModel",function () {


    var query = "js/data/mockData/purchasers.json";
    var deleteUrl = X.config.systemLog.api.delSystemLog;
    var exportUrl = X.config.systemLog.api.csvFile;

    var   systemLogModel   = X.model.create("model.systemLogModel",{"idAttribute":"operationLogId",service:{ query:query,delete:deleteUrl}});

    //do a request to export the system operator log
    systemLogModel.export = function(option){
    	X.loadData({url: exportUrl, data: option.data, type: 'POST',callback: option.callback})
    };
    systemLogModel.systemLogDelete = function (data,callback) {

        var option = {url: deleteUrl,type:"DELETE",data:data,callback:function(){
            callback&&callback();
        }};

        X.loadData(option);
    };
    return systemLogModel;
});
