X.define("model.productManageModel",function () {

	var api   = X.config.customerClearance.api,
		model =	X.model.create("model.productManageModel")

	model.submit = function(data, type, callback) {
		var option = {
			url: X.config.customerClearance.api.productManageSuffix + type,
			data: data,
			type: 'PUT',
			callback: callback
		}

		X.loadData(option)
	}

	model.query = function(id, callback) {
		var option = {
			url: X.config.customerClearance.api.productManageSuffix + id,
			type: 'GET',
			callback: callback
		}

		X.loadData(option)
	}

	var audit = {
		'all': 	'全部',
		'wait': '待审核',
		'pass': '通过',
		'lack': '资料待完善',
		'no': 	'驳回',
	}

	model.auditStatus = Object.keys(audit)

	model.genAuditStatus = function() {
		var i = 0,
			arr = []

		model.auditStatus.forEach(function(item) {
			var o = {}
			o.key = '' + i++
			o.value = audit[item]
			arr.push(o)
		})
		return arr
	}

	model.submitType = ['pass', 'refuse', 'bePerfect']

	model.productStatus = ['草稿', '待审核', '审核通过', '待完善', '驳回', '审核通过']
	model.attachTypes   = ['历史报关单', '产品（含配件）整体外观图', '产品内包装图（分别体现不同面）', '品牌/型号确认图', '其他（可选，如历史报关单、产品说明书、质保证书）']
	model.statusRef     = ['', '', 'pass', 'additionalRequirement', 'refuseReason', '']
	model.statusRefPre  = ['', '', '', '补充说明：', '驳回原因：', '']

	return model
});