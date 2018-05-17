<style>
    .xbn-avatar-uploader .nt-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .xbn-avatar-uploader .nt-upload:hover {
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

</style>

<template>
    <div>
        <nt-upload
                class="xbn-avatar-uploader"
                :action="uploadUrl"
                :data="requestData"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :on-change="handleChange"
                :before-upload="handleBeforeAvatarUpload">
            <div v-if="contAvatar === '0'">
                <img v-if="avatarUrl" :src="avatarUrl" class="avatar">
                <i v-else class="nt-icon-plus avatar-uploader-icon"></i>
            </div>
            <slot name="contentAvatar"></slot>
        </nt-upload>

    </div>
</template>

<script>

    export default {
        props: ['value', 'action', 'handleSuccess',  'contentAvatar', 'accept', 'size'],

        components: {},

        data: function () {
            let uploadUrl = this.action || 'http://timage.xbniao.com/file/app/image.upload';
            return {
                uploadUrl,
                fileId: null,
                requestData: {
                    'fileType': 'other',
                    'userId': 'tgfs',
                    'appId': 'XBNGCFS',
                    'isAllsizeDo':false
                },
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


            handlePreview: function () {

            },

            handleRemove: function () {

            },

            handleAvatarSuccess: function (data) {
                this.handleSuccess ? this.$emit('handleSuccess', data) : this.handleAvatarSuccessFun(data);
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
