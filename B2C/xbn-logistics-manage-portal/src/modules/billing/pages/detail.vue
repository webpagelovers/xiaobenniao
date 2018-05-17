<style lang="less">
    .mR15 {
        margin-right: 15px;
    }

    .mR30 {
        margin-right: 30px;
    }

    .min_width {
        min-width: 160px;
    }

    .validate_x {
        color: #fe5655;
        margin-right: 4px;
    }
</style>

<template>
    <div class="plan-list-container">
        <page-head :title="'开票厂商管理'"></page-head>
        <nt-dialog :title="dialogBigImgTitle" :visible.sync="dialogBigImgVisible" size="tiny"
                   :close-on-click-modal="false">
            <img :src="dialogBigImgSrc" alt="" style="width: 100%;height: 100%;max-width: 100%;max-height: 100%;">
        </nt-dialog>
        <nt-row class="operationBox " style="margin: 0;">
            <nt-col :span="4" class="f16">
                <i class="nt-icon nt-icon-arrow-left curpointer mR5" @click="jumpList"></i><span>开票厂商详情</span>
            </nt-col>
            <nt-col :span="20" style="text-align: right;">
                <nt-popover style="background: #fff;" ref="delete" placement="bottom"
                            v-if="form.billingCompanyStatus === 1"
                            width="246">
                    <div class="bgcfff">
                        <div>
                            您确定删除此开票厂商吗？
                        </div>
                        <div class="popoverBtn">
                            <nt-button type="primary" size="small"
                                       @click="handleDeleteCurrent">确定
                            </nt-button>
                            <nt-button size="small" type="primary" @click="closeDeleteSmall">取消
                            </nt-button>
                        </div>
                    </div>
                </nt-popover>

                <nt-button type="primary"
                           @click="handleCertifiedPass"
                           v-if="form.billingCompanyStatus === 1">
                    认证
                </nt-button>
                <nt-button type="primary" @click="handleCancelCertified"
                           v-if="form.billingCompanyStatus === 2">
                    取消认证
                </nt-button>
                <nt-button type="primary" @click="jumpUpdate(null,{id:id})"
                           v-if="form.billingCompanyStatus === 1">
                    修改
                </nt-button>
                <nt-button type="primary"
                           v-popover:delete
                           v-if="form.billingCompanyStatus === 1">删除
                </nt-button>
                <nt-button type="primary" @click="jumpList">返回</nt-button>
            </nt-col>
        </nt-row>
        <nt-form label-width="165px">
            <div class="contentBox">
                <nt-row class="border_layout competing_infor ">
                    <div class="competing_infor_title fb">开票厂商基本信息</div>
                    <div class="competing_infor_main fix">
                        <nt-row :span="24">
                            <nt-col :span="8" class="form-item-text break">
                                <nt-form-item label="开票厂商名称：">
                                    {{form.billingCompanyName}}
                                </nt-form-item>
                            </nt-col>
                            <nt-col :span="8" class="form-item-text break">
                                <nt-form-item label="统一社会信用代码：">
                                    {{form.uniformSocialCreditCode}}
                                </nt-form-item>
                            </nt-col>
                            <nt-col :span="8" class="form-item-text break">
                                <nt-form-item label="一般纳税人认定时间：">
                                    {{form.generalTaxpayerDetermineTime}}
                                </nt-form-item>
                            </nt-col>
                        </nt-row>
                        <nt-row :span="24">
                            <nt-col :span="8" class="form-item-text break">
                                <nt-form-item label="开票厂商地址：">
                                    {{form.companyAddress}}
                                </nt-form-item>
                            </nt-col>
                            <nt-col :span="8" class="form-item-text break">
                                <nt-form-item label="境内货源地：">
                                    {{form.domesticGoodsAddress}}
                                </nt-form-item>
                            </nt-col>
                            <nt-col :span="8" class="form-item-text break">
                                <nt-form-item label="开票厂商增值税率：">
                                    {{form.vatRate}}
                                </nt-form-item>
                            </nt-col>
                        </nt-row>
                        <nt-row :span="24">
                            <nt-col :span="8" class="form-item-text break">
                                <nt-form-item label="出口权：">
                                    <span v-if="form.exportRights === 0">无</span>
                                    <span v-if="form.exportRights === 1">有</span>
                                </nt-form-item>
                            </nt-col>
                            <nt-col :span="8" class="form-item-text break" v-if="form.customeRegistrationCode && form.exportRights === 1">
                                <nt-form-item label="海关注册登记编码：">
                                    {{form.customeRegistrationCode}}
                                </nt-form-item>
                            </nt-col>
                            <nt-col :span="8" class="form-item-text break" v-if="form.organizationCode && form.exportRights === 0">
                                <nt-form-item label="组织机构代码：">
                                    {{form.organizationCode}}
                                </nt-form-item>
                            </nt-col>
                        </nt-row>
                    </div>
                </nt-row>
                <nt-row class="competing_infor mT25">
                    <div class="competing_infor_title fb">证照信息</div>
                    <div class="competing_infor_main fix">
                        <div>
                            <!--
                            1 税务登记证照副本
                            2 营业执照照片
                            3 一般纳税人认定书照片
                            4 进行发票照片
                            5 厂牌照片
                            6 生产线照片
                            7 厂房租赁合同（或房产证）
                            8 纳税申报表
                            9 纳税信用等级
                            10 仓库照片
                            11 其他
                            -->
                            <div class="mT16">
                                <div class="inline_block mR30 min_width" v-if="form.imgPath1 !== ''">
                                    <p>税务登记副本</p>
                                    <div>
                                        <img :src="form.imgPath1"
                                             @click="handleSmallImgClick({businessType: '税务登记副本', fileUrl: form.imgPath1})"
                                             width="78" height="78"
                                             class="mT16 border_outer"
                                             alt="">
                                    </div>
                                </div>
                                <div class="inline_block mR30 min_width" v-if="form.imgPath2 !== ''">
                                    <p>营业执照</p>
                                    <div>
                                        <img :src="form.imgPath2"
                                             @click="handleSmallImgClick({businessType: '营业执照', fileUrl: form.imgPath2})"
                                             width="78" height="78"
                                             class="mT16 border_outer"
                                             alt="">
                                    </div>
                                </div>
                                <div class="inline_block mR30 min_width" v-if="form.imgPath3 !== ''">
                                    <p>一般纳税人认定书</p>
                                    <div>
                                        <img :src="form.imgPath3"
                                             @click="handleSmallImgClick({businessType:'一般纳税人认定书', fileUrl: form.imgPath3})"
                                             width="78" height="78"
                                             class="mT16 border_outer"
                                             alt="">
                                    </div>
                                </div>
                            </div>
                            <div class="mT16">
                                <div class="inline_block mR30 min_width" v-if="form.imgPath4[0]">
                                    <p>进项发票</p>
                                    <div>
                                        <span v-for="item in form.imgPath4" class="mR15">
                                            <img :src="item.url"
                                                 @click="handleSmallImgClick({businessType: '进项发票', fileUrl: item.url})"
                                                 width="78" height="78"
                                                 class="mT16 border_outer"
                                                 alt="">
                                        </span>
                                    </div>
                                </div>
                                <div class="inline_block mR30 min_width" v-if="form.imgPath5[0]">
                                    <p>厂牌照片</p>
                                    <div>
                                        <span v-for="item in form.imgPath5" class="mR15">
                                            <img :src="item.url"
                                                 @click="handleSmallImgClick({businessType: '厂牌照片', fileUrl: item.url})"
                                                 width="78" height="78"
                                                 class="mT16 border_outer"
                                                 alt="">
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="mT16">
                                <div class="inline_block mR30 min_width" v-if="form.imgPath6[0]">
                                    <p>生产线照片</p>
                                    <div>
                                        <span v-for="item in form.imgPath6" class="mR15">
                                            <img :src="item.url"
                                                 @click="handleSmallImgClick({businessType: '生产线照片', fileUrl: item.url})"
                                                 width="78" height="78"
                                                 class="mT16 border_outer"
                                                 alt="">
                                        </span>
                                    </div>
                                </div>
                                <div class="inline_block mR30 min_width" v-if="form.imgPath7[0]">
                                    <p>厂房租赁合同(或房产证)</p>
                                    <div>
                                        <span v-for="item in form.imgPath7" class="mR15">
                                            <img :src="item.url"
                                                 @click="handleSmallImgClick({businessType: '厂房租赁合同(或房产证)', fileUrl: item.url})"
                                                 width="78" height="78"
                                                 class="mT16 border_outer"
                                                 alt="">
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="mT16">
                                <div class="inline_block mR30 min_width" v-if="form.imgPath8[0]">
                                    <p>纳税申报表</p>
                                    <div>
                                        <span v-for="item in form.imgPath8" class="mR15">
                                            <img :src="item.url"
                                                 @click="handleSmallImgClick({businessType: '纳税申报表', fileUrl: item.url})"
                                                 width="78" height="78"
                                                 class="mT16 border_outer"
                                                 alt="">
                                        </span>
                                    </div>
                                </div>
                                <div class="inline_block mR30 min_width" v-if="form.imgPath9[0]">
                                    <p>纳税信用等级</p>
                                    <div>
                                        <span v-for="item in form.imgPath9" class="mR15">
                                            <img :src="item.url"
                                                 @click="handleSmallImgClick({businessType: '纳税信用等级', fileUrl: item.url})"
                                                 width="78" height="78"
                                                 class="mT16 border_outer"
                                                 alt="">
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="mT16">
                                <div class="inline_block mR30 min_width" v-if="form.imgPath10[0]">
                                    <p>仓库照片</p>
                                    <div>
                                        <span v-for="item in form.imgPath10" class="mR15">
                                            <img :src="item.url"
                                                 @click="handleSmallImgClick({businessType: '仓库照片', fileUrl: item.url})"
                                                 width="78" height="78"
                                                 class="mT16 border_outer"
                                                 alt="">
                                        </span>
                                    </div>
                                </div>
                                <div class="inline_block mR30 min_width" v-if="form.imgPath11[0]">
                                    <p>其他</p>
                                    <div>
                                        <span v-for="item in form.imgPath11" class="mR15">
                                            <img :src="item.url"
                                                 @click="handleSmallImgClick({businessType: '其他', fileUrl: item.url})"
                                                 width="78" height="78"
                                                 class="mT16 border_outer"
                                                 alt="">
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nt-row>
                <nt-row class="competing_infor mT25">
                    <div class="competing_infor_title fb">开票厂商产品</div>
                    <div class="competing_infor_main fix" style="margin: 2px;">
                        <nt-table :data="form.gcfsCommodityList" class="dialog_table">
                            <nt-table-column width="11"></nt-table-column>
                            <nt-table-column prop="commodityName" label="产品名称" show-overflow-tooltip></nt-table-column>
                            <nt-table-column prop="commodityCode" label="产品编码" show-overflow-tooltip></nt-table-column>
                            <nt-table-column prop="hsCode" label="海关编码" show-overflow-tooltip></nt-table-column>
                            <nt-table-column prop="merchantSku" label="商家SKU" show-overflow-tooltip></nt-table-column>
                            <nt-table-column prop="specsModel" label="规格型号" show-overflow-tooltip></nt-table-column>
                            <nt-table-column prop="brand" label="品牌" show-overflow-tooltip></nt-table-column>
                        </nt-table>
                    </div>
                </nt-row>
                <nt-row class="competing_infor mT25">
                    <div class="competing_infor_title fb">备注</div>
                    <div class="competing_infor_xbox fix">
                        <nt-col :span="24" class="form-item-text break">
                            <nt-form-item label="备注：" label-width="50">
                                <span v-if="!form.letterContent">无</span>
                                <span v-else>{{form.letterContent}}</span>
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
    import commonMixin from './common.js';


    export default {
        mixins: [commonMixin],
        components: {
            PageHead
        },
        data() {
            return {
                id: this.$route.query['id'],
                dialogBigImgTitle: null,
                dialogBigImgVisible: false,
                dialogBigImgSrc: null,
                gcfsCommodityList: [],
                dialogId: null,
                form: {
                    imgPath4: [],
                    imgPath5: [],
                    imgPath6: [],
                    imgPath7: [],
                    imgPath8: [],
                    imgPath9: [],
                    imgPath10: [],
                    imgPath11: []
                }
            };
        },

        created: async function () {
            const id = this.id;
            this.dialogId = id;
            const getInfo = await this.ctx.models.billing.getInfo(id);
            this.form = getInfo.data;
            this.getSelfItem();

        },

        methods: {

            //删除单条开票厂商
            handleDeleteCurrent: async function () {
                const res = await this.ctx.models.billing.deleteCurrent({id: this.id});
                if (res.statusCode === '2000000') {
                    this.jumpList();
                } else {
                    this.$message.error(res.errMsg)
                }

            },

            //获取每一个imgPath 多余的参数
            getSelfItem: function () {
                let fileList = this.form.fileList;
                this.form.imgPath1 = null;
                this.form.imgPath2 = null;
                this.form.imgPath3 = null;
                this.form.imgPath4 = [];
                this.form.imgPath5 = [];
                this.form.imgPath6 = [];
                this.form.imgPath7 = [];
                this.form.imgPath8 = [];
                this.form.imgPath9 = [];
                this.form.imgPath10 = [];
                this.form.imgPath11 = [];
                for (let i = 0; i < fileList.length; i++) {
                    if (fileList[i].businessType === 1) {
                        this.form.imgPath1 = fileList[i].fileUrl;
                    } else if (fileList[i].businessType === 2) {
                        this.form.imgPath2 = fileList[i].fileUrl;
                    } else if (fileList[i].businessType === 3) {
                        this.form.imgPath3 = fileList[i].fileUrl;
                    } else if (fileList[i].businessType === 4) {
                        this.form.imgPath4.push({url: fileList[i].fileUrl});
                    } else if (fileList[i].businessType === 5) {
                        this.form.imgPath5.push({url: fileList[i].fileUrl});
                    } else if (fileList[i].businessType === 6) {
                        this.form.imgPath6.push({url: fileList[i].fileUrl});
                    } else if (fileList[i].businessType === 7) {
                        this.form.imgPath7.push({url: fileList[i].fileUrl});
                    } else if (fileList[i].businessType === 8) {
                        this.form.imgPath8.push({url: fileList[i].fileUrl});
                    } else if (fileList[i].businessType === 9) {
                        this.form.imgPath9.push({url: fileList[i].fileUrl});
                    } else if (fileList[i].businessType === 10) {
                        this.form.imgPath10.push({url: fileList[i].fileUrl});
                    } else if (fileList[i].businessType === 11) {
                        this.form.imgPath11.push({url: fileList[i].fileUrl});
                    }
                }
            },

            //点击小图显示大图
            handleSmallImgClick: function (data) {
                //大图
                this.dialogBigImgVisible = true;
                this.dialogBigImgTitle = data.businessType;
                this.dialogBigImgSrc = data.fileUrl;
            },

            //认证单条开票厂商
            handleCertifiedPass: async function () {
                const res = await this.ctx.models.billing.certifiedPass({id: this.id});
                if (res.statusCode === '2000000') {
                    this.$message.success({message: '操作成功', duration: 1000});
                    setTimeout(() => {
                        this.jumpList();
                    }, 1500)

                } else {
                    this.$message.error(res.errMsg);
                }
            },

            //取消认证单条开票厂商
            handleCancelCertified: async function () {
                const res = await this.ctx.models.billing.cancelCertified({id: this.id});
                if (res.statusCode === '2000000') {
                    this.$message.success({message: '操作成功', duration: 1000});
                    setTimeout(() => {
                        this.jumpList();
                    }, 1500)
                } else {
                    this.$message.error(res.errMsg);
                }
            },


        }
    };
</script>


