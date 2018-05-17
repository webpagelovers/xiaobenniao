<template>
    <nt-dialog :title="title" :visible.sync="isShow" size="tiny" :close-on-click-modal="false">
        <nt-form :model="postData" ref="form">
            <nt-form-item label="" labnt-width="'0px'" prop="param"
                :rules="title === '取消订单原因' || title === '驳回原因' ? [{ required: true, message: '此项不能为空', trigger: 'blur' }] : []">
                <maxLengthInput type="textarea" :rows="8" :maxlength="500" placeholder="请输入内容" className="w495"
                    v-model="postData.param"
                ></maxLengthInput>
            </nt-form-item>
        </nt-form>
        <div class="tR">
            <slot name="footer" >
                <nt-button type="primary" size="small" @click="submit">{{buttonText[0]}}</nt-button>
                <nt-button type="primary" size="small" @click="isShow = false">{{buttonText[1]}}</nt-button>
            </slot>
        </div>
    </nt-dialog>
</template>

<script>
    import merge from 'deepmerge';
    import maxLengthInput from './max-length-input.vue';
    let callBack = null;
    export default {
        components: {
    		maxLengthInput
        },
        data () {
            return {
                isShow: false,
                title: '',
                postData: {},
                submitConfig: {
                    url: '',
                    type: 'post'
                },
                buttonText: ['保存', '取消'],
                opts: null
            }
        },
        methods: {
            show(opts, call) {
                this.isShow = true;
                // 重置
                this.buttonText = ['保存', '取消'];
                this.$refs.form && this.$refs.form.resetFields();
                this.postData.ids = [];
                // 设置 当前值
                this.postData = merge(this.postData, opts.postData);
                this.submitConfig = merge(this.submitConfig, opts.submitConfig);
                this.buttonText = opts.buttonText ? opts.buttonText : this.buttonText;
                this.title = opts.title;
                call && (callBack = call);
            },
            submit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        try {
                            let res = await this.ctx[this.submitConfig.type](this.submitConfig.url, this.postData);
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
    .h185{height: 185px;}
    .w495 {width: 495px;}
</style>
