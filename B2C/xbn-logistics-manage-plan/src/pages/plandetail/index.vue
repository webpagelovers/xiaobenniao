<style lang="less">
    .mT25 {
        margin-top: 25px;
    }

    .competing_infor_main {
        padding: 30px;
    }
</style>

<template>
    <div class="plan-list-container">
        <page-head :title="'物流计划管理'"></page-head>
        <nt-popover style="background: #fff;" ref="delete" placement="bottom" v-model="visible" width="246">
            <div class="bgcfff">
                <div>
                    确定要删除此物流计划?
                </div>
                <div class="popoverBtn">
                    <nt-button type="primary" size="small" @click="deleteCurrentPlan">确定</nt-button>
                    <nt-button size="small" type="primary" @click="visible = false">取消</nt-button>
                </div>
            </div>
        </nt-popover>

        <nt-row class="operationBox " style="margin: 0;">
            <nt-col :span="20" class="f16">
                <i class="nt-icon nt-icon-arrow-left mR5" @click="jumpToList" style="cursor: pointer;"></i>
                <span>物流计划详情</span>
            </nt-col>
            <nt-col :span="4" style="text-align: right;">
                <nt-button type="primary" @click="jumpToUpdate">修改</nt-button>
                <nt-button type="primary" v-popover:delete>删除</nt-button>
            </nt-col>
        </nt-row>


        <nt-form label-width="140px">
            <div class="contentBox">
                <nt-row class="border_layout competing_infor ">
                    <div class="competing_infor_title fb">基础信息</div>
                    <div class="competing_infor_main fix">
                        <nt-row :span="24">
                            <nt-col :span="8" class="form-item-text">
                                <nt-form-item label="物流编码：">
                                    {{form.logisticsCode}}
                                </nt-form-item>
                            </nt-col>
                            <nt-col :span="8" class="form-item-text">
                                <nt-form-item label="物流方式：">
                                    {{form.logisticsType}}
                                </nt-form-item>
                            </nt-col>
                            <nt-col :span="8" class="form-item-text">
                                <nt-form-item label="起运港：">
                                    {{form.disposalSite}}
                                </nt-form-item>
                            </nt-col>
                        </nt-row>
                        <nt-row :span="24">
                            <nt-col :span="8" class="form-item-text">
                                <nt-form-item label="目的港口：">
                                    {{form.targetPort}}
                                </nt-form-item>
                            </nt-col>
                            <nt-col :span="8" class="form-item-text">
                                <nt-form-item label="始发站：">
                                    {{form.startStation}}
                                </nt-form-item>
                            </nt-col>
                            <nt-col :span="8" class="form-item-text">
                                <nt-form-item label="终点站：">
                                    {{form.lastStation}}
                                </nt-form-item>
                            </nt-col>
                        </nt-row>
                        <nt-row :span="24">
                            <nt-col :span="8" class="form-item-text">
                                <nt-form-item label="截止下单时间：">
                                    {{form.sendTimeLimit}}
                                </nt-form-item>
                            </nt-col>
                            <nt-col :span="8" class="form-item-text">
                                <nt-form-item label="截止收货时间：">
                                    {{form.receiveTimeLimit}}
                                </nt-form-item>
                            </nt-col>
                            <nt-col :span="8" class="form-item-text">
                                <nt-form-item label="资料提交截止时间：">
                                    {{form.cutTheTime}}
                                </nt-form-item>
                            </nt-col>
                        </nt-row>

                        <nt-col :span="8" class="form-item-text">
                            <nt-form-item label="预计到港日期：">
                                {{form.expectedArrivalDate}}
                            </nt-form-item>
                        </nt-col>

                        <div v-model="storeAddress">
                            <nt-col :span="8" class="form-item-text" v-for="(item,index) in storeAddress"
                                    :key="item.indexString">
                                <nt-form-item :label="item.indexString">
                                    <nt-col :span="20">
                                        {{item.address}}
                                    </nt-col>
                                </nt-form-item>
                            </nt-col>
                        </div>
                    </div>
                </nt-row>
                <nt-row class="competing_infor mT25">
                    <div class="competing_infor_title fb">修改记录</div>
                    <div class="competing_infor_main fix">
                        <nt-row :span="24">
                            <nt-col :span="8" class="form-item-text">
                                <nt-form-item label="创建时间：">
                                    {{form.createTime}}
                                </nt-form-item>
                            </nt-col>
                            <nt-col :span="8" class="form-item-text">
                                <nt-form-item label="创建人：">
                                    {{form.createUser}}
                                </nt-form-item>
                            </nt-col>
                            <nt-col :span="8" class="form-item-text">
                                <nt-form-item label="最后修改时间：">
                                    {{form.lastUpdateTime}}
                                </nt-form-item>
                            </nt-col>
                        </nt-row>
                        <nt-row>
                        <nt-col :span="8" class="form-item-text">
                            <nt-form-item label="最后修改人：">
                                {{form.lastUpdateUser}}
                            </nt-form-item>
                        </nt-col>
                        </nt-row>
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
                //物流计划是否被使用
                used: false,
                form: {},
                logisticsTypeFormat: [],
                disposalSiteFormat: [],
                targetPortFormat: [],
                storeAddress: []
            };
        },

        created: async function () {

            const dictionary = await this.ctx.models.plans.getGcfsDictionary();
            this.logisticsTypeFormat = dictionary.logisticsType;
            this.disposalSiteFormat = dictionary.disposalSite;
            this.targetPortFormat = dictionary.targetPort;

            const id = this.$route.query['id'];
            const getInfoPlan = await this.ctx.models.plans.getInfoPlan(id);
            if (getInfoPlan.statusCode == 2000000) {
                this.form = getInfoPlan.data;
                this.getStoreByPortId();
                this.form.logisticsType = this.getItem(this.form.logisticsType, this.logisticsTypeFormat);
                this.form.disposalSite = this.getItem(this.form.disposalSite, this.disposalSiteFormat);
                this.form.targetPort = this.getItem(this.form.targetPort, this.targetPortFormat);
                this.form.sendTimeLimit = this.spliceDateFun(this.form.sendTimeLimit);
                this.form.receiveTimeLimit = this.spliceDateFun(this.form.receiveTimeLimit);
                this.form.cutTheTime = this.spliceDateFun(this.form.cutTheTime);
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
                const getInfoPlan = await this.ctx.models.plans.getInfoPlan(id);
                return getInfoPlan;
            },

            jumpToUpdate() {
                const id = this.$route.query['id'];
                this.$router.push({path: '/plan/update?id=' + id});
            },

            jumpToList() {
                this.$router.push({path: '/plan/list'});
            },

            deleteCurrentPlan: async function (index, row) {
                try {
                    const id = this.$route.query['id'];
                    const res = await this.ctx.models.plans.deletePlan(id);
                    if (res.statusCode === '2000000') {
                        this.$router.push({path: '/plan/list'});
                    }
                } catch (err) {
                    //交给框架处理的异常
                    this.visible = false;
                    this.$notify.error({
                        title: '',
                        message: '物流计划已被占用，无法删除'
                    });
                }
            },

            //根据处理地点获取仓库
            getStoreByPortId: function () {
                const This = this;
                this.ctx.models.plans.getStoreByPortId(this.form.disposalSite).then(function (res) {
                    This.storeAddress = res.data;
                    for (let i = 0; i < This.storeAddress.length; i++) {
                        if (This.storeAddress.length > 1) {
                            This.storeAddress[i].indexString = '集货仓地址' + (i + 1) + '：';
                        } else {

                            This.storeAddress[i].indexString = '集货仓地址：';
                        }
                    }
                });
            }
        }
    };
</script>


