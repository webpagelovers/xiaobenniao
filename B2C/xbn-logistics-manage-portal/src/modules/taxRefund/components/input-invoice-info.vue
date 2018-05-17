<template>
    <div class="input_width">
    <nt-dialog title="录入发票信息" :visible.sync="isShow" size="small" :close-on-click-modal="false">
        <nt-form :model="postData" ref="postData">
            <div class="maximum_Bomb"  ref="scrollDiv">
                <nt-row v-for="(item, index) in postData.invoices" class="border_outer rel pT24 pB8 mB15" >
                    <div class="input_Number col_ffffff ">{{item.index}}</div>
                    <nt-col :span="24">
                        <nt-col :span="12">
                            <nt-form-item label="开票厂商：" label-width="100px" :prop="'invoices.' + index + '.billingPerson'"
                                :rules="[
                                    { type: 'string', required: true, message: '此项不能为空', trigger: 'blur'},
                                    { max: 60, message: '最多60个字符', trigger: 'blur' }
                                ]">
                                <nt-input v-model.string="item.billingPerson" :maxlength="60" class="w240"></nt-input>
                            </nt-form-item>
                            <nt-form-item label="开票日期：" label-width="100px" :prop="'invoices.' + index + '.billingDate'"
                                :rules="[
                                    { type: 'date', required: true, message: '请选择日期', trigger: 'blur,change' },
                                    { validator: validLessReceiveInvoiceDate, message: '开票日期必须在收票日期时间之前', trigger: 'blur,change' }
                                ]">
                                <nt-date-picker type="date" placeholder="选择日期" ref="billingDate" v-model="item.billingDate" @change="validRelate('invoices.' + index + '.receiveInvoiceDate')"></nt-date-picker>
                            </nt-form-item>
                            <nt-form-item label="数量：" label-width="100px" :prop="'invoices.' + index + '.productNum'"
                                :rules="[
                                    { type: 'string', required: true, message: '此项不能为空', trigger: 'blur'},
                                    { validator: isNumberType, message: '只能填写数值', trigger: 'blur' },
                                    { validator: rangeDecimal, min:0, max:0, message: '只能输入整数类型', trigger: 'blur,change' },
                                    { validator: rangeInteger, min:1, max:9, message: '整数位最多9位', trigger: 'blur,change' },
                                ]">
                                <nt-input v-model="item.productNum" :maxlength="9" class="w240"></nt-input>
                            </nt-form-item>
                            <nt-form-item label="金额：" label-width="100px" :prop="'invoices.' + index + '.billingAmount'" :rules="[
                                { type: 'string', required: true, message: '此项不能为空', trigger: 'blur'},
                                { validator: isNumberType, message: '只能填写数值', trigger: 'blur' },
                                { validator: rangeDecimal, min:0, max:2, message: '小数点后最多2位', trigger: 'blur,change' },
                                { validator: rangeInteger, min:1, max:10, message: '整数位最多10位', trigger: 'blur,change' },
                                { validator: rangeNumber, min:0, trigger: 'blur' }
                                ]">
                                <!-- <nt-input type="text" class="w80" :rows="8" v-model.number="postData.estimatedCost"></nt-input> -->
                                <currency-input
                                    label=""
                                    :formEle="formEle"
                                    :prop="'invoices.' + index + '.billingAmount'"
                                    fixDecimal="2"
                                    v-model="item.billingAmount"
                                    class="w240"
                                ></currency-input><span class="mL10">CNY</span>
                            </nt-form-item>
                            <nt-form-item label="税额：" label-width="100px" :prop="'invoices.' + index + '.billingTax'" :rules="[
                                { type: 'string', required: true, message: '此项不能为空', trigger: 'blur'},
                                { validator: isNumberType, message: '只能填写数值', trigger: 'blur' },
                                { validator: rangeDecimal, min:0, max:2, message: '小数点后最多2位', trigger: 'blur,change' },
                                { validator: rangeInteger, min:1, max:10, message: '整数位最多10位', trigger: 'blur,change' },
                                { validator: rangeNumber, min:0, trigger: 'blur' }
                                ]">
                                <!-- <nt-input type="text" class="w80" :rows="8" v-model.number="postData.estimatedCost"></nt-input> -->
                                <currency-input
                                    label=""
                                    :formEle="formEle"
                                    :prop="'invoices.' + index + '.billingTax'"
                                    fixDecimal="2"
                                    v-model="item.billingTax"
                                    class="w240"
                                ></currency-input><span class="mL10">CNY</span>
                            </nt-form-item>
                        </nt-col>
                        <nt-col :span="12">
                            <nt-form-item label="发票号码：" label-width="100px"  :prop="'invoices.' + index + '.invoiceNumber'"
                                :rules="[
                                    { type: 'string', required: true, message: '此项不能为空', trigger: 'blur'},
                                    { validator: isNumberType, message: '只能填写数值', trigger: 'blur' },
                                    { validator: rangeDecimal, min:0, max:0, message: '只能输入整数类型', trigger: 'blur,change' },
                                    { validator: rangeInteger, min:1, max:8, message: '整数位最多8位', trigger: 'blur,change' },
                                ]">
                                <nt-input v-model="item.invoiceNumber" :maxlength="8" class="w240"></nt-input>
                            </nt-form-item>
                            <nt-form-item label="品名：" label-width="100px" :prop="'invoices.' + index + '.productName'"
                                :rules="[
                                    { type: 'string', required: true, message: '此项不能为空', trigger: 'blur'},
                                    { max: 60, message: '最多60个字符', trigger: 'blur' }
                                ]">
                                <nt-input v-model.string="item.productName" :maxlength="60" class="w240"></nt-input>
                            </nt-form-item>
                            <nt-form-item label="单价：" label-width="100px" :prop="'invoices.' + index + '.danjia'" :rules="[
                                { type: 'string', required: true, message: '此项不能为空', trigger: 'blur'},
                                { validator: isNumberType, message: '只能填写数值', trigger: 'blur' },
                                { validator: rangeDecimal, min:0, max:2, message: '小数点后最多2位', trigger: 'blur,change' },
                                { validator: rangeInteger, min:1, max:10, message: '整数位最多10位', trigger: 'blur,change' },
                                { validator: rangeNumber, min:0, trigger: 'blur' }
                                ]">
                                <!-- <nt-input type="text" class="w80" :rows="8" v-model.number="postData.estimatedCost"></nt-input> -->
                                <currency-input
                                    label=""
                                    :formEle="formEle"
                                    :prop="'invoices.' + index + '.danjia'"
                                    fixDecimal="2"
                                    v-model="item.danjia"
                                    class="w240"
                                ></currency-input><span class="mL10">CNY</span>
                            </nt-form-item>
                            <nt-form-item label="税率：" label-width="100px" :prop="'invoices.' + index + '.shuilv'" :rules="[
                                { type: 'string', required: true, message: '此项不能为空', trigger: 'blur'},
                                { validator: isNumberType, message: '只能填写数值', trigger: 'blur' },
                                { validator: rangeDecimal, min:0, max:2, message: '小数点后最多2位', trigger: 'blur,change' },
                                { validator: rangeInteger, min:1, max:10, message: '整数位最多10位', trigger: 'blur,change' },
                                { validator: rangeNumber, min:0, trigger: 'blur' }
                                ]">
                                <!-- <nt-input type="text" class="w80" :rows="8" v-model.number="postData.estimatedCost"></nt-input> -->
                                <currency-input
                                    label=""
                                    :formEle="formEle"
                                    :prop="'invoices.' + index + '.shuilv'"
                                    fixDecimal="2"
                                    v-model="item.shuilv"
                                    class="w240"
                                ></currency-input><span class="mL10">CNY</span>
                            </nt-form-item>
                            <nt-form-item label="收票日期：" label-width="100px" :prop="'invoices.' + index + '.receiveInvoiceDate'"
                                :rules="[{ type: 'date', required: true, message: '请选择日期', trigger: 'blur,change' },
                                { type: 'date', validator: validMoreBillingDate, message: '收票日期时间必须在开票日期之后', trigger: 'blur,change' }]">
                                <nt-date-picker type="datetime" placeholder="选择日期时间" ref="receiveInvoiceDate"
                                    @change="validRelate('invoices.' + index + '.billingDate')"
                                    v-model="item.receiveInvoiceDate"></nt-date-picker>
                            </nt-form-item>
                        </nt-col>
                    </nt-col>
                </nt-row>
            </div>
            <nt-button type="text" @click="clickAddNew"><i class="nt-icon-xbn-28  mR10"></i>继续增加发票</nt-button>
        </nt-form>
        <div class="dialog-footer tR">
            <nt-button type="primary" size="small" @click="submitSend">保存</nt-button>
            <nt-button type="primary" size="small" @click="isShow = false">取消</nt-button>
        </div>
    </nt-dialog>
    </div>
