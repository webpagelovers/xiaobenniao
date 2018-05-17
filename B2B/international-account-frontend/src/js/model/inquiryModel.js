X.define('model.inquiryModel', function () {

    var api   = X.config.inquiries.api,
    	model =	X.model.create('model.inquiryModel')
 	
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
            productName:    { required: true },
            quantity:       { required: false },
            details:        { required: true },
            name:           { required: false },
            email:          { required: true },
            phone:          { required: false },
        },
        messages: {
            productName:    { required: "Please enter the product name" },
            quantity:       { required: "Please enter the product name" },
            details:        { required: "Please enter detailed product description" },
            name:           { required: "Please enter the product name" },
            email:          { required: "Please enter the product name" },
            phone:          { required: "Please enter the product name" },
        },
        onfocusout: function (element) {
            $(element).valid()
        }
    }

    model.validate = validate
    
	return model
})