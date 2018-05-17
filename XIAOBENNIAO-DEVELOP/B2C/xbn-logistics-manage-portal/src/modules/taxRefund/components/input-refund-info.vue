<template>
    <nt-dialog title="录入退税信息" :visible.sync="isShow" size="tiny" :close-on-click-modal="false">
        <nt-form :model="postData" ref="postData" label-width="140px">
            <nt-form-item label="货款：" prop="customsFees" :rules="[
                { type: 'string', required: true, message: '此项不能为空', trigger: 'blur'},
                { validator: isNumberType, message: '只能填写数值', trigger: 'blur' },
                { validator: rangeDecimal, min:0, max:2, message: '小数点后最多2位', trigger: 'blur,change' },
                { validator: rangeInteger, min:1, max:10, message: '整数位最多10位', trigger: 'blur,change' },
                { validator: rangeNumber, min:0, trigger: 'blur' }
                ]">
                <!-- <nt-input type="text" class="w80" :rows="8" v-model.number="postData.estimatedCost"></nt-input> -->
                <currency-input fixDecimal="2" v-model="postData.customsFees" v-on:onBlurCall="computeRevenueTaxRefundAmount"></currency-input>
                <span class="mL10 vT">CNY</span>
            </nt-form-item>
            <nt-form-item label="退税款金额：" prop="taxRefundAmount" :rules="[
                { type: 'string', required: true, message: '此项不能为空', trigger: 'blur'},
                { validator: isNumberType, message: '只能填写数值', trigger: 'blur' },
                { validator: rangeDecimal, min:0, max:2, message: '小数点后最多2位', trigger: 'blur,change' },
                { validator: rangeInteger, min:1, max:10, message: '整数位最多10位', trigger: 'blur,change' },
                { validator: rangeNumber, min:0, trigger: 'blur' }
                ]">
                <!-- <nt-input type="text" class="w80" :rows="8" v-model.number="postData.estimatedCost"></nt-input> -->
                <!-- <currency-input fixDecimal="2" :onBlurCall="computeServiceFees" v-model="postData.taxRefundAmount"></currency-input> -->
                <currency-input fixDecimal="2" v-model="postData.taxRefundAmount" v-on:onBlurCall="computeServiceFees"></currency-input>
                <span class="mL10 vT">CNY</span>
            </nt-form-item>
            <nt-form-item label="退税服务费比例：" prop="serviceFeeRate" :rules="[
                { type: 'string', required: true, message: '此项不能为空', trigger: 'blur'},
                { validator: isNumberType, message: '只能填写数值', trigger: 'blur' },
                { validator: rangeDecimal, min:0, max:2, message: '小数点后最多2位', trigger: 'blur,change' },
                { validator: rangeInteger, min:1, max:2, message: '整数位最多2位', trigger: 'blur,change' },
                { validator: rangeNumber, min:0, trigger: 'blur' }
                ]">
                <!-- <nt-input type="text" class="w80" :rows="8" v-model.number="postData.estimatedCost"></nt-input> -->
                <nt-input label="" @blur="computeServiceFees" class="w80" v-model="postData.serviceFeeRate"></nt-input>
                <span class="mL10 vT">%</span>
            </nt-form-item>
            <nt-form-item label="退税服务费：" prop="serviceFees" :rules="[
                { type: 'string', required: true, message: '此项不能为空', trigger: 'blur'},
                { validator: isNumberType, message: '只能填写数值', trigger: 'blur' },
                { validator: rangeDecimal, min:0, max:2, message: '小数点后最多2位', trigger: 'blur,change' },
                { validator: rangeInteger, min:1, max:10, message: '整数位最多10位', trigger: 'blur,change' },
                { validator: rangeNumber, min:0, trigger: 'blur' }
                ]">
                <!-- <nt-input type="text" class="w80" :rows="8" v-model.number="postData.estimatedCost"></nt-input> -->
                <currency-input fixDecimal="2" v-model="postData.serviceFees" :disabled="true"></currency-input>
                <span class="mL10 vT">CNY</span>
            </nt-form-item>
            <nt-form-item label="实收退税金额：" prop="revenueTaxRefundAmount" :rules="[
                { type: 'string', required: true, message: '此项不能为空', trigger: 'blur'},
                { validator: isNumberType, message: '只能填写数值', trigger: 'blur' },
                { validator: rangeDecimal, min:0, max:2, message: '小数点后最多2位', trigger: 'blur,change' },
                { validator: rangeInteger, min:1, max:10, message: '整数位最多10位', trigger: 'blur,change' },
                { validator: rangeNumber, min:0, trigger: 'blur' }
                ]">
                <!-- <nt-input type="text" class="w80" :rows="8" v-model.number="postData.estimatedCost"></nt-input> -->
                <currency-input fixDecimal="2" :disabled="true" v-model="postData.revenueTaxRefundAmount"></currency-input>
                <span class="mL10 vT">CNY</span>
            </nt-form-item>
        </nt-form>
        <div class="dialog-footer tR">
            <nt-button type="primary" size="small" @click="submitSend">保存</nt-button>
            <nt-button type="primary" size="small" @click="isShow = false">取消</nt-button>
        </div>
    </nt-dialog>