</template>

<script>
    // element 日期格式化
    import DateUtils from 'nt-element/src/utils/date';
    import merge from 'deepmerge';
    import common from './../models/common.js';
    import {rangeNumber, rangeInteger, rangeDecimal, isNumberType} from 'xbn-biz-validate';
    import currencyInput from './currency-input.vue';
    import NtCol from "nt-element/src/components/col/src/col";
    let callBack = null;
    export default {
        props: ['callBack'],
        mixins: [common],
        components: {
            NtCol,
            currencyInput
        },
        data () {
            return {
                isShow: false,
                postData: {
                    invoices: []
                },
                id: '',
                formEle: null,
                invoicesItem: {
                    receiveInvoicePerson: '',
                    receiveInvoiceDate: '',
                    billingTax: '',
                    billingAmount: '',
                    productNum: '',
                    productName: '',
                    billingDate: '',
                    invoiceNumber: '',
                    billingPerson: '',
                    index: ''
                }
            }
        },
        watch: {
            'postData.invoices'(a, b) {
                this.$nextTick(() => {
                    var container = this.$refs['scrollDiv'];
                    if (container) {
                        container.scrollTop = container.scrollHeight;
                    }
                });
            }
        },
        methods: {
		    isNumberType,
            rangeDecimal,
            rangeInteger,
            rangeNumber,
            validRelate(prop) {
                let props = prop.split('.');
                let targetDate = this.$refs[props[props.length - 1]][0].value;
                if (targetDate) {
                    this.$refs.postData.validateField(prop);
                }
            },
            // 校验 开票时间 小于 收票时间
            validLessReceiveInvoiceDate(rules, value, callback) {
                let targetDate = this.$refs.receiveInvoiceDate[0].value;
                if (targetDate && value.getTime() > targetDate.getTime()) {
                    // 开票时间大于收票时间
                    callback(new Error());
                } else {
                    callback();
                }
            },
            // 校验 收票时间 大于 开票时间
            validMoreBillingDate(rules, value, callback) {
                let targetDate = this.$refs.billingDate[0].value;
                if (targetDate && value.getTime() < targetDate.getTime()) {
                    // 开票时间大于收票时间
                    callback(new Error());
                } else {
                    callback();
                }
            },
            show(opts, callback) {
                this.isShow = true;
                // 重置
                this.$nextTick(async function () {
                    this.formEle = this.$refs.postData;
                    this.$refs.postData && this.$refs.postData.resetFields();
                    this.postData.invoices = [];
                    this.clickAddNew();
                    // 整理提交参数
                    opts.id && (this.id = opts.id);
                    // callback 赋值
                    callback && (callBack = callback);
                });
            },
            // 继续增加
            clickAddNew() {
                let temp = merge({}, this.invoicesItem);
                temp.index
                    = (this.postData.invoices.length + 1).toString().length === 1
                    ? '0' + (this.postData.invoices.length + 1)
                    : (this.postData.invoices.length + 1);
                this.postData.invoices.push(temp);
            },
            async submitSend() {
                this.$refs.postData.validate(async (valid) => {
                    if (valid) {
                        try {
                            // let params = merge({}, this.postData);
                            let params = this.deepCopy(this.postData);
                            for (let item of params.invoices) {
                                item.billingDate = DateUtils.format(item.billingDate, 'yyyy-MM-dd HH:mm:ss');
                                item.receiveInvoiceDate = DateUtils.format(item.receiveInvoiceDate, 'yyyy-MM-dd HH:mm:ss');
                                item.orderId = this.id;
                            }
                            const res = await this.ctx.models.taxrefund.inputInvoiceInfo(params);
                            callBack && callBack(res);
                            this.isShow = false;
                        } catch (err) {
                            //交给框架处理的异常
                            this.ctx.onerror(err);
                        }
                    }
                });
            }
        },
        async created () {
            this.clickAddNew();
        },
    }
</script>


// <style lang="less">
//     .input_width  .nt-dialog{width:850px;}
//     .input_Number{width:56px;
//         height: 41px;
//         background: url("../images/xbn_jb.png") no-repeat;
//         position: absolute;
//         top:0;
//         left:0;
//         padding-top: 4px;
//         padding-left: 7px;
//
//     }
//     .pT24{padding-top: 24px;}
//     .pB8{padding-bottom: 8px;}
//     .maximum_Bomb{max-height:300px;overflow-x: hidden;overflow-y: auto;}
// </style>
