<template>
	<div>
        <nt-form :ref="'form'" :model="model">
			<!-- 驳回弹窗 -->
			<nt-dialog title="驳回" :visible.sync="dialogVisible" size="tiny" :close-on-click-modal="false" @close="onClose">
				<nt-form-item label="驳回原因"  prop="rejectReason" :rules="[
                            { min: 0, max: 2000, message: '最大 2000 个字符', trigger: 'blur' },
					    ]">
                <countable-input type="textarea" v-model="model.rejectReason" :maxlength="2000" :total="2000" :rows="5" placeholder="填写具体审核驳回原因！(限2000字)"></countable-input>
                
				</nt-form-item>
				<div slot="footer" class="dialog-footer tR">
				<nt-button  type="primary" size="small" @click="reject">确定</nt-button>
                <nt-button  type="primary" size="small" @click="onClose">取消</nt-button>
				</div>
			</nt-dialog>
		</nt-form>
	</div>
</template>

<script>
import {CountableInput} from 'xbn-biz-components';
export default {
	props:['rejectId','rejectDialogVisible'],
	data() {
		return {
            model:{rejectReason:''},//驳回原因
            dialogVisible:false
		}
	},

	mixins: [],

	components: {
		CountableInput
	},

	beforeCreate: function() {

	},

	created: async function() {
	},

	methods: {
		//驳回
		async reject(){
			var data = {
				id:this.rejectId,
				rejectReason:this.model.rejectReason
			}
			var validate = this.$refs["form"].validate;
			validate(async (valid) => {
                if (valid) {
					var json = await this.$nt.models.exchange.incomeReject(data, this.ctx);
					this.$notify({
						message: '审核驳回成功。',
						type: 'success'
					});
					this.onClose();
				}else{
                    this.$notify.info({
                        message: '验证表单失败，请检查输入数据合法性。'
                    });
				}
			});
        },
        onClose(){
            this.dialogVisible=false;
            this.$emit('close');
        }
    },
    watch:{
        'rejectDialogVisible':function(){
			this.dialogVisible = this.rejectDialogVisible;
			if(this.rejectDialogVisible){
				this.model.rejectReason = '';
			}
        }
    }
}
</script>


<style lang="less">
</style>
y