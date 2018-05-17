import Request from '../_request'
const req = new Request('/gcfsFeePayDetail/')

//删除 应收/付 详情 - 明细
async function deleteRpDetail(id) {
	return await req.get('delete?id=' + id)
}

//新增/更新 应收/付 详情 - 明细
async function mergeRpDetail(param) {
	let url = param.feeId? 'update': 'save'
	return await req.post(url, param)
}

export {
	deleteRpDetail,
	mergeRpDetail
}