</template>

<script>
    // element 日期格式化
    import DateUtils from 'nt-element/src/utils/date';
    import merge from 'deepmerge';
    import {rangeNumber, rangeInteger, rangeDecimal, isNumberType} from 'xbn-biz-validate';
    import currencyInput from './currency-input.vue';
    let callBack = null;
    export default {
        props: ['callBack'],
        components: {
    		currencyInput
        },
        data () {
            return {
                isShow: false,
                postData: {
                    taxRefundAmount: '',
                    serviceFees: '',
                    customsFees: '',
                    revenueTaxRefundAmount: '',
                    serviceFeeRate: '',
                    id: ''
                },
                formEle: null
            }
        },
        computed: {
        },
        methods: {
		    isNumberType,
            rangeDecimal,
            rangeInteger,
            rangeNumber,
            show(opts, callback) {
                this.isShow = true;
                // 重置
                this.$nextTick(async function () {
                    this.formEle = this.$refs.postData;
                    this.$refs.postData && this.$refs.postData.resetFields();
                    // 整理提交参数
                    opts.id && (this.postData.id = opts.id);
                    // callback 赋值
                    callback && (callBack = callback);
                });
            },
            async computeServiceFees() {
                if ((!this.postData.serviceFeeRate) || !this.postData.taxRefundAmount) {
                    return;
                }
                try {
                    let str = this.postData.taxRefundAmount + '*' + this.postData.serviceFeeRate/100;
                    let res = await this.ctx.models.taxrefund.compute({formula: str, newScale: 2});
                    let res2 = null;
                    if (this.postData.customsFees) {
                        let str2 = this.postData.taxRefundAmount + '-' + this.postData.serviceFees + '-' + this.postData.customsFees;
                        res2 = await this.ctx.models.taxrefund.compute({formula: str2, newScale: 2});
                    }
                    this.postData.serviceFees = res.data;
                    if (res2) {
                        this.postData.revenueTaxRefundAmount = res2.data;
                    }
                } catch (err) {
                    //交给框架处理的异常
                    this.ctx.onerror(err);
                }
            },
            async computeRevenueTaxRefundAmount() {
                let isOk = true;
                // 校验退税款金额
                this.$refs.postData.validateField('taxRefundAmount', async (valid) => {
                    if (valid) {
                        isOk = false;
                    }
                });
                // 校验服务费
                this.$refs.postData.validateField('serviceFees', async (valid) => {
                    if (valid) {
                        isOk = false;
                    }
                });
                // 校验报关费
                this.$refs.postData.validateField('customsFees', async (valid) => {
                    if (valid) {
                        isOk = false;
                    }
                });
                if (isOk) {
                    try {
                        let str2 = this.postData.taxRefundAmount + '-' + this.postData.serviceFees + '-' + this.postData.customsFees;
                        let res2 = await this.ctx.models.taxrefund.compute({formula: str2, newScale: 2});
                        this.postData.revenueTaxRefundAmount = res2.data;
                    } catch (err) {
                        //交给框架处理的异常
                        this.ctx.onerror(err);
                    }
                }
            },
            async submitSend() {
                this.$refs.postData.validate(async (valid) => {
                    if (valid) {
                        try {
                            let params = merge({}, this.postData);
                            const res = await this.ctx.models.taxrefund.inputTaxRefundInfo(params);
                            callBack && callBack(res);
                            this.isShow = false;
                        } catch (err) {
                            //交给框架处理的异常
                            this.ctx.onerror(err);
                        }
                    }
                });
            }
        }
    }
</script>


<style lang="less">

</style>
