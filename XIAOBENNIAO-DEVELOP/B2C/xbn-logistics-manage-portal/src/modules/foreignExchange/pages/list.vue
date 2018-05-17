<template>
	<div>
		<template-search-list 
			ref='pageTmpl' 
			title='收/结汇管理' 
			:simple='query.simple' 
			:combo='query.combo' 
			:method='getList' 
			:filter='query.quickFilter'>
			<template slot="page-table-operations">
				<nt-button @click="events.toFeFormPage(1)" type="primary">新增一笔收汇</nt-button>
			</template>
			<template slot="page-table" slot-scope="scope">
				<nt-table :data="scope.tableData">
					<nt-table-column prop="contactName" label="用户名"></nt-table-column>
					<nt-table-column prop="userName" label="付汇人"></nt-table-column>
					<nt-table-column prop="businessLicenseCode" label="付汇账号"></nt-table-column>
					<nt-table-column prop="settlementMode" label="外汇金额" sortable></nt-table-column>
					<nt-table-column prop="createTime" label="提交时间" sortable></nt-table-column>
					<nt-table-column prop="status" label="关联退税订单状态">
						<template slot-scope="scope">
							<span v-text="cons.val('roStatus', scope.row.status)"></span>
						</template>
					</nt-table-column>
					<nt-table-column label="操作" width="240px">
						<template slot-scope="scope">
							<div class="links">
								<span v-if="" @click="events.showRoDialog(scope.row.id)">关联退税订单</span>
								<span v-if="" @click="events.modifyFe(scope.row.id)">修改</span>
								<span v-if="" @click="events.deleteFe(scope.row.id)">删除</span>
								<span @click="events.toFeDetailPage(scope.row.id)">详情</span>
							</div>
						</template>
					</nt-table-column>
				</nt-table>
			</template>
		</template-search-list>
	</div>
</template>

<script type="text/javascript">

	import { TemplateSearchList } from 'xbn-biz-components'
	import model from '../models/index'
	import CONS from '../common/cons'
	import EVENTS from '../common/events'
	
	var cons = CONS
	var eves = null

	export default {
		props: {
			
		},

		data() {
			eves = new EVENTS(this)
			return {
				cons: cons,
				events: eves,
				query: {
					simple: [{
                        value: 'aaa',
                        label: '用户名',
                        'placeholder': '请输入用户名'
                    }, {
                        value: 'bbb',
                        label: '付汇人',
                        placeholder: '请输入付汇人'
                    }, {
                        value: 'ccc',
                        label: '付汇账号',
                        placeholder: '请输入付汇账号'
                    }],
					combo: [],
					quickFilter: [
						{
	                        key: 'status',
	                        label: '关联退税订单状态',
	                        options: cons.roStatus
	                    }
					]
				}
			}
		},

		methods: {
			getList() {
				return model.getList({}, this.ctx)
			}
		},

		created() {
			
		},

		mounted() {

		},

		components: {
			TemplateSearchList
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