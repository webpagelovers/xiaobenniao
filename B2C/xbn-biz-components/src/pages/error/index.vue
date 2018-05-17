<style lang="less">

</style>

<template>
    <div class="plan-list-container">
        <div>assd</div>

        <div>
            <nt-button @click="reponse200">正常返回</nt-button>
            <nt-button @click="throwToFrame">抛出到框架</nt-button>
            <nt-button @click="bizHandled">自己处理</nt-button>
        </div>
    </div>
</template>

<script>
    import PageHead from '../../components/head/pagehead.vue';

    export default {
        components: {
            PageHead
        },
        prefetch: ['somedata'],
        data() {
            this.logger.style('return data()');
            return {
                'some': this.somedata()
            };
        },
        mounted: function() {
            this.logger.style('mounted');
        },


        beforeCreate: async function() {
            await new Promise(function(resolve) {
                setTimeout(function() {
                    resolve();
                }, 3000);
            });
            this.logger.style('beforeCreate');
        },

        created: async function() {
            this.logger.style('created');
            //await this.loadAccount();
        },

        beforeRouteEnter: function (to, from , next) {
            next();
        },

        methods: {

            reponse200: async function() {
                let result = await this.ctx.models.account.accountRecharge(1);
                this.logger.style(`${result.statusCode}`);
            },

            reponseok: async function() {
                let result = await this.ctx.models.account.accountRecharge(-1);
                this.logger.style(`${result.statusCode}`);
            },

            async throwToFrame() {
                try {
                    let result = await this.ctx.models.account.accountRecharge(2);
                    this.$alert(`${result.statusCode}  抛出异常后，后续代码被中断`);
                } catch (err) {
                    this.ctx.onerror(err);
                }
            },

            async bizHandled() {
                let result = null;
                try {
                    result = await this.ctx.models.account.accountRecharge(3);
                    //如果 statusCode 在错误码(error.js)中未定义
                    if(result.statusCode === '2000232') {

                    }
                } catch (err) {
                    //if statusCode 在错误码中已定义
                    if (err.data.statusCode === '4020002') {
                        //处理业务异常
                    } if (err.data.statusCode === '4020003') {
                        //处理业务异常
                    } else {
                        //交给框架处理的异常
                        this.ctx.onerror(err);
                    }
                }
            },

            async loadAccount() {
                let time = await this.ctx.models.account.accountRecharge();
                this.logger.style('loaded' + time.statusCode);
            }
        }
    };
</script>


