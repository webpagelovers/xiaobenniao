X.define('modules.purchaseInfo.matchRecord', ['modules.purchaseInfo.matchInfo_columns', 'modules.common.InitHelper'], function(columns, InitHelper) {
	var view = X.view.newOne({
		el: $('.xbn-content'),
		url: X.config.purchaseInfo.tpl.matchRecord
	})

	var ctrl = X.controller.newOne({
		view: view
	})

	var events = {
		init: function() {
			page.doms.matchRecord.on('click', '.matchRecordDetail', function() {
                X.router.run('m=purchaseInfo.recordDetail&id=' + this.id.replace(/ /g,'') + '&supplierCompanyId=' + this.getAttribute('supplierCompanyId'))
            })
		}
	}

	var page = {
		doms: {
			matchRecord: '#matchInfo-matchRecord'
		},
		list: {
			'matchRecord': columns.matchRecord
		}
	}

	ctrl.load = function() {
		view.render(function() {
			var init = new InitHelper(page)
            page = init.data
            events.init()
		})
	}

	return ctrl
})