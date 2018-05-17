<template>
	<div >
		<page-head title="CF订单"></page-head>
		<nt-row class="operationBox " style="margin: 0;">
	        <nt-col :span="6" class="f16">
	        	<i to="/taxrefund/list" @click="routeTo('/taxrefund/list')" class="nt-icon nt-icon-arrow-left" style="cursor: pointer;"></i>
				CF订单详情
	        </nt-col>
	        <nt-col :span="18" align="right">
				<nt-button type="primary" @click="goBack()">返回</nt-button>
	        </nt-col>
	    </nt-row>
		<div class="nt-form contentBox">
			<div class=" competing_infor">
				<div class="competing_infor_title fb">基本信息</div>
				<div class="competing_infor_xbox" align="center">
					<nt-row :span="24">
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">CF订单号：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">{{ orderInfo.cfOrderCode || '-'}}</nt-col>
						</nt-col>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">卖家名称：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">{{ orderInfo.sellerName || '-'}}</nt-col>
						</nt-col>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">用户名：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">{{ orderInfo.userName || '-' }}</nt-col>
						</nt-col>
					</nt-row>
					<nt-row>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">手机号：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">{{ orderInfo.phoneNum || '-' }}</nt-col>
						</nt-col>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">集货仓库：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">
								{{ orderInfo.warehouseId || '-' }}
							</nt-col>
						</nt-col>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">目的国家：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">{{ orderInfo.destinationCountry || '-' }}</nt-col>
						</nt-col>
					</nt-row>
					<nt-row>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">目的省/洲：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">
								{{ orderInfo.destinationProvinceState || '-' }}
							</nt-col>
						</nt-col>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">目的城市：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">
								{{ orderInfo.destinationCity || '-' }}
							</nt-col>
						</nt-col>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">目的详细地址：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">
								{{ orderInfo.destinationAddr || '-' }}
							</nt-col>
						</nt-col>
					</nt-row>
					<nt-row>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">是否自抬头：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">{{ orderInfo.headUpState || '-' }}</nt-col>
						</nt-col>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">是否退税：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">
								<!-- {{ base.orderStatusMap[orderInfo.taxRefundState] || '-' }} -->
								{{ orderInfo.taxRefundState || '-' }}
							</nt-col>
						</nt-col>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">是否结汇：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">{{ orderInfo.exchangeState || '-' }}</nt-col>
						</nt-col>
					</nt-row>
					<nt-row>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">是否保险：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">
								{{ orderInfo.insuranceState || '-' }}
							</nt-col>
						</nt-col>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">币制：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">
								{{ orderInfo.currency || '-' }}
							</nt-col>
						</nt-col>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">创建时间：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">
								{{ orderInfo.createTime || '-' }}
							</nt-col>
						</nt-col>
					</nt-row>
				</div>
			</div>
			<div class=" competing_infor mT25">
				<div class="competing_infor_title fb">物流信息</div>
				<div class="competing_infor_xbox" align="center">
					<nt-row :span="24">
						<nt-col :span="4" align="right" class="form-item-text w160">物流计划编号：</nt-col>
						<nt-col :span="4" align="left" class="form-item-text break">{{ orderInfo.logisticsPlanCode || '-'}}</nt-col>
						<nt-col :span="4" align="right" class="form-item-text w160">运输方式：</nt-col>
						<nt-col :span="4" align="left" class="form-item-text break">{{ orderInfo.transportType }}</nt-col>
						<nt-col :span="4" align="right" class="form-item-text w160">起运港：</nt-col>
						<nt-col :span="4" align="left" class="form-item-text break">{{ orderInfo.startPort || '-' }}</nt-col>
					</nt-row>
					<nt-row>
						<nt-col :span="4" align="right" class="form-item-text w160">目的港：</nt-col>
						<nt-col :span="4" align="left" class="form-item-text break">{{ orderInfo.destintionPort || '-' }}</nt-col>
						<nt-col :span="4" align="right" class="form-item-text w160">船期：</nt-col>
						<nt-col :span="4" align="left" class="form-item-text break">{{ orderInfo.shipPeriod || '-' }}</nt-col>
					</nt-row>
				</div>
			</div>
			<div class=" competing_infor mT25">
				<div class="competing_infor_title fb">产品及包装信息</div>
				<div class="competing_infor_main" align="center">
					<nt-table :data="orderInfo.boxes" class="dialog_table form-item-text">
						<nt-table-column type="expand" width="17">
					    	<template slot-scope="props">
								<nt-table :data="props.row.boxProducts" stripe :show-header="false" width="640" align="right">
								    <nt-table-column prop="merchantSku" label="商家SKU" width="100"></nt-table-column>
								    <nt-table-column prop="" label="中英文报关名称/规格" width="200">
										<template slot-scope="scope">
											{{ scope.row.customNameChinese }} {{ scope.row.customNameEnglish }} / {{ scope.row.specsModel }}
										</template>
								    </nt-table-column>
								    <nt-table-column prop="applyPrice" label="申报价值" width="80">
										<template slot-scope="scope">
											{{ scope.row.applyPrice }} {{ orderInfo.currency }}
										</template>
								    </nt-table-column>
								    <nt-table-column prop="totalApplyPrice" label="申报总金额" width="100">
										<template slot-scope="scope">
											{{ scope.row.totalApplyPrice }} {{ orderInfo.currency }}
										</template>
									</nt-table-column>
								    <nt-table-column prop="singleBoxProductNum" label="单箱数量" width="80"></nt-table-column>
								    <nt-table-column prop="totalProductNum" label="总数量" width="80"></nt-table-column>
								</nt-table>
					    	</template>
					    </nt-table-column>
						<nt-table-column property="boxNo" label="序号"></nt-table-column>
						<nt-table-column property="packageType" label="包装类型"></nt-table-column>
						<nt-table-column property="boxLength" label="长(CM)"></nt-table-column>
						<nt-table-column property="boxWight" label="宽(CM)"></nt-table-column>
						<nt-table-column property="boxHeight" label="高(CM)"></nt-table-column>
						<nt-table-column property="boxNum" label="箱数"></nt-table-column>
						<nt-table-column property="boxWeight" label="重量(KG)"></nt-table-column>
						<nt-table-column property="boxVolume" label="体积(CBM)"></nt-table-column>
						<nt-table-column property="" label="商家SKU" width="100"></nt-table-column>
						<nt-table-column property="" label="中英文报关名称/规格" width="200"></nt-table-column>
						<nt-table-column property="" label="申报价值" width="80"></nt-table-column>
						<nt-table-column property="" label="申报总金额" width="100"></nt-table-column>
						<nt-table-column property="" label="单箱数量" width="80"></nt-table-column>
						<nt-table-column property="" label="总数量" width="80"></nt-table-column>
					</nt-table>
					<nt-table :data="orderInfo.totalTable" stripe :show-header="false" align="right">
						<nt-table-column property="boxNo" label="序号" width="17"></nt-table-column>
						<nt-table-column prop="" label="">
							<template slot-scope="scope">
								<b>合计：</b>
							</template>
						</nt-table-column>
						<nt-table-column property="packageType" label="包装类型"></nt-table-column>
						<nt-table-column property="boxLength" label="长(CM)"></nt-table-column>
						<nt-table-column property="boxWight" label="宽(CM)"></nt-table-column>
						<nt-table-column property="boxHeight" label="高(CM)"></nt-table-column>
						<nt-table-column property="boxNum" label="箱数"></nt-table-column>
						<nt-table-column property="boxWeight" label="重量(KG)"></nt-table-column>
						<nt-table-column property="boxVolume" label="体积(CBM)"></nt-table-column>
						<nt-table-column prop="sKUNum" label="商家SKU" width="100"></nt-table-column>
						<nt-table-column prop="" label="中英文报关名称/规格" width="200"></nt-table-column>
						<nt-table-column prop="applyPrice" label="申报价值" width="80"></nt-table-column>
						<nt-table-column prop="totalApplyPrice" label="申报总金额" width="100">
							<template slot-scope="scope">
								{{ scope.row.totalApplyPrice }} {{ orderInfo.currency }}
							</template>
						</nt-table-column>
						<nt-table-column prop="" label="" width="80"></nt-table-column>
						<nt-table-column prop="totalProductNum" label="总数量" width="80"></nt-table-column>
					</nt-table>
				</div>
			</div>
			<div class=" competing_infor mT25">
				<div class="competing_infor_title fb">关联单据信息</div>
				<div class="competing_infor_main" align="center">
					<nt-row>
						<nt-col :span="4" align="right" class="w160">关联装箱计划：</nt-col>
						<nt-col :span="8" align="left" class="break">{{orderInfo.baoOrdersCode || '-'}}</nt-col>
						<nt-col :span="4" align="right" class="w160">关联报关订单：</nt-col>
						<nt-col :span="8" align="left" class="break">{{orderInfo.customOrdersCode || '-'}}</nt-col>
					</nt-row>
					<nt-row>
						<nt-col :span="4" align="right" class="w160">关联退税订单：</nt-col>
						<nt-col :span="8" align="left" class="break">{{orderInfo.taxRefundOrdersCode || '-'}}</nt-col>
					</nt-row>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// import NtRow from "nt-element/src/components/row/src/row";

