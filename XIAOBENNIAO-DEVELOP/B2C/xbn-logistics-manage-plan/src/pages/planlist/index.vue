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
        <template-search-list ref="pageTmpl" title="物流计划管理" :simple="simpleSearch" :combo="comboSearch"
                              :method="queryPlans"
                              :filter="quickFilter">
            <template slot="page-table-operations">

                <batch-import title="批量上传物流计划" :uploadUrl="uploadPlanApi" ref="importDialog" @imported="importSuccess">
                    <p>请将物流计划信息填入《物流计划上传模板》，然后通过以下方式上传。</p>
                    <p class="col_317dff">
                        <a :href="downloadTempApi" class="col_317dff" download>获取《物流计划上传模板》</a>
                    </p>
                </batch-import>

                <nt-popover style="background: #fff;" ref="delete" placement="bottom" v-model="visible" width="246">
                    <div class="bgcfff">

                        <div v-if="controlWhichShow == 0">
                            请选择要删除的物流计划
                        </div>
                        <p v-else-if="controlWhichShow == 1">确定删除此物流计划？</p>
                        <div class="popoverBtn">
                            <nt-button type="primary" size="small" @click="batchDelete">
                                确定
                            </nt-button>
                            <nt-button size="small" type="primary" @click="visible = false">取消</nt-button>
                        </div>
                    </div>
                </nt-popover>
                <nt-button type="primary" nt-col-offset-0 @click="jumpAdd">新增</nt-button>
                <nt-button type="primary" nt-col-offset-0 @click="handleBatchImport">批量上传</nt-button>
                <nt-button type="primary" nt-col-offset-0 v-popover:delete @click="controlDialogView">删除</nt-button>
            </template>

            <template slot="page-table" slot-scope="props">
                <div class="contentBox">
                    <nt-table :data="props.tableData" @select="selectIds" @select-all="selectIds" class="border_layout">
                        <nt-table-column type="selection" align="center">
                        </nt-table-column>
                        <nt-table-column prop="logisticsCode" label="物流编码" sortable show-overflow-tooltip
                                         min-width="80">
                        </nt-table-column>
                        <nt-table-column prop="logisticsType" sortable label="物流方式" min-width="70">
                            <template slot-scope="scope">
                                <span :filter-method="changeLt(scope.row)">{{scope.row.logisticsType}}</span>
                            </template>
                        </nt-table-column>
                        <nt-table-column prop="disposalSite" sortable label="起运港"  min-width="60" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span :filter-method="changeDs(scope.row)">{{scope.row.disposalSite}}</span>
                            </template>
                        </nt-table-column>
                        <nt-table-column label="目的港口" prop="targetPort" sortable show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span :filter-method="changeTp(scope.row)">{{scope.row.targetPort}}</span>
                            </template>
                        </nt-table-column>
                        <nt-table-column label="截止下单时间" prop="sendTimeLimit" sortable min-width="120">
                            <template slot-scope="scope">
                                <span :filter-method="changeSt(scope.row)">{{scope.row.sendTimeLimit}}</span>
                            </template>
                        </nt-table-column>
                        <nt-table-column label="截止收货时间" prop="receiveTimeLimit" sortable min-width="120">
                            <template slot-scope="scope">
                                <span :filter-method="changeRtl(scope.row)">{{scope.row.receiveTimeLimit}}</span>
                            </template>
                        </nt-table-column>
                        <nt-table-column label="资料提交截止时间" prop="cutTheTime" sortable min-width="120">
                            <template slot-scope="scope">
                                <span :filter-method="changeCtt(scope.row)">{{scope.row.cutTheTime}}</span>
                            </template>
                        </nt-table-column>
                        <nt-table-column prop="expectedArrivalDate" sortable label="预计到港日期" min-width="100">
                        </nt-table-column>
                        <nt-table-column label="始发站" prop="startStation" sortable  min-width="60">
                        </nt-table-column>
                        <nt-table-column label="终点站" prop="lastStation" sortable  min-width="60">
                        </nt-table-column>
                        <nt-table-column label="操作" min-width="125">
                            <template slot-scope="scope">
                                <nt-popover style="background: #fff;" ref="popover{{$index}}" placement="bottom"
                                            v-model="scope.row.visibleSmall" width="246">
                                    <div class="bgcfff">
                                        <div>
                                            确定删除此物流计划?
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
                loadingImg: true,
                controlWhichShow: 0,
                logisticsTypeFormat: [],
                disposalSiteFormat: [],
                targetPortFormat: [],
                downloadTempApi: this.ctx.servers.default.options.baseURL + '/gcfsLogisticsPlan/downloadPlanTemplate',
                uploadPlanApi: this.ctx.servers.default.options.baseURL + '/gcfsLogisticsPlan/uploadPlan'
            };
        },

        computed: {},

        created: async function () {
            const dictionary = await this.ctx.models.plans.getGcfsDictionary();
            this.logisticsTypeFormat = dictionary.logisticsType;
            this.disposalSiteFormat = dictionary.disposalSite;
            this.targetPortFormat = dictionary.targetPort;
        },

        watch: {
            '$route': async function (to, from) {

            }
        },

        methods: {

            importSuccess: function () {
                this.$refs.pageTmpl.refreshData();
            },

            handleBatchImport: function () {
                this.$refs.importDialog.show();
            },
            //获取物流计划列表
            queryPlans: async function (params) {
                const plans = await this.ctx.models.plans.listPlans(params);
                return plans;
            },

            //获取字典
            getGcfsDictionary: async function () {
                const dictionary = await this.ctx.models.plans.getGcfsDictionary();
                return dictionary;
            },

            //格式化物流方式
            changeLt(row) {
                row.logisticsType = this.getItem(row.logisticsType, this.logisticsTypeFormat);
            },

            //格式化处理地点
            changeDs(row) {
                row.disposalSite = this.getItem(row.disposalSite, this.disposalSiteFormat);
            },

            //格式化目的港口
            changeTp(row) {
                row.targetPort = this.getItem(row.targetPort, this.targetPortFormat);
            },

            //格式化截止下单时间
            changeSt(row) {
                row.sendTimeLimit = this.spliceDateFun(row.sendTimeLimit);
            },

            //格式化截止收货时间
            changeRtl(row) {
                row.receiveTimeLimit = this.spliceDateFun(row.receiveTimeLimit);
            },

            //格式化截单时间
            changeCtt(row) {
                row.cutTheTime = this.spliceDateFun(row.cutTheTime);
            },


            //截取秒
            spliceDateFun(data) {
                let date = null;
                if (data && data.match(/^\d{4}(\-\d{2}){2}\s+\d{2}\:\d{2}/)) {
                    date = data.match(/^\d{4}(\-\d{2}){2}\s+\d{2}\:\d{2}/)[0];
                } else {
                    date = null;
                }
                return date;
            },

            //批量导入
            uploadPlan: async function () {
                await this.ctx.models.plans.listPlans();
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

            //隐藏列表每行右侧删除弹框
            closeDeleteSmall: function () {
                document.querySelector('body').click();
            },

            //跳到增加页面
            jumpAdd: function () {
                this.$router.push({path: '/plan/add'});
            },

            //跳到详情页面
            jumpDetail(index, row) {
                this.$router.push({path: '/plan/detail?id=' + row.id});
            },

            //跳到修改页面
            jumpUpdate(index, row) {
                this.$router.push({path: '/plan/update?id=' + row.id});
            },

            //删除单条
            deleteCurrentPlan: async function (index, row) {
                try {
                    const res = await this.ctx.models.plans.deletePlan(row.id);
                    if (res.statusCode === '2000000') {
                        this.closeDeleteSmall();
                        this.$refs.pageTmpl.refreshData();
                    }
                } catch (err) {
                    //交给框架处理的异常
                    this.closeDeleteSmall();
                    this.$notify.error({
                        title: '',
                        message: '物流计划已被占用，无法删除'
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
                    const res = await this.ctx.models.plans.batchDelete(ids);
                    if (res.statusCode === '2000000') {
                        this.visible = false;
                        if(ids[0]){
                            this.$refs.pageTmpl.refreshData();
                        }
                    }
                } catch (err) {
                    //交给框架处理的异常
                    this.visible = false;
                    this.$notify.error({
                        title: '',
                        message: '物流计划已被占用，无法删除'
                    });

                }
            },

            //选择已选内容组成的数组ids
            selectIds: function (selection, row) {
                this.ids = [];
                for (var i = 0; i < selection.length; i++) {
                    this.ids.push(selection[i].id);
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