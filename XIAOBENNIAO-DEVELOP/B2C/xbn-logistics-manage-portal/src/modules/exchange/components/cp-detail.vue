<template>
	<div>
				<!-- 基础信息 -->
				<nt-row class="border_layout competing_infor mT25">
					<div class="competing_infor_title fb">基础信息</div>
					<div class="competing_infor_main fix">
						<nt-row :gutter="24" >
							<nt-col :span="8" class="form-item-text break">
								<nt-form-item label="商品编码：">
									{{model.commodityCode}}
								</nt-form-item>
							</nt-col>
							<nt-col :span="8" class="form-item-text break">
								<nt-form-item label="商品名称：">
									{{model.title}}
								</nt-form-item>
							</nt-col>
							<nt-col :span="8" class="form-item-text">
								<nt-form-item label="商品SKU：">
									{{model.merchantSku}}
								</nt-form-item>
							</nt-col>
						</nt-row>
						<nt-row :gutter="24" >
							<nt-col :span="8" class="form-item-text break">
								<nt-form-item label="规格型号：">
									{{model.specsModel}}
								</nt-form-item>
							</nt-col>
							<nt-col :span="8" class="form-item-text break">
								<nt-form-item label="采集序列号：">
									{{model.isCollection==1?'是':'否'}}
								</nt-form-item>
							</nt-col>
							<nt-col :span="8" class="form-item-text">
								<nt-form-item label="商品品牌：">
									{{model.brand}}
								</nt-form-item>
							</nt-col>
						</nt-row>
						<nt-row :gutter="24" >
							<nt-col :span="8" class="form-item-text break">
								<nt-form-item label="报关名称：">
									{{model.title}}
								</nt-form-item>
							</nt-col>
							<nt-col :span="8" class="form-item-text break">
								<nt-form-item label="海关编码：">
									{{model.isCollection==1?'是':'否'}}
								</nt-form-item>
							</nt-col>
							<nt-col :span="8" class="form-item-text">
							</nt-col>
						</nt-row>

					</div>
				</nt-row>
				<!-- 图片信息 -->
				<nt-row class="competing_infor mT25">
					<div class="competing_infor_title fb">图片信息</div>
					<div class="competing_infor_xbox fix">
						<nt-form-item label="产品外观及配件图：" class="fix update_ximg ">
                        <div class="mL8 col_ccc">支持文件上传格式:  jpg、gif、png , 大小不超过4 MB     (不带外包装的产品图，如有配件，需提供产品与配件放在一起拍摄的照片或产品与配件单独拍摄的照片)</div>
                        <div class="mT5">
                            <img v-for="(url,index) in model.surfacePhotos" :key="index" :src="url" style="max-whdith:100px;max-height:100px;" />
                        </div>
                    </nt-form-item>
                     <nt-form-item label="产品外包装图：" class="fix update_ximg ">
                        <div class="mL8 col_ccc">支持文件上传格式: jpg、gif、png , 大小不超过4 MB   （带着外包装的产品整体照片，可上传多个角度的照片）</div>
                        <div class="mT5">
                            <img v-for="(url,index) in model.packingPhotos" :key="index" :src="url" style="max-whdith:100px;max-height:100px;" />
                        </div>
                    </nt-form-item>
                     <nt-form-item label="品牌/型号图：" class="fix update_ximg ">
                        <div class="mL8 col_ccc">支持文件上传格式: jpg、gif、png , 大小不超过4 MB   （产品外包装或产品主体上标有品牌、型号位置的特写照片）</div>
                        <div class="mT5">
                            <img v-for="(url,index) in model.brandModelPhotos" :key="index" :src="url" style="max-whdith:100px;max-height:100px;" />
                        </div>
                    </nt-form-item>
					</div>
				</nt-row>
				<!-- 包装信息 -->
				<nt-row class="competing_infor mT25">
					<div class="competing_infor_title fb">包装信息</div>
					<div class="competing_infor_xbox fix">
						<nt-col :span="8" class="form-item-text">
							<nt-form-item label="商品重量：">
								{{model.weight}} KG
							</nt-form-item>
						</nt-col>
						<nt-col :span="8" class="form-item-text">
							<nt-form-item label="商品尺寸：">
								{{model.length}}cm × {{model.width}}cm × {{model.height}}cm
							</nt-form-item>
						</nt-col>
					</div>
				</nt-row>
				<!-- 产品联系人 -->
            	<nt-row class="competing_infor mT25">
                    <div class="competing_infor_title fb">产品联系人</div>
                    <div class="competing_infor_main fix">
						产品联系人：{{contactInfo.contactName}} 联系电话：{{contactInfo.contactMobile}} 联系邮箱：{{contactInfo.contactEmail}}
                    </div>
                </nt-row>
				<!-- eBay关联商品 -->
				<nt-row class="competing_infor mT25" v-if="model.relationshipEbays.length > 0">
					<div class="competing_infor_title fb">eBay关联商品</div>
					<div class="competing_infor_main fix">
						<nt-table ref="multipleTable" :data="model.relationshipEbays" tooltip-effect="dark"  class="dialog_table">
							<nt-table-column label="ItemID" min-width="120" align="center">
								<template scope="scope">
									{{ scope.row.itemId }}
								</template>
							</nt-table-column>
							<nt-table-column label="eBay SKU" align="center">
								<template scope="scope">
									{{ scope.row.merchantSku }}</template>
							</nt-table-column>
							<nt-table-column label="eBay账号" align="center">
								<template scope="scope">
									{{ scope.row.ebayAccount }}
								</template>
							</nt-table-column>
							<nt-table-column label="站点" align="center">
								<template scope="scope">
									{{ scope.row.siteCode }}
								</template>
							</nt-table-column>
						</nt-table>

					</div>
				</nt-row>
				<!-- 备注信息 -->
				<nt-row class="competing_infor mT25">
					<div class="competing_infor_title fb">备注信息</div>
					<div class="competing_infor_main fix w620">
						备注： {{model.description}}
					</div>
				</nt-row>
	</div>
</template>

<script>

export default {
	props:['model'],
	data() {
		return {
			contactInfo:{}
		}
	},
	mixins: [],

	components: {
	},
	beforeCreate: function() {
	},
	mounted: async function() {
		//获取联系人信息
		this.getContactInfo(this.model.contactId);
	},
	methods: {
		async getContactInfo(contactId){
			if(contactId){
				this.contactInfo = await this.$nt.models.product.getContactInfo({ contactId :this.model.contactId }, this.ctx);
			}
		}
	},
	watch:{
		'model':function(){
			this.getContactInfo(this.model.contactId);
		}
	}
}
</script>
<style lang="less">
</style>
