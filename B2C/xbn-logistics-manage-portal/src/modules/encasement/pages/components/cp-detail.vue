<template>
	<div>
		<!-- 基础信息 -->
		<nt-row class="competing_infor ">
			<div class="competing_infor_title fb">基本信息</div>
			<div class="competing_infor_main fix">
				<nt-row :gutter="24">
					<nt-col :span="8" class="form-item-text break">
						<nt-form-item label="装箱计划编码：">
							{{model.packPlanCode}}
						</nt-form-item>
					</nt-col>
					<nt-col :span="8" class="form-item-text">
						<nt-form-item label="集装箱型：">
							{{model.containerType}}
						</nt-form-item>
					</nt-col>
					<nt-col :span="8" class="form-item-text break">
						<nt-form-item label="集装箱号：">
							{{model.containerNo}}
						</nt-form-item>
					</nt-col>
				</nt-row>
				<nt-row :gutter="24">
					<nt-col :span="8" class="form-item-text break">
						<nt-form-item label="件数：">
							{{model.totalNum}}
						</nt-form-item>
					</nt-col>
					<nt-col :span="8" class="form-item-text">
						<nt-form-item label="毛重：">
							{{model.totalGrossWeight}}
						</nt-form-item>
					</nt-col>
					<nt-col :span="8" class="form-item-text break">
						<nt-form-item label="净重：">
							{{model.totalNetWeight}}
						</nt-form-item>
					</nt-col>
				</nt-row>

				<nt-row :gutter="24">
					<nt-col :span="8" class="form-item-text break">
						<nt-form-item label="体积：">
							{{model.totalVolume}}
						</nt-form-item>
					</nt-col>
					<nt-col :span="8" class="form-item-text">
						<nt-form-item label="创建时间：">
							{{model.createTime}}
						</nt-form-item>
					</nt-col>
					<nt-col :span="8" class="form-item-text break">
						<nt-form-item label="处理状态：">
							{{handleStatus.get(model.state).label}}
						</nt-form-item>
					</nt-col>
				</nt-row>
			</div>
		</nt-row>

		<!-- 包装信息 -->
		<nt-row class="competing_infor mT25">
			<div class="competing_infor_title fb">包装信息</div>
			<div class="competing_infor_xbox fix">
				<nt-row :gutter="24">
					<nt-col :span="8" class="form-item-text">
						<nt-form-item label="物流计划编号：">
							{{model.logisticsPlanCode}}
						</nt-form-item>
					</nt-col>
					<nt-col :span="8" class="form-item-text">
						<nt-form-item label="运输方式：">
							{{transportWay.get(model.transportType).label}}
						</nt-form-item>
					</nt-col>
					<nt-col :span="8" class="form-item-text">
						<nt-form-item label="起运港：">
							{{model.startPort}}
						</nt-form-item>
					</nt-col>
				</nt-row>
				<nt-row :gutter="24">
					<nt-col :span="8" class="form-item-text">
						<nt-form-item label="目的港：">
							{{model.destintionPort}}
						</nt-form-item>
					</nt-col>
					<nt-col :span="8" class="form-item-text">
						<nt-form-item label="船期：">
							{{model.shipPeriod}}
						</nt-form-item>
					</nt-col>
					<nt-col :span="8" class="form-item-text">
						<nt-form-item label="运输工具名称：">
							{{model.transportToolName}}
						</nt-form-item>
					</nt-col>
				</nt-row>
				<nt-row :gutter="24">
					<nt-col :span="8" class="form-item-text">
						<nt-form-item label="航次：">
							{{model.voyage}}
						</nt-form-item>
					</nt-col>
					<nt-col :span="8" class="form-item-text">
						<nt-form-item label="主提运单号：">
							{{model.masterWaybillCode}}
						</nt-form-item>
					</nt-col>
					<nt-col :span="8" class="form-item-text">
						<nt-form-item label="分提运单号：">
							&nbsp;
						</nt-form-item>
					</nt-col>
				</nt-row>
			</div>
		</nt-row>

		<!-- 订单信息 -->
		<nt-row class="competing_infor mT25">
			<div class="competing_infor_title fb">订单信息</div>

			<!--几条订单信息 循环packPlanCfOrders-->
			<div class="competing_infor_main fix" style="border: 1px solid #e7eaec;margin:20px;" v-for="item in model.packPlanCfOrders">
				<nt-row :gutter="24">
					<nt-col :span="8" class="form-item-text">
						<nt-form-item label="CF订单号：">
							{{item.cfOrderCode}}
						</nt-form-item>
					</nt-col>
					<nt-col :span="8" class="form-item-text">
						<nt-form-item label="用户名：">
							{{item.userName}}
						</nt-form-item>
					</nt-col>
					<nt-col :span="8" class="form-item-text">
						<nt-form-item label="是否自抬头：">
							{{item.headUpState == 1 ? '是' : '否'}}
						</nt-form-item>
					</nt-col>
				</nt-row>
				<nt-row :gutter="24">
					<nt-col :span="8" class="form-item-text">
						<nt-form-item label="是否退税：">
							{{item.taxRefundState == 1 ? '是' : '否'}}
						</nt-form-item>
					</nt-col>
					<nt-col :span="8" class="form-item-text">
						<nt-form-item label=" ">
							&nbsp;
						</nt-form-item>
					</nt-col>
					<nt-col :span="8" class="form-item-text">
						<nt-form-item label=" ">
							&nbsp;
						</nt-form-item>
					</nt-col>
				</nt-row>

				<!--有几种箱子 循环packPlanCfOrderBoxes-->
				<nt-table :span-method="objectSpanMethod" ref="multipleTable" :data="item.packPlanCfOrderBoxes" tooltip-effect="dark" class="dialog_table">
					<nt-table-column label="序号" min-width="10" prop="boxNo"></nt-table-column>
					<nt-table-column label="包装类型" prop="packageType">

					</nt-table-column>
					<nt-table-column label="长(CM)" prop="boxLength"></nt-table-column>
					<nt-table-column label="宽(CM)" prop="boxWight"></nt-table-column>
					<nt-table-column label="高(CM)" prop="boxHeight"></nt-table-column>
					<nt-table-column label="箱数">
						<template slot-scope="scope">
							?????
						</template>
					</nt-table-column>
					<nt-table-column label="重量(KG)" prop="boxWeight"></nt-table-column>
					<nt-table-column label="体积(CBM)" prop="boxVolume"></nt-table-column>

					<!--每个箱子有几个商品 循环packPlanCfOrderBoxProducts-->
					<nt-table-column label="商家SKU" prop="packPlanCfOrderBoxProducts.merchantSku">

					</nt-table-column>
					<nt-table-column label="中英文报关名称/规格">
						<template slot-scope="scope">
							{{scope.row.customNameChinese + ',' + scope.row.customNameEnglish + ',' + scope.row.specsModel}}
						</template>
					</nt-table-column>
					<nt-table-column label="申报价值" prop="packPlanCfOrderBoxProducts.applyPrice">

					</nt-table-column>
					<nt-table-column label="申报总金额" prop="packPlanCfOrderBoxProducts.totalApplyPrice">

					</nt-table-column>
					<nt-table-column label="单箱数量" prop="packPlanCfOrderBoxProducts.singleBoxProductNum">

					</nt-table-column>
					<nt-table-column label="总数量" prop="packPlanCfOrderBoxProducts.dealNumber">

					</nt-table-column>
					<nt-table-column label="状态">
						<template slot-scope="scope">
							{{scope.row.packPlanCfOrderBoxProducts.state == 1 ? '未生成' : '已生成'}}
						</template>
					</nt-table-column>
					<nt-table-column label="报关订单">
						<template slot-scope="scope">
							{{scope.row.packPlanCfOrderBoxProducts.customOrdersCodes}}
						</template>
					</nt-table-column>
				</nt-table>
			</div>
		</nt-row>
	</div>
