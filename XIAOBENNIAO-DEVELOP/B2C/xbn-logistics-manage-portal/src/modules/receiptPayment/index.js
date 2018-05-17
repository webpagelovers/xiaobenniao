const routes = [{ 	
	path: '/receipt-payment/receipt',
	component: () => import('./pages/receiptList.vue')
}, { 	
	path: '/receipt-payment/payment',
	component: () => import('./pages/paymentList.vue')
}, /*{
	path: '/receipt-payment/form',
	component: () => import('./pages/form.vue')
}, {
	path: '/receipt-payment/form/:id',
	component: () => import('./pages/form.vue')
}, */{
	path: '/receipt-payment/receipt/:id',
	component: () => import('./components/detail.vue')
}, {
	path: '/receipt-payment/payment/:id',
	component: () => import('./components/detail.vue')
}, {
	path: '/receipt-payment/fee',
	component: () => import('./pages/feeList.vue')
}, {
	path: '/receipt-payment/fee/:id',
	component: () => import('./pages/feeDetail.vue')
}, {
	path: '/receipt-payment/supplier',
	component: () => import('./pages/supplierList.vue')
}, {
	path: '/receipt-payment/supplier/:id',
	component: () => import('./pages/supplierDetail.vue')
}]

import './index.less'

export default {
	routes
}