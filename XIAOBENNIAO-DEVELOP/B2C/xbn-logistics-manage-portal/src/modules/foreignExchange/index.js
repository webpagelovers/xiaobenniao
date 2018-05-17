const routes = [{ 	
	path: '/finance/foreign-exchange',
	component: () => import('./pages/list.vue')
}, {
	path: '/finance/foreign-exchange/form',
	component: () => import('./pages/form.vue')
}, {
	path: '/finance/foreign-exchange/form/:id',
	component: () => import('./pages/form.vue')
}, {
	path: '/finance/foreign-exchange/:id',
	component: () => import('./pages/detail.vue')
}]

export default {
	routes
}