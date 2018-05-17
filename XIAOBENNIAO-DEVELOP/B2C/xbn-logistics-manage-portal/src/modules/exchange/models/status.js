var _get = function (status) {
    var array = this._array();
    for (var i = 0; i < array.length; i++) {
        if (array[i].value == status) {
            return array[i];
        }
    }
    return {
        value: -1,
        label: '无效的状态'
    }
};
var _array = function () {
    var array = [];
    for (var key in this) {
        if(key !='_get' && key!='_array'){
            array.push(this[key])
        }
    }
    return array;
};
/**
 * 审核状态
 */
var auditStatus = {
    'waitConfirm': {
        value: 1,
        label: '待确认'
    },
    'confirm': {
        value: 2,
        label: '已确认'
    },
    'reject': {
        value: 3,
        label: '已驳回'
    }
}
//获取某状态
auditStatus._get = _get;
//获取数组形式
auditStatus._array = _array;



/**
 * 关联订单状态
 */
const orderLinkStatus = {
    'notLink': {
        value: 1,
        label: '未关联'
    },
    'partLink': {
        value: 2,
        label: '部分关联'
    },
    'allLink': {
        value: 3,
        label: '已关联'
    }
}
//获取某状态
orderLinkStatus._get = _get;
//获取数组形式
orderLinkStatus._array = _array;

/**
 * 结汇状态
 */
const settleStatus = {
    'notSettlement': {
        value: 1,
        label: '未结汇'
    },
    'settleing': {
        value: 2,
        label: '结汇中'
    },
    'settlementSuccess': {
        value: 3,
        label: '已结汇'
    }
}
//获取某状态
settleStatus._get = _get;
//获取数组形式
settleStatus._array = _array;

// 结汇方式
const settleModelStatus = {
    'zizhu': {
        value: 1,
        label: '自主结汇'
    },
    'jiqi': {
        value: 2,
        label: '即期结汇'
    }
}
settleModelStatus._get = _get;
settleModelStatus._array = _array;

/**
 * 订单类型
 */
const settleOrderTypeStatus = {
    'waizongfu': {
        value: 1,
        label: '外综服'
    },
    'ziying': {
        value: 2,
        label: '自营出口'
    },
    'hunhe': {
        value: 3,
        label: '混合'
    }
}
settleOrderTypeStatus._get = _get;
settleOrderTypeStatus._array = _array;


//订单状态
const exchangeStatus = {
    'wait': {
        value: 1,
        label: '待收齐'
    },
    'complete': {
        value: 2,
        label: '已收齐'
    }
}
exchangeStatus._get = _get;
exchangeStatus._array = _array;

//报关口岸
const customsPort = {
    'shenzhen': {
        value: 1,
        label: '深圳'
    },
    'ningbo': {
        value: 2,
        label: '宁波'
    },
    'shanghai': {
        value: 3,
        label: '上海'
    },
    'guangzhou': {
        value: 4,
        label: '广州'
    },
}
customsPort._get = _get;
customsPort._array = _array;

export {
    auditStatus,
    settleStatus,
    orderLinkStatus,
    settleModelStatus,
    settleOrderTypeStatus,
    exchangeStatus,
    customsPort
};