import {List, Add, Detail} from './pages/page';
import * as costitem from './models/costitem';
import errors from './models/error-code';


const routes = [{
    path: '/costitem/list',
    component: List
}, {
    path: '/costitem/add',
    component: Add
}, {
    path: '/costitem/update',
    component: Add
}, {
    path: '/costitem/detail',
    component: Detail
}];

export default {
    routes,
    errors,
    models: [costitem]
};