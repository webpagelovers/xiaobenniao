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
        <template-search-list ref="pageTmpl" title="供应商管理" :simple="simpleSearch" :combo="comboSearch"
                              :method="queryList"
                              :filter="quickFilter">
            <template slot="page-table-operations">
                <nt-popover style="background: #fff;" ref="batchdelete" placement="bottom"
                            trigger="click"
                            width="246">
                    <div class="bgcfff">
                        <div>
                            <span v-if="ids.length>0">是否删除此供应商？</span>
                            <span v-else>请选择要删除的供应商</span>
                        </div>
                        <div class="popoverBtn">
                            <nt-button type="primary" size="small"
                                       v-if="!ids.length"
                                       @click="closeDeleteSmall">确定
                            </nt-button>
                            <nt-button type="primary" size="small"
                                       v-if="ids.length>0"
                                       @click="handlerBatchDelete">确定
                            </nt-button>
                            <nt-button size="small" type="primary" @click="closeDeleteSmall">取消
                            </nt-button>
                        </div>
                    </div>
                </nt-popover>
                <nt-button type="primary" nt-col-offset-0 @click="jumpAdd">新增供应商</nt-button>
                <nt-button type="primary" nt-col-offset-0 v-popover:batchdelete>批量删除</nt-button>
            </template>
            <template slot="page-table" slot-scope="props">
                <div class="contentBox">
                    <nt-table :data="props.tableData" @select="selectIds" @select-all="selectIds" class="border_layout">
                        <nt-table-column type="selection" align="center"></nt-table-column>
                        <nt-table-column prop="supplierName" label="供应商名称" show-overflow-tooltip>
                        </nt-table-column>
                        <nt-table-column prop="serviceType" label="服务类型" show-overflow-tooltip>
                        </nt-table-column>
                        <nt-table-column prop="contactName" label="联系人" show-overflow-tooltip>
                        </nt-table-column>
                        <nt-table-column label="电话" prop="contactPhone" sortable min-width="120">
                        </nt-table-column>
                        <nt-table-column label="地址" prop="contactAddress" min-width="120">
                            <template slot-scope="scope">
                                {{cutMoreChat(scope.row.contactAddress, 40)}}
                            </template>
                        </nt-table-column>
                        <nt-table-column label="操作" min-width="125">
                            <template slot-scope="scope">
                                <nt-popover style="background: #fff;" ref="deletepopover{{$index}}" placement="bottom"
                                            width="246">
                                    <div class="bgcfff">
                                        <div>
                                            是否删除此供应商？
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
                                <nt-button type="text" size="small"
                                           @click="jumpUpdate(scope.$index, scope.row)">
                                    修改
                                </nt-button>
                                <nt-button type="text" size="small"
                                           v-popover:deletepopover{{$index}}>
                                    删除
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
                ids: []
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
                return await this.ctx.models.supplier.getListByPage(params);
            },

            //删除单条供应商
            handleDeleteCurrent: async function (row) {
                const res = await this.ctx.models.supplier.deleteCurrent({id: row.id});
                if (res.statusCode === '2000000') {
                    this.closeDeleteSmall();
                    this.$refs.pageTmpl.refreshData();

                } else {
                    this.$message.error(res.errMsg);
                }
            },

            //选择已选内容组成的数组ids
            selectIds: function (selection, row) {
                this.ids = [];
                for (var i = 0; i < selection.length; i++) {
                    this.ids.push(selection[i].id);
                }
            },

            //批量删除
            handlerBatchDelete: async function () {
                if (this.ids.length > 0) {
                    const res = await this.ctx.models.supplier.batchDelete({ids: this.ids});
                    if (res.statusCode === '2000000') {
                        this.closeDeleteSmall();
                        this.$refs.pageTmpl.refreshData();
                        this.ids = [];
                    } else {
                        this.$message.error(res.errMsg);
                    }
                }
            },


        }
    };
</script>