<style lang="less">
    .nt-upload-dragger {
        width: 495px;
        height: 134px;
        border-radius: none;
        margin-top: 7px;
        .nt-icon-upload {
            margin-top: 32px;
        }
        .nt-upload__text {
            color: #999;
            line-height: 0;
        }
    }

    .nt-dialog__body {
        p {
            line-height: 28px;
        }
        .col_e40000 {
            color: #e40000;
        }
        .bg_f5 {
            background: #f5f5f5;
            border-radius: 5px;
            width: 253px;
            height: 30px;
        }
        .pL10 {
            padding-left: 10px;
        }
    }

    .batch-import {
        .nt-icon-close{
            display: none !important;
        }
        .nt-upload-list__item-status-label {
            display: none !important;
        }
    }


</style>

<template>

    <nt-dialog :title="title" :visible.sync="dialogTableVisible" size="tiny" @close="handleColse">

        <div v-if="uploadShow == true">
            <slot></slot>
            <nt-upload class="upload-demo batch-import" drag :file-list="fileList"
                       :action="uploadPlanApi"
                       :headers="headers"
                       :on-change="uploadChange"
                       :on-remove="uploadRemove"
                       :on-success="uploadSuccess"
                       :on-error="uploadError"
                       :before-upload="handleBeforeUpload"
                       name="importFile">
                <div v-show="uploadSuccessShow === false">
                    <i class="nt-icon-upload"></i>
                    <div class="nt-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </div>
                <div v-show="uploadSuccessShow === true">
                    <i class="nt-icon-upload"></i>
                    <div class="nt-upload__text">文件已上传成功</div>
                </div>
            </nt-upload>
        </div>
        <div v-if="uploadShow == false">
            <p class="col_e40000">文件上传失败，原因如下。</p>
            <p v-for="(item,index) in errorList">{{index + 1}}.{{item}}</p>

            <p v-if="errorListLength>=10" class="bg_f5">
                <i class="nt-icon-warning pL10"></i>
                表格错误过多，请检查后重新上传。
            </p>

        </div>
        <div slot="footer" class="dialog-footer">
            <nt-button type="primary" size="small" v-if="uploadShow == true" @click="finishClick"
                       :disabled="buttonDisable">完成
            </nt-button>
            <nt-button type="primary" size="small" v-if="uploadShow == false" @click="reupload"
                       :disabled="buttonDisable">重新上传
            </nt-button>
        </div>

    </nt-dialog>
</template>
<script>
    export default {
        props: [
            'title',        //标题
            'templateUrl',  //模板地址
            'uploadUrl',    //批量导入地址
            'uploadErrorData' //自定义上传错误信息
        ],
        data() {
            return {
                'headers': {
                    'X-UC-Token': this.ctx.authentication.getToken()
                },
                'dialogTableVisible': false,
                'buttonDisable': true,
                'uploadShow': true,
                'downloadTempApi': this.templateUrl,
                'uploadPlanApi': this.uploadUrl,
                'fileList': [],
                'errorList': [],
                'errorListLength': 0,
                'uploadSuccessShow': false
            };
        },
        methods: {

            show: function () {
                this.dialogTableVisible = true;
            },

            //upload组件的change事件
            uploadChange: function (file, fileList) {
                this.fileList = fileList;
            },

            //upload组件的删除事件
            uploadRemove: function (file, fileList) {
                this.buttonControll(fileList);
            },

            //upload组件的上传成功事件
            uploadSuccess: function (data, fileList) {
                if (data.statusCode == 2000000) {
                    this.uploadSuccessShow = true;
                    this.$emit('imported');
                    //this.$refs.pageTmpl.refreshData();
                    this.buttonControll(this.fileList);
                } else {
                    this.uploadSuccessShow = true;
                    this.errorList = data.errorList;
                    this.errorListLength = data.errorList.length;
                    if (this.errorList.length >= 10) {
                        this.errorList = this.errorList.slice(0, 10);
                    }
                    this.uploadShow = false;
                    this.buttonDisable = false;
                }

            },

            //upload组件上传失败事件
            uploadError: function (err, file, fileList) {
                if (this.$listeners.importedError) {
                    this.$emit('importedError');
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: '上传失败'
                    });
                }
            },

            //控制批量导入弹出框按钮的禁用与否
            buttonControll: function (fileList) {
                if (fileList[0]) {
                    this.buttonDisable = false;
                } else {
                    this.buttonDisable = true;
                }
            },

            //完成批量导入时关闭upload弹框事件
            finishClick: function () {
                this.dialogTableVisible = false;
                this.buttonDisable = true;
                this.fileList = [];
                this.uploadSuccessShow = false;
            },

            //重新重新上传时，控制按钮的禁用于否
            reupload: function () {
                this.uploadShow = true;
                this.buttonDisable = true;
                this.fileList = [];
                this.uploadSuccessShow = false;
            },

            //关闭对话框触发的事件
            handleColse:function(){
                this.fileList = [];
                this.errorList = [];
                this.buttonDisable = true;
                this.uploadShow = true;
                this.uploadSuccessShow = false;
            },

            //上传之前
            handleBeforeUpload:function(file){
                const isXLS = file.type === 'application/vnd.ms-excel';

                if (!isXLS) {
                    this.$notify.error({
                        title: '错误',
                        message: '只能导入xls格式的文件!'
                    });
                }
                return isXLS;
            }
        }
    };
</script>

