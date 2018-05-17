import plan from 'xbn-logistics-plan';
import product from 'xbn-logistics-product';
import settled from 'xbn-logistics-user';
import forecast from 'xbn-logistics-forecast';
import finance from 'xbn-logistics-finance';
import message from 'xbn-logistics-message';
import billing from 'xbn-logistics-billing-company';
import common from 'xbn-biz-common';
import tax from 'xbn-logistics-tax-refund-order'
import messageCenter from './modules/index';
import contact from 'xbn-logistics-contact';
import exchange from 'xbn-logistics-exchange';

export default [
    plan,
    product,
    settled,
    forecast,
    finance,
    message,
    common,
    tax,
    messageCenter,
    billing,
    contact,
    exchange
]
