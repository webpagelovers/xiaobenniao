<template>
    <div>
        <template-search-list ref='pageTmpl' :title='title' :simple='simpleSearch' :combo='comboSearch'
                              :method='queryList' :filter='quickFilter'>
            <template slot='page-table-operations'>
                <nt-button type="primary"  @click="handleReplyMail" :disabled="replyMailBtnStatus"
                           v-if="(this.mailType === '4' || this.mailType === '5'|| this.mailType === '1')">回复</nt-button>
                <nt-button type="primary"  @click="handleReplyMailAll" :disabled="this.selectionRows && this.selectionRows.length > 1" v-if="this.mailType !== '3'">回复全部</nt-button>
                <nt-button type="primary"  @click="handleForward" :disabled="this.selectionRows && this.selectionRows.length > 1" v-if="this.mailType !== '3'">转发</nt-button>
                <nt-dropdown @command="handleSignMailwrap" v-if="this.mailType !== '3'" class="mL10 mR10">
                    <nt-button type="primary" >
                        标记为...<i class="nt-icon-caret-bottom nt-icon--right"></i>
                    </nt-button>
                    <nt-dropdown-menu slot="dropdown">
                        <nt-dropdown-item v-for="(item , index) in markList" :value="item.value" :key="index">{{item.label}}</nt-dropdown-item>
                    </nt-dropdown-menu>
                </nt-dropdown>
               <!-- <nt-select v-model="mailStatus" placeholder="标记为..." clearable  @change="handleSignMail" class="w110 mL10 mR10">
                    <nt-option v-for="(item , index) in markList" :label="item.label" :value="item.value" :key="index"></nt-option>
                </nt-select>-->
                <nt-button type="primary"  @click="handleSignMail('0')" v-if="(this.mailType === '1' || this.mailType === '2')">删除</nt-button>
                <nt-button type="primary"  @click="handleDeleteMail" v-if="(this.mailType === '4' || this.mailType === '5'|| this.mailType === '3')">彻底删除</nt-button>
                <nt-button type="primary"  @click="handleJunkMail" v-if="(this.mailType === '1' || this.mailType === '2')">垃圾邮件</nt-button>
                <nt-button type="primary"  @click="handleSignMail('4')" v-if="this.mailType === '5'">这不是垃圾邮件</nt-button>
                <nt-dialog
                        title="设为垃圾邮件"
                        :visible.sync="dialogVisible"
                        size="tiny">
                    <div>
                        <p class="lh24">将邮件标记为垃圾邮件;</p>
                        <div>
                            <nt-checkbox v-model="checked">将以下地址加入黑名单(该地址发送的邮件将会进入垃圾邮件):</nt-checkbox>
                            <div class="dialog_mainBox">
                                <p v-for="(item , index) in junkMailAddressList" :key="index" class="lh24">{{item}}</p>
                            </div>
                        </div>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <nt-button @click="dialogVisible = false" type="primary">取 消</nt-button>
                        <nt-button type="primary" @click="handleJunkMailWrap">确 定</nt-button>
                    </span>
                </nt-dialog>
            </template>

            <template slot='page-table' slot-scope='props' class='contentBox'>
                <div class='contentBox'>
                    <nt-table :data='props.tableData' @selection-change="handleSelectionChange" class="border_layout" @cell-click="handleClickRowToDetailPage">
                        <nt-table-column type='selection' align="center"></nt-table-column>
                        <nt-table-column prop="sendMailAddress" label="发件人" width="300" class-name="curpointer">
                            <template slot-scope="scope"><span :style="{fontWeight: scope.row.readFlag === '1' ? 'bold' :'normal'}">{{scope.row.sendMailAddress}}</span></template>
                        </nt-table-column>
                        <nt-table-column prop="mailSubject" label="主题" show-overflow-tooltip class-name="curpointer">
                            <template slot-scope="scope" ><span :style="{fontWeight: scope.row.readFlag === '1' ? 'bold' :'normal'}">
                                <i class="nt-icon-xbn-11  col_fd5056 f12" v-if="scope.row.mailStatus === '6'"></i>
                                <i class="nt-icon-xbn-72 col_cccccc f12" v-if="scope.row.sendOrReceive !=='2' && Number(scope.row.attachNum) > 0"></i>
                                {{scope.row.mailSubject}}</span>
                            </template>
                        </nt-table-column>
                        <nt-table-column prop="createTime" label="时间" class-name="curpointer">
                            <template slot-scope="scope">
                                <span :style="{fontWeight: scope.row.readFlag === '1' ? 'bold' :'normal'}">{{scope.row.createTime}}</span>
                            </template>
                        </nt-table-column>
                    </nt-table>
                </div>
            </template>
        </template-search-list>
    </div>
