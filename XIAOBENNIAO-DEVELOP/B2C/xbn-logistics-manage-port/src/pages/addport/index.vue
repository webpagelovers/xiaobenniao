<style lang="less">

    .nt-form {
        background: #fff;

    }

    .add_cont {
        height: 46px;
        line-height: 46px;
        border-bottom: 1px solid #ccc;
        color: #57595b;
        padding-left: 33px;
    }

    .log_main {
        padding: 32px 0;
    }

    .w240 {
        width: 240px;
    }

    .w370 {
        width: 370px;
    }

</style>

<template>
    <div>
        <page-head :title="'港口管理'"></page-head>
        <nt-row class="operationBox">
            <nt-col :span="20" class="f16">
                <i class="nt-icon nt-icon-arrow-left" @click="jumpToList" style="cursor: pointer;"></i>
                <span v-if="currentRouter == addUrlHash">新增港口</span>
                <span v-if="currentRouter == updateUrlHash">修改港口</span>
            </nt-col>
            <nt-popover style="background: #fff;" ref="add" placement="bottom" :disabled="disabled">
                <div class="bgcfff">
                    <div>
                        <p>您确定保存当前港口吗？</p>
                        <p>保存港口后所属国家不可更改</p>
                    </div>
                    <div class="popoverBtn">
                        <nt-button type="primary" size="small"
                                   @click="saveData('form')">确定
                        </nt-button>
                        <nt-button size="small" type="primary" @click="closeDeleteSmall">取消
                        </nt-button>
                    </div>
                </div>
            </nt-popover>
            <nt-col :span="4" style="text-align: right;">
                <nt-button type="primary" v-popover:add @click="validateForm('form')"
                           v-if="currentRouter == addUrlHash">保存
                </nt-button>
                <nt-button type="primary" @click="onSubmit('form')" v-if="currentRouter == updateUrlHash">保存</nt-button>
                <nt-button type="primary" @click="cancelAdd">取消</nt-button>
            </nt-col>
        </nt-row>


        <div class="contentBox">
            <div class="border_layout competing_infor">
                <div class="competing_infor_title fb" v-if="currentRouter == addUrlHash">新增港口</div>
                <div class="competing_infor_title fb" v-if="currentRouter == updateUrlHash">修改港口</div>

                <div class="competing_infor_xbox">
                    <nt-form :model="form" :rules="rules" ref="form" label-width="95px">
                        <nt-form-item label="港口名称：" prop="name">
                            <nt-col :span="3">
                                <nt-input v-model="form.name" class="w240" :maxlength="50"></nt-input>
                            </nt-col>
                        </nt-form-item>
                        <nt-form-item label="港口类型：" prop="portType" v-if="currentRouter == addUrlHash">
                            <nt-col :span="3">
                                <nt-select v-model="form.portType" placeholder="请选择港口类型" class="w240" @change="handlePortTypeChange">
                                    <nt-option v-for="item in portTypeFormat" :label="item.label"
                                               :key="parseInt(item.id)" :value="item.id"></nt-option>
                                </nt-select>
                            </nt-col>
                        </nt-form-item>
                        <nt-form-item label="港口类型：" v-if="currentRouter == updateUrlHash">
                            <nt-col :span="3">
                                {{detailPortType}}
                            </nt-col>
                        </nt-form-item>
                        <nt-form-item label="所属国家：" prop="countryId" v-if="currentRouter == addUrlHash">
                            <nt-select v-model="form.countryId" placeholder="请选择所属国家" class="w240">
                                <nt-option v-for="item in countryFomat" :label="item.country"
                                           :key="parseInt(item.id)" :value="item.id"></nt-option>
                            </nt-select>
                        </nt-form-item>
                        <nt-form-item label="所属国家：" v-if="currentRouter == updateUrlHash">
                            {{detailCountryId}}
                        </nt-form-item>
                    </nt-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import {PageHead} from 'xbn-biz-components';
    import {AvatarUpload} from 'xbn-biz-components';
    import constant from '../constant.js';

    export default {
        components: {
            PageHead,
            AvatarUpload
        },
        data() {
            return {
                //全部国家
                countryFomat: [],
                //国内
                countryDomesticFomat:[],
                //国际
                countryInternationalFomat:[],
                disabled: true,
                portTypeFormat: [{label: '国内', id: '1'}, {label: '海外', id: '2'}],
                detailCountryId: '',
                detailPortType: '',
                //表单
                form: {},
                //校验规则
                rules: {
                    name: [
                        {required: true, message: '请输入港口名称', trigger: 'blur'},
                        {max: 50, message: '港口名称不能超过50个字符',trigger:'blur'},
                        {validator: this.portNameExistValidator, message: '港口名称已存在'}
                    ],
                    portType: [
                        {required: true, message: '请选择港口类型', trigger: 'change'}
                    ],
                    countryId: [
                        {required: true, message: '请选择所属国家', trigger: 'change'}
                    ]
                },
                currentRouter: location.hash.split('?')[0],
                addUrlHash: '#/port/add',
                updateUrlHash: '#/port/update'
            };
        },
        created: async function () {
            await this.loadPage();
        },

        methods: {
            async loadPage() {
                const dictionaryData = await this.ctx.models.port.getGcfsDictionary();
                this.countryFomat = dictionaryData.country;
                this.countryDomesticFomat = dictionaryData.countryDomestic;
                this.countryInternationalFomat = dictionaryData.countryInternational;

                if (this.currentRouter == this.addUrlHash) {
                    this.countryFomat = '';
                }

                if (this.currentRouter == this.updateUrlHash) {
                    const getInfo = await this.getInfoPort();
                    this.form = getInfo.data;
                    this.detailPortType = this.getItem(this.form.portType, this.portTypeFormat);
                    this.detailCountryId = this.getCItem(this.form.countryId, this.countryFomat);
                }
            },

            //添加页面，点击保存按钮，提交数据
            saveData: function (formName) {
                const This = this;
                This.addPort(This.form).then(function (res) {
                    if (res.statusCode == '2000000') {
                        This.$router.push({path: constant.listPage});
                    }
                });
            },

            //校验表单填写
            validateForm: function (formName) {
                const This = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        This.disabled = false;
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },


            onSubmit(formName) {
                const This = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        This.updatePort().then(function (res) {
                            if (res.statusCode == '2000000') {
                                This.$router.push({path: constant.listPage});
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            //添加国家
            addPort: function (params) {
                return this.ctx.models.port.addPort(params);
            },

            //修改港口
            updatePort: function () {
                return this.ctx.models.port.updatePort(this.form);
            },

            //获取详情
            getInfoPort: function () {
                const id = this.$route.query['id'];
                return this.ctx.models.port.getInfoPort(id);
            },

            //验证港口名称接口
            validatePortName: function () {
                return this.ctx.models.port.validatePortName(this.form);
            },


            //获取字典
            getGcfsDictionary: function (params) {
                return this.ctx.models.port.getGcfsDictionary();
            },

            cancelAdd: function () {
                this.$router.push({path: constant.listPage});
            },

            jumpToList() {
                this.$router.push({path: constant.listPage});
            },

            //获取格式化以后的数据
            getItem: function (itemType, itemFormat) {
                for (let i = 0; i < itemFormat.length; i++) {
                    if (itemFormat[i].id == itemType) {
                        itemType = itemFormat[i].label;
                    }
                }
                return itemType;
            },

            //获取货币单位item
            getCItem: function (itemType, itemFormat) {
                for (let i = 0; i < itemFormat.length; i++) {
                    if (itemFormat[i].id == itemType) {
                        itemType = itemFormat[i].country;
                    }
                }
                return itemType;
            },


            //隐藏弹框
            closeDeleteSmall: function () {
                document.querySelector('body').click();
            },

            //校验港口名称的值是否为空
            portNameValidator: function (rule, value, callback) {
                if (value) {
                    this.portExist = false;
                    callback();
                } else {
                    this.portExist = true;
                    callback(new Error());
                }
            },

            //校验港口名称长度不能超过50
            maxLenValidator(rule, value, callback) {
                if (value.length > 50) {
                    callback(new Error());
                } else {
                    callback();
                }
            },

            //监听港口类型变动
            handlePortTypeChange:function(value){
                if(value == '1'){
                    this.countryFomat = this.countryDomesticFomat;
                    this.form.countryId = this.countryDomesticFomat[0].id;
                }else if(value == '2'){
                    this.countryFomat = this.countryInternationalFomat;
                    delete this.form.countryId;
                }
            },

            //校验港口名称是否存在
            portNameExistValidator: function (rule, value, callback) {
                this.validatePortName().then(function(res){
                    if (res.statusCode == '2000000') {
                        callback();
                    } else if (res.statusCode == '2071202') {
                        callback(new Error());
                    }
                });
            },


        }
    };
</script>