</template>

<script>
import Enum from '../../models/enum.js';
import { handleStatus, simpleQuery, comboQuery, quickFilter,transportWay } from '../../models/status.js';

export default {
	props: ['model'],
	data() {
		return {
			handleStatus,
			transportWay,
			contactInfo: {},
			brandTypeEnum: new Enum(),
			EbayEnumData:{},
			applyUnitEnum:new Enum(),//币制枚举
		}
	},
	mixins: [],

	components: {
	},
	beforeCreate: function () {
	},
	mounted: async function () {
		//获取联系人信息
		///this.getContactInfo(this.model.contactId);
		setTimeout(i => {
			this.convertData(this.model)
		}, 0)
	},
	created: async function () {
		//获取初始数据
		await this.init();
	},
	methods: {

		// 表格合并
		objectSpanMethod ({ row, column, rowIndex, columnIndex }) {

		},

		async init() {

		},


		convertData(data){

	let newBoxes = []
	if(data.packPlanCfOrders){
		data.packPlanCfOrders.forEach(eachOrder => {
			if(eachOrder.packPlanCfOrderBoxes){
			eachOrder.packPlanCfOrderBoxes.forEach(eachBox => {
				let pros = eachBox.packPlanCfOrderBoxProducts
				if (pros.length > 1) {
				pros.forEach((item, index) => {
					let obj = {packPlanCfOrderBoxProducts: item}
					if (index === 0) {
					for (let ii in eachBox) {
						ii != 'packPlanCfOrderBoxProducts' && (obj[ii] = eachBox[ii])
					}
				}
				newBoxes.push(obj)
			})
			} else {
				eachBox.packPlanCfOrderBoxProducts = eachBox.packPlanCfOrderBoxProducts[0]
				newBoxes.push(eachBox)
			}

			eachOrder.packPlanCfOrderBoxes = newBoxes
		})
		}
	})
	}


	return data
		}
	}
}
</script>
<style lang="less">
	.imgbox_width_h{width:490px;height: 80px; display: block;}
	.mL92{margin-left: 92px;}
	.mR16{margin-right: 16px;}
</style>
