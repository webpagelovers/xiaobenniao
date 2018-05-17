<template>
	<div>
		<headd :title="title" headTitle="CF用户">
			<template slot="right-area">
				<nt-button v-if="edit" type="primary" @click="save">保存</nt-button>
				<nt-button v-if="!edit" type="primary" @click="$router.push('edit')">修改</nt-button>
				<nt-button type="primary" @click="$router.back()">返回</nt-button>
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
			<li>
				<h3>企业信息</h3>
				<div>
					<nt-form :rules="rules" :model="data" ref="form" label-width="140px" class="form" v-if="edit">
						<nt-form-item :key="j" :label="i + '：'" :prop="j" v-for="(i, j) in det2">
							<nt-input v-model="data[j]" :placeholder="'请输入' + i"></nt-input>
						</nt-form-item>
					</nt-form>
					<ul class="lg-detail-list com-list" v-else>
						<li v-for="(v, i) in det2">
							<label v-text="v"></label>：
							<span v-text="data[i]"></span>
						</li>
					</ul>
				</div>
				<contactor :list="data.contactor" :edit="edit"></contactor>
			</li>
			<li v-if="!edit">
				<h3>修改信息</h3>
				<div>
					
				</div>
			</li>
		</ul>
	</div>
</template>

<script type="text/javascript">
	
	import { model, map, cons, util } from '../@import'
	import Headd from '../chunk/header.vue'
	import Contactor from '../chunk/contactor.vue'

	export default {
		props: {
			edit: {
				type: Boolean,
				default: !1
			}
		},

		data() {
			return {
				rules: map.rulesGenerator('companyInfo'),
				data: {
					contactor: [{
						name: 'huahua',
						phone: '15658471025',
						email: 'hechfei25@163.com',
						remark: 'huahau'
					}]
				}
			}
		},

		methods: {
			getDetail() {

			},

			save() {

			}
		},

		computed: {
			title() {
				return this.edit? '编辑CF用户': 'CF用户详情'
			},

			det1() {
				return map.baseInfo
			},

			det2() {
				return map.companyInfo
			}
		},

		components: {
			Headd,
			Contactor
		}
	}

</script>

<style type="text/css" lang="less" scoped>
	.form {
		.nt-input {
			width: 240px;
		}
	}
	.com-list {
		margin-left: 38px;
		li {
			width: 100%;
			padding: 16px 0;
			>label {
				width: 81px;
				display: inline-block;
				text-align: right;
			}
		}
	}
</style>