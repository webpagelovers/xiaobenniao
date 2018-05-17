<style scoped>
    .block {
        display: block;
    }
    .keep { word-break: keep-all;}
</style>
<template>
<div>
    <template-search-list ref='pageTmpl' title='退税订单管理' :simple='simpleSearch' :combo='comboSearch'
        :method='queryList' :filter='quickFilter'>
        <template slot='page-table-operations'>
            <nt-button type="primary" nt-col-offset-0 @click="clickCancelOrder">取消订单</nt-button>
        </template>

        <template slot='page-table' slot-scope='props' class='contentBox'>
            <div class='contentBox'>
                <nt-table :data='props.tableData' @selection-change="handleSelectionChange" class="border_layout">
                    <nt-table-column type='selection' align="center"></nt-table-column>
                    <nt-table-column prop="taxRefundOrderCode" label="退税订单编码" width="160"></nt-table-column>
                    <nt-table-column prop="userName" label="用户名"></nt-table-column>
                    <nt-table-column prop="createTime" label="下单时间" min-width="90">
                        <template slot-scope="scope">
                            <span class="keep">{{scope.row.createTime}}</span>
                            <!-- <span class="keep">{{scope.row.createTime[1]}}</span> -->
                        </template>
                    </nt-table-column>
                    <nt-table-column prop="status" label="退税订单状态">
                        <template slot-scope="scope">
                            {{base.orderStatusMap[scope.row.status]}}
                            <nt-tooltip class="item" effect="dark" v-if="scope.row.status === 12 || scope.row.status === 13" placement="right">
                                <i class="nt-icon-xbn-19 main_color"></i>
                                <div slot="content">
                                    <span v-if="scope.row.status === 12" class="block">驳回原因：{{scope.row.rejectionReason}}</span>
                                    <span v-if="scope.row.status === 13" class="block">取消原因：{{scope.row.cancelReason}}</span>
                                </div>
                            </nt-tooltip>
                        </template>
                    </nt-table-column>
                    <!-- <nt-table-column prop="customsPort" label="报关口岸" >
                        <template slot-scope="scope">
                            {{base.customsPortMap[scope.row.customsPort]}}
                        </template>
                    </nt-table-column> -->
                    <nt-table-column prop="destinationCountry" label="最终目的国" show-overflow-tooltip></nt-table-column>
                    <nt-table-column label="订单总价">
                        <template slot-scope="scope">
                            <span class="block">{{scope.row.totalCommidityValue}} {{scope.row.currency}}</span>
                        </template>
                    </nt-table-column>
                    <nt-table-column prop="exchangeStatus" label="收汇">
                        <template slot-scope="scope">
                            {{base.exchangeStatusMap[scope.row.exchangeStatus]}}
                        </template>
                    </nt-table-column>
                    <nt-table-column prop="billingStatus" label="发票">
                        <template slot-scope="scope">
                            {{base.invoiceStatusMap[scope.row.billingStatus]}}
                        </template>
                    </nt-table-column>
                    <!--<nt-table-column prop="merchantRemark" label="备注" show-overflow-tooltip>-->
                    <!--</nt-table-column>-->
                    <nt-table-column  label="操作">
                        <template slot-scope="scope">
                            <router-link v-if="scope.row.status === 1" class="nt-button nt-button--text nt-button--small"
                                :to="{ path: '/taxrefund/details/' + scope.row.id + '/confirm'}">
                                <nt-button type="text" size="small">确认</nt-button>
                            </router-link>
                            <nt-button type="text" size="small" v-if="scope.row.status === 3" @click="clickRelatedForeignExchange(scope.row, 'isList')">关联外汇</nt-button>
                            <nt-button type="text" size="small" v-if="scope.row.status === 3" @click="clickConfirmForeignExchange(scope.row, 'isList')">确认外汇收齐</nt-button>
                            <nt-button type="text" size="small" v-if="scope.row.status === 4"
                                @click="clickInputInvoiceInfo(scope.row, 'isList')">录入发票信息</nt-button>
                            <nt-button type="text" size="small" v-if="scope.row.status === 4"
                                @click="clickIsInvestigate(scope.row.id, 'isList')">是否被函调</nt-button>
                            <nt-button type="text" size="small" v-if="scope.row.status === 5"
                                @click="clickIsInvestigateComplete(scope.row.id, 'isList')">函调是否完成</nt-button>
                            <nt-button type="text" size="small" v-if="scope.row.status === 7"
                                @click="clickInputRefundInfo(scope.row, 'isList')">录入退税信息</nt-button>
                            <router-link class="nt-button nt-button--text nt-button--small"
                                :to="{ path: '/taxrefund/details/' + scope.row.id}">
                                <nt-button type="text" size="small">详情</nt-button>
                            </router-link>
                            <nt-button type="text" size="small"
                                @click="updateRemark(scope.row, 'isList')">备注</nt-button>


                            <!-- <nt-button type="text" size="small" v-if="scope.row.status === 4"
                                @click="clickSeeEntrustment(scope.row, 'isList')">查看委托函</nt-button>
                            <nt-button type="text" size="small" v-if="scope.row.status === 5"
                                @click="clickConfirmAddInfo(scope.row, 'isList')">确认补充信息</nt-button>
                            <nt-button type="text" size="small" v-if="scope.row.status === 6"
                                @click="clickUploadCostome(scope.row, 'isList')">上传报关单证</nt-button> -->
                      </template>
                    </nt-table-column>
                </nt-table>
            </div>
        </template>
    </template-search-list>
    <!-- 以下弹出框 -->
    <!-- 备注弹出框 -->
    <UpdateRemarkOrReject ref="updateRemarkDialog"></UpdateRemarkOrReject>
    <!-- 发货弹出框 -->
    <isInvestigate ref="isInvestigateDialog"></isInvestigate>
    <isInvestigateComplete ref="isInvestigateCompleteDialog"></isInvestigateComplete>
    <!-- 上传报关单证 -->
    <UploadCustomsDocuments ref="uploadCostom"></UploadCustomsDocuments>
    <!-- 确认补充信息 -->
    <ConfirmAddInfo ref="confirmAddInfo"></ConfirmAddInfo>
    <!-- 录入发票信息 -->
    <InputInvoiceInfo ref="inputInvoice"></InputInvoiceInfo>
    <!-- 录入发票信息 -->
    <InputRefundInfo ref="inputRefund"></InputRefundInfo>
    <nt-dialog title="关联外汇" :visible.sync="foreignExchangePopup" size="small">
                <div>
                    <nt-row class="padT_padB16 border_outer border_top3 mB15" >
                        <nt-col :span="12" align="center" class="pT15">
                            <div class="main_color f24"><span>{{orderInfoRelation.currency}}</span><span>{{orderInfoRelation.totalCommidityValue}}</span></div>
                            <div>总金额</div>
                        </nt-col>
                        <nt-col :span="12" >
                            <nt-col :span="12">
                            <!--<nt-progress type="circle" width="65"  :percentage="orderInfoRelation.percentage" :show-text="false" v-if="orderInfoRelation.percentage"></nt-progress>-->
                                <nt-progress  :percentage="orderInfoRelation.percentage" :show-text="false" v-if="orderInfoRelation.percentage"></nt-progress>
                                <div class="mB5 mT8" ><i class="round bg_f1b62c mR8"></i>已关联：<span class="col_f3bc19">{{orderInfoRelation.linkedAmount}}</span><span v-if="orderInfoRelation.linkedAmount" class="col_f3bc19">{{orderInfoRelation.currency}}</span></div>
                                <div ><i class="round bg_317dff mR8"></i>未关联：<span class="main_color">{{orderInfoRelation.waitLinkedAmount}}</span><span class="main_color">{{orderInfoRelation.currency}}</span></div>
                            </nt-col>

                        </nt-col>
                    </nt-row>
                    <nt-row>
                        <nt-input v-model="param.payNo" type="text"  :maxlength="30" class="w370" placeholder="付款流水号"></nt-input>
                        <nt-button type="primary" size="small" @click="searchPayNo">搜索</nt-button>
                    </nt-row>
                    <nt-tabs v-model="activeName" @tab-click="handleTabClick">
                        <nt-tab-pane label="关联外汇" name="first">
                            <nt-table :data="base.foreignExchangeList" class="dialog_table">
                                <nt-table-column prop="payNo" label="付汇流水号"></nt-table-column>
                                <nt-table-column prop="payUser" label="付款人"></nt-table-column>
                                <nt-table-column prop="payAccount" label="付汇账号"></nt-table-column>
                                <nt-table-column prop="receiptAmount" label="外汇金额"></nt-table-column>
                                <nt-table-column prop="createTime" label="提交时间" width="127px">
                                    <template scope="scope">
                                        <span :filter-method="createTimeFormatter(scope.row)">{{scope.row.createTime}}</span>
                                    </template>
                                </nt-table-column>
                                <nt-table-column prop="relevancyAmount" label="已关联金额">
                                    <template scope="scope">
                                        <span>{{scope.row.relevancyAmount}}</span>
                                        <span v-if="scope.row.relevancyAmount">{{scope.row.currency}}</span>
                                    </template>
                                </nt-table-column>
                                <nt-table-column prop="remainAmount" label="关联金额" width="200px">
                                    <template scope="scope">
                                        <span>{{scope.row.currency}}</span>
                                        <nt-input class="w140" v-model.number="scope.row.remainAmount" :maxlength="20" @keyup.native="changeNumber(scope.row)" @keydown.native="changeNumber(scope.row)" @blur="addAutomaticZero(scope.row)"></nt-input>
                                    </template>
                                </nt-table-column>
                            </nt-table>
                        </nt-tab-pane>
                        <nt-tab-pane label="关联记录" name="second">
                            <nt-table :data="base.linkedOrderList" ref='linkedOrderList' class="dialog_table">
                                <nt-table-column prop="payNo" label="付汇流水号"></nt-table-column>
                                <nt-table-column prop="payUser" label="付款人"></nt-table-column>
                                <nt-table-column prop="payAccount" label="付汇账号"></nt-table-column>
                                <nt-table-column prop="receiptAmount" label="外汇金额"></nt-table-column>
                                <nt-table-column prop="linkTime" label="提交关联时间">
                                    <template scope="scope">
                                        <span :filter-method="linkTimeFormatter(scope.row)">{{scope.row.linkTime}}</span>
                                    </template>
                                </nt-table-column>
                                <nt-table-column prop="amount" label="关联金额">
                                    <template scope="scope">
                                        <span>{{scope.row.amount}}</span>
                                        <span v-if="scope.row.amount">{{scope.row.currency}}</span>
                                    </template>
                                </nt-table-column>
                                <nt-table-column prop="settleStatus" label="结汇状态">
                                    <template scope="scope">
                                        <span :filter-method="settleStatusFormatter(scope.row)">{{scope.row.settleStatusChange}}</span>
                                    </template>
                                </nt-table-column>
                                <nt-table-column label="操作">
                                    <template scope="scope">
                                        <div v-if="scope.row.settleStatus === 1 && orderInfoRelation.exchangeStatus ===1">
                                            <nt-button type="text" size="small" @click="cancleLink(scope.row, 'isList')">取消关联</nt-button>
                                        </div>
                                    </template>
                                </nt-table-column>
                            </nt-table>
                        </nt-tab-pane>
                    </nt-tabs>
                </div>
                <span slot="footer" class="dialog-footer">
                    <nt-button type="primary" size="small" @click="saveLinkedOrder">保存</nt-button>
                    <nt-button type="primary" size="small" @click="foreignExchangePopup = false">取消</nt-button>
                </span>
            </nt-dialog>
