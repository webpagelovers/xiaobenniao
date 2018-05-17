<template>
    <div>
        <template-search-list ref='pageTmpl' title='装箱计划' :simple='query.simple' :combo='query.comboSearch' :method='query.getList' :filter='query.quickFilter'>
            <template slot="page-table" scope="props">
                <div class="contentBox">
                    <nt-table class="border_layout" :data="props.tableData" stripe tooltip-effect="dark" style="width: 100%" @selection-change="selectionChange">
                        <nt-table-column label="装箱计划编码" prop="packPlanCode" sortable></nt-table-column>
                        <nt-table-column label="创建时间" prop="createTime" show-overflow-tooltip sortable></nt-table-column>
                        <nt-table-column label="船期" prop="shipPeriod" show-overflow-tooltip sortable></nt-table-column>
                        <nt-table-column label="起运港/目的港" prop="merchantSku" min-width="80" show-overflow-tooltip sortable>
                            <template scope="scope">
                                {{scope.row.startPort}} / {{scope.row.destintionPort}}
                            </template>
                        </nt-table-column>
                        <nt-table-column label="运输方式" prop="transportType" show-overflow-tooltip sortable>
                            <template scope="scope">
                                {{transportWay.get(scope.row.transportType).label}}
                            </template>
                        </nt-table-column>
                        <nt-table-column label="处理状态" prop="state" show-overflow-tooltip sortable>
                            <template scope="scope">
                                {{handleStatus.get(scope.row.state).label}}
                            </template>
                        </nt-table-column>
                        <nt-table-column label="主提运单号" prop="masterWaybillCode" show-overflow-tooltip sortable></nt-table-column>
                        <nt-table-column label="报关订单" prop="customOrderCodes"></nt-table-column>
                        <nt-table-column label="操作">
                            <template scope="scope">
                                <router-link :to="'/encasement/detail/' + scope.row.cfPackPlanId" class="mR10">
                                    <nt-button type="text" size="small">详情</nt-button>
                                </router-link>
                                <router-link v-if="scope.row.state == handleStatus.unOrder.value || scope.row.state == handleStatus.partOrder.value" :to="'/encasement/edit/'+scope.row.cfPackPlanId" class="mR10">
                                    <nt-button type="text" size="small">生成报关订单</nt-button>
                                </router-link>
                                <router-link v-if="scope.row.state == handleStatus.allOrder.value" :to="'/commodity/audit/'+scope.row.cfPackPlanId" class="mR10">
                                    <nt-button type="text" size="small">导出分单信息</nt-button>
                                </router-link>
                            </template>
                        </nt-table-column>
                    </nt-table>
                </div>
            </template>
        </template-search-list>
        <!-- 导出产品 -->
        <!--<nt-dialog title="提示" :visible.sync="exportDialogVisible" width="30%" @before-close="exportDialogVisible = false">-->
            <!--<div>-->
                <!--<nt-form label-width="150px" class="contentBox">-->
                    <!--<nt-form-item label="创建时间：" prop="merchantSku">-->
                        <!--<nt-date-picker v-model="exportModel.beginTimebeginTime" type="datetime" placeholder="选择日期时间">-->
                        <!--</nt-date-picker>- -->
                        <!--<nt-date-picker v-model="exportModel.endTime" type="datetime" placeholder="选择日期时间">-->
                        <!--</nt-date-picker>-->
                    <!--</nt-form-item>-->
                    <!--<nt-form-item label="最终目的国(地区)：" prop="merchantSku">-->
						<!--<nt-select v-model="exportModel.country" placeholder="请选择">-->
							<!--<nt-option v-for="item in countryEnum.array()" :key="item.value" :label="item.label" :value="item.value"></nt-option>-->
						<!--</nt-select>-->
                    <!--</nt-form-item>-->
                <!--</nt-form>-->
            <!--</div>-->
            <!--<span slot="footer" class="dialog-footer">-->
                <!--<nt-button type="primary" @click="exportCommodity">确 定</nt-button>-->
                <!--<nt-button @click="exportDialogVisible = false">取 消</nt-button>-->
            <!--</span>-->
        <!--</nt-dialog>-->
        <!--导入插件-->
        <!--<batch-import title="导入" :uploadUrl="uploadApi" ref="importDialog" @imported="importSuccess">-->
            <!--&lt;!&ndash;<p class="lh22">请将产品信息填入《产品上传模板》，然后通过以下方式上传。</p>-->
             <!--<p class="col_317dff lh22">-->
                <!--<a :href="downloadTempApi" class="col_317dff" download>获取《产品上传模板》</a>-->
            <!--</p> &ndash;&gt;-->
        <!--</batch-import>-->
    </div>
</template>

<script>

import Enum from '../models/enum.js';
import { handleStatus, simpleQuery, comboQuery, quickFilter,transportWay } from '../models/status.js';
import checkAjaxData from '../models/checkAjaxData.js';
import { TemplateSearchList, BatchImport } from 'xbn-biz-components';

export default {
    data() {
        return {
            handleStatus,   // 处理状态
            transportWay,   // 运输方式
            list: [],       // 列表
            query: {
                simple      : simpleQuery,
                comboSearch : comboQuery,
                quickFilter : quickFilter,

                getList: async function (params) {
                    this.param = params.param;
                    const list = await this.$nt.models.encasement.listPage(params, this.ctx);
                    return list;
                }
            }
        }
    },
    components: {
        'template-search-list': TemplateSearchList,
//        BatchImport
    },

    beforeCreate: function () {

    },

    created: async function () {

    },
    watch: {

    },
    methods: {
        selectionChange: function (val) {
            this.selectedList = val;
        }

        //导出产品
//        async exportCommodity(e) {
//            let params = this.exportModel;
//            await this.ctx.servers.default.postFrom(
//                this.ctx.servers.default.options.baseURL + '/gcfsCommodityAdmin/exportCommodity',
//                { "json": JSON.stringify(params) },
//                { "token": this.ctx.authentication.getToken() }
//            );
//            this.exportDialogVisible = false;
//        },
        //打开导入产品串口
//        handleBatchImport: function () {
//            this.$refs.importDialog.show();
//        },
//        importSuccess: function () {
//            this.$refs.pageTmpl.refreshData();
//        },
    }
}
</script>


<style lang="less">

    /*popover 组件基础样式被意外修改，这里还原基础样式 */
    .__nt-popover{
        padding-bottom: 16px;
        width:auto;
        min-width: 250px;
    }
</style>
