<template>
	<div>
		<!-- 基础信息 -->
		<nt-row class="competing_infor ">
			<div class="competing_infor_title fb">基础信息</div>
			<div class="competing_infor_main fix">
				<nt-row :gutter="24">
					<nt-col :span="8" class="form-item-text break">
						<nt-form-item label="产品编码：">
							{{model.commodityCode}}
						</nt-form-item>
					</nt-col>
					<nt-col :span="8" class="form-item-text">
						<nt-form-item label="商家SKU：">
							{{model.merchantSku}}
						</nt-form-item>
					</nt-col>
					<nt-col :span="8" class="form-item-text break">
						<nt-form-item label="产品名称：">
							{{model.commodityName}}
						</nt-form-item>
					</nt-col>
				</nt-row>
				<nt-row :gutter="24">
					<nt-col :span="8" class="form-item-text break">
						<nt-form-item label="品牌类型：">
							{{brandTypeEnum.get(model.brandType).label}}
						</nt-form-item>
					</nt-col>
					<nt-col :span="8" class="form-item-text">
						<nt-form-item label="产品品牌：">
							{{model.brand}}
						</nt-form-item>
					</nt-col>
					<nt-col :span="8" class="form-item-text break">
						<nt-form-item label="规格型号：">
							{{model.specsModel}}
						</nt-form-item>
					</nt-col>
				</nt-row>

				<nt-row :gutter="24">
					<nt-col :span="8" class="form-item-text break">
						<nt-form-item label="产品材质：">
							{{model.material}}
						</nt-form-item>
					</nt-col>
					<nt-col :span="8" class="form-item-text">
						<nt-form-item label="产品用途：">
							{{model.purpose}}
						</nt-form-item>
					</nt-col>
					<nt-col :span="8" class="form-item-text break">
						<nt-form-item label="产品链接：">
							{{model.commodityInfoUrl}}
						</nt-form-item>
					</nt-col>
				</nt-row>
				<nt-row :gutter="24">
					<nt-col :span="8" class="form-item-text break">
						<nt-form-item label="申报价值：">
							{{model.applyPrice}}
						</nt-form-item>
					</nt-col>
					<nt-col :span="8" class="form-item-text break">
						<nt-form-item label="币制：">
							{{applyUnitEnum.get(model.applyUnit).label}}
						</nt-form-item>
					</nt-col>
					<nt-col :span="8" class="form-item-text break">
						<nt-form-item label="用户名：">
							{{model.cfUserName}}
						</nt-form-item>
					</nt-col>
				</nt-row>
				<nt-row :gutter="24">
					<nt-col :span="8" class="form-item-text">
						<nt-form-item label="状态：">
							{{commodityStatus.get(model.status).label}}
						</nt-form-item>
					</nt-col>
					<nt-col :span="8" class="form-item-text break">
						<nt-form-item label="">
							&nbsp;
						</nt-form-item>
					</nt-col>
					<nt-col :span="8" class="form-item-text break">
						<nt-form-item label="">
							&nbsp;
						</nt-form-item>
					</nt-col>
				</nt-row>

			</div>
			<!-- 在审核通过时显示 -->
			<!-- <div v-if="model.status == 4">
				<div class="competing_infor_title fb">申报要素</div>
				<div class="competing_infor_main ">
					<nt-form-item :label="item.label+'：'" v-for="(item,index) in model.applyElement" :key="index">
						{{item.value}}
					</nt-form-item>
				</div>
			</div> -->
		</nt-row>
		<!-- 图片信息 -->
		<nt-row class="competing_infor mT25">
			<div class="competing_infor_title fb">图片信息</div>
			<div class="competing_infor_xbox fix">
				<nt-form-item label="产品外观及配件图：" class=" mB0">
					<span class="imgbox_width ">
						<nt-popover placement="right" trigger="click" popper-class="__nt-popover" v-for="(url,index) in model.surfacePhotos" :key="index">
							<img v-bind:src="url" style="max-width:350px;max-height:350px;" />
							<img slot="reference" :src="url" width="78" height="78" class="border_outer mR16" />
						</nt-popover>
					</span>
					<div class=" col_cccccc">不带外包装的产品图，如有配件，需提供产品与配件放在一起拍摄的照片或产品与配件单独拍摄的照片</div>
				</nt-form-item>
				<nt-form-item label="产品外包装图：" class="mB0 ">
					<span class="imgbox_width">
						<nt-popover placement="right" trigger="click" popper-class="__nt-popover" v-for="(url,index) in model.packingPhotos" :key="index">
							<img v-bind:src="url" style="max-width:350px;max-height:350px;" />
							<img slot="reference" :src="url" width="78" height="78" class="border_outer mR16" />
						</nt-popover>
					</span>
					<div class=" col_cccccc">带着外包装的产品整体照片，可上传多个角度的照片</div>
				</nt-form-item>
				<nt-form-item label="品牌/型号/特殊标识图：" class="mB0 ">
					<span class="imgbox_width">
						<nt-popover placement="right" trigger="click" popper-class="__nt-popover" v-for="(url,index) in model.brandModelPhotos" :key="index">
							<img v-bind:src="url" style="max-width:350px;max-height:350px;" />
							<img slot="reference" :src="url" width="78" height="78" class="border_outer mR16" />
						</nt-popover>
					</span>
					<div class=" col_ccc">产品外包装或产品主体上标有品牌、型号位置的特写照片</div>
				</nt-form-item>
			</div>
		</nt-row>
		<!-- 包装信息 -->
		<nt-row class="competing_infor mT25">
			<div class="competing_infor_title fb">包装信息</div>
			<div class="competing_infor_xbox fix">
				<nt-row :gutter="24">
					<nt-col :span="8" class="form-item-text">
						<nt-form-item label="产品毛重：">
							{{model.grossWeight}} KG
						</nt-form-item>
					</nt-col>
					<nt-col :span="8" class="form-item-text">
						<nt-form-item label="产品净重：">
							{{model.netWeight}} KG
						</nt-form-item>
					</nt-col>
					<nt-col :span="8" class="form-item-text">
						<nt-form-item label="产品尺寸：">
							{{model.length}}cm × {{model.width}}cm × {{model.height}}cm
						</nt-form-item>
					</nt-col>
				</nt-row>
				<nt-row :gutter="24">
					<nt-col :span="8" class="form-item-text">
						<nt-form-item label="产品体积：">
							{{model.volume}} CBM
						</nt-form-item>
					</nt-col>
					<nt-col :span="8" class="form-item-text">
						<nt-form-item label="">
							&nbsp;
						</nt-form-item>
					</nt-col>
					<nt-col :span="8" class="form-item-text">
						<nt-form-item label="">
							&nbsp;
						</nt-form-item>
					</nt-col>
				</nt-row>
			</div>
		</nt-row>
		<!-- 报关信息 -->
		<nt-row class="competing_infor mT25">
			<div class="competing_infor_title fb">报关信息</div>
			<div class="competing_infor_main fix">
				<nt-row :gutter="24">
					<nt-col :span="8" class="form-item-text">
						<nt-form-item label="中文报关名称：">
							{{model.applyNameZh}}
						</nt-form-item>
					</nt-col>
					<nt-col :span="8" class="form-item-text">
						<nt-form-item label="英文报关名称：">
							{{model.applyNameCn}}
						</nt-form-item>
					</nt-col>
				</nt-row>
			</div>
		</nt-row>
		<!-- 清关信息 -->
		<nt-row class="competing_infor mT25">
			<div class="competing_infor_title fb">清关信息？</div>
			<div class="competing_infor_main fix">
				<nt-table ref="multipleTable" :data="model.clearCustoms" tooltip-effect="dark" class="dialog_table">
					<nt-table-column width="11"></nt-table-column>
					<nt-table-column label="最终目的国（地区）" min-width="120">
						<template slot-scope="scope">
							{{ scope.row.destinationCountry }}
						</template>
					</nt-table-column>
					<nt-table-column label="清关海关编码">
						<template slot-scope="scope">
							{{ scope.row.customHsCode }}</template>
					</nt-table-column>
					<nt-table-column label="关税税率">
						<template slot-scope="scope">
							{{ scope.row.customTaxRate }} %
						</template>
					</nt-table-column>
					<nt-table-column label="VAT/GST税率">
						<template slot-scope="scope">
							{{ scope.row.vatGstTaxRate }} %
						</template>
					</nt-table-column>
				</nt-table>
			</div>
		</nt-row>
		<!-- 产品联系人 -->
		<nt-row class="competing_infor mT25">
			<div class="competing_infor_title fb">产品联系人</div>
			<div class="competing_infor_main fix">
				<nt-col :span="8" class="form-item-text break">
					<nt-form-item label="产品联系人：">
						{{model.contactName}}
					</nt-form-item>
				</nt-col>
				<nt-col :span="8" class="form-item-text break">
					<nt-form-item label="联系电话：">
						{{model.contactTel}}
					</nt-form-item>
				</nt-col>
				<nt-col :span="8" class="form-item-text break">
					<nt-form-item label="联系邮箱：">
						{{model.contactMail}}
					</nt-form-item>
				</nt-col>

			</div>
		</nt-row>
		<!-- eBay关联商品 -->
		<!-- <nt-row class="competing_infor mT25" v-if="model.relationshipEbays.length > 0">
			<div class="competing_infor_title fb">eBay关联商品</div>
			<div class="competing_infor_main fix">
				<nt-table ref="multipleTable" :data="model.relationshipEbays" tooltip-effect="dark" class="dialog_table">
					<nt-table-column width="11"></nt-table-column>
					<nt-table-column label="ItemID" min-width="120">
						<template scope="scope">
							{{ scope.row.itemId }}
						</template>
					</nt-table-column>
					<nt-table-column label="eBay SKU">
						<template scope="scope">
							{{ scope.row.merchantSku }}</template>
					</nt-table-column>
					<nt-table-column label="eBay账号">
						<template scope="scope">
							{{ scope.row.ebayAccount }}
						</template>
					</nt-table-column>
					<nt-table-column label="站点">
						<template scope="scope">
							{{ scope.row.siteCode }}
						</template>
					</nt-table-column>
				</nt-table>

			</div>
		</nt-row> -->
		<!-- 备注信息 -->
		<nt-row class="competing_infor mT25">
			<div class="competing_infor_title fb">备注信息</div>
			<div class="competing_infor_main fix w620 break mL92">
				<nt-form-item label="商家备注：">
					{{contactInfo.userNote}}
				</nt-form-item>
				<nt-form-item label="小笨鸟备注：">
					{{contactInfo.xbnNote}}
				</nt-form-item>
			</div>
		</nt-row>
	</div>
</template>

<script>
import Enum from '../../models/enum.js';
import { commodityStatus } from '../../models/status.js';
export default {
	props: ['model'],
	data() {
		return {
			commodityStatus,
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
		this.getContactInfo(this.model.contactId);
	},
	created: async function () {
		//获取初始数据
		await this.init();
	},
	methods: {
		async init() {
			this.brandTypeEnum = await this.$nt.models.product.getCommodityBrandTypeEnum({}, this.ctx);
			//获取币制枚举
			this.EbayEnumData = await this.$nt.models.product.getEbayEnumData({}, this.ctx);
			this.applyUnitEnum = this.EbayEnumData.applyUnitEnum;
		},
		async getContactInfo(contactId) {
			if (contactId) {
				this.contactInfo = await this.$nt.models.product.getContactInfo({ contactId: this.model.contactId }, this.ctx);
			}
		}
	},
	watch: {
		'model': function () {
			this.getContactInfo(this.model.contactId);
		}
	}
}
</script>
<style lang="less">
	.imgbox_width_h{width:490px;height: 80px; display: block;}
	.mL92{margin-left: 92px;}
	.mR16{margin-right: 16px;}
</style>