import merge from 'deepmerge';
import {PageHead, ComboSearch, AvatarUpload} from 'xbn-biz-components';
// import {rangeNumber, rangeInteger, rangeDecimal, isNumberType} from 'xbn-biz-validate';
import common from './../models/common.js';
// import UpdateRemarkOrReject from './../components/UpdateRemarkOrReject.vue';
// import UploadCustomsDocuments from './../components/upload-customs-documents.vue';
// import ConfirmAddInfo from './../components/confirm-add-info.vue';
// import InputInvoiceInfo from './../components/input-invoice-info.vue';
// import InputRefundInfo from './../components/input-refund-info.vue';
// import currencyInput from './../components/currency-input.vue';
export default {
    components: {
        // TemplateSearchList
        PageHead,
		// currencyInput,
        // UpdateRemarkOrReject,
        // UploadCustomsDocuments,
        // ConfirmAddInfo,
        // InputInvoiceInfo,
        // InputRefundInfo,
		// AvatarUpload
    },
	mixins: [common],
    data() {
        return {
			orderInfo: {
				status: '',
				invoices: {},
				invoicesInfo:[]
			},
			base: {
				customsPortMap: {},
				orderStatusMap: {},
				exchangeStatusMap: {},
				invoiceStatusMap: {},
				cupboardTypeMap: {},
				priceProvisionMap: {},
				billingTypeMap: {},
				contractNumberTypeMap: {},
				packTypeMap: {},
				packClassMap: {},
				packExplainMap: {},
				yesOrNoMap: {}
			},
            orderInfoRelation:{
                exchangeStatus:null
            },
            param:{
                payNo:null,
                currency: null,
                id:null
            },
            activeName:"first",
			billsUpperInfo: {
				isShow: false,
				title: '',
				type: '',
				declarationsAll: {},
				qpDocumentsAll: {},
				list: []
			},
			confirmData: {},
			type: ''
        }
    },
	computed: {
		totalProductObj() {
			let totalQuantity = 0;
			let totalCommidityValue = 0;
			let totalGrossWeight = 0;
			let totalNetWeight = 0;
			if (this.orderInfo.products) {
				for (let pro of this.orderInfo.products) {
					totalQuantity += pro.quantity;
					totalCommidityValue += pro.totalCommidityValue;
					totalGrossWeight += pro.totalGrossWeight;
					totalNetWeight += pro.totalNetWeight;
				}
			}
			return {
				totalQuantity,
				totalCommidityValue,
				totalGrossWeight,
				totalNetWeight
			};
		}
	},
    methods: {
		// isNumberType,
		// rangeDecimal,
		// rangeInteger,
		// rangeNumber,
        callbackFun(info,callback,existence){
            // if(Number(info.statusCode) === data.data.data.statusCode){
                callback ? callback(info):'';
                existence ? "":this.init();
            // }
        },
		// 审核
		async clickAudit() {
			let isPost = true;
			this.$refs.confirmType.validate(async (valid) => {
				if (!valid) {
					isPost = false;
				} else {
					this.$refs.confirmProdcts.validate(async (valid) => {
						if (!valid) {
							isPost = false;
						}
					});
				}
			});
			if (isPost) {
			    let params = {
					id: this.orderInfo.id,
					confirmData: this.confirmData,
					products: this.orderInfo.products
				};
				let renderData = await this.$nt.models.taxrefund.getInfo(params);
			}
		},
        // 下载开票信息
		downInvoicesInfo(item) {
			this.ctx.client.postFrom(this.ctx.servers.default.options.baseURL + '/gcfsFileController/downloadFile', {
				fileUrl: item.fileUrl,
				originalName: item.originalName
			}, {
				token: this.ctx.authentication.getToken()
			});
		},
        // 下载全部
		downLoadAll() {
			debugger;
			if (this.$nt.isEmpty(this.billsUpperInfo[this.billsUpperInfo.type + 'All'])) {
				this.$message({
					message: '数据出现错误 请您联系和您对接的客服人员！',
					type: 'warning'
				});
				return;
			}
            this.ctx.client.postFrom(this.ctx.servers.default.options.baseURL + '/gcfsFileController/downloadFile', {
				fileUrl: this.billsUpperInfo[this.billsUpperInfo.type + 'All'].fileUrl,
				originalName: this.billsUpperInfo[this.billsUpperInfo.type + 'All'].originalName
			}, {
				token: this.ctx.authentication.getToken()
			});
		},
        // 查看
		seeBills(type) {
			// this.billsUpperInfo.list = this.orderInfo[type].split(',');
			// this.billsUpperInfo.list = this.billsUpperInfo.list.map((item) => {
			// 	return {url: item}
			// });
			this.billsUpperInfo.list = this.orderInfo[type];
			this.billsUpperInfo.type = type;
			this.billsUpperInfo.title = type === 'declarations' ? '报关单' : 'QP单';
			this.billsUpperInfo.isShow = true;
		},
        // 刷新
        refreshPage() {
            this.$router.go(0);
        },
		// 页面初始化方法
		async init() {
			this.type =  this.$route.params.type;
			let id = this.$route.params.id;
			// 获取收货预报基础信息
			try {
				let renderData = await this.$nt.models.taxrefund.getInfo({id: id});
				// 初始化报关单，清关文件，QP单
				// 草单
				renderData.data.declarations = [];
				// QP单
				renderData.data.qpDocuments = [];
				// 附件
				renderData.data.otherFiles = [];
                // 开票信息 数据整合
				renderData.data.invoicesInfo = [];
				// for (let item of renderData.data.annexFiles) {
				// 	// 通过businessType判断附件类型，根据退税订单枚举接口58
				// 	if (item.businessType === 6) {
				// 		// 委托函
				// 		if (item.fileType === '.pdf') {
                //             // pdf格式，查看用
				// 			renderData.data.entrustedLetter = item.fileUrl;
				// 		}
				// 		// else {
                //         //     // word格式，下载用  后台不用下载功能
				// 		// 	// renderData.data.entrustedLetter = item.fileUrl;
				// 		// }
				// 	} else if (item.businessType === 4) {
				// 		// 草单
				// 		renderData.data.declarations.push(item);
				// 	} else if (item.businessType === 5) {
				// 		// QP单附件明细及单证信息
				// 		renderData.data.qpDocuments.push(item);
				// 	} else if (item.businessType === 8) {
				// 		// 后台用不到，不处理    // 报关资料（包括报关草单和QP单）.zip文件，下载用
				// 		// this.billsUpperInfo['declarationsAll'] = item;
				// 	} else if (item.businessType === 9) {
				// 		// 报关草单 全部下载
				// 		this.billsUpperInfo['declarationsAll'] = item;
				// 	} else if (item.businessType === 10) {
				// 		// QP单 全部下载
				// 		this.billsUpperInfo['qpDocumentsAll'] = item;
				// 	} else if (item.businessType === 11) {
				// 		// 开票模板 .zip文件下载用
				// 		// this.billsUpperInfo['qpDocumentsAll'] = item;
				// 		renderData.data.invoicesInfo.push({
				// 			billingAmount: renderData.data.billingAmount,
				// 			billingPerson: renderData.data.billingPerson,
				// 			fileUrl: item.fileUrl,
				// 			originalName: item.originalName,
				// 			createTime: item.createTime
				// 		})
				// 	} else {
				// 		renderData.data.otherFiles.push(item);
				// 	}
				// 	// item.name = item.originalName;
				// 	// item.url = item.fileUrl;
				// }
                // 初始化标号
				renderData.data.totalTable = [];
				let temp0 = {
					boxNum: 0,
					boxWeight: 0,
					boxVolume: 0,
					sKUNum: 0,
					totalApplyPrice: 0,
					totalProductNum: 0
				};
				renderData.data.boxes.forEach((item, index) => {
					temp0.boxNum += item.boxNum;
					temp0.boxWeight += item.boxWeight;
					temp0.boxVolume += item.boxVolume;
					item.boxProducts.forEach((jtem, j) => {
						temp0.totalApplyPrice += jtem.totalApplyPrice;
						temp0.totalProductNum += jtem.totalProductNum;
					});
				});
				temp0.sKUNum = renderData.data.totalSku;
				renderData.data.totalTable.push(temp0);
                // 初始化 开票日期
				// renderData.data.invoices.forEach((item, index) => {
				// 	item.billingDate = item.billingDate.split(' ')[0];
				// })
				this.orderInfo = renderData.data;
			} catch (err) {
			   //交给框架处理的异常
			   this.ctx.onerror(err);
		    }
		}
    },
	async created () {
        // 组件创建完后获取数据，
		let base = await this.initBaseDictionary();
		this.base = base;
		this.init();
    },
	mounted() {
    },
	watch: {
		'$route' (to, from) {
			// 对路由变化作出响应...
			if (to.matched[0].path === from.matched[0].path) {
				// this.$router.go(0);
				this.$route.params.id = to.params.id;
				this.$route.params.type = to.params.type;
				this.init();
			}
		}
	}
}
</script>

