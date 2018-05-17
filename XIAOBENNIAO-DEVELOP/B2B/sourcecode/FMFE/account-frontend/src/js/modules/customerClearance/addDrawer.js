X.define('modules.customerClearance.addDrawer', ['model.drawerModel', 'modules.common.addProduct', 'adapter.webuploader', 'adapter.laydate'], function(model, addProduct) {
	var view = X.view.newOne({
		el: $('.xbn-content'),
		url: X.config.customerClearance.tpl.addDrawer
	})

	var ctrl = X.controller.newOne({
		view: view
	})

	ctrl.collectData = function(data, tar) {
		data.drawerStatus = tar.getAttribute('drawerStatus')

		data.submitType	= 'POST'
		data.submitUrl  = 'addDrawer'      
		if (id) {
			data.exportDrawerId   =   id
			data.submitType 	  =   'PUT' 
			data.submitUrl  	  =   'updateDrawer' 
		}

		data = attachConver(data)

		var productList = []
		data.exportDrawerProductKeyList.forEach(function(item) {
	        productList.push({productId: item.productId})
	    })
		data.exportDrawerProductKeyList = productList

		data.addressProvince 	= data.address.province
		data.addressCity		= data.address.city
		data.addressDistrict	= data.address.district
		delete data.address

		return data
	}

	function attachConver(data) {
		var attachs = ['taxpayerAttachment', 'taxAttachment', 'otherAttachment']

		attachs.forEach(function(item) {
			var val 

			if (val = data[item]) {
				data[item] = {
					filename: 		val.fileName,
					filePath: 		val.url,
					attachmentType: 4
				}
			}
		})

		return data
	}

	var id

	ctrl.load = function(para) {
		id = para.id

		view.render(function() {
            releaseSource(id, ctrl, model)
            ctrl.ready()
		})
	}

	ctrl.ready = function() {
		var exportRight = ctrl.vm.getControl('exportRight')
		exportRight.selectedChanged = function(val) {
			
		}
	}

	return ctrl
})