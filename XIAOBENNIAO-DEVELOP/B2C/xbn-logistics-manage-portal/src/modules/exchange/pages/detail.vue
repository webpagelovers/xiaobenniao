<template>
	<div>
		<page-head :title="'外汇详情'"></page-head>
		<nt-row class="operationBox " style="margin: 0;">
			<nt-col :span="18" class="f16">
				<i @click="$router.back()" class="nt-icon nt-icon-arrow-left" style="cursor: pointer;"></i>&nbsp;&nbsp;查看详情
			</nt-col>
			<nt-col :span="6" style="text-align: right;">
				<nt-button type="primary" v-if="model.settleStatus == settleStatus.settleing.value" @click="confirmSettle(model.id)" style="margin-right: 10px">确认结汇</nt-button>
				<nt-button type="primary" v-if="model.status == auditStatus.waitConfirm.value" @click="confirm(model.id,model.currency)">确认</nt-button>
				<nt-button type="primary" v-if="model.status == auditStatus.waitConfirm.value" @click="reject(model.id)" style="margin-right: 10px">驳回</nt-button>
				<nt-button  @click="$router.back()" type="primary">返回</nt-button>
			</nt-col>
		</nt-row>
		<nt-form label-width="140px" ref="model" :model="model" >
			<div class="contentBox">
				<!-- 驳回原因 -->
				<div class="competing_infor border_layout">
					<div class="competing_infor_title fb ">外汇信息</div>
					<div class="competing_infor_xbox fix">
						<nt-row :span="24">
							<nt-col :span="8">
								<nt-form-item label="(申请)付汇金额：" class="form-item-text break">
									{{model.currency}} {{model.applyAmount}}
								</nt-form-item>
							</nt-col>
							<nt-col :span="8">
								<nt-form-item label="付汇流水号：" class="form-item-text break">
									{{model.payNo}}
								</nt-form-item>
							</nt-col>
							<nt-col :span="8">
								<nt-form-item label="付款人：" class="form-item-text break">
									{{model.payUser}}
								</nt-form-item>
							</nt-col>
						</nt-row>
						<nt-row :span="24">
							<nt-col :span="8">
								<nt-form-item label="付汇账号：" class="form-item-text break">
									{{model.payAccount}}
								</nt-form-item>
							</nt-col>
							<nt-col :span="8">
								<nt-form-item label="收汇时间：" class="form-item-text break">
									{{model.payTime}}
								</nt-form-item>
							</nt-col>
						</nt-row>
						<div class="borderT mB16"></div>
						<nt-row :span="24">
							<nt-col :span="8">
								<nt-form-item label="收汇账号：" class="form-item-text break">
									{{model.receiveAccount}}
								</nt-form-item>
							</nt-col>
							<nt-col :span="8">
								<nt-form-item label="（实收）收汇金额：" class="form-item-text break">
									{{model.currency}}  {{model.receiptAmount}}
								</nt-form-item>
							</nt-col>
							<nt-col :span="8">
								<nt-form-item label="实际到账时间：" class="form-item-text break">
									{{model.receiveTime}}
								</nt-form-item>
							</nt-col>
						</nt-row>
					</div>
				</div>
				<!-- 关联订单信息 -->
				<div class="competing_infor mT25">
					<div class="competing_infor_title fb">关联订单信息</div>
					<div class="competing_infor_main fix">
						<nt-row class="padT_padB16 border_outer border_top3_h mB15" >
							<nt-col :span="12" align="center" class="pT15">
								<div class="main_color f24"><span>{{model.currency}}&emsp;{{model.receiptAmount}}</span></div>
								<div >总金额</div>
							</nt-col>
							<nt-col :span="12" >
								<nt-col :span="12">
									<nt-progress :percentage="getPercentage()" :show-text="false"></nt-progress>
									<div class="mT5" >
										<i class="round bg_ccc mR8"></i>
										未关联：<span class="col_cccccc">{{model.currency}}&emsp;{{model.remainAmount}}</span>
									</div>
									<div class=" mT8" >
										<i class="round  bg_51a2e1 mR8"></i>
										已关联：<span  class="main_color">{{model.currency}}&emsp;{{model.relevancyAmount}}</span>
									</div>
								</nt-col>
							</nt-col>
						</nt-row>
					<nt-table :data="model.linkInfos" style="width: 100%" class="dialog_table">
						<nt-table-column width="11"></nt-table-column>
						<nt-table-column label="退税订单编码" min-width="80">
							<template scope="scope">{{scope.row.taxRefundOrderCode}}<br/>
                                        最终目的国：{{scope.row.tradingCountry}}<br/>
                                        报关口岸：{{customsPort._get(scope.row.customsPort).label}}
										</template>
						</nt-table-column>
						<nt-table-column label="关联日期" prop="payNo" show-overflow-tooltip>
							<template scope="scope">{{ scope.row.linkDate }}</template>
						</nt-table-column>
						<nt-table-column label="关联金额" prop="commodityCode">
							<template scope="scope">{{model.currency}} {{ scope.row.amount }}</template>
						</nt-table-column>
						<nt-table-column label="累计关联金额" min-width="80" show-overflow-tooltip>
							<template scope="scope">{{model.currency}} {{ scope.row.linkedAmount }}</template>
						</nt-table-column>
						<nt-table-column label="报关金额">
							<template scope="scope">{{model.currency}} {{ scope.row.totalCommidityValue }}</template>
						</nt-table-column>
						<nt-table-column label="订单收汇状态" show-overflow-tooltip>
							<template scope="scope">{{ exchangeStatus._get(scope.row.exchangeStatus).label }}</template>
						</nt-table-column>
	            	</nt-table>
					</div>
				</div>
				<!-- 结汇信息 -->
				<div class="competing_infor mT25">
					<div class="competing_infor_title fb">结汇信息</div>
					<div class="competing_infor_main fix">
						<div class="mB15">结汇方式：自主结汇</div>
						<nt-table :data="model.settlementInfos" style="width: 100%" class="dialog_table">
							<nt-table-column width="11"></nt-table-column>
							<nt-table-column label="结汇状态" min-width="80">
								<template scope="scope">{{settleStatus._get(scope.row.settleStatus).label}}</template>
							</nt-table-column>
							<nt-table-column label="结汇时间点" show-overflow-tooltip  width="256">
								<template scope="scope">
									<!-- 外综服 -->
									<div v-if="scope.row.orderType == settleOrderTypeStatus.waizongfu.value">{{ scope.row.settleTimepoint }}</div>
									<!-- 非外综服 -->
									<div v-else>
										固定汇率：{{ scope.row.fixedRate }}<br/>
										关联的退税订单：<router-link :to="'/taxrefund/details/'+scope.row.orderId" class="nt-button--text">{{ scope.row.orderNo }}</router-link><br/>
										开票汇率：{{ scope.row.exchangeRate }}
									</div>
								</template>
							</nt-table-column>
							<nt-table-column label="提交时间" prop="commodityCode">
								<template scope="scope">{{ scope.row.settleApplyTime }}</template>
							</nt-table-column>
							<nt-table-column label="币种/收汇金额" min-width="80" show-overflow-tooltip>
								<template scope="scope"><span class="mR5">{{ scope.row.currency }}</span> <span>{{ scope.row.incomeAmount }}</span></template>
							</nt-table-column>
							<nt-table-column label="×" >
							</nt-table-column>
							<nt-table-column label="汇率 ">
								<template  scope="scope">CYN {{scope.row.orderType == settleOrderTypeStatus.waizongfu.value ? scope.row.timepointRate : scope.row.fixedRate }}</template>
							</nt-table-column>
							<nt-table-column label="=" >
							</nt-table-column>
							<nt-table-column label="结汇金额" show-overflow-tooltip>
								<template scope="scope" class="main_color"><span class="mR5">CYN</span> {{ scope.row.settleAmount }}</template>
							</nt-table-column>
						</nt-table>
						<div class="borderL borderR borderB pT16 pB15 pL16">总结汇金额：<span class="main_color">CYN {{model.settleAmountTotal}}</span></div>
					</div>
				</div>
			</div>
		</nt-form>
        <reject-box :reject-id="rejectId" :reject-dialog-visible="rejectDialogVisible" @close="rejectDialogVisible=false"></reject-box>
        <confirm-box :confirm-id="confirmId" :confirm-dialog-visible="confirmDialogVisible" :confirm-currency="confirmCurrency" @close="confirmDialogVisible=false;getDetail(id);"></confirm-box>
        <confirm-settle-box :confirm-settle-id="confirmSettleId" :confirm-settle-dialog-visible="confirmSettleDialogVisible" @close="confirmSettleDialogVisible=false;getDetail(id);"></confirm-settle-box>
	</div>
