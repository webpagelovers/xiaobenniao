//import TemplateSearchList from '../../components/searchlist.vue';
import {TemplateSearchList} from 'xbn-biz-components';
import {nt} from 'nt-framework';

let dictionaryData = null;

const pageSearchMixin = {
    components: {
        TemplateSearchList
    },
    data() {
        this.ctx.dictionaryData = dictionaryData;
        return {
            simpleSearch: [{
                'value': 'storeName',
                'label': '仓库名称',
                'placeholder': '仓库名称'
            }],
            //因为以下2个配置数据需要从服务器获取，为此需要组件初始化后再进行动态调用
            comboSearch: [{
                key: 'storeLogisCompanies',
                label: '仓库编码',
                type: 'input'
            }, {
                key: 'storeName',
                label: '仓库名称',
                type: 'input'
            }, {
                key: 'address',
                label: '仓库地址',
                type: 'input'
            }, {
                key: 'consignee',
                label: '仓库收货人',
                type: 'input'
            }, {
                key: 'phonenumber',
                label: '联系电话',
                type: 'input'
            }, {
                key: 'componyName',
                label: '公司名称',
                type: 'input'
            }],
            quickFilter: [{
                key: 'storeType',
                label: '仓库类型',
                options: this.ctx.dictionaryData.storeType,
            },{
                key: 'countryCurrencyId',
                label: '全部国家',
                options: this.ctx.dictionaryData.country,
            }]
        };
    },

    beforeCreate: async function() {

    },

    /**
     * 这里采用的是 vue-router关于数据获取的第1中方法
     *
     * https://router.vuejs.org/zh-cn/advanced/data-fetching.html
     * 导航完成之后获取：先完成导航，然后在接下来的组件生命周期钩子中获取数据。在数据获取期间显示『加载中』之类的指示。
     *
     */
    created () {
        // 组件创建完后获取数据，
        // 此时 data 已经被 observed 了
        //this.fetchSearchDicData();
        /*this.comboSearch = [{
            key: 'logisticsCode',
            label: '物流编码',
            type: 'input'
        }];

        this.quickFilter = [{
            key: 'logisticsCode',
            label: '物流编码',
            type: 'input'
        }];*/
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        //'$route': 'fetchSearchDicData'
    },

    beforeRouteEnter(to, from, next) {
        nt.models.store.getGcfsDictionary().then(function(result) {
            dictionaryData = result; //TODO 为路由增加数据绑定
            next( ($vm)=> {
                //这里的代码会在vm初始化后完成，即 data()方法先于此处执行
            });
        });

    },

    methods: {
        async fetchSearchDicData() {

        }
    }

};

export default pageSearchMixin;