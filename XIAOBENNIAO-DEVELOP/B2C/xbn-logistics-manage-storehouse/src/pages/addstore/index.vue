<style lang="less">
    .mR32 {
        margin-right: 32px;
    }

</style>

<template>
    <div>
        <page-head :title="'仓库管理'"></page-head>
        <nt-row class="operationBox">
            <nt-col :span="20" class="f16">
                <i class="nt-icon nt-icon-arrow-left curpointer" @click="jumpToList" ></i>
                <span v-if="currentRouter == addUrlHash">新增仓库</span>
                <span v-if="currentRouter == updateUrlHash">修改仓库</span>
            </nt-col>
            <nt-col :span="4" style="text-align: right;">
                <nt-button type="primary" @click="saveData('form')" v-if="currentRouter == addUrlHash">保存</nt-button>
                <nt-button type="primary" @click="onSubmit('form')" v-if="currentRouter == updateUrlHash">保存</nt-button>
                <nt-button type="primary" @click="cancelAdd">取消</nt-button>
            </nt-col>
        </nt-row>


        <div class="contentBox">
            <nt-form :model="form" :rules="rules" ref="form" label-width="153px">
                <div class="border_layout competing_infor">
                    <div class="competing_infor_title fb">仓库信息</div>
                    <div class="competing_infor_main">
                        <nt-form-item label="仓库编码：" prop="storeCode">
                            <nt-col :span="3">
                                <nt-input v-model="form.storeCode" class="w240" disabled></nt-input>
                            </nt-col>
                        </nt-form-item>
                        <nt-form-item label="仓库名称：" prop="storeName">
                            <nt-col :span="3">
                                <nt-input v-model="form.storeName" :maxlength="50" class="w240"></nt-input>
                            </nt-col>
                        </nt-form-item>
                        <nt-form-item label="仓库类型：" prop="storeType" v-if="currentRouter == addUrlHash">
                            <nt-radio-group v-model="form.storeType" @change="handleValidateClick(form.storeType)">
                                <nt-radio v-for="item in storeTypeOptions" :label="item.id" :key="item.id">
                                    {{item.name}}
                                </nt-radio>
                            </nt-radio-group>
                        </nt-form-item>
                        <nt-form-item label="仓库类型：" prop="storeType" v-if="currentRouter == updateUrlHash">
                            <nt-col :span="3">
                                <div v-model="form.storeType">{{getItem(form.storeType, storeTypeOptions)}}</div>
                            </nt-col>
                        </nt-form-item>
                        <nt-form-item label="所属国家：" prop="countryCurrencyId">
                            <nt-select v-model="form.countryCurrencyId" placeholder="请选择所属国家" class="w240">
                                <nt-option v-for="item in countryOptions" :label="item.country"
                                           :key="parseInt(item.id)" :value="item.id"></nt-option>
                            </nt-select>
                        </nt-form-item>
                        <nt-form-item label="支持快递：" prop="storeLogisCompanies"
                                      v-if="form.storeType == '01'">
                            <nt-checkbox :indeterminate="isIndeterminate" v-model="checkAll" class="inline_block"
                                         style="margin-right: 12px;"
                                         @change="handleCheckAllChange">全选
                            </nt-checkbox>
                            <nt-checkbox-group v-model="checkedCompanies" class="inline_block"
                                               @change="handleCheckedCompaniesChange">
                                <nt-checkbox v-for="item in companiesOptions" :label="item"
                                             style="margin-left: 0;margin-right: 15px;"
                                             :key="item" :value="item">{{getItemById(item)}}</nt-checkbox>
                            </nt-checkbox-group>
                        </nt-form-item>
                        <nt-form-item label="所属起运港：" prop="storePorts"
                                      v-if="form.storeType == '02'">
                            <nt-checkbox-group v-model="checkedPortIdOptions"
                                               @change="handleValidateStoreChange">
                                <nt-checkbox v-for="item in portIdOptions" :label="item" :key="item" style="margin-left: 0;margin-right: 15px;"></nt-checkbox>
                            </nt-checkbox-group>
                        </nt-form-item>
                        <!--<nt-form-item label="所属起运港：" prop="storePorts"
                                      v-if="form.storeType == '02' && currentRouter == updateUrlHash">
                            <div v-model="form.storePorts">
                                <span class="mR32" v-for="item in form.storePorts">{{item.portName}}</span>
                            </div>
                        </nt-form-item>-->
                        <nt-form-item label="仓库地址：" prop="address">
                            <nt-col :span="3">
                                <nt-input v-model="form.address" :maxlength="500" class="w240"></nt-input>
                            </nt-col>
                        </nt-form-item>
                    </div>
                </div>

                <div class=" competing_infor mT25">
                    <div class="competing_infor_title fb">仓库联系人信息</div>
                    <div class="competing_infor_main">

                        <nt-form-item label="公司名称：" prop="componyName">
                            <nt-col :span="3">
                                <nt-input v-model="form.componyName" :maxlength="100" class="w240"></nt-input>
                            </nt-col>
                        </nt-form-item>
                        <nt-form-item label="仓库收货人：" prop="consignee">
                            <nt-col :span="3">
                                <nt-input v-model="form.consignee" :maxlength="50" class="w240"></nt-input>
                            </nt-col>
                        </nt-form-item>
                        <nt-form-item label="联系电话：" prop="phonenumber">
                            <nt-col :span="3">
                                <nt-input v-model="form.phonenumber" :maxlength="20" class="w240"></nt-input>
                            </nt-col>
                        </nt-form-item>

                    </div>
                </div>
            </nt-form>
        </div>
    </div>
