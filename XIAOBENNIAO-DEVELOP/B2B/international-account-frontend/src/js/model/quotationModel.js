X.define('model.quotationModel', function () {

    var api   = X.config.quotation.api,
    	model =	X.model.create('model.quotationModel')
 	
 	model.submit = function(data, callback) {
 		var options = {
 			url: api.submit,
 			data: data,
 			type: 'POST',
 			callback: callback
 		}

    	X.loadData(options)
    }

    var validate = {
        rules: {
            content:    { required: true },
            requestAdditionalAttachments:       { required: false }
        },
        messages: {
            content:    { required: "Please enter the product name" },
            requestAdditionalAttachments:       { required: "Please enter the product name" }
        },
        onfocusout: function (element) {
            $(element).valid()
        }
    }

    model.validate = validate
    
	return model
})