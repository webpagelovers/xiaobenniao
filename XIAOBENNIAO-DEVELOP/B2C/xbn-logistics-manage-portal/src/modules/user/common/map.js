const map = {
	//应收/付 - 详情 - 基本信息
	baseInfo: {
		cfUserName: 	'CF用户名',
		cfUserId: 		'CF用户ID',
		cfUserPhone: 	'手机号',
		createTime: 	'创建时间'
	},

	companyInfo: {
		companyName: 	'企业名称',
		payPalAccount: 	'PayPal账号',
		paymentBank: 	'付汇银行',
		paymentAccount: '付汇账号',
		receiptBank: 	'收款银行',
		receiptAccount: '收款账号'
	},

	companyContact: {
		name: 	'姓名',
		phone: 	'手机',
		email: 	'邮箱',
		remark: '备注'
	},

	//目前只做简单功能
	rulesGenerator(type) {
		let rule = {},
			obj  = this[type]

		for (let i in obj) {
			let arr = [
				{required: true, message: `请输入${obj[i]}`, trigger: 'blur'}
			]

			rule[i] = arr
		}

		return rule
	}
}

export default map