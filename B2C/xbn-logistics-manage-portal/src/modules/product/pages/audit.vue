
<style lang="less">
    .page-product {
        .w350{width:350px;}
        .w540{width:540px;}
        .w200{width:200px;}
        /*.nt-form-item__error { position:inherit; clear: both;}//图片错误提醒莫名隐藏，暂时解决方案*/
        .del_line {
            height: 60px;
            border-left: 1px solid #ccc;
            line-height: 60px;
            margin-top: 30px;
        }
        .xbn-avatar-uploader .nt-upload {
            border-radius: 0;
        }
        .w235{width:235px;}
        .w480{width:480px;}
        .mR16{margin-right: 16px;}
        /*.update_imgbox .nt-upload--picture-card{width:78px;height: 78px; line-height: 78px;}*//*上传图片宽度*!*/
        .mL140{margin-left: 140px;}
        .mB25{margin-bottom: 25px;}
        .mL65{margin-left: 65px;}
		//监管文件列表
		.regulatory-file{
			height:180px;
			.file-item{float: left; width:150px;}
			.file-add {float: left; width:146px;height:146px; border:#bfcdd9 1px solid;}
		}
		//没有标题的表单项
		.nt-form-item-no-label{
			.nt-form-item__content { margin-left: 0!important;}
		}
    }
    .contacts_q .nt-radio+.nt-radio{margin-left: 0;}
</style>


<template>
	<div class="page-product">
		<page-head title="审核产品"></page-head>
		<nt-row class="operationBox " style="margin: 0;">
			<nt-col :span="12" class="f16">
				<i @click="close($event)" class="nt-icon nt-icon-arrow-left" style="cursor: pointer;"></i>审核产品	
			</nt-col>
			<nt-col :span="12" align="right">
				<nt-button type="primary" @click="onAdit('1')" v-if="form.status == commodityStatus.unAudit.value">预审通过</nt-button>
				<nt-button type="primary" @click="onAdit('2')" v-if="form.status == commodityStatus.supplyInformation.value">审核通过</nt-button>
				<nt-button type="primary" @click="rejectDialogVisible = true" v-if="form.status == commodityStatus.supplyInformation.value || form.status == commodityStatus.unAudit.value">驳回</nt-button>
				<nt-button type="primary" @click="close($event)">取消</nt-button>
			</nt-col>
		</nt-row>

		<nt-form ref="form" :model="form" label-width="180px" :rules="rules" class="contentBox">
			<!-- 基本信息 -->
			<div class="border_layout competing_infor">
				<div class="competing_infor_title fb">基本信息</div>
				<div class="competing_infor_main break">
					<nt-form-item label="产品编码：">
						{{form.commodityCode}}
					</nt-form-item>
					<nt-form-item label="商家SKU：" prop="merchantSku">
						<nt-input v-model="form.merchantSku" class="w240" :maxlength="20"></nt-input>
						<nt-tooltip placement="right">
                            <div slot="content">卖家通过该编号即可区分自己的每个单品。</div>
                            <i class="nt-icon-xbn-19 main_color "></i>
                        </nt-tooltip>
					</nt-form-item>
					<nt-form-item label="产品名称：" prop="commodityName">
						<nt-input v-model="form.commodityName" class="w240" :maxlength="80"></nt-input>
					</nt-form-item>
					<nt-form-item label="品牌类型：" prop="brandType">
						<nt-select v-model="form.brandType" placeholder="请选择">
							<nt-option v-for="item in brandTypeEnum.array()" :key="item.value" :label="item.label" :value="item.value"></nt-option>
						</nt-select>
						<nt-tooltip placement="right">
                            <div slot="content">
								<p><span>无品牌、境内自主品牌、境内收购品牌、境外品牌（贴牌生产）、境外品牌（其他）等5类，其中：</span></p>
								<p><span>1.境内自主品牌：指由境内企业自主开发、拥有自主知识产权的品牌；</span></p>
								<p><span>2.境内收购品牌：指境内企业收购的原境外品牌；</span></p>
								<p><span>3.境外品牌（贴牌生产）：指境内企业代工贴牌生产中使用的境外品牌；</span></p>
								<p><span>4.境外品牌（其他）：指除代工贴牌生产以外使用的境外品牌。</span></p>
								<p><span>另外，按照中国海关法管辖范围，“境内”不含港澳台地区。</span></p>
							</div>
                            <i class="nt-icon-xbn-19 main_color "></i>
                        </nt-tooltip>
					</nt-form-item>
					<nt-form-item label="产品品牌：" prop="brand">
						<nt-input v-model="form.brand" class="w240" :maxlength="50"></nt-input>
					</nt-form-item>
					<nt-form-item label="规格型号：" prop="specsModel">
						<nt-input v-model="form.specsModel" class="w240" :maxlength="250"></nt-input>
						<nt-tooltip placement="right">
                            <div slot="content">多种规格型号用英文逗号分隔，比如：蓝色,180,XL。</div>
                            <i class="nt-icon-xbn-19 main_color "></i>
                        </nt-tooltip>
					</nt-form-item>
					<nt-form-item label="产品材质：" prop="material">
						<nt-input v-model="form.material" class="w240" :maxlength="50"></nt-input>
					</nt-form-item>
					<nt-form-item label="产品用途：" prop="purpose">
						<nt-input v-model="form.purpose" class="w240" :maxlength="50"></nt-input>
					</nt-form-item>
					<nt-form-item label="产品连接：" prop="commodityInfoUrl">
						<nt-input v-model="form.commodityInfoUrl" class="w240" :maxlength="1000"></nt-input>
					</nt-form-item>
					<nt-form-item label="申报价值：" prop="applyPrice">
						<nt-input v-model="form.applyPrice" class="w240" :maxlength="50"></nt-input>
					</nt-form-item>
					<nt-form-item label="币制：" prop="applyUnit">
						<nt-select v-model="form.applyUnit" placeholder="请选择">
							<nt-option v-for="item in applyUnitEnum.array()" :key="item.value" :label="item.value+'-'+item.label" :value="item.value"></nt-option>
						</nt-select>
					</nt-form-item>
				</div>
			</div>
			<!-- 图片信息 -->
			<div class=" competing_infor mT25">
				<div class="competing_infor_title fb">图片信息</div>
				<div class="competing_infor_xbox">
					<div class="col_cccccc">仅支持jpg、gif、png三种格式，且图片大小不超过4 MB。每类图片最多上传5张。</div>
					<nt-form-item label="产品外观及配件图：" class="is-required mB0" prop="surfacePhotos">
						<div class="col_cccccc">（不带包装的产品图，如有配件，需提供产品与配件放在一起拍摄的照片或产品与配件单独拍摄的照片。）</div>
						<div>
							<div v-for="index in '01234'" :key="index">
								<avatar-upload v-model="form.surfacePhotos[index]" :action="ctx.servers.imageUpload.options.baseURL" :size="4" :token="ctx.authentication.getToken()" class=" mR16 fL" accept="image/*"></avatar-upload>
							</div>
						</div>
					</nt-form-item>
					<nt-form-item label="产品外包装图：" class=" is-required mB0" prop="packingPhotos">
						<div class="col_cccccc">（带着包装的产品整体照片，可上传多个角度的照片。）</div>
						<span v-for="index in '01234'" :key="index">
							<avatar-upload v-model="form.packingPhotos[index]" :action="ctx.servers.imageUpload.options.baseURL" :size="4" :token="ctx.authentication.getToken()" class="mR16 fL" accept="image/gif,image/jpeg,image/png"></avatar-upload>
						</span>
					</nt-form-item>
					<nt-form-item label="品牌/型号/特殊标识图：" class=" is-required " prop="brandModelPhotos">
						<div class="col_cccccc">（产品包装或产品主体上标有品牌、型号、特殊标识位置的特写照片。）</div>
						<span v-for="index in '01234'" :key="index">
							<avatar-upload v-model="form.brandModelPhotos[index]" :action="ctx.servers.imageUpload.options.baseURL" :size="4" :token="ctx.authentication.getToken()" class="mR16 fL" accept="image/gif,image/jpeg,image/png"></avatar-upload>
						</span>
					</nt-form-item>
				</div>
			</div>
			<!-- 包装信息 -->
			<div class=" competing_infor mT25">
				<div class="competing_infor_title fb">包装信息</div>
				<div class="competing_infor_xbox">
					<nt-form-item label="产品毛重：" prop="grossWeight">
						<nt-input v-model="form.grossWeight" class="w240"></nt-input>
						<span class="mL5 col_cccccc">KG</span>
						<nt-tooltip placement="right">
                            <div slot="content">指包括产品外包装在内的重量。</div>
                            <i class="nt-icon-xbn-19 main_color "></i>
                        </nt-tooltip>
					</nt-form-item>
					<nt-form-item label="产品重量：" prop="netWeight">
						<nt-input v-model="form.netWeight" class="w240"></nt-input>
						<span class="mL5 col_cccccc">KG</span>
					</nt-form-item>
					<nt-form-item label="产品尺寸：" class="is-required">
						<nt-form-item class="inline_block" prop="length">
							<nt-input v-model="form.length" class="w80" placeholder="长"></nt-input>
							<span class="mL5 mR5 col_999">CM&emsp;X</span>
						</nt-form-item>
						<nt-form-item class="inline_block" prop="width">
							<nt-input v-model="form.width" class="w80" placeholder="宽"></nt-input>
							<span class="mL5 mR5 col_999">CM&emsp;X</span>
						</nt-form-item>
						<nt-form-item class="inline_block" prop="height">
							<nt-input v-model="form.height" class="w80" placeholder="高"></nt-input>
						</nt-form-item>
						<span class="mL5 col_cccccc">CM</span>
					</nt-form-item>
					<nt-form-item label="产品体积：" prop="volume">
						<nt-input v-model="form.volume" class="w240"></nt-input>
						<span class="mL5 col_cccccc">CBM</span>
					</nt-form-item>
				</div>
			</div>
			<!-- 报关信息 -->
			<div class="border_layout competing_infor mT25">
				<div class="competing_infor_title fb">报关信息</div>
				<div class="competing_infor_main break">
					<nt-form-item label="报关海关编码：" prop="hsCode">
						<nt-input v-model="form.hsCode" class="w240" :maxlength="15"></nt-input>
						<span class="mL5 col_cccccc">
							<a href="https://hs.e-to-china.com.cn" target="_blank" class="main_color">海关编码查询方法</a>
						</span>
					</nt-form-item>
					<nt-form-item label="中文报关名称：" prop="applyNameZh">
						<nt-input v-model="form.applyNameZh" class="w240" :maxlength="80"></nt-input>
					</nt-form-item>
					<nt-form-item label="英文报关名称：" prop="applyNameCn">
						<nt-input v-model="form.applyNameCn" class="w240" :maxlength="80"></nt-input>
						<nt-tooltip placement="right">
                            <div slot="content">只能由英文字母或下横杠组成，不能包含数字。不能包含以下单词：gift，accessory，accessories，part，cloths，tools，toy，stationery。</div>
                            <i class="nt-icon-xbn-19 main_color "></i>
                        </nt-tooltip>
					</nt-form-item>
					<nt-form-item label="法定第一计量单位：" prop="calculateFirstUnit">
						<nt-input v-model="form.calculateFirstUnit" class="w240" :maxlength="10"></nt-input>
					</nt-form-item>
					<nt-form-item label="法定第二计量单位：" prop="calculateSecondUnit">
						<nt-input v-model="form.calculateSecondUnit" class="w240" :maxlength="10"></nt-input>
					</nt-form-item>
					<nt-form-item label="出口税率：" prop="exportTaxRate">
						<nt-input v-model="form.exportTaxRate" class="w240" :maxlength="10"></nt-input>
					</nt-form-item>
					<nt-form-item label="征减免税方式：" prop="taxFreeType">
						<nt-select v-model="form.taxFreeType" placeholder="请选择">
							<nt-option v-for="item in taxFreeTypeEnum.array()" :key="item.value" :label="item.value+'-'+item.label" :value="item.value"></nt-option>
						</nt-select>
					</nt-form-item>
					<nt-form-item label="是否法检产品：" prop="isLegalCheck">
						
						<!-- <nt-radio disabled v-model="isLegalCheck" :label="1">是</nt-radio>
						<nt-radio disabled v-model="isLegalCheck" :label="0">否</nt-radio> | -->
						<nt-radio-group v-model="form.isLegalCheck">
							<nt-radio label="1">是</nt-radio>
							<nt-radio label="0">否</nt-radio>
						</nt-radio-group>
					</nt-form-item>
					<nt-form-item :label="'申报要素项 ' + (index + 1) + '：'" v-for="(item,index) in form.applyElements" :key="index" :prop="'applyElements.'+index+'.applyElementValue'" :rules="[{ required: true, message: '此项不能为空', trigger: 'blur' }]">
						<nt-input class="w240" v-model="item.applyElementValue" :maxlength="100"></nt-input>
						<nt-button v-if="form.applyElements.length > 1" @click="form.applyElements.splice(index,1)">删除</nt-button>
					</nt-form-item>
					<nt-form-item label="">
						<nt-button @click="addApplyElement">添加申报要素</nt-button>
					</nt-form-item>
				</div>
			</div>
			<!-- 清关信息 -->
			<div class="border_layout competing_infor mT25">
				<div class="competing_infor_title fb">清关信息</div>
				<div class="competing_infor_main break">
					<nt-table ref="multipleTable" :data="form.clearCustoms" tooltip-effect="dark" class="dialog_table">
						<nt-table-column width="11"></nt-table-column>
						<nt-table-column label="最终目的国（地区）" min-width="120">
							<template slot-scope="scope">
								{{ scope.row.destinationCountry }}
							</template>
						</nt-table-column>
						<nt-table-column label="清关海关编码">
							<template slot-scope="scope">
								<nt-form-item label="" class="nt-form-item-no-label" :prop="'clearCustoms.'+scope.$index+'.customHsCode'" :rules="[
											 { type: 'string', pattern: new RegExp('^[0-9]{8}$|^[0-9]{10}$|^([0-9]{8})(\\.{1})([0-9]{2})$'), 
											 message: '支持以下三种输入格式12345678、1234567890或12345678.90', trigger: 'blur,change' }]">
									<nt-input v-model="scope.row.customHsCode" class="w240"></nt-input>
								</nt-form-item>
							</template>
						</nt-table-column>
						<nt-table-column label="关税税率">
							<template slot-scope="scope">
								<nt-form-item label="" class="nt-form-item-no-label" :prop="'clearCustoms.'+scope.$index+'.customTaxRate'" 
								:rules="[{ type: 'string',pattern: new RegExp('^[0-9]{1,3}[\.]{1}[0-9]{1,2}$|^[0-9]{1,3}$') ,message: '整数位最多3位，小数2位',trigger: 'blur'}]">
									<nt-input v-model="scope.row.customTaxRate" class="w240"></nt-input> %
								</nt-form-item>
							</template>
						</nt-table-column>
						<nt-table-column label="VAT/GST税率">
							<template slot-scope="scope">
								<nt-form-item label="" class="nt-form-item-no-label" :prop="'clearCustoms.'+scope.$index+'.vatGstTaxRate'" :rules="[{ type: 'string',pattern: new RegExp('^[0-9]{1,3}[\.]{1}[0-9]{1,2}$|^[0-9]{1,3}$') ,message: '整数位最多3位，小数2位',trigger: 'blur'}]">
									<nt-input v-model="scope.row.vatGstTaxRate" class="w240"></nt-input> %
								</nt-form-item>
							</template>
						</nt-table-column>
					</nt-table>
				</div>
			</div>
			<!-- 监管证件/认证文件信息 -->
			<div class="border_layout competing_infor mT25">
				<div class="competing_infor_title fb">监管证件/认证文件信息</div>
				<div class="competing_infor_main break">
					<nt-form-item label="是否需要上传相关文件：" prop="isUploadFile">
						<nt-radio-group v-model="form.isUploadFile">
							<nt-radio label="1">是</nt-radio>
							<nt-radio label="0">否</nt-radio>
						</nt-radio-group>
					</nt-form-item>
					<div class="col_cccccc">监管证件/认证文件仅支持上传JPG、PNG、PDF、WORD等4种格式，且不超过4MB的文件，每类证件最多上传5个。</div>
					<nt-form-item label="监管证件/认证文件名称：" v-if="form.isUploadFile == '1'">
						<div class="regulatory-file">
							<div class="file-item" v-for="(item,index) in form.regulatoryFiles" :key="index">
								<nt-form-item label="" class="nt-form-item-no-label" :prop="'regulatoryFiles.'+index+'.fileUrl'" :rules="[{ required: true, message: '请上传图片', trigger: 'blur' }]">
									<avatar-upload v-model="item.fileUrl" :action="ctx.servers.imageUpload.options.baseURL" :size="4" :token="ctx.authentication.getToken()" class="mR16 fL" accept="image/*"></avatar-upload>
								</nt-form-item>
								<nt-form-item label="" class="nt-form-item-no-label" :prop="'regulatoryFiles.'+index+'.fileName'" :rules="[{ required: true, message: '此项不能为空', trigger: 'blur' }]">
									<nt-input v-model="item.fileName" class="w120" :maxlength="50"></nt-input>
								</nt-form-item>
							</div>
							<div class="file-add" @click="addFegulatoryFile" v-if="this.form.regulatoryFiles.length<5">+++++</div>
						</div>
					</nt-form-item>
				</div>
			</div>
			<!-- 产品联系人 -->
			<div class=" competing_infor mT25">
				<div class="competing_infor_title fb">产品联系人</div>
				<div class="competing_infor_main rel">
					<nt-form-item label="联系人姓名：" prop="applyName">
						<nt-input v-model="form.contactName" class="w240" :maxlength="60"></nt-input>
					</nt-form-item>
					<nt-form-item label="联系人电话：" prop="contactTel">
						<nt-input v-model="form.contactTel" class="w240" :maxlength="20"></nt-input>
					</nt-form-item>
					<nt-form-item label="联系人邮箱：" prop="contactMail">
						<nt-input v-model="form.contactMail" class="w240" :maxlength="60"></nt-input>
					</nt-form-item>
				</div>
			</div>
			<!-- 备注信息 -->
			<div class=" competing_infor mT25">
				<div class="competing_infor_title fb">备注信息</div>
				<div class="competing_infor_main rel">
					<nt-form-item label="商家备注：" prop="applyName">
						客户备注内容客户备注内容
					</nt-form-item>
					<nt-form-item label="备注：" prop="xbnNote" class="mb_n w600">
						<countable-input type="textarea" v-model="form.xbnNote" :maxlength="250" :total="250" :rows="5"></countable-input>
					</nt-form-item>
				</div>
			</div>
		</nt-form>
        <reject-box :reject-id="form.id" :reject-dialog-visible="rejectDialogVisible" @success="rejectDialogVisible=false;toList()" @cancel="rejectDialogVisible=false;"></reject-box>
	</div>
