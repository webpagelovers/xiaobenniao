<template>
    <div class="dialogBox">
        <nt-dialog title="添加产品到报关订单" size="small" :visible.sync="isShow" :close-on-click-modal="false" >
            <nt-tooltip class="item title-tooltip" effect="dark"  content="列表中只显示当前装箱计划中尚未加入报关订单的产品。" placement="right">
                <i class="nt-icon-xbn-19 main_color"></i>
            </nt-tooltip>

            <nt-form :inline="true" :model="queryForm" class="demo-form-inline">
                <!--<nt-form-item label="审批人">-->
                    <!--<nt-input v-model="formInline.user" placeholder="审批人"></nt-input>-->
                <!--</nt-form-item>-->
                <nt-form-item label="是否法检：">
                    <nt-select class="w100" v-model="queryForm.check1" placeholder="全部" @focus="whichSelect($event)" @change="quickFilter($event)">
                        <nt-option label="全部" value="1"></nt-option>
                        <nt-option label="是" value="2"></nt-option>
                        <nt-option label="否" value="3"></nt-option>
                    </nt-select>
                </nt-form-item>
                <nt-form-item label="是否自抬头：">
                    <nt-select class="w100" v-model="queryForm.check2" placeholder="全部" @focus="whichSelect($event)" @change="quickFilter($event)">
                        <nt-option label="全部" value="1"></nt-option>
                        <nt-option label="是" value="2"></nt-option>
                        <nt-option label="否" value="3"></nt-option>
                    </nt-select>
                </nt-form-item>
                <nt-form-item label="是否退税：">
                    <nt-select class="w100" v-model="queryForm.check3" placeholder="全部" @focus="whichSelect($event)" @change="quickFilter($event)">
                        <nt-option label="全部" value="1"></nt-option>
                        <nt-option label="是" value="2"></nt-option>
                        <nt-option label="否" value="3"></nt-option>
                    </nt-select>
                </nt-form-item>
                <nt-form-item label="" class="fr">
                    <nt-input v-model="queryForm.customsCode" placeholder="请输入报关海关编码进行搜索" style="width:251px;"></nt-input>
                    <i class="nt-icon-search main_color search-icon"></i>
                </nt-form-item>
            </nt-form>


            <nt-table class="border_layout mb20" @selection-change="selectChange" :data="productList" stripe tooltip-effect="dark" style="width: 100%">
                <nt-table-column type="selection"></nt-table-column>
                <nt-table-column label="报关海关编码" prop="packPlanCode" sortable></nt-table-column>
                <nt-table-column label="中文报关名称" prop="customNameChinese" sortable></nt-table-column>
                <nt-table-column label="申报要素" prop="applyElement" sortable></nt-table-column>
                <nt-table-column label="申报价值" prop="applyPrice" sortable></nt-table-column>
                <nt-table-column label="用户名" prop="userName" sortable></nt-table-column>
                <nt-table-column label="是否法检" prop="legalCheckState" show-overflow-tooltip sortable>
                    <template scope="scope">
                        {{scope.row.legalCheckState == 1 ? '是' : '否'}}
                    </template>
                </nt-table-column>
                <nt-table-column label="CF订单号" prop="cfOrderCode" sortable></nt-table-column>
                <nt-table-column label="是否自抬头" prop="headUpState">
                    <template scope="scope">
                        {{scope.row.headUpState == 1 ? '是' : '否'}}
                    </template>
                </nt-table-column>
                <nt-table-column label="是否退税" prop="taxRefundState">
                    <template scope="scope">
                        {{scope.row.taxRefundState == 1 ? '是' : '否'}}
                    </template>
                </nt-table-column>
            </nt-table>

            <nt-button type="primary" class="fr" nt-col-offset-0 @click="handleClose">取消</nt-button>
            <nt-button type="primary" class="fr mr20" nt-col-offset-0 @click="handleAddProduct">确定</nt-button>

        </nt-dialog>
    </div>
</template>

<script>

    import Enum from '../../models/enum.js';
    import { handleStatus, simpleQuery, comboQuery, quickFilter,transportWay, isOrNot } from '../../models/status.js';

    export default {
        name: '',
        data(){
            return {
                queryForm:{},
                isShow: false,
                handleStatus,   // 处理状态
                transportWay,    // 运输方式
                which:'',
                productList:[],
                selectedPro:[],
                checkOK:[],   // 弹出框点确定 是否通过
                errMsg:''       // 弹出框错误提示
            }
        },
        methods: {
            selectChange(selection){
                this.selectedPro = selection
            },

            // 商品列表
            async listProducts (){

            },

            async show(params) {

                //this.param = params.param;
                let data = await this.$nt.models.encasement.listPageProducts({
                    "pageNo": 1,
                    "pageSize": 10
                }, this.ctx)

                this.productList = data.list

                this.isShow = true;
            },

            handleClose () {
                this.isShow = false;
            },

            handleAddProduct (){

                this.cheackSelectPro('taxRefundState', '退税类型的报关订单中的所有产品都必须是退税产品，且属于同一用户，请重新选择。')
                this.cheackSelectPro('headUpState', '自抬头类型的报关订单中的所有产品都必须是自抬头报关产品，且属于同一用户，请重新选择。')

                if(this.checkOK.indexOf(false) < 0){
                    this.isShow = false;
                    this.$emit('addProduct', this.selectedPro)
                }
                else{
                    this.$notify.error({
                        title: '错误',
                        message: this.errMsg
                    });
                }
                this.checkOK = []

            },
            // 检查数据 taxRefundState
            cheackSelectPro (value, errMsg){

                this.selectedPro.forEach(e => {
                    if(e[value] == 1){
                    // 有自抬头或退税为1 则所有必须是1 且用户名相同
                    this.selectedPro.forEach(ele => {
                        if(ele[value] != 1 || ele.userName != e.userName){
                        this.checkOK.push(false)
                        this.errMsg = errMsg
                    }
                })
                }
            })
            },

    whichSelect(event){
        debugger
    },

            quickFilter (event) {


            }
        }

    }
</script>
<style lang="less">
    .dialogBox {
        .nt-dialog{
            max-width:1000px
        }
        .nt-dialog--small{width:1000px;}
    }

    .title-tooltip{
        position: absolute;
        font-size: 16px;
        top: 12px;
        left: 163px;
    }
    .w100{width:100px;}
    .mb20{ margin-bottom:20px;} .mr20{
                                    margin-right:20px;}
    .fr{
        float: right;}
    .search-icon{
        cursor:pointer;position: absolute;top: 7px;right: 11px;font-size: 20px;
    }

</style>