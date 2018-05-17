<style lang="less">
    .w180 {
        width: 180px;
    }

    .padT_padB16 {
        padding-top: 16px;
        padding-bottom: 16px;
    }

    .pL11 {
        padding-left: 11px;
    }
</style>

<template>
    <div>
        <page-head :title="'拼箱计划'"></page-head>
        <nt-row class="operationBox">
            <nt-col :span="4" class="f16">
                <i class="nt-icon nt-icon-arrow-left" @click="jumpList" style="cursor: pointer;"></i>
                <span v-if="currentRouter == addUrlHash">新增拼箱计划</span>
                <span v-if="currentRouter == updateUrlHash">修改拼箱计划</span>
            </nt-col>
            <nt-col :span="20" style="text-align: right;">
                <nt-button type="primary" @click="handleSave('form',1)" v-if="currentRouter == addUrlHash">保存
                </nt-button>
                <nt-button type="primary" @click="handleUpdate('form')" v-if="currentRouter == updateUrlHash">保存
                </nt-button>
                <nt-button type="primary" @click="handleSave('form',2)" v-if="currentRouter == addUrlHash">保存并新建
                </nt-button>
                <nt-button type="primary" @click="handleSave('form',3)" v-if="currentRouter == addUrlHash">保存并指派
                </nt-button>
                <nt-button type="primary" @click="handleSave('form',3)" v-if="currentRouter == updateUrlHash">指派
                </nt-button>
                <nt-button type="primary" @click="jumpList">取消</nt-button>
            </nt-col>
        </nt-row>

        <nt-form :model="form" :rules="rules" ref="form" label-width="125px">
            <div class="contentBox">
                <div class="border_layout competing_infor">
                    <div class="competing_infor_title fb">拼箱计划</div>
                    <div class="competing_infor_xbox">
                        <nt-form-item label="拼箱计划编码：" prop="planCode">
                            <nt-col :span="3">
                                {{form.planCode}}
                            </nt-col>
                        </nt-form-item>
                        <nt-form-item label="货柜编码：" prop="containerCode">
                            <nt-col :span="3">
                                <nt-input v-model="form.containerCode" :maxlength="11"
                                          :disabled="currentRouter == updateUrlHash"
                                          class="w240"></nt-input>
                            </nt-col>
                        </nt-form-item>
                    </div>
                </div>
                <div class=" competing_infor mT25">
                    <div class="competing_infor_title fb">箱子信息</div>
                    <div class="competing_infor_main">
                        <nt-row v-if="form.boxs[0]">
                            <div class="padT_padB16 pL11">
                                <div class="inline_block mR32 ver-top"
                                     style="margin-left: 33px;display: table-cell;padding: 0 30px;">总箱数： {{allNum}}
                                </div>
                                <div class="inline_block mR32 ver-top" style="display: table-cell;padding: 0 30px;">
                                    实测总体积： {{allVolument}}
                                    <span>m³</span>
                                    <p v-if="allVolumentErrorVisiable === true" style="color:#fe5655;">实测总体积不能为0</p>
                                    <p v-if="ifNullCasesVolumentError" style="color:#fe5655;">{{ifNullCasesVolumentError}}</p>
                                </div>
                                <div class="inline_block mR32 ver-top" style="display: table-cell;padding: 0 30px;">
                                    实测总重量： {{allWeight}}
                                    <span>kg</span>
                                    <p v-if="allWeightErrorVisiable === true" style="color: #fe5655;">实测总重量不能为0</p>
                                    <p v-if="ifNullCasesWeightError" style="color:#fe5655;">
                                        {{ifNullCasesWeightError}}</p>
                                </div>
                            </div>
                        </nt-row>
                        <nt-row>
                            <nt-form-item label="装箱单号：" prop="boxOrderCode">
                                <span style="position:absolute;left:-92px; top:2px;color: #fe5655;"
                                      v-if="!form.boxs[0]">*</span>
                                <nt-input :maxlength="18" v-model="form.boxOrderCode" class="w240 mR10"></nt-input>
                                <nt-button type="primary" @click="handleAddBox">增加</nt-button>
                            </nt-form-item>
                        </nt-row>
                        <nt-row v-if="form.boxs[0]">
                            <nt-table :data="form.boxs" v-model="form.boxs" class="dialog_table">
                                <nt-table-column width="11"></nt-table-column>
                                <nt-table-column prop="boxOrderCode" label="箱单号"></nt-table-column>
                                <nt-table-column prop="volumet" label="实测体积(cm)">
                                    <template slot-scope="scope">
                                        <nt-input v-model="scope.row.length"
                                                  @change="handleRowItemChange(scope.$index, scope.row)"
                                                  @blur="handleBlurItemChange(scope.$index, scope.row)"
                                                  class="w80"></nt-input>
                                        <span> X </span>
                                        <nt-input v-model="scope.row.width"
                                                  @change="handleRowItemChange(scope.$index, scope.row)"
                                                  @blur="handleBlurItemChange(scope.$index, scope.row)"
                                                  class="w80"></nt-input>
                                        <span> X </span>
                                        <nt-input v-model="scope.row.height"
                                                  @change="handleRowItemChange(scope.$index, scope.row)"
                                                  @blur="handleBlurItemChange(scope.$index, scope.row)"
                                                  class="w80"></nt-input>
                                        <p v-if="scope.row.lengthError" style="color: #fe5655;">{{scope.row.lengthError}}</p>
                                        <p v-if="scope.row.widthError" style="color: #fe5655;">
                                            {{scope.row.widthError}}</p>
                                        <p v-if="scope.row.heightError" style="color: #fe5655;">{{scope.row.heightError}}</p>
                                    </template>
                                </nt-table-column>
                                <nt-table-column prop="weight" label="实测重量(kg)">
                                    <template slot-scope="scope">
                                        <nt-input v-model="scope.row.weight"
                                                  @change="handleRowItemChange(scope.$index, scope.row)"
                                                  @blur="handleBlurItemChange(scope.$index, scope.row)"
                                                  class="w80"></nt-input>
                                        <p v-if="scope.row.weightError" style="color: #fe5655;">{{scope.row.weightError}}</p>

                                    </template>
                                </nt-table-column>
                                <nt-table-column prop="forecastCode" label="收货预报编码"></nt-table-column>
                                <nt-table-column prop="forecastCode" label="操作">
                                    <template slot-scope="scope">
                                        <nt-button type="text"
                                                   size="small"
                                                   @click="handleDeleteCurrentBox(scope.$index, scope.row)">
                                            删除
                                        </nt-button>
                                    </template>
                                </nt-table-column>
                            </nt-table>

                        </nt-row>
                    </div>
                </div>
            </div>
        </nt-form>
    </div>
