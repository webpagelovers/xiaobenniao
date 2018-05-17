<template>
	<div>
		<headd title="新增/修改一笔收汇">
			<template slot="right-area">
				<nt-button type="primary" @click="save">保存</nt-button>
				<nt-button type="primary" @click="$router.back()">返回</nt-button>
			</template>
		</headd>
		<ul class="lg-box-list">
			<li>
				<h3>企业信息</h3>
				<div>
					<nt-form :rules="rules" :model="data" ref="form" label-width="140px" class="form">
						<nt-form-item label="用户名：" prop="aaa">
							<nt-input v-model="aaa" placeholder="请输入用户名"></nt-input>
						</nt-form-item>
						<nt-form-item label="外汇金额：" prop="">
							<nt-input v-model="aaa" placeholder="请输入用户名"></nt-input>
							<nt-select v-model="aaa">
								<nt-option v-for="i in currency" :key="i.value" :value="i.value" :label="i.label"></nt-option>
							</nt-select>
						</nt-form-item>
						<nt-form-item label="付汇账号：" prop="">
							<nt-input v-model="aaa" placeholder="请输入用户名"></nt-input>
						</nt-form-item>
						<nt-form-item label="付汇人：" prop="">
							<nt-input v-model="aaa" placeholder="请输入用户名"></nt-input>
						</nt-form-item>
						<nt-form-item label="外汇类型：" prop="aaa">
							<nt-radio v-model="aaa" label="1">预付款</nt-radio>
							<nt-radio v-model="aaa" label="2">尾款</nt-radio>
						</nt-form-item>
						<nt-form-item label="交易流水号：" prop="">
							<nt-input v-model="aaa" placeholder="请输入用户名"></nt-input>
						</nt-form-item>
						<nt-form-item label="实际到账时间：" prop="">
							<nt-date-picker v-model="aaa" type="datetime" placeholder="请输入用户名"></nt-date-picker>
						</nt-form-item>
						<nt-form-item label="收汇金额：" prop="">
							<nt-input v-model="aaa" placeholder="请输入用户名"></nt-input>
						</nt-form-item>
						<nt-form-item label="结汇汇率：" prop="">
							<nt-input v-model="aaa" placeholder="请输入用户名"></nt-input>
						</nt-form-item>
						<nt-form-item label="结汇金额：" prop="">
							<nt-input v-model="aaa" readonly placeholder="请输入用户名"></nt-input>
							<span>CNY</span>
						</nt-form-item>
					</nt-form>
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
			rules: {
				name: [
					{required: true, message: '请输入姓名', trigger: 'blur'}
				], mobile: [
					{required: true, message: '请输入手机号码', trigger: 'blur'},
					{pattern: /^1\d{10}$/, message: '请填写正确的手机号码', trigger: 'blur'},
				], userType: [
					{required: true, message: '请选择用户类别', trigger: 'change'}
				]
			}
		},

		data() {
			return {
				data: {
					
				},
				currency: [{
					value: '1', label: 'US'
				}, {
					value: '2', label: 'CNY'
				}]
			}
		},

		methods: {
			save() {
				this.$refs.form.validate(flag => {
					if (flag) {
						
					}
				})
			}
		},

		components: {
			Headd
		}
	}	

</script>

<style type="text/css" lang="less" scoped>
	.form {
		.nt-input {
			width: 240px;
		}
	}
</style>