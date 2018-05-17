<template>
    <nt-dialog title="确定该笔退税订单中的开票厂商被函调？" :visible.sync="isShow" size="tiny" :close-on-click-modal="false">
        <nt-form :model="postData" ref="postData" label-width="163px">
            <nt-form-item label="" prop="isInvestigate" :rules="[{required: true, message: '此项不能为空', trigger: 'change' }]">
                <nt-radio-group v-model="postData.isInvestigate">
                    <nt-radio key="1" label="是"></nt-radio>
                    <nt-radio key="2" label="否"></nt-radio>
                </nt-radio-group>
            </nt-form-item>
        </nt-form>
        <div class="dialog-footer tR">
            <nt-button type="primary" size="small" @click="submitSend">保存</nt-button>
            <nt-button type="primary" size="small" @click="isShow = false">取消</nt-button>
        </div>
    </nt-dialog>
</template>

<script>
    // import {rangeNumber, rangeInteger, rangeDecimal, isNumberType} from 'xbn-biz-validate';
    // import currencyInput from './currency-input.vue';
    let callBack = null;
    export default {
        props: ['callBack'],
        components: {
    		// currencyInput
        },
        data () {
            return {
                isShow: false,
                postData: {
                    isInvestigate: '',
                    id: ''
                }
            }
        },
        methods: {
            show(opts, callback) {
                this.isShow = true;
                // 重置
                this.$nextTick(async function () {
                    this.$refs.postData && this.$refs.postData.resetFields();
                    // 整理提交参数
                    opts.id && (this.postData.id = opts.id);
                    // callback 赋值
                    callback && (callBack = callback);
                });
            },
            async submitSend() {
                this.$refs.postData.validate(async (valid) => {
                    if (valid) {
                        try {
                            const res = await this.ctx.models.taxrefund.batchPass(this.postData);
                            if (res.statusCode === '2000000') {
                                callBack && callBack(res);
                                this.isShow = false;
                            }
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
