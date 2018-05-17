<template>
    <div class="main_login">
        <div class="newHead">
            <div class="logoHeader">
                <img src="../images/logo_m.jpg" width="170" height="44" alt=""/>
            </div>
        </div>
        <div class="wabForm">
            <div class="mainForm">
                <find-password :model="model"></find-password>
            </div>
        </div>
        <div class="newFooter">
            经营许可证编号 京ICP备14018641号
        </div>
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
                    subject: '集货转运系统找回密码'
                }
            };
        },
        methods:{

        },
        components: {
            'find-password' : Common.components.findPassword
        },
    }
</script>
<style type="text/css" lang="less">
    div#xbn-app {
        display: table;
        width: 100%;
        height: 100%;
    }
    .main_login{
        display: table-cell;
        width: 100%;
        vertical-align: middle;
        height: 100%;
        min-height: 590px;
        background: #fff;
        position: relative;
    }
    .mainForm{
        min-width: 595px;
        max-width: 1200px;
        margin: 68px auto;
        clear: both;
        overflow: hidden;
        min-height: 565px;
    }
    .wabForm{
        background: url(../images/login.png) no-repeat center center;
        margin-bottom: 75px;
    }
    .newHead{
        position: absolute;
        top: 0;
        width: 100%;
        height: 68px;
        line-height: 68px;
    }
    .newFooter{
        height: 75px;
        line-height: 75px;
        text-align: center;
        border-top: 1px solid #eee;
        position: absolute;
        bottom: 0px;
        width: 100%;
    }
    .logoHeader{
        width: 1200px;
        margin: 0 auto;
        padding-top:23px;
    }
    .mainForm .nt-checkbox__input{
        vertical-align: -2px;
    }
</style>