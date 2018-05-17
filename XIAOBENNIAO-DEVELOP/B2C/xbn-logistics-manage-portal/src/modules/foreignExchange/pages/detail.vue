<template>
	<div>
		<headd title="外汇详情">
			<template slot="right-area">
				<nt-button type="primary" @click="events.showRoDialog(id)">关联退税订单</nt-button>
				<nt-button type="primary" @click="events.toFeFormPage(id)">修改</nt-button>
				<nt-button type="primary" @click="events.deleteFe(id)">删除</nt-button>
				<nt-button type="primary" @click="$router.back()">返回</nt-button>
			</template>
		</headd>
		<ul class="lg-box-list">
			<li>
				<h3>外汇信息</h3>
				<div>
					<ul>
						<li v-for="(v, i) in det1">
							<label v-text="v"></label>
							<span v-text="data[i]"></span>
						</li>
					</ul>
				</div>
			</li>
		</ul>
	</div>
</template>

<script type="text/javascript">

	import headd from '../common/header.vue'
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
				id: 1,
				data: {
					name: 'huahua'
				}
			}
		},

		methods: {

		},

		computed: {
			det1() {
				return {
					name: '姓名'
				}
			}
		},

		components: {
			headd
		}
	}	
	
</script>

<style type="text/css" lang="less" scoped>
	
</style>