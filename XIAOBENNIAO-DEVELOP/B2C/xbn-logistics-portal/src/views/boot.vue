<template>
    <div id="xbn-app">
        <app-root v-if="login">
        </app-root>
    </div>
</template>

<script>

    //1 引入页面根框架组件 一般最少包括登录页、首页框架。 也可能含有其他种框架页
    import AppRoot from './app-root.vue';
    //import enter from './app-enter.vue';
    //3.2 boot需要的其他模块依赖
    var appVue = AppRoot;
    var url=window.location.hash;

 
    /*
    if(url.toLowerCase().indexOf('/settled')>-1){//入驻
        appVue = enter;
    }
    */
 

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
            'app-root': appVue,
        }
    }
</script>


