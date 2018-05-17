<template>
	<div >
		<page-head :title="'退税订单管理'"></page-head>
		<nt-row class="operationBox " style="margin: 0;">
	        <nt-col :span="6" class="f16">
	        	<i to="/taxrefund/list" @click="routeTo('/taxrefund/list')" class="nt-icon nt-icon-arrow-left" style="cursor: pointer;"></i>
				退税订单详情
	        </nt-col>
	        <nt-col :span="18" align="right">
				<span v-if="type === 'confirm'">
					<nt-button type="primary"
						@click="clickAudit(orderInfo)">确认</nt-button>
				</span>
				<span v-else>
					<router-link v-if="orderInfo.status === 1" class="nt-button nt-button--text nt-button--small"
						:to="{ path: '/taxrefund/details/' + orderInfo.id + '/confirm'}">
						<nt-button type="primary">确认</nt-button>
					</router-link>
					<nt-button type="primary" v-if="orderInfo.status === 3" @click="clickRelatedForeignExchange(orderInfo, 'isList')">关联外汇</nt-button>
					<nt-button type="primary" v-if="orderInfo.status === 3" @click="clickConfirmForeignExchange(orderInfo, 'isList')">确认外汇收齐</nt-button>
					<nt-button type="primary" v-if="orderInfo.status === 4"
						@click="clickInputInvoiceInfo(orderInfo, 'isList')">录入发票信息</nt-button>
					<nt-button type="primary" v-if="orderInfo.status === 4"
						@click="clickIsInvestigate(orderInfo.id, 'isList')">是否被函调</nt-button>
					<nt-button type="primary" v-if="orderInfo.status === 5"
						@click="clickIsInvestigateComplete(orderInfo.id, 'isList')">函调是否完成</nt-button>
					<nt-button type="primary" v-if="orderInfo.status === 7"
						@click="clickInputRefundInfo(orderInfo, 'isList')">录入退税信息</nt-button>
					<router-link class="nt-button nt-button--text nt-button--small"
						:to="{ path: '/taxrefund/details/' + orderInfo.id}">
						<nt-button type="primary">详情</nt-button>
					</router-link>
					<nt-button type="primary"
						@click="updateRemark(orderInfo)">备注</nt-button>
				</span>
				<span class="mL10">
					<nt-button type="primary" @click="goBack()">返回</nt-button>
				</span>
	        </nt-col>
	    </nt-row>
		<div class="nt-form contentBox">
			<div class="border_layout competing_infor" v-if="type === 'confirm'">
				<!-- <div class="competing_infor_title fb">处理进度</div> -->
				<div align="center">
					<nt-form :model="confirmData" ref="confirmType" label-width="163px">
			            <nt-form-item label="退税订单类型：" align="left" prop="orderType" :rules="[{type:'number', required: true, message: '此项不能为空', trigger: 'change' }]">
			                <nt-radio-group v-model="confirmData.orderType">
			                    <nt-radio v-for="(item , index) in base.orderTypeStatus" :key="index" :label="item.value">{{item.label}}</nt-radio>
			                </nt-radio-group>
			            </nt-form-item>
			        </nt-form>
				</div>
			</div>
			<div class=" competing_infor">
				<div class="competing_infor_title fb">基本信息</div>
				<div class="competing_infor_xbox" align="center">
					<nt-row :span="24">
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">订单编码：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">{{ orderInfo.taxRefundOrdersCode || '-'}}</nt-col>
						</nt-col>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">关联出口订单：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">
								{{base.taxType && base.taxTypeMap[orderInfo.exchangeEarningsType]}}
							</nt-col>
						</nt-col>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">关联报关订单：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">{{ orderInfo.declarationNumber || '-' }}</nt-col>
						</nt-col>
						<!-- <nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">收汇方式：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">
								{{base.taxType && base.taxTypeMap[orderInfo.exchangeEarningsType]}}
							</nt-col>
						</nt-col>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">报关币种：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">{{ orderInfo.currency || '-' }}</nt-col>
						</nt-col> -->
					</nt-row>
					<!-- <nt-row>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">报关口岸：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">
								{{base.customsPortMap[orderInfo.customsPort]}}
							</nt-col>
						</nt-col>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">装柜方式：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">
								{{ base.cupboardTypeMap[orderInfo.loadCabinetType] }}
							</nt-col>
						</nt-col>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">价格条款：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">
								{{ base.priceProvisionMap[orderInfo.priceTerms] }}
							</nt-col>
						</nt-col>
					</nt-row> -->
					<nt-row>
						<!-- <nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">开票方式：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">
								{{ base.billingTypeMap[orderInfo.billingType]}}
							</nt-col>
						</nt-col>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">委托函：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">
								<nt-button v-if="orderInfo.entrustedLetter" type="text" @click="clickSeeEntrustment(orderInfo)" class="p0 pB3">查看</nt-button>
								<span v-else>-</span>
							</nt-col>
						</nt-col> -->

						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">订单总净重：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">{{ orderInfo.totalNetWeight || '-' }} KG</nt-col>
						</nt-col>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">订单总毛重：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">{{ orderInfo.totalGrossWeight || '-' }} KG</nt-col>
						</nt-col>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">货物总体积：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break"></nt-col>
						</nt-col>
					</nt-row>
					<nt-row>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">订单总价：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">
								{{ orderInfo.totalCommidityValue || '-' }} {{ orderInfo.currency || '-' }}
							</nt-col>
						</nt-col>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">外汇状态：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">
								{{ base.exchangeStatusMap[orderInfo.exchangeStatus] || '-' }}
							</nt-col>
						</nt-col>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">发票状态：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">
								{{ base.invoiceStatusMap[orderInfo.billingStatus] || '-' }}
							</nt-col>
						</nt-col>
					</nt-row>
					<nt-row>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">订单联系人：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">{{ orderInfo.contact || '-' }}</nt-col>
						</nt-col>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">订单状态：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">
								{{ base.orderStatusMap[orderInfo.status] || '-' }}
	                            <nt-tooltip class="item" effect="dark" v-if="orderInfo.status === 12 || orderInfo.status === 13" placement="right">
	                                <i class="nt-icon-xbn-19 main_color"></i>
	                                <div slot="content">
	                                    <span v-if="orderInfo.status === 12" class="block">驳回原因：{{orderInfo.rejectionReason}}</span>
	                                    <span v-if="orderInfo.status === 13" class="block">取消原因：{{orderInfo.cancelReason}}</span>
	                                </div>
	                            </nt-tooltip>
							</nt-col>
						</nt-col>
					</nt-row>
					<!-- <nt-row>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">委托函：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">
								<nt-button v-if="orderInfo.entrustedLetter" type="text" @click="clickSeeEntrustment(orderInfo)">查看</nt-button>
								<span v-else>-</span>
							</nt-col>
						</nt-col>
					</nt-row> -->
				</div>
			</div>
			<div class=" competing_infor mT25" v-if="orderInfo.status >= 6">
				<div class="competing_infor_title fb">报关信息</div>
				<div class="competing_infor_xbox" align="center">
					<nt-row :span="24">
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">报关单号：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">{{ orderInfo.declarationNumber || '-'}}</nt-col>
						</nt-col>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">报关单：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">
								<nt-button v-if="orderInfo.declarations && orderInfo.declarations.length > 0" type="text" class="p0 pB3" @click="seeBills('declarations')">查看</nt-button>
								<span v-else>-</span>
							</nt-col>
						</nt-col>
					</nt-row>
					<nt-table :data="orderInfo.gcfsLinkedDatess" class="dialog_table form-item-text mT25">
						<nt-table-column property="payNo" label="贸易国"></nt-table-column>
						<nt-table-column property="payUser" label="运抵国"></nt-table-column>
						<nt-table-column property="payAccount" label="指运港"></nt-table-column>
						<nt-table-column property="receiptAmount" label="运输工具名称">
							<template slot-scope="scope">
								{{scope.row.receiptAmount}} {{ orderInfo.currency}}
							</template>
						</nt-table-column>
						<nt-table-column property="linkTime" label="航次"></nt-table-column>
						<nt-table-column property="amount" label="提运单号">
							<template slot-scope="scope">
								{{scope.row.amount}} {{ orderInfo.currency}}
							</template>
						</nt-table-column>
						<nt-table-column property="linkTime" label="成交方式"></nt-table-column>
						<nt-table-column property="linkTime" label="包装种类"></nt-table-column>
						<nt-table-column property="linkTime" label="总件数"></nt-table-column>
						<nt-table-column property="linkTime" label="总毛重(公斤)"></nt-table-column>
						<nt-table-column property="linkTime" label="总净重(公斤)"></nt-table-column>
					</nt-table>
				</div>
			</div>
			<div class=" competing_infor mT25">
				<div class="competing_infor_title fb">产品信息</div>
				<div class="competing_infor_main" align="center">
				<nt-form :model="orderInfo" ref="confirmProdcts" label-width="0px">
					<div v-for="(item, index) in orderInfo.products" class="rel">
						<div class="opi">{{item.index}}</div>
						<nt-table :data="[item]" class="dialog_table ">
							<nt-table-column width="58"></nt-table-column>
							<nt-table-column property="productCode" label="产品编号"></nt-table-column>
							<nt-table-column property="merchantSku" label="商家SKU"></nt-table-column>
							<nt-table-column property="productName" label="产品名称"></nt-table-column>
							<nt-table-column property="declareName" label="报关名称(中文/英文)"></nt-table-column>
							<nt-table-column property="brand" label="品牌"></nt-table-column>
							<nt-table-column property="specsModel" label="规格型号"></nt-table-column>
						</nt-table>
						<nt-table :data="[item]" class="dialog_table  form-item-text" style="border-top: 0px">
							<nt-table-column property="hsCode" label=" 海关编码">
								<template slot-scope="scope">
									{{ scope.row.hsCode }}<br />
									<!-- ({{ scope.row.taxRebateRate }}% / {{ scope.row.valueAddedTaxRate }}%) -->
								</template>
							</nt-table-column>
							<nt-table-column width="58"></nt-table-column>
							<nt-table-column property="declarePrice" label="申报价值（USD)"></nt-table-column>
							<nt-table-column property="quantity" label="数量"></nt-table-column>
							<nt-table-column property="totalNetWeight" label="总净重（KG）"></nt-table-column>
							<nt-table-column property="totalGrossWeight" label="总毛重（KG）"></nt-table-column>
							<nt-table-column property="" label="总体积（CBM）"></nt-table-column>
							<nt-table-column property="" label="退税率（%）">
								<template slot-scope="scope">
						            <nt-form-item v-if="type === 'confirm'" label="" align="left" :prop="'products.' + index + '.taxRebateRate'" :rules="[
						                { type: 'string', required: true, message: '此项不能为空', trigger: 'blur'},
						                { validator: isNumberType, message: '只能填写数值', trigger: 'blur' },
						                { validator: rangeDecimal, min:0, max:5, message: '小数点后最多5位', trigger: 'blur,change' },
						                { validator: rangeInteger, min:1, max:3, message: '整数位最多3位', trigger: 'blur,change' },
						                { validator: rangeNumber, min:0, trigger: 'blur' }
						                ]">
						                <!-- <nt-input type="text" class="w80" :rows="8" v-model.number="postData.estimatedCost"></nt-input> -->
						                <currency-input
						                    label=""
						                    fixDecimal="5"
						                    v-model="scope.row.taxRebateRate"
						                  ></currency-input>
						            </nt-form-item>
									<span v-else>{{ scope.row.taxRebateRate }} %</span>
								</template>
							</nt-table-column>
							<nt-table-column property="" label="增值税率（%）">
								<template slot-scope="scope">
									<nt-form-item v-if="type === 'confirm'" label="" align="left" :prop="'products.' + index + '.valueAddedTaxRate'" :rules="[
						                { type: 'string', required: true, message: '此项不能为空', trigger: 'blur'},
						                { validator: isNumberType, message: '只能填写数值', trigger: 'blur' },
						                { validator: rangeDecimal, min:0, max:5, message: '小数点后最多5位', trigger: 'blur,change' },
						                { validator: rangeInteger, min:1, max:3, message: '整数位最多3位', trigger: 'blur,change' },
						                { validator: rangeNumber, min:0, trigger: 'blur' }
						                ]">
						                <!-- <nt-input type="text" class="w80" :rows="8" v-model.number="postData.estimatedCost"></nt-input> -->
						                <currency-input
						                    label=""
						                    fixDecimal="5"
						                    v-model="scope.row.valueAddedTaxRate"
						                  ></currency-input>
						            </nt-form-item>
									<span v-else>{{ scope.row.valueAddedTaxRate }} %</span>
								</template>
							</nt-table-column>
							<nt-table-column property="billingName" label=" 开票厂商"></nt-table-column>
						</nt-table>
					</div>
					<nt-row>
						<nt-col :span="24" class="bg_f5f5f5 pL58">
							<div class="pT24 pB24 tL">
								总产品数量：<span class="main_color mL16 mR32">{{ totalProductObj && totalProductObj.totalQuantity }}</span>
								总价：<span class="main_color mL16 mR32">{{ totalProductObj && totalProductObj.totalCommidityValue}} USD</span>
								总净重：<span class="main_color mL16 mR32">{{ totalProductObj && totalProductObj.totalNetWeight}} KG </span>
								总毛重：<span class="main_color mL16 mR32">{{ totalProductObj && totalProductObj.totalGrossWeight}} KG </span>
								总体积：<span class="main_color mL16 mR32">{{ totalProductObj && totalProductObj.totalGrossWeight}} CBM </span>
							</div>
						</nt-col>
					</nt-row>

				</nt-form>

				</div>
			</div>
			<div class=" competing_infor mT25" v-if="orderInfo.status >= 9">
				<div class="competing_infor_title fb">收汇信息</div>
				<div class="competing_infor_main" align="center">
					<nt-table :data="orderInfo.gcfsLinkedDatess" class="dialog_table form-item-text">
						<nt-table-column width="11"></nt-table-column>
						<nt-table-column property="payNo" label="付汇流水号"></nt-table-column>
						<nt-table-column property="payUser" label="付款人"></nt-table-column>
						<nt-table-column property="payAccount" label="付汇账号"></nt-table-column>
						<nt-table-column property="receiptAmount" label="外汇金额">
							<template slot-scope="scope">
								{{scope.row.receiptAmount}} {{ orderInfo.currency}}
							</template>
						</nt-table-column>
						<nt-table-column property="linkTime" label="关联时间"></nt-table-column>
						<nt-table-column property="amount" label="关联金额">
							<template slot-scope="scope">
								{{scope.row.amount}} {{ orderInfo.currency}}
							</template>
						</nt-table-column>
					</nt-table>
				</div>
			</div>
			<div class=" competing_infor mT25" v-if="orderInfo.status >= 7">
				<div class="competing_infor_title fb">开票资料</div>
				<div class="competing_infor_main" align="center">
					<nt-table :data="orderInfo.invoices" class="dialog_table form-item-text">
						<nt-table-column width="11"></nt-table-column>
						<nt-table-column property="billingPerson" label="开票厂商"></nt-table-column>
						<nt-table-column property="invoiceNumber" label="发票号码"></nt-table-column>
						<nt-table-column property="billingDate" label="开票日期"></nt-table-column>
						<nt-table-column property="productName" label="品名"></nt-table-column>
						<nt-table-column property="productNum" label="数量"></nt-table-column>
						<nt-table-column property="productNum" label="单价"></nt-table-column>
						<nt-table-column property="billingAmount" label="金额">
							<template slot-scope="scope">
								{{scope.row.billingAmount}} CNY
							</template>
						</nt-table-column>
						<nt-table-column property="billingTax" label="税额">
							<template slot-scope="scope">
								{{scope.row.billingTax}} CNY
							</template>
						</nt-table-column>
						<nt-table-column property="receiveInvoiceDate" label="收票日期"></nt-table-column>
						<nt-table-column property="fileUrl" label="开票资料">
							<template slot-scope="scope">
								<nt-button type="text" class="p0" @click="downInvoicesInfo(scope.row)">下载</nt-button>
							</template>
						</nt-table-column>
					</nt-table>
				</div>
			</div>
			<div class="competing_infor mT25">
				<div class="competing_infor_title fb">附件明细及单证信息</div>
				<div class="competing_infor_main" align="center">
					<nt-row :span="24">
						<nt-col :span="4" align="right" class="form-item-text w160">附件：</nt-col>
						<nt-col :span="20" align="left" class="form-item-text break w240">
							<span v-if="!orderInfo.otherFiles || orderInfo.otherFiles.length === 0">-</span>
							<avatar-upload v-else field-url="fileUrl" field-name="originalName" :limit='6' :disabled='true'
								v-model='orderInfo.otherFiles' listType="text" avatarClass='logistics-product'>
							</avatar-upload>
						</nt-col>
					</nt-row>
				</div>
			</div>
			<div class=" competing_infor mT25">
				<div class="competing_infor_title fb">函调厂商</div>
				<div class="competing_infor_main" align="center">
					<nt-row>
						<nt-col :span="4" align="right" class="w160">函调厂商：</nt-col>
						<nt-col :span="20" align="left" class="w620 break">{{orderInfo.xbnRemark || '-'}}</nt-col>
					</nt-row>
				</div>
			</div>
			<div class=" competing_infor mT25">
				<div class="competing_infor_title fb">备注信息</div>
				<div class="competing_infor_main" align="center">
					<nt-row>
						<nt-col :span="4" align="right" class="w160">备注：</nt-col>
						<nt-col :span="20" align="left" class="w620 break">{{orderInfo.xbnRemark || '-'}}</nt-col>
					</nt-row>
				</div>
			</div>
			<div class=" competing_infor mT25">
				<div class="competing_infor_title fb">贸易信息</div>
				<div class="competing_infor_xbox" align="center">
					<nt-row :span="24">
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">预计出货日期：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">{{ orderInfo.expectedShippingDate || '-'}}</nt-col>
						</nt-col>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">境外贸易商：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">{{ orderInfo.overseasTradersName || '-' }}</nt-col>
						</nt-col>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">贸易国：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">{{ orderInfo.tradingCountry || '-' }}</nt-col>
						</nt-col>
					</nt-row>
					<nt-row>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">特殊关系确认：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">
								{{ base.yesOrNoMap[orderInfo.isSpecialRelationship] || '-' }}
							</nt-col>
						</nt-col>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">价格影响确认：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">
								{{ base.yesOrNoMap[orderInfo.isPriceEffectConfirm] || '-' }}
							</nt-col>
						</nt-col>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">支持特许权使用费确认：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">
								{{ base.yesOrNoMap[orderInfo.isPayConcessionUse] || '-' }}
							</nt-col>
						</nt-col>
					</nt-row>
					<nt-row>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">最终目的国：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">{{ orderInfo.destinationCountry || '-' }}</nt-col>
						</nt-col>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">境内货源地：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">{{ orderInfo.domesticSources || '-' }}</nt-col>
						</nt-col>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">合同编号类型：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">
								{{ base.contractNumberTypeMap[orderInfo.contractNoType] || '-' }}
							</nt-col>
						</nt-col>
					</nt-row>
					<nt-row>
						<nt-col :span="8" v-if="orderInfo.contractNoType !== 3">
							<nt-col :span="12" align="right" v-if="orderInfo.contractNoType === 1" class="form-item-text w160">
								指定报关合同号：
							</nt-col>
							<nt-col :span="12" align="right" v-if="orderInfo.contractNoType === 2" class="form-item-text w160">
								商检合同号：
							</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">
								{{ orderInfo.contractNo || '-' }}
							</nt-col>
						</nt-col>
						<nt-col :span="16">
							<nt-col :span="6" align="right" class="form-item-text w160">货物存放地：</nt-col>
							<nt-col :span="18" align="left" class="form-item-text break">
								{{ orderInfo.storageOfGoodsAddress || '-' }}
								{{ orderInfo.storageOfGoodsContact || '-' }}
								{{ orderInfo.storageOfGoodsContactPhone || '-' }}
							</nt-col>
						</nt-col>
					</nt-row>
				</div>
			</div>
			<div class=" competing_infor mT25">
				<div class="competing_infor_title fb">包装信息</div>
				<div class="competing_infor_xbox" align="center">
					<nt-row :span="24">
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">包装方式：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">
								{{ base.packTypeMap[orderInfo.packageType] || '-'}}
							</nt-col>
						</nt-col>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">整体包装种类：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">
								{{ base.packClassMap[orderInfo.overallPackageSpecies] || '-' }}
							</nt-col>
						</nt-col>
						<nt-col :span="8">
							<nt-col :span="12" align="right" class="form-item-text w160">木箱包装说明：</nt-col>
							<nt-col :span="12" align="left" class="form-item-text break">
								{{ base.packExplainMap[orderInfo.woodenPackageDescription] || '-' }}
							</nt-col>
						</nt-col>
					</nt-row>
				</div>
			</div>
		</div>
		<!-- 查看 草单 QP单 弹窗 -->
		<nt-dialog :title="billsUpperInfo.title" ref="billsUpper" :visible.sync="billsUpperInfo.isShow" width="30%" size="tiny">
			<span class="big_mainBig" >
				<avatar-upload field-url="fileUrl" field-name="originalName"
					v-model='billsUpperInfo.list'
					:limit='6'
					:disabled='true'
					listType="picture-card"
					avatarClass='logistics-product'>
				</avatar-upload>
			</span>
			<span slot="footer" class="dialog-footer">
				<nt-button type="primary" @click="downLoadAll" size="small">全部下载</nt-button>
				<nt-button type="primary" @click="billsUpperInfo.isShow = false" size="small">取消</nt-button>
			</span>
		</nt-dialog>
	    <!-- 备注弹出框 -->
	    <UpdateRemarkOrReject ref="updateRemarkDialog"></UpdateRemarkOrReject>
	    <!-- 发货弹出框 -->
	    <!-- <Audit ref="auditDialog"></Audit> -->
	    <!-- 上传报关单证 -->
	    <UploadCustomsDocuments ref="uploadCostom"></UploadCustomsDocuments>
	    <!-- 确认补充信息 -->
	    <ConfirmAddInfo ref="confirmAddInfo"></ConfirmAddInfo>
	    <!-- 录入发票信息 -->
	    <InputInvoiceInfo ref="inputInvoice"></InputInvoiceInfo>
	    <!-- 录入发票信息 -->
	    <InputRefundInfo ref="inputRefund"></InputRefundInfo>
	</div>