</template>

<script>
import {PageHead} from 'xbn-biz-components';
import {auditStatus,settleStatus,settleOrderTypeStatus,exchangeStatus,customsPort} from '../models/status.js';
import rejectBox from './components/reject.vue';
import confirmBox from './components/confirm.vue';
import confirmSettleBox from './components/confirmSettle.vue';
import NtCol from "nt-element/src/components/col/src/col";
import {Progress} from 'nt-element';
export default {
	data() {
		return {
			id:0,
			auditStatus,//审核状态
			settleStatus,
			settleOrderTypeStatus,
			exchangeStatus,
			customsPort,
			model: {},
            rejectId:0,
            rejectDialogVisible:false,
            confirmId:'', //确认ID
            confirmDialogVisible:false,//确认弹窗
			confirmCurrency:'',//确认  货币单位
			confirmSettleId:'',
			confirmSettleDialogVisible:false
		}
	},

	mixins: [],

	components: {
        NtCol,
        PageHead,
		rejectBox,
		confirmBox,
		confirmSettleBox,
		"nt-progress":Progress
	},

	beforeCreate: function() {

	},

	created: async function() {
		this.id = this.$route.params.id;
		this.getDetail(this.id);
	},

	methods: {
		//获取信息
		async getDetail(id) {
			this.model = await this.$nt.models.exchange.getInfo({ id }, this.ctx);
		},
		//驳回
        reject(id){
            this.rejectId=id;
            this.rejectDialogVisible=true;
        },
        confirm(id,currency){
            this.confirmId = id;
            this.confirmCurrency = currency;
            this.confirmDialogVisible = true;
		},
		confirmSettle(id){
			this.confirmSettleId = id;
			this.confirmSettleDialogVisible = true;
		},
		//获取关联百分比
		getPercentage(){
			var p = parseInt(this.model.relevancyAmount / this.model.receiptAmount * 100);
			return p || 0;
		}
	}
}
</script>


<style lang="less">
	.mB16{margin-bottom: 16px;}
	.border_top3_h{border-top:3px solid #51a2e1;}
	.padT_padB16{padding-top:16px;padding-bottom:16px;}
	.round{
		display: inline-block;
		width: 8px;
		height: 8px;
		-moz-border-radius: 50%;
		-webkit-border-radius: 50%;
		border-radius: 50%;
	}
	.bg_51a2e1{background: #51a2e1;}
	.bg_ccc{background: #cccccc;}
	.mR8{margin-right: 8px;}
	.mT8{margin-top: 8px;}
	.pT15{padding-top: 15px;}
	.pL16{padding-left: 16px;}
</style>
