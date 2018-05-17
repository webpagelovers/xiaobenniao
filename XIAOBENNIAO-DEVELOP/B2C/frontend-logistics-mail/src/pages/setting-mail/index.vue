<template>
    <div>
        <page-head :title="'邮箱设置'"></page-head>

        <nt-tabs v-model="activeName" @tab-click="handleTabClick">
            <nt-tab-pane label="邮箱绑定" name="bind">
                <authorize></authorize>
            </nt-tab-pane>
            <nt-tab-pane label="快速文本" name="text">
                <div class="contentBox">
                    <div class="border_layout competing_infor padding15">
                        <nt-row :gutter="24">
                            <nt-col :span="5">
                                <div class="grid-content bg-purple bgc-efefef mT10">
                                    <ul>
                                        <li class="break curpointer"
                                            v-for="(item,index) in textList"
                                            @click="handleItemClick(item,index)"
                                            @mouseover="handleItemMouseOver(item,index)"
                                            @mouseout="handleItemMouseOut(item,index)"
                                            :class="{active:currentColor === index,blue:currentIndex === index}">
                                            {{item.templateName ? item.templateName : 'null'}}
                                        </li>
                                    </ul>
                                </div>
                                <div class="mT20">
                                    <nt-button type="primary" size="small" @click="handleAddBubttonClick">新建</nt-button>
                                    <nt-button type="primary" size="small" @click="handleDeleteClick">删除</nt-button>
                                </div>
                            </nt-col>
                            <nt-col :span="12" :offset="2" style="border-left: 1px solid #ddd;">
                                <div class="mT10 mB10">
                                    <nt-form :label-position="'right'" label-width="140px" :model="textForm"
                                             :rules="textRules"
                                             ref="textForm">
                                        <nt-form-item label="名称：" prop="templateName">
                                            <nt-input v-model="textForm.templateName" class="w500" :maxlength="30"
                                                      ref="templateName"></nt-input>
                                        </nt-form-item>
                                        <nt-form-item label="内容：" prop="templateContent">
                                            <nt-input type="textarea" v-model="textForm.templateContent"
                                                      :rows="8"
                                                      :maxlength="10000"
                                                      style="width: 500px;"></nt-input>
                                        </nt-form-item>
                                        <nt-form-item label="" v-if="ifEdite === false">
                                            <nt-button type="primary" size="small" @click="handleSubmitText">保存</nt-button>
                                        </nt-form-item>
                                        <nt-form-item label="" v-else>
                                            <nt-button type="primary" size="small" @click="handleEditeText">保存</nt-button>
                                        </nt-form-item>
                                    </nt-form>
                                </div>
                            </nt-col>
                        </nt-row>
                    </div>
                </div>
            </nt-tab-pane>
            <nt-tab-pane label="黑名单" name="blackList">
                <template-search-list ref='pageTmpl' :method='querySellers'>
                    <template slot="page-table-operations" style="width: 100%;">
                        <nt-dialog :visible.sync="dialogBlackListVisible" size="tiny" title="新增黑名单"
                                   @close="handleBlackFormClose">
                            <nt-form :model="blackListForm" :rules="blackListRules" ref="blackListForm"
                                     label-width="100px">
                                <nt-form-item label="邮箱：" prop="spamMail">
                                    <nt-input v-model="blackListForm.spamMail" class="w240"></nt-input>
                                </nt-form-item>
                            </nt-form>
                            <div slot="footer" class="dialog-footer">
                                <nt-button type="primary" size="small" @click="handleBlackListSubmmit">确定</nt-button>
                            </div>
                        </nt-dialog>
                        <!--<div class="grid-content bg-purple">黑名单</div>-->
                        <div class="grid-content bg-purple text-right">
                            <!--<i class="nt-icon-plus f18 bold curpointer"
                               @click="handleBlackAddIconClick"></i>-->
                            <nt-button type="primary" @click="handleBlackAddIconClick">新增</nt-button>
                        </div>

                    </template>
                    <template slot='page-table' slot-scope='props'>
                        <div class="contentBox">
                            <nt-table :data='props.tableData' :show-header="false">
                                <nt-table-column width="22"></nt-table-column>
                                <nt-table-column prop="spamMail" label="邮箱名称">
                                </nt-table-column>
                                <nt-table-column label="操作" width="400">
                                    <template slot-scope="scope">
                                        <nt-popover style="background: #fff;" ref="popover{{$index}}"
                                                    placement="bottom"
                                                    width="346">
                                            <div class="bgcfff">
                                                <div>
                                                    <p class="mT10">确定要删除黑名单 <span
                                                            class="col_f8ac59">{{scope.row.spamMail}}</span>吗？
                                                    </p>
                                                </div>
                                                <div class="popoverBtn">
                                                    <nt-button type="primary" size="small"
                                                               @click="handleDeleteCurrent(scope.row)">确定
                                                    </nt-button>
                                                    <nt-button size="small" type="primary"
                                                               @click="closeDeleteSmall">取消
                                                    </nt-button>
                                                </div>
                                            </div>
                                        </nt-popover>
                                        <i class="nt-icon-delete col_cccccc" v-popover:popover{{$index}}></i>
                                    </template>
                                </nt-table-column>
                            </nt-table>
                        </div>
                    </template>
                </template-search-list>
            </nt-tab-pane>
        </nt-tabs>
    </div>
