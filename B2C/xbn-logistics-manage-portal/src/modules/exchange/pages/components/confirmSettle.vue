<template>
	<div class="confirmSettle_h">
		<nt-dialog title="确认结汇" :visible.sync="dialogVisible" size="small" :close-on-click-modal="false" @close="onClose" >
                <!--{{settleOrderTypeStatus._get(model.settleOrderType).label}}-->
            <!-- 自主结汇 自营出口没有此方法，暂时隐藏，删除是将此内绑定的事件也删除掉
            <div  v-if="model.settleOrderType != settleOrderTypeStatus.waizongfu.value" class="bg_f3f3f4">
				<nt-form :ref="'form_'+ model.id +''" :model="model" labelWidth="125px">
					<nt-row class="padT_padB32">
						<nt-col :span="10" align="center" >
							<div class="f18 ">{{model.settleTimepoint}}</div>
							<div class="lh24">外汇金额：2000</div>
						</nt-col>
						<nt-col :span="14" class="pL60 h60 borderL pT10">
							<nt-form-item label="该时间点汇率：" prop="timepointRate"  v-if="model.taxIsConfirm!='1'" :rules="[
							{ required: true, message: '此项不能为空', trigger: 'blur' },
							validate.float,
							{ type: 'string', pattern: /^[0-9]+\.{0,1}[0-9]{0,5}$/, message: '小数点后最多5位', trigger: 'blur,change' },
						]">
								<nt-input  class="w160" v-model="model.timepointRate"></nt-input>
								<div class="inline_block">
									<span v-if="model.taxIsConfirm == '1'">该时间点汇率：{{model.timepointRate}}</span>
									<nt-button type="primary" size="small" v-if="model.taxIsConfirm != '1'" @click="handleConfirmRateZYCK($event,model)">
										确认汇率</nt-button>
								</div>
							</nt-form-item>

						</nt-col>
					</nt-row>

				</nt-form>
            </div> -->
			<div >
            <!-- 外综服及混合 -->
			<div class="exchange_Maxheight">
            <div  v-if="model.settleOrderType != settleOrderTypeStatus.ziying.value" class="bg_f3f3f4">
				<nt-form :ref="'form_'+ model.id +''" :model="model" labelWidth="125px">
					<nt-row class="padT_padB32">
						<nt-col :span="10" align="center" class="borderR">
							<div class="f18 main_color">{{model.settleTimepoint}}</div>
							<div>结汇时间点</div>
						</nt-col>
						<nt-col :span="14" class="pL60">
							<nt-form-item  v-if="model.taxIsConfirm != '1'" label="该时间点汇率：" prop="timepointRate" :rules="[
							{ required: true, message: '此项不能为空', trigger: 'blur' },
							validate.float,
							{ type: 'string', pattern: /^[0-9]{1,3}[\.]{1,1}[0-9]{1,5}$|^[0-9]{1,3}$/, message: '整数最多3位，小数点后最多5位', trigger: 'blur,change' },
						]">
								<nt-input class="w160" v-model="model.timepointRate"></nt-input>
								<div class="inline_block">
									<!-- 当时是外宗服，并且没有解决时显示 -->
									<nt-button  v-if="model.settleStatus != settleStatus.settlementSuccess.value && model.settleOrderType == settleOrderTypeStatus.waizongfu.value" type="primary" size="small" @click="handleConfirmRateWZF($event,model)">
											确认结汇
									</nt-button>
									<!-- 当非外宗服，并且没有确认汇率时显示 -->
									<nt-button  v-if="model.taxIsConfirm != '1' && model.settleOrderType != settleOrderTypeStatus.waizongfu.value" type="primary" size="small" @click="handleConfirmRateWZF($event,model)">
											确认汇率
									</nt-button>
								</div>
							</nt-form-item>
							<nt-form-item v-else label="该时间点汇率：">{{model.timepointRate}}
								<div class="inline_block">
									<!-- 当时是外宗服，并且没有解决时显示 -->
									<nt-button  v-if="model.settleStatus != settleStatus.settlementSuccess.value && model.settleOrderType == settleOrderTypeStatus.waizongfu.value" type="primary" size="small" @click="handleConfirmRateWZF($event,model)">
											确认结汇
									</nt-button>
								</div>
							</nt-form-item>
						</nt-col>
					</nt-row>
				</nt-form>
            </div>
			<!-- 自营出口 -->
            <div v-if="model.settleOrderType != settleOrderTypeStatus.waizongfu.value" >
					<div v-for="(item,index) in model.zyckInfos" :key="index" class="mT16 bg_f3f3f4">
						<nt-form :ref="'form_'+ item.id +''" :model="item" labelWidth="125px">
							<nt-row class="padT_padB32">
								<nt-col :span="10"  class="" >
									<div class="tC f18 mB8 fb">固定汇率</div>
									<div class="mL50 lh24">固定汇率外汇金额：{{ item.currency }} {{ item.amount }}</div>
									<div class="mL50 lh24">关联的退税订单：<span class="main_color">{{ item.orderNo }}</span></div>
									<div class="mL50 lh24">开票汇率：{{ item.exchangeRate }}</div>
								</nt-col>

							<nt-col :span="14" class="pL60 h60 borderL pT10">
								<nt-form-item   v-if="item.taxIsConfirm != '1'" label="固定汇率:" prop="fixedRate" :rules="[
								{ required: true, message: '此项不能为空', trigger: 'blur' },
								validate.float,
								{ type: 'string', pattern: /^[0-9]{1,3}.[0-9]{1,5}$|^[0-9]{1,3}$/, message: '整数最多3位，小数点后最多5位', trigger: 'blur,change' },
								]">
									<nt-input class="w160" v-model="item.fixedRate"></nt-input>
									<div class="inline_block">
										<nt-button type="primary" size="small" @click="handleConfirmRateZYCK($event,item)">确认汇率</nt-button>
									</div>
								</nt-form-item>
								<nt-form-item v-if="item.taxIsConfirm == '1'" label="固定汇率:" prop="fixedRate"> {{item.fixedRate}}</nt-form-item>
							</nt-col>
							</nt-row>
							</nt-form>
					</div>
			</div>
			</div>
			<div slot="footer" class="dialog-footer tR mT25"  v-if="model.settleOrderType != settleOrderTypeStatus.waizongfu.value">
				<nt-button type="primary" size="small" @click="settlementConfirmZYCK()">确认结汇</nt-button>
				<nt-button type="primary" size="small" @click="onClose()">取消</nt-button>
			</div>
			</div>
			<!-- 外综服 -->
			<div  v-if="model.settleOrderType == settleOrderTypeStatus.waizongfu.value" >
				<nt-row class="pT24">
					<nt-col :span="12">
						<div>该结汇时间点下的结汇申请</div>
						<div class="col_cccccc">( 不包括含有固定汇率的外汇,且必须与当前外汇同币种的外汇 )</div>
					</nt-col>
					<nt-col :span="12" align="right">
						<nt-button :type="querySettleStatus == '' ? 'primary' : ''" size="small" @click="querySettleStatus = '';getWZFList()">全部</nt-button>
						<nt-button :type="querySettleStatus == '2' ? 'primary' : ''" size="small" @click="querySettleStatus = '2';getWZFList()">结汇中</nt-button>
						<nt-button :type="querySettleStatus == '3' ? 'primary' : ''" size="small" @click="querySettleStatus = '3';getWZFList()">已结汇</nt-button>
					</nt-col>
				</nt-row>
                 <nt-table v-bind:data="WZFList" stripe tooltip-effect="dark" style="width: 100%" class="dialog_table mT16" max-height="250" >
					 <nt-table-column  width="11"></nt-table-column>
	                <nt-table-column label="币种/收汇金额" min-width="80">
	                    <template scope="scope">{{ scope.row.currency }}/{{ scope.row.receiptAmount }}</template>
	                </nt-table-column>
					 <nt-table-column label="×" width="20">

					 </nt-table-column>
	                <nt-table-column label=" 汇率" prop="settleModel" show-overflow-tooltip>
	                    <template scope="scope">{{ scope.row.timepointRate }}</template>
	                </nt-table-column>
					 <nt-table-column label="="  width="20">
					 </nt-table-column>
	                <nt-table-column label=" 结汇金额 " sortable prop="settleAmount">
	                    <template scope="scope">{{ scope.row.settleAmount && 'CYN'}} {{ scope.row.settleAmount }}</template>
	                </nt-table-column>
	                <nt-table-column label="用户名" min-width="80" show-overflow-tooltip>
	                    <template scope="scope">{{ scope.row.userName }}</template>
	                </nt-table-column>
	                <nt-table-column label="提交时间">
	                    <template scope="scope">{{ scope.row.settleApplyTime }}</template>
	                </nt-table-column>
	                <nt-table-column label="状态" show-overflow-tooltip>
	                    <template scope="scope">{{ settleStatus._get(scope.row.settleStatus).label }}</template>
	                </nt-table-column>
	                <nt-table-column label="操作">
	                    <template scope="scope">
	                        <nt-button type="primary" size="small" 
							:disabled="model.taxIsConfirm=='1' ? true : false" 
							v-if="scope.row.settleStatus == settleStatus.settleing.value"
							v-on:click="settlementConfirm(scope.row.id)">确认结汇</nt-button>
	                    </template>
	                </nt-table-column>
	            </nt-table>
				<div slot="footer" class="dialog-footer tR mT25">
					<nt-button type="primary" size="small" @click="onClose()">关闭</nt-button>
				</div>
            </div>
		</nt-dialog>
	</div>
