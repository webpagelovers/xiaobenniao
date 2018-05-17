let dictionaryData = null;

const commonMixin = {
    data() {
        this.ctx.dictionaryData = dictionaryData;
        return {
            //审核通过
            auditPassData: {},
            dialogPassVisible: false,
            billingCompanyStatusVisible: false,
            //驳回
            dialogRejectVisible: false,
            rejectCommodityData: {},
            rejectCommodityVisible: false,
            //函调
            dialogLetterVisible: false,
            letterData: {
                letterStatus:null
            },
            letterDisabled: true,
            letterDataOptions:[
                {id:2,name:'待发函'},
                {id:3,name:'待回函'},
                {id:4,name:'转审核'},
                {id:5,name:'已完成'}
            ],
            letterRemainder:0,
            remainder:0,
            //升级
            dialogIncreaseVisible: false,
            increaseData: {},
            //管理合同
            dialogContractVisible: false,
            addContractVisible: false,
            contractNumberErrorVisible: false,
            addContract: {},
            contractList: [],

            /*以下是公共部分*/
            currentRouter: this.$route.path,
            listUrlHash: '/billing/list',
            detailUrlHash: '/billing/detail',
            addUrlHash: '/billing/add',
            updateUrlHash: '/billing/update',
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

        //审核通过
        handlePassButtonClick: async function (id) {
            this.dialogPassVisible = true;
            if (id) {
                this.dialogId = id;
            }
            this.billingCompanyStatusVisible = false;
            this.auditPassData = {};
        },

        handleAuditPass: async function () {

            if (this.currentRouter === this.listUrlHash) {
                this.auditPassData.id = this.dialogId;
            } else {
                this.auditPassData.id = this.id;
            }

            if (!this.auditPassData.billingCompanyStatus) {
                this.billingCompanyStatusVisible = true;
                return false;
            } else {
                this.billingCompanyStatusVisible = false;
            }

            await this.ctx.models.billing.auditPass(this.auditPassData);
            this.dialogPassVisible = false;

            if (this.currentRouter === this.listUrlHash) {
                this.$refs.pageTmpl.refreshData();
            } else {
                this.form.billingCompanyStatus = parseInt(this.auditPassData.billingCompanyStatus);
            }
        },


        //驳回
        handleRejectButtonClick: async function () {
            this.dialogRejectVisible = true;
            this.rejectCommodityData = {};
        },

        handleRejChange:function(){
            this.remainder = this.rejectCommodityData.rejectedReason.length;
        },

        handleRejectSubmit: async function () {

            this.rejectCommodityData.id = this.id;
            this.rejectCommodityData.updateUserName = this.form.lastUpdateUser;
            this.rejectCommodityVisible = false;

            const res = await this.ctx.models.billing.rejectCommodity(this.rejectCommodityData);

            if (res.statusCode === '2070420') {
                this.$notify.error({
                    title: '',
                    message: '商品不是审核中状态，提交审核失败！'
                });
            }else if(res.statusCode === '2000000'){
                this.$router.go(0);
            }
            this.dialogRejectVisible = false;


        },

        //监听函调change
        handleLetterChange: function (letterStatus) {

            if (!this.letterData.letterStatus || this.letterData.letterStatus === 1) {
                this.letterDisabled = true;
            } else {
                this.letterDisabled = false;
            }
        },

        handleLetChange:function(){
            this.letterRemainder = this.letterData.letterContent.length;
        },

        //函调
        handleLetterButtonClick: async function (row) {


            if (row.id) {
                this.dialogId = row.id;
                this.letterData.letterStatus = row.letterStatus;
            }else{
                this.letterData.letterStatus = this.form.letterStatus;
            }

            if(!this.letterData.letterStatus || this.letterData.letterStatus === 1){
                this.letterDisabled = true;
            }else{
                this.letterDisabled = false;
            }

            this.dialogLetterVisible = true;
        },


        handleLetterSubmit: async function () {
            this.dialogLetterVisible = false;
            if (this.currentRouter === this.listUrlHash) {
                this.letterData.id = this.dialogId;
                await this.ctx.models.billing.letter(this.letterData);
                this.$refs.pageTmpl.refreshData();
            } else {
                this.letterData.id = this.id;
                await this.ctx.models.billing.letter(this.letterData);
                const res = await this.ctx.models.billing.getInfo(this.letterData.id);
                this.form.letterStatus = res.data.letterStatus;
                this.form.letterContent = res.data.letterContent;
            }

        },

        //升级
        handleIncreaseButtonClick: function (id) {
            this.dialogIncreaseVisible = true;
            if (id) {
                this.dialogId = id;
            }
        },
        handleIncreaseSubmit: async function () {
            if (this.currentRouter === this.listUrlHash) {
                this.increaseData.id = this.dialogId;
            } else {
                this.increaseData.id = this.id;
            }

            await this.ctx.models.billing.increase(this.increaseData);
            this.dialogIncreaseVisible = false;

            if (this.currentRouter === this.listUrlHash) {
                this.$refs.pageTmpl.refreshData();
            }else{
                this.$router.go(0);
            }

        },

        //合同
        handleContractButtonClick: function () {
            this.addContractVisible = true;
            this.contractNumberErrorVisible = false;
        },

        handleContractClick: async function (id) {
            try {

                this.dialogContractVisible = true;
                this.addContractVisible = false;

                if (this.currentRouter === this.listUrlHash) {
                    this.dialogId = id;
                    const res = await this.ctx.models.billing.getContractListByPage({billingCompanyId: this.dialogId});
                    if (res.statusCode === '2000000') {
                        this.contractList = res.data;
                        this.addContract = {};
                        this.$refs.pageTmpl.refreshData();
                    }
                } else {
                    const res = await this.ctx.models.billing.getContractListByPage({billingCompanyId: this.id});
                    if (res.statusCode === '2000000') {
                        this.contractList = res.data;
                        this.addContract = {};
                    }
                }



            } catch (err) {


            }
        },


        //添加合同
        handleAddContractSubmit: async function () {
            if (this.currentRouter === this.listUrlHash) {
                this.addContract.billingCompanyId = this.dialogId;
            } else {
                this.addContract.billingCompanyId = this.id;
            }

            if (!this.addContract.contractNumber) {
                this.contractNumberErrorVisible = true;
                return false;
            } else {
                this.contractNumberErrorVisible = false;
            }
            const res = await this.ctx.models.billing.addContract(this.addContract);
            if (res.statusCode === '2000000') {
                this.addContractVisible = false;
                this.contractNumberErrorVisible = false;
                this.addContract = {};

                if (this.currentRouter === this.listUrlHash) {
                    const result = await this.ctx.models.billing.getContractListByPage({billingCompanyId: this.dialogId});
                    if (result.statusCode === '2000000') {
                        this.contractList = result.data;
                    }
                } else {
                    const result = await this.ctx.models.billing.getContractListByPage({billingCompanyId: this.id});
                    if (result.statusCode === '2000000') {
                        this.contractList = result.data;
                    }
                }

            }


        },

        handleAddContractChange: function () {
            if (!this.addContract.contractNumber) {
                this.contractNumberErrorVisible = true;
            } else {
                this.contractNumberErrorVisible = false;
            }
        },

        handleEditContractChange: function (row) {
            if (row.contractNumber) {
                this.$set(row, 'saveButtonVisible', false);
            } else {
                this.$set(row, 'saveButtonVisible', true);
            }
        },

        //取消保存合同
        handleCallOffClick: function () {
            this.addContractVisible = false;
            this.contractNumberErrorVisible = false;
            this.addContract = {};
        },

        //删除合同
        handleDeleteContract: async function (id) {
            // (this.currentRouter === this.listUrlHash) {}else{}
            const res = await this.ctx.models.billing.deleteContract({id: id});
            if (res.statusCode === '2000000') {
                if (this.currentRouter === this.listUrlHash) {
                    const result = await this.ctx.models.billing.getContractListByPage({billingCompanyId: this.dialogId});
                    if (result.statusCode === '2000000') {
                        this.contractList = result.data;
                    }
                } else {
                    const result = await this.ctx.models.billing.getContractListByPage({billingCompanyId: this.id});
                    if (result.statusCode === '2000000') {
                        this.contractList = result.data;
                    }
                }

            }
        },

        //编辑合同内容
        handleEdit: function (index, row) {
            this.$set(row, 'oldContractNumber', row.contractNumber);
            this.$set(row, 'showEdit', true);
        },

        //保存编辑的内容
        handleSave: async function (index, row) {
            if (row.contractNumber === '') {
                return false;
            } else {
                const res = await this.ctx.models.billing.updateContract(row);
                if (res.statusCode == '2000000') {
                    this.$set(row, 'showEdit', false);
                    this.handleCallOffClick();
                }
            }
        },

        //取消编辑
        handleCancEdit: function (row) {
            this.$set(row, 'showEdit', false);
            this.$set(row, 'contractNumber', row.oldContractNumber);
        },

        handleIconClick: function (row, item) {
            const This = this;
            return function () {
                This.$set(row, item, '');
                if (row.contractNumber) {
                    this.$set(row, 'saveButtonVisible', false);
                } else {
                    this.$set(row, 'saveButtonVisible', true);
                }
            };
        },

    }

};

export default commonMixin;