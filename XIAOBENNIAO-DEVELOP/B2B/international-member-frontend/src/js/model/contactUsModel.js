X.define("model.contactUsModel",function () {
    var contactUsModel =	X.model.create("model.contactUsModel");

    contactUsModel.contactUs = function(data, callback) {
        var option = {url:X.config.about.api.contactUs, data:data, type:"POST", callback:function(result) {
                callback && callback(result);
        }};

        X.loadData(option);
    }

    return contactUsModel;
})