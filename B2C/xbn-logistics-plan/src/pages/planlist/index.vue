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

        .pd10 {
            padding: 10px;
        }

        .tac {
            text-align: center;
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
        .nt-upload-dragger {
            width: 495px;
            height: 134px;
            border-radius: none;
            margin-top: 7px;
            .nt-icon-upload {
                margin-top: 32px;
            }
            .nt-upload__text {
                color: #999;
                line-height: 0;
            }
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
        .nt-page-filter{
            text-align: right;
        }
    }
</style>

<template>
    <div class="plan-list-container">
        <template-search-list ref="pageTmpl" title="物流计划查询" :simple="simpleSearch" :combo="comboSearch"
                              :method="queryPlans"
                              :filter="quickFilter">

            <template slot="page-table" slot-scope="props" >
                <div class="contentBox">
                    <nt-table :data="props.tableData" class="border_layout">
			<nt-table-column width="27"></nt-table-column>
                        <nt-table-column prop="logisticsCode" label="物流编码" sortable width="170">
                        </nt-table-column>
                        <nt-table-column prop="logisticsType" sortable label="物流方式">
                            <template slot-scope="scope">
                                <span :filter-method="changeLt(scope.row)">{{scope.row.logisticsType}}</span>
                            </template>
                        </nt-table-column>
                        <nt-table-column prop="disposalSite" sortable label="起运港">
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
                        <nt-table-column width="150" prop="expectedArrivalDate" sortable label="预计到港日期" min-width="80">
                        </nt-table-column>
                        <nt-table-column label="始发站" prop="startStation" sortable>
                        </nt-table-column>
                        <nt-table-column label="终点站" prop="lastStation" sortable>
                        </nt-table-column>
                    </nt-table>
                </div>
            </template>

        </template-search-list>
    </div>
</template>

<script>

    import listMixin from './search.config';

    export default {
        mixins: [listMixin],
        data() {
            return {
                logisticsTypeFormat: [],
                disposalSiteFormat: [],
                targetPortFormat: []
            };
        },

        computed: {},

        created: async function () {
            const dictionary = await this.ctx.models.plans.getGcfsDictionary();
            this.logisticsTypeFormat = dictionary.logisticsType;
            this.disposalSiteFormat = dictionary.disposalSite;
            this.targetPortFormat = dictionary.targetPort;
        },


        methods: {
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
            changeLt(row) {
                row.logisticsType = this.getItem(row.logisticsType, this.logisticsTypeFormat);
            },

            changeDs(row) {
                row.disposalSite = this.getItem(row.disposalSite, this.disposalSiteFormat);
            },

            changeTp(row) {
                row.targetPort = this.getItem(row.targetPort, this.targetPortFormat);
            },

            changeSt(row) {
                row.sendTimeLimit = this.spliceDateFun(row.sendTimeLimit);
            },

            changeRtl(row) {
                row.receiveTimeLimit = this.spliceDateFun(row.receiveTimeLimit);
            },

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

            //获取格式化以后的数据
            getItem: function (itemType, itemFormat) {
                for (let i = 0; i < itemFormat.length; i++) {
                    if (itemFormat[i].id == itemType) {
                        itemType = itemFormat[i].label;
                    }
                }
                return itemType;
            }

        }
    };
</script>