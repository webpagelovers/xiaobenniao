<style lang='less'>

</style>

<template>
    <div class='plan-list-container'>
        <combo-search :simple='simpleSearch' :combo='comboSearch' :suggestion-method="remoteFetch" @query="handlerQuery" >

        </combo-search>
    </div>
</template>

<script>

    import listMixin from './search.config';

    export default {

        mixins: [listMixin],

        data() {
            return {};
        },

        computed: {},

        created: async function () {

        },

        watch: {},

        methods: {
            handlerQuery: function (param) {
                console.log('query', param);
            },

            getParam: function() {
                let params = this.$refs.pageTmpl.getCurrentQuery();
                this.logger.log(params);
            },
            remoteFetch: function(query, callback) {
                setTimeout(function() {
                    callback([
                        { 'value': '三全鲜食（北新泾店）'},
                        { 'value': 'Hot honey 首尔炸鸡（仙霞路）'}
                    ]);
                }, 1000);
            },
            //获取物流计划列表
            queryPlans: async function (params) {

            }
        }
    };
</script>