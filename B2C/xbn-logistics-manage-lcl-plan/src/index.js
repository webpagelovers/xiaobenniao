import {List, Add, Detail, Assign} from './pages/page';
import * as lclplan from './models/lclplan';
import errors from './models/error-code';


const routes = [{
    path: '/lcl-plan/list',
    component: List
}, {
    path: '/lcl-plan/add',
    component: Add
}, {
    path: '/lcl-plan/update',
    component: Add
}, {
    path: '/lcl-plan/detail',
    component: Detail
}, {
    path: '/lcl-plan/assign',
    component: Assign
}];

export default {
    routes,
    errors,
    models: [lclplan]
};