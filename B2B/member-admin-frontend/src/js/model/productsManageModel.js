X.define("model.productsManageModel", ['data.currencyData'], function (currencyData) {

	var api   = X.config.productManage.api,
		model =	X.model.create("model.productsManageModel")

	model.query = function(id, callback) {
		var option = {
			url: api.selfCommodity + id,
			type: 'GET',
			callback: callback
		}

		X.loadData(option)
	}

	model.remove = function(data, callback) {
		var option = {
			url: api.selfCommodity,
			data: data,
			type: 'DELETE',
			callback: callback
		}

		X.loadData(option)
	}

	model.del = function(data, callback) {
		var option = {
			url: api.commodity,
			data: data,
			type: 'DELETE',
			callback: callback
		}

		X.loadData(option)
	}

	model.save = function(data, submitType, callback) {
		var option = {
			url: api.selfCommodity,
			data: data,
			type: submitType,
			callback: callback
		}

		X.loadData(option)
	}

	

	/*model.currency = [
		{key: -1, value: '请选择'},
		{key: 0, value: 'RMB'},
		{key: 1, value: 'USD'}
	]*/
	model.currency = currencyData.currencyKinds
	model.proStatus = ['草稿', '上架']
	//model.issuanceStationId = ['建材站', '国际站']
	model.issuanceStationId = [
		{key: 1, value: '国际站'},
		{key: 2, value: '建材站'}
	]
	model.dataSource = [
		{key:0 , value : "寰贸云平台"},
		{key:1 , value : "爬虫-阿里巴巴"},
		{key:2 , value : "爬虫-京东国际站"},
		{key:3 , value : "爬虫-广交会"}
	]

	return model
});