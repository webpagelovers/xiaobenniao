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
                'value': 'planCode',
                'label': '拼箱计划编号',
                'placeholder':'拼箱计划编号'
            },{
                'value': 'containerCode',
                'label': '货柜编号',
                'placeholder':'货柜编号'
            },],
            //因为以下2个配置数据需要从服务器获取，为此需要组件初始化后再进行动态调用
            comboSearch: [{
                key: 'planCode',
                label: '拼箱计划编号',
                type: 'input'
            }, {
                key: 'containerCode',
                label: '货柜编号',
                type: 'input'
            }],
            quickFilter: [{
                key: 'source',
                label: '请选择来源',
                options: this.ctx.dictionaryData.source,
                size:'medium'
            },{
                key: 'status',
                label: '请选择状态',
                options: this.ctx.dictionaryData.status,
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
        nt.models.lclplan.getGcfsDictionary().then(function(result) {
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