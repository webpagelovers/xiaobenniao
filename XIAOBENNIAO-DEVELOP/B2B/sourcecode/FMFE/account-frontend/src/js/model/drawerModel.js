X.define("model.drawerModel", ['data.addressData', 'modules.customerClearance._validates', 'modules.customerClearance._columns'], function (addressData, validates, columns) {

	var api   = X.config.customerClearance.api,
		model =	X.model.create("model.productsManageModel")

	model.query = function(id, callback) {
		var option = {
			url: api.drawer + id,
			type: 'GET',
			callback: callback
		}

		X.loadData(option)
	}

	model.save = function(data, callback) {
		var submitType = data.submitType
			submitUrl  = data.submitUrl

		delete data.submitType
		delete data.submitUrl
		
		var option = {
			url: api[submitUrl],
			data: data,
			type: submitType,
			callback: callback
		}

		X.loadData(option)
	}

	model.exportDrawerProductKeyList = {
		gridMeta: {
			columns: columns.addProduct
		},
		url: api.declareProductList
	}

	model.address = addressData
	model.vatRates = [
		{key: 1, value: '17%'},
		{key: 2, value: '13%'}
	]
	model.exportRight = ['有', '无']

	model.validate = validates.addDrawer

	return model
});