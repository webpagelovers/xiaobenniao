<template>
    <div>
        <div class="mT16">
            <nt-table :data="gcfsCommodityMidList" ref="mid" class="dialog_table" v-if="gcfsCommodityMidList && gcfsCommodityMidList.length>0">
                <nt-table-column width="11"></nt-table-column>
                <nt-table-column prop="commodityName" label="产品名称" show-overflow-tooltip></nt-table-column>
                <nt-table-column prop="commodityCode" label="产品编码" show-overflow-tooltip></nt-table-column>
                <nt-table-column prop="hsCode" label="海关编码" show-overflow-tooltip></nt-table-column>
                <nt-table-column prop="merchantSku" label="商家SKU" show-overflow-tooltip></nt-table-column>
                <nt-table-column prop="specsModel" label="规格型号" show-overflow-tooltip></nt-table-column>
                <nt-table-column prop="brand" label="品牌" show-overflow-tooltip></nt-table-column>
                <!--<nt-table-column label="操作">
                    <template slot-scope="scope">
                        <nt-button type="text" size="small"
                                   @click="handleUnsubmitProduct(scope.$index)">
                            删除
                        </nt-button>
                    </template>
                </nt-table-column>-->
            </nt-table>
        </div>

        <nt-dialog title="添加产品" :visible.sync="addProductVisible"
                   :close-on-click-modal="false"
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
                <nt-tabs v-model="activeName" @tab-click="handleClick">
                    <nt-tab-pane label="未添加" name="nolinked">
                    </nt-tab-pane>
                    <nt-tab-pane label="已添加" name="linked" v-if="currentRouter == updateUrlHash">
                    </nt-tab-pane>
                </nt-tabs>
                <nt-table :data="tableData" ref="tableData" class="dialog_table"
                          @selection-change="handleSelectChange" max-height="217">
                    <nt-table-column type="selection" align="center"></nt-table-column>
                    <nt-table-column prop="commodityName" label="产品名称"
                                     show-overflow-tooltip></nt-table-column>
                    <nt-table-column prop="commodityCode" label="产品编码"
                                     show-overflow-tooltip></nt-table-column>
                    <nt-table-column prop="hsCode" label="海关编码"
                                     show-overflow-tooltip></nt-table-column>
                    <nt-table-column prop="merchantSku" label="商家SKU"
                                     show-overflow-tooltip></nt-table-column>
                    <nt-table-column prop="specsModel" label="规格型号"
                                     show-overflow-tooltip></nt-table-column>
                    <nt-table-column prop="brand" label="品牌"
                                     show-overflow-tooltip></nt-table-column>
                </nt-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <nt-button type="primary" size="small"
                           v-if="activeName === 'nolinked'"
                           @click="handleNoLinkedSubmit">确 定
                </nt-button>
                <nt-button type="primary" size="small"
                           v-if="activeName === 'linked'"
                           @click="handleLinkedSubmit">确 定
                </nt-button>
                <nt-button type="primary" size="small" @click="addProductVisible = false">取 消
                </nt-button>
            </div>
        </nt-dialog>

    </div>
</template>

