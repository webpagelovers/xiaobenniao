X.define("model.purchaseInfoModel", function () {

    var api   = X.config.purchaseInfo.api,
    	model =	X.model.create("model.purchaseInfoModel")

    model.query = function(id, callback) {
    	var option = {
			url: 		X.config.purchaseInfo.api.query + id,
			type: 		'GET',
			callback: 	callback
		}

		X.loadData(option)
	}

	//抓取 filterData、matchPeople 所有列表数据 
	model.queryAll = function() {
		this.queryFilterData()
		this.queryMatchPeople()
	}

	model.queryFilterData = function() {
		var option = {
			type: 	 'POST',
			url: 	 X.config.purchaseInfo.api.filterData,
			data:    {pageSize: 1000000, pageNo: 1},
			callback: function(res) {
				fillData.matchedFilterData = res.data.list
			}
		}

		X.loadData(option)
	}
	
	model.queryMatchPeople = function() {
		var option = {
			type: 	 'POST',
			url: 	 X.config.purchaseInfo.api.matchPeople,
			data:    {pageSize: 1000000, pageNo: 1},
			callback: function(res) {
				fillData.matchedPeople = res.data.list
			}
		}

		X.loadData(option)
	}

	model.submit = function(data, callback) {
		var option = {
			type: 	  'POST',
			url: 	  X.config.purchaseInfo.api.submit,
			data:     data,
			callback: callback
		}

		X.loadData(option)
	}

	var memberType = [
		{ key : -1, value :"全部会员" },
		{ key : 0,  value :"付费会员" },
		{ key : 1,  value :"普通会员" }
	]

	var infoTypeArr    = ['询价', '招标'],
		memberTypeArr  = ['付费会员', '普通会员']

	var fillData = {
		matchedFilterData: [],
		matchedPeople:     []
	}

	var submitDataRef = {
    	matchedFilterData: 'purchaseInfoIds',
    	matchedPeople:     'supplierCompanyIds'
    }

	model.memberType 	= memberType
	model.fillData 	 	= fillData
	model.infoTypeArr 	= infoTypeArr
	model.memberTypeArr = memberTypeArr
	model.submitDataRef = submitDataRef

    return model
})