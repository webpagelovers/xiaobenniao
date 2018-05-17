<template>
    <div id="xbn-app">
        <nt-row>
            <nt-col :span="2">
                <ul class="nt-menu" style="">
                    <li class="nt-menu-item" style="padding-left: 40px;"><a href="#/mail/writeMail/new" class=""><span>写信</span></a> </li>
                    <li class="nt-menu-item" style="padding-left: 40px;"><a href="#/mail/inboxList" class=""><span>收件箱</span></a> </li>
                    <li class="nt-menu-item" style="padding-left: 40px;"><a href="#/mail/outboxList/" class=""><span>发件箱</span></a> </li>
                    <li class="nt-menu-item" style="padding-left: 40px;"><a href="#/mail/draftList/" class=""><span>草稿箱</span></a> </li>
                    <li class="nt-menu-item" style="padding-left: 40px;"><a href="#/mail/deletedList/" class=""><span>已删除</span></a> </li>
                    <li class="nt-menu-item" style="padding-left: 40px;"><a href="#/mail/dustbinList/" class=""><span>垃圾箱</span></a> </li>
                    <li class="nt-menu-item" style="padding-left: 40px;"><a href="#/mail/setting/" class=""><span>邮箱设置</span></a> </li>
                </ul>
            </nt-col>
            <nt-col :span="22">
                    <router-view></router-view>
            </nt-col>
        </nt-row>
    </div>
</template>

<script>

    export default {
        data: function() {
            return {

            }
        },
        created: async function() {

        },
        components: {


        }
    }
</script>


