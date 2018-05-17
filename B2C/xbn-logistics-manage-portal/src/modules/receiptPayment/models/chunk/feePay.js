import Request from '../_request'
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

export default {
	getList,
	getDetail,
	getBillList,
	restart,
	exportFee,
	exportPay
}