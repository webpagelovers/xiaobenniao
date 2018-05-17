<template>
    <div class="vue-20180103">
        <template-search-list ref='pageTmpl' title='收汇管理' :simple='query.simple' :combo='query.comboSearch' :method='query.queryPlans' :filter='query.quickFilter'>
            <template slot='page-table-operations'>
            </template>
            <template slot="page-table"  scope="props">
            	<div class="contentBox">

					<nt-table  :data="props.tableData" class="border_layout" stripe tooltip-effect="dark" style="width: 100%" @selection-change="selectionChange" >
						<nt-table-column width="22"></nt-table-column>
						<nt-table-column label="用户名" min-width="80"  prop="userName"></nt-table-column>
						<nt-table-column label="付汇流水号" prop="payNo" show-overflow-tooltip></nt-table-column>
						<nt-table-column label="付款人" prop="payUser" show-overflow-tooltip></nt-table-column>
						<nt-table-column label="付汇账号" prop="payAccount"  min-width="80" show-overflow-tooltip></nt-table-column>
						<nt-table-column label="（申请）付汇金额" prop="applyAmount" sortable>
                            <template  scope="scope">{{scope.row.currency}}  {{scope.row.applyAmount}}</template>
                        </nt-table-column>
						<nt-table-column label="（实收）收汇金额" prop="receiptAmount" sortable>
                            <template  scope="scope">{{scope.row.receiptAmount && scope.row.currency}}  {{scope.row.receiptAmount}}</template>
                        </nt-table-column>
						<nt-table-column label="提交时间" sortable prop="createTime"></nt-table-column>
						<nt-table-column label="审核状态">
							<template scope="scope">
                                {{auditStatus._get(scope.row.status).label}}
                                <nt-tooltip class="item" effect="light" v-if="scope.row.status == auditStatus.reject.value" :content="scope.row.rejectReason || '空'" placement="top-start">
                                <i class="nt-icon-xbn-19 main_color"></i>
                                </nt-tooltip>
                            </template>
						</nt-table-column>
						<nt-table-column label="操作">
							<template scope="scope">
								<router-link :to="'/exchange/detail/'+scope.row.id" class="mR10">
									<nt-button type="text" size="small">详情</nt-button>
								</router-link>
									<nt-button v-if="scope.row.status == auditStatus.waitConfirm.value" type="text" size="small" @click="confirm(scope.row.id,scope.row.currency)">确认</nt-button>
									<nt-button v-if="scope.row.status == auditStatus.waitConfirm.value" type="text" size="small" @click="reject(scope.row.id)">驳回</nt-button>
							</template>
						</nt-table-column>
					</nt-table>

                </div>
            </template>
        </template-search-list>
        <reject-box :reject-id="rejectId" :reject-dialog-visible="rejectDialogVisible" @close="rejectDialogVisible=false;refresh()"></reject-box>
        <confirm-box :confirm-id="confirmId" :confirm-dialog-visible="confirmDialogVisible" :confirm-currency="confirmCurrency" @close="confirmDialogVisible=false;refresh()"></confirm-box>
    </div>
</template>

<script>
import { TemplateSearchList } from 'xbn-biz-components';
import {auditStatus} from '../models/status.js';
import rejectBox from './components/reject.vue';
import confirmBox from './components/confirm.vue';
export default {
    data() {
        var _this = this;
        return {
            auditStatus,
            list: [],//列表
            query: {
                simple: [
                    //用户名/付汇流水号/付款人/付汇账号
                    {
                        'value': 'userName',
                        'label': '用户名',
                        'placeholder': '请输入用户名'
                    },
                    {
                        'value': 'payNo',
                        'label': '付汇流水号',
                        'placeholder': '请输入付汇流水号'
                    },
                    
                    {       //普通文本
                        'value': 'payUser',
                        'label': '付款人',
                        'placeholder': '请输入付款人'
                    },
                    {       //普通文本
                        'value': 'payAccount',
                        'label': '付汇账号',
                        'placeholder': '请输入付汇账号'
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
                        'key': 'payNo',
                        'line': true,
                        'label': '付汇流水号',
                        'type': 'input'
                    },
                    {       //普通文本
                        'key': 'payUser',
                        'line': true,
                        'label': '付款人',
                        'type': 'input'
                    },
                    {       //普通文本
                        'key': 'payAccount',
                        'line': true,
                        'label': '付汇账号',
                        'type': 'input'
                    }
                ],
                quickFilter: [
                    {
                        'key': 'status',
                        'label': '审核状态',
                        'options': [
                            {'value': '', 'label': '审核状态' }
                        ].concat(auditStatus._array())
                    }
                ],
                queryPlans: async function(params) {
                    this.param=params.param;
                    const plans = await this.$nt.models.exchange.incomeListPage(params, this.ctx);
                    return plans;
                },
            },
            rejectId:0,
            rejectDialogVisible:false,
            confirmId:'', //确认ID
            confirmDialogVisible:false,//确认弹窗
            confirmCurrency:''//确认  货币单位
        }
    },
    mixins: [],

    components: {
        'template-search-list': TemplateSearchList,
        rejectBox,
        confirmBox
    },

    beforeCreate: function() {

    },

    created: async function() {
        //this.getList();
    },
    watch: {
    },
    methods: {
        selectionChange(){},
        incomeReject(){

        },
        reject(id){
            this.rejectId=id;
            this.rejectDialogVisible=true;
        },
        confirm(id,currency){
            this.confirmId = id;
            this.confirmCurrency = currency;
            this.confirmDialogVisible = true;
        },
        //刷新列表
        async refresh(){
            await this.$refs.pageTmpl.refreshData();
        }
    }
}
</script>


<style lang="less">
	.vue-20180103{
		.simpleSearch {
			.select {
				width: 130px;
			}
		}
	}
</style>
