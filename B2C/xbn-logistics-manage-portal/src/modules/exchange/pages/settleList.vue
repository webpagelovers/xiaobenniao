<template>
    <div>
        <template-search-list ref='pageTmpl' title='结汇管理' :simple='query.simple' :combo='query.comboSearch' :method='query.queryPlans' :filter='query.quickFilter'>
            <template slot='page-table-operations'>
            </template>
            <template slot="page-table"  scope="props">
            	<div class="contentBox">

	            <nt-table  :data="props.tableData" stripe tooltip-effect="dark" style="width: 100%" @selection-change="selectionChange" class="border_layout" >
					<nt-table-column width="22"></nt-table-column>
					<nt-table-column label="结汇时间点" min-width="80" sortable show-overflow-tooltip>
	                    <template scope="scope">{{scope.row.settleRateInfo}}</template>
	                </nt-table-column>
	                <nt-table-column label="结汇方式" prop="settleModel" show-overflow-tooltip>
	                    <template scope="scope">{{settleModelStatus._get(scope.row.settleModel).label }}</template>
	                </nt-table-column>
	                <nt-table-column label="币种/收汇金额 " sortable prop="commodityCode" show-overflow-tooltip>
	                    <template scope="scope">{{ scope.row.currency }} {{ scope.row.applyAmount }}</template>
	                </nt-table-column>
	                <nt-table-column label="结汇金额" min-width="80" show-overflow-tooltip>
	                    <template scope="scope">{{scope.row.settleAmount && 'CYN'}} {{ scope.row.settleAmount }}</template>
	                </nt-table-column>
	                <nt-table-column label="用户名" show-overflow-tooltip>
	                    <template scope="scope">{{ scope.row.userName }}</template>
	                </nt-table-column>
	                <nt-table-column label="付款人" show-overflow-tooltip>
	                    <template scope="scope">{{ scope.row.payUser }}</template>
	                </nt-table-column>
	                <nt-table-column label="提交时间" sortable>
	                    <template scope="scope">{{ scope.row.settleApplyTime }}</template>
	                </nt-table-column>
	                <nt-table-column label="结汇状态">
	                    <template scope="scope">{{ settleStatus._get(scope.row.settleStatus).label }}</template>
	                </nt-table-column>
	                <nt-table-column label="操作">
	                    <template scope="scope">
	                        <nt-button type="text" size="small" v-if="scope.row.settleStatus == settleStatus.settleing.value" @click="confirmSettle(scope.row.id)" style="margin-right: 10px">确认结汇</nt-button>
	                        <router-link :to="'/exchange/detail/'+scope.row.id">
	                            <nt-button type="text" size="small">详情</nt-button>
	                        </router-link>
	                    </template>
	                </nt-table-column>
	            </nt-table>

                </div>
            </template>
        </template-search-list>
        <confirm-settle-box :confirm-settle-id="confirmSettleId" :confirm-settle-dialog-visible="confirmSettleDialogVisible" @close="confirmSettleDialogVisible=false;refresh()"></confirm-settle-box>
    </div>
</template>

<script>
import { TemplateSearchList } from 'xbn-biz-components';
import {auditStatus,settleStatus,settleModelStatus} from '../models/status.js';
import confirmSettleBox from './components/confirmSettle.vue';

export default {
    data() {
        var _this = this;
        return {
            settleStatus,
            settleModelStatus,
            list: [],//列表
            query: {
                //用户名/付款人/提交时间/收汇金额
                simple: [
                    {
                        'value': 'userName',
                        'label': '用户名',
                        'placeholder': '请输入用户名'
                    },
                    {
                        'value': 'payUser',
                        'label': '付款人',
                        'placeholder': '请输入付款人'
                    },
                    
                    // {       //普通文本
                    //     'value': 'settleApplyTime',
                    //     'label': '提交时间',
                    //     'placeholder': '请输入提交时间'
                    // },
                    {       //普通文本
                        'value': 'receiptAmount',
                        'label': '收汇金额',
                        'placeholder': '请输入收汇金额'
                    }
                ],
                comboSearch: [ 
                    {       //普通文本
                        'key': 'userName',
                        'line': true,
                        'label': '用户名',
                        'type': 'input'
                    },
                    {       //普通文本
                        'key': 'payUser',
                        'line': true,
                        'label': '付款人',
                        'type': 'input'
                    },
                    {       //普通文本
                        'key': 'settleApplyTime',
                        'line': true,
                        'label': '提交时间',
                        'type': 'timequery'
                    },
                    {       //普通文本
                        'key': 'receiptAmount',
                        'line': true,
                        'label': '收汇金额',
                        'type': 'input'
                    }
                ],
                quickFilter: [
                    {
                        'key': 'settleModel',
                        'label': '结汇方式',
                        'options': [
                            {'value': '', 'label': '结汇方式' }
                        ].concat(settleModelStatus._array())
                    },
                    {
                        'key': 'currency',
                        'label': '外汇币种',
                        'options': [
                            {'value': '', 'label': '外汇币种' }
                        ]
                    },
                    {
                        'key': 'settleStatus',
                        'label': '结汇状态',
                        'options': [
                            {'value': '', 'label': '结汇状态' }
                        ].concat(settleStatus._array())
                    }
                ],
                queryPlans: async function(params) {
                    this.param=params.param;
                    const plans = await this.$nt.models.exchange.settlementListPage(params, this.ctx);
                    return plans;
                },
            },
			confirmSettleId:'',
			confirmSettleDialogVisible:false
        }
    },
    mixins: [],

    components: {
        'template-search-list': TemplateSearchList,
        confirmSettleBox
    },

    beforeCreate: function() {

    },

    created: async function() {
        //this.getList();
        //获取币种
        this.customsCurrencyEnum = await this.$nt.models.exchange.getCustomsCurrencyEnum({}, this.ctx);
        this.query.quickFilter[1].options = this.customsCurrencyEnum;
    },
    watch: {
    },
    methods: {
        selectionChange(){},
		confirmSettle(id){
			this.confirmSettleId = id;
			this.confirmSettleDialogVisible = true;
		},
        //刷新列表
        async refresh(){
            await this.$refs.pageTmpl.refreshData();
        }
    }
}
</script>


<style lang="less">
</style>
