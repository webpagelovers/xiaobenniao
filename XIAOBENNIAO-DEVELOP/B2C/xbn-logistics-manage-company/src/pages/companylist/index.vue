<style lang="less">
    .nt-popover.clearPadding {
        padding: 0;
        overflow: hidden;
    }

    .company-list {
        .simpleSearch .select {
            width: 160px;
        }
    }
</style>

<template>
    <div class="plan-list-container company-list">

        <template-search-list ref="pageTmpl" title="物流公司管理" :simple="simpleSearch" :combo="comboSearch"
                              :method="queryCompany"
                              :filter="quickFilter">
            <template slot="page-table-operations">
                <nt-dialog title="增加物流公司" :visible.sync="dialogFormVisible" size="tiny">
                    <nt-form :model="form" :rules="rules" ref="form">
                        <nt-form-item label="物流公司名称：" prop="companyName" :label-width="'150px'">
                            <nt-input v-model="form.companyName" auto-complete="off" :maxlength="80"
                                      class="w240"></nt-input>
                        </nt-form-item>
                        <nt-form-item label="物流公司名称缩写：" prop="abbreviation" :label-width="'150px'">
                            <nt-input v-model="form.abbreviation" auto-complete="off" :maxlength="40"
                                      class="w240"></nt-input>
                        </nt-form-item>
                    </nt-form>
                    <div slot="footer" class="dialog-footer">
                        <nt-button type="primary" size="small" @click="saveData('form')">确 定</nt-button>
                        <nt-button type="primary" size="small" @click="dialogFormVisible = false">取 消</nt-button>
                    </div>
                </nt-dialog>
                <nt-button type="primary" nt-col-offset-0 @click="dialogFormVisible = true">新增</nt-button>
            </template>


            <template slot="page-table" slot-scope="props">
                <div class="contentBox">
                    <nt-table :data="props.tableData" class="border_layout">
                        <nt-table-column width="22"></nt-table-column>
                        <nt-table-column label="物流公司名称">
                            <template slot-scope="scope">
                                <div v-model="scope.row.showEdit">
                                    <span v-if="!scope.row.showEdit">
                                           {{scope.row.companyName}}
                                    </span>
                                    <nt-form :model="scope.row" v-if="scope.row.showEdit">
                                        <nt-form-item>
                                            <nt-input v-model="scope.row.companyName"
                                                      @blur="handleBlurCompanyName(scope.row)"
                                                      :maxlength="80"
                                                      icon="close"
                                                      :on-icon-click="handleIconClick(scope.row, 'companyName')"
                                                      class="w240"></nt-input>
                                        </nt-form-item>
                                        <div v-model="scope.row.cellNameExist">
                                            <nt-form-item style="margin-top: -12px;margin-bottom: 0;height: 20px;"
                                                          v-if="scope.row.cellNameExist === 0">
                                                <div class="nt-form-item__error">请输入物流公司名称</div>
                                            </nt-form-item>
                                            <nt-form-item style="margin-top: -12px;margin-bottom: 0;height: 20px;"
                                                          v-if="scope.row.cellNameExist === 1">
                                                <div class="nt-form-item__error">物流公司名称已存在</div>
                                            </nt-form-item>
                                        </div>

                                    </nt-form>
                                </div>

                            </template>
                        </nt-table-column>
                        <nt-table-column label="物流公司名称缩写">
                            <template slot-scope="scope">
                                <div v-model="scope.row.showEdit">
                                    <span v-if="!scope.row.showEdit">
                                           {{scope.row.abbreviation}}
                                    </span>
                                    <nt-form :model="scope.row"
                                             v-if="scope.row.showEdit == true">
                                        <nt-form-item>
                                            <nt-input v-model="scope.row.abbreviation"
                                                      @blur="handleBlurAbbreviation(scope.row)"
                                                      :maxlength="40"
                                                      icon="close"
                                                      :on-icon-click="handleIconClick(scope.row, 'abbreviation')"
                                                      class="w240"></nt-input>
                                        </nt-form-item>
                                        <div v-model="scope.row.cellAbbrExist">
                                            <nt-form-item style="margin-top: -12px;margin-bottom: 0;height: 20px;"
                                                          v-if="scope.row.cellAbbrExist === 0">
                                                <div class="nt-form-item__error">请输入物流公司名称缩写</div>
                                            </nt-form-item>
                                            <nt-form-item style="margin-top: -12px;margin-bottom: 0;height: 20px;"
                                                          v-if="scope.row.cellAbbrExist === 1">
                                                <div class="nt-form-item__error">物流公司名称缩写已存在</div>
                                            </nt-form-item>
                                        </div>
                                    </nt-form>
                                </div>
                            </template>
                        </nt-table-column>
                        <nt-table-column label="操作" width="200" min-width="200">
                            <template slot-scope="scope">
                                <nt-popover style="background: #fff;" ref="popover{{$index}}" placement="bottom"
                                            width="246">
                                    <div class="bgcfff">
                                        <div>
                                            确定删除该物流公司?
                                        </div>
                                        <div class="popoverBtn">
                                            <nt-button type="primary" size="small"
                                                       @click="deleteCurrentCompany(scope.$index, scope.row)">确定
                                            </nt-button>
                                            <nt-button size="small" type="primary" @click="closeDeleteSmall">取消
                                            </nt-button>
                                        </div>
                                    </div>
                                </nt-popover>
                                <nt-button type="text" size="small" @click="handleEdit(scope.$index,scope.row)"
                                           v-if="!scope.row.showEdit">编辑
                                </nt-button>
                                <nt-button type="text" size="small" @click="handleSave(scope.$index,scope.row)"
                                           v-if="scope.row.showEdit">保存
                                </nt-button>
                                <nt-button type="text" size="small"
                                           v-popover:popover{{$index}}>
                                    删除
                                </nt-button>
                            </template>
                        </nt-table-column>
                    </nt-table>
                </div>
            </template>
        </template-search-list>
    </div>
