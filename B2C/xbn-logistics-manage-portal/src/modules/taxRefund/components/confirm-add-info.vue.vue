<template>
    <div class="add_infor_Main">
    <nt-dialog title="确认补充信息" :visible.sync="isShow" :close-on-click-modal="false">
        <nt-row :span="24">
            <nt-col :span="4">舱单</nt-col>
            <nt-col :span="20">
                <avatar-upload v-model='repertoryList' :limit='0' :disabled='true' avatarClass='logistics-product'
                   accept="jpg,jpeg,png,pdf,image/jpg,image/jpeg,image/png,application/pdf,application/doc,application/docx" :size='4'>
                </avatar-upload>
            </nt-col>
        </nt-row>
        <nt-row :span="24">
            <nt-col :span="4">其它单证</nt-col>
            <nt-col :span="20">
                <avatar-upload v-model='otherList' :limit='0' :disabled='true' avatarClass='logistics-product'
                   accept="jpg,jpeg,png,pdf,image/jpg,image/jpeg,image/png,application/pdf,application/doc,application/docx" :size='4'>
                </avatar-upload>
            </nt-col>
        </nt-row>
        <div class="dialog-footer tR">
            <nt-button type="primary" size="small" @click="submitSend">确认</nt-button>
            <nt-button type="primary" size="small" @click="isShow = false">取消</nt-button>
        </div>
    </nt-dialog>
    </div>
</template>

<script>
    import {AvatarUpload} from 'xbn-biz-components';
    let callBack = null;
    export default {
        props: ['callBack'],
        components: {
            AvatarUpload
        },
        data () {
            return {
                isShow: false,
                id: '',
                repertoryList: [],
                otherList: []
            }
        },
        methods: {
            async show(opts, callback) {
                try {
                    // 重置
                    this.$refs.postData && this.$refs.postData.resetFields();
                    this.repertoryList = [];
                    this.otherList = [];
                    // 整理提交参数
                    opts.id && (this.id = opts.id);
                    let res = await this.ctx.models.taxrefund.findAddInfo({id: opts.id});
                    for (let item of res.data.annexFiles) {
                        if (item.businessType === 2) {
                            item.url = item.fileUrl;
                            this.repertoryList.push(item);
                        } else if (item.businessType === 3) {
                            item.url = item.fileUrl;
                            this.otherList.push(item);
                        }
                    }
                    this.annexFiles = res.data.annexFiles;
                    if (this.repertoryList.length === 0 && this.otherList.length === 0) {
                        this.$message({
                            message: '待用户上传文件后才可确认补充信息',
                            type: 'warning'
                        });
                        return;
                    }
                    this.isShow = true;
                    // callback 赋值
                    callback && (callBack = callback);
                } catch (err) {
    			   //交给框架处理的异常
    			   this.ctx.onerror(err);
    		    }
            },
            async submitSend() {
                try {
                    const res = await this.ctx.models.taxrefund.confirmAddInfo({
                        "ids": [
                            this.id
                        ],
                        "param": "string"
                    });
                    callBack && callBack(res);
                    this.isShow = false;
                } catch (err) {
                    //交给框架处理的异常
                    this.ctx.onerror(err);
                }
            }
        }
    }
</script>


<style lang="less">
.add_infor_Main .nt-dialog--small{width:880px;}
</style>