<script>

    import commonMixin from '../pages/common.js';

    export default {
        props: ['cfUserId'],
        created: async function () {
            if (this.currentRouter == this.updateUrlHash) {
                const getInfo = await this.ctx.models.billing.getInfo(this.$route.query['id']);
                if(getInfo.statusCode === '2000000'){
                    this.cfUserId = getInfo.data.cfUserId;
                    this.gcfsCommodityMidList = await this.getLinkedData();
                }
            }
        },

        data() {
            return {
                addProductVisible: false,
                iconSelectData: '产品名称',
                selectItem: [
                    {name: 'commodityName', value: '产品名称'},
                    {name: 'hsCode', value: '海关编码'},
                    {name: 'merchantSku', value: '商家SKU'}
                ],
                iconSearchData: null,
                //关联的所有的产品列表
                selectedIds: [],
                ids: [],
                selectedData: [],
                gcfsCommodityMidList: [],
                activeName: 'nolinked',
                tableData: [],
            }
        },
        mixins: [commonMixin],

        components: {},
        beforeCreate: async function () {

        },
        mounted: async function () {

        },
        methods: {

            //点击按钮调起添加产品对话框
            show: function () {
                this.addProductVisible = true;
            },


            handleAddProOpen: async function () {
                this.activeName = 'nolinked';
                this.tableData = await this.getNoLinkedData();
                if (this.currentRouter == this.addUrlHash) {
                    //已选中的，设置选中状态
                    if (this.currentRouter == this.addUrlHash && this.gcfsCommodityMidList && this.gcfsCommodityMidList.length > 0 && this.tableData && this.tableData.length > 0) {
                        this.tableData.forEach((v) => {
                            this.gcfsCommodityMidList.forEach(row => {
                                if (v.id === row.id) {
                                    this.$nextTick(() => {
                                        this.$refs.tableData.toggleRowSelection(v, true);
                                    });
                                }
                            });
                        });
                    }
                }

                if (this.currentRouter === this.updateUrlHash && this.activeName === 'linked') {
                    this.tableData = await this.getLinkedData();
                    if (this.activeName === 'linked') {
                        this.tableData.forEach(row => {
                            this.$nextTick(() => {
                                this.$refs.tableData.toggleRowSelection(v, true);
                            });
                        });
                    }
                }
            },

            //切换到未添加时提交添加选中的产品
            handleNoLinkedSubmit: async function () {

                if (this.currentRouter == this.addUrlHash) {
                    this.gcfsCommodityMidList = this.tableData = this.selectedData
                } else {
                    this.getIds();
                    const batchSaveRes = await this.ctx.models.billing.batchSave({
                        billingCompanyId: this.id,
                        commodityId: this.ids
                    });
                    if (batchSaveRes.statusCode === '2000000') {
                        this.gcfsCommodityMidList = await this.getLinkedData();
                    }
                }

                this.getSelectedId();
                this.$emit('success', {data: this.selectedIds});
                this.addProductVisible = false;
            },

            //切换到添加时提交添加选中的产品
            handleLinkedSubmit: async function () {
                this.getIds();
                const batchDeleteRes = await this.ctx.models.billing.batchDelete({
                    billingCompanyId: this.id,
                    commodityId: this.ids
                });
                if (batchDeleteRes.statusCode === '2000000') {
                    this.gcfsCommodityMidList = await this.getLinkedData();
                }

                this.getSelectedId();
                this.$emit('success', {data: this.selectedIds});
                this.addProductVisible = false;
            },

            //table列表某一行被选中
            handleSelectChange: function (selected) {
                this.selectedData = selected;
            },

            //点input的icon 搜索
            handleSearchIconClick: function () {
                this.getSearchData();
            },

            //获取搜索的所有data
            getSearchData: async function () {
                var prams = {};
                prams.cfUserId = this.cfUserId;
                prams.billingCompanyId = this.id;


                for (let i = 0; i < this.selectItem.length; i++) {
                    if (this.iconSelectData === this.selectItem[i].value) {
                        prams[this.selectItem[i].name] = this.iconSearchData;
                    }
                }

                if (this.activeName === 'nolinked') {
                    this.tableData = await this.getNoLinkedData(prams);
                    this.addPageSearchData = this.tableData;
                    //已选中的，设置选中状态
                    if (this.currentRouter == this.addUrlHash && this.gcfsCommodityMidList && this.gcfsCommodityMidList.length > 0 && this.listNoLinkedData && this.listNoLinkedData.length > 0) {
                        this.tableData.forEach((v) => {
                            this.gcfsCommodityMidList.forEach(row => {
                                if (v.id === row.id) {
                                    this.$nextTick(() => {
                                        this.$refs.tableData.toggleRowSelection(v, true);
                                    });
                                }
                            });
                        });
                    }
                } else if (this.activeName === 'linked') {
                    const searchDataRes = await this.ctx.models.billing.listLinked(prams);
                    this.tableData = searchDataRes.data;


                    //已选中的，设置选中状态
                    if (this.gcfsCommodityMidList && this.gcfsCommodityMidList && this.gcfsCommodityMidList.length > 0 && this.tableData && this.tableData.length > 0) {
                        this.tableData.forEach((v) => {
                            this.gcfsCommodityMidList.forEach(row => {
                                if (v.id === row.id) {
                                    this.$nextTick(() => {
                                        this.$refs.tableData.toggleRowSelection(v, true);
                                    });
                                }
                            });
                        });
                    }
                }

            },


            /*
            * 上面是添加产品及搜索
             */

            handleClick: async function (tab, event) {
                this.activeName = tab.name;
                if (this.activeName === 'nolinked') {
                    this.tableData = await this.getNoLinkedData();
                } else if (this.activeName === 'linked') {
                    this.tableData = await this.getLinkedData();
                    this.selectedData = await this.getLinkedData();
                    if (this.tableData.length > 0) {
                        this.tableData.forEach(row => {
                            this.$nextTick(() => {
                                this.$refs.tableData.toggleRowSelection(row, true);
                            });
                        });
                    }
                }
            },

            //获取到关联产品所有的id
            getSelectedId: async function () {
                this.selectedIds = [];
                if (this.gcfsCommodityMidList && this.gcfsCommodityMidList.length > 0) {
                    this.gcfsCommodityMidList.forEach(item => {
                        this.selectedIds.push({id: item.id});
                    });
                } else {
                    return false;
                }

            },

            //获取未添加的数据列表
            getNoLinkedData: async function (params) {
                if (!params) {
                    params = {
                        cfUserId: this.cfUserId,
                        billingCompanyId: this.id,
                    };
                }
                const allDataRes = await this.ctx.models.billing.listNoLinked(params);
                if (allDataRes.statusCode === '2000000') {
                    return allDataRes.data;
                } else if (allDataRes.statusCode === '2071739') {
                    this.$message.error('请输入用户名');
                } else {
                    this.$message.error(allDataRes.errMsg);
                }
            },

            //获取已添加的数据列表
            getLinkedData: async function (params) {
                if (!params) {
                    params = {
                        cfUserId: this.cfUserId,
                        billingCompanyId: this.id,
                    };
                }
                const allDataRes = await this.ctx.models.billing.listLinked(params);
                if (allDataRes.statusCode === '2000000') {
                    return allDataRes.data;
                } else if (allDataRes.statusCode === '2071739') {
                    this.$message.error('请输入用户名');
                } else {
                    this.$message.error(allDataRes.errMsg);
                }
            },

            //获取单纯的id
            getIds: function () {
                this.ids = [];
                if (this.activeName === 'nolinked') {
                    this.selectedData.forEach(item => {
                        this.ids.push(item.id);
                    });
                }

                if (this.activeName === 'linked') {

                    if (this.selectedData.length === this.tableData.length || !this.tableData) {
                        return false;
                    }

                    if (!this.selectedData.length) {
                        this.tableData.forEach(row => {
                            this.ids.push(row.id);
                        });
                        return false;
                    }

                    if (this.selectedData.length < this.tableData.length) {

                        let a = [].concat(this.tableData);
                        let b = [].concat(this.selectedData);

                        for (let i = 0; i < b.length; i++) {
                            for (let j = 0; j < a.length; j++) {
                                if (a[j] == b[i]) {
                                    a.splice(j, 1);
                                    j = j - 1;
                                }
                            }
                        }

                        a.forEach(row => {
                            this.ids.push(row.id);
                        });
                    }
                }
            },

        },
        watch: {}
    }
</script>
<style lang="less">

</style>