</template>

<script>

    import {PageHead, ComboSearch, TemplateSearchList} from 'xbn-biz-components';
    import Authorize from 'xbn-biz-shop-authorize';


    export default {
        components: {
            PageHead,
            TemplateSearchList,
            Authorize: Authorize.routes[5].component
        },
        // mixins: [common],
        data() {
            return {
                activeName: 'bind',
                textList: [],
                form: {},
                textForm: {},
                currentId: null,
                currentIndex: null,
                currentColor: null,
                ifEdite: false,
                blackListForm: {},
                dialogAddVisible: false,
                dialogBlackListVisible: false,
                rules: {
                    mail: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {max: 80, message: '物流公司名称不超过80个字符'},
                    ]
                },
                textRules: {
                    templateName: [
                        {required: true, message: '文档标题不能为空', trigger: 'blur'},
                        {max: 30, message: '文档标题不超过30个字符'},
                    ],
                    templateContent: [
                        {required: true, message: '文档内容不能为空', trigger: 'blur'},
                        {max: 10000, message: '文档内容不超过10000个字符'},
                    ]
                },
                blackListRules: {
                    spamMail: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {validator: this.mailValidator, message: '有输入正确的邮箱格式'}
                    ]
                }
            }
        },

        async created() {
            const res = await this.ctx.models.mail.listUserList({});
            if (res.statusCode == '2000000') {
                this.textList = res.data;
            }

        },
        mounted() {
        },
        watch: {
            '$route'(to, from) {

            }
        },

        methods: {

            //切换选项卡
            handleTabClick(tab, event) {

            },

            //添加绑定邮箱
            handleAddIconClick() {
                this.dialogAddVisible = true;
            },

            //隐藏列表每行右侧删除弹框
            closeDeleteSmall: function () {
                document.querySelector('body').click();
            },

            //编辑邮箱
            handleEditClick(index, row) {
                this.$set(row, 'oldMail', row.mail);
                this.$set(row, 'showEdit', true);
            },

            handleIconClick(row, item) {
                const This = this;
                return function () {
                    This.$set(row, item, '');
                };
            },

            handleSaveSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {


                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            handleCancleClick(index, row) {
                this.$set(row, 'showEdit', false);
                this.$set(row, 'mail', row.oldMail);
            },

            //快递文本
            handleAddBubttonClick() {
                this.ifEdite = false;
                this.clearTextForm();
                this.$refs['textForm'].resetFields();
                this.$refs['templateName'].focus();
            },

            async handleSubmitText() {
                this.$refs['textForm'].validate(async (valid) => {
                    if (valid) {

                        const res = await this.ctx.models.mail.listUserSave(this.textForm);
                        if (res.statusCode === '2000000') {
                            this.textList.push(res.data);
                            this.clearTextForm();
                        }

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            async handleEditeText() {
                this.$refs['textForm'].validate(async (valid) => {
                    if (valid) {

                        const res = await this.ctx.models.mail.listUserUpdate(this.textForm);
                        if (res.statusCode === '2000000') {
                            this.textList.splice(this.currentIndex, 1, this.textForm);
                            this.clearTextForm();
                            this.ifEdite = false;
                        }

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            async handleDeleteClick() {
                if (this.currentId) {
                    const res = await this.ctx.models.mail.listUserDelete({id: this.currentId});
                    if (res.statusCode == '2000000') {
                        this.textList.splice(this.currentIndex, 1);
                        if (!this.textList[0]) {
                            this.ifEdite = false;
                        }
                        this.clearTextForm();
                    }
                } else {
                    this.$message.error('请选择要删除的快速文本');
                }
            },

            handleItemMouseOver(item, index) {
                this.currentColor = index;
            },

            handleItemMouseOut() {
                this.currentColor = null;
            },

            async handleItemClick(item, index) {
                this.currentIndex = index;
                this.ifEdite = true;
                this.currentId = item.id;

                const res = await this.ctx.models.mail.listUserInfo({id: this.currentId});
                if (res.statusCode == '2000000') {
                    this.textForm = res.data;
                    this.$refs['textForm'].resetFields();
                }
            },

            clearTextForm() {
                this.textForm = {};
                this.currentId = null;
                this.currentIndex = null;
            },

            //黑名单
            handleBlackAddIconClick() {
                this.dialogBlackListVisible = true;
            },

            async handleBlackListSubmmit() {
                this.$refs['blackListForm'].validate(async (valid) => {
                    if (valid) {
                        const res = await this.ctx.models.mail.blackListSave(this.blackListForm);
                        if (res.statusCode === '2000000') {
                            /*this.textList.splice(this.currentIndex, 1, this.textForm);
                            this.clearTextForm();
                            this.ifEdite = false;*/
                            this.$refs.pageTmpl.refreshData();
                            this.dialogBlackListVisible = false;
                        } else {
                            this.$message.error(res.errMsg);
                        }

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },

            async handleDeleteCurrent(row) {
                const res = await this.ctx.models.mail.blackListDelete({id: row.id});
                if (res.statusCode === '2000000') {
                    this.$refs.pageTmpl.refreshData();
                    this.closeDeleteSmall();
                    this.dialogBlackListVisible = false;
                } else {
                    this.$message.error(res.errMsg)
                }
            },

            async querySellers(params) {

                const res = await this.ctx.models.mail.blackListByPage(params);
                if (res.statusCode === '2000000') {
                    return res;
                } else {
                    this.$message.error(res.errMsg);
                }
            },

            mailValidator: function (rule, value, callback) {

                var myReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;

                if (myReg.test(value)) {
                    callback();
                } else {
                    callback(new Error());
                }
            },

            handleBlackFormClose() {
                this.$refs['blackListForm'].resetFields();
            },
        },

    }
</script>

<style lang="less">
    .text-right {
        text-align: right;
    }

    .active {
        background: #E3E3E3;
    }

    .blue {
        background: #317dff;
        color: #fff;
    }

    .w500{
        width:500px;
    }

    .padding15 {
        padding: 25px 15px 25px;
    }

    .bgc-efefef {
        background-color: #efefef;
        line-height: 24px;
        max-height: 240px;
        min-height: 240px;
        overflow-y: auto;
        li {
            padding: 0 10px;
        }
    }
</style>
