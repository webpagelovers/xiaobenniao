const routes = [{ 	
	path: '/user-manage/',
	component: () => import('./pages/list.vue')
}, { 	
	path: '/user-manage/:id/',
	component: () => import('./pages/detail.vue')
}, { 	
	path: '/user-manage/:id/edit',
	component: () => import('./pages/form.vue')
}]

export default {
	routes
}