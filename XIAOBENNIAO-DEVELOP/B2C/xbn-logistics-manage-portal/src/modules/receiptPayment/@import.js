/*********** 公用 js 模块 ************/
import model from './models/index' //请求模块入口
import cons from './common/cons' //label/value 对应常量
import map from './common/map' //渲染所用 key/label 值
import util from './common/util' //零散功能
import Events from './common/events' //事件入口


/*********** 公用 vue 模块 ************/
import Headd from './chunk/header.vue' //头部
import DetailTable from './chunk/rpDetailTable.vue' //应收/付 详情 - table
import List from './chunk/list.vue' //list 模板
import BillList from './chunk/billList.vue' //单据列表
import ExportDialog from './chunk/exportDialog.vue' //导出dialog
import FeeList from './components/FeeList.vue' //导出dialog
import FeeDetail from './components/FeeDetail.vue' //导出dialog



/**
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 注意 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *
 *          在多次 import 之后，路径会有问题，拿不到想要的Vue模块
 *          js 都是没问题
 * 
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 注意 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */

export {
	model,
	cons,
	map,
	util,
	Events,

	
	Headd,
	DetailTable,
	List,
	BillList,
	ExportDialog,
	FeeList,
	FeeDetail
}