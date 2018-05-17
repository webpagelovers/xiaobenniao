<template>
	<div class="contactor-box">
		<nt-form 
		:rules="rules" 
		:model="data" 
		v-for="(data, index) in list"
		:key="index"
		:ref="'form' + index" 
		label-width="100px" 
		class="form">
			<div class="contactor-title" v-text="`企业联系人${++index}：`"></div>
			<nt-form-item :key="j" :prop="j" v-for="(i, j) in det2">
				<nt-input v-model="data[j]" :placeholder="'请输入' + i" v-if="edit"></nt-input>
				<span v-text="data[j]" v-else></span>
			</nt-form-item>
		</nt-form>
		<nt-button v-if="edit" type="primary" @click="add" class="con-add-btn">继续增加</nt-button>
	</div>
</template>

<script type="text/javascript">
	import { model, map, cons, util } from '../@import'

	export default {
		props: {
			list: {
				type: Array
			},
			edit: {
				type: Boolean,
				default: !1
			},
			limitNum: {
				type: Number,
				default: 5
			}
		},

		data() {
			return {
				rules: map.rulesGenerator('companyInfo')
			}
		},

		methods: {
			add() {
				let limit = this.limitNum
				this.list.length < limit? this.list.push({}): this.$alert(`最多添加${limit}个联系人`)
			}
		},

		computed: {
			det2() {
				return map.companyContact
			}
		},
	}
</script>

<style type="text/css" lang="less" scoped>
	.form {
		.nt-input {
			width: 180px;
		}
	}
	.contactor-box {
    	margin: -38px 0 0 38px;
	}
	.contactor-title {
		margin-bottom: -16px;
	}
	.con-add-btn {
		margin: 10px 0 20px 100px;
	}
</style>