</template>

<script>
    import {TemplateSearchList} from 'xbn-biz-components'
    import DateUtils from 'nt-element/src/utils/date'
    import  {data} from '../models/data'

    export default {
        components: {TemplateSearchList},
        mixins: [],
        props:{
            title : {
                type: String,
                default: function() {
                    return 'string';
                }
            },
            //邮件类型，1:收件箱,2:发件箱,3:草稿箱,4:已删除,5:垃圾箱,
            mailType : {
                type: String,
                default: function() {
                    return 'string';
                }
            },
        },
        data() {
            return {
                simpleSearch:[],
                comboSearch:[],
                quickFilter:[],
                mailStatus:null, //邮箱状态
                markList:data.markList, //标记为数据
                selectionRows:[], //选中的列表
                replyMailBtnStatus:false,
                dialogVisible:false,
                junkMailAddressList:[],
                checked: false,
            }
        },
        watch:{
            // 通过这种语法来watch就行，还可以直接watch data，使用deep:true来深度观察
            'selectionRows':{
                handler:function (val,oldVal){
                    if(val && val.length){
                       this.replyMailBtn();
                    }else{
                        this.replyMailBtnStatus = false;
                    }
                },
                // 深度观察
                deep:true
            },
        },
        async created () {},
        mounted () {},
        computed:{},
        methods: {
            async queryList(param){
                try {
                    param.param.mailType = this.mailType;
                    const res = await this.$nt.models.mail.listEmails(param);
                    if(Number(res.statusCode) === data.data.statusCode){
                        res.data.list.forEach((v)=>{
                            v.createTime = this.formatDate(v.createTime);
                        })
                    }
                    return res;
                } catch (err) {
                    //交给框架处理的异常
                    this.ctx.onerror(err);
                }
            },
            /*
            * 处理邮件接收时间
            * @param {String}
            * @return {String}
            */
            formatDate(date){
                const dateNow = new Date(),
                    dateTime = date.split(' '),
                    dateArr = dateTime[0].split('-'),
                    dateTimeArr = dateTime[1].split(':');

                /*if (Number(dateTimeArr[0]) < 10){
                    dateTimeArr[0] = dateTimeArr[0].split('')[1];
                }*/

                if(Number(dateArr[0]) === dateNow.getFullYear() && Number(dateArr[2]) === dateNow.getDate()) {
                    return '今天 '+ dateTimeArr[0]+':'+ dateTimeArr[1];
                } else if(Number(dateArr[0]) === dateNow.getFullYear() && Number(dateArr[2]) !== dateNow.getDate()){
                    /*if (Number(dateArr[1]) < 10){
                        dateArr[1] = dateArr[1].split('')[1];
                    }*/
                    return dateArr[1]+'-'+dateArr[2]+' '+ dateTimeArr[0] +':'+ dateTimeArr[1];
                }else{
                    return dateArr[0]+'-'+dateArr[1]+'-'+dateArr[2];
                }
            },
            /*
            * 处理邮件id
            * @param {Array}
            * @return {Array}
            */
            handleMailId(arr){
                let selectionRowsArr = [];
                if(arr) {
                    arr.forEach((v,i)=>{
                        selectionRowsArr.push(v.id)
                    });
                    return selectionRowsArr;
                }
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
            * 点击跳转邮件详情
            * @param {Number}
            */
            handleClickRowToDetailPage(row, column, cell){
                if(column.type !=="selection" && this.mailType !== '3'){
                    this.$router.push({path:'/mail/detailMail/'+this.mailType+'/'+ row.id});
                }else if(column.type !=="selection" && this.mailType === '3'){
                    this.$router.push({path:'/mail/writeMail/edit/'+ row.id+'/'+ this.handleSource()});
                }
            },

            replyMailBtn(){
                if(this.selectionRows) {
                    if(this.selectionRows.length === 1 && this.selectionRows[0].sendOrReceive === '1'){
                        this.replyMailBtnStatus = true;
                    }else if(this.selectionRows.length > 1){
                        this.replyMailBtnStatus = true;
                    }else{
                        this.replyMailBtnStatus = false;
                    }
                }
            },

            /*
            * 回复
            */
            handleReplyMail(){
                if(this.selectionRows.length>0) {
                    this.$router.push({path:'/mail/writeMail/reply/'+ this.handleMailId(this.selectionRows)+'/'+ this.handleSource()});
                }else{
                    this.$message({showClose: true,message: '未选择邮件',type: 'error'});
                }
            },
            /*
            * 回复全部
            */
            handleReplyMailAll(){
                if(this.selectionRows.length>0) {
                    this.$router.push({path:'/mail/writeMail/replyAll/'+ this.handleMailId(this.selectionRows)+'/'+ this.handleSource()});
                }else{
                    this.$message({showClose: true,message: '未选择邮件',type: 'error'});
                }
            },
            /*
            * 转发
            */
            handleForward(){
                if(this.selectionRows.length>0) {
                    this.$router.push({path:'/mail/writeMail/relay/'+ this.handleMailId(this.selectionRows)+'/'+ this.handleSource()});
                }else{
                    this.$message({showClose: true,message: '未选择邮件',type: 'error'});
                }
            },

            handleSignMailwrap(e,instance){
                this.handleSignMail(instance.$attrs.value)
            },

            inArray(v,arr){
                let data = false;
                arr.forEach(value => {
                    if(v === value){
                        data = true;
                        return false;
                    }
                });
                return data;
            },

            handleJunkMail(value){
                if(this.selectionRows.length>0){
                    if(this.mailType === '1'){
                        this.selectionRows.forEach(v => {
                            if(v.sendOrReceive === '2'){
                                if(!this.inArray(v.sendMailAddress,this.junkMailAddressList)){
                                    this.junkMailAddressList.push(v.sendMailAddress);
                                }
                            }
                        });
                        this.dialogVisible = true;
                    }else if(this.mailType === '2'){
                        this.handleSignMail('3');
                    }
                }else{
                    this.$message({showClose: true,message: '未选择邮件',type: 'error'});
                }
            },
            handleJunkMailWrap(){
                this.handleSignMail('3');
            },

            /*
            * 操作邮件
            * operateType操作类型，0:删除，1:标记为未读,2:标记为已读,3:举报（垃圾邮件）,4:信任（垃圾邮件）
            */
            async handleSignMail(v,mailReceivers){
                if(this.selectionRows && this.selectionRows.length>0){
                    try {
                        let dataParam = {
                            operateType:v,
                            mailId:this.handleMailId(this.selectionRows).join(','),
                            sendMailAddress:this.selectionRows[0].ownerMailAccount
                        };
                        if(this.mailType === '1' && this.checked){
                            dataParam.mailReceivers = this.junkMailAddressList.join(',');
                        }
                        const res = await this.$nt.models.mail.handleEmails(dataParam);
                        if(Number(res.statusCode) === data.data.statusCode){
                            if(v === '3' && this.mailType === '1'){
                                this.$message({showClose: true,message: '标为垃圾邮件成功',type: 'success'});
                            }

                            this.dialogVisible = false;
                            this.$refs.pageTmpl.refreshData();
                        }
                    } catch (err) {
                        //交给框架处理的异常
                        this.ctx.onerror(err);
                    }
                }else{
                    this.$message({showClose: true,message: '未选择邮件',type: 'error'});
                }
            },
            async handleDeleteMail(){
                if(this.selectionRows.length>0){
                    try {
                        const res = await this.$nt.models.mail.deleteEmails({ids:this.handleMailId(this.selectionRows)});
                        if(Number(res.statusCode) === data.data.statusCode){
                            this.$refs.pageTmpl.refreshData();
                        }
                    } catch (err) {
                        //交给框架处理的异常
                        this.ctx.onerror(err);
                    }
                }else{
                    this.$message({showClose: true,message: '未选择邮件',type: 'error'});
                }
            },
            handleSelectionChange(rows) {
                this.selectionRows = rows;
            },
        }
    }
</script>

<style lang="less">
    .col_fd5056{color: #fd5056;}
</style>
