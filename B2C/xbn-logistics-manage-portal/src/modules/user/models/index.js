import Request from './_request'
const req = new Request('/gcfsUserInfo/')

//用户列表
async function list(param) {
	return await req.post('listPage', param)
}

//用户详情
async function detail(param) {
	return await req.post('listPage', param)
}

//保存用户
async function save(param) {
	return await req.post('listPage', param)
}

//更新用户
async function update(param) {
	return await req.post('listPage', param)
}

export default {
	list,
	detail,
	save,
	update
}