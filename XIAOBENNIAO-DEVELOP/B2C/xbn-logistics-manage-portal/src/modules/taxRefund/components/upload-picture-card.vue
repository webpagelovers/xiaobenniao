<style lang="less" scoped>
    .upload-card-uploader {display: inline-block;}
    .upload-card-uploader .nt-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        width: 36px;
        height: 36px;
        cursor: pointer;
        position: relative;
        display: inline-block;
    }
    .upload-card-uploader {
        .nt-icon-close {
            position: absolute;
            right: -5px;
            top: -5px;
            border-radius: 10px;
            background: #ccc;
            padding: 10px;
        }
    }

    .upload-card-uploader .nt-upload:hover {
        border-color: #20a0ff;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .xline_no .upload-card-uploader .nt-upload.nt-upload--picture-card { width: auto; height: 36px; line-height: 36px;}
    .nt-icon-plus { width: 36px; height: 36px; line-height: 36px; text-align: center; border: 1px solid #ccc;}
    .nt-upload-list__item-preview .nt-icon-view{ display: none;}
    .upload-card-uploader .nt-upload-list__item-actions .nt-upload-list__item-preview .nt-icon-view{ display: none;}

    .aitem { width: 34px; height: 34px; display: inline-block; position: relative; vertical-align: top;margin-bottom: 5px;}
    .aitem .zhezhao { display: none;}
    .aitem:hover .zhezhao {width: 34px; height: 34px; position: absolute; left: 0; top:0; display: block;line-height: 36px;
        text-align: center;}
</style>

<template>
    <span>
        <slot name="list"></slot>
        <!-- <span v-if="!$slots.list" v-for="(item, index) in value" :key="item">
            <object v-if="item && item.match('.pdf$')"
                type="application/pdf" :data="item"
                id="review" style="width:26px;  height:32px; overflow:hidden;" scrollbar="false">
            </object>
            <div class="aitem">
                <img :src="item"  width="35" height="35" class="inline_block vT border_outer"
                    v-if="item && !item.match('.pdf$')"/>
                <div class="zhezhao">
                    <i class="nt-icon-delete" @click="deleteItem(index)"></i>
                </div>
            </div>
        </span> -->
        <nt-upload
            class="upload-card-uploader"
            :headers="headers"
            :action="uploadUrl"
            :on-remove="handleRemove"
            :data="requestData"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :on-change="handleChange"
            :before-upload="handleBeforeAvatarUpload">
            <i class="nt-icon-plus"></i>
            <!-- <div v-if="contAvatar === '0'" style="position: relative;">
                <img v-if="avatarUrl" :src="avatarUrl" class="avatar">
                <i v-else class="nt-icon-plus avatar-uploader-icon"></i>

                <i @click.prevent.stop="unchoose" v-if="avatarUrl" class="nt-icon-close"></i>
            </div>
            <slot name="contentAvatar"></slot> -->
        </nt-upload>
        <span v-show="errorData.statusCode && errorData.statusCode != '2000000'" style="color:red">上传失败</span>
    </span>
</template>

<script>

    export default {
        props: ['value', 'action', 'contentAvatar', 'accept', 'size', 'token'],
        components: {},
        data: function () {
            let uploadUrl = this.action || 'http://uimage.xbniao.com/file/app/image.upload';
            const headers = {};
            headers['X-UC-Token'] = this.token || this.ctx.authentication.getToken();
            return {
                headers,
                uploadUrl,
                fileId: null,
                requestData: {
                    'fileType': 'other',
                    'userId': 'tgfs',
                    'appId': 'XBNGCFS',
                    'isAllsizeDo':false
                },
                errorData: {},
                contAvatar: '0'
            };
        },
        computed: {
            avatarUrl: function () {
                return this.value;
            }
        },
        created() {
            if (this.contentAvatar) {
                this.contAvatar = this.contentAvatar;
            }
        },
        methods: {
            // 删除某一项
            deleteItem: function (index) {
                this.value.splice(index, 1);
            },
            unchoose: function() {
                this.$emit('input', null);
                this.fileId     = null;
            },

            handlePreview: function () {

            },

            handleRemove: function (file, fileList) {
                debugger;
                console.log(file, fileList);
            },
            // handlePictureCardPreview: function (file) {
            //     debugger;
            //     this.dialogImageUrl = file.url;
            //     this.dialogVisible = true;
            // },

            handleAvatarSuccess: function (data) {
                if (data.statusCode === '2000000') {
                    this.errorData = {};
                    try {
                        this.$emit('handleSuccess', data)
                    } catch (e) {
                        this.handleAvatarSuccessFun(data);
                    }
                } else {
                    // 显示错误信息
                    this.errorData = data;
                }
                // this.handleSuccess ? this.$emit('handleSuccess', data) : this.handleAvatarSuccessFun(data);
            },

            handleAvatarSuccessFun: function (data) {
                this.avatarUrl = data.data.fileUrl;
                this.fileId = data.data.fileId;
                this.$emit('input', data.data.fileUrl);
                this.$emit('upload', data.data);
            },

            getAvatarId: function () {
                return this.fileId;
            },

            handleBeforeAvatarUpload: function (file) {
                let imgType = false, imgSize = null, bool = null, arr = [];
                if (this.accept) {
                    let rule = this.accept.split(',');
                    for (let i = 0; i < rule.length; i++) {
                        if (file.type.split('/')[1] === rule[i]) {
                            imgType = true;
                        }
                    }

                    if (!imgType) {
                        this.$message.error('上传图片只能是 ' + this.accept + ' 格式!');
                        arr.push(imgType);
                    }
                }

                if (this.size) {
                    imgSize = file.size / 1024 / 1024 < this.size;

                    if (!imgSize) {
                        this.$message.error('上传图片大小不能超过 ' + this.size + 'MB!');
                        arr.push(imgSize);
                    }

                }

                if (arr.length > 0) {
                    for (let i = 0; i < arr.length; i++) {
                        if (!arr[i]) {
                            bool = false;
                        }
                    }
                }
                return bool;
            },

            handleChange: function (value) {
                this.$emit('uploadChange');
            },
        }
    };
</script>