</template>

<script>

    import listMixin from './search.config';

    export default {
        mixins: [listMixin],
        components: {},
        data() {
            return {
                dialogFormVisible: false,
                form: {},
                //校验规则
                rules: {
                    companyName: [
                        {required: true, message: '请输入物流公司名称', trigger: 'blur'},
                        {max: 80, message: '物流公司名称不超过80个字符'},
                        {validator: this.companyNameExistValidator, message: '物流公司名称已存在'}
                    ],
                    abbreviation: [
                        {required: true, message: '请输入物流公司名称缩写', trigger: 'blur'},
                        {max: 40, message: '物流公司名称缩写不超过40个字符'},
                        {validator: this.abbreviationExistValidator, message: '物流公司名称缩写已存在'}
                    ]
                }
            };
        },

        created: async function () {

        },

        methods: {

            //获取物流公司列表
            queryCompany: function (params) {
                return this.ctx.models.company.listCompany(params);
            },

            //添加物流公司
            addCompany: function () {
                return this.ctx.models.company.addCompany(this.form);
            },

            //修改物流公司
            updateCompany: function (id) {
                return this.ctx.models.company.updateCompany(id);
            },

            //添加数据操作
            saveData: function (formName) {
                const This = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        This.addCompany(This.form).then(function (res) {
                            if (res.statusCode == '2000000') {
                                This.dialogFormVisible = false;
                                This.$refs.pageTmpl.refreshData();
                                This.form = {};
                            } else if (res.statusCode == '2071302') {
                                This.dialogFormVisible = true;
                            } else if (res.statusCode == '2071303') {
                                This.dialogFormVisible = true;
                            }
                        });

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            //删除单条
            deleteCurrentCompany: function (index, row) {
                const This = this;
                this.ctx.models.company.deleteCompany(row.id).then((res) => {
                    if (res.statusCode == 2000000) {
                        This.closeDeleteSmall();
                        This.$refs.pageTmpl.refreshData();
                    }
                });

            },

            //验证物流公司名称接口
            validateCompanyName: function (params) {
                return this.ctx.models.company.validateCompanyName(params);
            },

            //验证物流公司名称简写接口
            validateCompanyAbbreviation: function (params) {
                return this.ctx.models.company.validateCompanyAbbreviation(params);
            },

            //隐藏列表每行右侧删除弹框
            closeDeleteSmall: function () {
                document.querySelector('body').click();
            },

            //编辑内容
            handleEdit: function (index, row) {
                this.$set(row, 'showEdit', true);
                this.$set(row, 'cellNameExist', true);
                this.$set(row, 'cellAbbrExist', true);
            },

            //保存编辑的内容
            handleSave: function (index, row) {
                const This = this;
                if(row.companyName == ''){
                    This.$set(row, 'cellNameExist', 0);
                    return false;
                }
                if(row.abbreviation == ''){
                    This.$set(row, 'cellAbbrExist', 0);
                    return false;
                }

                if (row.cellNameExist === true && row.cellAbbrExist === true) {
                    This.updateCompany(row).then(function (res) {
                        if (res.statusCode == '2000000') {
                            This.$set(row, 'showEdit', false);
                            This.$set(row, 'cellNameExist', false);
                            This.$set(row, 'cellAbbrExist', false);
                        }
                    });
                }
            },

            //校验物流公司名称是否存在
            companyNameExistValidator: function (rule, value, callback) {
                this.validateCompanyName(this.form).then(function (res) {
                    if (res.statusCode == '2000000') {
                        callback();
                    } else if (res.statusCode == '2071302') {
                        callback(new Error());
                    }
                });
            },

            //校验物流公司名称缩写是否存在
            abbreviationExistValidator: function (rule, value, callback) {
                this.validateCompanyAbbreviation(this.form).then(function (res) {
                    if (res.statusCode == '2000000') {
                        callback();
                    } else if (res.statusCode == '2071303') {
                        callback(new Error());
                    }
                });
            },

            //校验每行物流公司名称
            handleBlurCompanyName: function (row) {
                const This = this;
                if (row.companyName == '') {
                    This.$set(row, 'cellNameExist', 0);
                    return false;
                }
                this.validateCompanyName(row).then(function (res) {
                    if (res.statusCode == '2000000') {
                        This.$set(row, 'cellNameExist', true);
                    } else if (res.statusCode == '2071302') {
                        This.$set(row, 'cellNameExist', 1);
                    }
                });
            },

            //校验每行物流公司名称缩写
            handleBlurAbbreviation: function (row) {
                const This = this;
                if (row.abbreviation == '') {
                    This.$set(row, 'cellAbbrExist', 0);
                    return false;
                }
                this.validateCompanyAbbreviation(row).then(function (res2) {
                    if (res2.statusCode == '2000000') {
                        This.$set(row, 'cellAbbrExist', true);
                    } else if (res2.statusCode == '2071303') {
                        This.$set(row, 'cellAbbrExist', 1);
                    }
                });
            },

            handleIconClick: function (row, item) {
                const This = this;
                return function () {
                    This.$set(row, item, '');
                };
            }

        }
    };
</script>