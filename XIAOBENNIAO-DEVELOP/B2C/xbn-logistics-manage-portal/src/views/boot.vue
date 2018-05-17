<template>
    <div id="xbn-app" style="height: 100%;">
        <app-root v-if="login">

        </app-root>
    </div>
</template>

<script>

    //1 引入页面根框架组件 一般最少包括登录页、首页框架。 也可能含有其他种框架页
    import AppRoot from './app-root.vue';

    //3.2 boot需要的其他模块依赖

    export default {
        data: function() {
            return {
                loading: true,
                login: true
            }
        },
        created: async function() {

        },
        components: {
            'app-root': AppRoot,
        }
    }
</script>


