import mangePlan from 'xbn-logistics-manage-plan';
import settled from 'xbn-logistics-manage-user';
import product from './modules/product/index.js';
import storehouse from 'xbn-logistics-manage-storehouse';
import country from 'xbn-logistics-manage-country';
import finance from 'xbn-logistics-manage-finance';
import port from 'xbn-logistics-manage-port';
import forcast from 'xbn-logistics-manage-forecast';
import company from 'xbn-logistics-manage-company';//物流公司
import common from 'xbn-biz-common';
import billingCompany from './modules/billing/index.js';
import supplier from './modules/supplier/index.js';
import costitem from './modules/costitem/index.js';
import taxRefundOrder from './modules/taxRefund/index.js';//退税订单
import cfOrder from './modules/cfOrder/index.js';//退税订单

import customOrder from './modules/customsDeclarationOrder/index.js';//报关订单

import encasement from './modules/encasement/index.js';//装箱计划
//import receiptPayment from './modules/receiptPayment/index.js';//应收应付
//import user from './modules/user/index.js';//用户管理

import lcl_plan from 'xbn-logistics-manage-lcl-plan';//退税订单
import exchange from 'xbn-logistics-manage-exchange';//退税订单

import './css/index.less'

export default [
    encasement,
    mangePlan,
    settled,
    product,
    storehouse,
    country,
    finance,
    port,
    forcast,
    company,
    common,
    billingCompany,
    supplier,
    costitem,
    taxRefundOrder,
    //receiptPayment,
    //user,
    cfOrder,
    lcl_plan,
    exchange,
    customOrder
];
