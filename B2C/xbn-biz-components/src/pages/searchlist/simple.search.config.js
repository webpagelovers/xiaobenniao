import TemplateSearchList from '../../components/pagelist/searchlist.vue';

const pageSearchMixin = {
    components: {
        TemplateSearchList
    },
    data() {
        return {
            'simpleSearch1': [{
                'value': 'logisticsCode',
                'label': '物流编码',
                'placeholder': '请输入物流编码搜索'
            }]
        };
    },

    beforeCreate: async function () {

    },
};

export default pageSearchMixin;