</template>

<script>
import {ajaxDataMumberToString} from '../../models/checkAjaxData.js'
import {CountableInput} from 'xbn-biz-components';
import {settleOrderTypeStatus,settleStatus} from '../../models/status.js';
import validate from '../../models/xbn-element-validate.js';
import NtCol from "nt-element/src/components/col/src/col";
import NtRow from "nt-element/src/components/row/src/row";
export default {
	props:['confirmSettleId','confirmSettleDialogVisible'],
	data() {
		return {
			validate,
			settleOrderTypeStatus,
			settleStatus,
			querySettleStatus:'',
            model:{
                settleOrderType:1
			},
			WZFIsConfirm:false,//外综服是否确认
			WZFList:[],
            dialogVisible:false
		}
	},

	mixins: [],

	components: {
        NtRow,
        NtCol,
        CountableInput
	},

	beforeCreate: function() {

	},

	created: async function() {
	},

	methods: {
		initData(){
			this.settlementConfirmInfo();
		},
        async settlementConfirmInfo(){
			this.model = await this.$nt.models.exchange.settlementConfirmInfo({id:this.confirmSettleId}, this.ctx);
			ajaxDataMumberToString(this.model);
            //外综服
            if(this.model.settleOrderType == this.settleOrderTypeStatus.waizongfu.value){
				this.getWZFList();
            }
		},
		async getWZFList(){
			var data = {
				currency:this.model.currency || 'USD',
				id:this.model.id,
				settleStatus:this.querySettleStatus,
				settleTimepoint:this.model.settleTimepoint
			}
			this.WZFList = await this.$nt.models.exchange.settlementWZFList(data, this.ctx);
		},
		//确认汇率-外综服
		async handleConfirmRateWZF(event,item){
			var validate = this.$refs["form_"+item.id].validate || this.$refs["form_"+item.id][0].validate;
			validate(async (valid) => {
                if (valid) {
					try {
						await this.$popconfirm(event.target, '确认结汇？该操作不可逆！');
						this.confirmRateWZF(item);
					} catch (err) {
					}
				}else{
                    this.$notify.info({
                        message: '验证表单失败，请检查输入数据合法性。'
                    });
				}
			});
		},
		//外综服确认汇率并结汇
		async confirmRateWZF(item){
			var data = {
				currency: item.currency,
				id: item.id,
				isSettlement: item.settleOrderType == settleOrderTypeStatus.waizongfu.value ? 1 : 0,//只有外宗服直接结汇，其他只确认汇率 
				settleTimepoint: this.model.settleTimepoint,
				timepointRate: item.timepointRate
			}
			debugger
			await this.$nt.models.exchange.confirmRateWZF(data, this.ctx);
			this.$notify({
				message: this.model.settleOrderType == this.settleOrderTypeStatus.waizongfu.value ? '结汇成功':'确认汇率成功',
				type: 'success'
			});
			this.initData(); //已结汇不能再次请求，直接关闭
			//this.onClose();
		},
		//自营出口-确认汇率
		async handleConfirmRateZYCK(event,item){
			var validate = this.$refs["form_"+item.id].validate || this.$refs["form_"+item.id][0].validate;
			validate(async (valid) => {
                if (valid) {
					try {
						await this.$popconfirm(event.target, '确认汇率？该操作不可逆！');
						this.confirmRateZYCK(item);
					} catch (err) {
					}
				}else{
                    this.$notify.info({
                        message: '验证表单失败，请检查输入数据合法性。'
                    });
				}
			});
		},
		//自营出口-确认汇率
		async confirmRateZYCK(item){
			var data = {
				id: item.id,
				exchangeId: this.model.id,
				rate: item.fixedRate || item.timepointRate  //主记录为timepointRate
			}
			debugger
			await this.$nt.models.exchange.confirmRateZYCK(data, this.ctx);
			this.initData();//刷新数据
			this.$notify({
				message: '汇率设置成功',
				type: 'success'
			});
		},
		//自营出口-确认结汇
		async settlementConfirmZYCK(){
			//首先必须都确认了汇率
			var isConfirm = true;
			if(this.model.taxIsConfirm != '1' && this.model.settleOrderType != this.settleOrderTypeStatus.ziying.value){//自营出口 taxIsConfirm 为 null
				isConfirm = false;
			}
			debugger
			if(this.model.zyckInfos){
				for(var i = 0; i< this.model.zyckInfos.lenght; i++){
					if(this.model.zyckInfos[i].taxIsConfirm != '1'){
						isConfirm = false;
					}
				}
			}
			if(!isConfirm){
                    this.$notify.info({
						message: '请检查是否已经全部确认汇率'
        			});
				return;
			}
			this.settlementConfirm(this.model.id);
			this.onClose();
		},
		//确认结汇
		async settlementConfirm(id){
			await this.$nt.models.exchange.settlementConfirm({id}, this.ctx);
			this.$notify({
				message: '结汇成功',
				type: 'success'
			});
			this.initData();//刷新数据
		},
		//关闭事件
        onClose(){

            this.dialogVisible=false;
            this.$emit('close');
        }
    },
    watch:{
        'confirmSettleDialogVisible':function(){
            if(this.confirmSettleDialogVisible){
				this.dialogVisible=this.confirmSettleDialogVisible;
				this.initData();
            }
        }
    }
}
</script>


<style lang="less">
	.confirmSettle_h .nt-dialog--small{width:880px;}
	.bg_f3f3f4{background: #f3f3f4;}
	.pL60{padding-left: 60px;}
	.h60{height: 60px;}
	.pT10{padding-top: 10px;}
	.mL50{margin-left: 50px;}
	.pT24{padding-top: 24px;}
	.mB8{margin-bottom: 8px;}
	.exchange_Maxheight{
		max-height:475px;
		overflow-y: auto;
		overflow-x: hidden;
	}
</style>
