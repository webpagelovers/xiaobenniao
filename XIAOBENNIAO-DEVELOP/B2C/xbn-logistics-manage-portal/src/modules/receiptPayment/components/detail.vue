<template>
	<div>
		<headd :title="`记录${title}明细`" :headTitle="title">
			<template slot="right-area">
				<nt-button v-show="!edit" type="primary" @click="edit = !0">修改明细</nt-button>
			</template>
		</headd>
		<ul class="lg-box-list">
			<li>
				<h3>基本信息</h3>
				<div>
					<ul class="lg-detail-list">
						<li v-for="(v, i) in det1">
							<label v-text="v"></label>：
							<span v-text="data[i]"></span>
						</li>
					</ul>
				</div>
			</li>
			<li class="rel">
				<h3>应付明细</h3>
				<div>
					<detail-table :data="data.payDetails"></detail-table>
				</div>
			</li>
		</ul>
	</div>
</template>

<script type="text/javascript">

	import { model, map, cons, Events, util } from '../@import'
	import { Headd, DetailTable } from '../@import'

	export default {
		props: {

		},

		data() {
			return {
				events: new Events(this),
				id: this.$route.params.id,
				edit: !1,
				data: {
					
				}
			}
		},

		computed: {
			title() {
				return util.getRpTitle()
			},

			det1() {
				return map.rpDetailBaseInfo
			},

			dtVue() {
				return util.getVueChildComponent(this, 'detail-table')
			}
		},

		methods: {
			async getDetail() {
				let data = await model.getDetail(this.id)

				let status = data.status
				status == 1 && (this.edit = !0)
				data.status = cons.val('roStatus', status)
				
				this.data = data
			}
		},

		watch: {
			'edit': {
				handler(val, oldValue) {
					this.dtVue.edit = val
				},
				deep: true
			}
		},

		created() {
			this.getDetail()
		},

		components: {
			Headd,
			DetailTable
		}
	}	
	
</script>

<style type="text/css" lang="less">
	.add-item-btn {
		position: absolute;
		right: 34px;
    	top: 5px;
	}
</style>