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
        <page-head :title="'物流计划管理'"></page-head>
        <nt-row class="operationBox">
            <nt-col :span="20" class="f16">
                <i class="nt-icon nt-icon-arrow-left" @click="jumpToList" style="cursor: pointer;"></i>
                <span v-if="currentRouter == addUrlHash">新增物流计划</span>
                <span v-if="currentRouter == updateUrlHash">修改物流计划</span>
            </nt-col>
            <nt-col :span="4" style="text-align: right;">
                <nt-button type="primary" @click="saveData('form')" v-if="currentRouter == addUrlHash">保存</nt-button>
                <nt-button type="primary" @click="onSubmit('form')" v-if="currentRouter == updateUrlHash">保存</nt-button>
                <nt-button type="primary" @click="cancelAdd">取消</nt-button>
            </nt-col>
        </nt-row>


        <div class="contentBox">
            <div class="border_layout competing_infor">
                <div class="competing_infor_title fb" v-if="currentRouter == addUrlHash">新增物流计划</div>
                <div class="competing_infor_title fb" v-if="currentRouter == updateUrlHash">修改物流计划</div>

                <div class="log_main">
                    <nt-form :model="form" :rules="rules" ref="form" label-width="180px">
                        <nt-form-item label="物流编码：" prop="logisticsCode">
                            <nt-col :span="3">
                                <nt-input v-model="form.logisticsCode" :maxlength="20" class="w240"></nt-input>
                            </nt-col>
                        </nt-form-item>
                        <nt-form-item label="物流方式：" prop="logisticsType">
                            <nt-select v-model="form.logisticsType" placeholder="" class="w240">
                                <nt-option v-for="item in logisticsTypeFormat" :label="item.logisticsType"
                                           :key="item.logisticsType"
                                           :value="item.id"></nt-option>
                            </nt-select>
                        </nt-form-item>
                        <nt-form-item label="起运港：" prop="disposalSite">
                            <nt-select v-model="form.disposalSite" placeholder="" class="w240"
                                       @change="getStoreByPortId">
                                <nt-option v-for="item in disposalSiteFormat" :label="item.name"
                                           :key="item.name"
                                           :value="item.id"></nt-option>
                            </nt-select>
                        </nt-form-item>
                        <nt-form-item label="目的港口：" prop="targetPort">
                            <nt-select v-model="form.targetPort" placeholder="" class="w240"
                                       @change="getLastStationByPort">
                                <nt-option v-for="item in targetPortFormat" :label="item.name"
                                           :key="item.name"
                                           :value="item.id"></nt-option>
                            </nt-select>
                            <!--<nt-select v-model="form.targetPort" placeholder="" class="w240" v-if="currentRouter == updateUrlHash">
                                <nt-option v-for="item in targetPortFormat" :label="item.name" :value="parseInt(item.id)"></nt-option>
                            </nt-select>-->
                        </nt-form-item>
                        <nt-form-item label="始发站：" prop="startStation">
                            <nt-col :span="3">
                                <nt-input v-model="form.startStation" class="w240" disabled></nt-input>
                            </nt-col>
                        </nt-form-item>
                        <nt-form-item label="终点站：" prop="lastStation">
                            <nt-col :span="3">
                                <nt-input v-model="form.lastStation" class="w240" disabled></nt-input>
                                <!--<nt-input v-model="form.lastStation" class="w240" v-if="currentRouter == updateUrlHash"></nt-input>-->
                            </nt-col>
                        </nt-form-item>
                        <nt-form-item label="截止下单时间：" prop="sendTimeLimit">
                            <nt-date-picker
                                    v-model="form.sendTimeLimit"
                                    type="datetime"
                                    placeholder=""
                                    format="yyyy-MM-dd HH:mm"
                                    @change="formatteSendTimeLimit"
                                    :picker-options="pickerOptions0" class="w240">
                            </nt-date-picker>
                        </nt-form-item>
                        <nt-form-item label="截止收货时间：" prop="receiveTimeLimit">
                            <nt-date-picker
                                    v-model="form.receiveTimeLimit"
                                    type="datetime"
                                    placeholder=""
                                    format="yyyy-MM-dd HH:mm"
                                    @change="formatteReceiveTimeLimit"
                                    :picker-options="pickerOptions0">
                            </nt-date-picker>
                        </nt-form-item>
                        <nt-form-item label="资料提交截止时间：" prop="cutTheTime">
                            <nt-date-picker
                                    v-model="form.cutTheTime"
                                    type="datetime"
                                    placeholder=""
                                    format="yyyy-MM-dd HH:mm"
                                    @change="formatteCutTheTime"
                                    :picker-options="pickerOptions0">
                            </nt-date-picker>
                        </nt-form-item>
                        <nt-form-item label="预计到港日期：" prop="expectedArrivalDate">
                            <nt-date-picker
                                    v-model="form.expectedArrivalDate"
                                    type="date"
                                    placeholder=""
                                    format="yyyy-MM-dd"
                                    @change="formatteExpectedArrivalDate"
                                    :picker-options="pickerOptions0">
                            </nt-date-picker>
                        </nt-form-item>

                        <div v-model="storeAddress">
                            <nt-form-item v-for="(item,index) in storeAddress" :label="item.indexString"
                                          :key="item.indexString">
                                <nt-col :span="3">
                                    {{item.address}}
                                </nt-col>
                            </nt-form-item>
                        </div>

                    </nt-form>
                </div>
            </div>
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
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                value1: '',
                form: {
                    logisticsCode: '',
                    logisticsType: '',
                    disposalSite: '',
                    targetPort: '',
                    startStation: 'CH',
                    lastStation: '',
                    sendTimeLimit: '',
                    receiveTimeLimit: '',
                    cutTheTime: '',
                    expectedArrivalDate: ''
                },
                rules: {
                    logisticsCode: [
                        {required: true, message: '请输入物流编码', trigger: 'blur'},
                        {max: 20, message: '物流编码最多20个字符'},
                        {validator: this.logisticsCodeValidator, message: '物流编码必须以英文字母与数字组成'},
                        {validator: this.logisticsCodeExistValidator, message: '物流编码已存在'}
                    ],
                    logisticsType: [
                        {required: true, message: '请选择物流方式', trigger: 'change'}
                    ],
                    disposalSite: [
                        {required: true, message: '请选择起运港', trigger: 'change'}
                    ],
                    targetPort: [
                        {required: true, message: '请选择目的港口', trigger: 'change'}
                    ],
                    startStation: [
                        {required: true, message: '请输入始发站', trigger: 'blur'},
                        {validator: this.stationValidator, message: '始发站必须是必须是2-3位英文字母，显示大写'}
                    ],
                    lastStation: [
                        {required: true, message: '请输入终点站', trigger: 'blur'},
                        {validator: this.stationValidator, message: '终点站必须是必须是2-3位英文字母，显示大写'}
                    ],
                    sendTimeLimit: [
                        {required: true, message: '请选择截止下单时间', trigger: 'change'}
                    ],
                    receiveTimeLimit: [
                        {required: true, message: '请选择截止收货时间', trigger: 'change'},
                        {validator: this.receiveTimeLimitValidator, message: '截止收货时间必须大于截止下单时间'}
                    ],
                    cutTheTime: [
                        {required: true, message: '请选择截单时间', trigger: 'change'},
                        {validator: this.cutTheTimeValidator, message: '截单时间必须大于截止下单时间'}
                    ],
                    expectedArrivalDate: [
                        {required: true, message: '请选择预计到货期', trigger: 'change'},
                        {validator: this.expectedArrivalDateValidator, message: '预计到货期要大于截止收货时间', trigger: 'change'}
                    ],

                    storeAddress: [
                        {required: true, message: '请选择预计到货期', trigger: 'change'},
                    ]
                },

                logisticsTypeFormat: [],
                disposalSiteFormat: [],
                targetPortFormat: [],
                currentRouter: location.hash.split('?')[0],
                addUrlHash: '#/plan/add',
                updateUrlHash: '#/plan/update',
                storeAddress: []
            };
        },
        created: async function () {
            await this.loadPage();
        },

        methods: {
            async loadPage() {
                const This = this;
                const id = this.$route.query['id'];
                const res = await this.getGcfsDictionary();

                This.logisticsTypeFormat = res.logisticsType;
                This.disposalSiteFormat = res.disposalSite;
                This.targetPortFormat = res.targetPort;

                if (this.currentRouter == '#/plan/update') {
                    const getInfoPlan = await this.ctx.models.plans.getInfoPlan(id);
                    if (getInfoPlan.statusCode == 2000000) {
                        this.form = getInfoPlan.data;
                        this.$nextTick(() => {
                            this.$refs['form'].validate();
                        });
                    }
                }

            },

            saveData: function (formName) {
                const This = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.queryPlans(this.form).then(function (res) {
                            if (res.statusCode == '2000000') {
                                This.$router.push({path: '/plan/list'});
                            }
                        });

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },

            updatePlan: function () {
                const update = this.ctx.models.plans.updatePlan(this.form);
                return update;
            },

            onSubmit(formName) {
                const This = this;
                this.$refs[formName].validate((valid) => {

                    if (valid) {

                        This.updatePlan().then(function (res) {
                            if (res.statusCode == '2000000') {
                                This.$router.push({path: '/plan/list'});
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            queryPlans: async function (params) {
                const addPlan = await this.ctx.models.plans.addPlan(params);
                return addPlan;
            },

            getInfo: async function (id) {
                const getInfoPlan = await this.ctx.models.plans.getInfoPlan(id);
                return getInfoPlan;
            },

            //验证物流编码接口
            validatePlanCode: function () {
                return this.ctx.models.plans.validatePlanCode(this.form);
            },

            //根据目的港口获取终点站
            getLastStationByPort: function (portId) {
                const This = this;
                this.ctx.models.plans.getLastStationByPort(portId).then(function (res) {
                    This.form.lastStation = res.data;
                    This.$refs['form'].validateField('lastStation');
                });

            },

            //根据处理地点获取仓库
            getStoreByPortId: function () {
                const This = this;
                this.ctx.models.plans.getStoreByPortId(This.form.disposalSite).then(function (res) {
                    This.storeAddress = res.data;
                    for (let i = 0; i < This.storeAddress.length; i++) {
                        if (This.storeAddress.length > 1) {
                            This.storeAddress[i].indexString = '集货仓地址' + (i + 1) + '：';
                        } else {

                            This.storeAddress[i].indexString = '集货仓地址：';
                        }
                    }

                });
            },

            //获取字典
            getGcfsDictionary: async function () {
                const dictionary = await this.ctx.models.plans.getGcfsDictionary();
                return dictionary;
            },

            cancelAdd: function () {
                this.$router.push({path: '/plan/list'});
            },

            formatteSendTimeLimit: function (format) {
                this.form.sendTimeLimit = format;
            },

            formatteReceiveTimeLimit: function (format) {
                this.form.receiveTimeLimit = format;
            },

            formatteCutTheTime: function (format) {
                this.form.cutTheTime = format;
            },

            formatteExpectedArrivalDate: function (format) {
                this.form.expectedArrivalDate = format;
            },

            //校验物流编码长度是否大于多少字符
            logisticsCodeMaxLenValidator: function (rule, value, callback) {
                if (value.length > 20) {
                    callback(new Error());
                } else {
                    callback();
                }
            },


            logisticsCodeValidator: function (rule, value, callback) {
                const logisticsCode = value.match(/^[A-Za-z0-9]+$/);
                if (logisticsCode && logisticsCode[0]) {
                    callback();
                } else {

                    callback(new Error());
                }
            },

            //校验物流编码是否存在
            logisticsCodeExistValidator: function (rule, value, callback) {
                this.validatePlanCode().then(function(res){
                    if (res.statusCode == '2000000') {
                        callback();
                    } else if (res.statusCode == '2070203') {
                        callback(new Error());
                    }
                });
            },

            receiveTimeLimitValidator: function (rule, value, callback) {

                const receiveTime = Date.parse(new Date(value))
                const sendTimeLimit = Date.parse(new Date(this.form.sendTimeLimit));

                if (receiveTime <= sendTimeLimit) {
                    callback(new Error());
                } else {
                    callback();
                }

            },

            cutTheTimeValidator: function (rule, value, callback) {

                const cutTheTime = Date.parse(new Date(value))
                const sendTimeLimit = Date.parse(new Date(this.form.sendTimeLimit));

                if (cutTheTime <= sendTimeLimit) {
                    callback(new Error());
                } else {
                    callback();
                }

            },

            expectedArrivalDateValidator: function (rule, value, callback) {

                const expectedArrivalDate = Date.parse(new Date(value));
                const receiveTime = Date.parse(new Date(this.form.receiveTimeLimit));

                if (expectedArrivalDate <= receiveTime) {
                    callback(new Error());
                } else {
                    callback();
                }

            },

            stationValidator: function (rule, value, callback) {

                const station = value.match(/^[A-Z]{2,3}$/);
                if (station && station[0]) {
                    callback();
                } else {
                    callback(new Error());
                }

            },

            jumpToList() {
                this.$router.push({path: '/plan/list'});
            },

        }
    };
</script>


