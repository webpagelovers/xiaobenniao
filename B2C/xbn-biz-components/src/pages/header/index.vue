<style lang="less">

</style>

<template>
    <div class="plan-list-container">
        <page-head :title="'物流计划'"></page-head>
    </div>
</template>

<script>
    import PageHead from '../../components/head/pagehead.vue';

    export default {
        components: {
            PageHead
        },
        data() {
            return {

            };
        },

        created: function () {
            let loadingInstance1 = this.$loading({
                fullscreen: true,
                text: '正在打开中'
            });

            setTimeout(function() {
                loadingInstance1.close();
            }, 200);
        },

        methods: {

        }
    };
</script>


