<style lang="less">

</style>

<template>
    <div class="plan-list-container">

        <nt-button @click="original">原始数据</nt-button>
        <nt-button @click="globalCache">获取缓存函数1</nt-button>
        <nt-button @click="paramedCache">获取缓存函数2</nt-button>
        <nt-button @click="clearCache">清除缓存</nt-button>

        <nt-input
                type="textarea"
                :rows="2"
                v-model="result">
        </nt-input>

    </div>
</template>

<script>

    export default {
        components: {
        },
        data() {
            return {
                result: ''
            };
        },

        created: async function () {

        },

        methods: {

            async clearCache() {
                await this.ctx.models.modelcache.clearCache();
            },

            async globalCache() {
                let result = await this.ctx.models.modelcache.cached();
                this.result = JSON.stringify(result);
            },

            async paramedCache() {
                let result = await this.ctx.models.modelcache.cachedByParam({
                    key: '1'
                });
                this.result = JSON.stringify(result);
            },

            async original() {
                let result = await this.ctx.models.modelcache.original();
                this.result = JSON.stringify(result);
            }
        }
    };
</script>


