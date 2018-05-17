import Enum from './enum.js';

//处理状态
const handleStatus = new Enum({
    unOrder: {
        value: 1,
        label: '未生成报关订单'
    },
    partOrder: {
        value: 2,
        label: '部分生成报关订单'
    },
    allOrder: {
        value: 3,
        label: '全部生成报关订单'
    },
    partDeclare: {
        value: 4,
        label: '部分报关'
    },
    declareFinished: {
        value: 5,
        label: '报关完成'
    },
    clearFinished: {
        value: 6,
        label: '清关完成'
    }
});

// simpleQuery
let simpleQuery = [
    {
        'value': 'packPlanCode',
        'label': '装箱计划编码',
        'placeholder': '请输入装箱计划编码'
    },
    {
        'value': 'masterWaybillCode',
        'label': '主提运单号',
        'placeholder': '请输入主提运单号'
    }
]

let comboQuery = [
    {
        'key': 'packPlanCode',
        'line': true,
        'label': '装箱计划编码',
        'type': 'input'
    },
    {
        key: 'createTime',
        label: '创建时间',
        type: 'timequery'
    },
    {
        key: 'shipPeriod',
        label: '船期',
        type: 'timequery'
    },
    {
        'key': 'startPort',
        'line': true,
        'label': '起运港',
        'type': 'input'
    },
    {
        'key': 'destintionPort',
        'line': true,
        'label': '目的港',
        'type': 'input'
    },
    {                //下拉选项 如果options数据需要从服务器获取，需要vue组件route之前就得到
        key: 'transportType',
        label: '运输方式',
        line: true,
        options: [],
        type: 'select'
    },
    {                //下拉选项 如果options数据需要从服务器获取，需要vue组件route之前就得到
        key: 'state',
        label: '处理状态',
        line: true,
        options: [],
        type: 'select'
    },
    {
        'key': 'masterWaybillCode',
        'line': true,
        'label': '主提运单号',
        'type': 'input'
    },
    {
        'key': 'customOrderCodes',
        'line': true,
        'label': '报关订单',
        'type': 'input'
    }
]

// quickFilter
let quickFilter = [
    {
        'key': 'state',
        'label': '处理状态',
        'options': [
            //{'value': '', 'label': '审核状态' }
        ].concat(handleStatus.array())
    }
]

// 运输方式
let transportWay = new Enum({
    sea:{
        value: 1,
        label: "海运"
    },
    air:{
        value: 2,
        label: "空运"
    }
})

// 是否
let isOrNot = [
    {'value': '1', 'label': '全部' },
    {'value': '2', 'label': '是' },
    {'value': '3', 'label': '否' }
]
export {
    Enum,
    isOrNot,
    handleStatus,
    simpleQuery,
    comboQuery,
    quickFilter,
    transportWay
};