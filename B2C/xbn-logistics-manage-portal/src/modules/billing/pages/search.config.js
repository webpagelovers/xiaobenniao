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
                'value': 'cfUserName',
                'label': '用户名',
                'placeholder':'用户名'
            },{
                'value': 'billingCompanyName',
                'label': '开票厂商',
                'placeholder':'开票厂商'
            },{
                'value': 'uniformSocialCreditCode',
                'label': '统一社会信用代码',
                'placeholder':'统一社会信用代码'
            }],
            //因为以下2个配置数据需要从服务器获取，为此需要组件初始化后再进行动态调用
            comboSearch: [{
                key: 'cfUserName',
                label: '用户名',
                line:true,
                type: 'input'
            }, {
                key: 'billingCompanyName',
                label: '开票厂商',
                line:true,
                type: 'input'
            }, {
                key: 'uniformSocialCreditCode',
                label: '统一社会信用代码',
                line:true,
                type: 'input'
            }],
            quickFilter: [{
                key: 'billingCompanyStatus',
                label: '全部状态',
                options: this.ctx.dictionaryData.billingCompanyStatus,
                size:'medium'
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
        nt.models.billing.getGcfsDictionary().then(function(result) {
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