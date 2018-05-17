import {List, changeCusDecOrder, Detail} from './pages/page';
import * as cusDecOrder from './models/models';
import errors from './models/error-code';


const routes = [{
    path: '/cusDecOrder/list',
    component: List
}, {
    path: '/cusDecOrder/changeCusDecOrder',
    component: changeCusDecOrder
}, {
    path: '/cusDecOrder/detail/:id',
    component: Detail
}];

export default {
    routes,
    errors,
    models: [cusDecOrder]
};