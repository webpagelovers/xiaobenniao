import Request from '../_request'
const req = new Request('/gcfsSupplier/')

//供应商列表
async function supList(param) {
	return await req.file('exportFeePay', param)
}

//添加供应商
async function supSave(param) {
	return await req.file('exportFeePay', param)
}

//修改供应商
async function supUpdate(param) {
	return await req.file('exportFeePay', param)
}

export default {
	supList,
	supSave,
	supUpdate
}