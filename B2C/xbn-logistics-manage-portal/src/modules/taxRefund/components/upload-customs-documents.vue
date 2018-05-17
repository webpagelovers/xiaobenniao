<template>
    <nt-dialog title="上传报关单证" :visible.sync="isShow" size="tiny" :close-on-click-modal="false">
        <nt-form :model="postData" ref="postData" label-width="93px">
            <div class="col_cccccc mB10">支持格式：JPG、PNG、PDF、WORD,支持大小：最大20MB</div>
            <nt-form-item label="报关单号：" prop="declarationNumber"
                :rules="[{ required: true, message: '此项不能为空', trigger: 'blur' },
                    { validator: customeValid, message: '每一个报关单应该只包含数字或字母，且最多18位。', trigger: 'blur,change' }]">
                <nt-input class="w240" v-model="postData.declarationNumber"></nt-input>
                <span>多个报关单号用逗号隔开</span>
            </nt-form-item>

                <!-- <nt-form-item label="QP单：" prop="qpList" class="boxp50 label100" required
                    :rules="[{ validator: isEmptyArr, min:0, trigger: 'blur,change' }]">
                    <div class="customs_Maxheight">
                    <avatar-upload v-model="postData.qpList" :token="ctx.authentication.getToken()" :size="20" :limit="10"
                        @handleSuccess="uploadQpSuccess" field-url="fileUrl" field-name="originalName"
                        accept="image/jpg,image/jpeg,image/png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document">
                    </avatar-upload>
                    </div>
                </nt-form-item> -->


            <nt-form-item label="报关单：" prop="singleList" class="boxp50 label100" required
                :rules="[{ validator: isEmptyArr, min:0, trigger: 'blur,change' }]">
                <div class="customs_Maxheight">
                <avatar-upload v-model="postData.singleList" :token="ctx.authentication.getToken()" :size="20" :limit="10"
                    @handleSuccess="uploadSingleSuccess" field-url="fileUrl" field-name="originalName"
                    accept="image/jpg,image/jpeg,image/png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document">
                </avatar-upload>
                </div>
            </nt-form-item>

        </nt-form>
        <div class="dialog-footer tR">
            <nt-button type="primary" size="small" @click="submitSend">保存</nt-button>
            <nt-button type="primary" size="small" @click="isShow = false">取消</nt-button>
        </div>
    </nt-dialog>
</template>

<script>
    import merge from 'deepmerge';
    import {isEmptyArr} from 'xbn-biz-validate';
    import uploadPictureCard from './upload-picture-card';
    import {AvatarUpload} from 'xbn-biz-components';
    let callBack = null;
    export default {
        props: ['callBack'],
        components: {
            uploadPictureCard,
            AvatarUpload
        },
        data () {
            return {
                isShow: false,
                postData: {
                    id: '',
                    declarationNumber: '',
                    // qpList: [],
                    singleList: []
                },
                validFromEle: null
            }
        },
        computed: {
            annexFiles() {
                let tempArr = [];
                // tempArr = tempArr.concat(this.postData.qpList, this.postData.singleList);
                tempArr = tempArr.concat(this.postData.singleList);
                return tempArr;
            }
        },
        methods: {
		    isEmptyArr,
            customeValid(rules, value, callback) {
                let reg = /^([A-Za-z0-9]{1,18}[,，])*([A-Za-z0-9]{1,18})$/;
                if (reg.test(value)) {
                    callback()
                } else {
                    callback(new Error())
                }
            },
            show(opts, callback) {
                this.isShow = true;
                // 重置
                this.$nextTick(async function () {
                    // this.validFromEle = this.$refs.postData;
                    this.$refs.postData && this.$refs.postData.resetFields();
                    // 整理提交参数
                    opts.postData.id && (this.postData.id = opts.postData.id);
                    // this.postData.qpList = [];
                    this.postData.singleList = [];
                    // callback 赋值
                    callback && (callBack = callback);
                });
            },
            // uploadQpSuccess(data) {
            //     for (let item of this.postData.qpList) {
            //         if (!item.businessType) {
            //             item.businessId = this.postData.id;
            //             item.businessType = 5;
            //             item.fileType = item.fileUrl.substring(item.fileUrl.lastIndexOf('.') + 1);
            //         }
            //     }
            // },
            uploadSingleSuccess(data) {
                // this.postData.singleList.push({
                //     fileUrl: data.data.fileUrl,
                //     businessId: this.postData.id,
                //     businessType: 4,
                // });
                for (let item of this.postData.singleList) {
                    if (!item.businessType) {
                        item.businessId = this.postData.id;
                        item.businessType = 4;
                        item.fileType = item.fileUrl.substring(item.fileUrl.lastIndexOf('.') + 1);
                    }
                }
                // 校验当前项目
                // this.$refs.postData.validateField('singleList', async (valid) => {
                //     if (!valid) {}
                // });
                // this.tempShowData.singleList = data;
            },
            // 删除某一项
            // deleteQpItem: function (arr) {
            //     this.postData.qpList = arr[1];
            //     // this.postData.qpList.splice(index, 1);
            // },
            // deleteSingleItem(arr) {
            //     this.postData.singleList = arr[1];
            //     // this.postData.singleList.splice(index, 1);
            // },
            async submitSend() {
                this.$refs.postData.validate(async (valid) => {
                    if (valid) {
                        try {
                            let params = merge({}, this.postData);
                            params.annexFiles = this.annexFiles;
                            for (let item of params.annexFiles) {
                                delete item.status;
                            }
                            // delete params.qpList;
                            delete params.singleList;
                            let res = await this.ctx.models.taxrefund.uploadDeclaration(params);
                            callBack && callBack(res);
                            this.isShow = false;
                        } catch (err) {
                            //交给框架处理的异常
                            this.ctx.onerror(err);
                        }
                    }
                });
            }
        }
    }
</script>


<style lang="less">
.customs_Maxheight{max-height: 160px;overflow-x: hidden;overflow-y: auto;}/*Q单报单加滚动条*/
</style>
