<template>
	<div class="vue-2018011201">
		<page-head :title="'产品管理'"></page-head>
		<nt-row class="operationBox " style="margin: 0;">
			<nt-col :span="18" class="f16">
				<i class="nt-icon nt-icon-arrow-left" @click="$router.back()" style="cursor: pointer;"></i>&nbsp;&nbsp;产品详情
			</nt-col>
			<nt-col :span="6" style="text-align: right;">
				<nt-button type="primary" v-if="model.status == commodityStatus.supplyInformation.value || model.status == commodityStatus.unAudit.value" @click="$router.replace('/commodity/audit/'+model.id)" style="margin-right: 10px">审核</nt-button>
				<nt-button type="primary" @click="$router.back()">返回</nt-button>
			</nt-col>
		</nt-row>
		<nt-form label-width="150px" ref="formModel" :model="formModel" >
			<div class="contentBox">
				<div class="border_layout">
					
				<!-- 驳回原因 -->
				<nt-row class="competing_infor mB25"  v-if="model.status == commodityStatus.auditFailed.value">
					<div class="competing_infor_title fb">审核驳回</div>
					<div class="competing_infor_main fix">
						<div class="remind_box_q w512 lh22">
							<div>驳回原因：<span class="break">{{model.rejectReason}}</span></div>
							<!-- <div class="col_cccccc"><i class="nt-icon-xbn-11 main_color mR5"></i>提醒：如果对审核有疑问请致电 xxxxxxxxxx 或联系您的服务顾问。</div> -->
						</div>
							<!--<nt-form-item label="驳回原因：" class="break w620">
								<span >{{model.rejectReason}}</span>
							</nt-form-item>
						<div class="col_cccccc mL77"><i class="nt-icon-xbn-11 main_color mR5"></i>提醒：如果对审核有疑问请致电 xxxxxxxxxx 或联系您的服务顾问。</div>-->
					</div>
				</nt-row>
				<!-- 不认可原因 -->
				<nt-row class="competing_infor border_layout mB25"  v-if="model.status == 6">
					<div class="competing_infor_title fb">用户不认可信息</div>
					<div class="competing_infor_xbox fix">
						<nt-col :span="12">
							<nt-form-item label="用户建议HS编码：" class="break">
								{{model.suggestHsCode}}
							</nt-form-item>
						</nt-col>
						<nt-col :span="12">
							<nt-form-item label="用户建议其他事项：" class="break">
								{{model.suggestInfo}}1
							</nt-form-item>
						</nt-col>
					</div>
				</nt-row>
				<!-- 详细信息 -->
				<detail :model="model"></detail>
				</div>
			</div>
		</nt-form>
		
		<nt-form label-width="150px" ref="form-reject" :model="rejectModel">
			<nt-dialog title="驳回原因" :visible.sync="rejectDialogVisible" size="tiny" :close-on-click-modal="false" >
				<nt-form-item label="" class="mB0 break reject-reason-box" prop="rejectReason" :rules="
					[{ required: true, message: '此项不能为空', trigger: 'blur' }]
				">
                	<countable-input class="mB15" type="textarea" v-model="rejectModel.rejectReason" :maxlength="300" :total="300" :rows="5" placeholder="填写具体审核驳回原因！(限300字)"></countable-input>
				</nt-form-item>
				<div class="dialog-footer tR">
					<nt-button  type="primary" size="small" @click="reject">确定</nt-button>
					<nt-button  type="primary" size="small" @click="rejectDialogVisible=false">取消</nt-button>
				</div>
			</nt-dialog>
		</nt-form>
	</div>
</template>

<script>
import {checkAjaxData,ajaxDataMumberToString} from '../models/checkAjaxData.js'
import {PageHead,CountableInput } from 'xbn-biz-components';
import detail from './components/cp-detail.vue';
import NtCol from "nt-element/src/components/col/src/col";
import { commodityStatus } from '../models/status.js';
export default {
	data() {
		return {
				commodityStatus,
			rejectDialogVisible:false,
			model: {},
			formModel: {
				addedTax: 0,		//增值税税率
				applyElement: [],	//申报要素
				applyName: '',		//报关名称
				hsCode: '',			//HS编码
				id: 0,				//产品ID
				rebateTax: 0,		//出口退税税率
				updateUserName: '1'
			},
			rejectModel:{
				rejectReason:''//产品驳回信息
			}
		}
	},

	mixins: [],

	components: {
        NtCol,
        PageHead,
		detail,
		CountableInput
	},

	beforeCreate: function() {

	},

	created: async function() {
		let id = this.$route.params.id;
		this.getDetail(id);
	},

	methods: {
		//获取产品信息
		async getDetail(id) {
			var json = await this.$nt.models.product.getCommodityInfo({ id }, this.ctx);
			this.model = ajaxDataMumberToString(json);
            this.model.applyElement = JSON.parse(this.model.applyElement || '[]');
		},
		//审核拒绝
		async reject(){
			var data ={
				id: this.model.id,
				rejectReason: this.rejectModel.rejectReason
			}
			this.$refs["form-reject"].validate(async (valid) => {
				if (valid) {
					var json = await this.$nt.models.product.rejectCommodity(data, this.ctx);
					this.$notify({
						message: '产品审核驳回成功。',
						type: 'success'
					});
					this.$router.back();
				}
			});
		}
	}
}
</script>


<style lang="less">
.vue-2018011201{
	.mB25{margin-bottom: 25px;}
	.mL77{margin-left: 77px;}
	.remind_box_q{
		padding:8px;
		border: 1px solid #a3c1fc;
	}
	.w512{width:512px;}
	.reject-reason-box {
	 	.nt-form-item__content{margin-left: 0px!important;}
	}

}
</style>
