import {List, Add, Detail} from './pages/page';
import * as supplier from './models/supplier';
import errors from './models/error-code';


const routes = [{
    path: '/supplier/list',
    component: List
}, {
    path: '/supplier/add',
    component: Add
}, {
    path: '/supplier/update',
    component: Add
}, {
    path: '/supplier/detail',
    component: Detail
}];

export default {
    routes,
    errors,
    models: [supplier]
};