<template>
	<div>
		<template-search-list 
			ref='pageTmpl' 
			title='CF用户' 
			:simple='query.simple'
			:combo='query.combo' 
			:method='getList'>
			<template slot="page-table" slot-scope="scope">
				<div class="contentBox">
					<nt-table :data="scope.tableData">
						<nt-table-column prop="cfUserName" label="CF用户名"></nt-table-column>
						<nt-table-column prop="cfUserId" label="CF用户ID"></nt-table-column>
						<nt-table-column prop="cfUserPhone" label="手机号"></nt-table-column>
						<nt-table-column prop="createTime" label="创建时间"></nt-table-column>
						<nt-table-column label="操作" width="240px">
							<template slot-scope="scope">
								<div class="links">
									<span @click="$route.push(scope.row.id)">详情</span>
									<span @click="$route.push(scope.row.id)">修改</span>
								</div>
							</template>
						</nt-table-column>
					</nt-table>
				</div>
			</template>
		</template-search-list>
	</div>
</template>

<script type="text/javascript">
	
	import { model, map, cons, util } from '../@import'
	import { TemplateSearchList } from 'xbn-biz-components'

	export default {
		props: {
			
		},

		data() {
			return {
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
			

		},

		methods: {
			async getList(query) {
				return {data: await model.getList(query)}
			}
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