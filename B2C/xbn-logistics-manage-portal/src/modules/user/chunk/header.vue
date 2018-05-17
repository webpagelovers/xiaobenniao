<template>
	<div>
		<page-head :title="headTitle"></page-head>
		<nt-row class="operationBox header-operate">
			<nt-col :span="leftSpan">
				<i class="nt-icon nt-icon-arrow-left" @click="$router.back()" style="cursor: pointer;"></i>
				<span v-text="title"></span>
			</nt-col>
			<nt-col :span="rightSpan">
				<slot name="right-area"></slot>
			</nt-col>
		</nt-row>
	</div>
</template>

<script type="text/javascript">
	import { PageHead } from 'xbn-biz-components'

	export default {
		props: {
			headTitle: {
				type: String,
				default: '收/结汇管理'
			},
			title: {
				type: String
			},
			leftSpan: {
				type: Number,
				default: 8
			},
			rightSpan: {
				type: Number,
				default: 16
			}
		},

		data() {
			return {

			}
		},

		components: {
			PageHead
		}
	}

</script>

<style type="text/css" lang="less" scoped>
	.header-operate {
		>div:first-child {
			
		}
		>div:last-child {
			text-align: right;
		}
	}
</style>