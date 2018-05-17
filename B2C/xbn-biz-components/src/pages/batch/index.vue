<style lang="less">

</style>

<template>
    <div class="plan-list-container">

        <batch-import title="批量上传物流计划" :uploadUrl="uploadPlanApi" ref="importDialog" @imported="importSuccess" @importedError="uploadError">
            <p>请将物流计划信息填入《物流计划上传模板》，然后通过以下方式上传。</p>
            <p class="col_317dff">
                <a :href="downloadTempApi"
                   class="col_317dff"
                   download>获取《物流计划上传模板》</a>
            </p>
        </batch-import>


        <nt-button type="primary" nt-col-offset-0 @click="handleBatchImport">批量上传</nt-button>

    </div>
</template>

<script>
    import {BatchImport} from '../../index';

    export default {
        components: {
            BatchImport
        },
        data() {
            return {
                downloadTempApi: this.ctx.servers.default.options.baseURL + '/gcfsLogisticsPlan/downloadPlanTemplate',
                uploadPlanApi: this.ctx.servers.default.options.baseURL + '/gcfsLogisticsPlan/uploadPlan'
            };
        },

        created: async function () {

        },

        methods: {
            handleBatchImport: function () {
                this.$refs.importDialog.show();
            },

            importSuccess: function () {

            },

            uploadError: function(){
                this.$notify.error({
                    title: '错误',
                    message: '这是一条错误的提示消息'
                });
            }
        }
    };
</script>


