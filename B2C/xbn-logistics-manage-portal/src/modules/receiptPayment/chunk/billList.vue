<template>
	<div>
		<list class="bill-list-table"
			:method='getList'
			:filter='query.quickFilter'>
			<template slot="page-table" slot-scope="scope">
				<nt-table :data="scope.tableData" class="bill-table-list" ref="billTable" @row-click="tableClickHandle">
					<nt-table-column prop="ordersCode" label="单据编码"></nt-table-column>
					<nt-table-column prop="customOrderNo" label="提运单号"></nt-table-column>
					<nt-table-column prop="createTime" label="创建时间"></nt-table-column>
				</nt-table>
			</template>
		</list>
	</div>
</template>

<script type="text/javascript">
	
	import { model, map, cons, Events, util } from '../@import'
	import List from './list.vue'

	export default {
		props: {
			
		},

		data() {
			return {
				events: new Events(this),
				selectedRow: null,
				feeItem: null,
				parent: this.$parent.$parent,
				masterWaybillCode: null,
				query: {
					quickFilter: [
						{
	                        key: 'ordersCode',
	                        label: '单据编码：'
	                    },
	                    {
	                        key: 'startTime',
	                        label: '创建时间：',
	                        type: 'datetime'
	                    },
	                    {
	                        key: 'endTime',
	                        label: '-',
	                        type: 'datetime'
	                    }
					]
				}
			}
		},

		computed: {
			
		},

		methods: {
			getList(query) {
				query.param.masterWaybillCode = this.$route.params.id
				let feeItem = '0' + this.parent.clickedRow.feeItem;
				///^\d$/.test(feeItem) && (feeItem = cons.val('feeType', feeItem))
				query.param.feeItem = feeItem

				return model.getBillList(query)
			},

			tableClickHandle(row, $event, column) {
				let tar  = $event.target,
					par  = tar.parentElement
					
				if (tar.nodeName === 'TD' || (tar = par, par.nodeName === 'TD')) {
					let active = ' bill-list-active',
					acNode = this.$refs.billTable.$el.getElementsByClassName(active)[0]

					acNode && (acNode.className = acNode.className.replace(active, ''))
					tar.parentElement.className += active
				}

				this.selectedRow = row
			}
		},

		created() {
			this.parent.billListVueCom = this
		},

		components: {
			List
		}
	}

</script>

<style type="text/css" lang="less">
	.bill-list-table {
		.nt-table__body-wrapper {
			max-height: 400px;
		}
	}
	.right-opes {
		>li:last-child {
		    margin-left: 4px !important;
		}
	}
	.bill-table-list {
		tr {
			cursor: pointer;
			&.bill-list-active {
				background-color: #2ba3e7;
    			color: #fff;
    			>td {
    				background-color: #2ba3e7 !important;
    			}
			}
		}
	}
</style>