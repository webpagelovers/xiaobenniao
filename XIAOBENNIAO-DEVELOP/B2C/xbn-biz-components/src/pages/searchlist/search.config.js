import TemplateSearchList from '../../components/pagelist/searchlist.vue';

const combo = [{       //普通文本
    'key': 'competitionTitle',
    'line': true,
    'label': '竞品标题',
    'type': 'input'
}, {       //普通文本并限制最大输入长度
    'key': 'maxCode',
    'label': '最大代码',
    'maxlength': 10,
    'type': 'input'
}, {                //下拉选项 如果options数据需要从服务器获取，需要vue组件route之前就得到
    'key': 'startStation',
    'label': '始发站',
    'options': [{
        'label': '北京',
        'value': '12'
    },{
        'label': '广州',
        'value': '11'
    }],
    'type': 'select'
}, {                    //下拉选项
    'key': 'startStation1',
    'line': true,		// line:true指定一项占用一行
    'label': '始发站',
    'options': [{
        'label': '北京',
        'value': '12'
    },{
        'label': '广州',
        'value': '11'
    }],
    'type': 'select'
}, {                    //时间范围
    'key': 'sendTimeLimit',
    'label': '截止下单日期',
    'type': 'timequery'
}, {				  //数字范围
    'key': 'competitionPrice',
    'label': '竞品价格',
    'type': 'numberquery'
}];

const pageSearchMixin = {
    components: {
        TemplateSearchList
    },
    data() {
        return {
            'simpleSearch': [{
                'value': 'logisticsCode',
                'label': '物流编码',
                'placeholder': '请输入物流编码搜索'
            }, {
                'value': 'competitionTitle',
                'label': '竞品标题',
                'placeholder': '请输入终点站搜索'
            }],
            'comboSearch': combo,
            'quickFilter': [{
                'key': 'logisticsType',
                'label': '物流方式',
                'size': 'xx-large',
                'options': [{'id': 1, 'logisticsType': '海运', 'value': 1, 'label': '海运'}, {
                    'id': 2,
                    'logisticsType': '空运',
                    'value': 2,
                    'label': '空运'
                }]
            }, {
                'key': 'disposalSite',
                'label': '处理地点',
                'options': [{'id': 2, 'siteName': '上海', 'value': 2, 'label': '上海'}, {
                    'id': 1,
                    'siteName': '天津',
                    'value': 1,
                    'label': '天津'
                }, {'id': 4, 'siteName': '广州', 'value': 4, 'label': '广州'}, {
                    'id': 3,
                    'siteName': '深圳',
                    'value': 3,
                    'label': '深圳'
                }]
            }]
        };
    },

    created: function() {
        const that = this;
        setTimeout(function() {
            that.comboSearch.push({
                'key': 'addTime',
                'label': '添加竞品时间',
                'type': 'timequery'
            });

            that.quickFilter.push({
                'key': 'targetPort',
                'label': '目的港口',
                'options': [{
                    'id': '7',
                    'name': '俄罗斯-圣彼得堡港',
                    'addr': 'Russia',
                    'note': null,
                    'countryId': 6,
                    'country': null,
                    'abbreviation': null,
                    'value': '7',
                    'label': '俄罗斯-圣彼得堡港'
                }, {
                    'id': '3',
                    'name': '南安普顿港',
                    'addr': 'England',
                    'note': null,
                    'countryId': 2,
                    'country': null,
                    'abbreviation': null,
                    'value': '3',
                    'label': '南安普顿港'
                }]
            });
        }, 200);
    },

    beforeCreate: async function () {

    },
};

export default pageSearchMixin;