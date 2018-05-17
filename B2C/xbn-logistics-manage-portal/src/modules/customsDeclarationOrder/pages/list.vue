<style lang="less" >

</style>
<template>
    <div>
        <template-search-list ref='pageTmpl' title='报关订单管理' :simple='simpleSearch' :combo='comboSearch'
                              :method='customOrderList' :filter='quickFilter'>
            <template slot='page-table-operations'>
                <nt-button type="primary"  @click="handleMakeVoucher(selectionRows)">生成预录凭单</nt-button>
                <nt-button type="primary"  @click="handleExportCustoms(selectionRows)">导出报关资料</nt-button>
                <nt-button type="primary"  @click="uploadInfoDialog = true">上传清关信息</nt-button>
            </template>

            <template slot='page-table' slot-scope='props' class='contentBox'>
                <div class='contentBox'>
                    <nt-table :data='props.tableData' @selection-change="handleSelectionChange" class="border_layout">
                        <nt-table-column type='selection' align="center"></nt-table-column>
                        <nt-table-column prop="customOrdersCode" label="报关订单编码" sortable width="160"></nt-table-column>
                        <nt-table-column prop="baoOrdersCode" label="装箱计划编码" sortable min-width="90"></nt-table-column>
                        <nt-table-column prop="headUpState" label="是否自抬头" sortable width="140">
                            <template slot-scope="scope">
                                {{ base.headUpStateMap[scope.row.headUpState]}}
                            </template>
                        </nt-table-column>
                        <nt-table-column prop="taxRefundState" label="是否退税" sortable>
                            <template slot-scope="scope">
                                {{ base.taxRefundStateMap[scope.row.taxRefundState]}}
                            </template>
                        </nt-table-column>
                        <nt-table-column prop="legalInspectionState" label="是否法检" sortable>
                            <template slot-scope="scope">
                                {{ base.legalInspectionStateMap[scope.row.legalInspectionState]}}
                            </template>
                        </nt-table-column>
                        <nt-table-column prop="cutOffTime" label="截关时间" sortable min-width="120"></nt-table-column>
                        <nt-table-column prop="state" label="状态" sortable min-width="100">
                            <template slot-scope="scope">
                                {{ base.orderStatusMap[scope.row.state]}}
                            </template>
                        </nt-table-column>
                        <nt-table-column prop="masterWaybillCode" label="提运单号">
                            <template slot-scope="scope">
                                <div  :title="scope.row.masterWaybillCode">主：{{scope.row.masterWaybillCode}}</div>
                                <div  :title="scope.row.salveWaybillCode">分：{{scope.row.salveWaybillCode}}</div>
                            </template>
                        </nt-table-column>
                        <nt-table-column  label="操作"  min-width="240">
                            <template slot-scope="scope">
                                <nt-button type="text" size="small" @click="routeTo({path: '/cusDecOrder/detail/' + scope.row.id})">详情</nt-button>
                                <nt-button type="text" size="small" v-if="scope.row.state == 2">修改</nt-button>
                                <nt-button type="text" size="small" v-if="scope.row.state == 2">生成预录凭单</nt-button>
                                <nt-button type="text" size="small" v-if="scope.row.state == 2">导出报关资料</nt-button>
                                <nt-button type="text" size="small" v-if="(scope.row.state == 2 && scope.row.taxRefundState == 1)">生成退税订单</nt-button>
                                <nt-button type="text" size="small" v-if="scope.row.state == 2">上传报关信息</nt-button>
                                <nt-button type="text" size="small" v-if="scope.row.state == 3">修改上传信息</nt-button>
                                <nt-button type="text" size="small" v-if="(scope.row.state == 4 || scope.row.state == 3)">下载单证资料</nt-button>
                                <nt-button type="text" size="small" v-if="scope.row.state == 2">删除</nt-button>
                            </template>
                        </nt-table-column>
                    </nt-table>
                </div>

            </template>
        </template-search-list>
    </div>
</template>

