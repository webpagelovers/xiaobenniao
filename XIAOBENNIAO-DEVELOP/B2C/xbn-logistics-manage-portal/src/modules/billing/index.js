import {List, Add, Detail} from './pages/page';
import * as billing from './models/billing';
import errors from './models/error-code';


const routes = [{
    path: '/billing/list',
    component: List
}, {
    path: '/billing/add',
    component: Add
}, {
    path: '/billing/update',
    component: Add
}, {
    path: '/billing/detail',
    component: Detail
}];

export default {
    routes,
    errors,
    models: [billing]
};