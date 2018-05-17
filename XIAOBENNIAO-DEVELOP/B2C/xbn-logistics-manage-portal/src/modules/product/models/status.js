import Enum from './enum.js';

//产品状态
const commodityStatus = new Enum({
    unAudit: {
        value: 1,
        label: '待审核'
    },
    supplyInformation: {
        value: 2,
        label: '待补充资料'
    },
    auditSuccess: {
        value: 3,
        label: '审核通过'
    },
    auditFailed: {
        value: 4,
        label: '已驳回',
        dds:''
    }
});


export {
    Enum,
    commodityStatus
};