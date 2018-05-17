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
        /*.simpleSearch .select {
            width: 160px;
        }*/

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
                    <nt-table :data="props.tableData" class="border_layout">
                        <nt-table-column width="27"></nt-table-column>
                        <nt-table-column prop="cfUserName" label="用户名" show-overflow-tooltip>
                            <template slot-scope="scope">
                                {{cutMoreChat(scope.row.cfUserName, 30)}}
                            </template>
                        </nt-table-column>
                        <nt-table-column prop="billingCompanyName" label="开票厂商" show-overflow-tooltip>
                            <template slot-scope="scope">
                                {{cutMoreChat(scope.row.billingCompanyName, 30)}}
                            </template>
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
                                <span v-if="scope.row.billingCompanyStatus == 1">待认证</span>
                                <span v-if="scope.row.billingCompanyStatus == 2">已认证</span>
                            </template>
                        </nt-table-column>
                        <nt-table-column label="操作" min-width="125">
                            <template slot-scope="scope">
                                <nt-popover style="background: #fff;" ref="deletepopover{{$index}}" placement="bottom"
                                            v-if="scope.row.billingCompanyStatus == 1"
                                            width="246">
                                    <div class="bgcfff">
                                        <div>
                                            确定删除此开票厂商？
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
                                <nt-popover style="background: #fff;" ref="cancelcertified{{$index}}" placement="bottom"
                                            v-if="scope.row.billingCompanyStatus == 2"
                                            width="246">
                                    <div class="bgcfff">
                                        <div>
                                            确定要取消认证此开票厂商？
                                        </div>
                                        <div class="popoverBtn">
                                            <nt-button type="primary" size="small"
                                                       @click="handleCancelCertified(scope.row)">确定
                                            </nt-button>
                                            <nt-button size="small" type="primary" @click="closeDeleteSmall">取消
                                            </nt-button>
                                        </div>
                                    </div>
                                </nt-popover>
                                <nt-button type="text" size="small"
                                           v-if="scope.row.billingCompanyStatus == 1"
                                           @click="jumpDetail(scope.$index, scope.row)">
                                    认证
                                </nt-button>
                                <nt-button type="text" size="small"
                                           v-if="scope.row.billingCompanyStatus == 2"
                                           v-popover:cancelcertified{{$index}}>
                                    取消认证
                                </nt-button>
                                <nt-button type="text" size="small"
                                           v-if="scope.row.billingCompanyStatus == 1"
                                           @click="jumpUpdate(scope.$index, scope.row)">
                                    修改
                                </nt-button>
                                <nt-button type="text" size="small"
                                           v-if="scope.row.billingCompanyStatus == 1"
                                           v-popover:deletepopover{{$index}}>
                                    删除
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
    import commonMixin from './common.js';

    export default {
        mixins: [listMixin, commonMixin],
        data() {
            return {

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

            //删除单条开票厂商
            handleDeleteCurrent: async function (row) {
                await this.ctx.models.billing.deleteCurrent({id: row.id});
                this.closeDeleteSmall();
                this.$refs.pageTmpl.refreshData();
            },


            //取消认证单条开票厂商
            handleCancelCertified: async function (row) {
                await this.ctx.models.billing.cancelCertified({id: row.id});
                this.closeDeleteSmall();
                this.$refs.pageTmpl.refreshData();
            },
        }
    };
</script>