<template>
    <div class="main_login">
        <div class="newHead">
            <div class="logoHeader">
                <img src="../images/login_h.jpg" width="170" height="44" alt=""/>
            </div>
        </div>
        <div class="wabForm">
            <div class="mainForm text_Pno">
                <login :loginConfig="loginConfig"  :type="type" ></login>
            </div>
        </div>
        <div class="newFooter">
            经营许可证编号 京ICP备14018641号
        </div>
    </div>
    <!--<div class="bg_images">-->
        <!--<div class="transfer_post rel">-->
            <!--<div class="login_m">-->
                <!--<img src="../images/login_h.jpg" width="170" height="44" alt=""/>-->
            <!--</div>-->
            <!--<login :loginConfig="loginConfig"  :type="type" ></login>-->
            <!--<div class="footer_m">-->
                <!--<p class="tC">经营许可证编号 京ICP备14018641号</p>-->
            <!--</div>-->
        <!--</div>-->
    <!--</div>-->

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
                    rules:{
                        username: [
                            {required: true, message: '请输入账号', trigger: 'blur'},
                            {min: 3, max: 20, message: '账号长度在3-20个字符', trigger: 'blur'}
                        ],
                        password: [
                            {required: true, message: '请输入密码', trigger: 'blur'},
                            {min: 6, max: 20, message: '密码长度在6-20个字符', trigger: 'blur'}
                        ],
                        identifyCode: [
                            {required: true, message: '请输入验证码', trigger: 'blur'},
                            {min: 4, max: 4, message: '验证码长度为4个字符', trigger: 'blur'}
                        ]
                    },
                    registHref : '#/register'
				},
				type : "admin"		// 前台登录设置为front 后台登录设置为admin
                }
            },

        components: {
            login: Common.components.login
        },
		methods: {

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
    .text_Pno p.tL{display: none;}/*立即注册隐藏*/
</style>
