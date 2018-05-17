<template>
	<div>
        <nt-form :ref="'form'" :model="model"  labelWidth="130px">
			<!-- 确定弹窗 -->
			<nt-dialog title="收到一笔外汇" :visible.sync="dialogVisible" size="tiny" :close-on-click-modal="false" @close="onClose">
						<nt-form-item label="收汇账号："  prop="receiveAccount" :rules="[
                            { required: true, message: '此项不能为空', trigger: 'blur' },
                            { min: 0, max: 80, message: '最大 30 个字符', trigger: 'blur' },
					    ]">
							<nt-input  class="w240" v-model="model.receiveAccount" :maxlength="30"></nt-input>
						</nt-form-item>
						<nt-form-item label="(实收)收汇金额："  prop="receiptAmount" :rules="[
                            { required: true, message: '此项不能为空', trigger: 'blur' },
                            validate.price,
                            { type: 'string', pattern: /^([0-9]{1,10})((\.[0-9]{0,9})|(\D{0,1}))$/, message: '整数部分最多10位', trigger: 'blur,change' },
                    	    { type: 'string', pattern: /^[0-9]+\.{0,1}[0-9]{0,2}$/, message: '小数点后最多2位', trigger: 'blur,change' },
                            {type: 'string', validator: priceValidate, trigger: 'blur,change'}
					    ]">
							<nt-input  class="w240" v-model="model.receiptAmount" :maxlength="13"></nt-input>
							<i class="vT">USD</i>
						</nt-form-item>
						<nt-form-item label="实际到账时间：" prop="receiveTime" :rules="[
                            {type: 'date', required: true, message: '此项不能为空', trigger: 'blur' }
					    ]">
                            <nt-date-picker
                                v-model="model.receiveTime"
                                type="datetime"
                                placeholder="选择日期时间"
                                format="yyyy-MM-dd hh:mm:ss">
                            </nt-date-picker>
							<div  class="col_cccccc lh22 w240 mT3">选择即期结汇的商家，会按外汇实际
								到账的时间段进行结汇</div>
						</nt-form-item>
				<div slot="footer" class="dialog-footer tR">
					<nt-button  type="primary" size="small" @click="confirm">确定</nt-button>
					<nt-button  type="primary" size="small" @click="onClose">取消</nt-button>
				</div>
			</nt-dialog>
        </nt-form>
	</div>
</template>

<script>
import DateUtils from 'nt-element/src/utils/date';
import {CountableInput} from 'xbn-biz-components';
import validate from '../../models/xbn-element-validate.js';
export default {
	props:['confirmId','confirmDialogVisible','confirmCurrency'],
	data() {
		return {
            validate,
            dialogVisible:false,
            model:{
                currency: '',
                id: 0,
                receiptAmount: 0,
                receiveAccount: 'string',
                receiveTime: '',
                //"rejectReason": "string",
                //userId: ''
            }
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
		async confirm(){
            debugger
            var validate = this.$refs["form"].validate;
			validate(async (valid) => {
                if (valid) {
                    let data = Object.assign({},this.model);
                    data.receiveTime = DateUtils.format(data.receiveTime, 'yyyy-MM-dd HH:mm:ss');
                    var json = await this.$nt.models.exchange.incomeConfirm(data, this.ctx);
                    this.$notify({
                        message: '审核确认成功。',
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
        },
        priceValidate(rule, value, callback, source, options){
            var f = parseFloat(value);
            if(!f || f==0){
                callback(new Error('不能为0'));
            }
            callback();
        }
    },
    watch:{
        'confirmDialogVisible':function(){
            this.dialogVisible=this.confirmDialogVisible;
            this.model.id=this.confirmId;
            this.model.currency = this.confirmCurrency;
            this.model.receiptAmount='';
            this.model.receiveAccount='';
            this.model.receiveTime='';
            this.$refs["form"].resetFields();
        }
    }
}
</script>


<style lang="less">
	.mT3{margin-top: 3px;}
</style>
