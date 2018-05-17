<template>
    <div>
        <modify-password :model="model"></modify-password>
    </div>
</template>
<script>
    import Common from 'xbn-biz-common';

    export default {
        data() {
            return {
                model: {
                    values: {
                        email: '',
                        newPassword: '',
                        verifyCode: '',
                        emailVerifyCode: ''
                    },
                    rules: {
                        email: [
                            {required: true, message: '请输入邮箱'}
                        ]
                    },
                    placeholders: {

                    },
                    attrs: {
                        protocolChecked: !1,
                        protocolContentIndex: 0,
                        loginUrl : '#/login/'
                    },
                    subject: '集货转运系统修改密码'
                }
            };
        },
        methods:{

        },
        components: {
            'modify-password' : Common.components.modifyPwd
        },
    }
</script>
