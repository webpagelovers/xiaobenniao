<style lang="less">
    .mT25 {
        margin-top: 25px;
    }

    .competing_infor_main {
        padding: 30px;
    }

    .w450 {
        width: 450px;
    }

    .w490 {
        width: 490px;
    }

    .h175 {
        height: 175px;
    }

    .mR15 {
        margin-right: 15px;
    }

    .mR30 {
        margin-right: 30px;
    }

    .ver-top {
        vertical-align: top;
    }

    .mL40 {
        margin-left: 40px;
    }

    .mL70 {
        margin-left: 70px;
    }

    .min_width {
        min-width: 160px;
    }
</style>

<template>
    <div class="plan-list-container">
        <page-head :title="'开票厂商管理'"></page-head>
        <nt-dialog title="审核通过" :visible.sync="dialogPassVisible" size="tiny" :close-on-click-modal="false">
            <nt-form :model="auditPassData" ref="auditPassData">
                <nt-form-item prop="billingCompanyStatus" class="mL70">
                    <nt-radio-group v-model="auditPassData.billingCompanyStatus">
                        <nt-radio label="4">审核通过</nt-radio>
                        <nt-radio label="5">临时审核通过</nt-radio>
                        <nt-radio label="3">待补充资料</nt-radio>
                    </nt-radio-group>
                </nt-form-item>
                <nt-form-item style="margin-top: -18px;margin-bottom: 12px;height: 20px;"
                              v-if="billingCompanyStatusVisible === true">
                    <div class="nt-form-item__error">开票厂商状态不能为空</div>
                </nt-form-item>
                <nt-form-item label="合同编号:" v-if="auditPassData.billingCompanyStatus != 3">
                    <nt-input v-model="auditPassData.contractNumber" :maxlength="30" class="w370"></nt-input>
                </nt-form-item>
            </nt-form>
            <div slot="footer" class="dialog-footer">
                <nt-button type="primary" size="small" @click="handleAuditPass">确 定</nt-button>
                <nt-button type="primary" size="small" @click="dialogPassVisible = false">取 消</nt-button>

            </div>
        </nt-dialog>
        <nt-dialog title="驳回重填" :visible.sync="dialogRejectVisible" size="tiny" :close-on-click-modal="false">
            <nt-form :model="rejectCommodityData">
                <nt-form-item label="驳回原因">
                    <nt-input type="textarea"  :maxlength="300" placeholder="最多300个字符"
                              v-model="rejectCommodityData.rejectedReason" @change="handleRejChange"></nt-input>
                    <i class="textarea_counter">{{remainder}}/300</i>
                </nt-form-item>
            </nt-form>
            <div slot="footer" class="dialog-footer">
                <nt-button type="primary" size="small" @click="handleRejectSubmit">确 定</nt-button>
                <nt-button type="primary" size="small" @click="dialogRejectVisible = false">取 消</nt-button>

            </div>
        </nt-dialog>
        <nt-dialog title="函调" :visible.sync="dialogLetterVisible" size="tiny" :close-on-click-modal="false">
            <nt-form :model="letterData">
                <nt-form-item class="mL40">
                    <nt-radio-group v-model="letterData.letterStatus" @change="handleLetterChange">
                        <nt-radio-group v-model="letterData.letterStatus" @change="handleLetterChange">
                            <nt-radio v-for="item in letterDataOptions" :label="item.id" :key="item.id">
                                {{item.name}}
                            </nt-radio>
                        </nt-radio-group>
                    </nt-radio-group>
                </nt-form-item>
                <nt-form-item label="备注:">
                    <nt-input class="w450 " type="textarea" :maxlength="2000" placeholder="最多2000个字符"
                              @change="handleLetChange"
                              v-model="letterData.letterContent"></nt-input>
                    <i class="textarea_counter">{{letterRemainder}}/2000</i>
                </nt-form-item>
            </nt-form>
            <div slot="footer" class="dialog-footer">
                <nt-button type="primary" :disabled="letterDisabled" @click="handleLetterSubmit" size="small">保存
                </nt-button>
                <nt-button type="primary" size="small" @click="dialogLetterVisible = false">取 消</nt-button>

            </div>
        </nt-dialog>
        <nt-dialog title="升级" :visible.sync="dialogIncreaseVisible" size="tiny" :close-on-click-modal="false">
            <div>

                <span>确定从临时审核通过升级为审核通过？</span>
                <p class="col_cccccc">操作不可逆</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <nt-button type="primary" size="small" @click="handleIncreaseSubmit">确 定</nt-button>
                <nt-button type="primary" size="small" @click="dialogIncreaseVisible = false">取 消</nt-button>

            </div>
        </nt-dialog>
        <nt-dialog title="管理合同" :visible.sync="dialogContractVisible" size="large" :close-on-click-modal="false">
            <nt-table :data="contractList" class="dialog_table" max-height="250">
                <nt-table-column width="11"></nt-table-column>
                <nt-table-column prop="contractNumber" label="合同编号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div v-model="scope.row.showEdit">
                                    <span v-if="!scope.row.showEdit">
                                           {{cutMoreChat(scope.row.contractNumber, 30)}}
                                    </span>
                            <nt-form :model="scope.row" v-if="scope.row.showEdit">
                                <nt-form-item>
                                    <nt-input v-model="scope.row.contractNumber"
                                              :maxlength="30"
                                              icon="close"
                                              :on-icon-click="handleIconClick(scope.row, 'contractNumber')"
                                              class="w160"></nt-input>
                                </nt-form-item>
                                <nt-form-item v-if="scope.row.contractNumber === ''"
                                              style="margin-top: -12px;margin-bottom: 0;height: 20px;">
                                    <div class="nt-form-item__error ">合同编号不能为空</div>
                                </nt-form-item>
                            </nt-form>
                        </div>
                    </template>
                </nt-table-column>
                <nt-table-column prop="lastUpdateTime" label="最后一次操作时间"></nt-table-column>
                <nt-table-column prop="lastUpdateUser" label="操作人"></nt-table-column>
                <nt-table-column label="操作">
                    <template slot-scope="scope">
                        <nt-button type="text" size="small" v-if="!scope.row.showEdit"
                                   @click="handleEdit(scope.$index,scope.row)">编辑
                        </nt-button>
                        <nt-button type="text" size="small" v-if="scope.row.showEdit"
                                   @click="handleSave(scope.$index,scope.row)">保存
                        </nt-button>
                        <nt-button type="text" size="small" v-if="scope.row.showEdit"
                                   @click="scope.row.showEdit = false">取消
                        </nt-button>
                        <nt-button type="text" size="small" v-if="!scope.row.showEdit"
                                   @click="handleDeleteContract(scope.row.id)">删除
                        </nt-button>
                    </template>
                </nt-table-column>
            </nt-table>
            <nt-form :model="addContract" ref="addContract" v-if="addContractVisible === true" class="mT25">
                <nt-form-item>
                    <nt-input v-model="addContract.contractNumber" @change="handleAddContractChange"
                              :maxlength="30"
                              icon="close"
                              :on-icon-click="handleIconClick(addContract, 'contractNumber')"
                              class="w240"></nt-input>
                    <span class="mL16">
                                    <nt-button type="text" size="small" @click="handleAddContractSubmit">保存</nt-button>
                                    <nt-button type="text" size="small" @click="handleCallOffClick">取消</nt-button>
                                </span>
                </nt-form-item>
                <!------------------------------------------------------------------------------>
                <nt-form-item style="margin-top: -12px;margin-bottom: 0px;height: 20px;"
                              v-if="contractNumberErrorVisible === true">
                    <div class="nt-form-item__error">合同编号不能为空</div>
                </nt-form-item>
                <!------------------------------------------------------------------------------>
            </nt-form>
            <nt-button type="text" class="mT16" @click="handleContractButtonClick"
                       v-if="addContractVisible === false">
                <i class="nt-icon-xbn-28 main_color mR10"></i>新增合同
            </nt-button>
            <div slot="footer" class="dialog-footer">
                <nt-button @click="dialogContractVisible = false" type="primary" size="small">关闭</nt-button>

            </div>
        </nt-dialog>
        <nt-dialog :title="dialogBigImgTitle" :visible.sync="dialogBigImgVisible" size="tiny"
                   :close-on-click-modal="false">
            <img :src="dialogBigImgSrc" alt="" style="width: 100%;height: 100%;max-width: 100%;max-height: 100%;">
        </nt-dialog>

        <nt-row class="operationBox " style="margin: 0;">
            <nt-col :span="4" class="f16">
                <i class="nt-icon nt-icon-arrow-left curpointer" @click="jumpList"></i>
                <span>开票厂商详情</span>
            </nt-col>
            <nt-col :span="20" style="text-align: right;">
                <nt-button type="primary" @click="handlePassButtonClick" v-if="form.billingCompanyStatus === 2">审核通过
                </nt-button>
                <nt-button type="primary" @click="handleRejectButtonClick" v-if="form.billingCompanyStatus === 2">驳回
                </nt-button>
                <nt-button type="primary" @click="handleLetterButtonClick"
                           v-if="form.billingCompanyStatus === 4 || form.billingCompanyStatus === 5">函调
                </nt-button>
                <nt-button type="primary" @click="handleIncreaseButtonClick" v-if="form.billingCompanyStatus === 5">
                    升级
                </nt-button>
                <nt-button type="primary" @click="handleContractClick"
                           v-if="form.billingCompanyStatus === 4 || form.billingCompanyStatus === 5">管理合同
                </nt-button>
                <nt-button type="primary" @click="jumpList">返回</nt-button>
            </nt-col>
        </nt-row>
        <nt-form label-width="165px">
            <div class="contentBox">
                <nt-row class="border_layout competing_infor ">
                    <div class="competing_infor_title fb">开票厂商公司基本信息</div>
                    <div class="competing_infor_main fix">
                        <nt-row :span="24">
                            <nt-col :span="8" class="form-item-text break">
                                <nt-form-item label="开票厂商公司名称：">
                                    {{form.billingCompanyName}}
                                </nt-form-item>
                            </nt-col>
                            <nt-col :span="8" class="form-item-text break">
                                <nt-form-item label="统一社会信用代码：">
                                    {{form.uniformSocialCreditCode}}
                                </nt-form-item>
                            </nt-col>
                            <nt-col :span="8" class="form-item-text break">
                                <nt-form-item label="一般纳税人认定时间：">
                                    {{form.generalTaxpayerDetermineTime}}
                                </nt-form-item>
                            </nt-col>
                        </nt-row>
                        <nt-row :span="24">
                            <nt-col :span="8" class="form-item-text break">
                                <nt-form-item label="开票厂商地址：">
                                    {{form.companyAddress}}
                                </nt-form-item>
                            </nt-col>
                            <nt-col :span="8" class="form-item-text break">
                                <nt-form-item label="境内货源地：">
                                    {{form.domesticGoodsAddress}}
                                </nt-form-item>
                            </nt-col>
                            <nt-col :span="8" class="form-item-text break">
                                <nt-form-item label="开票厂商增值税率：">
                                    <span v-if="form.vatRate === 0">17%</span>
                                    <span v-if="form.vatRate === 1">11%</span>
                                </nt-form-item>
                            </nt-col>
                        </nt-row>
                        <nt-row :span="24">
                            <nt-col :span="8" class="form-item-text break">
                                <nt-form-item label="出口权：">
                                    <span v-if="form.exportRights === 0">无</span>
                                    <span v-if="form.exportRights === 1">有</span>
                                </nt-form-item>
                            </nt-col>
                            <nt-col :span="8" class="form-item-text break" v-if="form.customeRegistrationCode">
                                <nt-form-item label="海关注册登记编码：">
                                    {{form.customeRegistrationCode}}
                                </nt-form-item>
                            </nt-col>
                        </nt-row>
                    </div>
                </nt-row>
                <nt-row class="competing_infor mT25">
                    <div class="competing_infor_title fb">证照信息</div>
                    <div class="competing_infor_main fix">
                        <div class="log_main">
                            <!--
                            1 税务登记证照副本
                            2 营业执照照片
                            3 一般纳税人认定书照片
                            4 进行发票照片
                            5 厂牌照片
                            6 生产线照片
                            7 厂房租赁合同（或房产证）
                            8 纳税申报表
                            9 纳税信用等级
                            10 仓库照片
                            11 其他
                            -->
                            <div class="mT20">
                                <div class="inline_block ver-top mR30 min_width">
                                    <p><span style="color: #fe5655;margin-right: 4px;">*</span>税务登记副本</p>
                                    <div v-if="form.imgPath1">
                                        <img :src="form.imgPath1"
                                             @click="handleSmallImgClick({businessType: 1, fileUrl: form.imgPath1})"
                                             width="78" height="78"
                                             class="mT16 border_outer"
                                             alt="">
                                    </div>
                                </div>
                                <div class="inline_block ver-top mR30 min_width">
                                    <p><span style="color: #fe5655;margin-right: 4px;">*</span>营业执照</p>
                                    <div v-if="form.imgPath2">
                                        <img :src="form.imgPath2"
                                             @click="handleSmallImgClick({businessType: 2, fileUrl: form.imgPath2})"
                                             width="78" height="78"
                                             class="mT16 border_outer"
                                             alt="">
                                    </div>
                                </div>
                                <div class="inline_block ver-top mR30 min_width">
                                    <p><span style="color: #fe5655;margin-right: 4px;">*</span>一般纳税人认定书</p>
                                    <div v-if="form.imgPath3">
                                        <img :src="form.imgPath3"
                                             @click="handleSmallImgClick({businessType: 3, fileUrl: form.imgPath3})"
                                             width="78" height="78"
                                             class="mT16 border_outer"
                                             alt="">
                                    </div>
                                </div>
                            </div>
                            <div class="mT20">
                                <div class="inline_block ver-top mR30 min_width" v-if="form.imgPath4[0]">
                                    <p>进项发票</p>
                                    <div class="w490" v-if="form.imgPath4">
                                        <span v-for="item in form.imgPath4" class="mR15">
                                            <img :src="item.url"
                                                 @click="handleSmallImgClick({businessType: 4, fileUrl: item.url})"
                                                 width="78" height="78"
                                                 class="mT16 border_outer"
                                                 alt="">
                                        </span>
                                    </div>
                                </div>
                                <div class="inline_block ver-top mR30 min_width">
                                    <p><span style="color: #fe5655;margin-right: 4px;">*</span>厂牌照片
                                    </p>
                                    <div class="w490" v-if="form.imgPath5">
                                        <span v-for="item in form.imgPath5" class="mR15">
                                            <img :src="item.url"
                                                 @click="handleSmallImgClick({businessType: 5, fileUrl: item.url})"
                                                 width="78" height="78"
                                                 class="mT16 border_outer"
                                                 alt="">
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="mT20">
                                <div class="inline_block ver-top mR30 min_width">
                                    <p><span style="color: #fe5655;margin-right: 4px;">*</span>生产线照片</p>
                                    <div class="w490" v-if="form.imgPath6">
                                        <span v-for="item in form.imgPath6" class="mR15">
                                            <img :src="item.url"
                                                 @click="handleSmallImgClick({businessType: 6, fileUrl: item.url})"
                                                 width="78" height="78"
                                                 class="mT16 border_outer"
                                                 alt="">
                                        </span>
                                    </div>
                                </div>
                                <div class="inline_block ver-top mR30 min_width" v-if="form.imgPath7[0]">
                                    <p>厂房租赁合同(或房产证)
                                    </p>
                                    <div class="w490" v-if="form.imgPath7">
                                        <span v-for="item in form.imgPath7" class="mR15">
                                            <img :src="item.url"
                                                 @click="handleSmallImgClick({businessType: 7, fileUrl: item.url})"
                                                 width="78" height="78"
                                                 class="mT16 border_outer"
                                                 alt="">
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="mT20">
                                <div class="inline_block ver-top mR30 min_width" v-if="form.imgPath8[0]">
                                    <p>纳税申报表</p>
                                    <div class="w490" v-if="form.imgPath8">
                                        <span v-for="item in form.imgPath8" class="mR15">
                                            <img :src="item.url"
                                                 @click="handleSmallImgClick({businessType: 8, fileUrl: item.url})"
                                                 width="78" height="78"
                                                 class="mT16 border_outer"
                                                 alt="">
                                        </span>
                                    </div>
                                </div>
                                <div class="inline_block ver-top mR30 min_width" v-if="form.imgPath9[0]">
                                    <p>纳税信用等级</p>
                                    <div class="w490" v-if="form.imgPath9">
                                        <span v-for="item in form.imgPath9" class="mR15">
                                            <img :src="item.url"
                                                 @click="handleSmallImgClick({businessType: 9, fileUrl: item.url})"
                                                 width="78" height="78"
                                                 class="mT16 border_outer"
                                                 alt="">
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="mT20">
                                <div class="inline_block ver-top mR30 min_width" v-if="form.imgPath10[0]">
                                    <p>仓库照片</p>
                                    <div class="w490" v-if="form.imgPath10">
                                        <span v-for="item in form.imgPath10" class="mR15">
                                            <img :src="item.url"
                                                 @click="handleSmallImgClick({businessType: 10, fileUrl: item.url})"
                                                 width="78" height="78"
                                                 class="mT16 border_outer"
                                                 alt="">
                                        </span>
                                    </div>
                                </div>
                                <div class="inline_block ver-top mR30 min_width" v-if="form.imgPath11[0]">
                                    <p>其他</p>
                                    <div class="w490" v-if="form.imgPath11">
                                        <span v-for="item in form.imgPath11" class="mR15">
                                            <img :src="item.url"
                                                 @click="handleSmallImgClick({businessType: 11, fileUrl: item.url})"
                                                 width="78" height="78"
                                                 class="mT16 border_outer"
                                                 alt="">
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </nt-row>
                <nt-row class="competing_infor mT25">
                    <div class="competing_infor_title fb">开票厂商产品</div>
                    <div class="competing_infor_main fix">
                        <nt-table :data="form.gcfsCommodityList" class="dialog_table">
                            <nt-table-column width="11"></nt-table-column>
                            <nt-table-column prop="title" label="产品名称"></nt-table-column>
                            <nt-table-column prop="commodityCode" label="产品编码"></nt-table-column>
                            <nt-table-column prop="hsCode" label="海关编码"></nt-table-column>
                            <nt-table-column prop="merchantSku" label="商家SKU"></nt-table-column>
                            <nt-table-column prop="specsModel" label="规格型号"></nt-table-column>
                            <nt-table-column prop="brand" label="品牌"></nt-table-column>
                            <nt-table-column prop="status" label="产品状态">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.status === 2">审核中</span>
                                    <span v-if="scope.row.status === 3">待补充资料</span>
                                    <span v-if="scope.row.status === 4">审核通过</span>
                                    <span v-if="scope.row.status === 5">临时审核通过</span>
                                    <span v-if="scope.row.status === 6">审核驳回</span>
                                </template>
                            </nt-table-column>
                        </nt-table>
                    </div>
                </nt-row>
                <nt-row class="competing_infor mT25">
                    <div class="competing_infor_title fb">函调信息</div>
                    <div class="competing_infor_xbox fix">
                        <nt-col :span="24" class="form-item-text">
                            <nt-form-item label="状态：" label-width="50">
                                <span v-if="!form.letterStatus">无</span>
                                <span v-if="form.letterStatus === 2">待发函</span>
                                <span v-if="form.letterStatus === 3">待回函</span>
                                <span v-if="form.letterStatus === 4">转审核</span>
                                <span v-if="form.letterStatus === 5">已完成</span>
                            </nt-form-item>
                        </nt-col>
                        <nt-col :span="24" class="form-item-text">
                            <nt-form-item label="备注：" label-width="50">
                                <span class="w620 break block lh22" v-if="!form.letterContent">无</span>
                                <span class="w620 break block lh22" v-else>{{form.letterContent}}</span>
                            </nt-form-item>
                        </nt-col>
                    </div>
                </nt-row>
                <nt-row class="competing_infor mT25">
                    <div class="competing_infor_title fb">合同信息</div>
                    <div class="competing_infor_main fix">
                        <nt-table :data="contractList" class="dialog_table">
                            <nt-table-column width="11"></nt-table-column>
                            <nt-table-column prop="contractNumber" label="合同编号"></nt-table-column>
                            <nt-table-column prop="lastUpdateTime" label="最后一次操作时间"></nt-table-column>
                            <nt-table-column prop="lastUpdateUser" label="操作人"></nt-table-column>
                        </nt-table>
                    </div>
                </nt-row>
            </div>
        </nt-form>
    </div>
