<style lang="less">
    .mT25 {
        margin-top: 25px;
    }

</style>

<template>
    <div class="plan-list-container">
        <page-head :title="'仓库管理'"></page-head>
        <nt-popover style="background: #fff;" ref="delete" placement="bottom" v-model="visible" width="246">
            <div class="bgcfff">
                <div>
                    确定要删除此仓库信息?
                </div>
                <div class="popoverBtn">
                    <nt-button type="primary" size="small" @click="deleteCurrentStore">确定</nt-button>
                    <nt-button size="small" type="primary" @click="visible = false">取消</nt-button>
                </div>
            </div>
        </nt-popover>

        <nt-row class="operationBox " style="margin: 0;">
            <nt-col :span="20" class="f16">
                <i class="nt-icon nt-icon-arrow-left curpointer" @click="jumpToList"></i>仓库详情
            </nt-col>
            <nt-col :span="4" style="text-align: right;">
                <nt-button type="primary" @click="jumpToUpdate">修改</nt-button>
                <nt-button type="primary" v-popover:delete>删除</nt-button>
            </nt-col>
        </nt-row>


        <nt-form label-width="138px">
            <div class="contentBox">
                <nt-row class="border_layout competing_infor ">
                    <div class="competing_infor_title fb">仓库信息</div>
                    <div class="competing_infor_xbox fix">
                        <nt-row :span="24">
                        <nt-col :span="8" class="form-item-text">
                            <nt-form-item label="仓库编码：">
                                {{form.storeCode}}
                            </nt-form-item>
                        </nt-col>
                        <nt-col :span="8" class="form-item-text">
                            <nt-form-item label="仓库类型：">
                                {{form.storeType}}
                            </nt-form-item>
                        </nt-col>
                        <nt-col :span="8" class="form-item-text">
                            <nt-form-item label="所属国家：">
                                {{form.countryCurrencyId}}
                            </nt-form-item>
                        </nt-col>
                        </nt-row>
                        <nt-row :span="24">
                        <nt-col :span="8" class="form-item-text">
                            <nt-form-item label="详细地址：">
                                <p class="break lh22" style="margin-top: -4px;">
                                    {{form.address}}
                                </p>
                            </nt-form-item>
                        </nt-col>
                        <nt-col :span="8" class="form-item-text" v-if="form.storeLogisCompanies">
                            <nt-form-item label="支持快递：">
                                <p class="break lh22" style="margin-top: -4px;">
                                    {{form.storeLogisCompanies}}
                                </p>
                            </nt-form-item>
                        </nt-col>
                        <nt-col :span="8" class="form-item-text" v-if="form.storePorts">
                            <nt-form-item label="所属起运港：">
                                <p class="break lh22" style="margin-top: -4px;">
                                    {{form.storePorts}}
                                </p>
                            </nt-form-item>
                        </nt-col>
                        </nt-row>
                        <nt-row>
                        <nt-col :span="8" class="form-item-text">
                            <nt-form-item label="仓库名称：">
                                <p class="break lh22" style="margin-top: -4px;">
                                    {{form.storeName}}
                                </p>
                            </nt-form-item>
                        </nt-col>
                        </nt-row>
                    </div>
                </nt-row>
                <nt-row class="competing_infor mT25">
                    <div class="competing_infor_title fb">仓库联系人信息</div>
                    <div class="competing_infor_xbox fix">
                        <nt-col :span="8" class="form-item-text">
                            <nt-form-item label="仓库收货人：">
                                <p class="break lh22" style="margin-top: -4px;">
                                    {{form.consignee}}
                                </p>
                            </nt-form-item>
                        </nt-col>
                        <nt-col :span="8" class="form-item-text">
                            <nt-form-item label="公司名称：">
                                <p class="break lh22" style="margin-top: -4px;">
                                    {{form.componyName}}
                                </p>
                            </nt-form-item>
                        </nt-col>
                        <nt-col :span="8" class="form-item-text">
                            <nt-form-item label="联系电话：">
                                {{form.phonenumber}}
                            </nt-form-item>
                        </nt-col>
                    </div>
                </nt-row>
                <nt-row class="competing_infor mT25">
                    <div class="competing_infor_title fb">操作信息</div>
                    <div class="competing_infor_xbox fix">
                        <nt-col :span="8" class="form-item-text">
                            <nt-form-item label="创建人：">
                                {{form.createUser}}
                            </nt-form-item>
                        </nt-col>
                        <nt-col :span="8" class="form-item-text">
                            <nt-form-item label="最后一次修改人：">
                                {{form.lastUpdateUser}}
                            </nt-form-item>
                        </nt-col>
                        <nt-col :span="8" class="form-item-text">
                            <nt-form-item label="创建时间：">
                                {{form.createTime}}
                            </nt-form-item>
                        </nt-col>
                        <nt-col :span="8" class="form-item-text">
                            <nt-form-item label="最后一次修改时间：">
                                {{form.lastUpdateTime}}
                            </nt-form-item>
                        </nt-col>
                    </div>
                </nt-row>
            </div>
        </nt-form>
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
                visible: false,
                form: {},
                storeTypeFormat: [{label: '海外仓', id: '01'}, {label: '集货仓', id: '02'}],
                countryCurrencyIdFormat: []
            };
        },

        created: async function () {

            const dictionary = await this.ctx.models.store.getGcfsDictionary();
            this.countryCurrencyIdFormat = dictionary.country;

            const id = this.$route.query['id'];
            const getInfoStore = await this.ctx.models.store.getInfoStore(id);
            if (getInfoStore.statusCode == 2000000) {
                this.form = getInfoStore.data;
                this.form.storeType = this.getItem(this.form.storeType, this.storeTypeFormat);
                this.form.countryCurrencyId = this.getItem(this.form.countryCurrencyId, this.countryCurrencyIdFormat);
                this.form.createTime = this.spliceDateFun(this.form.createTime);
                this.form.lastUpdateTime = this.spliceDateFun(this.form.lastUpdateTime);
                if (this.form.storePorts) {
                    this.form.storePorts = this.storePortsToString();
                }
                if (this.form.storeLogisCompanies) {
                    this.form.storeLogisCompanies = this.companiesToString();
                }

            }
        },

        methods: {

            //截取秒
            spliceDateFun(data) {
                let date = null;
                if (data && data.match(/^\d{4}(\-\d{2}){2}\s+\d{2}\:\d{2}/)) {
                    date = data.match(/^\d{4}(\-\d{2}){2}\s+\d{2}\:\d{2}/)[0];
                } else {
                    date = null;
                }
                return date;
            },

            //格式化仓库类型
            changeST(row) {
                row.storeType = this.getItem(row.storeType, this.storeTypeFormat);
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
            getInfo: async function (id) {
                return await this.ctx.models.plans.getInfoPlan(id);
            },

            //所属起运港格式化成字符串
            storePortsToString: function () {
                let _arr = [];

                for (let i = 0; i < this.form.storePorts.length; i++) {
                    _arr.push(this.form.storePorts[i].portName);
                }
                return _arr.join();
            },

            //快递公司格式化成字符串
            companiesToString: function () {
                let _arr = [];

                for (let i = 0; i < this.form.storeLogisCompanies.length; i++) {
                    _arr.push(this.form.storeLogisCompanies[i].logisCompanyAbbr);
                }
                return _arr.join();
            },


            jumpToUpdate() {
                const id = this.$route.query['id'];
                this.$router.push({path: '/storehouse/update?id=' + id});
            },

            jumpToList() {
                this.$router.push({path: '/storehouse/list'});
            },

            deleteCurrentStore: async function () {

                try {
                    const id = this.$route.query['id'];
                    const res = await this.ctx.models.store.deleteStore(id)
                    if (res.statusCode === '2000000') {
                        this.$router.push({path: '/storehouse/list'});
                    }
                } catch (err) {
                    //交给框架处理的异常
                    this.visible = false;
                    this.$notify.error({
                        title: '',
                        message: '仓库已被占用，无法删除'
                    });
                }

            }
        }
    };
</script>


