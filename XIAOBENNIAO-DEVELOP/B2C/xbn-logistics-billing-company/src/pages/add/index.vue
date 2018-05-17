<style lang="less">


    .biling-add {
        .nt-form-item__content {
            margin-left: 0 !important;
        }
    }

    .facturers_q .nt-dialog--small {
        width: 880px;
    }


</style>

<template>
    <div>
        <page-head :title="'开票厂商管理'"></page-head>
        <nt-row class="operationBox">
            <nt-col :span="4" class="f16">
                <i class="nt-icon nt-icon-arrow-left" @click="jumpList" style="cursor: pointer;"></i>
                <span v-if="currentRouter == addUrlHash">新增开票厂商</span>
                <span v-if="currentRouter == updateUrlHash">修改开票厂商</span>
            </nt-col>
            <nt-col :span="20" style="text-align: right;">
                <nt-button type="primary" @click="newToAuditData('form')" v-if="currentRouter == addUrlHash">提审
                </nt-button>
                <nt-button type="primary" @click="newToSaveData('form')" v-if="currentRouter == addUrlHash">保存
                </nt-button>
                <nt-button type="primary" @click="updateToAuditData('form')" v-if="currentRouter == updateUrlHash">提审
                </nt-button>
                <nt-button type="primary" @click="updateToSaveData('form')" v-if="currentRouter == updateUrlHash">保存
                </nt-button>
                <nt-button type="primary" @click="jumpList">取消</nt-button>
            </nt-col>
        </nt-row>

        <nt-form :model="form" :rules="rules" ref="form" label-width="165px">
            <div class="contentBox">
                <div class="border_layout competing_infor">
                    <div class="competing_infor_title fb">开票厂商公司基本信息</div>
                    <div class="competing_infor_xbox">
                        <nt-form-item label="开票厂商公司名称：" prop="billingCompanyName">
                            <nt-col :span="3">
                                <nt-input v-model="form.billingCompanyName" :maxlength="60" class="w370"></nt-input>
                            </nt-col>
                        </nt-form-item>
                        <nt-form-item label="统一社会信用代码：" prop="uniformSocialCreditCode">
                            <nt-col :span="3">
                                <nt-input v-model="form.uniformSocialCreditCode" :maxlength="18"
                                          class="w240"></nt-input>
                            </nt-col>
                        </nt-form-item>
                        <nt-form-item label="一般纳税人认定时间：" prop="generalTaxpayerDetermineTime">
                            <nt-date-picker
                                    v-model="form.generalTaxpayerDetermineTime"
                                    type="date"
                                    placeholder=""
                                    format="yyyy-MM-dd"
                                    @change="formatteGTDT">
                            </nt-date-picker>
                            <p class="col_cccccc lh18 mT10">
                                请查询一般纳税人认定时间并准确填写，如开票人所在地区无法查询，请提供一般纳税人认定证明，并填写一般纳税人认定文件上认定时间。<br>查询网址：
                                <a target="_blank"
                                   href="http://www.yibannashuiren.com">http://www.yibannashuiren.com</a>
                            </p>
                        </nt-form-item>
                        <nt-form-item label="开票厂商地址：" prop="city">
                            <nt-col :span="24">
                                <city-select v-model="form.city"></city-select>
                            </nt-col>
                        </nt-form-item>
                        <nt-form-item label="" prop="companyAddress">
                            <nt-col :span="15">
                                <nt-input v-model="form.companyAddress" :maxlength="100" class="w370"></nt-input>
                                <p class="inline_block col_cccccc lh18">
                                    即工厂地址，需和税务登记证地址一致，如不一致，需提供证明材料。
                                </p>
                            </nt-col>
                        </nt-form-item>
                        <nt-form-item label="境内货源地：" prop="domesticGoodsAddress">
                            <nt-col :span="3">
                                <nt-input v-model="form.domesticGoodsAddress" :maxlength="60" class="w370"></nt-input>
                            </nt-col>
                        </nt-form-item>
                        <nt-form-item label="开票厂商增值税率：" prop="vatRate">
                            <nt-select v-model="form.vatRate" placeholder="请选择" class="w160">
                                <nt-option v-for="item in vatRateOptions" :label="item.name"
                                           :key="item.name"
                                           :value="item.id"></nt-option>
                            </nt-select>
                        </nt-form-item>
                        <nt-form-item label="出口权：" prop="exportRights">
                            <nt-radio-group v-model="form.exportRights">
                                <nt-radio v-for="item in exportRightsOptions" :label="item.id" :key="item.id">
                                    {{item.name}}
                                </nt-radio>
                            </nt-radio-group>
                        </nt-form-item>
                        <nt-form-item label="海关注册登记编码：" prop="customeRegistrationCode" v-if="form.exportRights === 1">
                            <nt-col :span="3">
                                <nt-input v-model="form.customeRegistrationCode" :maxlength="20"
                                          class="w370"></nt-input>
                            </nt-col>
                        </nt-form-item>
                    </div>
                </div>
                <div class=" competing_infor mT25">
                    <div class="competing_infor_title fb">证照信息</div>
                    <div class="competing_infor_main biling-add" style="padding: 30px;">
                        <span class="col_cccccc">照片仅支持jpg,gif,png三种格式，大小不超过4MB</span>
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
                        <div>
                            <nt-form-item prop="imgPath1" class="inline_block mR10 vT">
                                <p><span style="color: #fe5655;margin-right: 4px;">*</span>税务登记副本<span
                                        class="col_cccccc">（只能上传1张）</span></p>
                                <avatar-upload v-model="form.imgPath1" style="height: 148px;"
                                               :token="ctx.authentication.getToken()"
                                               :size="4"
                                               :accept="type">
                                </avatar-upload>
                            </nt-form-item>
                            <nt-form-item prop="imgPath2" class="inline_block mR10 vT">
                                <p><span style="color: #fe5655;margin-right: 4px;">*</span>营业执照<span class="col_cccccc">（只能上传1张）</span>
                                </p>
                                <avatar-upload v-model="form.imgPath2" style="height: 148px;"
                                               :token="ctx.authentication.getToken()"
                                               :size="4"
                                               :accept="type">
                                </avatar-upload>
                            </nt-form-item>
                            <nt-form-item prop="imgPath3" class="inline_block mR10 vT">
                                <p><span style="color: #fe5655;margin-right: 4px;">*</span>一般纳税人认定书<span
                                        class="col_cccccc">（只能上传1张）</span></p>
                                <avatar-upload v-model="form.imgPath3" style="height: 148px;"
                                               :token="ctx.authentication.getToken()"
                                               :size="4"
                                               :accept="type">
                                </avatar-upload>
                            </nt-form-item>
                        </div>
                        <div>
                            <nt-form-item prop="imgPath4" class="inline_block mR10 vT">
                                <p>进项发票<span class="col_cccccc">（最多5张）</span>
                                </p>
                                <avatar-upload v-model="form.imgPath4" style="height: 148px;"
                                               :token="ctx.authentication.getToken()"
                                               :limit="5"
                                               :size="4"
                                               :accept="type">
                                </avatar-upload>
                            </nt-form-item>
                            <nt-form-item prop="imgPath5" class="inline_block mR10 vT">
                                <p><span style="color: #fe5655;margin-right: 4px;">*</span>厂牌照片<span class="col_cccccc">（最多5张）</span>
                                </p>
                                <avatar-upload v-model="form.imgPath5" style="height: 148px;"
                                               :token="ctx.authentication.getToken()"
                                               :limit="5"
                                               :size="4"
                                               :accept="type">
                                </avatar-upload>
                            </nt-form-item>
                        </div>
                        <div>
                            <nt-form-item prop="imgPath6" class="inline_block mR10 vT">
                                <p><span style="color: #fe5655;margin-right: 4px;">*</span>生产线照片<span
                                        class="col_cccccc">（最多5张）</span>
                                </p>
                                <avatar-upload v-model="form.imgPath6" style="height: 148px;"
                                               :token="ctx.authentication.getToken()"
                                               :limit="5"
                                               :size="4"
                                               :accept="type">
                                </avatar-upload>
                            </nt-form-item>
                            <nt-form-item prop="imgPath7" class="inline_block mR10 vT">
                                <p>厂房租赁合同(或房产证)<span
                                        class="col_cccccc">（最多5张）</span></p>
                                <avatar-upload v-model="form.imgPath7" style="height: 148px;"
                                               :token="ctx.authentication.getToken()"
                                               :limit="5"
                                               :size="4"
                                               :accept="type">
                                </avatar-upload>
                            </nt-form-item>
                        </div>
                        <div>
                            <nt-form-item prop="imgPath8" class="inline_block mR10 vT">
                                <p>纳税申报表<span
                                        class="col_cccccc">（最多5张）</span>
                                </p>
                                <avatar-upload v-model="form.imgPath8" style="height: 148px;"
                                               :token="ctx.authentication.getToken()"
                                               :limit="5"
                                               :size="4"
                                               :accept="type">
                                </avatar-upload>
                            </nt-form-item>
                            <nt-form-item prop="imgPath9" class="inline_block mR10 vT">
                                <p>纳税信用等级<span
                                        class="col_cccccc">（最多5张）</span>
                                </p>
                                <avatar-upload v-model="form.imgPath9" style="height: 148px;"
                                               :token="ctx.authentication.getToken()"
                                               :limit="5"
                                               :size="4"
                                               :accept="type">
                                </avatar-upload>
                            </nt-form-item>
                        </div>
                        <div>
                            <nt-form-item prop="imgPath10" class="inline_block mR10 vT">
                                <p>仓库照片<span class="col_cccccc">（最多5张）</span>
                                </p>
                                <avatar-upload v-model="form.imgPath10" style="height: 148px;"
                                               :token="ctx.authentication.getToken()"
                                               :limit="5"
                                               :size="4"
                                               :accept="type">
                                </avatar-upload>
                            </nt-form-item>
                            <nt-form-item prop="imgPath11" class="inline_block mR10 vT">
                                <p>其他<span
                                        class="col_cccccc">（最多5张）</span></p>
                                <avatar-upload v-model="form.imgPath11" style="height: 148px;"
                                               :token="ctx.authentication.getToken()"
                                               :limit="5"
                                               :size="4"
                                               :accept="type">
                                </avatar-upload>
                            </nt-form-item>
                        </div>
                    </div>
                </div>
                <div class="competing_infor mT25">
                    <div class="competing_infor_title fb">开票厂商产品</div>
                    <div class="competing_infor_main facturers_q">
                        <nt-dialog title="添加产品" :visible.sync="addProductVisible"
                                   @open="handleAddProOpen"
                                   size="small">
                            <div>
                                <div>
                                    <nt-input class="w370 mB20"
                                              v-model="iconSearchData"
                                              icon="search"
                                              :placeholder="iconSelectData"
                                              :on-icon-click="handleSearchIconClick"
                                              :maxlength="60">
                                        <nt-select v-model="iconSelectData" slot="prepend" :placeholder="iconSelectData"
                                                   class="w140">
                                            <nt-option label="产品名称" value="产品名称"></nt-option>
                                            <nt-option label="海关编码" value="海关编码"></nt-option>
                                            <nt-option label="商家SKU" value="商家SKU"></nt-option>
                                        </nt-select>
                                    </nt-input>
                                </div>

                                <nt-table :data="allLinkedData" ref="tableLinkedData" class="dialog_table"
                                          @selection-change="handleSelectChange" max-height="217">
                                    <nt-table-column type="selection" align="center"
                                                     :selectable='checkboxInit'></nt-table-column>
                                    <nt-table-column prop="title" label="产品名称" show-overflow-tooltip></nt-table-column>
                                    <nt-table-column prop="commodityCode" label="产品编码"
                                                     show-overflow-tooltip></nt-table-column>
                                    <nt-table-column prop="hsCode" label="海关编码" show-overflow-tooltip></nt-table-column>
                                    <nt-table-column prop="merchantSku" label="商家SKU"
                                                     show-overflow-tooltip></nt-table-column>
                                    <nt-table-column prop="specsModel" label="规格型号"
                                                     show-overflow-tooltip></nt-table-column>
                                    <nt-table-column prop="brand" label="品牌" show-overflow-tooltip></nt-table-column>
                                    <nt-table-column prop="status" label="产品状态">
                                        <template slot-scope="scope">
                                            <span v-if="scope.row.status === 2">审核中</span>
                                            <span v-if="scope.row.status === 3">待补充资料</span>
                                            <span v-if="scope.row.status === 4">审核通过</span>
                                            <span v-if="scope.row.status === 5">临时审核通过</span>
                                            <span v-if="scope.row.status === 6">审核驳回</span>
                                        </template>
                                    </nt-table-column>
                                </nt-table>

                            </div>
                            <div slot="footer" class="dialog-footer">
                                <nt-button type="primary" size="small" @click="handleAddProductSubmit">确 定</nt-button>
                                <nt-button type="primary" size="small" @click="addProductVisible = false">取 消
                                </nt-button>
                            </div>
                        </nt-dialog>

                        <span style="color: rgb(254, 86, 85); margin-right: 4px;">*</span>
                        <nt-button type="primary" @click="handleAddProductButtonClick">添加产品</nt-button>
                        <p style="color: rgb(254, 86, 85);" v-if="gcfsCommodityListErrorVisiable === true">关联产品不能为空</p>
                        <div class="mT16">
                            <nt-table :data="gcfsCommodityMidList" ref="mid" class="dialog_table">
                                <nt-table-column width="11"></nt-table-column>
                                <nt-table-column prop="title" label="产品名称"></nt-table-column>
                                <nt-table-column prop="commodityCode" label="产品编码"></nt-table-column>
                                <nt-table-column prop="hsCode" label="海关编码"></nt-table-column>
                                <nt-table-column prop="merchantSku" label="商家SKU"></nt-table-column>
                                <nt-table-column prop="specsModel" label="规格型号"></nt-table-column>
                                <nt-table-column prop="brand" label="品牌"></nt-table-column>
                                <nt-table-column prop="status" label="产品状态">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.status === 2">审核中</span>
                                        <span v-if="scope.row.status === 3">待补充资料</span>
                                        <span v-if="scope.row.status === 4">审核通过</span>
                                        <span v-if="scope.row.status === 5">临时审核通过</span>
                                        <span v-if="scope.row.status === 6">审核驳回</span>
                                    </template>
                                </nt-table-column>
                                <nt-table-column label="操作">
                                    <template slot-scope="scope">
                                        <nt-button type="text" size="small"
                                                   @click="handleUnsubmitProduct(scope.$index)">
                                            删除
                                        </nt-button>
                                    </template>
                                </nt-table-column>
                            </nt-table>
                        </div>
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
                type: 'image/gif,image/jpeg,image/png',
                //开票厂商增值税率配置
                vatRateOptions: [{name: '17%', id: 0}, {name: '11%', id: 1}],
                //出口权配置
                exportRightsOptions: [{name: '有', id: 1}, {name: '无', id: 0}],
                form: {
                    gcfsCommodityList: [],
                    fileList: [],
                    city: [],
                    imgPath1: null,
                    imgPath2: null,
                    imgPath3: null,
                    imgPath4: [],
                    imgPath5: [],
                    imgPath6: [],
                    imgPath7: [],
                    imgPath8: [],
                    imgPath9: [],
                    imgPath10: [],
                    imgPath11: [],
                },
                /**
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
                 **/

                rules: {
                    billingCompanyName: [
                        {required: true, message: '请输入开票厂商公司名称', trigger: 'blur'},
                        {max: 60, message: '开票厂商公司名称最多60个字符'},
                        {validator: this.BCNExistValidator}
                    ],
                    uniformSocialCreditCode: [
                        {required: true, message: '请输入统一社会信用代码', trigger: 'blur'},
                        {max: 18, message: '统一社会信用代码最多18个字符'},
                        {validator: this.USCCValidator, message: '统一社会信用代码必须以数字、字母组成'},
                        {validator: this.USCExistValidator},
                    ],
                    generalTaxpayerDetermineTime: [
                        {required: true, message: '请选择一般纳税人认定时间', trigger: 'change'}
                    ],
                    city: [
                        {required: true, type: 'array', message: '请选择', trigger: 'change'},
                        {validator: this.validateCity, trigger: 'change'}
                    ],
                    companyAddress: [
                        {required: true, message: '请输入开票厂商地址', trigger: 'blur'},
                        {max: 100, message: '开票厂商地址最多100个字符'}
                    ],
                    domesticGoodsAddress: [
                        {required: true, message: '请输入境内货源地', trigger: 'blur'},
                        {max: 60, message: '境内货源地最多60个字符'},
                    ],
                    vatRate: [
                        {required: true, type: 'number', message: '请选择开票厂商增值税率', trigger: 'change'}
                    ],
                    customeRegistrationCode: [
                        {required: true, type: 'string', message: '请输入海关注册登记编码', trigger: 'change'}
                    ],
                    exportRights: [
                        {required: true, type: 'number', message: '请选择出口权', trigger: 'change'}
                    ],
                    gcfsCommodityList: [
                        {required: true, type: 'array', message: '关联产品不能为空', trigger: 'change'}
                    ],
                    imgPath1: [
                        {required: true, message: '请上传税务登记副本', trigger: 'change'},
                    ],
                    imgPath2: [
                        {required: true, message: '请上传营业执照', trigger: 'change'},
                    ],
                    imgPath3: [
                        {required: true, message: '请上传一般纳税人认定书', trigger: 'change'},
                    ],
                    imgPath4: [
                        {required: false, type: 'array', message: '请上传进项发票', trigger: 'change'},
                    ],
                    imgPath5: [
                        {required: true, type: 'array', message: '请上传厂牌照片', trigger: 'change'},
                    ],
                    imgPath6: [
                        {required: true, type: 'array', message: '请上传生产线照片', trigger: 'change'},
                    ],
                    imgPath7: [
                        {required: false, type: 'array', message: '请上传厂房租赁合同(或房产证)', trigger: 'change'},
                    ],
                    imgPath8: [
                        {required: false, type: 'array', message: '请上传纳税申报表', trigger: 'change'},
                    ],
                    imgPath9: [
                        {required: false, type: 'array', message: '请上传纳税信用等级', trigger: 'change'},
                    ],
                    imgPath10: [
                        {required: false, type: 'array', message: '请上传仓库照片', trigger: 'change'},
                    ],
                    imgPath11: [
                        {required: false, type: 'array', message: '请上传其他照片', trigger: 'change'},
                    ],

                },

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
            },

            async loadUpdataPage() {
                const id = this.$route.query['id'];
                const getInfo = await this.ctx.models.billing.getInfo(id);
                const getInfoData = getInfo.data;
                const fileList = getInfoData.fileList;
                this.form = {
                    id: id,
                    imgPath1: this.getSelfItem(this.form.imgPath1, 1, fileList),
                    imgPath2: this.getSelfItem(this.form.imgPath2, 2, fileList),
                    imgPath3: this.getSelfItem(this.form.imgPath3, 3, fileList),
                    imgPath4: this.getSelfItem(this.form.imgPath4, 4, fileList),
                    imgPath5: this.getSelfItem(this.form.imgPath5, 5, fileList),
                    imgPath6: this.getSelfItem(this.form.imgPath6, 6, fileList),
                    imgPath7: this.getSelfItem(this.form.imgPath7, 7, fileList),
                    imgPath8: this.getSelfItem(this.form.imgPath8, 8, fileList),
                    imgPath9: this.getSelfItem(this.form.imgPath9, 9, fileList),
                    imgPath10: this.getSelfItem(this.form.imgPath10, 10, fileList),
                    imgPath11: this.getSelfItem(this.form.imgPath11, 11, fileList),
                    billingCompanyName: getInfoData.billingCompanyName,
                    generalTaxpayerDetermineTime: getInfoData.generalTaxpayerDetermineTime,
                    companyAddress: getInfoData.companyAddress,
                    domesticGoodsAddress: getInfoData.domesticGoodsAddress,
                    vatRate: getInfoData.vatRate,
                    exportRights: getInfoData.exportRights,
                    customeRegistrationCode: getInfoData.customeRegistrationCode,
                    uniformSocialCreditCode: getInfoData.uniformSocialCreditCode,
                    city: [
                        {ProID: getInfoData.companyProvince},
                        {CityID: getInfoData.companyCity},
                        {Id: getInfoData.companyCountry}
                    ],
                    gcfsCommodityList: getInfoData.gcfsCommodityList
                };
                this.gcfsCommodityMidList = getInfoData.gcfsCommodityList;


            },


            //新建并保存
            newToSaveData: async function (formName) {
                const This = this;
                This.productVisiableValidator();
                this.$refs[formName].validate((valid) => {
                    console.log(This.form)
                    if (valid) {
                        this.getFileList();

                        This.ctx.models.billing.newToSave(this.form).then(function (res) {
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

            //新建并提审
            newToAuditData: async function (formName) {
                const This = this;
                This.productVisiableValidator();
                this.$refs[formName].validate((valid) => {
                    console.log(This.form)
                    if (valid) {
                        this.getFileList();

                        This.ctx.models.billing.newToAudit(this.form).then(function (res) {
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

            //编辑并保存
            updateToSaveData: async function (formName) {
                const This = this;
                this.$refs[formName].validate((valid) => {
                    console.log(This.form)
                    if (valid) {
                        this.getFileList();

                        This.ctx.models.billing.updateToSave(this.form).then(function (res) {
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

            //编辑并提审
            updateToAuditData: async function (formName) {
                const This = this;
                this.$refs[formName].validate((valid) => {
                    console.log(This.form)
                    if (valid) {
                        this.getFileList();

                        This.ctx.models.billing.updateToAudit(this.form).then(function (res) {
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

            //校验开票厂商名称重复
            BCNExistValidator: function (rule, value, callback) {
                this.ctx.models.billing.validateNameAndCreditCode({
                    id: this.$route.query['id'],
                    billingCompanyName: value,
                    uniformSocialCreditCode: ''
                }).then(function(res){
                    if(res.statusCode == '2000000'){
                        callback();
                    }else if(res.statusCode == '2071700'){
                        callback(new Error('开票厂商公司名称已存在'));
                    }
                });
            },

            //校验统一社会信用代码重复
            USCExistValidator: function (rule, value, callback) {
                this.ctx.models.billing.validateNameAndCreditCode({
                    id: this.$route.query['id'],
                    billingCompanyName: '',
                    uniformSocialCreditCode: value
                }).then(function(res){
                    if(res.statusCode == '2000000'){
                        callback();
                    }else if(res.statusCode == '2071701'){
                        callback(new Error('开票厂商统一社会信用代码已存在'));
                    }
                });
            },


            //校验统一社会信用代码必须以英文字母与数字组成
            USCCValidator: function (rule, value, callback) {
                const logisticsCode = value.match(/^[A-Za-z0-9]+$/);
                if (logisticsCode && logisticsCode[0]) {
                    callback();
                } else {
                    callback(new Error());
                }
            },

            //校验一般纳税人认定时间
            formatteGTDT: function (format) {
                this.form.generalTaxpayerDetermineTime = format;
            },


            //删除未提交的产品
            handleUnsubmitProduct: async function (index) {
                this.gcfsCommodityMidList.splice(index, 1);
                this.getSelectedId();
            },

            //校验添加产品是否为空
            productVisiableValidator: function () {
                if (!this.form.gcfsCommodityList[0]) {
                    this.gcfsCommodityListErrorVisiable = true;
                } else {
                    this.gcfsCommodityListErrorVisiable = false;
                }
            },


            validateCity: function (rule, value, callback) {
                if (value.length === 3) {
                    this.form.companyProvince = value[0].ProID;
                    this.form.companyCity = value[1].CityID;
                    this.form.companyCountry = value[2].Id;
                    callback();
                } else {
                    callback(new Error('请选择'));
                }
            },

            //将imgpaths格式化为统一的格式fileList
            getFileList: function () {
                var form = this.form;
                var arr = [form.imgPath1, form.imgPath2, form.imgPath3, form.imgPath4, form.imgPath5, form.imgPath6, form.imgPath7, form.imgPath8, form.imgPath9, form.imgPath10, form.imgPath11];
                var fileList = form.fileList = [];

                for (var i = 0; i < arr.length; i++) {
                    if (arr[i]) {
                        if (arr[i] instanceof Array) {
                            for (var j = 0; j < arr[i].length; j++) {
                                fileList.push({
                                    businessModuleCode: 7,
                                    businessType: i + 1,
                                    fileUrl: arr[i][j].url,
                                    fileType: arr[i][j].url.match(/\.[a-zA-Z]+$/)[0]
                                });
                            }
                        } else {
                            fileList.push({
                                businessModuleCode: 7,
                                businessType: i + 1,
                                fileUrl: arr[i],
                                fileType: arr[i].match(/\.[a-zA-Z]+$/)[0]
                            });
                        }
                    }
                }
            },

            //获取每一个imgPath 多余的参数
            getSelfItem: function (defaultItem, businessType, fileList) {
                for (let i = 0; i < fileList.length; i++) {
                    if (fileList[i].businessType === businessType) {
                        if (defaultItem instanceof Array) {
                            defaultItem.push({url: fileList[i].fileUrl});
                        } else {
                            defaultItem = fileList[i].fileUrl;
                        }
                    }
                }
                return defaultItem;
            },


        }
    };
</script>


