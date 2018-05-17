let dictionaryData = null;

const commonMixin = {
    data() {
        this.ctx.dictionaryData = dictionaryData;
        return {
            /*
            * 以下是添加产品配置的参数
            */
            addProductVisible: false,
            iconSelectData: '产品名称',
            selectItem: [
                {name: 'title', value: '产品名称'},
                {name: 'hsCode', value: '海关编码'},
                {name: 'merchantSku', value: '商家SKU'}
            ],
            iconSearchData: null,
            //未关联产品列表
            listNoLinkedData: [],
            //已关联的产品列表
            listLinkedData: [],
            //关联的所有的产品列表
            allLinkedData: [],
            selectedIds: [],
            selectedData: [],
            gcfsCommodityMidList: [],
            //列表页，详情页添加产品后，点击提审按钮时，所需要的数据
            saveProductData: {},
            gcfsCommodityListErrorVisiable: false,

            /*
            * 以下是公共的参数
            */
            currentRouter: location.hash.split('?')[0],
            listUrlHash: '#/billing/list',
            detailUrlHash: '#/billing/detail',
            addUrlHash: '#/billing/add',
            updateUrlHash: '#/billing/update',
            dialogId: null
        }
    },
    methods: {
        //跳到列表页
        jumpList: function () {
            this.$router.push({path: '/billing/list'});
        },

        //跳到增加页面
        jumpAdd: function () {
            this.$router.push({path: '/billing/add'});
        },

        //跳到详情页面
        jumpDetail(index, row) {
            this.$router.push({path: '/billing/detail?id=' + row.id});
        },

        //跳到修改页面
        jumpUpdate(index, row) {
            this.$router.push({path: '/billing/update?id=' + row.id});
        },
        //多余显示省略号
        cutMoreChat: function (item, cutNum) {
            if (item && item.length > cutNum) {
                item = item.slice(0, cutNum) + '...';
            } else {
                item = item;
            }
            return item;
        },

        //关闭弹窗
        closeDeleteSmall: function () {
            document.querySelector('body').click();
        },

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

        /*
        * 下面是添加产品及搜索
         */
        //点击按钮调起添加产品对话框
        handleAddProductButtonClick: async function (row) {
            if (row.id) {
                var listLinkedRes = await this.ctx.models.billing.listLinked({billingCompanyId: row.id});
                this.selectedData = listLinkedRes.data;
                this.gcfsCommodityMidList = listLinkedRes.data;
                this.dialogId = row.id;
            }
            this.addProductVisible = true;
        },

        handleAddProOpen: async function () {
            await  this.getAllLinkedData();
        },

        getGcfsCommodityMidList: function () {
            if (this.gcfsCommodityMidList.length) {
                for (let i = (this.gcfsCommodityMidList.length - 1); i >= 0; i--) {
                    for (let j = (this.selectedData.length - 1); j >= 0; j--) {
                        if (this.gcfsCommodityMidList[i].id === this.selectedData[j].id) {
                            this.selectedData.splice(j, 1);
                        }
                    }
                }
                this.gcfsCommodityMidList = this.gcfsCommodityMidList.concat(this.selectedData);
            } else {
                this.gcfsCommodityMidList = this.selectedData;
            }

        },

        //提交选中的产品
        handleAddProductSubmit: async function () {
            this.getAllLinkedData();
            this.getGcfsCommodityMidList();
            this.getSelectedId();

            if(!this.gcfsCommodityMidList[0]){
                this.$message.error('请点击选择产品');
                return false;
            }

            if(this.currentRouter === this.addUrlHash || this.currentRouter === this.updateUrlHash){
                this.addProductVisible = false;
            }
        },

        //table列表某一行被选中
        handleSelectChange: function (selected) {
            this.selectedData = selected;
        },

        //编辑某一行是否可以被勾选
        checkboxInit(row, index) {
            let data = true;
            if (this.gcfsCommodityMidList.length) {
                this.gcfsCommodityMidList.forEach(v => {
                    if (row.id === v.id) {
                        data = false;
                        return;
                    }
                });
            }
            return data;
        },

        //点input的icon 搜索
        handleSearchIconClick: function () {
            this.getAllLinkedData();
        },

        //获取搜索的所有data
        getAllLinkedData: async function () {
            var prams = {};

            for (let i = 0; i < this.selectItem.length; i++) {
                if (this.iconSelectData === this.selectItem[i].value) {
                    prams[this.selectItem[i].name] = this.iconSearchData;
                }
            }

            var searchDataRes = await this.ctx.models.billing.listNoLinked(prams);
            this.allLinkedData = searchDataRes.data;


            //已选中的，设置选中状态
            if (this.gcfsCommodityMidList.length && this.allLinkedData && this.allLinkedData.length) {
                this.allLinkedData.forEach((v) => {
                    this.gcfsCommodityMidList.forEach(row => {
                        if (v.id === row.id) {
                            this.$nextTick(() => {
                                this.$refs.tableLinkedData.toggleRowSelection(v, true);
                            });
                        }
                    });
                });
            }
        },

        //获取到关联产品所有的id
        getSelectedId: async function () {
            this.selectedIds = [];
            this.gcfsCommodityMidList.forEach(item => {
                this.selectedIds.push({id: item.id});
            });
            this.form.gcfsCommodityList = this.selectedIds;

            if(!this.form.gcfsCommodityList[0]){
                this.gcfsCommodityListErrorVisiable = true;
                return false;
            }else{
                this.gcfsCommodityListErrorVisiable = false;
            }
        },
        /*
        * 上面是添加产品及搜索
         */


        //直接提审添加的关联产品
        handleSaveLinked: async function () {
            await this.handleAddProductSubmit();

            const ids = [];
            this.selectedData.forEach(item => {
                ids.push(item.id);
            });


            if (this.currentRouter === this.detailUrlHash) {
                this.saveProductData.billingCompanyId = this.$route.query['id'];
            } else if (this.currentRouter === this.listUrlHash) {
                this.saveProductData.billingCompanyId = this.dialogId;
            }
            this.saveProductData.commodityId = ids;

            var saveLinkedRes = await this.ctx.models.billing.saveLinked(this.saveProductData);
            if (saveLinkedRes.statusCode == '2000000') {
                this.addProductVisible = false;
                if (this.currentRouter === this.listUrlHash) {
                    this.$refs.pageTmpl.refreshData();
                } else {
                    this.jumpList();
                }
            } else if (saveLinkedRes.statusCode == '2070019') {
                this.$message.error('请勾选您要提审的产品');
            }

        }

    }
}
export default commonMixin;