<style lang="less">
    .w450 {
        width: 450px;
    }

    .mL77 {
        margin-left: 77px;
    }

    .mL42 {
        margin-left: 42px;
    }

    .lcl-list {
        .simpleSearch .select {
            width: 130px;
        }
    }

</style>

<template>
    <div class="plan-list-container lcl-list">
        <template-search-list ref="pageTmpl" title="拼箱计划" :simple="simpleSearch" :combo="comboSearch"
                              :method="queryList"
                              :filter="quickFilter">
            <template slot="page-table-operations">
                <nt-button type="primary" nt-col-offset-0 @click="jumpAdd">新增</nt-button>
            </template>
            <template slot="page-table" slot-scope="props">
                <div class="contentBox">
                    <nt-table :data="props.tableData" class="border_layout">
                        <nt-table-column width="11"></nt-table-column>
                        <nt-table-column prop="planCode" label="拼箱计划编码" show-overflow-tooltip min-width="120">
                            <template slot-scope="scope">
                                {{cutMoreChat(scope.row.planCode, 30)}}
                            </template>
                        </nt-table-column>
                        <nt-table-column prop="containerCode" label="货柜编号" show-overflow-tooltip>
                            <template slot-scope="scope">
                                {{cutMoreChat(scope.row.containerCode, 30)}}
                            </template>
                        </nt-table-column>
                        <nt-table-column prop="boxAmount" label="货品箱数">
                            <template slot-scope="scope">
                                {{cutMoreChat(scope.row.boxAmount, 30)}}
                            </template>
                        </nt-table-column>
                        <nt-table-column label="实测货品体积" prop="volume" min-width="120">
                            <template slot-scope="scope">
                                {{scope.row.volume}}
                                <span>m³</span>
                            </template>
                        </nt-table-column>
                        <nt-table-column label="实测货品重量" prop="weight" min-width="120">
                            <template slot-scope="scope">
                                {{scope.row.weight}}
                                <span>kg</span>
                            </template>
                        </nt-table-column>
                        <nt-table-column label="来源" prop="source" min-width="120">
                            <template slot-scope="scope">
                                <div>
                                    <span v-if="scope.row.source == 1">小笨鸟</span>
                                    <span v-if="scope.row.source == 2">UBI</span>
                                </div>
                            </template>
                        </nt-table-column>
                        <nt-table-column label="状态" prop="status" min-width="120">
                            <template slot-scope="scope">
                                <div>
                                    <span v-if="scope.row.status == 1">新建</span>
                                    <span v-if="scope.row.status == 2">已指派</span>
                                    <span v-if="scope.row.status == 3">已发柜</span>
                                </div>
                            </template>
                        </nt-table-column>
                        <nt-table-column label="操作" min-width="125">
                            <template slot-scope="scope">
                                <nt-popover style="background: #fff;" ref="popover{{$index}}" placement="bottom"
                                            v-if="scope.row.source == 1 && scope.row.status == 1"
                                            v-model="scope.row.visibleSmall" width="246">
                                    <div class="bgcfff">
                                        <div>
                                            确定删除此拼箱计划?
                                        </div>
                                        <div class="popoverBtn">
                                            <nt-button type="primary" size="small"
                                                       @click="handleDeleteCurrent(scope.$index, scope.row)">确定
                                            </nt-button>
                                            <nt-button size="small" type="primary" @click="closeDeleteSmall">取消
                                            </nt-button>
                                        </div>
                                    </div>
                                </nt-popover>
                                <nt-button type="text" size="small" @click="jumpDetail(scope.$index, scope.row)">
                                    详情
                                </nt-button>
                                <nt-button type="text" v-if="scope.row.source == 1 && scope.row.status == 1"
                                           size="small"
                                           @click="jumpUpdate(scope.$index, scope.row)">
                                    编辑
                                </nt-button>
                                <nt-button type="text" v-if="scope.row.status == 1"
                                           size="small"
                                           @click="jumpApt(scope.$index, scope.row)">
                                    指派
                                </nt-button>
                                <nt-button type="text" v-if="scope.row.source == 1 && scope.row.status == 1"
                                           size="small"
                                           v-popover:popover{{$index}}>
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
                return await this.ctx.models.lclplan.getListByPage(params);
            },

            //删除单条
            handleDeleteCurrent: async function (index, row) {

                try {
                    const res = await this.ctx.models.lclplan.deleteCurrent({id: row.id});
                    if(res.statusCode === '2000000'){
                        this.closeDeleteSmall();
                        this.$refs.pageTmpl.refreshData();
                    }
                }catch (err){
                    this.ctx.onerror(err);
                }
            }

        }
    };
</script>