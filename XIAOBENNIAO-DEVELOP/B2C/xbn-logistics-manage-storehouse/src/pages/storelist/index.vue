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

        /*.pd10 {
            padding: 10px;
        }

        .tac {
            text-align: center;
        }*/

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

        /* .nt-table th > .cell {
             padding: 0 5px;
         }
         .nt-table .cell {
             padding: 0 5px;
         }*/
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
</style>

<template>
    <div class="plan-list-container">
        <template-search-list ref="pageTmpl" title="仓库管理" :simple="simpleSearch" :combo="comboSearch"
                              :method="queryStore"
                              :filter="quickFilter">
            <template slot="page-table-operations">

                <nt-popover style="background: #fff;" ref="delete" placement="bottom" v-model="visible" width="246">
                    <div class="bgcfff">

                        <div v-if="controlWhichShow == 0">
                            请选择要删除的仓库信息。
                        </div>
                        <p v-else-if="controlWhichShow == 1">确定删除此仓库信息？</p>
                        <div class="popoverBtn">
                            <nt-button type="primary" size="small" @click="batchDelete">
                                确定
                            </nt-button>
                            <nt-button size="small" type="primary" @click="visible = false">取消</nt-button>
                        </div>
                    </div>
                </nt-popover>
                <nt-button type="primary" nt-col-offset-0 @click="jumpAdd">新增仓库</nt-button>
                <nt-button type="primary" nt-col-offset-0 v-popover:delete @click="controlDialogView">删除仓库</nt-button>
            </template>

            <template slot="page-table" slot-scope="props">
                <div class="contentBox">
                    <nt-table :data="props.tableData"
                              class="border_layout ">
                        <nt-table-column type="selection" align="center">
                        </nt-table-column>
                        <nt-table-column prop="storeName" label="仓库名称" sortable show-overflow-tooltip min-width="120">
                        </nt-table-column>
                        <nt-table-column prop="countryCurrencyId" sortable label="所属国家">
                            <template slot-scope="scope">
                                <span :filter-method="changeCCI(scope.row)">{{scope.row.countryCurrencyId}}</span>
                            </template>
                        </nt-table-column>
                        <nt-table-column prop="currencyUnit" sortable label="货币单位">
                            <template slot-scope="scope">
                                <span :filter-method="changeCU(scope.row)">{{scope.row.currencyUnit}}</span>
                            </template>
                        </nt-table-column>
                        <nt-table-column label="仓库类型" prop="storeType" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span :filter-method="changeST(scope.row)">{{scope.row.storeType}}</span>
                            </template>
                        </nt-table-column>
                        <nt-table-column label="仓库收货人" prop="consignee" min-width="120" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span :filter-method="changeCS(scope.row)">{{scope.row.consignee}}</span>
                            </template>
                        </nt-table-column>
                        <nt-table-column label="联系电话" prop="phonenumber" min-width="100">
                        </nt-table-column>
                        <nt-table-column label="操作" min-width="110">
                            <template slot-scope="scope">
                                <nt-popover style="background: #fff;" ref="popover{{$index}}" placement="bottom"
                                            width="246"
                                            v-model="scope.row.visibleSmall">
                                    <div class="bgcfff">
                                        <div v-model="scope.row.employ">
                                            <div>
                                                确定删除此仓库信息?
                                            </div>
                                        </div>
                                        <div class="popoverBtn">
                                            <nt-button type="primary" size="small"
                                                       @click="deleteCurrentPlan(scope.$index, scope.row)">确定
                                            </nt-button>
                                            <nt-button size="small" type="primary" @click="closeDeleteSmall">取消
                                            </nt-button>
                                        </div>
                                    </div>
                                </nt-popover>

                                <nt-button type="text" size="small" @click="jumpDetail(scope.$index, scope.row)">详情
                                </nt-button>
                                <nt-button type="text" size="small" @click="jumpUpdate(scope.$index, scope.row)">修改
                                </nt-button>
                                <nt-button type="text" size="small" v-popover:popover{{$index}}>
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
    /*import BatchImport from '../../components/batchimport/import.vue';*/
    import {BatchImport} from 'xbn-biz-components';

    export default {
        mixins: [listMixin],
        components: {
            BatchImport
        },
        data() {
            return {
                ids: [],
                visible: false,
                controlWhichShow: 0,
                countryCurrencyIdFormat: [],
                currencyUnit: [],
                storeTypeFormat: [{label: '海外仓', id: '01'}, {label: '集货仓', id: '02'}]
            };
        },

        created: async function () {
            const dictionary = await this.ctx.models.store.getGcfsDictionary();
            this.countryCurrencyIdFormat = dictionary.country;
        },

        methods: {

            //获取物流计划列表
            queryStore: function (params) {
                return this.ctx.models.store.listStore(params);
            },

            //获取字典
            getGcfsDictionary: async function () {
                const dictionary = await this.ctx.models.store.getGcfsDictionary();
                return dictionary;
            },

            //格式化国家
            changeCCI(row) {
                row.countryCurrencyId = this.getItem(row.countryCurrencyId, this.countryCurrencyIdFormat);
            },

            //格式化货币单位
            changeCU(row) {
                row.currencyUnit = this.getCuItem(row.countryCurrencyId, this.countryCurrencyIdFormat);
            },

            //格式化仓库类型
            changeST(row) {
                row.storeType = this.getItem(row.storeType, this.storeTypeFormat);
            },

            //格式化仓库收货人
            changeCS(row) {
                if (row.consignee.length > 20) {
                    row.consignee = row.consignee.substr(0, 20) + '...';
                }
            },


            //获取格式化以后的数据
            getItem: function (itemType, itemFormat) {
                for (let i = 0; i < itemFormat.length; i++) {
                    if (itemFormat[i].id == itemType) {
                        itemType = itemFormat[i].label;
                    }
                }
                return itemType;
            },

            //获取货币单位item
            getCuItem: function (itemType, itemFormat) {
                for (let i = 0; i < itemFormat.length; i++) {
                    if (itemFormat[i].label == itemType) {
                        itemType = itemFormat[i].currencyUnit;
                    }
                }
                return itemType;
            },

            //隐藏列表每行右侧删除弹框
            closeDeleteSmall: function () {
                document.querySelector('body').click();
            },

            //跳到增加页面
            jumpAdd: function () {
                this.$router.push({path: '/storehouse/add'});
            },

            //跳到详情页面
            jumpDetail(index, row) {
                this.$router.push({path: '/storehouse/detail?id=' + row.id});
            },

            //跳到修改页面
            jumpUpdate(index, row) {
                this.$router.push({path: '/storehouse/update?id=' + row.id});
            },

            //删除单条
            deleteCurrentPlan: async function (index, row) {
                try {
                    const res = await this.ctx.models.store.deleteStore(row.id)
                    if (res.statusCode === '2000000') {
                        this.closeDeleteSmall();
                        this.$refs.pageTmpl.refreshData();
                    }
                } catch (err) {
                    //交给框架处理的异常
                    this.closeDeleteSmall();
                    this.$notify.error({
                        title: '',
                        message: '仓库已被占用，无法删除'
                    });
                }
            },

            //批量删除
            batchDelete: async function () {
                try {
                    //从表格获取选项
                    const selected = this.$refs.pageTmpl.getSelection();
                    //转换为ids
                    const ids = selected.map(x => x.id);
                    //删除后刷新列表
                    const res = await this.ctx.models.store.batchDelete(ids)
                    if (res.statusCode === '2000000') {
                        this.visible = false;
                        this.$refs.pageTmpl.refreshData();
                    }
                } catch (err) {
                    //交给框架处理的异常
                    this.visible = false;
                    if (err.statusCode !== '2070001') {
                        this.$notify.error({
                            title: '',
                            message: '仓库已被占用，无法删除'
                        });
                    }
                }
            },

            //控制弹窗显示时里面显示不同的内容
            controlDialogView: function () {
                const selected = this.$refs.pageTmpl.getSelection();
                if (selected[0]) {
                    this.controlWhichShow = 1;
                } else {
                    this.controlWhichShow = 0;
                }
            }
        }
    };
</script>