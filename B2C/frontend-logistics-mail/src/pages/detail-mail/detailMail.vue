<template>
    <div>
        <PageHead title="邮件"></PageHead>
        <div class="operationBox">
            <nt-button type="primary"  @click="handleBack" >返回</nt-button>
            <nt-button type="primary"  @click="handleReplyMail" v-if="(this.mailType !== '2' && this.mailInfo.mailStatus !== '3' && this.mailInfo.mailStatus !== '4')">回复</nt-button>
            <nt-button type="primary"  @click="handleReplyMailAll" >回复全部</nt-button>
            <nt-button type="primary"  @click="handleForward" >转发</nt-button>
            <nt-dropdown @command="handleSignMailwrap" v-if="this.mailType !== '3'">
                <nt-button type="primary" >
                    标记为...<i class="nt-icon-caret-bottom nt-icon--right"></i>
                </nt-button>
                <nt-dropdown-menu slot="dropdown">
                    <nt-dropdown-item v-for="(item , index) in markList" :value="item.value" :key="index">{{item.label}}</nt-dropdown-item>
                </nt-dropdown-menu>
            </nt-dropdown>
            <!--<nt-select v-model="mailStatus" placeholder="标记为..."  @change="handleSignMail" class="w110 mR10 mL10">
                <nt-option v-for="(item , index) in markList" :label="item.label" :value="item.value" :key="index"></nt-option>
            </nt-select>-->
            <nt-button type="primary"  @click="handleSignMail('0')" v-if="(this.mailType === '1' || this.mailType === '2')">删除</nt-button>
            <nt-button type="primary"  @click="handleDeleteMail" v-if="(this.mailType === '4' || this.mailType === '5')">彻底删除</nt-button>
            <nt-button type="primary"  @click="handleJunkMail" v-if="(this.mailType === '1' || this.mailType === '2')">垃圾邮件</nt-button>
            <nt-button type="primary"  @click="handleSignMail('4')" v-if="this.mailType === '5'">这不是垃圾邮件</nt-button>
            <nt-dialog
                    title="设为垃圾邮件"
                    :visible.sync="dialogVisible"
                    size="tiny">
                <div>
                    <p>将邮件标记为垃圾邮件;</p>
                    <div>
                        <nt-checkbox v-model="checked">将以下地址加入黑名单(该地址发送的邮件将会进入垃圾邮件):</nt-checkbox>
                        <div>
                            <p>{{mailInfo.sendMailAddress}}</p>
                        </div>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                        <nt-button @click="dialogVisible = false">取 消</nt-button>
                        <nt-button type="primary" @click="handleJunkMailWrap">确 定</nt-button>
                    </span>
            </nt-dialog>
        </div>
        <div style="background-color: white" class="competing_infor_main">
            <h2  class="bold break f16">{{mailInfo.mailSubject}}</h2>
            <div style=" background:#eeeff6; line-height: 22px" class="pL5 mT16">
                <p>发件人：<span>{{mailInfo.sendMailAddress}}</span></p>
                <p>收件人：<span>{{mailInfo.mailReceiver}}</span></p>
                <p v-if="mailInfo.ccsReason">抄送人：<span>{{mailInfo.ccsReason}}</span></p>
                <p v-if="mailInfo.bccsReason">密送人：<span>{{mailInfo.bccsReason}}</span></p>
                <p>时  间：<span>{{mailInfo.sendTime}}</span></p>
                <p v-if="this.mailInfo.sendOrReceive !=='2' && this.mailInfo.attachNum > 0">附  件：<span>{{ mailInfo.attachNum + '个' }}</span>
                    <span  @click="goAnchor('#attachment')" style="color: #00a3ff;text-decoration: underline;cursor: pointer;">查看附件</span></p>
            </div>
            <div class=" mT25">
            <div >
                <iframe ref="iframeContent" frameborder="0" ></iframe>
            </div>
            <div v-if="this.mailInfo.sendOrReceive !=='2' && this.mailInfo.attachNum > 0"  id="attachment" class="border_outer">
                <!--<div v-if="mailInfo.hasAttachment > 0" id="attachment" class="border_outer">-->
                <div>
                    <div style="padding:6px 10px 10px 8px; background: #eeeff6">
                         <h3 ><i class="nt-icon-xbn-62 mR5"></i>附件({{mailInfo.attachNum + '个'}})</h3>
                    </div>
                    <div style="display: flex">
                        <div style="display: flex" v-for="(item , index) in mailAttachmentList" :key="index">
                            <div class="mL10 mR10 mT10"><img src="../../images/file-icons-txt.png"></div>
                            <div  class="mB15">
                                <p class="mT10">{{item.attachName}}</p>
                                <p>{{item.attachSize}}kb</p>
                                <nt-button type="text"  @click="openWindow(item.attachLocation)">预览</nt-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {PageHead} from 'xbn-biz-components'
    import  {data} from '../../models/data'

    export default {
        components: {PageHead},
        data() {
            return {
                mailStatus:null, //邮箱状态
                markList:data.markList, //标记为数据
                mailId:this.$route.params.id,
                mailType:this.$route.params.mailType,
                mailInfo:{},
                mailAttachmentList:[],
                dialogVisible:false,
                checked: false,
            }
        },
        created () {
            this.mailDetail(this.mailId)
        },
        methods:{
            async mailDetail(id){
                try {
                    const res = await this.$nt.models.mail.mailInfo({id: id});
                    if(Number(res.statusCode) === data.data.statusCode){
                        this.mailInfo = res.data;

                        if(this.mailInfo){
                            if(this.mailInfo.ccs && this.mailInfo.ccs.length > 0){
                                this.mailInfo.ccsReason = this.handleArr(this.mailInfo.ccs);
                            }
                            if(this.mailInfo.bccs && this.mailInfo.bccs.length > 0){
                                this.mailInfo.bccsReason = this.handleArr(this.mailInfo.bccs);
                            }

                            if(this.mailInfo.readFlag === '1'){
                                this.handleSignMail('2',true);
                            }

                            if(this.mailInfo.mailContent){
                                this.setIframe(this.mailInfo.mailContent);
                            }

                            if(Number(this.mailInfo.hasAttachment)){
                                this.getEmailAttachment(id);
                            }
                        }

                    }
                } catch (err) {
                    //交给框架处理的异常
                    this.ctx.onerror(err);
                }
            },

            async getEmailAttachment(id){
                try {
                    const res = await this.$nt.models.mail.getEmailAttachment({mailId: id});
                    if(Number(res.statusCode) === data.data.statusCode){
                        this.mailAttachmentList = res.data;
                    }
                } catch (err) {
                    //交给框架处理的异常
                    this.ctx.onerror(err);
                }
            },

            openWindow(value){
                window.open(value,'_blank');
            },

            handleArr(arr){
                let array = [];
                arr.forEach( v =>{
                    array.push(v.contactMail)
                });
                if(array.length > 1){
                    return array.join(';')
                }else {
                    return array[0];
                }
            },
            handleBack(){
                if(this.$route.query['source']){
                    this.$router.push({path:'/mail/'+ this.$route.query['source']})
                }else{
                    this.$router.back()
                }
            },
            /**
             @method getHeadHtml 截取head标签内的元素
             @param content {html} 需要截取的html
             */
            getHeadHtml (content) {
                let REG_BODY = /<head[^>]*>([\s\S]*)<\/head>/;
                function getHead(content){
                    let result = REG_BODY.exec(content);
                    if(result && result.length === 2)
                        return result[1];
                    return content;
                }
                return getHead(content);
            },
            /**
             @method getBodyHtml 截取body标签内的元素
             @param content {html} 需要截取的html
             */
            getBodyHtml (content) {
                let REG_BODY = /<body[^>]*>([\s\S]*)<\/body>/;
                function getBody(content){
                    let result = REG_BODY.exec(content);
                    if(result && result.length === 2)
                        return result[1];
                    return content;
                }
                return getBody(content);
            },
            setIframe(content){
                content = content.replace(/<style type="text\/css"[^>]*>body([\s\S]*)<\/style>/, ' ');
                this.$refs.iframeContent.contentDocument.body.innerHTML = this.getBodyHtml(content);
                this.$refs.iframeContent.contentDocument.head.innerHTML = this.getHeadHtml(content);
                this.$refs.iframeContent.style.height = this.$refs.iframeContent.contentDocument.documentElement.offsetHeight + 'px';
                this.$refs.iframeContent.style.width = '100%';
            },

            goAnchor(selector) {
                // 获取当前滚动条与窗体顶部的距离
                let distance = document.documentElement.scrollTop || document.body.scrollTop,
                    total = this.$el.querySelector(selector).offsetTop;
                // 计算每一小段的距离
                let step = total / 50;
                (function smoothDown () {
                    if (distance < total) {
                        distance += step
                        // 移动一小段
                        document.body.scrollTop = distance;
                        document.documentElement.scrollTop = distance;
                        // 设定每一次跳动的时间间隔为10ms
                        setTimeout(smoothDown, 10)
                    } else {
                        // 限制滚动停止时的距离
                        document.body.scrollTop = total;
                        document.documentElement.scrollTop = total;
                    }
                })()
            },

            handleSource(){
                let arr = data.mailList,type=null;
                arr.forEach((v)=>{
                    if(v.value === this.mailType){
                        type = v.label;
                    }
                });
                return type;
            },
            /*
           * 回复
           */
            handleReplyMail(){
                this.$router.push({path:'/mail/writeMail/reply/'+ this.mailId+'/'+ this.handleSource()});
            },
            /*
            * 回复全部
            */
            handleReplyMailAll(){
                this.$router.push({path:'/mail/writeMail/replyAll/'+ this.mailId+'/'+ this.handleSource()});
            },
            /*
            * 转发
            */
            handleForward(){
                this.$router.push({path:'/mail/writeMail/relay/'+ this.mailId+'/'+ this.handleSource()});
            },

            handleSignMailwrap(e,instance){
                this.handleSignMail(instance.$attrs.value)
            },

            handleJunkMail(){
                if(this.mailType === '1'){
                    this.dialogVisible = true;
                }else if(this.mailType === '2'){
                    this.handleSignMail('3');
                }
            },
            handleJunkMailWrap(){
                this.handleSignMail('3');
            },
            /*
            * 操作邮件
            * operateType操作类型，0:删除，1:标记为未读,2:标记为已读,3:举报（垃圾邮件）,4:信任（垃圾邮件）
            */
            async handleSignMail(v,haveCallback){
                try {
                    let dataParam = {
                        operateType:v,
                        mailId:this.mailId,
                        sendMailAddress:this.mailInfo.ownerMailAccount,
                    };
                    if(this.mailType === '1' && this.checked){
                        dataParam.mailReceivers = this.mailInfo.sendMailAddress;
                    }
                    const res = await this.$nt.models.mail.handleEmails(dataParam);
                    if(Number(res.statusCode) === data.data.statusCode && !haveCallback){
                        this.$router.back()
                    }
                } catch (err) {
                    //交给框架处理的异常
                    this.ctx.onerror(err);
                }
            },
            async handleDeleteMail(){
                try {
                    const res = await this.$nt.models.mail.deleteEmails({ids:[this.mailId]});
                    if(Number(res.statusCode) === data.data.statusCode){
                        this.$router.back()
                    }
                } catch (err) {
                    //交给框架处理的异常
                    this.ctx.onerror(err);
                }
            },
        }
    }
</script>

<style lang="less">
    .text-right {
        text-align: right;
    }
    .pL5{padding-left: 5px;}

</style>
