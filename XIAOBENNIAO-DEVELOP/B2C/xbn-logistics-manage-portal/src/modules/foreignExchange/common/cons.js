const CONS = {
	//关联退税订单状态
	roStatus: [{
		label: '全部', value: '-1'
	}, {
		label: '未关联', value: '0'
	}, {
		label: '部分关联', value: '1'
	}, {
		label: '已关联', value: '2'
	}],

	//用于获取 value 获 lable, key值如果是 "纯数字" 则定义为value
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