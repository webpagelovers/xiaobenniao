<template>
    <div>
        <nt-form :ref="'form'" :model="model">
            <!-- 驳回弹窗 -->
            <nt-dialog title="填写驳回原因" :visible.sync="dialogVisible" size="tiny" :close-on-click-modal="false" @close="onCancel">
                <nt-form-item prop="rejectReason" :rules="[
                            { min: 0, max: 250, message: '最大 250 个字符', trigger: 'blur' },
					    ]">
                    <countable-input type="textarea" v-model="model.rejectReason" :maxlength="250" :total="250" :rows="5" placeholder="填写具体审核驳回原因！(限2000字)"></countable-input>
                    
                    <div style="text-align: right;"><nt-button type="text" size="small" @click="model.rejectReason =''">清空</nt-button></div>
                </nt-form-item>
                <div slot="footer" class="dialog-footer tR">
                    <nt-button type="primary" size="small" @click="reject">确定</nt-button>
                    <nt-button type="primary" size="small" @click="onCancel">取消</nt-button>
                </div>
            </nt-dialog>
        </nt-form>
    </div>
</template>

<script>
import { CountableInput } from 'xbn-biz-components';
export default {
    props: ['rejectId', 'rejectDialogVisible'],
    data() {
        return {
            model: { rejectReason: '' },//驳回原因
            dialogVisible: false
        }
    },

    mixins: [],

    components: {
        CountableInput
    },

    beforeCreate: function () {

    },

    created: async function () {
    },

    methods: {
        //驳回
        async reject() {
            var data = {
                id: this.rejectId,
                rejectReason: this.model.rejectReason
            }

            var json = await this.$nt.models.product.rejectCommodity(data, this.ctx);
            this.$notify({
                message: '审核驳回成功。',
                type: 'success'
            });
            this.onSuccess();
        },
        onSuccess() {
            this.$emit('success');
        },
        onCancel() {
            this.$emit('cancel');
        }
    },
    watch: {
        'rejectDialogVisible': function () {
            this.dialogVisible = this.rejectDialogVisible;
            if (this.rejectDialogVisible) {
                this.model.rejectReason = '';
            }
        }
    }
}
</script>


<style lang="less">
</style>