</template>

<script>
// import NtRow from "nt-element/src/components/row/src/row";

import merge from 'deepmerge';
import {PageHead, ComboSearch, AvatarUpload} from 'xbn-biz-components';
import {rangeNumber, rangeInteger, rangeDecimal, isNumberType} from 'xbn-biz-validate';
import common from './../models/common.js';
import UpdateRemarkOrReject from './../components/UpdateRemarkOrReject.vue';
// import Audit from './../components/audit.vue';
import UploadCustomsDocuments from './../components/upload-customs-documents.vue';
import ConfirmAddInfo from './../components/confirm-add-info.vue';
import InputInvoiceInfo from './../components/input-invoice-info.vue';
import InputRefundInfo from './../components/input-refund-info.vue';
import currencyInput from './../components/currency-input.vue';
// import NtCol from "nt-element/src/components/col/src/col";

export default {
    components: {
        // TemplateSearchList
        // NtCol,
        // NtRow,
        PageHead,
		currencyInput,
		// ComboSearch,
        UpdateRemarkOrReject,
        // Audit,
        UploadCustomsDocuments,
        ConfirmAddInfo,
        InputInvoiceInfo,
        InputRefundInfo,
		AvatarUpload
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
		// 步骤第几步
	    stepActive() {
			if (this.orderInfo.status === 1) {
		    	return 1;
			} else if (this.orderInfo.status === 2 || this.orderInfo.status === 3 || this.orderInfo.status === 12) {
				return 2;
			} else if (this.orderInfo.status === 13) {
				return -1;
			} else {
				return this.orderInfo.status - 1;
			}
	    },
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
		isNumberType,
		rangeDecimal,
		rangeInteger,
		rangeNumber,
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
				// renderData.data.products.forEach((item, index) => {
				// 	item.index
				// 		= (index + 1).toString().length === 1
				// 		? '0' +  (index + 1)
				// 		: index + 1;
				// });
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

<style lang="less" >

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
