<style lang="less">
.w450{width: 450px;}
.mL77{margin-left: 77px;}
.mL42{margin-left: 42px;}
.billing-list{
    .simpleSearch .select {
        width: 160px;
    }
}
</style>

<template>
    <div class="plan-list-container billing-list">
        <template-search-list ref="pageTmpl" title="开票厂商管理" :simple="simpleSearch" :combo="comboSearch"
                              :method="queryList"
                              :filter="quickFilter">
            <template slot="page-table" slot-scope="props">
                <div class="contentBox">
                    <nt-dialog title="审核通过" :visible.sync="dialogPassVisible" size="tiny" :close-on-click-modal="false">
                        <nt-form :model="auditPassData" ref="auditPassData">
                            <nt-form-item prop="billingCompanyStatus" class="mL77">
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
                            <nt-form-item label="合同编号：" v-if="auditPassData.billingCompanyStatus != 3">
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
                                <nt-input type="textarea" :maxlength="2000" placeholder="最多2000个字符"
                                          v-model="rejectCommodityData.rejectReason"></nt-input>
                            </nt-form-item>
                            <nt-form-item style="margin-top: -12px;margin-bottom: 0px;height: 20px;"
                                          v-if="rejectCommodityVisible === true">
                                <div class="nt-form-item__error">驳回原因不能为空</div>
                            </nt-form-item>
                        </nt-form>
                        <div slot="footer" class="dialog-footer">
                            <nt-button @click="dialogRejectVisible = false">取 消</nt-button>
                            <nt-button type="primary" @click="handleRejectSubmit">确 定</nt-button>
                        </div>
                    </nt-dialog>
                    <nt-dialog title="函调" :visible.sync="dialogLetterVisible" size="tiny"
                               :close-on-click-modal="false">
                        <nt-form :model="letterData">
                            <nt-form-item class="mL42">
                                <nt-radio-group v-model="letterData.letterStatus" @change="handleLetterChange">
                                    <nt-radio v-for="item in letterDataOptions" :label="item.id" :key="item.id">
                                        {{item.name}}
                                    </nt-radio>
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
                            <i class="nt-icon-warning pL10"></i>
                            确定从临时审核通过升级为审核通过？<br>操作不可逆
                        </div>
                        <div slot="footer" class="dialog-footer">
                            <nt-button type="primary" size="small" @click="dialogIncreaseVisible = false">取 消</nt-button>
                            <nt-button type="primary" size="small" @click="handleIncreaseSubmit">确 定</nt-button>
                        </div>
                    </nt-dialog>
                    <nt-dialog title="管理合同" :visible.sync="dialogContractVisible" size="large" :close-on-click-modal="false">
                        <nt-table :data="contractList" ref="contractListTpl" class="dialog_table"  max-height="250">
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
                                                          @change="handleEditContractChange(scope.row)"
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
                                    <nt-button type="text" size="small" v-if="scope.row.showEdit" :disabled="scope.row.saveButtonVisible"
                                               @click="handleSave(scope.$index,scope.row)">保存
                                    </nt-button>
                                    <nt-button type="text" size="small" v-if="scope.row.showEdit"
                                               @click="handleCancEdit(scope.row)">取消
                                    </nt-button>
                                    <nt-button type="text" size="small" v-if="!scope.row.showEdit"
                                               @click="handleDeleteContract(scope.row.id)">删除
                                    </nt-button>
                                </template>
                            </nt-table-column>
                        </nt-table>
                        <nt-form :model="addContract"  v-if="addContractVisible === true" class="mT25">
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
                    <nt-table :data="props.tableData"  class="border_layout">
                        <nt-table-column width="27"></nt-table-column>
                        <nt-table-column prop="createUser" label="用户名" show-overflow-tooltip min-width="120">
                            <template slot-scope="scope">
                                {{cutMoreChat(scope.row.createUser, 30)}}
                            </template>
                        </nt-table-column>
                        <nt-table-column prop="billingCompanyName" label="开票厂商" show-overflow-tooltip>
                        </nt-table-column>
                        <nt-table-column prop="uniformSocialCreditCode" label="统一社会信用代码">
                            <template slot-scope="scope">
                                {{cutMoreChat(scope.row.uniformSocialCreditCode, 30)}}
                            </template>
                        </nt-table-column>
                        <nt-table-column label="提交时间" prop="createTime" sortable min-width="120">
                            <template slot-scope="scope">
                                {{spliceDateFun(scope.row.createTime)}}
                            </template>
                        </nt-table-column>
                        <nt-table-column label="开票厂商状态" prop="billingCompanyStatus" min-width="120">
                            <template slot-scope="scope">
                                <span v-if="scope.row.billingCompanyStatus == 2">审核中</span>
                                <span v-if="scope.row.billingCompanyStatus === 3">待补充资料</span>
                                <span v-if="scope.row.billingCompanyStatus === 4">审核通过</span>
                                <span v-if="scope.row.billingCompanyStatus === 5">临时审核通过</span>
                                <span v-if="scope.row.billingCompanyStatus === 6">审核驳回</span>
                                <nt-tooltip class="item" effect="dark" v-if="scope.row.billingCompanyStatus === 6 && scope.row.rejectedReason !== ''"
                                            placement="right">
                                    <i class="nt-icon-xbn-19 main_color"></i>
                                    <div slot="content" style="maxWidth:370px;">
                                        <div class="block">驳回原因：
                                            <span v-if="!scope.row.rejectedReason">无</span>
                                            <span v-else>{{scope.row.rejectedReason}}</span>
                                        </div>
                                    </div>
                                </nt-tooltip>
                            </template>
                        </nt-table-column>
                        <nt-table-column label="函调状态" prop="letterStatus" min-width="120">
                            <template slot-scope="scope">
                                <div>
                                    <span v-if="scope.row.letterStatus === 2">待发函</span>
                                    <span v-if="scope.row.letterStatus === 3">待回函</span>
                                    <span v-if="scope.row.letterStatus === 4">转审核</span>
                                    <span v-if="scope.row.letterStatus === 5">已完成</span>
                                </div>
                            </template>
                        </nt-table-column>
                        <nt-table-column label="操作" min-width="125">
                            <template slot-scope="scope">
                                <nt-button type="text" size="small" @click="handlePassButtonClick(scope.row.id)"
                                           v-if="scope.row.billingCompanyStatus === 2">
                                    审核
                                </nt-button>
                                <nt-button type="text" size="small" @click="handleLetterButtonClick(scope.row)"
                                           v-if="scope.row.billingCompanyStatus === 4 || scope.row.billingCompanyStatus === 5">
                                    函调
                                </nt-button>
                                <nt-button type="text" size="small" @click="handleContractClick(scope.row.id)"
                                           v-if="scope.row.billingCompanyStatus === 4 || scope.row.billingCompanyStatus === 5">
                                    合同
                                </nt-button>
                                <nt-button type="text" size="small" @click="handleIncreaseButtonClick(scope.row.id)"
                                           v-if="scope.row.billingCompanyStatus === 5">
                                    升级
                                </nt-button>
                                <nt-button type="text" size="small" @click="jumpDetail(scope.$index, scope.row)">
                                    详情
                                </nt-button>
                            </template>
                        </nt-table-column>
                    </nt-table>
                </div>
            </template>
        </template-search-list>
    </div>
</template>

<script>

    import listMixin from './search.config';
    import commonMixin from '../common.js';

    export default {
        mixins: [listMixin, commonMixin],
        data() {
            return {
                dialogId: null,
                form: {},
                auditPassData: {},
                letter: {},
                increase: {},
                contract: {},
                contractList: [],
                addContract: {}
            };
        },

        computed: {},

        created: async function () {
        },

        watch: {
            '$route': async function (to, from) {

            }
        },

        methods: {
            //获取列表
            queryList: async function (params) {
                return await this.ctx.models.billing.getListByPage(params);
            },

        }
    };
</script>