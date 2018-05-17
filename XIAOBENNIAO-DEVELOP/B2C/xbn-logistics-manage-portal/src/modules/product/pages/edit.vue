<template>
	<div>
		<page-head :title="'产品编辑'"></page-head>
		<nt-row class="operationBox " style="margin: 0;">
			<nt-col :span="18" class="f16">
				<i class="nt-icon nt-icon-arrow-left" @click="$router.back()" style="cursor: pointer;"></i>&nbsp;&nbsp;产品编辑
			</nt-col>
			<nt-col :span="6" style="text-align: right;">
				<nt-button type="primary" v-on:click="audit()">保存</nt-button>
				<nt-button type="primary" @click="$router.back()">返回</nt-button>
			</nt-col>
		</nt-row>
		<nt-form label-width="150px" ref="formModel" :model="formModel" :rules="rules">
			<div class="contentBox">
				<!-- 产品审核信息 -->
				<nt-row class="competing_infor border_layout mB25">
					<div class="competing_infor_title fb">产品审核信息</div>
					<div class="competing_infor_main fix">
						<nt-form-item label="产品报关名称：" prop="applyName">
							<nt-input  class="w240" v-model="formModel.applyName"></nt-input>
						</nt-form-item>
						<nt-form-item label="HS编码：" prop="hsCode">
							<nt-input  class="w240" v-model="formModel.hsCode"></nt-input>
						</nt-form-item>
						<nt-form-item label="产品增值税税率：" prop="addedTax">
							<nt-input  class="w240" v-model="formModel.addedTax"></nt-input>
						</nt-form-item>
						<nt-form-item label="产品出口退税税率:" prop="rebateTax">
							<nt-input  class="w240" v-model="formModel.rebateTax"></nt-input>
						</nt-form-item>
						<div class=" pB16 fb borderB mL30 mB16">申报要素</div>

						<div v-for="(item,index) in formModel.applyElement" :key="index" >
							<div class="formModel_h">
								<nt-form-item :label="item.label+'：'" :prop="'applyElement.'+index+'.value'" :rules="[{ required: true, message: '此项不能为空', trigger: 'blur' }]">
									<nt-input  class="w240" v-model="item.value" :maxlength="200"></nt-input>
								</nt-form-item>
							</div>
						</div>
						<!-- 用户不认可信息 -->
						<div v-if="model.status == 6">
							<nt-col class="" style="width:890px;border: 1px solid #a3c1fc">
								<div class="  fb  mL30 mT10"><i class="nt-icon-xbn-11 main_color mR5"></i>不认可信息</div>
								<nt-col :span="12" >
									<nt-form-item label="用户建议HS编码：" class="mB0 break ">
										{{model.suggestHsCode}}
									</nt-form-item>
								</nt-col>
								<nt-col :span="12" >
								<nt-form-item label="用户建议其他事项：" class="mB0 break">
									{{model.suggestInfo}}
								</nt-form-item>
								</nt-col>
							</nt-col>
						</div>
					</div>
				</nt-row>
				<!-- 详细信息 -->
				<detail :model="model"></detail>
			</div>
		</nt-form>
	</div>
</template>

<script>
import {checkAjaxData,ajaxDataMumberToString} from '../models/checkAjaxData.js'
import {PageHead } from 'xbn-biz-components';
import detail from './components/cp-detail.vue';
export default {
	data() {
		return {
			deletePopoverShow: true,
			model: {},
			formModel: {
				addedTax: 0,		//增值税税率
				applyElement: '',	//申报要素
				applyName: '',		//报关名称
				hsCode: '',			//HS编码
				id: 0,				//产品ID
				rebateTax: 0,		//出口退税税率
				updateUserName: ''	
			},
			rules: {
                //报关名称
                applyName: [
                    { required: true, message: '此项不能为空', trigger: 'blur' },
                    { min: 0, max: 50, message: '最多 50 个字符', trigger: 'blur' },
                    { type: "string", pattern: /^[a-zA-Z_]+$/, message: '只能包含字母和下划线', trigger: 'blur,change' },
                    { type: 'string',pattern: new RegExp('^((?:(?!(gift|accessory|accessories|part|cloths|tools|toy|stationery)).)*)$') ,message: '有不合法的关键词',trigger: 'blur,change'}
                ],
                //HS编码
                hsCode:
                [
                    { required: true, message: '此项不能为空', trigger: 'blur' },
                    { type: 'string',pattern: new RegExp('^[0-9]{8}$|^[0-9]{10}$|^[0-9]{8}.[0-9]{2}$') ,message: '支持以下三种输入格式12345678、1234567890或12345678.90',trigger: 'blur,change'}
				],
				rebateTax:[
                    { required: true, message: '此项不能为空', trigger: 'blur' },
                    { type: 'string',pattern: new RegExp('^[0-9\.]*$') ,message: '请输入正确的数值',trigger: 'blur,change'},
                    { type: 'string',pattern: new RegExp('^[0-9]{1,3}[\.]{1}[0-9]{1,2}$|^[0-9]{1,3}$') ,message: '整数位最多3位，小数2位',trigger: 'blur,change'}
				],
				addedTax:[
					{ required: true, message: '此项不能为空', trigger: 'blur' },
                    { type: 'string',pattern: new RegExp('^[0-9\.]*$') ,message: '请输入正确的数值',trigger: 'blur,change'},
                    { type: 'string',pattern: new RegExp('^[0-9]{1,3}[\.]{1}[0-9]{1,2}$|^[0-9]{1,3}$') ,message: '整数位最多3位，小数2位',trigger: 'blur,change'}
				]
            },
			applyElement:[]
		}
	},

	mixins: [],

	components: {
		PageHead,
		detail
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
			this.model.applyElement = JSON.parse(this.model.applyElement || []);
			this.formModel.id = this.model.id;
			this.formModel.addedTax = this.model.addedTax;
			this.formModel.applyName = this.model.applyName;
			this.formModel.hsCode = this.model.hsCode;
			this.formModel.rebateTax = this.model.rebateTax;
			this.formModel.applyElement = this.model.applyElement;
		},
		//审核确认Ajax请求
		audit() {
			this.$refs["formModel"].validate(async (valid) => {
				if (valid) {
					let data = Object.assign({},this.formModel);
					data.applyElement = JSON.stringify(this.formModel.applyElement);
					var json = await this.$nt.models.product.auditCommodity(data, this.ctx);
					this.$notify({
						message:this.formModel.status = 6 ? '产品编辑成功':'产品审核成功。',
						type: 'success'
					});
					//经产品确认，直接返回列表
					//this.getDetail(this.model.id);
            		this.$router.back();
				} else {
					this.$notify.error({
						message: '数据效验失败。'
        			});
					return false;
				}
			});
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
</style>