</template>

<script>
    import {PageHead} from 'xbn-biz-components';
    import commonMixin from '../common.js';
    import NtRow from "nt-element/src/components/row/src/row";

    export default {
        mixins: [commonMixin],
        components: {
            NtRow,
            PageHead
        },
        data() {
            return {
                id: this.$route.query['id'],
                form: {
                    billingCompanyName: null,
                    uniformSocialCreditCode: null,
                    generalTaxpayerDetermineTime: null,
                    companyAddress: null,
                    domesticGoodsAddress: null,
                    vatRate: null,
                    exportRights: null,
                    customeRegistrationCode: null,
                    imgPath1: null,
                    imgPath2: null,
                    imgPath3: null,
                    imgPath4: [],
                    imgPath5: [],
                    imgPath6: [],
                    imgPath7: [],
                    imgPath8: [],
                    imgPath9: [],
                    imgPath10: [],
                    imgPath11: [],
                    gcfsCommodityList: [],
                    letterStatus: null,
                    letterContent: null,
                    billingCompanyStatus: null
                },
                //大图
                dialogBigImgVisible: false,
                dialogBigImgTitle: '',
                dialogBigImgSrc: '',
                businessTypeOption: ['税务登记副本',
                    '营业执照',
                    '一般纳税人认定书',
                    '进行发票',
                    '厂牌照片',
                    '生产线照片',
                    '厂房租赁合同（或房产证）',
                    '纳税申报表',
                    '纳税信用等级',
                    '仓库照片',
                    '其他']
            };
        },

        created: async function () {
            const id = this.id;
            const getInfo = await this.ctx.models.billing.getInfo(id);
            const getInfoData = getInfo.data;
            const fileList = getInfo.data.fileList;
            this.form = {
                billingCompanyName: getInfoData.billingCompanyName,
                uniformSocialCreditCode: getInfoData.uniformSocialCreditCode,
                generalTaxpayerDetermineTime: getInfoData.generalTaxpayerDetermineTime,
                companyAddress: getInfoData.companyAddress,
                domesticGoodsAddress: getInfoData.domesticGoodsAddress,
                vatRate: getInfoData.vatRate,
                exportRights: getInfoData.exportRights,
                customeRegistrationCode: getInfoData.customeRegistrationCode,
                imgPath1: this.getSelfItem(this.form.imgPath1, 1, fileList),
                imgPath2: this.getSelfItem(this.form.imgPath2, 2, fileList),
                imgPath3: this.getSelfItem(this.form.imgPath3, 3, fileList),
                imgPath4: this.getSelfItem(this.form.imgPath4, 4, fileList),
                imgPath5: this.getSelfItem(this.form.imgPath5, 5, fileList),
                imgPath6: this.getSelfItem(this.form.imgPath6, 6, fileList),
                imgPath7: this.getSelfItem(this.form.imgPath7, 7, fileList),
                imgPath8: this.getSelfItem(this.form.imgPath8, 8, fileList),
                imgPath9: this.getSelfItem(this.form.imgPath9, 9, fileList),
                imgPath10: this.getSelfItem(this.form.imgPath10, 10, fileList),
                imgPath11: this.getSelfItem(this.form.imgPath11, 11, fileList),
                gcfsCommodityList: getInfoData.gcfsCommodityList,
                letterStatus: getInfoData.letterStatus,
                letterContent: getInfoData.letterContent,
                billingCompanyStatus: getInfoData.billingCompanyStatus,
            };

            const contractData = await this.ctx.models.billing.getContractListByPage({billingCompanyId: id});
            this.contractList = contractData.data;
        },

        methods: {

            //点击小图显示大图
            handleSmallImgClick: function (data) {
                //大图
                this.dialogBigImgVisible = true;
                this.dialogBigImgTitle = this.businessTypeOption[data.businessType - 1];
                this.dialogBigImgSrc = data.fileUrl;
            },


            //获取每一个imgPath 多余的参数
            getSelfItem: function (defaultItem, businessType, fileList) {
                for (let i = 0; i < fileList.length; i++) {
                    if (fileList[i].businessType === businessType) {
                        if (defaultItem instanceof Array) {
                            defaultItem.push({url: fileList[i].fileUrl});
                        } else {
                            defaultItem = fileList[i].fileUrl;
                        }
                    }
                }
                return defaultItem;
            },

        },
    };
</script>


