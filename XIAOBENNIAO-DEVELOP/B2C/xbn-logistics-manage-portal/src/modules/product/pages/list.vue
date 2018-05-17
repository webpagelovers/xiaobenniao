<template>
    <div>
        <template-search-list ref='pageTmpl' title='产品管理' :simple='query.simple' :combo='query.comboSearch' :method='query.queryPlans' :filter='query.quickFilter'>
            <template slot='page-table-operations'>
                <nt-dropdown>
                    <nt-button type="primary">
                        补充清关信息
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </nt-button>
                    <nt-dropdown-menu slot="dropdown">
                        <nt-dropdown-item>
                            <span @click="exportDialogVisible = true">导出商品</span>
                        </nt-dropdown-item>
                        <nt-dropdown-item>
                            <span @click="handleBatchImport">导入商品</span>
                        </nt-dropdown-item>
                    </nt-dropdown-menu>
                </nt-dropdown>
            </template>
            <template slot="page-table" scope="props">
                <div class="contentBox">
                    <nt-table class="border_layout" :data="props.tableData" stripe tooltip-effect="dark" style="width: 100%" @selection-change="selectionChange">
                        <nt-table-column width="27"></nt-table-column>
                        <nt-table-column label="产品图片" min-width="80">
                            <template scope="scope">
                                <nt-popover placement="right" trigger="click" popper-class="__nt-popover" v-if="scope.row.merchantPhoto">
                                    <img v-bind:src="scope.row.merchantPhoto" v-bind:alt="scope.row.title" style="max-width:350px;max-height:350px;" />
                                    <img v-bind:src="scope.row.merchantPhoto" slot="reference" v-bind:alt="scope.row.title" class="border_outer block" width="78" height="78" />
                                </nt-popover>
                                <img v-if="!scope.row.merchantPhoto" src="../images/no.jpg" v-bind:alt="scope.row.title" class="border_outer block" width="78" height="78" />
                            </template>
                        </nt-table-column>
                        <nt-table-column label="产品编码" prop="commodityCode" sortable>
                            <template scope="scope">
                                {{ scope.row.commodityCode }}
                            </template>
                        </nt-table-column>
                        <nt-table-column label="用户名" prop="cfUserName" show-overflow-tooltip sortable></nt-table-column>
                        <nt-table-column label="创建时间" prop="createTime" show-overflow-tooltip sortable></nt-table-column>
                        <nt-table-column label="商家SKU" prop="merchantSku" min-width="80" show-overflow-tooltip sortable></nt-table-column>
                        <nt-table-column label="产品名称" prop="commodityName" min-width="80" show-overflow-tooltip sortable></nt-table-column>
                        <nt-table-column label="规格型号" prop="specsModel" show-overflow-tooltip sortable></nt-table-column>
                        <nt-table-column label="报关海关编码" prop="hsCode" show-overflow-tooltip sortable></nt-table-column>
                        <nt-table-column label="产品状态" prop="status" sortable>
                            <template scope="scope">
                                {{ commodityStatus.get(scope.row.status).label }}
                                <nt-tooltip placement="top" v-if="scope.row.status==commodityStatus.auditFailed.value">
                                    <div slot="content">{{scope.row.rejectReason}}</div>
                                    <i class="nt-icon-xbn-19 main_color "></i>
                                </nt-tooltip>
                            </template>
                        </nt-table-column>
                        <nt-table-column label="操作">
                            <template scope="scope">
                                <router-link :to="'/commodity/detail/'+scope.row.id+''" class="mR10">
                                    <nt-button type="text" size="small">详情</nt-button>
                                </router-link>
                                <router-link v-if="scope.row.status == commodityStatus.unAudit.value || scope.row.status == commodityStatus.supplyInformation.value" :to="'/commodity/audit/'+scope.row.id+''" class="mR10">
                                    <nt-button type="text" size="small">审核</nt-button>
                                </router-link>
                            </template>
                        </nt-table-column>
                    </nt-table>
                </div>
            </template>
        </template-search-list>
        <!-- 导出产品 -->
        <nt-dialog title="提示" :visible.sync="exportDialogVisible" width="30%" @before-close="exportDialogVisible = false">
            <div>
                <nt-form label-width="150px" class="contentBox" ref="form-export" :model="exportModel">
                    <nt-form-item label="创建时间：" prop="merchantSku">
                        <nt-date-picker v-model="exportModel.beginTime" type="date" placeholder="选择日期时间">
                        </nt-date-picker>-
                        <nt-date-picker v-model="exportModel.endTime" type="date" placeholder="选择日期时间">
                        </nt-date-picker>
                    </nt-form-item>
                    <nt-form-item label="最终目的国(地区)：" prop="country" :rules="
					[{ required: true, message: '请选择目的国', trigger: 'blur' }]
				">
                        <nt-select v-model="exportModel.country" placeholder="请选择">
                            <nt-option v-for="item in countryEnum.array()" :key="item.value" :label="item.label" :value="item.value"></nt-option>
                        </nt-select>
                    </nt-form-item>
                </nt-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <nt-button type="primary" @click="exportCommodity">确 定</nt-button>
                <nt-button @click="exportDialogVisible = false">取 消</nt-button>
            </span>
        </nt-dialog>
        <!--导入插件-->
        <batch-import title="导入" :uploadUrl="uploadApi" ref="importDialog" @imported="importSuccess">
            <!--<p class="lh22">请将产品信息填入《产品上传模板》，然后通过以下方式上传。</p>
             <p class="col_317dff lh22">
                <a :href="downloadTempApi" class="col_317dff" download>获取《产品上传模板》</a>
            </p> -->
        </batch-import>
    </div>