</template>

<script>

    import {PageHead} from 'xbn-biz-components';

    export default {
        components: {
            PageHead
        },
        data() {
            return {
                //仓库类型配置:海外仓："01"，集货仓："02"
                storeTypeOptions: [{name: '海外仓', id: '01'}, {name: '集货仓', id: '02'}],
                //所属国家配置
                countryOptions: [],
                //所属国内国家配置
                countryDomesticFomat:[],
                //所属国际国家配置
                countryInternationalFomat:[],
                //所属起运港配置
                portIdOptions: [],
                //默认选择所属起运港的配置
                checkedPortIdOptions: [],
                //全选按钮配置
                checkAll: true,
                //默认选择的快递的配置
                checkedCompanies: [],
                //所有的快递配置
                companiesOptions: [],
                isIndeterminate: false,

                //表单
                form: {
                    storeType: '02',
                    storePorts: [],
                    countryCurrencyId: '',
                    storeLogisCompanies: []
                },
                //校验规则
                rules: {
                    storeCode: [
                        {required: true, message: '请输入仓库编码', trigger: 'blur'}
                    ],
                    storeName: [
                        {required: true, message: '请输入仓库名称', trigger: 'blur'},
                        {max: 50, message: '仓库名称最多容纳50个字符'},
                        {validator: this.storeNameValidator, message: '仓库名称已存在'}
                    ],
                    storeType: [
                        {required: true, message: '请选择仓库类型', trigger: 'change'}
                    ],
                    countryCurrencyId: [
                        {required: true, message: '请选择所属国家', trigger: 'change'}
                    ],
                    storePorts: [
                        {required: true, type: 'array', message: '请选择所属起运港', trigger: 'change'}
                    ],
                    storeLogisCompanies: [
                        {required: true, type: 'array', message: '请选择支持的快递', trigger: 'change'}
                    ],
                    address: [
                        {required: true, message: '请输入仓库地址', trigger: 'blur'},
                        {max: 500, message: '仓库地址最多500个字符'}
                    ],
                    componyName: [
                        {required: true, message: '请输入公司名称', trigger: 'blur'},
                        {max: 100, message: '公司名称最多100个字符'}
                    ],
                    consignee: [
                        {required: true, message: '请输入仓库收货人', trigger: 'blur'},
                        {max: 50, message: '仓库收货人最多50个字符'}
                    ],
                    phonenumber: [
                        {required: true, message: '请输入联系电话', trigger: 'blur'},
                        {max: 20, message: '联系电话最多20个字符'}
                    ]
                },
                currentRouter: location.hash.split('?')[0],
                addUrlHash: '#/storehouse/add',
                updateUrlHash: '#/storehouse/update'
            };
        },
        created: async function () {
            await this.loadPage();
        },

        methods: {
            async loadPage() {

                const storeCode = await this.genStoreCode();
                this.form.storeCode = storeCode.data;
                this.dictionaryData = await this.getGcfsDictionary();
                //this.countryOptions = this.dictionaryData.country;
                this.countryDomesticFomat = this.dictionaryData.countryDomestic;
                this.countryInternationalFomat = this.dictionaryData.countryInternational;
                this.countryOptions = this.countryDomesticFomat;
                this.form.countryCurrencyId = this.countryDomesticFomat[0].id;


                this.portIdOptions = this.formatJsonToArray('name', this.dictionaryData.storePorts);


                //全部快递公司默认加载
                this.companiesOptions = this.formatJsonToArray('id', this.dictionaryData.storeLogisCompanies);
                this.checkedCompanies = this.formatJsonToArray('id', this.dictionaryData.storeLogisCompanies);

                if (this.currentRouter == '#/storehouse/update') {
                    const id = this.$route.query['id'];
                    const getInfoStore = await this.ctx.models.store.getInfoStore(id);

                    if (getInfoStore.statusCode == 2000000) {
                        this.form = getInfoStore.data;
                        if(this.form.storeType == '01'){
                            this.countryOptions = this.countryInternationalFomat;
                        }else if(this.form.storeType == '02'){
                            this.countryOptions = this.countryDomesticFomat;
                        }
                        if (this.form.storeLogisCompanies) {
                            this.checkedCompanies = this.formatJsonToArray('logisCompanyId', this.form.storeLogisCompanies);
                            if (this.checkedCompanies.length == this.dictionaryData.storeLogisCompanies.length) {
                                this.checkAll = true;
                                this.isIndeterminate = false;
                            } else {
                                this.checkAll = false;
                                this.isIndeterminate = true;
                            }
                        }

                        if (this.form.storePorts) {
                            this.checkedPortIdOptions = this.formatJsonToArray('portName', this.form.storePorts);
                        }
                        this.$nextTick(() => {
                            this.$refs['form'].validate();
                        });
                    }
                }


            },


            //添加页面，点击保存按钮，提交数据
            saveData: function (formName) {
                const This = this;
                this.form.storePorts = this.formatAppayToJson(this.checkedPortIdOptions, this.dictionaryData.storePorts);
                this.form.storeLogisCompanies = this.formatAppayToJson(this.checkedCompanies, this.dictionaryData.storeLogisCompanies);
                this.deleteAnother();
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        This.addStore(This.form).then(function (res) {
                            if (res.statusCode == '2000000') {
                                This.$router.push({path: '/storehouse/list'});
                            }
                        });

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },

            //获取数据字典
            getGcfsDictionary: function () {
                return this.ctx.models.store.getGcfsDictionary();
            },

            //生成仓库编码
            genStoreCode: function () {
                return this.ctx.models.store.genStoreCode('01');
            },

            updateStore: function () {
                return this.ctx.models.store.updateStore(this.form);
            },

            onSubmit(formName) {
                const This = this;
                if (this.checkedPortIdOptions) {
                    this.form.storePorts = this.formatAppayToJson(this.checkedPortIdOptions, this.dictionaryData.storePorts);
                }
                if (this.checkedCompanies) {
                    this.form.storeLogisCompanies = this.formatAppayToJson(this.checkedCompanies, this.dictionaryData.storeLogisCompanies);
                }
                this.deleteAnother();

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        This.updateStore().then(function (res) {
                            if (res.statusCode == '2000000') {
                                This.$router.push({path: '/storehouse/list'});
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //添加仓库
            addStore: function (params) {
                return this.ctx.models.store.addStore(params);
            },

            //验证仓库名称接口
            validateStoreName: function () {
                return this.ctx.models.store.validateStoreName(this.form);
            },

            cancelAdd: function () {
                this.$router.push({path: '/storehouse/list'});
            },

            jumpToList() {
                this.$router.push({path: '/storehouse/list'});
            },

            //当仓库类型是海外仓或集货仓时，删除支持快递或者所属起运港所带入的参数
            deleteAnother: function () {
                if (this.form.storeType == '01') {
                    delete this.form.storePorts;
                } else if (this.form.storeType == '02') {
                    delete this.form.storeLogisCompanies;
                }
            },

            //对部分表单字段进行校验
            handleValidateClick: function (prop) {
                this.changeCountryFomat(prop);
                if (prop == '02') {
                    this.form.storePorts = this.formatAppayToJson(this.checkedPortIdOptions, this.dictionaryData.storePorts);
                    this.$refs['form'].validateField('storePorts');
                } else if (prop == '01') {
                    this.form.storeLogisCompanies = this.checkedCompanies;
                    this.$refs['form'].validateField('storeLogisCompanies');
                }
            },

            //对快递公司有没有选中进行校验
            handleValidateCompanies: function () {
                this.form.storeLogisCompanies = this.checkedCompanies;
                this.$refs['form'].validateField('storeLogisCompanies');
            },

            //起运港口有没有选中进行校验
            handleValidateStorePorts: function () {
                this.form.storePorts = this.formatAppayToJson(this.checkedPortIdOptions, this.dictionaryData.storePorts);
                this.$refs['form'].validateField('storePorts');
            },

            //监听选择起运港的点击事件
            handleValidateStoreChange: function () {
                this.handleValidateStorePorts();
            },

            //全选按钮点击时的触发事件
            handleCheckAllChange(event) {
                this.checkedCompanies = event.target.checked ? this.companiesOptions : [];
                this.isIndeterminate = false;
                this.form.storeLogisCompanies = this.checkedCompanies;
                this.handleValidateCompanies(this.form.storeLogisCompanies);
            },
            //监听单独选择的点击事件
            handleCheckedCompaniesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.companiesOptions.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.companiesOptions.length;
                this.form.storeLogisCompanies = this.checkedCompanies;
                this.handleValidateCompanies(this.form.storeLogisCompanies);
            },


            //取json中的key值，并组成一个新的数组
            formatJsonToArray: function (item, jsonArr) {
                let _arr = [];
                for (let i = 0; i < jsonArr.length; i++) {
                    _arr.push(jsonArr[i][item]);
                }
                return _arr;
            },

            //把已选择的字符数组转化为包含json的数组
            formatAppayToJson: function (arrDefault, jsonSource) {
                let _arr = [];
                for (let i = 0; i < jsonSource.length; i++) {
                    for (let j = 0; j < arrDefault.length; j++) {
                        if (arrDefault[j] == jsonSource[i].name) {
                            _arr.push({
                                portId: jsonSource[i].id,
                                portName: jsonSource[i].name,
                            });
                        }

                        if (arrDefault[j] == jsonSource[i].id) {
                            _arr.push({
                                logisCompanyId: jsonSource[i].id,
                                logisCompanyAbbr: jsonSource[i].abbreviation,
                            });
                        }
                    }
                }

                return _arr;
            },

            //获取格式化以后的数据
            getItem: function (itemType, itemFormat) {
                for (let i = 0; i < itemFormat.length; i++) {
                    if (itemFormat[i].id == itemType) {
                        itemType = itemFormat[i].name;
                    }
                }

                return itemType;
            },

            //根据起运港id得到对应的名字
            getItemById:function(id){
                const arr = this.dictionaryData.storeLogisCompanies;
                for(let i=0;i<arr.length;i++){
                    if(id == arr[i].id){
                        return arr[i].abbreviation;
                    }
                }
            },


            //根据仓库类型改变所属国家是国内还是国际
            changeCountryFomat:function(storeType){
                if(storeType == '01'){
                    this.countryOptions = this.countryInternationalFomat;
                    delete this.form.countryCurrencyId;
                }else if(storeType == '02'){
                    this.countryOptions = this.countryDomesticFomat;
                    this.form.countryCurrencyId = this.countryDomesticFomat[0].id;
                }
            },

            //校验仓库名称是否存在
            storeNameValidator: function (rule, value, callback) {
                this.validateStoreName().then(function(res){
                    if (res.statusCode == '2000000') {
                        callback();
                    } else if (res.statusCode == '2071009') {
                        callback(new Error());
                    }
                });
            },

        }
    };
</script>


