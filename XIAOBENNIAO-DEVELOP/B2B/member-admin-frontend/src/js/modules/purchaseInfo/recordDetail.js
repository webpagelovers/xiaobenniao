X.define('modules.purchaseInfo.recordDetail', ['modules.purchaseInfo.matchInfo_columns', 'modules.common.InitHelper'], function(columns, InitHelper) {
	var view = X.view.newOne({
		el: $('.xbn-content'),
		url: X.config.purchaseInfo.tpl.recordDetail
	})

	var ctrl = X.controller.newOne({
		view: view
	})

	var events = {
		init: function() {
			page.doms.recordDetail.on('click', '.filterDataDetail', function() {
                X.router.run('m=purchaseInfo.infoDetail&id=' + this.id)
            })

            $('.goBack', view.el).on('click', function() {
                history.go(-1)
            })
		}
	}

	var page = {
		doms: {
			recordDetail:  '#matchInfo-recordDetail'
		},
		list: {
			'recordDetail': columns.recordDetail
		}
	}

	ctrl.load = function(para) {
		columns.recordDetail.purchaseInfoIds   = para.id
		columns.recordDetail.supplierCompanyId = para.supplierCompanyId
		view.render(function() {
			var init = new InitHelper(page)
            page = init.data

            events.init()
            var tbody = view.el.find('table > tbody')
            !tbody.children('tr').length && tbody.append('<tr><td colspan="8"><img class="mT100 mB100 noDataImg" src="images/nodata_icon.png"></td></tr>')
		})
	}

	return ctrl
})