import Request from './_request'

/*###################### GO 应收/付 接口 FeePay ######################*/

const req = new Request('/gcfsFeePayInfo/')

//应收/付 列表
async function getList(query) {
	return await req.post('listPage', query)
}

//应收/付 详情
async function getDetail(id) {
	return await req.get('info?id=' + id)
}

//单据 列表
async function getBillList(query) {
	return await req.post('choiceOrderListPage', query)
}

//重新启动 应收/付
async function restart(id) {
	return await req.post('restart?id=' + id)
}

//导出应收列表
async function exportFee(param) {
	return await req.file('exportFeePay', param)
}

//导出应付列表
async function exportPay(param) {
	return await req.file('exportPayable', param)
}


/*###################### GO 应收/付详情 接口 FeePay Detail ######################*/

const req2 = new Request('/gcfsFeePayDetail/')

//删除 应收/付 详情 - 明细
async function deleteRpDetail(id) {
	return await req2.get('delete?id=' + id)
}

//新增/更新 应收/付 详情 - 明细
async function mergeRpDetail(param) {
	let url = param.id? 'update': 'save'
	return await req2.post(url, param)
}

/*###################### GO 供应商接口 Supplier ######################*/

const req3 = new Request('/gcfsSupplier/')

//供应商列表
async function supList(param) {
	return await req3.post('listPage', param)
}

//添加供应商
async function supSave(param) {
	return await req3.post('save', param)
}

//修改供应商
async function supUpdate(param) {
	return await req3.post('update', param)
}

//修改供应商
async function supDelete(param) {
	return await req3.get('delete', param)
}

export default {
	getList,
	getDetail,
	getBillList,
	restart,
	exportFee,
	exportPay,

	
	deleteRpDetail,
	mergeRpDetail,

	supList,
	supSave,
	supUpdate
}