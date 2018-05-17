X.define('modules.productManage.productDetail', ['model.productsManageModel'], function(model) {
	var view = X.view.newOne({
		el: $('.xbn-content'),
		url: X.config.productManage.tpl.productDetail
	})

	var ctrl = X.controller.newOne({
		view: view
	})

	var events = {
		init: function() {
			
		},
		dataTransform: function(data) {
			data.issuanceStationId = ''
			data.issuanceStationList.forEach(function(item) {
				data.issuanceStationId += item.stationName + ' '
			})
			return data
		}
	}

	var data

	ctrl.load = function(para) {
		model.query(para.id, function(res) {
			data = events.dataTransform(res.data[0])

			view.render(data, model, function() {
	            events.init()
			})
		})
	}

	return ctrl
})