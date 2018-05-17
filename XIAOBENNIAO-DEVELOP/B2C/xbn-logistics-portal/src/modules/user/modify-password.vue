<template>
    <div>
        <page-head title="修改密码"></page-head>
        <modify-password>

        </modify-password>
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
            'modify-password' : Common.components.modifyPassword,
            'page-head' : PageHead
        },
    }
</script>
