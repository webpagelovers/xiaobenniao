X.define('model.dashboardModel', function () {

    var api   = X.config.dashboard.api,
        model =	X.model.create('model.dashboardModel');

    model.getUserInfo = function(callback) {
        var option = {
            url:  api.getUserInfo,
            type: 'GET',
            callback: callback
        };

        X.loadData(option)
    }
    model.getNewQuotationCount = function(callback) {
        var option = {
            url:  api.getNewQuotationCount,
            type: 'GET',
            callback: callback
        };

        X.loadData(option)
    };
    model.verifyRequest = function(data, callback) {
        var option = {
            url:  api.verifyRequest,
            type: 'POST',
            data: data,
            callback: callback,
            contentType : 'application/json'
        };

        X.loadData(option)
    };

    return model
});