</template>

<script>
import Enum from '../models/enum.js';
import { AvatarUpload, PageHead, CountableInput } from 'xbn-biz-components';
import validate from '../models/xbn-element-validate.js';
import NtCol from "nt-element/src/components/col/src/col";
import { ajaxDataMumberToString, checkAjaxData } from '../models/checkAjaxData.js';
import rejectBox from './components/reject.vue';
import { commodityStatus } from '../models/status.js';
//form  表单数据单独提取出来，用户再次初始化表单
var formModel = {
	brand: '',//品牌
	commodityCode: '',//产品编码
	customs: [],
	description: '',//介绍
	contactId: '',//联系人ID
	height: '',//高
	id: 0,//id
	isCollection: '0',//是否采集编码
	isSubmit: '',//是否提审
	title: '',
	applyName: '',//报关名称
	hsCode: '',//HS编码
	merchantPhoto: '',//产品图片
	merchantPrice: '',//产品价格
	merchantSku: '',//产品SKU
	specsModel: '',//规格
	status: 0,//产品状态
	weight: '',//重量
	width: '',
	length: '',//长
	grossWeight:'',
	netWeight:'',
	surfacePhotos: [],//外观图片
	packingPhotos: [],//包装图片
	brandModelPhotos: [],//品牌型号图片
	isLegalCheck:'0'
};
export default {
	data() {
		var _this = this;
		//sku异步验证方法
		var validateSKU = async (rule, value, callback) => {
			//当旧SKU不为空(编辑时)跳过验证 
			if (_this.oldSku != '') {
				callback();
			}
			var json = await this.$nt.models.product.checkMerchantSku({ merchantSku: value, }, this.ctx);
			if (json == "YES") {
				callback();
			} else {
				callback(new Error('SKU 已经被占用，请换一个。'));
			};
		}
		return {
			commodityStatus,
			oldSku: '',//旧的SKU，在编辑保存时判断是否改变过
			//ebay商品模型
			ebayCommodityModel: {
				commodityId: 0,
				ebayAccount: '',
				ebayId: 0,
				id: 0,
				itemId: '',
				merchantSku: '',
				siteCode: '',
				specsModel: ''
			},
			form: JSON.parse(JSON.stringify(formModel)),
			rules: {
				//基本信息=------------------------------------------------
				//SKU
				merchantSku: [
					{ required: true, message: '请输入产品SKU', trigger: 'blur' },
					{ min: 0, max: 20, message: '最多 20 个字符', trigger: 'blur' },
					{ type: "string", pattern: /^[a-zA-Z0-9-]+$/, message: '只能包含字母、数字、英文横杠', trigger: 'blur,change' },
					{ validator: validateSKU, trigger: 'blur' }
				],
				//商品标题
				commodityName: [
					{ required: true, message: '请输入产品名称', trigger: 'blur' },
					{ min: 0, max: 80, message: '最多 80 个字符', trigger: 'blur' }
				],
				//品牌类型
				brandType: [
					{ required: true, message: '请选择品牌类型', trigger: 'blur' },
				],
				//品牌
				brand: [
					{ required: true, message: '请输入品牌', trigger: 'blur' },
					{ min: 0, max: 50, message: '最多 50 个字符', trigger: 'blur' }
				],
				//规格型号
				specsModel: [
					{ required: true, message: '请输入规格型号', trigger: 'blur' },
					{ min: 1, max: 250, message: '长度不能大于250个字符', trigger: 'blur' }
				],
				//产品材质
				material: [
					{ required: true, message: '请输入产品材质', trigger: 'blur' },
					{ min: 0, max: 50, message: '最多 50 个字符', trigger: 'blur' }
				],
				//产品用途
				purpose: [
					{ required: true, message: '请输入产品用途', trigger: 'blur' },
					{ min: 0, max: 50, message: '最多 50 个字符', trigger: 'blur' }
				],
				//产品连接
				commodityInfoUrl: [
					{ required: true, message: '请输入产品连接', trigger: 'blur' },
					{ type: 'string', pattern: new RegExp('^http://|^https://'), message: '请输入正确URL', trigger: 'blur,change' },
				],
				//申报价值
				applyPrice: [
					{ required: true, message: '请输入申报价值', trigger: 'blur' },
					{ type: 'string', pattern: new RegExp('^[0-9\.]*$'), message: '请输入正确的数值', trigger: 'blur,change' },
					{ type: 'string', pattern: new RegExp('^[0-9]{1,10}[\.]{1}[0-9]{1,2}$|^[0-9]{1,10}$'), message: '整数位最多10位，小数2位', trigger: 'blur,change' }
				],
				//币制：
				applyUnit: [
					{ required: true, message: '请选择币制', trigger: 'blur' },
				],
				//报关信息-------------------------------------------------------------
				//海关编码
				hsCode: [
					{ required: true, message: '此项不能为空', trigger: 'blur' },
					{ min: 0, max: 15, message: '最多 15 个字符', trigger: 'blur' },
					{ type: 'string', pattern: new RegExp('^[0-9]{8}$|^[0-9]{10}$|^([0-9]{8})(\\.{1})([0-9]{2})$'), message: '支持以下三种输入格式12345678、1234567890或12345678.90', trigger: 'blur,change' }
				],
				//中文报关名称
				applyNameZh: [
					{ required: true, message: '请输入中文报关名称', trigger: 'blur' },
					{ min: 0, max: 80, message: '最多 80 个字符', trigger: 'blur' },
					{ type: "string", pattern: /^[^a-zA-Z]+$/, message: '只能是汉字、数字、符号和空格', trigger: 'blur,change' },
				],
				//英文报关名称
				applyNameCn: [
					{ required: true, message: '请输入英文报关名称', trigger: 'blur' },
					{ min: 0, max: 80, message: '最多 80 个字符', trigger: 'blur' },
					{ type: "string", pattern: /^[a-zA-Z_ ]+$/, message: '只能包含字母、下划线和空格', trigger: 'blur,change' },
					{ type: 'string', pattern: new RegExp('^((?:(?!(gift|accessory|accessories|part|cloths|tools|toy|stationery)).)*)$'), message: '有不合法的关键词', trigger: 'blur,change' }
				],
				//第一计量单位
				calculateFirstUnit: [
					{ required: true, message: '请输入第一计量单位', trigger: 'blur' },
					{ min: 0, max: 10, message: '最多 10 个字符', trigger: 'blur' },
				],
				//法定第二计量单位：
				calculateSecondUnit: [
					{ min: 0, max: 10, message: '最多 10 个字符', trigger: 'blur' },
				],
				//出口税率：
				exportTaxRate: [
					{ required: true, message: '请输入出口税率', trigger: 'blur' },
					{ type: 'string', pattern: new RegExp('^[0-9]{1,3}[\.]{1}[0-9]{1,2}$|^[0-9]{1,3}$'), message: '整数位最多3位，小数2位', trigger: 'blur,change' }
				],
				//征减免税方式：
				taxFreeType: [
					{ required: true, message: '请选择征减免税方式', trigger: 'blur' },
				],
				//是否法检产品：
				isLegalCheck: [
					{ required: true, message: '请选择是否法检产品', trigger: 'blur' },
				],
				//申报要素项
				applyElement: [
					{ required: true, message: '不能为空', trigger: 'blur' },
					{ min: 0, max: 100, message: '最多 100 个字符', trigger: 'blur' },
				],
				//产品图片-----------------------------------------------------------
				//外观及配件图
				surfacePhotos: [
					function (rule, value, callback, source, options) {
						if (value.length > 0) {
							callback();
						} else {
							callback(new Error("至少上传一张图片"));
						}
					}
				],
				//产品外包装图
				packingPhotos: [
					function (rule, value, callback, source, options) {
						if (value.length > 0) {
							callback();
						} else {
							callback(new Error("至少上传一张图片"));
						}
					}
				],
				//品牌/型号/特殊标识图
				brandModelPhotos: [
					function (rule, value, callback, source, options) {
						if (value.length > 0) {
							callback();
						} else {
							callback(new Error("至少上传一张图片"));
						}
					}
				],
				//重量，长，宽，高
				grossWeight: [
					{ required: true, message: '不能为空', trigger: 'blur' },
					{ type: 'string', pattern: new RegExp('^[0-9]{1,4}[\.]{1}[0-9]{1,2}$|^[0-9]{1,4}$'), message: '整数位最多4位，小数2位', trigger: 'blur,change' }
				],
				netWeight: [
					{ required: true, message: '不能为空', trigger: 'blur' },
					{ type: 'string', pattern: new RegExp('^[0-9]{1,4}[\.]{1}[0-9]{1,2}$|^[0-9]{1,4}$'), message: '整数位最多4位，小数2位', trigger: 'blur,change' }
				],
				length: [
					{ required: true, message: '不能为空', trigger: 'blur,change' },
					{ type: 'string', pattern: new RegExp('^[0-9]{1,4}[\.]{1}[0-9]{1,2}$|^[0-9]{1,4}$'), message: '整数位最多4位，小数2位', trigger: 'blur,change' }
				],
				width: [
					{ required: true, message: '不能为空', trigger: 'blur' },
					{ type: 'string', pattern: new RegExp('^[0-9]{1,4}[\.]{1}[0-9]{1,2}$|^[0-9]{1,4}$'), message: '整数位最多4位，小数2位', trigger: 'blur,change' }
				],
				height: [
					{ required: true, message: '不能为空', trigger: 'blur' },
					{ type: 'string', pattern: new RegExp('^[0-9]{1,4}[\.]{1}[0-9]{1,2}$|^[0-9]{1,4}$'), message: '整数位最多4位，小数2位', trigger: 'blur,change' }
				],
				volume: [
					{ required: true, message: '不能为空', trigger: 'blur' },
					{ type: 'string', pattern: new RegExp('^[0-9]{1,6}[\.]{1}[0-9]{1,6}$|^[0-9]{1,6}$'), message: '整数位最多6位，小数6位', trigger: 'blur,change' }
				],
				//监管证件/认证文件信息
				isUploadFile:[
					{ required: true, message: '必须选择', trigger: 'blur' },
				],
				fileName: [
					{ required: true, message: '不能为空', trigger: 'blur' },
				],
				//联系人姓名：
				contactName: [
					{ min: 0, max: 60, message: '最多 60 个字符', trigger: 'blur' }
				],
				//联系人电话：
				contactTel: [
					{ min: 0, max: 20, message: '最多 20 个字符', trigger: 'blur' }
				],
				//联系人邮箱：
				contactMail: [
					{ min: 0, max: 60, message: '最多 60 个字符', trigger: 'blur' },
					{ type: 'string', pattern: new RegExp('^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$'), message: '请输入正确的邮箱', trigger: 'blur,change' }
				],
				//备注
				xbnNote: [
					{ min: 1, max: 250, message: '长度不能大于250个字符', trigger: 'blur,change' }
				]
			},
			commodityId: 0,
			bindingDialogVisible: false,
			isAgain: false,//编辑完成后是否继续添加
			brandTypeEnum: new Enum(),
			applyUnitEnum:new Enum(),//币制枚举
			taxFreeTypeEnum:new Enum(),//征减免方式
			rejectDialogVisible:false,
		}
	},

	mixins: [],
	components: {
		NtCol,
		AvatarUpload,
		PageHead,
		CountableInput,
		rejectBox
	},

	beforeCreate: function () {
	},

	created: async function () {
		//获取初始数据
		await this.getInitData();
		this.getDetail(this.$route.params.id);
		
		//如果是复制
		if (this.$route.query.action == 'copy') {
			var commodityCode = this.form.commodityCode;
			await this.getDetail(this.$route.query.id);
			this.form.commodityCode = commodityCode;
			this.form.merchantSku = '';
			this.oldSku = '';
		}
	},

	methods: {
		//获取初始数据
		async getInitData() {
			this.brandTypeEnum = await this.$nt.models.product.getCommodityBrandTypeEnum({}, this.ctx);
			//获取币制枚举
			var EbayEnumData = await this.$nt.models.product.getEbayEnumData({}, this.ctx);
			this.applyUnitEnum = EbayEnumData.applyUnitEnum;
			this.taxFreeTypeEnum = EbayEnumData.taxFreeTypeEnum;
		},
		//获取产品信息
		async getDetail(id) {
			var data = await this.$nt.models.product.getCommodityInfo({ id }, this.ctx);
			ajaxDataMumberToString(data);

			if(data.isLegalCheck == null || data.isLegalCheck==''){
				data.isLegalCheck = '0';
			}
			this.$set(this,'form',data);
			// this.form = data;
			this.oldSku = this.form.merchantSku;
			//如果申报要素为0，则添加一个默认的
			if (this.form.applyElements.length == 0) {
				this.addApplyElement();
			}
			//如果监管证件个数为0，则添加一个
			if (this.form.isUploadFile == '1' && this.form.regulatoryFiles.length == 0) {
				this.addFegulatoryFile();
			}
		},
		//添加申报要素
		addApplyElement() {
			if(this.form.applyElements.length>=25){
				 this.$alert('申报要素最多添加25个', '提示', {confirmButtonText: '确定'});
				return;
			}
			this.form.applyElements.push({
				applyElement: '',
				applyElementValue: '',
				commodityId: '',
				id: ''
			});
		},
		//添加监管证件
		addFegulatoryFile() {
			this.form.regulatoryFiles.push({
				fileUrl: ''
			});
		},





        /**
         * 提交数据
         * @param [isSubmit] 是否审核
         * @param [isAgain] 是否再次创建
         */
		async onAdit(flag) {
			this.checkImageList();
			this.$refs["form"].validate(async (valid) => {
				if (valid) {
					// //当原有SKU为空(新增) 或者和修改后的不相等时验证
					// if (_this.oldSku == '' || _this.oldSku != _this.form.merchantSku) {
					// 	submit();
					// } else {
						this.form.flag = flag;
						console.log(JSON.stringify(this.form));
						var json = await this.$nt.models.product.auditCommodity(this.form, this.ctx);
						this.$notify.info({
							message: '审核成功。'
						});
						this.toList();
					// }
				} else {
					this.$notify.info({
						message: '验证表单失败，请检查输入数据合法性。'
					});
					return false;
				}
			});
		},
		//驳回
		async reject(){
			var json = await this.$nt.models.product.rejectCommodity(this.form, this.ctx);
			this.$notify.info({
				message: '驳回成功。'
			});
		},



		//到列表
		toList() {
			this.$router.back();
		},

		
		//处理图片列表
		checkImageList() {
			var check = function (imgList) {
				for (var i = imgList.length - 1; i >= 0; i--) {
					if (!imgList[i]) {
						imgList.splice(i, 1);
					}
				}
			}
			check(this.form.surfacePhotos);
			check(this.form.packingPhotos);
			check(this.form.brandModelPhotos);
		},
		async close(e) {
			// if(this.isEdited){
			// 	await this.$popconfirm(event.target, '取消后，您所填写的产品信息将不会被保存。');
			// }
			this.$router.back();
		}
	},
	watch: {
		'form.isUploadFile': function () {
			//如果监管证件个数为0，则添加一个
			if (this.form.isUploadFile == '1' && this.form.regulatoryFiles.length == 0) {
				this.addFegulatoryFile();
			}
			if (this.form.isUploadFile == '0') {
				this.form.regulatoryFiles = [];
			}
		},
		'form.length':function(){
			this.form.volume = (this.form.length * this.form.width * this.form.height /1000000).toFixed(6);
		},
		'form.width':function(){
			this.form.volume = (this.form.length * this.form.width * this.form.height /1000000).toFixed(6);
		},
		'form.height':function(){
			this.form.volume = (this.form.length * this.form.width * this.form.height /1000000).toFixed(6);
		},
		'isLegalCheck':function(a,b){
			console.log('isLegalCheck',','+this.isLegalCheck,','+a,','+b);
		}
	}
}
</script>

