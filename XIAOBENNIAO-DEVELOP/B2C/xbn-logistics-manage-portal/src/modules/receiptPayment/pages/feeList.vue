<template>
	<fee-list :columns="columns"></fee-list>
</template>

<script type="text/javascript">
	import { map } from '../@import'
	import { FeeList } from '../@import'

	export default {
		props: {

		},

		data() {
			return {
				columns: map.feeListColumns
			}
		},

		components: {
			FeeList
		}
	}
</script>