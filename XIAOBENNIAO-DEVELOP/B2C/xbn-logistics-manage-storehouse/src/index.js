import {StoreList, AddStore, StoreDetail } from './pages/page';
import * as store from './models/store';
import errors from './models/error-code';


const routes = [{
    path: '/storehouse/list',
    component: StoreList
},{
    path: '/storehouse/add',
    component: AddStore
},{
    path: '/storehouse/update',
    component: AddStore
},{
    path: '/storehouse/detail',
    component: StoreDetail
}];

export default {
    routes,
    errors,
    models: [store]
};