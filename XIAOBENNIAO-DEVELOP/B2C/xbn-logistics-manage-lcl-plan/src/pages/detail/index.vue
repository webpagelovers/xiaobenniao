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
    <div class="plan-list-container">
        <page-head :title="'拼箱计划'"></page-head>
        <nt-row class="operationBox " style="margin: 0;">
            <nt-col :span="4" class="f16">
                <i class="nt-icon nt-icon-arrow-left curpointer" @click="jumpList"></i>
                <span>拼箱计划详情</span>
            </nt-col>
            <nt-col :span="20" style="text-align: right;">
                <nt-button type="primary" @click="jumpUpdate('',{id:id})" v-if="form.status == 1">编辑</nt-button>
                <nt-button type="primary" @click="jumpApt('',{id:id})" v-if="form.status == 1">指派</nt-button>
                <nt-button type="primary" @click="jumpList" v-if="form.status == 1">取消</nt-button>
                <nt-button type="primary" @click="jumpList" v-else>返回</nt-button>
            </nt-col>
        </nt-row>
        <nt-form :model="form" ref="form" label-width="125px">
            <div class="contentBox">
                <nt-row class="border_layout competing_infor ">
                    <div class="competing_infor_title fb">拼箱计划</div>
                    <div class="competing_infor_xbox fix">
                        <nt-col :span="24" class="form-item-text">
                            <nt-form-item label="拼箱计划编码：">
                                {{form.planCode}}
                            </nt-form-item>
                        </nt-col>
                        <nt-col :span="24" class="form-item-text">
                            <nt-form-item label="货柜编码：">
                                {{form.containerCode}}
                            </nt-form-item>
                        </nt-col>
                        <nt-col :span="24" class="form-item-text" v-if="form.storeName">
                            <nt-form-item label="集货仓：">
                                {{form.storeName}}
                            </nt-form-item>
                        </nt-col>
                    </div>
                </nt-row>
                <nt-row class=" competing_infor mT25">
                    <div class="competing_infor_title fb">箱子信息</div>
                    <div class="competing_infor_main fix">
                        <nt-row v-if="form.boxs[0]">
                            <div class="padT_padB16 pL11">
                                <div class="inline_block mR32 ver-top"
                                     style="margin-left: 33px;display: table-cell;padding: 0 30px;">总箱数： {{form.boxAmount}}
                                </div>
                                <div class="inline_block mR32 ver-top" style="display: table-cell;padding: 0 30px;">
                                    实测总体积： {{form.volume}}
                                    <span>m³</span>
                                </div>
                                <div class="inline_block mR32 ver-top" style="display: table-cell;padding: 0 30px;">
                                    实测总重量： {{form.weight}}
                                    <span>kg</span>
                                </div>
                            </div>
                        </nt-row>
                        <nt-row>
                            <nt-table :data="form.boxs" class="dialog_table">
                                <nt-table-column width="11"></nt-table-column>
                                <nt-table-column prop="boxOrderCode" label="箱单号"></nt-table-column>
                                <nt-table-column prop="volumet" label="体积(cm)">
                                    <template slot-scope="scope">
                                        {{scope.row.volumet}}
                                    </template>
                                </nt-table-column>
                                <nt-table-column prop="weight" label="重量(kg)">
                                    <template slot-scope="scope">
                                        {{scope.row.weight}}
                                    </template>
                                </nt-table-column>
                                <nt-table-column prop="forecastCode" label="收货预报编码"></nt-table-column>
                            </nt-table>
                        </nt-row>
                    </div>
                </nt-row>
            </div>
        </nt-form>
    </div>
</template>

<script>
    import {PageHead} from 'xbn-biz-components';
    import commonMixin from '../common.js';

    export default {
        mixins: [commonMixin],
        components: {
            PageHead
        },
        data() {
            return {
                id: this.$route.query['id'],
                storeList: [],
                form: {
                    storeId: null,
                    boxs:[]
                }
            };
        },

        created: async function () {

            const id = this.id;
            const getInfo = await this.ctx.models.lclplan.getInfo(id);
            this.form = getInfo.data;



        },

        methods: {
        },
    };
</script>