</div>
</template>

<script>
import {TemplateSearchList} from 'xbn-biz-components';
import merge from 'deepmerge';
import common from './../models/common.js';
import UpdateRemarkOrReject from './../components/UpdateRemarkOrReject.vue';
// import Audit from './../components/audit.vue';
import UploadCustomsDocuments from './../components/upload-customs-documents.vue';
import ConfirmAddInfo from './../components/confirm-add-info.vue';
import InputInvoiceInfo from './../components/input-invoice-info.vue';
import InputRefundInfo from './../components/input-refund-info.vue';
import isInvestigate from './../components/is-investigate.vue';
import isInvestigateComplete from './../components/is-investigate-complete.vue';


import {Progress} from 'nt-element'

export default {
    components: {
        'nt-progress':Progress,
        TemplateSearchList,
        UpdateRemarkOrReject,
        isInvestigate,
        isInvestigateComplete,
        UploadCustomsDocuments,
        ConfirmAddInfo,
        InputInvoiceInfo,
        InputRefundInfo
    },
    mixins: [common],
    data() {
        return {
            simpleSearch: [
                {
                    value: 'taxRefundOrderCode',
                    label: '退税订单编码',
                    placeholder: '请输入退税订单编码'
                }
            ],
            comboSearch: [
                {       //普通文本
                    key: 'taxRefundOrderCode',
                    line: true,
                    label: '退税订单编码',
                    type: 'input'
                },
                {                //下拉选项 如果options数据需要从服务器获取，需要vue组件route之前就得到
                    key: 'customsPort',
                    label: '报关口岸',
                    line: true,
                    options: [],
                    type: 'select'
                },
                {                //下拉选项 如果options数据需要从服务器获取，需要vue组件route之前就得到
                    key: 'destinationCountryId',
                    label: '最终目的国',
                    line: true,
                    options: [],
                    type: 'select'
                },
                {                  //数字范围
                    'key': 'totalCommidityValue',
                    'label': '订单总货值',
                    'type': 'numberquery'
                },
                {
                    key: 'createTime',
                    label: '下单时间',
                    type: 'timequery'
                }
            ],
            quickFilter: [
                {
                    'key': 'status',
                    'label': '订单状态',
                    'size': 'medium',  //可选 默认为medium  取值范围 x-small small medium large x-large xx-large
                    'options': []
                },
                {
                    'key': 'exchangeStatus',
                    'label': '收汇',
                    'size': 'medium',  //可选 默认为medium  取值范围 x-small small medium large x-large xx-large
                    'options': []
                },
                {
                    'key': 'billingStatus',
                    'label': '发票',
                    'size': 'medium',  //可选 默认为medium  取值范围 x-small small medium large x-large xx-large
                    'options': []
                }
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
                // for (let item of res.data.list) {
                //     item.createTime && (item.createTime = item.createTime.split(' '));
                // }
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
            this.comboSearch[1].options = base.customsPort;
            this.comboSearch[2].options = base.abroadCountries;
            let tempOrderStatus = merge({}, base.orderStatus);
            tempOrderStatus.shift();
            this.quickFilter[0].options = tempOrderStatus;
            this.quickFilter[1].options = base.exchangeStatus;
            this.quickFilter[2].options = base.invoiceStatus;
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
