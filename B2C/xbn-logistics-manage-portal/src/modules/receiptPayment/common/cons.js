const CONS = {
	//关账状态
	roStatus: [{
		label: '未关账', value: '1'
	}, {
		label: '已关账', value: '2'
	}, {
		label: '重新开始', value: '3'
	}],

	//费用项
	feeType: [{
		label: '法检费', value: '1'
	}, {
		label: '报关费', value: '2'
	}],

	//应收/应付 的类型
	rpType: [{
		label: '应收', value: '1', ref: 'receipt'
	}, {
		label: '应付', value: '2', ref: 'payment'
	}],

	//导出区间选项
	exportSectionChoose: [{
		label: '早于', value: '1'
	}, {
		label: '晚于', value: '2'
	}, {
		label: '介于', value: '3'
	}, {
		label: '等于', value: '4'
	}],

	/**
	 * [val 用于获取 value 获 lable, key值如果是 "纯数字" 则定义为value] 
	 * @param  {[type]} type [对应的数组]
	 * @param  {[type]} key  [对应的 label/key, 如果是纯数组则认为是 key]
	 * @return {[type]}      [description]
	 */
	val(type, key) {
		let _typ = ['value', 'label'],
			_key = /^(?:|-)\d+$/.test(key)? _typ[0]: _typ[1],
			_val = ''

		CONS[type].forEach(i => {
			i[_key] == key && (_val = i[_typ.join('').replace(_key, '')])
		})

		return _val
	}
}

export default CONS