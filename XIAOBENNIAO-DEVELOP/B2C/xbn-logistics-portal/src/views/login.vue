<template>
    <div class="main_login">
        <div class="newHead">
            <div class="logoHeader">
                <img src="../images/logo_m.jpg" width="170" height="44" alt=""/>
            </div>
        </div>
        <div class="wabForm">
            <div class="mainForm">
                <login :loginConfig="loginConfig"  :type="type" ></login>
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
                // 用户自定义配置
                loginConfig: {
					title : "集货转运",
					logoSrc : "",
					//以下为可配置项，需要可放开注释进行自定义配置
					labels:{
						username : "帐号",
						password : "密码"
					},
					placeholders:{
						username : "请输入邮箱/手机号",
						password : "请输入密码",
						identifyCode : "请输入验证码"
					},
                    registHref : '/register',
                    findPwdHref : '/find-password/',
                    successCallback: this.successCallbackFun
				},
				type : "front"		// 前台登录设置为front 后台登录设置为admin
                }
            },

        components: {
            login: Common.components.login
        },
		methods: {
            async successCallbackFun(){

                let info = await this.$nt.models.settled.getSellerInfo();
                if(info.statusCode == '2000000'){
                    if(info.data.status == '1'|| info.data.status == '3'){
                        this.$router.push({path:'/settled/settledExamine'});
                    }else if(info.data.status == '2'){
                        if(info.data.isFirst == '1'){
                            this.$router.push({path:'/commodity/list/'});
                        }else{
                            this.$router.push({path:'/settled/settledExamine'});
                        }
                    }
                }else{
                    this.$router.push({path:'/settled/settledTypes'});
                }
            }
		},

        computed: {

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
