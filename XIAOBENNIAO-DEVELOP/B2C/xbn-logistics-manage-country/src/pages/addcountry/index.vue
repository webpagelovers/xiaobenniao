<style lang="less">
    .w600 {
        width: 600px;
    }

    .h90 {
        height: 90px;
    }

    .bz_h .nt-textarea__inner {
        height: 90px;
    }

    .x_flag .avatar-uploader-icon {
        width: 96px;
        height: 64px;
        line-height: 64px;
    }

    .lh62 {
        line-height: 64px;
    }

    .x_flag img {
        width: 96px;
        height: 64px;
    }
</style>

<template>
    <div>
        <page-head :title="'国家配置'"></page-head>
        <nt-row class="operationBox">
            <nt-col :span="20" class="f16">
                <i class="nt-icon nt-icon-arrow-left" @click="jumpToList" style="cursor: pointer;"></i>
                <span v-if="currentRouter == addUrlHash">新增国家</span>
                <span v-if="currentRouter == updateUrlHash">修改国家</span>
            </nt-col>
            <nt-col :span="4" style="text-align: right;">
                <nt-button type="primary" @click="saveData('form')" v-if="currentRouter == addUrlHash">保存</nt-button>
                <nt-button type="primary" @click="onSubmit('form')" v-if="currentRouter == updateUrlHash">保存</nt-button>
                <nt-button type="primary" @click="cancelAdd">取消</nt-button>
            </nt-col>
        </nt-row>


        <div class="contentBox">
            <div class="border_layout competing_infor">
                <div class="competing_infor_title fb" v-if="currentRouter == addUrlHash">新增国家</div>
                <div class="competing_infor_title fb" v-if="currentRouter == updateUrlHash">修改国家</div>

                <div class="competing_infor_xbox">
                    <nt-form :model="form" :rules="rules" ref="form" label-width="153px">
                        <nt-form-item label="国家名称：" prop="country">
                            <nt-col :span="3">
                                <nt-input v-model="form.country" class="w240" :maxlength="50"></nt-input>
                            </nt-col>
                        </nt-form-item>
                        <nt-form-item label="国家缩写：" prop="abbreviation">
                            <nt-col :span="3">
                                <nt-input v-model="form.abbreviation" class="w240" :maxlength="50"></nt-input>
                            </nt-col>
                        </nt-form-item>
                        <nt-form-item label="货币单位：" prop="currencyUnit">
                            <nt-select v-model="form.currencyUnit" placeholder="请选择货币单位" class="w240">
                                <nt-option v-for="item in countryFomat" :label="item.currencyUnit"
                                           :key="parseInt(item.id)" :value="item.currencyUnit"></nt-option>
                            </nt-select>
                        </nt-form-item>
                        <nt-form-item label="旗帜：" prop="imgPath">
                            <span class="x_flag inline_block ">
                                <avatar-upload v-model="form.imgPath" @uploadChange="handleImageChange" :size="4"
                                               :accept="type">
                                </avatar-upload>
                            </span>
                            <span class="col_cccccc vT lh62 ">
                                仅支持jpg,png,gif三种格式，大小不超过4M
                            </span>
                        </nt-form-item>

                        <nt-form-item :label="'报关名称过滤关键词：'" prop="forbiddenKeys">
                            <nt-col :span="3" class="rel w600 bz_h">
                                <nt-input type="textarea" v-model="form.forbiddenKeys" :maxlength="250"
                                          placeholder="最多250个字符，关键字之间用英文逗号区隔" @change="handleForbiddenKeysChange">

                                </nt-input>
                                <i class="textarea_counter">{{remainder}}/250</i>
                            </nt-col>
                        </nt-form-item>
                        <nt-form-item style="margin-top: -10px;" v-if="notAllowedChineseComma">
                            <div class="nt-form-item__error">关键词不允许有中文字符逗号</div>
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
                countryFomat: [],
                notAllowedChineseComma:false,
                constant: constant,
                //表单
                form: {},
                type: 'jpg,jpeg,png,gif',
                //剩余关键字
                remainder: 250,
                //校验规则
                rules: {
                    country: [
                        {required: true, message: '请输入国家名称', trigger: 'blur'},
                        {max: 50, message: '国家名称最多50个字符'},
                        {validator: this.countryNameExistValidator, message: '国家名称已存在'}
                    ],
                    abbreviation: [
                        {required: true, message: '请输入国家名称缩写', trigger: 'blur'},
                        {max: 50, message: '国家名称缩写最多容纳50个字符'},
                        {validator: this.countryAbbrExistValidator, message: '国家名称缩写已存在'}
                    ],
                    currencyUnit: [
                        {required: true, message: '请选择国家货币单位', trigger: 'change'}
                    ],
                    imgPath: [
                        {required: true, message: '请上传国家旗帜', trigger: 'change'}
                    ],
                    forbiddenKeys: [
                        {required: false, message: '请输入关键字', trigger: 'blur'}
                    ]
                },
                currentRouter: location.hash.split('?')[0],
                addUrlHash: '#/country/add',
                updateUrlHash: '#/country/update'
            };
        },
        created: async function () {
            await this.loadPage();
        },

        methods: {
            async loadPage() {
                const dictionaryData = await this.ctx.models.country.getGcfsDictionary();
                this.countryFomat = dictionaryData.country;

                if (this.currentRouter == this.updateUrlHash) {
                    const getInfo = await this.getInfoCountry();
                    this.form = getInfo.data;
                    this.remainder = 250 - this.form.forbiddenKeys.length;
                }
            },

            //添加页面，点击保存按钮，提交数据
            saveData: function (formName) {
                const This = this;
                if(this.notAllowedChineseComma === true){
                    return false;
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        This.addCountry(This.form).then(function (res) {
                            if (res.statusCode == '2000000') {
                                This.$router.push({path: '/country/list'});
                            }
                        });

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },

            onSubmit(formName) {
                const This = this;
                if(this.notAllowedChineseComma === true){
                    return false;
                }
                this.$refs[formName].validate((valid) => {
                    This.countryExist = false;
                    if (valid) {
                        This.updateCountry().then(function (res) {
                            if (res.statusCode == '2000000') {
                                This.$router.push({path: '/country/list'});
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            //添加国家
            addCountry: function (params) {
                return this.ctx.models.country.addCountry(params);
            },

            //修改国家
            updateCountry: function () {
                return this.ctx.models.country.updateCountry(this.form);
            },

            //获取详情
            getInfoCountry: function () {
                const id = this.$route.query['id'];
                return this.ctx.models.country.getInfoCountry(id);
            },

            //获取字典
            getGcfsDictionary: function (params) {
                return this.ctx.models.country.getGcfsDictionary();
            },

            //验证国家名称接口
            validateCountryName: function () {
                return this.ctx.models.country.validateCountryName(this.form);
            },

            //验证国家名称简写接口
            validateCountryAbbreviation: function () {
                return this.ctx.models.country.validateCountryAbbreviation(this.form);
            },

            cancelAdd: function () {
                this.$router.push({path: '/country/list'});
            },

            jumpToList() {
                this.$router.push({path: '/country/list'});
            },

            //校验图片上传
            handleImageChange: function () {
                this.$refs['form'].validateField('imgPath');
            },

            handleForbiddenKeysChange: function (value) {
                if(value.match(/\，/g)){
                    this.notAllowedChineseComma = true;
                }else{
                    this.notAllowedChineseComma = false;
                }
                this.remainder = 250 - this.form.forbiddenKeys.length;
            },

            //校验国家名称是否存在
            countryNameExistValidator: function (rule, value, callback) {
                this.validateCountryName().then(function(res){
                    if (res.statusCode == '2000000') {
                        callback();
                    } else if (res.statusCode == '2071103') {
                        callback(new Error());
                    }
                });
            },

            //校验国家名称缩写是否存在
            countryAbbrExistValidator: function (rule, value, callback) {
                this.validateCountryAbbreviation().then(function (res) {
                    if (res.statusCode == '2000000') {
                        callback();
                    } else if (res.statusCode == '2071103') {
                        callback(new Error());
                    }
                });
            }


        }
    };
</script>