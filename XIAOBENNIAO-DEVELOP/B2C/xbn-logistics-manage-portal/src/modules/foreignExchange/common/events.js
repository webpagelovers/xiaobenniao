var router

class EVENTS {
	constructor(ctx) {
		router = ctx.$router
	}

	//跳转收汇表单页面
	toFeFormPage(id) {
		let hasId = /^\d+$/.test(id)? `/${id}`: ``
		router.push(`form${hasId}`)
	}

	//跳转收汇详情页面
	toFeDetailPage(id) {
		router.push(id)
	}

	//新增 或 修改 收汇
	modifyFe(data) {

	}

	//展示关联退税订单
	showRoDialog(id) {

	}

	//修改 收汇
	modifyFe(id) {

	}

	//删除 收汇
	deleteFe(id) {

	}

	//返回
	back() {
		router.back()
	}
}

export default EVENTS