<style lang="less" type="text/css">

	.box_line{
		border: 1px solid #dfe3ec;
	}
	.step {
		padding: 70px 20% 70px 7%;
		text-align: center;
	}
	.img {
		border: 1px solid #dfe3ec;
		width: 80px;
		height: 80px;
	}
	.inlineBlock {
		display: inline-block;
	}
	.form-item-text{margin-bottom: 16px;}
	.w160{width:160px;}
	.triangle-topleft {
		width: 0;
		height: 0;
		border-top: 100px solid #f3f3f4;
		border-right: 100px solid transparent;/*左上角三角形*/
	}
	.case_number{
		position: absolute;
		top:-90px;
		left:12px;
		color:#9fa1a2;
	}/*箱号的定位*/
	.col_9fa1a2{color:#9fa1a2;}
	.w32{width:32px;}
	.w620{width:620px;}
	.mT15{margin-top: 15px;}
	.border_dashed{border-top:1px dashed #dfe3ec;}
	.mB24{margin-bottom: 24px;}
	.mL239{margin-left: 239px;}
	.f48{font-size:48px;}
	.pB24{padding-bottom:24px;}
	.box_Ntline{border-top:none;}
	.pR40{padding-right:40px;}
	.pB16{padding-bottom:16px;}
	.pT24a {padding: 24px 0;}
	.boxListDiv .border_dashed:first-child { border-top: none; padding-top: 0;}
	.bg_f5f5f5{background: #f5f5f5;}
	.pT24{padding-top:24px;}
	.pB24{paddding-bottom:24px;}
	.mR32{margin-right: 32px;}
	.pL58{padding-left: 58px;}
	.mB16{margin-bottom: 16px;}
	.opi{width:25px;
		height: 32px;
		position: absolute;
		top:0;
		left: 0;
		z-index: 2;
		color: #fff;
	}
	.p0{padding:0px;}
	.pB3{padding-bottom:3px;}
	.big_mainBig{
		max-height: 320px;
		overflow-x: hidden;
		overflow-y: auto;
		display: block;}
</style>
