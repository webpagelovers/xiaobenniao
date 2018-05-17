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
                'value': 'logisticsCode',
                'label': '物流编码',
                'placeholder': '物流编码'
            }],
            //因为以下2个配置数据需要从服务器获取，为此需要组件初始化后再进行动态调用
            comboSearch: [{
                key: 'logisticsCode',
                label: '物流编码',
                type: 'input'
            }, /*{
                key: 'logisticsType',
                label: '物流方式',
                options: this.ctx.dictionaryData.logisticsType,
                type: 'select'
            }, {
                key: 'disposalSite',
                label: '处理地点',
                options: this.ctx.dictionaryData.disposalSite,
                type: 'select'
            }, {
                key: 'targetPort',
                label: '目的港口',
                options: this.ctx.dictionaryData.targetPort,
                type: 'select'
            }, */ {
                key: 'startStation',
                label: '始发站',
                options: [{startStation: 'CH', label: 'CH', value: 'CH'}],
                type: 'select'
            }, {
                key: 'lastStation',
                label: '终点站',
                options: this.ctx.dictionaryData.lastStation,
                type: 'select'
            }, {
                key: 'sendTimeLimit',
                label: '截止下单日期',
                type: 'timequery'
            }, {
                key: 'receiveTimeLimit',
                label: '截止收货日期',
                type: 'timequery'
            }, {
                key: 'cutTheTime',
                label: '资料提交截止时间',
                type: 'timequery'
            }, {
                key: 'expectedArrivalDate',
                label: '预计到港日期',
                type: 'timequery'
            }],
            quickFilter: [{
                key: 'logisticsType',
                label: '物流方式',
                options: this.ctx.dictionaryData.logisticsType,
                size: 'small'
            }, {
                key: 'disposalSite',
                label: '起运港',
                options: this.ctx.dictionaryData.disposalSite,
                size: 'small'
            }, {
                key: 'targetPort',
                label: '目的港口',
                options: this.ctx.dictionaryData.targetPort,
                size: 'x-large'
            }]
        };
    },

    beforeCreate: async function () {

    },

    /**
     * 这里采用的是 vue-router关于数据获取的第1中方法
     *
     * https://router.vuejs.org/zh-cn/advanced/data-fetching.html
     * 导航完成之后获取：先完成导航，然后在接下来的组件生命周期钩子中获取数据。在数据获取期间显示『加载中』之类的指示。
     *
     */
    created() {
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
        nt.models.plans.getGcfsDictionary().then(function (result) {
            dictionaryData = result; //TODO 为路由增加数据绑定
            next(($vm) => {
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