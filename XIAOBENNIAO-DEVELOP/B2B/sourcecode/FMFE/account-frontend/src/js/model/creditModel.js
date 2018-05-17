X.define("model.creditModel",function () {

    var api   = X.config.credit.api,
    	model =	X.model.create("model.creditModel")
    
    //创建信用证
	model.createCredit = function(data, callback) {
		var option = {}

		option.url  = api[model.creditStatusRef[model.creditStatus]]
		option.type = model.addOrMerge
		option.data = data
		option.callback = callback

		X.loadData(option)
	}

	//删除信用证
	model.deleteCredit = function(id, callback) {
		var option = {}

		option.url  = api.deleteCredit + id
		option.type = 'DELETE'
		option.callback = callback

		X.loadData(option)
	}

	//信用证详情
	model.getCredit = function(id, callback) {
		var option = {}

		option.url  = api[model.creditStatusRef[model.creditStatus]] + id
		option.type = 'GET'
		option.callback = callback

		X.loadData(option)
	}

	model.letterCreditStatus = [
        { key : -1, value :"全部" },
        { key : 0, value :"编辑中" },
        { key : 1, value :"待审核" },
        { key : 2, value :"已取消" },
        { key : 3, value :"已审核" }
    ]

    model.creditStatus = 0 //0 -> 草稿, 1 -> 正本
    model.creditStatusRef = ['creditDraft', 'creditOriginal']
    model.addOrMerge = 'POST'

	return model
})