<script>
    import {TemplateSearchList} from 'xbn-biz-components'
    import common from '../models/common'
    import * as data from '../models/data'
    import merge from 'deepmerge'

    export default {
        components: {TemplateSearchList},
        mixins: [common],
        data() {
            return {
                simpleSearch: [
                    {
                        value: 'customOrdersCode',
                        label: '报关订单编码',
                        placeholder: '请输入报关订单编码'
                    },{
                        value: 'baoOrdersCode',
                        label: '装箱计划编码',
                        placeholder: '请输入装箱计划编码'
                    },{
                        value: 'masterWaybillCode',
                        label: '主提运单号',
                        placeholder: '请输入主提运单号'
                    },{
                        value: 'salveWaybillCode',
                        label: '分提运单号',
                        placeholder: '请输入分提运单号'
                    }
                ],
                comboSearch: [
                    {       //普通文本
                        key: 'customOrdersCode',
                        line: true,
                        label: '报关订单编码',
                        type: 'input'
                    }, {       //普通文本
                        key: 'baoOrdersCode',
                        line: true,
                        label: '装箱计划编码',
                        type: 'input'
                    },{                //下拉选项 如果options数据需要从服务器获取，需要vue组件route之前就得到
                        key: 'headUpState',
                        label: '是否自抬头',
                        line: true,
                        options: [
                            {
                                label: '是',
                                value: '1'
                            },
                            {
                                label: '否',
                                value: '2'
                            }
                        ],
                        type: 'select'
                    },{                //下拉选项 如果options数据需要从服务器获取，需要vue组件route之前就得到
                        key: 'taxRefundState',
                        label: '是否退税',
                        line: true,
                        options: [
                            {
                                label: '是',
                                value: '1'
                            },
                            {
                                label: '否',
                                value: '2'
                            }
                        ],
                        type: 'select'
                    },{                //下拉选项 如果options数据需要从服务器获取，需要vue组件route之前就得到
                        key: 'legalInspectionState',
                        label: '是否法检',
                        line: true,
                        options: [
                            {
                                label: '是',
                                value: '1'
                            },
                            {
                                label: '否',
                                value: '2'
                            }
                        ],
                        type: 'select'
                    },{                  //数字范围
                        key: 'cutOffTime',
                        label: '截关时间',
                        type: 'numberquery'
                    },{                //下拉选项 如果options数据需要从服务器获取，需要vue组件route之前就得到
                        key: 'state',
                        label: '状态',
                        line: true,
                        options: [],
                        type: 'select'
                    }, {       //普通文本
                        key: 'masterWaybillCode',
                        line: true,
                        label: '提运单号',
                        type: 'input'
                    }
                ],
                quickFilter:   [
                    {
                        key: 'state',
                        label: '订单状态',
                        size: 'medium',  //可选 默认为medium  取值范围 x-small small medium large x-large xx-large
                        options: [
                            {'id': 1, 'logisticsType': '待报关', 'value': 2, 'label': '待报关'},
                            {'id': 2, 'logisticsType': '报关完成', 'value': 3, 'label': '报关完成'},
                            {'id': 3, 'logisticsType': '清关完成', 'value': 4, 'label': '清关完成'}
                        ]
                    }
                ],
                selectionRows:null,
                base:{
                    headUpStateMap:{
                        1:'是',
                        2:'否'
                    },
                    taxRefundStateMap:{
                        1:'是',
                        2:'否'
                    },
                    legalInspectionStateMap:{
                        1:'是',
                        2:'否'
                    },
                },
                uploadInfoDialog:false,
            }
        },
        computed:{},

        created () {
            this.getEnumList();
        },

        methods: {
            refreshList(){
                this.$refs.pageTmpl.refreshData();
            },
            //接口回调处理函数
            callbackFun(info,callback,existence){
                if(Number(info.statusCode) === data.data.data.statusCode){
                    callback ? callback(info):'';
                    existence ? '':this.$refs.pageTmpl.refreshData();
                }
            },

            //报关订单列表数据
            async customOrderList(params) {
                try {
                    const res = await this.ctx.models.cusDecOrder.getListByPage(params);
                    return res;
                } catch (err) {
                    //交给框架处理的异常
                    this.ctx.onerror(err);
                }
            },
            //获取枚举
            async getEnumList() {
                try {
                    const res = await this.ctx.models.cusDecOrder.getEnum();
                    if(res) {
                        this.base = merge(this.base, res);
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

            //批量操作
            batchOperation(data,str,func){
                let res, parm = [],d=false;
                if(this.$nt.isArray(data)){
                    res = data.length;
                    data.forEach((v)=>{
                        if(v.state !==2){
                            d = true;
                            return ;
                        }
                        parm.push(v.id);
                    })
                }else{
                    res = data;
                    if(res.state !==2){
                        d = true;
                    }

                    parm = res.id;
                }
                if(res){
                    if(d){
                        this.$message({
                            showClose: true,
                            message: '无法'+ str +'状态不是“待报关”的报关订单。',
                            type: 'error'
                        });
                    }else{
                        func();
                    }
                }else{
                    this.$message({
                        showClose: true,
                        message: '请选择报关订单',
                        type: 'error'
                    });
                }
            },

            handleMakeVoucher(data){

                let func = async () => {
                    /*try {
                        let res;
                        if(this.$nt.isArray(data)){
                            res = await this.ctx.models.taxrefund.batchPassList(param);
                        }else{
                            res = await this.ctx.models.taxrefund.batchPass(param);
                        }

                        let callback = (info) =>{
                            this.$message({ showClose: true, message: '选中的报关订单已生成预录凭单成功！', type: 'success'});
                        };

                        this.callbackFun(res,callback,true);

                    } catch (err) {
                        //交给框架处理的异常
                        this.ctx.onerror(err);
                    }*/
                };

                this.batchOperation(data,'生成',func)
            },

            handleExportCustoms(data){

            },


        }
    }
</script>
