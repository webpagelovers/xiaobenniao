<template>
    <div>
        <message-center @messageset="handleMessageSet"  v-bind="messageConfig" >

        </message-center>
    </div>
</template>
<script>
    import Common from 'xbn-biz-common';
    export default {
        data () {
            return {
                messageConfig:{
                    category:[{
                        'value': '1', 'label': '竞品监控-库存预警'
                    }, {
                        'value': '2', 'label': '竞品监控-价格变动'
                    }, {
                        'value': '3', 'label': '竞品监控-发货地变动'
                    }, {
                        'value': '4', 'label': '竞品监控-发货方式变动'
                    }]
                }
            }
        },
        methods:{
            handleMessageSet() {
                alert('自定义消息设置');
            }
        },
        components: {
            'message-center' : Common.components.messageManage
        },
    }
</script>