</template>

<script>
import Enum from '../models/enum.js';
import { commodityStatus } from '../models/status.js';
import checkAjaxData from '../models/checkAjaxData.js';
import { TemplateSearchList, BatchImport } from 'xbn-biz-components';
export default {
    data() {
        var _this = this;
        var popoverModel = {
            disabled: true,
            html: '',
            confirm: function () { },
            cancel: function () { this.disabled = true; }
        };
        return {
            tipSubmit: false,//提审确认
            popoverDeleteSelected: Object.assign({}, popoverModel),
            deletePopoverShow: false,
            tipReSubmit: false,
            commodityStatus,
            selectedList: [],//已选择的产品列表
            list: [],//产品列表
            param: {
                "commodityCode": "",
                "countryId": 0,
                "ebayAccount": "",
                "ebayItemId": "",
                "ebaySku": "",
                "ids": [],
                "merchantName": "",
                "merchantSku": "",
                //"status": 0,
                "title": "",
                //"userId": 0
            },
            query: {
                simple: [
                    {
                        'value': 'commodityName',
                        'label': '产品名称',
                        'placeholder': '请输入产品名称'
                    },
                    {
                        'value': 'commodityCode',
                        'label': '产品编码',
                        'placeholder': '请输入产品编码'
                    },
                    {
                        'value': 'hsCode',
                        'label': '报关海关编码',
                        'placeholder': '请输入报关海关编码'
                    },
                    {
                        'value': 'merchantSku',
                        'label': '商家SKU',
                        'placeholder': '请输入商家SKU'
                    }
                ],
                comboSearch: [
                    {
                        'key': 'commodityCode',
                        'line': true,
                        'label': '产品编码',
                        'type': 'input'
                    },
                    {
                        'key': 'cfUserName',
                        'line': true,
                        'label': '用户名',
                        'type': 'input'
                    },
                     {                  
                        'key': 'createTime',
                        'label': '创建时间',
                        'type': 'timequery'
                    },
                    {
                        'key': 'merchantSku',
                        'line': true,
                        'label': '商家SKU',
                        'type': 'input'
                    },
                    {
                        'key': 'commodityName',
                        'line': true,
                        'label': '产品名称',
                        'type': 'input'
                    },
                    {
                        'key': 'specsModel',
                        'line': true,
                        'label': '规格型号',
                        'type': 'input'
                    },
                    {
                        'key': 'hsCode',
                        'line': true,
                        'label': '报关海关编码',
                        'type': 'input'
                    },
                    {
                        'key': 'status',
                        'line': true,
                        'label': '状态',
                        'type': 'select',
                        'options':[
                            //{'value': '', 'label': '审核状态' }
                        ].concat(commodityStatus.array())
                    }
                ],
                quickFilter: [
                    {
                        'key': 'status',
                        'label': '审核状态',
                        'options': [
                            //{'value': '', 'label': '审核状态' }
                        ].concat(commodityStatus.array())
                    }
                ],
                queryPlans: async function (params) {
                    this.param = params.param;
                    const plans = await this.$nt.models.product.listPage(params, this.ctx);
                    return plans;
                },
            },
            exportDialogVisible: false,//导出商品弹窗
            exportModel: {
                beginTime: '',
                endTime: '',
                country: ''
            },//导出商品model
            uploadApi: this.ctx.servers.default.options.baseURL + '/gcfsCommodityAdmin/batchUploadCommodity',
            countryEnum: new Enum()
        }
    },
    mixins: [],

    components: {
        'template-search-list': TemplateSearchList,
        BatchImport
    },

    beforeCreate: function () {

    },

    created: async function () {
        var EbayEnumData = await this.$nt.models.product.getEbayEnumData({}, this.ctx);
        this.countryEnum = EbayEnumData.countryEnum;
        //this.getList();
        //var data =  await this.$nt.models.product.getCountryEnum({}, this.ctx);
        //debugger
    },
    watch: {
    },
    methods: {
        selectionChange: function (val) {
            this.selectedList = val;
        },
        handleSizeChange() { },
        handleCurrentChange(pageNo) {
            if (this.param.pageNo != pageNo) {
                this.param.pageNo = pageNo;
                this.getList();
            }
        },
        //导出产品
        async exportCommodity(e) {
            this.$refs["form-export"].validate(async (valid) => {
                if (valid) {
                    let params = this.exportModel;
                    await this.ctx.servers.default.postFrom(
                        this.ctx.servers.default.options.baseURL + '/gcfsCommodityAdmin/exportCommodity',
                        { "json": JSON.stringify(params) },
                        { "token": this.ctx.authentication.getToken() }
                    );
                    this.exportDialogVisible = false;
                }
            });
        },
        //打开导入产品串口
        handleBatchImport: function () {
            this.$refs.importDialog.show();
        },
        importSuccess: function () {
            this.$refs.pageTmpl.refreshData();
        },
    }
}
</script>


<style lang="less">
.nt-pagination {
    text-align: center;
}

.border_outer {
    border: 1px solid #eaeaea;
}
    //popover 组件基础样式被意外修改，这里还原基础样式 
    .__nt-popover{
        padding-bottom: 16px;
        width:auto;
        min-width: 250px;
    }
</style>
