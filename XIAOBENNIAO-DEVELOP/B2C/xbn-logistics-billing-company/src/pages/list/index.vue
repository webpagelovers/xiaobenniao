<style lang="less">
    .plan-list-container {
        .popover1 {
            margin-bottom: 0 !important;
        }

        .popover1 .nt-form-item__label {
            padding: 0 !important;
        }

        .popover2 .nt-form-item__label {
            margin-top: 30px;
        }
        .bgcfff {
            background-color: #fff !important;
        }

        .col20a0ff {
            cursor: pointer;
            color: #20a0ff;
        }

        .nt-dialog__body p {
            line-height: 28px;
        }
        .col_317dff {
            color: #317dff;
        }

        .nt-page-pagination {
            text-align: center;
        }
        .col_e40000 {
            color: #e40000;
        }
        .bg_f5 {
            background: #f5f5f5;
            border-radius: 5px;
            width: 253px;
            height: 30px;
        }
        .pL10 {
            padding-left: 10px;
        }
        .mR10 {
            margin-right: 10px;
        }

        .nt-page-filter {
            text-align: right;
        }

    }

    .billing-list {
        .simpleSearch .select {
            width: 160px;
        }

        .circle {
            background-color: #ff4949;
            border-radius: 10px;
            color: #fff;
            display: inline-block;
            font-size: 12px;
            height: 18px;
            line-height: 18px;
            padding: 0 6px;
            text-align: center;
            white-space: nowrap;
            border: 1px solid #fff;
            cursor: pointer;
        }

        .mT25 {
            margin-top: 25px;
        }

        .competing_infor_main {
            padding: 30px;
        }

    }
</style>