</template>

<script>

    import {PageHead} from 'xbn-biz-components';
    import {AvatarUpload} from 'xbn-biz-components';
    import {CitySelect} from 'xbn-biz-components';
    import commonMixin from '../common.js';


    export default {
        mixins: [commonMixin],
        components: {
            PageHead,
            AvatarUpload,
            CitySelect
        },
        data() {
            return {
                form: {
                    source: 1,
                    planCode: null,
                    containerCode: null,
                    boxs: [],
                    boxOrderCode: '',
                },
                allNum: 0,
                allVolument: 0,
                allVolumentErrorVisiable: false,
                allWeight: 0,
                allWeightErrorVisiable: false,
                ifNullCasesVolumentError: null,
                ifNullCasesWeightError: null,
                rules: {
                    planCode: [
                        {required: true, message: '请输入开票厂商公司名称', trigger: 'blur'},
                        {max: 60, message: '开票厂商公司名称最多60个字符'},
                    ],
                    containerCode: [
                        {required: true, message: '请输入货柜编码', trigger: 'blur'},
                        {max: 11, message: '请输入货柜编码最多11个字符'},
                        {validator: this.containerCodeValidator, message: '货柜编码只能包含字母、数字'}
                    ],
                    boxOrderCode: [
                        {required: false, type: 'string', message: '请输入装箱单号', trigger: 'blur'},
                        {max: 15, message: '装箱单号最多15个字符'},
                        {validator: this.boxOrderCodeValidator},
                        {validator: this.boxOrderCodeExisValidator}
                    ],
                }

            };
        },

        created: async function () {
            if (this.currentRouter === this.addUrlHash) {
                await this.loadAddPage();
            } else if (this.currentRouter === this.updateUrlHash) {
                await this.loadUpdataPage();
            }
        },


        methods: {
            async loadAddPage() {
                const planCodeRes = await this.ctx.models.lclplan.createPlanCode();
                this.form.planCode = planCodeRes.data;
            },

            async loadUpdataPage() {
                const id = this.$route.query['id'];
                const getInfoRes = await this.ctx.models.lclplan.getInfo(id);
                this.form = getInfoRes.data;
                this.form.boxs = getInfoRes.data.boxs;
                this.handleCompute();
            },


            //保存
            handleSave: async function (formName, next) {
                const This = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {

                        if (This.passAllData() === false) {
                            return false;
                        }

                        if (This.ifNullCasesVolument() === false) {
                            return false;
                        }

                        if (This.ifNullCasesWeight() === false) {
                            return false;
                        }

                        This.ctx.models.lclplan.save(this.form).then(function (res) {
                            if (res.statusCode === '2000000') {
                                This.aptId = res.data;
                                if (next === 1) {
                                    This.jumpList();
                                } else if (next === 2) {
                                    This.$router.go(0);
                                } else if (next === 3) {
                                    This.jumpApt(null, {id: This.aptId});
                                }
                            }
                        });

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            //编辑
            handleUpdate: async function (formName) {
                const This = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {

                        if (This.passAllData() === false) {
                            return false;
                        }

                        if (This.ifNullCasesVolument() === false) {
                            return false;
                        }

                        if (This.ifNullCasesWeight() === false) {
                            return false;
                        }

                        This.ctx.models.lclplan.update(this.form).then(function (res) {
                            if (res.statusCode === '2000000') {
                                This.jumpList();
                            }
                        });


                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            //增加装箱单号
            handleAddBox: async function () {
                if (this.form.boxOrderCode) {
                    for (var i = 0; i < this.form.boxs.length; i++) {
                        if (this.form.boxs[i].boxOrderCode == this.form.boxOrderCode) {
                            return false;
                        }
                    }

                    try {
                        const boxOrderCodeRes = await this.ctx.models.lclplan.addBox({
                            planId: this.$route.query['id'],
                            boxOrderCode: this.form.boxOrderCode
                        });
                        const boxOrderCodeData = boxOrderCodeRes.data;

                        this.form.boxs.splice(0, 0, {
                            boxId: boxOrderCodeData.id,
                            boxOrderCode: boxOrderCodeData.boxOrderCode,
                            forecastCode: boxOrderCodeData.forecastCode,
                            height: boxOrderCodeData.realHeight,
                            length: boxOrderCodeData.realLength,
                            planId: boxOrderCodeData.planId,
                            volumet: boxOrderCodeData.realLength * boxOrderCodeData.realWidth * boxOrderCodeData.realHeight,
                            weight: boxOrderCodeData.realWeigh,
                            width: boxOrderCodeData.realWidth
                        });
                        this.form.boxOrderCode = null;
                        this.handleCompute();
                    } catch (err) {
                        this.ctx.onerror(err);
                    }

                } else {
                    this.$refs['form'].validateField('boxOrderCode');
                }
            },

            //删除当前箱子
            handleDeleteCurrentBox: function (index, row) {
                this.form.boxs.splice(index, 1);
                this.handleCompute();
                this.form.boxOrderCode = null;
            },


            //计算总箱数，总体积，总重量
            handleCompute: function () {
                var allVolument = 0, allWeight = 0;
                if (this.form.boxs[0]) {
                    for (var i = 0; i < this.form.boxs.length; i++) {
                        allVolument += this.form.boxs[i].volumet;
                        allWeight += Number(this.form.boxs[i].weight);
                    }
                }

                //把总重量转换为m³,并保留小数点后4位
                allVolument = (allVolument / Math.pow(100, 3)).toFixed(4);

                this.allVolument = allVolument;
                this.allWeight = allWeight;
                this.allNum = this.form.boxs.length;


            },

            //返回require是真是假
            requireResult: function () {
                if (this.currentRouter === this.addUrlHash) {
                    this.requireResult = true;
                } else {
                    this.requireResult = false;
                }
            },

            //监听change
            handleRowItemChange: function (index, row) {
                this.$set(row, 'length', row.length);
                this.$set(row, 'width', row.width);
                this.$set(row, 'height', row.height);
                this.$set(row, 'volumet', row.length * row.width * row.height);
                this.$set(row, 'weight', row.weight);
                this.handleCompute();
            },

            //监听鼠标失去焦点
            handleBlurItemChange: function (index, row) {

                var reg1 = /^\d{0,4}(\.[0-9])?$/;
                var reg2 = /^\d{0,10}(\.[0-9]{1,3})?$/;
                //校验长度
                if (!reg1.test(row.length)) {
                    this.$set(row, 'lengthError', '箱子长度必须为数字，整数位最大4位，精确到小数点后1位');
                } else {
                    if (row.length == 0) {
                        this.$set(row, 'lengthError', '箱子长度不能为0');
                    } else {
                        this.$set(row, 'lengthError', null);
                    }
                }

                //校验宽度
                if (!reg1.test(row.width)) {
                    this.$set(row, 'widthError', '箱子宽度必须为数字，整数位最大4位，精确到小数点后1位');
                } else {

                    if (row.width == 0) {
                        this.$set(row, 'widthError', '箱子宽度不能为0');
                    } else {
                        this.$set(row, 'widthError', null);
                    }
                }

                //校验高度
                if (!reg1.test(row.height)) {
                    this.$set(row, 'heightError', '箱子高度必须为数字，整数位最大4位，精确到小数点后1位');
                } else {
                    if (row.height == 0) {
                        this.$set(row, 'heightError', '箱子高度不能为0');
                    } else {
                        this.$set(row, 'heightError', null);
                    }
                }

                //校验重量
                if (!reg2.test(row.weight)) {
                    this.$set(row, 'weightError', '箱子实测重量必须为数字，整数位最大10位，精确到小数点后3位');
                } else {
                    if (row.weight == 0) {
                        this.$set(row, 'weightError', '箱子实测重量不能为0');
                    } else {
                        this.$set(row, 'weightError', null);
                    }

                }

                this.ifNullCasesVolument();
                this.ifNullCasesWeight();
            },

            passAllData: function () {
                if (this.allVolument == 0) {
                    this.allVolumentErrorVisiable = true;
                } else if (isNaN(this.allVolument) == true) {
                    this.allVolumentErrorVisiable = true;
                } else {
                    this.allVolumentErrorVisiable = false;
                }

                if (this.allWeight == 0) {
                    this.allWeightErrorVisiable = true;
                } else if (isNaN(this.allWeight) == true) {
                    this.allWeightErrorVisiable = true;
                } else {
                    this.allWeightErrorVisiable = false;
                }

                if (this.allVolumentErrorVisiable === true) {
                    return false;
                }

                if (this.allWeightErrorVisiable === true) {
                    return false;
                }
            },

            //校验货柜编码
            containerCodeValidator: function (rule, value, callback) {
                var reg = /^[0-9a-zA-Z]+$/;
                if (reg.test(value)) {
                    callback();
                } else {
                    callback(new Error());
                }
            },

            //校验装箱单号
            boxOrderCodeValidator: function (rule, value, callback) {
                var reg = /^[0-9a-zA-Z]+$/;


                if (!this.form.boxs[0]) {
                    if (!value || value == '') {
                        callback(new Error('请输入装箱单号'));
                    } else if (reg.test(value)) {
                        callback();
                    } else {
                        callback(new Error('装箱单号只能包含字母、数字'));
                    }
                } else {

                    if (!value || value == '') {
                        callback();
                    } else {
                        if (reg.test(value)) {
                            callback();
                        } else {
                            callback(new Error('装箱单号只能包含字母、数字'));
                        }
                    }

                }

            },

            //校验装箱单号已经存在
            boxOrderCodeExisValidator: function (rule, value, callback) {
                for (var i = 0; i < this.form.boxs.length; i++) {
                    if (this.form.boxs[i].boxOrderCode == value) {
                        callback(new Error('不能重复添加装箱单号：' + value));
                        return false;
                    } else {
                        callback();
                    }
                }
            },

            //监听有没有空箱子
            ifNullCasesVolument: function () {
                for (var i = 0; i < this.form.boxs.length; i++) {
                    if (this.form.boxs[i].volumet == 0) {
                        this.ifNullCasesVolumentError = '第' + (i + 1) + '行的箱子体积不能为0';
                        return false;
                    } else {
                        this.ifNullCasesVolumentError = null;
                    }
                }
            },

            ifNullCasesWeight: function () {
                for (var i = 0; i < this.form.boxs.length; i++) {
                    if (this.form.boxs[i].weight == 0) {
                        this.ifNullCasesWeightError = '第' + (i + 1) + '行的箱子重量不能为0';
                        return false;
                    } else {
                        this.ifNullCasesWeightError = null;
                    }
                }
            }

        }
    };
</script>


