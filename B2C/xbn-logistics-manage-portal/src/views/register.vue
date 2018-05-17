<template>
    <div class="main_login">
        <div class="newHead">
            <div class="logoHeader">
                <img src="../images/login_h.jpg" width="170" height="44" alt=""/>
            </div>
        </div>
        <div class="wabForm">
            <div class="mainForm">
                <regist :model="model" @login="handleLogin"></regist>
            </div>
        </div>
        <div class="newFooter">
            经营许可证编号 京ICP备14018641号
        </div>
    </div>

</template>

<script type="text/javascript">
    import Common from 'xbn-biz-common'

    export default {
        data() {
            return {
                model: {
                    values: {
                        email: '',
                        userName: '',
                        password: '',
                        verifyCode: '',
                        emailActiveCode: ''
                    },
                    rules: {
                        email: [
                            {required: true, message: 'please enter your email'}
                        ]
                    },
                    placeholders: {
                        userName:"请输入1-20位数字、字母或下划线，注册后不可修改",
                        emailActiveCode:"请输入邮件激活码"
                    },
                    attrs: {
                        //activeCardIndex: 1,//选中的card 的 Index
                        protocolChecked: !1,//协议是否checked
                        systemType: 'logistics'//注册系统的主题, 默认 数据分析系统
                    },
                    hooks: {
                        registSuccess() {
                            console.log('Regist Success!')
                        },
                        registError() {

                        }
                    }
                }
            }
        },

        components: {
            regist: Common.components.regist
        },

        computed: {

        },
        methods:{
            handleLogin(){
                debugger;
                this.$emit('login');
            }
        }
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
        background: url(../images/bg.jpg) no-repeat center center;
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
