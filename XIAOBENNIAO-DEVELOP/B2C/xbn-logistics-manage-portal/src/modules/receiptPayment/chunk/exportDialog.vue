<template>
	<div>
		<nt-dialog title="导出" :visible.sync="show" size="tiny">
			<ul class="export-dialog-ul">
				<li>
					<span>记账时间：</span>
					<nt-select v-model="data.tallyTimeType" class="w120 mr10" @change="setTimeRange('tally')">
						<nt-option v-for="i in cons.exportSectionChoose" :value="i.value" :key="i.value" :label="i.label"></nt-option>
					</nt-select>
					<div class="inb">
						<div v-if="tallyTimeRange">
							<nt-date-picker type="datetime" v-model="data.beginTallyTime" class="w120"></nt-date-picker>
							<span>-</span>
							<nt-date-picker type="datetime" v-model="data.endTallyTime" class="w120"></nt-date-picker>
						</div>
						<div v-else>
							<nt-date-picker type="datetime"  v-model="data.tallyTime"></nt-date-picker>
						</div>
					</div>
				</li>
				<li>
					<span>关账时间：</span>
					<nt-select v-model="data.closeTimeType" class="w120 mr10" @change="setTimeRange('close')">
						<nt-option v-for="i in cons.exportSectionChoose" :value="i.value" :key="i.value" :label="i.label"></nt-option>
					</nt-select>
					<div class="inb">
						<div v-if="closeTimeRange">
							<nt-date-picker type="datetime" v-model="data.beginCloseTime" class="w120"></nt-date-picker>
							<span>-</span>
							<nt-date-picker type="datetime" v-model="data.endCloseTime" class="w120"></nt-date-picker>
						</div>
						<div v-else>
							<nt-date-picker type="datetime"  v-model="data.closeTime"></nt-date-picker>
						</div>
					</div>
				</li>
				<li>
					<span>关账状态：</span>
					<nt-select v-model="data.status" class="w120" placeholder="请选择">
						<nt-option v-for="i in cons.roStatus" :value="i.value" :key="i.value" :label="i.label"></nt-option>
					</nt-select>
				</li>
			</ul>
			<template slot="footer">
				<div class="dialog-footer">
					<nt-button type="primary" @click="save">确认</nt-button>
					<nt-button type="primary" @click="show = !1">取消</nt-button>
				</div>
			</template>
		</nt-dialog>
	</div>
</template>

<script type="text/javascript">
	
	import { cons, model, util } from '../@import'

	export default {
		props: {
			show: {
				type: Boolean,
				default: !1
			}
		},

		data() {
			return {
				cons: cons,
				tallyTimeRange: !1,
				closeTimeRange: !1,
				data: {
					tallyTimeType: '1',
					closeTimeType: '1'
				}
			}
		},

		computed: {
			rpType() {
				return util.getRpType()['value']
			}
		},

		methods: {
			setTimeRange(type) {
				this[type + 'TimeRange'] = this.data[type + 'TimeType'] == 3? !0: !1
			},

			async save() {
				let param = this.timeConvert()
				param.fileName = util.getRpType()['label'] + '.xls'
				let res = await model[this.rpType == 1? 'exportFee': 'exportPay'](param)
				this.$parent.exportDialogVisible = !1
			},

			//转变成后端想要的格式
			timeConvert() {
				let keys  =  ['tallyTime', 'closeTime'],
					data  =  this.data,
					param =  {}

				keys.forEach(i => {
					let type = data[i + 'Type'],
						val  = data[i],
						j    = i.replace(/^\w/, function(v){return v.toLocaleUpperCase()})

					if (val) {
						switch(type) {
							case '1':
								param['begin' + j] = val
								break
							case '2':
								param['end' + j] = val
								break
							case '3':
								param['end' + j]   = data['end' + j]
								param['begin' + j] = data['begin' + j]
								break
							case '4':
								param[i] = val
								break
						}
					}
				})

				data.status && (param.status = data.status)
				
				return param
			}
		}
	}
</script>

<style type="text/css" lang="less" scoped>
	.export-dialog-ul {
		>li {
			padding: 10px 0;
		}
	}
</style>