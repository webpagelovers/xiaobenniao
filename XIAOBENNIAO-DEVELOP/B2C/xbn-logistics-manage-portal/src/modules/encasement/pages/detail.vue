<template>
	<div class="vue-2018011201">
		<page-head :title="'装箱计划'"></page-head>
		<nt-row class="operationBox " style="margin: 0;">
			<nt-col :span="18" class="f16">
				<i class="nt-icon nt-icon-arrow-left" @click="$router.back()" style="cursor: pointer;"></i>&nbsp;&nbsp;装箱计划详情
			</nt-col>
			<nt-col :span="6" style="text-align: right;">
				<nt-button type="primary" nt-col-offset-0 @click="jumpAdd">生成报关订单</nt-button>
			</nt-col>
		</nt-row>
		<nt-form label-width="150px" ref="formModel" :model="formModel" >
			<div class="contentBox">
				<div class="border_layout">
				<!-- 详细信息 -->
				<detail :model="model"></detail>
				</div>
			</div>
		</nt-form>
	</div>
</template>

<script>

import {ajaxDataMumberToString} from '../models/checkAjaxData.js'
import {PageHead} from 'xbn-biz-components';
import detail from './components/cp-detail.vue';
import { handleStatus } from '../models/status.js';

export default {
	data() {
		return {
				handleStatus,
			model: {},
			formModel: {},
			id:0
		}
	},

	components: {
        PageHead,
		detail
	},

	beforeCreate: function() {

	},

	created: async function() {
		let id = this.$route.params.id;
		this.id = id
		this.getDetail(id);

	},

	methods: {
		//跳转生成报关订单
		jumpAdd () {
			this.$router.push({path: '/encasement/edit/' + this.id})
		},

		//获取信息
		async getDetail(id) {
			var json = await this.$nt.models.encasement.getEncasementInfo({ id }, this.ctx);
			this.model = ajaxDataMumberToString(json);
		}
	}
}
</script>


<style lang="less">
.vue-2018011201{

}
</style>
