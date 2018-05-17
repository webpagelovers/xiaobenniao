let dictionaryData = null;

const commonMixin = {
    data() {
        this.ctx.dictionaryData = dictionaryData;
        return {
            /*以下是公共部分*/
            currentRouter: location.hash.split('?')[0],
            listUrlHash: '#/lcl-plan/list',
            detailUrlHash: '#/lcl-plan/detail',
            addUrlHash: '#/lcl-plan/add',
            updateUrlHash: '#/lcl-plan/update',
            assignUrlHash: '#/lcl-plan/assign',
            dialogId: null
        };
    },

    methods: {
        //跳到列表页
        jumpList: function () {
            this.$router.push({path: '/lcl-plan/list'});
        },

        //跳到增加页面
        jumpAdd: function () {
            this.$router.push({path: '/lcl-plan/add'});
        },

        //跳到详情页面
        jumpDetail(index, row) {
            this.$router.push({path: '/lcl-plan/detail?id=' + row.id});
        },

        //跳到只指派页面
        jumpApt(index, row) {
            this.$router.push({path: '/lcl-plan/assign?id=' + row.id});
        },

        //跳到修改页面
        jumpUpdate(index, row) {
            this.$router.push({path: '/lcl-plan/update?id=' + row.id});
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

    }

};

export default commonMixin;