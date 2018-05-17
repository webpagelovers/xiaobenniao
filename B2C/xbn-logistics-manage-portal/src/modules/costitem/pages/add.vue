<style lang="less">


    .biling-add {
        .nt-form-item__content {
            margin-left: 0 !important;
        }
    }

    .facturers_q .nt-dialog--small {
        width: 880px;
    }


</style>

<template>
    <div>
        <page-head :title="'费用项'"></page-head>
        <nt-row class="operationBox">
            <nt-col :span="4" class="f16">
                <i class="nt-icon nt-icon-arrow-left" @click="jumpList" style="cursor: pointer;"></i>
                <span v-if="currentRouter == addUrlHash">新增费用项</span>
                <span v-if="currentRouter == updateUrlHash">修改费用项</span>
            </nt-col>
            <nt-col :span="20" style="text-align: right;">
                <nt-button type="primary" @click="saveData('form')" v-if="currentRouter == addUrlHash">保存
                </nt-button>
                <nt-button type="primary" @click="saveData('form')" v-if="currentRouter == addUrlHash">保存并新建
                </nt-button>
                <nt-button type="primary" @click="updateData('form')" v-if="currentRouter == updateUrlHash">保存
                </nt-button>
                <nt-button type="primary" @click="jumpList">取消</nt-button>
            </nt-col>
        </nt-row>

        <nt-form :model="form" :rules="rules" ref="form" label-width="165px">
            <div class="contentBox">
                <div class="border_layout competing_infor">
                    <div class="competing_infor_xbox" style="position: relative">
                        <nt-form-item label="费用项名称：" prop="expenseName">
                            <nt-col :span="3">
                                <nt-input v-model="form.expenseName" :maxlength="60" class="w240"></nt-input>
                            </nt-col>
                        </nt-form-item>
                        <nt-form-item label="关联单据类型：" prop="receiptType">
                            <nt-col :span="3">
                                <nt-select v-model="form.receiptType" placeholder="" class="w240">
                                    <nt-option v-for="item in receiptTypeOption" :label="item.name"
                                               :key="item.name"
                                               :value="item.type"></nt-option>
                                </nt-select>
                            </nt-col>
                        </nt-form-item>
                        <nt-form-item label="费用项描述：" prop="expenseDesc">
                            <nt-col :span="12">
                                <nt-input type="textarea" v-model="form.expenseDesc"></nt-input>
                            </nt-col>
                        </nt-form-item>
                    </div>
                </div>
            </div>

        </nt-form>
    </div>
</template>

<script>

    import {PageHead} from 'xbn-biz-components';
    import commonMixin from './common.js';


    export default {
        mixins: [commonMixin],
        components: {
            PageHead,
        },
        data() {
            return {
                receiptTypeOption: [
                    {type: '01', name: '报关单'},
                    {type: '02', name: '请关单'}
                ],
                form: {
                    expenseName: '',
                    receiptType: '',
                    expenseDesc: ''
                },
                rules: {
                    expenseName: [
                        {required: true, message: '请输入费用项名称', trigger: 'blur'},
                        {validator: this.expenseNameValidator},
                    ],
                    receiptType: [
                        {required: true, type: 'string', message: '请选择关联单据类型', trigger: 'change'},
                    ],
                    expenseDesc: [
                        {required: true, message: '请输入费用项描述', trigger: 'blur'},
                    ]
                },
            };
        },


        created: async function () {

            if (this.currentRouter === this.addUrlHash) {
                await this.loadAddPage();
            } else if (this.currentRouter === this.updateUrlHash) {
                await this.loadUpdataPage();
            }
        },


        methods: {
            async loadAddPage() {

            },

            async loadUpdataPage() {
                const res = await this.ctx.models.costitem.info({id: this.$route.query['id']});
                if (res.statusCode === '2000000') {
                    this.form = res.data;
                } else {
                    console.log(res.errMsg);
                }
            },


            //新建并保存
            saveData: async function (formName) {
                const This = this;
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        This.ctx.models.costitem.save(this.form).then(function (res) {
                            if (res.statusCode === '2000000') {
                                This.jumpList();
                            }
                        });

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },


            //编辑并保存
            updateData: async function (formName) {
                const This = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        This.ctx.models.costitem.update(this.form).then(function (res) {
                            if (res.statusCode === '2000000') {
                                This.jumpList();
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },


            //校验开票厂商名称重复
            expenseNameValidator: function (rule, value, callback) {
                this.ctx.models.costitem.validateName({
                    id: this.$route.query['id'],
                    expenseName: value,
                }).then(function (res) {
                    if (res.statusCode == '2000000') {
                        callback();
                    } else {
                        callback(new Error(res.errMsg));
                    }
                });
            },


        }

    }
    ;
</script>


