<style scoped>
    .block {
        display: block;
    }
    .keep { word-break: keep-all;}
</style>
<template>
<div>
    <template-search-list ref='pageTmpl' title='CF订单' :simple='simpleSearch' :combo='comboSearch'
        :method='queryList' :filter='quickFilter'>
        <template slot='page-table-operations'>
            <!-- <nt-button type="primary" nt-col-offset-0 @click="clickCancelOrder">取消订单</nt-button> -->
        </template>

        <template slot='page-table' slot-scope='props' class='contentBox'>
            <div class='contentBox'>
                <nt-table :data='props.tableData' @selection-change="handleSelectionChange" class="border_layout">
                    <!-- <nt-table-column type='selection' align="center"></nt-table-column> -->
                    <nt-table-column prop="cfOrderCode"  width="27"></nt-table-column>
                    <nt-table-column prop="cfOrderCode" label="CF订单号" width="160" sortable></nt-table-column>
                    <nt-table-column prop="userName" label="用户名" sortable></nt-table-column>
                    <nt-table-column prop="createTime" label="创建时间" min-width="90" sortable>
                        <!-- <template slot-scope="scope">
                            <span class="keep">{{scope.row.createTime[0]}}</span>
                            <span class="keep">{{scope.row.createTime[1]}}</span>
                        </template> -->
                    </nt-table-column>
                    <nt-table-column prop="headUpState" label="是否自抬头" sortable>
                        <!-- <template slot-scope="scope">
                            {{base.orderStatusMap[scope.row.status]}}
                            <nt-tooltip class="item" effect="dark" v-if="scope.row.status === 12 || scope.row.status === 13" placement="right">
                                <i class="nt-icon-xbn-19 main_color"></i>
                                <div slot="content">
                                    <span v-if="scope.row.status === 12" class="block">驳回原因：{{scope.row.rejectionReason}}</span>
                                    <span v-if="scope.row.status === 13" class="block">取消原因：{{scope.row.cancelReason}}</span>
                                </div>
                            </nt-tooltip>
                        </template> -->
                    </nt-table-column>
                    <nt-table-column prop="taxRefundState" label="是否退税" show-overflow-tooltip sortable></nt-table-column>
                    <nt-table-column label="是否结汇" sortable>
                        <template slot-scope="scope">
                            <span class="block">{{scope.row.exchangeState}}</span>
                        </template>
                    </nt-table-column>
                    <nt-table-column prop="transportType" label="运输方式" sortable>
                        <!-- <template slot-scope="scope">
                            {{base.exchangeStatusMap[scope.row.exchangeStatus]}}
                        </template> -->
                    </nt-table-column>
                    <nt-table-column prop="billingStatus" label="起运港/目的港" sortable>
                        <template slot-scope="scope">
                            {{scope.row.startPort}} / {{scope.row.destintionPort}}
                        </template>
                    </nt-table-column>
                    <nt-table-column prop="shipPeriod" label="船期" min-width="90" sortable>
                        <!-- <template slot-scope="scope">
                            <span class="keep">{{scope.row.createTime[0]}}</span>
                            <span class="keep">{{scope.row.createTime[1]}}</span>
                        </template> -->
                    </nt-table-column>
                    <nt-table-column prop="baoOrdersCode" label="装箱计划编码" show-overflow-tooltip sortable></nt-table-column>
                    <nt-table-column  label="操作">
                        <template slot-scope="scope">
                            <router-link class="nt-button nt-button--text nt-button--small"
                                :to="{ path: '/cfOrder/details/' + scope.row.id}">
                                <nt-button type="text" size="small">详情</nt-button>
                            </router-link>
                      </template>
                    </nt-table-column>
                </nt-table>
            </div>
        </template>
    </template-search-list>

</div>
</template>

