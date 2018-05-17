<template>
	<div>
		<template-search-list 
			ref='pageTmpl' 
			:title='title' 
			:simple='query.simple'
			:combo='query.combo' 
			:method='getList'>
			<template slot="page-table-operations">
				<nt-button @click="exportDialogVisible = !0" type="primary">导出</nt-button>
			</template>
			<template slot="page-table" slot-scope="scope">
				<div class="contentBox">
					<nt-table :data="scope.tableData">
						<nt-table-column prop="trackNo" label="主提运单号"></nt-table-column>
						<nt-table-column prop="amount" :label="title + '总金额'"></nt-table-column>
						<nt-table-column prop="status" label="关账状态">
							<template slot-scope="scope">
								<span v-text="cons.val('roStatus', scope.row.status)"></span>
							</template>
						</nt-table-column>
						<nt-table-column prop="closeTime" label="关账时间"></nt-table-column>
						<nt-table-column prop="createTime" label="记账时间"></nt-table-column>
						<nt-table-column label="操作" width="240px">
							<template slot-scope="scope">
								<div class="links">
									<span v-if="scope.row.status != 2" @click="events.toFeDetailPage(scope.row.trackId)">记录应收</span>
									<span v-if="scope.row.status == 2" @click="restartFe(scope.row.trackId)">重新开启</span>
									<!-- <span v-if="" @click="events.deleteFe(scope.row.trackId)">删除</span> -->
									<span v-if="scope.row.status == 2" @click="events.toFeDetailPage(scope.row.trackId)">详情</span>
								</div>
							</template>
						</nt-table-column>
					</nt-table>
				</div>
			</template>
		</template-search-list>
		<export-dialog :show="exportDialogVisible"></export-dialog>
	</div>
</template>

<script type="text/javascript">

	import { TemplateSearchList } from 'xbn-biz-components'
	import {model, map, cons, Events, util} from '../@import'
	import { ExportDialog } from '../@import'

	export default {
		props: {
			
		},

		data() {
			return {
				events: new Events(this),
				cons: cons,
				exportDialogVisible: !1,
				query: {
					simple: [{
                        value: 'aaa',
                        label: '用户名',
                        'placeholder': '请输入用户名'
                    }],
					combo: [{
                        'key': 'trackNo',
                        'line': true,
                        'label': '主提运单号',
                        'type': 'input'
                    }, {
                        'key': 'status',
                        'line': true,
                        'label': '关账状态',
                        'type': 'select',
                        'options': cons.roStatus
                    }, {
                        'key': 'amount',
                        'line': true,
                        'label': '总金额',
                        'type': 'numberquery'
                    }, {
                        'key': 'createTime',
                        'line': true,
                        'label': '记账时间',
                        'type': 'timequery'
                    }, {
                        'key': 'closeTime',
                        'line': true,
                        'label': '关账时间',
                        'type': 'timequery'
                    }],
					quickFilter: []
				}
			}
		},

		computed: {
			//应收/付 value 值
			rpType() {
				return util.getRpType().value
			},

			//应收/付 title
			title() {
				return util.getRpTitle()
			}

		},

		methods: {
			async getList(query) {
				query.param.type = this.rpType
				return {data: await model.getList(query)}
			},

			//重新启动 收汇
			async restartFe(id) {
				let res = await model.restart(id)
				if (res !== 'error') {
					this.$message({
						message: `重新开启成功`,
						type: 'success'
					})
					this.getList()
				}
			}
		},

		components: {
			TemplateSearchList,
			ExportDialog
		}
	}

</script>

<style type="text/css" lang="less" scoped>
	.links {
		>span {
			color: #2ba3e7;
			margin-right: 6px;
			cursor: pointer;
			&:hover {
				opacity: 0.8;
			}
		}
	}
</style>