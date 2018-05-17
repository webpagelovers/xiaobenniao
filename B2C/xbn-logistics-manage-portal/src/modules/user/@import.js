/*********** 公用 js 模块 ************/
import model from './models/index' //请求模块入口
import cons from './common/cons' //label/value 对应常量
import map from './common/map' //渲染所用 key/label 值
import util from './common/util' //零散功能

/*********** 公用 vue 模块 ************/
import Headd from './chunk/header.vue' //头部
import Contactor from './chunk/contactor.vue' //企业联系人
import FormDetail from './component/formDetail.vue' //表单详情模板


export {
	model,
	cons,
	map,
	util,

	Headd,
	Contactor,
	FormDetail
}