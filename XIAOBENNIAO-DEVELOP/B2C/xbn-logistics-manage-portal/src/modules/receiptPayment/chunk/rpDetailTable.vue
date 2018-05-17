<template>
	<div>
		<nt-form :rules="rules" :model="operateRow" ref="form" class="pm-error-form">
			<nt-table :data="data" class="rp-detail-table form-table" ref="table">
				<nt-table-column prop="feeItem" label="费用项名称" width="180px">
					<template slot-scope="scope" slot="append"><span class="col_req">*</span></template>
					<template slot-scope='scope'>
						<div v-if="edit">
							<nt-form-item prop="feeItem">
								<nt-select placeholder="请选择" class="w120" v-model="scope.row.feeItem" @change="setOperateRow(scope.row)">
									<nt-option v-for="i in cons.feeType" :key="i.value" :value="i.value" :label="i.label"></nt-option>
								</nt-select>
							</nt-form-item>
						</div>
						<div v-else>
							<span v-text="cons.val('feeType', scope.row.feeItem)"></span>
						</div>
					</template>
				</nt-table-column>
				<nt-table-column prop="amount" :label="title + '金额'" width="180px">
					<template slot-scope="scope" slot="append"><span class="col_req">*</span></template>
					<template slot-scope='scope'>
						<div v-if="edit" @click="setOperateRow(scope.row)">
							<nt-form-item prop="amount">
								<nt-input v-model="scope.row.amount" class="w140"></nt-input>
							</nt-form-item>
						</div>
						<div v-else>
							<span v-text="scope.row.amount"></span>
						</div>
					</template>
				</nt-table-column>
				<nt-table-column prop="billNo" label="关联单据" width="220px">
					<template slot-scope="scope" slot="append"><span class="col_req">*</span></template>
					<template slot-scope="scope">
						<div v-if="edit" class="rel" @click="setOperateRow(scope.row)">
							<nt-form-item prop="billNo">
								<nt-input v-model="scope.row.billNo" class="w180" icon="search"></nt-input>
								<div @click="showBillDialog(scope.row, scope.$index)" class="search-btn-cover"></div>
							</nt-form-item>
						</div>
						<div v-else>
							<span v-text="scope.row.billNo"></span>
						</div>
					</template>
				</nt-table-column>
				<nt-table-column prop="supplyId" label="供应商" v-if="hasSupplier" width="240px">
					<template slot-scope="scope" slot="append"><span class="col_req">*</span></template>
					<template slot-scope='scope'>
						<div v-if="edit">
							<nt-form-item prop="supplier">
								<nt-select placeholder="请选择" class="w160" v-model="scope.row.supplyId" @change="setOperateRow(scope.row)">
									<nt-option v-for="i in cons.supplier" :key="i.value" :value="i.value" :label="i.label"></nt-option>
								</nt-select>
							</nt-form-item>
						</div>
						<div v-else>
							<span v-text="cons.val('supplier', scope.row.supplyId)"></span>
						</div>
					</template>
				</nt-table-column>
				<nt-table-column prop="createTime" label="发生时间" width="220px">
					<template slot-scope="scope" slot="append"><span class="col_req">*</span></template>
					<template slot-scope='scope'>
						<div v-if="edit" @click="setOperateRow(scope.row)">
							<nt-form-item prop="createTime">
								<nt-date-picker type="datetime" v-model="scope.row.createTime" class="occ-time"></nt-date-picker>
							</nt-form-item>
						</div>
						<div v-else>
							<span v-text="scope.row.createTime"></span>
						</div>
					</template>
				</nt-table-column>
				<nt-table-column prop="createUser" label="记录人">
					<template slot-scope="scope">
						<label v-text="scope.row.createUser" class="ml25"></label>
					</template>
				</nt-table-column>
				<nt-table-column prop="note" label="备注" width="240px">
					<template slot-scope="scope">
						<div v-if="edit">
							<nt-input v-model="scope.row.note" class="w180"></nt-input>
						</div>
						<div v-else>
							<label v-text="scope.row.note" class="ml15"></label>
						</div>
					</template>
				</nt-table-column>
				<nt-table-column label="操作" width="240px" v-if="edit">
					<template slot-scope="scope">
						<div class="links">
							<span @click="_save(scope.row, scope.$index)" v-text="getSaveText(scope.row)"></span>
							<span @click="_delete(scope.row, $event)">删除</span>
						</div>
					</template>
				</nt-table-column>
			</nt-table>
		</nt-form>
		<nt-dialog title="选择单据" :visible.sync="dialogVisible">
			<bill-list></bill-list>
			<template slot="footer">
				<div class="dialog-footer">
					<nt-button type="primary" @click="addBill">确认</nt-button>
					<nt-button type="primary" @click="dialogVisible = !1">取消</nt-button>
				</div>
			</template>
		</nt-dialog>
		<div class="add-item-btn" v-if="edit">
			<nt-button @click="addItem" type="primary">新增明细</nt-button>
		</div>
	</div>
