<style lang='less' >

    .user-pop {
        padding: 0!important;
        font-size: 14px;

        .user-info {
            padding: 16px 5px 16px 16px;
            border-bottom: 1px solid #e7eaec;
        }

        .pop-menu {
            li {
                padding: 16px;
                color: #1ab394;
                a{
                    padding-left: 16px;
                    color: #1ab394;
                }
                .pop-text-btn{
                    padding-left: 16px;
                }
            }
            li:hover{
                a{
                    color: #fff;
                }
                background: #1ab394;
                color: #fff;
                .nt-button--text{
                    color: #fff;
                }
            }
            li.active{
                a{
                    color: #fff;
                }
                background: #1ab394;
                color: #fff;
                .nt-button--text{
                    color: #fff;
                }
            }
        }
        .pop-text-btn{
            padding: 0px;
        }
    }
    .w169{width: 169px;}
    .w215{width: 215px;}
    /*
    .nt-page-head {
        height: 68px;
    	line-height: 68px;

        .page_title {
            float: left;
            font-size: 18px;
            padding-left: 32px;
            margin-right: 7px;
        }

        .page_search {
            float: left;
            width: 460px;
        }

        .page_icons {
            float: right;
            height: 68px;
            line-height: 70px;
            i {
                width: 37px;
                font-size: 24px;
                display: inline-block;
            }
        }
    }*/
</style>

<template>

    <div class='nt-page-head'>
        <div class='page_title'>
            <span v-if='title'>{{title}}</span>
            <span v-else>
                <slot name='title'></slot>
            </span>
        </div>

        <div class='page_search'>
            <slot name='search'></slot>
        </div>

        <nt-popover
                popper-class="user-pop"
                ref="user-menu"
                placement="bottom"
                width="190"
                trigger="click">
            <div class="user-info w169 Truncate" v-bind:title="userInfo.name">
                账号：{{userInfo.name}}
            </div>

            <ul class="pop-menu">
                <li><i class='nt-icon-xbn-32 curpointer vM' ></i><router-link class="menu-text" to="/user-info">个人信息</router-link></li>
                <li><i class='nt-icon-xbn-48 curpointer vM' ></i><router-link class="menu-text" to="/modify-password">修改密码</router-link></li>
                <li>
                    <i class='nt-icon-xbn-49 curpointer vM' ></i><a href="javascript:;" @click="handleLogout">退出系统</a>
                </li>
            </ul>
        </nt-popover>

        <div class='page_icons'>
            <nt-tooltip class="item" effect="dark" content="帮助" placement="bottom">
                <i class='nt-icon-xbn-19 curpointer c_fff tC' ></i>
            </nt-tooltip>
            <nt-tooltip class="item" effect="dark" content="消息提醒" placement="bottom">
                <i class='nt-icon-xbn-4 curpointer c_fff tC' v-bind:class="{ message_on: newMessage}" @click="handleNewMessage"></i>
            </nt-tooltip>
            <nt-tooltip class="item" effect="dark" content="用户信息" placement="bottom">
                <i class='nt-icon-xbn-5 curpointer c_fff tC' v-popover:user-menu></i>
            </nt-tooltip>

        </div>
    </div>
</template>
<script>
    import socket from '../../utils/socket.js';

    export default {
        components: {},
        props: [
            'title' //标题
        ],
        data () {
            return {
                newMessage : false,
                userInfo: {
                    name:''
                },
                delayMessage : 10
            };
        },
        mounted(){
            this.initSocket();
            this.initUserInfo();
            this.delay();
        },
        methods: {
            delay(){
                let that = this;
                let t1 = setInterval(function () {
                    that.delayMessage --;
                    if(that.delayMessage==0){
                        clearTimeout(t1);
                    }
                },1000);
            },
            async initUserInfo(){
                if(this.ctx.models.userCenter){
                    let res = await this.ctx.models.userCenter.getUserInfo();

                    if (res.statusCode === '2000000') {
                        let data = res.data
                        this.userInfo.name= data.uname;
                    }
                }
            },
            initSocket(){
                let that = this;
                socket.init(this.ctx.appCode,this.ctx.authentication.getToken(),this.ctx.servers.webSocket.options.baseURL);
                this.$nt.subscribe('message-center-message-hasread',(data)=>{
                    socket.deleteMessage(data);
                });

                this.newMessage = socket.hasMessages();

                socket.on('onmessage',data=>{
                    this.newMessage = true;
                    //可以订阅消息
                    if(that.delayMessage==0){
                        this.$nt.publish('message-center-new-message',data);
                    }
                });

                socket.on('onmessageempty',()=>{
                    this.newMessage = false;
                })
            },
            handleNewMessage(event){
                //this.newMessage = false;
                //跳转到消息中心
                this.$router.push({ name: 'message-center'});
            },

            handleLogout() {
                this.ctx.authentication.clearToken();
                this.ctx.authentication.fail();
            }
        }
    };
</script>