<script>
import {TemplateSearchList} from 'xbn-biz-components';
import merge from 'deepmerge';
import common from './../models/common.js';
// import UpdateRemarkOrReject from './../components/UpdateRemarkOrReject.vue';
// import UploadCustomsDocuments from './../components/upload-customs-documents.vue';
// import ConfirmAddInfo from './../components/confirm-add-info.vue';
// import InputInvoiceInfo from './../components/input-invoice-info.vue';
// import InputRefundInfo from './../components/input-refund-info.vue';
// import isInvestigate from './../components/is-investigate.vue';
// import isInvestigateComplete from './../components/is-investigate-complete.vue';


// import {Progress} from 'nt-element'

export default {
    components: {
        // 'nt-progress':Progress,
        TemplateSearchList,
        // UpdateRemarkOrReject,
        // isInvestigate,
        // isInvestigateComplete,
        // UploadCustomsDocuments,
        // ConfirmAddInfo,
        // InputInvoiceInfo,
        // InputRefundInfo
    },
    mixins: [common],
    data() {
        return {
            simpleSearch: [
                {
                    value: 'cfOrderCode',
                    label: 'CF订单号',
                    placeholder: '请输入CF订单号'
                },
                {
                    value: 'userName',
                    label: '用户名',
                    placeholder: '请输入用户名'
                },
                {
                    value: 'baoOrdersCode',
                    label: '装箱计划编码',
                    placeholder: '请输入装箱计划编码'
                }
            ],
            comboSearch: [
                {       //普通文本
                    key: 'cfOrderCode',
                    label: 'CF订单号',
                    type: 'input'
                },
                {       //普通文本
                    key: 'userName',
                    label: '用户名',
                    type: 'input'
                },
                {
                    key: 'createTime',
                    label: '创建时间',
                    type: 'timequery'
                },
                {                //下拉选项 如果options数据需要从服务器获取，需要vue组件route之前就得到
                    key: 'headUpState',
                    label: '是否自抬头',
                    options: [
                        {
                            label: '是',
                            value: 1
                        },{
                            label: '否',
                            value: 2
                        }
                    ],
                    type: 'select'
                },
                {                //下拉选项 如果options数据需要从服务器获取，需要vue组件route之前就得到
                    key: 'taxRefundState',
                    label: '是否退税',
                    options: [
                        {
                            label: '是',
                            value: 1
                        },{
                            label: '否',
                            value: 2
                        }
                    ],
                    type: 'select'
                },
                {                //下拉选项 如果options数据需要从服务器获取，需要vue组件route之前就得到
                    key: 'exchangeState',
                    label: '是否结汇',
                    options: [
                        {
                            label: '是',
                            value: 1
                        },{
                            label: '否',
                            value: 2
                        }
                    ],
                    type: 'select'
                },
                {                //下拉选项 如果options数据需要从服务器获取，需要vue组件route之前就得到
                    key: 'transportType',
                    label: '运输方式',
                    options: [],
                    type: 'select'
                },
                {       //普通文本
                    key: 'startPort',
                    label: '起运港',
                    type: 'input'
                },
                {       //普通文本
                    key: 'destintionPort',
                    label: '目的港',
                    type: 'input'
                },
                {
                    key: 'shipPeriod',
                    label: '船期',
                    type: 'timequery'
                },
                {       //普通文本
                    key: 'baoOrdersCode',
                    label: '装箱计划编码',
                    line: true,
                    type: 'input'
                }
            ],
            quickFilter: [
                // {
                //     'key': 'status',
                //     'label': '订单状态',
                //     'size': 'medium',  //可选 默认为medium  取值范围 x-small small medium large x-large xx-large
                //     'options': []
                // },
                // {
                //     'key': 'exchangeStatus',
                //     'label': '收汇',
                //     'size': 'medium',  //可选 默认为medium  取值范围 x-small small medium large x-large xx-large
                //     'options': []
                // },
                // {
                //     'key': 'billingStatus',
                //     'label': '发票',
                //     'size': 'medium',  //可选 默认为medium  取值范围 x-small small medium large x-large xx-large
                //     'options': []
                // }
            ],
            list: [],
            selectionRows: [],
            foreignExchangePopup:false,//关联外汇
            orderInfoRelation:{
                exchangeStatus:null
            },
            param:{
                payNo:null,
                currency: null,
                id:null
            },
            activeName:"first",
            base: {
				customsPortMap: {},
				orderStatusMap: {},
				exchangeStatusMap: {},
				invoiceStatusMap: {},
				cupboardTypeMap: {},
				priceProvisionMap: {},
				billingTypeMap: {},
				contractNumberTypeMap: {},
				packTypeMap: {},
				packClassMap: {},
				packExplainMap: {},
				yesOrNoMap: {}
            }
        }
    },
    methods: {
        //接口回调处理函数
        callbackFun(info,callback,existence){
            // if(Number(info.statusCode) === data.data.data.statusCode){
                callback ? callback(info):'';
                existence ? '':this.$refs.pageTmpl.refreshData();
            // }
        },
        createTimeFormatter(row){
            row.createTime = this.spliceDateFun(row.createTime);
        },
        //获取物流计划列表 vue文件中的方法
        async queryList(params) {
            let res = null;
            try {
                res = await this.ctx.models.taxrefund.list(params);
                for (let item of res.data.list) {
                    item.createTime && (item.createTime = item.createTime.split(' '));
                }
            } catch (err) {
                //交给框架处理的异常
                this.ctx.onerror(err);
            }
            return res;
        },
        // 页面初始化
        async init() {
            // 组件创建完后获取数据，
    		let base = await this.initBaseDictionary();
            console.log(base);
            this.comboSearch[6].options = base.logisticsType;
            // this.comboSearch[2].options = base.abroadCountries;
            // let tempOrderStatus = merge({}, base.orderStatus);
            // tempOrderStatus.shift();
            // this.quickFilter[0].options = tempOrderStatus;
            // this.quickFilter[1].options = base.exchangeStatus;
            // this.quickFilter[2].options = base.invoiceStatus;
            this.base = base;
        },

        // new up
        async searchList() {
            try {
                var renderData = await this.$nt.models.forecast.list({
                  "orderParam": [
                    {
                      "ascOrDesc": "string",
                      "orderBy": "string",
                      "orderIndex": 0
                    }
                  ],
                  "pageNo": 1,
                  "pageSize": 10,
                }, this.ctx);
                if (renderData.data.code === '200') {
                    this.list = renderData.data.data;
                }
            } catch (err) {
                //交给框架处理的异常
                this.ctx.onerror(err);
            }
        },

        // 请求提审接口
        async submitMutipleAudit(param) {
            if (!param) {
                param = this.selectionRows.map((row) => {
                    return row.id;
                });
            }
            try {
                const res = await this.ctx.models.forecast.mutipleAudit({ids: param});
                // 重新加载列表
                if (res.statusCode === '2000000') {
                    this.$refs.pageTmpl.refreshData();
                    // this.$alert('选中的收货预报已更新为“审核通过”！');
                    this.$message({
                        message: '选中的收货预报已更新为“审核通过”！',
                        type: 'warning'
                    });
                }
            } catch (err) {
                //交给框架处理的异常
                this.ctx.onerror(err);
            }
        },

        // 请求接口-驳回
        async submitMutipleReject(param) {
            if (!param) {
                param = this.selectionRows.map((row) => {
                    return row.id;
                });
            }
            try {
                const res = await this.ctx.models.forecast.mutipleReject({ids: param});
                // 重新加载列表
                if (res.statusCode === '2000000') {
                    this.$refs.pageTmpl.refreshData();
                }
            } catch (err) {
                //交给框架处理的异常
                this.ctx.onerror(err);
            }
        },
        // 选中行
        handleSelectionChange(rows) {
            this.selectionRows = rows;
        },

        // 列表刷新
        refreshList() {
            this.$refs.pageTmpl.refreshData();
        },
    },
    async created () {
        this.init();
    },
    mounted () {
    }
}
</script>
