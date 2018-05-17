<template>
	<div>
		<page-head :title="'装箱计划'"></page-head>
		<nt-row class="operationBox " style="margin: 0;">
			<nt-col :span="18" class="f16">
				<i class="nt-icon nt-icon-arrow-left" @click="$router.back()" style="cursor: pointer;"></i>&nbsp;&nbsp;生成报关订单
			</nt-col>
			<nt-col :span="6" style="text-align: right;">
				<nt-button type="primary" v-on:click="saveAdd()">保存并新增</nt-button>
				<nt-button type="primary" v-on:click="save()">保存</nt-button>
				<nt-button type="primary" @click="$router.back()">返回</nt-button>
			</nt-col>
		</nt-row>
		<nt-form label-width="150px" ref="formModel" :model="formModel" :rules="rules">
			<div class="contentBox">
				<!-- 基本信息 -->
				<nt-row class="competing_infor border_layout mB25">
					<div class="competing_infor_title fb">基本信息</div>
					<div class="competing_infor_main fix">
						<nt-form-item label="报关订单编码：" prop="formModel.customOrderCodes">
							{{formModel.customOrderCodes}}
						</nt-form-item>
						<nt-form-item label="装箱计划编码：" prop="formModel.packPlanCode">
							{{formModel.packPlanCode}}
						</nt-form-item>
						<nt-form-item label="是否自抬头：" prop="formModel.headUpState">
							<nt-radio-group v-model="formModel.headUpState">
								<nt-radio :label="1">是</nt-radio>
								<nt-radio :label="2">否</nt-radio>
							</nt-radio-group>
						</nt-form-item>
						<nt-form-item label="是否退税：" prop="formModel.taxRefundState">
							<nt-radio-group v-model="formModel.taxRefundState">
								<nt-radio :label="1">是</nt-radio>
								<nt-radio :label="2">否</nt-radio>
							</nt-radio-group>
						</nt-form-item>
						<nt-form-item label="是否法检：" prop="formModel.legalCheckState">
							{{formModel.legalCheckState == 1 ? '是' : '否'}}
						</nt-form-item>
					</div>
				</nt-row>

				<!-- 产品信息 -->
				<nt-row class="competing_infor border_layout mB25">
					<div class="competing_infor_title fb">产品信息</div>
					<div class="competing_infor_main fix" v-show="dashedBtn">
						<nt-button class="addProduct" @click="showTableBox">点击此处添加产品到本张报关订单</nt-button>
					</div>

					<!--添加的产品表格-->
					<div style="border:1px solid red" v-for="item in productInfo">
						<p><span>{{item.index + 1}}</span><nt-button class="fr" type="primary" @click="delProduct(item.index)">删除产品</nt-button></p>
						<nt-table v-show="!dashedBtn" ref="multipleTable" :data="[item]" tooltip-effect="dark" class="dialog_table">
							<nt-table-column label="报关海关编码" prop="boxNo"></nt-table-column>
							<nt-table-column label="中文报关名称" prop="customNameChinese"></nt-table-column>
							<nt-table-column label="申报要素" prop="applyElement"></nt-table-column>
							<nt-table-column label="产品编码" prop="productCode"></nt-table-column>
							<nt-table-column label="CF订单号" prop="cfOrderCode"></nt-table-column>
							<nt-table-column label="用户名" prop="userName"></nt-table-column>
							<nt-table-column label="最终目的国（地区）" prop="destintionPort"></nt-table-column>
						</nt-table>
						<nt-table v-show="!dashedBtn" ref="multipleTable" :data="[item]" tooltip-effect="dark" class="dialog_table">
							<nt-table-column label="成交数量及单位" prop="dealNumber">
								<template scope="scope">
									<nt-input v-model="productInfo.dealNumber"></nt-input><nt-input v-model="productInfo.dealNumberUnit"></nt-input>
								</template>
							</nt-table-column>
							<nt-table-column label="法定数量及单位" prop="customNameChinese">
								<template scope="scope">
									<nt-input  v-model="scope.row.customNameChinese"></nt-input><span>件</span>
								</template>
							</nt-table-column>
							<nt-table-column label="第二数量及单位" prop="applyElement">
								<template scope="scope">
									<nt-input  class="w240" v-model="scope.row.applyElement"></nt-input><span>KG</span>
								</template>
							</nt-table-column>
							<nt-table-column label="毛重(KG)" prop="grossWeight">
								<template scope="scope">
									<nt-input  class="w240" v-model="scope.row.grossWeight"></nt-input>
								</template>
							</nt-table-column>
							<nt-table-column label="净重(KG)" prop="netWeight">
								<template scope="scope">
									<nt-input  class="w240" v-model="scope.row.netWeight"></nt-input>
								</template>
							</nt-table-column>
							<nt-table-column label="申报价值" prop="applyPrice">
								<template scope="scope">
									<nt-input  class="w240" v-model="scope.row.applyPrice"></nt-input>
								</template>
							</nt-table-column>
							<nt-table-column label="申报总金额" prop="totalApplyPrice">
								<template scope="scope">
									<nt-input  class="w240" v-model="scope.row.totalApplyPrice"></nt-input>
								</template>
							</nt-table-column>
							<nt-table-column label="征免" prop="destintionPort"></nt-table-column>
						</nt-table>
					</div>
					<nt-button type="primary" class="fr" v-show="!dashedBtn" @click="showTableBox(1)">继续添加商品</nt-button>
					<nt-button type="primary" class="fr mr20" v-show="!dashedBtn" @click="">合并产品</nt-button>

				</nt-row>

				<!-- 物流装箱信息 -->
				<nt-row class="competing_infor border_layout mB25">
					<div class="competing_infor_title fb">物流装箱信息</div>
					<div class="competing_infor_main fix">
						<nt-form-item label="起运港：" prop="startPort">
							<nt-input  class="w240" v-model="formModel.startPort"></nt-input>
						</nt-form-item>
						<nt-form-item label="指运港：" prop="destintionPort">
							<nt-input  class="w240" v-model="formModel.destintionPort"></nt-input>
						</nt-form-item>
						<nt-form-item label="运抵国（地区）：" prop="hsCode">
							<nt-input  class="w240" v-model="formModel.hsCode"></nt-input>
						</nt-form-item>
						<nt-form-item label="运输方式：" prop="transportType">
							<nt-input  class="w240" v-model="formModel.transportType"></nt-input>
						</nt-form-item>
						<nt-form-item label="运输工具名称：" prop="transportToolName">
							<nt-input  class="w240" v-model="formModel.transportToolName"></nt-input>
						</nt-form-item>
						<nt-form-item label="航次：" prop="voyage">
							<nt-input  class="w240" v-model="formModel.voyage"></nt-input>
						</nt-form-item>
						<nt-form-item label="截关时间：" prop="noRequire">
							<nt-date-picker class="w240" type="date" placeholder="选择日期" v-model="formModel.noRequire"></nt-date-picker>
						</nt-form-item>
						<nt-form-item label="主提运单号：" prop="masterWaybillCode">
							<nt-input  class="w240" v-model="formModel.masterWaybillCode"></nt-input>
						</nt-form-item>
						<nt-form-item label="分提运单号：" prop="hsCode">
							<nt-input  class="w240" v-model="formModel.salveWaybillCode"></nt-input>
						</nt-form-item>
						<nt-form-item label="集装箱号：" prop="containerNo">
							<nt-input  class="w240" v-model="formModel.containerNo"></nt-input>
						</nt-form-item>
						<nt-form-item label="集装箱型：" prop="containerType">
							<!--todo 枚举值：1-20GP，2-40GP。1-20GP：20尺规格的集装箱。2-40GP：40尺及以上尺寸的集装箱。-->
							<nt-input  class="w240" v-model="formModel.containerType"></nt-input>
						</nt-form-item>
						<nt-form-item label="集装箱量：" prop="noRequire">
							<nt-input  class="w240" v-model="formModel.noRequire"></nt-input>
						</nt-form-item>
						<nt-form-item label="折合标准集装箱数：" prop="noRequire">
							<nt-input  class="w240" v-model="formModel.noRequire"></nt-input>
						</nt-form-item>
					</div>
				</nt-row>

				<!-- 贸易信息 -->
				<nt-row class="competing_infor border_layout mB25">
					<div class="competing_infor_title fb">贸易信息</div>
					<div class="competing_infor_main fix">
						<nt-form-item label="最终目的国（地区）：" prop="applyName">
							<nt-input  class="w240" v-model="formModel.applyName"></nt-input>
						</nt-form-item>
						<nt-form-item label="贸易国（地区）：" prop="hsCode">
							<nt-input  class="w240" v-model="formModel.hsCode"></nt-input>
						</nt-form-item>
						<nt-form-item label="境内货源地：" prop="hsCode">
							<nt-input  class="w240" v-model="formModel.hsCode"></nt-input>
						</nt-form-item>
						<nt-form-item label="成交方式：" prop="hsCode">
							<nt-input  class="w240" v-model="formModel.hsCode"></nt-input>
						</nt-form-item>
						<nt-form-item label="结汇方式：" prop="hsCode">
							<nt-input  class="w240" v-model="formModel.hsCode"></nt-input>
						</nt-form-item>
						<nt-form-item label="币制：" prop="hsCode">
							<nt-input  class="w240" v-model="formModel.hsCode"></nt-input>
						</nt-form-item>
						<nt-form-item label="出口口岸：" prop="hsCode">
							<nt-date-picker class="w240" type="date" placeholder="选择日期" v-model="formModel.hsCode"></nt-date-picker>
						</nt-form-item>
						<nt-form-item label="运费：" prop="hsCode">
							<nt-input  class="w240" v-model="formModel.hsCode"></nt-input>
						</nt-form-item>
						<nt-form-item label="保费：" prop="hsCode">
							<nt-input  class="w240" v-model="formModel.hsCode"></nt-input>
						</nt-form-item>
						<nt-form-item label="杂费：" prop="noRequire">
							<nt-input  class="w240" v-model="formModel.noRequire"></nt-input>
						</nt-form-item>
						<nt-form-item label="总价：" prop="hsCode">
							<nt-input  class="w240" v-model="formModel.hsCode"></nt-input>
						</nt-form-item>
						<nt-form-item label="监管方式：" prop="noRequire">
							<nt-input  class="w240" v-model="formModel.noRequire"></nt-input>
						</nt-form-item>
						<nt-form-item label="征免性质：" prop="noRequire">
							<nt-input  class="w240" v-model="formModel.noRequire"></nt-input>
						</nt-form-item>
						<nt-form-item label="许可证号：" prop="noRequire">
							<nt-input  class="w240" v-model="formModel.noRequire"></nt-input>
						</nt-form-item>
						<nt-form-item label="合同协议号：" prop="noRequire">
							<nt-input  class="w240" v-model="formModel.noRequire"></nt-input>
						</nt-form-item>
						<nt-form-item label="随附单证代码：" prop="noRequire">
							<nt-input  class="w240" v-model="formModel.noRequire"></nt-input>
						</nt-form-item>
						<nt-form-item label="随附单证编号：" prop="noRequire">
							<nt-input  class="w240" v-model="formModel.noRequire"></nt-input>
						</nt-form-item>
						<nt-form-item label="特殊关系确认：" prop="addedTax">
							<nt-radio-group >
								<nt-radio label="是"></nt-radio>
								<nt-radio label="否"></nt-radio>
							</nt-radio-group>
						</nt-form-item>
						<nt-form-item label="价格影响确认：" prop="addedTax">
							<nt-radio-group >
								<nt-radio label="是"></nt-radio>
								<nt-radio label="否"></nt-radio>
							</nt-radio-group>
						</nt-form-item>
						<nt-form-item label="支付特许权使用费确认：" prop="addedTax">
							<nt-radio-group >
								<nt-radio label="是"></nt-radio>
								<nt-radio label="否"></nt-radio>
							</nt-radio-group>
						</nt-form-item>
					</div>
				</nt-row>

				<!--备注信息-->
				<nt-row class="competing_infor border_layout mB25">
					<div class="competing_infor_title fb">备注信息</div>
					<div class="competing_infor_main fix">
						<nt-form-item label="备注：" prop="applyName">
							<nt-input type="textarea" v-model="formModel.applyName"></nt-input>
						</nt-form-item>
					</div>
				</nt-row>
			</div>
		</nt-form>

		<!-- 添加产品弹窗 -->
		<addProductDialog ref="addProductDialog" v-on:addProduct="addProduct"></addProductDialog>
	</div>