</template>

<script type="text/javascript">
	
	import { model, map, cons, Events, util} from '../@import'
	import BillList from './billList.vue'
	import moment from 'moment'

	export default {
		props: {
			data: {
				type: Array,
				default() {
					return [{}]
				}
			},
			rules: {
				type: Object,
				default() {
					return {
						feeItem: [
							{required: true, message: '请选择费用项名称', trigger: 'change'}
						], amount: [
							{required: true, message: '请输入应付金额', trigger: 'blur'},
							{pattern: /(?:^\d+$)|(?:^\d+\.\d{1,2}$)/, message: '数字且小数点后最多两位', trigger: 'blur'}
						], billNo: [
							{required: true, message: '请输入关联单据', trigger: 'blur'}
						], supplyId: [
							{required: true, message: '请选择供应商', trigger: 'blur'}
						], createTime: [
							{required: true, message: '请输入发生时间', trigger: 'blur'}
						]
					}
				}
			},
		},

		data() {
			return {
				cons: cons,
				events: new Events(this),
				edit: this.$parent.edit,
				operateRow: {},
				hasSupplier: !1,
				dialogVisible: !1,
				billListVueCom: null,
				tableIndex: 0,
				clickedRow: null,
				loginUserName: ''
			}
		},

		computed: {
			title() {
				let type = util.getRpType()
				this.hasSupplier = type.value == 1? !1: !0
				return type['label']
			}
		},

		methods: {
			async _save(row, $index) {
				this.setOperateRow(row)
				let fields = this.$refs.form.fields,
					length = fields.length / this.$refs.table.$el.getElementsByTagName('tbody')[0].children.length,
					flag   = !0
				
				setTimeout(i => {
					fields.slice($index * length, length * ($index + 1) ).forEach((i, j) => {
						i.validate('', errors => {
							errors && (flag = !1)
						})
					})

					submit.call(this)
				}, 50)

				async function submit() {
					if (!flag) return

					let operate = '修改',
						$parent = this.$parent

					!row.id && (row.feeId = $parent.id, operate = '新增')
					//!row.feeId && (row.id = $parent.id, operate = '新增')
					row.customOrderNo && delete row.customOrderNo
					

					let res = await model.mergeRpDetail(row)
					if (res !== 'error') {
						this.$message({
							message: `明细${operate}成功`,
							type: 'success'
						})
						$parent.getDetail()
						$parent.edit = !1
					}
				}
			},

			async _delete(row, $event) {
				let id = row.id,
					$parent = this.$parent

				if (id) {
					await this.$popconfirm($event.target, '确认要删除此条明细')
					let res = await model.deleteRpDetail(id)
					if (res !== 'error') {
						this.$message({
							message: `明细删除成功`,
							type: 'success'
						})
						$parent.getDetail()
						$parent.edit = !1
					}
				} else {
					this.data.pop()
				}
			},

			setOperateRow(row) {
				row.amount && (row.amount += '')//validator 的 is not a string 通不过
				row.createTime && (row.createTime = moment(row.createTime).format('YYYY-MM-DD HH:mm:ss'))
				this.operateRow = row
			},

			addBill() {
				let row = this.billListVueCom.selectedRow
				row && (this.clickedRow.billNo = row.ordersCode)
				this.dialogVisible = !1
			},

			getSaveText(row) {
				return row.feeId? '修改': '保存'
			},

			addItem() {
				this.data.push({
					billNo: '', //必须添加，以便vue watch,
					createUser: this.loginUserName
				})
			},

			showBillDialog(row, $index) {
				//单据列表 需要 费用项名称
				if (row.feeItem) {
					this.clickedRow = row
					this.dialogVisible = !0
				}
			},

			async getSuppliers() {
				if (!this.hasSupplier) return
				let res = await model.supList({pageNo: 1, pageSize: 10e2})
				if (res !== 'error') {
					cons.supplier = []
					res.list.forEach(i => {
						cons.supplier.push({
							label: i.supplierName, value: i.id
						})
					})
				}
			}
		},

		mounted() {
			this.loginUserName = this.$parent.$children[0].$children[0].userInfo.name
			this.getSuppliers()
		},

		components: {
			BillList
		}
	}
</script>

<style type="text/css" lang="less" scoped>
	.occ-time.nt-date-editor {
		width: 200px;
	}
	.search-btn-cover {
		position: absolute;
	    width: 36px;
	    height: 36px;
	    z-index: 2;
	    top: 0px;
	    right: 33px;
	    cursor: pointer;
	}
	.rp-detail-table {
		tbody {
			.cell span {
				margin-left: 10px;
			}
		}
	}
</style>