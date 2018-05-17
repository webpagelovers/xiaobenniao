export const data = {
    data:{
        statusCode:2000000
    },
    searchSet:{
        simpleSearch: [{
            'value': 'commodityCode',
            'label': '收件人',
            'placeholder': '请输入收件人搜索'
        }],
        comboSearch: [
            {
                key: 'commodityCode',
                label: '关键字',
                line: true,
                placeholder: '',
                type: 'input'
            },
            {
                key: 'merchantSku',
                label: '收件人',
                line: true,
                placeholder: '',
                type: 'input'
            },
            {
                key: 'title',
                label: '发件人',
                line: true,
                placeholder: '',
                type: 'input'
            },
            {
                key: 'startStation1',
                line: true,       // line:true指定一项占用一行
                label: '附件',
                options: [
                    {
                        'label': '不限',
                        'value': '2'
                    },
                    {
                        'label': '有',
                        'value': '1'
                    },
                    {
                        'label': '无',
                        'value': '0'
                    }
                ],
                type: 'select' //下拉选项
            },
            {
                'key': 'sendTimeLimit',
                'label': '时间',
                'type': 'timequery' //时间范围
            }
        ],
    },
    markList:[
        {label:'已读',value:'2'},
        {label:'未读',value:'1'}
    ],
    // -> inboxList 收件箱
    // -> outboxList 发件箱
    // -> draftList 草稿箱
    // -> dustbinList 垃圾箱
    // -> deletedList 已删除
    mailList:[
        {label:'inboxList',value:'1'},
        {label:'outboxList',value:'2'},
        {label:'draftList',value:'3'},
        {label:'dustbinList',value:'5'},
        {label:'deletedList',value:'4'}
    ],
};