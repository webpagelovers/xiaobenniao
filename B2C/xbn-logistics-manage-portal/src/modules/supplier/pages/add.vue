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
        <page-head :title="'供应商'"></page-head>
        <nt-row class="operationBox">
            <nt-col :span="4" class="f16">
                <i class="nt-icon nt-icon-arrow-left" @click="jumpList" style="cursor: pointer;"></i>
                <span v-if="currentRouter == addUrlHash">新增供应商</span>
                <span v-if="currentRouter == updateUrlHash">修改供应商</span>
            </nt-col>
            <nt-col :span="20" style="text-align: right;">
                <nt-button type="primary" @click="handlerSave('form')">保存</nt-button>
                <nt-button type="primary" @click="handlerSave('form',1)">保存并新建</nt-button>
                <nt-button type="primary" @click="jumpList">取消</nt-button>
            </nt-col>
        </nt-row>

        <nt-form :model="form" :rules="rules" ref="form" label-width="165px">
            <div class="contentBox">
                <div class="border_layout competing_infor">
                    <div class="competing_infor_xbox" style="position: relative">
                        <nt-form-item label="供应商名称：" prop="supplierName">
                            <nt-col :span="3">
                                <nt-input v-model="form.supplierName" :maxlength="18" class="w240"></nt-input>
                            </nt-col>
                        </nt-form-item>
                        <nt-form-item label="服务类型：" prop="serviceType">
                            <nt-col :span="3">
                                <nt-input v-model="form.serviceType" :maxlength="60" class="w240"></nt-input>
                            </nt-col>
                        </nt-form-item>
                        <nt-form-item label="联系人：" prop="contactName">
                            <nt-col :span="3">
                                <nt-input v-model="form.contactName" :maxlength="18" class="w240"></nt-input>
                            </nt-col>
                        </nt-form-item>
                        <nt-form-item label="电话：" prop="contactPhone">
                            <nt-col :span="3">
                                <nt-input v-model="form.contactPhone" class="w240"></nt-input>
                            </nt-col>
                        </nt-form-item>
                        <nt-form-item label="地址：" prop="contactAddress">
                            <nt-col :span="3">
                                <nt-input v-model="form.contactAddress" class="w240"></nt-input>
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

                form: {
                    supplierName: '',
                    serviceType: '',
                    contactName: '',
                    contactPhone: '',
                    contactAddress: '',
                },

                rules: {
                    supplierName: [
                        {required: true, message: '请输入供应商名称', trigger: 'blur'},
                        {validator: this.supplierNameValidator},
                    ],
                    serviceType: [
                        {required: true, message: '请输入服务类型', trigger: 'blur'},
                    ],
                    contactPhone: [
                        {required: false, validator: this.contactPhoneValidator, trigger: 'blur'},
                    ],
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
                const infoRes = await this.ctx.models.supplier.info({id: this.$route.query['id']});
                if (infoRes.statusCode === '2000000') {
                    this.form = infoRes.data;
                } else {
                    console.log(infoRes.errMsg);
                }
            },


            //保存
            handlerSave: async function (formName, rush) {
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        const res = await this.ctx.models.supplier.save(this.form);
                        if (res.statusCode === '2000000') {
                            if (rush === 1) {
                                this.$router.go(0);
                            } else {
                                this.jumpList();
                            }
                        }

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },

            //校验供应商名称重复
            supplierNameValidator: async function (rule, value, callback) {
                const res = await this.ctx.models.supplier.validateName({
                    id: this.$route.query['id'],
                    supplierName: value
                });

                if (res.statusCode === '2000000') {
                    callback();
                } else {
                    callback(new Error('供应商名称已存在'));
                }

            },

            //校验手机号码
            contactPhoneValidator: function (rule, value, callback) {
                if (value) {
                    let reg = /^\d+$/;
                    let result = reg.test(value);
                    if (result) {
                        callback();
                    } else {
                        callback(new Error('电话必须为整数'));
                    }
                }
            },

        }

    }
    ;
</script>