</template>

<script>
import {checkAjaxData,ajaxDataMumberToString} from '../models/checkAjaxData.js'
import {PageHead } from 'xbn-biz-components';
import detail from './components/cp-detail.vue';
import addProductDialog from './components/addProductDialog'

export default {
	data() {
		return {
			deletePopoverShow: true,
			formModel: {},
			rules: {
				headUpState : [
                    { required: true, message: '此项不能为空', trigger: 'blur' }
                ],
				taxRefundState:[
                    { required: true, message: '此项不能为空', trigger: 'blur' }
				],
				startPort:[
                    { required: true, message: '此项不能为空', trigger: 'blur' }
				],
				destintionPort :[
					{ required: true, message: '此项不能为空', trigger: 'blur' }
				],
				transportType  :[
					{ required: true, message: '此项不能为空', trigger: 'blur' }
				],
				transportToolName  :[
					{ required: true, message: '此项不能为空', trigger: 'blur' }
				],
				voyage  :[
					{ required: true, message: '此项不能为空', trigger: 'blur' }
				],
				masterWaybillCode :[
					{ required: true, message: '此项不能为空', trigger: 'blur' }
				],
				containerType :[
					{ required: true, message: '此项不能为空', trigger: 'blur' }
				],
				noRequire:[
					{ min: 0, max: 50, message: '最多 50 个字符', trigger: 'blur' }
				]
            },
			applyElement:[],
			dashedBtn:true,
			productInfo:[],
			isContinue:false
		}
	},

	components: {
		PageHead,
		detail,
		addProductDialog
	},

	beforeCreate: function() {

	},

	created: async function() {
		let id = this.$route.params.id;
		this.getDetail(id);
	},

	watch : {
		// 没有产品表格就显示dashed添加按钮
		productInfo: function(newVal, oldVal){
			!newVal.length && (this.dashedBtn = true)
		}
	},
	methods: {
		// 删除商品
		delProduct(index){
			this.productInfo.splice(index, 1)
			this.productInfo.forEach((e, i) => {
				e.index = i
			})
		},
		// 弹窗添加商品后，生成表格
		addProduct(data){
			if(this.isContinue){
				data.forEach(e => {
					this.productInfo.push(e)
				})
			}
			else{
				this.productInfo = data
			}
			this.dashedBtn = false
			this.productInfo.forEach((e, i) => {
				e.index = i
			})
		},
		//获取信息
		async getDetail(id) {
			var json = await this.$nt.models.encasement.createCustomOrder({ id }, this.ctx);
			this.formModel = ajaxDataMumberToString(json);

			// radio的label需要parseInt
			this.formModel.legalCheckState  = parseInt(this.formModel.legalCheckState)
			this.formModel.taxRefundState   = parseInt(this.formModel.taxRefundState)
			this.formModel.headUpState		= parseInt(this.formModel.headUpState)
		},

		// 点击弹出产品弹框
		showTableBox (isContinue) {
			if(isContinue == 1){
				this.isContinue = true
			}
			this.$refs.addProductDialog.show();
		},

		// save保存
		async save (){
			var json = await this.$nt.models.encasement.saveOrder(this.formModel, this.ctx);
			if(json.statusCode == 2000000){
				//成功
			}

}

	}
}
</script>


<style lang="less">
	.mB25{margin-bottom: 25px;}
	.pB16{padding-bottom: 16px;}
	.mL30{margin-left: 30px;}
	.mB16{margin-bottom: 16px;}
	.formModel_h {
		.nt-form-item__label{word-break: break-all;}
	}
	.addProduct{
		width:100%;
		padding:30px 0;
		border-style: dashed;
	}
</style>
