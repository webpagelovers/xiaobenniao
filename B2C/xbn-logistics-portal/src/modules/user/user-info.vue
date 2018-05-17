<template>
    <div>
        <page-head title="个人中心"></page-head>
        <user-info>

        </user-info>
    </div>
</template>
<script>
    import Common from 'xbn-biz-common';
    import {PageHead} from 'xbn-biz-components';
    export default {
        data () {
            return {

            }
        },
        methods:{

        },
        components: {
            'user-info' : Common.components.userInfo,
            'page-head' : PageHead
        },
    }
</script>