<template>
    <div class="plan-list-container billing-list">
        <template-search-list ref="pageTmpl" title="开票厂商管理" :simple="simpleSearch" :combo="comboSearch"
                              :method="queryList"
                              :filter="quickFilter">
            <template slot="page-table-operations">
                <nt-button type="primary" nt-col-offset-0 @click="jumpAdd">新增开票厂商</nt-button>
            </template>
            <template slot="page-table" slot-scope="props">
                <div class="contentBox">
                    <nt-dialog title="添加产品" :visible.sync="addProductVisible"
                               :close-on-click-modal="false"
                               @open="handleAddProOpen"
                               size="small">
                        <div>
                            <div>
                                <nt-input class="w370 mB20"
                                          v-model="iconSearchData"
                                          icon="search"
                                          :placeholder="iconSelectData"
                                          :on-icon-click="handleSearchIconClick"
                                          :maxlength="60">
                                    <nt-select v-model="iconSelectData" slot="prepend" :placeholder="iconSelectData" class="w140">
                                        <nt-option label="产品名称" value="产品名称"></nt-option>
                                        <nt-option label="海关编码" value="海关编码"></nt-option>
                                        <nt-option label="商家SKU" value="商家SKU"></nt-option>
                                    </nt-select>
                                </nt-input>
                            </div>
                            <nt-table :data="allLinkedData" ref="tableLinkedData" class="dialog_table"
                                      @selection-change="handleSelectChange" max-height="250">
                                <nt-table-column type="selection" align="center"
                                                 :selectable='checkboxInit'></nt-table-column>
                                <nt-table-column prop="title" label="产品名称" show-overflow-tooltip></nt-table-column>
                                <nt-table-column prop="commodityCode" label="产品编码" show-overflow-tooltip></nt-table-column>
                                <nt-table-column prop="hsCode" label="海关编码" show-overflow-tooltip></nt-table-column>
                                <nt-table-column prop="merchantSku" label="商家SKU" show-overflow-tooltip></nt-table-column>
                                <nt-table-column prop="specsModel" label="规格型号" show-overflow-tooltip></nt-table-column>
                                <nt-table-column prop="brand" label="品牌" show-overflow-tooltip></nt-table-column>
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
                        <div slot="footer" class="dialog-footer">

                            <nt-button type="primary" size="small" @click="handleSaveLinked">提 审</nt-button>
                            <nt-button type="primary" size="small" @click="addProductVisible = false">取 消</nt-button>
                        </div>
                    </nt-dialog>
                    <nt-table :data="props.tableData" class="border_layout">
                        <nt-table-column width="27"></nt-table-column>
                        <nt-table-column prop="billingCompanyName" label="开票厂商" show-overflow-tooltip>
                        </nt-table-column>
                        <nt-table-column prop="uniformSocialCreditCode" label="统一社会信用代码" show-overflow-tooltip>
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
                                <span v-if="scope.row.billingCompanyStatus == 1">新建</span>
                                <span v-if="scope.row.billingCompanyStatus == 2">审核中</span>
                                <span v-if="scope.row.billingCompanyStatus === 3">待补充资料</span>
                                <span v-if="scope.row.billingCompanyStatus === 4">审核通过</span>
                                <span v-if="scope.row.billingCompanyStatus === 5">临时审核通过</span>
                                <span v-if="scope.row.billingCompanyStatus === 6">审核驳回</span>
                                <nt-tooltip class="item" effect="dark"
                                            v-if="scope.row.billingCompanyStatus === 6 && scope.row.rejectedReason !== ''"
                                            placement="right">
                                    <i class="nt-icon-xbn-19 main_color"></i>
                                    <div slot="content" style="maxWidth:370px;">
                                        <span class="block">驳回原因：
                                            <i v-if="scope.row.rejectedReason">{{scope.row.rejectedReason}}</i>
                                            <i v-else>无</i>
                                        </span>
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
                                <nt-popover style="background: #fff;" ref="popover{{$index}}" placement="bottom"
                                            v-if="scope.row.billingCompanyStatus === 1 || scope.row.billingCompanyStatus === 3"
                                            v-model="scope.row.auditVisible" width="246">
                                    <div class="bgcfff">
                                        <div>
                                            您确定提审开票厂商吗？
                                        </div>
                                        <div class="popoverBtn">
                                            <nt-button type="primary" size="small"
                                                       @click="handleAuditSubmit(scope.$index, scope.row)">确定
                                            </nt-button>
                                            <nt-button size="small" type="primary" @click="closeDeleteSmall">取消
                                            </nt-button>
                                        </div>
                                    </div>
                                </nt-popover>
                                <nt-popover style="background: #fff;" ref="deletepopover{{$index}}" placement="bottom"
                                            v-if="scope.row.billingCompanyStatus === 1 || scope.row.billingCompanyStatus === 6"
                                            width="246">
                                    <div class="bgcfff">
                                        <div>
                                            您确定删除此开票厂商吗？
                                        </div>
                                        <div class="popoverBtn">
                                            <nt-button type="primary" size="small"
                                                       @click="handleDeleteCurrent(scope.row)">确定
                                            </nt-button>
                                            <nt-button size="small" type="primary" @click="closeDeleteSmall">取消
                                            </nt-button>
                                        </div>
                                    </div>
                                </nt-popover>
                                <div v-if="scope.row.billingCompanyStatus === 1">
                                    <nt-button type="text" size="small" v-popover:popover{{$index}}
                                               @click="handlePassButtonClick(scope.row.id)">
                                        提审
                                    </nt-button>
                                    <nt-button type="text" size="small" @click="jumpUpdate(scope.$index, scope.row)">
                                        修改
                                    </nt-button>
                                    <nt-button type="text" size="small" @click="jumpDetail(scope.$index, scope.row)">
                                        详情
                                    </nt-button>
                                    <nt-button type="text" size="small" v-popover:deletepopover{{$index}}>
                                        删除
                                    </nt-button>
                                </div>
                                <div v-if="scope.row.billingCompanyStatus === 2">
                                    <nt-button type="text" size="small" @click="jumpDetail(scope.$index, scope.row)">
                                        详情
                                    </nt-button>
                                </div>
                                <div v-if="scope.row.billingCompanyStatus === 3">
                                    <nt-button type="text" size="small" v-popover:popover{{$index}}  @click="handlePassButtonClick(scope.row.id)">
                                        提审
                                    </nt-button>
                                    <nt-button type="text" size="small" @click="jumpUpdate(scope.$index, scope.row)">
                                        修改
                                    </nt-button>
                                    <nt-button type="text" size="small" @click="jumpDetail(scope.$index, scope.row)">
                                        详情
                                    </nt-button>
                                </div>
                                <div v-if="scope.row.billingCompanyStatus === 4">
                                    <nt-button type="text" size="small" @click="jumpDetail(scope.$index, scope.row)">
                                        详情
                                    </nt-button>
                                    <nt-button type="text" size="small" @click="handleAddProductButtonClick(scope.row)">
                                        添加产品
                                    </nt-button>
                                </div>

                                <div v-if="scope.row.billingCompanyStatus === 5">
                                    <nt-button type="text" size="small" @click="jumpDetail(scope.$index, scope.row)">
                                        详情
                                    </nt-button>
                                    <nt-button type="text" size="small" @click="handleAddProductButtonClick(scope.row)">
                                        添加产品
                                    </nt-button>
                                </div>

                                <div v-if="scope.row.billingCompanyStatus === 6">
                                    <nt-button type="text" size="small" @click="jumpDetail(scope.$index, scope.row)">
                                        详情
                                    </nt-button>
                                    <nt-button type="text" size="small" @click="jumpUpdate(scope.$index, scope.row)">
                                        修改
                                    </nt-button>
                                    <nt-button type="text" size="small" v-popover:deletepopover{{$index}}>
                                        删除
                                    </nt-button>
                                </div>
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
                //直接提审
                auditVisible: false,
                auditData: {},
                //管理合同
                dialogContractVisible: false,
                addContractVisible: false,
                contractNumberErrorVisible: false,
                form: {},
                auditPassData: {},
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

            //直接提审
            handlePassButtonClick: async function (id) {
                this.auditVisible = true;
                this.auditData = {};
                this.auditData.id = id;
            },

            handleAuditSubmit: async function () {
                await this.ctx.models.billing.audit({id: this.auditData.id});
                this.auditVisible = false;
                this.$refs.pageTmpl.refreshData();
            },


            //对话框点击关闭按钮引发的事件
            handleColse: function () {
                this.letter = {};
                this.increase = {};
                this.contract = {};
            },

            //删除单条开票厂商
            handleDeleteCurrent: async function (row) {
                await this.ctx.models.billing.deleteCurrent({id: row.id});
                this.closeDeleteSmall();
                this.$refs.pageTmpl.refreshData();
            },

        }
    };
</script>